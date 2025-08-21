import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

// Configuración de la empresa
const EMPRESA_ID = 'TU_EMPRESA_ID'; // Cambiar por el ID de tu empresa

// Base de datos de productos (se carga desde CSV)
let products = [];
let priceScales = []; // Escalas de precios por producto

function App() {
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
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [availableClients, setAvailableClients] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  
  const searchRef = useRef(null);

  // Función para limpiar y convertir precio
  const cleanPrice = (priceStr) => {
    if (!priceStr) return 0;
    // Remover comillas, comas y espacios, convertir a número
    return parseInt(priceStr.toString().replace(/[",\s]/g, '')) || 0;
  };

  // Función para limpiar y convertir cantidad
  const cleanQuantity = (qtyStr) => {
    if (!qtyStr) return 0;
    // Remover comillas, comas y puntos decimales, convertir a número
    return parseInt(qtyStr.toString().replace(/[",\.]/g, '')) || 0;
  };

  // Función para calcular precio basado en escalas
  const calculatePriceByQuantity = (productRef, quantity) => {
    if (!priceScales[productRef] || !quantity || quantity <= 0) {
      console.log(`❌ No se pudo calcular precio para ${productRef}, cantidad: ${quantity}`);
      return 0;
    }
    
    const scales = priceScales[productRef];
    
    // Ordenar escalas por cantidad (ascendente)
    const sortedScales = scales.sort((a, b) => a.cantidad - b.cantidad);
    
    console.log(`🔍 Calculando precio para ${productRef}, cantidad: ${quantity}`);
    console.log(`📊 Escalas disponibles:`, sortedScales);
    
    // Si solo hay una escala, usar esa
    if (sortedScales.length === 1) {
      console.log(`✅ Una sola escala: ${sortedScales[0].cantidad}+ unidades = $${sortedScales[0].precio}`);
      return sortedScales[0].precio;
    }
    
    // Si hay múltiples escalas, encontrar la que corresponda a la cantidad
    let selectedScale = sortedScales[0]; // Escala por defecto (la primera)
    
    // Buscar la escala apropiada: la cantidad debe ser >= a la cantidad de la escala
    for (let i = sortedScales.length - 1; i >= 0; i--) {
      if (quantity >= sortedScales[i].cantidad) {
        selectedScale = sortedScales[i];
        break;
      }
    }
    
    console.log(`✅ Escala seleccionada: ${selectedScale.cantidad}+ unidades = $${selectedScale.precio}`);
    return selectedScale.precio;
  };

  // Función para cargar productos desde CSV o XLSX
  const loadProductsFromFile = async () => {
    setLoadingProducts(true);
    
    try {
      // Intentar cargar XLSX primero, luego CSV como respaldo
      let dataLoaded = false;
      
      // Intentar cargar XLSX
      try {
        const xlsxResponse = await fetch('/data/productos.xlsx');
        if (xlsxResponse.ok) {
          const arrayBuffer = await xlsxResponse.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          console.log('📊 Cargando desde archivo XLSX...');
          console.log(`📋 Filas encontradas: ${jsonData.length}`);
          
          const loadedProducts = [];
          const loadedScales = {};
          const categories = new Set();
          
          // Procesar datos del XLSX (asumiendo la misma estructura que CSV)
          jsonData.slice(1).forEach((row, index) => {
            if (!row || row.length < 11) {
              return;
            }
            
            const ref = row[7]?.toString().trim() || ''; // Nº catálogo SN (columna H)
            const name = row[1]?.toString().trim() || ''; // Descripción del artículo (columna B)
            const empresa = row[3]?.toString().trim() || '';
            const cantidad = row[9] ? cleanQuantity(row[9]) : 0;
            const precioEspecial = row[10] ? cleanPrice(row[10]) : 0; // Precio especial (columna K)
            const categoria = row[8]?.toString().trim() || 'General';
            
            if (!ref || !name) {
              return;
            }
            
            if (precioEspecial === 0) {
              return;
            }
            
            // Agregar escala de precio (columna K = precio especial)
            if (!loadedScales[ref]) {
              loadedScales[ref] = [];
            }
            
            loadedScales[ref].push({
              cantidad: cantidad, // Cantidad de la escala (columna J)
              precio: precioEspecial // Precio especial de la escala (columna K)
            });
            
            // Solo agregar el producto una vez
            const existingProduct = loadedProducts.find(p => p.ref === ref);
            if (!existingProduct) {
              loadedProducts.push({
                ref: ref,
                name: name,
                categoria: categoria,
                empresa: empresa,
                descripcion: name
              });
              categories.add(categoria);
            }
          });
          
          if (loadedProducts.length > 0) {
            products = loadedProducts;
            priceScales = loadedScales;
            dataLoaded = true;
            
            console.log(`✅ Productos cargados desde XLSX: ${loadedProducts.length}`);
          }
        }
      } catch (xlsxError) {
        console.log('⚠️ No se pudo cargar XLSX, intentando CSV...');
      }
      
      // Si no se cargó XLSX, intentar CSV
      if (!dataLoaded) {
        try {
          const csvResponse = await fetch('/data/productos.csv');
          if (csvResponse.ok) {
            const csvText = await csvResponse.text();
            const lines = csvText.split('\n');
            
            console.log('📊 Cargando desde archivo CSV...');
            console.log(`📋 Líneas encontradas: ${lines.length}`);
            
            const loadedProducts = [];
            const loadedScales = {};
            const categories = new Set();
            
            lines.slice(1).forEach((line, index) => {
              if (!line.trim()) return;
              
              const values = line.split(',');
              
              if (values.length < 11) {
                return;
              }
              
              const ref = values[7]?.trim() || ''; // Nº catálogo SN (columna H)
              const name = values[1]?.trim() || ''; // Descripción del artículo (columna B)
              const empresa = values[3]?.trim() || '';
              const cantidad = values[9] ? cleanQuantity(values[9]) : 0;
              const precioEspecial = values[10] ? cleanPrice(values[10]) : 0; // Precio especial (columna K)
              const categoria = values[8]?.trim() || 'General';
              
              if (!ref || !name) {
                return;
              }
              
              if (precioEspecial === 0) {
                return;
              }
              
              // Agregar escala de precio (columna K = precio especial)
              if (!loadedScales[ref]) {
                loadedScales[ref] = [];
              }
              
              loadedScales[ref].push({
                cantidad: cantidad, // Cantidad de la escala (columna J)
                precio: precioEspecial // Precio especial de la escala (columna K)
              });
              
              // Solo agregar el producto una vez
              const existingProduct = loadedProducts.find(p => p.ref === ref);
              if (!existingProduct) {
                loadedProducts.push({
                  ref: ref,
                  name: name,
                  categoria: categoria,
                  empresa: empresa,
                  descripcion: name
                });
                categories.add(categoria);
              }
            });
            
            if (loadedProducts.length > 0) {
              products = loadedProducts;
              priceScales = loadedScales;
              dataLoaded = true;
              
              console.log(`✅ Productos cargados desde CSV: ${loadedProducts.length}`);
            }
          }
        } catch (csvError) {
          console.log('❌ Error cargando CSV:', csvError);
        }
      }
      
      // Si no se cargó ningún archivo, usar datos por defecto
      if (!dataLoaded) {
        console.log('⚠️ Usando productos por defecto');
        products = [
          { ref: 'REF001', name: 'Producto Alpha Series', categoria: 'General' },
          { ref: 'REF002', name: 'Producto Beta Professional', categoria: 'General' },
        ];
        priceScales = {
          'REF001': [{ cantidad: 1, precio: 25000 }, { cantidad: 10, precio: 22000 }, { cantidad: 50, precio: 20000 }],
          'REF002': [{ cantidad: 1, precio: 35000 }, { cantidad: 5, precio: 32000 }, { cantidad: 20, precio: 30000 }]
        };
      }
      
      // Extraer clientes únicos
      const clients = [...new Set(products.map(p => p.empresa).filter(empresa => empresa))];
      setAvailableClients(clients);
      
      console.log(`🏢 Clientes disponibles: ${clients.length}`);
      console.log('Clientes:', clients);
      
    } catch (error) {
      console.log('❌ Error general cargando productos:', error);
      
      // Productos por defecto en caso de error
      products = [
        { ref: 'REF001', name: 'Producto Alpha Series', categoria: 'General' },
        { ref: 'REF002', name: 'Producto Beta Professional', categoria: 'General' },
      ];
      priceScales = {
        'REF001': [{ cantidad: 1, precio: 25000 }, { cantidad: 10, precio: 22000 }, { cantidad: 50, precio: 20000 }],
        'REF002': [{ cantidad: 1, precio: 35000 }, { cantidad: 5, precio: 32000 }, { cantidad: 20, precio: 30000 }]
      };
    }
    
    setProductsLoaded(true);
    setLoadingProducts(false);
  };

  // Configurar fecha mínima (hoy) y cargar productos
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ 
      ...prev, 
      deliveryDate: today,
      documentDate: today 
    }));
    
    // Cargar productos al iniciar
    loadProductsFromFile();
  }, []);

  // Filtrar productos por cliente seleccionado
  useEffect(() => {
    if (selectedClient) {
      const filtered = products.filter(p => p.empresa === selectedClient);
      setFilteredProducts(filtered);
      console.log(`📦 Productos filtrados para ${selectedClient}: ${filtered.length}`);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedClient, productsLoaded]);

  // Búsqueda de productos (solo dentro del cliente seleccionado)
  useEffect(() => {
    if (!selectedClient) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Solo buscar si hay al menos 1 carácter en alguno de los campos
    if (searchByCode.length < 1 && searchByName.length < 1) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = filteredProducts.filter(p => {
      // Búsqueda por Nº catálogo SN (columna H del CSV)
      const matchesCode = searchByCode.length >= 1 && 
        p.ref.toLowerCase().includes(searchByCode.toLowerCase());
      
      // Búsqueda por Descripción del artículo (columna B del CSV)
      const matchesName = searchByName.length >= 1 && 
        p.name.toLowerCase().includes(searchByName.toLowerCase());
      
      // Búsqueda adicional en categoría
      const matchesCategory = searchByName.length >= 1 && 
        p.categoria && p.categoria.toLowerCase().includes(searchByName.toLowerCase());
      
      // Si hay búsqueda por Nº catálogo SN, priorizar esa
      if (searchByCode.length >= 1) {
        return matchesCode;
      }
      
      // Si solo hay búsqueda por descripción, buscar en nombre y categoría
      if (searchByName.length >= 1) {
        return matchesName || matchesCategory;
      }
      
      return false;
    });

    setSearchResults(filtered);
    setShowSearchResults(filtered.length > 0);
  }, [searchByCode, searchByName, selectedClient, filteredProducts]);

  // Calcular precio automáticamente cuando cambie la cantidad
  useEffect(() => {
    if (selectedProduct && lineQuantity > 0) {
      const calculatedPrice = calculatePriceByQuantity(selectedProduct.ref, lineQuantity);
      if (calculatedPrice > 0) {
        setLinePrice(`$${calculatedPrice.toLocaleString('es-CO')}`);
      } else {
        setLinePrice('');
      }
    }
  }, [lineQuantity, selectedProduct]);

  // Ocultar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setSearchByCode(product.ref);
    setSearchByName(product.name);
    setLinePrice(''); // El precio se calculará automáticamente cuando se ingrese la cantidad
    setShowSearchResults(false);
    
    // Mostrar información de escalas en consola
    const scales = priceScales[product.ref] || [];
    if (scales.length > 0) {
      const sortedScales = scales.sort((a, b) => a.cantidad - b.cantidad);
      console.log(`📦 Producto seleccionado: ${product.ref} - ${product.name}`);
      console.log(`💰 Escalas disponibles:`);
      sortedScales.forEach((scale, index) => {
        console.log(`   ${index + 1}. ${scale.cantidad}+ unidades: $${scale.precio.toLocaleString('es-CO')}`);
      });
    } else {
      console.log(`⚠️ Producto ${product.ref} no tiene escalas de precio configuradas`);
    }
  };

  const addLineItem = () => {
    if (!selectedProduct) {
      alert('Por favor selecciona un producto');
      return;
    }

    if (lineQuantity < 1) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    // Calcular precio basado en la cantidad
    const calculatedPrice = calculatePriceByQuantity(selectedProduct.ref, lineQuantity);
    if (calculatedPrice === 0) {
      alert('No se pudo calcular el precio para esta cantidad');
      return;
    }

    // Verificar si el producto ya existe
    const existingIndex = lineItems.findIndex(item => item.ref === selectedProduct.ref);
    
    if (existingIndex >= 0) {
      const updatedItems = [...lineItems];
      const newTotalQuantity = updatedItems[existingIndex].quantity + lineQuantity;
      
      // Recalcular precio para la nueva cantidad total
      const newPrice = calculatePriceByQuantity(selectedProduct.ref, newTotalQuantity);
      updatedItems[existingIndex].quantity = newTotalQuantity;
      updatedItems[existingIndex].price = newPrice;
      updatedItems[existingIndex].total = newTotalQuantity * newPrice;
      setLineItems(updatedItems);
    } else {
      const newItem = {
        ref: selectedProduct.ref,
        name: selectedProduct.name,
        quantity: lineQuantity,
        price: calculatedPrice,
        total: lineQuantity * calculatedPrice,
        categoria: selectedProduct.categoria
      };
      setLineItems([...lineItems, newItem]);
    }

    clearAddLineForm();
  };

  const updateQuantity = (index, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      const item = lineItems[index];
      
      // Recalcular precio basado en la nueva cantidad
      const newPrice = calculatePriceByQuantity(item.ref, quantity);
      if (newPrice === 0) {
        alert('No se pudo calcular el precio para esta cantidad');
        return;
      }
      
      const updatedItems = [...lineItems];
      updatedItems[index].quantity = quantity;
      updatedItems[index].price = newPrice;
      updatedItems[index].total = quantity * newPrice;
      setLineItems(updatedItems);
    }
  };

  const removeLineItem = (index) => {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedItems);
  };

  const clearAddLineForm = () => {
    setSearchByCode('');
    setSearchByName('');
    setLineQuantity(1);
    setLinePrice('');
    setSelectedProduct(null);
  };

  const handleClientChange = (client) => {
    setSelectedClient(client);
    setSearchByCode('');
    setSearchByName('');
    setSelectedProduct(null);
    setLinePrice('');
    setLineItems([]); // Limpiar productos del pedido al cambiar cliente
  };

  const resetForm = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todo el formulario?')) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        deliveryDate: today,
        documentDate: today,
        notes: ''
      });
      setLineItems([]);
      setSelectedClient('');
      clearAddLineForm();
      setShowSuccess(false);
    }
  };

  const reloadProducts = async () => {
    if (window.confirm('¿Deseas recargar los productos desde el archivo?')) {
  
      await loadProductsFromFile();
    }
  };

  const testSearch = () => {
    if (!selectedClient) {
      alert('Primero selecciona un cliente para probar la búsqueda');
      return;
    }
    
    const testResults = {
      totalProducts: filteredProducts.length,
      productsWithScales: 0,
      productsWithoutScales: 0,
      sampleProducts: []
    };
    
    filteredProducts.forEach(product => {
      const scales = priceScales[product.ref] || [];
      if (scales.length > 0) {
        testResults.productsWithScales++;
      } else {
        testResults.productsWithoutScales++;
      }
      
      if (testResults.sampleProducts.length < 5) {
        testResults.sampleProducts.push({
          ref: product.ref,
          name: product.name,
          scalesCount: scales.length,
          minPrice: scales.length > 0 ? Math.min(...scales.map(s => s.precio)) : 0,
          maxPrice: scales.length > 0 ? Math.max(...scales.map(s => s.precio)) : 0
        });
      }
    });
    
    console.log('🔍 Resultados de prueba de búsqueda:', testResults);
    alert(`Prueba de búsqueda completada:\n\n` +
          `📦 Total productos: ${testResults.totalProducts}\n` +
          `💰 Con escalas: ${testResults.productsWithScales}\n` +
          `❌ Sin escalas: ${testResults.productsWithoutScales}\n\n` +
          `Revisa la consola para más detalles.`);
  };

  const testPriceCalculation = () => {
    if (!selectedClient) {
      alert('Primero selecciona un cliente para probar el cálculo de precios');
      return;
    }
    
    const testQuantities = [1, 5, 10, 25, 50, 100];
    const testResults = [];
    
    // Tomar los primeros 3 productos para la prueba
    const sampleProducts = filteredProducts.slice(0, 3);
    
    sampleProducts.forEach(product => {
      const scales = priceScales[product.ref] || [];
      if (scales.length > 0) {
        const sortedScales = scales.sort((a, b) => a.cantidad - b.cantidad);
        
        testResults.push({
          ref: product.ref,
          name: product.name,
          scales: sortedScales,
          calculations: testQuantities.map(qty => ({
            quantity: qty,
            price: calculatePriceByQuantity(product.ref, qty)
          }))
        });
      }
    });
    
    console.log('💰 Prueba de cálculo de precios:', testResults);
    
    let alertMessage = 'Prueba de cálculo de precios por escalas:\n\n';
    testResults.forEach(result => {
      alertMessage += `📦 ${result.ref} - ${result.name}\n`;
      alertMessage += `💰 Escalas en BD: ${result.scales.map(s => `${s.cantidad}+: $${s.precio.toLocaleString('es-CO')}`).join(' | ')}\n`;
      alertMessage += `🔢 Cálculos: ${result.calculations.map(c => `${c.quantity}→$${c.price.toLocaleString('es-CO')}`).join(' | ')}\n\n`;
    });
    
    alert(alertMessage + 'Revisa la consola para más detalles.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClient) {
      alert('Debe seleccionar un cliente antes de generar la orden');
      return;
    }

    if (lineItems.length === 0) {
      alert('Debe agregar al menos un producto al pedido');
      return;
    }

    const orderData = {
      cliente: selectedClient,
      fechaDocumento: formData.documentDate,
      fechaEntrega: formData.deliveryDate,
      observaciones: formData.notes,
      lineas: lineItems,
      total: lineItems.reduce((sum, item) => sum + item.total, 0),
      fecha: new Date().toISOString(),
      empresaId: EMPRESA_ID
    };

    console.log('Datos del pedido:', orderData);
    
    setShowSuccess(true);
    
    // Scroll al mensaje de éxito
    setTimeout(() => {
      const successElement = document.getElementById('successMessage');
      if (successElement) {
        successElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const total = lineItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="container">
      <div className="header">
        <h1>Sistema de Pedidos</h1>
        <p>Generación de órdenes de compra corporativas</p>
        {loadingProducts && <p style={{color: '#3498db', fontSize: '14px'}}>🔄 Cargando productos desde base de datos...</p>}
        {productsLoaded && (
          <p style={{color: '#27ae60', fontSize: '14px', marginTop: '10px'}}>
            ✅ Base de datos cargada correctamente
          </p>
        )}
      </div>



      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Información General */}
          <div className="form-section">
            <div className="section-title">Información General</div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientSelect">Cliente <span className="required">*</span></label>
                <select
                  id="clientSelect"
                  value={selectedClient}
                  onChange={(e) => handleClientChange(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="">-- Selecciona un cliente --</option>
                  {availableClients.map((client, index) => (
                    <option key={index} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
                {selectedClient && (
                  <p style={{color: '#27ae60', fontSize: '12px', marginTop: '5px'}}>
                    📦 {filteredProducts.length} productos disponibles para {selectedClient}
                  </p>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="documentDate">Fecha Documento</label>
                <input
                  type="text"
                  id="documentDate"
                  value={formData.documentDate}
                  readOnly
                  style={{ 
                    background: '#f8f9fa', 
                    color: '#6c757d',
                    cursor: 'not-allowed'
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="deliveryDate">Fecha de Entrega <span className="required">*</span></label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Líneas de Pedido */}
          <div className="form-section">
            <div className="section-title">Productos</div>
            
            {/* Agregar Nueva Línea */}
            <div className="add-line-section">
              <div className="add-line-row">
                <div className="form-group">
                  <label>Nº Catálogo SN</label>
                  <div className="search-container" ref={searchRef}>
                    <input
                      type="text"
                      className="search-input"
                      value={searchByCode}
                      onChange={(e) => setSearchByCode(e.target.value)}
                      placeholder={selectedClient ? "Buscar por Nº catálogo SN" : "Primero selecciona un cliente"}
                      disabled={!selectedClient}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción del Artículo</label>
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      value={searchByName}
                      onChange={(e) => setSearchByName(e.target.value)}
                      placeholder={selectedClient ? "Buscar por descripción o categoría" : "Primero selecciona un cliente"}
                      disabled={!selectedClient}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    value={lineQuantity}
                    onChange={(e) => setLineQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    className="quantity-input"
                  />
                </div>
                <div className="form-group">
                  <label>Precio Unitario (Automático)</label>
                  <input
                    type="text"
                    value={linePrice}
                    readOnly
                    style={{ background: '#f8f9fa' }}
                    placeholder="Se calcula automáticamente según la cantidad"
                  />
                </div>
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={addLineItem}
                    disabled={!selectedClient}
                    style={{ opacity: !selectedClient ? 0.6 : 1 }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
              
              {/* Resultados de búsqueda */}
              <div className="search-container" style={{ marginTop: '10px' }}>
                <div className={`search-results ${showSearchResults ? 'show' : ''}`}>
                  {searchResults.slice(0, 10).map((product) => {
                    const scales = priceScales[product.ref] || [];
                    const sortedScales = scales.sort((a, b) => a.cantidad - b.cantidad);
                    const minPrice = scales.length > 0 ? Math.min(...scales.map(s => s.precio)) : 0;
                    const maxPrice = scales.length > 0 ? Math.max(...scales.map(s => s.precio)) : 0;
                    
                    return (
                      <div
                        key={product.ref}
                        className="search-result-item"
                        onClick={() => selectProduct(product)}
                      >
                        <div><strong>{product.ref}</strong> - {product.name}</div>
                        <div className="product-info">
                          {scales.length > 0 ? (
                            <span>
                              💰 Precio especial: {scales.length === 1 ? 
                                `$${scales[0].precio.toLocaleString('es-CO')}` : 
                                `${scales.length} escalas disponibles`
                              }
                            </span>
                          ) : (
                            <span>💰 Precio: No disponible</span>
                          )}
                          {product.categoria && ` | ${product.categoria}`}
                        </div>
                      </div>
                    );
                  })}
                  {searchResults.length > 10 && (
                    <div className="search-result-item" style={{fontStyle: 'italic', color: '#7f8c8d'}}>
                      ... y {searchResults.length - 10} productos más. Refina tu búsqueda.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabla de Líneas */}
            <table className="line-items-table">
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ref}</td>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        className="quantity-input"
                        onChange={(e) => updateQuantity(index, e.target.value)}
                      />
                    </td>
                    <td className="price-cell">${item.price.toLocaleString('es-CO')}</td>
                    <td className="price-cell">${item.total.toLocaleString('es-CO')}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeLineItem(index)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Observaciones */}
          <div className="form-section">
            <div className="section-title">Observaciones</div>
            <div className="form-group">
              <label htmlFor="notes">Información adicional del pedido</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Agregar observaciones, notas especiales o información adicional del pedido..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Total */}
          <div className="total-section">
            <div>Total del Pedido</div>
            <div className="total-amount">${total.toLocaleString('es-CO')}</div>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Limpiar
              </button>
              <button type="submit" className="btn btn-success">
                Generar Orden de Compra
              </button>
            </div>
          </div>

          <div className={`success-message ${showSuccess ? 'show' : ''}`} id="successMessage">
            Orden creada exitosamente. Se ha enviado confirmación por correo electrónico.
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;