# Manual de construção — site de planos LuminaImob

> Para o Claude que vai construir o site do zero. Escrito em 2026-10-16.
> Este doc diz **com o quê** e **em que ordem** construir. **O quê** construir está nos docs 03, 05, 06 e 07; em caso de conflito, eles vencem este manual.
> Escolhas marcadas **(C)** foram feitas pelo Claude e podem ser revistas pelo Lucas.

## 0. Antes de escrever código

Ler, nesta ordem:

1. [CLAUDE.md](../CLAUDE.md) — regras do projeto (nada interno no site, preço só de `03`, não inventar)
2. [03-planos-e-acessorios.md](03-planos-e-acessorios.md) — preços, fórmula do personalizado, inclusos
3. [07-layout-e-demonstracao.md](07-layout-e-demonstracao.md) — estrutura da tela e modo demo
4. [06-modo-admin.md](06-modo-admin.md) — o "filtro" de edição (tecla L)
5. [05-marca-e-visual.md](05-marca-e-visual.md) — cores, fontes, ativos
6. [02-produto-luminaimob.md](02-produto-luminaimob.md) — textos de produto e provas citáveis

**Não ler** para construir: `90-INTERNO-custos-e-margens.md`. Os únicos números de custo que o site usa são os parâmetros da calculadora listados em `06` (só aparecem com o admin ligado).

O site é **ferramenta de call**: o sócio compartilha a tela no Meet/Zoom e o dono da imobiliária vê tudo. Toda decisão de design parte disso.

## 1. Stack

Versões conferidas no npm em 2026-10-16. Na hora de instalar, usar sempre `@latest` e anotar aqui a versão que entrou.

> **Instalado em 2026-10-16:** astro 7.4.0 · @astrojs/react 7.1.0 · react/react-dom 19.3.1 · tailwindcss e @tailwindcss/vite 4.3.3 · gsap 3.15.0 · @gsap/react 2.1.2 · lucide-react 1.58.0 · radix-ui 1.8.1 · fontes 5.3.0 · vitest 5.0.5 · @playwright/test 1.64.1 · typescript 6 (o `astro check` ainda não aceita TS 7).

| Camada | Escolha | Versão (2026-10-16) | Por quê |
|---|---|---|---|
| Framework | **Astro** | 7.4.0 | Pedido do Lucas. Gera HTML estático, rápido de abrir na call |
| Runtime | **Node.js** | ≥ 22.22 (máquina do Lucas: 24.14) | Exigência do Astro 7 |
| Ilha interativa | **React 19** via `@astrojs/react` (C) | react 19.3 · integração 7.1 | A página inteira é estado compartilhado (categoria, acessórios, seleção, resumo, admin com desfazer). Uma ilha React segura isso melhor que scripts soltos, e tem as skills `gsap-react` e `vercel-react-best-practices` |
| Estilo | **Tailwind CSS 4** via `@tailwindcss/vite` | 4.3 | Tokens da marca em `@theme`, sem arquivo de config |
| Animação | **GSAP** + `@gsap/react` (C) | 3.15 · 2.1 | Gratuito com todos os plugins (Flip, SplitText, DrawSVG, CustomEase). Uma biblioteca só, sem misturar com Motion/Framer |
| Componentes acessíveis | **Radix direto** (pacote `radix-ui`), restilizado com os tokens (C, ver `04` CONS2) | 1.8.1 | Slider, Switch, Popover, Dialog, Tooltip já vêm com teclado e leitor de tela. Restilizar tudo com os tokens da marca |
| Ícones | `lucide-react` | 1.58 | Traço fino, combina com a lâmpada em traço da logo |
| Fontes | `@fontsource-variable/space-grotesk` e `@fontsource-variable/inter` | 5.3 | Auto-hospedadas: abrem sem depender do Google na hora da call |
| Testes | **Vitest** (lógica) + **Playwright** (tela) | 5.0.5 · 1.64.1 | Preço errado na call é o pior bug possível |
| Hospedagem | **Vercel**, saída estática, `noindex` | — | Decidido em `04` (D4) |

**Não usar:** Lenis/scroll suave sequestrado (a página é quase uma tela só, e no compartilhamento de tela o scroll suave parece travado), Three.js/WebGL (pesa e não ajuda a vender preço), Framer Motion junto com GSAP, CMS, banco de dados, backend. O site é 100% estático; o admin salva no `localStorage`.

### Criar o projeto

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --git
npx astro add react
npm install tailwindcss @tailwindcss/vite gsap @gsap/react lucide-react @fontsource-variable/space-grotesk @fontsource-variable/inter
npm install -D vitest @playwright/test
npx shadcn@latest init        # depois: npx shadcn@latest add slider switch popover dialog tooltip
```

Ligar o Tailwind no `astro.config.mjs` (`vite: { plugins: [tailwindcss()] }`) e importar `src/styles/global.css` no layout.

### Avisos do Astro 7

- O compilador agora é em Rust e **não corrige HTML inválido**: tag sem fechar dá erro, `<div>` dentro de `<p>` quebra o layout. Escrever HTML válido.
- Espaço entre elementos inline segue regra do JSX (`compressHTML: 'jsx'`): `<span>R$</span> <strong>619</strong>` vira "R$619". Usar `{" "}` onde o espaço importa (preços!).
- `src/fetch.ts` é nome reservado. Não criar arquivo com esse nome.
- Servidor de desenvolvimento para agente: `npx astro dev --background`, depois `astro dev status` / `astro dev logs` / `astro dev stop`. Não deixar `astro dev` preso no terminal.

## 2. Estrutura de pastas

```
src/
  data/
    planos.ts          ← espelho de docs/03: planos, faixas, acessórios, inclusos, condições. ÚNICA fonte de preço no código
    demo.ts            ← textos da demo por categoria (docs/07)
    calculadora-admin.ts ← parâmetros de custo (US$/s, dólar, margem alvo). Carregado só quando o admin liga (import dinâmico)
  lib/
    preco.ts           ← fórmula do personalizado e soma de acessórios. Funções puras
    preco.test.ts      ← confere os números de docs/03
    edicoes.ts         ← overrides do admin: localStorage com try/catch, desfazer/refazer, exportar/importar JSON
    resumo.ts          ← monta o texto do "Copiar resumo"
  components/
    PricingApp.tsx     ← a ilha (client:load). Estado da página inteira
    CategoryTabs.tsx  AccessoriesMenu.tsx  PlanCard.tsx  CustomCard.tsx
    IncludedList.tsx  SummaryBar.tsx  DemoPanel.tsx  VideoModal.tsx
    admin/  AdminBanner.tsx  Editable.tsx  AdminCalcPanel.tsx  AdminActions.tsx
    ui/                ← peças do shadcn, restilizadas
  layouts/Base.astro   ← <head>, fontes, meta noindex
  pages/index.astro    ← título + <PricingApp client:load />
  styles/global.css    ← @import "tailwindcss"; @theme com os tokens
public/
  videos/  img/  logo/ ← ativos copiados da Base de Conhecimento (ver §6)
tests/e2e/             ← Playwright
vercel.json            ← header X-Robots-Tag: noindex
```

Regras de código:

- Preço só sai de `src/data/planos.ts`. Nenhum número de preço escrito em componente.
- `preco.ts` não conhece React; recebe dados, devolve número. Formatar com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- Custo, margem, parâmetros e nome de fornecedor **não existem no DOM** com o admin desligado (renderização condicional, nunca `display:none`). `calculadora-admin.ts` entra por `import()` só quando o admin liga, para não ir no pacote inicial.
- Nenhuma string "Seedance", "Kling" ou "OpenAI" em lugar algum do código.

## 3. Tokens de design (de `05`)

Em `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #0EA5E9;
  --color-primary-50: #EFF8FE;   /* bloom */
  --color-primary-200: #A6E2FB;
  --color-primary-400: #33BEF4;
  --color-primary-600: #0A84FF;
  --color-primary-900: #00489B;
  --color-bg: #F8FCFF;
  --color-ink: #0B1F2E;
  --color-ink-2: #39566B;
  --color-ink-3: #9DB4C4;

  --font-display: "Space Grotesk Variable", sans-serif;
  --font-sans: "Inter Variable", sans-serif;

  --radius-card: 20px;           /* 16–24 px na marca */
  --shadow-card: 0 1px 2px rgb(14 165 233 / .06), 0 12px 32px -12px rgb(14 165 233 / .18);

  --ease-out-soft: cubic-bezier(.22, 1, .36, 1);
  --duration-fast: 160ms;
  --duration-base: 320ms;
  --duration-slow: 560ms;
}
```

- Gradiente de ação: `linear-gradient(90deg, #33BEF4, #0EA5E9, #0A84FF)` — botão "Escolher" do card selecionado, borda do card selecionado, selo "Recomendado".
- Números de preço com `font-variant-numeric: tabular-nums`, para não "dançar" quando mudam.
- Só Space Grotesk (títulos, preços) e Inter (resto). Nada do visual escuro da calculadora antiga.

## 4. Skills: quais usar e quando

Carregar a skill (ferramenta `Skill`) **antes** da etapa em que ela atua. Se duas skills discordarem, valem os docs do projeto; depois, a ordem desta tabela.

### Design (direção e acabamento)

| Skill | Quando | Para quê |
|---|---|---|
| `frontend-design` | Início da Fase 1 | Direção estética, evitar cara de "site gerado por IA" |
| `high-end-visual-design` | Fase 1 e Fase 3 | Hierarquia, espaçamento, tipografia de produto premium |
| `design-taste-frontend` | Fase 1 e Fase 3 | Regras métricas de layout, componentes e aceleração por GPU no CSS |
| `impeccable` | Fase 7 e Fase 8 | Polir, animar, auditar, deixar mais "delightful" sem exagero |
| `shadcn` | Fase 3 | Adicionar e restilizar Slider, Switch, Popover, Dialog, Tooltip |
| `design:ux-copy` | Fase 3 e Fase 6 | Só microtexto de interface (botões, avisos do admin, erros de validação). Texto de produto vem dos docs, não se inventa |

### Animação

| Skill | Quando | Para quê |
|---|---|---|
| `gsap-core` | Fase 7 | Base: tweens, eases, `gsap.matchMedia` para movimento reduzido |
| `gsap-react` | Fase 7 | `useGSAP`, escopo e limpeza dentro dos componentes |
| `gsap-timeline` | Fase 7 | Coreografia de entrada e da troca preços ↔ demo |
| `gsap-plugins` | Fase 7 | **Flip** (troca de categoria, preços ↔ demo, indicador das pílulas), **SplitText** (título), **DrawSVG** (lâmpada), **CustomEase** |
| `gsap-performance` | Fase 7 e Fase 8 | Só `transform`/`opacity`, `will-change` com parcimônia, 60 fps |
| `svg-animations` | Fase 7 | Lâmpada da logo desenhando o traço e acendendo |

`gsap-scrolltrigger` só se alguma seção abaixo da dobra precisar entrar com a rolagem (ex.: "Todos os planos incluem"). Não usar pin nem scrub. **Em uso desde 2026-10-16** para inclusos, prova e condições (`once: true`).

### Código, qualidade e entrega

| Skill | Quando | Para quê |
|---|---|---|
| `vercel-react-best-practices` | Fases 3–6 | Renderização eficiente na ilha (slider do personalizado mexe o preço a cada passo) |
| `tdd` | Fase 2 | Escrever os testes de preço antes da fórmula |
| `webapp-testing` | Fases 3–8 | Abrir a página no Playwright, tirar print, conferir comportamento |
| `web-design-guidelines` | Fase 8 | Auditoria de interface |
| `design:accessibility-review` | Fase 8 | Contraste (ciano sobre branco!), foco visível, teclado |
| `deploy-to-vercel` | Fase 9 | Publicar |

**Não usar neste projeto:** `industrial-brutalist-ui`, `liquid-glass-design`, `minimalist-ui`, `gpt-taste`, `stitch-design-taste`, `threejs-*`, `imagegen-*`, `clone-website`. Puxam para estéticas que brigam com o UI Kit v2 Light. A referência de estrutura (página de preços da ElevenLabs, ver `07`) é só de **estrutura**; não copiar o visual.

## 5. Movimento: o padrão de animação

Objetivo: tudo responde na hora e flui, sem nunca atrasar o sócio na call.

### Princípios

1. **Pensar em compartilhamento de tela.** Meet/Zoom transmitem a 15–30 quadros por segundo. Movimentos de 250–550 ms leem bem; abaixo de 150 ms some, acima de 700 ms parece lento. Nada de micro-parallax nem tremidinhas que viram ruído no vídeo.
2. **Animação nunca bloqueia clique.** Toda animação é interrompível (`overwrite: 'auto'`); clicar Pro → Max → Essencial rápido não pode enfileirar transições.
3. **Só `transform` e `opacity`.** Layout muda via Flip, não animando `width`/`height`/`top`.
4. **Uma curva da casa.** `--ease-out-soft` (`cubic-bezier(.22,1,.36,1)`) para entradas; `power2.inOut` para trocas; `back.out(1.4)` só na barra de resumo.
5. **Movimento reduzido.** Com `prefers-reduced-motion: reduce`, tudo vira fade curto (≤ 120 ms) via `gsap.matchMedia()`. Preço continua atualizando, só sem contagem.

### Catálogo

| Momento | Animação | Duração |
|---|---|---|
| Abertura | Lâmpada da logo desenha o traço (DrawSVG) e acende com brilho ciano: escuridão → luz, o conceito da marca. Uma vez só por carregamento | ≤ 1,2 s no total |
| Abertura | Título entra por palavras (SplitText), pílulas e cards sobem 16 px com stagger de 60 ms | 560 ms |
| Troca de categoria | Fundo da pílula ativa desliza até a nova (Flip). Cards antigos saem com fade + 8 px; novos entram com stagger | 320 ms |
| Preço muda (categoria, acessório, slider) | Número conta do valor antigo ao novo, `tabular-nums` | 320 ms (slider: 120 ms) |
| Liga acessório | Linha "+ Locução" entra no card com altura via Flip; contador "Acessórios (1)" faz um pulso de escala 1 → 1,08 → 1 | 320 ms |
| Hover no card | Sobe 4 px, sombra azulada cresce | 160 ms |
| "Escolher" | Borda em gradiente acende no card; os outros perdem 8% de opacidade. Barra de resumo sobe do rodapé | 320 ms · barra 450 ms `back.out(1.4)` |
| "Copiar resumo" | Botão troca o ícone para ✓ "Copiado" e volta depois de 2 s | 160 ms |
| "▶ Ver como funciona" | Cards recolhem e o vídeo 9:16 cresce do card central (Flip); textos da demo entram com stagger | 550 ms |
| "Ver preços" | Caminho inverso | 450 ms |
| Preços ↔ demo (retoque) | O conteúdo atual sai (fade + 10 px para cima) e só então o novo entra; demo: celular sobe e assenta, textos e passos em cascata, setas por último. Clicar de novo no meio corta a saída | saída 200 ms · entrada ≤ 900 ms |
| Troca de categoria (retoque) | Cards entram do lado para onde se andou (Pro → Max vem da direita, stagger na mesma direção); a linha da categoria acompanha | 450 ms |
| "Escolher" (retoque) | Faixa de luz atravessa a arte uma vez, o card respira (1,012) e o ✓ se desenha | 950 ms |
| Limpar resumo (retoque) | A barra desce antes de sair | 280 ms |
| Rolagem (retoque) | Inclusos: painel sobe, ícones acendem em sequência. Como começamos: prancheta sobe, itens do contrato entram, a caneta assina (DrawSVG + caneta acompanhando o traço), selo "Assinado" salta; etapas e setas uma a uma; faixa do prazo por último. Condições: uma a uma | 0,6–2,3 s, uma vez |
| Hover numa etapa de "Como começamos" | `data-gira` (engrenagem +90°), `data-pulsa`, `data-flutua`, `data-linha-codigo` nos SVGs de `IlustracoesComecar.tsx` | 0,3–1,1 s |
| Abertura (retoque) | Aurora clareia; depois das palavras, uma faixa de luz atravessa o título | +0,8 s, não bloqueia nada |
| Trocar categoria na demo | Crossfade do vídeo e dos textos, sem desmontar o layout | 320 ms |
| Modal de exemplo do acessório | Fundo escurece, vídeo escala de 0,96 a 1 | 250 ms |
| Admin liga (L) | Faixa "Modo admin · L ou Esc para sair" desce do topo; campos editáveis ganham contorno tracejado ciano | 250 ms |
| Admin desliga (L/Esc) | Tudo do admin some **na hora**, sem animação longa: se abriu sem querer, sai sem o cliente ler | ≤ 100 ms |
| Valor inválido no admin | Campo pisca vermelho e treme 2 vezes (±4 px), volta ao valor anterior | 300 ms |

### Interação de ponteiro (retoque de 2026-10-16, pedido do Lucas; decisões MOV1–MOV9 em `04`)

Tudo em `src/components/efeitos/`. Os componentes só marcam data-atributos; um hook (`useEfeitosDePonteiro`, chamado uma vez na página) faz o trabalho por delegação no documento, então vale também para o que entra depois (troca de categoria, popover, modais, barra de resumo).

| Atributo | Efeito | Onde está |
|---|---|---|
| `data-lanterna="claro"\|"ciano"` + `<Lanterna />` | Luz que segue o mouse dentro do elemento | Arte dos cards, painel de inclusos, passos da demo |
| `data-lanterna-grupo` | A borda dos cards do grupo acende perto do mouse | Grade de cards, passos da demo |
| `data-tilt` | Inclinação 3D até 3° | Arte dos cards, posts da BR Luani |
| `data-magnetico` / `data-magnetico-filho` | Botão puxado até 6 px; rótulo anda metade a mais | Escolher, Ver como funciona, Acessórios, Copiar resumo, Fechar |
| `data-onda` / `data-onda="escuro"` | Onda de luz do ponto do clique (botão precisa de `relative overflow-hidden`) | Botões principais, abas |
| `data-cursor-rotulo="…"` | Cursor vira pílula com o texto | Vídeo da demo ("Ampliar"), tela cheia ("Fechar"), vídeo do acessório (som) |
| `data-cursor-claro` | Cursor branco | Cards azuis, botões e barra escuros, tela cheia |

Regras:

- **Só mouse e movimento liberado** (`MOUSE_COM_MOVIMENTO` em `lib/gsap.ts`): cursor, lanterna, inclinação, ímã e luz do fundo. A onda vale para toque também; no toque a lanterna acende onde o dedo encostou.
- **Admin ligado** (`data-admin` no `<html>`): inclinação e ímã param; o cursor some sobre campos editáveis e volta o de texto.
- **Posição contínua com `gsap.quickTo`** (inclinação, ímã, luz do fundo) ou `gsap.quickSetter` (cursor, sem atraso); nunca criar tween novo a cada `pointermove`.
- **Cursor sem anel seguidor** (Lucas, 2026-10-16: "ficou paia"). Só o ponto, colado no mouse.
- **CSS não pode transicionar `transform`** num elemento que o GSAP move por quadro (vira atraso em cima de atraso). Tailwind 4 usa `translate`/`scale` separados: transicionar esses (`transition-[translate,box-shadow]`), não `transform`.
- Conteúdo que tem que ficar por cima da lanterna leva `relative`.

## 6. Ativos

Copiar da Base de Conhecimento para `public/` (só leitura lá; nunca escrever na base):

| Ativo | Origem | Destino |
|---|---|---|
| Posts reais da BR Luani (demo do Pro, prova) | `E:\Base de Conhecimento\wiki\Lumina\produtos\LuminaImob\Case Luanna Imobiliaria\` | `public/img/br-luani/` |
| Motion de 34 s do produto | `...\LuminaImob\Criativos\Video motion graphic apresentando o produto.mp4` | `public/videos/` |

- Vídeos: comprimir para MP4 H.264, ~1080×1920, até ~4 MB cada; `muted playsinline loop preload="metadata"` e `poster`. Carregar o vídeo da demo só quando a demo abre.
- Logo da LuminaImob ainda não existe em SVG (tarefa P5 em `04`). Até lá: nome "LuminaImob" em Space Grotesk + lâmpada em traço desenhada em SVG inline (base para a animação DrawSVG).
- Vídeos que faltam (P1–P4 em `04`): seguir LAY7 — imagem + "exemplo em produção". Não gerar vídeo falso.

## 7. Fases de construção

Cada fase termina com o site rodando e um print conferido (`webapp-testing`). Não pular para a seguinte com a anterior quebrada.

| Fase | Entrega | Skills | Pronto quando |
|---|---|---|---|
| **0. Projeto** | Astro 7 + React + Tailwind 4 + fontes; página em branco com fundo `#F8FCFF` | — | `npm run build` passa; `astro dev --background` abre |
| **1. Casca visual** | Layout de `07` estático: título, pílulas, botão demo, menu de acessórios, 3 cards, "Todos os planos incluem" | `frontend-design`, `high-end-visual-design`, `design-taste-frontend` | Print em 1920×1080 e 1280×720 parece produto premium e segue a marca |
| **2. Dados e preço** | `planos.ts`, `preco.ts` e testes | `tdd` | Testes da §8 passam |
| **3. Interação** | Categorias (inicia em **Pro**), acessórios somando, "Escolher", barra de resumo, "Copiar resumo", Ilimitado sem acessórios | `shadcn`, `vercel-react-best-practices`, `design:ux-copy` | Tudo de `07` §1–5 funciona |
| **4. Personalizado** | Card com sliders (5–60 s, passo 5; 1–200 vídeos) e preço ao vivo | `shadcn` | Bate com os exemplos de `03` |
| **5. Demo** | Troca cards ↔ vídeo + textos, mantém a demo ao trocar categoria, modal de exemplo dos acessórios | — | `07` "Modo demonstração" completo |
| **6. Admin** | Tecla L / Esc, faixa de aviso, edição no lugar, painel de custo/margem no personalizado, desfazer/refazer, restaurar padrão, exportar/importar, validação | `design:ux-copy` | Tudo de `06` funciona; teste da §8 sobre DOM passa |
| **7. Movimento** | Catálogo da §5 inteiro | `gsap-core`, `gsap-react`, `gsap-timeline`, `gsap-plugins`, `svg-animations`, `gsap-performance`, `impeccable` | Fluido a 60 fps; movimento reduzido respeitado; clique rápido não enfileira |
| **8. Auditoria** | Acessibilidade, desempenho, celular, revisão final | `impeccable`, `web-design-guidelines`, `design:accessibility-review` | Checklist da §9 inteiro |
| **9. Publicação** | Vercel, `noindex`, link só da equipe | `deploy-to-vercel` | URL abre; `X-Robots-Tag: noindex` no header |

## 8. Testes obrigatórios

**Vitest (`preco.test.ts`)** — os números de `03`:

| Caso | Esperado |
|---|---|
| Pro personalizado 30 × 15 s | R$ 399 |
| Pro personalizado 50 × 15 s | R$ 619 |
| Pro personalizado 30 × 30 s | R$ 894 |
| Pro personalizado 100 × 15 s | R$ 1.169 |
| Max personalizado 30 × 15 s | R$ 1.300 |
| Max personalizado 60 × 15 s | R$ 2.200 |
| Max personalizado 30 × 30 s | R$ 2.875 |
| Pro 50 + Locução | R$ 719 |
| Essencial Ilimitado + qualquer acessório | acessório não aplicável |

**Playwright (`tests/e2e/`)**

- Abre em Pro, com Pro 50 marcado "Recomendado".
- Ligar Locução soma R$ 100 em todos os cards elegíveis.
- Com o admin **desligado**, o HTML da página não contém "margem", "custo", "API" nem "US$". Com o admin ligado, contém.
- Digitar "l" dentro de um campo editável não liga/desliga o admin.
- Esc desliga o admin.
- Valor inválido no admin volta ao anterior.
- "Copiar resumo" coloca na área de transferência o texto com plano, acessórios e total.

## 9. Checklist de entrega

- [ ] Todos os preços conferem com `docs/03` (testes verdes)
- [ ] Nenhum "Seedance", "Kling", "OpenAI", custo ou margem visível sem admin; nada disso no HTML gerado (`dist/*.html`)
- [ ] Prova social só BR Luani (20 → 82 posts/mês). Nenhum "várias imobiliárias"
- [ ] Dado de mercado só com a fonte (Loft/Offerwise, 2026)
- [ ] Só Space Grotesk + Inter; fundo claro; ciano `#0EA5E9`
- [ ] Contraste AA em todo texto (ciano puro sobre branco não passa em texto pequeno: usar `#0A84FF`/`#00489B` para texto)
- [ ] Navegável por teclado, foco visível
- [ ] `prefers-reduced-motion` respeitado
- [ ] Bom em 1920×1080 e 1280×720 (telas comuns de call) e no celular (coluna única)
- [ ] Lighthouse ≥ 95 em desempenho e acessibilidade
- [ ] `localStorage` bloqueado (aba anônima): site abre com o padrão, sem erro
- [ ] `noindex` na meta e no header
- [ ] Nada inventado: o que estiver "a definir" nos docs não entrou

## 10. Depois de construir

- Atualizar a tabela "Onde está cada coisa" do [CLAUDE.md](../CLAUDE.md) e a fase no [README.md](../README.md).
- Anotar neste doc (§1) as versões que realmente foram instaladas.
- Decisão nova que surgir no caminho: registrar em `04` antes de virar código.
