const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const assert = require('assert');

async function runTests() {
  console.log("🚀 Iniciando pruebas funcionales de Soluciones...");

  try {
    // 1. Crear una solución borrador con galería (3 imágenes, una principal, distintos alts)
    console.log("📝 1. Probando creación de Solución con Galería (Borrador)...");
    const testTitle = "Test Solution Gallery API";
    const testSlug = "test-solution-gallery-api";
    
    // Cleanup if exists
    await prisma.solution.deleteMany({ where: { slug: testSlug } });

    // Mock API request body
    const createBody = {
      title: testTitle,
      description: "Prueba de integración",
      slug: testSlug,
      type: "SOLUTION",
      published: false, // Borrador
      functionalDescription: "Descripción funcional de prueba",
      multimedia: "/legacy-fallback.jpg",
      gallery: [
        { url: "/img1.jpg", alt: "Imagen 1", isPrimary: false, order: 0 },
        { url: "/img2.jpg", alt: "Imagen Principal", isPrimary: true, order: 1 },
        { url: "/img3.jpg", alt: "Imagen 3", isPrimary: false, order: 2 }
      ]
    };

    // Simulate POST /api/solutions
    let solution = await prisma.solution.create({
      data: {
        title: createBody.title,
        description: createBody.description,
        slug: createBody.slug,
        type: createBody.type,
        published: createBody.published,
        functionalDescription: createBody.functionalDescription,
        multimedia: createBody.multimedia,
        gallery: {
          create: createBody.gallery
        }
      },
      include: { gallery: { orderBy: { order: 'asc' } } }
    });

    assert.ok(solution.id, "Debe tener un ID");
    assert.strictEqual(solution.gallery.length, 3, "Debe tener 3 imágenes en la galería");
    assert.strictEqual(solution.gallery[1].isPrimary, true, "La segunda imagen debe ser la principal");
    console.log("✅ Creación exitosa.");

    // 2. Probar que los borradores NO aparecen en frontend público pero SÍ en admin
    console.log("📝 2. Probando visibilidad de borradores...");
    
    // Frontend (public)
    const publicQuery = await prisma.solution.findMany({ where: { published: true } });
    const isPublic = publicQuery.find(s => s.slug === testSlug);
    assert.strictEqual(isPublic, undefined, "El borrador NO debe aparecer en consultas públicas");

    // Admin (with admin=true equivalent)
    const adminQuery = await prisma.solution.findMany({});
    const isAdmin = adminQuery.find(s => s.slug === testSlug);
    assert.ok(isAdmin, "El borrador SÍ debe aparecer en consultas admin");
    console.log("✅ Visibilidad correcta.");

    // 3. Modificar la solución (simulando PUT) y cambiar imágenes y campos
    console.log("📝 3. Probando edición de solución...");
    const updateBody = {
      ...createBody,
      title: "Test Solution Updated",
      published: true, // Lo publicamos
      gallery: [
        { url: "/img1.jpg", alt: "Imagen 1 Editada", isPrimary: false, order: 0 },
        { url: "/img4.jpg", alt: "Nueva Imagen Principal", isPrimary: true, order: 1 } // Quitamos una, cambiamos otra
      ]
    };

    const updatedSolution = await prisma.solution.update({
      where: { id: solution.id },
      data: {
        title: updateBody.title,
        published: updateBody.published,
        gallery: {
          deleteMany: {},
          create: updateBody.gallery
        }
      },
      include: { gallery: { orderBy: { order: 'asc' } } }
    });

    assert.strictEqual(updatedSolution.gallery.length, 2, "La galería debe haberse actualizado a 2 imágenes");
    assert.strictEqual(updatedSolution.gallery[1].url, "/img4.jpg", "La nueva imagen debe haberse guardado");
    console.log("✅ Edición exitosa.");

    // 4. Probar el endpoint único GET /soluciones/[slug] (lógica de page.tsx)
    console.log("📝 4. Probando la resolución de ruta (Solution vs Sector)...");
    const trySolution = await prisma.solution.findUnique({
      where: { slug: testSlug, published: true }
    });
    assert.ok(trySolution, "Debe resolverse como Solución pública");

    // Limpieza
    await prisma.solution.delete({ where: { id: solution.id } });
    console.log("✅ Limpieza completada.");
    
    console.log("🎉 Todas las pruebas pasaron exitosamente!");

  } catch (error) {
    console.error("❌ Falló la prueba:", error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
