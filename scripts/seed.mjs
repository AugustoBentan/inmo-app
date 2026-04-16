/**
 * Seed: carga las 12 propiedades mock en Supabase via API.
 * Ejecutar con: node scripts/seed.mjs
 */

const BASE_URL = "http://localhost:3000";

const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const PROPIEDADES = [
  {
    titulo: "Casa moderna con jardín y piscina",
    operacion: "venta", tipo: "casa", precio: 285000, moneda: "USD",
    ubicacion: "Av. Rafael Núñez 4230, Cerro de las Rosas",
    barrio: "Cerro de las Rosas", ciudad: "Córdoba",
    ambientes: 5, dormitorios: 3, baños: 2, cocheras: 2,
    superficieCubierta: 210, superficieTotal: 600, expensas: null,
    descripcion: "Espectacular casa en uno de los barrios más exclusivos de Córdoba. Cuenta con amplio living-comedor con salida al jardín, cocina integrada totalmente equipada, lavadero, y garage para dos autos. El jardín con piscina y quincho es ideal para disfrutar en familia. Terminaciones de primera calidad en toda la propiedad.",
    caracteristicas: ["Piscina con deck de madera", "Quincho con parrilla cubierta", "Garage para 2 autos", "Calefacción central", "Aire acondicionado split en todos los ambientes", "Alarma y cámaras de seguridad"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Internet fibra óptica", "Cloacas"],
    requisitos: [],
    images: [img("1564013799919-ab600027ffc6"), img("1512917774080-9991f1c4c750"), img("1484154218962-a197022b5858"), img("1583847268964-b28dc8f51f92")],
    destacada: true,
  },
  {
    titulo: "Departamento 2 ambientes, piso 8",
    operacion: "venta", tipo: "departamento", precio: 98000, moneda: "USD",
    ubicacion: "Bv. San Juan 1540, Nueva Córdoba",
    barrio: "Nueva Córdoba", ciudad: "Córdoba",
    ambientes: 2, dormitorios: 1, baños: 1, cocheras: 1,
    superficieCubierta: 58, superficieTotal: 58, expensas: 45000,
    descripcion: "Luminoso departamento en piso alto con excelente vista al boulevard. Cocina americana integrada al living, dormitorio amplio con placard, baño completo y balcón. Edificio con amenities: sum, solarium y baulera incluida.",
    caracteristicas: ["Balcón con vista al boulevard", "Baulera incluida", "SUM y solarium", "Ascensor", "Portero eléctrico"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Internet"],
    requisitos: [],
    images: [img("1502672260266-1c1ef2d93688"), img("1545324418-cc1a3fa10c00"), img("1556909114-f6e7ad7d3136")],
    destacada: true,
  },
  {
    titulo: "Casa en alquiler, barrio residencial",
    operacion: "alquiler", tipo: "casa", precio: 420000, moneda: "ARS",
    ubicacion: "Yapeyú 780, General Paz",
    barrio: "General Paz", ciudad: "Córdoba",
    ambientes: 4, dormitorios: 2, baños: 1, cocheras: 1,
    superficieCubierta: 140, superficieTotal: 320, expensas: null,
    descripcion: "Cómoda casa de dos plantas en barrio tranquilo. Planta baja: living amplio, comedor, cocina con office, patio con parrilla. Planta alta: dos dormitorios con placard y baño completo.",
    caracteristicas: ["Patio con parrilla", "Garage cubierto para 1 auto", "Placard en ambos dormitorios", "Calefacción a gas"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Cloacas"],
    requisitos: ["Garantía propietario en Córdoba Capital", "3 recibos de sueldo", "Mes de depósito"],
    images: [img("1568605114967-8130f3a36994"), img("1570129477492-45c003edd2be")],
    destacada: false,
  },
  {
    titulo: "Departamento monoambiente reciclado",
    operacion: "alquiler", tipo: "departamento", precio: 185000, moneda: "ARS",
    ubicacion: "Obispo Trejo 640, Centro",
    barrio: "Centro", ciudad: "Córdoba",
    ambientes: 1, dormitorios: 0, baños: 1, cocheras: null,
    superficieCubierta: 38, superficieTotal: 38, expensas: 32000,
    descripcion: "Monoambiente totalmente reciclado en el corazón del Centro. Cocina equipada, baño con ducha, internet incluido. Ideal para estudiantes o profesionales.",
    caracteristicas: ["Totalmente amoblado", "Internet incluido", "Cocina equipada"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Internet fibra óptica"],
    requisitos: ["Garantía propietario o seguro de caución", "1 mes de depósito"],
    images: [img("1502672260266-1c1ef2d93688"), img("1484154218962-a197022b5858")],
    destacada: false,
  },
  {
    titulo: "PH a estrenar, 3 ambientes con terraza",
    operacion: "venta", tipo: "ph", precio: 148000, moneda: "USD",
    ubicacion: "Colón 3450, Alberdi",
    barrio: "Alberdi", ciudad: "Córdoba",
    ambientes: 3, dormitorios: 2, baños: 2, cocheras: null,
    superficieCubierta: 95, superficieTotal: 140, expensas: 38000,
    descripcion: "PH a estrenar con acceso independiente. Living-comedor con salida a terraza privada de 45m², cocina americana, 2 dormitorios con placard, 2 baños completos.",
    caracteristicas: ["Terraza privada de 45m²", "Acceso independiente", "2 baños completos", "Entrega inmediata"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Internet"],
    requisitos: [],
    images: [img("1600596542815-ffad4c1539a9"), img("1556909114-f6e7ad7d3136")],
    destacada: true,
  },
  {
    titulo: "Lote en barrio privado, escritura lista",
    operacion: "venta", tipo: "lote", precio: 44000, moneda: "USD",
    ubicacion: "Barrio Los Aromos, Malagueño",
    barrio: "Los Aromos", ciudad: "Malagueño",
    ambientes: null, dormitorios: null, baños: null, cocheras: null,
    superficieCubierta: null, superficieTotal: 500, expensas: 18000,
    descripcion: "Lote en barrio cerrado a 20 minutos de Córdoba Capital. Orientación norte-sur, totalmente plano. Infraestructura completa y acceso pavimentado.",
    caracteristicas: ["500m² totalmente planos", "Orientación Norte-Sur", "Acceso pavimentado", "Seguridad 24hs"],
    servicios: ["Agua corriente", "Electricidad", "Gas natural (ramal frente al lote)"],
    requisitos: [],
    images: [img("1500382017468-9049fed747ef"), img("1531971589569-0d9370cbe1e5")],
    destacada: false,
  },
  {
    titulo: "Local comercial en esquina, alta visibilidad",
    operacion: "alquiler", tipo: "local", precio: 320000, moneda: "ARS",
    ubicacion: "Av. Colón y O'Higgins, Nueva Córdoba",
    barrio: "Nueva Córdoba", ciudad: "Córdoba",
    ambientes: null, dormitorios: null, baños: 1, cocheras: null,
    superficieCubierta: 85, superficieTotal: 85, expensas: 55000,
    descripcion: "Local en esquina de alta circulación peatonal y vehicular. Amplio salón de 65m², depósito de 15m², baño y rampa de acceso. Habilitación vigente.",
    caracteristicas: ["Esquina con doble vidriera", "Depósito de 15m²", "Habilitación vigente", "Rampa de acceso"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad trifásica"],
    requisitos: ["Garantía propietario o seguro de caución", "Depósito 2 meses"],
    images: [img("1486325212027-8081e485255e"), img("1497366216548-37526070297c")],
    destacada: false,
  },
  {
    titulo: "Oficinas corporativas en torre AAA",
    operacion: "alquiler", tipo: "oficina", precio: 620000, moneda: "ARS",
    ubicacion: "Av. Vélez Sársfield 1250, piso 11, Centro",
    barrio: "Centro", ciudad: "Córdoba",
    ambientes: null, dormitorios: null, baños: 2, cocheras: null,
    superficieCubierta: 120, superficieTotal: 120, expensas: 95000,
    descripcion: "Planta de oficinas en torre corporativa. Planta libre de 120m², dos baños, kitchenette y sala de reuniones. Edificio con generador y data center.",
    caracteristicas: ["Planta libre adaptable", "Sala de reuniones equipada", "Kitchenette", "Vista panorámica", "Generador propio"],
    servicios: ["Electricidad trifásica", "Fibra óptica de alta velocidad", "Aire acondicionado central"],
    requisitos: ["Garantía bancaria", "3 meses de depósito"],
    images: [img("1497366216548-37526070297c"), img("1497366811353-6870744d04b2")],
    destacada: false,
  },
  {
    titulo: "Casa estilo provenzal con vista a las sierras",
    operacion: "venta", tipo: "casa", precio: 425000, moneda: "USD",
    ubicacion: "Los Nogales 220, La Calera",
    barrio: "Residencial Norte", ciudad: "La Calera",
    ambientes: 6, dormitorios: 4, baños: 3, cocheras: 3,
    superficieCubierta: 280, superficieTotal: 900, expensas: null,
    descripcion: "Imponente residencia estilo provenzal con vistas privilegiadas a las sierras. Suite principal con vestidor, cocina gourmet, piscina temperada y cancha de tenis.",
    caracteristicas: ["Piscina temperada con deck", "Cancha de tenis", "Suite principal con vestidor", "Cocina gourmet", "Garage para 3 autos"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Internet satelital"],
    requisitos: [],
    images: [img("1523217582562-09d0def993a6"), img("1560448204-e02f11c3d0e2"), img("1484154218962-a197022b5858")],
    destacada: true,
  },
  {
    titulo: "Departamento 2 amb con cochera, a estrenar",
    operacion: "venta", tipo: "departamento", precio: 75000, moneda: "USD",
    ubicacion: "Laprida 450, Güemes",
    barrio: "Güemes", ciudad: "Córdoba",
    ambientes: 2, dormitorios: 1, baños: 1, cocheras: 1,
    superficieCubierta: 52, superficieTotal: 52, expensas: 42000,
    descripcion: "Departamento a estrenar en el barrio más trendy de Córdoba. Cocina con granito, ducha italiana, cochera incluida. A pasos de los mejores bares y restaurantes.",
    caracteristicas: ["A estrenar", "Cochera incluida", "Ducha italiana", "Cocina con granito"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Internet"],
    requisitos: [],
    images: [img("1502672260266-1c1ef2d93688"), img("1545324418-cc1a3fa10c00")],
    destacada: false,
  },
  {
    titulo: "PH dúplex con terraza privada y parrilla",
    operacion: "alquiler", tipo: "ph", precio: 380000, moneda: "ARS",
    ubicacion: "Las Higueras 340, Río Ceballos",
    barrio: "Centro", ciudad: "Río Ceballos",
    ambientes: 4, dormitorios: 2, baños: 2, cocheras: null,
    superficieCubierta: 110, superficieTotal: 165, expensas: 28000,
    descripcion: "Hermoso dúplex con terraza en Río Ceballos. Primer piso: living, cocina, baño. Segundo piso: 2 dormitorios, baño, y escalera a terraza de 55m² con parrilla.",
    caracteristicas: ["Terraza de 55m² con parrilla", "Vista a las sierras", "Aire acondicionado", "Calefacción a gas"],
    servicios: ["Agua corriente", "Gas natural", "Electricidad", "Internet"],
    requisitos: ["Garantía propietario", "2 meses de depósito"],
    images: [img("1600596542815-ffad4c1539a9"), img("1583847268964-b28dc8f51f92")],
    destacada: false,
  },
  {
    titulo: "Lote en fraccionamiento a 200m del lago",
    operacion: "venta", tipo: "lote", precio: 29500, moneda: "USD",
    ubicacion: "Los Aromos s/n, Villa Carlos Paz",
    barrio: "Costa Azul", ciudad: "Villa Carlos Paz",
    ambientes: null, dormitorios: null, baños: null, cocheras: null,
    superficieCubierta: null, superficieTotal: 420, expensas: null,
    descripcion: "Lote residencial a 200 metros del Lago San Roque. Desnivel ideal para subsuelo. Escritura inmediata. Ideal para casa de descanso o inversión.",
    caracteristicas: ["A 200m del Lago San Roque", "Escritura inmediata", "Acceso pavimentado"],
    servicios: ["Agua corriente", "Electricidad"],
    requisitos: [],
    images: [img("1500382017468-9049fed747ef"), img("1531971589569-0d9370cbe1e5")],
    destacada: false,
  },
];

async function seed() {
  console.log(`🌱 Seeding ${PROPIEDADES.length} propiedades...\n`);
  let ok = 0, fail = 0;

  for (const p of PROPIEDADES) {
    try {
      const res = await fetch(`${BASE_URL}/api/propiedades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`  ✅ [${data.id.slice(0, 8)}] ${p.titulo}`);
        ok++;
      } else {
        console.error(`  ❌ ${p.titulo}: ${data.error}`);
        fail++;
      }
    } catch (e) {
      console.error(`  ❌ ${p.titulo}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n✔ ${ok} creadas, ✗ ${fail} errores.`);
}

seed();
