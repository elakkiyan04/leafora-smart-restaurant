import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Clock, CheckCircle, Flame, Sparkles, MapPin, 
  ArrowLeft, Utensils, ShieldCheck, Heart 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useReservation } from '../context/ReservationContext';
import QrAccessRestriction from '../components/QrAccessRestriction';

const SmartOrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { reservations } = useReservation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restrictionStatus, setRestrictionStatus] = useState(null);

  // Poll order status every 3 seconds
  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        if (active) {
          setOrder(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching order status:', err);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  // Validate reservation status
  useEffect(() => {
    if (!loading && order && order.reservationId) {
      const foundRes = reservations.find(r => r.id === order.reservationId);
      if (foundRes) {
        if (foundRes.status === 'Completed' || foundRes.status === 'Cancelled' || foundRes.status === 'Expired') {
          setRestrictionStatus(foundRes.status);
        } else {
          setRestrictionStatus(null);
        }
      }
    }
  }, [order, reservations, loading]);

  if (restrictionStatus) {
    return <QrAccessRestriction status={restrictionStatus} />;
  }

  // Map database status list to the target UI status list: Pending -> Preparing -> Ready -> Served
  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Pending':
      case 'Accepted':
        return 0; // Pending / Accepted
      case 'Preparing':
        return 1; // Preparing
      case 'Ready':
        return 2; // Ready
      case 'Delivered':
      case 'Served':
        return 3; // Served / Delivered
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'Pending', desc: 'Sent to Kitchen', icon: Clock, color: 'text-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
    { title: 'Preparing', desc: 'Chef Crafting', icon: Flame, color: 'text-orange-500', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
    { title: 'Ready', desc: 'Plated & Ready', icon: Utensils, color: 'text-yellow-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
    { title: 'Served', desc: 'At Your Table', icon: CheckCircle, color: 'text-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' }
  ];

  const currentStep = getActiveStepIndex(order?.status);

  // Informative status headers
  const statusHeaders = [
    {
      title: 'Order Placed',
      desc: 'Our culinary crew is reviewing your order selection. It will be sent to the chef station shortly.',
      emoji: '⏳'
    },
    {
      title: 'Chef is Preparing',
      desc: 'Your dishes are currently sizzled and seasoned to perfection. Aromas are filling the kitchen!',
      emoji: '👨‍🍳'
    },
    {
      title: 'Dishes are Ready!',
      desc: 'Plating is complete and your meal is at the pass. Our service staff is bringing it to your table.',
      emoji: '✨'
    },
    {
      title: 'Served & Ready!',
      desc: 'Your dishes have been served at your table. Bon appétit and enjoy your dining experience at Leafora!',
      emoji: '🍽️'
    }
  ];

  const headerInfo = statusHeaders[currentStep] || statusHeaders[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] animate-pulse">
            Connecting to Kitchen Sync...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-12 flex flex-col items-center justify-center font-sans relative">
      <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-xl w-full">
        {/* Back navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-yellow-500 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </button>

        {/* Live status card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Top light glow bar */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
            currentStep === 3 ? 'from-emerald-500 to-emerald-600' :
            currentStep === 2 ? 'from-yellow-400 to-yellow-500' :
            currentStep === 1 ? 'from-orange-500 to-orange-600' :
            'from-amber-500 to-amber-600'
          }`}></div>

          <div className="text-5xl mb-6">{headerInfo.emoji}</div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 mb-2 block flex justify-center items-center gap-1">
            <Sparkles size={12} className="animate-spin" /> Live Order Tracking
          </span>
          <h2 className="text-3xl font-serif font-black tracking-tight mb-3 text-white italic">
            {headerInfo.title}
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed font-medium mb-10 max-w-sm mx-auto">
            {headerInfo.desc}
          </p>

          {/* PROGRESS TIMELINE TRACKER */}
          <div className="relative flex justify-between items-start mb-10 px-2">
            {/* Background Line */}
            <div className="absolute top-7 left-8 right-8 h-0.5 bg-white/5 -z-0"></div>
            {/* Active filled line */}
            <div 
              className="absolute top-7 left-8 h-0.5 bg-yellow-500 -z-0 transition-all duration-700" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 82}%` }}
            ></div>

            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;

              return (
                <div key={idx} className="flex flex-col items-center relative z-10 w-16 text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    isCompleted ? 'bg-yellow-500 border-yellow-500 text-black' :
                    isActive ? `bg-black border-yellow-500 ${step.color} ${step.glow} scale-110` :
                    'bg-white/[0.02] border-white/5 text-gray-600'
                  }`}>
                    <StepIcon size={20} strokeWidth={2.5} className={isActive ? 'animate-pulse' : ''} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider mt-3 block ${
                    isActive ? step.color : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  <span className="text-[8px] font-bold text-gray-600 mt-0.5 block truncate max-w-[70px]">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Details list */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl text-left space-y-4 mb-8">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest border-b border-white/5 pb-2">Order Summary</p>
            
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {order?.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">
                    <span className="text-yellow-500 font-black">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="text-white font-bold">Rs. {(item.quantity * item.price).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Total Bill</span>
              <span className="text-xl font-black text-yellow-500">Rs. {order?.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-left text-[11px] font-bold text-gray-500 border-t border-white/5 pt-6">
            <div>
              <p className="uppercase tracking-widest text-[9px] text-gray-600 mb-0.5">Order ID</p>
              <p className="text-white font-semibold">#{order?._id}</p>
            </div>
            <div>
              <p className="uppercase tracking-widest text-[9px] text-gray-600 mb-0.5">Serving Table</p>
              <p className="text-yellow-500 font-black flex items-center gap-1">
                <MapPin size={12} /> Table {order?.tableNumber}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate(`/smart-menu?table=${order?.tableNumber}&reservation=${order?.reservationId}`)}
            className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all text-center"
          >
            Order More Food
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-xs uppercase tracking-widest transition-all shadow-glow text-center"
          >
            Exit Dining System
          </button>
        </div>

        {/* Heart quote */}
        <div className="mt-12 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.25em] flex justify-center items-center gap-1">
          Made with <Heart size={10} className="text-red-500 fill-current animate-pulse" /> by Leafora Restaurant
        </div>
      </div>
    </div>
  );
};

export default SmartOrderStatus;
