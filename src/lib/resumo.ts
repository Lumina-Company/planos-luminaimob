// Nome e volume do plano escolhido: barra de resumo e tela de fechamento.
import type { Categoria, Faixa } from "../data/planos";

export function nomeDoPlano(categoria: Categoria, faixa: Faixa | null): string {
  if (!faixa) return `${categoria.nome} ${categoria.personalizado.nome}`;
  return faixa.nome.startsWith(categoria.nome) ? faixa.nome : `${categoria.nome} ${faixa.nome}`;
}

export function descricaoVolume(videos: number, duracao: number): string {
  return `${videos} ${videos === 1 ? "vídeo" : "vídeos"} de ${duracao} s por mês`;
}
