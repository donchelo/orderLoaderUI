@echo off
echo ========================================
echo    PREPARANDO PROYECTO PARA PRODUCCION
echo ========================================
echo.

echo 1. Limpiando build anterior...
if exist build rmdir /s /q build
echo ✓ Build anterior eliminado

echo.
echo 2. Instalando dependencias...
call npm install
echo ✓ Dependencias instaladas

echo.
echo 3. Creando build de produccion...
call npm run build
echo ✓ Build creado exitosamente

echo.
echo 4. Verificando archivos...
if exist build\index.html (
    echo ✓ index.html encontrado
) else (
    echo ❌ ERROR: index.html no encontrado
    pause
    exit /b 1
)

if exist build\images\logo.png (
    echo ✓ logo.png encontrado
) else (
    echo ⚠ ADVERTENCIA: logo.png no encontrado
)

if exist build\.htaccess (
    echo ✓ .htaccess encontrado
) else (
    echo ❌ ERROR: .htaccess no encontrado
    pause
    exit /b 1
)

echo.
echo ========================================
echo    PROYECTO LISTO PARA DESPLIEGUE
echo ========================================
echo.
echo 📁 Carpeta build creada con exito
echo 📋 Sigue las instrucciones en DEPLOYMENT_GUIDE.md
echo 🌐 URL esperada: https://orderLoader.tu-dominio.com
echo.
echo Presiona cualquier tecla para abrir la carpeta build...
pause >nul
start build
