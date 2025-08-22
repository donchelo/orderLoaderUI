# 🔄 Git Workflow Guide

## 🎯 Resumen

Este documento describe el flujo de trabajo Git optimizado para OrderLoader UI, diseñado para mantener un historial limpio y facilitar el git graph.

## 🏗️ Estructura de Branches

### Branch Principal

- **`master`**: Branch de producción, siempre estable
  - Todo código aquí debe estar probado y listo para deploy
  - Solo recibe merges de PRs aprobados
  - Protegido contra push directo

### Branches de Desarrollo

```
master
├── feat/nueva-funcionalidad
├── fix/correccion-bug
├── docs/actualizar-documentacion
└── refactor/optimizar-componente
```

### Convención de Nombres

```bash
# Funcionalidades
feat/descripcion-corta
feat/auth-system
feat/pdf-export

# Correcciones
fix/descripcion-del-bug  
fix/calculation-error
fix/responsive-layout

# Documentación
docs/tipo-de-documento
docs/api-reference
docs/contributing-guide

# Refactoring
refactor/componente-o-area
refactor/hooks-extraction
refactor/performance-optimization

# Chores
chore/tipo-de-tarea
chore/dependencies-update
chore/ci-configuration
```

## 🚀 Flujo de Desarrollo

### 1. Configuración Inicial

```bash
# Clonar repositorio
git clone https://github.com/donchelo/orderLoaderUI.git
cd orderLoaderUI

# Configurar upstream (si es fork)
git remote add upstream https://github.com/donchelo/orderLoaderUI.git

# Instalar dependencias
npm install
```

### 2. Iniciar Nueva Funcionalidad

```bash
# Actualizar master
git checkout master
git pull origin master

# Crear nueva branch
git checkout -b feat/descripcion-funcionalidad

# Verificar configuración
git config --local commit.template .gitmessage
```

### 3. Desarrollo

```bash
# Hacer cambios y commits regulares
git add .
git commit  # Usará el template configurado

# Push regular para backup
git push -u origin feat/descripcion-funcionalidad
```

### 4. Preparar Pull Request

```bash
# Actualizar con master
git fetch origin
git rebase origin/master

# Verificar estado
git status
git log --oneline -10

# Push final
git push --force-with-lease origin feat/descripcion-funcionalidad
```

### 5. Después del Merge

```bash
# Cambiar a master
git checkout master
git pull origin master

# Limpiar branch local
git branch -d feat/descripcion-funcionalidad

# Limpiar branch remoto (automático con GitHub)
git remote prune origin
```

## 📝 Conventional Commits

### Template Configurado

El proyecto usa un template de commit (`.gitmessage`) que se activa con:

```bash
git commit
```

### Estructura del Mensaje

```
<tipo>(<scope>): <descripción corta máx 50 chars>

<cuerpo opcional - máx 72 chars por línea>

<footer opcional>
```

### Ejemplos Prácticos

```bash
# Funcionalidad simple
feat(search): add product search functionality

# Funcionalidad compleja  
feat(auth): implement JWT authentication system

Add user login/logout functionality with JWT tokens.
Includes session management and protected routes.

Closes #123

# Bug fix
fix(calc): correct order total calculation

# Breaking change
feat(api)!: change API response format

BREAKING CHANGE: API now returns data in different format.
Update client code to handle new response structure.

# Documentación
docs(readme): update installation instructions

# Chore
chore(deps): update React to v18.2.5
```

## 🛡️ Branch Protection

### Reglas Configuradas

- **Require pull request reviews**: ✅
- **Require status checks**: ✅
- **Require branches up to date**: ✅
- **Require conversation resolution**: ✅
- **Restrict pushes**: ✅
- **Allow force pushes**: ❌
- **Allow deletions**: ❌

### Status Checks Requeridos

- `🔍 Lint & Test`
- `🔒 Security Audit`
- `🏗️ Build`

## 🔄 CI/CD Integration

### Workflows Automatizados

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Tests en Node 18.x y 20.x
   - Lint y auditoría de seguridad
   - Build verification
   - Coverage reports

2. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
   - Build optimizado para producción
   - Deploy a GitHub Pages
   - Notificaciones de estado

### Validación de Commits

- **Husky**: Valida commits antes de push
- **Commitlint**: Verifica formato Conventional Commits
- **Tests**: Ejecuta antes de commit si está configurado

## 📊 Git Graph Optimization

### Configuración para Graph Limpio

```bash
# Aliases útiles configurados
git graph  # log --oneline --graph --all --decorate
git st     # status --short --branch

# Configuración optimizada
core.autocrlf=false
pull.rebase=false
```

### Estrategias de Merge

- **Squash Merge**: Para features branches
- **Merge Commit**: Para releases importantes
- **Rebase**: Solo para actualizar branches personales

### Evitar Merge Commits Innecesarios

```bash
# ✅ Bueno - rebase antes de PR
git fetch origin
git rebase origin/master

# ❌ Evitar - merge commits en feature branches  
git merge origin/master
```

## 🧹 Limpieza y Mantenimiento

### Limpieza Regular

```bash
# Limpiar branches remotos eliminados
git remote prune origin

# Limpiar branches locales mergeadas
git branch --merged master | grep -v "master" | xargs -n 1 git branch -d

# Limpiar cache y optimizar
git gc --prune=now
git repack -ad
```

### Comandos de Diagnóstico

```bash
# Estado completo del repositorio
git status --porcelain
git log --oneline --graph --all -20

# Información de configuración
git config --list --local
git remote -v

# Análisis de branches
git branch -va
git show-branch --all
```

## 🚨 Resolución de Problemas

### Commits Incorrectos

```bash
# Último commit (no pusheado)
git commit --amend

# Varios commits (no pusheados)
git rebase -i HEAD~3

# Ya pusheado - crear fix commit
git revert <commit-hash>
```

### Conflictos de Merge

```bash
# Durante rebase
git status
# Resolver conflictos manualmente
git add .
git rebase --continue

# Abortar rebase si es necesario
git rebase --abort
```

### Branch Desactualizado

```bash
# Actualizar con master
git checkout tu-branch
git fetch origin
git rebase origin/master
git push --force-with-lease origin tu-branch
```

## 📋 Checklist de Desarrollo

### Antes de Commit

- [ ] Código sigue estándares del proyecto
- [ ] Tests pasan localmente
- [ ] No hay console.logs olvidados
- [ ] Commit message sigue Conventional Commits
- [ ] Archivos sensibles no incluidos

### Antes de Pull Request

- [ ] Branch actualizado con master
- [ ] CI checks pasan
- [ ] PR template completado
- [ ] Self-review realizado
- [ ] Screenshots incluidos si aplica

### Después de Merge

- [ ] Branch local eliminado
- [ ] Master actualizado localmente
- [ ] Deployment verificado
- [ ] Issue cerrado si aplica

## 🎯 Mejores Prácticas

### Commits

- **Pequeños y frecuentes**: Un cambio lógico por commit
- **Descriptivos**: Subject line clara y concisa
- **Completos**: No commitear cambios parciales
- **Testeados**: Solo commitear código que pase tests

### Branches

- **Vida corta**: Features branches de pocos días
- **Actualizadas**: Rebase regular con master
- **Enfocadas**: Una funcionalidad por branch
- **Limpias**: Sin commits de debugging

### Colaboración

- **Reviews constructivos**: Feedback específico y útil
- **Comunicación clara**: Explicar decisiones complejas
- **Documentación**: Actualizar docs con cambios
- **Testing**: Probar funcionalidad en diferentes escenarios

---

Este workflow está diseñado para mantener un repositorio limpio, facilitar la colaboración y asegurar la calidad del código. ¡Síguelo para obtener los mejores resultados! 🚀