import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_SECRET = process.env.SESSION_SECRET || 'default-secret-change-in-production';

export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', CSRF_SECRET).update(token).digest('hex');
  const csrfToken = `${token}.${signature}`;
  
  const store = await cookies();
  store.set(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  
  return token; // Return only the token part to the client
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  const store = await cookies();
  const storedToken = store.get(CSRF_COOKIE_NAME)?.value;
  
  if (!storedToken) return false;
  
  const [storedTokenPart, storedSignature] = storedToken.split('.');
  if (!storedTokenPart || !storedSignature) return false;
  
  // Verify the token matches
  if (storedTokenPart !== token) return false;
  
  // Verify the signature
  const expectedSignature = crypto.createHmac('sha256', CSRF_SECRET).update(token).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(storedSignature), Buffer.from(expectedSignature));
}

export async function clearCsrfToken(): Promise<void> {
  const store = await cookies();
  store.delete(CSRF_COOKIE_NAME);
}
