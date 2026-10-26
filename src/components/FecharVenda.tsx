import { useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Dialog } from "radix-ui";
import { ArrowRight, Check, Clock, PenLine, Rocket, Sparkles, Users, X, type LucideIcon } from "lucide-react";
import { useApp } from "./store";
import { Logo } from "./Logo";
import { formatarNumero } from "../lib/preco";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";

const ICONES: LucideIcon[] = [PenLine, Users, Sparkles, Rocket];

/** Círculo que cobre a janela inteira saindo do centro do botão "Fechar". */
function circulo(origem: HTMLElement | null) {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const r = origem?.getBoundingClientRect();
  const cx = r ? r.left + r.width / 2 : vw / 2;
  const cy = r ? r.top + r.height / 2 : vh / 2;
  const raio = Math.max(Math.hypot(cx, cy), Math.hypot(vw - cx, cy), Math.hypot(cx, vh - cy), Math.hypot(vw - cx, vh - cy));
  return { left: cx - raio, top: cy - raio, width: raio * 2, height: raio * 2 };
}

export interface DadosFechamento {
  /** Nome do plano, já com a categoria ("Pro 50") */
  nome: string;
  /** "50 vídeos de 15 s por mês" */
  volume: string;
  acessorios: string[];
  total: number;
}

/**
 * Fechamento da call: a tela escurece saindo do botão, a LuminaImob entra acesa,
 * o resumo do que foi pedido assume o centro e os próximos passos entram embaixo.
 * É o último slide da conversa: o cliente vê o que pediu e o que acontece depois.
 */
export function FecharVenda({
  dados,
  origem,
  aoFechar,
}: {
  dados: DadosFechamento;
  /** Botão "Fechar": de onde o escuro sai e para onde ele volta. */
  origem: RefObject<HTMLElement | null>;
  aoFechar: () => void;
}) {
  const { conteudo } = useApp();
  const p = conteudo.proximos;
  const fundo = useRef<HTMLDivElement>(null);
  const veu = useRef<HTMLDivElement>(null);
  const corpo = useRef<HTMLDivElement>(null);
  const valor = useRef<HTMLSpanElement>(null);
  const abertura = useRef<gsap.core.Timeline | null>(null);
  const pulso = useRef<gsap.core.Tween | null>(null);
  const fechando = useRef(false);

  const passos = [{ quando: p.contrato.quando, titulo: p.contrato.titulo, texto: p.contrato.subtitulo }, ...p.etapas];

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(veu.current, { ...circulo(origem.current), scale: 0, transformOrigin: "50% 50%" });

      if (reduzMovimento()) {
        gsap.set(fundo.current, { autoAlpha: 1 });
        gsap.set(veu.current, { autoAlpha: 0 });
        gsap.fromTo(corpo.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: "none" });
        gsap.set("[data-fv-fechar], [data-fv-logo], [data-fv-sobe], [data-fv-total], [data-fv-chip], [data-fv-passo], [data-fv-prazo]", {
          autoAlpha: 1,
        });
        return;
      }

      // O total conta de zero; o texto final já está no HTML para quem lê a tela
      const escrever = (v: number) => {
        if (valor.current) valor.current.textContent = formatarNumero(v);
      };
      escrever(0);
      const n = { v: 0 };

      abertura.current = gsap
        .timeline({ defaults: { ease: "soft" } })
        // 1. o escuro cresce do botão até tomar a tela; o fundo fixo assume e o círculo sai
        .to(veu.current, { scale: 1, duration: 0.62, ease: "power3.inOut" }, 0)
        .set(fundo.current, { autoAlpha: 1 }, 0.58)
        .set(veu.current, { autoAlpha: 0 }, 0.62)
        .fromTo("[data-fv-aurora]", { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 0.3)
        .fromTo("[data-fv-fechar]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.7)
        // 2. a Lumina entra e acende: o traço da lâmpada se desenha e o halo abre
        .fromTo("[data-fv-logo]", { autoAlpha: 0, y: 26, scale: 0.86 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 0.42)
        .fromTo("[data-fv-logo] .traco", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.85, stagger: 0.05, ease: "power2.inOut" }, 0.5)
        .fromTo("[data-fv-halo]", { autoAlpha: 0, scale: 0.45 }, { autoAlpha: 1, scale: 1, duration: 0.65, ease: "power2.out" }, 0.95)
        // 3. o resumo do que foi pedido assume o centro
        .fromTo("[data-fv-sobe]", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.0)
        .fromTo("[data-fv-total]", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, 1.3)
        .to(
          n,
          {
            v: dados.total,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => escrever(Math.round(n.v)),
            onComplete: () => escrever(dados.total),
          },
          1.35,
        )
        .fromTo("[data-fv-chip]", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 }, 1.7)
        // 4. os próximos passos entram um a um e a faixa do prazo fecha
        .fromTo("[data-fv-linha]", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 1.85)
        .fromTo("[data-fv-passo]", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 }, 2.0)
        .fromTo("[data-fv-seta]", { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.1 }, 2.25)
        .fromTo("[data-fv-prazo]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.5)
        .fromTo("[data-fv-relogio]", { rotation: -180 }, { rotation: 0, duration: 0.8, transformOrigin: "50% 50%" }, 2.55);

      // A lâmpada fica respirando devagar (só transform e opacidade: nada de custo de layout por quadro)
      pulso.current = gsap.to("[data-fv-halo]", {
        scale: 1.14,
        autoAlpha: 0.6,
        duration: 1.9,
        delay: 1.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: corpo },
  );

  const fechar = contextSafe(() => {
    if (fechando.current) return;
    fechando.current = true;
    abertura.current?.kill();
    pulso.current?.kill();

    if (reduzMovimento()) {
      gsap.to([corpo.current, fundo.current], { autoAlpha: 0, duration: 0.15, ease: "none", onComplete: aoFechar });
      return;
    }

    // Caminho de volta: o conteúdo sai e o escuro encolhe de volta para dentro do botão
    gsap
      .timeline({ onComplete: aoFechar })
      .to(corpo.current, { autoAlpha: 0, y: 14, duration: 0.3, ease: "power2.in" }, 0)
      .set(veu.current, { ...circulo(origem.current), autoAlpha: 1, scale: 1 }, 0.28)
      .set(fundo.current, { autoAlpha: 0 }, 0.3)
      .to(veu.current, { scale: 0, duration: 0.5, ease: "power3.inOut" }, 0.3);
  });

  return createPortal(
    <Dialog.Root open onOpenChange={(aberto) => !aberto && fechar()}>
      <Dialog.Overlay ref={fundo} className="invisible fixed inset-0 z-[90] bg-ink" />

      {/* Fora do conteúdo: ali dentro, o will-change viraria bloco de contenção e o círculo criaria barra de rolagem */}
      <div ref={veu} aria-hidden="true" className="pointer-events-none fixed z-[90] rounded-full bg-ink will-change-transform" />

      <Dialog.Content
        aria-describedby={undefined}
        // Esc fecha com animação e não chega ao atalho do admin (Esc também desliga o admin)
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fechar();
        }}
        className="fixed inset-0 z-[91] overflow-x-hidden overflow-y-auto outline-none"
      >
        <Dialog.Title className="sr-only">Plano escolhido e próximos passos</Dialog.Title>

        <div
          ref={corpo}
          data-cursor-claro=""
          className="relative flex min-h-full flex-col items-center justify-center gap-7 px-5 py-14 text-center sm:px-8"
        >
          {/* Luz da Lumina atrás de tudo */}
          <span
            data-fv-aurora=""
            aria-hidden="true"
            // O raio cabe inteiro na caixa: a luz apaga antes das bordas, sem corte reto em cima nem embaixo
            className="pointer-events-none absolute inset-x-0 top-0 h-[64vh] bg-[radial-gradient(40%_30%_at_50%_38%,rgb(51_190_244/0.22)_0%,rgb(10_132_255/0.08)_45%,transparent_72%)]"
          />

          <button
            type="button"
            onClick={fechar}
            data-fv-fechar=""
            aria-label="Voltar aos planos"
            className="invisible absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20 sm:top-6 sm:right-6"
          >
            <X className="size-5" />
          </button>

          {/* A Lumina entra com a logo acesa */}
          <div data-fv-logo="" className="invisible relative will-change-transform">
            <span
              data-fv-halo=""
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-16 -inset-y-14 rounded-full bg-[radial-gradient(circle,rgb(51_190_244/0.35)_0%,rgb(14_165_233/0.12)_45%,transparent_72%)] will-change-transform"
            />
            <Logo claro grande className="relative" />
          </div>

          {/* Resumo do que foi pedido */}
          <div className="relative flex flex-col items-center gap-3">
            <p data-fv-sobe="" className="invisible text-[12px] font-semibold tracking-[0.22em] text-primary-400 uppercase">
              Plano escolhido
            </p>
            <h2
              data-fv-sobe=""
              className="invisible max-w-[22ch] font-display text-[40px] leading-[1.03] font-medium tracking-[-0.03em] text-white sm:text-[56px]"
            >
              {dados.nome}
            </h2>
            <p data-fv-sobe="" className="invisible text-[16px] text-white/60">
              {dados.volume}
            </p>
            {dados.acessorios.length > 0 && (
              <ul data-fv-sobe="" className="invisible mt-1 flex flex-wrap justify-center gap-2">
                {dados.acessorios.map((a) => (
                  <li
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-400/30 bg-primary-400/10 px-3 py-1.5 text-[14px] font-medium text-primary-200"
                  >
                    <Check className="size-3.5" strokeWidth={2.6} /> {a}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p data-fv-total="" className="invisible relative flex items-baseline gap-2 will-change-transform">
            <span className="font-display text-[22px] font-medium text-white/60">R$</span>
            <span
              ref={valor}
              className="tabular font-display text-[64px] leading-none font-medium tracking-[-0.04em] text-white sm:text-[88px]"
            >
              {formatarNumero(dados.total)}
            </span>
            <span className="text-[18px] text-white/60">/mês</span>
          </p>

          <ul className="relative flex flex-wrap justify-center gap-2">
            {conteudo.condicoes.map((c) => (
              <li
                key={c}
                data-fv-chip=""
                className="invisible inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[14px] text-white/85"
              >
                <span className="grid size-5 place-items-center rounded-full bg-ok text-white">
                  <Check className="size-3" strokeWidth={2.8} />
                </span>
                {c}
              </li>
            ))}
          </ul>

          <span
            data-fv-linha=""
            aria-hidden="true"
            className="relative mt-2 h-px w-full max-w-[760px] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.22),transparent)]"
          />

          {/* Próximos passos: o mesmo caminho da seção "Como começamos" */}
          <div className="relative w-full max-w-[1080px]">
            <p data-fv-passo="" className="invisible text-[12px] font-semibold tracking-[0.22em] text-primary-400 uppercase">
              {p.rotulo}
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {passos.map((passo, i) => {
                const Icone = ICONES[i] ?? Check;
                return (
                  <li key={i} data-fv-passo="" className="invisible relative">
                    {i > 0 && (
                      <span
                        data-fv-seta=""
                        aria-hidden="true"
                        className="invisible pointer-events-none absolute top-1/2 -left-[19px] hidden -translate-y-1/2 text-primary-400/70 lg:block"
                      >
                        <ArrowRight className="size-4" strokeWidth={2.2} />
                      </span>
                    )}
                    <article className="flex h-full flex-col rounded-[20px] border border-white/10 bg-white/[0.045] p-4 text-left backdrop-blur-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-400/15 text-primary-200">
                          <Icone className="size-[17px]" strokeWidth={1.8} />
                        </span>
                        <span className="text-[11px] font-semibold tracking-[0.16em] text-primary-400 uppercase">{passo.quando}</span>
                      </div>
                      <h3 className="mt-3 font-display text-[18px] leading-[1.15] font-medium tracking-[-0.02em] text-white">
                        {passo.titulo}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">{passo.texto}</p>
                    </article>
                  </li>
                );
              })}
            </ol>

            <p
              data-fv-prazo=""
              className="invisible mt-5 flex w-full items-center justify-center gap-3 rounded-full border border-primary-400/30 bg-primary-900/25 px-5 py-3.5 font-display text-[16px] font-medium text-white sm:text-[18px]"
            >
              <Clock data-fv-relogio="" className="size-5 shrink-0 text-primary-400" strokeWidth={2} />
              <span>
                {p.prazo.texto} <span className="text-primary-400">{p.prazo.destaque}</span>
              </span>
            </p>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>,
    document.body,
  );
}
