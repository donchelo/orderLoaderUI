import React, { useState, useEffect, useRef } from 'react';

// Configuración de la empresa
const EMPRESA_ID = 'TU_EMPRESA_ID'; // Cambiar por el ID de tu empresa

// Base de datos de productos (se carga desde CSV)
let products = [];

function App() {
  const [formData, setFormData] = useState({
    deliveryDate: '',
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

  // Función para cargar productos desde CSV
  const loadProductsFromFile = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('/data/productos.csv');
      if (response.ok) {
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // Saltar la primera línea (headers)
        const dataLines = lines.slice(1);
        
        const loadedProducts = dataLines.map(line => {
          if (!line.trim()) return null;
          
          const values = line.split(',');
          
          // Estructura del CSV:
          // 0: Número de artículo, 1: Descripción, 2: Código SN, 3: Nombre SN, 
          // 9: Cantidad, 10: Precio especial, 11: Moneda
          
          const ref = values[0]?.trim() || '';
          const name = values[1]?.trim() || '';
          const empresa = values[3]?.trim() || '';
          const cantidad = values[9] ? cleanQuantity(values[9]) : 0;
          const precio = values[10] ? cleanPrice(values[10]) : 0;
          const categoria = values[8]?.trim() || 'General';
          
          if (!ref || !name || precio === 0) return null;
          
          return {
            ref: ref,
            name: name,
            price: precio,
            categoria: categoria,
            stock: cantidad,
            empresa: empresa,
            descripcion: name
          };
        }).filter(p => p !== null);
        
        // Eliminar duplicados basados en ref
        const uniqueProducts = loadedProducts.reduce((acc, current) => {
          const existing = acc.find(item => item.ref === current.ref);
          if (!existing) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        if (uniqueProducts.length > 0) {
          products = uniqueProducts;
          
          // Extraer clientes únicos
          const clients = [...new Set(uniqueProducts.map(p => p.empresa).filter(empresa => empresa))];
          setAvailableClients(clients);
          
          console.log(`✅ Productos cargados desde CSV: ${uniqueProducts.length}`);
          console.log(`🏢 Clientes disponibles: ${clients.length}`);
          console.log('Clientes:', clients);
        }
      } else {
        console.log('❌ No se pudo cargar el archivo CSV');
      }
    } catch (error) {
      console.log('❌ Error cargando productos:', error);
      // Productos por defecto en caso de error
      products = [
        { ref: 'REF001', name: 'Producto Alpha Series', price: 25000, categoria: 'General', stock: 100 },
        { ref: 'REF002', name: 'Producto Beta Professional', price: 35000, categoria: 'General', stock: 50 },
      ];
    }
    
    setProductsLoaded(true);
    setLoadingProducts(false);
  };

  // Configurar fecha mínima (hoy) y cargar productos
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, deliveryDate: today }));
    
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
      // Búsqueda por Número de artículo (columna 0 del CSV)
      const matchesCode = searchByCode.length >= 1 && 
        p.ref.toLowerCase().includes(searchByCode.toLowerCase());
      
      // Búsqueda por Descripción del artículo (columna 1 del CSV)
      const matchesName = searchByName.length >= 1 && 
        p.name.toLowerCase().includes(searchByName.toLowerCase());
      
      // Búsqueda adicional en categoría
      const matchesCategory = searchByName.length >= 1 && 
        p.categoria && p.categoria.toLowerCase().includes(searchByName.toLowerCase());
      
      // Si hay búsqueda por código (Número de artículo), priorizar esa
      if (searchByCode.length >= 1) {
        return matchesCode;
      }
      
      // Si solo hay búsqueda por nombre (Descripción), buscar en nombre y categoría
      if (searchByName.length >= 1) {
        return matchesName || matchesCategory;
      }
      
      return false;
    });

    setSearchResults(filtered);
    setShowSearchResults(filtered.length > 0);
  }, [searchByCode, searchByName, selectedClient, filteredProducts]);

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
    setLinePrice(`$${product.price.toLocaleString('es-CO')}`);
    setShowSearchResults(false);
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

    // Verificar stock disponible
    if (selectedProduct.stock && lineQuantity > selectedProduct.stock) {
      alert(`Stock insuficiente. Solo hay ${selectedProduct.stock} unidades disponibles.`);
      return;
    }

    // Verificar si el producto ya existe
    const existingIndex = lineItems.findIndex(item => item.ref === selectedProduct.ref);
    
    if (existingIndex >= 0) {
      const updatedItems = [...lineItems];
      const newTotalQuantity = updatedItems[existingIndex].quantity + lineQuantity;
      
      if (selectedProduct.stock && newTotalQuantity > selectedProduct.stock) {
        alert(`Stock insuficiente. Solo hay ${selectedProduct.stock} unidades disponibles.`);
        return;
      }
      
      updatedItems[existingIndex].quantity = newTotalQuantity;
      updatedItems[existingIndex].total = newTotalQuantity * updatedItems[existingIndex].price;
      setLineItems(updatedItems);
    } else {
      const newItem = {
        ref: selectedProduct.ref,
        name: selectedProduct.name,
        quantity: lineQuantity,
        price: selectedProduct.price,
        total: lineQuantity * selectedProduct.price,
        categoria: selectedProduct.categoria,
        stock: selectedProduct.stock
      };
      setLineItems([...lineItems, newItem]);
    }

    clearAddLineForm();
  };

  const updateQuantity = (index, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      const item = lineItems[index];
      if (item.stock && quantity > item.stock) {
        alert(`Stock insuficiente. Solo hay ${item.stock} unidades disponibles.`);
        return;
      }
      
      const updatedItems = [...lineItems];
      updatedItems[index].quantity = quantity;
      updatedItems[index].total = quantity * updatedItems[index].price;
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
      setFormData({
        deliveryDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setLineItems([]);
      setSelectedClient('');
      clearAddLineForm();
      setShowSuccess(false);
    }
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
        {productsLoaded && <p style={{color: '#27ae60', fontSize: '14px'}}>✅ Base de datos cargada: {products.length} productos de {availableClients.length} clientes</p>}
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
            <div className="form-row full-width">
              <div className="form-group">
                <label htmlFor="notes">Observaciones</label>
                <input
                  type="text"
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Información adicional del pedido"
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
                  <label>Número de Artículo</label>
                  <div className="search-container" ref={searchRef}>
                    <input
                      type="text"
                      className="search-input"
                      value={searchByCode}
                      onChange={(e) => setSearchByCode(e.target.value)}
                      placeholder={selectedClient ? "Buscar por número de artículo" : "Primero selecciona un cliente"}
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
                    max={selectedProduct?.stock || 999999}
                    className="quantity-input"
                  />
                </div>
                <div className="form-group">
                  <label>Precio Unitario</label>
                  <input
                    type="text"
                    value={linePrice}
                    readOnly
                    style={{ background: '#f8f9fa' }}
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
                  {searchResults.slice(0, 10).map((product) => (
                    <div
                      key={product.ref}
                      className="search-result-item"
                      onClick={() => selectProduct(product)}
                    >
                      <div><strong>{product.ref}</strong> - {product.name}</div>
                      <div className="product-info">
                        ${product.price.toLocaleString('es-CO')} 
                        {product.categoria && ` | ${product.categoria}`}
                        {product.stock && ` | Stock: ${product.stock}`}
                      </div>
                    </div>
                  ))}
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
                        max={item.stock || 999999}
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

          {/* Total */}
          <div className="total-section">
            <div>Total del Pedido</div>
            <div className="total-amount">${total.toLocaleString('es-CO')}</div>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Limpiar
            </button>
            <button type="submit" className="btn btn-success">
              Generar Orden de Compra
            </button>
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