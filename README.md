# Sistema de Pedidos - React

Una aplicación React para la generación de órdenes de compra corporativas, convertida desde el código HTML original.

## Características

- **Interfaz moderna y responsiva**: Diseño limpio y profesional
- **Búsqueda de productos**: Sistema de búsqueda con autocompletado
- **Gestión de líneas de pedido**: Agregar, editar y eliminar productos
- **Cálculo automático de totales**: Actualización en tiempo real
- **Validación de formularios**: Campos requeridos y validaciones
- **Diseño responsivo**: Compatible con dispositivos móviles

## Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm start
   ```

3. **Abrir en el navegador**:
   La aplicación se abrirá automáticamente en `http://localhost:3000`

## Uso

### Información General
- **Empresa**: Campo obligatorio para el nombre de la empresa
- **Fecha de Entrega**: Fecha mínima es hoy
- **Observaciones**: Campo opcional para información adicional

### Gestión de Productos
1. **Buscar producto**: Escribe en el campo de búsqueda (mínimo 2 caracteres)
2. **Seleccionar producto**: Haz clic en el producto de la lista de resultados
3. **Definir cantidad**: Establece la cantidad deseada
4. **Agregar al pedido**: Haz clic en "Agregar"

### Líneas de Pedido
- **Editar cantidad**: Cambia la cantidad directamente en la tabla
- **Eliminar producto**: Usa el botón "Eliminar" en cada línea
- **Total automático**: Se calcula automáticamente al agregar/modificar productos

### Acciones
- **Limpiar**: Resetea todo el formulario
- **Generar Orden**: Crea la orden de compra (los datos se muestran en consola)

## Estructura del Proyecto

```
orderLoaderUI/
├── public/
│   └── index.html          # HTML principal
├── src/
│   ├── App.js              # Componente principal
│   ├── index.js            # Punto de entrada
│   └── index.css           # Estilos globales
├── package.json            # Dependencias y scripts
└── README.md              # Este archivo
```

## Tecnologías Utilizadas

- **React 18**: Biblioteca de interfaz de usuario
- **CSS Grid/Flexbox**: Layout responsivo
- **JavaScript ES6+**: Funcionalidades modernas
- **Hooks de React**: useState, useEffect, useRef

## Base de Datos de Productos

La aplicación incluye una base de datos simulada con los siguientes productos:

- REF001: Producto Alpha Series - $25,000
- REF002: Producto Beta Professional - $35,000
- REF003: Producto Gamma Enterprise - $45,000
- REF004: Producto Delta Industrial - $55,000
- REF005: Sistema Alpha Control - $75,000
- REF006: Módulo Beta Integration - $42,000
- REF007: Componente Gamma Advanced - $38,000

## Scripts Disponibles

- `npm start`: Ejecuta la aplicación en modo desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas
- `npm run eject`: Expone la configuración de webpack (irreversible)

## Notas de Desarrollo

- La aplicación está completamente funcional y lista para usar
- Los datos de las órdenes se muestran en la consola del navegador
- El diseño es completamente responsivo
- Se mantiene toda la funcionalidad del HTML original
