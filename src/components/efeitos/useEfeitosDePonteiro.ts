import { gsap, useGSAP, MOUSE_COM_MOVIMENTO } from "../../lib/gsap";

/** Inclinação máxima dos cards, em graus para cada lado. Pequena de propósito: na call vira profundidade, não balanço. */
const INCLINACAO = 3;
/** Quanto um botão com ímã anda até o mouse (px), na horizontal e na vertical. O rótulo anda metade disso a mais. */
const IMA_X = 6;
const IMA_Y = 4;

type QuickTo = ReturnType<typeof gsap.quickTo>;

const adminLigado = () => document.documentElement.hasAttribute("data-admin");
const elemento = (alvo: EventTarget | null) => (alvo instanceof Element ? alvo : null);
const limitar = gsap.utils.clamp(-1, 1);

/**
 * Efeitos de ponteiro por delegação no documento: valem para tudo que tiver o data-atributo,
 * inclusive o que entra depois (troca de categoria, popover, barra de resumo, modais).
 *
 * - `data-lanterna` (card) e `data-lanterna-grupo` (grade): luz que segue o mouse dentro do card
 *   e acende a borda dos cards vizinhos. Os spans de luz vêm do componente <Lanterna />.
 * - `data-tilt`: inclinação 3D leve na direção do mouse.
 * - `data-magnetico`: o botão é puxado de leve pelo mouse; `data-magnetico-filho` (o rótulo) anda mais.
 * - `data-onda`: onda de luz que nasce do ponto do clique ou do toque.
 *
 * Com o admin ligado, inclinação e ímã param: nada se mexe debaixo de um campo sendo editado.
 */
export function useEfeitosDePonteiro() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOUSE_COM_MOVIMENTO, () => {
      let px = 0;
      let py = 0;

      // ── Lanterna ──────────────────────────────────────────────────────
      let grupo: Element | null = null;
      let cardAceso: Element | null = null;
      let quadro = 0;

      // Lê todas as caixas, depois escreve todas as posições: uma leitura de layout por quadro
      const escrever = () => {
        quadro = 0;
        if (!grupo) return;
        const cards = grupo.hasAttribute("data-lanterna")
          ? [grupo as HTMLElement]
          : Array.from(grupo.querySelectorAll<HTMLElement>("[data-lanterna]"));
        const caixas = cards.map((c) => c.getBoundingClientRect());
        cards.forEach((c, i) => {
          c.style.setProperty("--mx", `${px - caixas[i].left}px`);
          c.style.setProperty("--my", `${py - caixas[i].top}px`);
        });
      };
      const pedirQuadro = () => {
        if (grupo && !quadro) quadro = requestAnimationFrame(escrever);
      };

      const iluminar = (alvo: Element) => {
        const g = alvo.closest("[data-lanterna-grupo]") ?? alvo.closest("[data-lanterna]");
        if (g !== grupo) {
          grupo?.removeAttribute("data-lanterna-ativa");
          grupo = g;
          grupo?.setAttribute("data-lanterna-ativa", "");
        }
        const c = alvo.closest("[data-lanterna]");
        if (c !== cardAceso) {
          cardAceso?.removeAttribute("data-lanterna-acesa");
          cardAceso = c;
          cardAceso?.setAttribute("data-lanterna-acesa", "");
        }
        pedirQuadro();
      };

      // ── Inclinação ────────────────────────────────────────────────────
      const inclinacoes = new WeakMap<HTMLElement, { rx: QuickTo; ry: QuickTo }>();
      let inclinado: HTMLElement | null = null;
      const inclinacaoDe = (el: HTMLElement) => {
        let t = inclinacoes.get(el);
        if (!t) {
          gsap.set(el, { transformPerspective: 900 });
          t = {
            rx: gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" }),
            ry: gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" }),
          };
          inclinacoes.set(el, t);
        }
        return t;
      };
      const endireitar = (el: HTMLElement | null) => {
        if (!el) return;
        const t = inclinacaoDe(el);
        t.rx(0);
        t.ry(0);
      };
      const inclinar = (alvo: Element) => {
        const el = adminLigado() ? null : alvo.closest<HTMLElement>("[data-tilt]");
        if (el !== inclinado) {
          endireitar(inclinado);
          inclinado = el;
        }
        if (!el) return;
        const r = el.getBoundingClientRect();
        const nx = limitar(((px - r.left) / r.width - 0.5) * 2);
        const ny = limitar(((py - r.top) / r.height - 0.5) * 2);
        const t = inclinacaoDe(el);
        t.ry(nx * INCLINACAO);
        t.rx(-ny * INCLINACAO);
      };

      // ── Ímã ───────────────────────────────────────────────────────────
      const imas = new WeakMap<HTMLElement, { x: QuickTo; y: QuickTo; fx?: QuickTo; fy?: QuickTo }>();
      let atraido: HTMLElement | null = null;
      let centro = { x: 0, y: 0, meiaL: 1, meiaA: 1 };
      const imaDe = (el: HTMLElement) => {
        let q = imas.get(el);
        if (!q) {
          const filho = el.querySelector<HTMLElement>("[data-magnetico-filho]");
          const vars = { duration: 0.5, ease: "power3" };
          q = {
            x: gsap.quickTo(el, "x", vars),
            y: gsap.quickTo(el, "y", vars),
            fx: filho ? gsap.quickTo(filho, "x", vars) : undefined,
            fy: filho ? gsap.quickTo(filho, "y", vars) : undefined,
          };
          imas.set(el, q);
        }
        return q;
      };
      const soltar = (el: HTMLElement | null) => {
        if (!el) return;
        const q = imaDe(el);
        q.x(0);
        q.y(0);
        q.fx?.(0);
        q.fy?.(0);
      };
      const atrair = (alvo: Element) => {
        let el = alvo.closest<HTMLElement>("[data-magnetico]");
        // Popover aberto ou admin: o botão fica parado
        if (el && (adminLigado() || el.getAttribute("data-state") === "open")) el = null;
        if (el !== atraido) {
          soltar(atraido);
          atraido = el;
          if (el) {
            // Centro de repouso: a caixa medida menos o quanto ele já andou
            const r = el.getBoundingClientRect();
            centro = {
              x: r.left + r.width / 2 - Number(gsap.getProperty(el, "x")),
              y: r.top + r.height / 2 - Number(gsap.getProperty(el, "y")),
              meiaL: r.width / 2,
              meiaA: r.height / 2,
            };
          }
        }
        if (!el) return;
        const nx = limitar((px - centro.x) / centro.meiaL);
        const ny = limitar((py - centro.y) / centro.meiaA);
        const q = imaDe(el);
        q.x(nx * IMA_X);
        q.y(ny * IMA_Y);
        q.fx?.(nx * IMA_X * 0.5);
        q.fy?.(ny * IMA_Y * 0.5);
      };

      // ── Eventos ───────────────────────────────────────────────────────
      const mover = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const alvo = elemento(e.target);
        if (!alvo) return;
        px = e.clientX;
        py = e.clientY;
        iluminar(alvo);
        inclinar(alvo);
        atrair(alvo);
      };
      const apagarTudo = () => {
        grupo?.removeAttribute("data-lanterna-ativa");
        cardAceso?.removeAttribute("data-lanterna-acesa");
        grupo = cardAceso = null;
        endireitar(inclinado);
        soltar(atraido);
        inclinado = atraido = null;
      };
      const saiuDaJanela = (e: MouseEvent) => {
        if (!e.relatedTarget) apagarTudo();
      };

      document.addEventListener("pointermove", mover, { passive: true });
      window.addEventListener("scroll", pedirQuadro, { passive: true });
      window.addEventListener("mouseout", saiuDaJanela);
      window.addEventListener("blur", apagarTudo);
      return () => {
        document.removeEventListener("pointermove", mover);
        window.removeEventListener("scroll", pedirQuadro);
        window.removeEventListener("mouseout", saiuDaJanela);
        window.removeEventListener("blur", apagarTudo);
        cancelAnimationFrame(quadro);
        apagarTudo();
      };
    });

    // Onda de luz no clique e no toque; no toque, a lanterna do card também acende onde o dedo encostou
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let apagar = 0;
      const tocar = (e: PointerEvent) => {
        if (e.button !== 0) return;
        const alvo = elemento(e.target);
        if (!alvo) return;

        const botao = alvo.closest<HTMLElement>("[data-onda]");
        if (botao && !(botao as HTMLButtonElement).disabled) {
          const r = botao.getBoundingClientRect();
          const d = Math.hypot(r.width, r.height) * 2;
          const onda = document.createElement("span");
          onda.className = "onda";
          onda.setAttribute("aria-hidden", "true");
          Object.assign(onda.style, {
            width: `${d}px`,
            height: `${d}px`,
            left: `${e.clientX - r.left - d / 2}px`,
            top: `${e.clientY - r.top - d / 2}px`,
          });
          botao.appendChild(onda);
          gsap.fromTo(
            onda,
            { scale: 0, opacity: 1 },
            { scale: 1, opacity: 0, duration: 0.75, ease: "power2.out", onComplete: () => onda.remove() },
          );
        }

        if (e.pointerType !== "mouse") {
          const card = alvo.closest<HTMLElement>("[data-lanterna]");
          if (!card) return;
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
          card.setAttribute("data-lanterna-acesa", "");
          card.setAttribute("data-lanterna-ativa", "");
          clearTimeout(apagar);
          apagar = window.setTimeout(() => {
            card.removeAttribute("data-lanterna-acesa");
            card.removeAttribute("data-lanterna-ativa");
          }, 650);
        }
      };
      document.addEventListener("pointerdown", tocar, { passive: true });
      return () => {
        document.removeEventListener("pointerdown", tocar);
        clearTimeout(apagar);
      };
    });
  });
}
