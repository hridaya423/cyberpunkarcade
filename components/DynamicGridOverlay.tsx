import React from 'react';

const DynamicGridOverlay: React.FC = () => {
  return (
    <div 
      className="
        fixed 
        inset-0 
        pointer-events-none 
        opacity-20
        z-0
      "
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(20,255,20,0.05) 25%, rgba(20,255,20,0.05) 26%, transparent 27%, transparent 74%, rgba(20,255,20,0.05) 75%, rgba(20,255,20,0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(20,255,20,0.05) 25%, rgba(20,255,20,0.05) 26%, transparent 27%, transparent 74%, rgba(20,255,20,0.05) 75%, rgba(20,255,20,0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '40px 40px',
        animation: 'moveGrid 15s linear infinite',
      }}
    />
  );
};

export default DynamicGridOverlay;
