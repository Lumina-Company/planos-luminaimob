import { describe, expect, it } from "vitest";
import { conteudoPadrao } from "../data/planos";
import { precoPersonalizado, precoPorVideoPersonalizado, totalComAcessorios, formatarBRL } from "./preco";

const essencial = conteudoPadrao.categorias.essencial.personalizado.parametros;
const pro = conteudoPadrao.categorias.pro.personalizado.parametros;
const acessorios = conteudoPadrao.acessorios;

describe("personalizado bate com a tabela de docs/03", () => {
  it.each([
    ["Essencial 30 × 15 s", essencial, 30, 15, 149],
    ["Essencial 60 × 15 s", essencial, 60, 15, 269],
    ["Essencial 30 × 30 s", essencial, 30, 30, 329],
    ["Pro 30 × 15 s", pro, 30, 15, 399],
    ["Pro 50 × 15 s", pro, 50, 15, 619],
    ["Pro 30 × 30 s", pro, 30, 30, 894],
    ["Pro 100 × 15 s", pro, 100, 15, 1169],
  ])("%s", (_nome, parametros, videos, duracao, esperado) => {
    expect(precoPersonalizado(parametros, videos, duracao)).toBeCloseTo(esperado, 2);
  });

  it("preço por vídeo usa a fórmula em dois trechos", () => {
    expect(precoPorVideoPersonalizado(essencial, 15)).toBeCloseTo(4, 2);
    expect(precoPorVideoPersonalizado(essencial, 30)).toBeCloseTo(10, 2);
    expect(precoPorVideoPersonalizado(pro, 15)).toBeCloseTo(11, 2);
    expect(precoPorVideoPersonalizado(pro, 30)).toBeCloseTo(27.5, 2);
  });
});

describe("faixas fixas", () => {
  const faixa = (cat: "essencial" | "pro", id: string) =>
    conteudoPadrao.categorias[cat].faixas.find((f) => f.id === id)!;

  it("preços da tabela", () => {
    expect(faixa("essencial", "essencial-30").preco).toBe(149);
    expect(faixa("essencial", "essencial-60").preco).toBe(269);
    expect(faixa("pro", "pro-30").preco).toBe(399);
    expect(faixa("pro", "pro-50").preco).toBe(619);
  });

  it("Pro 50 + Locução = R$ 719", () => {
    expect(totalComAcessorios(faixa("pro", "pro-50").preco, true, ["locucao"], acessorios)).toBe(719);
  });

  it("Pro 30 + Motion + Locução = R$ 899", () => {
    expect(totalComAcessorios(399, true, ["motion", "locucao"], acessorios)).toBe(899);
  });

  it("Essencial 30 + Locução = R$ 249", () => {
    expect(totalComAcessorios(faixa("essencial", "essencial-30").preco, true, ["locucao"], acessorios)).toBe(249);
  });
});

describe("formatação", () => {
  const limpar = (s: string) => s.replace(/\s/g, " ");
  it("inteiro sem centavos", () => {
    expect(limpar(formatarBRL(1300))).toBe("R$ 1.300");
  });
  it("com centavos quando houver", () => {
    expect(limpar(formatarBRL(12.375))).toBe("R$ 12,38");
  });
});
