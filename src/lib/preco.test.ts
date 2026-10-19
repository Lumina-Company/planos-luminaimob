import { describe, expect, it } from "vitest";
import { conteudoPadrao } from "../data/planos";
import {
  precoPersonalizado,
  precoPorVideoPersonalizado,
  totalComAcessorios,
  acessoriosAplicaveis,
  formatarBRL,
} from "./preco";

const pro = conteudoPadrao.categorias.pro.personalizado!.parametros;
const max = conteudoPadrao.categorias.max.personalizado!.parametros;
const acessorios = conteudoPadrao.acessorios;

describe("personalizado bate com a tabela de docs/03", () => {
  it.each([
    ["Pro 30 × 15 s", pro, 30, 15, 399],
    ["Pro 50 × 15 s", pro, 50, 15, 619],
    ["Pro 30 × 30 s", pro, 30, 30, 894],
    ["Pro 100 × 15 s", pro, 100, 15, 1169],
    ["Max 30 × 15 s", max, 30, 15, 1300],
    ["Max 60 × 15 s", max, 60, 15, 2200],
    ["Max 30 × 30 s", max, 30, 30, 2875],
  ])("%s", (_nome, parametros, videos, duracao, esperado) => {
    expect(precoPersonalizado(parametros, videos, duracao)).toBeCloseTo(esperado, 2);
  });

  it("preço por vídeo usa a fórmula em dois trechos", () => {
    expect(precoPorVideoPersonalizado(pro, 15)).toBeCloseTo(11, 2);
    expect(precoPorVideoPersonalizado(pro, 30)).toBeCloseTo(27.5, 2);
    expect(precoPorVideoPersonalizado(max, 30)).toBeCloseTo(82.5, 2);
  });
});

describe("faixas fixas", () => {
  const faixa = (cat: "essencial" | "pro" | "max", id: string) =>
    conteudoPadrao.categorias[cat].faixas.find((f) => f.id === id)!;

  it("preços da tabela", () => {
    expect(faixa("essencial", "essencial-30").preco).toBe(149);
    expect(faixa("essencial", "essencial-60").preco).toBe(269);
    expect(faixa("essencial", "essencial-ilimitado").preco).toBe(300);
    expect(faixa("pro", "pro-30").preco).toBe(399);
    expect(faixa("pro", "pro-50").preco).toBe(619);
    expect(faixa("max", "max-30").preco).toBe(1300);
    expect(faixa("max", "max-60").preco).toBe(2200);
  });

  it("Pro 50 + Locução = R$ 719", () => {
    expect(totalComAcessorios(faixa("pro", "pro-50").preco, true, ["locucao"], acessorios)).toBe(719);
  });

  it("Pro 30 + Motion + Locução = R$ 899", () => {
    expect(totalComAcessorios(399, true, ["motion", "locucao"], acessorios)).toBe(899);
  });

  it("Essencial Ilimitado não soma acessório", () => {
    const ilimitado = faixa("essencial", "essencial-ilimitado");
    expect(ilimitado.aceitaAcessorios).toBe(false);
    expect(acessoriosAplicaveis(false, ["motion", "locucao"])).toEqual([]);
    expect(totalComAcessorios(ilimitado.preco, false, ["motion", "locucao"], acessorios)).toBe(300);
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
