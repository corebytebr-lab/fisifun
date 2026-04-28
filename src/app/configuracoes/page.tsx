"use client";

import {  } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { useHydrated } from "@/lib/useHydrated";

export default function ConfiguracoesPage() {
  const mounted = useHydrated();
  const state = useGame();
  if (!mounted) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/perfil" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Perfil
      </Link>
      <h1 className="text-2xl font-extrabold md:text-3xl">⚙️ Configurações</h1>

      <Card className="border-indigo-500/30 bg-indigo-500/5">
        <CardTitle>🤖 Tutor IA</CardTitle>
        <CardSubtitle>
          A chave de IA é gerenciada pelo administrador do app. Você não precisa configurar nada — basta usar o botão &quot;Explique melhor&quot;, a aba Dúvida ou o Modo Professor.
        </CardSubtitle>
      </Card>

      <Card>
        <CardTitle>Aparência</CardTitle>
        <CardSubtitle>Escolha o tema do app.</CardSubtitle>
        <div className="mt-3 flex gap-2">
          {(["light", "system", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => state.setTheme(t)}
              className={`flex-1 rounded-xl border-2 p-3 text-sm font-bold capitalize ${
                state.theme === t ? "border-indigo-500 bg-indigo-500/10" : "border-[var(--border)]"
              }`}
            >
              {t === "light" ? "☀️ Claro" : t === "dark" ? "🌙 Escuro" : "🖥️ Sistema"}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Meta diária</CardTitle>
        <CardSubtitle>Quanto XP você quer ganhar por dia?</CardSubtitle>
        <div className="mt-3 flex gap-2">
          {[25, 50, 100, 200].map((xp) => (
            <button
              key={xp}
              onClick={() => state.setDailyGoal(xp)}
              className={`flex-1 rounded-xl border-2 p-3 text-sm font-bold ${
                state.dailyGoalXp === xp ? "border-indigo-500 bg-indigo-500/10" : "border-[var(--border)]"
              }`}
            >
              {xp} XP
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Lembrete de estudo</CardTitle>
        <CardSubtitle>Mostra um lembrete local no horário escolhido (navegador precisa estar aberto).</CardSubtitle>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="time"
            value={state.reminderTime ?? ""}
            onChange={(e) => state.setReminderTime(e.target.value || null)}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => state.setReminderTime(null)}
            disabled={!state.reminderTime}
          >
            Limpar
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle>Vidas 💖</CardTitle>
        <CardSubtitle>Você tem até 20 vidas. 1 vida regenera a cada 20 minutos.</CardSubtitle>
        <div className="mt-3 text-sm text-[var(--muted)]">
          Atualmente: <span className="font-bold text-[var(--fg)]">{state.hearts}/{state.maxHearts}</span>
        </div>
      </Card>

      <Card>
        <CardTitle>Modo sem distração</CardTitle>
        <CardSubtitle>Esconde a barra de navegação durante o estudo.</CardSubtitle>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => state.setFocusMode(!state.focusMode)}
            className={`relative h-7 w-12 rounded-full transition ${state.focusMode ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700"}`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                state.focusMode ? "left-5" : "left-0.5"
              }`}
            />
          </button>
          <span className="text-sm">{state.focusMode ? "Ativado" : "Desativado"}</span>
        </div>
      </Card>

      <Card>
        <CardTitle>Exportar / Importar progresso</CardTitle>
        <CardSubtitle>Faça backup dos seus dados.</CardSubtitle>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const data = localStorage.getItem("fisifun-state") || "{}";
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `fisifun-backup-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Exportar
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--bg)]">
            Importar
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const text = await f.text();
                try {
                  JSON.parse(text);
                  localStorage.setItem("fisifun-state", text);
                  window.location.reload();
                } catch {
                  alert("Arquivo inválido");
                }
              }}
            />
          </label>
        </div>
      </Card>
    </div>
  );
}
