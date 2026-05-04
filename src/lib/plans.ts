import type { Plan } from "@prisma/client";

export const SUBJECT_IDS = ["fisica", "quimica", "ga", "calculo"] as const;
export type SubjectId = (typeof SUBJECT_IDS)[number];

export interface PlanInfo {
  id: Plan;
  label: string;
  price: string; // human readable
  desc: string;
  /** -1 = unlimited; 0 = bloqueado */
  aiQuota: number;
  /** "all" libera 4 matérias; "single" só a `subjectsAllowed[0]` */
  subjectAccess: "all" | "single" | "none";
  /** dias até expirar (UI sugere); null = sem expiração padrão */
  defaultDurationDays: number | null;
  badgeColor: string;
}

export const PLANS: Record<Plan, PlanInfo> = {
  TRIAL: {
    id: "TRIAL",
    label: "Trial 3 dias",
    price: "Grátis",
    desc: "3 dias grátis com tudo do plano Total liberado",
    aiQuota: 30,
    subjectAccess: "all",
    defaultDurationDays: 3,
    badgeColor: "bg-amber-500/20 text-amber-700",
  },
  ALUNO: {
    id: "ALUNO",
    label: "Aluno",
    price: "R$59,90/mês",
    desc: "1 matéria · 30 perguntas IA/mês",
    aiQuota: 30,
    subjectAccess: "single",
    defaultDurationDays: 30,
    badgeColor: "bg-sky-500/20 text-sky-700",
  },
  TOTAL: {
    id: "TOTAL",
    label: "Aluno Total",
    price: "R$99,90/mês",
    desc: "4 matérias · 100 perguntas IA/mês",
    aiQuota: 100,
    subjectAccess: "all",
    defaultDurationDays: 30,
    badgeColor: "bg-indigo-500/20 text-indigo-700",
  },
  PREMIUM: {
    id: "PREMIUM",
    label: "Premium",
    price: "R$149,90/mês",
    desc: "4 matérias · IA ilimitada · prioridade",
    aiQuota: -1,
    subjectAccess: "all",
    defaultDurationDays: 30,
    badgeColor: "bg-violet-500/20 text-violet-700",
  },
  ANUAL: {
    id: "ANUAL",
    label: "Anual",
    price: "R$799/ano",
    desc: "12 meses do Total (~33% off)",
    aiQuota: 100,
    subjectAccess: "all",
    defaultDurationDays: 365,
    badgeColor: "bg-emerald-500/20 text-emerald-700",
  },
  TRIENAL: {
    id: "TRIENAL",
    label: "3 Anos",
    price: "R$1.997 (uma vez)",
    desc: "Total por 36 meses (pagamento único)",
    aiQuota: 100,
    subjectAccess: "all",
    defaultDurationDays: 365 * 3,
    badgeColor: "bg-fuchsia-500/20 text-fuchsia-700",
  },
  FAMILIA: {
    id: "FAMILIA",
    label: "Família",
    price: "R$199/mês",
    desc: "Até 4 contas · todas com Total",
    aiQuota: 100,
    subjectAccess: "all",
    defaultDurationDays: 30,
    badgeColor: "bg-rose-500/20 text-rose-700",
  },
  ESCOLA: {
    id: "ESCOLA",
    label: "Escola",
    price: "R$25/aluno/mês",
    desc: "B2B · turma · relatórios pra coordenação",
    aiQuota: 100,
    subjectAccess: "all",
    defaultDurationDays: 30,
    badgeColor: "bg-teal-500/20 text-teal-700",
  },
  BLOCKED: {
    id: "BLOCKED",
    label: "Bloqueado",
    price: "—",
    desc: "Conta bloqueada pelo admin",
    aiQuota: 0,
    subjectAccess: "none",
    defaultDurationDays: null,
    badgeColor: "bg-zinc-500/20 text-zinc-600",
  },
};

export interface PlanRuntime {
  plan: Plan;
  expired: boolean;
  effectivePlan: Plan; // se expirou e tinha algum pago, vira TRIAL? Ou BLOCKED. Aqui: BLOCKED.
  subjectsAllowed: SubjectId[];
  aiQuota: number;
}

/** Resolve o plano efetivo + matérias permitidas dado um user.
 * - Se planUntil < now ⇒ vira BLOCKED até admin atualizar.
 * - ADMIN sempre tem acesso total (override).
 */
export function resolvePlan(args: {
  plan: Plan;
  planUntil: Date | string | null;
  subjectsAllowed: string[];
  role: "ADMIN" | "TEACHER" | "STUDENT" | "SCHOOL_MANAGER";
}): PlanRuntime {
  if (args.role === "ADMIN" || args.role === "TEACHER") {
    return {
      plan: "PREMIUM",
      expired: false,
      effectivePlan: "PREMIUM",
      subjectsAllowed: [...SUBJECT_IDS],
      aiQuota: -1,
    };
  }
  const now = Date.now();
  const until = args.planUntil ? new Date(args.planUntil).getTime() : null;
  const expired = until !== null && until < now;
  const effective: Plan = expired ? "BLOCKED" : args.plan;
  const info = PLANS[effective];
  let allowed: SubjectId[] = [];
  if (info.subjectAccess === "all") allowed = [...SUBJECT_IDS];
  else if (info.subjectAccess === "single") {
    allowed = (args.subjectsAllowed as SubjectId[]).filter((s) =>
      (SUBJECT_IDS as readonly string[]).includes(s)
    );
    if (allowed.length === 0) allowed = ["fisica"]; // fallback default
  }
  return {
    plan: args.plan,
    expired,
    effectivePlan: effective,
    subjectsAllowed: allowed,
    aiQuota: info.aiQuota,
  };
}

export function isSubjectAllowed(rt: PlanRuntime, subject: string): boolean {
  return (rt.subjectsAllowed as string[]).includes(subject);
}
