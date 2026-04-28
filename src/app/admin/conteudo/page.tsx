export default function ConteudoAdmin() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold">📚 Conteúdo</h1>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 text-sm">
        <p className="mb-2">Aqui você poderá editar capítulos, lições, exercícios, fórmulas e flashcards diretamente pelo painel.</p>
        <p className="mb-2 text-[var(--muted)]">Status atual: o conteúdo (Halliday, Brown, Winterle, Stewart) ainda vive em arquivos no código (~60 capítulos, ~1500 exercícios). Para editar, abra o repositório.</p>
        <p className="text-[var(--muted)]">
          <strong>Próximo passo</strong>: migrar os capítulos para o banco e construir o editor visual aqui (em desenvolvimento).
        </p>
      </div>
    </div>
  );
}
