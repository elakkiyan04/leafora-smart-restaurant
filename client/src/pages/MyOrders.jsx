import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useUserAuth } from '../context/UserAuthContext';
import { ArrowLeft, Clock, ShoppingBag, ArrowRight, Eye, MapPin, QrCode } from 'lucide-react';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, token } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserOrders = async () => {
      try {
        const response = await api.get('/api/users/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to retrieve order history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user, token, navigate]);

  if (!user) return null;

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge style mapping
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Accepted':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Preparing':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Ready':
        return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'Delivered':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Cancelled':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="pt-20 min-h-[85vh] px-4 max-w-5xl mx-auto pb-16">
      
      {/* Header and Back Link */}
      <div className="mb-10">
        <Link 
          to="/" 
          className="text-gray-400 hover:text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors mb-2 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white">
          My <span className="text-primary">Orders</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Track your pending orders and view your previous dining logs</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4"></div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Loading your luxury orders...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center rounded-[2rem] max-w-md mx-auto">
          <p className="text-red-400 text-sm font-semibold mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary py-3 px-6 text-xs uppercase tracking-widest font-black"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center max-w-md mx-auto p-12 glass-panel rounded-[3rem] bg-[#111] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] pointer-events-none"></div>
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={30} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-bold mb-3 text-white">No orders placed yet</h2>
          <p className="text-gray-400 mb-8 text-xs font-medium leading-relaxed">
            You haven't ordered any delicious meals from Leafora yet. Visit our premium menu and experience luxury dining.
          </p>
          <Link 
            to="/menu" 
            className="px-8 py-3.5 rounded-2xl bg-primary text-black font-black hover:bg-primaryHover transition-all shadow-glow inline-flex items-center gap-2 uppercase text-[10px] tracking-widest"
          >
            Explore Menu
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="glass-panel p-6 md:p-8 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-lg relative overflow-hidden group hover:border-[#eab308]/20 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>

              {/* Order Metadata Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs text-gray-500 font-bold font-mono">ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                    <span className={`text-[10px] px-3 py-1 font-black uppercase tracking-widest rounded-full border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-primary" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {order.orderType === 'Dine In' ? (
                        <>
                          <QrCode size={12} className="text-primary" />
                          Dine In • Table #{order.tableNumber || 'N/A'}
                        </>
                      ) : (
                        <>
                          <MapPin size={12} className="text-primary" />
                          Delivery
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Total Amount</p>
                    <p className="text-2xl font-display font-black text-primary">Rs. {order.totalAmount.toLocaleString()}</p>
                  </div>

                  <Link
                    to={`/order-status/${order._id}`}
                    className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-primary flex items-center justify-center text-gray-300 transition-all group-hover:scale-105"
                    title="Track Live Progress"
                  >
                    <Eye size={18} />
                  </Link>
                </div>
              </div>

              {/* Order Items List */}
              <div className="py-6 border-b border-white/5">
                <p className="text-xs text-gray-500 font-black uppercase tracking-wider mb-4">Items Ordered</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3.5 rounded-2xl text-xs font-bold text-gray-300">
                      <div>
                        <p className="text-white">{item.name}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">Rs. {item.price.toLocaleString()} each</p>
                      </div>
                      <span className="text-[#eab308] bg-[#eab308]/10 px-3 py-1 rounded-xl font-black">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Address or Notes */}
              {(order.address || order.notes) && (
                <div className="pt-6 flex flex-col md:flex-row gap-6 text-xs text-gray-400 font-bold">
                  {order.orderType === 'Delivery' && order.address && (
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1">Delivery Address</p>
                      <p className="text-white font-medium">{order.address}</p>
                      {order.landmark && <p className="text-gray-500 text-[11px] mt-0.5">Landmark: {order.landmark}</p>}
                    </div>
                  )}
                  {order.notes && (
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1">Special Notes</p>
                      <p className="text-gray-300 font-medium italic">"{order.notes}"</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
