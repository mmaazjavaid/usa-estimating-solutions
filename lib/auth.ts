import { jwtVerify, SignJWT } from 'jose';

const ADMIN_COOKIE_NAME = 'admin_token';
const TOKEN_TTL_SECONDS = 60 * 60 * 12;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable.');
  }

  return new TextEncoder().encode(secret);
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export async function signAdminToken(email: string) {
  return await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload;
}

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables.',
    );
  }

  return { email, password };
}
