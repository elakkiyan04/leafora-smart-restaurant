import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { motion } from 'framer-motion';
import { 
  Clock, Flame, Truck, CheckCircle2, ChevronRight, 
  ArrowLeft, ShoppingBag, MapPin, QrCode, Phone, User, Info, FileText 
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderStatus = () => {
  const { orderId } = useParams();
  const { orders, updateOrderStatus } = useOrder();
  const [estimatedTime, setEstimatedTime] = useState(25); // 25 mins initial estimate

  const order = orders.find(o => o._id === orderId);

  // Status mapping and configuration
  const statusSteps = [
    { 
      key: 'Pending', 
      label: 'Order Placed', 
      desc: 'Awaiting kitchen confirmation', 
      icon: Clock,
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    },
    { 
      key: 'Accepted', 
      label: 'Accepted', 
      desc: 'Order confirmed by restaurant', 
      icon: CheckCircle2,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    { 
      key: 'Preparing', 
      label: 'Preparing', 
      desc: 'Chef is crafting your dish', 
      icon: Flame,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    { 
      key: 'Ready', 
      label: order?.orderType === 'Dine In' ? 'Ready to Serve' : 'Out for Delivery', 
      desc: order?.orderType === 'Dine In' ? 'Food is prepared and coming hot' : 'Rider is on the way', 
      icon: order?.orderType === 'Dine In' ? QrCode : Truck,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    },
    { 
      key: 'Delivered', 
      label: order?.orderType === 'Dine In' ? 'Served' : 'Delivered', 
      desc: 'Bon appétit!', 
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  // Helper to determine active index
  const getActiveStepIndex = (status) => {
    const idx = statusSteps.findIndex(step => step.key === status);
    return idx === -1 ? 0 : idx;
  };

  const activeIndex = order ? getActiveStepIndex(order.status) : 0;

  // Simulate auto-progressing kitchen order for premium demo purposes
  useEffect(() => {
    if (!order) return;

    // Simulate cooking time adjustments
    if (order.status === 'Accepted') {
      setEstimatedTime(20);
    } else if (order.status === 'Preparing') {
      setEstimatedTime(12);
    } else if (order.status === 'Ready') {
      setEstimatedTime(4);
    } else if (order.status === 'Delivered') {
      setEstimatedTime(0);
    }

    // Auto progress simulation (only runs to show the live workflow if you aren't in admin dashboard)
    const interval = setInterval(() => {
      if (order.status === 'Pending') {
        updateOrderStatus(order._id, 'Accepted');
        toast('Kitchen has accepted your order!', { icon: '🤝' });
      } else if (order.status === 'Accepted') {
        updateOrderStatus(order._id, 'Preparing');
        toast('Chef started preparing your meal.', { icon: '👨‍🍳' });
      } else if (order.status === 'Preparing') {
        updateOrderStatus(order._id, 'Ready');
        toast(order.orderType === 'Dine In' ? 'Food is ready and being served!' : 'Rider has picked up your order!', { icon: '🛵' });
      } else if (order.status === 'Ready') {
        updateOrderStatus(order._id, 'Delivered');
        toast(order.orderType === 'Dine In' ? 'Served! Enjoy your meal!' : 'Delivered successfully! Enjoy your meal!', { icon: '🍽️' });
      }
    }, 45000); // Progresses every 45 seconds for active testing

    return () => clearInterval(interval);
  }, [order, updateOrderStatus]);

  // Handle immediate manual trigger for demonstration testing
  const handleQuickAdvance = () => {
    if (!order) return;
    if (order.status === 'Pending') {
      updateOrderStatus(order._id, 'Accepted');
      toast.success('Accepted order!');
    } else if (order.status === 'Accepted') {
      updateOrderStatus(order._id, 'Preparing');
      toast.success('Cooking started...');
    } else if (order.status === 'Preparing') {
      updateOrderStatus(order._id, 'Ready');
      toast.success(order.orderType === 'Dine In' ? 'Ready to serve!' : 'Dispatched to rider!');
    } else if (order.status === 'Ready') {
      updateOrderStatus(order._id, 'Delivered');
      toast.success(order.orderType === 'Dine In' ? 'Order served at table!' : 'Marked as Delivered!');
    } else {
      updateOrderStatus(order._id, 'Pending');
      toast.success('Reset order status to Pending.');
    }
  };

  if (!order) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-10 glass-panel rounded-[3rem] bg-[#111] border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4">Order Not Found</h2>
          <p className="text-gray-400 mb-8 font-medium">
            We couldn't locate any record for Order #{orderId}. It might have been cleared or the link is expired.
          </p>
          <Link 
            to="/menu" 
            className="px-8 py-3.5 rounded-2xl bg-primary text-black font-black hover:bg-primaryHover transition-all shadow-glow inline-flex items-center gap-2 uppercase text-xs tracking-widest"
          >
            Explore Menu
            <ArrowLeft size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen px-4 lg:px-8 max-w-[1200px] mx-auto pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <Link 
            to="/menu" 
            className="text-gray-400 hover:text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors mb-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Menu
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white">
              Track Order <span className="text-primary font-mono">#{order._id}</span>
            </h1>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-gray-300 uppercase tracking-widest">
              {order.orderType}
            </span>
          </div>
        </div>

        {/* Demo Fast-Forward Control */}
        <button 
          onClick={handleQuickAdvance}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary transition-all shadow-md active:scale-95"
          title="Demo Mode: Advance Status"
        >
          <Flame size={12} className="animate-pulse" />
          Demo: Advance Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Status Flow Tracker (2 Columns Spanning) */}
        <div className="lg:col-span-2 space-y-8 w-full">
          
          {/* Main Status Timeline Card */}
          <div className="glass-panel p-8 md:p-10 rounded-[3rem] bg-[#111] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
            
            {/* Live Timer / Arrival Notice */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-white/5 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Estimated Ready / Arrival</p>
                {estimatedTime > 0 ? (
                  <h2 className="text-4xl font-display font-black text-primary tracking-tight">
                    {estimatedTime} <span className="text-lg font-sans font-medium text-white italic">minutes</span>
                  </h2>
                ) : (
                  <h2 className="text-4xl font-display font-black text-green-500 tracking-tight">
                    Order Served!
                  </h2>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full bg-green-500 animate-ping`}></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                  Syncing live with kitchen
                </span>
              </div>
            </div>

            {/* Vertical/Horizontal Timeline Flow */}
            <div className="relative flex flex-col md:flex-row justify-between items-stretch md:items-start gap-8 md:gap-4 py-4">
              
              {/* Connecting Progress Bar Background */}
              <div className="absolute left-[24px] md:left-4 md:right-4 top-8 bottom-8 md:bottom-auto md:h-1 bg-white/5 -z-10 rounded-full"></div>
              
              {/* Active Progress Bar Highlight */}
              <div 
                className="absolute left-[24px] md:left-4 -z-10 rounded-full transition-all duration-1000 bg-gradient-to-r from-primary to-orange-500"
                style={{
                  top: '2rem',
                  // Mobile vertical height styling
                  height: window.innerWidth < 768 ? `${(activeIndex / 4) * 80}%` : '4px',
                  bottom: window.innerWidth < 768 ? 'auto' : 'auto',
                  // Desktop horizontal width styling
                  width: window.innerWidth >= 768 ? `${(activeIndex / 4) * 94}%` : '4px',
                }}
              ></div>

              {/* Status Nodes */}
              {statusSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isCompleted = idx < activeIndex;
                const isActive = idx === activeIndex;
                const isUpcoming = idx > activeIndex;

                return (
                  <div 
                    key={step.key} 
                    className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 text-left md:text-center relative z-10 flex-1"
                  >
                    {/* Node Circle */}
                    <div 
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0 ${
                        isCompleted 
                          ? 'bg-primary border-primary text-black shadow-glow' 
                          : isActive 
                            ? 'bg-black border-primary text-primary shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-pulse scale-110' 
                            : 'bg-[#151515] border-white/10 text-gray-600'
                      }`}
                    >
                      <IconComponent size={20} className={isActive ? 'animate-spin' : ''} />
                    </div>

                    {/* Node Texts */}
                    <div className="py-1 md:py-0">
                      <h4 className={`text-sm font-black uppercase tracking-wider ${
                        isActive ? 'text-primary' : isCompleted ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </h4>
                      <p className={`text-[10px] italic font-medium leading-relaxed mt-0.5 max-w-[150px] ${
                        isActive ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Delivery Details Details Card */}
          <div className="glass-panel p-8 md:p-10 rounded-[3rem] bg-[#111] border border-white/5 shadow-xl relative overflow-hidden">
            <h3 className="text-base font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Routing and Dispatch Info
            </h3>

            {order.orderType === 'Dine In' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                      <QrCode size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Service Table</p>
                      <p className="font-black text-white text-base">Table #{order.table}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Guest Reference</p>
                      <p className="font-bold text-white">{order.customerName}</p>
                    </div>
                  </div>

                  {order.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Contact Phone</p>
                        <p className="font-bold text-white">{order.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 self-start">
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Info size={12} /> Dine-In Order Notice
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    "Dining at Table {order.table}. Our serving staff will run items to you directly as soon as the kitchen bell rings."
                  </p>
                  {order.notes && (
                    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
                      <span className="font-bold text-gray-400 block mb-0.5">Special Instructions:</span>
                      {order.notes}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Customer Name</p>
                      <p className="font-black text-white">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Contact Phone</p>
                      <p className="font-bold text-white">{order.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Delivery Address</p>
                      <p className="font-bold text-white text-xs leading-relaxed max-w-xs">{order.address}</p>
                    </div>
                  </div>

                  {order.landmark && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Landmark</p>
                        <p className="font-bold text-white text-xs leading-relaxed max-w-xs">{order.landmark}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2">Driver notes & request details</p>
                    {order.notes ? (
                      <p className="text-xs text-gray-400 italic leading-relaxed">"{order.notes}"</p>
                    ) : (
                      <p className="text-xs text-gray-500 italic leading-relaxed">No special dispatch instructions left.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Items Summary Card */}
        <div className="w-full space-y-6">
          
          <div className="glass-panel p-8 rounded-[3rem] bg-[#111] border border-white/10 shadow-2xl relative overflow-hidden">
            <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-6 pb-4 border-b border-white/5">
              Ordered Items
            </h3>

            {/* List of items */}
            <div className="space-y-4 pr-1 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm font-semibold border-b border-white/[0.02] pb-3">
                  <div>
                    <p className="text-white font-bold">{item.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">
                      Qty: <span className="text-primary font-black">{item.quantity}</span> x Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-white font-black">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal, tax, delivery types */}
            <div className="space-y-3 pt-2 mb-6 text-xs font-bold uppercase tracking-wider text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">Rs. {(order.totalAmount / 1.08).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST 8%)</span>
                <span className="text-white">Rs. {(order.totalAmount - (order.totalAmount / 1.08)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery charge</span>
                <span className="text-green-500">FREE</span>
              </div>
            </div>

            {/* Total Paid */}
            <div className="border-t border-white/5 pt-6 text-left">
              <p className="text-[10px] text-gray-500 mb-0.5 uppercase font-black tracking-wider">Total Settled</p>
              <p className="text-4xl font-display font-black text-primary tracking-tighter">Rs. {order.totalAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Need help? Contact Reception at +94 11 234 5678
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderStatus;
