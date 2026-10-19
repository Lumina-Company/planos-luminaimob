import { useRef, type PointerEvent, type ReactNode } from "react";
import { Check, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "./store";
import { Editable, ListaEditavel } from "./admin/Editable";
import { Lanterna } from "./efeitos/Lanterna";
import { useRevelar } from "./efeitos/useRevelar";
import {
  Assinatura,
  Caneta,
  IlustracaoAutomacao,
  IlustracaoCalendario,
  IlustracaoNoAr,
  Prendedor,
  SetaEtapa,
} from "./IlustracoesComecar";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";

const ILUSTRACOES: ReactNode[] = [<IlustracaoCalendario />, <IlustracaoAutomacao />, <IlustracaoNoAr />];

/**
 * Assinatura com 190 px de largura (viewBox 230 × 62) e caneta com 170 px (viewBox 266 × 168):
 * a ponta da caneta (20, 148) pousa no fim do traço (216, 36). A caneta anda do começo ao fim enquanto o traço se desenha.
 */
const ASS_L = 190;
const ASS_A = (ASS_L * 62) / 230;
const CAN_L = 170;
const CAN_ESCALA = CAN_L / 266;
const CANETA = {
  left: (ASS_L * 216) / 230 - 20 * CAN_ESCALA,
  top: (ASS_A * 36) / 62 - 148 * CAN_ESCALA,
};
/** Da ponta no fim do traço até a ponta no começo dele (6, 46) */
const CANETA_INICIO = { x: -(ASS_L * (216 - 6)) / 230, y: (ASS_A * (46 - 36)) / 62 };

/**
 * "Como começamos": o que acontece depois da compra (slide da apresentação comercial).
 * Prancheta com o contrato (hoje) e três etapas até os imóveis irem ao ar sozinhos; a faixa fecha com o prazo.
 */
export function ComoComecamos() {
  const { conteudo } = useApp();
  const p = conteudo.proximos;
  const secao = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP({ scope: secao });

  // Entrando na tela: a prancheta sobe, os itens do contrato entram, a caneta assina e o selo "Assinado" aparece;
  // as etapas vêm uma a uma com as setas, e a faixa do prazo fecha.
  useRevelar(
    secao,
    (tl) => {
      tl.fromTo("[data-cc-cabeca]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .fromTo("[data-prancheta]", { autoAlpha: 0, y: 40, rotation: -1.5 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.75 }, 0.1)
        .fromTo("[data-cc-item]", { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.06 }, 0.4)
        .fromTo("[data-assinatura] path:first-child", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.95, ease: "power1.inOut" }, 0.8)
        .fromTo("[data-caneta]", CANETA_INICIO, { x: 0, y: 0, duration: 0.95, ease: "power1.inOut" }, 0.8)
        .fromTo("[data-assinatura] path:last-child", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, ease: "power2.out" }, 1.75)
        .fromTo("[data-assinado]", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 1.85)
        .fromTo("[data-etapa]", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12 }, 0.35)
        .fromTo("[data-seta-etapa]", { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.12 }, 0.6)
        .fromTo("[data-cc-prazo]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.9)
        .fromTo("[data-relogio]", { rotation: -180 }, { rotation: 0, duration: 0.8, transformOrigin: "50% 50%" }, 0.95);
    },
    "top 72%",
  );

  // Mouse (ou dedo) na etapa: a ilustração ganha vida por um instante
  const animarEtapa = contextSafe((e: PointerEvent<HTMLElement>) => {
    if (reduzMovimento()) return;
    const card = e.currentTarget;
    // Cada ilustração tem só alguns desses grupos: anima o que existir (lista vazia faria o GSAP avisar no console)
    const em = (seletor: string, animar: (alvos: Element[]) => void) => {
      const alvos = Array.from(card.querySelectorAll(seletor));
      if (alvos.length) animar(alvos);
    };
    em("[data-gira]", (a) =>
      gsap.to(a, { rotation: "+=90", duration: 1.1, ease: "soft", transformOrigin: "50% 50%", overwrite: "auto" }),
    );
    em("[data-pulsa]", (a) =>
      gsap.fromTo(
        a,
        { scale: 1 },
        { scale: 1.14, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "50% 50%", overwrite: "auto" },
      ),
    );
    em("[data-flutua]", (a) =>
      gsap.fromTo(a, { y: 0 }, { y: -5, duration: 0.28, yoyo: true, repeat: 1, ease: "power2.out", stagger: 0.07, overwrite: "auto" }),
    );
    em("[data-linha-codigo]", (a) =>
      gsap.fromTo(
        a,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.3, stagger: 0.035, ease: "power2.out", transformOrigin: "0% 50%", overwrite: "auto" },
      ),
    );
  });

  return (
    <section ref={secao} aria-labelledby="como-comecamos" className="mx-auto max-w-[1240px] overflow-x-clip px-4 py-20 sm:px-8">
      <header data-revela="" data-cc-cabeca="">
        <p className="text-[13px] font-semibold tracking-[0.18em] text-primary-700 uppercase">
          <Editable caminho="proximos.rotulo" rotulo="rótulo da seção" />
        </p>
        <h2
          id="como-comecamos"
          className="mt-2 font-display text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-ink sm:text-[48px]"
        >
          <Editable caminho="proximos.titulo" rotulo="título da seção" />
        </h2>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)]">
        <Prancheta />

        <div className="flex flex-col gap-6">
          <ol data-lanterna-grupo="" className="grid flex-1 gap-5 md:grid-cols-3 md:gap-9">
            {p.etapas.map((etapa, i) => (
              <li key={i} data-revela="" data-etapa="" className="relative">
                {/* Seta vinda da etapa anterior (da prancheta, na primeira) */}
                <span
                  data-seta-etapa=""
                  className={`pointer-events-none absolute top-[64px] z-[2] w-[52px] ${
                    i === 0 ? "-left-[46px] hidden lg:block" : "-left-[44px] hidden md:block"
                  }`}
                >
                  <SetaEtapa className="h-auto w-full" />
                </span>
                <article
                  onPointerEnter={animarEtapa}
                  data-lanterna="ciano"
                  className="group/etapa relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white p-4 pb-5 shadow-[var(--shadow-card)] transition-[translate,box-shadow] duration-300 ease-[var(--ease-out-soft)] [--lanterna-raio:260px] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <Lanterna />
                  <div className="relative py-3 md:-mx-2">
                    <div className="mx-auto max-w-[260px] md:max-w-none">{ILUSTRACOES[i] ?? null}</div>
                  </div>
                  <div className="relative mt-2 flex items-center gap-2.5 px-1">
                    <Numero>{i + 2}</Numero>
                    <span className="text-[12px] font-semibold tracking-[0.14em] text-primary-700 uppercase">
                      <Editable caminho={`proximos.etapas.${i}.quando`} rotulo="quando" />
                    </span>
                  </div>
                  <h3 className="relative mt-3 px-1 font-display text-[21px] leading-[1.15] font-medium tracking-[-0.02em] text-ink">
                    <Editable caminho={`proximos.etapas.${i}.titulo`} rotulo="título da etapa" />
                  </h3>
                  <p className="relative mt-2 px-1 text-[15px] leading-relaxed text-ink-2">
                    <Editable caminho={`proximos.etapas.${i}.texto`} rotulo="texto da etapa" />
                  </p>
                  <ListaEditavel
                    caminho={`proximos.etapas.${i}.marcas`}
                    rotuloNovo="Adicionar marcador"
                    className="relative mt-auto flex flex-wrap gap-1.5 px-1 pt-4"
                    render={(texto) => (
                      <span className="inline-flex rounded-full border border-primary-200/70 bg-primary-50 px-2.5 py-1 text-[13px] font-medium text-primary-700">
                        {texto}
                      </span>
                    )}
                  />
                </article>
              </li>
            ))}
          </ol>

          <p
            data-revela=""
            data-cc-prazo=""
            data-cursor-claro=""
            className="flex items-center justify-center gap-3 rounded-[22px] bg-ink px-5 py-3.5 text-center font-display text-[16px] font-medium text-white shadow-[0_16px_32px_-16px_rgb(11_31_46/0.5)] sm:rounded-full sm:text-[18px]"
          >
            <Clock data-relogio="" className="size-5 shrink-0 text-primary-400" strokeWidth={2} />
            <span>
              <Editable caminho="proximos.prazo.texto" claro rotulo="texto do prazo" />{" "}
              <span className="text-primary-400">
                <Editable caminho="proximos.prazo.destaque" claro rotulo="destaque do prazo" />
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Numero({ children }: { children: ReactNode }) {
  return (
    <span className="tabular grid size-8 shrink-0 place-items-center rounded-full gradient-acao-texto font-display text-[14px] font-semibold text-white">
      {children}
    </span>
  );
}

/** Etapa 1, hoje: o contrato na prancheta, com a assinatura e o selo "Assinado". */
function Prancheta() {
  const { conteudo } = useApp();
  const c = conteudo.proximos.contrato;
  const ultimo = c.itens.length - 1;

  return (
    <div data-revela="" data-prancheta="" data-tilt="" className="relative mx-auto w-full max-w-[420px] pt-6 lg:max-w-none">
      <div className="relative h-full rounded-[28px] bg-[linear-gradient(135deg,#1D4D73_0%,#0B1F2E_100%)] p-5 pt-9 shadow-[0_28px_56px_-24px_rgb(10_58_102/0.6)]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10 ring-inset" />
        {/* Folha de baixo, levemente girada */}
        <div aria-hidden="true" className="absolute inset-x-5 top-9 bottom-5 rotate-[1.6deg] rounded-[12px] bg-[#D5E2EC]" />

        <div className="relative flex h-full flex-col rounded-[12px] bg-white px-6 pt-8 pb-5 shadow-[0_3px_10px_rgb(6_19_29/0.22)]">
          <div className="flex items-center gap-3">
            <Numero>1</Numero>
            <span className="text-[13px] font-semibold tracking-[0.16em] text-primary-700 uppercase">
              <Editable caminho="proximos.contrato.quando" rotulo="quando" />
            </span>
          </div>
          <h3 className="mt-3 font-display text-[28px] leading-[1.1] font-medium tracking-[-0.02em] text-ink">
            <Editable caminho="proximos.contrato.titulo" rotulo="título do contrato" />
          </h3>
          <p className="mt-1.5 text-[15px] font-semibold text-ink-2">
            <Editable caminho="proximos.contrato.subtitulo" rotulo="subtítulo do contrato" />
          </p>

          <ListaEditavel
            caminho="proximos.contrato.itens"
            rotuloNovo="Adicionar item do escopo"
            className="mt-4 space-y-2 border-t-2 border-dashed border-line pt-4"
            render={(texto, i) => (
              <div data-cc-item="" className="flex items-center gap-2.5 text-[15px] leading-snug text-ink">
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-[#C7F2E2] bg-[#ECFDF5] text-ok">
                  <Check className="size-3.5" strokeWidth={2.6} />
                </span>
                <span className={i === ultimo ? "font-semibold" : ""}>{texto}</span>
              </div>
            )}
          />

          <div className="mt-auto pt-5">
            <div className="relative" style={{ width: ASS_L, height: ASS_A }}>
              <Assinatura className="absolute inset-0 size-full" />
              <span data-caneta="" className="pointer-events-none absolute" style={{ left: CANETA.left, top: CANETA.top, width: CAN_L }}>
                <Caneta className="h-auto w-full" />
              </span>
            </div>
            <hr className="mt-2 border-t-2 border-line-strong" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[14px] text-ink-2">
                <Editable caminho="proximos.contrato.contratante" rotulo="contratante" />
              </span>
              <span
                data-assinado=""
                className="inline-flex items-center gap-1.5 rounded-full bg-ok px-3 py-1.5 text-[14px] font-semibold text-white shadow-[0_8px_18px_-8px_rgb(15_122_77/0.7)]"
              >
                <CheckCircle2 className="size-4" strokeWidth={2.2} />
                <Editable caminho="proximos.contrato.assinado" claro rotulo="selo assinado" />
              </span>
            </div>
          </div>
        </div>

        <Prendedor className="pointer-events-none absolute top-0 left-1/2 w-[150px] -translate-x-1/2 -translate-y-[38%]" />
      </div>
    </div>
  );
}
