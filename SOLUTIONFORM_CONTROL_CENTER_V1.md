# SOLUTIONFORM CONTROL CENTER V1 — PROPUESTA DE DISEÑO Y HOJA DE RUTA

Este documento define la arquitectura visual, la experiencia de usuario (UX/UI) y las especificaciones técnicas para la remodelación del formulario de soluciones (`SolutionForm`) en **Partners IA**. 

Bajo la filosofía **Control Center OS**, transformamos una interfaz que actualmente expone una intimidante "pared de texto" en una consola ágil, comercial y modular, optimizada para redactar y clasificar de forma premium las capacidades de IA del catálogo.

---

## 1. DISTRIBUCIÓN DEL ESPACIO (LAYOUT ASIMÉTRICO 70/30)

Al igual que en `NewsForm`, adoptamos un formato asimétrico sin recurrir a pestañas globales, estructurando la página en:
*   **Zona Principal (70%)**: Foco en la identidad comercial de la solución, sus especificaciones técnicas y su galería visual.
*   **Panel Lateral (30%)**: Foco en visibilidades, llamadas a la acción, recursos multimedia de respaldo y asignación rápida de sectores.

---

## 2. AGRUPACIÓN Y JERARQUÍA DE CAMPOS

Para erradicar la sobrecarga visual, organizamos los 12 campos estructurados del modelo `Solution` de forma que solo se muestre información relevante en cada bloque interactivo.

### 2.1 Zona Principal (70%): Identidad y Ficha de Valor
*   **Tarjeta 1: Identidad y Clasificación**
    *   `title` (Entrada de gran formato, tipografía Outfit Bold, sin bordes estilo Notion).
    *   `slug` (Input monoespaciado autogenerado de solo lectura).
    *   `type` (Selector deslizable para alternar entre "Solución Final" y "Prototipo LAB").
    *   `description` (Área de texto compacta para el resumen comercial de alto impacto. Altura fija a 3 filas).
*   **Tarjeta 2: Ficha Técnica (Tabs Internos - Adiós "Pared de Texto")**
    *   *El Reto*: Actualmente, `SolutionForm` renderiza verticalmente tres áreas de texto gigante (`functionalDescription`, `problemsSolved`, `capabilities`), asfixiando la pantalla.
    *   *La Solución*: Introducir una **micro-navegación por pestañas locales dentro de la propia tarjeta**. El usuario verá un menú de pastilla superior (`[ Lógica Técnica ]`, `[ Retos Superados ]`, `[ Ventajas Clave ]`) y **una sola área de texto visible a la vez**, sincronizada localmente. Esto reduce el espacio de pantalla en un 66% y mejora la concentración del redactor.
*   **Tarjeta 3: Galería Multimedia Premium**
    *   `gallery` (Manejado mediante `useFieldArray`). Renderizado en una rejilla compacta de miniaturas con previsualización, un input reducido para el texto SEO Alt, un checkbox limpio para definir la imagen principal (`isPrimary`), y un botón minimalista para subir archivos.

### 2.2 Panel Lateral (30%): Configuración y Clasificación
*   **Tarjeta 1: Estado y Visibilidad**
    *   `published` (Switch táctil estilo iOS. Al encenderse, cambia a fondo verde esmeralda).
    *   `featured` e `featuredOrder` (Visibilidad destacada en la Home con dropdown para la prioridad).
*   **Tarjeta 2: Conversión & Enlaces**
    *   `ctaUrl` (Campo Call to Action con icono de enlace para capturar visitas comerciales).
    *   `multimedia` (Recurso visual de respaldo en caso de galería vacía).
*   **Tarjeta 3: Sectores Estratégicos**
    *   `sectorIds` (Píldoras interactivas con estados activos en azul/indigo. Incluye el creador rápido de nuevos sectores *inline* para evitar salir del formulario).

---

## 3. WIREFRAMES CONCEPTUALES ASCII

### 3.1 Desktop View (1440px)
```
┌────────────────────────────────────────────────────────────────────────┐
│  [Command Center] > Editar Solución: "Análisis Predictivo de Ventas"   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─ ZONA PRINCIPAL (70%) ────────────────┐ ┌─ PANEL LATERAL (30%) ────┐ │
│  │                                       │ │ ┌─ Estado y Visibilidad ┐ │
│  │  * Título de la Solución              │ │ │ [x] Visible Online    │ │
│  │  [ Análisis Predictivo de Ventas ]    │ │ │ [ ] Destacar en Home  │ │
│  │                                       │ │ └───────────────────────┘ │
│  │  * Resumen Comercial (Valor)           │ │ ┌─ Conversión y Enlaces ┐ │
│  │  [ Explica el retorno de inversión...]│ │ │ * Call To Action      │ │
│  │                                       │ │ │ [ https://...      ]  │ │
│  │  ┌─ Ficha Técnica (Tabs Internos) ──┐ │ │ └───────────────────────┘ │
│  │  │ [ Lógica ] *[ Retos ]  [ Ventajas ]│ │ │ ┌─ Sectores de Aplicación ┐ │
│  │  │ ─────────────────────────────────  │ │ │ │ [x] Banca   [x] Retail  │ │
│  │  │ * Puntos de dolor resueltos:     │ │ │ │ [ ] Salud  [ Nuevo.. ] │ │
│  │  │ [ 1. Incertidumbre en stock...  ]│ │ │ └───────────────────────┘ │
│  │  └──────────────────────────────────┘ │ └───────────────────────────┘ │
│  │  ┌─ Galería Multimedia Premium ─────┐ │                               │
│  │  │ [+] Añadir Imagen a la Galería   │ │                               │
│  │  └──────────────────────────────────┘ │                               │
│  └───────────────────────────────────────┘                               │
│                                                                          │
├────────────────────────────────────────────────────────────────────────┤
│  [ Cancelar ]       [ Vista Previa ]              [ ACTUALIZAR SOLUCIÓN ]│
└────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Tablet View (1024px / 768px)
```
┌────────────────────────────────────────────────────────────────────────┐
│  Editar Solución: "Análisis Predictivo de Ventas"                      │
├────────────────────────────────────────────────────────────────────────┐
│  * Título de la Solución                                               │
│  [ Análisis Predictivo de Ventas                                     ] │
│                                                                        │
│  ┌─ Ficha Técnica ───────────────────────────────────────────────────┐ │
│  │ ( Lógica )  [ Retos ]  ( Ventajas )                               │ │
│  │ * Puntos de dolor resueltos:                                      │ │
│  │ [ 1. Incertidumbre en stock...                                   ] │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌─ Visibilidad y CTA ────────────────┐ ┌─ Sectores Asociados ────────┐ │
│  │ [x] Publicado    [ ] Destacado     │ │ [x] Banca      [x] Retail   │ │
│  │ CTA: [ https://...               ] │ │ [ ] Salud                   │ │
│  └────────────────────────────────────┘ └─────────────────────────────┘ │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  [ Cancelar ]       [ Vista Previa ]              [ ACTUALIZAR SOLUCIÓN ]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. TELEMETRÍA Y SOLUTION SCORE (0-100)

Introducimos una barra superior idéntica a la de `NewsForm` para medir la calidad comercial del catálogo:

*   **+20%**: Título de solución completado.
*   **+15%**: Resumen comercial de valor redactado (campo `description`).
*   **+45%**: Especificaciones de ficha técnica completadas (+15% por cada una de las 3 áreas: `functionalDescription`, `problemsSolved`, `capabilities`).
*   **+10%**: Al menos 1 imagen cargada en la Galería Multimedia.
*   **+10%**: Al menos 1 sector estratégico asignado.

#### Badges de Estado Visual:
*   `[ BORRADOR ]`: `published: false`
*   `[ SOLUCIÓN LIVE ]`: `published: true` y `type: "SOLUTION"`
*   `[ LAB LIVE ]`: `published: true` y `type: "LAB"`

---

## 5. RIESGOS TÉCNICOS Y PROTOCOLO DE CONTENCIÓN

### 5.1 Riesgo de React Hook Form en Tabs Internos
*   **Riesgo**: Ocultar visualmente las textareas de especificaciones técnicas mediante condicionales de React `{activeTab === ...}` desmontaría los inputs del DOM, provocando que React Hook Form pierda sus referencias y limpie los valores de las especificaciones no activas al enviar.
*   **Mitigación**: **Mantener los tres inputs registrados siempre en el DOM**. Se controlará la visibilidad utilizando estilos Tailwind CSS (`className={cn(activeTab !== 'reto' && 'hidden')}`), garantizando que los datos sigan en memoria y se guarden con total estabilidad.

### 5.2 Riesgo de Subidas Concurrentes en Galería
*   **Riesgo**: El usuario puede intentar subir múltiples imágenes de galería al mismo tiempo, lo que generaría condiciones de carrera sobre el array de `gallery` o colisiones en la API de carga de imágenes.
*   **Mitigación**: Implementar un semáforo de bloqueo asíncrono. Mientras una imagen esté en carga (`uploadingImage !== null`), el resto de los botones de carga y el botón principal de guardar se deshabilitarán temporalmente.

---

## 6. HOJA DE RUTA E IMPLEMENTACIÓN (FASE 3B)

*   **Paso 1**: Crear las reglas estructurales en `AdminInfrastructure.css` para el grid de soluciones y las pastillas de ficha técnica.
*   **Paso 2**: Implementar el hook de telemetría de *Solution Score* y los badges de estado.
*   **Paso 3**: Refactorizar la columna principal e implementar las pastillas de Ficha Técnica (`functionalDescription`, `problemsSolved`, `capabilities`) con visibilidad inteligente.
*   **Paso 4**: Integrar el `galleryFields` de la galería con el semáforo de cargas concurrentes y previsualizadores.
*   **Paso 5**: Bindear el Sticky Action Bar al submit.
*   **Paso 6**: Ejecutar `npm run build` para certificar estabilidad.

---

## 7. PROTOCOLO DE ROLLBACK SEGURO

Al no tocar Prisma, bases de datos ni backend, el rollback se realiza a nivel exclusivo del código visual del cliente:
```bash
git checkout master src/components/admin/SolutionForm.tsx
```
Esto descarta instantáneamente los refactors y restaura el formulario original en caso de anomalías en menos de 5 segundos.
