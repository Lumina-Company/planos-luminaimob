import type { RefObject } from "react";
import { gsap, useGSAP, reduzMovimento } from "../../lib/gsap";

/**
 * Revela a seção quando ela entra na tela (uma vez só). `montar` recebe a timeline já presa à rolagem;
 * os seletores ficam presos à seção. Com movimento reduzido, a seção já aparece pronta.
 * O que deve ficar escondido antes do JS leva `data-revela` (ver `.intro` no global.css).
 */
export function useRevelar(
  secao: RefObject<HTMLElement | null>,
  montar: (tl: gsap.core.Timeline) => void,
  inicio = "top 88%",
) {
  useGSAP(
    () => {
      if (reduzMovimento() || !secao.current) return;
      const tl = gsap.timeline({
        defaults: { ease: "soft" },
        scrollTrigger: { trigger: secao.current, start: inicio, once: true },
      });
      montar(tl);
    },
    { scope: secao },
  );
}
