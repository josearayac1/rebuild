import { NextResponse } from 'next/server'
import { verifyToken } from './utils/jwt'

export async function middleware(request) {
  const token = request.cookies.get('auth-token')

  // Log para debugging
  console.log('Middleware - Path:', request.nextUrl.pathname)
  console.log('Middleware - Token exists:', !!token)

  // Rutas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/profesional')) {
    
    if (!token) {
      console.log('Middleware - No token found')
      return NextResponse.redirect(new URL('/', request.url))
    }

    const payload = verifyToken(token.value)
    console.log('Middleware - Token payload:', payload)

    if (!payload) {
      console.log('Middleware - Invalid token')
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Verificar tipo de usuario correcto
    if (request.nextUrl.pathname.startsWith('/dashboard') && 
        payload.userType !== 'OWNER') {
      console.log('Middleware - Invalid user type for dashboard')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/profesional') && 
        payload.userType !== 'PROFESSIONAL') {
      console.log('Middleware - Invalid user type for profesional')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
} 