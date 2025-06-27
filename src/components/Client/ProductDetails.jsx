import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCart } from '../../context/CartContext';
import '../../styles/Product.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/notfound');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-container">
      <h2>{product.name}</h2>
      <img src={product.imageUrl || '/placeholder.png'} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <label>
        Quantity:
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(parseInt(e.target.value) || 1)}
        />
      </label>
      <button onClick={handleAddToCart}>Buy Now</button>
    </div>
  );
}

export default ProductDetails;
