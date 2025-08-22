# 🚀 Despliegue Automático con GitHub

## 🎯 **3 Opciones de Despliegue**

### **Opción 1: GitHub Pages (Más fácil)**
- ✅ Gratis
- ✅ Automático
- ✅ URL: `https://tu-usuario.github.io/orderLoaderUI`

### **Opción 2: GitHub Pages + Dominio Personalizado**
- ✅ Gratis
- ✅ Tu dominio personalizado
- ✅ URL: `https://orderLoader.tu-dominio.com`

### **Opción 3: Despliegue directo a GoDaddy**
- ✅ Automático
- ✅ Tu servidor GoDaddy
- ✅ URL: `https://orderLoader.tu-dominio.com`

---

## 🚀 **PASO 1: Instalar dependencias**

```bash
npm install gh-pages --save-dev
```

---

## 🚀 **PASO 2: Configurar GitHub**

### **Para Opción 1 (GitHub Pages básico):**

1. **Hacer commit y push:**
```bash
git add .
git commit -m "Configurar despliegue automático"
git push origin main
```

2. **Activar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Save

3. **Desplegar:**
```bash
npm run deploy
```

### **Para Opción 2 (GitHub Pages + Dominio):**

1. **Configurar CNAME:**
   - En tu repositorio, ve a Settings → Pages
   - Agrega tu dominio: `orderLoader.tu-dominio.com`
   - Guarda

2. **Configurar DNS en GoDaddy:**
   - CNAME: `orderLoader` → `tu-usuario.github.io`
   - TTL: 600

3. **Desplegar:**
```bash
npm run deploy
```

### **Para Opción 3 (Despliegue directo a GoDaddy):**

1. **Configurar Secrets en GitHub:**
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Agrega estos secrets:
     - `FTP_SERVER`: tu-servidor-godaddy.com
     - `FTP_USERNAME`: tu-usuario-ftp
     - `FTP_PASSWORD`: tu-contraseña-ftp

2. **Hacer push para desplegar:**
```bash
git add .
git commit -m "Configurar despliegue automático a GoDaddy"
git push origin main
```

---

## 🔧 **Configuración de Dominio**

### **Si usas tu dominio personalizado:**

1. **Actualizar package.json:**
```json
{
  "homepage": "https://orderLoader.tu-dominio.com"
}
```

2. **Crear archivo CNAME:**
```
orderLoader.tu-dominio.com
```

---

## 🛡️ **Seguridad**

### **Archivos protegidos automáticamente:**
- ✅ `src/` - Código fuente
- ✅ `public/data/` - Datos del cliente
- ✅ `public/outputs_json/` - Órdenes generadas
- ✅ `node_modules/` - Dependencias

### **Solo se despliegan:**
- ✅ `build/` - Archivos optimizados
- ✅ `images/logo.png` - Logo del cliente
- ✅ `.htaccess` - Configuración del servidor

---

## 🚨 **Solución de problemas**

### **Error de build:**
```bash
npm run build
# Revisa los errores y corrígelos
```

### **Error de despliegue:**
- Verifica que el repositorio sea público (para GitHub Pages gratuito)
- Revisa los logs en Actions tab

### **DNS no funciona:**
- Espera hasta 24 horas para propagación
- Verifica la configuración del CNAME

---

## 📋 **Comandos útiles**

```bash
# Desplegar manualmente
npm run deploy

# Ver build local
npm run build

# Probar localmente
npm start

# Ver logs de despliegue
# Ve a tu repositorio → Actions tab
```

---

## 🎉 **Ventajas del despliegue automático**

1. **Automático:** Cada push a main se despliega
2. **Versionado:** Cada despliegue tiene su versión
3. **Rollback:** Puedes volver a versiones anteriores
4. **Historial:** Logs completos de cada despliegue
5. **Seguro:** Credenciales protegidas en secrets

---

**¿Qué opción prefieres? Te recomiendo la Opción 2 (GitHub Pages + tu dominio) porque es gratis y profesional.**
