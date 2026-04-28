"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Whiteboard } from "@/components/professor/Whiteboard";

export default function QuadroPage() {
  const [text, setText] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:underline">
          <ChevronLeft size={14} /> Voltar
        </Link>
        <div className="text-sm font-bold">📝 Quadro Branco</div>
        <button
          type="button"
          onClick={() => setText("")}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs"
        >
          Limpar texto
        </button>
      </div>

      <div className="flex-1 p-3">
        <div className="h-[calc(100vh-100px)]">
          <Whiteboard text={text} onTextChange={setText} />
        </div>
      </div>

      <div className="px-3 pb-3 text-center text-[10px] text-[var(--muted)]">
        Use durante uma prova/exercício. Texto e desenho ficam só nessa sessão.
      </div>
    </div>
  );
}
