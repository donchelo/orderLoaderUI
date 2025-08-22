import { useState, useEffect } from 'react';

export const useClient = (products) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [clientNIT, setClientNIT] = useState('');
  const [isNITLocked, setIsNITLocked] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtrar productos por NIT del cliente
  useEffect(() => {
    console.log('🔄 useEffect de cliente ejecutado');
    console.log('📊 Estado actual:', {
      clientNIT,
      productsLength: products.length,
      availableNITs: [...new Set(products.map(p => p.nit).filter(nit => nit))]
    });
    
    if (clientNIT) {
      const filtered = products.filter(p => p.nit === clientNIT);
      setFilteredProducts(filtered);
      const clientName = filtered.length > 0 ? filtered[0].empresa : 'Cliente no encontrado';
      setSelectedClient(clientName);
      
      // Bloquear el NIT si se encontró un cliente válido
      if (filtered.length > 0) {
        setIsNITLocked(true);
        console.log(`🔒 NIT ${clientNIT} bloqueado - Cliente válido encontrado`);
        console.log(`📦 Productos disponibles: ${filtered.length}`);
        console.log('✅ Primeros 5 productos:', filtered.slice(0, 5).map(p => `${p.ref} - ${p.name}`));
      } else {
        setIsNITLocked(false);
        console.log(`❌ No se encontraron productos para NIT ${clientNIT}`);
      }
      
      console.log(`📦 Productos filtrados para NIT ${clientNIT} (${clientName}): ${filtered.length}`);
    } else {
      setFilteredProducts([]);
      setSelectedClient('');
      setIsNITLocked(false);
      console.log('❌ No hay NIT ingresado');
    }
  }, [clientNIT, products]);

  // Función para manejar cambios en el NIT
  const handleNITChange = (nit) => {
    setClientNIT(nit);
  };

  // Función para resetear el cliente
  const resetClient = () => {
    setSelectedClient('');
    setClientNIT('');
    setIsNITLocked(false);
    setFilteredProducts([]);
  };

  return {
    selectedClient,
    clientNIT,
    isNITLocked,
    filteredProducts,
    handleNITChange,
    resetClient
  };
};
