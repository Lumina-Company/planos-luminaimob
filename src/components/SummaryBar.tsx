import { useRef, useState } from "react";
import { Handshake, X } from "lucide-react";
import { useApp, precoDaSelecao, PERSONALIZADO, type Selecao } from "./store";
import { Orbe } from "./CategoryTabs";
import { NumeroAnimado } from "./NumeroAnimado";
import { FecharVenda, type DadosFechamento } from "./FecharVenda";
import { nomeDoPlano, descricaoVolume } from "../lib/resumo";
import { gsap, useGSAP, reduzMovimento } from "../lib/gsap";

export function SummaryBar() {
  const { conteudo, selecao: escolhida, setSelecao, personalizado, ligados } = useApp();
  const barra = useRef<HTMLDivElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const [fechamento, setFechamento] = useState<DadosFechamento | null>(null);
  // A barra continua na tela com a última seleção enquanto desce (Limpar ou desmarcar no card)
  const [mostrada, setMostrada] = useState<Selecao | null>(escolhida);
  if (escolhida && escolhida !== mostrada) setMostrada(escolhida);
  const visivel = !!escolhida;

  // Sobe do rodapé: 450 ms back.out(1.4). Desce em 280 ms e só então sai do DOM.
  useGSAP(
    () => {
      if (!barra.current) return;
      if (visivel) {
        if (reduzMovimento()) gsap.fromTo(barra.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, overwrite: true });
        else
          gsap.fromTo(
            barra.current,
            { yPercent: 140, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "back.out(1.4)", overwrite: true },
          );
        return;
      }
      gsap.to(barra.current, {
        ...(reduzMovimento() ? { autoAlpha: 0, duration: 0.1 } : { yPercent: 140, autoAlpha: 0, duration: 0.28, ease: "power2.in" }),
        overwrite: true,
        onComplete: () => setMostrada(null),
      });
    },
    { dependencies: [visivel] },
  );

  const selecao = escolhida ?? mostrada;
  if (!selecao) return null;
  const cat = conteudo.categorias[selecao.categoria];
  const preco = precoDaSelecao(conteudo, selecao, personalizado, ligados);
  if (!preco) return null;
  const faixa = selecao.faixaId === PERSONALIZADO ? null : (cat.faixas.find((f) => f.id === selecao.faixaId) ?? null);
  const acessorios = preco.aplicaveis.map((id) => conteudo.acessorios[id]);

  const nome = nomeDoPlano(cat, faixa);
  const volume = descricaoVolume(preco.videos, preco.duracao);
  const detalhe = [volume, ...acessorios.map((a) => a.nome)].join(" · ");

  // "Fechar": abre a tela de fechamento com o que foi pedido (o preço sai do mesmo cálculo da barra)
  const fecharVenda = () =>
    setFechamento({ nome, volume, acessorios: acessorios.map((a) => a.nome), total: preco.total });

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:pb-5">
        <div
          ref={barra}
          role="region"
          aria-label="Resumo do plano escolhido"
          data-cursor-claro=""
          className="pointer-events-auto flex w-full max-w-[920px] flex-col gap-3 rounded-[26px] bg-ink p-3 text-white shadow-[0_24px_60px_-20px_rgb(11_31_46/0.65)] sm:flex-row sm:items-center sm:rounded-full sm:py-2.5 sm:pr-2.5 sm:pl-5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-2 sm:px-0">
            <Orbe categoria={selecao.categoria} className="size-4" />
            <div className="min-w-0" aria-live="polite">
              <p className="truncate font-display text-[17px] font-medium">
                {nome}
                {acessorios.length > 0 && <span className="text-white/70"> + {acessorios.map((a) => a.nome).join(" + ")}</span>}
              </p>
              <p className="truncate text-[13px] text-white/65">{detalhe}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 px-2 sm:justify-end sm:px-0">
            <p className="mr-2 flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-[14px] text-white/70">R$</span>
              <NumeroAnimado valor={preco.total} className="font-display text-[28px] leading-none font-medium tracking-[-0.02em]" />
              <span className="text-[13px] text-white/70">/mês</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                ref={botaoFechar}
                type="button"
                onClick={fecharVenda}
                data-magnetico=""
                data-onda=""
                className="relative isolate inline-flex h-11 items-center overflow-hidden rounded-full gradient-fechar px-4 text-[14px] font-semibold text-white shadow-[0_10px_26px_-10px_rgb(15_122_77/0.85)] transition-[scale,filter] duration-150 hover:brightness-[1.12] active:scale-[0.97]"
              >
                <span data-magnetico-filho="" className="relative z-[1] inline-flex items-center gap-2">
                  <Handshake className="size-4" strokeWidth={2} />
                  Fechar
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelecao(null)}
                data-onda=""
                className="relative isolate inline-flex h-11 items-center gap-1.5 overflow-hidden rounded-full px-3.5 text-[14px] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" /> Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {fechamento && <FecharVenda dados={fechamento} origem={botaoFechar} aoFechar={() => setFechamento(null)} />}
    </>
  );
}
