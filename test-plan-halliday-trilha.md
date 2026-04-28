# Test plan — Problemas do Halliday na Trilha (obrigatórios)

## O que mudou (user-visible)

1. A **trilha** (`/trilha`) agora tem uma lição a mais no fim de cada capítulo: **"Problemas do livro (Halliday)"** (ícone 📗). Ela só desbloqueia depois das outras lições do capítulo.
2. Essa lição mostra **5 problemas do Halliday** (ordenados por dificuldade) e exige responder **pelo menos 3** (Acertei ou Errei) pra concluir. Enquanto isso, o botão "Concluir lição" fica disabled com texto `Faltam N para concluir`.
3. Completar a lição marca check-verde na trilha e **desbloqueia o próximo capítulo** se for a última lição.
4. A aba **/problemas** continua livre pra treino solto — nada mudou lá.

## Pass/fail concreto

### Setup: pular lições iniciais do Cap 1

As 4 lições anteriores do Cap 1 não têm relação com o que mudou. Para ir direto ao teste do PR, vou marcar essas 4 como completas via `localStorage` (setItem em `fisifun-v1` dentro do campo `state.lessonProgress`).

### Fluxo primário — Cap 1 · Problemas do livro (Halliday)

| Step | Ação | Assertion |
|------|------|-----------|
| 1 | Abrir `/trilha` | A seção "Capítulo 1 — Medição" mostra 5 lições: `O que é Física e Medir?`, `Conversão de unidades`, `Algarismos e ordens de grandeza`, `Densidade — aplicando fórmula`, `Quiz — Medição`, e uma 6ª lição **"Problemas do livro (Halliday)"** com label `Problemas do livro · 15 min · +60 XP`. |
| 2 | Estado inicial (sem pular) | A lição "Problemas do livro (Halliday)" aparece **bloqueada** (ícone cadeado) com texto "Complete a lição anterior para desbloquear." |
| 3 | (setup) Injetar progresso das 5 primeiras lições | Após reload, a 6ª lição aparece **destravada** (clicável, com ícone 📗). |
| 4 | Clicar em "Problemas do livro (Halliday)" | Abre `/licao/01-medicao/halliday-livro`. Deve mostrar: header "Problemas do livro (Halliday)", texto "Resolva ao menos **3** destes **5** problemas", barra de progresso 0/3, e **5 cards de problema** todos com label "Cap. 1 · Medição · Problema N" e difficulty dots (•, ••, ou •••). |
| 5 | Clicar "Acertei" no problema 1 | Botão vira verde sólido · progresso barra atualiza para 1/3 · texto muda para "1/3 respondidos · 1 corretos" · botão "Concluir lição" ainda disabled com texto "Faltam 2 para concluir". XP do usuário sobe em +8 (nível 1). |
| 6 | Clicar "Acertei" no problema 2 | Progresso 2/3, botão ainda disabled ("Faltam 1 para concluir"). |
| 7 | Clicar "Errei" no problema 3 | Botão vira vermelho · progresso 3/3 · botão "Concluir lição" **habilita** com texto "Concluir lição". Vida **não** diminui (infiniteHearts=true). |
| 8 | Clicar "Concluir lição" | Vai pra tela DoneScreen com 🎉 "Lição concluída!" mostrando "1/3 acertos" ou similar. |
| 9 | Voltar em `/trilha` | Agora a lição 6 do Cap 1 mostra check verde (✓ marca como concluída). |
| 10 | Conferir Cap 2 | O primeiro item do Capítulo 2 ("Posição, deslocamento e distância") está **desbloqueado** (clicável, sem cadeado). |

### Regression — `/problemas`

| Step | Ação | Assertion |
|------|------|-----------|
| R1 | Abrir `/problemas` direto | Página renderiza normal, com filtros e lista de ~248 problemas. |
| R2 | Filtrar por capítulo 2 + nível ••• | Lista restringe a problemas do Cap 2 com 3 dots vermelhos. |

## Why each assertion would fail if code is broken

- Se `withHallidayLesson` não estivesse injetando a lição: step 1 falharia (só 5 lições no Cap 1).
- Se `LessonClient` não tratasse `kind === "halliday"`: step 4 cairia no phase "done" ou "intro" sem renderizar os problemas.
- Se `HALLIDAY_LESSON_MIN_ANSWERED = 3` não fosse respeitado: botão "Concluir lição" habilitaria antes ou nunca.
- Se `markHalliday` não persistisse: progresso não subiria ao clicar Acertei.
- Se `finish()` não chamasse `unlockChapter`: step 10 falharia (Cap 2 continuaria bloqueado).

## Evidências a capturar

- Screenshot da /trilha mostrando a 6ª lição do Cap 1 (📗)
- Screenshot do lesson screen com a barra de progresso 0/3 antes de responder
- Screenshot com 3/3 respondidos e "Concluir lição" habilitado
- Screenshot do DoneScreen
- Screenshot da /trilha depois, com check verde na lição 6 e Cap 2 desbloqueado
