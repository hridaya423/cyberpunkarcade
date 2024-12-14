import React from 'react';

const HolographicHeader: React.FC = () => {
  return (
    <header className="text-center py-16 relative group">
      <div 
        className="
          absolute 
          -top-24 
          left-1/2 
          -translate-x-1/2 
          w-96 h-96 
          bg-gradient-to-r 
          from-cyan-500/20 
          via-purple-500/20 
          to-green-500/20 
          rounded-full 
          blur-3xl
          animate-pulse
          group-hover:scale-110
          transition-transform
          duration-1000
        "
      />
      <h1 
        className="
          text-8xl 
          font-bold 
          text-transparent 
          bg-clip-text 
          bg-gradient-to-r 
          from-cyan-300 
          via-purple-400 
          to-green-300 
          mb-4 
          tracking-wider
          animate-text-shimmer
          relative
          transform 
          hover:scale-105 
          transition-transform 
          duration-500
          group-hover:text-shadow-[0_0_20px_rgba(255,255,255,0.3)]
        "
      >
        CYBER ARCADE
        <span 
          className="
            absolute 
            inset-0 
            text-transparent 
            bg-clip-text 
            bg-gradient-to-r 
            from-cyan-300 
            via-purple-400 
            to-green-300 
            opacity-30 
            blur-xl
            animate-pulse
          "
        >
          CYBER ARCADE
        </span>
      </h1>
      <p 
        className="
          text-xl 
          text-green-200 
          opacity-75 
          max-w-2xl 
          mx-auto 
          tracking-wide
          hover:tracking-widest
          transition-all
          duration-500
          group-hover:drop-shadow-[0_0_10px_rgba(20,255,20,0.5)]
        "
      >
        Transcend reality. Hack the impossible. Redefine digital existence.
      </p>
    </header>
  );
};

export default HolographicHeader;