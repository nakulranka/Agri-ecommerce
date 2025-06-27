import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Address() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save address info to localStorage or context for next steps
    const shippingAddress = { address, city, state, zip };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    navigate('/checkout/payment');
  };

  return (
    <div className="checkout-container">
      <h2>Shipping Address</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State:
          <input
            type="text"
            value={state}
            onChange={e => setState(e.target.value)}
            required
          />
        </label>
        <label>
          ZIP Code:
          <input
            type="text"
            value={zip}
            onChange={e => setZip(e.target.value)}
            required
          />
        </label>
        <button type="submit">Next: Payment</button>
      </form>
    </div>
  );
}

export default Address;
