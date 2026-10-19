// Texto do "Copiar resumo": pronto para colar no WhatsApp depois da call.
import type { Acessorio, Categoria, Faixa } from "../data/planos";
import { formatarBRL } from "./preco";

export interface DadosResumo {
  categoria: Categoria;
  /** null = personalizado */
  faixa: Faixa | null;
  personalizado?: { videos: number; duracao: number };
  acessorios: Acessorio[];
  total: number;
  condicoes: string[];
}

const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function nomeDoPlano(categoria: Categoria, faixa: Faixa | null): string {
  if (!faixa) return `${categoria.nome} ${categoria.personalizado?.nome ?? "Personalizado"}`;
  return faixa.nome.startsWith(categoria.nome) ? faixa.nome : `${categoria.nome} ${faixa.nome}`;
}

export function descricaoVolume(videos: number | null, duracao: number): string {
  if (videos === null) return `vídeos ilimitados de ${duracao} s por mês`;
  return `${videos} ${videos === 1 ? "vídeo" : "vídeos"} de ${duracao} s por mês`;
}

export function montarResumo(d: DadosResumo): string {
  const videos = d.faixa ? d.faixa.videos : (d.personalizado?.videos ?? 0);
  const duracao = d.faixa ? d.faixa.duracao : (d.personalizado?.duracao ?? 15);
  const partes = [`Plano ${nomeDoPlano(d.categoria, d.faixa)} (${descricaoVolume(videos, duracao)})`];
  for (const a of d.acessorios) partes.push(a.nome);
  const condicoes = d.condicoes.slice(0, 2).map(minuscula).join(", ");
  return `LuminaImob · ${partes.join(" + ")} · ${formatarBRL(d.total)}/mês${condicoes ? ` · ${condicoes}.` : ""}`.replace(/ /g, " ");
}
