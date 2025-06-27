import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = {
        userId: user.uid,
        userEmail: user.email,
        items: cart,
        totalAmount: total,
        shippingAddress: address,
        status: 'pending',
        paymentStatus: 'pending',
        orderDate: new Date(),
      };

      await addDoc(collection(db, 'orders'), order);
      clearCart();
      alert('Order placed successfully!');
      navigate('/order-history');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout container">
      <h2>Checkout</h2>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="total">
            <strong>Total: ₹{total}</strong>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="address-form">
          <h3>Shipping Address</h3>
          
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={address.addressLine1}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            value={address.addressLine2}
            onChange={handleInputChange}
          />
          
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleInputChange}
            required
          />

          <div className="payment-info">
            <p>Payment will be processed through PhonePe after order confirmation.</p>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;