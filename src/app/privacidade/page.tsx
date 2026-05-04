import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — FisiFun",
  description: "Política de privacidade do FisiFun. Quais dados coletamos e como usamos.",
  alternates: { canonical: "/privacidade" },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Política de Privacidade</h1>
      <p className="mt-2 text-xs text-[var(--muted)]">Última atualização: 04/05/2026</p>

      <section className="mt-6 space-y-4 text-sm md:text-base">
        <h2 className="text-xl font-bold">1. Quem somos</h2>
        <p>
          O FisiFun é operado pela <strong>CoreByte Tecnologia</strong>, responsável pelo tratamento dos dados
          conforme a LGPD (Lei 13.709/2018).
        </p>

        <h2 className="text-xl font-bold">2. Quais dados coletamos</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Cadastro:</strong> nome, e-mail, plano contratado.
          </li>
          <li>
            <strong>Estudo:</strong> capítulos acessados, exercícios respondidos, tempo no app, XP, conquistas.
          </li>
          <li>
            <strong>Pagamento:</strong> processado pela Kiwify; nós recebemos apenas confirmação (sem dados de
            cartão/conta).
          </li>
          <li>
            <strong>Técnicos:</strong> IP, navegador, sistema operacional, logs de acesso.
          </li>
        </ul>

        <h2 className="text-xl font-bold">3. Pra que usamos</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Disponibilizar o serviço (login, progresso, IA, vídeos).</li>
          <li>Personalizar trilhas de estudo (revisão espaçada, plano de estudos).</li>
          <li>Comunicação por e-mail (magic link, notificações de plano, suporte).</li>
          <li>Análise interna de uso pra melhorar o produto (anônima e agregada).</li>
          <li>Cumprir obrigações legais.</li>
        </ul>

        <h2 className="text-xl font-bold">4. Com quem compartilhamos</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Kiwify:</strong> processamento de pagamento.
          </li>
          <li>
            <strong>Resend:</strong> envio de e-mails transacionais.
          </li>
          <li>
            <strong>Google (Gemini):</strong> processamento de perguntas pra IA tutora (não armazena conteúdo
            pessoalmente identificável).
          </li>
          <li>
            <strong>YouTube:</strong> hospedagem de vídeos das aulas (modo &quot;não-listado&quot;).
          </li>
          <li>Não vendemos seus dados a terceiros.</li>
        </ul>

        <h2 className="text-xl font-bold">5. Cookies</h2>
        <p>
          Usamos cookies essenciais (sessão de login) e analytics anônimos. Você pode bloquear cookies no
          navegador, mas a experiência pode ser prejudicada (login não funciona sem cookie de sessão).
        </p>

        <h2 className="text-xl font-bold">6. Seus direitos (LGPD)</h2>
        <p>Você pode, a qualquer momento, solicitar:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Confirmação se tratamos seus dados</li>
          <li>Acesso aos dados</li>
          <li>Correção de dados incorretos</li>
          <li>Anonimização ou eliminação de dados desnecessários</li>
          <li>Portabilidade dos dados pra outro fornecedor</li>
          <li>Revogação de consentimento</li>
        </ul>
        <p>
          Pra exercer esses direitos, envie e-mail pra{" "}
          <a href="mailto:contato@corebytecnologia.com" className="text-indigo-500 hover:underline">
            contato@corebytecnologia.com
          </a>
          . Respondemos em até 15 dias.
        </p>

        <h2 className="text-xl font-bold">7. Segurança</h2>
        <p>
          Senhas armazenadas com hash bcrypt. Dados em trânsito via HTTPS. Banco de dados PostgreSQL com acesso
          restrito. Logs de auditoria pra ações administrativas.
        </p>

        <h2 className="text-xl font-bold">8. Retenção</h2>
        <p>
          Dados são mantidos enquanto a conta estiver ativa. Após cancelamento, mantemos os dados por até 5 anos
          pra fins fiscais e de prestação de contas, conforme legislação brasileira.
        </p>

        <h2 className="text-xl font-bold">9. Crianças</h2>
        <p>
          O serviço é destinado a maiores de 13 anos. Para crianças até 17 anos, é necessário consentimento dos
          responsáveis. Não coletamos dados conscientemente de menores de 13.
        </p>

        <h2 className="text-xl font-bold">10. Contato</h2>
        <p>
          Encarregado de Proteção de Dados (DPO):{" "}
          <a href="mailto:contato@corebytecnologia.com" className="text-indigo-500 hover:underline">
            contato@corebytecnologia.com
          </a>
          .
        </p>

        <p className="mt-6">
          <Link href="/termos" className="text-indigo-500 hover:underline">
            Veja também: Termos de Uso
          </Link>
        </p>
      </section>
    </main>
  );
}
