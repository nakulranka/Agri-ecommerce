import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CropPrices() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Mock API - Replace with a real agricultural price API
        const response = await axios.get('https://api.mockapi.io/crop-prices');
        setPrices(response.data);
      } catch (err) {
        console.error(err);
        setPrices([
          { crop: 'Wheat', price: 2500 },
          { crop: 'Rice', price: 3000 },
          { crop: 'Corn', price: 2000 },
        ]); // Fallback data
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="crop-prices container">
      <h2>Live Crop Prices</h2>
      <ul>
        {prices.map((item, index) => (
          <li key={index}>{item.crop}: ₹{item.price}/month</li>
        ))}
      </ul>
    </div>
  );
}

export default CropPrices;