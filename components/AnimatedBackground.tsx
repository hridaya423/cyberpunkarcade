import React from 'react';

interface AnimatedBackgroundProps {
  mousePosition: { x: number; y: number };
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ mousePosition }) => {
  const getDynamicBackgroundStyle = () => ({
    backgroundImage: `
      radial-gradient(
        circle at ${mousePosition.x}px ${mousePosition.y}px, 
        rgba(20,255,255,0.1) 0%, 
        transparent 50%
      ),
      linear-gradient(
        135deg, 
        rgba(20,255,20,0.03) 0%, 
        rgba(255,20,147,0.03) 50%,
        rgba(20,20,255,0.03) 100%
      ),
      repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.02) 0px, 
        rgba(255,255,255,0.02) 1px,
        transparent 1px, 
        transparent 10px
      )
    `,
    backgroundSize: '100% 100%, 100% 100%, 4px 4px',
    animation: 'backgroundPulse 10s ease infinite, subtleNoise 2s infinite'
  });

  return (
    <div 
      className="
        fixed 
        inset-0 
        z-0 
        opacity-90
        pointer-events-none
      "
      style={getDynamicBackgroundStyle()}
    />
  );
};

export default AnimatedBackground;