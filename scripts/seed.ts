import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1) Idempotent admin user
  const email = (process.env.ADMIN_EMAIL ?? "carlosdanielmirandadelima@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Iogut9090@";
  const name = process.env.ADMIN_NAME ?? "Carlos Daniel";
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Always re-assert ADMIN + active so the account stays as the owner.
    const data: { role: "ADMIN"; active: true; passwordHash?: string } = {
      role: "ADMIN",
      active: true,
    };
    if (process.env.RESET_ADMIN_PASSWORD === "1") data.passwordHash = passwordHash;
    await prisma.user.update({ where: { id: existing.id }, data });
    console.log(`Admin re-asserted: ${email}`);
  } else {
    const u = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "ADMIN",
        active: true,
        state: { create: { data: {} } },
      },
    });
    console.log(`Created admin: ${u.email} (id=${u.id})`);
  }

  // 2) Default AI provider config — DeepSeek (cheaper for clients).
  // Only seeds if no config exists yet OR if SEED_AI_RESET=1 is set.
  const existingAi = await prisma.appSetting.findUnique({ where: { key: "ai-config" } });
  const seedKey = process.env.AI_SEED_DEEPSEEK_KEY ?? "sk-4441ff88cfa84effab161dbdf1d2d9bb";
  if (!existingAi || process.env.SEED_AI_RESET === "1") {
    const value = {
      provider: "deepseek",
      apiKey: seedKey,
      model: "deepseek-chat",
      monthlyQuota: 50,
    };
    await prisma.appSetting.upsert({
      where: { key: "ai-config" },
      update: { value: value as unknown as object },
      create: { key: "ai-config", value: value as unknown as object },
    });
    console.log(`AI config seeded: provider=deepseek model=deepseek-chat`);
  } else {
    console.log(`AI config already exists — keeping admin-set value.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
