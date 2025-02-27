import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

export async function setAuthCookie(token) {
  cookies().set('auth-token', token, {
    httpOnly: true,      // No accesible por JavaScript
    secure: true,        // Solo HTTPS
    sameSite: 'strict',  // Protección CSRF
    maxAge: 86400        // 24 horas
  })
} 