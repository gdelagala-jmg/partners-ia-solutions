# NEWSFORM CONTROL CENTER — VALIDACIÓN PREVIA DE DISEÑO (FINAL)

Este documento establece la validación de arquitectura técnica e interfaz para el rediseño definitivo del formulario de noticias (`NewsForm`) bajo el marco **Control Center OS**, analizando críticamente el esquema de datos, la separación de responsabilidades en la botonera de acción y los indicadores de estado y telemetría editorial.

---

## 1. PUNTO 1: VALIDACIÓN DEL "RESUMEN"

### 1.1 Hallazgos del Análisis de Código y Esquema
Realizamos una inspección exhaustiva de la base de datos (`schema.prisma`) y de la capa del frontend público, confirmando lo siguiente:

1.  **Inexistencia de Campos Dedicados**: El modelo `NewsPost` **no contiene** ninguna columna denominada `excerpt`, `summary`, `description` ni `shortDescription`. El cuerpo del texto se almacena exclusivamente en `content` (`@db.LongText`).
2.  **Extracción Dinámica en el Frontend Público**: La web pública autogenera todos sus resúmenes y descripciones SEO sobre la marcha mediante una limpieza de etiquetas HTML y un recorte de caracteres (`substring`) directamente sobre `content`.
    *   *Detalles de SEO ([slug]/page.tsx:L111)*:
        `description: post.content.substring(0, 160).replace(/<[^>]*>/g, '')`
    *   *Listado de Noticias (NewsPageClient.tsx:L240)*:
        `post.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150)`

### 1.2 Pauta de Diseño Definitiva (Cero Hacks de Expresión Regular)
> [!IMPORTANT]
> **Decisión de Diseño**: Queda **prohibido** inyectar cabeceras artificiales o bloques HTML modificados mediante expresiones regulares dentro del campo de contenido, ya que esto podría corromper el contenido HTML estructurado del redactor o generar inconsistencias visuales en el editor Quill.
> 
> **Workflow Limpio (Medium / Substack Style)**: 
> Eliminamos el campo independiente de "Resumen" de la interfaz de usuario. Al igual que en las plataformas editoriales más avanzadas del mercado, **el redactor escribe su copete o párrafo introductorio directamente en la primera línea del editor de texto**, pudiendo aplicarle un estilo destacado (como texto en negrita o el formato "Lead paragraph" incorporado en los presets de Quill). 
> 
> De este modo, la web pública seguirá abstrayendo y recortando el resumen de forma natural a partir de los primeros 120-150 caracteres del artículo, garantizando compatibilidad 100% sin añadir parches de código ni tocar la base de datos.

---

## 2. PUNTO 2: ACCIONES EDITORIALES VS. DISTRIBUCIÓN

Para evitar la sobrecarga y simplificar la toma de decisiones, dividimos la barra de acciones inferior (**Sticky Action Bar**) en dos zonas claramente delimitadas por responsabilidad operativa.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Sticky Action Bar (Barra de Bottom Fija)                              │
├────────────────────────────────────────────────────────────────────────┤
│  [ Acciones Editoriales ]                   [ Acciones Distribución ]  │
│                                                                        │
│  [ Guardar ]  [ Vista Previa ]  [ PUBLICAR]   [ Sincronizar GMB  [v] ] │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Acciones Editoriales (Foco: Construcción del Contenido)
Ubicadas en la **zona izquierda/central** de la barra de acciones:
*   **Guardar Borrador**: Guarda los cambios locales del artículo sin alterar su estado público en la web.
*   **Vista Previa**: Abre una pestaña modal inmersiva en tiempo real simulando la vista pública exacta.
*   **Publicar / Programar**: Cambia el estado público de la noticia. Si hay una fecha futura en `publishedAt`, el botón cambia automáticamente de etiqueta a **Programar Noticia**.

### 2.2 Acciones de Distribución (Foco: Canales y Sindicación)
Ubicadas en la **zona derecha** en un menú desplegable premium estilo pastilla:
*   **Sincronizar Google Business (GMB)**: Detona la sincronización manual directa con la ficha de Google My Business (acción ya provista en la API).
*   **Verificar Canales (RSS & Newsletter)**: Permite revisar si la noticia ya ha sido sindicada en el boletín semanal automático o si se ha incluido en el canal general de RSS para agregadores externos.

---

## 3. PUNTO 3: ESTADO VISUAL Y PROGRESO EDITORIAL

Diseñamos una barra de telemetría superior que se integra de manera ultra-discreta justo encima del título principal de la noticia, ofreciendo un feedback instantáneo sobre el estado del artículo y su calidad de compleción.

### 3.1 Badges de Estado Operacional
*   `[ BORRADOR ]` (Fondo gris neutro, texto gris oscuro): Indica que `published: false`.
*   `[ PROGRAMADO ]` (Fondo ámbar traslúcido, texto naranja cálido): Indica que `published: true` pero la fecha en `publishedAt` es posterior a la hora actual del servidor.
*   `[ PUBLICADO ]` (Fondo verde esmeralda traslúcido, texto verde oscuro): Indica que `published: true` y la fecha de publicación ya ha pasado, estando visible para el público general.

### 3.2 Indicador de Progreso Editorial (Telemetry Meter)
Una micro-barra de progreso horizontal con porcentaje dinámico basado en la compleción óptima del post:
*   **+25%**: Título redactado (largo óptimo entre 20 y 80 caracteres).
*   **+25%**: Contenido del cuerpo superior a 300 palabras.
*   **+25%**: Imagen de portada cargada.
*   **+25%**: Datos de IA Insight asignados por el "Auto-Mapeo IA".

#### Boceto Visual en Formulario:
```
  [ BORRADOR ]   Calidad Editorial: [▓▓▓▓▓▓▓▓▓▓░░░░░░] 60% (Falta Portada e IA Insights)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Google lanza Gemini 1.5 Pro
```

---

## 4. ARCHIVOS AFECTADOS

*   **[NewsForm.tsx](file:///Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/NewsForm.tsx)**: Refactor del grid de 70/30, remoción del campo manual "Resumen", inserción de la barra de telemetría superior (badges de estado + barra de progreso) y división de la botonera inferior en bloques de Editor vs. Distribución.
*   **[AdminInfrastructure.css](file:///Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/AdminInfrastructure.css)**: Estilos para la barra adhesiva (`.admin-sticky-bar`), badges de estado (`.badge-draft`, `.badge-scheduled`, `.badge-published`) y animación del progreso de compleción.

---

## 5. PROTOCOLO DE ROLLBACK Y CONTENCIÓN

1.  **Inmunidad del Core**: No se tocan Prisma ni llamadas REST en la API, por lo que no existe riesgo de fallos en base de datos.
2.  **Rollback Git Exclusivo**:
    ```bash
    git checkout master src/components/admin/NewsForm.tsx
    ```
    Esto revierte al instante el formulario a su visualización unificada clásica.
