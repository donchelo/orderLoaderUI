import { useState } from 'react';

export const usePdfUpload = () => {
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  const openPdfUpload = () => {
    setShowPdfUpload(true);
  };

  const closePdfUpload = () => {
    setShowPdfUpload(false);
  };

  const handlePdfUploaded = async (uploadedFileData) => {
    setIsProcessingPdf(true);
    
    try {
      // Simplemente almacenar la referencia del PDF subido
      // El procesamiento se hará en otro servicio
      console.log('📄 PDF subido exitosamente:', uploadedFileData);

      // Cerrar el modal de carga
      closePdfUpload();

      return {
        success: true,
        message: `PDF subido exitosamente: ${uploadedFileData.name}`,
        fileData: uploadedFileData
      };

    } catch (error) {
      console.error('Error manejando PDF subido:', error);
      return {
        success: false,
        message: 'Error al procesar la subida del PDF.',
        error: error.message
      };
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Función auxiliar para buscar productos por referencia
  const findProductByRef = async (ref) => {
    // En una implementación real, esto buscaría en el catálogo de productos
    // Por ahora, simulamos la búsqueda
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular búsqueda de producto
        const mockProduct = {
          ref: ref,
          name: `Producto ${ref}`,
          categoria: 'General'
        };
        resolve(mockProduct);
      }, 100);
    });
  };

  return {
    showPdfUpload,
    isProcessingPdf,
    openPdfUpload,
    closePdfUpload,
    handlePdfUploaded
  };
};
