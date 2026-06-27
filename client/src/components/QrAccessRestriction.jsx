import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const QrAccessRestriction = ({ status, errorMsg }) => {
  const navigate = useNavigate();

  // Determine configuration based on status
  let title = "Access Restricted";
  let message = errorMsg || "Access to smart dining services is restricted.";
  let iconColor = "text-red-500";
  let bgColor = "bg-red-500/10";
  let borderColor = "border-red-500/20";
  let stripeColor = "bg-red-500/50";
  let Icon = AlertTriangle;
  let showHint = true;

  if (status === 'Completed') {
    title = "Access Restricted";
    message = (
      <>
        <span className="block font-bold text-white mb-2">This reservation has already been completed.</span>
        <span className="block mb-2">Thank you for dining with Leafora.</span>
        <span className="block">Please create a new reservation to access Smart Dining services.</span>
      </>
    );
    iconColor = "text-emerald-500";
    bgColor = "bg-emerald-500/10";
    borderColor = "border-emerald-500/20";
    stripeColor = "bg-emerald-500/50";
    Icon = CheckCircle2;
    showHint = false;
  } else if (status === 'Cancelled') {
    title = "Access Restricted";
    message = (
      <>
        <span className="block font-bold text-white mb-2">This reservation has been cancelled.</span>
        <span className="block">Please contact Leafora support if you believe this is an error.</span>
      </>
    );
    iconColor = "text-rose-500";
    bgColor = "bg-rose-500/10";
    borderColor = "border-rose-500/20";
    stripeColor = "bg-rose-500/50";
    Icon = XCircle;
    showHint = false;
  } else if (status === 'Expired') {
    title = "Access Restricted";
    message = (
      <>
        <span className="block font-bold text-white mb-2">This reservation has expired.</span>
        <span className="block">Please make a new reservation to continue.</span>
      </>
    );
    iconColor = "text-orange-500";
    bgColor = "bg-orange-500/10";
    borderColor = "border-orange-500/20";
    stripeColor = "bg-orange-500/50";
    Icon = Clock;
    showHint = false;
  } else if (status === 'Pending') {
    title = "Reservation Pending Approval";
    message = "Your reservation has been received and is awaiting confirmation. Please wait for confirmation from Leafora Restaurant.";
    iconColor = "text-yellow-500";
    bgColor = "bg-yellow-500/10";
    borderColor = "border-yellow-500/20";
    stripeColor = "bg-yellow-500/50";
    Icon = Clock;
    showHint = true;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`max-w-md w-full p-8 rounded-[2.5rem] bg-[#0a0a0a] border ${borderColor} text-center shadow-2xl relative overflow-hidden`}
      >
        {/* Top glowing stripe */}
        <div className={`absolute top-0 left-0 right-0 h-[6px] ${stripeColor}`}></div>
        
        {/* Icon container */}
        <div className={`w-20 h-20 rounded-full ${bgColor} border ${borderColor} flex items-center justify-center mx-auto mb-6 ${iconColor}`}>
          <Icon size={40} />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-black mb-4 text-white tracking-tight uppercase">{title}</h2>
        
        {/* Message */}
        <div className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
          {message}
        </div>
        
        {/* Bottom hint */}
        {showHint && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-500 leading-relaxed mb-8">
            💡 QR ordering is restricted to guests with a confirmed reservation. Please speak to the front desk host for table assignment.
          </div>
        )}
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all border border-white/10"
        >
          Return to Homepage
        </button>
      </motion.div>
    </div>
  );
};

export default QrAccessRestriction;
