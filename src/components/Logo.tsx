import { useRef, type PointerEvent } from "react";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";

/**
 * Lâmpada em traço com trilhas de circuito no lugar do filamento (até existir o SVG oficial, tarefa P5).
 * Os traços têm a classe "traco" para o DrawSVG; o brilho "luz" acende depois.
 * Com o mouse por cima, a lâmpada reacende: o circuito se redesenha do centro e o brilho pulsa.
 */
export function Logo({ className = "" }: { className?: string }) {
  const raiz = useRef<HTMLSpanElement>(null);
  const { contextSafe } = useGSAP({ scope: raiz });

  const reacender = contextSafe((e: PointerEvent) => {
    if (e.pointerType !== "mouse" || reduzMovimento()) return;
    gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .fromTo(".traco", { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.6, stagger: 0.03, ease: "power2.inOut" }, 0)
      .fromTo("[data-luz]", { autoAlpha: 0.2, scale: 0.6 }, { autoAlpha: 1, scale: 1.25, duration: 0.35, ease: "power2.out" }, 0.25)
      .to("[data-luz]", { scale: 1, duration: 0.5, ease: "soft" });
  });

  return (
    <span ref={raiz} className={`inline-flex items-center gap-2.5 ${className}`} data-logo="" onPointerEnter={reacender}>
      <span className="relative grid size-9 place-items-center">
        <span
          data-luz=""
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(51_190_244/0.45)_0%,rgb(14_165_233/0.12)_45%,transparent_70%)]"
        />
        <svg
          viewBox="0 0 32 32"
          className="relative size-8"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path className="traco" d="M11.6 22.4c0-2.7-4.6-4.8-4.6-10.1a9 9 0 0 1 18 0c0 5.3-4.6 7.4-4.6 10.1" />
          <path className="traco" d="M12 25.6h8" />
          <path className="traco" d="M13.6 28.8h4.8" />
          <path className="traco" stroke="#0A84FF" d="M16 22.4v-6.6l-3.2-3.2v-2.2" />
          <path className="traco" stroke="#0A84FF" d="M16 15.8l3.2-3.2v-2.2" />
          <circle className="traco" stroke="#0A84FF" cx="12.8" cy="9.4" r="1.2" />
          <circle className="traco" stroke="#0A84FF" cx="19.2" cy="9.4" r="1.2" />
        </svg>
      </span>
      <span className="font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">
        Lumina<span className="text-primary-700">Imob</span>
      </span>
    </span>
  );
}
