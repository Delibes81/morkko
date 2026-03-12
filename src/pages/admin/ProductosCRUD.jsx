import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, RefreshCw, LogOut, Upload, Image as ImageIcon, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ProductosCRUD = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('morokko'); // New state for tabs
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    marca: 'morokko',
    imagen_url: '' // Will store JSON string behind the scenes
  });

  // Image Upload State (Array of objects: { id, preview, blob, originalSize, optimizedSize, existingUrl? })
  const [productImages, setProductImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const { setSpecificTheme } = useTheme();
  const { signOut } = useAuth();

  useEffect(() => {
    // Force a specific theme for the admin panel, maybe dark for premium feel
    setSpecificTheme('dark');
    fetchProductos();
  }, [setSpecificTheme]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProductos(data || []);
      }
    } catch (err) {
      console.error('Catch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setProductImages([]);

    if (product) {
      setCurrentProduct(product);
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        marca: product.marca || activeTab,
        imagen_url: product.imagen_url || ''
      });
      
      // Parse existing JSON image array or convert single old string to array
      if (product.imagen_url) {
        try {
          // Check if it's already an array representation
          const urls = JSON.parse(product.imagen_url);
          if (Array.isArray(urls)) {
            setProductImages(urls.map((url, i) => ({
              id: `existing-${i}`,
              preview: url,
              existingUrl: url,
            })));
          } else {
             // Fallback if someone typed a raw string inside json quotes somehow
             setProductImages([{ id: 'existing-0', preview: product.imagen_url, existingUrl: product.imagen_url }]);
          }
        } catch (e) {
          // If JSON parse fails, it means it's an old direct single URL string
          setProductImages([{ id: 'existing-0', preview: product.imagen_url, existingUrl: product.imagen_url }]);
        }
      }
    } else {
      setCurrentProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        marca: activeTab, // Automatically assign the active tab brand
        imagen_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setProductImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Optimize Image directly inside the browser using Canvas
  const optimizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp with 80% quality
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              blob,
              originalSize: file.size,
              optimizedSize: blob.size,
              originalName: file.name
            });
          } else {
            reject(new Error("Canvas to Blob failed"));
          }
        }, 'image/webp', 0.8);
      };
      
      img.onerror = (err) => reject(err);
    });
  };

  const processFiles = async (files) => {
    if (files.length === 0) return;

    setLoading(true);
    const newImages = [];
    
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        const optimizedData = await optimizeImage(file);
        
        newImages.push({
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          blob: optimizedData.blob,
          preview: URL.createObjectURL(optimizedData.blob),
          originalSize: optimizedData.originalSize,
          optimizedSize: optimizedData.optimizedSize
        });
      }
      
      setProductImages(prev => [...prev, ...newImages]);
    } catch (err) {
      console.error("Compression error:", err);
      alert("Error optimizando alguna imagen.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
    e.target.value = ''; // Reset input to allow re-selecting same files
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  // Reordering & Deleting Functions
  const moveImage = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === productImages.length - 1)) return;
    
    setProductImages(prev => {
      const newArr = [...prev];
      const temp = newArr[index];
      newArr[index] = newArr[index + direction];
      newArr[index + direction] = temp;
      return newArr;
    });
  };

  const removeImage = (index) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalUrls = [];

      for (const imgObj of productImages) {
        if (imgObj.existingUrl) {
          // If it was already on supabase, just keep the URL
          finalUrls.push(imgObj.existingUrl);
        } else if (imgObj.blob) {
          // If it's a new upload
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
          const filePath = `${formData.marca}/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('camisas')
            .upload(filePath, imgObj.blob, {
              contentType: 'image/webp',
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('camisas')
            .getPublicUrl(uploadData.path);
            
          finalUrls.push(publicUrlData.publicUrl);
        }
      }

      // Convert array of urls to JSON string to save in the single text column
      const jsonUrls = JSON.stringify(finalUrls);

      // 2. Save database record
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        marca: formData.marca,
        imagen_url: finalUrls.length > 0 ? jsonUrls : ''
      };

      if (currentProduct) {
        // Update
        const { error } = await supabase
          .from('productos')
          .update(payload)
          .eq('id', currentProduct.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('productos')
          .insert([payload]);
        
        if (error) throw error;
      }
      
      await fetchProductos();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error al guardar: ${error.message || 'Desconocido'}. (Verifica que el bucket "camisas" sea público y tengas permisos de subir).`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      await fetchProductos();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="admin-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
        <div className="admin-actions">
          <button className="btn-icon" onClick={fetchProductos} disabled={loading} title="Actualizar">
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            <span>Nuevo Producto {activeTab === 'morokko' ? 'Morokko' : 'Guster'}</span>
          </button>
          <button className="btn-danger" onClick={signOut} title="Cerrar Sesión">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Brand Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'morokko' ? 'active tab-morokko' : ''}`}
          onClick={() => setActiveTab('morokko')}
        >
          Morokko
        </button>
        <button 
          className={`tab-btn ${activeTab === 'guster' ? 'active tab-guster' : ''}`}
          onClick={() => setActiveTab('guster')}
        >
          Guster
        </button>
      </div>

      <div className="table-container">
        {loading && productos.length === 0 ? (
          <div className="loading-state">Cargando productos...</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.filter(p => p.marca === activeTab).length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">No hay productos en {activeTab}.</td>
                </tr>
              ) : (
                productos.filter(p => p.marca === activeTab).map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td>
                      <div className="td-image">
                        {product.imagen_url ? (
                          <img src={
                            (() => {
                              try {
                                const urls = JSON.parse(product.imagen_url);
                                return Array.isArray(urls) ? urls[0] : product.imagen_url;
                              } catch {
                                return product.imagen_url;
                              }
                            })()
                          } alt={product.nombre} />
                        ) : (
                          <div className={`img-placeholder ${product.marca}`}></div>
                        )}
                      </div>
                    </td>
                    <td className="td-name">
                      <strong>{product.nombre}</strong>
                      <span className="td-desc">{product.descripcion?.substring(0, 50)}...</span>
                    </td>
                    <td className="td-price">${product.precio} MXN</td>
                    <td>
                      <div className="td-actions">
                        <button onClick={() => handleOpenModal(product)} className="action-btn edit" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="action-btn delete" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="modal-header">
                <h2>{currentProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <button onClick={handleCloseModal} className="close-btn"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Producto</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ej. Sudadera Catrina"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group wide-group">
                    <label htmlFor="precio">Precio (MXN)</label>
                    <input 
                      type="number" 
                      id="precio" 
                      name="precio" 
                      value={formData.precio} 
                      onChange={handleInputChange} 
                      required 
                      step="0.01"
                      placeholder="850.00"
                    />
                  </div>
                  {/* Marca select is removed, assigned implicitly by activeTab */}
                </div>

                <div className="form-group">
                  <label>Imágenes del Producto (Selecciona varias)</label>
                  
                  <div className="image-upload-container">
                    
                    {/* Upload Controls */}
                    <div 
                      className={`upload-controls full-width-controls ${isDragging ? 'dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <p className="upload-instructions">
                        Arrastra tus imágenes aquí o haz clic en "Seleccionar Archivos" para subir fotos (PNG, JPG o WebP). 
                        Las optimizamos recursivamente a <strong>.webp</strong> sin perder calidad.
                      </p>
                      
                      <div className="file-input-wrapper">
                        <input 
                          type="file" 
                          multiple
                          accept="image/png, image/jpeg, image/jpg, image/webp" 
                          onChange={handleFileSelect}
                          style={{ color: '#fff' }}
                        />
                      </div>
                    </div>

                    {/* Gallery Preview Area */}
                    <div className="gallery-preview-grid">
                      {productImages.length === 0 ? (
                        <div className="empty-gallery-state">
                           <ImageIcon size={32} className="placeholder-icon" />
                           <p>Sin imágenes</p>
                        </div>
                      ) : (
                        productImages.map((imgObj, index) => (
                           <div key={imgObj.id} className="gallery-item-wrapper">
                              <span className="gallery-badge">{index === 0 ? 'PORTADA' : index + 1}</span>
                              <div className="gallery-image">
                                 <img src={imgObj.preview} alt={`preview ${index}`} />
                                 <button type="button" className="btn-remove-img" onClick={() => removeImage(index)}>
                                    <XCircle size={16} />
                                 </button>
                              </div>
                              
                              <div className="gallery-controls">
                                 <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                                    <ChevronLeft size={16} />
                                 </button>
                                 <button type="button" onClick={() => moveImage(index, 1)} disabled={index === productImages.length - 1}>
                                    <ChevronRight size={16} />
                                 </button>
                              </div>

                              {/* Only show compression indicator on NEW blobs */}
                              {imgObj.originalSize && (
                                <div className="mini-stats">
                                   {(imgObj.originalSize/1024/1024).toFixed(1)}M → {(imgObj.optimizedSize/1024).toFixed(0)}K
                                </div>
                              )}
                           </div>
                        ))
                      )}
                    </div>

                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea 
                    id="descripcion" 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleInputChange} 
                    rows="3"
                    placeholder="Descripción detallada del producto..."
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-container {
          min-height: 100vh;
          background-color: #111111;
          color: #ffffff;
          padding: calc(var(--header-height) + var(--space-4)) var(--space-4) var(--space-6);
          font-family: 'Space Grotesk', sans-serif;
        }

        .admin-header {
          max-width: 1200px;
          margin: 0 auto var(--space-5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: var(--space-3);
        }

        .admin-header h1 {
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .admin-actions {
          display: flex;
          gap: var(--space-2);
        }

        .btn-icon {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: rgba(255,255,255,0.1);
        }

        .upload-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-3);
          background: rgba(255, 255, 255, 0.02);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          border: 2px dashed transparent;
          transition: all 0.3s ease;
        }

        .upload-controls.dragging {
          border-color: #00E5FF;
          background: rgba(0, 229, 255, 0.1);
        }

        .upload-instructions {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .btn-primary {
          background: #00E5FF;
          color: #000;
          border: none;
          padding: 0 var(--space-4);
          height: 40px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        .btn-primary:hover {
          background: #fff;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-danger {
          background: rgba(255, 71, 87, 0.1);
          color: #ff4757;
          border: 1px solid rgba(255, 71, 87, 0.2);
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: var(--space-2);
        }

        .btn-danger:hover {
          background: #ff4757;
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
        }

        .admin-tabs {
          display: flex;
          max-width: 1200px;
          margin: 0 auto var(--space-4);
          gap: var(--space-2);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 0;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-btn:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: transparent;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          color: #fff;
          font-weight: 600;
        }
        
        .tab-btn.active.tab-morokko::after {
          background: #fff;
        }
        
        .tab-btn.active.tab-guster::after {
          background: #00E5FF;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }

        .table-container {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--radius-md);
          overflow-x: auto;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .products-table th {
          padding: var(--space-3);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.5);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .products-table td {
          padding: var(--space-3);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          vertical-align: middle;
        }

        .products-table tr:hover td {
          background: rgba(255,255,255,0.03);
        }

        .td-image {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #222;
        }

        .td-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .img-placeholder {
          width: 100%;
          height: 100%;
        }

        .img-placeholder.morokko { background: #EAEAE4; }
        .img-placeholder.guster { background: #333; }

        .td-name strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .td-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .badge-morokko {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge-guster {
          background: rgba(0, 229, 255, 0.1);
          color: #00E5FF;
          border: 1px solid rgba(0, 229, 255, 0.3);
        }

        .td-price {
          font-family: monospace;
          font-size: 1.1rem;
        }

        .td-actions {
          display: flex;
          gap: var(--space-2);
        }

        .action-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }

        .action-btn.edit:hover { color: #00E5FF; }
        .action-btn.delete:hover { color: #ff4757; }

        .empty-state, .loading-state {
          text-align: center;
          padding: var(--space-6) !important;
          color: rgba(255,255,255,0.5);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-3);
        }

        .modal-content {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 500;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover { color: #fff; }

        .product-form {
          padding: var(--space-4);
        }

        .form-row {
          display: flex;
          gap: var(--space-4);
        }

        .form-row > div {
          flex: 1;
        }
        
        .wide-group {
          flex: 1 1 100%;
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--space-2);
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group input, 
        .form-group select, 
        .form-group textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          outline: none;
          border-color: #00E5FF;
          background: rgba(255,255,255,0.08);
        }

        /* Image Upload Styles specific for Multiple Gallery */
        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          background: rgba(0,0,0,0.2);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          border: 1px dashed rgba(255,255,255,0.1);
        }

        .full-width-controls {
           width: 100%;
        }

        .gallery-preview-grid {
           display: flex;
           gap: var(--space-3);
           overflow-x: auto;
           padding-bottom: 10px;
        }
        
        /* Scrollbar styles for the gallery */
        .gallery-preview-grid::-webkit-scrollbar {
          height: 6px;
        }
        .gallery-preview-grid::-webkit-scrollbar-thumb {
          background: rgba(0, 229, 255, 0.3);
          border-radius: 3px;
        }

        .empty-gallery-state {
           width: 100%;
           padding: var(--space-4);
           display: flex;
           flex-direction: column;
           align-items: center;
           color: rgba(255,255,255,0.3);
           border: 1px dashed rgba(255,255,255,0.1);
           border-radius: var(--radius-sm);
        }

        .gallery-item-wrapper {
           position: relative;
           width: 120px;
           flex-shrink: 0;
           display: flex;
           flex-direction: column;
           gap: 4px;
        }

        .gallery-badge {
           position: absolute;
           top: -8px;
           left: -8px;
           background: #00E5FF;
           color: #000;
           font-size: 0.6rem;
           font-weight: 700;
           padding: 2px 6px;
           border-radius: 4px;
           z-index: 2;
        }

        .gallery-image {
           width: 120px;
           height: 120px;
           border-radius: var(--radius-sm);
           overflow: hidden;
           position: relative;
           border: 1px solid rgba(255,255,255,0.1);
        }

        .gallery-image img {
           width: 100%;
           height: 100%;
           object-fit: cover;
        }

        .btn-remove-img {
           position: absolute;
           top: 4px;
           right: 4px;
           background: rgba(0,0,0,0.7);
           border: none;
           color: #ff4757;
           cursor: pointer;
           border-radius: 50%;
           padding: 2px;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: transform 0.2s;
        }
        .btn-remove-img:hover {
           transform: scale(1.1);
        }

        .gallery-controls {
           display: flex;
           justify-content: space-between;
           background: rgba(255,255,255,0.05);
           border-radius: 4px;
           overflow: hidden;
        }

        .gallery-controls button {
           flex: 1;
           background: transparent;
           border: none;
           color: white;
           padding: 4px 0;
           cursor: pointer;
           transition: background 0.2s;
           display: flex;
           justify-content: center;
        }

        .gallery-controls button:hover:not(:disabled) {
           background: rgba(0, 229, 255, 0.2);
        }
        .gallery-controls button:disabled {
           opacity: 0.2;
           cursor: not-allowed;
        }

        .mini-stats {
           font-size: 0.65rem;
           color: #2ed573;
           text-align: center;
           font-family: monospace;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          margin-top: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0 var(--space-4);
          height: 40px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </motion.div>
  );
};

export default ProductosCRUD;
