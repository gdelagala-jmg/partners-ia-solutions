# Normas Operativas del Proyecto (Operating Rules CORE)

Este documento establece las reglas operativas, principios de seguridad y protocolos de validación universales que rigen el repositorio. Todo desarrollador o agente de Inteligencia Artificial que trabaje en esta base de código debe ceñirse estrictamente a estas reglas para mantener la soberanía y seguridad del espacio de trabajo.

---

## 🛡️ 1. Reglas Universales de Desarrollo

### 1.1 No Deploy Without Validation (Sin despliegues sin validación previa)
- Queda terminantemente prohibido forzar despliegues o generar empaquetados hacia producción sin haber ejecutado de manera exitosa todas las pruebas estáticas, de compilación y de tipados en local.
- Las herramientas de integración continua o flujos de despliegue deben actuar como el último paso de una cadena de validación impecable.

### 1.2 No Production Changes Without Confirmation (Sin cambios en producción sin confirmación)
- Cualquier cambio destructivo, modificación de esquemas de datos o reconfiguración de infraestructura en caliente debe requerir confirmación humana explícita por parte del operador del proyecto.
- Se prohíbe el uso de comandos de reescritura directa en base de datos (`npx prisma db push` o equivalentes destructivos) en entornos de producción.

### 1.3 No Context Crossover (Sin cruce de contexto)
- Está prohibido importar, referenciar o reutilizar fragmentos de código, esquemas de datos o especificaciones de negocio que pertenezcan a otros clientes o proyectos.
- El agente o desarrollador debe mantener un aislamiento absoluto entre el contexto de la tarea actual y cualquier antecedente histórico ajeno a este repositorio.

### 1.4 No Assumptions (Sin suposiciones)
- Toda modificación debe basarse en la realidad del repositorio actual, no en suposiciones de API o comportamientos teóricos.
- Ante cualquier ambigüedad en los requerimientos, especificaciones de conectores o APIs de servicios, se debe reportar inmediatamente en lugar de asumir y escribir implementaciones ciegas.

### 1.5 No Secret Exposure (Sin exposición de secretos)
- Nunca se deben incluir contraseñas, tokens de acceso, API keys o cadenas de conexión explícitas en el código fuente, comentarios o archivos de documentación.
- Todo secreto debe gestionarse de forma segura mediante variables de entorno en el sistema de hosting y ser referenciado a través de un archivo de configuración seguro.

### 1.6 No Cross-Project References (Sin referencias cruzadas entre proyectos)
- Queda totalmente prohibido el uso de nombres, URLs, alias o referencias textuales a otros proyectos del desarrollador, cliente o corporación que no figuren en los términos requeridos del repositorio.

### 1.7 Mandatory Pre-Flight Audit (Auditoría pre-vuelo obligatoria)
- Es imperativo realizar un análisis pre-vuelo antes de proponer cualquier cambio al repositorio, contrastando la configuración actual con la identidad del proyecto definida en `project.identity.json`.

---

## 🔒 2. Reglas de Límite de Confianza (TRUST BOUNDARY RULES)

El desarrollo del proyecto y la verificación por parte del agente deben ceñirse a límites de confianza claros:
- **No simulated validation:** Está prohibido simular o falsear que se ha completado una verificación de servicios externos si no existe una conexión activa y observable a las APIs de dichos servicios.
- **No assumed infrastructure state:** Queda prohibido asumir el estado interno de la infraestructura en la nube (Vercel, base de datos Neon, dominios DNS). Si el recurso no es legible directamente en el entorno de ejecución del agente, debe marcarse como "no comprobable".
- **No unverifiable compliance claims:** El agente no emitirá declaraciones de cumplimiento normativo o técnico que no puedan ser demostradas empíricamente con archivos locales.
- **Explicit declaration of validation limits:** El agente declarará de forma explícita las limitaciones de visibilidad técnica que tenga al realizar cualquier reporte de auditoría.

---

## 🚦 3. Niveles de Validación del Proyecto

Las comprobaciones del sistema se estructuran en tres niveles de visibilidad y acceso:

### LEVEL 1 — Context validation
*Ámbito:* Archivos locales, base de código, nomenclatura de carpetas, referencias internas y dependencias declaradas en `package.json`.
*Requisito:* Acceso de lectura al espacio de trabajo.

### LEVEL 2 — Connected systems validation
*Ámbito:* Entornos e integraciones remotas activas (GitHub remotes, Vercel projects, Neon DB branches, Stripe accounts, Resend integrations).
*Requisito:* Conexión de red activa y credenciales/tokens cargados válidamente en el entorno de ejecución local.

### LEVEL 3 — Human confirmation required
*Ámbito:* Configuración de DNS global, entornos productivos de facturación (Billing / Production), credenciales administrativas maestras e infraestructura crítica.
*Requisito:* Confirmación manual explícita del operador humano.

> [!IMPORTANT]
> **Escalado Automático:** Si el agente no dispone de las credenciales de red, accesos o APIs necesarias para comprobar un nivel de forma fehaciente, **escalará automáticamente al nivel superior** y detendrá la escritura o despliegue hasta recibir la validación manual correspondiente.

---

## 🚀 4. Protocolo de Validación PRE-FLIGHT

Antes de proponer modificaciones de código, desplegar servicios o dar por finalizada una tarea, el agente debe realizar de manera obligatoria el siguiente análisis de seguridad y coherencia.

### Checklist Obligatoria de Validación Pre-Vuelo:

- [ ] **Proyecto Identificado:** ¿Se ha leído el archivo `project.identity.json` en la raíz y se ha verificado el nombre del proyecto?
- [ ] **Repo Coincide:** ¿El origen remoto de Git configurado en el entorno local coincide plenamente con la propiedad `githubRepository`?
- [ ] **Branch Coincide:** ¿La rama de trabajo actual se corresponde con los flujos de Git permitidos del proyecto?
- [ ] **Vercel Coincide:** ¿Los identificadores locales del proyecto de hosting coinciden de forma exacta con la configuración de `vercelProject`?
- [ ] **Dominio Coincide:** ¿Todas las URLs base y endpoints configurados apuntan únicamente a los dominios autorizados de `allowedDomains`?
- [ ] **Servicios Coinciden:** ¿Los proveedores tecnológicos y librerías utilizadas en el desarrollo están limitados estrictamente a los permitidos en `allowedServices`?
- [ ] **Variables Consistentes:** ¿Las variables de entorno declaradas localmente son consistentes con la identidad técnica y no revelan secretos explícitamente en logs?
- [ ] **Sin Contaminación Detectada:** ¿Se ha comprobado que no existen términos prohibidos de `forbiddenTerms` ni referencias a proyectos bloqueados en `blockedProjects`?

---

## 🛑 5. Protocolo de Bloqueo Preventivo

> [!CAUTION]
> ### STOP — CONTEXT CONTAMINATION DETECTED
> Si cualquiera de los puntos de la checklist de Validación Pre-Vuelo resulta fallido, o si se detecta mezcla de términos prohibidos de otros repositorios en el espacio de trabajo:
> 
> 1. **INTERRUPCIÓN INMEDIATA:** El agente detendrá inmediatamente cualquier operación de escritura sobre el sistema de archivos.
> 2. **BLOQUEO PREVENTIVO:** Se forzará el estado de solo lectura.
> 3. **REPORTE DE ALERTA:** Se informará de manera prioritaria al operador humano sobre la detección de contaminación de contexto, detallando las discrepancias encontradas, sin realizar modificaciones que puedan propagar el cruce de datos.
