import React from 'react';
import './Header.css';

const Header = ({ 
  loadingProducts, 
  productsLoaded, 
  currentView, 
  onViewChange 
}) => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-container">
            <img 
              src="/images/logo.png" 
              alt="Logo del cliente" 
              className="client-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                console.log('Logo no encontrado en /images/logo.png');
              }}
            />
          </div>
          <div className="header-text">
            <h1>OrderLoader</h1>
            <p>Sistema de Gestión de Órdenes y Productos</p>
          </div>
        </div>
        
        <div className="header-right">
          {/* Navegación entre pantallas */}
          {onViewChange && (
            <div className="navigation-tabs">
              <button
                className={`nav-tab ${currentView === 'orders' ? 'active' : ''}`}
                onClick={() => onViewChange('orders')}
              >
                📋 Órdenes
              </button>
              <button
                className={`nav-tab ${currentView === 'products' ? 'active' : ''}`}
                onClick={() => onViewChange('products')}
              >
                🏪 Productos
              </button>
            </div>
          )}
          
          {/* Estado de carga */}
          <div className="status-indicator">
            {loadingProducts ? (
              <span className="status loading">🔄 Cargando productos...</span>
            ) : productsLoaded ? (
              <span className="status success">✅ Productos cargados</span>
            ) : (
              <span className="status error">❌ Error cargando productos</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
