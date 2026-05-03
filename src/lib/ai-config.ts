import { prisma } from "@/lib/db";
import type { AIProvider } from "@/lib/ai-providers";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string | null;
  monthlyQuota: number;
}

const KEY = "ai-config";
const DEFAULT: AIConfig = {
  provider: "deepseek",
  apiKey: "",
  model: "deepseek-chat",
  monthlyQuota: 50,
};

export async function getAIConfig(): Promise<AIConfig> {
  const row = await prisma.appSetting.findUnique({ where: { key: KEY } });
  if (!row) return DEFAULT;
  const v = row.value as Partial<AIConfig> | null;
  return { ...DEFAULT, ...(v ?? {}) };
}

export async function setAIConfig(cfg: Partial<AIConfig>): Promise<AIConfig> {
  const current = await getAIConfig();
  const next: AIConfig = { ...current, ...cfg };
  await prisma.appSetting.upsert({
    where: { key: KEY },
    update: { value: next as unknown as object },
    create: { key: KEY, value: next as unknown as object },
  });
  return next;
}
