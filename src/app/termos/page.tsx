import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do FisiFun, app de estudos gamificado.",
  alternates: { canonical: "/termos" },
  robots: { index: true, follow: true },
};

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Termos de Uso</h1>
      <p className="mt-2 text-xs text-[var(--muted)]">Última atualização: 04/05/2026</p>

      <section className="mt-6 space-y-4 text-sm md:text-base">
        <h2 className="text-xl font-bold">1. Aceitação</h2>
        <p>
          Ao criar uma conta no FisiFun, você concorda com estes Termos de Uso e com nossa{" "}
          <Link href="/privacidade" className="text-indigo-500 hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>

        <h2 className="text-xl font-bold">2. Descrição do serviço</h2>
        <p>
          O FisiFun é uma plataforma online de estudos gamificada pra Física, Química, Cálculo 1 e Geometria
          Analítica, com trilhas, exercícios, vídeos, IA tutora e gamificação. O acesso é via assinatura mensal,
          anual ou plano Família, conforme planos disponíveis em <Link href="/precos" className="text-indigo-500 hover:underline">/precos</Link>.
        </p>

        <h2 className="text-xl font-bold">3. Cadastro e conta</h2>
        <p>
          Você precisa fornecer e-mail válido. Você é responsável por manter a confidencialidade da sua conta
          e por todas as atividades realizadas nela. É proibido compartilhar conta entre múltiplos usuários
          (exceto no plano Família, dentro do limite contratado).
        </p>

        <h2 className="text-xl font-bold">4. Pagamentos</h2>
        <p>
          Pagamentos são processados pela <strong>Kiwify</strong> (intermediadora autorizada). Aceitamos cartão,
          Pix e boleto. Assinaturas mensais são cobradas automaticamente até cancelamento. O cancelamento pode
          ser solicitado a qualquer momento via Kiwify ou pelo nosso suporte.
        </p>

        <h2 className="text-xl font-bold">5. Reembolso</h2>
        <p>
          Conforme Código de Defesa do Consumidor (CDC, art. 49), você tem direito a reembolso integral em até
          7 dias após a compra, sem necessidade de justificativa. Após 7 dias, reembolso ficará a critério da
          análise caso a caso.
        </p>

        <h2 className="text-xl font-bold">6. Conduta do usuário</h2>
        <p>
          É proibido: compartilhar credenciais, fazer scraping ou automação de exercícios, usar a IA para outros
          fins que não estudo, copiar conteúdo e republicar em outros sites/redes. Violações resultam em suspensão
          ou cancelamento sem reembolso.
        </p>

        <h2 className="text-xl font-bold">7. Conteúdo de terceiros</h2>
        <p>
          O conteúdo (exercícios, fórmulas) é baseado em livros consagrados (Halliday, Brown, Stewart, Winterle)
          usados como referência educacional, com adaptações próprias. Vídeos podem ser hospedados no YouTube ou
          em CDN própria. Direitos autorais dos livros pertencem aos respectivos autores e editoras.
        </p>

        <h2 className="text-xl font-bold">8. Limitação de responsabilidade</h2>
        <p>
          O FisiFun é uma ferramenta complementar de estudos. Não garantimos aprovação em vestibulares ou provas.
          Não somos responsáveis por interrupções de serviço causadas por terceiros (provedor de hospedagem,
          internet do usuário, etc).
        </p>

        <h2 className="text-xl font-bold">9. Modificações</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento. Mudanças significativas serão comunicadas por
          e-mail. O uso continuado após mudanças implica aceitação.
        </p>

        <h2 className="text-xl font-bold">10. Contato</h2>
        <p>
          Dúvidas? Fale com a gente: <a href="mailto:contato@corebytecnologia.com" className="text-indigo-500 hover:underline">contato@corebytecnologia.com</a>{" "}
          ou WhatsApp <a href="https://wa.me/5561991770953" className="text-indigo-500 hover:underline">(61) 99177-0953</a>.
        </p>
      </section>
    </main>
  );
}
