const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Región Metropolitana y sus ciudades/comunas
  const metropolitana = await prisma.region.upsert({
    where: { name: 'Metropolitana de Santiago' },
    update: {},
    create: {
      name: 'Metropolitana de Santiago',
      ordinal: 'XIII'
    }
  })

  const santiago = await prisma.city.upsert({
    where: { name: 'Santiago' },
    update: { regionId: metropolitana.id },
    create: {
      name: 'Santiago',
      regionId: metropolitana.id
    }
  })

  // Comunas de Santiago
  const comunasSantiago = [
    'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'La Reina',
    'Ñuñoa', 'San Miguel', 'La Florida', 'Maipú', 'La Cisterna'
  ]

  for (const comunaName of comunasSantiago) {
    await prisma.commune.upsert({
      where: { name: comunaName },
      update: { cityId: santiago.id },
      create: {
        name: comunaName,
        cityId: santiago.id
      }
    })
  }

  // Nuevos modelos: Status
  const statuses = [
    { name: 'Nuevo' },
    { name: 'Usado' }
  ]

  for (const status of statuses) {
    await prisma.status.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    })
  }

  // Nuevos modelos: PropertyType
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
    await prisma.propertyType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    })
  }

  // Nuevos modelos: UnitApu
  const unidades = [
    { name: 'm²' },
    { name: 'm³' },
    { name: 'ml' },
    { name: 'kg' },
    { name: 'u' },
    { name: 'jornal' }
  ];

  for (const unidad of unidades) {
    await prisma.unitApu.upsert({
      where: { name: unidad.name },
      update: {},
      create: unidad,
    });
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