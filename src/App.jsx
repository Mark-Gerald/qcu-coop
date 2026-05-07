import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import PageLoader from './components/PageLoader';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import OrderAction from './pages/OrderAction';

function AppContent() {
  const { user } = useAuth();
  const [cart, setCartRaw] = useState([]);

  // Load cart from localStorage whenever user changes
  useEffect(() => {
    if (user?.student_id) {
      const key = `cart_${user.student_id}`;
      try {
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        setCartRaw(saved);
      } catch {
        setCartRaw([]);
      }
    } else {
      // No user logged in — empty cart
      setCartRaw([]);
    }
  }, [user?.student_id]);

  // Wrap setCart so it always saves to the correct user's key
  const setCart = (updater) => {
    setCartRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (user?.student_id) {
        localStorage.setItem(`cart_${user.student_id}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const sharedProps = { cart, setCart };

  return (
    <Routes>
      <Route path="/"               element={<Home {...sharedProps} />} />
      <Route path="/shop"           element={<Shop {...sharedProps} />} />
      <Route path="/cart"           element={<Cart {...sharedProps} />} />
      <Route path="/orders"         element={<Orders />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/about"          element={<About />} />
      <Route path="/contact"        element={<Contact />} />
      <Route path="/admin/login"    element={<AdminLogin />} />
      <Route path="/admin"          element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders"   element={<AdminOrders />} />
      <Route path="/admin/users"    element={<AdminUsers />} />
      <Route path="/order-action"   element={<OrderAction />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <PageLoader />
      <AppContent />
    </Router>
  );
}