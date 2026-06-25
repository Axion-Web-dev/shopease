import { env } from './env';

export function setCorsHeaders(response: Response, origin?: string) {
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  
  if (allowedOrigins.includes('*')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (allowedOrigins.length > 0) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export function handleCors(req: Request): boolean {
  const origin = req.headers.get('origin');
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  
  if (allowedOrigins.includes('*')) {
    return true;
  }
  
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }
  
  return false;
}
