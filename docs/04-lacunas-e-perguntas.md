# Decisões e pendências

> Atualizado em 2026-10-16. Não há mais perguntas em aberto: o Lucas pediu que o Claude definisse tudo o que faltava. Decisões do Claude estão marcadas **(C)** aqui e nos outros docs; revisar quando quiser e corrigir no doc de origem.
> Sobram só **tarefas de produção** (material que precisa ser feito), no fim.

## Mudanças do Lucas em 2026-10-26 (valem sobre as tabelas abaixo)

| # | Assunto | Decisão |
|---|---|---|
| M1 | Categoria **Max** | **Removida** do site (A2, A6, B10 e LAY8 abaixo ficam só como histórico). Sobram Essencial e Pro |
| M2 | Vídeo de demo do Max | Passou para o **Pro**: `public/video/pro-demo.mp4` agora é o antigo `max-demo.mp4`. Os posts da BR Luani deixaram de ser a demo do Pro; o selo do Pro virou "Exemplo em produção" |
| M3 | **Essencial Ilimitado** (R$ 300) | Virou **Essencial Personalizado**, com a mesma calculadora do Pro (B2, B5 e B12 ficam só como histórico). Acessórios agora valem em todos os cards |
| M4 (C) | Valores do Essencial Personalizado | Base R$ 81, taxa fixa R$ 0,60, R$ 0,20/s até 15 s, R$ 0,40/s acima (recalibrado em 2026-10-27). Bate com a tabela (30 × 15 s = R$ 189; 60 × 15 s = R$ 297). **O R$ 0,40/s acima de 15 s é palpite: revisar.** Custo/s no admin = 0 (só legenda e infra, não medidos) |

## Decididas pelo Lucas (2026-10-16)

| # | Assunto | Decisão |
|---|---|---|
| A1 | Quem vê o site | Apoio em call de venda |
| A2 | Preço do Max | Tabela: R$ 1.300 / R$ 2.200 |
| A3 | Acessórios | Preço fixo, valem para todos os vídeos |
| A4 | Implementação / fidelidade | Sem taxa, sem fidelidade |
| A6 | Nomes | Essencial (Zoom) / Pro (IA Básica) / Max (IA Max) |
| B1 | Duração do Essencial | 15 s |
| B2 | Ilimitado | Ilimitado real |
| B3 | Faixa do Pro | 50 / R$ 619 |
| B4 | Personalizado | Card à direita, com controles e preço nele |
| B6 | Inclusos | Legenda IA, aprovação, TikTok e Shorts, painel de resultados, vitrine de imóveis |
| B7 | Seedance | Não citar |
| B9 | Franquia | Para de gerar; sobra acumula 1 mês |
| ADM | Admin | Filtro na tela, tecla L, só navegador, desfazer na sessão, restaurar padrão, sem criar plano/faixa, margem só na calculadora |
| LAY | Layout | Categorias em cima, acessórios no lugar do "billing", demo troca os cards por vídeo + texto, botão do card seleciona o plano |

## Definidas pelo Claude (C) — revisar

| # | Assunto | Decisão | Onde |
|---|---|---|---|
| A5 | Fechamento da call | Resumo fixo no rodapé com total + botão verde **"Fechar"**: abre a tela de fechamento (a página escurece, a LuminaImob acende, resumo do que foi pedido e os próximos passos). Lucas, 2026-10-26; substitui o "Copiar resumo" | `07` |
| A6b | Grafia | **LuminaImob** | `03` |
| B5 | Acessórios em quais faixas | Todas, **exceto Essencial Ilimitado** (custo sem teto) | `03` |
| B8 | Selo "Recomendado" | ~~Essencial 60 · Pro 50 · Max 30~~ **Sem selo no site** (Lucas, 2026-10-16): todos os planos fixos em azul, Personalizado branco | `07` |
| B10 | Max: preço/s acima de 15 s | R$ 3,50 (taxa fixa R$ 0, R$ 2,00/s até 15 s, base R$ 400) | `03` |
| B11 | Moldura com a marca da imobiliária | Em todos os planos | `03` |
| B12 | Duração no Ilimitado | Sempre 15 s | `03` |
| C1 | Pagamento | Pix ou boleto mensal; sem desconto no lançamento; 1º mês pago antes da configuração | `03` |
| C2 | Prazo do 1º post | ~~Até 7 dias úteis após receber XML, acessos e identidade visual~~ **Revisto pelo Lucas (2026-10-16): até 20 dias da assinatura ao primeiro Reels no ar** | `03` |
| C3 | Teste grátis | Não tem; a call é o diagnóstico gratuito | `03` |
| C4 | Troca de plano | Subir na hora (diferença proporcional); descer no mês seguinte | `03` |
| C5 | Unidade de cobrança | Um plano por perfil (1 Instagram + 1 TikTok + 1 YouTube) | `03` |
| D2 | Mostrar BR Luani na call | Sim: nome, número (20 → 82 posts/mês) e posts reais. É call, não página pública, e a base já marca como citável. **2026-10-16 (Lucas):** a faixa de prova saiu da página e deu lugar à seção "Como começamos"; os posts seguem na demo do Pro | `07` |
| D4 | Onde fica o site | **Vercel**, com `noindex`, link só da equipe (não enviar ao cliente) | `07` |
| ADM1 | `L` sem querer na call | `L` continua sendo o atalho; **Esc** também sai do admin na hora | `06` |
| ADM3 | Edições entre navegadores | Botões **Exportar / Importar** (arquivo JSON) no admin | `06` |
| ADM4 | Trocar vídeo pelo admin | Sim, colando o **link** do vídeo (não upload) | `06` |
| ADM7 | Validação | Sem negativos, vídeos inteiros ≥ 1, duração 5–60 s; valor inválido volta ao anterior | `06` |
| LAY1 | Nº de cards | **3 por categoria** (Pro e Max: 2 faixas + Personalizado; Essencial: 3 faixas) | `07` |
| LAY2 | Categoria inicial | **Pro** | `07` |
| LAY3 | Texto do botão de demo | **"▶ Ver como funciona"** / volta com **"Ver preços"** | `07` |
| LAY4 | Recursos | Comuns uma vez abaixo dos cards; cada card lista só o que é dele | `07` |
| LAY5 | Resumo | Barra fixa no rodapé, aparece após "Escolher"; trocar de categoria mantém a seleção | `07` |
| LAY6 | Demo dos acessórios | Link "ver exemplo" em cada acessório do seletor, abre o vídeo num modal | `07` |
| LAY7 | Falta de vídeos de exemplo | Pro usa os posts reais da BR Luani; Essencial e Max mostram imagem + "exemplo em produção" até o vídeo existir | `07` |
| LAY8 | Textos da demo do Max | Mantido o rascunho do Claude (alto padrão e lançamentos) | `07` |

## Tarefas de produção (dependem de material, não de decisão)

| # | Tarefa | Quem |
|---|---|---|
| P1 | ~~Vídeo de exemplo do **Essencial**~~ **Feito 2026-10-16:** `public/video/essencial-demo.mp4` (720×1280, 15 s, versão web do original `ZOOM DEMO Base v2.mp4` em `midia-original/`) | Lumina |
| P2 | ~~Vídeo de exemplo do **Max**~~ **Feito 2026-10-16:** `public/video/max-demo.mp4` (720×1280, 23 s, versão web do original em `midia-original/`) | Lumina |
| P3 | Vídeo de exemplo do **Pro** (pode ser um post da BR Luani) | Lumina |
| P4 | Exemplos de **Motion Graphics** e **Locução** | Lumina |
| P5 | Logo da LuminaImob em SVG/PNG (até lá, nome em Space Grotesk + ícone da lâmpada) | Lumina |
| P6 | Medir custo real do vídeo Motion (base: "acima de R$ 15", nunca medido) | Lumina |

## Decisões da construção (C), 2026-10-16 — revisar

| # | Assunto | Decisão |
|---|---|---|
| CONS1 | Vídeo motion de 34 s | **Não entrou no site.** O vídeo mostra "20 → 46 posts por mês" na BR Luani; os docs e a base dizem **20 → 82**. Conferir qual número vale e corrigir o vídeo ou o doc |
| CONS2 | shadcn/ui | Usados os mesmos componentes Radix que o shadcn embrulha (Popover, Switch, Slider, Dialog, AlertDialog), direto do pacote `radix-ui`, sem o CLI do shadcn. Mesmo teclado e leitor de tela, menos arquivos |
| CONS3 | Título animado | Divisão em palavras feita pelo React em vez do SplitText (o SplitText mexe no DOM que o React controla e quebrava ao ligar o admin). Mesmo efeito visual |
| CONS4 | Dado de mercado | Entrou um, com fonte, no rodapé da demo: "43% de quem quer comprar e usa as redes assiste a tours e vídeos de imóveis" (Loft/Offerwise, 2026) |
| CONS5 | Reserva dos vídeos (LAY7) | Pro: os 3 posts reais da BR Luani em sequência. Essencial: foto real com zoom lento. Max e acessórios: foto real com movimento lento + selo "Exemplo em produção". Fotos recortadas dos posts do case |
| CONS6 | Gradiente com texto branco | O gradiente de ação claro (`#33BEF4`) não dá contraste AA com texto branco. Botão "Escolhido", contador e selo usam a mesma direção em tons mais fundos (`#0A84FF → #0067D6 → #00489B`); o card Recomendado também |
| CONS7 | Linha de categoria | Abaixo das pílulas, uma linha com nome e descrição da categoria ativa (editável no admin). Não estava no esboço de `07`; ajuda a call e dá lugar para editar o nome da categoria |

## Retoque de movimento e interação (C), 2026-10-16 — revisar

Pedido do Lucas: site "bem animado, profissional, formal, suave e leve", com lanterna de mouse nos cards e cursor exclusivo. Detalhes técnicos em `08` §5.

| # | Assunto | Decisão |
|---|---|---|
| MOV1 | Cursor exclusivo | Ponto preciso colado no mouse (o anel seguidor saiu a pedido do Lucas, 2026-10-16). Cresce e fica azul no clicável, vira pílula com rótulo no vídeo ("Ampliar", "Fechar"), fica branco sobre o azul/escuro, some sobre texto editável (volta o cursor de texto). **Só com mouse**; no toque e com movimento reduzido fica o cursor do sistema. Na call, o Meet/Zoom mostra o cursor da página |
| MOV2 | Lanterna nos cards | Luz que segue o mouse dentro do card + borda acesa nos cards vizinhos (estilo Linear). Branca nos cards azuis, ciano nos brancos. Também no painel "Todos os planos incluem" e nos passos da demo. No toque, acende onde o dedo encostou |
| MOV3 | Inclinação 3D | Arte dos cards e posts da BR Luani inclinam até 3° na direção do mouse. Pequeno de propósito: na call vira profundidade, não balanço. Desligada com o admin ligado |
| MOV4 | Ímã nos botões | Escolher, Ver como funciona, Acessórios, Fechar da barra e Fechar do modal andam até 6 px na direção do mouse; o rótulo anda metade a mais. Desligado com o admin ligado e com o popover aberto |
| MOV5 | Onda de luz no clique/toque | Botões principais e abas: uma onda nasce do ponto do clique |
| MOV6 | Fundo | Aurora clara e grade de pontos no topo (fixas) + luz ciano fraca que acompanha o mouse devagar, por trás de tudo |
| MOV7 | Transições de tela | Categoria: cards entram do lado para onde se andou. Preços ↔ demo: o conteúdo atual sai em 200 ms e o novo entra (demo: celular sobe, textos e passos em cascata). Barra de resumo agora também **desce** ao limpar |
| MOV8 | Rolagem | "Todos os planos incluem", "Como começamos" e condições aparecem ao rolar (uma vez só). Em "Como começamos" a caneta assina o contrato, o selo "Assinado" aparece e as etapas vêm uma a uma com as setas. Usa ScrollTrigger sem pin nem scrub, como o manual permitia |
| MOV10 | Hover nas etapas de "Como começamos" | A ilustração ganha vida por um instante: engrenagem gira, código "digita", balões sobem e descem, o ✓ e o dia marcado respiram |
| MOV9 | Detalhes | Título ganha uma faixa de luz na abertura; lâmpada da logo reacende no hover; "Escolher" acende o card (faixa de luz) e desenha o ✓; abas têm sombra de hover que desliza e a orbe acende ao trocar |

## Riscos registrados

Decisões de preço com risco de margem (Max abaixo do custo nos primeiros 15 s, acessórios sem teto, acúmulo de 1 mês): ver `90-INTERNO-custos-e-margens.md`.

## Sugestões de ingest (para levar à Base de Conhecimento)

- Nova tabela de 2026-10-16: Essencial / Pro / Max + acessórios, sem implementação nem fidelidade. Substitui o setup R$ 2.500 + R$ 200/mês na página `Lumina Imob`.
- Max usa **Seedance** (a base só cita Kling).
- Nova funcionalidade inclusa: **vitrine de imóveis** (painel tipo e-commerce com a carteira da imobiliária).
- Regras: franquia para ao passar do limite; sobra acumula 1 mês.
- Calculadora do personalizado e parâmetros de custo (US$ 0,084/s Pro; US$ 0,374/s Max; dólar R$ 5,70).
- Site de planos é ferramenta de call, não página pública.
- Prazo de implantação: **até 20 dias da assinatura ao primeiro Reels no ar**, com as etapas contrato → reunião de alinhamento → desenvolvimento da automação → no ar (2026-10-16).
