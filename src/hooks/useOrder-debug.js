import { useState, useEffect } from 'react';

export const useOrderDebug = (filteredProducts, calculatePriceByQuantity) => {
  const [formData, setFormData] = useState({
    deliveryDate: '',
    documentDate: '',
    notes: ''
  });
  
  const [lineItems, setLineItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchByCode, setSearchByCode] = useState('');
  const [searchByName, setSearchByName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [lineQuantity, setLineQuantity] = useState(1);
  const [linePrice, setLinePrice] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Configurar fecha mínima (hoy) al inicializar
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ 
      ...prev, 
      deliveryDate: today,
      documentDate: today 
    }));
  }, []);

  // Búsqueda de productos - VERSIÓN SIMPLIFICADA
  useEffect(() => {
    console.log('🔄 DEBUG: useEffect de búsqueda ejecutado');
    console.log('📊 DEBUG: Estado actual:', {
      filteredProductsLength: filteredProducts.length,
      searchByCode,
      searchByName,
      showSearchResults
    });
    
    if (!filteredProducts.length) {
      console.log('❌ DEBUG: No hay productos filtrados');
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // SIEMPRE mostrar todos los productos para testing
    console.log(`📦 DEBUG: Mostrando TODOS los productos: ${filteredProducts.length}`);
    setSearchResults(filteredProducts);
    setShowSearchResults(true);
    
  }, [filteredProducts, searchByCode, searchByName]);

  // Función para seleccionar un producto
  const selectProduct = (product) => {
    console.log(`📦 DEBUG: Producto seleccionado: ${product.ref} - ${product.name}`);
    setSelectedProduct(product);
    setLineQuantity(1);
    const price = calculatePriceByQuantity(product.ref, 1);
    setLinePrice(price);
    setShowSearchResults(false);
    setSearchByCode('');
    setSearchByName('');
  };

  // Función para agregar línea de pedido
  const addLineItem = () => {
    if (!selectedProduct || !lineQuantity || lineQuantity <= 0) {
      alert('Por favor selecciona un producto y especifica una cantidad válida');
      return;
    }

    const price = calculatePriceByQuantity(selectedProduct.ref, lineQuantity);
    if (price === 0) {
      alert('No se pudo calcular el precio para este producto. Verifica las escalas de precios.');
      return;
    }

    const newItem = {
      ref: selectedProduct.ref,
      name: selectedProduct.name,
      quantity: lineQuantity,
      price: price,
      total: price * lineQuantity
    };

    setLineItems(prev => [...prev, newItem]);
    
    // Limpiar formulario de línea
    setSelectedProduct(null);
    setLineQuantity(1);
    setLinePrice('');
  };

  // Función para actualizar cantidad de una línea
  const updateQuantity = (index, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    if (quantity <= 0) return;

    setLineItems(prev => prev.map((item, i) => {
      if (i === index) {
        const price = calculatePriceByQuantity(item.ref, quantity);
        return {
          ...item,
          quantity: quantity,
          price: price,
          total: price * quantity
        };
      }
      return item;
    }));
  };

  // Función para eliminar línea de pedido
  const removeLineItem = (index) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  // Función para limpiar formulario de línea
  const clearAddLineForm = () => {
    setSelectedProduct(null);
    setSearchByCode('');
    setSearchByName('');
    setLineQuantity(1);
    setLinePrice('');
    setShowSearchResults(false);
  };

  // Función para resetear todo el pedido
  const resetOrder = (showConfirmation = true) => {
    const shouldReset = showConfirmation ? 
      window.confirm('¿Estás seguro de que deseas limpiar todo el formulario?') : 
      true;
    
    if (shouldReset) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        deliveryDate: today,
        documentDate: today,
        notes: ''
      });
      setLineItems([]);
      clearAddLineForm();
      setShowSuccess(false);
      
      if (!showConfirmation) {
        console.log('✅ Sistema limpiado automáticamente después de generar orden');
      }
    }
  };

  // Calcular total
  const total = lineItems.reduce((sum, item) => sum + item.total, 0);

  return {
    formData,
    setFormData,
    lineItems,
    selectedProduct,
    searchByCode,
    setSearchByCode,
    searchByName,
    setSearchByName,
    searchResults,
    showSearchResults,
    setShowSearchResults,
    lineQuantity,
    setLineQuantity,
    linePrice,
    showSuccess,
    setShowSuccess,
    selectProduct,
    addLineItem,
    updateQuantity,
    removeLineItem,
    clearAddLineForm,
    resetOrder,
    total
  };
};
