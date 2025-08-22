# ✅ Lista de Verificación Pre-Despliegue

## 🔧 Configuración del Proyecto

### ✅ Build de Producción
- [ ] `npm run build` ejecutado sin errores
- [ ] Carpeta `build/` creada correctamente
- [ ] Archivos optimizados y minificados

### ✅ Archivos Críticos
- [ ] `build/index.html` existe
- [ ] `build/static/css/` contiene archivos CSS
- [ ] `build/static/js/` contiene archivos JS
- [ ] `build/.htaccess` configurado
- [ ] `build/images/logo.png` incluido

### ✅ Configuración de Dominio
- [ ] `package.json` tiene `homepage` configurado
- [ ] URL del dominio actualizada en la configuración

## 🌐 Configuración en GoDaddy

### ✅ DNS/Subdominio
- [ ] CNAME `orderLoader` creado en DNS
- [ ] TTL configurado (600 o por defecto)
- [ ] Propagación DNS completada (puede tomar hasta 24h)

### ✅ Hosting
- [ ] Acceso FTP/SFTP configurado
- [ ] Credenciales de acceso disponibles
- [ ] Espacio suficiente en el hosting

## 📁 Estructura de Archivos

### ✅ En el servidor (public_html/orderLoader/)
```
orderLoader/
├── index.html
├── .htaccess
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── images/
│   └── logo.png
└── favicon.ico
```

## 🛡️ Seguridad

### ✅ Archivos Protegidos
- [ ] `src/` NO subido al servidor
- [ ] `public/data/` NO subido al servidor
- [ ] `public/outputs_json/` NO subido al servidor
- [ ] `node_modules/` NO subido al servidor

### ✅ Headers de Seguridad
- [ ] `.htaccess` incluye headers de seguridad
- [ ] Compresión habilitada
- [ ] Cache configurado

## 🧪 Pruebas

### ✅ Funcionalidad
- [ ] Aplicación carga correctamente
- [ ] Logo del cliente se muestra
- [ ] Footer con marca visible
- [ ] Formularios funcionan
- [ ] Búsqueda de productos funciona
- [ ] Generación de órdenes funciona

### ✅ Responsive
- [ ] Funciona en desktop
- [ ] Funciona en tablet
- [ ] Funciona en móvil

### ✅ Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 🚀 Despliegue Final

### ✅ Subida de Archivos
- [ ] Todos los archivos de `build/` subidos
- [ ] Estructura de carpetas correcta
- [ ] Permisos de archivos correctos (644 para archivos, 755 para carpetas)

### ✅ Verificación Post-Despliegue
- [ ] URL accesible: `https://orderLoader.tu-dominio.com`
- [ ] Sin errores 404
- [ ] Sin errores de JavaScript en consola
- [ ] Tiempo de carga aceptable
- [ ] SSL/HTTPS funcionando

## 📞 Contacto de Emergencia

Si algo sale mal:
1. Revisa los logs de error en GoDaddy
2. Verifica la configuración DNS
3. Contacta soporte de GoDaddy
4. Documenta el problema para futuras referencias

---

**Nota:** Marca cada ítem como completado antes de considerar el despliegue exitoso.
