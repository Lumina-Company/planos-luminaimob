import { Fragment, lazy, Suspense, useEffect, useRef } from "react";
import {
  BadgeCheck,
  Captions,
  Database,
  LayoutDashboard,
  Play,
  Send,
  Store,
  Frame,
  Check,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIAS } from "../data/planos";
import { AppProvider, useApp } from "./store";
import { Logo } from "./Logo";
import { CategoryTabs, Orbe } from "./CategoryTabs";
import { AccessoriesMenu } from "./AccessoriesMenu";
import { PlanCard } from "./PlanCard";
import { CustomCard } from "./CustomCard";
import { DemoPanel } from "./DemoPanel";
import { SummaryBar } from "./SummaryBar";
import { Editable, ListaEditavel } from "./admin/Editable";
import { Cursor } from "./efeitos/Cursor";
import { FundoVivo } from "./efeitos/FundoVivo";
import { Lanterna } from "./efeitos/Lanterna";
import { useEfeitosDePonteiro } from "./efeitos/useEfeitosDePonteiro";
import { useRevelar } from "./efeitos/useRevelar";
import { ComoComecamos } from "./ComoComecamos";
import { gsap, useGSAP, ScrollTrigger, reduzMovimento } from "../lib/gsap";

const AdminBanner = lazy(() => import("./admin/AdminBanner"));

const ICONES_INCLUSOS: LucideIcon[] = [Database, Captions, BadgeCheck, Send, LayoutDashboard, Store, Frame];

export default function PricingApp() {
  return (
    <AppProvider>
      <Pagina />
    </AppProvider>
  );
}

function emCampo(alvo: EventTarget | null) {
  const el = alvo as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

function Pagina() {
  const { conteudo, categoria, demo, setDemo, admin, setAdmin, desfazer, refazer } = useApp();
  const raiz = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const anterior = useRef({ categoria, demo });
  const trocando = useRef<gsap.core.Tween | null>(null);

  useEfeitosDePonteiro();

  // L liga/desliga o admin; Esc desliga. Nunca dentro de um campo de texto (docs/06).
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (emCampo(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === "l" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setAdmin(!admin);
      } else if (e.key === "Escape" && admin) {
        setAdmin(false);
      } else if (admin && (e.ctrlKey || e.metaKey) && k === "z") {
        e.preventDefault();
        if (e.shiftKey) refazer();
        else desfazer();
      } else if (admin && (e.ctrlKey || e.metaKey) && k === "y") {
        e.preventDefault();
        refazer();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [admin, setAdmin, desfazer, refazer]);

  // Os efeitos de ponteiro param a inclinação e o ímã com o admin ligado
  useEffect(() => {
    document.documentElement.toggleAttribute("data-admin", admin);
  }, [admin]);

  // Abertura: a aurora clareia, a lâmpada desenha o traço e acende; o título entra por palavras
  // e uma luz o atravessa; o resto sobe 16 px.
  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "soft" } });
        // fromTo com valores finais explícitos: a classe .intro esconde por visibility e o autoAlpha leria 0
        const sobe = { y: 0, autoAlpha: 1, duration: 0.56, stagger: 0.06, clearProps: "transform,opacity,visibility" };
        tl.fromTo("[data-aurora]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "power1.out" }, 0)
          .fromTo("[data-logo] .traco", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, stagger: 0.05, ease: "power2.inOut" }, 0)
          .fromTo("[data-luz]", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, "-=0.25")
          .fromTo("[data-palavra]", { yPercent: 110 }, { yPercent: 0, duration: 0.56, stagger: 0.06 }, 0.15)
          .fromTo(
            "[data-palavra]",
            { backgroundPosition: "100% 0%" },
            { backgroundPosition: "0% 0%", duration: 0.8, stagger: 0.08, ease: "power2.inOut" },
            0.5,
          )
          .fromTo("[data-intro]", { y: 16, autoAlpha: 0 }, sobe, 0.3)
          .fromTo("[data-area] [data-card]", { y: 16, autoAlpha: 0 }, sobe, 0.4);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo("[data-intro], [data-area]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 });
      });
      document.documentElement.classList.remove("intro");
    },
    { scope: raiz },
  );

  // Troca de categoria: os cards novos entram do lado para onde se andou (Essencial → Pro vem da direita).
  // Troca preços ↔ demo: o conteúdo novo sobe; a demo coreografa a própria entrada (DemoPanel).
  useGSAP(
    () => {
      const antes = anterior.current;
      anterior.current = { categoria, demo };
      if (antes.categoria === categoria && antes.demo === demo) return; // montagem

      ScrollTrigger.refresh(); // a altura do miolo mudou: as seções de baixo se revelam no ponto certo
      if (reduzMovimento()) {
        gsap.fromTo(area.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, overwrite: true });
        return;
      }

      const mudouModo = antes.demo !== demo;
      const dir = mudouModo ? 0 : Math.sign(CATEGORIAS.indexOf(categoria) - CATEGORIAS.indexOf(antes.categoria));
      if (mudouModo) gsap.set(area.current, { clearProps: "opacity,visibility,transform" });
      if (!demo) {
        gsap.fromTo(
          "[data-area] [data-card]",
          { autoAlpha: 0, x: dir * 36, y: dir ? 0 : 18 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.45,
            ease: "soft",
            stagger: { each: 0.06, from: dir < 0 ? "end" : "start" },
            overwrite: true,
            clearProps: "transform",
          },
        );
      }
      if (!mudouModo) {
        gsap.fromTo(
          "[data-linha-cat] > *",
          { autoAlpha: 0, x: dir * 10 },
          { autoAlpha: 1, x: 0, duration: 0.34, stagger: 0.03, ease: "soft", overwrite: true },
        );
      }
    },
    { scope: raiz, dependencies: [categoria, demo] },
  );

  // O ícone do botão de demo gira para dentro quando troca (▶ ↔ preços)
  const iconeMontado = useRef(false);
  useGSAP(
    () => {
      if (!iconeMontado.current) {
        iconeMontado.current = true;
        return;
      }
      if (reduzMovimento()) return;
      gsap.fromTo(
        "[data-icone-demo]",
        { scale: 0.4, rotation: -90, autoAlpha: 0 },
        { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.45, ease: "back.out(1.8)" },
      );
    },
    { scope: raiz, dependencies: [demo] },
  );

  // Preços ↔ demo: o conteúdo atual sai (200 ms) e só então o novo entra. Clicar de novo no meio corta a saída.
  const alternarDemo = contextSafe(() => {
    if (trocando.current) {
      trocando.current.kill();
      trocando.current = null;
      setDemo(!demo);
      return;
    }
    if (reduzMovimento()) {
      setDemo(!demo);
      return;
    }
    trocando.current = gsap.to(area.current, {
      autoAlpha: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        trocando.current = null;
        setDemo(!demo);
      },
    });
  });

  const cat = conteudo.categorias[categoria];

  return (
    <div ref={raiz} className={`relative min-h-[100dvh] pb-36 ${admin ? "pt-11" : ""}`}>
      <a
        href="#planos"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para os planos
      </a>

      <FundoVivo />

      {admin && (
        <Suspense fallback={null}>
          <AdminBanner />
        </Suspense>
      )}

      <header className="mx-auto flex h-[72px] max-w-[1240px] items-center px-4 sm:px-8 [@media(max-height:820px)]:h-16">
        <Logo />
      </header>

      <main id="planos" className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <h1
          data-titulo=""
          className="pt-8 pb-10 font-display text-[44px] leading-[1.02] font-medium tracking-[-0.035em] text-ink sm:text-[60px] md:pt-12 [@media(min-width:640px)_and_(max-height:820px)]:pt-2 [@media(min-width:640px)_and_(max-height:820px)]:pb-7 [@media(min-width:640px)_and_(max-height:820px)]:text-[48px]"
        >
          {admin ? <Editable caminho="site.titulo" rotulo="título" /> : <TituloPorPalavras texto={conteudo.site.titulo} />}
        </h1>

        {/* Linha de controles: categorias + demo à esquerda, acessórios à direita (no lugar do "Monthly billing") */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div data-intro="" className="w-full sm:w-auto">
            <CategoryTabs />
          </div>
          <div data-intro="" className="flex items-center gap-3 sm:contents">
            <button
              type="button"
              onClick={alternarDemo}
              aria-pressed={demo}
              data-magnetico=""
              data-onda={demo ? "" : "escuro"}
              data-cursor-claro={demo ? "" : undefined}
              className={`group relative isolate inline-flex h-[52px] flex-1 items-center justify-center overflow-hidden rounded-full border pr-4 pl-2 text-[14px] font-medium whitespace-nowrap sm:pr-5 sm:text-[15px] transition-[background-color,border-color,color,scale,box-shadow] duration-200 active:scale-[0.98] sm:flex-none ${
                demo
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white/55 text-ink backdrop-blur-sm hover:border-line-strong hover:bg-white hover:shadow-[0_10px_28px_-16px_rgb(14_165_233/0.5)]"
              }`}
            >
              <span data-magnetico-filho="" className="relative z-[1] inline-flex items-center gap-2 sm:gap-2.5">
                <span
                  className={`grid size-9 place-items-center rounded-full transition-colors ${demo ? "bg-white/15" : "gradient-acao text-ink"}`}
                >
                  <span key={demo ? "precos" : "play"} data-icone-demo="" className="grid place-items-center">
                    {demo ? <PrecoIcone /> : <Play className="size-3.5 translate-x-[1px] fill-current" />}
                  </span>
                </span>
                {demo ? conteudo.site.botaoPrecos : conteudo.site.botaoDemo}
              </span>
            </button>
            <div className="flex-1 sm:ml-auto sm:flex-none [&>button]:w-full sm:[&>button]:w-auto">
              <AccessoriesMenu />
            </div>
          </div>
        </div>

        {/* Linha de descrição da categoria ativa */}
        <p
          data-intro=""
          data-linha-cat=""
          className="mt-6 [@media(max-height:820px)]:mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-2"
        >
          <Orbe categoria={categoria} />
          <span className="font-medium text-ink">
            <Editable caminho={`categorias.${categoria}.nome`} rotulo="nome da categoria" />
          </span>
          <span aria-hidden="true">·</span>
          <Editable caminho={`categorias.${categoria}.descricao`} rotulo="descrição da categoria" />
        </p>
      </main>

      {/* Cards soltos, só com espaço entre eles; a lanterna acende a borda dos vizinhos */}
      <section aria-label={demo ? "Como funciona" : `Planos ${cat.nome}`} className="mt-8 [@media(max-height:820px)]:mt-6">
        <div ref={area} data-area="" className="mx-auto max-w-[1240px] px-4 sm:px-8">
          {demo ? (
            <DemoPanel />
          ) : (
            <div data-lanterna-grupo="" className="grid gap-12 md:grid-cols-3 md:gap-6 lg:gap-8">
              {cat.faixas.map((f, i) => (
                <div key={f.id} data-card="">
                  <PlanCard categoria={categoria} faixa={f} indice={i} />
                </div>
              ))}
              <div data-card="">
                <CustomCard categoria={categoria} />
              </div>
            </div>
          )}
        </div>
      </section>

      <Inclusos />
      <ComoComecamos />
      <Condicoes />
      <SummaryBar />
      <Cursor />
    </div>
  );
}

/** Título dividido em palavras pelo próprio React (o GSAP só anima, não mexe no DOM). */
function TituloPorPalavras({ texto }: { texto: string }) {
  const palavras = texto.split(/\s+/).filter(Boolean);
  return (
    <>
      <span className="sr-only">{texto}</span>
      {/* O espaço fica fora do inline-block: dentro, no fim da linha dele, o navegador o descarta */}
      {palavras.map((p, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-palavra="" className="texto-brilho inline-block">
              {p}
            </span>
          </span>
          {i < palavras.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

function PrecoIcone() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
      <rect x="1.5" y="2.5" width="4" height="11" rx="1.2" />
      <rect x="6.5" y="2.5" width="4" height="11" rx="1.2" />
      <rect x="11.5" y="2.5" width="3" height="11" rx="1" />
    </svg>
  );
}

function Inclusos() {
  const { conteudo } = useApp();
  const secao = useRef<HTMLElement>(null);

  // O painel sobe; os ícones acendem em sequência e os textos vêm logo atrás
  useRevelar(secao, (tl) => {
    tl.fromTo("[data-revela]", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.6 })
      .fromTo(
        "[data-incluso-icone]",
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.05, ease: "back.out(1.7)" },
        0.2,
      )
      .fromTo("[data-incluso-texto]", { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05 }, 0.26);
  });

  return (
    <section ref={secao} className="mx-auto max-w-[1240px] px-4 pt-20 sm:px-8">
      <div
        data-revela=""
        data-lanterna="ciano"
        className="relative grid gap-8 overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-[var(--shadow-card)] [--lanterna-raio:520px] sm:p-10 md:grid-cols-3 md:gap-10"
      >
        <Lanterna />
        <div className="relative">
          <h2 className="font-display text-[30px] leading-tight font-medium tracking-[-0.02em] text-ink">
            <Editable caminho="inclusos.titulo" rotulo="título dos inclusos" />
          </h2>
          <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ink-2">
            Essencial e Pro. Muda o nível do vídeo; o resto vem em todos.
          </p>
        </div>
        <ListaEditavel
          caminho="inclusos.itens"
          rotuloNovo="Adicionar incluso"
          className="relative grid gap-x-8 gap-y-5 sm:grid-cols-2 md:col-span-2"
          render={(texto, i) => {
            const Icone = ICONES_INCLUSOS[i] ?? Check;
            return (
              <div className="group/incluso flex items-start gap-3.5 text-[15px] leading-[22px] text-ink">
                <span
                  data-incluso-icone=""
                  className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-100/70 text-primary-700 transition-[color,translate] duration-300 ease-[var(--ease-out-soft)] group-hover/incluso:-translate-y-0.5 group-hover/incluso:text-white"
                >
                  <span
                    aria-hidden="true"
                    className="gradient-acao-texto absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/incluso:opacity-100"
                  />
                  <Icone className="relative size-[18px]" strokeWidth={1.7} />
                </span>
                <span data-incluso-texto="" className="min-w-0 flex-1 pt-[7px]">
                  {texto}
                </span>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}

function Condicoes() {
  const secao = useRef<HTMLElement>(null);

  // As condições entram uma a uma. Começa com a seção ainda no pé da tela: é o fim da página.
  useRevelar(
    secao,
    (tl) => {
      tl.fromTo("[data-revela]", { autoAlpha: 0, y: 12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07 });
    },
    "top bottom-=24",
  );

  return (
    <section ref={secao} className="mx-auto max-w-[1240px] px-4 sm:px-8">
      <ListaEditavel
        caminho="condicoes"
        rotuloNovo="Adicionar condição"
        className="flex flex-wrap items-center justify-center gap-3"
        render={(texto) => (
          <span
            data-revela=""
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-[15px] font-medium text-ink shadow-[0_1px_2px_rgb(11_31_46/0.04)]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-primary-100 text-primary-700">
              <Check className="size-3" strokeWidth={2.6} />
            </span>
            {texto}
          </span>
        )}
      />
    </section>
  );
}
