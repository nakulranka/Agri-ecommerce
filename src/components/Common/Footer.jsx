import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🌾 FarmShop</h3>
            <p>Your trusted partner in agriculture</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/products">Marketplace</Link></li>
              <li><Link to="/blogs">Blog</Link></li>
              <li><Link to="/crop-prices">Crop Prices</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/plant-disease">Plant Disease</Link></li>
              <li><Link to="/soil-recommendation">Soil Analysis</Link></li>
              <li><Link to="/order-history">Order History</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@farmshop.com</p>
            <p>Phone: +91 123-456-7890</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 FarmShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;