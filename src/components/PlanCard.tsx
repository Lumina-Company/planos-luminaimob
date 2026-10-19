import { useRef, type ReactNode } from "react";
import { Check, CornerRightDown, Film, Timer, Infinity as InfinityIcon, Info, Wand2 } from "lucide-react";
import type { CategoriaId, Faixa } from "../data/planos";
import { useApp, precoDaFaixa, type PrecoCard } from "./store";
import { Editable, ListaEditavel } from "./admin/Editable";
import { NumeroAnimado } from "./NumeroAnimado";
import { Lanterna } from "./efeitos/Lanterna";
import { useAoLigar } from "./efeitos/useAoLigar";
import { formatarBRL } from "../lib/preco";
import { gsap } from "../lib/gsap";

// ── Peças compartilhadas pelos cards ────────────────────────────────────

/**
 * Tons dos planos fixos, em escada do céu ao profundo (1º, 2º, 3º card da categoria).
 * O canto de baixo, onde fica o texto pequeno, é sempre o mais fundo: texto branco com contraste.
 */
const TONS = [
  "radial-gradient(65% 80% at 92% 6%, rgb(214 242 254 / .95) 0%, rgb(103 210 249 / .75) 32%, transparent 70%), radial-gradient(55% 65% at 0% 0%, rgb(51 190 244 / .85), transparent 70%), linear-gradient(165deg, #1FA9F1 0%, #0B92EE 45%, #0274DC 100%)",
  "radial-gradient(58% 72% at 88% 12%, rgb(166 226 251 / .9) 0%, rgb(51 190 244 / .7) 34%, transparent 68%), radial-gradient(60% 70% at 105% 100%, rgb(14 165 233 / .8) 0%, transparent 62%), radial-gradient(40% 50% at 10% 0%, rgb(10 132 255 / .9), transparent 70%), linear-gradient(160deg, #0A84FF 0%, #0067D6 46%, #00489B 100%)",
  "radial-gradient(55% 70% at 88% 10%, rgb(51 190 244 / .65) 0%, rgb(10 132 255 / .4) 38%, transparent 70%), radial-gradient(50% 60% at 100% 100%, rgb(10 132 255 / .45), transparent 65%), linear-gradient(160deg, #0067D6 0%, #00489B 50%, #0A2C57 100%)",
];

/** Bloco de cima do card, como a "arte" da referência: nome em cima, preço embaixo. Sem `tom`, card branco. */
export function ArteCard({
  tom,
  selecionado,
  cabeca,
  linhaPreco,
  preco,
}: {
  tom?: number;
  selecionado: boolean;
  cabeca: ReactNode;
  linhaPreco: ReactNode;
  preco: ReactNode;
}) {
  const azul = tom !== undefined;
  const arte = useRef<HTMLDivElement>(null);

  // "Escolher" acende o card: a borda aparece, uma faixa de luz atravessa a arte e ela respira uma vez
  useAoLigar(selecionado, arte, () => {
    gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .fromTo("[data-borda-escolhido]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32, ease: "soft" }, 0)
      .fromTo("[data-brilho]", { xPercent: 0, skewX: -18, autoAlpha: 1 }, { xPercent: 420, duration: 0.95, ease: "power2.inOut" }, 0)
      .to("[data-brilho]", { autoAlpha: 0, duration: 0.2 }, 0.75)
      .fromTo(arte.current, { scale: 1 }, { scale: 1.012, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1 }, 0);
  });

  return (
    <div
      ref={arte}
      data-arte=""
      data-tom={azul ? tom : "branco"}
      data-tilt=""
      data-lanterna={azul ? "claro" : "ciano"}
      data-cursor-claro={azul ? "" : undefined}
      className={`relative flex h-[212px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-6 transition-[translate,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] will-change-transform group-hover/card:-translate-y-1 ${
        azul
          ? "grain text-white shadow-[0_18px_40px_-20px_rgb(0_72_155/0.55)] [--grain-opacity:.5] group-hover/card:shadow-[0_26px_52px_-20px_rgb(0_72_155/0.6)]"
          : "border border-line bg-white text-ink shadow-[var(--shadow-card)] group-hover/card:shadow-[var(--shadow-card-hover)]"
      }`}
      style={azul ? { background: TONS[Math.min(tom, TONS.length - 1)] } : undefined}
    >
      <Lanterna />
      {selecionado && (
        <span
          aria-hidden="true"
          data-borda-escolhido=""
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-[2px] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
          style={{ background: azul ? "linear-gradient(90deg,#fff,#A6E2FB,#fff)" : "linear-gradient(90deg,#33BEF4,#0EA5E9,#0A84FF)" }}
        />
      )}
      <span
        aria-hidden="true"
        data-brilho=""
        className={`pointer-events-none invisible absolute inset-y-0 -left-1/3 w-1/3 opacity-0 ${
          azul
            ? "bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.42),transparent)]"
            : "bg-[linear-gradient(90deg,transparent,rgb(51_190_244/0.22),transparent)]"
        }`}
      />
      <div className="relative">{cabeca}</div>
      <div className="relative">
        <div className={`min-h-[20px] text-[13px] leading-5 ${azul ? "text-white/90" : "text-ink-2"}`}>{linhaPreco}</div>
        <div className="mt-0.5 flex items-baseline gap-1.5">{preco}</div>
      </div>
    </div>
  );
}

export function BotaoEscolher({ selecionado, aoClicar, rotulo }: { selecionado: boolean; aoClicar: () => void; rotulo: string }) {
  const { conteudo } = useApp();
  const botao = useRef<HTMLButtonElement>(null);

  // O ✓ de "Escolhido" se desenha
  useAoLigar(selecionado, botao, () => {
    gsap.fromTo("svg path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, ease: "power2.out", delay: 0.06 });
  });

  return (
    <button
      ref={botao}
      type="button"
      onClick={aoClicar}
      aria-pressed={selecionado}
      aria-label={`${selecionado ? conteudo.site.escolhido : conteudo.site.escolher}: ${rotulo}`}
      data-magnetico=""
      data-onda=""
      data-cursor-claro=""
      className={`relative isolate mt-4 inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full text-[15px] font-medium transition-[scale,background-color,box-shadow] duration-150 active:scale-[0.98] ${
        selecionado
          ? "gradient-acao-texto text-white shadow-[0_10px_24px_-12px_rgb(10_132_255/0.7)]"
          : "bg-ink text-white hover:bg-[#13304a] hover:shadow-[0_12px_28px_-14px_rgb(11_31_46/0.6)]"
      }`}
    >
      <span data-magnetico-filho="" className="relative z-[1] inline-flex items-center gap-2">
        {selecionado && <Check className="size-[18px]" strokeWidth={2.2} />}
        {selecionado ? conteudo.site.escolhido : conteudo.site.escolher}
      </span>
    </button>
  );
}

export function ItemLista({ icone: Icone, children }: { icone: typeof Film; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2 text-[15px] leading-6 text-ink">
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary-100/70 text-primary-700">
        <Icone className="size-[14px]" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

export function RotuloLista({ children }: { children: ReactNode }) {
  return (
    <p className="mt-7 mb-1.5 flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-ink-2 uppercase">
      {children} <CornerRightDown className="size-3.5" strokeWidth={1.8} />
    </p>
  );
}

/** "R$ 619 + Locução" quando há acessório; senão, preço por vídeo. */
export function LinhaPreco({ preco, aceita }: { preco: PrecoCard; aceita: boolean }) {
  const { conteudo, ligados } = useApp();
  if (!aceita && ligados.length > 0) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Info className="size-3.5" strokeWidth={2} />
        <Editable caminho="site.ilimitadoSemAcessorios" rotulo="aviso do Ilimitado" />
      </span>
    );
  }
  if (preco.aplicaveis.length > 0) {
    const nomes = preco.aplicaveis.map((id) => conteudo.acessorios[id].nome.replace(/ por IA$/, "")).join(" + ");
    return (
      <span key={nomes} className="tabular animate-[fade-in_320ms_var(--ease-out-soft)]">
        {formatarBRL(preco.base)} + {nomes}
      </span>
    );
  }
  if (preco.porVideo) return <span className="tabular">{formatarBRL(preco.porVideo)} por vídeo</span>;
  return null;
}

export function Preco({ valor, claro, rapido }: { valor: number; claro: boolean; rapido?: boolean }) {
  return (
    <>
      <span className={`font-display text-[20px] font-medium ${claro ? "text-white/90" : "text-ink-2"}`}>R$</span>
      <NumeroAnimado valor={valor} rapido={rapido} className="font-display text-[44px] leading-none font-medium tracking-[-0.03em]" />
      <span className={`text-[14px] ${claro ? "text-white/85" : "text-ink-2"}`}>/mês</span>
    </>
  );
}

// ── Card de faixa fixa ─────────────────────────────────────────────────

export function PlanCard({ categoria, faixa, indice }: { categoria: CategoriaId; faixa: Faixa; indice: number }) {
  const { conteudo, ligados, selecao, setSelecao, admin } = useApp();
  const preco = precoDaFaixa(conteudo, faixa, ligados);
  const selecionado = selecao?.categoria === categoria && selecao.faixaId === faixa.id;
  const outroSelecionado = !!selecao && !selecionado;
  const base = `categorias.${categoria}.faixas.${indice}`;

  return (
    <article
      aria-label={faixa.nome}
      className={`group/card transition-opacity duration-300 ${outroSelecionado ? "opacity-[0.92]" : ""}`}
    >
      <ArteCard
        tom={indice}
        selecionado={selecionado}
        cabeca={
          <h3 className="font-display text-[26px] leading-tight font-medium tracking-[-0.02em]">
            <Editable caminho={`${base}.nome`} claro rotulo="nome da faixa" />
          </h3>
        }
        linhaPreco={<LinhaPreco preco={preco} aceita={faixa.aceitaAcessorios} />}
        preco={
          admin ? (
            <>
              <span className="font-display text-[20px] font-medium text-white/90">R$</span>
              <Editable
                caminho={`${base}.preco`}
                tipo="dinheiro"
                claro
                rotulo="preço da faixa"
                formatar={(v: number) => formatarBRL(v).replace(/^R\$\s?/, "")}
                className="tabular font-display text-[44px] leading-none font-medium tracking-[-0.03em]"
              />
              <span className="text-[14px] text-white/85">/mês</span>
            </>
          ) : (
            <Preco valor={preco.total} claro />
          )
        }
      />

      <BotaoEscolher
        selecionado={selecionado}
        rotulo={faixa.nome}
        aoClicar={() => setSelecao(selecionado ? null : { categoria, faixaId: faixa.id })}
      />

      <RotuloLista>Neste plano</RotuloLista>
      {faixa.videos === null ? (
        <ItemLista icone={InfinityIcon}>Vídeos ilimitados: posta todo imóvel novo da carteira</ItemLista>
      ) : (
        <ItemLista icone={Film}>
          <Editable caminho={`${base}.videos`} tipo="inteiro" rotulo="vídeos por mês" className="tabular font-medium" /> vídeos por
          mês
        </ItemLista>
      )}
      <ItemLista icone={Timer}>
        <Editable caminho={`${base}.duracao`} tipo="duracao" rotulo="duração" className="tabular" /> s por vídeo, vertical
      </ItemLista>
      <ItemLista icone={Wand2}>
        <Editable caminho={`categorias.${categoria}.nivel`} rotulo="nível de vídeo" />
      </ItemLista>
      <ListaEditavel
        caminho={`categorias.${categoria}.vantagens`}
        rotuloNovo="Adicionar vantagem"
        render={(texto) => <ItemLista icone={Check}>{texto}</ItemLista>}
      />
    </article>
  );
}
