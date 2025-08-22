import React, { useState, useRef } from 'react';
import { Plus, Upload, Database, Edit, Trash2, Search, X, Save, RotateCcw } from 'lucide-react';
import './ProductManagement.css';

const ProductManagement = ({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onImportProducts,
  onBackToOrders 
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    ref: '',
    name: '',
    categoria: '',
    empresa: '',
    nit: '',
    descripcion: '',
    escalas: [{ cantidad: 1, precio: '' }]
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEscalaChange = (index, field, value) => {
    const newEscalas = [...formData.escalas];
    newEscalas[index][field] = field === 'cantidad' ? (parseInt(value) || 1) : value;
    setFormData(prev => ({
      ...prev,
      escalas: newEscalas
    }));
  };

  const addEscala = () => {
    setFormData(prev => ({
      ...prev,
      escalas: [...prev.escalas, { cantidad: 1, precio: '' }]
    }));
  };

  const removeEscala = (index) => {
    if (formData.escalas.length > 1) {
      const newEscalas = formData.escalas.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        escalas: newEscalas
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que las escalas tengan precios válidos
    const validEscalas = formData.escalas.filter(escala => 
      escala.precio && parseInt(escala.precio) > 0
    );

    if (validEscalas.length === 0) {
      alert('Debe agregar al menos una escala de precio válida');
      return;
    }

    const productData = {
      ...formData,
      escalas: validEscalas.map(escala => ({
        cantidad: parseInt(escala.cantidad) || 1,
        precio: parseInt(escala.precio) || 0
      }))
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.ref, productData);
      setEditingProduct(null);
    } else {
      onAddProduct(productData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      ref: '',
      name: '',
      categoria: '',
      empresa: '',
      nit: '',
      descripcion: '',
      escalas: [{ cantidad: 1, precio: '' }]
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ref: product.ref,
      name: product.name,
      categoria: product.categoria || '',
      empresa: product.empresa || '',
      nit: product.nit || '',
      descripcion: product.descripcion || product.name,
      escalas: [{ cantidad: 1, precio: '' }]
    });
    setActiveTab('create');
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportProducts(file);
      // Limpiar el input file
      e.target.value = '';
    }
  };

  const filteredProducts = products.filter(product =>
    product.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.categoria && product.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.empresa && product.empresa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="product-management">
      <div className="pm-header">
        <h2>🏪 Gestión de Productos</h2>
        <button 
          className="btn btn-secondary" 
          onClick={onBackToOrders}
        >
          ← Volver a Órdenes
        </button>
      </div>

      <div className="pm-tabs">
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <Plus size={16} />
          Crear Producto
        </button>
        <button 
          className={`tab ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          <Upload size={16} />
          Importar Masivamente
        </button>
        <button 
          className={`tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <Database size={16} />
          Catálogo ({products.length})
        </button>
      </div>

      <div className="pm-content">
        {activeTab === 'create' && (
          <div className="create-product">
            <h3>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Referencia * <small>(Ej: REF001)</small></label>
                  <input
                    type="text"
                    name="ref"
                    value={formData.ref}
                    onChange={handleInputChange}
                    required
                    placeholder="REF001"
                    disabled={editingProduct}
                    style={{ backgroundColor: editingProduct ? '#f5f5f5' : 'white' }}
                  />
                  {editingProduct && (
                    <small style={{color: 'black'}}>La referencia no se puede cambiar al editar</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nombre del producto"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="General"
                  />
                </div>
                <div className="form-group">
                  <label>Empresa</label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    placeholder="Nombre de la empresa"
                  />
                </div>
                <div className="form-group">
                  <label>NIT del Cliente</label>
                  <input
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={handleInputChange}
                    placeholder="900123456-7"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción detallada del producto"
                  rows="3"
                />
              </div>

              <div className="escalas-section">
                <h4>💰 Escalas de Precio</h4>
                <p className="escalas-info">
                  Configure los precios según la cantidad. El sistema seleccionará automáticamente el precio más conveniente.
                </p>
                {formData.escalas.map((escala, index) => (
                  <div key={index} className="escala-row">
                    <div className="form-group">
                      <label>Cantidad Mínima</label>
                      <input
                        type="number"
                        value={escala.cantidad}
                        onChange={(e) => handleEscalaChange(index, 'cantidad', e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Precio Unitario ($)</label>
                      <input
                        type="number"
                        value={escala.precio}
                        onChange={(e) => handleEscalaChange(index, 'precio', e.target.value)}
                        min="0"
                        required
                        placeholder="0"
                      />
                    </div>
                    {formData.escalas.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => removeEscala(index)}
                        title="Eliminar escala"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={addEscala}
                >
                  ➕ Agregar Escala de Precio
                </button>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Limpiar Formulario
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="import-products">
            <h3>📥 Importar Productos Masivamente</h3>
            
            <div className="import-instructions">
              <h4>📋 Instrucciones de Importación</h4>
              <p>Para importar productos masivamente, tu archivo debe tener las siguientes columnas en este orden:</p>
              <ul>
                <li><strong>Columna B (2):</strong> Nombre del producto</li>
                <li><strong>Columna C (3):</strong> NIT del cliente</li>
                <li><strong>Columna D (4):</strong> Empresa</li>
                <li><strong>Columna H (8):</strong> Referencia del producto</li>
                <li><strong>Columna I (9):</strong> Categoría</li>
                <li><strong>Columna J (10):</strong> Cantidad mínima</li>
                <li><strong>Columna K (11):</strong> Precio unitario</li>
              </ul>
              
              <div className="import-notes">
                <h5>📝 Notas importantes:</h5>
                <ul>
                  <li>La primera fila debe contener los encabezados (se ignorará)</li>
                  <li>Los productos con referencias duplicadas se saltarán</li>
                  <li>Solo se importarán productos con precio mayor a 0</li>
                  <li>Formatos soportados: CSV, XLSX, XLS</li>
                </ul>
              </div>
              
              <div className="file-upload">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                />
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => fileInputRef.current.click()}
                >
                  📁 Seleccionar Archivo para Importar
                </button>
                <p className="file-info">
                  Selecciona un archivo CSV o Excel con los productos a importar
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="product-catalog">
            <div className="catalog-header">
              <h3>📋 Catálogo de Productos ({filteredProducts.length} de {products.length})</h3>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Buscar productos por referencia, nombre, categoría o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="search-clear"
                    onClick={() => setSearchTerm('')}
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="products-table-container">
              {filteredProducts.length > 0 ? (
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Referencia</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Empresa</th>
                      <th>NIT</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="ref-cell">{product.ref}</td>
                        <td className="name-cell">{product.name}</td>
                        <td className="category-cell">{product.categoria || '-'}</td>
                        <td className="company-cell">{product.empresa || '-'}</td>
                        <td className="nit-cell">{product.nit || '-'}</td>
                        <td className="actions-cell">
                          <button
                            className="btn btn-small btn-primary"
                            onClick={() => handleEdit(product)}
                            title="Editar producto"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => onDeleteProduct(product.ref)}
                            title="Eliminar producto"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-products">
                  <div className="no-products-icon">📦</div>
                  <h4>No se encontraron productos</h4>
                  <p>
                    {searchTerm 
                      ? 'No hay productos que coincidan con tu búsqueda. Intenta con otros términos.'
                      : 'Aún no hay productos en el catálogo. Crea el primer producto o importa desde un archivo.'
                    }
                  </p>
                  {!searchTerm && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setActiveTab('create')}
                    >
                      ➕ Crear Primer Producto
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
