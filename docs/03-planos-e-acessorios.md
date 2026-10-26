# Planos e acessórios — LuminaImob

> **Fonte da verdade dos preços do site.**
> Origem: anotação do Lucas (imagem "Planos / Acessórios") e respostas dele em 2026-10-16; calculadora `LuminaImob calculador plano personalizado.html`.
> Itens marcados **(C)** foram definidos pelo Claude a pedido do Lucas (2026-10-16) e podem ser revistos. Lista completa em `04-lacunas-e-perguntas.md`.

## Para quem é o site

**Apoio em call de venda** (decisão de 2026-10-16). Lucas, Ricardo ou João mostram o site na reunião com o dono da imobiliária. Pode ter mais detalhe que uma página pública e inclui a calculadora do personalizado, mas **nunca mostra custo nem margem fora do admin**: o cliente está vendo a tela.

## Texto original (transcrito da imagem)

> **Planos:**
> - Zoom com moldura sistemática sem IA na edição - 30 Vídeos R$ 149 - 60 Vídeos 269 - Ilimitado R$ 300
> - Geração básica IA - 30, duração 15s R$399: - 50 Duração 15s R$619 - Personalizado
> - Geração IA Max(Com Seedance) - 30 duração 15s R$ 1300,00 - 60 duração 15s R$2200 - Personalizado
>
> **Acessorios**
> - Motion Graphics - R$ - 400,00 Mensal
> - Locução - 100,00 Mensal

## Planos

Todos mensais. Vídeo vertical de **15 s** em todas as faixas fixas.

### Essencial — vídeo com zoom e moldura padrão, sem IA na edição

A foto do imóvel com movimento de zoom e uma moldura padrão com os dados do imóvel (preço, quartos, banheiros, vagas, metragem).

| Faixa | Vídeos/mês | Preço/mês | Preço por vídeo | Selo |
|---|---|---|---|---|
| Essencial 30 | 30 | **R$ 149** | R$ 4,97 | |
| Essencial 60 | 60 | **R$ 269** | R$ 4,48 | **Recomendado** (C) |
| Essencial Personalizado | duração e quantidade escolhidas na call | calculadora | — | |

**Mudança de 2026-10-26 (Lucas):** o Essencial Ilimitado (R$ 300) saiu; no lugar entrou o Personalizado, com a mesma calculadora do Pro (ver "Personalizado" abaixo).

### Pro — vídeo gerado por IA a partir das fotos

Vídeo de até 15 s que passeia pelos cômodos como se alguém andasse ou um drone passasse, gerado das fotos reais do imóvel.

| Faixa | Vídeos/mês | Preço/mês | Preço por vídeo | Selo |
|---|---|---|---|---|
| Pro 30 | 30 | **R$ 399** | R$ 13,30 | |
| Pro 50 | 50 | **R$ 619** | R$ 12,38 | **Recomendado** (C) |
| Pro Personalizado | duração e quantidade escolhidas na call | calculadora | — | |

### Max — **removido em 2026-10-26** (Lucas)

O Max (R$ 1.300 / R$ 2.200 / Personalizado) não existe mais. O vídeo de demonstração dele passou a ser o do **Pro** (`public/video/pro-demo.mp4`). Histórico de preço e parâmetros do Max: `90-INTERNO-custos-e-margens.md` e `git log`.

## Acessórios

Somam ao plano. **Preço fixo por mês, valem para todos os vídeos da franquia.**

| Acessório | O que é | Preço |
|---|---|---|
| **Motion Graphics** | Vídeo inteiro animado; os dados do imóvel entram animados na tela em vez da moldura | **R$ 400/mês** |
| **Locução por IA** | Narração no vídeo | **R$ 100/mês** |

Onde valem: **em todas as faixas e nos dois Personalizados.** (Antes, o Essencial Ilimitado não aceitava acessório porque não tinha teto de vídeos; com ele fora, todo plano tem franquia.)

## O que todo plano inclui (Essencial e Pro)

- Leitura automática da base de imóveis da imobiliária (XML dos portais)
- Legenda escrita por IA, no tom da imobiliária
- Aprovação antes de postar (o gestor aprova, edita ou rejeita; liga e desliga)
- Publicação automática no Instagram (Reels), **TikTok e YouTube Shorts**
- Painel de resultados (histórico e métricas)
- **Vitrine de imóveis:** painel que mostra a carteira da imobiliária como um e-commerce, para o dono ver os imóveis dele
- Moldura/rodapé com a identidade visual da imobiliária (C)

## Condições comerciais

| Regra | Decisão |
|---|---|
| Cobrança | Mensal |
| Taxa de implementação | **Não tem** |
| Fidelidade / contrato mínimo | **Não tem** |
| Passou da franquia no mês | **Para de gerar** e retoma no mês seguinte; a call sugere subir de faixa |
| Vídeos não usados | **Acumulam por 1 mês** (a sobra passa só para o mês seguinte) |
| Forma de pagamento | **Pix ou boleto**, vencimento mensal; primeiro mês pago antes da configuração (C) |
| Desconto trimestral/anual | **Não tem no lançamento** (C). Sem fidelidade, desconto por prazo não faz sentido ainda |
| Prazo para o primeiro post | **Até 20 dias** da assinatura do contrato ao primeiro Reels no ar (Lucas, 2026-10-16, slide "Como começamos" da apresentação comercial). Substitui os 7 dias úteis da decisão C2 |
| Teste grátis | **Não tem** (C): cada vídeo com IA custa. A call é o "diagnóstico gratuito" dos criativos |
| Troca de plano | **Subir:** na hora, cobrando a diferença proporcional do mês. **Descer:** vale no mês seguinte (C) |
| Unidade de cobrança | **Um plano por perfil**: 1 Instagram + 1 TikTok + 1 YouTube. Segundo perfil = segundo plano (C) |

## Personalizado (Essencial e Pro): card com calculadora

Card "Personalizado", sempre o último à direita, com os controles e o preço dentro dele. O cliente escolhe **duração por vídeo** (5 s a 60 s, passo de 5 s) e **vídeos por mês** (1 a 200). Fora do admin mostra **só duração, quantidade e preço**.

```
preço por vídeo = taxa fixa + preço/s até 15 s × min(duração, 15) + preço/s acima de 15 s × max(duração − 15, 0)
preço mensal    = base mensal + quantidade × preço por vídeo
```

| Parâmetro | Essencial | Pro |
|---|---|---|
| Base mensal | R$ 29 (C) | R$ 69 |
| Taxa fixa por vídeo | R$ 1,00 (C) | R$ 2,00 |
| Preço/s até 15 s | R$ 0,20 (C) | R$ 0,60 |
| Preço/s acima de 15 s | R$ 0,40 (C) | R$ 1,10 |
| Custo API/s (só admin) | US$ 0 (zoom, sem IA; legenda e infra não medidos) | US$ 0,084 |
| Resultado 30 × 15 s | R$ 149 ✅ tabela | R$ 399 ✅ tabela |
| Resultado 60 × 15 s / 50 × 15 s | R$ 269 ✅ tabela (60) | R$ 619 ✅ tabela (50) |

**Essencial (C, 2026-10-26):** o Lucas pediu "os mesmos parâmetros do personalizado"; os valores foram calibrados para o Personalizado bater com a tabela do Essencial (base R$ 29 + R$ 4 por vídeo de 15 s: 30 × 15 s = R$ 149 e 60 × 15 s = R$ 269). O preço/s acima de 15 s (R$ 0,40, o dobro do trecho até 15 s) é palpite do Claude: revisar. Exemplo: Essencial 30 × 30 s = R$ 29 + 30 × (1 + 3 + 6) = **R$ 329**.

Exemplos do Pro personalizado: 30 × 30 s = R$ 894; 100 × 15 s = R$ 1.169.

## Nomes

| No site | Na calculadora/imagem | Nível de vídeo |
|---|---|---|
| **Essencial** | Zoom | zoom + moldura, sem IA |
| **Pro** | IA Básica / Geração básica IA | vídeo por IA |

Produto: **LuminaImob**, junto (C) — é a grafia dos criativos, da logo e da calculadora.
