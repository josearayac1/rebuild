import { prisma } from '../../../lib/prisma'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    // Buscar usuario con token válido
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Actualizar contraseña
    const hashedPassword = await hash(password, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({
      message: 'Contraseña actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error al resetear contraseña:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la contraseña' },
      { status: 500 }
    )
  }
} 