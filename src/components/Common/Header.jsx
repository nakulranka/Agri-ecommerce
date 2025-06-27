import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from './SearchBar';
import '../../styles/Header.css';

function Header() {
  const authContext = useAuth();
  const cartContext = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Safely destructure with fallback
  const user = authContext?.user;
  const role = authContext?.role;
  const cart = cartContext?.cart || [];

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          🌾 FarmShop
        </Link>
        
        <SearchBar />
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
          <Link to="/blogs" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link to="/crop-prices" onClick={() => setIsMenuOpen(false)}>Crop Prices</Link>
          <Link to="/plant-disease" onClick={() => setIsMenuOpen(false)}>Plant Disease</Link>
          <Link to="/soil-recommendation" onClick={() => setIsMenuOpen(false)}>Soil Analysis</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          
          {user && (
            <>
              <Link to="/order-history" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
              {role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
              )}
            </>
          )}
          
          <Link to="/cart" className="cart-link" onClick={() => setIsMenuOpen(false)}>
            🛒 Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          
          {user ? (
            <div className="user-menu">
              <Link to="/account" onClick={() => setIsMenuOpen(false)}>👤 Account</Link>
              <Link to="/settings" onClick={() => setIsMenuOpen(false)}>⚙️ Settings</Link>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </nav>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}

export default Header;