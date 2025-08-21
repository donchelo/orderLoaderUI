import React, { useState, useEffect, useRef } from 'react';

// Base de datos de productos simulada
const products = [
  { ref: 'REF001', name: 'Producto Alpha Series', price: 25000 },
  { ref: 'REF002', name: 'Producto Beta Professional', price: 35000 },
  { ref: 'REF003', name: 'Producto Gamma Enterprise', price: 45000 },
  { ref: 'REF004', name: 'Producto Delta Industrial', price: 55000 },
  { ref: 'REF005', name: 'Sistema Alpha Control', price: 75000 },
  { ref: 'REF006', name: 'Módulo Beta Integration', price: 42000 },
  { ref: 'REF007', name: 'Componente Gamma Advanced', price: 38000 },
];

function App() {
  const [formData, setFormData] = useState({
    company: '',
    deliveryDate: '',
    notes: ''
  });
  
  const [lineItems, setLineItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [lineQuantity, setLineQuantity] = useState(1);
  const [linePrice, setLinePrice] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const searchRef = useRef(null);

  // Configurar fecha mínima (hoy)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, deliveryDate: today }));
  }, []);

  // Búsqueda de productos
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = products.filter(p => 
      p.ref.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setShowSearchResults(filtered.length > 0);
  }, [searchQuery]);

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
    setSearchQuery(`${product.ref} - ${product.name}`);
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

    // Verificar si el producto ya existe
    const existingIndex = lineItems.findIndex(item => item.ref === selectedProduct.ref);
    
    if (existingIndex >= 0) {
      const updatedItems = [...lineItems];
      updatedItems[existingIndex].quantity += lineQuantity;
      updatedItems[existingIndex].total = updatedItems[existingIndex].quantity * updatedItems[existingIndex].price;
      setLineItems(updatedItems);
    } else {
      const newItem = {
        ref: selectedProduct.ref,
        name: selectedProduct.name,
        quantity: lineQuantity,
        price: selectedProduct.price,
        total: lineQuantity * selectedProduct.price
      };
      setLineItems([...lineItems, newItem]);
    }

    clearAddLineForm();
  };

  const updateQuantity = (index, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
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
    setSearchQuery('');
    setLineQuantity(1);
    setLinePrice('');
    setSelectedProduct(null);
  };

  const resetForm = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todo el formulario?')) {
      setFormData({
        company: '',
        deliveryDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setLineItems([]);
      clearAddLineForm();
      setShowSuccess(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (lineItems.length === 0) {
      alert('Debe agregar al menos un producto al pedido');
      return;
    }

    const orderData = {
      empresa: formData.company,
      fechaEntrega: formData.deliveryDate,
      observaciones: formData.notes,
      lineas: lineItems,
      total: lineItems.reduce((sum, item) => sum + item.total, 0),
      fecha: new Date().toISOString()
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
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Información General */}
          <div className="form-section">
            <div className="section-title">Información General</div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Empresa <span className="required">*</span></label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  placeholder="Nombre de la empresa"
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
                  <label>Buscar Producto</label>
                  <div className="search-container" ref={searchRef}>
                    <input
                      type="text"
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por referencia o nombre del producto"
                    />
                    <div className={`search-results ${showSearchResults ? 'show' : ''}`}>
                      {searchResults.map((product) => (
                        <div
                          key={product.ref}
                          className="search-result-item"
                          onClick={() => selectProduct(product)}
                        >
                          <div><strong>{product.ref}</strong> - {product.name}</div>
                          <div className="product-info">${product.price.toLocaleString('es-CO')}</div>
                        </div>
                      ))}
                    </div>
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
                  <button type="button" className="btn btn-primary" onClick={addLineItem}>
                    Agregar
                  </button>
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
