import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleRemove = (id, name) => {
    removeFromCart(id);
    toast.error(`${name} removed from cart`, {
      style: {
        borderRadius: '12px',
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid rgba(244, 63, 94, 0.2)'
      },
    });
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared successfully');
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="flex justify-between items-end mb-10 px-2">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-display font-black tracking-tight"
        >
          Your <span className="text-primary">Cart</span>
        </motion.h1>
        {cart.length > 0 && (
          <button 
            onClick={handleClear}
            className="text-gray-500 hover:text-rose-500 text-sm font-bold flex items-center gap-2 transition-all group"
          >
            <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
            Clear All
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-24 glass-panel rounded-[3rem] bg-[#111] border border-white/5 relative overflow-hidden group mx-2"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShoppingBag size={48} className="text-gray-600 group-hover:text-primary transition-colors" />
              </div>
              <h2 className="text-3xl font-black mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-10 max-w-md mx-auto font-medium leading-relaxed px-6">
                Looks like you haven't discovered your favorites yet. Explore our premium menu and treat yourself!
              </p>
              <Link 
                to="/menu" 
                className="px-10 py-4 rounded-2xl bg-primary text-black font-black hover:bg-primaryHover transition-all shadow-glow hover:shadow-glow-strong hover:-translate-y-1 active:translate-y-0 inline-flex items-center gap-2 uppercase text-xs tracking-widest"
              >
                Explore Menu
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 px-2">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              <AnimatePresence>
                {cart.map((item, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.1 }}
                    key={item.id} 
                    className="glass-panel p-5 rounded-[2.5rem] bg-[#111] border border-white/5 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/20 transition-all duration-500 hover:bg-[#141414]"
                  >
                    <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 shadow-2xl border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <h3 className="text-xl font-black text-white mb-1 truncate group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-primary font-black text-lg tracking-tighter">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/40 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white/5 transition-all"
                      >
                        <Minus size={18} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-black text-xl text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)} 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white/5 transition-all"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <div className="font-display font-black text-2xl md:w-32 text-right tracking-tighter text-white">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.id, item.name)} 
                      className="w-12 h-12 rounded-2xl bg-rose-500/5 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:rotate-6 active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-[400px]"
            >
              <div className="glass-panel p-10 rounded-[3rem] bg-[#111] border border-white/10 sticky top-28 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                
                <h2 className="text-2xl font-black mb-8 pb-6 border-b border-white/5 tracking-tight uppercase italic">Order Summary</h2>
                
                <div className="space-y-5 mb-8">
                  <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider">
                    <span>Tax (GST 8%)</span>
                    <span className="text-white">Rs. {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider italic">
                    <span>Delivery</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-8 mb-10">
                  <p className="text-[10px] text-gray-500 mb-1 uppercase font-black tracking-[0.2em]">Total Payable</p>
                  <p className="text-5xl font-display font-black text-primary tracking-tighter">Rs. {total.toLocaleString()}</p>
                </div>
                
                <button 
                  onClick={() => {
                    if (!user) {
                      toast.error('Please login to continue.', { id: 'login-toast' });
                      navigate('/login', { state: { from: '/checkout' } });
                      return;
                    }
                    navigate('/checkout');
                  }}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-[#ca8a04] text-black font-black text-lg flex justify-center items-center gap-3 group transition-all shadow-[0_15px_40px_rgba(234,179,8,0.25)] hover:shadow-[0_20px_50px_rgba(234,179,8,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95"
                >
                  Checkout
                  <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  Secure Payment Gateway
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
