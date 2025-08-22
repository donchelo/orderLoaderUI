# Archivos JSON Generados

Esta carpeta contiene los archivos JSON generados automáticamente por el sistema de órdenes de compra.

## Estructura de Carpetas

```
outputs_json/
├── Procesados/           # Archivos JSON de órdenes procesadas
│   ├── [orden_id].json  # Archivos individuales por orden
│   └── ...
└── README.md            # Este archivo
```

## Formato del Archivo JSON

Cada archivo JSON contiene la siguiente estructura:

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

## Campos del JSON

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `orden_compra` | String | Número de la orden de compra |
| `fecha_entrega` | String | Fecha de entrega (formato DD/MM/YYYY) |
| `comprador.nit` | String | NIT del cliente |
| `comprador.nombre` | String | Nombre del cliente |
| `items` | Array | Lista de productos en la orden |
| `items[].descripcion` | String | Descripción del producto |
| `items[].codigo` | String | Código del producto |
| `items[].cantidad` | Number | Cantidad solicitada |
| `items[].precio_unitario` | Number | Precio por unidad |
| `items[].precio_total` | Number | Precio total del item |
| `items[].fecha_entrega` | String | Fecha de entrega específica |
| `valor_base` | Number | Valor total de la orden |
| `total_items_unicos` | Number | Número de productos únicos |
| `numero_items_totales` | Number | Cantidad total de unidades |

## Convención de Nombres

Los archivos se nombran siguiendo el patrón:
`[orden_compra][timestamp][random_id].json`

Ejemplo: `460152734321081112R720-9008516551-7001-05001.pdf.json`

## Seguridad

⚠️ **IMPORTANTE**: Los archivos JSON contienen información sensible de órdenes de compra y están excluidos del control de versiones por seguridad.
