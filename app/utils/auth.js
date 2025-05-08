import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { verifyToken } from './jwt'
import { prisma } from '../lib/prisma'

export async function setAuthCookie(token) {
  cookies().set('auth-token', token, {
    httpOnly: true,      // No accesible por JavaScript
    secure: true,        // Solo HTTPS
    sameSite: 'strict',  // Protección CSRF
    maxAge: 86400        // 24 horas
  })
}

// Función genérica para obtener el usuario autenticado
export async function getUserFromRequest() {
  const token = cookies().get('auth-token');
  if (!token) return null;
  const payload = verifyToken(token.value);
  if (!payload) return null;
  // Busca el usuario en la base de datos
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  return user;
} 