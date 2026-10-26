# Modo admin (o "filtro")

> Definido pelo Lucas em 2026-10-16.

## Ideia

O admin **não é uma tela separada**. É uma camada (um "filtro") que liga e desliga **por cima do próprio site**. Com o filtro ligado, tudo o que aparece na tela fica editável **clicando direto na informação**, como quem edita um slide. Desligou, o site volta a ser a apresentação limpa que o cliente vê na call.

| | Modo apresentação (padrão) | Modo admin (filtro ligado) |
|---|---|---|
| Quem usa | sócio na call, cliente vendo a tela | sócio sozinho, preparando a apresentação |
| Textos, preços, vantagens | só leitura | clicou, editou |
| Calculadora | só **duração**, **vídeos/mês** e **preço final** | aparecem também os **parâmetros**, o **custo de API** e a **margem**, todos editáveis |
| Indicação visual | nenhuma | aviso fixo e claro de que o admin está ligado |

## Como liga

- **Tecla `L`** liga e desliga o filtro. Sem senha, sem botão na tela.
- A tecla não pode disparar enquanto o cursor estiver num campo de texto (senão digitar "L" num preço ou texto liga/desliga o admin).
- **Esc** também desliga (saída rápida).
- Ao ligar, aparece um aviso fixo, visível em qualquer rolagem (faixa no topo "Modo admin · L ou Esc para sair"), para ninguém esquecer o admin ligado com o cliente olhando.

> ⚠️ **Risco aceito:** sem senha, apertar `L` sem querer durante a call mostra custo e margem da calculadora. Mitigação: Esc fecha na hora.

## O que fica editável (tudo o que aparece)

Regra geral: **todo texto e número visível é editável no lugar**, com o mesmo visual. Nada de formulário à parte.

**Planos (Essencial, Pro)**
- Nome do plano e descrição do nível de vídeo
- Faixas existentes: quantidade de vídeos, duração, preço (sem criar nem remover faixa)
- ~~Selo de destaque ("recomendado")~~ removido do site em 2026-10-16
- Lista de vantagens/inclusos de cada plano: editar, adicionar, remover, reordenar

**Acessórios (Motion Graphics, Locução)**
- Nome, descrição, preço

**Conteúdo do site**
- Títulos, textos, "como funciona", provas (BR Luani), dados de mercado, condições comerciais, chamadas

**Calculadora do personalizado (Essencial e Pro)**

Em modo apresentação mostra só os controles de duração e quantidade e o preço final. No admin aparecem, editáveis:

| Parâmetro | Essencial hoje | Pro hoje |
|---|---|---|
| Base mensal | R$ 29 | R$ 69 |
| Taxa fixa por vídeo | R$ 1,00 | R$ 2,00 |
| Preço/s até 15 s | R$ 0,20 | R$ 0,60 |
| Preço/s acima de 15 s | R$ 0,40 | R$ 1,10 |
| Custo API/s (US$) | 0 | 0,084 |

Gerais: dólar efetivo (R$ 5,70), margem mínima alvo (50%), limites dos controles (duração de 5 a 60 s em passos de 5 s; de 1 a 200 vídeos).

Também visíveis só no admin: **custo de API/mês, lucro bruto, margem total e margem por vídeo**, em verde ou vermelho conforme a margem alvo (como a calculadora atual faz).

**Margem:** aparece **só no admin e só na calculadora**. As faixas fixas não mostram custo nem margem, nem no admin (decisão de 2026-10-16).

**Planos e faixas:** por enquanto só se **editam** os que existem. Criar ou remover plano ou faixa inteira fica para depois (decisão de 2026-10-16).

## Salvamento

- **Só no navegador** (localStorage). A edição fica naquele navegador, naquele computador.
- Consequências (aceitas):
  - Lucas e Ricardo **não** veem as edições um do outro; cada um tem a sua versão.
  - Limpar dados do navegador ou trocar de computador volta tudo ao padrão.
  - O site publicado sai com o **padrão do código** (os valores de `03-planos-e-acessorios.md`).
- Se o navegador bloquear o armazenamento (aba anônima, por exemplo), o site funciona com o padrão e o admin edita só naquela sessão.

## Desfazer

- **Ctrl+Z / Ctrl+Shift+Z** desfaz e refaz as edições **da sessão atual**.
- Sem histórico de versões salvo. Fechou a aba, o que ficou salvo é o estado final.

## Restaurar padrão

- Botão **"Restaurar padrão"**, visível só no admin.
- Pede confirmação antes ("Isso apaga todas as edições salvas neste navegador e volta aos valores originais").
- Apaga as edições do localStorage e volta tudo para o padrão do código (os valores de `03-planos-e-acessorios.md`).
- Não dá para desfazer com Ctrl+Z depois de confirmar.

## Decididas em 2026-10-16

| # | Pergunta | Resposta |
|---|---|---|
| ADM2 | Botão "restaurar padrão" | ✅ **Sim**, com confirmação |
| ADM5 | Criar/remover planos e faixas | ✅ **Ainda não**; só editar os que existem |
| ADM6 | Margem nas faixas fixas | ✅ **Não.** Margem só no admin, só na calculadora |

## Definidas pelo Claude (C), 2026-10-16

**ADM1 · Saída rápida.** `L` continua sendo o atalho (decisão do Lucas). **Esc** também desliga o admin na hora: se o admin abrir sem querer na call, Esc fecha sem precisar pensar.

**ADM3 · Exportar / Importar.** Dois botões no admin:
- **Exportar** baixa um arquivo JSON com todas as edições (`luminaimob-edicoes-AAAA-MM-DD.json`).
- **Importar** lê esse arquivo e aplica, com confirmação. É como o Lucas passa a versão dele para o Ricardo, e o backup antes de "Restaurar padrão".

**ADM4 · Trocar vídeo.** Com o admin ligado, clicar no vídeo (da demo ou de um acessório) abre um campo para **colar o link** do vídeo (arquivo `.mp4` público, YouTube ou Vimeo). Sem upload: o navegador não guarda vídeo no localStorage.

**ADM7 · Validação.**
- Preços e parâmetros: número ≥ 0, com vírgula ou ponto.
- Vídeos por mês: inteiro ≥ 1.
- Duração: 5 a 60 s.
- Valor inválido pisca em vermelho e volta ao anterior; nada inválido é salvo.
- Texto vazio não é aceito em nome de plano ou preço.

## Regras para quem for implementar

1. O modo apresentação nunca pode renderizar custo, margem, parâmetros nem nome de fornecedor, nem escondido por CSS. Esses elementos só existem no DOM com o admin ligado.
   - Limite conhecido: os parâmetros de custo ficam no JavaScript do site, e quem tiver o link e abrir o código consegue ler. Aceito porque o site é de uso interno em call, com `noindex` e link só da equipe (C). Se um dia o link for para cliente, tirar os custos do código antes.
2. Os valores padrão vêm de um único arquivo de dados, espelho de `03-planos-e-acessorios.md`. O localStorage guarda só o que foi alterado em relação ao padrão.
3. O que for editado no admin e virar decisão definitiva precisa ser copiado para `docs/03` e para o padrão do código. Senão some na próxima máquina.
