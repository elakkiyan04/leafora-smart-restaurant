import React from 'react';

const About = () => {
  return (
    <div className="py-20 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
        Our Story
      </div>
      <h1 className="text-5xl md:text-7xl font-black mb-8 text-white drop-shadow-2xl">
        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Leafora</span>
      </h1>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
        Founded with a passion for exceptional flavors and premium dining experiences. 
        Leafora brings together traditional techniques and modern innovation to create 
        unforgettable moments for every guest.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
        {[
          { title: "Premium Quality", desc: "We source only the finest organic ingredients." },
          { title: "Master Chefs", desc: "Expert culinary artists with years of experience." },
          { title: "Elegant Ambiance", desc: "A sophisticated atmosphere for your comfort." }
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all group">
            <h3 className="text-xl font-bold mb-4 text-white group-hover:text-orange-500 transition-colors">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
