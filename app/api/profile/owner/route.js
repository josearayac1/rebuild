import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '../../../utils/jwt'
import { cookies } from 'next/headers'
import { uploadImage } from '../../../utils/imageUpload'

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
        profilePictureUrl = await uploadImage(profilePicture, 'profiles')
      } catch (error) {
        console.error('Error al subir la imagen:', error)
        return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
      }
    }else {
      console.error('No se recibió un archivo válido')
      return NextResponse.json({ error: 'No se recibió un archivo válido' }, { status: 400 })
    }

    const ownerProfile = await prisma.ownerProfile.create({
      data: {
        userId: payload.id,
        phone: formData.get('phone'),
        address: formData.get('address'),
        company: formData.get('company'),
        regionId: formData.get('regionId'),
        cityId: formData.get('cityId'),
        communeId: formData.get('communeId'),
        profilePicture: profilePictureUrl,
      },
      include: {
        region: true,
        city: true,
        commune: true,
      }
    })
    console.log(ownerProfile); 
    
    // Actualizar estado de perfil completado
    await prisma.user.update({
      where: { id: payload.id },
      data: { profileCompleted: true }
    })

    return NextResponse.json({ 
      message: 'Perfil creado exitosamente',
      ownerProfile
    })
  
  } catch (error) {
    console.error('Error al crear el perfil del propietario:', error)
    return NextResponse.json(
      { error: 'Error al crear el perfil' }, 
      { status: 500 }
    )
  }
} 