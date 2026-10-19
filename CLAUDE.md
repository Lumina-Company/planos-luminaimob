# Apresentação de preços — LuminaImob

Site para mostrar os planos e acessórios da **LuminaImob** (produto da Lumina: automação de postagens em vídeo para imobiliárias). Fase atual: **site construído** (fases 0–8 do manual), falta publicar (2026-10-16).

## Onde está cada coisa

| Arquivo | O que tem |
|---|---|
| [docs/03-planos-e-acessorios.md](docs/03-planos-e-acessorios.md) | **Fonte da verdade dos preços.** Planos, faixas, acessórios, regra do personalizado |
| [docs/04-lacunas-e-perguntas.md](docs/04-lacunas-e-perguntas.md) | O que falta decidir antes de o site ir ao ar. Atualizar quando o Lucas responder |
| [docs/01-lumina.md](docs/01-lumina.md) | A empresa: sócios, o que vende, clientes, tom de voz |
| [docs/02-produto-luminaimob.md](docs/02-produto-luminaimob.md) | O produto: como funciona, público, dor, promessa, diferenciais, provas |
| [docs/05-marca-e-visual.md](docs/05-marca-e-visual.md) | Identidade visual oficial (cores, fontes, logo) e ativos disponíveis |
| [docs/06-modo-admin.md](docs/06-modo-admin.md) | Admin como filtro sobre o próprio site (tecla L): tudo editável clicando, parâmetros/custo/margem só aparecem nele |
| [docs/07-layout-e-demonstracao.md](docs/07-layout-e-demonstracao.md) | Layout (referência ElevenLabs): categorias, cards, acessórios no topo direito, card Personalizado, seleção/resumo, modo demonstração |
| [docs/06-modo-admin.md](docs/06-modo-admin.md) | Modo admin: filtro de edição na própria tela (tecla L) |
| [docs/07-layout-e-demonstracao.md](docs/07-layout-e-demonstracao.md) | Layout da página, cards, acessórios, resumo, modo demo |
| [docs/08-manual-de-construcao.md](docs/08-manual-de-construcao.md) | **Ler antes de construir.** Stack (Astro 7), skills por fase, padrão de animação, testes, checklist de entrega |
| [docs/90-INTERNO-custos-e-margens.md](docs/90-INTERNO-custos-e-margens.md) | **Interno.** Custo de API, margens, histórico de precificação, calculadora |
| [src/data/planos.ts](src/data/planos.ts) | Espelho de `docs/03` no código: **única fonte de preço** e textos padrão |
| [src/lib/preco.ts](src/lib/preco.ts) · [preco.test.ts](src/lib/preco.test.ts) | Fórmula do personalizado e soma de acessórios + testes com os números de `03` |
| [src/data/calculadora-admin.ts](src/data/calculadora-admin.ts) | Custo/s, dólar, margem alvo. Só carrega com o admin ligado |
| [src/components/](src/components/) | Ilha React (`PricingApp`), cards, acessórios, demo, resumo, `admin/` |
| [src/components/efeitos/](src/components/efeitos/) | Cursor exclusivo, lanterna, inclinação, ímã, onda de luz, fundo vivo. Ligados por data-atributos; regras em `docs/08` §5 |
| [tests/e2e/planos.spec.ts](tests/e2e/planos.spec.ts) | Testes de tela do manual §8 |
| `LuminaImob calculador plano personalizado.html` | Calculadora interna (mostra custo e margem). Não publicar como está |

## Regras

0. **O site é ferramenta de call de venda**: os sócios mostram a tela ao dono da imobiliária. Tudo o que aparece, o cliente vê.
1. **Nada interno vai para o site.** Custo de API, margem, nome de fornecedor de IA (Kling, Seedance, OpenAI), recomendações do conselho, preço antigo e o arquivo `docs/90-INTERNO-*` nunca aparecem em página pública.
2. **Preço só sai de `docs/03`.** Se o preço mudar, mude lá primeiro e registre a data.
3. **Não inventar.** Decisões marcadas **(C)** foram tomadas pelo Claude a pedido do Lucas (2026-10-16) e valem até ele revisar; a lista está em `docs/04`. Nada fora dos docs entra no site.
4. **Prova social:** só o que é real e citável (BR Luani, de 20 para 82 posts/mês). Nunca "várias imobiliárias já usam".
5. **Marca:** usar o UI Kit v2 Light (claro, ciano `#0EA5E9`, Space Grotesk + Inter). O visual escuro da calculadora atual não é a marca.
6. Base de conhecimento do Lucas (fonte deste contexto): `E:\Base de Conhecimento\wiki\Lumina`. Não escrever nela a partir deste projeto; informação nova vai para "Sugestões de ingest" em `docs/04`.
