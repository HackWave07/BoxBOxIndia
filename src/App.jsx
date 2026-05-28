import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MegaMenu from './components/MegaMenu';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import AdminOrders from './pages/AdminOrders';
import Admin from './pages/Admin';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import WhatsAppButton from './components/WhatsAppButton';
import AISupportChat from './components/AISupportChat';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import SEOLanding from './pages/SEOLanding';
import AllReviews from './pages/AllReviews';
import RefundPolicy from './pages/RefundPolicy';
import { ShippingPolicy, TermsPolicy, PrivacyPolicy } from './pages/PolicyPages';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <header className="main-header" style={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%', background: 'var(--bg)' }}>
          <Navbar />
          <MegaMenu />
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute ownerOnly><Admin /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute ownerOnly><AdminOrders /></ProtectedRoute>} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/motorcycle-tyres" element={<SEOLanding type="motorcycle-tyres" />} />
            <Route path="/bike-tyres" element={<SEOLanding type="bike-tyres" />} />
            <Route path="/superbike-tyres" element={<SEOLanding type="superbike-tyres" />} />
            <Route path="/premium-tyres" element={<SEOLanding type="premium-tyres" />} />
            <Route path="/reviews" element={<AllReviews />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/returns-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
        <AISupportChat />
        <WhatsAppButton />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
