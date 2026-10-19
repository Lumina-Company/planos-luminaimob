# Apresentação de preços — LuminaImob

Site para apresentar os planos e acessórios da **LuminaImob**, a automação de postagens em vídeo para imobiliárias da **Lumina**.

**Fase:** site construído (fases 0–8), aguardando publicação na Vercel (2026-10-16).

## Rodar

```bash
npm install
npm run dev          # http://localhost:4321  (tecla L = modo admin)
npm test             # testes de preço (Vitest)
npm run build && npm run test:e2e   # testes de tela (Playwright, usa o preview)
```

## Documentação

1. [A Lumina](docs/01-lumina.md) — empresa, clientes, tom de voz
2. [O produto LuminaImob](docs/02-produto-luminaimob.md) — como funciona, público, dor, promessa, provas
3. [Planos e acessórios](docs/03-planos-e-acessorios.md) — **preços** (fonte da verdade)
4. [Decisões e pendências](docs/04-lacunas-e-perguntas.md) — tudo decidido (Lucas e Claude) + tarefas de produção
5. [Marca e visual](docs/05-marca-e-visual.md) — UI Kit v2 Light e ativos
6. [Modo admin](docs/06-modo-admin.md) — filtro na própria tela (tecla L), edição clicando na informação
7. [Layout e demonstração](docs/07-layout-e-demonstracao.md) — categorias no topo, cards das faixas, acessórios, personalizado, modo demo
8. [Manual de construção](docs/08-manual-de-construcao.md) — stack (Astro 7), skills por fase, animações, testes, checklist
9. [⛔ Interno: custos e margens](docs/90-INTERNO-custos-e-margens.md) — não vai para o site

Uso: **apoio em call de venda** (mostrado ao dono da imobiliária na reunião).

## Resumo dos planos (vídeos de 15 s, mensal)

| Plano | Nível de vídeo | Faixa 1 | Faixa 2 | Faixa 3 |
|---|---|---|---|---|
| Essencial | zoom + moldura, sem IA | 30 vídeos R$ 149 | 60 vídeos R$ 269 | Ilimitado R$ 300 |
| Pro | vídeo por IA | 30 vídeos R$ 399 | 50 vídeos R$ 619 | Personalizado |
| Max | IA de qualidade superior | 30 vídeos R$ 1.300 | 60 vídeos R$ 2.200 | Personalizado |

Acessórios (fixos, valem para todos os vídeos): Motion Graphics R$ 400/mês · Locução por IA R$ 100/mês.
Sem implementação, sem fidelidade.
