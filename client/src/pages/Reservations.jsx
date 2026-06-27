import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Send, MapPin, Crown, Globe, Sparkles, CheckCircle2, Phone, Mail, User, Utensils } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Reservations = () => {
  const { addReservation } = useReservation();
  const { user } = useUserAuth();
  const navigate = useNavigate();
  
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: getTodayString(),
    time: '07:00 PM',
    guests: '2 Persons',
    tableType: 'Local'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdReservation, setCreatedReservation] = useState(null);

  // Route Guard: Redirect guests trying to access Reservations directly
  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue.', { id: 'login-toast' });
      navigate('/login', { state: { from: '/reservations' } });
    }
  }, [user, navigate]);

  // Auto-fill customer details if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.firstName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const tableTypes = [
    {
      id: 'Local',
      name: 'Local',
      icon: MapPin,
      tagline: 'Native Culinary',
      color: 'from-orange-500/20 to-amber-500/5',
      borderColor: 'group-hover:border-orange-500/40',
      activeColor: 'border-orange-500/80 text-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.25)] bg-orange-500/10',
      desc: 'Authentic Sri Lankan food recommendations & native spice levels.'
    },
    {
      id: 'VIP',
      name: 'VIP',
      icon: Crown,
      tagline: 'Exclusive Dining',
      color: 'from-yellow-500/20 to-amber-600/5',
      borderColor: 'group-hover:border-yellow-500/40',
      activeColor: 'border-yellow-500/80 text-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.25)] bg-yellow-500/10',
      desc: 'Ultra-premium dining tables & special chef menu experience.'
    },
    {
      id: 'Foreign',
      name: 'Foreign',
      icon: Globe,
      tagline: 'Continental Fit',
      color: 'from-blue-500/20 to-cyan-500/5',
      borderColor: 'group-hover:border-blue-500/40',
      activeColor: 'border-blue-500/80 text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.25)] bg-blue-500/10',
      desc: 'English-friendly menu translations & milder, less spicy food options.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTableSelect = (typeId) => {
    setFormData(prev => ({ ...prev, tableType: typeId }));
    toast.success(`${typeId} Table Experience Selected!`, {
      icon: typeId === 'VIP' ? '👑' : typeId === 'Local' ? '🌶️' : '🌍',
      style: {
        borderRadius: '12px',
        background: '#111',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customerName || !formData.email || !formData.phone || !formData.date) {
      toast.error('Please fill in all the reservation fields.', {
        style: {
          borderRadius: '12px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
      return;
    }

    try {
      const res = await addReservation(formData);
      
      toast.success('Reservation Confirmed Successfully!', {
        icon: '🎉',
        style: {
          borderRadius: '16px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(234, 179, 8, 0.2)'
        }
      });
      
      navigate(`/reservation-confirmation/${res.reservationId || res.id}`, {
        state: { reservation: res }
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Failed to submit reservation. Please try again.', {
        style: {
          borderRadius: '12px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
    }
  };

  // Get active experience description
  const activeExperience = tableTypes.find(t => t.id === formData.tableType);

  return (
    <div className="py-6 max-w-6xl mx-auto px-4">
      <div className="w-full flex flex-col lg:flex-row gap-16 items-start justify-start">
        
        {/* Left Side Content */}
        <div className="w-full lg:w-1/2">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-8">
            Book a Table
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 leading-[1.1]">
            Secure Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Dining Experience</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
            Skip the wait and guarantee your spot. Choose your preferred table atmosphere to unlock specialized recommendations, personalized hospitality, and menus crafted just for you.
          </p>
          
          {/* Glass Mini Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-300 group flex items-start gap-4 shadow-xl">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-white mb-1">Premium Experience</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Fine curated atmosphere for state-of-the-art expectations.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-300 group flex items-start gap-4 shadow-xl">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-white mb-1">Foreign Friendly</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">English-translated lists, maps, and mild spice adjustments.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-yellow-500/30 hover:bg-white/[0.04] transition-all duration-300 group flex items-start gap-4 shadow-xl">
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-300">
                <Crown size={18} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-white mb-1">VIP Dining</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Exclusive personalized setups, custom chef interactions & service.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-300 group flex items-start gap-4 shadow-xl">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-white mb-1">Open Daily</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Delivering hospitality daily from 10:00 AM – 11:00 PM.</p>
              </div>
            </div>
          </div>

          {/* Small Premium Stats Section */}
          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-2xl py-3 px-4 shadow-md group hover:bg-white/[0.03] hover:border-orange-500/20 transition-all duration-300">
              <CheckCircle2 size={15} className="text-orange-500 flex-shrink-0 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">500+ Booked</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-2xl py-3 px-4 shadow-md group hover:bg-white/[0.03] hover:border-orange-500/20 transition-all duration-300">
              <CheckCircle2 size={15} className="text-orange-500 flex-shrink-0 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">Instant Ok</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-2xl py-3 px-4 shadow-md group hover:bg-white/[0.03] hover:border-orange-500/20 transition-all duration-300">
              <CheckCircle2 size={15} className="text-orange-500 flex-shrink-0 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">Luxury Setup</span>
            </div>
          </div>
        </div>

        {/* Right Side Form / Confirmation */}
        <div className="w-full lg:w-1/2">
          <div className="bg-[#111] p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -z-10"></div>
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="reservation-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    
                    {/* Customer Info Section */}
                    <div className="space-y-4 border-b border-white/5 pb-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">1. Personal Information</h3>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            type="text" 
                            name="customerName"
                            required
                            placeholder="John Doe"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 ml-1">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                              type="email" 
                              name="email"
                              required
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 ml-1">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                              type="tel" 
                              name="phone"
                              required
                              placeholder="+94 77 123 4567"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Parameters */}
                    <div className="space-y-4 border-b border-white/5 pb-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">2. Dining Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 ml-1">Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                              type="date" 
                              name="date"
                              required
                              value={formData.date}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors custom-date-input" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 ml-1">Preferred Time</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <select 
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                            >
                              <option className="bg-[#111]" value="06:00 PM">06:00 PM</option>
                              <option className="bg-[#111]" value="06:30 PM">06:30 PM</option>
                              <option className="bg-[#111]" value="07:00 PM">07:00 PM</option>
                              <option className="bg-[#111]" value="07:30 PM">07:30 PM</option>
                              <option className="bg-[#111]" value="08:00 PM">08:00 PM</option>
                              <option className="bg-[#111]" value="08:30 PM">08:30 PM</option>
                              <option className="bg-[#111]" value="09:00 PM">09:00 PM</option>
                              <option className="bg-[#111]" value="09:30 PM">09:30 PM</option>
                              <option className="bg-[#111]" value="10:00 PM">10:00 PM</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">Number of Guests</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <select 
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                          >
                            <option className="bg-[#111]" value="1 Person">1 Person</option>
                            <option className="bg-[#111]" value="2 Persons">2 Persons</option>
                            <option className="bg-[#111]" value="3 Persons">3 Persons</option>
                            <option className="bg-[#111]" value="4 Persons">4 Persons</option>
                            <option className="bg-[#111]" value="5 Persons">5 Persons</option>
                            <option className="bg-[#111]" value="6 Persons">6 Persons</option>
                            <option className="bg-[#111]" value="7-9 Persons">7-9 Persons</option>
                            <option className="bg-[#111]" value="10+ Persons">10+ Persons</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Table Experience Type Card Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">3. Select Table Experience</h3>
                        <span className="text-[10px] text-orange-500 font-black uppercase tracking-wider flex items-center gap-1">
                          <Sparkles size={10} className="animate-spin" /> Personalized
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {tableTypes.map((type) => {
                          const IconComp = type.icon;
                          const isSelected = formData.tableType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => handleTableSelect(type.id)}
                              className={`
                                group flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
                                ${isSelected ? type.activeColor : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}
                              `}
                            >
                              <div className={`p-2 rounded-xl bg-white/5 mb-2 group-hover:scale-110 transition-transform ${isSelected ? 'text-inherit' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                <IconComp size={20} />
                              </div>
                              <span className="text-xs font-black tracking-wide uppercase">{type.name}</span>
                              <span className="text-[8px] text-gray-500 font-bold tracking-tight block mt-0.5">{type.tagline}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Display Selected Experience Detail Banner */}
                      {activeExperience && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3 items-start"
                        >
                          <div className={`p-2 rounded-xl bg-white/5 text-orange-500`}>
                            <Sparkles size={14} className="animate-pulse" />
                          </div>
                          <div>
                            <p className="text-[10px] text-orange-500 font-black uppercase tracking-wider mb-0.5">Activated Experience Perks:</p>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">{activeExperience.desc}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                    >
                      Confirm Reservation <Send size={18} />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="reservation-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 relative z-10 flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white mb-6 shadow-glow relative animate-bounce">
                    <CheckCircle2 size={44} strokeWidth={2.5} />
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-2">Reservation Received!</h2>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">Reservation ID: {createdReservation?.id}</p>
                  
                  <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-8 text-left space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-gray-500 font-medium">Guest Name</span>
                      <span className="text-white font-bold">{createdReservation?.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-gray-500 font-medium">Date & Time</span>
                      <span className="text-white font-bold">{createdReservation?.date} at {createdReservation?.time}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-gray-500 font-medium">Guests Count</span>
                      <span className="text-white font-bold">{createdReservation?.guests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Table Experience</span>
                      <span className="text-orange-400 font-black flex items-center gap-1">
                        {createdReservation?.tableType === 'VIP' ? <Crown size={14} /> : createdReservation?.tableType === 'Local' ? <MapPin size={14} /> : <Globe size={14} />}
                        {createdReservation?.tableType} Experience
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-8 text-center max-w-sm">
                    <p className="text-xs text-orange-400 leading-relaxed font-bold">
                      💡 Reservation is pending admin approval. Once our team approves and allocates a table, a unique dining QR code will be generated for your smart dining experience!
                    </p>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      Book Another
                    </button>
                    <button 
                      onClick={() => navigate('/menu')}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs uppercase tracking-widest transition-all shadow-glow hover:scale-105 active:scale-95"
                    >
                      Explore Menu
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reservations;
