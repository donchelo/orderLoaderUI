import React, { useRef, useState } from 'react';
import { Package, Search, FileText, CheckCircle, Plus, Trash2, Edit, Upload, Database, Settings } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import { useClient } from './hooks/useClient';
import { useOrder } from './hooks/useOrder';
import { usePdfUpload } from './hooks/usePdfUpload';
import { generateOrderJSON, saveOrderJSON } from './utils/jsonGenerator';
import Header from './components/Header/Header';
import ClientForm from './components/ClientForm/ClientForm';
import PdfUpload from './components/PdfUpload/PdfUpload';
import OrderHistory from './components/OrderHistory/OrderHistory';
import ProductManagement from './components/ProductManagement/ProductManagement';
import Footer from './components/Footer/Footer';
import './index.css';

function App() {
  const searchRef = useRef(null);

  // Usar hooks personalizados
  const {
    products,
    priceScales,
    productsLoaded,
    loadingProducts,
    availableClients,
    calculatePriceByQuantity,
    loadProductsFromFile,
    addProduct,
    updateProduct,
    deleteProduct,
    importProductsFromFile
  } = useProducts();

  const {
    selectedClient,
    clientNIT,
    isNITLocked,
    filteredProducts,
    handleNITChange,
    resetClient
  } = useClient(products);

  const {
    formData,
    setFormData,
    lineItems,
    setLineItems,
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
  } = useOrder(filteredProducts, calculatePriceByQuantity);

  // Hook para manejo de carga de PDFs
  const {
    showPdfUpload,
    isProcessingPdf,
    openPdfUpload,
    closePdfUpload,
    handlePdfUploaded
  } = usePdfUpload();

  // Estado para almacenar el PDF subido
  const [uploadedPdf, setUploadedPdf] = useState(null);

  // Estado para navegación entre pantallas
  const [currentView, setCurrentView] = useState('orders'); // 'orders' o 'products'

  // Debug: verificar valores
  console.log('App.js - Estado actual:', {
    productsLength: products.length,
    filteredProductsLength: filteredProducts.length,
    selectedClient,
    clientNIT,
    searchByCode,
    searchByName,
    searchResultsLength: searchResults.length,
    showSearchResults
  });

  // Mostrar productos disponibles si hay un cliente seleccionado
  if (selectedClient && filteredProducts.length > 0) {
    console.log('Productos disponibles para selección:', filteredProducts.slice(0, 3).map(p => `${p.ref} - ${p.name}`));
  }

  // Función para recargar productos
  const reloadProducts = async () => {
    if (window.confirm('¿Deseas recargar los productos desde el archivo?')) {
      await loadProductsFromFile();
    }
  };

  // Función para resetear el formulario
  const resetForm = (showConfirmation = true) => {
    resetOrder(showConfirmation);
    resetClient();
    setUploadedPdf(null); // Limpiar también el PDF subido
  };

  // Función para manejar la subida de PDF
  const handlePdfProcessed = async (uploadedFileData) => {
    const result = await handlePdfUploaded(uploadedFileData);

    if (result.success) {
      // Almacenar la referencia del PDF subido
      setUploadedPdf(uploadedFileData);
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ ${result.message}`);
    }
  };

  // Funciones para gestión de productos
  const handleAddProduct = (productData) => {
    return addProduct(productData);
  };

  const handleUpdateProduct = (oldRef, productData) => {
    updateProduct(oldRef, productData);
  };

  const handleDeleteProduct = (productRef) => {
    deleteProduct(productRef);
  };

  const handleImportProducts = (file) => {
    importProductsFromFile(file);
  };

  // Funciones de navegación
  const handleGoToProducts = () => {
    setCurrentView('products');
  };

  const handleBackToOrders = () => {
    setCurrentView('orders');
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient) {
      alert('Debe ingresar el NIT del cliente antes de generar la orden');
      return;
    }

    // Si no hay productos manuales y no hay PDF subido, mostrar error
    if (lineItems.length === 0 && !uploadedPdf) {
      alert('Debe agregar al menos un producto al pedido o subir un PDF con la orden');
      return;
    }

    const orderData = {
      cliente: selectedClient,
      fechaDocumento: formData.documentDate,
      fechaEntrega: formData.deliveryDate,
      observaciones: formData.notes,
      lineas: lineItems,
      total: lineItems.length > 0 ? lineItems.reduce((sum, item) => sum + item.total, 0) : 0,
      fecha: new Date().toISOString(),
      empresaId: 'TU_EMPRESA_ID',
      pdfReferencia: uploadedPdf ? {
        id: uploadedPdf.id,
        nombre: uploadedPdf.name,
        subidoEn: uploadedPdf.uploadedAt
      } : null
    };

    console.log('Datos del pedido:', orderData);
    
    // Generar, guardar y descargar JSON
    try {
      const { jsonData, fileName } = generateOrderJSON(orderData, formData, lineItems, clientNIT, selectedClient);
      const result = await saveOrderJSON(jsonData, fileName);
      
          console.log('JSON generado y guardado:', fileName);
    console.log('Contenido del JSON:', jsonData);
              console.log('Resultado del guardado:', result);
      
      setShowSuccess(true);
      
      // Scroll al mensaje de éxito
      setTimeout(() => {
        const successElement = document.getElementById('successMessage');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      // Limpiar el sistema después de generar la orden
      setTimeout(() => {
        console.log('🧹 Limpiando sistema después de generar orden...');
        resetForm(false); // No mostrar confirmación cuando se limpia automáticamente
      }, 3000); // Limpiar después de 3 segundos para que el usuario vea el mensaje de éxito
      
    } catch (error) {
      console.error('❌ Error generando JSON:', error);
      alert('Error al generar el archivo JSON. Revisa la consola para más detalles.');
    }
  };

  return (
    <>
      <div className="container">
        <Header 
          loadingProducts={loadingProducts} 
          productsLoaded={productsLoaded}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {currentView === 'orders' ? (
          <div className="form-container">
            {/* Botón para ir a gestión de productos */}
            <div style={{ 
              textAlign: 'right', 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <button 
                className="btn btn-primary"
                onClick={handleGoToProducts}
              >
                <Settings size={16} />
                Gestionar Productos
              </button>
            </div>
        <form onSubmit={handleSubmit}>
          <ClientForm 
            clientNIT={clientNIT}
            handleNITChange={handleNITChange}
            selectedClient={selectedClient}
            isNITLocked={isNITLocked}
            filteredProducts={filteredProducts}
            onPdfUploadClick={openPdfUpload}
            uploadedPdf={uploadedPdf}
          />

          {/* Número de Orden y Fechas */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="orderNumber">Número de Orden</label>
                <input
                  type="text"
                  id="orderNumber"
                  value={formData.orderNumber}
                  readOnly
                  style={{ 
                    background: '#f5f5f5', 
                    color: 'black',
                    cursor: 'not-allowed',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="documentDate">Fecha Documento</label>
                <input
                  type="text"
                  id="documentDate"
                  value={formData.documentDate}
                  readOnly
                  style={{ 
                    background: '#f5f5f5', 
                    color: 'black',
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
                      placeholder={selectedClient ? "Buscar por código (ej: REF001)" : "Primero ingresa el NIT del cliente"}
                      disabled={!selectedClient}
                                          style={{
                      borderColor: searchByCode && searchResults.length === 0 ? 'red' : 'black',
                      backgroundColor: !selectedClient ? '#f5f5f5' : 'white'
                    }}
                    />
                    {searchByCode && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setSearchByCode('')}
                        title="Limpiar búsqueda por código"
                      >
                        ✕
                      </button>
                    )}
                    {selectedClient && (
                      <div style={{
                        position: 'absolute',
                        right: searchByCode ? '40px' : '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#7f8c8d',
                        fontSize: '12px'
                      }}>
                        {searchResults.length > 0 ? `${searchResults.length} resultados` : searchByCode ? 'Buscando...' : 'Buscar'}
                      </div>
                    )}
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
                      placeholder={selectedClient ? "Buscar por nombre o categoría" : "Primero ingresa el NIT del cliente"}
                      disabled={!selectedClient}
                      style={{
                        borderColor: searchByName && searchResults.length === 0 ? '#e74c3c' : '#ddd',
                        backgroundColor: !selectedClient ? '#f8f9fa' : 'white'
                      }}
                    />
                    {searchByName && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setSearchByName('')}
                        title="Limpiar búsqueda por nombre"
                      >
                        ✕
                      </button>
                    )}
                    {selectedClient && (
                      <div style={{
                        position: 'absolute',
                        right: searchByName ? '40px' : '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#7f8c8d',
                        fontSize: '12px'
                      }}>
                        {searchResults.length > 0 ? `📦 ${searchResults.length}` : searchByName ? '🔍' : '📋'}
                      </div>
                    )}
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
              {console.log('🔍 Renderizando resultados de búsqueda:', { 
                showSearchResults, 
                searchResultsLength: searchResults.length,
                selectedClient,
                filteredProductsLength: filteredProducts.length
              })}
              
              {/* Mensaje cuando no hay cliente seleccionado */}
              {!selectedClient && (
                <div style={{
                  padding: '15px',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '6px',
                  marginTop: '10px',
                  textAlign: 'center',
                  color: '#856404'
                }}>
                  <div style={{fontWeight: 'bold', marginBottom: '5px'}}>📋 Instrucciones</div>
                  <div style={{fontSize: '13px'}}>
                    1. Primero ingresa el <strong>NIT del cliente</strong> en la sección "Información General"<br/>
                    2. Una vez seleccionado el cliente, aquí aparecerán todos sus productos disponibles<br/>
                    3. Escribe en "Nº Catálogo SN" o "Descripción" para filtrar los productos
                  </div>
                </div>
              )}
              
              {showSearchResults && (
                <div className="search-results" style={{position: 'relative', marginTop: '10px'}}>
                  <div className="search-results-header">
                    <h4>
                      {searchByCode || searchByName ? (
                        <>
                          Resultados de búsqueda ({searchResults.length})
                          {searchByCode && <span style={{color: 'black'}}> | Código: "{searchByCode}"</span>}
                          {searchByName && <span style={{color: 'green'}}> | Nombre: "{searchByName}"</span>}
                        </>
                      ) : (
                        <>
                          📦 Todos los productos disponibles ({searchResults.length})
                          <span style={{color: '#7f8c8d', fontSize: '12px', fontWeight: 'normal'}}>
                            {' '} - Escribe en "Nº Catálogo SN" o "Descripción" para filtrar
                          </span>
                        </>
                      )}
                    </h4>
                    <button
                      type="button"
                      className="close-btn"
                      onClick={() => setShowSearchResults(false)}
                      title="Cerrar resultados"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="search-results-list" style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {searchResults.map((product, index) => (
                      <div
                        key={index}
                        className="search-result-item"
                        onClick={() => selectProduct(product)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f8f9fa',
                          transition: 'background-color 0.2s ease',
                          backgroundColor: selectedProduct && selectedProduct.ref === product.ref ? '#e8f4fd' : 'white'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = selectedProduct && selectedProduct.ref === product.ref ? '#e8f4fd' : 'white'}
                      >
                        <div className="product-info">
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <strong style={{color: '#2c3e50', fontSize: '14px'}}>{product.ref}</strong>
                            <small style={{color: '#95a5a6', fontSize: '11px'}}>{product.categoria}</small>
                          </div>
                          <div style={{marginTop: '4px', color: '#34495e', fontSize: '13px'}}>{product.name}</div>
                          <div style={{marginTop: '2px', fontSize: '11px', color: '#7f8c8d'}}>
                            💡 Haz clic para seleccionar este producto
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {searchResults.length === 0 && (
                    <div style={{padding: '15px', textAlign: 'center', color: '#7f8c8d'}}>
                      <div>🔍 No se encontraron productos</div>
                      <div style={{fontSize: '12px', marginTop: '5px'}}>
                        {searchByCode || searchByName ? 
                          'Intenta con otros criterios de búsqueda' : 
                          'No hay productos disponibles para este cliente'
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Producto seleccionado */}
              {selectedProduct && (
                <div className="selected-product">
                  <div className="selected-product-info">
                    <h4>Producto Seleccionado</h4>
                    <p><strong>Referencia:</strong> {selectedProduct.ref}</p>
                    <p><strong>Nombre:</strong> {selectedProduct.name}</p>
                    <p><strong>Categoría:</strong> {selectedProduct.categoria}</p>
                    <p><strong>Precio calculado:</strong> ${linePrice.toLocaleString('es-CO')}</p>
                  </div>
                </div>
              )}
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
            
            {/* Mensaje informativo cuando no hay productos pero hay PDF */}
            {lineItems.length === 0 && uploadedPdf && (
              <div style={{
                padding: '15px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '6px',
                marginTop: '15px',
                textAlign: 'center',
                color: '#155724'
              }}>
                <div style={{fontWeight: 'bold', marginBottom: '5px'}}>📄 PDF Subido</div>
                <div style={{fontSize: '13px'}}>
                  Has subido el PDF: <strong>{uploadedPdf.name}</strong><br/>
                  Puedes generar la orden directamente o agregar productos adicionales manualmente.
                </div>
              </div>
            )}
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
                {uploadedPdf && lineItems.length === 0 ? 'Generar Orden desde PDF' : 'Generar Orden de Compra'}
              </button>
            </div>
          </div>

          <div className={`success-message ${showSuccess ? 'show' : ''}`} id="successMessage">
            <h3>✅ Orden de Compra Generada Exitosamente</h3>
            <p><strong>Número de Orden:</strong> {formData.orderNumber}</p>
            <p>La orden ha sido procesada y el archivo JSON ha sido descargado automáticamente.</p>
            <p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
              📄 El archivo JSON contiene todos los datos de la orden en formato estructurado.
            </p>
            <p style={{fontSize: '12px', color: '#f39c12', marginTop: '8px', fontStyle: 'italic'}}>
              ⏰ El sistema se limpiará automáticamente en 3 segundos para crear una nueva orden.
            </p>
          </div>
            </form>
          </div>
        ) : (
          <ProductManagement
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onImportProducts={handleImportProducts}
            onBackToOrders={handleBackToOrders}
          />
        )}

        {/* Historial de Órdenes - Solo mostrar en vista de órdenes */}
        {currentView === 'orders' && <OrderHistory />}
      </div>
      
      {/* Modal de carga de PDF */}
      {showPdfUpload && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PdfUpload 
              onPdfProcessed={handlePdfProcessed}
              onCancel={closePdfUpload}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}

export default App;