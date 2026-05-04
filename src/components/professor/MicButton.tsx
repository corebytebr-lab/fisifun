"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

// Minimal types for Web Speech API (not in lib.dom by default)
interface SpeechRecognitionResult {
  [index: number]: { transcript: string; confidence: number };
  length: number;
  isFinal: boolean;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: { [index: number]: SpeechRecognitionResult; length: number };
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isSpeechRecognitionAvailable(): boolean {
  return !!getRecognitionCtor();
}

export interface MicButtonProps {
  /** Called whenever a chunk of finalized transcript is produced. Append it. */
  onTranscript: (text: string) => void;
  /** Optional callback while interim text changes (live preview). */
  onInterim?: (text: string) => void;
  className?: string;
}

/**
 * A floating mic button that streams Brazilian Portuguese speech into onTranscript.
 * Uses Web Speech API (Chrome/Edge/Android Chrome). Falls back to disabled if missing.
 */
export function MicButton({ onTranscript, onInterim, className }: MicButtonProps) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const supported = isSpeechRecognitionAvailable();

  useEffect(() => {
    return () => {
      try {
        recRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  function start() {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("Reconhecimento de voz não suportado nesse navegador. Use Chrome/Edge.");
      return;
    }
    setError(null);
    try {
      const r = new Ctor();
      r.lang = "pt-BR";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (e: SpeechRecognitionEvent) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            onTranscript(text);
          } else {
            interim += text;
          }
        }
        if (interim) onInterim?.(interim);
      };
      r.onerror = (ev: SpeechRecognitionErrorEvent) => {
        if (ev.error === "no-speech" || ev.error === "aborted") {
          // benign
          return;
        }
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
          setError("Permissão de microfone negada. Libere nas configurações do navegador.");
        } else {
          setError(`Erro no microfone: ${ev.error}`);
        }
      };
      r.onend = () => {
        setRecording(false);
      };
      recRef.current = r;
      r.start();
      setRecording(true);
    } catch (e) {
      setError(`Falha ao iniciar microfone: ${(e as Error).message}`);
    }
  }

  function stop() {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    setRecording(false);
  }

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Reconhecimento de voz indisponível neste navegador"
        className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/40 ${className ?? ""}`}
      >
        <MicOff size={14} /> Voz indisponível
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={recording ? stop : start}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
          recording
            ? "bg-rose-500 text-white shadow-[0_0_0_4px_rgba(244,63,94,0.25)] animate-pulse"
            : "bg-white/10 text-white hover:bg-white/20"
        } ${className ?? ""}`}
      >
        {recording ? <MicOff size={16} /> : <Mic size={16} />}
        {recording ? "Gravando… (clique pra parar)" : "Falar"}
      </button>
      {error && <div className="text-xs text-rose-300">{error}</div>}
    </div>
  );
}
