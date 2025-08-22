# 🛡️ Configuración de Branch Protection

## 🎯 Objetivo

Configurar reglas de protección para la rama `master` que aseguren la calidad del código y un flujo de trabajo robusto.

## 📋 Pasos para Configurar Branch Protection

### 1. Acceder a GitHub

1. Ve a: `https://github.com/donchelo/orderLoaderUI`
2. Navega a **Settings** > **Branches**
3. Haz clic en **Add rule** o edita la regla existente para `master`

### 2. Configuración Recomendada

#### Branch name pattern
```
master
```

#### Protection Rules - Marcar las siguientes opciones:

##### ✅ Restrict pushes that create files over 100MB
- Previene archivos grandes accidentales

##### ✅ Require a pull request before merging
- **Required approvals**: `1`
- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require review from code owners** (si hay CODEOWNERS file)
- ✅ **Restrict pushes that create files over a specified file size limit**

##### ✅ Require status checks to pass before merging
- ✅ **Require branches to be up to date before merging**
- **Status checks que deben pasar:**
  - `🔍 Lint & Test (18.x)`
  - `🔍 Lint & Test (20.x)` 
  - `🔒 Security Audit`
  - `🏗️ Build`
  - `🔍 Dependency Review` (para PRs)

##### ✅ Require conversation resolution before merging
- Asegura que todos los comentarios sean resueltos

##### ✅ Require signed commits
- Mayor seguridad (opcional pero recomendado)

##### ✅ Require linear history
- Mantiene git graph limpio

##### ✅ Restrict pushes
- Solo administradores pueden hacer push directo

##### ❌ Allow force pushes
- Nunca permitir force pushes a master

##### ❌ Allow deletions
- Nunca permitir eliminación de master

#### Advanced Options

##### Include administrators
- ✅ **Apply rules to administrators**
- Los admins también siguen las reglas

##### Restrict pushes that create files
- ✅ **Block creation of files over 100MB**

### 3. Verificación

Después de configurar las reglas:

```bash
# 1. Intentar push directo (debe fallar)
git checkout master
git commit --allow-empty -m "test: direct push to master"
git push origin master
# Debería mostrar error: "required status checks"

# 2. Crear PR en su lugar
git checkout -b test/branch-protection
git push -u origin test/branch-protection
# Crear PR desde GitHub UI
```

## 🔧 Automatización con GitHub CLI

Si tienes `gh` CLI instalado:

```bash
# Configurar branch protection via CLI
gh api repos/donchelo/orderLoaderUI/branches/master/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["🔍 Lint & Test (18.x)","🔍 Lint & Test (20.x)","🔒 Security Audit","🏗️ Build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## 📊 Status Checks Explicados

### CI Pipeline Checks

1. **🔍 Lint & Test (18.x)**: 
   - Tests unitarios en Node.js 18
   - ESLint si está configurado
   - Coverage reports

2. **🔍 Lint & Test (20.x)**:
   - Tests unitarios en Node.js 20
   - Verifica compatibilidad con versión más reciente

3. **🔒 Security Audit**:
   - `npm audit` para vulnerabilidades
   - Dependency review para PRs

4. **🏗️ Build**:
   - Verificar que el build de producción sea exitoso
   - Sin errores de TypeScript/compilación

### Dependency Review (Solo PRs)

- **🔍 Dependency Review**: 
  - Analiza nuevas dependencias en PRs
  - Detecta vulnerabilidades conocidas
  - Revisa cambios en package.json/package-lock.json

## 🚨 Solución de Problemas

### Status Check No Aparece

1. Crear un PR con cambios
2. Esperar que CI complete al menos una vez
3. GitHub detectará automáticamente los checks disponibles
4. Volver a configurar branch protection

### CI Falla Inconsistentemente

```bash
# Limpiar cache local
npm ci --clean

# Verificar Node version
node --version
npm --version

# Ejecutar tests localmente
npm test
npm run build
```

### Bypass Temporal (Solo Administradores)

Si necesitas hacer push directo por emergencia:

1. Ve a Settings > Branches
2. Desactiva temporalmente "Include administrators"
3. Haz el push necesario
4. **Re-activa inmediatamente** las protecciones

## 📋 Checklist de Verificación

### Después de Configurar

- [ ] Push directo a master falla
- [ ] PRs requieren review de al menos 1 persona
- [ ] Status checks pasan antes de merge
- [ ] Conversaciones deben resolverse
- [ ] Branches deben estar actualizados
- [ ] Force pushes están bloqueados
- [ ] Administradores siguen las reglas

### Test Mensual

- [ ] Crear PR de prueba
- [ ] Verificar que todos los checks funcionen
- [ ] Confirmar que merge automático esté bloqueado
- [ ] Revisar logs de audit en Settings > Security

## 🎯 Beneficios Esperados

### Git Graph Limpio

- ✅ Commits organizados por PRs
- ✅ Sin merge commits innecesarios
- ✅ Historia lineal fácil de seguir
- ✅ Tags automáticos con semantic-release

### Calidad de Código

- ✅ Todos los cambios son revisados
- ✅ Tests siempre pasan antes de merge
- ✅ Build nunca se rompe en master
- ✅ Dependencias auditadas automáticamente

### Flujo de Trabajo Robusto

- ✅ Desarrolladores usan branches feature
- ✅ PRs bien documentados
- ✅ Releases automáticos y versionados
- ✅ Rollbacks fáciles y seguros

## 📚 Referencias

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [GitHub CLI Branch Protection](https://cli.github.com/manual/gh_api)

---

**⚠️ Importante**: Configurar branch protection es crucial para mantener la integridad del repositorio. Seguir estos pasos asegurará un flujo de trabajo profesional y un git graph limpio.