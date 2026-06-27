import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';
import { useOrder } from '../context/OrderContext';
import { useUserAuth } from '../context/UserAuthContext';
import { 
  ShoppingBag, Sparkles, QrCode, ArrowLeft, Plus, Minus, Trash2, 
  MapPin, Crown, Globe, ShieldCheck, ChevronRight, X, Phone, ClipboardList 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import QrAccessRestriction from '../components/QrAccessRestriction';

// Local Image Imports
import chickenBriyani from '../assets/images/chicken-briyani.jpg';
import eggFriedRice from '../assets/images/egg-fried-rice.webp';
import seafoodFriedRice from '../assets/images/seafood-fried-rice.jpg';
import dolphinKothu from '../assets/images/dolphin-kothu.jpg';
import cheeseKothu from '../assets/images/cheese-kothu.jpg';
import chickenKothu from '../assets/images/chicken-kothu.jpg';
import beefBurgerImg from '../assets/images/classic-beef-burger.jpg';
import grilledImg from '../assets/images/grilled-chicken.jpg';
import alfredoPasta from '../assets/images/creamy-alfredo-pasta.jpg';
import steakBites from '../assets/images/garlic-butter-steak-bites.jpg';

// Local Dining qrcode scan imports
import beefSmoreCurryImg from '../assets/images/qrcode scan/Beef Smore Curry.jpg';
import curriedCashewNutsImg from '../assets/images/qrcode scan/Curried Cashew Nuts.jpg';
import dhalCurryImg from '../assets/images/qrcode scan/Dhal Curry (Parippu).jpg';
import eggHoppersImg from '../assets/images/qrcode scan/Egg Hoppers.jpg';
import fishAmbulThiyalImg from '../assets/images/qrcode scan/Fish Ambul Thiyal.jpg';
import hoppersImg from '../assets/images/qrcode scan/Hoppers.webp';
import muttonKottuImg from '../assets/images/qrcode scan/Mutton Kottu.jpg';
import polRotiImg from '../assets/images/qrcode scan/Pol Roti & Lunu Miris.jpg';
import riceAndCurryImg from '../assets/images/qrcode scan/Rice & Curry.jpg';
import seafoodKottuImg from '../assets/images/qrcode scan/Seafood Kottu.jpg';
import crabCurryImg from '../assets/images/qrcode scan/Sri Lankan Crab Curry.jpg';
import stringHoppersImg from '../assets/images/qrcode scan/String Hoppers.jpg';
import watalappanImg from '../assets/images/qrcode scan/Watalappan.jpg';

// Foreign Dining qrcode scan imports
import coconutRiceImg from '../assets/images/qrcode scan forien/Coconut Rice.jpg';
import fruitSaladImg from '../assets/images/qrcode scan forien/Fresh Tropical Fruit Salad.jpg';
import roastedTomatoSoupImg from '../assets/images/qrcode scan forien/Roasted Tomato Soup.jpg';
import seafoodPlatterImg from '../assets/images/qrcode scan forien/Seafood Platter.jpg';
import chickenCurryMildImg from '../assets/images/qrcode scan forien/Sri Lankan Chicken Curry (Mild).jpg';
import toastedGarlicBreadImg from '../assets/images/qrcode scan forien/Toasted Garlic Bread.jpg';

// Beverages qrcode scan imports
import drinkSevenUpImg from '../assets/images/Beverages/7UP.jpg';
import drinkSpriteImg from '../assets/images/Beverages/Sprite.jpg';
import drinkFantaImg from '../assets/images/Beverages/fanta.jpg';
import drinkMangoJuiceImg from '../assets/images/Beverages/mango juice.jpg';

const SmartDiningMenu = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { reservations, updateReservationStatus, checkInReservation, parseReservationDateTime } = useReservation();
  const { addOrder } = useOrder();
  const { user } = useUserAuth();

  const tableParam = searchParams.get('table') || 'T01';
  const reservationParam = searchParams.get('reservation') || 'RES-001';
  const experienceParam = searchParams.get('experience') || 'local';

  const [reservation, setReservation] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Form State
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restrictionStatus, setRestrictionStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fallback image helper related to food categories
  const getFallbackImage = (item) => {
    if (item.id && item.id.startsWith('drink')) {
      return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600'; // Refreshing Mocktail/Juice
    }
    if (item.id && item.id.startsWith('vip')) {
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600'; // Luxury Plate
    }
    if (item.id && item.id.startsWith('foreign')) {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600'; // Western Gourmet
    }
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600'; // Local Rice & Curry
  };

  useEffect(() => {
    if (!tableParam || !reservationParam) {
      setErrorMsg('Invalid URL. Missing Table Number or Reservation ID.');
      setRestrictionStatus('Invalid');
      return;
    }

    const foundRes = reservations.find(r => r.id === reservationParam);
    if (!foundRes) {
      setErrorMsg(`Reservation ID #${reservationParam} not found in our system.`);
      setRestrictionStatus('Invalid');
      return;
    }

    // Check for Completed, Cancelled, or Expired first
    if (foundRes.status === 'Completed' || foundRes.status === 'Cancelled' || foundRes.status === 'Expired') {
      setRestrictionStatus(foundRes.status);
      return;
    }

    // If the reservation is Pending, show pending status (Reservation Pending Approval)
    // Pending reservations should NOT show Expired or check table mismatch.
    if (foundRes.status === 'Pending') {
      setRestrictionStatus('Pending');
      return;
    }

    // Verify table matching if Confirmed
    if (foundRes.status === 'Confirmed') {

      const allocatedTableClean = (foundRes.allocatedTable || '').trim().toLowerCase();
      const scannedTableClean = (tableParam || '').trim().toLowerCase();

      if (allocatedTableClean !== scannedTableClean) {
        setErrorMsg(`Table mismatch. Reservation #${reservationParam} is allocated to Table ${foundRes.allocatedTable || 'None'}, but scanned Table ${tableParam}.`);
        setRestrictionStatus('Invalid');
        return;
      }

      // If they bypassed Landing Page but have a valid session, check them in
      if (!foundRes.checkedIn) {
        checkInReservation(foundRes.id);
      }
    }

    setReservation(foundRes);
    setRestrictionStatus(null); // Clear restriction if it is valid now
    if (foundRes.phone) setPhone(foundRes.phone);
  }, [tableParam, reservationParam, reservations]);

  if (restrictionStatus) {
    return <QrAccessRestriction status={restrictionStatus} errorMsg={errorMsg} />;
  }

  // MENU ITEMS DATA DEFINITIONS
  const LOCAL_MENU = [
    {
      id: 'local-1',
      name: 'Kottu',
      price: 1000,
      image: dolphinKothu,
      desc: 'A Sri Lankan street-food classic made of chopped parotta bread, stir-fried vegetables, and aromatic island spices.'
    },
    {
      id: 'local-2',
      name: 'Chicken Kottu',
      price: 1200,
      image: chickenKothu,
      desc: 'Shredded parotta bread stir-fried with juicy chicken curry, farm eggs, onion, and freshly ground Sri Lankan spices.'
    },
    {
      id: 'local-3',
      name: 'Cheese Kottu',
      price: 1400,
      image: cheeseKothu,
      desc: 'A rich, creamy, and indulgent fusion of shredded parotta, melting cheddar/mozzarella, vegetables, and hot green chillies.'
    },
    {
      id: 'local-4',
      name: 'Fried Rice',
      price: 1100,
      image: eggFriedRice,
      desc: 'Fluffy stir-fried jasmine rice with scrambled eggs, fresh farm carrots, leeks, and chicken, served with spicy chili paste.'
    },
    {
      id: 'local-5',
      name: 'Chicken Biryani',
      price: 1500,
      image: chickenBriyani,
      desc: 'Aromatic basmati rice layered with spice-marinated chicken, boiled egg, caramelized onions, and cashew nut garnish.'
    },
    {
      id: 'local-6',
      name: 'Rice & Curry',
      price: 800,
      image: riceAndCurryImg,
      desc: 'Authentic Sri Lankan rice served with 5 traditional curries, including coconut sambol, dhal, and chicken curry.'
    },
    {
      id: 'local-7',
      name: 'String Hoppers',
      price: 600,
      image: stringHoppersImg,
      desc: '15 delicate, steamed rice flour string noodle discs served with spicy red coconut pol sambol and classic potato sodhi curry.'
    },
    {
      id: 'local-8',
      name: 'Hoppers',
      price: 500,
      image: hoppersImg,
      desc: 'Bowl-shaped crispy-edged fermented rice batter pancakes. Includes 3 plain hoppers and 1 farm egg hopper served with lunu miris.'
    },
    {
      id: 'local-9',
      name: 'Seafood Rice',
      price: 1600,
      image: seafoodFriedRice,
      desc: 'Premium jasmine rice wok-fried with fresh lagoon prawns, cuttlefish ring, ocean fish cubes, and Sri Lankan spice blends.'
    },
    {
      id: 'local-10',
      name: 'Devilled Chicken',
      price: 1300,
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600',
      desc: 'Crispy fried chicken bites tossed with capsicums, onions, and tomatoes in a sweet, sour, and fiery Sri Lankan devil sauce.'
    },
    {
      id: 'local-11',
      name: 'Mutton Kottu',
      price: 1800,
      image: muttonKottuImg,
      desc: 'Shredded parotta flatbread stir-fried with rich, aromatic mutton curry, farm eggs, and local spices.'
    },
    {
      id: 'local-12',
      name: 'Seafood Kottu',
      price: 1900,
      image: seafoodKottuImg,
      desc: 'Local parotta strips wok-tossed with crab meat, prawns, calamari rings, and rich seafood gravy.'
    },
    {
      id: 'local-13',
      name: 'Fish Ambul Thiyal',
      price: 1200,
      image: fishAmbulThiyalImg,
      desc: 'Traditional sour and peppery dry fish curry, simmered with dried garcinia (goraka) and local herbs.'
    },
    {
      id: 'local-14',
      name: 'Dhal Curry (Parippu)',
      price: 500,
      image: dhalCurryImg,
      desc: 'Yellow split lentils cooked in creamy coconut milk with fresh turmeric, mustard seeds, and curry leaves.'
    },
    {
      id: 'local-15',
      name: 'Egg Hoppers',
      price: 600,
      image: eggHoppersImg,
      desc: 'Three bowl-shaped crispy hoppers including a central farm egg hopper, served with hot spicy lunu miris.'
    },
    {
      id: 'local-16',
      name: 'Sri Lankan Crab Curry',
      price: 3200,
      image: crabCurryImg,
      desc: 'Fiery lagoon crab cooked with roasted spice blends, murunga leaves, lemongrass, and thick coconut milk.'
    },
    {
      id: 'local-17',
      name: 'Pol Roti & Lunu Miris',
      price: 450,
      image: polRotiImg,
      desc: 'Four thick rustic flatbreads made with fresh grated coconut and green chillies, served with spicy onion-chilli paste.'
    },
    {
      id: 'local-18',
      name: 'Watalappan',
      price: 700,
      image: watalappanImg,
      desc: 'Steamed coconut custard sweetened with dark kithul jaggery, cardamom, nutmeg, and cashew nut toppings.'
    },
    {
      id: 'local-19',
      name: 'Curried Cashew Nuts',
      price: 1500,
      image: curriedCashewNutsImg,
      desc: 'Whole raw cashews slow-cooked in a mild, aromatic coconut milk gravy with green peas.'
    },
    {
      id: 'local-20',
      name: 'Beef Smore Curry',
      price: 1600,
      image: beefSmoreCurryImg,
      desc: 'A rich beef pot roast slow-cooked in traditional island spices and a thick cardamom-infused gravy.'
    }
  ];

  const FOREIGN_MENU = [
    {
      id: 'foreign-1',
      name: 'Sri Lankan Chicken Curry (Mild)',
      price: 1400,
      image: chickenCurryMildImg,
      desc: 'A mild, aromatic chicken curry simmered in rich coconut milk, infused with lemongrass and pandan leaf. Very low spice.',
      spiceLevel: 1,
      recommended: true
    },
    {
      id: 'foreign-2',
      name: 'Coconut Rice',
      price: 1100,
      image: coconutRiceImg,
      desc: 'Fragrant jasmine rice cooked in fresh, light coconut milk. Perfect pairing for any mild curry.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-3',
      name: 'Grilled Chicken',
      price: 1800,
      image: grilledImg,
      desc: 'Tender double-breasted chicken marinated in mild garden herbs and olive oil, served with creamy mashed potatoes and buttered greens.',
      spiceLevel: 0,
      recommended: true
    },
    {
      id: 'foreign-4',
      name: 'Seafood Platter',
      price: 3500,
      image: seafoodPlatterImg,
      desc: 'A mild, flame-grilled selection of buttered prawns, ocean fish fillets, and calamari rings, served with a zesty lemon-garlic butter sauce.',
      spiceLevel: 0,
      recommended: true
    },
    {
      id: 'foreign-5',
      name: 'Creamy Pasta',
      price: 1600,
      image: alfredoPasta,
      desc: 'Fettuccine pasta tossed in a rich, buttery garlic parmesan cream sauce, garnished with fresh parsley and shaved cheese.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-6',
      name: 'Signature Burger',
      price: 1700,
      image: beefBurgerImg,
      desc: 'Premium grilled beef patty topped with cheddar cheese, crisp lettuce, tomatoes, and chef\'s sweet burger relish in a toasted brioche bun.',
      spiceLevel: 0,
      recommended: true
    },
    {
      id: 'foreign-7',
      name: 'Classic Margherita Pizza',
      price: 1900,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600',
      desc: 'Stone-baked thin crust pizza topped with rich tomato sauce, fresh buffalo mozzarella, and aromatic basil leaves.',
      spiceLevel: 0,
      recommended: true
    },
    {
      id: 'foreign-8',
      name: 'Gourmet Caesar Salad',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600',
      desc: 'Crisp romaine lettuce tossed with creamy Caesar dressing, garlic croutons, and thin shaved parmigiano-reggiano.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-9',
      name: 'Roasted Tomato Soup',
      price: 1000,
      image: roastedTomatoSoupImg,
      desc: 'A smooth and velvety soup made from slow-roasted vine tomatoes, fresh garlic, and basil cream, served with warm baguette.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-10',
      name: 'Crispy French Fries',
      price: 800,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=600',
      desc: 'Golden-brown, skin-on potato fries cooked to a perfect crunch and lightly dusted with sea salt.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-11',
      name: 'Grilled Salmon Fillet',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600',
      desc: 'Atlantic salmon fillet grilled with garlic-dill butter, served with steamed asparagus and citrus wedge.',
      spiceLevel: 0,
      recommended: true
    },
    {
      id: 'foreign-12',
      name: 'Creamy Mushroom Risotto',
      price: 2400,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600',
      desc: 'Italian arborio rice cooked slow with a blend of wild forest mushrooms, garlic, and fresh parmesan cheese.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-13',
      name: 'Golden Chicken Nuggets',
      price: 1100,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600',
      desc: 'Crispy breaded breast meat nuggets served with a side of sweet honey-mustard dip.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-14',
      name: 'Leafora Club Sandwich',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=600',
      desc: 'Double-decker sandwich with grilled chicken breast, hard-boiled egg, fresh lettuce, tomatoes, and garlic aioli.',
      spiceLevel: 0,
      recommended: true
    },
    {
      id: 'foreign-15',
      name: 'Spicy Pepperoni Pizza',
      price: 2400,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600',
      desc: 'Topped with generous slices of premium beef pepperoni, melting mozzarella cheese, and red pepper flakes.',
      spiceLevel: 1,
      recommended: false
    },
    {
      id: 'foreign-16',
      name: 'Spaghetti Bolognese',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600',
      desc: 'Classic Italian pasta tossed in a rich, slow-simmered minced beef ragu and topped with fresh basil.',
      spiceLevel: 0,
      recommended: true
    },
    {
      id: 'foreign-17',
      name: 'Toasted Garlic Bread',
      price: 700,
      image: toastedGarlicBreadImg,
      desc: 'Slices of rustic baguette baked with creamy garlic herb butter and melting mozzarella.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-18',
      name: 'Warm Fudge Brownie',
      price: 900,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600',
      desc: 'Decadent chocolate brownie served warm with a scoop of premium vanilla bean gelato.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-19',
      name: 'Fresh Tropical Fruit Salad',
      price: 1000,
      image: fruitSaladImg,
      desc: 'Refreshing medley of local pineapple, papaya, watermelon, and passion fruit seeds.',
      spiceLevel: 0,
      recommended: false
    },
    {
      id: 'foreign-20',
      name: 'Baked Vegetable Lasagna',
      price: 2100,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=600',
      desc: 'Baked pasta sheets layered with roasted zucchini, bell peppers, spinach, creamy bechamel, and marinara sauce.',
      spiceLevel: 0,
      recommended: false
    }
  ];

  const VIP_MENU = [
    {
      id: 'vip-1',
      name: 'Wagyu Steak',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      desc: 'Exquisite, highly marbled A5 Japanese Wagyu steak seared on hot stone, served with black truffle compound butter and edible gold foil.'
    },
    {
      id: 'vip-2',
      name: 'Premium Grilled Steak',
      price: 7500,
      image: steakBites,
      desc: 'Prime USDA dry-aged ribeye steak seared with rosemary garlic butter, served with red wine reduction and roasted asparagus.'
    },
    {
      id: 'vip-3',
      name: 'Lobster Platter',
      price: 9500,
      image: 'https://images.unsplash.com/photo-1553163147-622ab57b6874?q=80&w=600',
      desc: 'Whole fresh ocean lobster baked thermidor-style with cognac, wild mushrooms, and parmesan cheese crust, served with a citrus salad.'
    },
    {
      id: 'vip-4',
      name: 'Jumbo Prawns',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1559737225-33d1a957a85d?q=80&w=600',
      desc: 'Wood-fired giant tiger prawns glazed with lime-herb butter, accompanied by saffron-infused pilaf and grilled vine tomatoes.'
    },
    {
      id: 'vip-5',
      name: 'Seafood Tower',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600',
      desc: 'An extravagant double-decker raw & grill tower featuring whole lobster, oysters, king prawns, mud crab claws, and marinated green mussels.'
    },
    {
      id: 'vip-6',
      name: 'Chef Special Dishes',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600',
      desc: 'A surprise bespoke dish created live by our Executive Chef, using rare, hand-harvested ingredients in an artistic presentation.'
    },
    {
      id: 'vip-7',
      name: 'Luxury Desserts',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600',
      desc: 'Valrhona chocolate warm lava cake, filled with raspberry core, topped with Madagascar vanilla bean gelato and gold leaf sheets.'
    },
    {
      id: 'vip-8',
      name: 'Signature Mocktails',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600',
      desc: 'Exquisite handcrafted botanical mocktails blended with fresh exotic ingredients, rose hydrosol, and sparkling edible gold dust.'
    },
    {
      id: 'vip-9',
      name: 'Beluga Caviar Experience',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600',
      desc: '30g of premium Beluga Caviar served on ice, accompanied by traditional blinis, chives, boiled egg whites, and crème fraîche.'
    },
    {
      id: 'vip-10',
      name: 'Black Truffle Carpaccio',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      desc: 'Paper-thin slices of dry-aged Wagyu tenderloin topped with fresh shaved black truffles, wild arugula, and aged parmesan.'
    },
    {
      id: 'vip-11',
      name: 'Seared Foie Gras Royale',
      price: 9000,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600',
      desc: 'Pan-seared A-grade duck liver served over brioche toast with caramelized mission figs and a rich port wine reduction.'
    },
    {
      id: 'vip-12',
      name: 'Baked Oysters Rockefeller',
      price: 7000,
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600',
      desc: 'Six fresh half-shell oysters baked with buttered spinach, herbs, and breadcrumbs, finished with hollandaise sauce.'
    },
    {
      id: 'vip-13',
      name: 'Australian Lamb Rack',
      price: 11000,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      desc: 'Herb-crusted rack of Australian lamb roasted pink, served with sweet potato puree, red wine jus, and glazed shallots.'
    },
    {
      id: 'vip-14',
      name: 'Black Winter Truffle Tagliolini',
      price: 8800,
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=600',
      desc: 'House-made thin egg pasta tossed in Normandy butter sauce, completed with generous shavings of fresh black winter truffles.'
    },
    {
      id: 'vip-15',
      name: 'Chilean Seabass Grill',
      price: 10500,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600',
      desc: 'Patagonian toothfish fillet pan-seared in lemon-caper reduction, served with butter-poached baby vegetables.'
    },
    {
      id: 'vip-16',
      name: 'Imperial Dragon Sushi Roll',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600',
      desc: 'Premium roll of spicy bluefin tuna, cucumber, and barbecued eel, topped with avocado slices and edible gold dust.'
    },
    {
      id: 'vip-17',
      name: 'Cognac Lobster Bisque',
      price: 5200,
      image: 'https://images.unsplash.com/photo-1553163147-622ab57b6874?q=80&w=600',
      desc: 'A velvety smooth lobster soup infused with VSOP cognac, finished with butter-poached lobster claw meat.'
    },
    {
      id: 'vip-18',
      name: 'Truffled Forest Mushrooms',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=600',
      desc: 'Sautéed rare forest chanterelles and porcini mushrooms in cold-pressed white truffle oil and fresh herbs.'
    },
    {
      id: 'vip-19',
      name: 'VIP Exotic Fruit Platter',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1490818621748-5b128610f010?q=80&w=600',
      desc: 'Hand-selected organic seasonal berries, dragonfruit, mangosteen, and gold leaf-dusted fruits.'
    },
    {
      id: 'vip-20',
      name: 'Madagascar Crème Brûlée',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=600',
      desc: 'Traditional French egg custard baked with Madagascar vanilla beans, topped with a hard caramelized sugar crust.'
    }
  ];

  const DRINKS_MENU = [
    { id: 'drink-1', name: 'Water', price: 150, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600' },
    { id: 'drink-2', name: 'Coca-Cola', price: 250, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600' },
    { id: 'drink-3', name: 'Pepsi', price: 250, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=600' },
    { id: 'drink-4', name: 'Sprite', price: 250, image: drinkSpriteImg },
    { id: 'drink-5', name: '7UP', price: 250, image: drinkSevenUpImg },
    { id: 'drink-6', name: 'Fanta', price: 250, image: drinkFantaImg },
    { id: 'drink-7', name: 'Fresh Lime Juice', price: 350, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600' },
    { id: 'drink-8', name: 'Orange Juice', price: 450, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600' },
    { id: 'drink-9', name: 'Mango Juice', price: 500, image: drinkMangoJuiceImg }
  ];

  // Pick active food items
  const foodItems = 
    experienceParam === 'vip' ? VIP_MENU :
    experienceParam === 'foreign' ? FOREIGN_MENU :
    LOCAL_MENU;

  // Experience details styling
  const expDetails = {
    local: {
      title: 'Sri Lankan Dining',
      badge: '🇱🇰 Authentic Local',
      desc: 'Traditional Sri Lankan street foods and specialty curries crafted with native spice blends.',
      accentClass: 'text-orange-500',
      badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    },
    foreign: {
      title: 'Foreign Friendly Dining',
      badge: '🌍 Continental & Mild',
      desc: 'Milder options, transparent English descriptions, and customizable low-spice levels.',
      accentClass: 'text-blue-400',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    vip: {
      title: 'VIP Dining Experience',
      badge: '👑 Royal Exclusive',
      desc: 'Ultra-premium ingredients, gold leaf presentations, and bespoke styling.',
      accentClass: 'text-yellow-500',
      badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }
  }[experienceParam] || expDetails.local;

  // Cart actions
  const addToCart = (product) => {
    if (!user) {
      localStorage.setItem('pendingAddToCart', JSON.stringify(product));
      toast.error('Please login to continue.', { id: 'login-toast' });
      navigate('/login', { state: { from: window.location.pathname + window.location.search } });
      return;
    }
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  const updateQuantity = (id, change) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.error('Item removed from cart', {
      style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = cartTotal * 0.08; // 8% GST
  const grandTotal = cartTotal + taxAmount;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Submit dine-in order
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!user) {
      toast.error('Please login to continue.', { id: 'login-toast' });
      navigate('/login', { state: { from: window.location.pathname + window.location.search } });
      return;
    }
    if (!phone) {
      toast.error('Please enter a phone number for verification.');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: reservation?.customerName || 'Reserved Guest',
      email: reservation?.email || 'guest@leafora.com',
      phone: phone,
      orderType: 'Reservation',
      tableNumber: tableParam,
      reservationId: reservationParam,
      notes: notes,
      totalAmount: grandTotal,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const response = await addOrder(orderPayload);
      setCart([]);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
      toast.success('Order placed successfully! Sending to kitchen...', { icon: '👨‍🍳' });
      navigate(`/smart-order-status/${response._id}`);
    } catch (err) {
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white font-sans pb-24 ${
      experienceParam === 'vip' ? 'border-t-4 border-yellow-500' : 
      experienceParam === 'foreign' ? 'border-t-4 border-blue-500' :
      'border-t-4 border-orange-500'
    }`}>
      {/* Background Gradients */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent pointer-events-none"></div>

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-4 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/qr-landing?table=${tableParam}&reservation=${reservationParam}`)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-gray-400 hover:text-white"
            title="Back to Welcome Screen"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
              Leafora <span className="text-yellow-500">Smart Dining</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              Table {tableParam} • {reservation?.customerName || 'Reserved Guest'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:scale-105 active:scale-95 text-black font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-glow"
        >
          <ShoppingBag size={15} strokeWidth={2.5} />
          <span>Cart</span>
          {cartItemCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center absolute -top-1.5 -right-1.5 border border-yellow-500 animate-bounce">
              {cartItemCount}
            </span>
          )}
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative">
        {/* Banner with active Dining experience info */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-[2rem] p-6 sm:p-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div>
            <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest mb-3 inline-block ${expDetails.badgeClass}`}>
              {expDetails.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight italic mb-2">
              {expDetails.title}
            </h1>
            <p className="text-gray-400 text-sm max-w-xl font-medium leading-relaxed">
              {expDetails.desc}
            </p>
          </div>
          <button 
            onClick={() => navigate(`/qr-landing?table=${tableParam}&reservation=${reservationParam}`)}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap self-stretch md:self-auto text-center"
          >
            Change Dining Style
          </button>
        </div>

        {/* FOOD GRID */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-black text-white tracking-tight mb-8 flex items-center gap-2 italic">
            <Sparkles className="text-yellow-500" size={20} />
            Chef Recommendation List
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodItems.map(item => (
              <div 
                key={item.id} 
                className={`group flex flex-col h-full rounded-[2.5rem] bg-[#0c0c0c] border overflow-hidden transition-all duration-300 shadow-2xl relative hover:scale-[1.02] hover:-translate-y-1 ${
                  experienceParam === 'vip' ? 'border-yellow-600/30 hover:border-yellow-500' : 'border-white/5 hover:border-yellow-500/30'
                }`}
              >
                {/* Image frame */}
                <div className="relative h-64 overflow-hidden bg-gray-900 shadow-inner group-hover:shadow-2xl transition-all">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackImage(item);
                    }}
                  />
                  {/* Badges / Indicators */}
                  {experienceParam === 'foreign' && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.recommended && (
                        <span className="px-3 py-1 bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          Recommended
                        </span>
                      )}
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded-full border border-white/10">
                        Spice: {'🌶️'.repeat(item.spiceLevel) || 'None'}
                      </span>
                    </div>
                  )}
                  {experienceParam === 'vip' && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-yellow-300">
                      VIP Selection
                    </div>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-white leading-tight font-serif group-hover:text-yellow-400 transition-colors mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed italic mb-6 font-medium flex-grow">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="text-2xl font-black text-yellow-500 tracking-tight">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-yellow-500 hover:text-black border border-white/10 hover:border-yellow-500 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 text-gray-300"
                    >
                      <Plus size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DRINKS SECTION */}
        <section className="mb-12">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>
          <h2 className="text-2xl font-serif font-black text-white tracking-tight mb-8 flex items-center gap-2 italic">
            <Sparkles className="text-yellow-500" size={20} />
            Refreshing Beverages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DRINKS_MENU.map(drink => (
              <div 
                key={drink.id} 
                className="flex items-center gap-5 p-4 rounded-[2rem] bg-[#0c0c0c] border border-white/5 hover:border-yellow-500/20 transition-all group shadow-xl"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/5 group-hover:rotate-2 transition-transform duration-300">
                  <img 
                    src={drink.image} 
                    alt={drink.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackImage(drink);
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-base group-hover:text-yellow-400 transition-colors leading-tight mb-1">{drink.name}</h4>
                  <p className="text-yellow-500 font-black text-sm">Rs. {drink.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(drink)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-yellow-500 hover:text-black transition-all font-bold text-xs shrink-0 hover:scale-105 active:scale-95 flex items-center text-gray-300 border border-white/10"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FLOATING CART SUMMARY (Shown when cart has items and drawer is closed) */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-6 inset-x-0 z-40 px-4 max-w-lg mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-[2rem] text-black font-black flex items-center justify-between shadow-[0_15px_40px_rgba(234,179,8,0.3)] hover:scale-[1.03] transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <div className="text-left leading-none">
                <p className="text-xs text-black/60 uppercase tracking-widest font-black mb-1">Your Order</p>
                <p className="text-lg font-black tracking-tight">{cartItemCount} Items added</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg">Rs. {cartTotal.toLocaleString()}</span>
              <ChevronRight size={18} />
            </div>
          </motion.div>
        </div>
      )}

      {/* CART DRAWER SLIDE OUT */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-[#0c0c0c] border-l border-white/5 flex flex-col shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div>
                  <h3 className="text-2xl font-serif font-black italic flex items-center gap-2 text-white">
                    <ShoppingBag size={22} className="text-yellow-500" /> My Cart
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Table {tableParam} • dine in</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4">
                    <ShoppingBag size={48} className="opacity-20 text-yellow-500" />
                    <p className="text-lg font-bold">Your cart is empty</p>
                    <p className="text-xs text-gray-600 max-w-[200px]">Add dishes from our recommendations above.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{item.name}</p>
                        <p className="text-xs text-yellow-500 font-bold">Rs. {item.price.toLocaleString()}</p>
                      </div>

                      {/* Quantity Adjusters */}
                      <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 text-xs font-black"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-yellow-500 hover:text-white hover:bg-yellow-500/20 text-xs font-black"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom calculations & proceed */}
              {cart.length > 0 && (
                <div className="border-t border-white/5 pt-6 mt-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                      <span>Subtotal</span>
                      <span className="text-white">Rs. {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                      <span>VAT / GST (8%)</span>
                      <span className="text-white">Rs. {taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider italic text-yellow-500">
                      <span>Dine-In Service Charge</span>
                      <span className="font-black text-emerald-500">FREE</span>
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
                      <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Total Bill</span>
                      <span className="text-3xl font-black text-yellow-500">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to continue.', { id: 'login-toast' });
                        navigate('/login', { state: { from: window.location.pathname + window.location.search } });
                        return;
                      }
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black uppercase text-xs tracking-widest shadow-glow flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    Proceed to Checkout <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CHECKOUT DRAWERS */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Checkout Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-[#0c0c0c] border-l border-white/5 flex flex-col shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div>
                  <h3 className="text-2xl font-serif font-black italic flex items-center gap-2 text-white">
                    <ShieldCheck size={22} className="text-yellow-500" /> Checkout
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Submit Order to Kitchen</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6 pr-1">
                  
                  {/* Summary Box */}
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-xs space-y-3 font-bold text-gray-400">
                    <p className="text-white text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">Verified Table Details</p>
                    <div className="flex justify-between">
                      <span>Customer Name:</span>
                      <span className="text-white">{reservation?.customerName || 'Reserved Guest'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Table Number:</span>
                      <span className="text-yellow-400 font-black">{tableParam}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reservation ID:</span>
                      <span className="text-white">{reservationParam}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dining Style:</span>
                      <span className="text-white capitalize">{experienceParam} Dining</span>
                    </div>
                  </div>

                  {/* Input fields */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 ml-1">Phone Number (Required)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="tel" 
                        required
                        placeholder="+94 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-all text-sm font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 ml-1">Special Notes for Kitchen (Optional)</label>
                    <div className="relative">
                      <ClipboardList className="absolute left-4 top-4 text-gray-500" size={18} />
                      <textarea 
                        rows={3}
                        placeholder="e.g. Allergy details, make it extra spicy, extra cutlery, etc."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-all text-sm font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/5 my-4"></div>

                  <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                    <p className="text-[10px] text-yellow-400 font-bold leading-normal">
                      🔒 No instant payment required. Your order will be queued to the kitchen instantly, and billing will be handled upon checkout.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6">
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Payable Amount</span>
                    <span className="text-3xl font-black text-yellow-500">Rs. {grandTotal.toLocaleString()}</span>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black uppercase text-xs tracking-widest shadow-glow flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Order...' : 'Confirm Order & Send to Kitchen'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartDiningMenu;
