-- ============================================================
--  MIGRACIÓN PRINCIPAL — Pegar en Supabase → SQL Editor → Run
-- ============================================================

-- 1. TABLA DE PROPIEDADES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS propiedades (
  id                 UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo             TEXT          NOT NULL,
  operacion          TEXT          NOT NULL,   -- 'venta' | 'alquiler'
  tipo               TEXT          NOT NULL,   -- 'casa' | 'departamento' | 'ph' | 'lote' | 'local' | 'oficina'
  precio             NUMERIC(15,2) NOT NULL,
  moneda             TEXT          NOT NULL DEFAULT 'USD',  -- 'ARS' | 'USD'
  ubicacion          TEXT          NOT NULL,
  barrio             TEXT          NOT NULL DEFAULT '',
  ciudad             TEXT          NOT NULL,
  ambientes          INTEGER,
  dormitorios        INTEGER,
  banios             INTEGER,       -- "baños" en TypeScript
  cocheras           INTEGER,
  superficie_cubierta NUMERIC(10,2),
  superficie_total   NUMERIC(10,2),
  expensas           NUMERIC(10,2),
  descripcion        TEXT          NOT NULL DEFAULT '',
  caracteristicas    TEXT[]        DEFAULT '{}',
  servicios          TEXT[]        DEFAULT '{}',
  requisitos         TEXT[]        DEFAULT '{}',
  images             TEXT[]        DEFAULT '{}',
  destacada          BOOLEAN       DEFAULT FALSE,
  created_at         TIMESTAMPTZ   DEFAULT NOW(),
  updated_at         TIMESTAMPTZ   DEFAULT NOW()
);

-- 2. TRIGGER: actualizar updated_at automáticamente
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION _update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_propiedades_updated_at ON propiedades;
CREATE TRIGGER trg_propiedades_updated_at
  BEFORE UPDATE ON propiedades
  FOR EACH ROW EXECUTE FUNCTION _update_updated_at();

-- 3. ROW LEVEL SECURITY
-- ----------------------------------------------------------------
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- Lectura pública (catálogo web)
CREATE POLICY "public_read" ON propiedades
  FOR SELECT USING (true);

-- Escritura solo desde service_role (API routes del servidor)
-- El service role bypasea RLS automáticamente — no hace falta policy para INSERT/UPDATE/DELETE.
-- Cuando agregues autenticación, reemplazá esto con:
--   USING (auth.role() = 'authenticated')

-- 4. STORAGE: bucket para imágenes
-- ----------------------------------------------------------------
-- Opción A: Crear manualmente en el Dashboard →
--   Storage → New bucket → nombre: "propiedades" → Public: ON
--
-- Opción B: Desde SQL (requiere extensión pg_net activa):
INSERT INTO storage.buckets (id, name, public)
  VALUES ('propiedades', 'propiedades', true)
  ON CONFLICT (id) DO NOTHING;

-- Políticas del bucket (permiten upload público para la demo)
-- IMPORTANTE: restringí estas políticas con auth antes de ir a producción
DROP POLICY IF EXISTS "storage_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "storage_allow_upload"  ON storage.objects;
DROP POLICY IF EXISTS "storage_allow_delete"  ON storage.objects;

CREATE POLICY "storage_public_read"  ON storage.objects
  FOR SELECT USING (bucket_id = 'propiedades');

CREATE POLICY "storage_allow_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'propiedades');

CREATE POLICY "storage_allow_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'propiedades');

-- ============================================================
--  SEED: datos de prueba (opcional — correlo por separado)
-- ============================================================
/*
INSERT INTO propiedades
  (titulo, operacion, tipo, precio, moneda, ubicacion, barrio, ciudad,
   ambientes, dormitorios, banios, cocheras,
   superficie_cubierta, superficie_total, expensas,
   descripcion, caracteristicas, servicios, images, destacada)
VALUES
  ('Casa moderna con jardín y piscina', 'venta', 'casa', 285000, 'USD',
   'Av. Rafael Núñez 4230, Cerro de las Rosas', 'Cerro de las Rosas', 'Córdoba',
   5, 3, 2, 2, 210, 600, NULL,
   'Espectacular casa en uno de los barrios más exclusivos de Córdoba.',
   ARRAY['Piscina con deck','Quincho con parrilla','Garage para 2 autos'],
   ARRAY['Agua corriente','Gas natural','Electricidad'],
   ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
   true),
  ('Departamento 2 ambientes, piso 8', 'venta', 'departamento', 98000, 'USD',
   'Bv. San Juan 1540, Nueva Córdoba', 'Nueva Córdoba', 'Córdoba',
   2, 1, 1, 1, 58, 58, 45000,
   'Luminoso departamento en piso alto con excelente vista al boulevard.',
   ARRAY['Balcón con vista al boulevard','Baulera incluida'],
   ARRAY['Agua corriente','Gas natural','Internet'],
   ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
   true);
*/
