import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import About from './pages/About';
import Offers from './pages/Offers';
import Reservations from './pages/Reservations';
import ReservationConfirmation from './pages/ReservationConfirmation';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import QrLanding from './pages/QrLanding';
import SmartDiningMenu from './pages/SmartDiningMenu';
import SmartOrderStatus from './pages/SmartOrderStatus';
import NotFound from './pages/NotFound';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isQrRoute = 
    location.pathname.startsWith('/qr-landing') || 
    location.pathname.startsWith('/smart-menu') || 
    location.pathname.startsWith('/smart-order-status');

  const hideNavbar = isAdminRoute || isQrRoute;
  const ptClass = hideNavbar ? (isAdminRoute ? 'pt-8' : 'pt-0') : 'pt-24';

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center">
          {/* Glowing background behind logo */}
          <div className="absolute w-36 h-36 bg-orange-500/20 rounded-full blur-[40px] animate-pulse"></div>
          
          {/* Logo container */}
          <motion.div 
            className="w-20 h-20 rounded-2.5xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white shadow-[0_0_40px_rgba(249,115,22,0.3)] mb-8"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg 
              className="w-11 h-11 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10V2Z" fill="url(#loadingLeafGradient)" stroke="none" />
              <path d="M12 22c5.5 0 10-4.5 10-10 0-5.5-4.5-10-10-10v20Z" fill="url(#loadingLeafGradient2)" stroke="none" />
              <path d="M12 2v20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M12 7c2-1 3.5 0 3.5 2S14 12 12 13" stroke="white" strokeWidth="1.5" />
              <path d="M12 12c-2-1-3.5 0-3.5 2s1.5 3 3.5 4" stroke="white" strokeWidth="1.5" />
              <defs>
                <linearGradient id="loadingLeafGradient" x1="2" y1="12" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="loadingLeafGradient2" x1="12" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#facc15" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          
          <h2 className="text-2xl font-serif font-black text-white italic tracking-wide mb-3 animate-pulse">
            Leafora
          </h2>
          
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
            Preparing Your Dining Experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-gray-200">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: '#eab308',
              secondary: '#000',
            },
          },
        }}
      />
      
      {/* Soft glowing border around the main container */}
      <div className="fixed inset-0 border-[12px] border-white/5 pointer-events-none z-50 shadow-[inset_0_0_50px_rgba(234,179,8,0.05)]"></div>
      
      {!hideNavbar && <Navbar />}
      
      {/* Centered boxed layout effect */}
      <main className={location.pathname === '/' ? '' : `max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 ${ptClass} pb-12`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reservation-confirmation/:reservationId" element={<ReservationConfirmation />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-status/:orderId" element={<OrderStatus />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/qr-landing" element={<QrLanding />} />
              <Route path="/smart-menu" element={<SmartDiningMenu />} />
              <Route path="/smart-order-status/:orderId" element={<SmartOrderStatus />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
