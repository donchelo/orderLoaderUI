# Sistema de Pedidos - React

Una aplicación React moderna para la generación de órdenes de compra corporativas, desarrollada con las mejores prácticas de React y una interfaz de usuario intuitiva.

## 🚀 Características Principales

- **Interfaz moderna y responsiva**: Diseño limpio y profesional con CSS Grid y Flexbox
- **Búsqueda inteligente de productos**: Sistema de búsqueda con autocompletado y filtrado
- **Gestión dinámica de líneas de pedido**: Agregar, editar y eliminar productos en tiempo real
- **Cálculo automático de precios**: Sistema de escalas de precios basado en cantidades
- **Validación de formularios**: Campos requeridos y validaciones en tiempo real
- **Carga de datos desde archivos**: Soporte para archivos XLSX y CSV
- **Diseño completamente responsivo**: Optimizado para desktop, tablet y móvil

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm start
   ```

4. **Abrir en el navegador**:
   La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🎯 Funcionalidades

### Información General del Pedido
- **Empresa**: Campo obligatorio para el nombre de la empresa cliente
- **Fecha de Entrega**: Fecha mínima es hoy, validación automática
- **Observaciones**: Campo opcional para información adicional del pedido

### Sistema de Búsqueda de Productos
1. **Búsqueda inteligente**: Escribe en el campo de búsqueda (mínimo 2 caracteres)
2. **Resultados filtrados**: Se muestran productos que coinciden con la búsqueda
3. **Selección de producto**: Haz clic en el producto deseado de la lista
4. **Información detallada**: Se muestra descripción, precio y escalas disponibles

### Gestión de Líneas de Pedido
- **Agregar productos**: Selecciona producto y cantidad, luego "Agregar"
- **Editar cantidad**: Cambia la cantidad directamente en la tabla
- **Eliminar productos**: Usa el botón "Eliminar" en cada línea
- **Cálculo automático**: Totales se actualizan en tiempo real
- **Escalas de precios**: Precios se ajustan automáticamente según la cantidad

### Acciones del Sistema
- **Limpiar formulario**: Resetea todo el pedido
- **Generar Orden**: Crea la orden de compra con todos los datos
- **Validación completa**: Verifica que todos los campos requeridos estén completos

## 🏗️ Arquitectura del Proyecto

```
orderLoaderUI/
├── public/
│   ├── index.html              # HTML principal de React
│   └── data/                   # Archivos de datos (opcional)
│       ├── productos.xlsx      # Base de datos en Excel
│       └── productos.csv       # Base de datos en CSV
├── src/
│   ├── App.js                  # Componente principal de la aplicación
│   ├── index.js                # Punto de entrada de React
│   └── index.css               # Estilos globales y variables CSS
├── package.json                # Configuración del proyecto y dependencias
├── .gitignore                  # Archivos ignorados por Git
└── README.md                   # Documentación del proyecto
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca principal de interfaz de usuario
- **React Hooks**: useState, useEffect, useRef para gestión de estado
- **CSS3**: Estilos modernos con Grid, Flexbox y variables CSS
- **JavaScript ES6+**: Funcionalidades modernas del lenguaje

### Librerías
- **SheetJS (XLSX)**: Para lectura de archivos Excel
- **Create React App**: Configuración y build del proyecto

## 📊 Base de Datos de Productos

### Productos por Defecto
La aplicación incluye una base de datos simulada con productos de ejemplo:

| Referencia | Nombre | Precio Base | Escalas de Precio |
|------------|--------|-------------|-------------------|
| REF001 | Producto Alpha Series | $25,000 | 1-9: $25,000, 10-49: $22,000, 50+: $20,000 |
| REF002 | Producto Beta Professional | $35,000 | 1-4: $35,000, 5-19: $32,000, 20+: $30,000 |
| REF003 | Producto Gamma Enterprise | $45,000 | 1-5: $45,000, 6-25: $42,000, 26+: $40,000 |
| REF004 | Producto Delta Industrial | $55,000 | 1-3: $55,000, 4-15: $52,000, 16+: $50,000 |
| REF005 | Sistema Alpha Control | $75,000 | 1-2: $75,000, 3-10: $72,000, 11+: $70,000 |
| REF006 | Módulo Beta Integration | $42,000 | 1-8: $42,000, 9-30: $40,000, 31+: $38,000 |
| REF007 | Componente Gamma Advanced | $38,000 | 1-6: $38,000, 7-20: $36,000, 21+: $34,000 |

### Carga desde Archivos
La aplicación puede cargar productos desde:
- **Archivos XLSX**: Formato Excel (.xlsx)
- **Archivos CSV**: Formato de texto separado por comas
- **Datos por defecto**: Si no se encuentran archivos externos

## 🚀 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Ejecuta la aplicación en modo desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm test` | Ejecuta las pruebas unitarias |
| `npm run eject` | Expone la configuración de webpack (irreversible) |

## 🔧 Configuración y Personalización

### Variables CSS
El proyecto utiliza variables CSS para facilitar la personalización:

```css
:root {
  --primary-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  --text-color: #2c3e50;
  --background-color: #ecf0f1;
}
```

### Estructura de Datos
Los productos siguen esta estructura:
```javascript
{
  ref: "REF001",
  name: "Producto Alpha Series",
  categoria: "General",
  empresa: "Empresa Cliente",
  descripcion: "Descripción del producto"
}
```

## 📱 Diseño Responsivo

La aplicación está optimizada para:
- **Desktop**: Pantallas grandes con layout completo
- **Tablet**: Adaptación automática para pantallas medianas
- **Móvil**: Interfaz optimizada para pantallas pequeñas

## 🐛 Solución de Problemas

### Errores Comunes

1. **Error de puerto ocupado**:
   ```bash
   # Cambiar puerto
   PORT=3001 npm start
   ```

2. **Error de dependencias**:
   ```bash
   # Limpiar caché e instalar
   npm cache clean --force
   npm install
   ```

3. **Error de archivos de datos**:
   - Verificar que los archivos estén en `public/data/`
   - La aplicación usará datos por defecto si no encuentra archivos

### Logs de Desarrollo
- Los datos de las órdenes se muestran en la consola del navegador
- Mensajes informativos sobre la carga de productos
- Errores y advertencias detallados

## 🔮 Próximas Mejoras

- [ ] **Persistencia de datos**: Guardar pedidos en localStorage
- [ ] **Exportación PDF**: Generar órdenes en formato PDF
- [ ] **Autenticación**: Sistema de usuarios y permisos
- [ ] **API REST**: Conectar con backend real
- [ ] **Tema oscuro**: Modo oscuro opcional
- [ ] **PWA**: Convertir en Progressive Web App

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Revisar la documentación
- Verificar los logs de la consola
- Crear un issue en el repositorio

---

**Desarrollado con ❤️ usando React**
