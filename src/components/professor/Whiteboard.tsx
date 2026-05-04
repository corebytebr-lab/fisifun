"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Pencil, Trash2, Type } from "lucide-react";

export interface WhiteboardProps {
  /** Optional text content (kept in parent state). */
  text: string;
  onTextChange: (t: string) => void;
  /** Snapshot description of drawing for the IA context. */
  onDrawingChange?: (hasDrawing: boolean) => void;
}

/**
 * "Quadro" — a chalkboard-styled whiteboard with two layers:
 *  - Text area for typing equations / bullets (sent to IA)
 *  - Free-draw canvas for sketches (used as visual aid; presence flag sent to IA)
 *
 * Design: keep it lightweight; the canvas is rendered above the text area
 * as a transparent overlay you can toggle. The text is always visible.
 */
export function Whiteboard({ text, onTextChange, onDrawingChange }: WhiteboardProps) {
  const [tool, setTool] = useState<"text" | "draw" | "erase">("text");
  const [color, setColor] = useState<string>("#fefae0");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const drawing = useRef<boolean>(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasDrawing, setHasDrawing] = useState<boolean>(false);

  // Resize canvas to wrapper using devicePixelRatio
  useEffect(() => {
    const c = canvasRef.current;
    const w = wrapperRef.current;
    if (!c || !w) return;
    const ro = new ResizeObserver(() => {
      const rect = w.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.floor(rect.width * dpr);
      c.height = Math.floor(rect.height * dpr);
      c.style.width = `${rect.width}px`;
      c.style.height = `${rect.height}px`;
      const ctx = c.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    ro.observe(w);
    return () => ro.disconnect();
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "text") return;
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || tool === "text") return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx || !last.current) return;
    const cur = pos(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (tool === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 16;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
    }
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.stroke();
    last.current = cur;
    if (!hasDrawing) {
      setHasDrawing(true);
      onDrawingChange?.(true);
    }
  }

  function pointerUp() {
    drawing.current = false;
    last.current = null;
  }

  function clearAll() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
    setHasDrawing(false);
    onDrawingChange?.(false);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#102140] p-2">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          📝 Quadro (opcional)
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <ToolBtn active={tool === "text"} onClick={() => setTool("text")} icon={<Type size={14} />} label="Texto" />
          <ToolBtn active={tool === "draw"} onClick={() => setTool("draw")} icon={<Pencil size={14} />} label="Caneta" />
          <ToolBtn active={tool === "erase"} onClick={() => setTool("erase")} icon={<Eraser size={14} />} label="Borracha" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-7 w-9 cursor-pointer rounded border border-white/10 bg-transparent"
            title="Cor"
            aria-label="Cor"
          />
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/15"
            title="Limpar"
          >
            <Trash2 size={12} /> Limpar
          </button>
        </div>
      </div>
      <div
        ref={wrapperRef}
        className="relative h-44 w-full overflow-hidden rounded-lg"
        style={{ background: "#0d1c39", backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "100% 28px" }}
      >
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Digite fórmulas, bullets, etapas… Ex: v = v0 + a·t,  a = 2 m/s², t = 3s →  v = ?"
          readOnly={tool !== "text"}
          className={`absolute inset-0 z-10 h-full w-full resize-none bg-transparent p-3 font-mono text-sm leading-7 text-amber-100 outline-none placeholder:text-white/30 ${
            tool === "text" ? "" : "pointer-events-none"
          }`}
          style={{ caretColor: "#fcd34d" }}
        />
        <canvas
          ref={canvasRef}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerLeave={pointerUp}
          className={`absolute inset-0 z-20 h-full w-full ${
            tool === "text" ? "pointer-events-none" : "cursor-crosshair"
          }`}
        />
      </div>
      <div className="mt-1 text-[10px] text-white/40">
        O conteúdo do quadro é enviado pro Gemini junto com a fala/escrita.
      </div>
    </div>
  );
}

function ToolBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        active ? "bg-indigo-500 text-white" : "bg-white/5 text-white/70 hover:bg-white/15"
      }`}
    >
      {icon} {label}
    </button>
  );
}
