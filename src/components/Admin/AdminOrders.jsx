import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import '../../styles/Admin.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filterOrders = () => {
      if (statusFilter === 'all') {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(orders.filter(order => order.status === statusFilter));
      }
    };

    filterOrders();
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('orderDate', 'desc'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate?.toDate()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: new Date()
      });
      
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        )
      );
      
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'in-transit': return '#e67e22';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      'in-transit': orders.filter(o => o.status === 'in-transit').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h3>Order Management</h3>
        <div className="order-stats">
          <div className="stat-item">
            <span className="stat-number">{statusCounts.all}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{statusCounts.pending}</span>
            <span className="stat-label">New Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{statusCounts['in-transit']}</span>
            <span className="stat-label">In Transit</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{statusCounts.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        <label>Filter by Status:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Orders ({statusCounts.all})</option>
          <option value="pending">New Orders ({statusCounts.pending})</option>
          <option value="confirmed">Confirmed ({statusCounts.confirmed})</option>
          <option value="in-transit">In Transit ({statusCounts['in-transit']})</option>
          <option value="delivered">Delivered ({statusCounts.delivered})</option>
          <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          No orders found for the selected filter.
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order.id.slice(-8)}</strong>
                  <span className="order-date">
                    {order.orderDate?.toLocaleDateString()}
                  </span>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-details">
                <div className="customer-info">
                  <h4>Customer Information</h4>
                  <p><strong>Email:</strong> {order.userEmail}</p>
                  <p><strong>Name:</strong> {order.shippingAddress?.fullName}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
                </div>

                <div className="shipping-address">
                  <h4>Shipping Address</h4>
                  <p>{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                </div>

                <div className="order-items">
                  <h4>Order Items</h4>
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                      <span className="item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                  </div>
                </div>

                <div className="order-actions">
                  <label>Update Status:</label>
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    disabled={updating[order.id]}
                    className="status-select"
                  >
                    <option value="pending">New Order</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updating[order.id] && <span className="updating">Updating...</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;