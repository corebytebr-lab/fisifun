import { prisma } from "@/lib/db";
import type { Plan } from "@prisma/client";
import { PLANS, SUBJECT_IDS } from "@/lib/plans";

export interface KiwifyConfig {
  /** HMAC secret used by Kiwify to sign webhooks (Settings → Integrations → Webhook). */
  webhookSecret: string;
  /** Map of Kiwify product_id (or product_name lowercased) → our internal Plan. */
  productMap: Record<string, Plan>;
  /** Default URLs for /login plan picker. Empty until user creates them. */
  links: {
    aluno?: string;
    total?: string;
    premium?: string;
    anual?: string;
    trienal?: string;
    familia?: string;
    escola?: string;
  };
}

const DEFAULT: KiwifyConfig = {
  webhookSecret: "",
  productMap: {},
  links: {},
};

const KEY = "kiwify-config";

export async function getKiwifyConfig(): Promise<KiwifyConfig> {
  const row = await prisma.appSetting.findUnique({ where: { key: KEY } });
  if (!row) return { ...DEFAULT };
  const v = row.value as Partial<KiwifyConfig>;
  return {
    webhookSecret: v.webhookSecret ?? "",
    productMap: v.productMap ?? {},
    links: v.links ?? {},
  };
}

export async function setKiwifyConfig(patch: Partial<KiwifyConfig>): Promise<KiwifyConfig> {
  const cur = await getKiwifyConfig();
  const next: KiwifyConfig = {
    webhookSecret: patch.webhookSecret ?? cur.webhookSecret,
    productMap: patch.productMap ?? cur.productMap,
    links: { ...cur.links, ...(patch.links ?? {}) },
  };
  await prisma.appSetting.upsert({
    where: { key: KEY },
    update: { value: next as unknown as object },
    create: { key: KEY, value: next as unknown as object },
  });
  return next;
}

/** Heuristic: try to detect a Plan from a Kiwify product name when no explicit map exists. */
export function planFromProductName(name: string): Plan | null {
  const n = (name || "").toLowerCase();
  if (n.includes("3 anos") || n.includes("trienal") || n.includes("3-anos")) return "TRIENAL";
  if (n.includes("anual")) return "ANUAL";
  if (n.includes("família") || n.includes("familia")) return "FAMILIA";
  if (n.includes("escola")) return "ESCOLA";
  if (n.includes("premium")) return "PREMIUM";
  if (n.includes("total")) return "TOTAL";
  if (n.includes("aluno")) return "ALUNO";
  return null;
}

/** Apply a paid order to a user (find by email, set plan + extend planUntil). */
export async function applyPaidOrder(args: {
  email: string;
  plan: Plan;
  /** Kiwify subscription id (when recurring). */
  subscriptionId?: string;
  /** Kiwify order id. */
  orderId: string;
  source: "kiwify";
  rawEvent?: unknown;
}): Promise<{ ok: boolean; userId?: string; created?: boolean; reason?: string }> {
  const email = args.email.trim().toLowerCase();
  if (!email) return { ok: false, reason: "missing-email" };
  const info = PLANS[args.plan];
  const days = info.defaultDurationDays ?? 30;

  let user = await prisma.user.findUnique({ where: { email } });
  let created = false;

  if (!user) {
    // Auto-provision a STUDENT account with a temporary password — the buyer
    // can request reset via /admin or via the /login form (we'll add that next).
    // For now, generate a random password and let admin reset via panel.
    const tmp = Math.random().toString(36).slice(2, 12) + "A1!";
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(tmp, 10);
    user = await prisma.user.create({
      data: {
        email,
        name: email.split("@")[0],
        passwordHash,
        role: "STUDENT",
        plan: args.plan,
        planUntil: new Date(Date.now() + days * 86400000),
        subjectsAllowed: info.subjectAccess === "all" ? [...SUBJECT_IDS] : ["fisica"],
        state: { create: { data: {} } },
      },
    });
    created = true;
  } else {
    // Extend or set: if already had time remaining, extend on top of it.
    const baseTime =
      user.planUntil && user.planUntil.getTime() > Date.now()
        ? user.planUntil.getTime()
        : Date.now();
    const planUntil = new Date(baseTime + days * 86400000);
    const subjectsAllowed: string[] =
      info.subjectAccess === "all" ? [...SUBJECT_IDS] : user.subjectsAllowed.length > 0 ? user.subjectsAllowed : ["fisica"];
    user = await prisma.user.update({
      where: { id: user.id },
      data: { plan: args.plan, planUntil, subjectsAllowed, active: true },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: "system",
      action: "payment.applied",
      target: user.id,
      meta: {
        source: args.source,
        plan: args.plan,
        orderId: args.orderId,
        subscriptionId: args.subscriptionId ?? null,
        created,
      } as object,
    },
  });

  return { ok: true, userId: user.id, created };
}
