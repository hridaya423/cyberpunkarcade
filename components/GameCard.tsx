import React from 'react';
import Link from 'next/link';

interface GameCardProps {
  game: {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    fullDescription: string;
    difficulty: string;
    color: string;
    tags: string[];
    background: string;
    complexity: number;
  };
  hoveredGame: string | null;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  hoveredGame, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const colorMap: Record<string, { hover: string; text: string; border: string }> = {
    cyan: { 
      hover: 'hover:shadow-cyan-500/50 border-cyan-500/30', 
      text: 'text-cyan-300', 
      border: 'border-cyan-500/30' 
    },
    purple: { 
      hover: 'hover:shadow-purple-500/50 border-purple-500/30', 
      text: 'text-purple-300', 
      border: 'border-purple-500/30' 
    },
    green: { 
      hover: 'hover:shadow-green-500/50 border-green-500/30', 
      text: 'text-green-300', 
      border: 'border-green-500/30' 
    }
  };

  const colorStyles = colorMap[game.color] || colorMap.green;

  return (
    <Link 
      href={`/games/${game.id}`}
      className={`
        group 
        relative 
        overflow-hidden 
        rounded-3xl 
        border-2 
        border-transparent
        ${colorStyles.hover}
        transition-all 
        duration-500 
        transform 
        hover:-translate-y-4 
        hover:shadow-2xl
        bg-gradient-to-br 
        ${game.background}
        p-8
        perspective-500
        hover:rotate-2
        hover:scale-[1.02]
        outline-none
        focus:ring-4
        focus:ring-${game.color}-500/50
      `}
      onMouseEnter={() => onMouseEnter(game.id)}
      onMouseLeave={onMouseLeave}
    >
      {/* Holographic Overlay */}
      <div 
        className={`
          absolute 
          inset-0 
          bg-${game.color}-500/10 
          opacity-0 
          group-hover:opacity-100 
          transition-opacity 
          duration-500 
          pointer-events-none
          mix-blend-color-dodge
        `}
      />

      {/* Game Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Icon Container */}
        <div 
          className={`
            mb-8 
            p-6 
            rounded-full 
            bg-black/40 
            border 
            ${colorStyles.border}
            group-hover:animate-spin
            transition-all
            group-hover:drop-shadow-[0_0_15px_rgba(${
              game.color === 'cyan' ? '20,255,255' :
              game.color === 'purple' ? '128,0,128' :
              game.color === 'green' ? '20,255,20' : '255,255,255'
            },0.5)]
          `}
        >
          {game.icon}
        </div>

        {/* Game Title */}
        <h2 
          className={`
            text-4xl 
            font-bold 
            mb-4 
            ${colorStyles.text}
            group-hover:text-white
            transition-colors
            tracking-wider
            hover:tracking-widest
            group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]
          `}
        >
          {game.name}
        </h2>

        {/* Description */}
        <p 
          className="
            text-green-200 
            text-center 
            mb-6 
            opacity-70
            group-hover:opacity-100
            transition-opacity
            text-lg
            hover:italic
          "
        >
          {hoveredGame === game.id ? game.fullDescription : game.description}
        </p>

        {/* Complexity Visualization */}
        <div className="flex space-x-2 mb-6">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className={`
                w-4 h-2 
                rounded-full 
                ${index < game.complexity 
                  ? `bg-${game.color}-500 animate-pulse` 
                  : 'bg-gray-700'}
                transition-all
                duration-500
              `}
            />
          ))}
        </div>

        {/* Tags */}
        <div className="flex space-x-2 mb-6">
          {game.tags.map((tag) => (
            <span 
              key={tag}
              className={`
                text-xs 
                px-3 py-1 
                rounded-full 
                bg-black/40 
                text-${game.color}-300
                border 
                ${colorStyles.border}
                hover:scale-110
                transition-transform
              `}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Difficulty */}
        <div 
          className={`
            bg-black/50 
            text-${game.color}-300 
            px-4 py-2 
            rounded-full 
            text-sm
            border 
            ${colorStyles.border}
            hover:animate-bounce
          `}
        >
          Complexity: {game.difficulty}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;