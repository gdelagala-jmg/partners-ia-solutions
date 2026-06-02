# PROJECT GUARDIAN PRE-FLIGHT CHECK INITIATED
# AUDITORÍA DE EXPERIENCIA DE USUARIO (UX), DISEÑO RESPONSIVO Y PLAN DE REDISEÑO
## ENTORNO ADMINISTRATIVO — PARTNERS IA SOLUTIONS

Este informe documenta el estado actual del panel administrativo de **Partners IA**, sus fortalezas visuales, inconsistencias identificadas, patrones adaptativos recomendados y un plan de ejecución seguro en tres fases para consolidar una experiencia de usuario del más alto nivel premium (al estilo Apple/Tesla), sin perturbar en absoluto la base de datos ni la lógica de negocio subyacente.

---

## 1. Inventario de Rutas Administrativas y Módulos Detectados

El backoffice de **Partners IA** cuenta con un total de 20 rutas y subrutas operativas que conforman el centro de control del ecosistema digital. Se ha auditado el propósito y el estado UX de cada una:

| Ruta de Acceso | Nombre del Módulo | Propósito y Funcionalidad del Módulo | Estado UX/UI Actual | Riesgo Adaptativo / Responsive |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/login` | **Admin Console Login** | Acceso seguro del administrador. | **Excelente**: Muy limpio, animación de entrada suave. | **Bajo**: Totalmente optimizado. |
| `/admin/dashboard` | **Panel de Control** | Resumen analítico y métricas operativas con cuadrícula personalizable por Drag & Drop (D&D). | **Bueno**: Usa `dnd-kit`, pero el control táctil móvil puede tener latencia. | **Medio**: Rediseño de rejilla D&D en 320px. |
| `/admin/editorial` | **Hero Studio** | Gestión de portadas, carruseles principales y layouts destacados de la web. | **Bueno**: Formularios densos. | **Medio**: Colapso de campos a una sola columna. |
| `/admin/asistente` | **Asistente AI Leads** | Monitor de contactos e insights de negocio generados por el agente conversacional inteligente. | **Excelente**: Muy interactivo, indicadores de sentimiento (heart/zap) excelentes. | **Bajo**: Ya incorpora soporte adaptativo a tarjetas. |
| `/admin/sectors` | **Sectores** | Gestión de sectores empresariales cubiertos por la empresa. | **Estable**: Usa tablas clásicas. | **Bajo**: Tablas con fallback móvil. |
| `/admin/clientes` | **Clientes** | Registro de clientes del portafolio. | **Estable**: Gestión básica de logos e información. | **Bajo**: Tablas tradicionales. |
| `/admin/partners` | **Partners** | Gestión de socios estratégicos y nivel de integración. | **Estable**: Formularios estándar. | **Bajo**: Formulario plano. |
| `/admin/navegacion` | **Navegación** | Reordenación de elementos de menú del sitio público mediante arrastrar y soltar. | **Funcional**: Pantalla simple con D&D. | **Medio**: Comportamiento táctil en tablets. |
| `/admin/apps` | **Aplicaciones** | Control de aplicaciones integradas y SaaS habilitados. | **Bueno**: Vista de grid simple. | **Bajo**: Grid autoadaptativo. |
| `/admin/soluciones` | **Soluciones** | Catálogo de soluciones tecnológicas avanzadas. | **Denso**: Formulario de gran longitud con pestañas y descripciones detalladas. | **Medio**: Los tabs de edición pueden amontonarse en móvil. |
| `/admin/escuela` | **Academia** | Registro y control de cursos de formación y webinars. | **Estable**: Formularios y listas. | **Bajo**: Estructura limpia. |
| `/admin/noticias` | **CMS de Noticias** | Publicador de artículos de blog, noticias de actualidad e integración SEO. | **Complejo**: Es el módulo con mayor densidad de datos del panel. | **Alto**: La tabla es extremadamente ancha y el formulario de creación tiene campos múltiples. |
| `/admin/newsletter` | **Audiencia** | Registro de suscriptores y base de contactos. | **Bueno**: Gestión simple. | **Bajo**: Listado clásico. |
| `/admin/newsletter/campaigns` | **Campañas** | Diseñador y despachador de correos masivos a la audiencia. | **Funcional**: Historial de envíos. | **Medio**: El editor de plantillas puede verse recortado. |
| `/admin/newsletter/settings` | **Newsletter Config** | Parámetros del servidor de salida de correo (SMTP). | **Crítico**: Configuración técnica. | **Bajo**: Formulario de campos simples. |
| `/admin/leads` | **Mensajes** | Bandeja de entrada de formularios de contacto públicos. | **Bueno**: Vista de listado. | **Bajo**: Listado adaptativo. |
| `/admin/equipo` | **Equipo** | Gestión de perfiles del equipo y roles internos. | **Estable**: Subida de fotos y biografías. | **Bajo**: Formularios estándar. |
| `/admin/casos` | **Casos Éxito** | Portafolio de proyectos exitosos documentados. | **Bueno**: Campos de texto estructurado. | **Bajo**: Estilo estándar. |
| `/admin/media` | **Biblioteca Media** | Gestor de recursos estáticos de imágenes y ficheros vinculados al servidor. | **Estable**: Grid de recursos. | **Medio**: Ajuste de columnas en pantallas medianas. |
| `/admin/convenios` | **Convenios** | Administración de acuerdos de colaboración y convenios oficiales. | **Estable**: Formulario clásico. | **Bajo**: Campos limpios. |

### Inconsistencias y Puntos Críticos Detectados:
1. **Falta de homogeneidad en componentes de tabla**: Mientras que algunos listados usan el nuevo `AdminTable` con soporte de tarjetas móviles automático, otros siguen usando tablas nativas que causan desbordamiento (`overflow-x`) en pantallas inferiores a 768px.
2. **Amontonamiento de barras de herramientas (Toolbars)**: Los botones de acción como *"Sincronizar"*, *"Importar"* y *"Nuevo Registro"* carecen de una barra común responsiva, colocándose uno encima de otro en dispositivos móviles pequeños.
3. **Densidad excesiva en formularios complejos**: Componentes como `NewsForm` y `SolutionForm` saturan el espacio en tablets al forzar rejillas CSS rígidas de múltiples columnas que distorsionan los campos de texto e inputs.
4. **Drag & Drop táctil**: Los módulos `/admin/dashboard` y `/admin/navegacion` no detectan correctamente las interacciones de deslizamiento nativo (swipe/drag) en navegadores móviles Safari/Chrome de iOS/Android, provocando bloqueos de pantalla.

---

## 2. Arquitectura Visual Actual

El panel administrativo actual adopta un lenguaje minimalista premium inspirado en el diseño industrial de Apple y Tesla:

*   **Layout General**: Diseñado sobre un contenedor de dos paneles: un sidebar lateral semi-translúcido (`backdrop-blur-xl`) y una zona principal de trabajo protegida contra desbordamientos mediante la clase `admin-safe-container`.
*   **Sidebar / Navegación**: Barra lateral estilizada con esquinas redondeadas extremas (`rounded-xl` / `2xl`), iconos limpios de `lucide-react` y un estado activo elegante de color azul intenso (`#007AFF`) que proyecta un brillo difuminado sutil.
*   **Superficies y Cards**: Los módulos se apoyan en tarjetas que simulan vidrio esmerilado (`glassmorphism` con `bg-white/70 backdrop-blur-xl border-white/40`) de excelente factura y contraste.
*   **Tipografía y Jerarquía**: La combinación de la fuente geométrica moderna **Outfit** para encabezados de página e **Inter** para bloques de datos establece una lectura fluida y de altísima gama.
*   **Estados Vacíos y Badges**: Los estados sin información utilizan ilustraciones icónicas discretas con textos en mayúscula de espaciado ancho (`tracking-widest`), aportando un look ordenado y sofisticado.

---

## 3. Diferenciación respecto al Frontend Público

Actualmente, **Partners IA** mantiene dos identidades visuales diferenciadas, lo cual es óptimo para evitar confusiones de rol, pero existen oportunidades críticas para acentuar y proteger esta separación:

| Dimensión | Frontend Público (Sitio del Cliente) | Backoffice Administrativo (Consola Interna) |
| :--- | :--- | :--- |
| **Público Objetivo** | Clientes, leads, socios comerciales externos. | Administradores, editores y analistas internos. |
| **Dirección Estética** | Corporativa, inspiracional, con espaciados abiertos, gráficos orgánicos y flujos orientados a la conversión. | Herramienta operativa densa, limpia, tipo "consola de comando", estructurada para operaciones veloces. |
| **Paleta de Colores** | Degradados azules y blancos brillantes con secciones oscuras en pie de página. | Fondo gris neutro muy claro (`#F5F5F7`), tarjetas blancas con relieve, detalles en negro sólido y acentos azules del sistema. |
| **Tipografía** | Enfoque en marketing visual mediante titulares de gran tamaño y cuerpo de texto espaciado. | Enfoque analítico mediante datos compactos, textos en mayúsculas pequeñas para etiquetas e iconos funcionales. |

### Propuesta de Separación y Aislamiento Visual Estricto:
1.  **Firma del Entorno en la Pestaña**: Estandarizar el título de la página en el navegador para todas las rutas administrativas añadiendo el sufijo `[Consola Admin]` (ej. *Dashboard [Consola Admin] — Partners IA*).
2.  **Paleta Monocromática de Control**: Utilizar tonos más oscuros y neutros en los elementos estructurales primarios del admin (como los botones de acción principal en negro plano `#1D1D1F` y grises de control `#868686`), dejando el azul solo para interacciones de confirmación.
3.  **Evitar Transferencia de CSS**: Encapsular todas las reglas experimentales de estilo en `AdminInfrastructure.css` e importarlas exclusivamente en `AdminLayoutShell.tsx` para garantizar que ningún estilo del backoffice contamine la renderización del sitio público.

---

## 4. UX Responsive y Adaptativa (Mobile-First Seguro)

El comportamiento de la consola administrativa varía según el tamaño de la pantalla, demandando soluciones adaptativas que no rompan la estructura actual:

### 1. Comportamiento por Breakpoint:
*   **Pantallas Grandes (>1200px)**: Excelente aprovechamiento del espacio. El sidebar está fijo y el espacio de trabajo se limita a una anchura máxima de `1600px` para evitar que las tablas se estiren desproporcionadamente en pantallas Ultrawide.
*   **Tablets (768px - 1024px)**: El sidebar se oculta automáticamente. Sin embargo, las tablas complejas y los formularios de dos columnas sufren estrechamiento extremo de campos, dificultando la lectura.
*   **Móviles (320px - 767px)**: El sidebar se convierte en un menú colapsable de pantalla completa. Los listados cambian a una vista de tarjetas individuales muy cómoda, pero las cabeceras y acciones múltiples del toolbar colisionan por falta de espacio vertical.

### 2. Patrones Mobile-First Propuestos para el Rediseño Seguro:
*   **Toolbar Responsivo Colapsable**: En pantallas móviles, el toolbar principal agrupará el botón de acción principal e integrará los botones secundarios (Exportar, Filtros, Ajustes) dentro del menú contextual de tres puntos `AdminActionMenu`.
*   **Formularios de Flujo Vertical Progresivo**: En pantallas inferiores a `1024px`, los formularios con rejillas complejas pasarán a una distribución estricta de una sola columna, con espaciado de entrada incrementado (`py-3` a `py-4`) para facilitar la pulsación táctil.
*   **Modales Adaptativos con Altura Máxima**: Todo modal de edición en móvil tendrá configurado un `max-h-[85vh]` con `overflow-y-auto` y cabeceras fijas para evitar que los botones de confirmación queden ocultos fuera de la pantalla.

---

## 5. Matriz de Riesgos Técnicos

El rediseño visual del entorno administrativo debe implementarse cuidando que no haya regresiones operativas. Clasificamos las acciones según su nivel de riesgo:

| Acción de Rediseño | Tipo de Cambio | Nivel de Riesgo | Impacto Funcional | Estrategia de Mitigación Segura |
| :--- | :--- | :--- | :--- | :--- |
| **Estandarizar colores y tipografía de control** | Estilos CSS | **Bajo** | Ninguno. Solo afecta apariencia. | Utilizar las variables globales ya definidas en `--color-gray-*`. |
| **Migración de tablas nativas a `AdminTable`** | Reemplazo UI | **Medio** | Las tablas dinámicas deben renderizar los datos y sus acciones correctamente. | Sustituir el markup preservando exactamente las llamadas a las funciones de borrado, edición y sincronización actuales. |
| **Refactorización de formularios con `AdminFormShell`** | Reestructuración | **Medio** | Los formularios deben capturar y enviar todos los campos actuales de la API. | Mantener intactos los estados de React (`useState`), validaciones de cliente y la llamada final al `onSubmit`. |
| **Optimización de Drag & Drop de navegación y widgets** | Lógica de Gestos | **Alto** | Podría romperse la ordenación real de la base de datos o menús de navegación. | Testear los gestos en dispositivos reales mediante simulador; no alterar la comunicación del JSON con el endpoint `/api/admin/dashboard/config`. |

---

## 6. Plan de Rediseño de UI/UX Propuesto

Alineado con el enfoque premium de **Partners IA**, proponemos una nueva dirección visual basada en un layout limpio de alto rendimiento y la estandarización absoluta de componentes:

### 1. Nueva Identidad Visual Recomendada:
*   **Fondos y Superficies**: Contenedor principal en gris ultra-limpio `#F5F5F7`. Tarjetas de contenido en blanco absoluto con un borde fino de `#E8E8ED` y una sombra de profundidad imperceptible pero efectiva (`shadow-[0_8px_30px_rgb(0,0,0,0.02)]`).
*   **Detalles Premium**: Micro-borde superior translúcido en los botones y cabeceras que simula un biselado físico tridimensional de cristal.
*   **Micro-animaciones**: Transiciones de página y despliegue de menús utilizando `framer-motion` con la función de tiempo de resorte (*spring physics*) para simular una respuesta física real al hacer clic.

### 2. Estructura de Layout Profesional:
```
+--------------------------------------------------------+
|  LOGO  |   [Búsqueda Global...]      (Ajustes)  (Logout)|  <- Header de Control Superior
+--------+-----------------------------------------------+
| (Icon) |                                               |
| Dash   |   PANEL DE CONTROL                            |  <- AdminToolbar (Título + Acciones Condensadas)
| Notic  |   +---------------------------------------+   |
| AI     |   | [Métrica]  [Métrica]  [Métrica]       |   |
| Media  |   +---------------------------------------+   |
| Sectors|   |                                       |   |
| Leads  |   |    [AdminTable con Fallback a Cards]  |   |  <- Contenedor Seguro Responsivo
|        |   |                                       |   |
|        |   +---------------------------------------+   |
+--------+-----------------------------------------------+
```

### 3. Fases de Ejecución del Plan Seguro:

#### 🚀 FASE 1: Estandarización de Layout e Infraestructura (Capa de Contención)
*   **Objetivo**: Aislar el entorno y blindar la navegación lateral y el toolbar.
*   **Acciones**:
    1. Asegurar la consistencia de `AdminLayoutShell` en todas las páginas de `/admin/(dashboard)/*`.
    2. Adaptar la barra de herramientas responsiva `AdminToolbar` en todos los encabezados de sección.
    3. Asegurar que las acciones de los módulos principales (sincronizar, exportar, agregar) se gestionen a través del componente universal de tres puntos `AdminActionMenu`.
*   **Estado de Seguridad**: Cero riesgo de regresión de datos. Los endpoints no se modifican.

#### 🛠️ FASE 2: Adaptabilidad de Tablas y Listados CRUD (Capa de Datos)
*   **Objetivo**: Reemplazar todas las tablas estáticas por el componente adaptativo premium `AdminTable`.
*   **Acciones**:
    1. Identificar tablas rígidas en los módulos `/admin/noticias`, `/admin/leads`, `/admin/sectors` y `/admin/clientes`.
    2. Implementar para cada una el callback `renderMobileCard`, garantizando que en móviles los datos se muestren en formato de tarjetas apiladas de lectura vertical rápida.
    3. Mantener los mismos manejadores de eventos (Edit/Delete) sin tocar la lógica de los controladores del backend.

#### 📝 FASE 3: Refactorización de Formularios Complejos (Capa de Entrada)
*   **Objetivo**: Estandarizar formularios de alta densidad (`NewsForm`, `SolutionForm`, `PartnerSettingsForm`).
*   **Acciones**:
    1. Envolver los formularios complejos dentro de `AdminFormShell`.
    2. Modificar las estructuras de rejilla rígidas para que respondan dinámicamente: una sola columna en pantallas pequeñas/medianas y dos columnas en pantallas grandes.
    3. Asegurar los estados de carga con indicadores pulidos de guardado (`Loader2` animado), evitando envíos duplicados por doble pulsación.

---

## 7. Archivos Afectados, Exclusiones y Reglas de Seguridad

Para garantizar la integridad total del repositorio y la inmunidad del sistema ante fallos, se delimitan estrictamente las fronteras de código:

### 📂 Archivos Potencialmente Afectados (Solo UI/UX y Estilos):
*   `src/app/globals.css` (Añadir selectores específicos del admin si fuera necesario)
*   `src/components/admin/Sidebar.tsx` (Compactación de la navegación lateral)
*   `src/components/admin/ui/*` (Ajustes de espaciados, bordes y responsive en los componentes base)
*   `src/components/admin/NewsForm.tsx` (Refactorización a un layout dinámico de formulario)
*   `src/components/admin/SolutionForm.tsx` (Refactorización a un layout dinámico de formulario)
*   `src/app/admin/(dashboard)/**/page.tsx` (Sustitución de cabeceras y tablas antiguas por `AdminToolbar` y `AdminTable`)

### 🚫 Archivos que NO DEBEN TOCARSE Bajo Ninguna Circunstancia:
*   `prisma/schema.prisma` (Base de datos intocable)
*   `src/lib/db.ts` o cualquier conector de Prisma / Supabase / Neon RAG.
*   `src/app/api/**/route.ts` o controladores de backend que procesen lógica de negocio o APIs.
*   `src/middleware.ts` (Reglas de redirección de seguridad y cookies).
*   `src/app/(public)/**` (Cualquier ruta pública de visualización del cliente).

### 🔒 Reglas Críticas de Seguridad para la Futura Implementación:
1.  **Regla de Coexistencia Estricta**: No se borrará ningún componente antiguo hasta que la versión hardening de UI/UX esté completamente probada y aprobada por el usuario en modo local.
2.  **Verificación de Tipados en TypeScript**: Todo refactor de formulario debe conservar los tipos exactos de datos (`Props`, `Interfaces`) para evitar fallos durante el build de producción.
3.  **Prohibido Alterar Querys SQL o Métodos del ORM**: Se prohíbe añadir campos, alterar las llamadas a Prisma o modificar las funciones asíncronas de guardado. Los cambios se limitan rigurosamente al marcado HTML (TSX) y clases de CSS.
4.  **No Contaminación de CSS**: Queda prohibido añadir estilos al admin que afecten a clases globales compartidas con el frontend público. Todos los estilos del panel administrativo se mantendrán encapsulados en namespaces de CSS del admin (`.admin-*`).
