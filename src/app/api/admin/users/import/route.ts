import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Role } from "@prisma/client";

function genPwd(len = 10) {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const text = await req.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return NextResponse.json({ error: "empty" }, { status: 400 });
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (k: string) => headers.indexOf(k);
  const iName = idx("name");
  const iEmail = idx("email");
  const iPwd = idx("password");
  const iRole = idx("role");
  const iClass = idx("classgroup");
  if (iName < 0 || iEmail < 0) return NextResponse.json({ error: "bad-headers" }, { status: 400 });

  let created = 0;
  const failed: { email: string; reason: string }[] = [];
  const generated: { email: string; password: string }[] = [];

  for (let li = 1; li < lines.length; li++) {
    const cols = lines[li].split(",").map((c) => c.trim());
    const name = cols[iName];
    const email = (cols[iEmail] ?? "").toLowerCase();
    const pwd = (iPwd >= 0 && cols[iPwd]) || genPwd();
    const role = ((iRole >= 0 && cols[iRole]) || "STUDENT").toUpperCase() as Role;
    const classGroup = (iClass >= 0 && cols[iClass]) || null;
    if (!name || !email) {
      failed.push({ email: email || "?", reason: "name/email vazio" });
      continue;
    }
    try {
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: await bcrypt.hash(pwd, 10),
          role: ["ADMIN", "TEACHER", "STUDENT"].includes(role) ? role : "STUDENT",
          classGroup,
          state: { create: { data: {} } },
        },
      });
      created++;
      if (iPwd < 0 || !cols[iPwd]) generated.push({ email, password: pwd });
    } catch (e: unknown) {
      const err = e as { code?: string };
      failed.push({ email, reason: err.code === "P2002" ? "já existe" : "erro" });
    }
  }
  await prisma.auditLog.create({ data: { actorId: s.uid, action: "user.import", meta: { created, failed: failed.length } } });
  return NextResponse.json({ created, failed, generated });
}
