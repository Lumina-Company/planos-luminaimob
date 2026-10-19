// Funções puras de preço. Não conhecem React.
import type { Acessorio, AcessorioId, ParametrosPersonalizado } from "../data/planos";

const arred = (v: number) => Math.round(v * 100) / 100;

/** preço por vídeo = taxa fixa + preço/s até 15 s × min(d, 15) + preço/s acima de 15 s × max(d − 15, 0) */
export function precoPorVideoPersonalizado(p: ParametrosPersonalizado, duracao: number): number {
  return arred(p.taxaFixa + p.precoAte15 * Math.min(duracao, 15) + p.precoAcima15 * Math.max(duracao - 15, 0));
}

/** preço mensal = base mensal + quantidade × preço por vídeo */
export function precoPersonalizado(p: ParametrosPersonalizado, videos: number, duracao: number): number {
  return arred(p.base + videos * precoPorVideoPersonalizado(p, duracao));
}

export function acessoriosAplicaveis(aceita: boolean, ligados: AcessorioId[]): AcessorioId[] {
  return aceita ? ligados : [];
}

export function somaAcessorios(ids: AcessorioId[], acessorios: Record<AcessorioId, Acessorio>): number {
  return arred(ids.reduce((s, id) => s + acessorios[id].preco, 0));
}

export function totalComAcessorios(
  precoBase: number,
  aceita: boolean,
  ligados: AcessorioId[],
  acessorios: Record<AcessorioId, Acessorio>,
): number {
  return arred(precoBase + somaAcessorios(acessoriosAplicaveis(aceita, ligados), acessorios));
}

const brlInteiro = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const brlCentavos = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** R$ 1.300 quando inteiro; R$ 12,38 quando tem centavos. */
export function formatarBRL(v: number): string {
  const r = arred(v);
  return Number.isInteger(r) ? brlInteiro.format(r) : brlCentavos.format(r);
}

/** Só o número, sem "R$" (para o preço grande do card). */
export function formatarNumero(v: number): string {
  return formatarBRL(v).replace(/^R\$\s?/, "").trim();
}
