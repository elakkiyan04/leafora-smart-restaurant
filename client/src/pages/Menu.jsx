import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, Star, QrCode, Info, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservation } from '../context/ReservationContext';
import { useUserAuth } from '../context/UserAuthContext';

// Local Image Imports
import chickenBriyani from '../assets/images/chicken-briyani.jpg';
import muttonBriyani from '../assets/images/mutton-briyani.webp';
import seafoodBriyani from '../assets/images/seafood-briyani.avif';
import cheeseBriyani from '../assets/images/cheese-briyani.webp';

import chickenFriedRice from '../assets/images/chicken-fried-rice.jpg';
import seafoodFriedRice from '../assets/images/seafood-fried-rice.jpg';
import mixedFriedRice from '../assets/images/mixed-fried-rice.webp';
import eggFriedRice from '../assets/images/egg-fried-rice.webp';

import dolphinKothu from '../assets/images/dolphin-kothu.jpg';
import cheeseKothu from '../assets/images/cheese-kothu.jpg';
import chickenKothu from '../assets/images/chicken-kothu.jpg';
import seafoodKothu from '../assets/images/seafood-kothu.jpg';

// Burger Imports
import beefBurgerImg from '../assets/images/classic-beef-burger.jpg';
import cheeseBurgerImg from '../assets/images/cheese-burger.jpg';
import doublePattyImg from '../assets/images/double-patty-burger.jpg';
import menuHeaderBg from '../assets/images/menu-header-bg.png';

// Chicken Imports
import bucketImg from '../assets/images/fried-chicken-bucket.jpg';
import grilledImg from '../assets/images/grilled-chicken.jpg';
import wingsImg from '../assets/images/bbq-chicken-wings.jpg';
import tendersImg from '../assets/images/crispy-chicken-tenders.jpg';

// Noodles Imports
import chickenNoodlesImg from '../assets/images/chicken-noodles.jpg';
import vegNoodlesImg from '../assets/images/veg-noodles.png';
import beefNoodlesImg from '../assets/images/teriyaki-beef-noodles.jpg';

// Pizza Imports
import margheritaPizzaImg from '../assets/images/classic-margherita-pizza.jpg';
import pepperoniImg from '../assets/images/pepperoni-feast.jpg';
import vegPizzaImg from '../assets/images/vegetarian-supreme.png';
import bbqPizzaImg from '../assets/images/bbq-chicken-pizza.jpg';

// Pasta Imports
import alfredoImg from '../assets/images/creamy-alfredo-pasta.jpg';
import bologneseImg from '../assets/images/spaghetti-bolognese.jpg';
import marinaraImg from '../assets/images/seafood-marinara.jpg';

// Sushi Imports
import dragonRollImg from '../assets/images/dragon-roll.jpg';

// Soup Imports
import lobsterBisqueImg from '../assets/images/lobster-bisque.webp';
import tomatoSoupImg from '../assets/images/creamy-tomato-soup.jpg';
import sweetCornImg from '../assets/images/chicken-sweet-corn.jpg';
import hotSourImg from '../assets/images/hot-and-sour-soup.jpg';

// Steak Imports
import steakBitesImg from '../assets/images/garlic-butter-steak-bites.jpg';


const Menu = () => {
  const { activeReservation, clearActiveReservation } = useReservation();
  const { addToCart, tableNumber, setTableNumber } = useCart();
  const { user } = useUserAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      setTableNumber(table);
    }
    // Simulate loading for premium feel
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [searchParams, setTableNumber]);

  const menuItems = [
    // Burger
    { id: 1, name: "Classic Beef Burger", price: 1500, category: "Burger", image: beefBurgerImg, rating: 4.5, description: "Juicy beef patty with premium cheese and fresh veggies." },
    { id: 2, name: "Cheese Burger", price: 1800, category: "Burger", image: cheeseBurgerImg, rating: 4.6, description: "Extra melted cheese on a perfectly grilled beef patty." },
    { id: 3, name: "Double Patty Burger", price: 2500, category: "Burger", image: doublePattyImg, rating: 4.8, description: "Two juicy patties for double the satisfaction." },
    { id: 4, name: "Spicy Chicken Burger", price: 1600, category: "Burger", image: tendersImg, rating: 4.7, description: "Crispy chicken breast with our signature hot sauce." },

    // Chicken
    { id: 5, name: "Fried Chicken Bucket", price: 2800, category: "Chicken", image: bucketImg, rating: 4.9, description: "Signature crispy fried chicken bucket with sides." },
    { id: 6, name: "Grilled Chicken Breast", price: 2200, category: "Chicken", image: grilledImg, rating: 4.5, description: "Succulent grilled chicken seasoned with herbs." },
    { id: 7, name: "BBQ Chicken Wings", price: 1900, category: "Chicken", image: wingsImg, rating: 4.6, description: "Tender wings tossed in smoky BBQ sauce." },
    { id: 8, name: "Crispy Chicken Tenders", price: 1700, category: "Chicken", image: tendersImg, rating: 4.7, description: "Golden-brown chicken tenders served with dip." },

    // Noodles
    { id: 9, name: "Chicken Noodles", price: 1200, category: "Noodles", image: chickenNoodlesImg, rating: 4.4, description: "Classic stir-fried noodles with chicken and veggies." },
    { id: 10, name: "Veg Noodles", price: 900, category: "Noodles", image: vegNoodlesImg, rating: 4.2, description: "Healthy and delicious noodles with fresh vegetables." },
    { id: 11, name: "Spicy Seafood Noodles", price: 1800, category: "Noodles", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80", rating: 4.7, description: "Spicy noodles packed with premium seafood mix." },
    { id: 12, name: "Teriyaki Beef Noodles", price: 1600, category: "Noodles", image: beefNoodlesImg, rating: 4.6, description: "Noodles with tender beef glazed in teriyaki sauce." },

    // Steak
    { id: 13, name: "Premium Ribeye Steak", price: 5500, category: "Steak", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80", rating: 4.9, description: "High-quality ribeye steak cooked to perfection." },
    { id: 14, name: "T-Bone Steak", price: 6200, category: "Steak", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", rating: 4.8, description: "Generous T-bone cut with rich marbling and flavor." },
    { id: 15, name: "Sirloin Steak", price: 4800, category: "Steak", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80", rating: 4.7, description: "Classic sirloin steak, lean and full of beefy flavor." },
    { id: 16, name: "Garlic Butter Steak Bites", price: 3500, category: "Steak", image: steakBitesImg, rating: 4.9, description: "Bite-sized steak pieces in a rich garlic butter sauce." },

    // Pasta
    { id: 17, name: "Truffle Mushroom Pasta", price: 2400, category: "Pasta", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80", rating: 4.8, description: "Creamy pasta infused with luxurious truffle and mushrooms." },
    { id: 18, name: "Creamy Alfredo Pasta", price: 1800, category: "Pasta", image: alfredoImg, rating: 4.6, description: "Classic Alfredo sauce with fettuccine and parmesan." },
    { id: 19, name: "Spaghetti Bolognese", price: 2100, category: "Pasta", image: bologneseImg, rating: 4.5, description: "Rich and hearty meat sauce served over spaghetti." },
    { id: 20, name: "Seafood Marinara", price: 2600, category: "Pasta", image: marinaraImg, rating: 4.7, description: "Pasta with a medley of seafood in zesty tomato sauce." },

    // Pizza
    { id: 21, name: "Classic Margherita Pizza", price: 1900, category: "Pizza", image: margheritaPizzaImg, rating: 4.5, description: "Simple and elegant with tomato, mozzarella, and basil." },
    { id: 22, name: "Pepperoni Feast", price: 2500, category: "Pizza", image: pepperoniImg, rating: 4.8, description: "Loaded with spicy pepperoni and extra cheese." },
    { id: 23, name: "Vegetarian Supreme", price: 2200, category: "Pizza", image: vegPizzaImg, rating: 4.4, description: "Assorted fresh veggies on a crispy thin crust." },
    { id: 24, name: "BBQ Chicken Pizza", price: 2700, category: "Pizza", image: bbqPizzaImg, rating: 4.7, description: "Tangy BBQ sauce topped with grilled chicken and onions." },

    // Sushi
    { id: 25, name: "Spicy Tuna Roll", price: 2800, category: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80", rating: 4.8, description: "Fresh tuna with spicy mayo and cucumber." },
    { id: 26, name: "California Roll", price: 2400, category: "Sushi", image: "https://images.unsplash.com/photo-1559466273-d95e72debaf8?auto=format&fit=crop&w=800&q=80", rating: 4.6, description: "Classic roll with crab, avocado, and cucumber." },
    { id: 27, name: "Salmon Nigiri", price: 3200, category: "Sushi", image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=800&q=80", rating: 4.9, description: "Elegant slices of fresh salmon over seasoned rice." },
    { id: 28, name: "Dragon Roll", price: 3500, category: "Sushi", image: dragonRollImg, rating: 4.9, description: "Unagi and cucumber topped with avocado slices." },

    // Soup
    { id: 29, name: "Lobster Bisque", price: 2100, category: "Soup", image: lobsterBisqueImg, rating: 4.8, description: "Rich and creamy lobster soup with a touch of brandy." },
    { id: 30, name: "Creamy Tomato Soup", price: 1200, category: "Soup", image: tomatoSoupImg, rating: 4.3, description: "Classic tomato soup served with a swirl of cream." },
    { id: 31, name: "Chicken Sweet Corn", price: 1400, category: "Soup", image: sweetCornImg, rating: 4.4, description: "Hearty soup with shredded chicken and sweet corn." },
    { id: 32, name: "Hot & Sour Soup", price: 1500, category: "Soup", image: hotSourImg, rating: 4.5, description: "Spicy and tangy soup with mushrooms and tofu." },

    // Briyani
    { id: 33, name: "Chicken Briyani", price: 1500, category: "Briyani", rating: 4.8, image: chickenBriyani, description: "Fragrant basmati rice layered with spicy marinated chicken." },
    { id: 34, name: "Mutton Briyani", price: 2200, category: "Briyani", rating: 4.9, image: muttonBriyani, description: "Tender mutton cooked with aromatic spices and golden rice." },
    { id: 35, name: "Seafood Briyani", price: 2500, category: "Briyani", rating: 4.7, image: seafoodBriyani, description: "A premium mix of seafood in a flavorful briyani base." },
    { id: 36, name: "Cheese Briyani", price: 1800, category: "Briyani", rating: 4.6, image: cheeseBriyani, description: "A unique fusion of briyani rice with melted cheese layers." },

    // Fried Rice
    { id: 37, name: "Chicken Fried Rice", price: 1200, category: "Fried Rice", rating: 4.7, image: chickenFriedRice, description: "Classic stir-fried rice with tender chicken pieces." },
    { id: 38, name: "Seafood Fried Rice", price: 1800, category: "Fried Rice", rating: 4.8, image: seafoodFriedRice, description: "Delicious fried rice packed with fresh ocean treats." },
    { id: 39, name: "Mixed Fried Rice", price: 1600, category: "Fried Rice", rating: 4.9, image: mixedFriedRice, description: "A perfect blend of chicken, seafood, and vegetables." },
    { id: 40, name: "Egg Fried Rice", price: 900, category: "Fried Rice", rating: 4.5, image: eggFriedRice, description: "Simple and satisfying fried rice with fluffy eggs." },

    // Kothu
    { id: 41, name: "Dolphin Kothu", price: 1800, category: "Kothu", rating: 4.9, image: dolphinKothu, description: "Creamy and spicy parotta cubes mixed with gravy." },
    { id: 42, name: "Cheese Kothu", price: 1500, category: "Kothu", rating: 4.8, image: cheeseKothu, description: "Kothu parotta loaded with rich, melted cheese." },
    { id: 43, name: "Chicken Kothu", price: 1300, category: "Kothu", rating: 4.7, image: chickenKothu, description: "Shredded parotta stir-fried with spicy chicken curry." },
    { id: 44, name: "Seafood Kothu", price: 1900, category: "Kothu", rating: 4.8, image: seafoodKothu, description: "Sri Lankan classic kothu with a variety of seafood." }
  ];

  const recommendedItems = activeReservation ? menuItems.filter(item => {
    if (activeReservation.tableType === 'Local') {
      // Local Sri Lankan specialties (Briyani & Kothu)
      return item.category === 'Briyani' || item.category === 'Kothu' || item.category === 'Fried Rice';
    } else if (activeReservation.tableType === 'VIP') {
      // Premium luxurious items (Steak, Sushi Dragon Roll, Lobster Bisque, Truffle Mushroom Pasta)
      return (
        item.category === 'Steak' || 
        item.id === 28 || // Dragon Roll
        item.id === 29 || // Lobster Bisque
        item.id === 17    // Truffle Mushroom Pasta
      );
    } else if (activeReservation.tableType === 'Foreign') {
      // Mild, English-friendly items (Burger, Pasta Alfredo, Pizza Margherita, California Roll)
      return (
        item.category === 'Burger' ||
        item.id === 18 || // Creamy Alfredo Pasta
        item.id === 21 || // Margherita Pizza
        item.id === 26    // California Roll
      );
    }
    return false;
  }).slice(0, 4) : [];

  const categories = ["All", "Briyani", "Fried Rice", "Kothu", "Burger", "Chicken", "Noodles", "Steak", "Pasta", "Pizza", "Sushi", "Soup"];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
        border: '1px solid rgba(234, 179, 8, 0.2)'
      },
    });
  };

  return (
    <div className="relative pt-24 pb-20 bg-[#050505] text-white min-h-screen custom-scrollbar">
      {/* Subtle Background Image behind the header area */}
      <div className="absolute top-0 left-0 right-0 h-[380px] overflow-hidden z-0 pointer-events-none select-none">
        <img 
          src={menuHeaderBg} 
          alt="Menu Header Background" 
          className="w-full h-full object-cover opacity-15"
        />
        {/* Soft overlays to blend image edges into solid background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
      </div>

      {/* Table Identification Banner */}
      {tableNumber && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-24 left-0 right-0 z-50 px-4 lg:px-8 pointer-events-none"
        >
          <div className="max-w-[1600px] mx-auto flex justify-end">
            <div className="bg-primary/20 backdrop-blur-xl border border-primary/30 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-glow pointer-events-auto">
              <QrCode className="text-primary animate-pulse" size={24} />
              <div className="text-left">
                <p className="text-[10px] text-primary/70 font-black uppercase tracking-widest leading-none mb-1">Active Table</p>
                <p className="text-xl font-black text-primary leading-none">#{tableNumber}</p>
              </div>
              <div className="w-px h-8 bg-primary/20 mx-2"></div>
              <button 
                onClick={() => setTableNumber(null)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Exit Table Mode"
              >
                <Info size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-16"
      >
        <h1 className="text-6xl font-black mb-6 tracking-tight">
          Our <span className="text-primary">Menu</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed px-4 font-medium italic">
          Explore our wide variety of premium dishes, crafted with the finest ingredients to satisfy every craving.
        </p>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16 px-4 lg:px-8 max-w-[1600px] mx-auto sticky top-24 z-30 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative w-full lg:w-[450px] group"
        >
          <input
            type="text"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-14 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all shadow-2xl backdrop-blur-xl group-hover:bg-white/10"
          />
          <Search className="absolute left-5 top-4 text-primary group-hover:scale-110 transition-transform" size={22} />
        </motion.div>

        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide px-2">
          <div className="bg-primary/20 p-3 rounded-xl border border-primary/30 text-primary flex-shrink-0">
            <Filter size={20} />
          </div>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-xl whitespace-nowrap transition-all text-sm font-bold border ${activeCategory === category
                ? 'bg-primary text-black border-primary shadow-glow scale-105'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Personalized Recommendations Section */}
      {activeReservation && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 px-4 lg:px-8 max-w-[1600px] mx-auto"
        >
          <div className={`bg-gradient-to-r ${
            activeReservation.tableType === 'VIP' ? 'from-yellow-500/10 via-amber-500/5' : 
            activeReservation.tableType === 'Local' ? 'from-orange-500/10 via-amber-500/5' : 
            'from-blue-500/10 via-cyan-500/5'
          } to-transparent border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl`}>
            <div className={`absolute top-0 right-0 w-64 h-64 ${
              activeReservation.tableType === 'VIP' ? 'bg-yellow-500/5' : 
              activeReservation.tableType === 'Local' ? 'bg-orange-500/5' : 
              'bg-blue-500/5'
            } rounded-full blur-[80px] -z-10`}></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div>
                <div className={`flex items-center gap-2 mb-2 ${
                  activeReservation.tableType === 'VIP' ? 'text-yellow-500' : 
                  activeReservation.tableType === 'Local' ? 'text-orange-500' : 
                  'text-blue-400'
                } font-bold uppercase tracking-widest text-[10px] sm:text-xs`}>
                  <Sparkles size={16} className="animate-spin" />
                  Personalized Dining Guide
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white italic leading-tight">
                  Curated for your <span className={
                    activeReservation.tableType === 'VIP' ? 'text-yellow-500' : 
                    activeReservation.tableType === 'Local' ? 'text-orange-500' : 
                    'text-blue-400'
                  }>{activeReservation.tableType} Experience</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1.5 max-w-xl font-medium">
                  {activeReservation.tableType === 'Local' && 'Experience authentic Sri Lankan spices and hand-picked traditional favorites prepared traditional-style.'}
                  {activeReservation.tableType === 'VIP' && 'Indulge in our most exquisite, premium, and luxurious chef specialties made for VIP tables.'}
                  {activeReservation.tableType === 'Foreign' && 'Savor mild, perfectly balanced continental choices with English-friendly flavor profiles.'}
                </p>
              </div>
              
              <button 
                onClick={() => clearActiveReservation()}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all uppercase tracking-wider self-start md:self-center"
              >
                Clear Guide
              </button>
            </div>

            {/* Recommended Items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {recommendedItems.map(item => (
                <div key={`rec-${item.id}`} className="bg-black/40 border border-white/5 rounded-3xl p-4 flex flex-col h-full hover:border-white/20 transition-all duration-300 group">
                  <div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-gray-900 shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className={`absolute top-2 right-2 text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg ${
                      activeReservation.tableType === 'VIP' ? 'bg-yellow-500' : 
                      activeReservation.tableType === 'Local' ? 'bg-orange-500' : 
                      'bg-blue-400'
                    }`}>
                      {activeReservation.tableType} Rec
                    </div>
                  </div>
                  <h4 className="font-black text-white text-base group-hover:text-primary transition-colors leading-tight mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-grow italic font-medium">{item.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                    <span className="text-primary font-black text-lg">Rs. {item.price.toLocaleString()}</span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className={`p-2.5 rounded-xl text-black font-bold text-xs transition-all shadow-glow hover:scale-105 active:scale-95 ${
                        activeReservation.tableType === 'VIP' ? 'bg-yellow-500' : 
                        activeReservation.tableType === 'Local' ? 'bg-orange-500' : 
                        'bg-blue-400'
                      }`}
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-20 px-4 lg:px-8 max-w-[1600px] mx-auto min-h-[600px]">
        <AnimatePresence mode='popLayout'>
          {loading ? (
            // Skeletons
            [...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="glass-card p-5 flex flex-col h-full border border-white/5 bg-[#0f0f0f] rounded-[2.5rem]">
                <div className="h-64 rounded-[2rem] mb-6 skeleton"></div>
                <div className="h-8 w-3/4 mb-3 skeleton"></div>
                <div className="h-4 w-full mb-6 skeleton"></div>
                <div className="mt-auto h-12 w-full skeleton"></div>
              </div>
            ))
          ) : (
            filteredItems.map((item, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={item.id} 
                className="glass-card group p-5 flex flex-col h-full border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl bg-[#0f0f0f] relative overflow-hidden rounded-[2.5rem]"
              >
                <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6 bg-gray-900 shadow-inner group-hover:shadow-2xl transition-all">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <Star size={12} className="text-primary" fill="currentColor" />
                    <span className="text-xs font-black">{item.rating}</span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow px-2">
                  <h3 className="text-2xl font-black text-white leading-tight group-hover:text-primary transition-colors duration-300 mb-3">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed font-medium italic">
                    {item.description}
                  </p>

                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary font-black text-3xl tracking-tighter">Rs. {item.price.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all font-black flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95"
                      >
                        <ShoppingBag size={14} />
                        Cart
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
                        className="py-4 rounded-2xl bg-gradient-to-br from-primary to-primaryHover text-black font-black flex justify-center items-center gap-2 text-[10px] shadow-glow hover:shadow-glow-strong transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.2em]"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 text-gray-400 glass-card mx-8 rounded-[3rem] border-white/5 bg-white/[0.02]"
        >
          <Search size={64} className="mx-auto mb-6 text-primary/20" />
          <p className="text-2xl font-bold mb-4">No items found matching your search.</p>
          <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="text-primary font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Menu;
