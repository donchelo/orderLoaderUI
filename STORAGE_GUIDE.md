# 📁 Guía de Almacenamiento de Archivos JSON

## Descripción del Sistema

El sistema OrderLoaderUI implementa un **doble sistema de guardado** que sigue las mejores prácticas para el manejo de archivos JSON de órdenes de compra.

## 🏗️ Estructura de Carpetas

```
orderLoaderUI/
├── public/
│   └── outputs_json/
│       ├── Ordenes/           ← 📋 Órdenes de compra generadas
│       │   ├── README.md
│       │   └── *.json         ← Archivos de órdenes (ignorados por git)
│       └── Procesados/        ← 📄 Otros archivos JSON procesados
│           ├── README.md
│           └── *.json         ← Archivos procesados (ignorados por git)
└── src/
    └── utils/
        ├── fileStorage.js     ← 💾 Servicio de almacenamiento
        └── jsonGenerator.js   ← 🔧 Generador de JSON
```

## 💾 Sistema de Guardado Dual

### 1. **Guardado Local en el Proyecto**
- **Ubicación**: `public/outputs_json/Ordenes/`
- **Propósito**: Backup y trazabilidad en el servidor
- **Beneficios**:
  - Historial completo de órdenes
  - Respaldo automático
  - Acceso desde el servidor
  - Integración con sistemas de backup

### 2. **Descarga al Navegador**
- **Ubicación**: Carpeta de descargas del usuario
- **Propósito**: Acceso inmediato para el usuario
- **Beneficios**:
  - Disponible inmediatamente
  - Compatible con todos los navegadores
  - Fácil acceso para el usuario
  - No depende del servidor

## 📝 Formato de Nombres de Archivo

```
TAM-00001_20241225T172930_9001234567_0002_00005.json
│         │                │          │    │
│         │                │          │    └── Total de items (5 dígitos)
│         │                │          └────── Items únicos (4 dígitos)
│         │                └──────────────── NIT del cliente (solo números)
│         └────────────────────────────────── Timestamp (AAAAMMDDTHHMMSS)
└─────────────────────────────────────────── Número de orden consecutivo
```

## 🔧 Funcionalidades del Sistema

### **FileStorageService**
- ✅ Guardado dual (local + descarga)
- ✅ Gestión de errores robusta
- ✅ Backup en localStorage
- ✅ Tracking de archivos generados
- ✅ Limpieza automática de referencias antiguas

### **Historial de Órdenes**
- 📋 Lista de todas las órdenes generadas
- 🔍 Información detallada de cada orden
- 📅 Fechas de creación
- 💰 Valores totales
- 📁 Ubicaciones de archivos

## 🚀 Ventajas del Sistema

### **Para Desarrolladores**
- **Modularidad**: Código organizado en servicios especializados
- **Escalabilidad**: Fácil de extender con nuevas funcionalidades
- **Mantenibilidad**: Lógica separada y bien documentada
- **Testing**: Fácil de probar cada componente

### **Para Usuarios**
- **Doble seguridad**: Archivos guardados en dos ubicaciones
- **Acceso inmediato**: Descarga automática al navegador
- **Historial completo**: Lista de todas las órdenes generadas
- **Trazabilidad**: Seguimiento completo de archivos

### **Para la Empresa**
- **Backup automático**: Archivos guardados en el servidor
- **Auditoría**: Registro completo de todas las transacciones
- **Integración**: Fácil conexión con otros sistemas
- **Compliance**: Cumple con estándares de almacenamiento

## 🔒 Configuración de Seguridad (.gitignore)

```gitignore
# Archivos JSON generados (órdenes de compra)
/public/outputs_json/Procesados/*.json
/public/outputs_json/Ordenes/*.json

# Mantener estructura de carpetas pero ignorar contenido
!/public/outputs_json/Ordenes/README.md
!/public/outputs_json/Procesados/README.md
```

## 📊 Monitoreo y Mantenimiento

### **Limpieza Automática**
- Referencias antiguas se limpian automáticamente
- Configurable por días (por defecto 30 días)
- Mantiene solo las últimas 100 referencias en memoria

### **Logs y Debugging**
- Logs detallados en consola del navegador
- Tracking de errores y éxitos
- Información de rendimiento

## 🛠️ Configuración y Personalización

### **Cambiar Ubicación de Guardado**
```javascript
// En src/utils/fileStorage.js
constructor() {
  this.baseUrl = '/outputs_json/Ordenes/'; // Cambiar aquí
}
```

### **Modificar Formato de Nombre**
```javascript
// En src/utils/jsonGenerator.js
fileName: `${orderNumber}_${timestamp}_${clientNIT.replace(/[^0-9]/g, '')}_${uniqueItems.toString().padStart(4, '0')}_${totalItems.toString().padStart(5, '0')}.json`
```

## 🔄 Flujo de Trabajo

1. **Usuario genera orden** → Sistema crea JSON
2. **Guardado local** → Archivo se guarda en `public/outputs_json/Ordenes/`
3. **Descarga automática** → Archivo se descarga al navegador
4. **Registro de referencia** → Se guarda metadata en localStorage
5. **Actualización de historial** → UI se actualiza con nueva orden

## 📞 Soporte y Mantenimiento

Para modificaciones o problemas:
- Revisar logs en consola del navegador
- Verificar permisos de carpetas
- Comprobar espacio en localStorage
- Validar estructura de archivos JSON
