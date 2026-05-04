// Server component — emite <script type="application/ld+json"> com schema.org
// pra Google entender que somos um SaaS educacional, não confundir com "Fisiofun".

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // O JSON.stringify já escapa aspas; usamos dangerouslySetInnerHTML porque
      // <script> não pode receber children string em Server Components.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
