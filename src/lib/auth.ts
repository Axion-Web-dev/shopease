import { cookies } from "next/headers";
import { db } from "@/lib/db";
import crypto from "crypto";

const SESSION_COOKIE = "shopease_session";
const SECRET = process.env.SESSION_SECRET || "shopease-dev-secret-change-me";

/* ---------------- Password hashing (scrypt) ---------------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(test, "hex"));
}

/* ---------------- Session (signed JWT-ish cookie) ---------------- */

function base64url(input: string | Buffer) {
  return Buffer.from(input as any).toString("base64url");
}

function sign(data: string) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function createSessionToken(payload: Record<string, any>) {
  const body = base64url(JSON.stringify(payload));
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string): Record<string, any> | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function setSession(userId: string, role: string) {
  const token = createSessionToken({
    uid: userId,
    role,
    iat: Date.now(),
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ uid: string; role: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload?.uid) return null;
  return { uid: payload.uid as string, role: payload.role as string };
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.uid },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      city: true,
      country: true,
      zip: true,
    },
  });
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
