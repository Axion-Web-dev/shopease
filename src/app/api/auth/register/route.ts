import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { name, email, password } = parsed.data;
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    const user = await db.user.create({
      data: { name, email: email.toLowerCase(), password: hashPassword(password), role: "CUSTOMER" },
    });
    await setSession(user.id, user.role);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
