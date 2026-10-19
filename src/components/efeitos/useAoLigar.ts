import { useRef, type RefObject } from "react";
import { useGSAP, reduzMovimento } from "../../lib/gsap";

/**
 * Roda `animar` só quando `ligado` passa de falso para verdadeiro: não na montagem já ligada
 * (ex.: voltar a uma categoria com card escolhido) e nunca com movimento reduzido.
 * Seletores dentro de `animar` ficam presos ao `escopo`.
 */
export function useAoLigar(ligado: boolean, escopo: RefObject<HTMLElement | null>, animar: () => void) {
  const antes = useRef(ligado);
  useGSAP(
    () => {
      const era = antes.current;
      antes.current = ligado;
      if (ligado && !era && !reduzMovimento()) animar();
    },
    { scope: escopo, dependencies: [ligado] },
  );
}
