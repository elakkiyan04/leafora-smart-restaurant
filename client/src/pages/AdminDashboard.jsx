import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../services/api';
import { 
  LayoutDashboard, Plus, Trash2, Edit, ShoppingBag, 
  DollarSign, QrCode, LogOut, Package, Clock, CheckCircle, XCircle, Menu, X, TrendingUp, Users, BarChart3, Download, Eye, Calendar, CalendarCheck,
  Flame, MapPin, Truck, FileText, Mail
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useReservation } from '../context/ReservationContext';
import { useOrder } from '../context/OrderContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContactMessage, setSelectedContactMessage] = useState(null);
  const navigate = useNavigate();
  
  const { reservations, updateReservationStatus, allocateTable, deleteReservation } = useReservation();
  
  const fetchContactMessages = async () => {
    try {
      const response = await api.get('/api/contact');
      setContactMessages(response.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  useEffect(() => {
    // Check if the user is authenticated as admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      toast.error('Access denied. Please log in.');
      navigate('/admin');
      return;
    }

    fetchContactMessages();
    const interval = setInterval(fetchContactMessages, 4000);

    // Simulate initial data loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  const getFilteredMessages = () => {
    return contactMessages.filter(msg => {
      const searchLower = contactSearch.toLowerCase();
      const fullName = `${msg.firstName} ${msg.lastName}`.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        msg.email.toLowerCase().includes(searchLower) ||
        msg.subject.toLowerCase().includes(searchLower) ||
        msg.message.toLowerCase().includes(searchLower)
      );
    });
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await api.delete(`/api/contact/${id}`);
        if (response.data.success) {
          toast.success('Message deleted successfully');
          setContactMessages(prev => prev.filter(msg => msg._id !== id));
        } else {
          toast.error(response.data.message || 'Failed to delete message');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Server error: unable to delete message');
      }
    }
  };

  // Analytics Dummy Data
  const revenueData = [
    { name: 'Mon', revenue: 45000 },
    { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 48000 },
    { name: 'Thu', revenue: 61000 },
    { name: 'Fri', revenue: 55000 },
    { name: 'Sat', revenue: 67000 },
    { name: 'Sun', revenue: 72000 },
  ];

  const categoryData = [
    { name: 'Burger', value: 40 },
    { name: 'Pizza', value: 30 },
    { name: 'Pasta', value: 20 },
    { name: 'Drinks', value: 10 },
  ];

  const { orders, updateOrderStatus: contextUpdateOrderStatus, deleteOrder } = useOrder();

  const [orderFilter, setOrderFilter] = useState('all');
  const isReservationOrder = (o) => o.orderType === 'Reservation' || !!o.reservationId;
  const isDeliveryOrder = (o) => o.orderType === 'Delivery';
  const isDineInOrder = (o) => !isReservationOrder(o) && !isDeliveryOrder(o);

  const orderCounts = {
    all: orders.length,
    reservation: orders.filter(isReservationOrder).length,
    dinein: orders.filter(isDineInOrder).length,
    delivery: orders.filter(isDeliveryOrder).length
  };

  const getFilteredOrders = () => {
    switch (orderFilter) {
      case 'reservation':
        return orders.filter(isReservationOrder);
      case 'dinein':
        return orders.filter(isDineInOrder);
      case 'delivery':
        return orders.filter(isDeliveryOrder);
      default:
        return orders;
    }
  };

  const stats = { 
    totalItems: 24, 
    totalOrders: orders.length > 2 ? orders.length : 156, 
    totalRevenue: orders.length > 2 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) : 842000 
  };

  const [foods, setFoods] = useState([
    { _id: '1', name: 'Smoky BBQ Burger', price: 1200, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500', description: 'Classic BBQ burger' },
    { _id: '2', name: 'Truffle Pasta', price: 2400, category: 'Pasta', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=500', description: 'Rich truffle pasta' },
    { _id: '3', name: 'Margherita Pizza', price: 1800, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500', description: 'Fresh basil and mozzarella' }
  ]);

  const [tables, setTables] = useState([
    { id: 'T01', status: 'Available', type: 'Local' },
    { id: 'T02', status: 'Available', type: 'Local' },
    { id: 'T03', status: 'Available', type: 'Foreign' },
    { id: 'VIP01', status: 'Available', type: 'VIP' },
    { id: 'VIP02', status: 'Available', type: 'VIP' }
  ]);
  const [qrModalData, setQrModalData] = useState(null);

  const logout = () => {
    localStorage.removeItem('isAdmin');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const updateOrderStatus = (id, status) => {
    contextUpdateOrderStatus(id, status);
    toast.success(`Order marked as ${status}`, {
      icon: (status === 'Delivered' || status === 'Served') ? '✅' : '👨‍🍳'
    });
  };

  const deleteFood = (id) => {
    if (window.confirm('Delete this item?')) {
      setFoods(foods.filter(f => f._id !== id));
      toast.error('Item removed from menu');
    }
  };

  const downloadQR = (tableId, reservationId = '') => {
    const suffix = reservationId ? `-${reservationId}` : '';
    const canvas = document.getElementById(`qr-table-${tableId}${suffix}`);
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `table-${tableId}${suffix}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`QR Code downloaded!`, { icon: '📥' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Accepted': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Preparing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Ready': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Served': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Delivered': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Cancelled': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex custom-scrollbar">
      
      {/* SIDEBAR */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 288 : 96 }}
        className="fixed lg:relative z-50 h-screen bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-white/5"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-12">
            {isSidebarOpen && (
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-black tracking-tighter bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
              >
                LEAFORA
              </motion.h2>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors mx-auto lg:mx-0"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {[
              { id: 'overview', name: 'Overview', icon: LayoutDashboard },
              { id: 'menu', name: 'Food Items', icon: Package },
              { id: 'orders', name: 'Orders', icon: ShoppingBag },
              { id: 'reservations', name: 'Reservations', icon: Calendar },
              { id: 'qr', name: 'QR Table System', icon: QrCode },
              { id: 'contacts', name: 'Contact Messages', icon: Mail },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-glow' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <tab.icon size={22} className={`${activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                {isSidebarOpen && <span className="font-bold tracking-wide">{tab.name}</span>}
              </button>
            ))}
          </nav>

          <button 
            onClick={logout}
            className="mt-auto flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform mx-auto lg:mx-0" />
            {isSidebarOpen && <span className="font-bold">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Admin <span className="text-orange-500">Dashboard</span></h1>
            <p className="text-gray-500 font-medium">Monitoring restaurant performance and orders</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">System Live</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[60vh]"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  {/* STATS CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { name: 'Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, gradient: 'from-emerald-500/20 to-emerald-600/5', color: 'text-emerald-400' },
                      { name: 'Orders', value: stats.totalOrders, icon: ShoppingBag, gradient: 'from-orange-500/20 to-orange-600/5', color: 'text-orange-400' },
                      { name: 'Food Items', value: stats.totalItems, icon: Package, gradient: 'from-blue-500/20 to-blue-600/5', color: 'text-blue-400' },
                    ].map((stat, i) => (
                      <motion.div 
                        whileHover={{ y: -10 }}
                        key={i} 
                        className={`relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br ${stat.gradient} border border-white/5 backdrop-blur-xl shadow-2xl transition-all duration-500`}
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                          <stat.icon size={120} />
                        </div>
                        <div className={`p-4 w-fit rounded-2xl bg-white/5 mb-6 ${stat.color} shadow-inner`}>
                          <stat.icon size={28} />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">{stat.name}</p>
                        <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                          <TrendingUp size={14} />
                          <span>+12.5% this month</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CHARTS SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-3 italic">
                          <BarChart3 className="text-orange-500" size={20} />
                          Revenue Analytics
                        </h3>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                            <Tooltip 
                              contentStyle={{backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff'}}
                              itemStyle={{color: '#f97316'}}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl backdrop-blur-xl">
                      <h3 className="text-xl font-bold mb-8 flex items-center gap-3 italic">
                        <TrendingUp className="text-orange-500" size={20} />
                        Category Popularity
                      </h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                            <Tooltip 
                              cursor={{fill: 'rgba(255,255,255,0.05)'}}
                              contentStyle={{backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px'}}
                            />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#f97316' : '#ffffff10'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* RECENT ORDERS TABLE */}
                  <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-2xl font-black italic">Recent <span className="text-orange-500">Orders</span></h3>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full border-separate border-spacing-y-4">
                        <thead>
                          <tr className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                            <th className="px-6 pb-2 text-left">Order ID</th>
                            <th className="px-6 pb-2 text-left">Customer</th>
                            <th className="px-6 pb-2 text-left">Status</th>
                            <th className="px-6 pb-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id} className="group hover:bg-white/5 transition-all duration-300">
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent rounded-l-3xl border-y border-l border-white/5 font-black text-orange-500">
                                #{order._id}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5">
                                <div className="flex flex-col">
                                  <span className="font-bold text-white">{order.customerName}</span>
                                  <span className="text-xs text-gray-500 italic">{order.email}</span>
                                </div>
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-lg ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent rounded-r-3xl border-y border-r border-white/5 text-right">
                                <span className="text-lg font-black text-white">Rs. {order.totalAmount.toLocaleString()}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'menu' && (
                <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <h3 className="text-3xl font-black mb-2 italic">Manage <span className="text-orange-500">Menu</span></h3>
                      <p className="text-gray-500 text-sm font-medium">Add, update or remove items from your catalog</p>
                    </div>
                    <button className="flex items-center gap-3 py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-glow hover:scale-105 active:scale-95 uppercase text-xs tracking-widest">
                      <Plus size={20} strokeWidth={3} /> Add New Item
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {foods.map(item => (
                      <motion.div 
                        layout
                        key={item._id} 
                        className="group relative bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5 hover:border-orange-500/30 transition-all duration-500 shadow-xl overflow-hidden"
                      >
                        <div className="flex gap-6 relative z-10">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 shadow-2xl border border-white/10 group-hover:rotate-3 transition-transform duration-500">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <h4 className="font-black text-white text-lg truncate group-hover:text-orange-400 transition-colors">{item.name}</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-3">{item.category}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-black text-orange-500 tracking-tighter">Rs. {item.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-6 border-t border-white/5 relative z-10">
                          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                            <Edit size={16} /> Edit
                          </button>
                          <button onClick={() => deleteFood(item._id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/5 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all font-black text-[10px] uppercase tracking-widest">
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

               {activeTab === 'orders' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                    <div>
                      <h3 className="text-3xl font-black mb-2 italic">Manage <span className="text-orange-500">Orders</span></h3>
                      <p className="text-gray-500 text-sm font-medium">Categorized view of reservations, dine-in and delivery orders</p>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-4 pb-4 border-b border-white/5">
                    {[
                      { id: 'all', name: 'All Orders', count: orderCounts.all },
                      { id: 'reservation', name: 'Reservation Orders', count: orderCounts.reservation },
                      { id: 'dinein', name: 'Dine-In Orders', count: orderCounts.dinein },
                      { id: 'delivery', name: 'Delivery Orders', count: orderCounts.delivery },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setOrderFilter(tab.id)}
                        className={`
                          flex items-center gap-3 px-6 py-3 rounded-2xl font-bold tracking-wide transition-all duration-300 text-sm
                          ${orderFilter === tab.id 
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-glow' 
                            : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'}
                        `}
                      >
                        <span>{tab.name}</span>
                        <span className={`
                          px-2 py-0.5 rounded-lg text-xs font-black
                          ${orderFilter === tab.id ? 'bg-black/35 text-white' : 'bg-orange-500/10 text-orange-400'}
                        `}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {getFilteredOrders().length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      <ShoppingBag size={48} className="mx-auto mb-4 opacity-20 text-orange-500 animate-pulse" />
                      <p className="text-lg font-bold">No orders found in this category.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {getFilteredOrders().map(order => (
                        <motion.div 
                          layout
                          key={order._id} 
                          className="p-8 bg-[#0a0a0a] rounded-[3rem] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden group"
                        >
                          <div className="flex justify-between items-start relative z-10">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-orange-500 font-black text-2xl tracking-tighter">#{order._id}</h4>
                                <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-lg ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-400 font-bold flex-wrap">
                                <p className="flex items-center gap-2 text-xs"><Users size={14} /> {order.customerName}</p>
                                {isReservationOrder(order) ? (
                                  <p className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg border border-yellow-500/20 text-xs font-black uppercase tracking-widest">
                                    <Calendar size={14} /> Reservation
                                  </p>
                                ) : isDeliveryOrder(order) ? (
                                  <p className="flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg border border-amber-500/20 text-xs font-black uppercase tracking-widest animate-pulse">
                                    <Truck size={14} /> Delivery
                                  </p>
                                ) : (
                                  <p className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 text-xs font-black uppercase tracking-widest">
                                    <QrCode size={14} /> Dine-In
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-black text-white tracking-tighter">Rs. {order.totalAmount.toLocaleString()}</p>
                              <p className="text-gray-600 text-[10px] font-black mt-1 uppercase tracking-widest italic opacity-60">Digital Payment</p>
                            </div>
                          </div>

                          {/* Reservation Details */}
                          {isReservationOrder(order) && (
                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] text-xs space-y-2 font-medium text-gray-400 relative z-10 shadow-inner">
                              <p className="text-gray-200 font-black uppercase tracking-wider text-[10px] mb-1.5 text-yellow-500 flex items-center gap-1.5">
                                <Calendar size={12} /> Reservation Details:
                              </p>
                              <p><span className="text-gray-500 font-bold">Reservation ID:</span> <span className="text-yellow-500 font-black">#{order.reservationId || 'N/A'}</span></p>
                              <p><span className="text-gray-500 font-bold">Allocated Table:</span> <span className="text-gray-300">#{order.table || 'N/A'}</span></p>
                              <p><span className="text-gray-500 font-bold">Customer:</span> <span className="text-gray-300">{order.customerName}</span></p>
                              <p><span className="text-gray-500 font-bold">Phone:</span> <span className="text-gray-300">{order.phone || 'N/A'}</span></p>
                              {order.notes && <p><span className="text-gray-500 font-bold">Special Notes:</span> <span className="italic text-gray-300">"{order.notes}"</span></p>}
                            </div>
                          )}

                          {/* Dine-In Details */}
                          {isDineInOrder(order) && (
                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] text-xs space-y-2 font-medium text-gray-400 relative z-10 shadow-inner">
                              <p className="text-gray-200 font-black uppercase tracking-wider text-[10px] mb-1.5 text-orange-500 flex items-center gap-1">
                                <FileText size={12} /> Dine-In Details:
                              </p>
                              <p><span className="text-gray-500 font-bold">Table Number:</span> <span className="text-gray-300">#{order.table || 'N/A'}</span></p>
                              <p><span className="text-gray-500 font-bold">Customer:</span> <span className="text-gray-300">{order.customerName}</span></p>
                              <p><span className="text-gray-500 font-bold">Phone:</span> <span className="text-gray-300">{order.phone || 'N/A'}</span></p>
                              {order.notes && <p><span className="text-gray-500 font-bold">Special Notes:</span> <span className="italic text-gray-300">"{order.notes}"</span></p>}
                            </div>
                          )}

                          {/* Delivery Details */}
                          {isDeliveryOrder(order) && (
                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] text-xs space-y-2 font-medium text-gray-400 relative z-10 shadow-inner">
                              <p className="text-gray-200 font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-amber-500">
                                <MapPin size={12} /> Delivery Details:
                              </p>
                              <p><span className="text-gray-500 font-bold">Customer:</span> <span className="text-gray-300">{order.customerName}</span></p>
                              <p><span className="text-gray-500 font-bold">Contact Phone:</span> <span className="text-gray-300">{order.phone || 'N/A'}</span></p>
                              <p><span className="text-gray-500 font-bold">Delivery Address:</span> <span className="text-gray-300">{order.address || 'N/A'}</span></p>
                              {order.landmark && <p><span className="text-gray-500 font-bold">Landmark:</span> <span className="text-gray-300">{order.landmark}</span></p>}
                              {order.notes && <p><span className="text-gray-500 font-bold">Driver Notes:</span> <span className="italic text-gray-300">"{order.notes}"</span></p>}
                            </div>
                          )}

                          <div className="bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 relative z-10">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Order Items</p>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-300 font-bold"><span className="text-orange-500 font-black">{item.quantity}x</span> {item.name}</span>
                                  <span className="text-gray-500 font-black">Rs. {(item.quantity * item.price).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Premium Workflow Status Transition Controls */}
                          <div className="flex gap-3 pt-2 relative z-10 flex-wrap sm:flex-nowrap">
                            {isReservationOrder(order) ? (
                              // QR Table Order Flow: Pending -> Preparing -> Ready -> Served
                              <>
                                {(order.status === 'Pending' || order.status === 'Accepted') && (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, 'Preparing')} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <Flame size={14} /> Start Preparing
                                  </button>
                                )}
                                {order.status === 'Preparing' && (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, 'Ready')} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20 hover:bg-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <CheckCircle size={14} /> Mark Ready
                                  </button>
                                )}
                                {order.status === 'Ready' && (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, 'Served')} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <CheckCircle size={14} /> Mark Served
                                  </button>
                                )}
                                {order.status === 'Served' && (
                                  <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/5 text-emerald-400/60 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                                    <CheckCircle size={14} /> Order Served
                                  </div>
                                )}
                              </>
                            ) : (
                              // Regular Order Flow
                              <>
                                {order.status === 'Pending' && (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, 'Accepted')} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 hover:bg-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <CheckCircle size={14} /> Accept Order
                                  </button>
                                )}
                                {order.status === 'Accepted' && (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, 'Preparing')} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <Flame size={14} /> Start Preparing
                                  </button>
                                )}
                                {order.status === 'Preparing' && (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, 'Ready')} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20 hover:bg-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    {isDineInOrder(order) ? <CheckCircle size={14} /> : <Truck size={14} />}
                                    {isDineInOrder(order) ? 'Mark Ready' : 'Dispatch Rider'}
                                  </button>
                                )}
                                {order.status === 'Ready' && (
                                  <button 
                                    onClick={() => updateOrderStatus(order._id, 'Delivered')} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    <CheckCircle size={14} /> Complete Order
                                  </button>
                                )}
                                {order.status === 'Delivered' && (
                                  <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/5 text-emerald-400/60 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                                    <CheckCircle size={14} /> Order Fulfilled
                                  </div>
                                )}
                              </>
                            )}
                            
                            <button 
                              onClick={() => { if(confirm('Cancel and remove this order?')) { deleteOrder(order._id); toast.error('Order deleted'); } }} 
                              className="py-3 px-4 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500/15 text-[10px] font-black uppercase tracking-widest border border-rose-500/10 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reservations' && (
                <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <h3 className="text-3xl font-black mb-2 italic">Booked <span className="text-orange-500">Reservations</span></h3>
                      <p className="text-gray-500 text-sm font-medium">Manage and track guest dining experiences & customized menus</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto custom-scrollbar">
                    {reservations.length === 0 ? (
                      <div className="text-center py-20 text-gray-500">
                        <Calendar size={48} className="mx-auto mb-4 opacity-20 text-orange-500" />
                        <p className="text-lg font-bold">No reservations found.</p>
                      </div>
                    ) : (
                      <table className="w-full border-separate border-spacing-y-4">
                        <thead>
                          <tr className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                            <th className="px-6 pb-2 text-left">Res ID</th>
                            <th className="px-6 pb-2 text-left">Customer</th>
                            <th className="px-6 pb-2 text-left">Contact Info</th>
                            <th className="px-6 pb-2 text-left">Date & Time</th>
                            <th className="px-6 pb-2 text-left">Guests</th>
                            <th className="px-6 pb-2 text-left">Experience</th>
                            <th className="px-6 pb-2 text-left">Table Allocation</th>
                            <th className="px-6 pb-2 text-left">Status</th>
                            <th className="px-6 pb-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((res) => (
                            <tr key={res.id} className="group hover:bg-white/5 transition-all duration-300">
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent rounded-l-3xl border-y border-l border-white/5 font-black text-orange-500">
                                #{res.id}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 font-bold text-white">
                                {res.customerName}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 text-gray-400 text-sm">
                                <div className="flex flex-col">
                                  <span className="font-semibold">{res.email}</span>
                                  <span className="text-xs text-gray-500 italic font-medium">{res.phone}</span>
                                </div>
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 text-gray-300 font-medium">
                                <div className="flex flex-col">
                                  <span>{res.date}</span>
                                  <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">{res.time}</span>
                                </div>
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 text-gray-300 font-semibold">
                                {res.guests}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-md ${
                                  res.tableType === 'VIP' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 
                                  res.tableType === 'Local' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 
                                  'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                }`}>
                                  {res.tableType}
                                </span>
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5">
                                {res.status === 'Confirmed' ? (
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={res.allocatedTable || ''}
                                      onChange={(e) => {
                                        allocateTable(res.id, e.target.value || null);
                                        toast.success(e.target.value ? `Table ${e.target.value} allocated!` : 'Table deallocated');
                                      }}
                                      className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                                    >
                                      <option value="">Select Table...</option>
                                      {tables.map(t => (
                                        <option key={t.id} value={t.id}>{t.id} ({t.type})</option>
                                      ))}
                                    </select>
                                    {res.allocatedTable && (
                                      <button
                                        onClick={() => setQrModalData({
                                          tableId: res.allocatedTable,
                                          reservationId: res.id,
                                          guestName: res.customerName
                                        })}
                                        className="p-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl hover:bg-orange-500/20 transition-all"
                                        title="View QR Code"
                                      >
                                        <QrCode size={14} />
                                      </button>
                                    )}
                                  </div>
                                ) : res.status === 'Pending' ? (
                                  <span className="text-xs text-gray-600 font-medium italic">Pending Approval</span>
                                ) : (
                                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{res.status}</span>
                                )}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5">
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                  res.status === 'Confirmed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                                  res.status === 'Cancelled' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 
                                  res.status === 'Completed' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 
                                  res.status === 'Expired' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : 
                                  'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                                }`}>
                                  {res.status}
                                </span>
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent rounded-r-3xl border-y border-r border-white/5 text-right">
                                <div className="flex gap-2 justify-end">
                                  {res.status === 'Pending' && (
                                    <button 
                                      onClick={() => {
                                        updateReservationStatus(res.id, 'Confirmed');
                                        toast.success(`Reservation ${res.id} Confirmed!`, { icon: '✅' });
                                      }}
                                      className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                      title="Approve Reservation"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                  )}
                                  {res.status === 'Confirmed' && (
                                    <button 
                                      onClick={() => {
                                        updateReservationStatus(res.id, 'Completed');
                                        toast.success(`Reservation ${res.id} Completed!`, { icon: '🍽️' });
                                      }}
                                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                                      title="Mark as Completed"
                                    >
                                      <CalendarCheck size={16} />
                                    </button>
                                  )}
                                  {(res.status === 'Pending' || res.status === 'Confirmed') && (
                                    <button 
                                      onClick={() => {
                                        updateReservationStatus(res.id, 'Cancelled');
                                        toast.error(`Reservation ${res.id} Cancelled!`, { icon: '❌' });
                                      }}
                                      className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                                      title="Cancel Reservation"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      if(confirm('Delete this reservation completely?')) {
                                        deleteReservation(res.id);
                                        toast.error('Reservation deleted');
                                      }
                                    }}
                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    title="Delete Record"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'qr' && (
                <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <h3 className="text-3xl font-black mb-2 italic">Smart QR <span className="text-orange-500">Table System</span></h3>
                      <p className="text-gray-500 text-sm font-medium">Generate and manage digital ordering points</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="py-4 px-8 bg-white/5 border border-white/10 rounded-2xl text-white font-black hover:bg-white/10 transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <Download size={18} /> Bulk Print
                      </button>
                      <button className="py-4 px-8 bg-orange-500 text-white font-black rounded-2xl shadow-glow transition-all hover:scale-105 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <Plus size={18} /> Add Table
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tables.map(table => {
                      const allocatedRes = reservations.find(r => r.allocatedTable === table.id && r.status === 'Confirmed');
                      const statusLabel = allocatedRes ? 'Reserved' : 'Available';
                      const statusClass = allocatedRes 
                        ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' 
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                      
                      const qrValue = allocatedRes 
                        ? `${window.location.origin}/qr-landing?table=${table.id}&reservation=${allocatedRes.id}`
                        : `${window.location.origin}/qr-landing?table=${table.id}`;
                      
                      const qrCanvasId = `qr-table-${table.id}-${allocatedRes ? allocatedRes.id : 'nores'}`;

                      return (
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          key={table.id} 
                          className="p-8 glass-card border-white/5 bg-white/[0.02] rounded-[3rem] relative group hover:border-orange-500/30 transition-all duration-500 flex flex-col items-center text-center shadow-2xl"
                        >
                          <div className="absolute top-6 right-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </div>

                          <div className="mb-6 mt-4">
                            <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                              <QrCode size={40} />
                            </div>
                            <h4 className="text-3xl font-black mb-1">Table {table.id}</h4>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                              table.type === 'VIP' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                              table.type === 'Foreign' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              'bg-white/10 text-gray-400'
                            }`}>
                              {table.type} Experience
                            </span>
                          </div>

                          {/* Guest Name if allocated */}
                          <div className="mb-4 h-12 flex flex-col justify-center">
                            {allocatedRes ? (
                              <>
                                <p className="text-sm font-bold text-white truncate max-w-[180px]">{allocatedRes.customerName}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Res: #{allocatedRes.id}</p>
                              </>
                            ) : (
                              <p className="text-xs text-gray-600 font-semibold italic">No Active Reservation</p>
                            )}
                          </div>

                          <div className="bg-white p-4 rounded-[2.5rem] mb-8 group-hover:rotate-3 transition-transform duration-500 shadow-2xl relative overflow-hidden">
                            <QRCodeCanvas 
                              id={qrCanvasId}
                              value={qrValue}
                              size={140}
                              level={"H"}
                              includeMargin={false}
                            />
                            <div 
                              onClick={() => {
                                setQrModalData({
                                  tableId: table.id,
                                  reservationId: allocatedRes ? allocatedRes.id : 'nores',
                                  guestName: allocatedRes ? allocatedRes.customerName : 'Walk-in Guest'
                                });
                              }}
                              className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
                            >
                              <Eye className="text-orange-500" size={32} />
                            </div>
                          </div>

                          <div className="w-full space-y-4">
                            <p className="text-[10px] font-mono text-gray-500 bg-black/40 py-2 px-4 rounded-xl truncate font-black">
                              {allocatedRes ? `Landing Page QR Locked` : `Default Table QR`}
                            </p>
                            <div className="grid grid-cols-2 gap-3 w-full">
                              <button 
                                onClick={() => {
                                  setQrModalData({
                                    tableId: table.id,
                                    reservationId: allocatedRes ? allocatedRes.id : 'nores',
                                    guestName: allocatedRes ? allocatedRes.customerName : 'Walk-in Guest'
                                  });
                                }}
                                className="py-3 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => downloadQR(table.id, allocatedRes ? allocatedRes.id : 'nores')}
                                className="py-3 rounded-2xl bg-orange-500/10 text-orange-500 font-black text-[10px] uppercase tracking-widest border border-orange-500/20 hover:bg-orange-500/20 transition-all shadow-glow"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <h3 className="text-3xl font-black mb-2 italic">📩 Contact <span className="text-orange-500">Messages</span></h3>
                      <p className="text-gray-500 text-sm font-medium">Read and manage inquiries sent from the Contact Us page</p>
                    </div>
                    
                    <div className="w-full md:w-80">
                      <input
                        type="text"
                        placeholder="Search messages..."
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all font-medium placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {getFilteredMessages().length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      <Mail size={48} className="mx-auto mb-4 opacity-20 text-orange-500" />
                      <p className="text-lg font-bold">No messages found.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full border-separate border-spacing-y-4">
                        <thead>
                          <tr className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                            <th className="px-6 pb-2 text-left">Full Name</th>
                            <th className="px-6 pb-2 text-left">Email Address</th>
                            <th className="px-6 pb-2 text-left">Subject</th>
                            <th className="px-6 pb-2 text-left">Message</th>
                            <th className="px-6 pb-2 text-left">Date & Time</th>
                            <th className="px-6 pb-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredMessages().map((msg) => (
                            <tr key={msg._id} className="group hover:bg-white/5 transition-all duration-300">
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent rounded-l-3xl border-y border-l border-white/5 font-bold text-white">
                                {msg.firstName} {msg.lastName}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 text-gray-300 font-medium">
                                <a href={`mailto:${msg.email}`} className="hover:text-orange-500 transition-colors">{msg.email}</a>
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 text-orange-400 font-bold">
                                {msg.subject}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 text-gray-400 text-sm max-w-[200px] truncate">
                                {msg.message}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent border-y border-white/5 text-gray-400 text-xs">
                                {new Date(msg.createdAt).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </td>
                              <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-transparent rounded-r-3xl border-y border-r border-white/5 text-right">
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() => setSelectedContactMessage(msg)}
                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    title="View Full Message"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(msg._id)}
                                    className="p-2 rounded-lg bg-rose-500/5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all"
                                    title="Delete Message"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PREMIUM QR MODAL OVERLAY */}
      <AnimatePresence>
        {qrModalData && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
              onClick={() => setQrModalData(null)}
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              className="fixed top-1/2 left-1/2 z-[101] w-full max-w-md bg-[#0a0a0a] border border-orange-500/30 rounded-[3rem] p-8 text-center shadow-2xl"
            >
              <button 
                onClick={() => setQrModalData(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                <QrCode size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2 text-white">Table QR Code</h3>
              <p className="text-orange-500 font-bold uppercase tracking-widest text-[11px] mb-6">
                Table {qrModalData.tableId} {qrModalData.reservationId !== 'nores' && `• Res #${qrModalData.reservationId}`}
              </p>
              <div className="bg-white p-5 rounded-[2.5rem] w-fit mx-auto mb-6 shadow-2xl relative">
                <QRCodeCanvas 
                  id={`qr-table-${qrModalData.tableId}-${qrModalData.reservationId}`}
                  value={
                    qrModalData.reservationId !== 'nores'
                      ? `${window.location.origin}/qr-landing?table=${qrModalData.tableId}&reservation=${qrModalData.reservationId}`
                      : `${window.location.origin}/qr-landing?table=${qrModalData.tableId}`
                  }
                  size={200}
                  level={"H"}
                  includeMargin={false}
                />
              </div>
              <p className="text-gray-400 text-xs font-semibold mb-8 max-w-xs mx-auto">
                {qrModalData.reservationId !== 'nores' ? (
                  <>Assigned to <span className="text-white font-bold">{qrModalData.guestName}</span>. Scan this code at the table to launch the smart dining experience.</>
                ) : (
                  <>Default QR for Table {qrModalData.tableId}. Assign a confirmed reservation in the bookings tab to lock this table.</>
                )}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setQrModalData(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => downloadQR(qrModalData.tableId, qrModalData.reservationId)}
                  className="flex-1 py-3.5 rounded-2xl bg-orange-500 text-black font-black text-xs uppercase tracking-widest transition-all shadow-glow hover:scale-105"
                >
                  Download PNG
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CONTACT MESSAGE DETAILS MODAL */}
      <AnimatePresence>
        {selectedContactMessage && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedContactMessage(null)}
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              className="fixed top-1/2 left-1/2 z-[101] w-full max-w-lg bg-[#0a0a0a] border border-orange-500/30 rounded-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedContactMessage(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
              
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 border border-orange-500/20">
                <Mail size={32} />
              </div>
              
              <h3 className="text-2xl font-black mb-1 text-white">Contact Message</h3>
              <p className="text-orange-500 font-bold uppercase tracking-widest text-[11px] mb-6">
                Inquiry Details
              </p>
              
              <div className="space-y-6 text-left">
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-white font-bold text-base">{selectedContactMessage.firstName} {selectedContactMessage.lastName}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-white font-bold">
                      <a href={`mailto:${selectedContactMessage.email}`} className="text-orange-400 hover:underline">
                        {selectedContactMessage.email}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Subject</p>
                    <p className="text-orange-500 font-black tracking-wide">{selectedContactMessage.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Received At</p>
                    <p className="text-gray-300 font-medium">
                      {new Date(selectedContactMessage.createdAt).toLocaleString(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Message</p>
                  <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedContactMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => {
                    handleDeleteMessage(selectedContactMessage._id);
                    setSelectedContactMessage(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setSelectedContactMessage(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-orange-500 text-black font-black text-xs uppercase tracking-widest transition-all shadow-glow hover:scale-105"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
