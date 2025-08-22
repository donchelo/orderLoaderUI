# 🚀 Guía de Despliegue en GoDaddy

## 📋 Pasos para subir a producción

### 1. Preparación del proyecto
```bash
# Crear build de producción
npm run build

# El build se crea en la carpeta /build
```

### 2. Configuración en GoDaddy

#### Opción A: Subdominio (Recomendado)
1. Ve a tu panel de control de GoDaddy
2. Busca "DNS" o "Administrar DNS"
3. Crea un registro CNAME:
   - **Nombre:** `orderLoader`
   - **Valor:** `tu-dominio-principal.com` (o el dominio que tengas configurado)
   - **TTL:** 600 (o el valor por defecto)

#### Opción B: Subcarpeta
1. Accede a tu hosting por FTP/SFTP
2. Ve a la carpeta `public_html`
3. Crea una carpeta llamada `orderLoader`
4. Sube todo el contenido de la carpeta `build` dentro de `orderLoader`

### 3. Subida de archivos

#### Método 1: File Manager (Más fácil)
1. En el panel de GoDaddy, busca "File Manager"
2. Navega a `public_html`
3. Crea una carpeta llamada `orderLoader`
4. Sube todos los archivos de la carpeta `build` a `orderLoader`

#### Método 2: FTP/SFTP
1. Usa un cliente FTP como FileZilla
2. Conéctate a tu servidor GoDaddy
3. Navega a `public_html/orderLoader`
4. Sube todos los archivos de la carpeta `build`

### 4. Estructura final en el servidor
```
public_html/
├── orderLoader/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── media/
│   ├── images/
│   │   └── logo.png
│   ├── index.html
│   ├── .htaccess
│   └── favicon.ico
└── otros archivos...
```

### 5. URLs de acceso
- **Subdominio:** `https://orderLoader.tu-dominio.com`
- **Subcarpeta:** `https://tu-dominio.com/orderLoader`

## 🔧 Configuraciones importantes

### Archivos incluidos en el build:
- ✅ `index.html` - Página principal
- ✅ `static/` - CSS y JS optimizados
- ✅ `.htaccess` - Configuración de Apache
- ✅ `images/logo.png` - Logo del cliente
- ✅ `favicon.ico` - Icono del sitio

### Archivos NO incluidos (por seguridad):
- ❌ `src/` - Código fuente
- ❌ `public/data/` - Archivos de productos
- ❌ `public/outputs_json/` - Órdenes generadas
- ❌ `node_modules/` - Dependencias

## 🛡️ Seguridad

### Archivos protegidos:
- Los archivos de datos del cliente están en `.gitignore`
- El logo del cliente se protege automáticamente
- Headers de seguridad configurados en `.htaccess`

### Recomendaciones:
1. Cambia las contraseñas de FTP después del despliegue
2. Mantén actualizado el panel de GoDaddy
3. Haz backups regulares de los archivos de datos

## 🚨 Solución de problemas

### Error 404:
- Verifica que el `.htaccess` esté en la carpeta correcta
- Asegúrate de que mod_rewrite esté habilitado en GoDaddy

### Error de rutas:
- Verifica que todos los archivos estén en la carpeta correcta
- Asegúrate de que el `index.html` esté en la raíz de `orderLoader`

### Problemas de carga:
- Verifica que los archivos `static/` estén completos
- Revisa los logs de error en el panel de GoDaddy

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de error en GoDaddy
2. Verifica que todos los archivos estén subidos
3. Contacta al soporte de GoDaddy si es necesario

---

**Nota:** Esta aplicación es completamente estática y no requiere base de datos ni configuración de servidor adicional.
