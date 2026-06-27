import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Users, Clock, MapPin, Crown, Globe, Sparkles, Phone, Mail, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ReservationConfirmation = () => {
  const location = useLocation();
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(location.state?.reservation || null);
  const [loading, setLoading] = useState(!location.state?.reservation);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If reservation data was not passed in state, fetch it from MongoDB
    if (!reservation) {
      const fetchReservation = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/reservations/${reservationId}`);
          // Support mapping tableNumber and reservationId correctly
          const data = response.data;
          const mapped = {
            ...data,
            id: data.reservationId,
            allocatedTable: data.tableNumber
          };
          setReservation(mapped);
        } catch (err) {
          console.error('Error fetching reservation details:', err);
          setError('We could not retrieve your reservation details. Please check the ID or contact support.');
        } finally {
          setLoading(false);
        }
      };
      fetchReservation();
    }
  }, [reservationId, reservation]);

  // Date formatter helper: "2026-06-20" -> "20 June 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${day} ${months[month - 1]} ${year}`;
    }
    return dateStr;
  };

  // Clean guest count: "4 Persons" -> "4"
  const cleanGuestsCount = (guestsStr) => {
    if (!guestsStr) return '';
    return guestsStr.replace(/\s*(Persons|Person)/gi, '');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white" id="confirmation-loading">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] animate-pulse">
            Retrieving Reservation details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6" id="confirmation-error">
        <div className="max-w-md w-full p-8 rounded-[2.5rem] bg-[#0c0c0c] border border-red-500/20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[6px] bg-red-500/50"></div>
          <h2 className="text-2xl font-black mb-4 text-white tracking-tight uppercase">Reservation Not Found</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
            {error || 'The requested reservation does not exist in our database.'}
          </p>
          <button
            onClick={() => navigate('/reservations')}
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all border border-white/10"
            id="error-back-btn"
          >
            Back to Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-xl mx-auto px-4" id="confirmation-success">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] -z-10"></div>
        
        <div className="text-center py-4 relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)] relative animate-pulse">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-white mb-2 italic">
            Reservation Received!
          </h1>
          <p className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-8" id="confirmation-id-label">
            Reservation ID: {reservation.reservationId || reservation.id}
          </p>
          
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-8 text-left space-y-4 shadow-inner">
            <div className="flex justify-between border-b border-white/5 pb-3 text-sm">
              <span className="text-gray-500 font-medium">Guest Name</span>
              <span className="text-white font-bold" id="confirmation-guest-name">{reservation.customerName}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/5 pb-3 text-sm">
              <span className="text-gray-500 font-medium">Date & Time</span>
              <span className="text-white font-bold" id="confirmation-date-time">
                {formatDate(reservation.date)} at {reservation.time}
              </span>
            </div>
            
            <div className="flex justify-between border-b border-white/5 pb-3 text-sm">
              <span className="text-gray-500 font-medium">Guests Count</span>
              <span className="text-white font-bold" id="confirmation-guest-count">{cleanGuestsCount(reservation.guests)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Dining Experience</span>
              <span className="text-orange-400 font-black flex items-center gap-1.5" id="confirmation-experience">
                {reservation.tableType === 'VIP' ? <Crown size={15} /> : reservation.tableType === 'Local' ? <MapPin size={15} /> : <Globe size={15} />}
                {reservation.tableType} Dining
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-8 text-center max-w-sm">
            <p className="text-xs text-orange-400 leading-relaxed font-bold">
              💡 Reservation is pending admin approval. Once our team approves and allocates a table, a unique dining QR code will be generated for your smart dining experience!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => navigate('/reservations')}
              className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
              id="confirm-another-btn"
            >
              Book Another
            </button>
            <button 
              onClick={() => navigate('/menu')}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs uppercase tracking-widest transition-all shadow-glow hover:scale-[1.03] active:scale-[0.97]"
              id="confirm-explore-btn"
            >
              Explore Menu
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReservationConfirmation;
