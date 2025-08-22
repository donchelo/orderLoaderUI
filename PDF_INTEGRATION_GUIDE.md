# Guía de Integración para Procesamiento de PDFs

## Descripción

Este documento explica cómo integrar el servicio real de procesamiento de PDFs con la aplicación OrderLoaderUI.

## Funcionalidad Actual

La aplicación actualmente incluye:

1. **Componente de carga de PDFs** (`PdfUpload`)
2. **Hook personalizado** (`usePdfUpload`) para manejar el estado
3. **Utilidades de subida** (`pdfProcessor.js`)
4. **Almacenamiento de referencias** de archivos subidos

## Integración con Servicio Real

### 1. Modificar `src/utils/pdfProcessor.js`

Reemplazar la función `uploadPdfFile` con la conexión real:

```javascript
async uploadPdfFile(file) {
  try {
    // Validar archivo
    const validation = this.validatePdfFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Preparar archivo para envío
    const formData = this.preparePdfForUpload(file);
    
    // Enviar al servicio de almacenamiento
    const result = await this.sendToStorageService(formData);
    
    return {
      success: true,
      data: result.uploadedFile,
      message: 'PDF subido exitosamente'
    };

  } catch (error) {
    console.error('❌ Error subiendo PDF:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al subir el PDF'
    };
  }
}
```

### 2. Configurar Endpoint del Servicio

En `sendToStorageService`, actualizar la URL del endpoint:

```javascript
async sendToStorageService(formData) {
  try {
    const response = await fetch('https://tu-servicio.com/api/upload-pdf', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer TU_API_KEY'
      }
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error enviando PDF al servicio:', error);
    throw error;
  }
}
```

### 3. Formato de Respuesta Esperado

El servicio debe devolver un JSON con esta estructura:

```json
{
  "success": true,
  "uploadedFile": {
    "id": "pdf_1234567890_abc123",
    "name": "orden_compra.pdf",
    "size": 1024000,
    "uploadedAt": "2024-01-15T10:00:00.000Z",
    "status": "uploaded",
    "url": "https://tu-servicio.com/files/pdf_1234567890_abc123.pdf"
  }
}
```

## Configuración de Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_PDF_SERVICE_URL=https://tu-servicio.com/api/upload-pdf
REACT_APP_PDF_SERVICE_API_KEY=tu_api_key_aqui
```

## Manejo de Errores

### Errores Comunes

1. **Archivo no válido**: Validación de tipo y tamaño
2. **Servicio no disponible**: Timeout y reintentos
3. **Datos malformados**: Validación de respuesta del servicio

### Implementación de Reintentos

```javascript
async sendToProcessingServiceWithRetry(formData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await this.sendToProcessingService(formData);
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## Testing

### Archivos de Prueba

Crear archivos PDF de prueba con diferentes formatos:

1. **PDF simple**: Una página con datos básicos
2. **PDF complejo**: Múltiples páginas, tablas, imágenes
3. **PDF malformado**: Para probar manejo de errores

### Comandos de Prueba

```bash
# Probar con archivo de ejemplo
npm test -- --testNamePattern="PDF Upload"

# Probar integración completa
npm run test:integration
```

## Seguridad

### Validaciones

1. **Tipo de archivo**: Solo PDFs
2. **Tamaño máximo**: 10MB
3. **Contenido**: Verificar que sea un PDF válido
4. **Autenticación**: API key requerida

### Configuración CORS

Si el servicio está en un dominio diferente:

```javascript
// En el servidor
app.use(cors({
  origin: 'https://tu-dominio.com',
  credentials: true
}));
```

## Monitoreo y Logs

### Logs Recomendados

```javascript
console.log('📄 Iniciando procesamiento de PDF:', {
  filename: file.name,
  size: file.size,
  timestamp: new Date().toISOString()
});

console.log('✅ PDF procesado exitosamente:', {
  itemsExtracted: result.data.orderItems.length,
  clientNIT: result.data.clientNIT,
  processingTime: Date.now() - startTime
});
```

### Métricas a Monitorear

1. **Tiempo de procesamiento**
2. **Tasa de éxito**
3. **Tamaño promedio de archivos**
4. **Errores por tipo**

## Despliegue

### Variables de Entorno en Producción

```bash
# En el servidor de producción
export REACT_APP_PDF_SERVICE_URL=https://api.produccion.com/process-pdf
export REACT_APP_PDF_SERVICE_API_KEY=prod_api_key
```

### Verificación Post-Despliegue

1. Probar carga de PDF de ejemplo
2. Verificar logs de procesamiento
3. Confirmar que los datos se cargan correctamente en el formulario

## Soporte

### Contacto

Para soporte técnico o preguntas sobre la integración:

- **Email**: soporte@tuempresa.com
- **Documentación**: https://docs.tuempresa.com/pdf-integration
- **GitHub Issues**: https://github.com/tuempresa/orderLoaderUI/issues

### Troubleshooting

#### Problema: PDF no se procesa
**Solución**: Verificar conectividad con el servicio y logs del servidor

#### Problema: Datos extraídos incorrectos
**Solución**: Revisar formato del PDF y configuración del servicio

#### Problema: Error de CORS
**Solución**: Configurar CORS en el servidor de procesamiento
