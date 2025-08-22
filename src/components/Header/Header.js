import React from 'react';
import './Header.css';

const Header = ({ loadingProducts, productsLoaded }) => {
  return (
    <div className="header">
      <h1>Sistema de Pedidos</h1>
      <p>Generación de órdenes de compra corporativas</p>
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
