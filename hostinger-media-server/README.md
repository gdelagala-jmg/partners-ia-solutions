# HOSTINGER GOVERNED MEDIA SERVER - DEPLOYMENT GUIDE

Este directorio contiene los archivos del servidor de almacenamiento persistente de media de **Partners IA Solutions** para desplegar en Hostinger.

---

## 📂 Estructura de Archivos
*   `api/secure-receiver.php`: Endpoint seguro HTTP Multipart con firma HMAC-SHA256 y anti-replay.
*   `uploads/.htaccess`: Regla de endurecimiento (hardening) para denegar la ejecución de archivos PHP/scripts y deshabilitar la indexación de directorios.

---

## 🚀 1. Despliegue en Hostinger

1.  **Acceso al Administrador de Archivos (hPanel)**:
    *   Inicie sesión en el panel de Hostinger.
    *   Navegue al Administrador de Archivos de la web principal o cree el subdominio `media.partnersiasolutions.com`.
2.  **Carga de Archivos**:
    *   Suba el contenido de esta carpeta `hostinger-media-server/` directamente en la raíz del subdominio en Hostinger (ej: `/public_html/` del subdominio).
    *   Asegúrese de que el directorio `/public_html/uploads/` exista y tenga permisos `0755` para permitir la escritura.
3.  **Habilitar SSL Let's Encrypt**:
    *   Active el certificado SSL para `media.partnersiasolutions.com` en Hostinger.

---

## 🔑 2. Configuración de Variables de Entorno

### En Hostinger (Mandatorio)
Para que el receptor funcione correctamente, debe configurar la variable de entorno `MEDIA_UPLOAD_SECRET` en Hostinger.
*   En **hPanel**, navegue a **Configuración de PHP** -> **Variables de entorno** y añada `MEDIA_UPLOAD_SECRET` con su valor seguro de producción.
*   *Nota*: El script no cuenta con ningún fallback de secreto hardcodeado y fallará con un error controlado `HTTP 500` si esta variable no está presente en el entorno.

### En Vercel (Futuro)
*   `MEDIA_UPLOAD_SECRET`: Mismo valor configurado en Hostinger.

---

## 🧪 3. Verificación de la PoC

Ejecute la suite de pruebas local para comprobar el control criptográfico antes de pasar a producción:
```bash
node scratch/poc-receiver-test.js
```
