import React from 'react';
import './Header.css';

const Header = ({ loadingProducts, productsLoaded }) => {
  return (
    <div className="header">
      <div className="header-content">
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
          <h1>Sistema de Pedidos</h1>
          <p>Generación de órdenes de compra corporativas</p>
        </div>
      </div>
      
      {loadingProducts && (
        <p style={{color: '#3498db', fontSize: '14px'}}>
          🔄 Cargando productos desde base de datos...
        </p>
      )}
      {productsLoaded && (
        <p style={{color: '#27ae60', fontSize: '14px', marginTop: '10px'}}>
          ✅ Base de datos cargada correctamente
        </p>
      )}
    </div>
  );
};

export default Header;
