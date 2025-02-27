import { prisma } from '../../../lib/prisma'
import { compare } from 'bcrypt'
import { NextResponse } from 'next/server'
import { generateToken } from '../../../utils/jwt'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { email, password, userType } = await request.json()

    // Primero buscar el usuario solo por email
    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    // Si el usuario existe pero el tipo no coincide
    if (userExists && userExists.userType !== userType) {
      return NextResponse.json(
        { 
          error: `Esta cuenta está registrada como ${
            userExists.userType === 'OWNER' ? 'Propietario' : 'Profesional'
          }. Por favor, selecciona el tipo de usuario correcto.`
        },
        { status: 401 }
      )
    }

    // Si el usuario no existe o el tipo coincide, buscar normalmente
    const user = await prisma.user.findFirst({
      where: {
        email,
        userType
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'El email o la contraseña son incorrectos' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'El email o la contraseña son incorrectos' },
        { status: 401 }
      )
    }

    // Generar token
    const token = generateToken(user)

    // Establecer cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 horas
    })

    // Login exitoso
    if (!user.profileCompleted) {
      return NextResponse.json({
        message: 'Login exitoso - Perfil incompleto',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          profileCompleted: false
        }
      })
    }

    return NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        profileCompleted: user.profileCompleted
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
} 