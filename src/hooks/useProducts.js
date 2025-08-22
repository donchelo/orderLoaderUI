import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [priceScales, setPriceScales] = useState({});
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [availableClients, setAvailableClients] = useState([]);

  // Función para limpiar y convertir precio
  const cleanPrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.toString().replace(/[",\s]/g, '')) || 0;
  };

  // Función para limpiar y convertir cantidad
  const cleanQuantity = (qtyStr) => {
    if (!qtyStr) return 0;
    return parseInt(qtyStr.toString().replace(/[",\.]/g, '')) || 0;
  };

  // Función para cargar productos desde CSV o XLSX
  const loadProductsFromFile = async () => {
    setLoadingProducts(true);
    
    try {
      let dataLoaded = false;
      
      // Intentar cargar XLSX primero
      try {
        const xlsxResponse = await fetch('/data/productos.xlsx');
        if (xlsxResponse.ok) {
          const arrayBuffer = await xlsxResponse.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          console.log('📊 Cargando desde archivo XLSX...');
          console.log(`📋 Filas encontradas: ${jsonData.length}`);
          
          const loadedProducts = [];
          const loadedScales = {};
          const categories = new Set();
          
          jsonData.slice(1).forEach((row, index) => {
            if (!row || row.length < 11) return;
            
            const ref = row[7]?.toString().trim() || '';
            const name = row[1]?.toString().trim() || '';
            const empresa = row[3]?.toString().trim() || '';
            const nit = row[2]?.toString().trim() || '';
            const cantidad = row[9] ? cleanQuantity(row[9]) : 0;
            const precioEspecial = row[10] ? cleanPrice(row[10]) : 0;
            const categoria = row[8]?.toString().trim() || 'General';
            
            if (!ref || !name || precioEspecial === 0) return;
            
            if (!loadedScales[ref]) {
              loadedScales[ref] = [];
            }
            
            loadedScales[ref].push({
              cantidad: cantidad,
              precio: precioEspecial
            });
            
            const existingProduct = loadedProducts.find(p => p.ref === ref);
            if (!existingProduct) {
              loadedProducts.push({
                ref: ref,
                name: name,
                categoria: categoria,
                empresa: empresa,
                nit: nit,
                descripcion: name
              });
              categories.add(categoria);
            }
          });
          
          if (loadedProducts.length > 0) {
            setProducts(loadedProducts);
            setPriceScales(loadedScales);
            dataLoaded = true;
            console.log(`✅ Productos cargados desde XLSX: ${loadedProducts.length}`);
          }
        }
      } catch (xlsxError) {
        console.log('⚠️ No se pudo cargar XLSX, intentando CSV...');
      }
      
      // Si no se cargó XLSX, intentar CSV
      if (!dataLoaded) {
        try {
          const csvResponse = await fetch('/data/productos.csv');
          if (csvResponse.ok) {
            const csvText = await csvResponse.text();
            const lines = csvText.split('\n');
            
            console.log('📊 Cargando desde archivo CSV...');
            console.log(`📋 Líneas encontradas: ${lines.length}`);
            
            const loadedProducts = [];
            const loadedScales = {};
            const categories = new Set();
            
            lines.slice(1).forEach((line, index) => {
              if (!line.trim()) return;
              
              const values = line.split(',');
              if (values.length < 11) return;
              
              const ref = values[7]?.trim() || '';
              const name = values[1]?.trim() || '';
              const empresa = values[3]?.trim() || '';
              const nit = values[2]?.trim() || '';
              const cantidad = values[9] ? cleanQuantity(values[9]) : 0;
              const precioEspecial = values[10] ? cleanPrice(values[10]) : 0;
              const categoria = values[8]?.trim() || 'General';
              
              if (!ref || !name || precioEspecial === 0) return;
              
              if (!loadedScales[ref]) {
                loadedScales[ref] = [];
              }
              
              loadedScales[ref].push({
                cantidad: cantidad,
                precio: precioEspecial
              });
              
              const existingProduct = loadedProducts.find(p => p.ref === ref);
              if (!existingProduct) {
                loadedProducts.push({
                  ref: ref,
                  name: name,
                  categoria: categoria,
                  empresa: empresa,
                  nit: nit,
                  descripcion: name
                });
                categories.add(categoria);
              }
            });
            
            if (loadedProducts.length > 0) {
              setProducts(loadedProducts);
              setPriceScales(loadedScales);
              dataLoaded = true;
              console.log(`✅ Productos cargados desde CSV: ${loadedProducts.length}`);
            }
          }
        } catch (csvError) {
          console.log('❌ Error cargando CSV:', csvError);
        }
      }
      
      // Si no se cargó ningún archivo, usar datos por defecto
      if (!dataLoaded) {
        console.log('⚠️ Usando productos por defecto');
        const defaultProducts = [
          { ref: 'REF001', name: 'Producto Alpha Series', categoria: 'General', empresa: 'Empresa Demo SAS', nit: '900123456-7' },
          { ref: 'REF002', name: 'Producto Beta Professional', categoria: 'General', empresa: 'Empresa Demo SAS', nit: '900123456-7' },
        ];
        const defaultScales = {
          'REF001': [{ cantidad: 1, precio: 25000 }, { cantidad: 10, precio: 22000 }, { cantidad: 50, precio: 20000 }],
          'REF002': [{ cantidad: 1, precio: 35000 }, { cantidad: 5, precio: 32000 }, { cantidad: 20, precio: 30000 }]
        };
        setProducts(defaultProducts);
        setPriceScales(defaultScales);
      }
      
      // Extraer NITs únicos de clientes
      const clientNITs = [...new Set(products.map(p => p.nit).filter(nit => nit))];
      setAvailableClients(clientNITs);
      
      console.log(`🏢 NITs de clientes disponibles: ${clientNITs.length}`);
      console.log('NITs:', clientNITs);
      console.log('📊 Productos cargados:', products.length);
      if (products.length > 0) {
        console.log('✅ Primeros 3 productos:', products.slice(0, 3).map(p => `${p.ref} - ${p.name} (NIT: ${p.nit})`));
        console.log('🔍 Ejemplo de producto completo:', products[0]);
      }
      
      // Verificar que los productos tengan los campos necesarios
      const validProducts = products.filter(p => p.ref && p.name && p.nit);
      console.log(`✅ Productos válidos: ${validProducts.length} de ${products.length}`);
      
    } catch (error) {
      console.log('❌ Error general cargando productos:', error);
      
      // Productos por defecto en caso de error
      const defaultProducts = [
        { ref: 'REF001', name: 'Producto Alpha Series', categoria: 'General', empresa: 'Empresa Demo SAS', nit: '900123456-7' },
        { ref: 'REF002', name: 'Producto Beta Professional', categoria: 'General', empresa: 'Empresa Demo SAS', nit: '900123456-7' },
      ];
      const defaultScales = {
        'REF001': [{ cantidad: 1, precio: 25000 }, { cantidad: 10, precio: 22000 }, { cantidad: 50, precio: 20000 }],
        'REF002': [{ cantidad: 1, precio: 35000 }, { cantidad: 5, precio: 32000 }, { cantidad: 20, precio: 30000 }]
      };
      setProducts(defaultProducts);
      setPriceScales(defaultScales);
    }
    
    setProductsLoaded(true);
    setLoadingProducts(false);
  };

  // Función para calcular precio basado en escalas
  const calculatePriceByQuantity = (productRef, quantity) => {
    if (!priceScales[productRef] || !quantity || quantity <= 0) {
      console.log(`❌ No se pudo calcular precio para ${productRef}, cantidad: ${quantity}`);
      return 0;
    }
    
    const scales = priceScales[productRef];
    const sortedScales = scales.sort((a, b) => a.cantidad - b.cantidad);
    
    console.log(`🔍 Calculando precio para ${productRef}, cantidad: ${quantity}`);
    console.log(`📊 Escalas disponibles:`, sortedScales);
    
    if (sortedScales.length === 1) {
      console.log(`✅ Una sola escala: ${sortedScales[0].cantidad}+ unidades = $${sortedScales[0].precio}`);
      return sortedScales[0].precio;
    }
    
    let selectedScale = sortedScales[0];
    
    for (let i = sortedScales.length - 1; i >= 0; i--) {
      if (quantity >= sortedScales[i].cantidad) {
        selectedScale = sortedScales[i];
        break;
      }
    }
    
    console.log(`✅ Escala seleccionada: ${selectedScale.cantidad}+ unidades = $${selectedScale.precio}`);
    return selectedScale.precio;
  };

  // Nuevas funciones para gestión de productos
  const addProduct = (productData) => {
    const newProduct = {
      ref: productData.ref,
      name: productData.name,
      categoria: productData.categoria || 'General',
      empresa: productData.empresa || '',
      nit: productData.nit || '',
      descripcion: productData.descripcion || productData.name
    };

    // Verificar que la referencia no exista
    if (products.find(p => p.ref === productData.ref)) {
      alert('Ya existe un producto con esa referencia');
      return false;
    }

    setProducts(prev => [...prev, newProduct]);

    // Agregar escalas de precio
    if (productData.escalas && productData.escalas.length > 0) {
      const newScales = productData.escalas.map(escala => ({
        cantidad: parseInt(escala.cantidad) || 1,
        precio: parseInt(escala.precio) || 0
      })).filter(escala => escala.precio > 0);

      if (newScales.length > 0) {
        setPriceScales(prev => ({
          ...prev,
          [productData.ref]: newScales
        }));
      }
    }

    // Actualizar clientes disponibles
    if (productData.nit && !availableClients.includes(productData.nit)) {
      setAvailableClients(prev => [...prev, productData.nit]);
    }

    console.log('✅ Producto agregado:', newProduct);
    alert('✅ Producto creado exitosamente');
    return true;
  };

  const updateProduct = (oldRef, productData) => {
    const updatedProduct = {
      ref: oldRef, // Mantener la referencia original
      name: productData.name,
      categoria: productData.categoria || 'General',
      empresa: productData.empresa || '',
      nit: productData.nit || '',
      descripcion: productData.descripcion || productData.name
    };

    setProducts(prev => prev.map(p => 
      p.ref === oldRef ? updatedProduct : p
    ));

    // Actualizar escalas de precio
    if (productData.escalas && productData.escalas.length > 0) {
      const newScales = productData.escalas.map(escala => ({
        cantidad: parseInt(escala.cantidad) || 1,
        precio: parseInt(escala.precio) || 0
      })).filter(escala => escala.precio > 0);

      if (newScales.length > 0) {
        setPriceScales(prev => ({
          ...prev,
          [oldRef]: newScales
        }));
      }
    }

    // Actualizar clientes disponibles
    if (productData.nit && !availableClients.includes(productData.nit)) {
      setAvailableClients(prev => [...prev, productData.nit]);
    }

    console.log('✅ Producto actualizado:', updatedProduct);
    alert('✅ Producto actualizado exitosamente');
  };

  const deleteProduct = (productRef) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?\n\nEsta acción no se puede deshacer.')) {
      setProducts(prev => prev.filter(p => p.ref !== productRef));
      
      // Eliminar escalas de precio
      setPriceScales(prev => {
        const newScales = { ...prev };
        delete newScales[productRef];
        return newScales;
      });

      console.log('✅ Producto eliminado:', productRef);
      alert('✅ Producto eliminado exitosamente');
    }
  };

  const importProductsFromFile = async (file) => {
    setLoadingProducts(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          let importedData = { products: [], scales: {} };
          
          if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            // Procesar archivo Excel
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            importedData = processImportData(jsonData);
          } else {
            // Procesar archivo CSV
            const csvText = e.target.result;
            const lines = csvText.split('\n');
            const jsonData = lines.map(line => line.split(','));
            
            importedData = processImportData(jsonData);
          }
          
          if (importedData.products.length > 0) {
            setProducts(prev => [...prev, ...importedData.products]);
            setPriceScales(prev => ({ ...prev, ...importedData.scales }));
            
            // Actualizar clientes disponibles
            const newNITs = importedData.products
              .map(p => p.nit)
              .filter(nit => nit && !availableClients.includes(nit));
            
            if (newNITs.length > 0) {
              setAvailableClients(prev => [...prev, ...newNITs]);
            }
            
            alert(`✅ Se importaron ${importedData.products.length} productos exitosamente`);
            console.log('📦 Productos importados:', importedData.products);
          } else {
            alert('❌ No se pudieron importar productos. Verifica el formato del archivo.');
          }
          
        } catch (error) {
          console.error('❌ Error procesando archivo:', error);
          alert('Error al procesar el archivo. Verifica que el formato sea correcto.');
        }
      };
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
      
    } catch (error) {
      console.error('❌ Error leyendo archivo:', error);
      alert('Error al leer el archivo.');
    }
    
    setLoadingProducts(false);
  };

  const processImportData = (data) => {
    const importedProducts = [];
    const importedScales = {};
    
    data.slice(1).forEach((row, index) => {
      if (!row || row.length < 10) return;
      
      const ref = row[7]?.toString().trim() || '';
      const name = row[1]?.toString().trim() || '';
      const empresa = row[3]?.toString().trim() || '';
      const nit = row[2]?.toString().trim() || '';
      const cantidad = row[9] ? cleanQuantity(row[9]) : 0;
      const precioEspecial = row[10] ? cleanPrice(row[10]) : 0;
      const categoria = row[8]?.toString().trim() || 'General';
      
      if (!ref || !name || precioEspecial === 0) return;
      
      // Verificar que no exista ya
      if (products.find(p => p.ref === ref) || importedProducts.find(p => p.ref === ref)) {
        console.log(`⚠️ Producto ${ref} ya existe, saltando...`);
        return;
      }
      
      const product = {
        ref: ref,
        name: name,
        categoria: categoria,
        empresa: empresa,
        nit: nit,
        descripcion: name
      };
      
      importedProducts.push(product);
      
      if (!importedScales[ref]) {
        importedScales[ref] = [];
      }
      
      importedScales[ref].push({
        cantidad: cantidad,
        precio: precioEspecial
      });
    });
    
    return { products: importedProducts, scales: importedScales };
  };

  // Cargar productos al inicializar
  useEffect(() => {
    console.log('🚀 Iniciando carga de productos...');
    loadProductsFromFile();
  }, []);

  return {
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
  };
};
