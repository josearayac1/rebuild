import { prisma } from '../../../lib/prisma'
import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { sendRecoveryEmail } from '../../../utils/email'

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No existe una cuenta con este email' },
        { status: 404 }
      )
    }

    // Generar token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Guardar token en base de datos
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Enviar email
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`
    await sendRecoveryEmail(email, resetUrl)

    return NextResponse.json({
      message: 'Email de recuperación enviado'
    })

  } catch (error) {
    console.error('Error en recuperación:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
} 