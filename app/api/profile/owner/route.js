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
    const profilePicture = formData.get('profilePicture')
    let profilePictureUrl = null

    if (profilePicture && profilePicture.size > 0) {
      try {
        profilePictureUrl = await uploadImage(profilePicture)
      } catch (error) {
        console.error('Error al subir la imagen:', error)
        return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
      }
    }

    const ownerProfile = await prisma.ownerProfile.upsert({
      where: { userId: payload.id },
      update: {
        phone: formData.get('phone'),
        address: formData.get('address'),
        company: formData.get('company'),
        regionId: formData.get('regionId'),
        cityId: formData.get('cityId'),
        communeId: formData.get('communeId'),
        profilePicture: profilePictureUrl
      },
      create: {
        userId: payload.id,
        phone: formData.get('phone'),
        address: formData.get('address'),
        company: formData.get('company'),
        regionId: formData.get('regionId'),
        cityId: formData.get('cityId'),
        communeId: formData.get('communeId'),
        profilePicture: profilePictureUrl
      }
    })

    return NextResponse.json({ message: 'Perfil actualizado exitosamente', ownerProfile })
  } catch (error) {
    console.error('Error al crear o actualizar el perfil del propietario:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
} 