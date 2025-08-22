import React from 'react';
import './ClientForm.css';

const ClientForm = ({ 
  clientNIT, 
  handleNITChange, 
  selectedClient, 
  isNITLocked, 
  filteredProducts 
}) => {
  return (
    <div className="form-section">
      <div className="section-title">Información General</div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="clientNIT">NIT del Cliente <span className="required">*</span></label>
          <input
            type="text"
            id="clientNIT"
            value={clientNIT}
            onChange={(e) => handleNITChange(e.target.value)}
            placeholder="Ingresa el NIT del cliente (ej: CN9001234567)"
            required
            disabled={isNITLocked}
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              fontSize: '14px',
              backgroundColor: isNITLocked ? '#f8f9fa' : 'white',
              color: isNITLocked ? '#6c757d' : '#2c3e50',
              cursor: isNITLocked ? 'not-allowed' : 'text'
            }}
          />
          {selectedClient && (
            <p style={{color: '#27ae60', fontSize: '12px', marginTop: '5px'}}>
              ✅ Cliente: {selectedClient} | 📦 {filteredProducts.length} productos disponibles
              {isNITLocked && <span style={{marginLeft: '10px'}}>🔒 NIT bloqueado</span>}
            </p>
          )}
          {clientNIT && !selectedClient && (
            <p style={{color: '#e74c3c', fontSize: '12px', marginTop: '5px'}}>
              ❌ NIT no encontrado. Verifica el número e intenta nuevamente.
            </p>
          )}
          {isNITLocked && (
            <p style={{color: '#f39c12', fontSize: '11px', marginTop: '5px', fontStyle: 'italic'}}>
              💡 Para cambiar el NIT, usa el botón "Limpiar" en la parte inferior
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
