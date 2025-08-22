import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PdfUpload from '../PdfUpload';

// Mock de las utilidades de procesamiento
jest.mock('../../../utils/pdfProcessor', () => ({
  uploadPdfFile: jest.fn()
}));

describe('PdfUpload Component', () => {
  const mockOnPdfProcessed = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el componente', () => {
    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Cargar Orden de Compra (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Arrastra tu PDF aquí o haz clic para seleccionar')).toBeInTheDocument();
    expect(screen.getByText('Solo archivos PDF, máximo 10MB')).toBeInTheDocument();
  });

  test('muestra el área de carga con instrucciones', () => {
    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('¿Cómo funciona?')).toBeInTheDocument();
    expect(screen.getByText(/Sube tu orden de compra en formato PDF/)).toBeInTheDocument();
    expect(screen.getByText(/El sistema analizará automáticamente el documento/)).toBeInTheDocument();
  });

  test('permite cerrar el modal', () => {
    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    const closeButton = screen.getByTitle('Cancelar');
    fireEvent.click(closeButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('muestra información del archivo seleccionado', () => {
    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('0.00 MB')).toBeInTheDocument();
  });

  test('valida archivos no PDF', () => {
    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Solo se permiten archivos PDF')).toBeInTheDocument();
  });

  test('valida archivos muy grandes', () => {
    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    // Crear un archivo simulado de más de 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { 
      type: 'application/pdf' 
    });
    const input = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(screen.getByText(/El archivo es demasiado grande/)).toBeInTheDocument();
  });

  test('sube PDF exitosamente', async () => {
    const { uploadPdfFile } = require('../../../utils/pdfProcessor');
    uploadPdfFile.mockResolvedValue({
      success: true,
      data: {
        id: 'pdf_1234567890_abc123',
        name: 'test.pdf',
        size: 1024,
        uploadedAt: '2024-01-15T10:00:00.000Z',
        status: 'uploaded'
      },
      message: 'PDF subido exitosamente'
    });

    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { files: [file] } });

    const uploadButton = screen.getByText('Subir PDF');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(uploadPdfFile).toHaveBeenCalledWith(file);
    });

    await waitFor(() => {
      expect(mockOnPdfProcessed).toHaveBeenCalledWith({
        id: 'pdf_1234567890_abc123',
        name: 'test.pdf',
        size: 1024,
        uploadedAt: '2024-01-15T10:00:00.000Z',
        status: 'uploaded'
      });
    });
  });

  test('maneja errores de subida', async () => {
    const { uploadPdfFile } = require('../../../utils/pdfProcessor');
    uploadPdfFile.mockResolvedValue({
      success: false,
      message: 'Error al subir el PDF'
    });

    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { files: [file] } });

    const uploadButton = screen.getByText('Subir PDF');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Error al subir el PDF')).toBeInTheDocument();
    });

    expect(mockOnPdfProcessed).not.toHaveBeenCalled();
  });

  test('permite cambiar archivo seleccionado', () => {
    render(
      <PdfUpload 
        onPdfProcessed={mockOnPdfProcessed}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    const changeButton = screen.getByText('Cambiar archivo');
    fireEvent.click(changeButton);

    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('Arrastra tu PDF aquí o haz clic para seleccionar')).toBeInTheDocument();
  });
});
