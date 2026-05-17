# Auditoría Forense del Ecosistema Admin - Partners IA Solutions

## 1. Inventario de Rutas y Módulos

| Ruta | Funcionalidad | Estado UX/UI | Riesgo Responsive |
|------|--------------|--------------|-------------------|
| `/admin/dashboard` | Resumen y métricas | OK (Tiene D&D) | Bajo |
| `/admin/editorial` | Hero Studio (Gestión Hero) | OK | Medio |
| `/admin/sectors` | Gestión de Sectores | OK | Bajo |
| `/admin/clientes` | Gestión de Clientes | OK | Bajo |
| `/admin/partners` | Gestión de Partners | OK | Bajo |
| `/admin/navegacion` | Reordenación de Menú | OK | Medio (D&D) |
| `/admin/apps` | Gestión de Aplicaciones | OK | Bajo |
| `/admin/soluciones` | Gestión de Soluciones | OK | Bajo |
| `/admin/escuela` | Gestión de Academia | OK | Bajo |
| `/admin/noticias` | CMS de Noticias | Necesita compactación | Alto (Tablas anchas) |
| `/admin/newsletter` | Gestión de Audiencia | OK | Medio |
| `/admin/leads` | Mensajes y Contactos | OK | Bajo |
| `/admin/equipo` | Gestión de Equipo | OK | Bajo |
| `/admin/media` | Biblioteca de Media | OK | Medio (Grid) |

## 2. Inventario de Componentes Base

| Componente | Uso | Estado | Observaciones |
|------------|-----|--------|---------------|
| `AdminLayoutShell` | Layout principal | OK | Sidebar colapsable en móvil |
| `Sidebar` | Navegación lateral | OK | Estilo Apple, funcional |
| `AdminTable` | Listado de datos | OK | Tiene vista de tarjetas en móvil |
| `AdminActionMenu` | Acciones "Tres Puntos" | OK | Implementado pero no en todos los sitios |
| `NewsForm` | Formulario complejo | Denso | Riesgo de desborde en metadatos |
| `DashboardGrid` | Grid adaptable | OK | Usa `dnd-kit` |

## 3. Clasificación de Módulos Críticos

### Necesitan Compactación / Optimización
- **`AdminTable`**: Aunque tiene modo móvil, la densidad en tablets (768px - 1024px) puede mejorar. Algunas columnas secundarias deberían ocultarse.
- **`NewsForm`**: El grid de metadatos (`xl:grid-cols-6`) es muy agresivo. Las etiquetas de los inputs son muy pequeñas.
- **`Sidebar`**: Puede ser más compacto en desktop para ganar espacio de trabajo.

### Riesgo Responsive / Overflow
- **Tablas de Noticias**: La columna de "Google Business" y "Clasificación" juntas ocupan mucho espacio horizontal.
- **Toolbars**: Los botones de acción (ej. "Sincronizar Todo", "Importar", "Nueva Noticia") se amontonan en móviles.
- **Modales**: Necesitan revisión de `max-height` para asegurar que el scroll interno funcione en móviles pequeños.

### Jerarquía Visual
- Los encabezados de página (`h1`) son muy grandes en móvil.
- El contraste de algunos textos secundarios (gris 400 sobre blanco/gris) puede ser bajo para accesibilidad.

## 4. Plan de Acción Inmediato

1. **Refactor de `AdminTable`**: Introducir soporte para visibilidad de columnas por breakpoint.
2. **Refactor de `AdminActionMenu`**: Asegurar que sea el patrón estándar para todas las filas de tabla.
3. **Optimización de Formularios**: Crear `AdminFormShell` para estandarizar el layout y la densidad.
4. **Toolbars Responsivas**: Implementar un patrón de toolbar que colapse acciones secundarias en un menú "⋯" en móvil.
5. **Consolidación de Estilos**: Asegurar que no hay fugas de estilos al sitio público.

---
*Documento generado para la fase 1 del plan de optimización UX/UI Admin.*
