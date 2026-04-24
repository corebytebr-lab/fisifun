# FisiFun 🚀

Um app gamificado estilo **Duolingo** para estudo de **Física 1 (Mecânica)** baseado no livro **Halliday — Fundamentos de Física, Vol. 1 (9ª ed.)**.

> Feito com Next.js 16 + TypeScript + Tailwind + Zustand + KaTeX + Recharts. Tudo roda no navegador, com progresso salvo em `localStorage`.

## Como rodar localmente

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # gera build estático em out/
npm run lint
```

## O que tem dentro

### 📚 Conteúdo (11 capítulos de Mecânica)
1. Medição
2. Movimento retilíneo (cinemática 1D)
3. Vetores
4. Movimento em 2D e 3D (projétil, circular, relativo)
5. Força e Movimento I (leis de Newton)
6. Força e Movimento II (atrito, arrasto, circular)
7. Trabalho e Energia Cinética
8. Energia Potencial e Conservação de Energia
9. Centro de Massa e Momento Linear
10. Rotação
11. Rolamento, Torque e Momento Angular

Cada capítulo tem: objetivos, conceitos-chave, unidades, erros comuns, biblioteca de fórmulas e 4–5 lições (conceito → exemplo → prática → quiz).

### 🎮 Gamificação
- XP, níveis (curva 100 × 1.15ⁿ⁻¹)
- Streak diária (recorde salvo)
- Vidas com regeneração (25 min/vida, máx 5)
- Moedas
- **19 conquistas** (streak, XP, perfeição, revisão, etc.)
- 3 estrelas por lição (100% / 75% / 50%)
- Meta diária configurável (25/50/100/200 XP)
- Tela final "Zerou o FisiFun" listando **tudo** que o app tem

### 📝 10 tipos de exercício
Múltipla escolha · V/F · Preencher lacunas · Montar fórmula (drag & drop) · Ordenar passos · Input numérico · Número + unidade · Leitura de gráfico · Identificar conceito em diagrama · Mini-caso prático

### ⚡ Modos de estudo
- **Trilha** linear por capítulo (com desbloqueio progressivo)
- **Treino rápido** (5/10/20 ex., cronômetro opcional)
- **Revisão de erros** (só o que você errou)
- **SRS** (repetição espaçada estilo SM-2)
- **Prova** (simulado por capítulo ou cumulativo)
- **Biblioteca de fórmulas** pesquisável

### 📈 Estatísticas
- Gráfico XP últimos 7 dias (linha)
- Acertos × erros por dia (barras empilhadas)
- Desempenho por capítulo
- Domínio por conceito (EMA)

### ⚙️ Outras features
- Tema claro / escuro / sistema
- Modo sem distração
- Lembrete de estudo (horário configurável)
- Avatar + username personalizados
- Exportar / importar progresso (JSON)

## Arquitetura

```
src/
├─ app/                    # rotas (App Router)
│  ├─ page.tsx             # home
│  ├─ trilha/              # mapa de capítulos
│  ├─ capitulo/[id]/       # detalhe do capítulo
│  ├─ licao/[c]/[l]/       # runner de lição
│  ├─ treino/              # modo treino
│  ├─ revisao/             # erros + SRS
│  ├─ prova/               # simulado
│  ├─ formulas/            # biblioteca
│  ├─ conquistas/          # medalhas
│  ├─ perfil/              # perfil
│  ├─ estatisticas/        # gráficos
│  ├─ configuracoes/       # settings
│  └─ vitoria/             # tela "zerou"
├─ components/
│  ├─ AppShell.tsx         # navegação + tema
│  ├─ game/GameBar.tsx     # XP, vidas, streak
│  ├─ exercicios/          # runner universal
│  └─ ui/                  # Card, Button, Progress
├─ content/
│  ├─ chapters/            # um arquivo por capítulo
│  ├─ helpers.ts           # fábricas de exercício
│  └─ index.ts             # registry
└─ lib/
   ├─ types.ts             # tipos (Exercise, Lesson, …)
   ├─ store.ts             # Zustand + localStorage
   ├─ achievements.ts      # 19 conquistas
   ├─ format.tsx           # KaTeX + RichText
   └─ useHydrated.ts       # safe hydration
```

O conteúdo está 100% separado da UI: para adicionar uma lição nova, edite um arquivo em `src/content/chapters/`.

## Persistência

Tudo é salvo em `localStorage` sob a chave `fisifun-state` via `zustand/persist`. Inclui: XP, nível, vidas, streak, conquistas, progresso de lição, histórico de tentativas, SRS, mastery por conceito, daily log, preferências.

Você pode **exportar** o JSON completo em **Configurações → Exportar progresso** e importar em outro navegador.

## Feito para

Estudar **Física 1 / Mecânica** de forma ativa, em blocos curtos (5–20 min), com revisão inteligente e feedback imediato. O foco é didático: todo erro tem explicação curta da lógica correta e aponta o conceito/fórmula envolvida.

## Melhorias futuras possíveis

- PWA offline-first com service worker
- Sincronização na nuvem (Supabase / Firebase)
- Mais capítulos (Vol. 2 — Ondas, Termo, Eletromag)
- Geração de exercícios por IA
- Multiplayer / ranking global
- Integração com livros-texto (links profundos)
- Exportar certificados / badges por capítulo
- Accessibility pass (WCAG AA)
- Testes unitários (Vitest) + E2E (Playwright)
