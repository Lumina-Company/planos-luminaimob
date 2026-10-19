import { useRef } from "react";
import { gsap, useGSAP, MOUSE_COM_MOVIMENTO } from "../../lib/gsap";

/**
 * Fundo da página: aurora clara e grade de pontos no topo (fixas, rolam com a página)
 * e uma luz ciano bem fraca que acompanha o mouse devagar, por trás de tudo.
 * A luz só aparece nas áreas abertas; cards e painéis a cobrem.
 */
export function FundoVivo() {
  const luz = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOUSE_COM_MOVIMENTO, () => {
      const x = gsap.quickTo(luz.current, "x", { duration: 1.2, ease: "power3" });
      const y = gsap.quickTo(luz.current, "y", { duration: 1.2, ease: "power3" });
      let primeira = true;
      const mover = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (primeira) {
          primeira = false;
          x(e.clientX, e.clientX);
          y(e.clientY, e.clientY);
          gsap.to(luz.current, { autoAlpha: 1, duration: 1.2, ease: "power2.out" });
          return;
        }
        x(e.clientX);
        y(e.clientY);
      };
      window.addEventListener("pointermove", mover, { passive: true });
      return () => window.removeEventListener("pointermove", mover);
    });
  });

  return (
    <>
      <div aria-hidden="true" data-aurora="" className="fundo-aurora pointer-events-none absolute inset-x-0 top-0 -z-10 h-[780px]" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          ref={luz}
          className="invisible absolute top-0 left-0 -mt-[420px] -ml-[420px] size-[840px] rounded-full bg-[radial-gradient(circle,rgb(51_190_244/0.13)_0%,rgb(14_165_233/0.05)_38%,transparent_66%)] opacity-0 will-change-transform"
        />
      </div>
    </>
  );
}
