// Parâmetros internos da calculadora. Só são carregados com o admin ligado (import dinâmico).
// Nunca importar este arquivo de forma estática.

export interface ParametrosAdmin {
  custoPorSegundoUSD: { essencial: number; pro: number };
  dolar: number;
  margemAlvo: number;
}

export const parametrosAdminPadrao: ParametrosAdmin = {
  // Essencial: zoom sem IA, sem custo de geração (só legenda e infra, não medidos)
  custoPorSegundoUSD: { essencial: 0, pro: 0.084 },
  dolar: 5.7,
  margemAlvo: 0.5,
};

export interface Resultado {
  custoMensal: number;
  lucroBruto: number;
  margemTotal: number;
  margemPorVideo: number;
}

export function calcularMargem(
  precoMensal: number,
  precoPorVideo: number,
  videos: number,
  duracao: number,
  custoPorSegundoUSD: number,
  dolar: number,
): Resultado {
  const custoVideo = duracao * custoPorSegundoUSD * dolar;
  const custoMensal = videos * custoVideo;
  return {
    custoMensal,
    lucroBruto: precoMensal - custoMensal,
    margemTotal: precoMensal ? 1 - custoMensal / precoMensal : 0,
    margemPorVideo: precoPorVideo ? 1 - custoVideo / precoPorVideo : 0,
  };
}
