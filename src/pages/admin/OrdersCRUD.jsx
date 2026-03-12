import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch, LogOut, CheckCircle, Clock, Truck, Eye, X, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const OrdersCRUD = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { setSpecificTheme } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setSpecificTheme('light');
    fetchOrders();
  }, [setSpecificTheme]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Obtener ordenes con sus items relacionados
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Catch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    if (!window.confirm(`¿Estás seguro de marcar este pedido como ${newStatus === 'shipped' ? 'Enviado' : newStatus}?`)) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Actualizar estado local
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));
      
      if(selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => ({...prev, status: newStatus}));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Hubo un error al actualizar el estado del pedido.');
    }
  };

  const handleLogout = async () => {
      await signOut();
      navigate('/admin/login');
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
        <h1>Gestión de Pedidos</h1>
        <div className="admin-actions">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por ID, nombre, email o estado..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="stats-badge">
             Total: {orders.length} pedidos
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading && orders.length === 0 ? (
          <div className="loading-state">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
              <PackageSearch size={48} opacity={0.5} />
              <p>No hay pedidos registrados aún.</p>
          </div>
        ) : (() => {
          const filteredOrders = orders.filter(order => {
              const term = searchTerm.toLowerCase();
              const idStr = (order.stripe_payment_id ? order.stripe_payment_id.split('_').pop() : order.id).toLowerCase();
              const nameMatch = (order.customer_name || '').toLowerCase().includes(term);
              const emailMatch = (order.customer_email || '').toLowerCase().includes(term);
              const idMatch = idStr.includes(term);
              const statusStr = order.status === 'paid' ? 'pagado pendiente' : 'enviado';
              const statusMatch = statusStr.includes(term);
              
              return nameMatch || emailMatch || idMatch || statusMatch;
          });

          return (
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                        No se encontraron pedidos{searchTerm ? ` para "${searchTerm}"` : ''}.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="mono-text">
                          {order.stripe_payment_id ? order.stripe_payment_id.split('_').pop().toUpperCase() : order.id.split('-')[0]}
                          <div className="date-subtext">
                              {new Date(order.created_at).toLocaleDateString('es-MX', {day: 'numeric', month: 'short', hour:'2-digit', minute:'2-digit'})}
                          </div>
                      </td>
                      <td>{order.customer_name}</td>
                      <td>
                          <div className="contact-info">
                              <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>
                              <a href={`tel:${order.customer_phone}`}>{order.customer_phone}</a>
                          </div>
                      </td>
                      <td className="price-cell">${parseFloat(order.total_amount).toFixed(2)}</td>
                      <td>
                          <span className={`status-badge ${order.status === 'paid' ? 'status-paid' : 'status-shipped'}`}>
                              {order.status === 'paid' ? <Clock size={14}/> : <CheckCircle size={14}/>}
                              {order.status === 'paid' ? 'Pagado (Pendiente)' : 'Enviado'}
                          </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="icon-btn-view" onClick={() => setSelectedOrder(order)} title="Ver Detalles">
                            <Eye size={18} />
                          </button>
                          {order.status === 'paid' && (
                              <button className="icon-btn-ship" onClick={() => updateOrderStatus(order.id, 'shipped')} title="Marcar como Enviado">
                                <Truck size={18} />
                              </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          );
        })()}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content order-modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="modal-header">
                <h2>Detalles del Pedido</h2>
                <button onClick={() => setSelectedOrder(null)} className="close-btn"><X size={24} /></button>
              </div>
              
              <div className="order-details-grid">
                  <div className="detail-section">
                      <h3>Información del Cliente</h3>
                      <p><strong>Nombre:</strong> {selectedOrder.customer_name}</p>
                      <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                      <p><strong>Teléfono:</strong> {selectedOrder.customer_phone}</p>
                  </div>
                  
                  <div className="detail-section">
                      <h3>Dirección de Envío</h3>
                      <p><strong>Calle:</strong> {selectedOrder.calle} {selectedOrder.numero_ext} {selectedOrder.numero_int ? `Int. ${selectedOrder.numero_int}` : ''}</p>
                      <p><strong>Colonia:</strong> {selectedOrder.colonia}</p>
                      <p><strong>Alcaldía/Municipio:</strong> {selectedOrder.alcaldia}</p>
                      <p><strong>Estado:</strong> {selectedOrder.estado}</p>
                      <p><strong>C.P.:</strong> {selectedOrder.cp}</p>
                      <p className="full-address-note"><em>Referencia cruda: {selectedOrder.address}</em></p>
                  </div>

                  <div className="detail-section full-width-section">
                      <h3>Artículos en el Pedido</h3>
                      <div className="order-items-list">
                          {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                              <table className="mini-table">
                                  <thead>
                                      <tr>
                                          <th>Producto</th>
                                          <th>Marca</th>
                                          <th>Cant.</th>
                                          <th>Precio Unit.</th>
                                          <th>Subtotal</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {selectedOrder.order_items.map(item => (
                                          <tr key={item.id}>
                                              <td>{item.product_name}</td>
                                              <td>{item.brand}</td>
                                              <td>{item.quantity}</td>
                                              <td>${parseFloat(item.price).toFixed(2)}</td>
                                              <td>${(item.quantity * item.price).toFixed(2)}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          ) : (
                              <p>No se encontraron artículos desglosados para este pedido.</p>
                          )}
                      </div>
                      <div className="total-row">
                          <strong>Total Pagado:</strong> <span>${parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                      </div>
                  </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setSelectedOrder(null)} className="btn-secondary">Cerrar</button>
                {selectedOrder.status === 'paid' && (
                    <button type="button" className="btn-primary flex-center" onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}>
                        <Truck size={18} style={{marginRight: '8px'}}/> Marcar como Enviado
                    </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Shared variables from panel */
        .admin-container {
          min-height: 100vh;
          background-color: transparent;
          color: var(--text-primary, #111827);
          padding: 0;
          font-family: var(--font-body, 'Space Grotesk', sans-serif);
        }

        /* Top Navigation */


        .admin-header {
          max-width: 1200px;
          margin: 0 auto var(--space-5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          padding-top: var(--space-6);
          padding-bottom: var(--space-4);
        }

        .admin-header h1 {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: -0.5px;
          color: #111827;
        }

        .admin-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .stats-badge {
            background: #F3F4F6;
            color: #374151;
            padding: 6px 16px;
            border-radius: var(--radius-full);
            font-size: 0.9rem;
            font-weight: 600;
            border: 1px solid rgba(0,0,0,0.05);
            height: 40px;
            display: flex;
            align-items: center;
        }

        .table-container {
          max-width: 1200px;
          margin: 0 auto;
          background-color: #FFFFFF;
          border-radius: var(--item-radius);
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
          overflow: hidden;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table th,
        .products-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }

        .products-table th {
          background-color: #F9FAFB;
          color: #6B7280;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1px;
        }

        .products-table tr:hover {
          background-color: #F9FAFB;
        }

        .mono-text {
            font-family: monospace;
            font-weight: 600;
            letter-spacing: 1px;
            color: #111827;
        }

        .date-subtext {
            font-family: var(--font-body);
            font-size: 0.8rem;
            color: #6B7280;
            margin-top: 4px;
            letter-spacing: normal;
            font-weight: normal;
        }

        .contact-info a {
            display: block;
            color: #4B5563;
            text-decoration: none;
            font-size: 0.9rem;
            margin-bottom: 2px;
        }
        
        .contact-info a:hover {
            color: #111827;
            text-decoration: underline;
        }

        .price-cell {
          font-weight: 700;
          color: #111827;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: var(--radius-full);
            font-size: 0.85rem;
            font-weight: 600;
        }

        .status-paid {
            background-color: #FEF3C7;
            color: #D97706;
            border: 1px solid #FDE68A;
        }

        .status-shipped {
            background-color: #D1FAE5;
            color: #059669;
            border: 1px solid #A7F3D0;
        }

        .actions-cell {
          display: flex;
          gap: 8px;
        }

        .icon-btn-view, .icon-btn-ship {
            background: transparent;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .icon-btn-view {
            color: #4B5563;
            background: #F3F4F6;
        }
        .icon-btn-view:hover {
            background: #E5E7EB;
            color: #111827;
        }

        .icon-btn-ship {
            color: #059669;
            background: #D1FAE5;
        }
        .icon-btn-ship:hover {
            background: #A7F3D0;
        }

        .loading-state, .empty-state {
          padding: 60px;
          text-align: center;
          color: #6B7280;
        }
        
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }

        /* Modal Overrides */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-4);
        }

        .modal-content.order-modal {
            background-color: #FFFFFF;
            width: 100%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: var(--item-radius);
            padding: var(--space-5);
            border: 1px solid rgba(0,0,0,0.05);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-5);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        
        .modal-header h2 {
            font-family: var(--font-heading);
            color: #111827;
            font-size: 1.5rem;
        }

        .close-btn {
          background: #F3F4F6;
          box-sizing: content-box;
          padding: 8px;
          border-radius: 50%;
          border: none;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .close-btn:hover { 
            background: #E5E7EB;
            color: #111827; 
        }

        .order-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-5);
            margin-bottom: var(--space-5);
        }

        .detail-section h3 {
            font-size: 0.95rem;
            color: #6B7280;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: var(--font-body);
            font-weight: 700;
        }

        .detail-section p {
            margin-bottom: 8px;
            line-height: 1.4;
            color: #374151;
        }

        .detail-section strong {
            color: #111827;
        }

        .full-width-section {
            grid-column: 1 / -1;
        }

        .full-address-note {
            font-size: 0.85rem;
            color: #9CA3AF !important;
            margin-top: 12px;
        }

        .mini-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            background: #F9FAFB;
            border-radius: var(--radius-sm);
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
        }

        .mini-table th, .mini-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .mini-table th {
            background: #F3F4F6;
            color: #4B5563;
            font-weight: 600;
            font-size: 0.85rem;
        }

        .mini-table td {
            color: #374151;
        }

        .total-row {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 16px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 2px solid rgba(0,0,0,0.05);
            font-size: 1.25rem;
        }

        .total-row span {
            font-weight: 800;
            color: #111827;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          margin-top: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid rgba(0,0,0,0.08);
        }

        .btn-secondary {
          background-color: transparent;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .btn-secondary:hover {
          background-color: #F3F4F6;
        }

        .btn-primary {
          background-color: #111827;
          color: #FFFFFF;
          border: none;
          padding: 10px 24px;
          border-radius: var(--radius-full);
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        
        .btn-primary:hover {
          background-color: #000000;
        }

        .btn-primary:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
            .order-details-grid {
                grid-template-columns: 1fr;
            }
            .admin-top-nav {
                flex-direction: column;
                gap: 16px;
            }
            .nav-links {
                width: 100%;
                justify-content: center;
            }
            .table-container {
                overflow-x: auto;
            }
            .search-wrapper {
                width: 100%;
            }
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          background: #F9FAFB;
          border: 1px solid #D1D5DB;
          border-radius: var(--radius-full);
          padding: 6px 16px;
          width: 350px;
          height: 40px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-wrapper:focus-within {
          border-color: #111827;
          box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
        }

        .search-icon {
          color: #6B7280;
          margin-right: 8px;
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-family: inherit;
          font-size: 0.95rem;
          color: #111827;
        }
      `}</style>
    </motion.div>
  );
};

export default OrdersCRUD;
