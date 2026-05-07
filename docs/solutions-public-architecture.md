# Arquitectura Pública de Soluciones

Este documento define la arquitectura y estrategia de presentación de las soluciones en la parte pública de la plataforma, separando el descubrimiento por industria del descubrimiento por madurez del producto.

## 1. Página de Soluciones (`/soluciones`)

La página principal de soluciones debe mantener su estructura actual y añadir dos bloques adicionales, garantizando que no se rompe la narrativa visual existente.

### Estructura Deseada:

1. **Hero actual de Soluciones**
2. **Sección actual: Soluciones por sectores**
   - **Condición**: Debe mantenerse intacta.
   - **Diseño**: No romper su diseño actual.
   - **Regla**: No sustituirla por el nuevo catálogo.
   - **Objetivo Conceptual**: Descubrimiento por industria.
3. **Nuevo bloque adicional: Soluciones Finales**
   - **Filtro**: Usar soluciones publicadas con `type = "Solución Final"`.
   - **Enfoque**: Comercial, estable, vendible.
   - **Interacción**: Cada card enlaza a `/soluciones/[slug]`.
   - **Objetivo Conceptual**: Descubrimiento por madurez del producto.
4. **Nuevo bloque adicional: Prototipos LAB**
   - **Filtro**: Usar soluciones publicadas con `type = "Prototipo LAB"`.
   - **Enfoque**: Innovación, laboratorio, demos o validación.
   - **Interacción**: Cada card enlaza a `/soluciones/[slug]`.
   - **Objetivo Conceptual**: Descubrimiento por madurez del producto.

## 2. Página de Inicio (Home)

La Home debe ofrecer una visión ejecutiva y destacar las soluciones más importantes sin sobrecargar de información.

- Mostrar solo un resumen editorial de las mejores soluciones destacadas.
- **Máximo de visualización**: 3 soluciones.
- **Criterio de ordenación**: Usando `featured` + `homeOrder`.
- **Tipos permitidos**: Pueden ser "Solución Final" o "Prototipo LAB".
- **Identidad visual**: Debe mostrar el badge de tipo.
- **CTA**: Incluir enlace hacia `/soluciones`.

## 3. Directrices Estrictas de Implementación

- **NO eliminar** la sección de sectores.
- **NO cambiar** la lógica de sectores.
- **NO tocar** otros módulos.
- **NO implementar todavía**.
- **Próximo Paso Inmediato**: Primero auditar la página `/soluciones` actual para identificar dónde insertar los nuevos bloques sin romper la narrativa visual.
