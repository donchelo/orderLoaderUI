# Carpeta de Órdenes de Compra

Esta carpeta contiene todos los archivos JSON de las órdenes de compra generadas por el sistema.

## Estructura de archivos

Los archivos se guardan con el siguiente formato de nombre elegante y profesional:
```
TAM-00001_EMPRESA_25122024.json
```

Donde:
- `TAM-00001`: Número de orden consecutivo
- `EMPRESA`: Clave del cliente (extraída inteligentemente del nombre)
- `25122024`: Fecha de creación (DDMMYYYY)

## Ejemplos de nombres generados:

| Cliente | Nombre del Archivo |
|---------|-------------------|
| Empresa Demo SAS | `TAM-00001_EMPRESA_25122024.json` |
| Tecnología Avanzada Ltda | `TAM-00002_TECNOL_25122024.json` |
| Comercial Industrial S.A. | `TAM-00003_COMER_25122024.json` |
| Distribuidora Nacional | `TAM-00004_DISTR_25122024.json` |

## Ventajas del nuevo formato:

✅ **Corto y legible**: Fácil de identificar a simple vista
✅ **Profesional**: Formato consistente y elegante
✅ **Informativo**: Incluye orden, cliente y fecha
✅ **Organizable**: Fácil de ordenar cronológicamente
✅ **Compatible**: Funciona en todos los sistemas operativos

## Organización

- **Órdenes activas**: Se guardan directamente en esta carpeta
- **Backup automático**: Los archivos se mantienen como respaldo
- **Trazabilidad**: Cada archivo contiene toda la información de la orden

## Contenido del JSON

Cada archivo contiene:
- Número de orden único
- Información del comprador
- Detalles de productos
- Fechas y observaciones
- Totales y resúmenes

## Notas importantes

- No eliminar archivos manualmente
- Los archivos son de solo lectura una vez generados
- Se recomienda hacer backup periódico de esta carpeta
