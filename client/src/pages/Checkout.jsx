import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useUserAuth } from '../context/UserAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, User, Phone, MapPin, 
  ClipboardList, QrCode, ShoppingBag, CheckCircle, Info, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, subtotal: foodSubtotal, clearCart, tableNumber } = useCart();
  const { addOrder } = useOrder();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const BEVERAGE_MENU = [
    { name: 'Water', price: 150, emoji: '💧' },
    { name: 'Coca-Cola', price: 250, emoji: '🥤' },
    { name: 'Pepsi', price: 250, emoji: '🥤' },
    { name: 'Sprite', price: 250, emoji: '🍋' },
    { name: '7UP', price: 250, emoji: '💚' },
    { name: 'Fanta', price: 250, emoji: '🍊' },
    { name: 'Lime Juice', price: 350, emoji: '🍹' },
    { name: 'Orange Juice', price: 450, emoji: '🍹' }
  ];

  // Form State
  const [orderType, setOrderType] = useState('Delivery');
  const [table, setTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [beverages, setBeverages] = useState({
    'Water': 0,
    'Coca-Cola': 0,
    'Pepsi': 0,
    'Sprite': 0,
    '7UP': 0,
    'Fanta': 0,
    'Lime Juice': 0,
    'Orange Juice': 0
  });

  const beverageSubtotal = BEVERAGE_MENU.reduce((sum, bev) => sum + bev.price * (beverages[bev.name] || 0), 0);
  const combinedSubtotal = foodSubtotal + beverageSubtotal;
  const tax = combinedSubtotal * 0.08; // 8% GST
  const total = combinedSubtotal + tax;

  // Handle QR detection and pre-selection
  useEffect(() => {
    if (tableNumber) {
      setOrderType('Dine In');
      setTable(tableNumber);
    }
  }, [tableNumber]);

  // Route Guard: Redirect guests trying to access checkout directly
  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue.', { id: 'login-toast' });
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  // Auto-fill customer details if logged in
  useEffect(() => {
    if (user) {
      if (user.firstName) setCustomerName(user.firstName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Handle order type selection changes
  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    toast.success(`Switched to ${type} order flow!`, {
      icon: type === 'Dine In' ? '🍽️' : '🛵',
      style: {
        borderRadius: '12px',
        background: '#111',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validations
    if (!customerName) {
      toast.error('Please enter your Name.');
      return;
    }
    if (!phone) {
      toast.error('Please enter your Phone Number.');
      return;
    }

    if (orderType === 'Dine In' && !table) {
      toast.error('Please enter a Table Number.');
      return;
    }

    if (orderType === 'Delivery' && !address) {
      toast.error('Please enter your Delivery Address.');
      return;
    }

    // Build beverages list
    const selectedBeverages = BEVERAGE_MENU.filter(bev => beverages[bev.name] > 0).map(bev => ({
      name: bev.name,
      quantity: beverages[bev.name],
      price: bev.price
    }));

    // Build order object
    const orderData = {
      orderType,
      table: orderType === 'Dine In' ? table : '',
      customerName,
      email: email || 'guest@leafora.com',
      phone,
      address: orderType === 'Delivery' ? address : '',
      landmark: orderType === 'Delivery' ? landmark : '',
      notes,
      totalAmount: total,
      items: [
        ...cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        ...selectedBeverages
      ]
    };

    try {
      const newOrder = await addOrder(orderData);
      
      // Clear shopping cart
      clearCart();

      toast.success('Your order has been placed successfully.', {
        icon: '🎉',
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(234, 179, 8, 0.2)'
        }
      });

      // Navigate to tracking status
      navigate(`/order-status/${newOrder._id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-10 glass-panel rounded-[3rem] bg-[#111] border border-white/5 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-black mb-4">No items in checkout</h2>
          <p className="text-gray-400 mb-8 font-medium">
            Your cart is currently empty. Head over to our premium menu to add delicious dishes before checking out!
          </p>
          <Link 
            to="/menu" 
            className="px-8 py-3.5 rounded-2xl bg-primary text-black font-black hover:bg-primaryHover transition-all shadow-glow inline-flex items-center gap-2 uppercase text-xs tracking-widest"
          >
            Go To Menu
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen px-4 lg:px-8 max-w-[1600px] mx-auto pb-20">
      
      {/* Header & Back Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <Link 
            to="/cart" 
            className="text-gray-400 hover:text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors mb-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back To Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white">
            Secure <span className="text-primary">Checkout</span>
          </h1>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Encrypted Connection
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Column: Checkout Forms */}
        <div className="flex-1 w-full space-y-8">
          
          {/* Order Type Toggle Cards */}
          <div className="glass-panel p-8 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
            
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              1. Select Order Type
            </h3>

            <div className="grid grid-cols-2 gap-6">
              
              {/* Dine-In Option */}
              <button
                type="button"
                onClick={() => handleOrderTypeChange('Dine In')}
                className={`group flex flex-col items-center justify-center p-6 rounded-3xl border text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  orderType === 'Dine In'
                    ? 'border-primary/80 text-primary shadow-glow bg-primary/10'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="text-4xl mb-3 block transform group-hover:scale-110 transition-transform">🍽️</span>
                <span className="text-sm font-black tracking-widest uppercase">Dine In</span>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">Serve at table</span>
              </button>

              {/* Delivery Option */}
              <button
                type="button"
                onClick={() => handleOrderTypeChange('Delivery')}
                className={`group flex flex-col items-center justify-center p-6 rounded-3xl border text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  orderType === 'Delivery'
                    ? 'border-primary/80 text-primary shadow-glow bg-primary/10'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="text-4xl mb-3 block transform group-hover:scale-110 transition-transform">🛵</span>
                <span className="text-sm font-black tracking-widest uppercase">Delivery</span>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">Deliver to doorstep</span>
              </button>
            </div>

            {/* Contextual Notices */}
            <AnimatePresence mode="wait">
              {orderType === 'Dine In' && tableNumber && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex gap-3 items-center"
                >
                  <QrCode size={18} className="text-primary animate-pulse flex-shrink-0" />
                  <p className="text-xs text-primary font-bold">
                    QR Table Detected: We've locked your session to Table #{tableNumber}. Your items will be served hot right there!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Content Block */}
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Form Fields Card */}
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
              
              <AnimatePresence mode="wait">
                
                {/* DINE-IN FLOW FIELDS */}
                {orderType === 'Dine In' ? (
                  <motion.div
                    key="dine-in-fields"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-white/5">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">2. Dine-In Specifications</h3>
                      <p className="text-xs text-gray-500 font-medium">Verify your table and contact details for service routing</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="tel" 
                            required
                            placeholder="+94 77 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">Email (Optional)</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="email" 
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-1">Table Number</label>
                      <div className="relative">
                        <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 15"
                          value={table}
                          onChange={(e) => setTable(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-black placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-1">Special Notes for Waiter (Optional)</label>
                      <div className="relative">
                        <ClipboardList className="absolute left-4 top-4 text-gray-500" size={18} />
                        <textarea 
                          rows={3}
                          placeholder="e.g. Allergy details, request silverware, etc."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                        />
                      </div>
                    </div>

                    {table && (
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center flex items-center justify-center gap-3">
                        <span className="text-2xl animate-bounce">🍽️</span>
                        <p className="text-lg font-black text-white uppercase tracking-wide">
                          Dining at Table <span className="text-primary italic">#{table}</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  
                  // DELIVERY FLOW FIELDS
                  <motion.div
                    key="delivery-fields"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-white/5">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">2. Delivery Specifications</h3>
                      <p className="text-xs text-gray-500 font-medium">Please enter valid dispatch and contact details</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="tel" 
                            required
                            placeholder="+94 77 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">Email (Optional)</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="email" 
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-1">Delivery Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-gray-500" size={18} />
                        <textarea 
                          rows={3}
                          required
                          placeholder="Enter your exact street address, building, city"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-1">Landmark (Optional)</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="text" 
                          placeholder="e.g. Near Central Park, opposite the post office"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-1">Special Notes / Driver Instructions (Optional)</label>
                      <div className="relative">
                        <ClipboardList className="absolute left-4 top-4 text-gray-500" size={18} />
                        <textarea 
                          rows={2}
                          placeholder="e.g. Ring bell, leave at gate, keep left at intersection"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Beverages Selection Card */}
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
              
              <div className="pb-4 border-b border-white/5 mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">3. Refreshing Beverages</h3>
                <p className="text-xs text-gray-500 font-medium">Add cold or fresh drinks to your order</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BEVERAGE_MENU.map((bev) => (
                  <div key={bev.name} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{bev.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{bev.name}</p>
                        <p className="text-xs text-primary font-bold">Rs. {bev.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1 border border-white/5">
                      <button
                        type="button"
                        onClick={() => setBeverages(prev => ({ ...prev, [bev.name]: Math.max(0, prev[bev.name] - 1) }))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-black"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-white w-4 text-center">
                        {beverages[bev.name] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBeverages(prev => ({ ...prev, [bev.name]: (prev[bev.name] || 0) + 1 }))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:text-white hover:bg-primary/20 transition-all text-sm font-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Submit Action (Desktop hidden, shown on mobile logic if desired, or centralized) */}
            <button 
              type="submit"
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-[#ca8a04] text-black font-black text-lg flex justify-center items-center gap-3 transition-all shadow-[0_15px_40px_rgba(234,179,8,0.25)] hover:shadow-[0_20px_50px_rgba(234,179,8,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95 uppercase tracking-widest font-sans"
            >
              Place {orderType} Order
              <ArrowRight size={22} strokeWidth={3} className="animate-pulse" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="w-full lg:w-[450px] sticky top-28">
          <div className="glass-panel p-10 rounded-[3rem] bg-[#111] border border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            
            <h2 className="text-2xl font-black mb-8 pb-6 border-b border-white/5 tracking-tight uppercase italic flex justify-between items-center text-white">
              Order Summary
              <span className="text-xs px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-xl not-italic uppercase tracking-widest font-black font-sans">
                {orderType}
              </span>
            </h2>

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto mb-8 pr-2 space-y-4 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4 text-sm font-semibold border-b border-white/[0.03] pb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Qty: <span className="text-primary font-black">{item.quantity}</span> x Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-white font-black text-right shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              {BEVERAGE_MENU.filter(bev => beverages[bev.name] > 0).map(bev => (
                <div key={bev.name} className="flex justify-between items-center gap-4 text-sm font-semibold border-b border-white/[0.03] pb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white truncate">{bev.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Qty: <span className="text-primary font-black">{beverages[bev.name]}</span> x Rs. {bev.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-white font-black text-right shrink-0">
                    Rs. {(bev.price * beverages[bev.name]).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider">
                <span>Food Subtotal</span>
                <span className="text-white">Rs. {foodSubtotal.toLocaleString()}</span>
              </div>
              {beverageSubtotal > 0 && (
                <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider">
                  <span>Beverages Subtotal</span>
                  <span className="text-white">Rs. {beverageSubtotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider">
                <span>Subtotal</span>
                <span className="text-white">Rs. {combinedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider">
                <span>Tax (GST 8%)</span>
                <span className="text-white">Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider italic">
                <span>Delivery Type</span>
                <span className="text-primary font-black uppercase tracking-widest">{orderType}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-wider italic">
                <span>Delivery Charge</span>
                <span className="text-green-500 font-black">FREE</span>
              </div>
            </div>
            
            {/* Total */}
            <div className="border-t border-white/5 pt-8 mb-8">
              <p className="text-[10px] text-gray-500 mb-1 uppercase font-black tracking-[0.2em]">Total Payable</p>
              <p className="text-5xl font-display font-black text-primary tracking-tighter">Rs. {total.toLocaleString()}</p>
            </div>

            {/* Mini Perks */}
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              Leafora Instant Kitchen Sync
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
