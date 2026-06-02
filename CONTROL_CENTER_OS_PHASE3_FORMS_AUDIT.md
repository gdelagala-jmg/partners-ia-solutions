# CONTROL CENTER FORMS — AUDITORÍA ESTRATÉGICA Y PLAN DE DISEÑO (FASE 3)

Este documento contiene la auditoría visual y de experiencia de usuario (UX/UI) para los formularios principales del entorno de administración de **Partners IA**: el creador/editor de Noticias (`NewsForm`) y el catálogo de Capacidades Tecnológicas (`SolutionForm`). 

El objetivo es establecer la hoja de ruta y la arquitectura de diseño para la **Fase 3: Control Center Forms**, transformando estas interfaces en flujos operativos premium con "mucho aire", alta usabilidad táctil y cero fatiga mental, sin alterar la capa del backend (APIs y esquemas de base de datos).

---

## 1. ANÁLISIS Y ESTADO ACTUAL

### 1.1 NewsForm (Noticias & Artículos)
Formulario con 14 campos estructurados que maneja el ciclo de vida editorial y cuenta con mecanismos inteligentes como el "Auto-Mapeo IA".

*   **Campos Actuales**: `title`, `slug`, `content` (editor enriquecido), `category`, `tags`, `aiType`, `businessArea`, `sector`, `profession`, `aiTool`, `company`, `coverImage`, `podcastAudioUrl`, `published`, `publishedAt`.
*   **Problemas de UX / Carga Cognitiva**:
    1.  **Sobrecarga en Sidebar**: La columna de la derecha (sidebar) está saturada. Expone simultáneamente la visibilidad pública, la fecha programada, las categorías en forma de chips, las etiquetas, la subida de portada, el audio del podcast, el botón de Auto-Mapeo IA y 6 dropdowns complejos de clasificación de IA.
    2.  **Rígidez de Contenedores**: El editor de cuerpo de texto (`react-quill-new`) tiene una altura estática que no se adapta al tamaño del monitor, provocando un scroll incómodo sobre la columna principal.
    3.  **Visualización en Móvil**: Al pasar a una sola columna en móviles de 390px, el formulario se transforma en una "tira" infinita de más de 4,000px de scroll. Los chips y etiquetas envueltos saturan el espacio visual.
    4.  **Inconsistencia de Inputs**: Coexisten dropdowns personalizados con inputs nativos y zonas de drag-and-drop de imagen que no comparten radios de curvatura ni micro-sombras comunes.

### 1.2 SolutionForm (Catálogo de Soluciones & Labs)
Formulario masivo centrado en especificaciones técnicas de producto con relaciones lógicas a sectores.

*   **Campos Actuales**: `title`, `slug`, `description`, `type`, `multimedia`, `functionalDescription`, `problemsSolved`, `capabilities`, `ctaUrl`, `published`, `featured`, `featuredOrder`, `sectorIds` (array), `gallery` (array de imágenes dinámicas).
*   **Problemas de UX / Carga Cognitiva**:
    1.  **"Pared de Texto" Temible**: La columna central expone simultáneamente cuatro áreas de texto gigante (`description`, `functionalDescription`, `problemsSolved`, `capabilities`). Esto intimida al usuario y dificulta la revisión rápida.
    2.  **Lista Dinámica de Galería Desorganizada**: El listado de imágenes (`galleryFields`) renderiza inputs largos para la URL, el SEO Alt y checkboxes en formato flex horizontal. En pantallas medianas y móviles, estas filas se quiebran de forma desordenada, y el botón de borrado (`Trash2`) queda desalineado.
    3.  **Falta de Consistencia con NewsForm**: No ofrece ayudas automáticas de texto ni presets de categorización rápida, a pesar de compartir el mismo ecosistema operativo del Control Center.
    4.  **Gestión de Sectores Compleja**: El selector de sectores obliga a renderizar píldoras interactivas directamente mezcladas en el sidebar lateral, consumiendo valioso espacio útil para los botones de guardado.

---

## 2. PROPUESTA DE DISEÑO & WIREFRAMES CONCEPTUALES

Para resolver la fatiga de scroll y la densidad de información, proponemos migrar ambos formularios a una **Arquitectura de Pestañas Locales (Local Form Tabs)** respaldada por una **Barra de Acciones Fija (Sticky Action Bar)** inferior.

### 2.1 Wireframe Desktop (1440px)
El formulario de Soluciones segmenta los campos en 3 pestañas lógicas. Los botones de acción se fijan en el bottom para estar siempre al alcance del ratón.

```
┌────────────────────────────────────────────────────────────────────────┐
│  [Command Center] > Editar Solución: "Análisis Predictivo de Ventas"   │
├────────────────────────────────────────────────────────────────────────┤
│  [ General ]   [ Detalles Técnicos ]   [ Galería y Sectores ]          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─ Identidad Básica ────────────────┐ ┌─ Visibilidad y Destaque ────┐ │
│  │ * Título de la Solución           │ │ [x] Publicado Online        │ │
│  │ [ Análisis Predictivo de Ventas ] │ │ [ ] Destacar en Portada     │ │
│  │                                   │ │                             │ │
│  │ * Slug (Identificador URL)        │ │ * Prioridad de Destaque     │ │
│  │ [ analisis-predictivo-de-ventas ] │ │ [ Automático          [v] ] │ │
│  │                                   │ └─────────────────────────────┘ │
│  │ * Resumen Comercial (Valor)       │ ┌─ Enlaces Rápidos ───────────┐ │
│  │ [ Explica brevemente el retorno   │ │ * Call To Action            │ │
│  │   de inversión de esta app...    ]│ │ [ https://partnersia.com/.. ]│ │
│  │                                   │ └─────────────────────────────┘ │
│  └───────────────────────────────────┘                                 │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  [ Cancelar ]                                   [ Actualizar Solución ]│
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Wireframe Tablet (1024px)
La interfaz pasa a 1 sola columna. Las cajas de formulario se ensanchan al 100% y se prioriza la visualización táctil. Las pestañas se convierten en un carrusel deslizable horizontalmente.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Editar Solución: "Análisis Predictivo de Ventas"                      │
├────────────────────────────────────────────────────────────────────────┤
│  [ General ]  ( Detalles Técnicos )  ( Galería y Sectores )   [>]      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─ Identidad Básica ────────────────────────────────────────────────┐ │
│  │ * Título de la Solución                                           │ │
│  │ [ Análisis Predictivo de Ventas                                 ] │
│  │                                                                   │ │
│  │ * Resumen Comercial (Valor)                                       │ │
│  │ [ Explica brevemente el retorno de inversión de esta app...     ] │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌─ Visibilidad y Enlaces ───────────────────────────────────────────┐ │
│  │ [x] Publicado Online           [ ] Destacar en Portada            │ │
│  │ * Call To Action                                                  │ │
│  │ [ https://partnersia.com/soluciones/analisis-predictivo         ] │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  [ Cancelar ]                                   [ Actualizar Solución ]│
└────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Wireframe Móvil (390px)
El scroll horizontal se elimina por completo. La navegación superior se realiza mediante un selector tipo pastilla flotante compacta. Los textareas reducen su número de filas iniciales y crecen dinámicamente con el texto.

```
┌──────────────────────────────────────┐
│  [<] Editar Solución                 │
├──────────────────────────────────────┤
│  [ Gral. ] [ Detalles ] [ Galería ]  │
├──────────────────────────────────────┤
│                                      │
│  * Título de la Solución             │
│  [ Análisis Predictivo de Ventas  ]  │
│                                      │
│  * Resumen Comercial                 │
│  [ Explica brevemente el retorno ]   │
│                                      │
│  * Clasificación                     │
│  [ Solución Final                [v]]│
│                                      │
│  [x] Publicado Online                │
│  [ ] Destacar en Portada             │
│                                      │
├──────────────────────────────────────┤
│  [ Cancelar ]            [ GUARDAR ] │
└──────────────────────────────────────┘
```

---

## 3. AGRUPACIÓN IDEAL DE CAMPOS

Para lograr una densidad visual equilibrada en la Fase 3, se implementará la siguiente reorganización en pestañas locales dentro de los formularios:

### 3.1 Agrupación de NewsForm
1.  **Pestaña 1: Editorial (Contenido y Portada)**
    *   `title` y `slug` (con autogeneración).
    *   `content` (Editor enriquecido interactivo + Selector Visual/HTML).
    *   `coverImage` (Zona Drag & Drop premium e intuitiva).
2.  **Pestaña 2: IA Insight & Categorías**
    *   *Auto-Mapeo IA* (Botón de detonador principal).
    *   *Metadata de IA*: Empresa (`company`), Herramienta (`aiTool`), Tipo (`aiType`), Área (`businessArea`), Sector (`sector`), Profesión (`profession`).
    *   *Taxonomía*: Chips de `categories` y `tags`.
3.  **Pestaña 3: Configuración y Fechas**
    *   `published` (Checkbox con estado visual encendido/apagado).
    *   `publishedAt` (Fecha de publicación programada).
    *   `podcastAudioUrl` (Enlace de distribución de audio de Spotify).

### 3.2 Agrupación de SolutionForm
1.  **Pestaña 1: Datos de Mercado (General)**
    *   `title`, `slug` y `type` (Solución vs Prototipo Lab).
    *   `description` (Resumen comercial de alto nivel).
    *   `ctaUrl` (Enlace del Call to Action de ventas).
    *   `published`, `featured` y `featuredOrder` (Visibilidad y destaques estables).
2.  **Pestaña 2: Especificaciones Técnicas**
    *   `functionalDescription` (Descripción del flujo de integración técnica).
    *   `problemsSolved` (Puntos de dolor y retos específicos superados).
    *   `capabilities` (Capacidades clave y ventajas tecnológicas).
3.  **Pestaña 3: Galería & Sectores**
    *   `gallery` (Rejilla compacta de imágenes con previews instantáneas, inputs reducidos de SEO Alt y flags de principal).
    *   `multimedia` (Recurso fallback).
    *   `sectorIds` (Píldoras interactivas de asignación rápida y creador de nuevos sectores *inline*).

---

## 4. COMPONENTES CLAVE A IMPLEMENTAR (CANDIDATOS FASE 3)

1.  **`AdminFormTabs`**: Controlador de pestañas de alta velocidad, con transiciones CSS suaves (`opacity` y `translate`) que segmenta visualmente el formulario sin alterar los estados de React Hook Form.
2.  **`StickyActionBar`**: Barra fija en el borde inferior con efecto glassmorphism (`backdrop-blur` y bordes traslúcidos) para anclar los botones "Guardar" y "Cancelar", asegurando consistencia móvil y de escritorio.
3.  **`PremiumUploadZone`**: Rediseño de la zona de subida con indicador de progreso animado, bordes redondeados `rounded-2xl` estilo mando operativo, y previsualización escalable.
4.  **`CompactGalleryManager`**: Componente modular para `gallery` que renderiza una lista densa con diseño tipo tabla en desktop y tarjetas horizontales compactas en móviles.

---

## 5. ARCHIVOS AFECTADOS

*   **[NewsForm.tsx](file:///Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/NewsForm.tsx)**: Refactor visual del layout, segmentación de secciones en pestañas locales y reordenación de la barra de acciones.
*   **[SolutionForm.tsx](file:///Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/SolutionForm.tsx)**: Refactor del grid principal a pestañas, unificación visual de cajas de especificaciones técnicas y listados dinámicos de galería.
*   **[AdminInfrastructure.css](file:///Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/AdminInfrastructure.css)**: Creación de selectores táctiles para pestañas, animaciones de entrada (`animate-fade-in`), y clases para la barra adhesiva (`.admin-sticky-bar`).

---

## 6. RIESGOS Y PLAN DE MITIGACIÓN

| Riesgo Detectado | Consecuencia Potencial | Plan de Mitigación |
| :--- | :--- | :--- |
| **Pérdida de Datos en Pestañas Ocultas** | Si una pestaña no está en el DOM, los valores de sus inputs podrían desvincularse del formulario al hacer el submit. | **Preservación en Memoria**: Los componentes no se desmontarán físicamente con condicionales `{activeTab === ...}`. En su lugar, se gestionará su visibilidad utilizando Tailwind CSS (`hidden` o `absolute pointer-events-none opacity-0`), manteniendo los inputs registrados en React Hook Form. |
| **Sincronización del Editor Quill** | El editor de rich text puede perder el foco o el contenido si se aplican transiciones complejas. | **Foco Protegido**: El editor principal se mantendrá como un elemento estático de primer nivel en la pestaña de Contenido, protegiendo su estado interno de inicialización de Quill. |
| **Subida Dinámica Concurrentes** | En la galería de imágenes, subir múltiples archivos simultáneamente puede saturar el puerto de red o causar fallos de sesión. | **Semáforo de Carga**: Se deshabilitarán el resto de botones de subida mientras una imagen esté en estado `uploadingImage` en el formulario. |

---

## 7. PLAN DE EJECUCIÓN INCREMENTAL

### Paso 1: Foundation (Visual & Common Components)
Crear los estilos y clases de contención en `AdminInfrastructure.css`. Diseñar `AdminFormTabs` y `StickyActionBar` aislados para validar que no impacten en otras rutas.

### Paso 2: Refactor de NewsForm (Fase 3A)
Aplicar la estructura de pestañas a `NewsForm`. Validar la correcta ejecución de `analyzeContent` (Auto-Mapeo IA) desde cualquiera de las vistas de pestaña. Ejecutar compilación para certificar la integridad.

### Paso 3: Refactor de SolutionForm (Fase 3B)
Implementar pestañas locales, rejilla de galería compacta e interactores de sectores en `SolutionForm`. Comprobar subida múltiple e inserción dinámica de nuevos sectores.

### Paso 4: QA Responsivo Riguroso
Validación exhaustiva de usabilidad táctil, comportamiento de pestañas e inputs en terminales móviles de 320px, 390px, 768px, 1024px y ordenadores 1440px.

---

## 8. PROTOCOLO DE ROLLBACK (RETROCOMPATIBILIDAD)

Toda modificación de formularios se realizará en una rama específica: `feature/control-center-forms`.
En caso de cualquier anomalía detectada en producción o inestabilidad durante las pruebas de usuario, el protocolo de recuperación es:

1.  **Cero Migraciones Involucradas**: Como no se alteran esquemas de Prisma ni modelos de base de datos, el rollback es inmediato a nivel de código Git.
2.  **Restauración Rápida**:
    ```bash
    git checkout master src/components/admin/NewsForm.tsx src/components/admin/SolutionForm.tsx
    ```
    Esto descarta instantáneamente los refactors de las pestañas visuales y restaura la visualización de una sola pieza original sin pérdidas de información.
