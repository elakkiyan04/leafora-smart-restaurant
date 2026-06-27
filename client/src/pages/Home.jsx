import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Utensils, ChefHat, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Image Imports
import heroImg from '../assets/images/hero.png';
import bbqWings from '../assets/images/bbq-chicken-wings.jpg';
import beefBurger from '../assets/images/classic-beef-burger.jpg';
import margheritaPizza from '../assets/images/classic-margherita-pizza.jpg';
import alfredoPasta from '../assets/images/creamy-alfredo-pasta.jpg';
import steakBites from '../assets/images/garlic-butter-steak-bites.jpg';
import grilledChicken from '../assets/images/grilled-chicken.jpg';
import bbqPizza from '../assets/images/bbq-chicken-pizza.jpg';
import pepperoniPizza from '../assets/images/pepperoni-feast.jpg';
import seafoodRice from '../assets/images/seafood-fried-rice.jpg';
import chickenKothu from '../assets/images/chicken-kothu.jpg';

const Home = () => {
  const { addToCart } = useCart();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const offers = [
    {
      id: 1,
      title: "Weekend Special",
      highlight: "30% OFF",
      description: "Indulge in our chef's gourmet selection with 30% off every Friday through Sunday.",
      image: bbqWings,
      badge: "Weekend Special",
    },
    {
      id: 2,
      title: "Family Combo",
      highlight: "COMBO DEAL",
      description: "Gather your loved ones for a grand feast. Includes 2 mains, 2 sides, and a large beverage.",
      image: beefBurger,
      badge: "Family Favorite",
    },
    {
      id: 3,
      title: "Free Dessert Offer",
      highlight: "COMPLIMENTARY",
      description: "Satisfy your sweet tooth. Get a free signature dessert with any order over Rs. 3,000.",
      image: margheritaPizza,
      badge: "Sweet Reward",
    }
  ];

  const specialMenu = [
    { id: 101, name: "Wagyu Gold Burger", price: 4800, image: beefBurger },
    { id: 102, name: "Black Truffle Pasta", price: 4200, image: alfredoPasta },
    { id: 103, name: "Atlantic Salmon", price: 5200, image: bbqPizza },
    { id: 104, name: "Roasted Lamb Chops", price: 6200, image: steakBites },
    { id: 105, name: "Grilled Chicken Deluxe", price: 4500, image: grilledChicken }
  ];

  const gallery = [
    bbqPizza,
    pepperoniPizza,
    seafoodRice,
    chickenKothu
  ];

  const handleAddToCart = (item) => {
    if (!user) {
      localStorage.setItem('pendingAddToCart', JSON.stringify(item));
      toast.error('Please login to continue.', { id: 'login-toast' });
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    addToCart(item);
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid rgba(249, 115, 22, 0.2)'
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500/30 custom-scrollbar">
      
      {/* 1. HERO SECTION (100vh Full Screen) */}
      <section className="relative w-full h-screen overflow-hidden flex items-center">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Hero background" 
            className="w-full h-full object-cover object-[80%_62%] opacity-95" 
          />
          
          {/* Soft black overlay (40% opacity) */}
          <div className="absolute inset-0 bg-black/40 z-[1]"></div>
          
          {/* Subtle left-to-right shadow gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-[2]"></div>
        </div>

        {/* Content Overlay */}
        <div className="max-w-[1600px] mx-auto w-full px-6 sm:px-8 lg:px-12 relative z-10 h-full flex flex-col justify-between pt-36 pb-16">
          
          {/* Main Hero Row: Left Content (45%) and Right Side Spacer (55%) */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-between w-full gap-12 my-auto">
            
            {/* Left Content Column (approximately 45% width on desktop) */}
            <div className="w-full lg:max-w-[45%] flex flex-col justify-center text-left">
              {/* Premium Dining Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black tracking-widest uppercase mb-8 backdrop-blur-md self-start"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                Premium Dining Experience
              </motion.div>

              {/* Typography Heading (Playfair Display, Tight Line Spacing, Large font size) */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.02] mb-6 text-white tracking-tight"
              >
                Unforgettable<br />
                <span className="text-orange-500">Flavor</span> in<br />
                Every Bite
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="text-gray-300 text-base sm:text-lg mb-10 leading-relaxed font-medium opacity-90 max-w-lg"
              >
                Experience culinary excellence with our curated dishes, crafted using the finest ingredients for an extraordinary dining adventure.
              </motion.p>

              {/* Premium Aligned Buttons with Identical Dimensions */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="flex items-center gap-5"
              >
                <Link 
                  to="/menu" 
                  className="flex items-center justify-center gap-2 w-44 h-12 rounded-xl bg-orange-500 text-white font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.35)] uppercase text-xs tracking-widest"
                >
                  Order Now <ArrowRight size={14} />
                </Link>
                <Link 
                  to="/menu" 
                  className="flex items-center justify-center w-44 h-12 rounded-xl bg-black/40 text-white font-bold border border-orange-500 hover:bg-orange-500/10 transition-all hover:scale-105 text-xs uppercase tracking-widest"
                >
                  View Menu
                </Link>
              </motion.div>
            </div>

            {/* Right Side Spacer: Leaves neon wall logo on background fully visible */}
            <div className="hidden lg:block lg:w-1/2 h-full"></div>
          </div>

          {/* Feature Icons - Horizontal, Centered, Equal Spacing, Premium Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-x-12 gap-y-6 w-full justify-start mt-8 lg:mt-auto pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-3.5 group cursor-default">
              <Utensils className="text-orange-500 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest uppercase text-gray-500">EXQUISITE</span>
                <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-orange-400 transition-colors">CUISINE</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <ChefHat className="text-orange-500 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest uppercase text-gray-400">EXPERT</span>
                <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-orange-400 transition-colors">CHEFS</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <Leaf className="text-orange-500 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest uppercase text-gray-400">FRESH</span>
                <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-orange-400 transition-colors">INGREDIENTS</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <Star className="text-orange-500 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest uppercase text-gray-400">TOP</span>
                <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-orange-400 transition-colors">RATED</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTIONS WRAPPER BELOW HERO */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-24 flex flex-col gap-28">

        {/* SECTION 1: 🔥 Special Offers */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col justify-start">
            <div className="inline-flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
              🔥 Limited Time Deals
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Special Offers For You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ y: -10 }}
                className="group relative rounded-[2.5rem] overflow-hidden h-[420px] shadow-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-500 cursor-pointer"
              >
                {/* Background Image */}
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 opacity-60 group-hover:opacity-80" 
                />
                
                {/* Dark Gradients for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                
                {/* Card Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                  <span className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-2 drop-shadow-md">
                    {offer.badge}
                  </span>
                  
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors drop-shadow-lg leading-tight">
                    {offer.title}
                  </h3>
                  
                  <p className="text-gray-300 text-xs font-medium leading-relaxed mb-6 opacity-90">
                    {offer.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="px-4 py-2 bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-400 text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider">
                      {offer.highlight}
                    </span>
                    
                    <Link 
                      to="/menu" 
                      className="flex items-center gap-1.5 text-xs font-black text-white hover:text-orange-400 transition-colors uppercase tracking-widest"
                    >
                      Claim Offer <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION: Chef's Specials */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-3">
                <Star size={12} className="fill-orange-500 stroke-none" />
                Exquisite Signature Creations
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Chef's Specials
              </h2>
            </div>
            <Link 
              to="/menu" 
              className="text-xs font-black uppercase tracking-widest text-orange-400 hover:text-orange-500 transition-colors flex items-center gap-1.5"
            >
              View Full Menu <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {specialMenu.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="flex flex-col bg-[#141414]/60 backdrop-blur-md rounded-2xl p-4 border border-white/5 hover:border-orange-500/30 hover:bg-white/5 transition-all group/item shadow-lg"
              >
                <div className="aspect-square rounded-xl overflow-hidden shadow-2xl relative border border-white/5 mb-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <h4 className="font-black text-white text-sm group-hover/item:text-orange-400 transition-colors truncate mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center text-orange-500 gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={10} fill="currentColor" className="stroke-none" />
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <p className="text-orange-500 font-black text-sm tracking-tighter">
                      Rs. {item.price.toLocaleString()}
                    </p>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="p-2 rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-black transition-all shadow-lg active:scale-90"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={12} />
                      </button>
                      <button 
                        onClick={() => {
                          if (!user) {
                            localStorage.setItem('pendingAddToCart', JSON.stringify(item));
                            toast.error('Please login to continue.', { id: 'login-toast' });
                            navigate('/login', { state: { from: '/cart' } });
                            return;
                          }
                          addToCart(item);
                          navigate('/cart');
                        }}
                        className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[9px] font-black hover:scale-105 active:scale-95 transition-all shadow-glow"
                      >
                        ORDER
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION: Gallery */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                📸 Capturing Memories
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Our Gallery
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gallery.map((img, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl border border-white/5 hover:border-orange-500/20 transition-all duration-500"
              >
                <img 
                  src={img} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-48 md:h-56 object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 z-10">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    Leafora Premium Dining
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: ⭐ Customer Newsletter */}
        <section>
          <div className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-16 border border-white/5 bg-[#141414]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
            
            {/* Ambient Lighting Accents */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] group-hover:bg-orange-500/15 transition-colors duration-1000"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#eab308]/5 rounded-full blur-[100px]"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                Customer Newsletter
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Stay Updated With Leafora
              </h2>

              <p className="text-gray-300 text-sm md:text-base max-w-lg leading-relaxed font-medium opacity-80">
                Subscribe to our premium newsletter to receive early access to seasonal tastings, VIP table reservations, and exclusive monthly promotions.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Thank you for subscribing!', {
                    icon: '✉️',
                    style: {
                      borderRadius: '12px',
                      background: '#1a1a1a',
                      color: '#fff',
                      border: '1px solid rgba(249, 115, 22, 0.2)'
                    },
                  });
                }}
                className="mt-6 flex flex-col sm:flex-row w-full max-w-md gap-4 p-2 bg-black/40 rounded-2xl border border-white/5 focus-within:border-orange-500/40 focus-within:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all"
              >
                <input 
                  type="email" 
                  required
                  placeholder="Enter your premium email address" 
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none font-bold text-xs"
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black px-8 py-3.5 rounded-xl hover:scale-102 active:scale-98 transition-all shadow-glow hover:shadow-glow-strong text-xs uppercase tracking-widest shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
};

export default Home;