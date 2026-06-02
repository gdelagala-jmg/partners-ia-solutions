# PROJECT GUARDIAN PRE-FLIGHT CHECK INITIATED
# PLAN DE DISEÑO Y EJECUCIÓN — FASE 2: LISTADOS CRUD RESPONSIVOS
## CONTROL CENTER OS — ENTORNO ADMINISTRATIVO DE PARTNERS IA

Este plan detalla el proceso seguro para la transformación y estandarización visual y responsive de los tres listados administrativos críticos de **Partners IA**: **Noticias**, **Leads** y **Sectores**. 

---

## 1. Auditoría de los Listados Actuales

### Módulo 1: Noticias & Blog (`/admin/noticias`)
*   **Estado Actual**: Utiliza `AdminTable` y `AdminToolbar`. Es funcional, pero tiene una barra de filtros de alta densidad con 5 campos apilados (`select` de fecha, rango desde/hasta, inputs de texto, etc.) que se siente densa y abrumadora.
*   **Problemas Identificados**: La columna "Google Business" y las clasificaciones secundarias (`aiType`, `aiTool`) provocan que la tabla sea excesivamente ancha en pantallas de laptop (1024px - 1280px).
*   **Acción de Rediseño**: Estandarizar la cabecera del listado, compactar la fila de filtros con menús desplegables discretos y ocultar de forma responsiva las columnas secundarias en terminales móviles y tablets, delegando las acciones secundarias a `AdminActionMenu`.

### Módulo 2: Contactos & Leads (`/admin/leads`)
*   **Estado Actual**: Utiliza un listado apilado de tarjetas `AdminCard`. No está integrado con el componente unificado `AdminTable`.
*   **Problemas Identificados**: En ordenadores de sobremesa, las tarjetas individuales consumen demasiado espacio vertical, impidiendo una visión global de las interacciones de negocio. Los filtros y badges móviles están duplicados en el código.
*   **Acción de Rediseño**: Migrar este módulo a `AdminTable`, utilizando una visualización tabular premium para ordenadores (que permita comparar múltiples leads de un vistazo) y un fallback automático de tarjetas verticales altamente estéticas (`renderMobileCard`) exclusivas para móviles.

### Módulo 3: Gestión de Sectores (`/admin/sectors`)
*   **Estado Actual**: Utiliza `AdminTable` y `AdminToolbar`. Es el módulo más simple y con menos campos.
*   **Problemas Identificados**: Falta de holgura visual en la columna de imagen/icono y espaciados de celdas ajustados que restan la sensación de "centro de control premium".
*   **Acción de Rediseño**: Re-maquetar los espaciados, añadir efectos de hover suaves y aplicar las clases de "Más Aire" desarrolladas en la Fase 1.

---

## 2. Archivos Exactos a Modificar

Para asegurar el aislamiento absoluto del sistema, la implementación se limitará exclusivamente a los siguientes tres archivos funcionales de la interfaz de usuario:

```
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/app/admin/(dashboard)/noticias/page.tsx
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/app/admin/(dashboard)/leads/page.tsx
[MODIFY]  /Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/app/admin/(dashboard)/sectors/page.tsx
```

---

## 3. Componentes Nuevos a Crear

No es necesario crear archivos de componentes genéricos nuevos que puedan fragmentar la base de código. Se utilizarán y enriquecerán los componentes base de la Fase 1:
*   `AdminTable.tsx` (Estructura de listados responsivos).
*   `AdminToolbar.tsx` (Cabeceras premium unificadas).
*   `AdminStatusBadge.tsx` (Estatus visuales claros).
*   `AdminActionMenu.tsx` (Acciones de tres puntos "⋯" responsivas).

---

## 4. Riesgos por Módulo

Para cada módulo se analiza el impacto en las APIs de servidor y su estrategia de mitigación segura:

| Módulo | Acción Crítica Relacionada | Riesgo Técnico | Estrategia de Mitigación Segura |
| :--- | :--- | :--- | :--- |
| **/admin/noticias** | Sincronización GMB (Make) / Generar Newsletter. | **Medio**: Romper las llamadas fetch a los endpoints `/api/news/[id]/sync` y `/api/admin/newsletter/generate-manual`. | Mantener las funciones asíncronas `handleSync`, `handleSyncAll` y `handleGenerateNewsletter` exactamente intactas en los clics de los botones, modificando únicamente su contenedor estético. |
| **/admin/leads** | Modificación de Estado (Nuevo, Contactado, Archivado). | **Medio**: Afectar el flujo de guardado y archivado de contactos en la API `/api/leads/[id]`. | Preservar el hook `updateStatus` tal y como está definido, limitando el cambio a la maquetación de la tabla y tarjetas de visualización. |
| **/admin/sectors** | Cambiar Estado Activo/Inactivo de Sector. | **Bajo**: Modificación del estado boleano. | Conservar la llamada PUT en `handleToggleStatus` con sus parámetros originales. |

---

## 5. Estrategia Responsive por Breakpoint

Garantizaremos una visualización adaptativa impecable y fluida mediante la ocultación selectiva de columnas secundarias en celdas de tabla CSS:

```
+-----------------------------------------------------------------------------------+
| BREAKPOINT             | VIEWPORT ANCHO | ESTRATEGIA DE PRESENTACIÓN              |
+------------------------+----------------+-----------------------------------------+
| Large Desktop          | > 1200px       | Tabla Premium completa con celdas y     |
|                        |                | columnas expandidas de gran holgura.    |
+------------------------+----------------+-----------------------------------------+
| Laptop / Tablet Horiz. | 768px - 1199px | Tabla de celdas compactadas. Ocultar    |
|                        |                | columnas como "Google Business" y       |
|                        |                | marcas de tiempo secundarias.           |
+------------------------+----------------+-----------------------------------------+
| Mobile Portrait        | < 768px        | Ocultación total de la tabla. Fallback   |
|                        |                | automático a tarjetas verticales        |
|                        |                | (MobileRecordCard) de lectura fluida.   |
+-----------------------------------------------------------------------------------+
```

---

## 6. Visualización de los Listados por Breakpoint (Mockups Conceptuales)

### Módulo de Leads en Desktop (>1200px)
```
+---------------------------------------------------------------------------------------+
| LEADS & CONTACTOS                                                       [+] Descargar |
+---------------------------------------------------------------------------------------+
| [ Todos (12) ]  [ Nuevos (4) ]  [ Contactados (8) ]                                   |
+---------------------------------------------------------------------------------------+
| Nombre         Email            Empresa       Solución Interés     Estado    Acciones |
| Andrés Gómez   andres@rag.com   RAG Solutions Soluciones RAG       [NUEVO]   [  ⋯  ]  |
| Sofía Silva    sofia@web.com    Webinar AI    Academia Cursos      [NUEVO]   [  ⋯  ]  |
+---------------------------------------------------------------------------------------+
```

### Módulo de Leads en Móvil (<768px)
```
+-------------------------------------------------+
| LEADS & CONTACTOS                               |
+-------------------------------------------------+
| +---------------------------------------------+ |
| | (user) ANDRÉS GÓMEZ                  [NUEVO]| |
| | Email: andres@rag.com                       | |
| | Empresa: RAG Solutions                      | |
| | Solución: Soluciones RAG                    | |
| |                                   [ ⋯ ] [>] | | <- Detalle expandible + Acciones
| +---------------------------------------------+ |
| +---------------------------------------------+ |
| | (user) SOFÍA SILVA                   [NUEVO]| |
| | Email: sofia@web.com                        | |
| |                                   [ ⋯ ] [>] | |
| +---------------------------------------------+ |
+-------------------------------------------------+
```

---

## 7. Orden Recomendado de Ejecución

Procederemos en tres pasos incrementales y aislados para verificar y testear cada módulo antes de pasar al siguiente:

1.  **Paso 1: Módulo Leads (`/admin/leads`)**
    *   *Objetivo*: Migrar la maquetación de tarjetas a la unificación de `AdminTable` con callback responsivo.
2.  **Paso 2: Módulo Noticias (`/admin/noticias`)**
    *   *Objetivo*: Compactar y espaciar filtros de fecha, categorizaciones de IA y ocultación responsive de columnas.
3.  **Paso 3: Módulo Sectores (`/admin/sectors`)**
    *   *Objetivo*: Añadir holgura visual en la cuadrícula de sectores, iconos e indicadores.
4.  **Paso 4: Validación Final**
    *   *Objetivo*: Compilación de producción completa (`npm run build`) para certificar que el tipado de TypeScript se mantiene intacto.

---

## 8. Plan de Rollback

En caso de cualquier eventualidad o comportamiento inesperado durante la edición de los archivos TSX, el sistema se restaurará al estado seguro original mediante Git:

*   **Punto de restauración de archivo individual**:
    ```bash
    git checkout -- src/app/admin/\(dashboard\)/leads/page.tsx
    ```
*   **Cancelación total de la Fase 2**:
    ```bash
    git checkout main
    ```

---

## 9. Checklist de Validación

- `[ ]` La compilación de producción con `npm run build` finaliza con éxito absoluto.
- `[ ]` Los listados de Leads cambian automáticamente a visualización de tarjetas en un viewport de 390px (móvil).
- `[ ]` Los menús de tres puntos `AdminActionMenu` funcionan correctamente tanto en móvil como en escritorio.
- `[ ]` Las llamadas fetch a los endpoints de creación, borrado y actualización de estado siguen operativas sin errores de conexión.
- `[ ]` El sitio público de cara al cliente permanece libre de modificaciones o fugas estéticas.

---

## 10. Confirmación Explícita de Seguridad y Cero Alteraciones

> [!IMPORTANT]
> ### DECLARACIÓN DE INMUNIDAD TÉCNICA
> **Confirmación del Auditor**:
> Se declara bajo estricto protocolo de **Guardian Mode** que ningún cambio propuesto en este plan afectará, modificará ni borrará registros en la base de datos de producción (MySQL/PostgreSQL), esquemas de Prisma, Server Actions de Next.js, APIs de comunicación, tokens de sesión o lógicas de autenticación del sistema. Todo cambio está rigurosamente encapsulado en la capa de visualización e interacción UI/UX de las páginas TSX del backoffice.
