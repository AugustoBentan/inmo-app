# Propuesta de Desarrollo Web
## Inmobiliaria & Productora de Seguros

---

**Fecha de emisión:** 17 de abril de 2026  
**Preparado por:** Augusto Fernandez — Desarrollo Web Full-Stack  
**Contacto:** augusto1942001@gmail.com  
**Versión:** 1.0

---

## 1. Resumen ejecutivo

Se desarrollará una plataforma web completa para una empresa **Inmobiliaria y Productora de Seguros**, orientada a digitalizar su presencia comercial y optimizar la gestión interna de propiedades. La solución contempla un sitio público de alto impacto visual y un panel de administración privado y seguro.

---

## 2. Alcance del proyecto

### 2.1 Módulos entregados

| N° | Módulo | Descripción |
|----|--------|-------------|
| 1 | **Página de inicio** | Split-screen interactivo con acceso a Seguros e Inmobiliaria |
| 2 | **Seguros** | Cotizador con tipos de seguros y formulario de contacto vía WhatsApp / Mail |
| 3 | **Catálogo de propiedades** | Listado con filtros avanzados, grilla de tarjetas y carrusel de imágenes |
| 4 | **Vista de detalle** | Página individual por propiedad con galería, características, mapa y botón WhatsApp |
| 5 | **Panel de administración** | CRUD completo de propiedades con formulario extenso |
| 6 | **Autenticación** | Sistema de login seguro con protección de rutas privadas |
| 7 | **Base de datos** | Integración con Supabase (PostgreSQL + Storage para imágenes) |
| 8 | **API REST** | Endpoints para crear, leer, actualizar y eliminar propiedades |

---

### 2.2 Funcionalidades destacadas

| Funcionalidad | Detalle |
|---------------|---------|
| Diseño responsivo | Adaptado para mobile, tablet y desktop |
| Filtros de búsqueda | Por operación, tipo, moneda, precio y ciudad |
| Carga de imágenes | Preview local antes de subir + progreso de carga en tiempo real |
| Notificaciones | Toasts de éxito y error en todas las operaciones del admin |
| Protección de rutas | Middleware de autenticación + AuthGuard como segunda capa |
| SEO | Metadata dinámica por propiedad (`title`, `description`) |
| Rendimiento | Imágenes optimizadas con Next.js Image, renderizado server-side |
| Integración WhatsApp | Mensajes pre-armados con datos del formulario o la propiedad |

---

## 3. Stack tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Framework | Next.js 15 (App Router) | Frontend + Backend |
| Lenguaje | TypeScript | Tipado estático |
| Estilos | Tailwind CSS | Diseño responsivo |
| Base de datos | Supabase (PostgreSQL) | Almacenamiento de propiedades |
| Storage | Supabase Storage | Imágenes de propiedades |
| Autenticación | Supabase Auth + @supabase/ssr | Sesiones seguras con cookies |
| Hosting recomendado | Vercel | Deploy continuo desde GitHub |
| Control de versiones | GitHub | Repositorio |

---

## 4. Desglose de trabajo y horas estimadas

| Área | Tareas | Hs estimadas |
|------|--------|:------------:|
| Arquitectura y setup | Proyecto Next.js, Tailwind, estructura de carpetas, conexión Supabase | 12 hs |
| Diseño UI/UX | Split-screen, sistema de colores, componentes reutilizables | 8 hs |
| Módulo Seguros | Página, cotizador, modal WhatsApp | 8 hs |
| Módulo Inmobiliaria | Catálogo, filtros, cards, carrusel, detalle | 18 hs |
| Panel Admin | Tabla CRUD, formulario extenso, upload de imágenes | 18 hs |
| Base de datos | Migración SQL, RLS, Storage, seeds, transformaciones | 6 hs |
| Autenticación | Login, middleware, AuthGuard, AuthContext | 8 hs |
| UX Admin | Toasts, preview de imágenes, barra de progreso, limpieza de form | 8 hs |
| Testing y ajustes | Corrección de errores, pruebas en producción | 12 hs |
| **Total** | | **92 hs** |

---

## 5. Presupuesto


| Concepto | Precio |
|----------|-------:|
| Desarrollo completo (60 hs) | **USD 1.200** |
| Configuración de hosting en Vercel | **USD 0** *(incluido)* |
| Configuración de base de datos Supabase | **USD 0** *(incluido)* |
| Repositorio privado en GitHub | **USD 0** *(incluido)* |
| **Total** | **USD 1.200** |

> *Precio referencial. Se puede ajustar según requerimientos adicionales o acuerdo comercial.*

---

### Con mantenimiento mensual

| Concepto | Precio mensual |
|----------|---------------:|
| Mantenimiento y soporte técnico | **USD 50 / mes** |
| Corrección de errores y parches de seguridad | **Incluido** |
| Nuevas funcionalidades menores (hasta 6 hs/semana) | **Incluido** |

---

## 6. Costos operativos estimados (a cargo del cliente)

| Servicio | Plan recomendado | Costo mensual |
|----------|-----------------|:-------------:|
| Supabase | Free (hasta 500 MB / 50.000 req/mes) | **USD 0** |
| Vercel | Hobby (proyectos personales/pequeños) | **USD 0** |
| Dominio propio | Ej: `.com.ar` en NIC Argentina | ~**ARS 10.000/año** |
| **Total infraestructura** | | ~**ARS 10.000** |

> Ambas plataformas cuentan con planes gratuitos que son suficientes para el tráfico inicial. Se puede escalar si el volumen crece.

---



## 7. Entregables

- [x] Código fuente completo en repositorio GitHub privado
- [x] Base de datos configurada y en producción (Supabase)
- [x] Deploy en Vercel (o plataforma a elección)
- [x] Documento de migración SQL (`supabase-migration.sql`)
- [x] Script de carga inicial de propiedades (`scripts/seed.mjs`)
- [x] Usuario administrador configurado en el sistema

---

## 8. Condiciones

| Ítem | Detalle |
|------|---------|
| Validez de la propuesta | 30 días desde la fecha de emisión |
| Forma de pago | 50% al inicio — 50% a la entrega |
| Tiempo de entrega | Beta 2 semanas - Proyecto terminado en 3 semanas |
| Revisiones incluidas | Hasta 3 rondas de ajustes sin costo adicional |
| Soporte post-entrega | 30 días de soporte gratuito ante errores |

---

## 9. Próximas funcionalidades sugeridas *(opcionales)*

| Funcionalidad | Estimación |
|---------------|:----------:|
| Panel de analytics (visitas, propiedades más vistas) | 16 hs |
| Mapa interactivo de propiedades (Google Maps / Mapbox) | 12 hs |
| Multi-usuario admin (roles y permisos) | 8 hs |

---

*Este documento fue generado como propuesta comercial para el proyecto **Inmobiliaria & Productora de Seguros**.*  
*Para consultas o ajustes, contactar a: augusto1942001@gmail.com*
