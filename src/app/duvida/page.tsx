"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Card, CardTitle, CardSubtitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Sparkles, Image as ImageIcon, Loader2, Send, Trash2 } from "lucide-react";
import { useGame } from "@/lib/store";
import { callGemini, fileToInlineData, TUTOR_SYSTEM, type GeminiMessage, type GeminiPart } from "@/lib/gemini";
import { RichText } from "@/lib/format";
import { useHydrated } from "@/lib/useHydrated";

interface ChatMsg {
  role: "user" | "model";
  text: string;
  imageUrl?: string;
}

export default function DuvidaPage() {
  const mounted = useHydrated();
  const apiKey = useGame((s) => s.geminiApiKey);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function send() {
    if (!apiKey) {
      setError("NO_KEY");
      return;
    }
    if (!input.trim() && !image) return;
    setError(null);
    setLoading(true);
    const userText = input.trim() || "Me ajude com esta questão da foto.";
    const userImgUrl = imagePreview;
    const userMsg: ChatMsg = { role: "user", text: userText, imageUrl: userImgUrl ?? undefined };
    const nextHistory = [...history, userMsg];
    setHistory(nextHistory);
    setInput("");

    try {
      const parts: GeminiPart[] = [];
      if (image) parts.push(await fileToInlineData(image));
      parts.push({ text: userText });

      const messages: GeminiMessage[] = [];
      for (const m of history) {
        messages.push({ role: m.role, parts: [{ text: m.text }] });
      }
      messages.push({ role: "user", parts });

      const reply = await callGemini({ apiKey, system: TUTOR_SYSTEM, messages });
      setHistory([...nextHistory, { role: "model", text: reply }]);
      setImage(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setHistory(history);
    } finally {
      setLoading(false);
    }
  }

  function handleFile(f: File | null) {
    setImage(f);
    if (f) {
      const r = new FileReader();
      r.onload = () => setImagePreview(r.result as string);
      r.readAsDataURL(f);
    } else {
      setImagePreview(null);
    }
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-4 md:px-0 md:pt-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} /> Início
      </Link>

      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
          <Sparkles className="text-indigo-500" /> Tirar dúvida
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Cole o enunciado ou tire foto do seu dever. O tutor resolve passo a passo no estilo Halliday.
        </p>
      </header>

      {!apiKey && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardTitle>⚙️ Configure sua chave (grátis)</CardTitle>
          <CardSubtitle>
            Pegue em{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 underline">
              aistudio.google.com/apikey
            </a>{" "}
            (Google login, sem cartão). Depois cole em <Link href="/configuracoes" className="font-semibold underline">Configurações → Tutor IA</Link>. A chave fica só no seu navegador.
          </CardSubtitle>
        </Card>
      )}

      {history.length === 0 && (
        <Card>
          <CardTitle>Exemplos do que você pode perguntar</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
            <li>&quot;Um carro de 1200 kg freia de 72 km/h para 0 em 40 m. Qual a força de frenagem?&quot;</li>
            <li>Tira foto da questão 5 da lista de atrito.</li>
            <li>&quot;Não entendi por que a aceleração num movimento circular uniforme não é zero.&quot;</li>
            <li>&quot;Quando usar conservação de energia e quando usar cinemática?&quot;</li>
          </ul>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {history.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] rounded-2xl p-3 text-sm shadow-sm md:max-w-[80%] ${
                m.role === "user"
                  ? "rounded-tr-sm bg-indigo-600 text-white"
                  : "rounded-tl-sm border border-[var(--border)] bg-[var(--bg-elev)]"
              }`}
            >
              {m.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.imageUrl} alt="foto do exercício" className="mb-2 max-h-72 rounded-lg" />
              )}
              <div className={m.role === "user" ? "" : "prose-sm"}>
                <RichText>{m.text}</RichText>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg-elev)] p-3 text-sm text-[var(--muted)]">
              <Loader2 size={14} className="animate-spin" /> Pensando no seu exercício…
            </div>
          </div>
        )}
      </div>

      {error && error !== "NO_KEY" && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">{error}</div>
      )}

      <Card className="sticky bottom-4 z-20 !p-3">
        {imagePreview && (
          <div className="mb-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="preview" className="h-16 rounded border border-[var(--border)]" />
            <button onClick={() => handleFile(null)} className="text-xs text-[var(--muted)] hover:text-rose-500">
              <Trash2 size={14} /> remover
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] transition hover:bg-indigo-500/10 hover:text-indigo-500">
            <ImageIcon size={18} />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && (input.trim() || image)) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Digite sua dúvida ou cole o enunciado… (Shift+Enter = nova linha)"
            className="min-h-10 flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <Button
            onClick={send}
            disabled={loading || (!input.trim() && !image) || !apiKey}
            size="md"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
        {history.length > 0 && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => setHistory([])}
              className="text-xs text-[var(--muted)] hover:text-rose-500"
            >
              Nova conversa
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
