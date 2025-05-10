const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Región Metropolitana y sus ciudades/comunas
  let metropolitana = await prisma.region.findFirst({
    where: { name: 'Metropolitana de Santiago' }
  })

  if (!metropolitana) {
    metropolitana = await prisma.region.create({
      data: {
        name: 'Metropolitana de Santiago',
        ordinal: 'XIII'
      }
    })
  }

  let santiago = await prisma.city.findFirst({
    where: { name: 'Santiago' }
  })

  if (!santiago) {
    santiago = await prisma.city.create({
      data: {
        name: 'Santiago',
        regionId: metropolitana.id
      }
    })
  }

  // Comunas de Santiago
  const comunasSantiago = [
    'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'La Reina',
    'Ñuñoa', 'San Miguel', 'La Florida', 'Maipú', 'La Cisterna'
  ]

  for (const comunaName of comunasSantiago) {
    let comuna = await prisma.commune.findFirst({
      where: { name: comunaName }
    })

    if (!comuna) {
      await prisma.commune.create({
        data: {
          name: comunaName,
          cityId: santiago.id
        }
      })
    }
  }

  // Status
  const statuses = [
    { name: 'Nuevo' },
    { name: 'Usado' }
  ]

  for (const status of statuses) {
    let existingStatus = await prisma.status.findFirst({
      where: { name: status.name }
    })

    if (!existingStatus) {
      await prisma.status.create({
        data: status
      })
    }
  }

  // PropertyType
  const propertyTypes = [
    { name: 'Departamento' },
    { name: 'Casa' },
    { name: 'Oficina' },
    { name: 'Local comercial' },
    { name: 'Bodega' },
    { name: 'Terreno' },
    { name: 'Estacionamiento' }
  ]

  for (const type of propertyTypes) {
    let existingType = await prisma.propertyType.findFirst({
      where: { name: type.name }
    })

    if (!existingType) {
      await prisma.propertyType.create({
        data: type
      })
    }
  }

  console.log('Base de datos poblada con éxito')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 