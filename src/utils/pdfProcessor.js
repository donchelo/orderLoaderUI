// Utilidades para procesar archivos PDF y convertirlos a datos estructurados

class PdfProcessor {
  constructor() {
    this.supportedFormats = ['application/pdf'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  // Validar archivo PDF
  validatePdfFile(file) {
    const errors = [];

    // Verificar tipo de archivo
    if (!this.supportedFormats.includes(file.type)) {
      errors.push('El archivo debe ser un PDF válido');
    }

    // Verificar tamaño
    if (file.size > this.maxFileSize) {
      errors.push(`El archivo es demasiado grande. Máximo ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Verificar que el archivo no esté vacío
    if (file.size === 0) {
      errors.push('El archivo está vacío');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convertir archivo PDF a FormData para envío al servidor
  preparePdfForUpload(file) {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('timestamp', new Date().toISOString());
    formData.append('filename', file.name);
    
    return formData;
  }

  // Subir PDF sin procesar (solo almacenar)
  async uploadPdfFile(file) {
    try {
      // Validar archivo
      const validation = this.validatePdfFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Simular subida del archivo
      console.log('📄 Subiendo PDF:', file.name);
      
      // Simular tiempo de subida
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generar ID único para el archivo
      const fileId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simular almacenamiento del archivo
      const uploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded'
      };
      
      // Guardar referencia en localStorage (en producción sería en base de datos)
      this.saveFileReference(uploadedFile);
      
      return {
        success: true,
        data: uploadedFile,
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

  // Guardar referencia del archivo subido
  saveFileReference(fileData) {
    try {
      const uploadedFiles = JSON.parse(localStorage.getItem('uploaded_pdfs') || '[]');
      uploadedFiles.push(fileData);
      
      // Mantener solo los últimos 50 archivos
      if (uploadedFiles.length > 50) {
        uploadedFiles.splice(0, uploadedFiles.length - 50);
      }
      
      localStorage.setItem('uploaded_pdfs', JSON.stringify(uploadedFiles));
      console.log('📋 Referencia de PDF guardada:', fileData.id);
    } catch (error) {
      console.warn('⚠️ No se pudo guardar referencia del PDF:', error.message);
    }
  }

  // Simular datos extraídos del PDF (para demostración)
  simulateExtractedData(filename) {
    // Generar datos aleatorios basados en el nombre del archivo
    const seed = filename.length;
    const clientNITs = ['CN9001234567', 'CN8009876543', 'CN7005551234'];
    const clientNames = ['Cliente Ejemplo S.A.S.', 'Empresa Demo Ltda.', 'Compañía Test S.A.'];
    const products = [
      { ref: 'REF001', name: 'Producto de ejemplo 1', price: 15000 },
      { ref: 'REF002', name: 'Producto de ejemplo 2', price: 25000 },
      { ref: 'REF003', name: 'Producto de ejemplo 3', price: 18000 },
      { ref: 'REF004', name: 'Producto de ejemplo 4', price: 32000 },
      { ref: 'REF005', name: 'Producto de ejemplo 5', price: 12000 }
    ];

    const selectedClientNIT = clientNITs[seed % clientNITs.length];
    const selectedClientName = clientNames[seed % clientNames.length];
    
    // Generar items aleatorios
    const numItems = (seed % 3) + 2; // 2-4 items
    const orderItems = [];
    
    for (let i = 0; i < numItems; i++) {
      const product = products[(seed + i) % products.length];
      const quantity = (seed + i) % 5 + 1; // 1-5 unidades
      
      orderItems.push({
        ref: product.ref,
        name: product.name,
        quantity: quantity,
        price: product.price
      });
    }

    // Generar fecha de entrega (entre 3 y 14 días)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (seed % 12) + 3);

    return {
      clientNIT: selectedClientNIT,
      clientName: selectedClientName,
      orderItems: orderItems,
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      notes: `Orden extraída automáticamente del PDF: ${filename}`,
      totalItems: orderItems.length,
      totalValue: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  }

  // Función para conectar con el servicio real de procesamiento de PDFs
  async sendToProcessingService(formData) {
    try {
      // En producción, aquí se enviaría al servicio real
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData
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

  // Función para mapear datos extraídos al formato del formulario
  mapExtractedDataToForm(extractedData) {
    return {
      clientNIT: extractedData.clientNIT,
      clientName: extractedData.clientName,
      deliveryDate: extractedData.deliveryDate,
      notes: extractedData.notes,
      orderItems: extractedData.orderItems.map(item => ({
        ref: item.ref,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }))
    };
  }
}

// Crear instancia singleton
export const pdfProcessor = new PdfProcessor();

// Funciones de conveniencia
export const validatePdfFile = (file) => pdfProcessor.validatePdfFile(file);
export const uploadPdfFile = (file) => pdfProcessor.uploadPdfFile(file);
export const mapExtractedDataToForm = (data) => pdfProcessor.mapExtractedDataToForm(data);
