import { useRef, useState, type ReactNode, type RefObject } from "react";
import { Popover, Switch, Dialog } from "radix-ui";
import { ChevronDown, PlayCircle, X, Sparkles, Mic } from "lucide-react";
import { ACESSORIOS, type AcessorioId } from "../data/planos";
import { useApp } from "./store";
import { Editable } from "./admin/Editable";
import { Midia, ReservaImagem } from "./Midia";
import { formatarBRL } from "../lib/preco";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";

const ICONE: Record<AcessorioId, typeof Sparkles> = { motion: Sparkles, locucao: Mic };

export function AccessoriesMenu() {
  const { conteudo, ligados, alternarAcessorio, admin } = useApp();
  const [exemplo, setExemplo] = useState<AcessorioId | null>(null);
  const contador = useRef<HTMLSpanElement>(null);
  const qtd = ligados.length;

  // Contador "Acessórios (1)" pulsa 1 → 1,08 → 1
  useGSAP(
    () => {
      if (!contador.current || reduzMovimento() || qtd === 0) return;
      gsap.fromTo(contador.current, { scale: 1 }, { scale: 1.08, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out", overwrite: true });
    },
    { dependencies: [qtd] },
  );

  return (
    <>
      <Popover.Root modal={false}>
        <Popover.Trigger asChild>
          <button
            type="button"
            data-magnetico=""
            data-onda="escuro"
            className="group relative isolate inline-flex h-[52px] items-center gap-2 overflow-hidden rounded-full border border-line bg-white/55 pr-4 pl-5 text-[15px] text-ink-2 backdrop-blur-sm transition-colors duration-150 hover:border-line-strong hover:bg-white hover:text-ink data-[state=open]:border-line-strong data-[state=open]:bg-white data-[state=open]:text-ink"
          >
            <span ref={contador} className="inline-flex items-center gap-2">
              {conteudo.site.acessoriosTitulo}
              {qtd > 0 && (
                <span className="tabular grid h-5 min-w-5 place-items-center rounded-full gradient-acao-texto px-1.5 text-[12px] font-semibold text-white">
                  {qtd}
                </span>
              )}
            </span>
            <span className="sr-only">{qtd > 0 ? `(${qtd} ligado${qtd > 1 ? "s" : ""})` : ""}</span>
            <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={10}
            collisionPadding={16}
            onInteractOutside={(e) => {
              if (admin && (e.target as HTMLElement).closest("[data-admin-ui]")) e.preventDefault();
            }}
            className="z-40 w-[min(380px,calc(100vw-32px))] origin-[var(--radix-popover-content-transform-origin)] rounded-[22px] border border-line bg-white p-2 shadow-[var(--shadow-pop)] data-[state=open]:animate-[pop-in_220ms_var(--ease-out-soft)]"
          >
            <p className="px-3 pt-2 pb-1 text-[12px] font-medium tracking-wide text-ink-2 uppercase">
              Somam ao plano · valem para todos os vídeos
            </p>
            <ListaEmCascata>
              {ACESSORIOS.map((id) => {
                const a = conteudo.acessorios[id];
                const Icone = ICONE[id];
                const ligado = ligados.includes(id);
                return (
                  <li
                    key={id}
                    className={`flex gap-3 rounded-2xl p-3 transition-colors duration-150 ${ligado ? "bg-primary-50" : "hover:bg-bg"}`}
                  >
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-white text-primary-700">
                      <Icone className="size-[18px]" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        {admin ? (
                          <span className="text-[15px] font-medium text-ink">
                            <Editable caminho={`acessorios.${id}.nome`} rotulo="nome do acessório" />
                          </span>
                        ) : (
                          <label htmlFor={`ac-${id}`} className="text-[15px] font-medium text-ink">
                            {a.nome}
                          </label>
                        )}
                        <span className="tabular shrink-0 text-[14px] font-medium text-ink">
                          +{" "}
                          <Editable
                            caminho={`acessorios.${id}.preco`}
                            tipo="dinheiro"
                            formatar={(v: number) => formatarBRL(v)}
                            rotulo="preço do acessório"
                          />
                          <span className="text-ink-2">/mês</span>
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] leading-snug text-ink-2">
                        <Editable caminho={`acessorios.${id}.descricao`} rotulo="descrição do acessório" />
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setExemplo(id)}
                          className="-ml-1 inline-flex h-8 items-center gap-1.5 rounded-full px-1 text-[13px] font-medium text-primary-700 hover:text-primary-900"
                        >
                          <PlayCircle className="size-4" strokeWidth={1.8} /> ver exemplo
                        </button>
                        <Switch.Root
                          id={`ac-${id}`}
                          checked={ligado}
                          onCheckedChange={(v) => alternarAcessorio(id, v)}
                          className="relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition-colors duration-200 data-[state=checked]:gradient-acao"
                        >
                          <Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white shadow-[0_1px_3px_rgb(11_31_46/0.25)] transition-transform duration-200 ease-[var(--ease-out-soft)] data-[state=checked]:translate-x-[22px]" />
                        </Switch.Root>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ListaEmCascata>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <VideoModal id={exemplo} aoFechar={() => setExemplo(null)} />
    </>
  );
}

/** Os itens do popover entram um depois do outro quando ele abre (o Radix monta o conteúdo a cada abertura). */
function ListaEmCascata({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  useGSAP(
    () => {
      if (reduzMovimento()) return;
      gsap.from(":scope > li", { y: 10, autoAlpha: 0, duration: 0.36, stagger: 0.06, ease: "soft", delay: 0.04 });
    },
    { scope: ref },
  );
  return <ul ref={ref}>{children}</ul>;
}

/**
 * Entrada do modal: o cartão escala de 0,96 a 1 (250 ms) e os textos vêm em seguida.
 * Mora dentro do Dialog.Content porque o Portal do Radix só monta o conteúdo no render seguinte.
 */
function EntradaDoModal({ cartao }: { cartao: RefObject<HTMLDivElement | null> }) {
  useGSAP(
    () => {
      if (!cartao.current || reduzMovimento()) return;
      gsap
        .timeline({ defaults: { ease: "soft" } })
        .fromTo(cartao.current, { scale: 0.96, y: 12, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: 0.3 })
        .from("[data-modal-anima]", { y: 10, autoAlpha: 0, duration: 0.36, stagger: 0.05 }, 0.12);
    },
    { scope: cartao },
  );
  return null;
}

function VideoModal({ id, aoFechar }: { id: AcessorioId | null; aoFechar: () => void }) {
  const { conteudo } = useApp();
  const conteudoRef = useRef<HTMLDivElement>(null);
  const a = id ? conteudo.acessorios[id] : null;

  return (
    <Dialog.Root open={!!id} onOpenChange={(o) => !o && aoFechar()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px] data-[state=open]:animate-[fade-in_250ms_ease-out]" />
        <Dialog.Content
          ref={conteudoRef}
          className="fixed top-1/2 left-1/2 z-50 flex w-[min(880px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-[28px] bg-white p-4 shadow-[var(--shadow-pop)] outline-none sm:flex-row sm:p-5"
        >
          {a && id && (
            <>
              <EntradaDoModal cartao={conteudoRef} />
              <div className="mx-auto aspect-[9/16] h-[min(62vh,560px)] shrink-0 overflow-hidden rounded-[22px] bg-ink">
                <Midia
                  caminho={`acessorios.${id}.video`}
                  rotulo={`Exemplo de ${a.nome}`}
                  reserva={
                    <ReservaImagem
                      src={id === "motion" ? "/img/exemplos/imovel-piscina.webp" : "/img/exemplos/imovel-sala.webp"}
                      alt="Foto real de imóvel usada como base do vídeo"
                      selo="Exemplo em produção"
                      efeito={id === "motion" ? "passeio" : "zoom-lento"}
                    />
                  }
                />
              </div>
              <div className="flex flex-1 flex-col py-2 sm:py-4 sm:pr-3">
                <p data-modal-anima="" className="text-[13px] font-medium tracking-wide text-ink-2 uppercase">
                  Acessório
                </p>
                <Dialog.Title
                  data-modal-anima=""
                  className="mt-2 font-display text-[32px] leading-[1.05] font-medium tracking-[-0.02em] text-ink"
                >
                  {a.nome}
                </Dialog.Title>
                <Dialog.Description data-modal-anima="" className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-ink-2">
                  {a.descricao}.
                </Dialog.Description>
                <p data-modal-anima="" className="mt-6 font-display text-[28px] font-medium text-ink">
                  <span className="tabular">+ {formatarBRL(a.preco)}</span>
                  <span className="text-[15px] font-normal text-ink-2"> /mês</span>
                </p>
                <p data-modal-anima="" className="mt-1 text-[14px] text-ink-2">
                  Preço fixo, vale para todos os vídeos do plano.
                </p>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    data-modal-anima=""
                    data-magnetico=""
                    data-onda=""
                    data-cursor-claro=""
                    className="relative isolate mt-auto inline-flex h-12 items-center justify-center gap-2 self-start overflow-hidden rounded-full bg-ink px-6 text-[15px] font-medium text-white transition-[scale,background-color] duration-150 hover:bg-[#13304a] active:scale-[0.98]"
                  >
                    <span data-magnetico-filho="" className="relative z-[1]">
                      Fechar
                    </span>
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Close
                aria-label="Fechar"
                className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-ink-2 hover:bg-primary-50 hover:text-ink"
              >
                <X className="size-5" />
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
