# Layout e modo demonstração

> Definido pelo Lucas em 2026-10-16; pontos em aberto definidos pelo Claude a pedido dele, marcados **(C)**.
> Referência visual: página de preços da ElevenLabs ("Flexible pricing for your needs"), com abas de produto em cima, cards de plano embaixo e lista de recursos sob cada card.
> A referência dá a **estrutura**. Cores, fontes e cantos seguem a marca Lumina (`05-marca-e-visual.md`): fundo claro, ciano `#0EA5E9`, Space Grotesk + Inter.

## Estrutura da página

```
┌────────────────────────────────────────────────────────────────────────┐
│  Planos LuminaImob                                                     │
│                                                                        │
│  ( Essencial ) ( Pro ) ( Max )  [▶ Ver como funciona]  [Acessórios ▾]  │
├────────────────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐                  │
│  │ Pro 30     │  │ Pro 50     │  │ Personalizado    │                  │
│  │            │  │Recomendado │  │ duração  ──●──   │                  │
│  │ R$ 399/mês │  │ R$ 619/mês │  │ vídeos   ───●─   │                  │
│  │ [Escolher] │  │ [Escolher] │  │ R$ .../mês       │                  │
│  │            │  │            │  │ [Escolher]       │                  │
│  │ 30 vídeos  │  │ 50 vídeos  │  │ do seu jeito     │                  │
│  │ 15 s · IA  │  │ 15 s · IA  │  │ IA               │                  │
│  └────────────┘  └────────────┘  └──────────────────┘                  │
│                                                                        │
│  Todos os planos incluem: legenda por IA · aprovação · Instagram,      │
│  TikTok e Shorts · painel de resultados · vitrine de imóveis · moldura │
│                                                                        │
│  Como começamos: contrato → alinhamento → automação → no ar (20 dias)  │
├────────────────────────────────────────────────────────────────────────┤
│ Pro 50 + Locução · R$ 719/mês        [Copiar resumo] [Limpar]  (fixo)  │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Seletor de categoria (topo, à esquerda)

- Três pílulas, como as abas da referência: **Essencial**, **Pro**, **Max**.
- A escolhida fica destacada; trocar de categoria troca os cards de baixo.
- Abre em **Pro** (C): é o meio da tabela; dali a call desce para o Essencial ou sobe para o Max.

### 2. Botão de demonstração (ao lado das categorias)

- **"▶ Ver como funciona"** (C). Com a demo aberta, vira **"Ver preços"**.
- Ver "Modo demonstração" abaixo.

### 3. Acessórios (topo, à direita)

- No lugar do "Monthly billing" da referência: seletor **"Acessórios ▾"**.
- Abre com duas opções liga/desliga, cada uma com um link **"ver exemplo"** (C) que abre o vídeo do acessório num modal:
  - **Motion Graphics** · + R$ 400/mês
  - **Locução por IA** · + R$ 100/mês
- Com um acessório ligado, **o preço de todos os cards soma o acessório na hora**, e o card mostra o que entrou (ex.: "R$ 619 + Locução = R$ 719/mês").
- O seletor mostra quantos estão ligados (ex.: "Acessórios (1)").
- **Essencial Ilimitado** não soma acessório: o card mostra "Acessórios não disponíveis no Ilimitado" (C, ver `03`).

### 4. Cards de plano (as faixas da categoria)

**3 cards por categoria** (C), em 3 colunas de mesma largura:

| Categoria | Cards |
|---|---|
| Essencial | Essencial 30 · R$ 149 — **Essencial 60 · R$ 269** (Recomendado) — Ilimitado · R$ 300 |
| Pro | Pro 30 · R$ 399 — **Pro 50 · R$ 619** (Recomendado) — **Personalizado** |
| Max | **Max 30 · R$ 1.300** (Recomendado) — Max 60 · R$ 2.200 — **Personalizado** |

Cada card, de cima para baixo:

1. Nome da faixa
2. ~~Selo "Recomendado"~~ removido em 2026-10-16 (Lucas): nenhum card tem selo
3. Preço `R$ X /mês`, com acessório somado quando houver
4. Botão **"Escolher"**
5. O que é **só dele** (C): vídeos/mês, duração, nível de vídeo. Os recursos comuns ficam abaixo dos cards

Todos os cards de faixa fixa têm a arte azul com texto branco, em escada do claro ao profundo (1º card céu, 2º oceano, 3º profundo; sempre mais fundo embaixo, onde fica o texto pequeno). O Personalizado é o único card branco. Os cards ficam soltos, só com espaço entre eles: sem fios de coluna nem tiques (2026-10-16).

**Card Personalizado** (só Pro e Max, sempre o último, à direita):

- Dois controles deslizantes dentro do card: **duração por vídeo** (5–60 s, passo de 5 s) e **vídeos por mês** (1–200). Valores iniciais: 15 s e 30 vídeos.
- **Preço** atualiza dentro do card enquanto mexe.
- Botão "Escolher" igual aos outros.
- Fora do admin: só duração, quantidade e preço. Parâmetros, custo e margem só com o admin ligado (`06-modo-admin.md`).

**Abaixo dos cards** (C):

- **"Todos os planos incluem"**: legenda por IA, aprovação antes de postar, Instagram + TikTok + YouTube Shorts, painel de resultados, vitrine de imóveis, moldura com a marca da imobiliária.
- ~~**Faixa de prova**: "BR Luani, de Londrina: de 20 para 82 posts por mês", com miniaturas dos posts reais.~~ Trocada em 2026-10-16 (Lucas) pela seção abaixo. Os posts da BR Luani continuam na demo do Pro.
- **"Como começamos"** (próximos passos, o que acontece depois da compra), copiada do slide 07 da apresentação comercial: prancheta com o contrato assinado hoje (escopo em 6 itens + assinatura) → 2. reunião de alinhamento → 3. desenvolvimento da automação (até 20 dias) → 4. imóveis no ar sozinhos; faixa escura fecha com "Da assinatura ao primeiro Reels no ar: em até 20 dias". Textos editáveis no admin (`proximos` em `src/data/planos.ts`).
- **Condições** em uma linha: sem taxa de implementação · sem fidelidade · primeiro Reels no ar em até 20 dias.

### 5. Seleção e resumo

- "Escolher" marca o card (borda e realce na cor primária); um card selecionado por vez.
- Aparece a **barra de resumo fixa no rodapé** (C): categoria + faixa (ou duração × quantidade no personalizado) + acessórios + **total mensal**.
- O total acompanha as mudanças (acessório ligado, slider do personalizado).
- **Trocar de categoria mantém a seleção** na barra até escolher outro card (C); assim dá para olhar o Max sem perder o Pro escolhido.
- Botões da barra:
  - **"Copiar resumo"**: copia um texto pronto para colar no WhatsApp depois da call. Ex.: "LuminaImob · Plano Pro 50 (50 vídeos de 15 s por mês) + Locução por IA · R$ 719/mês · sem taxa de implementação, sem fidelidade."
  - **"Limpar"**: desfaz a seleção.

## Modo demonstração

Explica na call **como cada categoria funciona** antes (ou depois) de falar de preço.

**Comportamento**

1. Clicou em **"▶ Ver como funciona"**: os cards de preço **somem** e no lugar entram um **vídeo explicativo** e **textos de explicação** da categoria ativa.
2. O botão vira **"Ver preços"**; clicar volta aos cards.
3. **Trocar de categoria com a demo aberta mantém a demo** e mostra a da nova categoria, para comparar Essencial × Pro × Max na call.
4. O topo (categorias, botão, acessórios) e a barra de resumo continuam visíveis nos dois modos.
5. Transição suave (fade de ~200 ms) entre preços e demo, sem pular a página.

**Layout da demo** (C)

```
┌──────────────────────────────┬──────────────────────────────┐
│                              │  Título da categoria         │
│   Vídeo vertical 9:16        │  O que é                     │
│   (como o Reels de verdade)  │  Como funciona (6 passos)    │
│                              │  Para quem é                 │
│                              │  Destaques (3 pontos)        │
└──────────────────────────────┴──────────────────────────────┘
```

O vídeo é vertical porque o produto entrega Reels; no formato real, o dono imagina no Instagram dele. Toca sem som e em loop; o botão do canto liga o som.

**Tela cheia** (Lucas, 2026-10-16): clicar no vídeo leva o celular para o centro da tela, crescendo; a moldura se dissolve no fundo escuro e o vídeo ocupa a altura toda, já com som e do ponto em que estava. Clique, X ou Esc fazem o caminho de volta, e o vídeo da página continua dali. Sem os botões do navegador sobre o vídeo (pop-out do Opera, picture-in-picture).

**Vídeo de cada categoria enquanto não houver o definitivo** (C):

- **Pro:** posts reais da BR Luani (vídeo de IA, nível Pro).
- **Essencial:** vídeo real de demonstração em `public/video/essencial-demo.mp4` (capa: `essencial-demo.webp`), com a mesma tela cheia do Max. Se o link for apagado no admin, volta a imagem do imóvel + selo "exemplo em produção".
- **Max:** vídeo real de demonstração em `public/video/max-demo.mp4` (capa: `max-demo.webp`, mesmo nome). Vídeo local novo segue o mesmo padrão: `.mp4` 720×1280 em `public/video/` + `.webp` do 1º frame.

**Conteúdo por categoria** (rascunho do Claude; editável pelo admin)

| | Essencial | Pro | Max |
|---|---|---|---|
| O que é | A foto do imóvel ganha movimento de zoom e uma moldura com os dados: preço, quartos, banheiros, vagas, metragem | A IA transforma as fotos do imóvel num vídeo que passeia pelos cômodos, como se alguém andasse por dentro ou um drone passasse | O mesmo tour pelos cômodos, gerado por uma IA de qualidade superior: movimento mais natural e acabamento de vídeo filmado |
| Para quem | Quem quer o Instagram ativo com toda a carteira, pelo menor preço | Quem quer vídeo que prende a atenção, no volume do dia a dia | Imóveis de alto padrão e lançamentos, em que o vídeo precisa impressionar |
| Destaques | Posta todo imóvel novo · sem edição manual · moldura com a marca da imobiliária | Fotos reais do imóvel, sem inventar ambiente · 15 s, vertical · legenda por IA | Qualidade superior de movimento · fotos reais · 15 s, vertical |

Passos "como funciona", iguais nas três (de `02-produto-luminaimob.md`):

1. O sistema lê os imóveis da sua base (o mesmo XML dos portais).
2. Escolhe as melhores fotos.
3. Gera o vídeo (zoom, IA ou IA Max).
4. A IA escreve a legenda no tom da sua imobiliária.
5. Você aprova, edita ou rejeita, ou deixa no automático.
6. Publica no Instagram, TikTok e YouTube Shorts.

**Admin na demo:** todos os textos são editáveis clicando; o vídeo troca colando o link (`06-modo-admin.md`).

## Responsivo

- Uso principal: tela de computador compartilhada na call (Meet/Zoom). Desenhar para 1280–1440 px de largura.
- No celular: categorias e acessórios empilham; cards em coluna única; demo com vídeo em cima e texto embaixo; barra de resumo continua fixa embaixo.

## Publicação (C)

- **Vercel** (o Lucas já usa), com `noindex` (não aparece no Google).
- Link só da equipe; não enviar ao cliente (os parâmetros de custo ficam no código do site, ver `06`).
- O cliente recebe o **resumo copiado**, não o link.
