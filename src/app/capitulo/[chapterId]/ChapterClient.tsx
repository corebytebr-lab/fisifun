"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { findChapter } from "@/content/index";
import { useGame } from "@/lib/store";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { RichText, InlineMath } from "@/lib/format";
import { ChevronLeft, Check, Play, AlertTriangle, Target, BookOpen, Video as VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useHydrated } from "@/lib/useHydrated";

interface ChapterVideoLite {
  id: string;
  youtubeId: string;
  title: string | null;
  description: string | null;
}

export default function ChapterClient() {
  const params = useParams<{ chapterId: string }>();
  const mounted = useHydrated();
  const chapter = findChapter(params.chapterId);
  const progress = useGame((s) => s.lessonProgress);
  const [videos, setVideos] = useState<ChapterVideoLite[]>([]);
  const [activeVideo, setActiveVideo] = useState<number>(0);

  useEffect(() => {
    if (!params.chapterId) return;
    let alive = true;
    fetch(`/api/chapter-video?chapterId=${encodeURIComponent(params.chapterId)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setVideos(j.videos || []);
        setActiveVideo(0);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [params.chapterId]);

  if (!chapter) return <div className="p-4">Capítulo não encontrado.</div>;

  const done = chapter.lessons.filter((l) => progress[`${chapter.id}/${l.id}`]?.completed).length;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 md:px-8">
      <Link href="/trilha" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Trilha
      </Link>

      <Card className="bg-gradient-to-br text-white" style={{ background: `linear-gradient(135deg, ${chapter.color}, #312e81)` }}>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
            {chapter.emoji}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase opacity-80">Capítulo {chapter.number}</div>
            <h1 className="text-2xl font-extrabold">{chapter.title}</h1>
            <div className="text-sm opacity-90">{chapter.subtitle}</div>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={done} max={chapter.lessons.length} color="emerald" />
          <div className="mt-1 text-xs opacity-90">{done}/{chapter.lessons.length} lições concluídas</div>
        </div>
      </Card>

      {videos.length > 0 && (
        <Card>
          <CardTitle className="flex items-center gap-2"><VideoIcon size={18} /> Vídeo-aulas</CardTitle>
          <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              key={videos[activeVideo]?.youtubeId}
              src={`https://www.youtube.com/embed/${videos[activeVideo]?.youtubeId}?rel=0&modestbranding=1`}
              title={videos[activeVideo]?.title || "Vídeo do capítulo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          {videos[activeVideo]?.description && (
            <p className="mt-2 text-sm text-[var(--muted)]">{videos[activeVideo].description}</p>
          )}
          {videos.length > 1 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {videos.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVideo(i)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                    i === activeVideo
                      ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                      : "hover:bg-[var(--bg-elev)]"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="truncate">{v.title || `Vídeo ${i + 1}`}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle className="flex items-center gap-2"><Target size={18} /> Objetivos</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {chapter.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </Card>
        <Card>
          <CardTitle className="flex items-center gap-2"><BookOpen size={18} /> Conceitos-chave</CardTitle>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {chapter.keyConcepts.map((k) => (
              <span key={k} className="rounded-full bg-indigo-500/10 px-2 py-1 text-indigo-600 dark:text-indigo-300">{k}</span>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle className="flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Erros comuns</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {chapter.commonMistakes.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </Card>
        <Card>
          <CardTitle>Unidades envolvidas</CardTitle>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chapter.units.map((u) => (
              <span key={u} className="rounded-md border border-[var(--border)] px-2 py-1 text-xs font-mono">{u}</span>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Fórmulas importantes</CardTitle>
        <CardSubtitle>Toque numa fórmula para ver quando aplicar.</CardSubtitle>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {chapter.formulas.map((f) => (
            <div key={f.id} className="rounded-xl border border-[var(--border)] p-3">
              <div className="text-sm font-bold">{f.name}</div>
              <div className="my-2"><InlineMath expr={f.latex} /></div>
              <div className="text-xs text-[var(--muted)]">{f.whenToUse}</div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="mb-2 text-lg font-bold">Lições</h2>
        <div className="flex flex-col gap-2">
          {chapter.lessons.map((l, i) => {
            const key = `${chapter.id}/${l.id}`;
            const doneL = !!progress[key]?.completed;
            const prevDone = i === 0 ? true : !!progress[`${chapter.id}/${chapter.lessons[i - 1].id}`]?.completed;
            const locked = mounted && !doneL && !prevDone;
            return (
              <div
                key={l.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${doneL ? "bg-emerald-500 text-white" : ""}`}
                  style={!doneL ? { backgroundColor: chapter.color + "25", color: chapter.color } : {}}
                >
                  {doneL ? <Check size={18} /> : kindIcon(l.kind)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{l.title}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {l.estMinutes} min · +{l.xpReward} XP
                    {doneL && " · Concluída"}
                  </div>
                </div>
                {locked ? (
                  <span className="text-xs text-[var(--muted)]">🔒</span>
                ) : (
                  <Link href={`/licao/${chapter.id}/${l.id}`}>
                    <Button size="sm">
                      <Play size={14} /> {doneL ? "Refazer" : "Iniciar"}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <RichText>{`**Dica:** revise depois pela repetição espaçada e pelo modo "rever só o que eu errei".`}</RichText>
      </div>
    </div>
  );
}

function kindIcon(k: string) {
  if (k === "concept") return "📖";
  if (k === "example") return "🧠";
  if (k === "practice") return "✏️";
  if (k === "quiz") return "🏆";
  if (k === "halliday") return "📗";
  if (k === "challenge") return "⚡";
  return "▶";
}
