/**
 * Lightweight Resend client. We don't pull the npm package — single REST call.
 * Configure RESEND_API_KEY + EMAIL_FROM in env (or fall back to defaults).
 */

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — printing instead of sending");
    console.warn("[email] To:", input.to, "Subject:", input.subject);
    console.warn("[email] HTML:", input.html);
    return { ok: false, error: "no-api-key-configured" };
  }
  const from = process.env.EMAIL_FROM ?? "FisiFun <noreply@corebytecnologia.com>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    return { ok: false, error: `resend-${res.status}:${errBody.slice(0, 200)}` };
  }
  const data = (await res.json()) as { id?: string };
  return { ok: true, id: data.id };
}

export function magicLinkEmail(args: { name: string; url: string; purpose: "login" | "reset" | "welcome" }) {
  const title =
    args.purpose === "welcome"
      ? "Bem-vindo(a) ao FisiFun! 🚀"
      : args.purpose === "reset"
        ? "Redefinir sua senha do FisiFun"
        : "Seu link de acesso ao FisiFun";
  const intro =
    args.purpose === "welcome"
      ? "Sua conta foi criada com sucesso. Clique no botão abaixo pra entrar e estudar:"
      : args.purpose === "reset"
        ? "Recebemos um pedido pra redefinir sua senha. Clique no botão abaixo:"
        : "Você pediu pra entrar sem digitar senha. Clique no botão abaixo:";
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,0.08);overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#6366f1 0%,#a855f7 100%);padding:28px 24px;text-align:center;">
        <div style="font-size:48px;line-height:1;">⚛️</div>
        <h1 style="color:#ffffff;font-size:22px;margin:8px 0 0 0;font-weight:800;">FisiFun</h1>
      </td></tr>
      <tr><td style="padding:28px 24px;color:#1f2937;">
        <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;">${title}</h2>
        <p style="margin:0 0 8px 0;font-size:15px;color:#374151;">Olá, ${escapeHtml(args.name || "estudante")}!</p>
        <p style="margin:0 0 18px 0;font-size:15px;color:#374151;">${intro}</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${args.url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:14px;font-weight:700;font-size:16px;">
            ${args.purpose === "reset" ? "Redefinir senha" : "Entrar no FisiFun"}
          </a>
        </p>
        <p style="font-size:12px;color:#6b7280;line-height:1.5;margin:14px 0 0 0;">
          Esse link vale por <strong>30 minutos</strong> e só funciona uma vez.<br>
          Se você não pediu, pode ignorar — ninguém entra na sua conta sem clicar aqui.
        </p>
        <p style="font-size:11px;color:#9ca3af;margin:14px 0 0 0;word-break:break-all;">
          Caso o botão não funcione, cole esta URL no navegador:<br>
          <span style="color:#4b5563;">${args.url}</span>
        </p>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:16px 24px;text-align:center;color:#9ca3af;font-size:11px;">
        © FisiFun · CoreByte · Suporte: <a href="https://wa.me/5561991770953" style="color:#6366f1;text-decoration:none;">WhatsApp</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
  const text = `${title}\n\n${intro}\n\nLink: ${args.url}\n\nO link vale por 30 minutos e só funciona uma vez. Se você não pediu, ignore.`;
  return { html, text, subject: title };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}
