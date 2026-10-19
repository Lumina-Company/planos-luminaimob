import { lazy, Suspense } from "react";
import { Slider } from "radix-ui";
import { Check, SlidersHorizontal } from "lucide-react";
import { useApp, precoDoPersonalizado, PERSONALIZADO } from "./store";
import { ArteCard, BotaoEscolher, ItemLista, LinhaPreco, Preco, RotuloLista } from "./PlanCard";
import { Editable, ListaEditavel } from "./admin/Editable";

// Parâmetros, custo e margem: só existem no DOM com o admin ligado, e o código vem à parte.
const AdminCalcPanel = lazy(() => import("./admin/AdminCalcPanel"));

export function CustomCard({ categoria }: { categoria: "pro" | "max" }) {
  const { conteudo, ligados, selecao, setSelecao, personalizado, setPersonalizado, admin } = useApp();
  const cat = conteudo.categorias[categoria];
  const p = cat.personalizado!;
  const preco = precoDoPersonalizado(conteudo, categoria, personalizado, ligados);
  const { duracao, videos } = personalizado[categoria];
  const lim = conteudo.limites;
  const selecionado = selecao?.categoria === categoria && selecao.faixaId === PERSONALIZADO;
  const outroSelecionado = !!selecao && !selecionado;

  return (
    <article
      aria-label={`${cat.nome} ${p.nome}`}
      className={`group/card transition-opacity duration-300 ${outroSelecionado ? "opacity-[0.92]" : ""}`}
    >
      <ArteCard
        selecionado={selecionado}
        cabeca={
          <>
            <h3 className="font-display text-[26px] leading-tight font-medium tracking-[-0.02em]">
              <Editable caminho={`categorias.${categoria}.personalizado.nome`} rotulo="nome do personalizado" />
            </h3>
            <p className="mt-1.5 text-[14px] text-ink-2">
              <Editable caminho={`categorias.${categoria}.personalizado.descricao`} rotulo="descrição do personalizado" />
            </p>
          </>
        }
        linhaPreco={
          preco.aplicaveis.length > 0 ? (
            <LinhaPreco preco={preco} aceita />
          ) : (
            <span className="tabular">
              {videos} {videos === 1 ? "vídeo" : "vídeos"} × {duracao} s
            </span>
          )
        }
        preco={<Preco valor={preco.total} claro={false} rapido />}
      />

      <BotaoEscolher
        selecionado={selecionado}
        rotulo={`${cat.nome} ${p.nome}`}
        aoClicar={() => setSelecao(selecionado ? null : { categoria, faixaId: PERSONALIZADO })}
      />

      <RotuloLista>Monte na hora</RotuloLista>
      <div className="mb-3 space-y-5 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgb(11_31_46/0.04)]">
        <Controle
          id={`dur-${categoria}`}
          rotulo="Duração por vídeo"
          valor={duracao}
          sufixo=" s"
          min={lim.duracaoMin}
          max={lim.duracaoMax}
          passo={lim.duracaoPasso}
          aoMudar={(v) => setPersonalizado(categoria, { duracao: v })}
        />
        <Controle
          id={`qtd-${categoria}`}
          rotulo="Vídeos por mês"
          valor={videos}
          min={lim.videosMin}
          max={lim.videosMax}
          passo={1}
          aoMudar={(v) => setPersonalizado(categoria, { videos: v })}
        />
      </div>

      {admin ? (
        <Suspense fallback={<div className="mt-4 h-40 animate-pulse rounded-2xl bg-primary-50" />}>
          <AdminCalcPanel categoria={categoria} />
        </Suspense>
      ) : null}

      <ItemLista icone={SlidersHorizontal}>
        <Editable caminho={`categorias.${categoria}.nivel`} rotulo="nível de vídeo" />, do seu jeito
      </ItemLista>
      <ListaEditavel
        caminho={`categorias.${categoria}.vantagens`}
        rotuloNovo="Adicionar vantagem"
        render={(texto) => <ItemLista icone={Check}>{texto}</ItemLista>}
      />
    </article>
  );
}

function Controle({
  id,
  rotulo,
  valor,
  sufixo = "",
  min,
  max,
  passo,
  aoMudar,
}: {
  id: string;
  rotulo: string;
  valor: number;
  sufixo?: string;
  min: number;
  max: number;
  passo: number;
  aoMudar: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span id={`${id}-rotulo`} className="text-[14px] text-ink-2">
          {rotulo}
        </span>
        <span className="tabular font-display text-[18px] font-medium text-ink">
          {valor}
          {sufixo}
        </span>
      </div>
      <Slider.Root
        value={[valor]}
        min={min}
        max={max}
        step={passo}
        onValueChange={([v]) => aoMudar(v)}
        aria-labelledby={`${id}-rotulo`}
        className="relative mt-3 flex h-6 w-full touch-none items-center select-none"
      >
        <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-line">
          <Slider.Range className="absolute h-full rounded-full gradient-acao" />
        </Slider.Track>
        <Slider.Thumb
          aria-label={rotulo}
          aria-valuetext={`${valor}${sufixo}`}
          className="block size-6 rounded-full border-2 border-primary-600 bg-white shadow-[0_0_0_0_rgb(14_165_233/0),0_2px_6px_rgb(10_132_255/0.35)] transition-[scale,box-shadow] duration-200 ease-[var(--ease-out-soft)] hover:scale-110 hover:shadow-[0_0_0_7px_rgb(14_165_233/0.14),0_2px_6px_rgb(10_132_255/0.35)] focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-95 active:shadow-[0_0_0_10px_rgb(14_165_233/0.18),0_2px_6px_rgb(10_132_255/0.35)]"
        />
      </Slider.Root>
      <div className="tabular mt-1.5 flex justify-between text-[12px] text-ink-2">
        <span>
          {min}
          {sufixo}
        </span>
        <span>
          {max}
          {sufixo}
        </span>
      </div>
    </div>
  );
}
