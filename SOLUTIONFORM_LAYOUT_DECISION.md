# INFORME DE DECISIÓN DE INTERFAZ — SOLUTIONFORM LAYOUT (FASE 3B)

Este documento contiene la validación técnica y de diseño para la visualización del bloque de Ficha Técnica y Especificaciones de Valor en el formulario de Soluciones (`SolutionForm`). Evaluamos críticamente las dos alternativas de diseño propuestas para erradicar la "pared de texto" comercial sin alterar el backend del proyecto.

---

## 1. COMPARATIVA DE OPCIONES DE DISEÑO

### 1.1 OPCIÓN A: Pestañas Locales (Tabs)
*   *Estructura*: Un selector horizontal de botones pastilla (`[ Lógica ]`, `[ Retos ]`, `[ Ventajas ]`) que renderiza de forma excluyente un único textarea activo a la vez.

| Dimensión Analizada | Comportamiento y Evaluación Técnica |
| :--- | :--- |
| **Productividad** | • **Alta**: Interacción de un solo clic para cambiar de foco.<br>• **Limitación**: Obliga a alternar constantemente entre pestañas si se desea realizar copiado de textos o comparativas entre la descripción funcional y los problemas resueltos. |
| **Legibilidad** | • **Excelente**: Elimina el 100% del ruido visual de los campos inactivos, manteniendo una visualización compacta de un solo vistazo. |
| **Mobile & Tablet** | • **Foco Táctil Óptimo**: Si se implementa un carrusel deslizable horizontal, los botones son cómodos en terminales táctiles de 390px. |
| **Compatibilidad RHF** | • **Complejidad de Validación**: Si ocurre un error de validación en una pestaña oculta (por ejemplo, el campo `functionalDescription` excede el tamaño permitido o queda vacío estando marcado como obligatorio), **el usuario no verá el mensaje de error de inmediato**. Esto genera frustración operacional al presionar "Guardar" sin recibir feedback visual directo. |

---

### 1.2 OPCIÓN B: Bloques Editoriales Colapsables (Acordeones)
*   *Estructura*: Una lista vertical de tarjetas colapsables (`Descripción Comercial`, `Problemas Resueltos`, `Capacidades Clave`, `Ventajas Técnicas`) con cabeceras interactivas táctiles que se expanden o cierran de forma independiente.

| Dimensión Analizada | Comportamiento y Evaluación Técnica |
| :--- | :--- |
| **Productividad** | • **Muy Alta**: El redactor comprende al instante la estructura global del catálogo comercial de un solo vistazo.<br>• **Multitarea**: Permite expandir más de un bloque simultáneamente en ordenadores de sobremesa para contrastar o copiar información técnica. |
| **Legibilidad** | • **Excelente**: Al estar colapsados por defecto, se erradica la fatiga cognitiva y la pared de texto, mostrando solo los títulos operacionales. |
| **Mobile & Tablet** | • **Nativo y Natural**: Los acordeones verticales son un estándar indiscutible de usabilidad móvil en pantallas de 320px–768px, facilitando el scroll natural con el pulgar. |
| **Compatibilidad RHF** | • **Integración de Feedback Perfecta**: Al estar todos los campos registrados en el DOM de forma visible o colapsada, si ocurre un error de validación, React Hook Form detecta el fallo instantáneamente y **detona la apertura automática del bloque colapsado con error** (`errors.functionalDescription && setOpenBlock('specs')`). El usuario recibe feedback visual inmediato sin que los errores queden invisibles. |

---

## 2. ANÁLISIS DE FACTORES CRÍTICOS Y DISPOSITIVOS

```
┌────────────────────────────────────────────────────────────────────────┐
│  Opción B: Bloques Colapsables (Visualización Desktop)                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ▼ Descripción Comercial (Valor)                                       │
│  [ Resumen comercial de alto impacto...                            ]  │
│                                                                        │
│  ▶ Problemas que Resuelve (Dolor)                                      │
│                                                                        │
│  ▼ Capacidades Clave (Ventajas)                                        │
│  [ Enumera aquí las ventajas tecnológicas competitivas...          ]  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

*   **En Desktop (1440px)**: La Opción B aprovecha perfectamente la altura de pantalla. Permite expandir múltiples bloques si se desea, alineándose con el Sticky Action Bar.
*   **En Tablet (1024px/768px)**: Mantiene las cabeceras claras, permitiendo expandir con un simple tap táctil el acordeón deseado.
*   **En Móvil (390px)**: Evita la sobrecarga. Las cabeceras del acordeón actúan como separadores de sección perfectos que guían el flujo de scroll vertical del usuario con total ergonomía.

---

## 3. RECOMENDACIÓN ESTRATÉGICA DEFINITIVA

> [!IMPORTANT]
> ### RECOMENDAMOS ENFÁTICAMENTE: **OPCIÓN B (Bloques Editoriales Colapsables)**
> 
> La **Opción B** es técnicamente superior y proporciona la experiencia más premium por tres razones definitivas:
> 
> 1.  **Feedback de Errores Infalible**: Resuelve el mayor problema de las pestañas (la invisibilidad de errores). Si un campo tiene un error de validación, el formulario expande automáticamente ese bloque colapsado y desplaza el foco del cursor al input erróneo, garantizando cero fricción.
> 2.  **Flexibilidad Multitarea**: A diferencia del comportamiento excluyente de los Tabs, los bloques colapsables permiten mantener abiertas dos secciones clave a la vez (como Lógica Técnica e Imagen Fallback) si el usuario lo requiere durante su flujo de trabajo.
> 3.  **Guía Estructural**: Las cabeceras del acordeón actúan como una "plantilla" o checklist mental para el redactor sobre la información de valor que debe recopilar, potenciando la productividad de entrada.

---

## 4. ARCHIVOS AFECTADOS EN FASE 3B

*   **[SolutionForm.tsx](file:///Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/SolutionForm.tsx)**: Integración del estado de acordeones locales (`const [openBlock, setOpenBlock] = useState<string | null>('general')`) y enlace con el hook `errors` de React Hook Form para auto-expansión en caso de fallos.
*   **[AdminInfrastructure.css](file:///Volumes/DATA/Mirror/DRIVE/GDELAGALA/ANTIGRAVITY/PRO_PIAS/partners-ia-solutions/src/components/admin/ui/AdminInfrastructure.css)**: Estilos interactivos para los acordeones colapsables (`.admin-accordion-header`, `.admin-accordion-content`) con transiciones suaves de `max-height`.
