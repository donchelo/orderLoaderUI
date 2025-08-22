# Carpeta de Órdenes de Compra

Esta carpeta contiene todos los archivos JSON de las órdenes de compra generadas por el sistema.

## Estructura de archivos

Los archivos se guardan con el siguiente formato de nombre:
```
TAM-00001_20241225T172930_9001234567_0002_00005.json
```

Donde:
- `TAM-00001`: Número de orden consecutivo
- `20241225T172930`: Timestamp de creación (AAAAMMDDTHHMMSS)
- `9001234567`: NIT del cliente (solo números)
- `0002`: Número de items únicos (4 dígitos)
- `00005`: Número total de items (5 dígitos)

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
