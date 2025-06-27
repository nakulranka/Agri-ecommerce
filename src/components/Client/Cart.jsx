import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout/address');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart is Empty</h2>
        <Link to="/products">Go to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
      <ul className="cart-list">
        {cart.map(item => (
          <li key={item.id} className="cart-item">
            <img src={item.imageUrl || '/placeholder.png'} alt={item.name} />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                />
              </label>
              <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Total: ₹{totalPrice}</h3>
      <button onClick={handleCheckout} className="checkout-btn">Proceed to Checkout</button>
    </div>
  );
}

export default Cart;
