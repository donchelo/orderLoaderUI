import React from 'react';
import { Upload } from 'lucide-react';
import './ClientForm.css';

const ClientForm = ({ 
  clientNIT, 
  handleNITChange, 
  selectedClient, 
  isNITLocked, 
  filteredProducts,
  onPdfUploadClick,
  uploadedPdf
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
        
        {/* Botón para cargar PDF */}
        <div className="form-row" style={{marginTop: '16px'}}>
          <div className="form-group">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={onPdfUploadClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: '1px solid #007bff',
                backgroundColor: 'white',
                color: '#007bff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#007bff';
              }}
            >
              <Upload size={16} />
              {uploadedPdf ? 'Cambiar PDF' : 'Cargar Orden desde PDF'}
            </button>
            {uploadedPdf ? (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '4px',
                color: '#155724',
                fontSize: '12px'
              }}>
                <strong>✅ PDF subido:</strong> {uploadedPdf.name}
              </div>
            ) : (
              <p style={{color: '#6c757d', fontSize: '12px', marginTop: '5px'}}>
                💡 Sube un PDF de orden de compra para incluir en la orden
              </p>
            )}
          </div>
        </div>
      </div>
  );
};

export default ClientForm;
