import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save payment info to localStorage or context for next steps
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/checkout/billing');
  };

  return (
    <div className="checkout-container">
      <h2>Payment Method</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          <input
            type="radio"
            value="phonepe"
            checked={paymentMethod === 'phonepe'}
            onChange={e => setPaymentMethod(e.target.value)}
          />
          PhonePe (Payment backend handled externally)
        </label>
        {/* Add other payment methods if needed */}
        <button type="submit">Next: Billing</button>
      </form>
    </div>
  );
}

export default Payment;
