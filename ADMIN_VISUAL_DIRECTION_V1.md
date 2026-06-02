# PROJECT GUARDIAN PRE-FLIGHT CHECK INITIATED
# DIRECCIÓN VISUAL Y LENGUAJE DE DISEÑO (UI/UX)
## CONTROL CENTER OS — ENTORNO ADMINISTRATIVO DE PARTNERS IA

Este documento de dirección visual define tres propuestas estéticas completas y diferenciadas para el rediseño del entorno administrativo de **Partners IA**. Cada opción aborda la interfaz, la tipografía, la paleta cromática, el comportamiento adaptativo y la densidad de componentes para consolidar una experiencia digital premium.

---

# PROPUESTA A: Operational Control Center (Estilo Apple / Tesla Minimalist)

```
+---------------------------------------------------------------------------------------+
| PARTNERS IA   [ Buscar ⌘K ]                                (AI System: OK) [Perfil]   |
+---------------------------------------------------------------------------------------+
|  Dashboard     INICIO > DASHBOARD                                                     |
|  Soluciones                                                                           |
|  Noticias      +--------------------+  +--------------------+  +--------------------+ |
|  Leads         | LEADS TOTALES      |  | NOTICIAS ACTIVAS   |  | EFICACIA DEL RAG   | |
|  Media         | 45                 |  | 120                |  | 98.4%              | |
|  Ajustes       | +12% esta semana   |  | 2 en borrador      |  | Sincronizado       | |
|                +--------------------+  +--------------------+  +--------------------+ |
|  [Mantenimiento]                                                                      |
|  [Ver Web]     +--------------------------------------------------------------------+ |
|  [Cerrar]      | TABLA OPERATIVA DE LEADS                                           | |
|                | Nombre         Origen       Fecha        Prioridad       Estado    | |
|                | Carlos M.      Formulario   29 May 26    [Media]         (Nuevo)   | |
|                +--------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------+
```

### 1. Filosofía
Inspirado en la simplicidad de la interfaz de Apple y en los paneles de visualización industrial de Tesla. Centrado en la eficiencia operativa pura, con abundantes espacios en blanco, tipografía altamente legible, alto contraste y una densidad de información óptima sin distracciones visuales. Es un diseño limpio, plano y profesional que transmite orden e institucionalidad.

### 2. Paleta Cromática (Clara Premium)
*   **Fondo del Sistema**: Gris neutro ultra-claro `#F5F5F7`.
*   **Tarjetas y Superficies**: Blanco absoluto `#FFFFFF`.
*   **Bordes y Separadores**: Gris de control sutil `#E8E8ED`.
*   **Texto Primario**: Gris carbón oscuro `#1D1D1F`.
*   **Texto Secundario**: Gris medio `#86868B`.
*   **Acento de Interacción**: Azul Apple `#0071E3`.
*   **Indicadores de Estado**: Verde esmeralda `#34C759` (Éxito), Ámbar operativo `#FF9500` (Advertencia), Rojo coral `#FF3B30` (Alerta).

### 3. Tipografía
*   **Cuerpo de Texto y Datos**: `Inter` (sans-serif geométrica con gran legibilidad en tamaños pequeños).
*   **Encabezados y Títulos**: `Outfit` (fuente sans-serif moderna con terminaciones limpias que aporta carácter tecnológico).

### 4. Layout & Sidebar
*   **Layout**: Estructura limpia de dos columnas principales con un sidebar lateral de `w-64` y un panel central flexible que se ajusta hasta un máximo de `1600px` para evitar la deformación de tablas en pantallas ultra-panorámicas.
*   **Sidebar**: Fondo blanco con un micro-borde lateral de `#E8E8ED`. Los enlaces de navegación utilizan iconos finos de `lucide-react` en gris y cambian a azul sólido con una tipografía de peso semi-bold en el estado activo.

### 5. Dashboard & Cards
*   **Dashboard**: Cuadrícula modular limpia con amplios espaciados de `gap-6` (24px) y alineación perfecta de las tarjetas de métricas en la parte superior.
*   **Cards**: Esquinas redondeadas de `rounded-2xl` (16px), sombras muy tenues (`shadow-[0_4px_20px_rgba(0,0,0,0.02)]`) y bordes definidos de `1px` en `#E8E8ED`.

### 6. Formularios & Tablas
*   **Formularios**: Inputs con fondo `#F5F5F7` y bordes transparentes que al recibir foco cambian su fondo a blanco absoluto, aplicando un borde azul fino y una sombra suave de concentración (`ring-2 ring-blue-500/10`).
*   **Tablas**: Filas espaciadas con un alto de `py-5`, cabeceras en mayúsculas pequeñas de color `#86868B` y un efecto de hover en las filas que resalta ligeramente el fondo en `#F5F5F7`.

### 7. Estados Vacíos
*   Icono discreto en gris `#E8E8ED` en el centro de la pantalla, acompañado de un título en negrita de tamaño medio y una descripción explicativa clara en gris `#86868B`, sugiriendo un botón de acción principal justo debajo.

### 8. Adaptabilidad Responsive (Mobile, Tablet, Desktop)
*   **Mobile (320px - 767px)**: El sidebar se oculta por completo y se despliega como un menú lateral deslizante de pantalla completa al pulsar un menú hamburguesa flotante. Las tablas de datos cambian su diseño automáticamente a un formato de lista de tarjetas apiladas de lectura vertical rápida.
*   **Tablet (768px - 1024px)**: El sidebar se contrae de forma automática en una barra de iconos estrecha de `w-16` para otorgar todo el protagonismo al área de trabajo. Los formularios complejos cambian su estructura de dos columnas a una sola.
*   **Desktop (>1024px)**: Sidebar fijo y expandido con textos completos. Barra superior con buscador rápido siempre visible mediante atajo `⌘K`.

---

# PROPUESTA B: AI Intelligence Center (Dark Mode de Vanguardia / Estilo Anthropic)

```
+---------------------------------------------------------------------------------------+
|  PARTNERS IA   [ Buscar Inteligente... ]               [ Model v2.4 ]   [Consola AI]  |
+---------------------------------------------------------------------------------------+
| * COMMAND      DASHBOARD > ANALISIS DE LEADS                                          |
|   Dashboard                                                                           |
|   Leads AI     +--------------------+  +--------------------+  +--------------------+ |
|   Sentiment    | SENTIMIENTO LEAD   |  | INTENCION DE COMPRA|  | TIEMPO RESPUESTA   | |
|                | [Heart] Positivo   |  | 87% Alta           |  | 1.2s promedio      | |
| * CMS STUDIO   | +8% vs ayer        |  | Basado en RAG      |  | Motor AI en línea  | |
|   Noticias     +--------------------+  +--------------------+  +--------------------+ |
|   Media                                                                               |
|                +--------------------------------------------------------------------+ |
| * CONFIG       | LISTADO DE LEADS PROCESADOS POR IA                                 | |
|   Ajustes      | Lead           Sentimiento    Prioridad     Insights       Acción  | |
|                | Andres L.      [Heart] Pos.   [Zap] TOP     Quiere RAG     [Ver]   | |
|                +--------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------+
```

### 1. Filosofía
Un entorno visual adaptado a la inteligencia artificial predictiva. Adopta una estética técnica y oscura inspirada en terminales de desarrollo modernos y plataformas de IA de última generación (como Vercel o Anthropic). Prioriza la legibilidad extrema del texto en pantallas oscuras, el realce de los datos mediante contrastes eléctricos y la visualización de métricas de procesamiento en tiempo real.

### 2. Paleta Cromática (Oscura Tecnológica)
*   **Fondo del Sistema**: Azul pizarra oscuro profundo `#070A13` (o HSL(222, 47%, 6%)).
*   **Tarjetas y Superficies**: Negro azulado `#0F1322` con transparencia sutil.
*   **Bordes y Separadores**: Borde de red fino `#1E293B`.
*   **Texto Primario**: Blanco de alto contraste `#F8FAFC`.
*   **Texto Secundario**: Gris azulado `#94A3B8`.
*   **Acento de Interacción**: Púrpura/Violeta eléctrico `#8B5CF6` o Cian predictivo `#06B6D4`.
*   **Indicadores de Estado**: Verde neón `#10B981` (Éxito), Naranja de combustión `#F97316` (Advertencia), Magenta `#F43F5E` (Alerta).

### 3. Tipografía
*   **Cuerpo de Texto y Datos**: `Inter` (sans-serif neutra).
*   **Telemetría y Métricas**: `Geist Mono` o `SF Mono` (tipografía monoespaciada de alta precisión para números, timestamps e inputs técnicos).

### 4. Layout & Sidebar
*   **Layout**: Estructura fluida sin divisiones físicas gruesas. Los diferentes módulos se separan mediante líneas finas y cambios de tono en el fondo.
*   **Sidebar**: Diseñado en una tonalidad más oscura que el fondo principal (`#030712`), con iconos con trazo de neón violeta y una línea vertical de acento que se ilumina al seleccionar una ruta.

### 5. Dashboard & Cards
*   **Dashboard**: Rejilla densa con widgets analíticos modulares que muestran gráficos de telemetría SVG interactivos.
*   **Cards**: Esquinas redondeadas moderadas de `rounded-xl` (12px), fondo translúcido (`backdrop-blur-md bg-opacity-80`) y un sutil resplandor lineal violeta en el borde superior al pasar el cursor por encima (efecto hover de flujo de electrones).

### 6. Formularios & Tablas
*   **Formularios**: Campos de entrada en color `#0F1322` con bordes `#1E293B` y tipografía monoespaciada para la entrada de datos. Al seleccionarlos, el borde se ilumina en cian eléctrico `#06B6D4` con un resplandor exterior suave.
*   **Tablas**: Cero bordes verticales, líneas divisorias horizontales muy finas de color `#1E293B` y columnas de datos numéricos alineadas a la derecha usando fuentes de ancho fijo para facilitar la comparación analítica de leads.

### 7. Estados Vacíos
*   Una rejilla de puntos decorativa de fondo en gris oscuro sobre la cual se sitúa una ilustración técnica lineal vectorizada con líneas de neón apagadas, indicando que el motor de IA está listo para procesar registros.

### 8. Adaptabilidad Responsive (Mobile, Tablet, Desktop)
*   **Mobile (320px - 767px)**: El menú se despliega desde la parte inferior como una hoja de control deslizable (*bottom-sheet*) translúcida. Las métricas se apilan verticalmente y los gráficos complejos se condensan en minicharts o sparklines integrados.
*   **Tablet (768px - 1024px)**: Sidebar minimalista de iconos y colapso de las tarjetas del dashboard en una cuadrícula de dos columnas fijas, manteniendo la legibilidad del texto monoespaciado.
*   **Desktop (>1024px)**: Interfaz de pantalla completa tipo consola con atajos rápidos siempre visibles en la esquina inferior izquierda (ej. `[Esc] Volver`, `[⌘K] Consola`).

---

# PROPUESTA C: Mission Control OS (Glassmorphism Industrial / Estilo SpaceX)

```
+---------------------------------------------------------------------------------------+
| [=] MISION CONTROL   || TELEMETRY: ACTIVE || RAG DATABASE: SECURE ||   29-MAY-2026     |
+---------------------------------------------------------------------------------------+
| > COMMAND        MISSION CONTROL > TELEMETRIA DE SISTEMAS                             |
|   Dashboard                                                                           |
|   Asistente      +--------------------+  +--------------------+  +--------------------+ |
|   Leads          | CPU LOAD           |  | MEMORY UTILIZATION |  | RESPONSE LATENCY   | |
|   Editorial      | 24.5%              |  | 68.2%              |  | 420ms              | |
|   Portfolio      | Normal Temp        |  | Buffer Safe        |  | SSL Certified      | |
|   Audience       +--------------------+  +--------------------+  +--------------------+ |
|   System                                                                              |
|                  +--------------------------------------------------------------------+ |
|   [Mantenimiento]| MONITOR DE WEBHOOKS EN VIVO                                        | |
|   [Soporte]      | Evento         Destinatario   Código       Tiempo         Estatus    | |
|   [Salir]        | lead.created   Make.com       200 OK       150ms          [Active]   | |
|                  +--------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------+
```

### 1. Filosofía
Una interfaz aeroespacial y de comando ejecutivo táctico inspirado en cabinas de naves espaciales de SpaceX y en centros de control de misiones críticas. Emplea un diseño oscuro y tecnológico con efectos de vidrio ahumado denso, marcos rígidos de estilo industrial, telemetría técnica activa e indicadores de estado detallados de todos los servicios del ecosistema.

### 2. Paleta Cromática (Monocromática Industrial)
*   **Fondo del Sistema**: Negro absoluto `#000000`.
*   **Tarjetas y Superficies**: Vidrio ahumado denso con desenfoque de fondo (`backdrop-blur-md bg-zinc-900/80`).
*   **Bordes y Separadores**: Marcos en gris espacial oscuro `#27272A`.
*   **Texto Primario**: Blanco puro `#FFFFFF`.
*   **Texto Secundario**: Gris zinc `#71717A`.
*   **Acento de Interacción**: Ámbar técnico `#F59E0B`.
*   **Indicadores de Estado**: Verde fósforo `#10B981` (Normal), Naranja de telemetría `#F97316` (Precaución), Rojo carmesí `#EF4444` (Crítico).

### 3. Tipografía
*   **Cuerpo de Texto**: `Outfit` (sans-serif industrial muy limpia).
*   **Etiquetas, Números y Telemetría**: `Share Tech Mono` o `Roboto Mono` (para simular displays de monitores industriales y telemetría militar).

### 4. Layout & Sidebar
*   **Layout**: Estructura de cabina integrada con un marco exterior fino que encuadra toda la aplicación. Las transiciones de pantalla imitan el parpadeo rápido de pantallas de control industrial.
*   **Sidebar**: Panel izquierdo en negro absoluto delimitado por una línea vertical en `#27272A`. Los elementos de navegación usan iconos técnicos y texto en mayúsculas de espaciado ancho (`tracking-widest`).

### 5. Dashboard & Cards
*   **Dashboard**: Rejilla de alta densidad con widgets tácticos compactos, indicadores de rendimiento de CPU/Memoria del servidor y gráficos de barras integrados.
*   **Cards**: Esquinas cuadradas o con un chaflán muy leve (`rounded-lg` de 8px), fondo gris oscuro translúcido con un micro-borde brillante superior en bronce `#3F3F46`.

### 6. Formularios & Tablas
*   **Formularios**: Inputs de diseño rectangular con bordes de color `#27272A` y fondo negro. Al recibir foco, el input cambia a borde ámbar `#F59E0B` con un micro-cursor parpadeante de estilo terminal clásica.
*   **Tablas**: Estructura compacta con cabeceras de tabla oscuras, datos de fila en tipografía monoespaciada para todos los registros y botones de acción rápida con bordes planos y tipografía en mayúscula técnica.

### 7. Estados Vacíos
*   Un visor simulado tipo radar o círculo concéntrico técnico en líneas finas de color `#27272A`, indicando que el monitor táctico de datos se encuentra escaneando el sistema en busca de registros.

### 8. Adaptabilidad Responsive (Mobile, Tablet, Desktop)
*   **Mobile (320px - 767px)**: El menú se despliega desde un panel lateral con estilo de escotilla metálica. Los datos numéricos se priorizan por encima de las descripciones largas de texto, mostrando pantallas de telemetría ultra-compactas.
*   **Tablet (768px - 1024px)**: Reducción del tamaño de fuente en las etiquetas de telemetría y apilamiento de los paneles de control en un grid simétrico de dos columnas con bordes marcados.
*   **Desktop (>1024px)**: Panel de control integrado estilo cabina que ocupa el 100% de la altura y anchura del navegador para una inmersión operativa total.
