import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function EditOrder() {
  const { id } = useParams(); // Get the order ID from the URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder(docSnap.data());
          setStatus(docSnap.data().status);
        } else {
          alert('Order not found.');
          navigate('/admin');
        }
      } catch (error) {
        alert('Failed to fetch order.');
        console.error(error);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      alert('Order status updated successfully!');
      navigate('/admin');
    } catch (error) {
      alert('Failed to update order status.');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Edit Order</h2>
      <div>
        <strong>Order ID:</strong> {id}
      </div>
      <div>
        <strong>User:</strong> {order.userEmail || order.userId}
      </div>
      <div style={{ margin: '16px 0' }}>
        <label>Status:&nbsp;</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <button onClick={handleSave} style={{ marginRight: 8 }}>Save</button>
      <button onClick={() => navigate('/admin')}>Cancel</button>
    </div>
  );
}

export default EditOrder;