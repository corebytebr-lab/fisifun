# Test Plan — 11 Minijogos (PR #2)

## What changed (user-visible)
A new `/jogos` hub was added with **11 minijogos** that integrate with the XP/streak/vidas system. The custom "Monte a resolução" game was explicitly requested: drag fragments into 4 slots (Dados → Fórmula → Substituição → Resultado) with pegadinhas (wrong fragments) that remove a life on each error and give a +30 XP bonus when done with zero errors.

## Primary flow — "Monte a resolução" pegadinhas mechanic

Evidence path: `src/app/jogos/monte-resolucao/page.tsx` L56–82 (tryPlace), L169–190 (fragments panel), L193–206 (success bonus), L208–230 (fail on 0 lives).
Content evidence: `src/content/games.ts` defines `FRAGMENT_PROBLEMS` with slots labeled Dados/Fórmula/Substituição/Resultado and extra wrong fragments.

### T1. Hub lists all 11 games (1 test)
- Navigate to `https://out-yosczfux.devinapps.com/jogos/`
- **Assertion:** page shows heading `🎮 Minijogos` and exactly 11 clickable cards with these titles: `Match de fórmulas`, `Unidade correta`, `Ordem dos passos`, `Caça ao erro`, `Vetor-alvo`, `Queda livre`, `Gráfico memória`, `Duelo relâmpago`, `Boss de capítulo`, `Colisão elástica`, `Monte a resolução`.
- **Broken-case visibility:** if the list is wrong or tiles <11, this test fails immediately.

### T2. Monte a Resolução — wrong fragment removes a life AND shakes (key mechanic)
- Navigate to `/jogos/monte-resolucao/`
- **Precondition assertion:** 3 red hearts visible; "Erros: 0" shown.
- Read the prompt (e.g. `Um carro parte do repouso e acelera a 2 m/s² por 5 s…`) and identify a fragment that is clearly WRONG for slot 1 (Dados) — e.g. a "Resultado" fragment like `v = 10 m/s` or a formula like `v = v₀ + at`.
- Click that wrong fragment.
- **Assertion A:** Hearts drop from 3 → 2 (one heart turns grey).
- **Assertion B:** "Erros: 0" → "Erros: 1".
- **Assertion C:** The wrong button flashes red with shake animation (border-rose-500, `anim-shake` class). Verified visually via screenshot during the 500ms window if possible; otherwise inferred from immediate post-state.
- **Assertion D:** Slot 1 (Dados) remains `(vazio)` — wrong fragment was NOT placed.
- **Broken-case visibility:** if clicking wrong fragment silently accepts it into the slot, T2 fails. If hearts don't decrement, T2 fails.

### T3. Monte a Resolução — correct sequence completes and awards bonus
- Continuing from T2 (or restart), click fragments in correct order for all 4 slots (Dados, Fórmula, Substituição, Resultado) — use the prompt to pick the right ones.
- **Assertion A:** Each slot turns green (`border-emerald-500 bg-emerald-500/10`) as it accepts a correct fragment.
- **Assertion B:** After the 4th correct fragment, a green success card appears with text `Montou!` and either `+ bônus 100% (30 XP)` (if 0 errors) or `+ bônus parcial` (if 1 error) or `sem bônus` (≥2 errors). From T2 we had 1 error, so expect `+ bônus parcial`.
- **Assertion C:** A `Próxima questão` button is visible.
- **Broken-case visibility:** if success doesn't fire after all 4 correct, or bonus text is missing/always says 30 XP regardless of errors, T3 fails.

### T4. Regression — Unidade correta awards score on correct pick
- Navigate to `/jogos/unidade-correta/`
- **Precondition:** score badge shows `0`.
- Read the grandeza label (e.g. "densidade da água"), click the option `kg/m³`.
- **Assertion:** score increments (e.g. 0 → 10 or similar) and next grandeza appears.
- **Broken-case visibility:** if score doesn't change or no next item appears, T4 fails.

## What this plan intentionally skips
- Does NOT test all 11 games individually (hub click-through proves they load; each uses the same `GameShell`).
- Does NOT test login/Firebase — not yet implemented.
- Does NOT test custom domain — not yet deployed.
- Does NOT re-test already-verified features (flashcards, pomodoro, calc, plano, notas, PWA) — covered in prior report.

## Evidence capture
Single continuous recording covering T1→T2→T3→T4 with `computer.record_annotate` calls at each `test_start` and `assertion`.
