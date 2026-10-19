import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, Flip, SplitText, DrawSVGPlugin, CustomEase, ScrollTrigger);

/** A curva da casa: --ease-out-soft */
export const SOFT = CustomEase.create("soft", "0.22,1,0.36,1");

export const reduzMovimento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Mouse de verdade (não toque) e movimento liberado: condição dos efeitos de ponteiro. */
export const MOUSE_COM_MOVIMENTO = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export { gsap, Flip, SplitText, ScrollTrigger, useGSAP };
