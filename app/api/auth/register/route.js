import { prisma } from '../../../lib/prisma'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

const validatePassword = (password) => {
  if (password.length < 6) return false
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) return false
  return true
}

export async function POST(request) {
  try {
    // Asegurarse de que se puede leer el body
    if (!request.body) {
      return NextResponse.json({ error: 'No se recibieron datos' }, { status: 400 })
    }

    const { name, email, password, userType } = await request.json()

    console.log('Datos recibidos:', { name, email, userType })

    // Validar campos requeridos
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar tipo de usuario
    const normalizedUserType = userType.toLowerCase()
    if (normalizedUserType !== 'propietario' && normalizedUserType !== 'profesional') {
      return NextResponse.json(
        { error: 'Tipo de usuario inválido. Debe ser "propietario" o "profesional"' },
        { status: 400 }
      )
    }

    // Validar contraseña
    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres y contener letras y números' },
        { status: 400 }
      )
    }

    // Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Encriptar contraseña
    const hashedPassword = await hash(password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType: normalizedUserType === 'propietario' ? 'OWNER' : 'PROFESSIONAL'
      }
    })

    console.log('Usuario creado:', user.id)

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    })

  } catch (error) {
    console.error('Error completo:', error)

    return NextResponse.json(
      { error: 'Error al crear usuario: ' + error.message },
      { status: 500 }
    )
  }
}
