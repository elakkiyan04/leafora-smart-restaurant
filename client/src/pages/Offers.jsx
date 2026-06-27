import React from 'react';
import { Tag, Clock, Star } from 'lucide-react';

const Offers = () => {
  const offers = [
    {
      title: "Summer Feast",
      discount: "30% OFF",
      desc: "Get an exclusive discount on all our signature summer dishes.",
      expiry: "Valid until Aug 31",
      icon: <Tag className="text-orange-500" />
    },
    {
      title: "Family Combo",
      discount: "Rs. 2,000 SAVED",
      desc: "Perfect for a group of 4. Includes appetizers, main course, and desserts.",
      expiry: "Weekends Only",
      icon: <Star className="text-orange-500" />
    },
    {
      title: "Happy Hours",
      discount: "BUY 1 GET 1",
      desc: "Enjoy our premium cocktails and mocktails every evening.",
      expiry: "Daily 5PM - 7PM",
      icon: <Clock className="text-orange-500" />
    }
  ];

  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-6">
          Exclusive Deals
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
          Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Offers</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Indulge in luxury for less. Discover our latest seasonal deals and exclusive member rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {offers.map((offer, i) => (
          <div key={i} className="relative group overflow-hidden rounded-[2rem] bg-[#111] border border-white/5 p-8 hover:border-orange-500/50 transition-all duration-500 shadow-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
              {offer.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{offer.title}</h3>
            <div className="text-3xl font-black text-orange-500 mb-4">{offer.discount}</div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{offer.desc}</p>
            
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
              <Clock size={14} /> {offer.expiry}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
