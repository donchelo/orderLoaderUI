# Claude.md - OrderLoaderUI

## 📋 Resumen Ejecutivo

**OrderLoaderUI** es una aplicación React moderna para la generación de órdenes de compra corporativas. Permite cargar productos desde archivos XLSX/CSV, buscar productos, gestionar líneas de pedido y generar órdenes de compra con cálculos automáticos de precios basados en escalas de cantidad.

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
orderLoaderUI/
├── public/
│   ├── index.html              # HTML principal de React
│   ├── data/                   # Archivos de datos (NO se suben a Git)
│   │   ├── productos.xlsx      # Base de datos en Excel (privada)
│   │   ├── productos.csv       # Base de datos en CSV (privada)
│   │   └── README.md           # Documentación de estructura de datos
│   └── outputs_json/           # Archivos JSON generados (NO se suben a Git)
│       ├── Procesados/         # Órdenes procesadas
│       └── README.md           # Documentación de JSONs
├── src/
│   ├── components/             # Componentes React (REFACTORIZADO)
│   │   ├── Header/             # Componente de encabezado
│   │   │   ├── Header.js
│   │   │   └── Header.css
│   │   ├── ClientForm/         # Formulario de cliente
│   │   │   ├── ClientForm.js
│   │   │   └── ClientForm.css
│   │   ├── ProductSearch/      # Búsqueda de productos
│   │   ├── OrderTable/         # Tabla de líneas de pedido
│   │   ├── OrderSummary/       # Resumen de orden
│   │   └── SuccessMessage/     # Mensaje de éxito
│   ├── hooks/                  # Hooks personalizados (NUEVO)
│   │   ├── useProducts.js      # Gestión de productos
│   │   ├── useClient.js        # Gestión de cliente
│   │   └── useOrder.js         # Gestión de orden
│   ├── utils/                  # Utilidades (NUEVO)
│   │   └── jsonGenerator.js    # Generación de JSON
│   ├── App.js                  # Componente principal (REFACTORIZADO - 386 líneas)
│   ├── index.js                # Punto de entrada de React
│   ├── index.css               # Estilos globales y variables CSS
│   └── design-system/          # Sistema de diseño (estructura preparada)
│       ├── atoms/              # Componentes atómicos
│       ├── molecules/          # Componentes moleculares
│       └── organisms/          # Componentes orgánicos
├── package.json                # Dependencias: React 18, XLSX, etc.
├── .gitignore                  # Excluye archivos de datos privados
└── README.md                   # Documentación completa del proyecto
```

### Tecnologías Principales
- **React 18** con Hooks (useState, useEffect, useRef)
- **SheetJS (XLSX)** para lectura de archivos Excel
- **CSS3** con Grid, Flexbox y variables CSS
- **JavaScript ES6+** con funcionalidades modernas

## 🎯 Funcionalidades Principales

### 1. Carga de Datos
- **Prioridad**: XLSX → CSV → Datos por defecto
- **Ubicación**: `public/data/productos.xlsx` y `public/data/productos.csv`
- **Estructura esperada**: 13 columnas (A-M) con información de productos
- **Seguridad**: Los archivos de datos están excluidos del control de versiones

## 🔧 Refactorización del Código (Fase 1 - COMPLETADA)

### Hooks Personalizados Implementados

#### useProducts.js
- **Gestión completa de productos**: Carga desde archivos, escalas de precios
- **Funciones**: `loadProductsFromFile()`, `calculatePriceByQuantity()`
- **Estados**: `products`, `priceScales`, `productsLoaded`, `loadingProducts`, `availableClients`

#### useClient.js
- **Gestión de cliente por NIT**: Autenticación y filtrado
- **Funciones**: `handleNITChange()`, `resetClient()`
- **Estados**: `selectedClient`, `clientNIT`, `isNITLocked`, `filteredProducts`

#### useOrder.js
- **Gestión completa de órdenes**: Formularios, líneas, búsqueda
- **Funciones**: `addLineItem()`, `updateQuantity()`, `removeLineItem()`, `resetOrder()`
- **Estados**: `formData`, `lineItems`, `searchResults`, `total`

### Componentes Creados

#### Header.js
- **Propósito**: Mostrar título y estado de carga
- **Props**: `loadingProducts`, `productsLoaded`
- **Estilos**: `Header.css` con diseño moderno

#### ClientForm.js
- **Propósito**: Formulario de entrada del NIT del cliente
- **Props**: `clientNIT`, `handleNITChange`, `selectedClient`, `isNITLocked`, `filteredProducts`
- **Características**: Campo bloqueado cuando NIT es válido, feedback visual

### Utilidades

#### jsonGenerator.js
- **Generación de JSON**: `generateOrderJSON()` con estructura estándar
- **Descarga de archivos**: `downloadJSON()` con nombres únicos
- **Formato**: Estructura específica requerida por el sistema

### Beneficios de la Refactorización
- **Código más mantenible**: Separación de responsabilidades
- **Reutilización**: Hooks y componentes reutilizables
- **Legibilidad**: Código más claro y organizado
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testing**: Componentes más fáciles de probar

### 2. Gestión de Productos
- **Búsqueda inteligente**: Por código o nombre (mínimo 2 caracteres)
- **Filtrado por NIT**: Muestra solo productos del cliente con el NIT ingresado
- **Escalas de precios**: Cálculo automático basado en cantidad
- **Validación**: Solo productos con precio > 0

### 3. Gestión de Pedidos
- **Líneas de pedido**: Agregar, editar, eliminar productos
- **Cálculos automáticos**: Totales, subtotales, impuestos
- **Validación de formularios**: Campos requeridos y fechas mínimas
- **Generación de órdenes**: Formato estructurado para impresión
- **Exportación JSON**: Generación automática de archivos JSON con estructura estándar
- **Limpieza automática**: El sistema se limpia automáticamente después de generar una orden

## 📊 Estructura de Datos

### Productos (Array de objetos)
```javascript
{
  ref: "REF001",           // Referencia del producto
  name: "Producto Alpha",   // Nombre del producto
  categoria: "General",     // Categoría
  empresa: "Empresa SAS",   // Empresa proveedora
  nit: "900123456-7",       // NIT del cliente
  descripcion: "Descripción del producto"
}
```

### Escalas de Precios (Objeto)
```javascript
{
  "REF001": [
    { cantidad: 1, precio: 25000 },
    { cantidad: 10, precio: 22000 },
    { cantidad: 50, precio: 20000 }
  ]
}
```

### Estado Principal (App.js)
```javascript
const [formData, setFormData] = useState({
  deliveryDate: '',    // Fecha de entrega
  documentDate: '',    // Fecha del documento
  notes: ''           // Observaciones
});

const [lineItems, setLineItems] = useState([]);        // Líneas del pedido
const [selectedProduct, setSelectedProduct] = useState(null);  // Producto seleccionado
const [searchResults, setSearchResults] = useState([]);        // Resultados de búsqueda
const [selectedClient, setSelectedClient] = useState('');      // Nombre del cliente (se establece automáticamente)
const [clientNIT, setClientNIT] = useState('');               // NIT del cliente ingresado
const [isNITLocked, setIsNITLocked] = useState(false);        // Estado de bloqueo del campo NIT
```

## 🔧 Funciones Clave

### Carga de Productos (`loadProductsFromFile`)
- Intenta cargar XLSX primero, luego CSV como respaldo
- Procesa datos y crea arrays de productos y escalas de precios
- Extrae clientes únicos para el filtrado
- Usa datos por defecto si no encuentra archivos

### Cálculo de Precios (`calculatePriceByQuantity`)
- Recibe referencia del producto y cantidad
- Busca en las escalas de precios disponibles
- Retorna el precio correspondiente a la cantidad
- Logs detallados para debugging

### Búsqueda de Productos
- Filtra por NIT del cliente ingresado
- Búsqueda por código o nombre
- Mínimo 2 caracteres para activar búsqueda
- Resultados en tiempo real

## 🎨 Sistema de Diseño

### Variables CSS (index.css)
```css
:root {
  --primary-color: #3498db;    // Azul principal
  --success-color: #27ae60;    // Verde éxito
  --warning-color: #f39c12;    // Amarillo advertencia
  --danger-color: #e74c3c;     // Rojo error
  --text-color: #2c3e50;       // Texto principal
  --background-color: #ecf0f1; // Fondo
}
```

### Componentes Preparados
- **Atoms**: Componentes básicos (botones, inputs, etc.)
- **Molecules**: Componentes compuestos (formularios, cards, etc.)
- **Organisms**: Componentes complejos (páginas, layouts, etc.)

## 🔐 Sistema de Autenticación por NIT

### Funcionamiento
- **Campo de entrada**: El usuario ingresa el NIT del cliente
- **Validación automática**: El sistema busca productos asociados a ese NIT
- **Bloqueo automático**: Una vez validado, el campo NIT se bloquea para evitar cambios
- **Filtrado seguro**: Solo se muestran productos del cliente autenticado
- **Feedback visual**: Mensajes de confirmación o error según el resultado
- **Desbloqueo**: Solo se puede cambiar el NIT usando el botón "Limpiar"

### Ventajas de Seguridad
- **No hay lista de clientes visible**: Los NITs no se muestran en dropdowns
- **Acceso controlado**: Solo clientes con NIT válido pueden ver sus productos
- **Campo bloqueado**: Una vez validado, el NIT no se puede modificar accidentalmente
- **Filtrado automático**: Los productos se filtran automáticamente por NIT
- **Validación en tiempo real**: Feedback inmediato sobre NIT válido/inválido
- **Prevención de errores**: Evita cambios accidentales durante el proceso de pedido

## 📄 Generación de Archivos JSON

### Funcionamiento
- **Generación automática**: Al presionar "Generar Orden de Compra" se crea un archivo JSON
- **Descarga automática**: El archivo se descarga automáticamente al navegador
- **Estructura estándar**: Sigue el formato requerido por el sistema RPA
- **Nombres únicos**: Cada archivo tiene un nombre único con timestamp y ID
- **Limpieza automática**: El sistema se limpia automáticamente después de 3 segundos

### Estructura del JSON
```json
{
  "orden_compra": "4601527343",
  "fecha_entrega": "28/08/2025",
  "comprador": {
    "nit": "CN890900608",
    "nombre": "Almacenes Éxito S.A."
  },
  "items": [
    {
      "descripcion": "4002076 ETQ BLANCA 5.8X6 (PP)(TD) FILIZOLA",
      "codigo": "4002076",
      "cantidad": 125000,
      "precio_unitario": 34,
      "precio_total": 4250000,
      "fecha_entrega": "28/08/2025"
    }
  ],
  "valor_base": 4250000,
  "total_items_unicos": 1,
  "numero_items_totales": 125000
}
```

### Convención de Nombres
Los archivos se nombran siguiendo el patrón:
`[orden_compra][timestamp]R[random_id]-[nit_numerico]-[items_unicos]-[total_items].json`

Ejemplo: `460152734321081112R720-9008516551-7001-05001.json`

### Ubicación de Archivos
- **Carpeta**: `public/outputs_json/Procesados/`
- **Documentación**: `public/outputs_json/README.md`
- **Seguridad**: Los archivos JSON están excluidos del control de versiones

## 🔒 Seguridad y Privacidad

### Archivos Excluidos (.gitignore)
```
/public/data/productos.xlsx
/public/data/productos.csv
/public/data/*.xlsx
/public/data/*.csv
/public/outputs_json/Procesados/*.json
```

### Razón
Los archivos de datos contienen información privada de la empresa (productos, precios, clientes) y no deben comprometerse al repositorio Git.

## 🚀 Scripts Disponibles

```bash
npm start      # Desarrollo (localhost:3000)
npm run build  # Producción
npm test       # Pruebas unitarias
npm run eject  # Exponer configuración webpack
```

## 🐛 Debugging y Logs

### Logs Importantes
- `📊 Cargando desde archivo XLSX/CSV...`
- `✅ Productos cargados: X`
- `🏢 NITs de clientes disponibles: X`
- `🔒 NIT XXXX bloqueado - Cliente válido encontrado`
- `🔍 Calculando precio para REF001, cantidad: 10`
- `✅ Escala seleccionada: 10+ unidades = $22000`
- `🧹 Limpiando sistema después de generar orden...`
- `✅ Sistema limpiado automáticamente después de generar orden`

### Errores Comunes
1. **Archivos no encontrados**: Usa datos por defecto
2. **Formato incorrecto**: Verifica estructura de columnas
3. **Precios vacíos**: Solo productos con precio > 0

## 🔮 Estado Actual y Mejoras Futuras

### Implementado ✅
- Carga de datos desde XLSX/CSV
- Búsqueda y filtrado de productos por NIT del cliente
- Gestión de líneas de pedido
- Cálculo automático de precios
- Validación de formularios
- Interfaz responsiva
- Sistema de autenticación por NIT (más seguro)
- Generación automática de archivos JSON
- Limpieza automática del sistema después de generar órdenes

### Pendiente 🚧
- Persistencia en localStorage
- Exportación a PDF
- Autenticación de usuarios
- API REST backend
- Tema oscuro
- PWA (Progressive Web App)

## 📝 Notas para Desarrolladores

### Al Modificar App.js
- El archivo tiene 901 líneas - considerar refactorización
- Separar lógica de negocio en hooks personalizados
- Implementar sistema de diseño existente
- Mantener logs para debugging

### Al Agregar Funcionalidades
- Seguir el patrón de estado existente
- Mantener compatibilidad con archivos de datos
- Agregar validaciones apropiadas
- Documentar cambios en README.md

### Al Trabajar con Datos
- Los archivos de datos son privados
- Siempre validar estructura antes de procesar
- Proporcionar datos por defecto como respaldo
- Mantener logs informativos

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Desarrollado con**: React 18 + SheetJS
