# Test Report — 11 Minijogos (PR #2)

**Resumo**: Testei o fluxo principal dos minijogos em https://out-yosczfux.devinapps.com/jogos/. Foquei no custom game "Monte a Resolução" (o que o usuário pediu explicitamente) e uma regressão leve em "Unidade Correta".

---

## Resultado

- ✅ **T1** — Hub lista os 11 minijogos (`/jogos/`)
- ✅ **T2** — Monte a Resolução: fragmento errado tira 1 vida, mostra shake, slot continua (vazio)
- ✅ **T3** — Monte a Resolução: completa com "Montou! + bônus parcial" após 1 erro
- ✅ **T4** — Unidade Correta: acerto incrementa score 0→10 e streak 🔥 1

Nenhum teste falhou. Nenhum crash. XP global subiu de 0 → 35 durante os testes (confirmando integração com a store).

---

## Evidências

### T1 — Hub com 11 jogos

![Hub com 11 jogos](https://app.devin.ai/attachments/306521ed-8984-4ee6-91fe-8402f3f4c0c4/screenshot_57993dcbc77f46e39930fce062e5712f.png)

Estão todos: Match, Unidade, Ordem, Caça, Vetor, Queda, Gráfico, Duelo, Boss, Colisão, **Monte a resolução**.

### T2 — Monte a Resolução (estado inicial + após erro)

| 🟢 Precondição | 🟢 Após clicar fragmento errado |
|---|---|
| ![Estado inicial](https://app.devin.ai/attachments/dca3d264-85ae-4cc1-ad7a-e819552176cb/screenshot_81b8d3caaff84a2a917c4da3f101f58d.png) | ![Perde vida](https://app.devin.ai/attachments/ae9ff382-5579-4938-8005-2798cc63dc5b/screenshot_da572f0333344040afe3d1abffb5ef92.png) |
| 3 corações cheios · Erros: 0 · todos os 4 slots (vazio) | 2 corações + 1 outlined · **Erros: 1** · slot Dados continua (vazio) — rejeitou o fragmento errado |

Prompt da rodada: _"Uma força de 12 N atua sobre um corpo de 3 kg sem atrito. Qual a aceleração?"_
Cliquei no fragmento `a = 36 m/s²` (pegadinha — é um resultado errado no slot Dados). O sistema tirou 1 vida, bloqueou o encaixe e disparou o shake por ~500 ms.

### T3 — Monte a Resolução (sucesso com bônus parcial)

![Montou com bônus parcial](https://app.devin.ai/attachments/88a554f0-5e89-42ce-97da-141b6fe2a848/screenshot_1def9f850b564ac2b07db99c485e5638.png)

Depois do erro, cliquei a sequência correta: `F = 12 N; m = 3 kg` → `a = F/m` → `a = 12/3` → `a = 4 m/s²`. Os 4 slots ficaram verdes, score 55, e apareceu exatamente `Montou! + bônus parcial` (bônus reduzido por causa de 1 erro — comportamento esperado; se 0 erros seria `+30 XP`, se ≥2 seria `sem bônus`).

### T4 — Unidade Correta (regressão)

![Unidade correta acerto](https://app.devin.ai/attachments/c3ca0e9a-6548-41f4-9f03-ad03aec52cde/screenshot_c05b7b4df55f4e44b65e794611a44d9c.png)

Grandeza "momento linear", cliquei `kg·m/s` — opção ficou verde, `Isso! 🎯`, score 0→10, streak 🔥 1.

---

## Observações
- Navegação deep-link direto (digitar `/jogos/unidade-correta/` no endereço) carrega a home primeiro e só o SPA router resolve a rota — é artefato do host estático (`devinapps.com`). Quando clicar no tile no app, funciona normal. **Não é bug do código do PR**, mas vou resolver no deploy para o domínio próprio (Cloudflare Pages suporta rewrite pra rotas Next.js).

## O que não testei
- Os outros 9 jogos individualmente (usam mesmo `GameShell`; a regressão no Unidade Correta cobre o padrão)
- Login Google — ainda não implementado
- Custom domain — ainda não configurado

Vídeo completo em anexo na mensagem da Devin.
