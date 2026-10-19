import { memo, useRef, useState } from "react";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";
import { formatarNumero } from "../lib/preco";

/**
 * Preço que conta do valor antigo ao novo (320 ms; 120 ms no slider).
 * O React só escreve o texto inicial; depois quem escreve é o GSAP, fora do ciclo de render.
 */
export const NumeroAnimado = memo(function NumeroAnimado({
  valor,
  rapido = false,
  className = "",
}: {
  valor: number;
  rapido?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const alvo = useRef({ v: valor });
  const [inicial] = useState(() => formatarNumero(valor));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const final = formatarNumero(valor);
      if (reduzMovimento() || alvo.current.v === valor) {
        gsap.killTweensOf(alvo.current);
        alvo.current.v = valor;
        el.textContent = final;
        return;
      }
      gsap.to(alvo.current, {
        v: valor,
        duration: rapido ? 0.12 : 0.32,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => {
          el.textContent = formatarNumero(Math.round(alvo.current.v));
        },
        onComplete: () => {
          el.textContent = final;
        },
      });
    },
    { dependencies: [valor] },
  );

  return (
    <span
      ref={ref}
      className={`tabular ${className}`}
      dangerouslySetInnerHTML={{ __html: inicial }}
    />
  );
});
