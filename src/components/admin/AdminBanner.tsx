// Faixa fixa do modo admin + ações (docs/06). Carregada só quando o admin liga.
import { useRef, useState } from "react";
import { AlertDialog } from "radix-ui";
import { Download, Redo2, RotateCcw, Undo2, Upload, X } from "lucide-react";
import { useApp } from "../store";
import { exportar, importar, type Overrides } from "../../lib/edicoes";
import { gsap, useGSAP, reduzMovimento } from "../../lib/gsap";

type Confirmacao = { tipo: "restaurar" } | { tipo: "importar"; dados: Overrides; nome: string } | null;

export default function AdminBanner() {
  const { overrides, substituirOverrides, desfazer, refazer, podeDesfazer, podeRefazer, setAdmin } = useApp();
  const faixa = useRef<HTMLDivElement>(null);
  const arquivo = useRef<HTMLInputElement>(null);
  const [confirmacao, setConfirmacao] = useState<Confirmacao>(null);
  const [aviso, setAviso] = useState("");
  const qtd = Object.keys(overrides).length;

  // Desce do topo (250 ms). Ao desligar, some na hora (desmonta).
  useGSAP(() => {
    if (!faixa.current || reduzMovimento()) return;
    gsap.from(faixa.current, { yPercent: -100, duration: 0.25, ease: "soft" });
  });

  const escolherArquivo = async (f: File | undefined) => {
    if (!f) return;
    try {
      const dados = await importar(f);
      setConfirmacao({ tipo: "importar", dados, nome: f.name });
    } catch {
      setAviso("Não deu para ler esse arquivo. Use um JSON exportado por este admin.");
    } finally {
      if (arquivo.current) arquivo.current.value = "";
    }
  };

  const confirmar = () => {
    if (!confirmacao) return;
    if (confirmacao.tipo === "restaurar") substituirOverrides({});
    else substituirOverrides(confirmacao.dados);
    setConfirmacao(null);
  };

  return (
    <>
      <div
        ref={faixa}
        data-admin-ui=""
        role="region"
        aria-label="Modo admin"
        className="fixed inset-x-0 top-0 z-50 flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 bg-ink px-4 py-1.5 text-[13px] text-white shadow-[0_8px_24px_-12px_rgb(11_31_46/0.6)] sm:px-6"
      >
        <span className="flex items-center gap-2 font-medium">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-70" />
            <span className="relative size-2 rounded-full bg-primary-400" />
          </span>
          Modo admin · <kbd className="font-sans">L</kbd> ou <kbd className="font-sans">Esc</kbd> para sair
        </span>
        <span className="hidden text-white/60 md:inline">
          {qtd === 0 ? "Sem edições" : `${qtd} ${qtd === 1 ? "edição salva" : "edições salvas"} neste navegador`}
        </span>
        {aviso && (
          <span role="alert" className="text-[#ffb4b4]">
            {aviso}
          </span>
        )}
        <span className="ml-auto flex flex-wrap items-center gap-1">
          <Acao rotulo="Desfazer (Ctrl+Z)" onClick={desfazer} desabilitado={!podeDesfazer}>
            <Undo2 className="size-4" /> <span className="hidden lg:inline">Desfazer</span>
          </Acao>
          <Acao rotulo="Refazer (Ctrl+Shift+Z)" onClick={refazer} desabilitado={!podeRefazer}>
            <Redo2 className="size-4" /> <span className="hidden lg:inline">Refazer</span>
          </Acao>
          <span className="mx-1 h-5 w-px bg-white/20" />
          <Acao rotulo="Exportar edições" onClick={() => exportar(overrides)}>
            <Download className="size-4" /> Exportar
          </Acao>
          <Acao rotulo="Importar edições" onClick={() => arquivo.current?.click()}>
            <Upload className="size-4" /> Importar
          </Acao>
          <input
            ref={arquivo}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => escolherArquivo(e.target.files?.[0])}
          />
          <Acao rotulo="Restaurar padrão" onClick={() => setConfirmacao({ tipo: "restaurar" })} perigo>
            <RotateCcw className="size-4" /> Restaurar padrão
          </Acao>
          <Acao rotulo="Sair do admin" onClick={() => setAdmin(false)}>
            <X className="size-4" />
          </Acao>
        </span>
      </div>

      <AlertDialog.Root open={!!confirmacao} onOpenChange={(o) => !o && setConfirmacao(null)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay data-admin-ui="" className="fixed inset-0 z-[60] bg-ink/50" />
          <AlertDialog.Content
            data-admin-ui=""
            onKeyDown={(e) => e.stopPropagation()}
            className="fixed top-1/2 left-1/2 z-[60] w-[min(440px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-[var(--shadow-pop)]"
          >
            <AlertDialog.Title className="font-display text-[22px] font-medium text-ink">
              {confirmacao?.tipo === "restaurar" ? "Restaurar padrão?" : "Importar edições?"}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {confirmacao?.tipo === "restaurar"
                ? "Isso apaga todas as edições salvas neste navegador e volta aos valores originais. Não dá para desfazer depois."
                : `Isso troca as edições deste navegador pelas do arquivo ${confirmacao?.tipo === "importar" ? confirmacao.nome : ""}. Exporte antes se quiser guardar as atuais.`}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel className="h-11 rounded-full px-5 text-[15px] text-ink-2 hover:bg-primary-50">
                Cancelar
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={confirmar}
                className={`h-11 rounded-full px-5 text-[15px] font-medium text-white ${
                  confirmacao?.tipo === "restaurar" ? "bg-bad" : "bg-ink"
                }`}
              >
                {confirmacao?.tipo === "restaurar" ? "Apagar e restaurar" : "Importar"}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}

function Acao({
  children,
  rotulo,
  onClick,
  desabilitado,
  perigo,
}: {
  children: React.ReactNode;
  rotulo: string;
  onClick: () => void;
  desabilitado?: boolean;
  perigo?: boolean;
}) {
  return (
    <button
      type="button"
      title={rotulo}
      aria-label={rotulo}
      onClick={onClick}
      disabled={desabilitado}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 font-medium transition-colors duration-150 disabled:opacity-35 ${
        perigo ? "text-[#ffb4b4] hover:bg-[#ffb4b4]/15" : "text-white/90 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
