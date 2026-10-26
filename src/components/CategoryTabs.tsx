import { useLayoutEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { CATEGORIAS, type CategoriaId } from "../data/planos";
import { useApp } from "./store";
import { gsap, useGSAP, Flip, reduzMovimento } from "../lib/gsap";

/** Orbes das abas, como os pontos coloridos da referência; rampa da marca do claro ao profundo. */
export const ORBE: Record<CategoriaId, string> = {
  essencial: "radial-gradient(circle at 32% 30%, #ffffff 0%, #A6E2FB 38%, #33BEF4 100%)",
  pro: "radial-gradient(circle at 32% 30%, #DFF1FD 0%, #33BEF4 34%, #0EA5E9 70%, #0A84FF 100%)",
};

export function Orbe({ categoria, className = "size-3" }: { categoria: CategoriaId; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-orbe=""
      className={`inline-block shrink-0 rounded-full shadow-[inset_0_-1px_1px_rgb(0_72_155/0.25)] ${className}`}
      style={{ background: ORBE[categoria] }}
    />
  );
}

export function CategoryTabs() {
  const { conteudo, categoria, setCategoria } = useApp();
  const lista = useRef<HTMLDivElement>(null);
  const indicador = useRef<HTMLSpanElement>(null);
  const sombra = useRef<HTMLSpanElement>(null);
  const primeira = useRef(true);
  const { contextSafe } = useGSAP({ scope: lista });

  // Fundo da pílula ativa desliza até a nova (Flip): mede, muda a posição e anima a diferença.
  // A orbe da nova categoria acende junto.
  useLayoutEffect(() => {
    const ind = indicador.current;
    const btn = lista.current?.querySelector<HTMLElement>(`[data-cat="${categoria}"]`);
    if (!ind || !btn) return;
    const estado = Flip.getState(ind);
    ind.style.left = `${btn.offsetLeft}px`;
    ind.style.width = `${btn.offsetWidth}px`;
    ind.style.opacity = "1";
    if (primeira.current || reduzMovimento()) {
      primeira.current = false;
      return;
    }
    Flip.from(estado, { duration: 0.32, ease: "power2.inOut", scale: true, overwrite: true });
    gsap.fromTo(
      btn.querySelector("[data-orbe]"),
      { scale: 0.55 },
      { scale: 1, duration: 0.5, ease: "back.out(2.2)", overwrite: true },
    );
  }, [categoria]);

  // Com mouse, uma sombra clara segue de aba em aba antes do clique (só desliza; quem marca é o indicador)
  const pousar = contextSafe((e: PointerEvent<HTMLButtonElement>) => {
    const s = sombra.current;
    if (!s || e.pointerType !== "mouse" || reduzMovimento()) return;
    const btn = e.currentTarget;
    if (Number(gsap.getProperty(s, "opacity")) < 0.05) gsap.set(s, { x: btn.offsetLeft, width: btn.offsetWidth });
    gsap.to(s, { x: btn.offsetLeft, width: btn.offsetWidth, autoAlpha: 1, duration: 0.32, ease: "soft", overwrite: "auto" });
  });
  const sair = contextSafe(() => {
    gsap.to(sombra.current, { autoAlpha: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
  });

  // Reposiciona sem animar se a largura mudar (fonte carregando, janela, admin editando o nome)
  useLayoutEffect(() => {
    const el = lista.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const btn = el.querySelector<HTMLElement>('[aria-selected="true"]');
      const ind = indicador.current;
      if (!btn || !ind) return;
      ind.style.left = `${btn.offsetLeft}px`;
      ind.style.width = `${btn.offsetWidth}px`;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const teclado = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = CATEGORIAS.indexOf(categoria);
    const prox = CATEGORIAS[(i + (e.key === "ArrowRight" ? 1 : CATEGORIAS.length - 1)) % CATEGORIAS.length];
    setCategoria(prox);
    lista.current?.querySelector<HTMLElement>(`[data-cat="${prox}"]`)?.focus();
  };

  return (
    <div
      ref={lista}
      role="tablist"
      aria-label="Categorias de plano"
      onKeyDown={teclado}
      onPointerLeave={sair}
      className="relative flex h-[52px] w-full items-center rounded-full border border-line bg-white/55 p-1 backdrop-blur-sm sm:inline-flex sm:w-auto"
    >
      <span
        ref={sombra}
        aria-hidden="true"
        className="invisible absolute top-1 bottom-1 left-0 rounded-full bg-primary-100/70 opacity-0"
      />
      <span
        ref={indicador}
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-full border border-line bg-white opacity-0 shadow-[0_1px_2px_rgb(11_31_46/0.06),0_6px_16px_-8px_rgb(14_165_233/0.35)]"
      />
      {CATEGORIAS.map((id) => {
        const ativo = id === categoria;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            data-cat={id}
            aria-selected={ativo}
            tabIndex={ativo ? 0 : -1}
            onClick={() => setCategoria(id)}
            onPointerEnter={pousar}
            data-onda="escuro"
            className={`group/aba relative z-[1] flex h-11 flex-1 items-center justify-center overflow-hidden rounded-full px-5 text-[15px] transition-colors duration-150 sm:flex-none ${
              ativo ? "font-medium text-ink" : "text-ink-2 hover:text-ink"
            }`}
          >
            <span className="relative z-[1] inline-flex items-center gap-2.5">
              <Orbe categoria={id} className="size-3 transition-[scale] duration-300 ease-[var(--ease-out-soft)] group-hover/aba:scale-125" />
              {conteudo.categorias[id].nome}
            </span>
          </button>
        );
      })}
    </div>
  );
}
