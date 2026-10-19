import { useRef } from "react";
import { gsap, useGSAP, MOUSE_COM_MOVIMENTO } from "../../lib/gsap";

/** Onde o sistema volta a mostrar o cursor de texto (campos e textos editáveis do admin). */
const TEXTO = 'input, textarea, [contenteditable="true"], .editavel';
const CLICAVEL =
  'a[href], button:not(:disabled), [role="tab"], [role="switch"], [role="slider"], label[for], [data-cursor="link"]';

type Estado = "base" | "link" | "rotulo" | "texto";

/**
 * Diâmetro do ponto (px) em cada estado. Cresce pelo tamanho real, não por `scale`:
 * escala amplia a imagem de 6 px já desenhada e o ponto fica borrado. Sempre par: o centro cai em pixel inteiro.
 */
const TAMANHO = { base: 6, link: 10, some: 2 };
const apertado = (t: number) => Math.max(2, Math.round(t * 0.35) * 2);

/**
 * Cursor da casa: um ponto preciso, colado no mouse (é ali que o clique acontece).
 * - sobre o que é clicável, o ponto cresce e ganha o azul da marca;
 * - sobre `data-cursor-rotulo`, vira uma pílula com o texto (ex.: "Ampliar" no vídeo);
 * - sobre texto editável, some e volta o cursor de texto do sistema;
 * - dentro de `data-cursor-claro` (cards azuis, barra escura), fica branco.
 * Só com mouse e movimento liberado; no toque e com movimento reduzido, fica o cursor do sistema.
 */
export function Cursor() {
  const raiz = useRef<HTMLDivElement>(null);
  const seguidor = useRef<HTMLDivElement>(null);
  const ponto = useRef<HTMLDivElement>(null);
  const pilula = useRef<HTMLSpanElement>(null);
  const texto = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOUSE_COM_MOVIMENTO, () => {
      const html = document.documentElement;
      html.setAttribute("data-cursor-proprio", "");
      gsap.set(pilula.current, { xPercent: -50, yPercent: -50, scale: 0.4, autoAlpha: 0 });
      gsap.set(ponto.current, { xPercent: -50, yPercent: -50, force3D: false });

      const x = gsap.quickSetter(seguidor.current, "x", "px");
      const y = gsap.quickSetter(seguidor.current, "y", "px");

      let visivel = false;
      let ultimoX = 0;
      let ultimoY = 0;
      let releitura = 0;
      let estado: Estado = "base";
      let claro = false;
      let rotulo = "";
      let tamanho = TAMANHO.base;

      const pintar = () => {
        const some = estado === "rotulo" || estado === "texto";
        tamanho = estado === "link" ? TAMANHO.link : TAMANHO.base;
        gsap.to(ponto.current, {
          width: some ? TAMANHO.some : tamanho,
          height: some ? TAMANHO.some : tamanho,
          autoAlpha: some ? 0 : 1,
          backgroundColor: claro ? "#ffffff" : estado === "link" ? "#0a84ff" : "#0b1f2e",
          duration: 0.24,
          ease: "soft",
          overwrite: "auto",
        });
        if (estado === "rotulo" && texto.current) texto.current.textContent = rotulo;
        gsap.to(pilula.current, {
          autoAlpha: estado === "rotulo" ? 1 : 0,
          scale: estado === "rotulo" ? 1 : 0.4,
          backgroundColor: claro ? "#ffffff" : "#0b1f2e",
          color: claro ? "#0b1f2e" : "#ffffff",
          duration: 0.32,
          ease: "soft",
          overwrite: "auto",
        });
      };

      const ler = (alvo: EventTarget | null) => {
        if (!(alvo instanceof Element)) return;
        const comRotulo = alvo.closest<HTMLElement>("[data-cursor-rotulo]");
        const novo: Estado = alvo.closest(TEXTO)
          ? "texto"
          : comRotulo
            ? "rotulo"
            : alvo.closest(CLICAVEL)
              ? "link"
              : "base";
        const novoClaro = !!alvo.closest("[data-cursor-claro]");
        const novoRotulo = comRotulo?.dataset.cursorRotulo ?? "";
        if (novo === estado && novoClaro === claro && novoRotulo === rotulo) return;
        estado = novo;
        claro = novoClaro;
        rotulo = novoRotulo;
        pintar();
      };

      // O que está sob o mouse pode mudar sem ele se mexer (clique que troca o botão, rolagem): relê no quadro seguinte
      const reler = () => {
        if (!visivel || releitura) return;
        releitura = requestAnimationFrame(() => {
          releitura = 0;
          ler(document.elementFromPoint(ultimoX, ultimoY));
        });
      };

      const mover = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        ultimoX = e.clientX;
        ultimoY = e.clientY;
        x(e.clientX);
        y(e.clientY);
        if (visivel) return;
        // Primeiro movimento (ou volta à janela)
        visivel = true;
        ler(e.target);
        gsap.to(raiz.current, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      };
      const sobre = (e: PointerEvent) => {
        if (e.pointerType === "mouse") ler(e.target);
      };
      const apertar = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || estado === "rotulo" || estado === "texto") return;
        const t = apertado(tamanho);
        gsap.to(ponto.current, { width: t, height: t, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      };
      const soltar = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (estado !== "rotulo" && estado !== "texto") {
          gsap.to(ponto.current, { width: tamanho, height: tamanho, duration: 0.28, ease: "soft", overwrite: "auto" });
        }
        // o clique costuma trocar o que está embaixo: na hora (Escolher → Escolhido) ou depois da saída (preços ↔ demo)
        setTimeout(reler, 60);
        setTimeout(reler, 320);
      };
      const esconder = () => {
        visivel = false;
        gsap.to(raiz.current, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
      };
      const saiuDaJanela = (e: MouseEvent) => {
        if (!e.relatedTarget) esconder();
      };

      document.addEventListener("pointermove", mover, { passive: true });
      document.addEventListener("pointerover", sobre, { passive: true });
      document.addEventListener("pointerdown", apertar, { passive: true });
      document.addEventListener("pointerup", soltar, { passive: true });
      window.addEventListener("mouseout", saiuDaJanela);
      window.addEventListener("blur", esconder);
      window.addEventListener("scroll", reler, { passive: true });
      return () => {
        cancelAnimationFrame(releitura);
        html.removeAttribute("data-cursor-proprio");
        document.removeEventListener("pointermove", mover);
        document.removeEventListener("pointerover", sobre);
        document.removeEventListener("pointerdown", apertar);
        document.removeEventListener("pointerup", soltar);
        window.removeEventListener("mouseout", saiuDaJanela);
        window.removeEventListener("blur", esconder);
        window.removeEventListener("scroll", reler);
      };
    });
  });

  return (
    <div ref={raiz} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[200] opacity-0">
      <div ref={seguidor} className="absolute top-0 left-0 will-change-transform">
        <div ref={ponto} className="absolute top-0 left-0 size-1.5 rounded-full bg-ink" />
        <span
          ref={pilula}
          className="absolute top-0 left-0 inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium whitespace-nowrap text-white shadow-[0_10px_30px_-10px_rgb(11_31_46/0.45)]"
        >
          <span className="size-1.5 rounded-full bg-primary-400" />
          <span ref={texto} />
        </span>
      </div>
    </div>
  );
}
