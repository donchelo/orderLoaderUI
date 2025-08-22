# 🚀 Despliegue Automático con GitHub Pages

## 🎯 **Configuración Actual**

### **✅ GitHub Pages + Dominio Personalizado**
- ✅ Gratis
- ✅ Tu dominio personalizado
- ✅ URL: `https://orderLoader.ai4u.com.co`
- ✅ Despliegue automático
- ✅ SSL/HTTPS incluido

---

## 🚀 **PASO 1: Instalar dependencias**

```bash
npm install gh-pages --save-dev
```

---

## 🚀 **PASO 2: Configurar GitHub Pages**

### **1. Hacer commit y push:**
```bash
git add .
git commit -m "Configurar despliegue automático"
git push origin master
```

### **2. Activar GitHub Pages:**
- Ve a tu repositorio en GitHub
- Settings → Pages
- Source: "Deploy from a branch"
- Branch: `gh-pages`
- Custom domain: `orderLoader.ai4u.com.co`
- Save

### **3. Desplegar:**
```bash
npm run deploy
```

---

## 🔧 **Configuración de DNS**

### **Configurar CNAME en tu proveedor de DNS:**
- **Nombre:** `orderLoader`
- **Valor:** `tu-usuario.github.io`
- **TTL:** 600

### **Ejemplo:**
Si tu usuario de GitHub es `donchelo`, el CNAME debe ser:
- **Nombre:** `orderLoader`
- **Valor:** `donchelo.github.io`

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

1. **Automático:** Cada push a master se despliega
2. **Versionado:** Cada despliegue tiene su versión
3. **Rollback:** Puedes volver a versiones anteriores
4. **Historial:** Logs completos de cada despliegue
5. **Gratis:** GitHub Pages es completamente gratuito

---

**Tu aplicación está configurada para desplegarse automáticamente en `https://orderLoader.ai4u.com.co` usando GitHub Pages.**