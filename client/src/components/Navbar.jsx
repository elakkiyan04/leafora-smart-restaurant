import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, User, LogOut, ClipboardList, Settings, QrCode } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import QrScannerModal from './QrScannerModal';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useUserAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close avatar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'MENU', path: '/menu' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'OFFERS', path: '/offers' },
    { name: 'RESERVATIONS', path: '/reservations' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 rounded-2xl border border-orange-500/20 bg-black/60 backdrop-blur-xl shadow-[0_10px_35px_rgba(249,115,22,0.15)] w-[calc(100%-2.5rem)] max-w-[1780px] ${isScrolled ? 'top-4 py-3 bg-[#0a0a0a]/90 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_5px_20px_rgba(249,115,22,0.15)]' : 'top-6 py-4.5 bg-black/45'} px-10 md:px-16`}>
      <div className="w-full flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] group-hover:border-orange-500/50 transition-all duration-300">
            <svg 
              className="w-7 h-7 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10V2Z" fill="url(#navLeafGradient)" stroke="none" />
              <path d="M12 22c5.5 0 10-4.5 10-10 0-5.5-4.5-10-10-10v20Z" fill="url(#navLeafGradient2)" stroke="none" />
              <path d="M12 2v20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M12 7c2-1 3.5 0 3.5 2S14 12 12 13" stroke="white" strokeWidth="1.5" />
              <path d="M12 12c-2-1-3.5 0-3.5 2s1.5 3 3.5 4" stroke="white" strokeWidth="1.5" />
              <defs>
                <linearGradient id="navLeafGradient" x1="2" y1="12" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="navLeafGradient2" x1="12" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#facc15" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display font-bold text-2.5xl tracking-wide text-white drop-shadow-md select-none">
            Leafora
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-16">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative py-1 text-[11px] font-black tracking-widest transition-all duration-300 uppercase overflow-hidden group ${
                isActive(link.path) 
                  ? 'text-orange-500' 
                  : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              <span className="relative z-10">{link.name}</span>
              {isActive(link.path) && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,1)]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          {/* User Account Experience */}
          {!user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                state={{ isLogin: true }}
                className="text-xs font-bold text-gray-300 hover:text-orange-500 transition-colors uppercase tracking-wider"
              >
                Login
              </Link>
              <Link 
                to="/login" 
                state={{ isLogin: false }}
                className="border border-[#eab308]/30 hover:bg-[#eab308]/10 text-[#eab308] font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#eab308] to-[#ca8a04] text-black font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(234,179,8,0.3)] border border-[#eab308]/40 cursor-pointer focus:outline-none"
              >
                {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3.5 w-52 bg-[#111]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2.5 z-[110]"
                  >
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm text-white font-bold truncate">{user.firstName}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-[#eab308] hover:bg-white/5 transition-all rounded-xl mx-2"
                    >
                      <User size={14} />
                      My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-[#eab308] hover:bg-white/5 transition-all rounded-xl mx-2"
                    >
                      <ClipboardList size={14} />
                      My Orders
                    </Link>

                    <div className="h-px bg-white/5 my-2"></div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-[calc(100%-1rem)] text-left flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-xl mx-2"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsScannerOpen(true)}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-orange-500/50 hover:bg-orange-500/10 transition-all shadow-lg text-gray-300 hover:text-orange-500 cursor-pointer"
            title="Scan Table QR Code"
          >
            <QrCode size={18} />
          </motion.button>

          <Link to="/cart" className="relative group">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all shadow-lg"
            >
              <ShoppingBag size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.5)] border-2 border-[#0a0a0a]"
                >
                  {totalItems}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </Link>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/menu" className="relative group overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-2.5 px-7 rounded-xl shadow-glow hover:shadow-glow-strong transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest">
              <span className="relative z-10">Order Now</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-orange-500 transition-colors"
            title="Scan Table QR Code"
          >
            <QrCode size={16} />
          </button>

          <Link to="/cart" className="relative group">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ShoppingBag size={18} className="text-gray-300" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/98 backdrop-blur-2xl border-t border-white/5 overflow-hidden rounded-b-2xl"
          >
            <div className="px-6 py-8 flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-[10px] font-black tracking-widest uppercase px-6 py-4 rounded-2xl block transition-all duration-300 ${
                      isActive(link.path) 
                        ? 'text-black bg-gradient-to-r from-orange-400 to-orange-600 shadow-xl' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="h-px w-full bg-white/5 my-4"></div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {!user ? (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      to="/login" 
                      state={{ isLogin: true }}
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="text-xs font-black uppercase tracking-widest text-gray-300 px-6 py-4 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <User size={18} className="text-gray-400" />
                      </div>
                      Login
                    </Link>
                    <Link 
                      to="/login" 
                      state={{ isLogin: false }}
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="text-xs font-black uppercase tracking-widest text-gray-300 px-6 py-4 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <User size={18} className="text-gray-400" />
                      </div>
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 px-6 py-3 border-b border-white/5 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#eab308] to-[#ca8a04] text-black font-black text-lg flex items-center justify-center shadow-lg border border-black">
                        {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{user.firstName}</p>
                        <p className="text-xs text-gray-500 font-bold">{user.email}</p>
                      </div>
                    </div>

                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="text-xs font-black uppercase tracking-widest text-gray-300 px-6 py-4 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-colors"
                    >
                      My Profile
                    </Link>

                    <Link 
                      to="/my-orders" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="text-xs font-black uppercase tracking-widest text-gray-300 px-6 py-4 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-colors"
                    >
                      My Orders
                    </Link>

                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }} 
                      className="w-full text-left text-xs font-black uppercase tracking-widest text-red-400 px-6 py-4 hover:bg-red-500/10 rounded-2xl flex items-center gap-4 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}

                <div className="pt-6">
                  <Link 
                    to="/menu" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="w-full block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-5 rounded-2xl shadow-glow uppercase text-xs tracking-widest"
                  >
                    ORDER NOW
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <QrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </nav>
  );
};

export default Navbar;
