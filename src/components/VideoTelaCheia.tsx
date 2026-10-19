import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Dialog } from "radix-ui";
import { Volume2, VolumeX, X } from "lucide-react";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";
import { SEM_BOTOES_DO_NAVEGADOR } from "./Midia";

/** Celular da demo (DemoPanel): moldura de 8 px (p-2), cantos de 34 px por fora e 27 px na tela. */
const MOLDURA = 8;
const CANTO = 34;
const CANTO_TELA = 27;
/** A mesma sombra azul do celular; apaga na tela cheia, onde viraria um halo no fundo escuro. */
const SOMBRA = "0px 30px 60px -24px rgba(0, 72, 155, 0.45)";
const SOMBRA_APAGADA = "0px 30px 60px -24px rgba(0, 72, 155, 0)";

type Caixa = { left: number; top: number; width: number; height: number };

function medir(el: HTMLElement): Caixa {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

/** Celular no centro da janela, a 82% da altura e na proporção do original. Devolve também quanto cresceu. */
function noCentro(o: Caixa): [Caixa, number] {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  let height = vh * 0.82;
  let width = (height * o.width) / o.height;
  if (width > vw * 0.9) {
    width = vw * 0.9;
    height = (width * o.height) / o.width;
  }
  return [{ left: (vw - width) / 2, top: (vh - height) / 2, width, height }, height / o.height];
}

/**
 * Tela cheia: o maior 9:16 que cabe inteiro na janela. Na tela deitada, altura toda com escuro dos lados;
 * no celular em pé, largura toda com escuro em cima e embaixo (sem cortar a ficha do imóvel).
 */
function telaCheia(): Caixa {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const width = Math.min(vw, (vh * 9) / 16);
  const height = (width * 16) / 9;
  return { left: (vw - width) / 2, top: (vh - height) / 2, width, height };
}

/**
 * Vídeo da demo em tela cheia. O celular sai da página, vem para o centro crescendo,
 * a moldura se dissolve no fundo escuro e o vídeo toma a tela, já com som.
 * Fechar (clique, X ou Esc) faz o caminho de volta até o lugar do celular.
 */
export function VideoTelaCheia({
  video,
  origem,
  rotulo,
  aoFechar,
}: {
  /** Vídeo da página: dá o quadro atual e o ponto de onde continuar. */
  video: HTMLVideoElement;
  /** Moldura do celular na página: de onde sai e para onde volta. */
  origem: RefObject<HTMLElement | null>;
  rotulo: string;
  /** Recebe o tempo em que o vídeo parou, para a página continuar dali. */
  aoFechar: (tempo: number) => void;
}) {
  const fundo = useRef<HTMLDivElement>(null);
  const aparelho = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLDivElement>(null);
  const quadro = useRef<HTMLCanvasElement>(null);
  const filme = useRef<HTMLVideoElement>(null);
  const controles = useRef<HTMLDivElement>(null);
  const abertura = useRef<gsap.core.Timeline | null>(null);
  const fechando = useRef(false);
  const [mudo, setMudo] = useState(false);

  const { contextSafe } = useGSAP(() => {
    const f = filme.current!;
    const c = quadro.current!;
    const o = medir(origem.current!);
    const [centro, escala] = noCentro(o);

    // O quadro em que o vídeo da página parou fica por baixo até o da tela cheia carregar: sem piscar
    try {
      c.width = video.videoWidth || 720;
      c.height = video.videoHeight || 1280;
      c.getContext("2d")?.drawImage(video, 0, 0, c.width, c.height);
    } catch {
      /* sem quadro: fica o fundo escuro */
    }
    video.pause();

    // Continua do mesmo ponto, agora com som (o clique libera o áudio); se o navegador barrar, segue mudo
    const tocar = () => {
      f.currentTime = video.currentTime;
      f.play().catch(() => {
        f.muted = true;
        setMudo(true);
        f.play().catch(() => {});
      });
    };
    if (f.readyState >= 1) tocar();
    else f.addEventListener("loadedmetadata", tocar, { once: true });

    gsap.set(aparelho.current, { ...o, padding: MOLDURA, borderRadius: CANTO, boxShadow: SOMBRA });
    gsap.set(tela.current, { borderRadius: CANTO_TELA });

    if (reduzMovimento()) {
      gsap.set(aparelho.current, { ...telaCheia(), padding: 0, borderRadius: 0 });
      gsap.set(tela.current, { borderRadius: 0 });
      gsap.fromTo([fundo.current, aparelho.current, controles.current], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: "none" });
      return;
    }

    const som = { v: 0 };
    f.volume = 0;
    abertura.current = gsap
      .timeline({ defaults: { ease: "power3.inOut" } })
      .fromTo(fundo.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0)
      .to(som, { v: 1, duration: 1, ease: "none", onUpdate: () => { f.volume = som.v; } }, 0)
      // 1. o celular sai da página e vem para o centro, crescendo
      .to(aparelho.current, { ...centro, padding: MOLDURA * escala, borderRadius: CANTO * escala, duration: 0.6 }, 0)
      .to(tela.current, { borderRadius: CANTO_TELA * escala, duration: 0.6 }, 0)
      // 2. a moldura se dissolve no fundo (mesma cor) e o vídeo toma a tela
      .to(
        aparelho.current,
        {
          left: () => telaCheia().left,
          top: () => telaCheia().top,
          width: () => telaCheia().width,
          height: () => telaCheia().height,
          padding: 0,
          borderRadius: 0,
          boxShadow: SOMBRA_APAGADA,
          duration: 0.55,
          ease: "expo.inOut",
        },
        0.55,
      )
      .to(tela.current, { borderRadius: 0, duration: 0.55, ease: "expo.inOut" }, "<")
      .fromTo(controles.current, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "soft" }, ">-0.1");
  });

  // Janela mudou de tamanho com o vídeo aberto: a tela cheia acompanha
  useEffect(() => {
    const ajustar = () => {
      if (!fechando.current && !abertura.current?.isActive()) gsap.set(aparelho.current, telaCheia());
    };
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, []);

  const fechar = contextSafe(() => {
    if (fechando.current) return;
    fechando.current = true;
    abertura.current?.kill();
    const f = filme.current!;
    const fim = () => aoFechar(f.currentTime);

    if (reduzMovimento()) {
      gsap.to([fundo.current, aparelho.current, controles.current], { autoAlpha: 0, duration: 0.15, ease: "none", onComplete: fim });
      return;
    }

    // Caminho de volta: encolhe para o celular no centro e desce até o lugar dele na página
    const o = medir(origem.current!);
    const [centro, escala] = noCentro(o);
    const som = { v: f.volume };
    gsap
      .timeline({ defaults: { ease: "power3.inOut" }, onComplete: fim })
      .to(som, { v: 0, duration: 0.5, ease: "none", onUpdate: () => { f.volume = som.v; } }, 0)
      .to(controles.current, { autoAlpha: 0, duration: 0.15, ease: "none" }, 0)
      .to(aparelho.current, { ...centro, padding: MOLDURA * escala, borderRadius: CANTO * escala, boxShadow: SOMBRA, duration: 0.5, ease: "expo.inOut" }, 0)
      .to(tela.current, { borderRadius: CANTO_TELA * escala, duration: 0.5, ease: "expo.inOut" }, 0)
      .to(aparelho.current, { ...o, padding: MOLDURA, borderRadius: CANTO, duration: 0.6 }, 0.45)
      .to(tela.current, { borderRadius: CANTO_TELA, duration: 0.6 }, "<")
      .to(fundo.current, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "<");
  });

  const alternarSom = () => {
    const f = filme.current;
    if (!f) return;
    f.muted = !f.muted;
    setMudo(f.muted);
  };

  const botao =
    "grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20";

  return createPortal(
    <Dialog.Root open onOpenChange={(aberto) => !aberto && fechar()}>
      <Dialog.Overlay ref={fundo} className="fixed inset-0 z-[80] bg-ink" />
      <Dialog.Content
        aria-describedby={undefined}
        // Esc fecha com animação e não chega ao atalho do admin (Esc também desliga o admin)
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fechar();
        }}
        className="fixed inset-0 z-[81] outline-none"
      >
        <Dialog.Title className="sr-only">{rotulo}</Dialog.Title>

        <div ref={aparelho} className="pointer-events-none fixed bg-ink">
          <div ref={tela} className="relative size-full overflow-hidden bg-ink">
            <canvas ref={quadro} aria-hidden="true" className="absolute inset-0 size-full object-cover" />
            <video
              ref={filme}
              src={video.currentSrc || video.src}
              className="absolute inset-0 size-full object-cover"
              loop
              playsInline
              preload="auto"
              {...SEM_BOTOES_DO_NAVEGADOR}
            />
          </div>
        </div>

        {/* Clicar em qualquer lugar volta ao celular; a camada também tira o mouse de cima do <video> */}
        <div aria-hidden="true" onClick={fechar} data-cursor-rotulo="Fechar" data-cursor-claro="" className="absolute inset-0 cursor-zoom-out" />

        <div ref={controles} data-cursor-claro="" className="absolute top-4 right-4 flex gap-2 sm:top-6 sm:right-6">
          <button type="button" onClick={alternarSom} aria-label={mudo ? "Ligar o som" : "Desligar o som"} className={botao}>
            {mudo ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <button type="button" onClick={fechar} aria-label="Sair da tela cheia" className={botao}>
            <X className="size-5" />
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>,
    document.body,
  );
}
