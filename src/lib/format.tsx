// Lightweight text formatter for lesson concept bodies.
// Supports:
//   **bold**
//   *italic*
//   `inline code`
//   $inline math$ (KaTeX)
//   $$block math$$ (KaTeX)
//   blank lines split paragraphs
//   - bullet lists (line starts with "- ")
// This keeps us free of heavy markdown deps.

import React from "react";
import katex from "katex";

function renderInline(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split by math $...$ first so math contents aren't mangled.
  const parts = line.split(/(\$[^$]+\$)/g);
  parts.forEach((part, i) => {
    if (/^\$[^$]+\$$/.test(part)) {
      const tex = part.slice(1, -1);
      const html = katex.renderToString(tex, { throwOnError: false });
      nodes.push(
        <span
          key={`${keyPrefix}-m-${i}`}
          className="katex-wrap"
          dangerouslySetInnerHTML={{ __html: html }}
        />,
      );
      return;
    }
    // Apply bold/italic/code replacements.
    const boldSplit = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    boldSplit.forEach((seg, j) => {
      if (/^\*\*[^*]+\*\*$/.test(seg)) {
        nodes.push(
          <strong key={`${keyPrefix}-b-${i}-${j}`}>{seg.slice(2, -2)}</strong>,
        );
      } else if (/^\*[^*]+\*$/.test(seg)) {
        nodes.push(
          <em key={`${keyPrefix}-i-${i}-${j}`}>{seg.slice(1, -1)}</em>,
        );
      } else if (/^`[^`]+`$/.test(seg)) {
        nodes.push(
          <code
            key={`${keyPrefix}-c-${i}-${j}`}
            className="rounded bg-slate-200 px-1 py-0.5 text-[0.9em] dark:bg-slate-700"
          >
            {seg.slice(1, -1)}
          </code>,
        );
      } else if (seg) {
        nodes.push(<React.Fragment key={`${keyPrefix}-t-${i}-${j}`}>{seg}</React.Fragment>);
      }
    });
  });
  return nodes;
}

export function RichText({ children }: { children: string }) {
  const text = children;
  // Extract block math first
  const blocks = text.split(/(\$\$[\s\S]+?\$\$)/g);
  const elements: React.ReactNode[] = [];
  blocks.forEach((block, idx) => {
    if (/^\$\$[\s\S]+\$\$$/.test(block)) {
      const tex = block.slice(2, -2);
      const html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
      elements.push(
        <div
          key={`b-${idx}`}
          className="my-4 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />,
      );
      return;
    }
    // Split by blank lines -> paragraphs/lists
    const paragraphs = block.split(/\n\s*\n/);
    paragraphs.forEach((para, pIdx) => {
      const lines = para.split(/\n/).filter((l) => l.length > 0);
      if (lines.length === 0) return;
      const isList = lines.every((l) => l.trimStart().startsWith("- "));
      if (isList) {
        elements.push(
          <ul
            key={`p-${idx}-${pIdx}`}
            className="my-2 list-disc space-y-1 pl-5"
          >
            {lines.map((l, li) => (
              <li key={li}>{renderInline(l.trimStart().slice(2), `${idx}-${pIdx}-${li}`)}</li>
            ))}
          </ul>,
        );
      } else {
        elements.push(
          <p key={`p-${idx}-${pIdx}`} className="my-2 leading-relaxed">
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l, `${idx}-${pIdx}-${li}`)}
              </React.Fragment>
            ))}
          </p>,
        );
      }
    });
  });
  return <>{elements}</>;
}

export function InlineMath({ expr }: { expr: string }) {
  const html = katex.renderToString(expr, { throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlockMath({ expr }: { expr: string }) {
  const html = katex.renderToString(expr, { displayMode: true, throwOnError: false });
  return (
    <div
      className="my-2 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function normalizeText(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
