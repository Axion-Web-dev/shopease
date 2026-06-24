import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const updated = await db.user.update({
      where: { id: user.id },
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, city: true, country: true, zip: true },
    });
    return NextResponse.json({ user: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
