import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/Toast';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AboutContactPage } from './pages/AboutContactPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminFirebaseGuide } from './pages/admin/AdminFirebaseGuide';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout Wrapper
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-[#F5F0E6]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Customer Storefront */}
              <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
              <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
              <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
              <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
              <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
              <Route path="/order-success" element={<CustomerLayout><OrderSuccessPage /></CustomerLayout>} />
              <Route path="/about" element={<CustomerLayout><AboutContactPage /></CustomerLayout>} />
              <Route path="/contact" element={<CustomerLayout><AboutContactPage /></CustomerLayout>} />

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Portal Protected Section */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="firebase-guide" element={<AdminFirebaseGuide />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global luxury notification toasts */}
            <ToastContainer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
