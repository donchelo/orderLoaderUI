import { useState, useEffect } from 'react';

export const useOrder = (filteredProducts, calculatePriceByQuantity) => {
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

  // Búsqueda de productos - CORREGIDA
  useEffect(() => {
    console.log('🔄 useEffect de búsqueda ejecutado');
    console.log('📊 Estado actual:', {
      filteredProductsLength: filteredProducts.length,
      searchByCode,
      searchByName,
      showSearchResults
    });
    
    if (!filteredProducts.length) {
      console.log('❌ No hay productos filtrados');
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    let filtered = filteredProducts;
    
    // Aplicar filtros si hay texto en los campos de búsqueda
    if (searchByCode.length > 0) {
      filtered = filtered.filter(p => 
        p.ref && p.ref.toLowerCase().includes(searchByCode.toLowerCase())
      );
      console.log(`🔍 Filtro por código "${searchByCode}": ${filtered.length} productos encontrados`);
    }
    
    if (searchByName.length > 0) {
      filtered = filtered.filter(p => {
        const matchesName = p.name && p.name.toLowerCase().includes(searchByName.toLowerCase());
        const matchesCategory = p.categoria && p.categoria.toLowerCase().includes(searchByName.toLowerCase());
        return matchesName || matchesCategory;
      });
      console.log(`🔍 Filtro por nombre "${searchByName}": ${filtered.length} productos encontrados`);
    }

    setSearchResults(filtered);
    
    // Mostrar resultados si:
    // 1. Hay productos filtrados disponibles, O
    // 2. No hay texto de búsqueda pero hay productos del cliente
    const shouldShow = filtered.length > 0 || (searchByCode.length === 0 && searchByName.length === 0 && filteredProducts.length > 0);
    setShowSearchResults(shouldShow);
    
    console.log(`📊 Resultados finales: ${filtered.length} productos, mostrar: ${shouldShow}`);
    if (filtered.length > 0) {
      console.log(`✅ Productos encontrados:`, filtered.slice(0, 3).map(p => `${p.ref} - ${p.name}`));
    }
  }, [searchByCode, searchByName, filteredProducts]);

  // Mostrar automáticamente los productos cuando se selecciona un cliente
  useEffect(() => {
    console.log('🔄 useEffect de mostrar automáticamente ejecutado');
    console.log('📊 Estado:', {
      filteredProductsLength: filteredProducts.length,
      showSearchResults,
      searchResultsLength: searchResults.length
    });
    
    if (filteredProducts.length > 0) {
      console.log(`🔄 Mostrando productos automáticamente: ${filteredProducts.length}`);
      setSearchResults(filteredProducts);
      setShowSearchResults(true);
    }
  }, [filteredProducts]);

  // Función para seleccionar un producto
  const selectProduct = (product) => {
    console.log(`📦 Producto seleccionado: ${product.ref} - ${product.name}`);
    console.log('📊 Estado antes de seleccionar:', {
      showSearchResults,
      searchByCode,
      searchByName
    });
    
    setSelectedProduct(product);
    setLineQuantity(1);
    const price = calculatePriceByQuantity(product.ref, 1);
    setLinePrice(price);
    setShowSearchResults(false);
    
    // Cargar automáticamente el código y nombre del producto
    setSearchByCode(product.ref || '');
    setSearchByName(product.name || '');
    
    console.log('✅ Producto seleccionado y datos cargados automáticamente');
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
    
    // Limpiar formulario de línea COMPLETAMENTE
    setSelectedProduct(null);
    setSearchByCode(''); // Limpiar campo de búsqueda por código
    setSearchByName(''); // Limpiar campo de búsqueda por nombre
    setLineQuantity(1);
    setLinePrice('');
    setShowSearchResults(false); // Ocultar resultados de búsqueda
    
    console.log('✅ Producto agregado y formulario limpiado automáticamente');
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
