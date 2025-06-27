import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import '../../styles/Admin.css';

function AdminProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'products'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-section">
      <h3>Your Products</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="admin-product-list">
          {products.map((product) => (
            <li key={product.id} className="admin-product-item">
              <img src={product.imageUrl || '/placeholder.png'} alt={product.name} />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>Price: ₹{product.price}</p>
                <button onClick={() => handleEdit(product.id)}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminProductList;
