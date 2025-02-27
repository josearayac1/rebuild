import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../utils/jwt'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const token = cookies().get('auth-token')
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token.value)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Obtener usuario con su perfil
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        professionalProfile: true,
        ownerProfile: true
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Error de autenticación' }, { status: 401 })
  }
} 