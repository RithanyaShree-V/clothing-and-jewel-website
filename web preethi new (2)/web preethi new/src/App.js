import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Wishlist from './pages/Wishlist';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <div className="app">
            <Routes>
              <Route path="/admin/*" element={<AdminPanel />} />
              <Route
                path="/*"
                element={
                  <>
                    <Sidebar />
                    <div className="main-content">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<AllProducts />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/login" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                      </Routes>
                    </div>
                  </>
                }
              />
            </Routes>
          </div>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

