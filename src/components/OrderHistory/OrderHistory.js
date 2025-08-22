import React, { useState, useEffect } from 'react';
import { fileStorageService } from '../../utils/fileStorage';
import './OrderHistory.css';

const OrderHistory = () => {
  const [fileReferences, setFileReferences] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadFileReferences();
  }, []);

  const loadFileReferences = () => {
    const refs = fileStorageService.getFileReferences();
    setFileReferences(refs.reverse()); // Mostrar los más recientes primero
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (fileReferences.length === 0) {
    return null; // No mostrar el componente si no hay archivos
  }

  return (
    <div className="order-history-section">
      <div className="history-toggle">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? '📁 Ocultar' : '📁 Mostrar'} Historial de Órdenes ({fileReferences.length})
        </button>
      </div>

      {showHistory && (
        <div className="history-content">
          <div className="history-header">
            <h3>📋 Historial de Órdenes Generadas</h3>
            <p style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
              Últimas órdenes generadas y guardadas en el sistema
            </p>
          </div>

          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Número de Orden</th>
                  <th>Cliente</th>
                  <th>Items</th>
                  <th>Valor Total</th>
                  <th>Fecha de Creación</th>
                  <th>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {fileReferences.map((ref, index) => (
                  <tr key={index}>
                    <td>
                      <strong style={{color: '#2c3e50'}}>{ref.orderNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <div style={{fontWeight: '500'}}>{ref.clientName}</div>
                        <div style={{fontSize: '12px', color: '#7f8c8d'}}>
                          NIT: {ref.clientNIT}
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <span style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {ref.itemCount}
                      </span>
                    </td>
                    <td style={{textAlign: 'right', fontWeight: '500'}}>
                      {formatCurrency(ref.totalValue)}
                    </td>
                    <td style={{fontSize: '13px'}}>
                      {formatDate(ref.createdAt)}
                    </td>
                    <td>
                      <div style={{fontSize: '11px', color: '#7f8c8d'}}>
                        <div>📁 {ref.localPath}</div>
                        <div>📥 ~/Downloads/{ref.fileName}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="history-footer">
            <div style={{fontSize: '12px', color: '#7f8c8d', textAlign: 'center'}}>
              💡 Los archivos se guardan tanto en la carpeta del proyecto como en tu carpeta de descargas
            </div>
            <div style={{marginTop: '10px', textAlign: 'center'}}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  fileStorageService.cleanOldReferences(30);
                  loadFileReferences();
                }}
                style={{fontSize: '12px', padding: '8px 16px'}}
              >
                🧹 Limpiar referencias antiguas (30+ días)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
