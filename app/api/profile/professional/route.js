import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '../../../utils/jwt'
import { cookies } from 'next/headers'
import { uploadImage } from '../../../utils/imageUpload' // Función para manejar la carga de imágenes

export async function POST(request) {
  try {
    const token = cookies().get('auth-token')
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token.value)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    // Verificar que los datos se están recibiendo correctamente
    console.log('Datos recibidos:', formData)

    // Manejar la carga de la imagen
    const profilePicture = formData.get('profilePicture')
    console.log('Archivo recibido para carga:', profilePicture) // Verificar el archivo
    let profilePictureUrl = null

    if (profilePicture && profilePicture.size > 0) {
      try {
        profilePictureUrl = await uploadImage(profilePicture)
      } catch (error) {
        console.error('Error al subir la imagen:', error)
        return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
      }
    } else {
      console.error('No se recibió un archivo válido')
      return NextResponse.json({ error: 'No se recibió un archivo válido' }, { status: 400 })
    }

    // Crear perfil profesional
    await prisma.professionalProfile.create({
      data: {
        userId: payload.id,
        phone: formData.get('phone'),
        profession: formData.get('profession'),
        experience: parseInt(formData.get('experience')),
        specialties: JSON.parse(formData.get('specialties')),
        regionId: formData.get('regionId'),
        cityId: formData.get('cityId'),
        communeId: formData.get('communeId'),
        profilePicture: profilePictureUrl // Guardar la URL de la imagen
      }
    })

    // Actualizar estado de perfil completado
    await prisma.user.update({
      where: { id: payload.id },
      data: { profileCompleted: true }
    })

    return NextResponse.json({
      message: 'Perfil creado exitosamente'
    })

  } catch (error) {
    console.error('Error al crear perfil:', error)
    return NextResponse.json(
      { error: 'Error al crear perfil' },
      { status: 500 }
    )
  }
} 