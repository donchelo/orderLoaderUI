// Configuración de la empresa
const EMPRESA_ID = 'TU_EMPRESA_ID'; // Cambiar por el ID de tu empresa

// Función para generar el JSON de la orden
export const generateOrderJSON = (orderData, formData, lineItems, clientNIT, selectedClient) => {
  // Generar número de orden único
  const orderNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  
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
    orden_compra: orderNumber.toString(),
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
    numero_items_totales: totalItems
  };

  return {
    jsonData,
    fileName: `${orderNumber}${timestamp}R${randomId}-${clientNIT.replace(/[^0-9]/g, '')}-${uniqueItems.toString().padStart(4, '0')}-${totalItems.toString().padStart(5, '0')}.json`
  };
};

// Función para descargar el JSON
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
