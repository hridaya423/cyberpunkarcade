/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Zap, Cpu, Rss, GitBranch } from 'lucide-react';

// Types for game state and entities
type Position = { x: number; y: number };
type GameState = 'start' | 'playing' | 'game-over';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE;

const CircuitSerpentGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cyberpunk color palette
  const colors = {
    background: 'bg-[#0a0a1a]',
    snake: 'text-green-300',
    food: 'text-purple-500',
    grid: 'border-green-800/30',
    glow: 'glow-green-500'
  };

  // Randomize food position
  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);
  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return;

    const newSnake = [...snake];
    const head = { 
      x: (newSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE, 
      y: (newSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE 
    };

    // Check collision with self
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameState('game-over');
      setHighScore(Math.max(score, highScore));
      return;
    }

    newSnake.unshift(head);

    // Check food consumption
    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => prevScore + 1);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameState, score, highScore, generateFood]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':    
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':  
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':  
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight': 
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameState === 'game-over' || gameState === 'start') {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 200);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  // Render game to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    if (!context) return;

    // Clear canvas
    context.fillStyle = '#0a0a1a';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid lines
    context.strokeStyle = 'rgba(0,255,100,0.1)';
    for (let x = 0; x < CANVAS_WIDTH; x += CELL_SIZE) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, CANVAS_HEIGHT);
      context.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += CELL_SIZE) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(CANVAS_WIDTH, y);
      context.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      context.fillStyle = index === 0 
        ? 'rgba(100,255,100,0.8)' 
        : 'rgba(50,200,50,0.6)';
      context.fillRect(
        segment.x * CELL_SIZE, 
        segment.y * CELL_SIZE, 
        CELL_SIZE - 1, 
        CELL_SIZE - 1
      );
    });

    // Draw food
    context.fillStyle = 'rgba(255,100,255,0.7)';
    context.fillRect(
      food.x * CELL_SIZE, 
      food.y * CELL_SIZE, 
      CELL_SIZE - 1, 
      CELL_SIZE - 1
    );
  }, [snake, food]);

  // Start game function
  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className={`min-h-screen ${colors.background} flex flex-col items-center justify-center p-4 overflow-hidden`}>
      {/* Cyberpunk Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-900/20 to-purple-900/20 opacity-50 mix-blend-overlay"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        {/* Circuit-like lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="circuit-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M0 0 L50 0 L50 50 L0 50 Z" fill="none" stroke="rgba(0,255,100,0.1)" strokeWidth="1"/>
                <path d="M25 0 L25 50" stroke="rgba(0,255,100,0.05)" strokeWidth="1"/>
                <path d="M0 25 L50 25" stroke="rgba(0,255,100,0.05)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
      </div>

      {/* Game Container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Game Title */}
        <h1 className="text-4xl font-bold mb-4 text-green-300 drop-shadow-[0_0_10px_rgba(100,255,100,0.5)]">
          Circuit Serpent
        </h1>

        {/* Game Canvas */}
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-green-800/50 rounded-lg shadow-[0_0_30px_rgba(100,255,100,0.3)]"
        />

        {/* Game Info */}
        <div className="mt-4 flex space-x-4 text-green-300">
          <div className="flex items-center">
            <Cpu className="mr-2" />
            <span>Score: {score}</span>
          </div>
          <div className="flex items-center">
            <GitBranch className="mr-2" />
            <span>High Score: {highScore}</span>
          </div>
        </div>

        {/* Game State Overlay */}
        {(gameState === 'start' || gameState === 'game-over') && (
          <motion.div 
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Crosshair className="w-32 h-32 text-green-300 mb-4 animate-pulse" />
            <h2 className="text-3xl text-green-300 mb-4">
              {gameState === 'start' ? 'Circuit Serpent' : 'Game Over'}
            </h2>
            <p className="text-green-200 mb-6 max-w-md">
              {gameState === 'start' 
                ? 'Navigate the digital labyrinth. Survive and evolve.' 
                : `Digital ecosystem collapsed. Survived ${score} cycles.`}
            </p>
            <motion.button 
              onClick={startGame}
              className="px-6 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {gameState === 'start' ? 'Initialize' : 'Reboot'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CircuitSerpentGame;