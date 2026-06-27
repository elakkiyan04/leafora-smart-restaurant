import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';
import { Crown, MapPin, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Calendar, Users, Clock, Phone, Mail, User, Utensils, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QrAccessRestriction from '../components/QrAccessRestriction';

const QrLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { reservations, updateReservationStatus, checkInReservation, parseReservationDateTime } = useReservation();

  const tableParam = searchParams.get('table');
  const reservationParam = searchParams.get('reservation');

  const [reservation, setReservation] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [restrictionStatus, setRestrictionStatus] = useState(null);
  const [step, setStep] = useState('welcome'); // 'welcome' or 'experience'
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Simulate premium loader validation
    const timer = setTimeout(() => {
      if (!tableParam || !reservationParam) {
        setErrorMsg('Invalid QR Code. Missing Table Number or Reservation ID.');
        setRestrictionStatus('Invalid');
        setIsValidating(false);
        return;
      }

      const foundRes = reservations.find(r => r.id === reservationParam);
      if (!foundRes) {
        setErrorMsg(`Reservation ID #${reservationParam} not found in our system.`);
        setRestrictionStatus('Invalid');
        setIsValidating(false);
        return;
      }

      // Check for Completed, Cancelled, or Expired first
      if (foundRes.status === 'Completed' || foundRes.status === 'Cancelled' || foundRes.status === 'Expired') {
        setRestrictionStatus(foundRes.status);
        setIsValidating(false);
        return;
      }

      // If the reservation is Pending, show pending status (Reservation Pending Approval)
      // Pending reservations should NOT show Expired or check table mismatch.
      if (foundRes.status === 'Pending') {
        setRestrictionStatus('Pending');
        setIsValidating(false);
        return;
      }

      // If it is Confirmed, verify the table matching
      if (foundRes.status === 'Confirmed') {

        const allocatedTableClean = (foundRes.allocatedTable || '').trim().toLowerCase();
        const scannedTableClean = (tableParam || '').trim().toLowerCase();

        if (allocatedTableClean !== scannedTableClean) {
          setErrorMsg(`Table mismatch. Reservation #${reservationParam} is allocated to Table ${foundRes.allocatedTable || 'None'}, but scanned Table ${tableParam}.`);
          setRestrictionStatus('Invalid');
          setIsValidating(false);
          return;
        }

        // Successfully validated confirmed reservation - perform check-in
        if (!foundRes.checkedIn) {
          checkInReservation(foundRes.id);
        }
      }

      setReservation(foundRes);
      setIsValidating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tableParam, reservationParam, reservations]);

  const experiences = [
    {
      id: 'local',
      title: 'Local Dining',
      icon: '🇱🇰',
      sub: 'Native Culinary',
      desc: 'Savor the rich heritage of authentic Sri Lankan culinary treasures, customized with native spices and traditional touch.',
      borderColor: 'border-orange-500/30 hover:border-orange-500/80',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      glowColor: 'shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:bg-orange-500/[0.02]'
    },
    {
      id: 'foreign',
      title: 'Foreign Friendly',
      icon: '🌍',
      sub: 'Continental Flavors',
      desc: 'Indulge in mild, flavorful continental choices crafted with English-friendly descriptions, allergen guides, and low-spice profiles.',
      borderColor: 'border-blue-500/30 hover:border-blue-500/80',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:bg-blue-500/[0.02]'
    },
    {
      id: 'vip',
      title: 'VIP Dining',
      icon: '👑',
      sub: 'Exclusive Luxury',
      desc: 'Unlock our ultra-premium chef specialities, featuring A5 Wagyu, baked lobster, gold leaf mocktails, and gold-standard styling.',
      borderColor: 'border-yellow-600/40 hover:border-yellow-500',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      glowColor: 'shadow-[0_0_30px_rgba(234,179,8,0.25)] hover:bg-yellow-500/[0.02]'
    }
  ];

  const handleSelectExperience = (expId) => {
    navigate(`/smart-menu?table=${tableParam}&reservation=${reservationParam}&experience=${expId}`);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] animate-pulse">
            Validating Smart Table Session...
          </p>
        </div>
      </div>
    );
  }

  if (restrictionStatus) {
    return <QrAccessRestriction status={restrictionStatus} errorMsg={errorMsg} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-12 flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl w-full text-center relative">
        {/* Soft glowing ambient backgrounds */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {step === 'welcome' ? (
            <motion.div
              key="welcome-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Brand Header */}
              <div className="mb-8 flex flex-col items-center">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-yellow-500 mb-3 flex items-center gap-1">
                  <Sparkles size={14} className="animate-pulse" /> Leafora Smart dining
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-600 bg-clip-text text-transparent font-serif">
                  Welcome to Leafora
                </h1>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent mb-6"></div>
                
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-[10px] sm:text-xs text-emerald-400 font-black uppercase tracking-widest">
                    Reservation Confirmed ✅
                  </span>
                </div>
              </div>

              {/* Reservation Details Box */}
              <div className="w-full max-w-md bg-[#0c0c0c] border border-yellow-500/15 shadow-[0_0_40px_rgba(234,179,8,0.06)] rounded-[2.5rem] p-8 mb-10 relative overflow-hidden text-left group hover:border-yellow-500/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.02] rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Guest</span>
                    <span className="text-white text-sm font-black font-serif tracking-wide">{reservation?.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Reservation</span>
                    <span className="text-yellow-500 text-xs font-black tracking-widest">{reservation?.id}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Table</span>
                    <span className="text-white text-sm font-black flex items-center gap-1">
                      <MapPin size={12} className="text-yellow-500" /> {tableParam}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Guests</span>
                    <span className="text-white text-sm font-black flex items-center gap-1.5">
                      <Users size={12} className="text-yellow-500" /> {reservation?.guests}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Time</span>
                    <span className="text-white text-sm font-black flex items-center gap-1.5">
                      <Clock size={12} className="text-yellow-500" /> {reservation?.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl w-full mb-10 text-left">
                {/* Card 1 */}
                <div className="p-5 rounded-[2rem] bg-[#0c0c0c] border border-white/5 shadow-xl flex flex-col group hover:border-yellow-500/20 hover:bg-white/[0.01] transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
                    🍽️
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 font-serif group-hover:text-yellow-400 transition-colors">
                    Premium Dining
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    Freshly prepared dishes crafted by expert chefs.
                  </p>
                </div>
                {/* Card 2 */}
                <div className="p-5 rounded-[2rem] bg-[#0c0c0c] border border-white/5 shadow-xl flex flex-col group hover:border-yellow-500/20 hover:bg-white/[0.01] transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
                    📱
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 font-serif group-hover:text-yellow-400 transition-colors">
                    Smart QR Ordering
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    Order directly from your table without waiting.
                  </p>
                </div>
                {/* Card 3 */}
                <div className="p-5 rounded-[2rem] bg-[#0c0c0c] border border-white/5 shadow-xl flex flex-col group hover:border-yellow-500/20 hover:bg-white/[0.01] transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
                    ⭐
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 font-serif group-hover:text-yellow-400 transition-colors">
                    Personalized Experience
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    Menus tailored for local, foreign, and VIP guests.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md w-full mb-8">
                <button
                  onClick={() => setStep('experience')}
                  className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:shadow-[0_0_30px_rgba(234,179,8,0.45)]"
                >
                  Start Ordering <ArrowRight size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="w-full py-4 px-8 rounded-2xl border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/5 hover:border-yellow-500 font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.98] text-center"
                >
                  View Reservation Details
                </button>
              </div>

              {/* Bottom micro-copy */}
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                Leafora Fine Dining Smart Table Services • Tap to Explore
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="experience-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Brand Header */}
              <div className="mb-12 flex flex-col items-center relative">
                {/* Back button to Welcome Screen */}
                <button
                  onClick={() => setStep('welcome')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider shadow-lg"
                  title="Back to Welcome Screen"
                >
                  <ArrowLeft size={14} /> <span>Back</span>
                </button>

                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-yellow-500 mb-2 flex items-center gap-1">
                  <Sparkles size={14} className="animate-pulse" /> Leafora Smart dining
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-600 bg-clip-text text-transparent font-serif">
                  Welcome to Leafora
                </h1>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent mb-6"></div>
                
                <div className="flex flex-wrap justify-center items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                    <span>Guest:</span>
                    <span className="text-white font-black">{reservation?.customerName}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block"></div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                    <span>Table:</span>
                    <span className="text-yellow-400 font-black flex items-center gap-1">
                      <MapPin size={12} /> {tableParam}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block"></div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1 uppercase tracking-widest text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 size={10} /> {reservation?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Experience Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
                {experiences.map((exp) => (
                  <motion.div
                    key={exp.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => handleSelectExperience(exp.id)}
                    className={`cursor-pointer rounded-[2.5rem] bg-[#0c0c0c] border p-6 flex flex-col justify-between group transition-all duration-300 shadow-2xl relative overflow-hidden ${exp.borderColor} ${exp.glowColor}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                    
                    <div className="relative z-10">
                      {/* Icon Circle */}
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                        {exp.icon}
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-3 inline-block ${exp.badgeColor}`}>
                        {exp.sub}
                      </span>
                      
                      <h3 className="text-2xl font-black text-white leading-tight mb-3 font-serif group-hover:text-yellow-400 transition-colors">
                        {exp.title}
                      </h3>
                      
                      <p className="text-gray-400 text-xs leading-relaxed font-medium mb-6">
                        {exp.desc}
                      </p>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between text-yellow-500 text-xs font-black uppercase tracking-wider group-hover:text-white transition-colors">
                      <span>Enter Menu</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom micro-copy */}
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mt-12">
                Leafora Fine Dining Smart Table Services • Tap to Explore
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reservation Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-0 m-auto z-50 max-w-md h-fit w-full p-8 rounded-[2.5rem] bg-[#0c0c0c] border border-yellow-500/20 text-left shadow-[0_0_50px_rgba(234,179,8,0.15)] max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-serif font-black italic text-white tracking-wide">
                    Reservation Details
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-0.5">
                    Leafora Luxury Confirmation
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Guest Name</p>
                    <p className="text-sm text-white font-bold">{reservation?.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                    <Crown size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Reservation ID</p>
                    <p className="text-sm text-yellow-500 font-black tracking-widest">{reservation?.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Allocated Table</p>
                      <p className="text-sm text-white font-bold">{tableParam}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Guests Count</p>
                      <p className="text-sm text-white font-bold">{reservation?.guests}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Date</p>
                      <p className="text-sm text-white font-bold">{reservation?.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Time</p>
                      <p className="text-sm text-white font-bold">{reservation?.time}</p>
                    </div>
                  </div>
                </div>

                {reservation?.email && (
                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Email Address</p>
                      <p className="text-sm text-white font-bold truncate">{reservation?.email}</p>
                    </div>
                  </div>
                )}

                {reservation?.phone && (
                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Phone Number</p>
                      <p className="text-sm text-white font-bold">{reservation?.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                    <Utensils size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Experience Type</p>
                    <p className="text-sm text-white font-bold capitalize">{reservation?.tableType} Experience</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full mt-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-black uppercase tracking-widest transition-all text-center"
              >
                Close Details
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QrLanding;
