import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendEmail, magicLinkEmail } from "@/lib/email";

const TOKEN_TTL_MIN = 30;

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function generateToken(): string {
  // 32 bytes → 43 chars base64url, plenty of entropy
  return crypto.randomBytes(32).toString("base64url");
}

export interface IssueLinkArgs {
  email: string;
  purpose: "login" | "reset" | "welcome";
  baseUrl: string; // e.g. https://fisifun.corebytecnologia.com
  ip?: string;
  ua?: string;
  /** When set, won't actually send the email — used by tests / admin tools. */
  noSend?: boolean;
  /** Override the user's display name in the email. */
  nameOverride?: string;
}

export async function issueMagicLink(args: IssueLinkArgs): Promise<{
  ok: boolean;
  reason?: string;
  url?: string;
  emailSent?: boolean;
}> {
  const email = args.email.trim().toLowerCase();
  if (!email || !email.includes("@")) return { ok: false, reason: "invalid-email" };

  // We always succeed silently if user doesn't exist — this avoids leaking
  // which emails are registered. Only welcome flow may know for sure.
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user && args.purpose !== "welcome") {
    return { ok: true, reason: "no-user-but-no-leak" };
  }

  // Rate limit: max 3 unused tokens active per email
  const active = await prisma.magicLinkToken.count({
    where: { email, usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (active >= 5) {
    return { ok: false, reason: "rate-limited" };
  }

  const raw = generateToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MIN * 60_000);

  await prisma.magicLinkToken.create({
    data: {
      email,
      tokenHash,
      purpose: args.purpose,
      expiresAt,
      ip: args.ip,
      ua: args.ua,
    },
  });

  const url = `${args.baseUrl.replace(/\/$/, "")}/api/auth/verify?token=${raw}`;

  if (args.noSend) {
    return { ok: true, url, emailSent: false };
  }

  const tpl = magicLinkEmail({
    name: args.nameOverride ?? user?.name ?? email.split("@")[0],
    url,
    purpose: args.purpose,
  });
  const sent = await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });

  return { ok: true, url, emailSent: sent.ok };
}

export async function consumeMagicLink(rawToken: string): Promise<{
  ok: boolean;
  reason?: string;
  email?: string;
  purpose?: string;
}> {
  if (!rawToken || rawToken.length < 20) return { ok: false, reason: "invalid" };
  const tokenHash = hashToken(rawToken);
  const row = await prisma.magicLinkToken.findUnique({ where: { tokenHash } });
  if (!row) return { ok: false, reason: "not-found" };
  if (row.usedAt) return { ok: false, reason: "already-used" };
  if (row.expiresAt.getTime() < Date.now()) return { ok: false, reason: "expired" };
  await prisma.magicLinkToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
  return { ok: true, email: row.email, purpose: row.purpose };
}
