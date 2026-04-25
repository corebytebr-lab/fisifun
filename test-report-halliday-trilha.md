# Test Report — Halliday obrigatório na trilha

**App testado:** https://out-yosczfux.devinapps.com
**PR:** https://github.com/corebytebr-lab/fisifun/pull/2
**Branch:** `devin/1777003099-tutor-ia`
**Sessão Devin:** https://app.devin.ai/sessions/c173eba142304b28b914ecba2ac2a727

## Resumo

Testei a nova lição obrigatória "Problemas do livro (Halliday)" injetada ao final de cada capítulo da trilha, e a regressão da `/problemas` (treino livre). **Todos os 4 testes passaram.**

## Testes

### ✓ It should append 'Problemas do livro (Halliday)' as last lesson of each chapter
**passed** — Cap 1 agora lista 6 lições; a 6ª é "Problemas do livro (Halliday) · Problemas do livro · 15 min · +60 XP" com ícone 📗. Todos os outros 10 capítulos também mostram o item no final (conferido via DOM).

![Trilha com Halliday na Cap 1](https://app.devin.ai/attachments/bdab10d7-b992-4814-aedc-80ff809a2865/screenshot_8929d1f627054bdd84effbc516974232.png)

### ✓ It should open the Halliday lesson and show 5 problems with progress 0/3
**passed** — Abriu em `/licao/01-medicao/halliday-livro` com header "Problemas do livro (Halliday)", texto "Resolva ao menos **3** destes **5** problemas", barra 0/3, e 5 cards numerados (Problemas 10, 11, 12, 13, 14) todos `• Nível 1`. Botão inferior aparece como `Faltam 3 para concluir` disabled.

![Lição aberta com 5 problemas e barra 0/3](https://app.devin.ai/attachments/0a4f8511-6de9-494c-8eb5-2cd103b0a0bd/screenshot_ab33b6db90d44275af15564c89e7143d.png)

### ✓ It should enable 'Concluir lição' after answering 3 problems
**passed** — Cliquei Acertei → Errei → Acertei nos 3 primeiros cards. Barra foi 0→1→2→3/3, texto mostrou `3/3 respondidos · 2 corretos`, e o botão mudou de `Faltam N para concluir` (disabled) para `Concluir lição` (enabled). Vida permaneceu em 5/5 (vida infinita ligada).

![Barra 3/3 e botão Concluir lição habilitado](https://app.devin.ai/attachments/8556d577-09f7-4170-b4af-f09ce9b75ecf/screenshot_d6809abf45a94c84ac9bcdb4042a2d2b.png)

### ✓ It should complete the lesson and mark it done on the trilha
**passed** — Cliquei "Concluir lição" → DoneScreen "Lição concluída! Medição · Problemas do livro (Halliday) · 2/3 acertos". De volta em `/trilha`, a lição 6 do Cap 1 mostra ✓ verde.

![DoneScreen](https://app.devin.ai/attachments/557bf1a5-08f6-4b69-81a7-7ac2576d903f/screenshot_94c702f98db94120be65b0363d3ee211.png)

![Trilha com check verde na lição Halliday](https://app.devin.ai/attachments/c741ad8f-b0c7-4d13-80f7-b50e21f9e901/screenshot_9253a774058b40ecba54645c977816b5.png)

### ✓ Regressão — /problemas page independente da trilha
**passed** — `/problemas` continua renderizando os 248 problemas, com filtros por capítulo/nível/status funcionando. O progresso (2/248, 1 errada) reflete as respostas que dei na lição do trilha, mas o fluxo e UX da aba estão intactos e não bloqueiam quando a trilha está travada.

## Observações

- **Comportamento correto do unlock do Cap 2:** O Cap 2 só desbloqueia quando **todas** as 6 lições do Cap 1 estiverem concluídas, incluindo a nova Halliday. Como nos testes só completei a lição Halliday (sem fazer as 5 anteriores), o Cap 2 permaneceu travado — isso é exatamente o comportamento esperado ("obrigado a fazer"). Verificado visualmente na trilha.
- **Qualidade do texto dos problemas:** como já documentado na PR, alguns problemas têm palavras grudadas ou figuras perdidas (extração do PDF). Não afeta o fluxo; o usuário sempre pode clicar "Abrir no Tutor IA" pra reorganizar.
- **Vida:** com `infiniteHearts=true` (padrão), clicar "Errei" não consume vida. Não reverti pra testar o consumo de vida — mas o código chama `consumeHeart()` no `onWrong`, que respeita a flag.

## Links

- PR: https://github.com/corebytebr-lab/fisifun/pull/2
- App: https://out-yosczfux.devinapps.com
- Test plan: `test-plan-halliday-trilha.md`
