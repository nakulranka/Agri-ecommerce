import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Farming E-Commerce</h1>
      <div className="home-options">
        <Link to="/products" className="home-option">
          Marketplace
        </Link>
        <Link to="/plant-disease" className="home-option">
          Plant Disease Detection (ML Model)
        </Link>
        <Link to="/soil-recommendation" className="home-option">
          Soil Recommendation System (ML Model)
        </Link>
        <Link to="/blogs" className="home-option">
          Farming Blog
        </Link>
        <Link to="/crop-prices" className="home-option">
          Live Crop Prices
        </Link>
        <Link to="/contact" className="home-option">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export default Home;
