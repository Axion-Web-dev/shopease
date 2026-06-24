import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await setSession(user.id, user.role);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
