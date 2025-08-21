# Base de Datos de Productos

Esta carpeta contiene los archivos de productos de la empresa.

## Archivos Requeridos

Para que la aplicación funcione correctamente, necesitas colocar aquí tu archivo de productos:

- `productos.xlsx` - Tu archivo Excel original
- `productos.csv` - Archivo CSV generado automáticamente (se crea al convertir el Excel)

## Estructura del Archivo

Tu archivo Excel debe tener las siguientes columnas (en este orden):

| Columna | Nombre | Descripción | Ejemplo |
|---------|--------|-------------|---------|
| A | Número de artículo | Referencia del producto | REF001 |
| B | Descripción del artículo | Nombre del producto | Producto Alpha Series |
| C | Código SN | Código del proveedor | CN123456789 |
| D | Nombre SN | Nombre de la empresa | TU EMPRESA SAS |
| E | Válido | Estado del producto | Y |
| F | De fecha | Fecha de inicio | 01/01/2024 |
| G | Hasta fecha | Fecha de fin | (puede estar vacío) |
| H | N° catálogo SN | Código de categoría | CATEGORIA1 |
| I | Descripción de catálogo de SN | Nombre de la categoría | Electrónicos |
| J | Cantidad | Stock disponible | 100 |
| K | Precio especial | Precio unitario | 25000 |
| L | Moneda del precio | Moneda | COP |
| M | Descuento en % | Descuento aplicable | 0 |

## Archivo de Ejemplo

Revisa el archivo `productos-ejemplo.csv` para ver la estructura exacta esperada.

## Seguridad

⚠️ **IMPORTANTE**: Los archivos de productos (`productos.xlsx` y `productos.csv`) están excluidos del control de versiones por seguridad. No se suben al repositorio Git.

## Instrucciones de Uso

1. **Coloca tu archivo Excel**: Copia tu archivo `productos.xlsx` en esta carpeta
2. **La aplicación lo convertirá automáticamente**: Al iniciar, se creará el archivo CSV
3. **Los productos se cargarán**: La aplicación mostrará cuántos productos se cargaron
4. **En caso de error**: Se usarán productos de ejemplo por defecto

## Solución de Problemas

- **No se cargan productos**: Verifica que el archivo `productos.xlsx` esté en esta carpeta
- **Error de formato**: Asegúrate de que las columnas estén en el orden correcto
- **Productos vacíos**: Revisa que las celdas de referencia y precio no estén vacías
