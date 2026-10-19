// Só carrega com o admin ligado (React.lazy). Mostra parâmetros, custo e margem do personalizado.
import { useEffect, useState } from "react";
import { useApp, precoDoPersonalizado } from "../store";
import { Editable } from "./Editable";
import { formatarBRL } from "../../lib/preco";
import type * as Calc from "../../data/calculadora-admin";

const pct = (v: number) => `${(v * 100).toFixed(1).replace(".", ",")}%`;
const num = (casas: number) => (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: 3 });

export default function AdminCalcPanel({ categoria }: { categoria: "pro" | "max" }) {
  const { conteudo, personalizado, parametrosAdmin } = useApp();
  const [calc, setCalc] = useState<typeof Calc | null>(null);
  useEffect(() => {
    import("../../data/calculadora-admin").then(setCalc);
  }, []);

  const base = `categorias.${categoria}.personalizado.parametros`;
  const { duracao, videos } = personalizado[categoria];
  // margem é sobre o preço do plano, sem acessórios
  const preco = precoDoPersonalizado(conteudo, categoria, personalizado, []);

  const r =
    calc && parametrosAdmin
      ? calc.calcularMargem(
          preco.base,
          preco.precoPorVideoBase,
          videos,
          duracao,
          parametrosAdmin.custoPorSegundoUSD[categoria],
          parametrosAdmin.dolar,
        )
      : null;
  const alvo = parametrosAdmin?.margemAlvo ?? 0;

  return (
    <section
      data-admin-ui=""
      aria-label="Calculadora interna"
      className="mt-4 rounded-2xl border-[1.5px] border-dashed border-primary bg-white p-4 text-[13px]"
    >
      <p className="text-[12px] font-semibold tracking-wide text-primary-700 uppercase">Calculadora interna · só admin</p>

      <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
        <Linha rotulo="Base mensal">
          <Editable caminho={`${base}.base`} tipo="dinheiro" formatar={(v: number) => formatarBRL(v)} />
        </Linha>
        <Linha rotulo="Taxa fixa por vídeo">
          <Editable caminho={`${base}.taxaFixa`} tipo="dinheiro" formatar={(v: number) => formatarBRL(v)} />
        </Linha>
        <Linha rotulo="Preço/s até 15 s">
          <Editable caminho={`${base}.precoAte15`} tipo="dinheiro" formatar={(v: number) => formatarBRL(v)} />
        </Linha>
        <Linha rotulo="Preço/s acima de 15 s">
          <Editable caminho={`${base}.precoAcima15`} tipo="dinheiro" formatar={(v: number) => formatarBRL(v)} />
        </Linha>
        {parametrosAdmin && (
          <>
            <Linha rotulo="Custo API/s (US$)">
              <Editable caminho={`admin.custoPorSegundoUSD.${categoria}`} tipo="decimal" formatar={num(3)} />
            </Linha>
            <Linha rotulo="Dólar efetivo">
              <Editable caminho="admin.dolar" tipo="dinheiro" formatar={(v: number) => formatarBRL(v)} />
            </Linha>
            <Linha rotulo="Margem mínima alvo">
              <Editable caminho="admin.margemAlvo" tipo="percentual" formatar={(v: number) => `${Math.round(v * 100)}%`} />
            </Linha>
          </>
        )}
      </dl>

      <p className="mt-4 text-[12px] font-semibold tracking-wide text-ink-2 uppercase">Limites dos controles</p>
      <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
        <Linha rotulo="Duração mín / máx / passo (s)">
          <Editable caminho="limites.duracaoMin" tipo="duracao" /> /{" "}
          <Editable caminho="limites.duracaoMax" tipo="duracao" /> /{" "}
          <Editable caminho="limites.duracaoPasso" tipo="duracao" />
        </Linha>
        <Linha rotulo="Vídeos mín / máx">
          <Editable caminho="limites.videosMin" tipo="inteiro" /> / <Editable caminho="limites.videosMax" tipo="inteiro" />
        </Linha>
      </dl>

      {r ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Resultado rotulo="Custo API/mês" valor={formatarBRL(r.custoMensal)} />
          <Resultado rotulo="Lucro bruto" valor={formatarBRL(r.lucroBruto)} ok={r.lucroBruto >= 0} />
          <Resultado rotulo="Margem total" valor={pct(r.margemTotal)} ok={r.margemTotal >= alvo} alvo />
          <Resultado rotulo="Margem por vídeo" valor={pct(r.margemPorVideo)} ok={r.margemPorVideo >= alvo} alvo />
        </div>
      ) : (
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-primary-50" />
      )}
      <p className="mt-3 text-[12px] text-ink-2">
        Base {formatarBRL(preco.base - videos * preco.precoPorVideoBase)} + {videos} × {formatarBRL(preco.precoPorVideoBase)} por vídeo
      </p>
    </section>
  );
}

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-ink-2">{rotulo}</dt>
      <dd className="tabular text-right font-medium text-ink">{children}</dd>
    </>
  );
}

function Resultado({ rotulo, valor, ok, alvo }: { rotulo: string; valor: string; ok?: boolean; alvo?: boolean }) {
  const cor = ok === undefined ? "text-ink" : ok ? "text-ok" : "text-bad";
  const fundo = ok === undefined ? "bg-bg" : ok ? "bg-[#e9f7f0]" : "bg-[#fdecec]";
  return (
    <div className={`rounded-xl p-2.5 ${fundo}`}>
      <p className="text-[11px] text-ink-2">{rotulo}</p>
      <p className={`tabular mt-0.5 font-display text-[16px] font-semibold ${cor}`}>{valor}</p>
      {alvo && ok !== undefined && <p className={`text-[11px] ${cor}`}>{ok ? "acima do alvo" : "abaixo do alvo"}</p>}
    </div>
  );
}
