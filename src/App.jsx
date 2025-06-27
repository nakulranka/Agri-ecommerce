import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './components/Client/ProductList';
import ProductDetails from './components/Client/ProductDetails';
import Cart from './components/Client/Cart';
import Checkout from './components/Client/Checkout';
import OrderHistory from './components/Client/OrderHistory';
import BlogList from './components/Client/BlogList';
import CropPrices from './pages/CropPrices';
import Contact from './components/Client/Contact';
import PlantDisease from './components/ML/PlantDisease';
import SoilRecommendation from './components/ML/SoilRecommendation';
import NotFound from './pages/NotFound';
import './styles/App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={<Account />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/crop-prices" element={<CropPrices />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/plant-disease" element={<PlantDisease />} />
                <Route path="/soil-recommendation" element={<SoilRecommendation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
