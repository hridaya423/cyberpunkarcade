/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react';
import { 
    Gamepad2, Grid3x3, SquareEqual, 
    Zap, Target, Brain, 
    Crosshair, Trophy, Code, 
    Atom, Cpu, Layers, 
    GanttChartSquare, Webhook, 
    Orbit, FunctionSquare 
  } from 'lucide-react';
import GameCard from '../components/GameCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import DynamicGridOverlay from '@/components/DynamicGridOverlay';
import HolographicHeader from '@/components/HolographicHeader';

const CyberpunkArcadeDashboard: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const games = [
    {
        id: 'sudoku',
        name: 'Cyber Sudoku',
        icon: <Grid3x3 className="w-20 h-20 text-cyan-300 stroke-[1.5] group-hover:animate-pulse" />,
        description: 'Deconstruct digital logic matrices in quantum probability space',
        difficulty: 'Medium',
        color: 'cyan',
        tags: ['Neural', 'Quantum Logic'],
        background: 'from-cyan-900/50 to-cyan-700/30',
        glowColor: 'cyan',
        complexity: 4,
        fullDescription: 'Navigate intricate digital logic landscapes, where each number is a quantum state waiting to be collapsed.'
      },
      {
        id: 'tictactoe',
        name: 'Neon Conflict',
        icon: <SquareEqual className="w-20 h-20 text-purple-300 stroke-[1.5] group-hover:rotate-[360deg] transition-transform duration-1000" />,
        description: 'Minimal strategy. Maximum intensity.',
        difficulty: 'Easy',
        color: 'purple',
        tags: ['Strategic', 'Zero-Sum'],
        background: 'from-purple-900/50 to-purple-700/30',
        glowColor: 'purple',
        complexity: 2,
        fullDescription: 'A hyper-minimalist battlefield where every move ripples through digital dimensions.'
      },
      {
        id: 'snake',
        name: 'Circuit Serpent',
        icon: <Crosshair className="w-20 h-20 text-green-300 stroke-[1.5] group-hover:scale-110 transition-transform" />,
        description: 'Navigate infinite digital labyrinths',
        difficulty: 'Hard',
        color: 'green',
        tags: ['Adaptive', 'Survival'],
        background: 'from-green-900/50 to-green-700/30',
        glowColor: 'green',
        complexity: 5,
        fullDescription: 'An evolutionary survival algorithm where you are the code, the predator, and the prey.'
      },
      {
        id: 'chess',
        name: 'Digital Warfare',
        icon: <Cpu className="w-20 h-20 text-red-300 stroke-[1.5] group-hover:rotate-45 transition-transform" />,
        description: 'Strategic combat in digital realms',
        difficulty: 'Expert',
        color: 'red',
        tags: ['Strategic', 'AI-Driven'],
        background: 'from-red-900/50 to-red-700/30',
        glowColor: 'red',
        complexity: 5,
        fullDescription: 'A neural network battlefield where every move is a calculated algorithmic assault.'
      },
      {
        id: 'jigsaw-puzzle',
        name: 'Quantum Fragments',
        icon: <Layers className="w-20 h-20 text-orange-300 stroke-[1.5] group-hover:animate-spin" />,
        description: 'Reconstruct fragmented digital realities',
        difficulty: 'Hard',
        color: 'orange',
        tags: ['Spatial', 'Reconstruction'],
        background: 'from-orange-900/50 to-orange-700/30',
        glowColor: 'orange',
        complexity: 4,
        fullDescription: 'Piece together shattered digital landscapes, where each fragment holds a quantum of possibility.'
      },
      {
        id: '2048',
        name: 'Exponential Nexus',
        icon: <FunctionSquare className="w-20 h-20 text-indigo-300 stroke-[1.5] group-hover:scale-110 transition-transform" />,
        description: 'Exponential growth meets digital strategy',
        difficulty: 'Extreme',
        color: 'indigo',
        tags: ['Algorithmic', 'Growth'],
        background: 'from-indigo-900/50 to-indigo-700/30',
        glowColor: 'indigo',
        complexity: 5,
        fullDescription: 'A mathematical odyssey where numbers exponentially transform the digital landscape.'
      }
  ];

  return (
    <div 
      className="
        min-h-screen 
        bg-black 
        text-green-400 
        font-mono 
        overflow-hidden 
        relative
        perspective-1000
        selection:bg-purple-500 
        selection:text-black
      "
    >
      {/* Animated Background Components */}
      <AnimatedBackground mousePosition={mousePosition} />
      <DynamicGridOverlay />

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* Holographic Header */}
        <HolographicHeader />

        {/* Game Grid */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {games.map((game) => (
            <GameCard 
              key={game.id} 
              game={game}
              hoveredGame={hoveredGame}
              onMouseEnter={(id) => setHoveredGame(id)}
              onMouseLeave={() => setHoveredGame(null)}
            />
          ))}
        </div>

        <footer 
          className="
            text-center 
            mt-24 
            text-green-600 
            opacity-50 
            tracking-widest
            hover:opacity-100
            transition-opacity
            group
          "
        >
          <p className="group-hover:animate-pulse">
            © 2077 NEURAL ARCADE SYSTEMS | QUANTUM ENTERTAINMENT DIVISION
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CyberpunkArcadeDashboard