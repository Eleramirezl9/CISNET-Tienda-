import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de asociados...');

  // Crear asociado de prueba: Marlon Moreles
  const asociadoPrueba = await prisma.asociado.upsert({
    where: { id: 'marlon-moreles-001' },
    update: {},
    create: {
      id: 'marlon-moreles-001',
      nombre: 'Marlon Moreles',
      cargo: 'Desarrollador Full Stack',
      empresa: 'CISNET',
      descripcion:
        'Desarrollador especializado en soluciones tecnológicas innovadoras. Apasionado por crear experiencias digitales excepcionales.',
      foto: null,
      linkedin: 'https://linkedin.com/in/marlonmoreles',
      twitter: null,
      sitioWeb: null,
      orden: 1,
      activo: true,
      destacado: true,
    },
  });

  console.log('Asociado de prueba creado:', asociadoPrueba.nombre);

  // Crear una solicitud de ejemplo
  const solicitudEjemplo = await prisma.solicitudAsociado.upsert({
    where: { id: 'solicitud-ejemplo-001' },
    update: {},
    create: {
      id: 'solicitud-ejemplo-001',
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      telefono: '+502 5555 1234',
      empresa: 'Tech Solutions',
      cargo: 'Director de Tecnología',
      mensaje:
        'Estoy interesado en formar parte de la red de asociados de CISNET. Tenemos experiencia en desarrollo de software empresarial y me gustaría explorar oportunidades de colaboración.',
      estado: 'pendiente',
      leida: false,
    },
  });

  console.log('Solicitud de ejemplo creada:', solicitudEjemplo.nombre);

  console.log('Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
