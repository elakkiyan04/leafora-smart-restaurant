import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 relative">
      {/* Background blur overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-8">
        <Compass size={14} className="animate-spin" />
        Lost in Taste
      </div>

      <h1 className="text-9xl font-black text-white leading-none tracking-tighter mb-4 select-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
        404
      </h1>
      
      <h2 className="text-3xl md:text-4xl font-serif font-black text-white italic mb-6">
        Page Not <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Found</span>
      </h2>
      
      <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base leading-relaxed mb-10">
        It seems the culinary path you are looking for has been moved or doesn't exist. Let's get you back to the main dining room.
      </p>

      <Link 
        to="/" 
        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-black text-xs uppercase tracking-widest flex items-center gap-3.5 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:scale-105"
      >
        <Home size={15} strokeWidth={2.5} />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
