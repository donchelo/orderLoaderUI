// Importar el nuevo servicio de almacenamiento
import { saveAndDownloadJSON } from './fileStorage';

// Configuración de la empresa
const EMPRESA_ID = 'TU_EMPRESA_ID'; // Cambiar por el ID de tu empresa

// Función para generar el JSON de la orden
export const generateOrderJSON = (orderData, formData, lineItems, clientNIT, selectedClient) => {
  // Usar el número de orden generado automáticamente
  const orderNumber = formData.orderNumber || 'TAM-00001';
  
  // Generar timestamp y ID único
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Formatear fecha de entrega
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calcular totales
  const totalItems = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = lineItems.length;
  const totalValue = lineItems.reduce((sum, item) => sum + item.total, 0);

  // Crear estructura JSON según el formato requerido
  const jsonData = {
    numero_orden: orderNumber,
    orden_compra: orderNumber,
    fecha_documento: formatDate(formData.documentDate),
    fecha_entrega: formatDate(formData.deliveryDate),
    comprador: {
      nit: clientNIT,
      nombre: selectedClient
    },
    items: lineItems.map(item => ({
      descripcion: item.name,
      codigo: item.ref,
      cantidad: item.quantity,
      precio_unitario: item.price,
      precio_total: item.total,
      fecha_entrega: formatDate(formData.deliveryDate)
    })),
    valor_base: totalValue,
    total_items_unicos: uniqueItems,
    numero_items_totales: totalItems,
    observaciones: formData.notes || ''
  };

  // Crear nombre de archivo elegante y profesional
  const createElegantFileName = () => {
    // Extraer información del cliente de manera inteligente
    let clientKey = 'CLIENTE';
    
    if (selectedClient) {
      // Intentar extraer palabras clave del nombre del cliente
      const words = selectedClient
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales excepto espacios
        .split(' ')
        .filter(word => word.length > 2) // Solo palabras de más de 2 caracteres
        .map(word => word.toUpperCase());
      
      if (words.length > 0) {
        // Usar la primera palabra significativa
        clientKey = words[0].substring(0, 6);
        
        // Si hay una segunda palabra, agregar sus primeras 2 letras
        if (words.length > 1) {
          clientKey += words[1].substring(0, 2);
        }
      } else {
        // Fallback: usar las primeras letras del nombre completo
        clientKey = selectedClient
          .replace(/[^a-zA-Z0-9]/g, '')
          .substring(0, 8)
          .toUpperCase();
      }
    }
    
    // Formatear fecha de manera elegante (DDMMYYYY)
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dateStr = `${day}${month}${year}`;
    
    // Crear nombre elegante y corto
    const fileName = `${orderNumber}_${clientKey}_${dateStr}.json`;
    
    console.log(`📝 Nombre de archivo generado: ${fileName}`);
    console.log(`📊 Información: Orden ${orderNumber}, Cliente: ${clientKey}, Fecha: ${dateStr}`);
    console.log(`🏢 Cliente original: "${selectedClient}" → Clave: "${clientKey}"`);
    
    return fileName;
  };

  return {
    jsonData,
    fileName: createElegantFileName()
  };
};

// Función para guardar y descargar el JSON (nueva versión mejorada)
export const saveOrderJSON = async (jsonData, fileName) => {
  return await saveAndDownloadJSON(jsonData, fileName);
};

// Función legacy para compatibilidad hacia atrás
export const downloadJSON = (jsonData, fileName) => {
  const dataStr = JSON.stringify(jsonData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
