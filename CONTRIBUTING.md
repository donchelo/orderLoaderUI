# 🤝 Guía de Contribución - OrderLoader UI

¡Gracias por tu interés en contribuir a OrderLoader UI! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [Código de Conducta](#-código-de-conducta)
- [¿Cómo Puedo Contribuir?](#-cómo-puedo-contribuir)
- [Configuración del Entorno de Desarrollo](#️-configuración-del-entorno-de-desarrollo)
- [Proceso de Desarrollo](#-proceso-de-desarrollo)
- [Estándares de Código](#-estándares-de-código)
- [Conventional Commits](#-conventional-commits)
- [Pull Requests](#-pull-requests)
- [Reportar Bugs](#-reportar-bugs)
- [Solicitar Funcionalidades](#-solicitar-funcionalidades)

## 📜 Código de Conducta

Este proyecto se adhiere a estándares profesionales de conducta. Se espera respeto mutuo y colaboración constructiva.

## 🚀 ¿Cómo Puedo Contribuir?

### 🐛 Reportando Bugs

- Usa el [template de bug report](.github/ISSUE_TEMPLATE/bug_report.md)
- Incluye pasos detallados para reproducir el problema
- Proporciona información del sistema y capturas de pantalla

### ✨ Sugiriendo Mejoras

- Usa el [template de feature request](.github/ISSUE_TEMPLATE/feature_request.md)
- Describe claramente el problema y la solución propuesta
- Incluye mockups si es posible

### 💻 Contribuciones de Código

- Corrige bugs reportados
- Implementa nuevas funcionalidades
- Mejora la documentación
- Optimiza el rendimiento

## 🛠️ Configuración del Entorno de Desarrollo

### Prerrequisitos

- Node.js 18.x o superior
- npm 9.x o superior
- Git

### Instalación

```bash
# 1. Fork y clona el repositorio
git clone https://github.com/tu-usuario/orderLoaderUI.git
cd orderLoaderUI

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm start

# 4. Abre http://localhost:3000 en tu navegador
```

### Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Build para producción  
npm test           # Ejecutar tests
npm run lint       # Linter (si está configurado)
```

## 🔄 Proceso de Desarrollo

### 1. Preparación

```bash
# Actualiza tu fork
git checkout master
git pull upstream master
git push origin master
```

### 2. Crear una Rama

```bash
# Nombra tu rama descriptivamente
git checkout -b feat/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
# o  
git checkout -b docs/actualizar-readme
```

### 3. Desarrollar

- Realiza tus cambios
- Sigue los [estándares de código](#-estándares-de-código)
- Escribe tests si es necesario
- Actualiza documentación si es necesario

### 4. Testing

```bash
# Ejecuta todos los tests
npm test

# Build para verificar
npm run build
```

### 5. Commits

- Sigue [Conventional Commits](#-conventional-commits)
- Un commit por cambio lógico
- Mensajes descriptivos y claros

### 6. Push y Pull Request

```bash
git push origin tu-rama-descriptiva
```

Luego crea un PR usando nuestro [template](.github/pull_request_template.md).

## 📝 Estándares de Código

### JavaScript/React

```javascript
// ✅ Bueno
const handleClick = (event) => {
  setIsActive(true);
  onItemSelect(item.id);
};

// ❌ Evitar
function handleClick(event) {
  setIsActive(true)
  onItemSelect(item.id)
}
```

### Nomenclatura

- **Componentes**: PascalCase (`ProductSearch`, `OrderTable`)
- **Funciones**: camelCase (`handleSubmit`, `calculateTotal`)  
- **Variables**: camelCase (`orderItems`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Archivos**: camelCase para JS, kebab-case para CSS

### Estructura de Archivos

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.js
│       ├── ComponentName.css
│       └── __tests__/
│           └── ComponentName.test.js
├── hooks/
│   └── useHookName.js
└── utils/
    └── utilityName.js
```

### CSS

- Usa CSS Modules o styled-components
- Sigue BEM si usas CSS tradicional
- Variables CSS para colores y spacing
- Mobile-first responsive design

```css
/* ✅ Bueno */
.product-search__input {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
}

/* ❌ Evitar */
.productSearchInput {
  padding: 16px;
  border: 1px solid #ccc;
}
```

## 📋 Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial limpio.

### Formato

```
<tipo>(<scope>): <descripción>

<cuerpo opcional>

<footer opcional>
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Solo cambios de documentación
- `style`: Cambios de formato (espacios, comas, etc)
- `refactor`: Refactorización sin cambio funcional
- `perf`: Mejoras de rendimiento
- `test`: Añadir o modificar tests
- `chore`: Cambios en build, CI, dependencias
- `ci`: Cambios en CI/CD

### Ejemplos

```bash
# ✅ Buenos commits
git commit -m "feat(search): add product search functionality"
git commit -m "fix(order): correct total calculation bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(hooks): extract order logic to useOrder hook"

# ❌ Commits a evitar
git commit -m "update stuff"
git commit -m "fixes"
git commit -m "working on search feature, added some components and updated styles, also fixed some bugs I found while testing"
```

## 🔀 Pull Requests

### Checklist antes de crear un PR

- [ ] Mi código sigue los estándares del proyecto
- [ ] He ejecutado los tests y todos pasan
- [ ] He añadido tests para mi código si es necesario
- [ ] He actualizado la documentación si es necesario
- [ ] Mi branch está actualizado con master
- [ ] He usado Conventional Commits
- [ ] He completado el template de PR

### Proceso de Review

1. **Automated Checks**: CI debe pasar
2. **Code Review**: Al menos un mantenedor debe aprobar
3. **Testing**: Funcionalidad probada manualmente si es necesario
4. **Merge**: Se hará squash merge a master

### ¿Qué hace que un PR sea aceptado?

- ✅ Resuelve completamente el issue
- ✅ Incluye tests apropiados
- ✅ Documentación actualizada
- ✅ Sigue estándares de código
- ✅ No introduce breaking changes sin justificación
- ✅ Tamaño manejable (< 500 líneas idealmente)

## 🐛 Reportar Bugs

### Antes de Reportar

1. Revisa si el bug ya fue reportado
2. Asegúrate de estar usando la versión más reciente
3. Verifica que no sea un problema de configuración local

### Información a Incluir

- **Descripción clara** del problema
- **Pasos exactos** para reproducir
- **Comportamiento esperado** vs actual
- **Screenshots** si es aplicable
- **Información del sistema**: OS, navegador, versión de Node
- **Logs de consola** si hay errores

## ✨ Solicitar Funcionalidades

### Antes de Solicitar

1. Revisa si la funcionalidad ya fue solicitada
2. Considera si encaja con el objetivo del proyecto
3. Piensa en implementaciones alternativas

### Información a Incluir

- **Problema** que resuelve la funcionalidad
- **Solución propuesta** detallada
- **Alternativas consideradas**
- **Mockups o wireframes** si aplica
- **Criterios de aceptación** claros

## 🏷️ Etiquetas de Issues

- `bug`: Algo no funciona correctamente
- `enhancement`: Nueva funcionalidad o mejora
- `documentation`: Mejoras en documentación
- `good first issue`: Bueno para principiantes
- `help wanted`: Se busca ayuda externa
- `priority: high/medium/low`: Nivel de prioridad
- `status: needs-triage`: Necesita revisión inicial
- `status: blocked`: Bloqueado por algo
- `status: in-progress`: En desarrollo activo

## 🎯 Roadmap y Prioridades

### En Desarrollo Activo

- Sistema de autenticación mejorado
- Exportación a PDF
- Mejoras de rendimiento

### Próximas Funcionalidades

- API REST backend
- Modo offline/PWA
- Tema oscuro
- Notificaciones push

### Contribuciones Bienvenidas

- Tests unitarios adicionales
- Mejoras de accesibilidad
- Optimizaciones de rendimiento
- Documentación

## 📞 ¿Necesitas Ayuda?

- 💬 [Discussions](https://github.com/donchelo/orderLoaderUI/discussions)
- 📧 Email: [mgarciap333@gmail.com](mailto:mgarciap333@gmail.com)
- 📚 [Documentación](./docs/)

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia que el proyecto.

---

¡Gracias por contribuir a OrderLoader UI! 🎉