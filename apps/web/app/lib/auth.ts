import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; 

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET) as { userId: string; email: string };
    return payload;
  } catch {
    return null;
  }
}
