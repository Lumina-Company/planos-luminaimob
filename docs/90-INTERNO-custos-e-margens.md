# ⛔ INTERNO — custos, margens e histórico de preço

> **Nada deste arquivo vai para o site ou para cliente.** Serve para decidir preço.
> Fontes: Base de Conhecimento (`Lumina Imob`, `Precificação da Lumina Imob`, fontes de 2026-10-15) e a calculadora deste repositório.

## Custo por nível de vídeo (Lucas, 2026-10-15)

| Nível | Custo por vídeo |
|---|---|
| Zoom | R$ 0 de API de geração |
| Vídeo completo por IA (Kling) | R$ 5 a R$ 10 |
| Completo + Motion Graphics | acima de R$ 15 (não medido) |
| Locução por IA | R$ 1 a R$ 3 |

A duração pesa muito no custo.

## Parâmetros de custo da calculadora

| | IA Básica | IA Max (Seedance) |
|---|---|---|
| Custo API por segundo | US$ 0,084 | US$ 0,374 |
| Dólar efetivo (IOF + spread) | R$ 5,70 | R$ 5,70 |
| Custo de um vídeo de 15 s | **R$ 7,18** | **R$ 31,98** |
| Margem mínima alvo | 50% | 50% |

## Margem dos preços da imagem (2026-10-16)

| Faixa | Preço | Custo API | Margem bruta |
|---|---|---|---|
| Zoom 30 / 60 / Ilimitado | R$ 189 / 297 / — (histórico: 149 / 269 / 300 até 2026-10-27) | ~R$ 0 de geração (só legenda e infra) | alta; "ilimitado" sem teto de custo de legenda/infra |
| Básica 30 × 15 s | R$ 399 | R$ 215 | **46%** (abaixo do alvo de 50%) |
| Básica 50 × 15 s | R$ 619 | R$ 359 | **42%** (abaixo do alvo) |
| Max 30 × 15 s | R$ 1.300 | R$ 959 | **26%** |
| Max 60 × 15 s | R$ 2.200 | R$ 1.919 | **13%** |
| Max 30 × 15 s (fórmula da calculadora) | R$ 2.320 | R$ 959 | 59% |
| Max 60 × 15 s (fórmula da calculadora) | R$ 4.240 | R$ 1.919 | 55% |

## Riscos das decisões de 2026-10-16 (registrar, não bloquear)

O Lucas decidiu: Max fica R$ 1.300 / R$ 2.200; acessórios com preço fixo valendo para todos os vídeos; Essencial Ilimitado sem teto; sem implementação nem fidelidade; sobra acumula 1 mês.

1. **Max personalizado abaixo do custo por vídeo.** Para bater com a tabela, o Max cobra R$ 30 por vídeo de 15 s, e o custo de API é R$ 31,98. Cada vídeo a mais perde ~R$ 2; só a base de R$ 400 dá margem. Margem a 15 s: 30 vídeos 26% · 60 vídeos 13% · 100 vídeos 6% · 200 vídeos ~0%. Com dólar acima de R$ 5,70, fica negativa.
2. **Acessórios sem teto.**
   - Locução R$ 100/mês a R$ 1–3 por vídeo: empata entre 33 e 100 vídeos; Max 60 custa R$ 60–180; Essencial Ilimitado não tem limite.
   - Motion R$ 400/mês: o vídeo "completo + Motion" custa acima de R$ 15 (contra R$ 5–10 do completo); o custo real não foi medido. Num Pro 50 ou Max 60, o acréscimo pode passar de R$ 400. No Essencial Ilimitado, sem limite.
3. **Sobra acumula 1 mês:** num mês, um cliente pode gerar até 2× a franquia, e o custo de API dobra naquele mês.
4. **Sem implementação nem fidelidade:** o setup (configurar XML, moldura, contas) sai de graça e o cliente pode sair no mês 1.
5. **Essencial Ilimitado:** sem custo de geração, mas legenda (OpenAI), render (FFmpeg) e postagem crescem com o volume.

Mitigações já definidas pelo Claude (2026-10-16, a pedido do Lucas):

- Max personalizado: segundo acima de 15 s a R$ 3,50 (custo ~R$ 2,13/s, margem ~39% por segundo extra). Os primeiros 15 s continuam abaixo do custo; a margem de vídeos longos melhora (Max 30 × 30 s = R$ 2.875 contra custo de R$ 1.919 → 33%).
- Acessórios não entram no Essencial Ilimitado (fecha o risco de custo sem teto).
- Sem teste grátis; primeiro mês pago antes da configuração (cobre o setup sem taxa).

Sugestões que continuam (decisão dos sócios): teto de vídeos nos acessórios ou acessório por faixa; base do Max maior ou preço por vídeo ≥ R$ 40 no personalizado; medir 20 vídeos Motion antes de vender o acessório.

## Histórico de precificação

| Data | Modelo | Situação |
|---|---|---|
| até 2026-10 | Setup R$ 2.500 + R$ 200/mês | dava prejuízo (custo ≈ 2× a mensalidade) |
| 2026-10-15 | 4 modelos em estudo: (1) implementação ~R$ 2.000 + plano por nível (Zoom R$ 300, IA R$ 450, Motion+IA R$ 600); (2) R$ 800–900/mês à vontade; (3) implementação + API repassada + margem, com painel; (4) orçamento após diagnóstico | estudo |
| 2026-10-15 | Conselho 1: R$ 990/mês com 50 Reels IA, implementação isenta no plano de 3 meses; nunca "ilimitado" | recomendação, não decisão |
| 2026-10-15 | Conselho 2: planos por volume — Corretor R$ 490 (30), Imobiliária R$ 990 (40 IA + 10 Zoom), Imobiliária 100 R$ 1.790; + Motion R$ 490; + Locução R$ 350 | recomendação, não decisão |
| **2026-10-16** | **Imagem do Lucas: Zoom / IA Básica / IA Max + acessórios (ver `03`)** | **mais recente; tratado como vigente** |

Pontos em que a tabela de 2026-10-16 diverge das recomendações (não é erro, é decisão dos sócios; só registrar):

- Planos por **nível de vídeo** (o conselho sugeria por volume).
- Existe um **"Ilimitado"** no Zoom (o conselho dizia nunca usar "ilimitado").
- Acessórios bem mais baratos (Motion R$ 400 vs R$ 490; Locução R$ 100 vs R$ 350).
- Âncora de anúncio: o conselho sugeria um preço só no anúncio (R$ 990). Um site com todas as faixas expõe o plano de entrada.

## Outros números internos

- Meta: **3 clientes até 2026-12-31**.
- Preço que a BR Luani paga hoje: não informado. Conselho sugeriu R$ 690/mês travados por 12 meses em troca de depoimento e indicações.
- Calculadora: `LuminaImob calculador plano personalizado.html` (mostra custo e margem; versão pública precisa esconder isso).
