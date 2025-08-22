import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadPdfFile, validatePdfFile } from '../../utils/pdfProcessor';
import './PdfUpload.css';

const PdfUpload = ({ onPdfProcessed, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar archivo usando las utilidades
      const validation = validatePdfFile(file);

      if (!validation.isValid) {
        setUploadStatus({
          type: 'error',
          message: validation.errors.join(', ')
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus({
        type: 'success',
        message: `Archivo seleccionado: ${file.name}`
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        if (file.size <= 10 * 1024 * 1024) {
          setSelectedFile(file);
          setUploadStatus({
            type: 'success',
            message: `Archivo seleccionado: ${file.name}`
          });
        } else {
          setUploadStatus({
            type: 'error',
            message: 'El archivo es demasiado grande. Máximo 10MB'
          });
        }
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Solo se permiten archivos PDF'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: 'error',
        message: 'Por favor selecciona un archivo PDF'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({
      type: 'info',
      message: 'Subiendo PDF...'
    });

    try {
      // Subir el PDF usando las utilidades
      const result = await uploadPdfFile(selectedFile);

      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: result.message
        });

        // Llamar al callback con los datos del archivo subido
        onPdfProcessed(result.data);
      } else {
        setUploadStatus({
          type: 'error',
          message: result.message
        });
      }

    } catch (error) {
      console.error('Error subiendo PDF:', error);
      setUploadStatus({
        type: 'error',
        message: 'Error al subir el PDF. Intenta nuevamente.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="pdf-upload-container">
      <div className="pdf-upload-header">
        <h3>
          <FileText size={20} />
          Cargar Orden de Compra (PDF)
        </h3>
        <button 
          type="button" 
          className="close-btn"
          onClick={onCancel}
          title="Cancelar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="pdf-upload-content">
        <div 
          className="upload-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {!selectedFile ? (
            <div className="upload-placeholder">
              <Upload size={48} />
              <h4>Arrastra tu PDF aquí o haz clic para seleccionar</h4>
              <p>Solo archivos PDF, máximo 10MB</p>
            </div>
          ) : (
            <div className="file-selected">
              <FileText size={32} />
              <div className="file-info">
                <h4>{selectedFile.name}</h4>
                <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}
        </div>

        {uploadStatus && (
          <div className={`upload-status ${uploadStatus.type}`}>
            {uploadStatus.type === 'success' && <CheckCircle size={16} />}
            {uploadStatus.type === 'error' && <AlertCircle size={16} />}
            {uploadStatus.type === 'info' && <FileText size={16} />}
            <span>{uploadStatus.message}</span>
          </div>
        )}

        <div className="upload-actions">
          {selectedFile && (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFile}
                disabled={isUploading}
              >
                Cambiar archivo
              </button>
                             <button
                 type="button"
                 className="btn btn-primary"
                 onClick={handleUpload}
                 disabled={isUploading}
               >
                 {isUploading ? 'Subiendo...' : 'Subir PDF'}
               </button>
            </>
          )}
        </div>

                 <div className="upload-info">
           <h4>¿Cómo funciona?</h4>
           <ul>
             <li>Sube tu orden de compra en formato PDF</li>
             <li>El archivo se almacenará en el sistema</li>
             <li>Puedes crear el pedido normalmente con NIT y productos</li>
             <li>Al generar la orden, se incluirá la referencia al PDF</li>
           </ul>
         </div>
      </div>
    </div>
  );
};

export default PdfUpload;
