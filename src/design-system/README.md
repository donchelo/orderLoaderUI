# Sistema de Diseño - OrderLoaderUI

Un sistema de diseño minimalista basado únicamente en cuatro colores: blanco, negro, verde y rojo.

## Paleta de Colores

### Colores Base
- **Blanco**: `#ffffff` - Fondos principales
- **Negro**: `#000000` - Texto principal, bordes y elementos de acción

### Colores de Acción
- **Verde**: `#22c55e` - Para acciones de avanzar y confirmar
- **Rojo**: `#ef4444` - Para acciones de cancelar y retroceder

### Estados de Hover
- **Verde Hover**: `#16a34a` - Estado hover para botones verdes
- **Rojo Hover**: `#dc2626` - Estado hover para botones rojos

## Tipografía

### Familia de Fuentes
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

### Tamaños con Mayor Contraste
- `text-xs`: 12px (muy pequeño)
- `text-sm`: 14px (pequeño)
- `text-base`: 16px (mediano)
- `text-lg`: 20px (mediano-grande)
- `text-xl`: 24px (grande)
- `text-2xl`: 32px (muy grande)
- `text-3xl`: 40px (extra grande)
- `text-4xl`: 48px (muy extra grande)
- `text-5xl`: 56px (enorme)
- `text-6xl`: 64px (máximo)

### Pesos
- `font-light`: 300
- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

## Espaciado

Sistema de espaciado basado en múltiplos de 4px:
- `space-0`: 0px
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px
- `space-16`: 64px
- `space-20`: 80px
- `space-24`: 96px

## Componentes

### Botones

#### Variantes
- `.btn-primary` - Negro (acción principal)
- `.btn-success` - Verde (confirmar/avanzar)
- `.btn-danger` - Rojo (cancelar/retroceder)
- `.btn-outline` - Contorno negro
- `.btn-ghost` - Transparente

#### Tamaños con Mayor Contraste
- `.btn-sm` - Pequeño (14px)
- `.btn` - Mediano (16px)
- `.btn-lg` - Grande (20px)
- `.btn-xl` - Muy Grande (24px)

#### Ejemplo
```html
<button class="btn btn-success">Confirmar</button>
<button class="btn btn-danger">Cancelar</button>
<button class="btn btn-primary">Guardar</button>
```

### Inputs

#### Tipos
- `.input` - Input de texto
- `.textarea` - Área de texto
- `.select` - Selector
- `.checkbox` - Casilla de verificación
- `.radio` - Botón de radio

#### Tamaños
- `.input-sm` - Pequeño (14px)
- `.input` - Mediano (16px)
- `.input-lg` - Grande (20px)
- `.input-xl` - Muy Grande (24px)

#### Estados
- `.input-error` - Error
- `.input-success` - Éxito

#### Ejemplo
```html
<div class="form-group">
  <label class="label">Nombre</label>
  <input type="text" class="input" placeholder="Ingresa tu nombre">
</div>
```

### Tarjetas

#### Variantes
- `.card` - Tarjeta básica
- `.card-elevated` - Con sombra elevada
- `.card-interactive` - Interactiva
- `.card-success` - Con borde verde
- `.card-danger` - Con borde rojo
- `.card-warning` - Con borde negro

#### Estructura
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título</h3>
    <p class="card-subtitle">Subtítulo</p>
  </div>
  <div class="card-body">
    Contenido de la tarjeta
  </div>
  <div class="card-footer">
    Acciones
  </div>
</div>
```

### Tablas

#### Variantes
- `.table` - Tabla básica
- `.table-striped` - Con rayas alternadas
- `.table-bordered` - Con bordes
- `.table-compact` - Compacta
- `.table-lg` - Grande

#### Ejemplo
```html
<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Juan Pérez</td>
        <td>juan@email.com</td>
        <td class="actions">
          <button class="btn btn-sm btn-success">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Utilidades

### Layout
- `.container` - Contenedor centrado (1200px)
- `.container-sm` - Contenedor pequeño (640px)
- `.container-md` - Contenedor mediano (768px)
- `.container-lg` - Contenedor grande (1024px)
- `.container-xl` - Contenedor extra grande (1280px)

### Grid
- `.grid` - Grid básico
- `.grid-cols-1` a `.grid-cols-12` - Columnas del grid

### Flexbox
- `.flex` - Display flex
- `.flex-col` - Dirección columna
- `.flex-row` - Dirección fila
- `.items-center` - Alinear items al centro
- `.justify-between` - Justificar entre elementos

### Espaciado
- `.p-*` - Padding
- `.m-*` - Margin
- `.px-*` - Padding horizontal
- `.py-*` - Padding vertical
- `.mx-*` - Margin horizontal
- `.my-*` - Margin vertical

### Texto
- `.text-center` - Centrar texto
- `.text-left` - Alinear a la izquierda
- `.text-right` - Alinear a la derecha
- `.text-primary` - Color de texto principal
- `.text-secondary` - Color de texto secundario
- `.text-muted` - Color de texto atenuado

## Responsive

El sistema incluye breakpoints para:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

Ejemplo:
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Contenido -->
</div>
```

## Uso

Para usar el sistema de diseño, importa el archivo principal:

```css
@import './design-system/index.css';
```

O en tu archivo principal de CSS:

```css
@import './design-system/index.css';
```
