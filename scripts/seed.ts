import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "carlosdanielmirandadelima@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Iogut9090";
  const name = process.env.ADMIN_NAME ?? "Carlos Daniel";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    if (process.env.RESET_ADMIN_PASSWORD === "1") {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.user.update({ where: { id: existing.id }, data: { passwordHash, role: "ADMIN", active: true } });
      console.log("Password reset.");
    }
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
