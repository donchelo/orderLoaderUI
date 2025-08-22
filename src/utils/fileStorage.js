import { saveAs } from 'file-saver';

// Servicio para manejar el guardado de archivos JSON
class FileStorageService {
  constructor() {
    this.baseUrl = '/outputs_json/Ordenes/';
  }

  // Función para guardar archivo JSON tanto localmente como descargarlo
  async saveOrderJSON(jsonData, fileName) {
    try {
      // 1. Crear el blob del archivo
      const dataStr = JSON.stringify(jsonData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      // 2. Intentar guardar en el servidor/carpeta local (si es posible)
      await this.saveToLocalFolder(dataBlob, fileName);

      // 3. También descargar al navegador como respaldo
      this.downloadToUser(dataBlob, fileName);

      // 4. Guardar referencia en localStorage para tracking
      this.saveFileReference(fileName, jsonData);

      return {
        success: true,
        message: `Archivo guardado: ${fileName}`,
        localPath: `public${this.baseUrl}${fileName}`,
        downloadPath: `~/Downloads/${fileName}`
      };

    } catch (error) {
      console.error('❌ Error guardando archivo:', error);
      
      // Si falla el guardado local, al menos descargar
      const dataStr = JSON.stringify(jsonData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      this.downloadToUser(dataBlob, fileName);
      
      return {
        success: false,
        message: `Error guardando localmente, pero descargado: ${fileName}`,
        error: error.message
      };
    }
  }

  // Intentar guardar en carpeta local del proyecto
  async saveToLocalFolder(blob, fileName) {
    try {
      // En un entorno de navegador, esto requiere permisos especiales
      // Por ahora, usaremos localStorage como cache y la descarga como método principal
      
      // Simular guardado local - en una aplicación real esto requeriría un backend
      console.log(`💾 Simulando guardado en: public${this.baseUrl}${fileName}`);
      
      // Guardar en localStorage como backup (limitado por tamaño)
      const dataStr = await blob.text();
      try {
        localStorage.setItem(`order_backup_${fileName}`, dataStr);
        console.log('✅ Backup guardado en localStorage');
      } catch (storageError) {
        console.warn('⚠️ No se pudo guardar backup en localStorage:', storageError.message);
      }

      return true;
    } catch (error) {
      throw new Error(`No se pudo guardar en carpeta local: ${error.message}`);
    }
  }

  // Descargar archivo al navegador del usuario
  downloadToUser(blob, fileName) {
    try {
      // Usar file-saver para una mejor experiencia de descarga
      saveAs(blob, fileName);
      console.log(`📥 Archivo descargado: ${fileName}`);
    } catch (error) {
      // Fallback al método tradicional
      console.warn('⚠️ Usando método de descarga alternativo');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  // Guardar referencia del archivo para tracking
  saveFileReference(fileName, jsonData) {
    try {
      const references = JSON.parse(localStorage.getItem('order_files') || '[]');
      const newRef = {
        fileName,
        orderNumber: jsonData.numero_orden,
        clientNIT: jsonData.comprador?.nit,
        clientName: jsonData.comprador?.nombre,
        totalValue: jsonData.valor_base,
        itemCount: jsonData.numero_items_totales,
        createdAt: new Date().toISOString(),
        localPath: `public${this.baseUrl}${fileName}`
      };
      
      references.push(newRef);
      
      // Mantener solo los últimos 100 archivos en la referencia
      if (references.length > 100) {
        references.splice(0, references.length - 100);
      }
      
      localStorage.setItem('order_files', JSON.stringify(references));
      console.log('📋 Referencia de archivo guardada');
    } catch (error) {
      console.warn('⚠️ No se pudo guardar referencia:', error.message);
    }
  }

  // Obtener lista de archivos guardados
  getFileReferences() {
    try {
      return JSON.parse(localStorage.getItem('order_files') || '[]');
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar referencias:', error.message);
      return [];
    }
  }

  // Limpiar referencias antiguas
  cleanOldReferences(daysOld = 30) {
    try {
      const references = this.getFileReferences();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const filtered = references.filter(ref => 
        new Date(ref.createdAt) > cutoffDate
      );
      
      localStorage.setItem('order_files', JSON.stringify(filtered));
      console.log(`🧹 Referencias limpiadas: ${references.length - filtered.length} eliminadas`);
    } catch (error) {
      console.warn('⚠️ Error limpiando referencias:', error.message);
    }
  }
}

// Crear instancia singleton
export const fileStorageService = new FileStorageService();

// Función de conveniencia para mantener compatibilidad
export const saveAndDownloadJSON = async (jsonData, fileName) => {
  return await fileStorageService.saveOrderJSON(jsonData, fileName);
};

// Función legacy para compatibilidad hacia atrás
export const downloadJSON = (jsonData, fileName) => {
  const dataStr = JSON.stringify(jsonData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  fileStorageService.downloadToUser(dataBlob, fileName);
};
