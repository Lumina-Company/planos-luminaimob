import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, ChevronRight } from "lucide-react";
import type { CategoriaId } from "../data/planos";
import { useApp } from "./store";
import { Orbe } from "./CategoryTabs";
import { Editable, ListaEditavel } from "./admin/Editable";
import { Midia, ReservaImagem } from "./Midia";
import { VideoTelaCheia } from "./VideoTelaCheia";
import { Lanterna } from "./efeitos/Lanterna";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";

const POSTS = ["/img/br-luani/post-1.webp", "/img/br-luani/post-2.webp", "/img/br-luani/post-3.webp"];

/** Posts reais da BR Luani em sequência, como um Reels (LAY7, demo do Pro). */
function PostsBRLuani({ selo }: { selo: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduzMovimento()) return;
    const t = setInterval(() => setI((x) => (x + 1) % POSTS.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative size-full bg-white">
      {POSTS.map((src, j) => (
        <img
          key={src}
          src={src}
          alt={j === i ? "Post real publicado pela automação no Instagram da BR Luani Imobiliária" : ""}
          aria-hidden={j !== i}
          className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-700 ${j === i ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          decoding="async"
        />
      ))}
      <div className="absolute inset-x-3 top-3 flex gap-1" aria-hidden="true">
        {POSTS.map((src, j) => (
          <span key={src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/15">
            <span className={`block h-full rounded-full bg-ink/70 ${j <= i ? "w-full" : "w-0"}`} />
          </span>
        ))}
      </div>
      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur">
        <span className="size-1.5 rounded-full bg-primary-400" />
        {selo}
      </span>
    </div>
  );
}

const RESERVA: Record<CategoriaId, { src: string; efeito: "zoom-lento" | "passeio" } | null> = {
  essencial: { src: "/img/exemplos/imovel-sala.webp", efeito: "zoom-lento" },
  pro: null,
  max: { src: "/img/exemplos/imovel-piscina.webp", efeito: "passeio" },
};

/**
 * Setinha entre um passo e o próximo, no vão da grade. Some no último passo e no fim de cada linha:
 * 1 coluna (desce), 2 colunas a partir de sm, 3 a partir de xl.
 */
function Seta({ indice, total }: { indice: number; total: number }) {
  if (indice === total - 1) return null;
  const sm = indice % 2 === 0 ? "sm:block" : "sm:hidden";
  const xl = indice % 3 === 2 ? "xl:hidden" : "xl:block";
  return (
    <span
      aria-hidden="true"
      data-seta=""
      className={`pointer-events-none absolute -bottom-3 left-1/2 z-[1] -translate-x-1/2 translate-y-1/2 rotate-90 text-primary-400 sm:top-1/2 sm:-right-5 sm:bottom-auto sm:left-auto sm:translate-x-1/2 sm:-translate-y-1/2 sm:rotate-0 ${sm} ${xl}`}
    >
      <ChevronRight className="size-5" strokeWidth={2} />
    </span>
  );
}

export function DemoPanel() {
  const { conteudo, categoria, selecao } = useApp();
  const raiz = useRef<HTMLDivElement>(null);
  const celular = useRef<HTMLDivElement>(null);
  const [ampliado, setAmpliado] = useState<HTMLVideoElement | null>(null);
  const d = conteudo.demo.categorias[categoria];
  const cat = conteudo.categorias[categoria];
  const base = `demo.categorias.${categoria}`;
  const reserva = RESERVA[categoria];

  // Volta da tela cheia: o vídeo da página salta para onde o outro parou e só reaparece depois do salto,
  // para não piscar o quadro antigo
  const voltarDaTelaCheia = (tempo: number) => {
    const v = ampliado;
    if (!v) return;
    let feito = false;
    const mostrar = () => {
      if (feito) return;
      feito = true;
      setAmpliado(null);
      v.play().catch(() => {});
    };
    v.addEventListener("seeked", mostrar, { once: true });
    setTimeout(mostrar, 250);
    v.currentTime = tempo;
  };

  // Abrir a demo: o celular sobe e assenta, os textos vêm em cascata e os passos se acendem um a um.
  // Trocar categoria com a demo aberta: o mesmo, mais curto, sem desmontar o layout.
  const abriu = useRef(false);
  useGSAP(
    () => {
      if (reduzMovimento()) return;
      const primeira = !abriu.current;
      abriu.current = true;
      const tl = gsap.timeline({ defaults: { ease: "soft", overwrite: true } });
      tl.fromTo(
        "[data-demo-celular]",
        { autoAlpha: 0, y: primeira ? 36 : 12, scale: primeira ? 0.94 : 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: primeira ? 0.55 : 0.34 },
        0,
      )
        .fromTo(
          "[data-demo-anima]",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: primeira ? 0.06 : 0.035 },
          primeira ? 0.08 : 0,
        )
        .fromTo(
          "[data-passo]",
          { autoAlpha: 0, y: 10, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.05 },
          primeira ? 0.28 : 0.1,
        )
        .fromTo("[data-seta]", { autoAlpha: 0, x: -4 }, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05 }, "<0.12");
    },
    { scope: raiz, dependencies: [categoria] },
  );

  return (
    <div ref={raiz} className="grid gap-10 py-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14 md:py-10 [@media(max-height:820px)]:md:py-6">
      {/* Celular inteiro na tela (o rodapé do vídeo traz preço e ficha): a largura sai da altura que sobra abaixo do topo da moldura
          (~396 px; ~291 px em telas baixas), menos a barra de resumo quando há plano escolhido */}
      <div
        data-demo-celular=""
        style={{ "--folga-resumo": selecao ? "80px" : "0px" } as CSSProperties}
        className="mx-auto w-full max-w-[320px] md:mx-0 md:w-[clamp(200px,calc((100dvh-405px-var(--folga-resumo))*0.5625),320px)] [@media(max-height:820px)]:md:w-[clamp(200px,calc((100dvh-300px-var(--folga-resumo))*0.5625),320px)]"
      >
        {/* Escondido enquanto a cópia dele está na tela cheia (VideoTelaCheia) */}
        <div
          ref={celular}
          style={{ visibility: ampliado ? "hidden" : undefined }}
          className="rounded-[34px] bg-ink p-2 shadow-[0_30px_60px_-24px_rgb(0_72_155/0.45)]"
        >
          <div className="aspect-[9/16] overflow-hidden rounded-[27px] bg-primary-50">
            <Midia
              key={categoria}
              caminho={`${base}.video`}
              rotulo={`Vídeo de exemplo do ${cat.nome}`}
              aoAmpliar={setAmpliado}
              reserva={
                reserva ? (
                  <ReservaImagem src={reserva.src} alt={`Foto real de imóvel, base do vídeo ${cat.nome}`} selo={d.selo} efeito={reserva.efeito} />
                ) : (
                  <PostsBRLuani selo={d.selo} />
                )
              }
            />
          </div>
        </div>
      </div>

      {ampliado && (
        <VideoTelaCheia video={ampliado} origem={celular} rotulo={`Vídeo de exemplo do ${cat.nome}`} aoFechar={voltarDaTelaCheia} />
      )}

      <div className="min-w-0">
        <p data-demo-anima="" className="flex items-center gap-2 text-[14px] text-ink-2">
          <Orbe categoria={categoria} /> <Editable caminho={`categorias.${categoria}.nivel`} rotulo="nível de vídeo" />
        </p>
        <h2 data-demo-anima="" className="mt-3 font-display text-[44px] leading-none font-medium tracking-[-0.03em] text-ink md:text-[52px]">
          <Editable caminho={`${base}.titulo`} rotulo="título da demo" />
        </h2>
        <p data-demo-anima="" className="mt-5 max-w-[60ch] text-[18px] leading-relaxed text-ink">
          <Editable caminho={`${base}.oQueE`} rotulo="o que é" />
        </p>

        <div className="mt-8" data-lanterna-grupo="">
          <h3 data-demo-anima="" className="text-[13px] font-medium tracking-wide text-ink-2 uppercase">
            <Editable caminho="demo.passosTitulo" rotulo="título dos passos" />
          </h3>
          <ListaEditavel
            caminho="demo.passos"
            rotuloNovo="Adicionar passo"
            className="mt-4 grid gap-y-6 sm:grid-cols-2 sm:gap-x-10 xl:grid-cols-3 [&>li]:relative [&>li]:flex"
            render={(texto, i) => (
              <>
                <div
                  data-passo=""
                  data-lanterna="ciano"
                  className="relative flex flex-1 items-center gap-3 overflow-hidden rounded-2xl bg-white p-4 text-[15px] leading-snug text-ink shadow-[0_1px_2px_rgb(11_31_46/0.04),0_10px_28px_-14px_rgb(14_165_233/0.25)] [--lanterna-raio:220px] sm:flex-col sm:items-start"
                >
                  <Lanterna />
                  <span className="tabular relative grid size-7 shrink-0 place-items-center rounded-full gradient-acao-texto font-display text-[13px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="relative">{texto}</span>
                </div>
                <Seta indice={i} total={conteudo.demo.passos.length} />
              </>
            )}
          />
        </div>

        <div data-demo-anima="" className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h3 className="text-[13px] font-medium tracking-wide text-ink-2 uppercase">Para quem é</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-ink">
              <Editable caminho={`${base}.paraQuem`} rotulo="para quem é" />
            </p>
          </div>
          <div>
            <h3 className="text-[13px] font-medium tracking-wide text-ink-2 uppercase">Destaques</h3>
            <ListaEditavel
              caminho={`${base}.destaques`}
              rotuloNovo="Adicionar destaque"
              className="mt-2 flex flex-wrap gap-2"
              render={(texto) => (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[14px] text-ink">
                  <Check className="size-3.5 text-primary-700" strokeWidth={2.2} />
                  {texto}
                </span>
              )}
            />
          </div>
        </div>

        <figure data-demo-anima="" className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-line bg-white/70 px-5 py-4">
          <blockquote className="text-[15px] text-ink">
            <Editable caminho="mercado.texto" rotulo="dado de mercado" />
          </blockquote>
          <figcaption className="text-[13px] text-ink-2">
            Fonte: <Editable caminho="mercado.fonte" rotulo="fonte do dado" />
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
