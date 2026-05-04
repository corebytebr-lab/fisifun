"use client";

import { useEffect, useMemo, useState } from "react";
import { CHAPTERS } from "@/content/index";
import type { Subject } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";

interface Video {
  id: string;
  chapterId: string;
  subject: string;
  youtubeId: string;
  title: string | null;
  description: string | null;
  position: number;
}

const SUBJECTS: Array<{ key: Subject; label: string; emoji: string }> = [
  { key: "fisica", label: "Física", emoji: "⚛️" },
  { key: "quimica", label: "Química", emoji: "🧪" },
  { key: "ga", label: "GA", emoji: "📐" },
  { key: "calculo", label: "Cálculo 1", emoji: "📈" },
];

export default function ConteudoAdmin() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Subject>("fisica");
  const [error, setError] = useState<string>("");

  async function load(opts?: { silent?: boolean }) {
    if (!opts?.silent) setLoading(true);
    try {
      const r = await fetch("/api/admin/chapter-videos", { cache: "no-store" });
      const j = await r.json();
      setVideos(j.videos || []);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const chaptersBySubject = useMemo(() => {
    const m = new Map<Subject, typeof CHAPTERS>();
    for (const subj of SUBJECTS) {
      m.set(subj.key, CHAPTERS.filter((c) => (c.subject ?? "fisica") === subj.key));
    }
    return m;
  }, []);

  const videosByChapter = useMemo(() => {
    const m = new Map<string, Video[]>();
    for (const v of videos) {
      if (!m.has(v.chapterId)) m.set(v.chapterId, []);
      m.get(v.chapterId)!.push(v);
    }
    for (const [, list] of m) list.sort((a, b) => a.position - b.position);
    return m;
  }, [videos]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold">📚 Conteúdo — Vídeos por Capítulo</h1>
        <p className="text-sm text-[var(--muted)]">
          Cole URLs do YouTube (não-listados, públicos ou unlisted). Você pode adicionar quantos vídeos quiser
          em cada capítulo. Os alunos veem todos em ordem na página do capítulo.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              active === s.key
                ? "bg-indigo-600 text-white"
                : "bg-[var(--bg-elev)] text-[var(--muted)] hover:bg-[var(--bg)]"
            }`}
          >
            {s.emoji} {s.label} ({chaptersBySubject.get(s.key)?.length ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-[var(--muted)]">Carregando…</div>
      ) : (
        <div className="flex flex-col gap-3">
          {(chaptersBySubject.get(active) ?? []).map((c) => {
            const list = videosByChapter.get(c.id) ?? [];
            return (
              <ChapterRow
                key={c.id}
                chapterId={c.id}
                subject={active}
                title={`${c.number}. ${c.title}`}
                emoji={c.emoji}
                videos={list}
                onChange={() => {
                  setError("");
                  load({ silent: true });
                }}
                onError={(e) => setError(e)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChapterRow(props: {
  chapterId: string;
  subject: Subject;
  title: string;
  emoji: string;
  videos: Video[];
  onChange: () => void;
  onError: (e: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!url.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/chapter-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: props.chapterId,
          subject: props.subject,
          url: url.trim(),
          title: title.trim() || null,
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        props.onError(j.error || "Erro ao adicionar vídeo");
        return;
      }
      setUrl("");
      setTitle("");
      props.onChange();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover este vídeo?")) return;
    await fetch(`/api/admin/chapter-videos/${id}`, { method: "DELETE" });
    props.onChange();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = props.videos.findIndex((v) => v.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= props.videos.length) return;
    const a = props.videos[idx];
    const b = props.videos[swap];
    await Promise.all([
      fetch(`/api/admin/chapter-videos/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: b.position }),
      }),
      fetch(`/api/admin/chapter-videos/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: a.position }),
      }),
    ]);
    props.onChange();
  }

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{props.emoji}</span>
          <div>
            <div className="font-bold">{props.title}</div>
            <div className="text-xs text-[var(--muted)]">
              {props.videos.length} vídeo{props.videos.length === 1 ? "" : "s"} • id: <code>{props.chapterId}</code>
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3 border-t border-[var(--border)] pt-3">
          {props.videos.length === 0 && (
            <div className="text-sm text-[var(--muted)]">Sem vídeos. Adicione abaixo.</div>
          )}
          {props.videos.map((v, i) => (
            <div
              key={v.id}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2"
            >
              <img
                src={`https://i.ytimg.com/vi/${v.youtubeId}/default.jpg`}
                alt=""
                width={80}
                height={60}
                className="rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-bold">{v.title || "(sem título)"}</div>
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:underline"
                >
                  {v.youtubeId} <ExternalLink size={12} />
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(v.id, -1)}
                  disabled={i === 0}
                  className="rounded p-1 hover:bg-[var(--bg-elev)] disabled:opacity-30"
                  title="Subir"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(v.id, 1)}
                  disabled={i === props.videos.length - 1}
                  className="rounded p-1 hover:bg-[var(--bg-elev)] disabled:opacity-30"
                  title="Descer"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => remove(v.id)}
                className="rounded p-2 text-red-500 hover:bg-red-500/10"
                title="Remover"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-[var(--border)] p-3">
            <div className="text-xs font-bold text-[var(--muted)]">Adicionar vídeo</div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtu.be/... ou https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Título (ex: "Aula 1: Vetores")'
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <Button onClick={add} disabled={!url.trim() || busy}>
              <Plus size={16} className="mr-1" /> {busy ? "Adicionando…" : "Adicionar vídeo"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
