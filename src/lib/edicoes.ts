// Overrides do admin. O localStorage guarda só o que mudou em relação ao padrão,
// como um mapa "caminho.do.campo" → valor. Todo acesso ao armazenamento tem try/catch:
// em aba anônima ou com armazenamento bloqueado o site abre com o padrão.

export type Overrides = Record<string, unknown>;

const CHAVE = "luminaimob:edicoes:v1";

type Obj = Record<string, unknown>;

export function lerCaminho(obj: unknown, caminho: string): unknown {
  return caminho.split(".").reduce<unknown>((acc, k) => (acc == null ? undefined : (acc as Obj)[k]), obj);
}

function gravarCaminho(obj: Obj, caminho: string, valor: unknown): void {
  const partes = caminho.split(".");
  let atual: Obj = obj;
  for (let i = 0; i < partes.length - 1; i++) {
    const k = partes[i];
    if (atual[k] == null || typeof atual[k] !== "object") return; // caminho que não existe no padrão: ignora
    atual = atual[k] as Obj;
  }
  const ultimo = partes[partes.length - 1];
  if (!(ultimo in atual)) return;
  atual[ultimo] = structuredClone(valor);
}

/** Aplica os overrides cujo caminho começa com `prefixo` sobre uma cópia do padrão. */
export function aplicar<T>(padrao: T, overrides: Overrides, prefixo = ""): T {
  const copia = structuredClone(padrao) as Obj;
  for (const [caminho, valor] of Object.entries(overrides)) {
    if (prefixo) {
      if (caminho.startsWith(prefixo)) gravarCaminho(copia, caminho.slice(prefixo.length), valor);
    } else if (!caminho.startsWith("admin.")) {
      gravarCaminho(copia, caminho, valor);
    }
  }
  return copia as T;
}

/** Define um valor; se ficou igual ao padrão, remove o override. */
export function definir(overrides: Overrides, caminho: string, valor: unknown, valorPadrao: unknown): Overrides {
  const novo = { ...overrides };
  if (JSON.stringify(valor) === JSON.stringify(valorPadrao)) delete novo[caminho];
  else novo[caminho] = valor;
  return novo;
}

export function carregar(): Overrides {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return {};
    const dados = JSON.parse(bruto);
    return dados && typeof dados === "object" && !Array.isArray(dados) ? (dados as Overrides) : {};
  } catch {
    return {};
  }
}

export function salvar(overrides: Overrides): void {
  try {
    if (Object.keys(overrides).length === 0) window.localStorage.removeItem(CHAVE);
    else window.localStorage.setItem(CHAVE, JSON.stringify(overrides));
  } catch {
    // armazenamento bloqueado: as edições valem só nesta sessão
  }
}

export function exportar(overrides: Overrides): void {
  const data = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `luminaimob-edicoes-${data}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importar(arquivo: File): Promise<Overrides> {
  const texto = await arquivo.text();
  const dados = JSON.parse(texto);
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new Error("O arquivo não tem edições da LuminaImob.");
  }
  return dados as Overrides;
}

// ── Validação (docs/06, ADM7) ──────────────────────────────────────────

export type TipoCampo = "texto" | "textoOpcional" | "dinheiro" | "decimal" | "inteiro" | "duracao" | "percentual";

/** Converte o texto digitado; devolve null se for inválido. */
export function validar(tipo: TipoCampo, bruto: string): string | number | null {
  const t = bruto.trim();
  if (tipo === "texto") return t.length > 0 ? t : null;
  if (tipo === "textoOpcional") return t;
  const limpo = t.replace(/R\$|US\$|%|s$/gi, "").replace(/\s/g, "");
  // aceita "1.300", "1.300,50", "0,6", "0.6"
  const normal = /,/.test(limpo) ? limpo.replace(/\./g, "").replace(",", ".") : /^\d{1,3}(\.\d{3})+$/.test(limpo) ? limpo.replace(/\./g, "") : limpo;
  if (!/^\d+(\.\d+)?$/.test(normal)) return null;
  const n = Number(normal);
  if (!Number.isFinite(n) || n < 0) return null;
  if (tipo === "inteiro") return Number.isInteger(n) && n >= 1 ? n : null;
  if (tipo === "duracao") return Number.isInteger(n) && n >= 5 && n <= 60 ? n : null;
  if (tipo === "percentual") return n <= 100 ? n / 100 : null;
  return n;
}
