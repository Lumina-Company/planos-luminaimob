import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import {
  conteudoPadrao,
  type AcessorioId,
  type CategoriaId,
  type Conteudo,
  type Faixa,
} from "../data/planos";
import type { ParametrosAdmin } from "../data/calculadora-admin";
import { aplicar, carregar, definir, lerCaminho, salvar, type Overrides } from "../lib/edicoes";
import { acessoriosAplicaveis, precoPersonalizado, precoPorVideoPersonalizado, somaAcessorios } from "../lib/preco";

export const PERSONALIZADO = "personalizado";

export interface Selecao {
  categoria: CategoriaId;
  faixaId: string;
}

export type EstadoPersonalizado = Record<CategoriaId, { duracao: number; videos: number }>;

interface Ctx {
  conteudo: Conteudo;
  overrides: Overrides;
  categoria: CategoriaId;
  setCategoria: (c: CategoriaId) => void;
  ligados: AcessorioId[];
  alternarAcessorio: (id: AcessorioId, ligado: boolean) => void;
  selecao: Selecao | null;
  setSelecao: (s: Selecao | null) => void;
  personalizado: EstadoPersonalizado;
  setPersonalizado: (c: CategoriaId, v: { duracao?: number; videos?: number }) => void;
  demo: boolean;
  setDemo: (d: boolean) => void;
  // admin
  admin: boolean;
  setAdmin: (a: boolean) => void;
  adminPadrao: ParametrosAdmin | null;
  parametrosAdmin: ParametrosAdmin | null;
  editar: (caminho: string, valor: unknown) => void;
  substituirOverrides: (o: Overrides) => void;
  desfazer: () => void;
  refazer: () => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
}

const AppCtx = createContext<Ctx | null>(null);

interface EstadoEdicoes {
  overrides: Overrides;
  passado: Overrides[];
  futuro: Overrides[];
}
type AcaoEdicoes =
  | { tipo: "carregar"; overrides: Overrides }
  | { tipo: "definir"; overrides: Overrides }
  | { tipo: "desfazer" }
  | { tipo: "refazer" };

// Desfazer/refazer valem só para a sessão atual (docs/06).
function redutorEdicoes(e: EstadoEdicoes, a: AcaoEdicoes): EstadoEdicoes {
  switch (a.tipo) {
    case "carregar":
      return { overrides: a.overrides, passado: [], futuro: [] };
    case "definir":
      if (JSON.stringify(a.overrides) === JSON.stringify(e.overrides)) return e;
      return { overrides: a.overrides, passado: [...e.passado.slice(-99), e.overrides], futuro: [] };
    case "desfazer":
      if (!e.passado.length) return e;
      return { overrides: e.passado[e.passado.length - 1], passado: e.passado.slice(0, -1), futuro: [e.overrides, ...e.futuro] };
    case "refazer":
      if (!e.futuro.length) return e;
      return { overrides: e.futuro[0], passado: [...e.passado, e.overrides], futuro: e.futuro.slice(1) };
  }
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp fora do AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ed, despachar] = useReducer(redutorEdicoes, { overrides: {}, passado: [], futuro: [] });
  const overrides = ed.overrides;
  const [categoria, setCategoria] = useState<CategoriaId>("pro");
  const [ligados, setLigados] = useState<AcessorioId[]>([]);
  const [selecao, setSelecao] = useState<Selecao | null>(null);
  const [demo, setDemo] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [adminPadrao, setAdminPadrao] = useState<ParametrosAdmin | null>(null);
  const carregou = useRef(false);

  const conteudo = useMemo(() => aplicar(conteudoPadrao, overrides), [overrides]);
  const [personalizado, setPersonalizadoState] = useState<EstadoPersonalizado>(() => ({
    essencial: { duracao: conteudoPadrao.limites.duracaoInicial, videos: conteudoPadrao.limites.videosIniciais },
    pro: { duracao: conteudoPadrao.limites.duracaoInicial, videos: conteudoPadrao.limites.videosIniciais },
  }));

  // Edições salvas entram depois da hidratação (o HTML estático sai sempre com o padrão).
  useEffect(() => {
    despachar({ tipo: "carregar", overrides: carregar() });
    carregou.current = true;
  }, []);

  useEffect(() => {
    if (carregou.current) salvar(overrides);
  }, [overrides]);

  // Parâmetros internos só entram no navegador quando o admin liga.
  useEffect(() => {
    if (admin && !adminPadrao) {
      import("../data/calculadora-admin").then((m) => setAdminPadrao(m.parametrosAdminPadrao));
    }
  }, [admin, adminPadrao]);

  const parametrosAdmin = useMemo(
    () => (adminPadrao ? aplicar(adminPadrao, overrides, "admin.") : null),
    [adminPadrao, overrides],
  );

  // Se um limite do slider mudar no admin, mantém o personalizado dentro dele.
  const { duracaoMin, duracaoMax, videosMin, videosMax } = conteudo.limites;
  useEffect(() => {
    const prender = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
    setPersonalizadoState((p) => ({
      essencial: {
        duracao: prender(p.essencial.duracao, duracaoMin, duracaoMax),
        videos: prender(p.essencial.videos, videosMin, videosMax),
      },
      pro: { duracao: prender(p.pro.duracao, duracaoMin, duracaoMax), videos: prender(p.pro.videos, videosMin, videosMax) },
    }));
  }, [duracaoMin, duracaoMax, videosMin, videosMax]);

  const setPersonalizado = useCallback((c: CategoriaId, v: { duracao?: number; videos?: number }) => {
    setPersonalizadoState((p) => ({ ...p, [c]: { ...p[c], ...v } }));
  }, []);

  const alternarAcessorio = useCallback((id: AcessorioId, ligado: boolean) => {
    setLigados((l) => {
      const sem = l.filter((x) => x !== id);
      return ligado ? [...sem, id].sort() : sem;
    });
  }, []);

  const editar = useCallback(
    (caminho: string, valor: unknown) => {
      const padrao = caminho.startsWith("admin.")
        ? lerCaminho(adminPadrao, caminho.slice("admin.".length))
        : lerCaminho(conteudoPadrao, caminho);
      despachar({ tipo: "definir", overrides: definir(overrides, caminho, valor, padrao) });
    },
    [adminPadrao, overrides],
  );
  const substituirOverrides = useCallback((o: Overrides) => despachar({ tipo: "definir", overrides: o }), []);
  const desfazer = useCallback(() => despachar({ tipo: "desfazer" }), []);
  const refazer = useCallback(() => despachar({ tipo: "refazer" }), []);

  const valor: Ctx = {
    conteudo,
    overrides,
    categoria,
    setCategoria,
    ligados,
    alternarAcessorio,
    selecao,
    setSelecao,
    personalizado,
    setPersonalizado,
    demo,
    setDemo,
    admin,
    setAdmin,
    adminPadrao,
    parametrosAdmin,
    editar,
    substituirOverrides,
    desfazer,
    refazer,
    podeDesfazer: ed.passado.length > 0,
    podeRefazer: ed.futuro.length > 0,
  };

  return <AppCtx.Provider value={valor}>{children}</AppCtx.Provider>;
}

// ── Preço de um card, já com acessórios ────────────────────────────────

export interface PrecoCard {
  base: number;
  total: number;
  aplicaveis: AcessorioId[];
  videos: number;
  duracao: number;
  porVideo: number;
}

export function precoDaFaixa(conteudo: Conteudo, faixa: Faixa, ligados: AcessorioId[]): PrecoCard {
  const aplicaveis = acessoriosAplicaveis(faixa.aceitaAcessorios, ligados);
  const total = faixa.preco + somaAcessorios(aplicaveis, conteudo.acessorios);
  return {
    base: faixa.preco,
    total,
    aplicaveis,
    videos: faixa.videos,
    duracao: faixa.duracao,
    porVideo: total / faixa.videos,
  };
}

export function precoDoPersonalizado(
  conteudo: Conteudo,
  categoria: CategoriaId,
  estado: EstadoPersonalizado,
  ligados: AcessorioId[],
): PrecoCard & { precoPorVideoBase: number } {
  const p = conteudo.categorias[categoria].personalizado.parametros;
  const { duracao, videos } = estado[categoria];
  const base = precoPersonalizado(p, videos, duracao);
  const total = base + somaAcessorios(ligados, conteudo.acessorios);
  return {
    base,
    total,
    aplicaveis: ligados,
    videos,
    duracao,
    porVideo: total / videos,
    precoPorVideoBase: precoPorVideoPersonalizado(p, duracao),
  };
}

export function precoDaSelecao(
  conteudo: Conteudo,
  selecao: Selecao,
  estado: EstadoPersonalizado,
  ligados: AcessorioId[],
): PrecoCard | null {
  const cat = conteudo.categorias[selecao.categoria];
  if (selecao.faixaId === PERSONALIZADO) return precoDoPersonalizado(conteudo, selecao.categoria, estado, ligados);
  const faixa = cat.faixas.find((f) => f.id === selecao.faixaId);
  return faixa ? precoDaFaixa(conteudo, faixa, ligados) : null;
}
