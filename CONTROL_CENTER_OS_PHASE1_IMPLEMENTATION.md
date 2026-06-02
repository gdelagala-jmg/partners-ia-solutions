# PROJECT GUARDIAN PRE-FLIGHT CHECK INITIATED
# PLAN FINAL DE IMPLEMENTACIÓN — CONTROL CENTER OS (FASE 1)
## ENTORNO ADMINISTRATIVO — PARTNERS IA SOLUTIONS

Este documento define la arquitectura visual, componentes, secuencia técnica de ejecución, wireframes interactivos y plan de contingencia para la **Fase 1: Foundation Architecture** del nuevo **Control Center OS** de **Partners IA**.

Este plan establece una reestructuración profunda de la UX/UI basándose en un lenguaje visual premium **Light Premium** (70% AI Intelligence Center, 20% Operational Control Center, 10% Mission Control), priorizando la holgura espacial, la navegación fluida y la reducción del ruido clásico de un CMS tradicional.

---

## 1. Alcance Estricto y Límites Técnicos

Para garantizar la inmunidad absoluta del backend de **Partners IA**, se establecen fronteras físicas de implementación:

*   **FUERA DE ALCANCE (Intocable)**:
    *   Modelos de datos y relaciones de Prisma (`prisma/schema.prisma`).
    *   Consultas, métodos de persistencia u ORM (`src/lib/db.ts`).
    *   Lógica de Server Actions y endpoints API (`src/app/api/**/*.ts`).
    *   Reglas de control de acceso, Middleware y Autenticación (`src/middleware.ts`).
    *   Todo el directorio público orientado a cliente (`src/app/(public)/**/*`).
*   **EN ALCANCE (Modificable y editable)**:
    *   Hojas de estilos estructurales del panel (`src/components/admin/ui/AdminInfrastructure.css`).
    *   Componentes visuales y de presentación (`src/components/admin/**/*`).
    *   Maquetación de páginas y layouts del entorno backoffice (`src/app/admin/(dashboard)/**/*`).
    *   Responsive, navegación lateral, barras de herramientas y menús de acción rápida.

---

## 2. Lenguaje Visual y Tokens de Diseño (Light Premium)

La estética aprobada fusiona la claridad premium de Apple con detalles interactivos predictivos de IA en un entorno de fondo claro y luminoso:

```
+---------------------------------------------------------------------------------+
| CAPA DE DISEÑO           | PROPORCIÓN | DETALLE ESTÉTICO                        |
+--------------------------+------------+-----------------------------------------+
| AI Intelligence Center   |    70%     | Acentos violeta/cian y telemetría de IA|
| Operational Control      |    20%     | Minimalismo plano Apple, bordes finos   |
| Mission Control          |    10%     | Indicadores técnicos, labels en mayúscula|
+---------------------------------------------------------------------------------+
```

### Tokens de Color (Light Premium)
*   **Fondo General (Canvas)**: Blanco absoluto `#FFFFFF` con zonas de descanso en `#F6F8FA`.
*   **Fondo de Paneles y Tarjetas (Surface)**: Blanco premium porcelana `#FFFFFF` con degradados lineales muy sutiles (`bg-gradient-to-tr from-white to-gray-50/30`).
*   **Micro-Bordes y Retículas**: Gris ultra-fino `#F1F3F5` (1px). Se eliminan los bordes gruesos y las divisiones oscuras.
*   **Texto Principal**: Gris carbón espacial `#1D1D1F`.
*   **Texto Secundario (Metadata/Etiquetas)**: Gris medio `#6E6E73`.
*   **Acentos del Sistema**:
    *   *Azul Control*: `#007AFF` (Acciones y botones principales).
    *   *Violeta IA*: `#8B5CF6` (Motor predictivo, datos del RAG y sentimiento positivo).
    *   *Cian Insights*: `#06B6D4` (Telemetry labels y estado en línea del sistema).

### Densidad y Espaciado ("Más Aire, Menos Ruido")
*   **Márgenes Internos**: Incrementados de `p-4` a `p-6` (24px) en tarjetas pequeñas y `p-8` (32px) en áreas principales de trabajo.
*   **Espaciado de Grid**: Separaciones amplias de `gap-8` (32px) para permitir que los datos respiren.
*   **Cero Cajas Innecesarias**: Se eliminan fondos grises en inputs del formulario y bordes dobles de tarjetas. La separación se realiza mediante espacio en blanco y sombras difusas premium (`shadow-[0_8px_32px_rgba(0,0,0,0.02)]`).

---

## 3. Estructura Principal del Nuevo Sidebar Táctico

El sidebar se reorganiza siguiendo el flujo cognitivo y operativo de un administrador real de **Partners IA**, preparando su maquetación estructural para soportar arrastrar y soltar (Drag & Drop) visual en el futuro.

### Arquitectura de Secciones del Sidebar:

1.  **⭐ FAVORITOS (Sección Anclada)**
    *   *UX*: Una zona superior donde el usuario arrastra o marca con una estrella sus 3 o 4 vistas recurrentes (ej. Noticias, Asistente AI, Leads).
2.  **📄 PÁGINAS DEL SITIO (Estructura de Presentación)**
    *   *Rutas*: Inicio (`/admin/editorial`), Soluciones (`/admin/soluciones`), Sectores (`/admin/sectors`), Academia (`/admin/escuela`), Casos de Éxito (`/admin/casos`), Partners (`/admin/partners`), Convenios (`/admin/convenios`), Clientes (`/admin/clientes`).
3.  **📰 CONTENIDO (CMS & Media)**
    *   *Rutas*: Noticias (`/admin/noticias`), Hero Studio (`/admin/editorial`), Biblioteca Multimedia (`/admin/media`).
4.  **💼 NEGOCIO (CRM & Growth)**
    *   *Rutas*: Leads (`/admin/leads`), Inbox, Campañas (`/admin/newsletter/campaigns`), Newsletter (`/admin/newsletter`), Conversaciones IA (`/admin/asistente`).
5.  **🤖 INTELIGENCIA (Insights y Telemetría)**
    *   *Rutas*: Asistente AI (`/admin/asistente`), RAG Status, Insights, Analytics IA.
6.  **⚙️ SISTEMA (Configuración & Infraestructura)**
    *   *Rutas*: Navegación (`/admin/navegacion`), Equipo (`/admin/equipo`), SMTP (`/admin/newsletter/settings`), Configuración, Logs de Sistema.

---

## 4. Nuevos Componentes a Crear y Componentes a Modificar

### A. Nuevos Componentes (UI/UX)
1.  `FavAnchor.tsx` [NEW]:
    *   *Ruta*: `src/components/admin/ui/FavAnchor.tsx`
    *   *Función*: Renderizador visual de accesos rápidos en la parte superior del sidebar con soporte visual de hover e indicador estrella animado.
2.  `WorkspaceWidgetShell.tsx` [NEW]:
    *   *Ruta*: `src/components/admin/ui/WorkspaceWidgetShell.tsx`
    *   *Función*: Tarjeta premium con diseño translúcido, acentos en violeta/cian y bordes dinámicos que envuelve a todos los widgets del nuevo espacio de trabajo.
3.  `CommandPalette.tsx` [NEW]:
    *   *Ruta*: `src/components/admin/ui/CommandPalette.tsx`
    *   *Función*: Menú superpuesto modal (`⌘K`) con buscador funcional que indexa las 20 rutas administrativas de forma inmediata.

### B. Componentes a Modificar
1.  `Sidebar.tsx` [MODIFY]:
    *   *Ruta*: `src/components/admin/Sidebar.tsx`
    *   *Función*: Reestructurar la navegación plana a la nueva segmentación en 5 dominios y la sección superior de Favoritos. Añadir clases visuales preparatorias de Drag & Drop (`cursor-grab active:cursor-grabbing hover:bg-gray-50/50`).
2.  `AdminLayoutShell.tsx` [MODIFY]:
    *   *Ruta*: `src/components/admin/ui/AdminLayoutShell.tsx`
    *   *Función*: Incorporar la visualización del buscador `CommandPalette` en el layout general e implementar transiciones de salida/entrada suaves (`AnimatePresence` de framer-motion) al cambiar de página.
3.  `DashboardGrid.tsx` [MODIFY]:
    *   *Ruta*: `src/components/admin/DashboardGrid.tsx`
    *   *Función*: Migrar el dashboard a "Mi Espacio de Trabajo" con los 6 widgets modulares definidos: Leads calientes, Noticias pendientes, Actividad reciente, IA, Campañas y Estado del sistema.

---

## 5. Wireframes ASCII de Alta Fidelidad

### Wireframe 1: Sidebar Táctico Ideal con Sección Favoritos (Drag & Drop Ready)

```
+-----------------------------------------------------------+
| [=] PARTNERS IA CONSOLE               [⌘K Command Search] |
+-----------------------------------------------------------+
| ⭐ FAVORITOS                                               |
|  (star) Noticias CMS                            (drag_dot)|
|  (star) Asistente AI Leads                      (drag_dot)|
|                                                           |
| 📄 PÁGINAS DEL SITIO                                      |
|  [page] Inicio                                  (drag_dot)|
|  [page] Soluciones                              (drag_dot)|
|  [page] Sectores                                (drag_dot)|
|  [page] Academia                                (drag_dot)|
|  [page] Casos de Éxito                          (drag_dot)|
|                                                           |
| 📰 CONTENIDO                                              |
|  [file] Noticias                                (drag_dot)|
|  [play] Hero Studio                             (drag_dot)|
|  [image] Biblioteca Multimedia                  (drag_dot)|
|                                                           |
| 💼 NEGOCIO                                                |
|  [user] Leads                                   (drag_dot)|
|  [mail] Campañas                                (drag_dot)|
|                                                           |
| 🤖 INTELIGENCIA                                           |
|  [bot] Asistente AI                             (drag_dot)|
|  [zap] RAG Status          (cían glow: Online)  (drag_dot)|
|                                                           |
| ⚙ SISTEMA                                                 |
|  [tool] Configuración                           (drag_dot)|
+-----------------------------------------------------------+
```

### Wireframe 2: Dashboard "Mi Espacio de Trabajo" con Estilo "Más Aire / Menos Ruido"

```
=============================================================================================
 MI ESPACIO DE TRABAJO                                           ( AI Status: Syncing [v] )
=============================================================================================

  +---------------------------------------+  +---------------------------------------------+
  | (bot) ASISTENTE AI INSIGHTS           |  | (user) LEADS CALIENTES                      |
  |                                       |  |                                             |
  | "8 leads calientes calificados hoy.   |  |  Andrés Gómez  -  Empresa RAG   - [Zap: TOP]|
  |  El sector Retail muestra un 87%      |  |  Sofía Silva   -  Webinar AI    - [Zap: TOP]|
  |  de incremento de consultas."         |  |                                             |
  |                        [ Ver Insights]|  |                         [ Ir a Bandeja Leads]|
  +---------------------------------------+  +---------------------------------------------+

  +---------------------------------------+  +---------------------------------------------+
  | (file) NOTICIAS PENDIENTES            |  | (mail) CAMPAÑAS RECIENTES                   |
  |                                       |  |                                             |
  |  [Borrador] "El futuro de las pymes"  |  |  Newsletter Semanal Mayo v2                 |
  |  [Borrador] "RAG con PostgreSQL"      |  |  Enviada a: 450 suscriptores  -  Open: 74%  |
  |                                       |  |                                             |
  |                       [ Abrir Editor]  |  |                            [ Ver Campañas]  |
  +---------------------------------------+  +---------------------------------------------+

  +---------------------------------------+  +---------------------------------------------+
  | (activity) ACTIVIDAD RECIENTE         |  | (system) ESTADO SISTEMA                     |
  |                                       |  |                                             |
  |  - Lead de IA registrado - hace 2m    |  |  Hostinger SMTP Server  : ONLINE   (cian)   |
  |  - Noticia publicada - hace 1h        |  |  Neon Database Server   : ONLINE   (cian)   |
  |  - Sincronización RAG - hace 4h       |  |  Telegram API Gateway   : ONLINE   (cian)   |
  +---------------------------------------+  +---------------------------------------------+
```

---

## 6. Archivos Afectados en la Implementación

Para asegurar que ningún otro archivo del repositorio sea modificado involuntariamente, listamos los únicos archivos que se verán afectados por los cambios visuales y de UX:

```
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/Sidebar.tsx
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/AdminLayoutShell.tsx
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/AdminInfrastructure.css
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/app/admin/(dashboard)/dashboard/page.tsx
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/app/admin/(dashboard)/layout.tsx
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/DashboardModules.tsx
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/DashboardGrid.tsx

[NEW]     /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/FavAnchor.tsx
[NEW]     /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/WorkspaceWidgetShell.tsx
[NEW]     /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/CommandPalette.tsx
```

---

## 7. Orden Exacto de Ejecución

Para realizar los cambios con la máxima seguridad operativa y de manera incremental, seguiremos esta secuencia:

```
+-----------------------------------------------------------------------------------+
| PASO | ACCIÓN DE IMPLEMENTACIÓN                  | OBJETIVO                       |
+------+-------------------------------------------+--------------------------------+
|  1   | Crear AdminInfrastructure.css (Reset UI)  | Reset de clases y estilos core |
|  2   | Crear FavAnchor & WorkspaceWidgetShell    | Generar nuevos bloques base    |
|  3   | Crear CommandPalette (Cmd+K)              | Sistema de búsqueda global     |
|  4   | Refactor de Sidebar.tsx                   | Nueva navegación y Favoritos   |
|  5   | Refactor de AdminLayoutShell.tsx          | Inserción de paleta y barra   |
|  6   | Refactor de dashboard/page.tsx            | Espacio de Trabajo + Widgets   |
|  7   | Compilación de Producción (npm run build)  | Verificación de compilado      |
+-----------------------------------------------------------------------------------+
```

---

## 8. Plan de Rollback (Plan de Contingencia y Seguridad)

Para blindar la integridad del proyecto en caso de cualquier comportamiento inesperado o error de compilación, adoptaremos el siguiente protocolo de restauración inmediata:

1.  **Creación de SAFEPOINT en Git antes de iniciar**:
    *   Se registrará un commit temporal o una etiqueta física de estado en Git antes de tocar cualquier línea de código:
        ```bash
        git status
        git checkout -b feature/control-center-os-phase1
        ```
2.  **Aislamiento y Restauración de Archivo Único**:
    *   Si un archivo modificado causa un error de linter o lógicas, se restablecerá individualmente a su estado original de baseline mediante checkout:
        ```bash
        git checkout -- src/components/admin/Sidebar.tsx
        ```
3.  **Rollback Completo e Instantáneo**:
    *   Si se decide cancelar toda la implementación y regresar al estado original estable del backoffice sin dejar residuos de código:
        ```bash
        git checkout main
        git branch -D feature/control-center-os-phase1
        ```
    *   Esto garantizará la restauración al 100% de la versión operativa anterior de manera inmediata.
