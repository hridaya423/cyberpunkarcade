'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap, RefreshCw } from 'lucide-react';

const SIZE = 4;

interface GridCell {
  value: number;
  isNew: boolean;
  isMerged: boolean;
}

const getInitialGrid = (): GridCell[][] => {
  const grid = Array(SIZE).fill(null).map(() => 
    Array(SIZE).fill(null).map(() => ({ value: 0, isNew: false, isMerged: false }))
  );
  addRandomTile(grid);
  addRandomTile(grid);
  return grid;
};

const addRandomTile = (grid: GridCell[][]) => {
  const emptyCells: { row: number; col: number }[] = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col].value === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = {
      value: Math.random() < 0.9 ? 2 : 4,
      isNew: true,
      isMerged: false
    };
  }
};

const transposeGrid = (grid: GridCell[][]): GridCell[][] => {
  return grid[0].map((_, colIndex) => grid.map(row => ({ ...row[colIndex] })));
};

const reverseGrid = (grid: GridCell[][]): GridCell[][] => {
  return grid.map(row => [...row].reverse());
};

const moveLeft = (grid: GridCell[][]): { newGrid: GridCell[][]; moved: boolean } => {
  let moved = false;
  const newGrid = grid.map(row => {
    // Remove zeros
    const filteredRow = row.filter(cell => cell.value !== 0);
    
    // Merge adjacent cells with the same value
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i].value === filteredRow[i + 1].value) {
        filteredRow[i] = {
          value: filteredRow[i].value * 2,
          isNew: false,
          isMerged: true
        };
        filteredRow.splice(i + 1, 1);
        moved = true;
      }
    }
    
    // Pad with zeros
    while (filteredRow.length < SIZE) {
      filteredRow.push({ value: 0, isNew: false, isMerged: false });
    }
    
    // Check if the row has changed
    if (!row.every((cell, index) => cell.value === filteredRow[index].value)) {
      moved = true;
    }
    
    return filteredRow;
  });
  
  return { newGrid, moved };
};

const CyberpunkNexus: React.FC = () => {
  const [grid, setGrid] = useState<GridCell[][]>(getInitialGrid);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('CyberpunkNexusHighScore');
    return saved ? parseInt(saved, 10) : 0;
  }
  return 0;
});

  const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    let processedGrid: GridCell[][] = grid.map(row => 
      row.map(cell => ({ ...cell, isNew: false, isMerged: false }))
    );
    let moved = false;

    if (direction === 'left') {
      const result = moveLeft(processedGrid);
      processedGrid = result.newGrid;
      moved = result.moved;
    } else if (direction === 'right') {
      const reversedGrid = reverseGrid(processedGrid);
      const result = moveLeft(reversedGrid);
      processedGrid = reverseGrid(result.newGrid);
      moved = result.moved;
    } else if (direction === 'up') {
      const transposedGrid = transposeGrid(processedGrid);
      const result = moveLeft(transposedGrid);
      processedGrid = transposeGrid(result.newGrid);
      moved = result.moved;
    } else if (direction === 'down') {
      const transposedGrid = transposeGrid(processedGrid);
      const reversedGrid = reverseGrid(transposedGrid);
      const result = moveLeft(reversedGrid);
      processedGrid = transposeGrid(reverseGrid(result.newGrid));
      moved = result.moved;
    }

    if (moved) {
      // Only add a new tile if the grid actually changed
      addRandomTile(processedGrid);
      
      // Calculate new score
      const newScore = processedGrid.flat().reduce((sum, cell) => sum + cell.value, 0);
      setScore(newScore);
      
      // Update high score if needed
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('CyberpunkNexusHighScore', newScore.toString());
      }
      
      // Check for win condition
      const maxValue = Math.max(...processedGrid.flat().map(cell => cell.value));
      if (maxValue >= 2048 && !win) {
        setWin(true);
      }
      
      // Check for game over
      if (isGameOver(processedGrid)) {
        setGameOver(true);
      }
      
      setGrid(processedGrid);
    }
  }, [grid, highScore, win]);

  const isGameOver = (grid: GridCell[][]): boolean => {
    // Check if there are any empty cells
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (grid[row][col].value === 0) return false;
      }
    }
    
    // Check if any adjacent cells can be merged
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        // Check right
        if (col < SIZE - 1 && grid[row][col].value === grid[row][col + 1].value) return false;
        
        // Check down
        if (row < SIZE - 1 && grid[row][col].value === grid[row + 1][col].value) return false;
      }
    }
    
    return true;
  };

  const resetGame = () => {
    setGrid(getInitialGrid());
    setScore(0);
    setGameOver(false);
    setWin(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver || win) return;

    switch (e.key) {
      case 'ArrowUp':
        handleMove('up');
        break;
      case 'ArrowDown':
        handleMove('down');
        break;
      case 'ArrowLeft':
        handleMove('left');
        break;
      case 'ArrowRight':
        handleMove('right');
        break;
      default:
        return;
    }
    e.preventDefault();
  }, [handleMove, gameOver, win]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);


  const getColorClass = (value: number) => {
    const colorMap: { [key: number]: string } = {
      2: 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30',
      4: 'bg-cyan-900/30 text-cyan-300 border-cyan-500/40',
      8: 'bg-green-900/40 text-green-300 border-green-500/50',
      16: 'bg-green-900/50 text-green-200 border-green-500/60',
      32: 'bg-purple-900/60 text-purple-200 border-purple-500/70',
      64: 'bg-purple-900/70 text-purple-100 border-purple-500/80',
      128: 'bg-pink-900/80 text-pink-200 border-pink-500/90',
      256: 'bg-pink-900/90 text-pink-100 border-pink-500',
      512: 'bg-red-900 text-red-100 border-red-500 animate-pulse',
      1024: 'bg-red-900 text-red-50 border-red-400 animate-pulse',
      2048: 'bg-yellow-900 text-yellow-50 border-yellow-400 animate-pulse'
    };
    return colorMap[value] || 'bg-gray-900/10 text-gray-300 border-gray-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4 space-y-4 overflow-hidden">
      {/* Cyberpunk Grid Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,185,129,0.05)_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#00ffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-cyan-400 tracking-wider flex items-center">
            <Zap className="mr-2 text-yellow-400" /> Nexus 2048
          </h1>
          <div className="flex flex-col items-end">
            <div className="text-xl text-cyan-200">
              Score: <span className="font-bold text-cyan-50">{score}</span>
            </div>
            <div className="text-sm text-cyan-300">
              Best: <span className="font-bold text-cyan-100">{highScore}</span>
            </div>
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-cyan-500/30 text-center"
            >
              <h2 className="text-3xl font-bold mb-4 text-cyan-400">System Overload!</h2>
              <p className="text-xl mb-4 text-cyan-200">Terminal Score: {score}</p>
              <button 
                onClick={resetGame}
                className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition flex items-center mx-auto"
              >
                <RefreshCw className="mr-2" /> Reboot System
              </button>
            </motion.div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4 shadow-2xl"
        >
          <div className="grid grid-cols-4 gap-3 bg-gray-900/20 p-3 rounded-lg border border-cyan-500/10">
            {grid.map((row, rowIndex) => (
              row.map((cell, cellIndex) => (
                <motion.div 
                  key={`${rowIndex}-${cellIndex}`}
                  initial={{ 
                    opacity: cell.isNew ? 0 : 1, 
                    scale: cell.isNew ? 0.5 : 1 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: cell.isMerged ? 1.1 : 1 
                  }}
                  transition={{ 
                    duration: 0.2,
                    type: "spring",
                    stiffness: 300
                  }}
                  className={`
                    aspect-square flex items-center justify-center 
                    text-2xl font-bold uppercase tracking-wider 
                    border rounded-lg 
                    transition-all duration-300 ease-in-out
                    ${getColorClass(cell.value)}
                    ${cell.value === 0 ? 'opacity-10' : ''}
                  `}
                >
                  {cell.value !== 0 ? cell.value : ''}
                </motion.div>
              ))
            ))}
          </div>
        </motion.div>

        {/* Mobile Controls */}
        <div className="mt-4 flex justify-center space-x-4">
          <button 
            onClick={() => handleMove('up')} 
            className="p-2 bg-cyan-700/30 rounded-lg hover:bg-cyan-700/50 transition"
          >
            <ChevronUp className="text-cyan-300" />
          </button>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => handleMove('left')} 
              className="p-2 bg-cyan-700/30 rounded-lg hover:bg-cyan-700/50 transition"
            >
              <ChevronLeft className="text-cyan-300" />
            </button>
            <button 
              onClick={() => handleMove('right')} 
              className="p-2 bg-cyan-700/30 rounded-lg hover:bg-cyan-700/50 transition"
            >
              <ChevronRight className="text-cyan-300" />
            </button>
          </div>
          <button 
            onClick={() => handleMove('down')} 
            className="p-2 bg-cyan-700/30 rounded-lg hover:bg-cyan-700/50 transition"
          >
            <ChevronDown className="text-cyan-300" />
          </button>
        </div>
      </div>

      <div className="text-center text-cyan-300 max-w-md relative z-10">
        <p className="text-sm">Merge data nodes to reach 2048! Use arrow keys or mobile controls to slide and combine.</p>
      </div>
    </div>
  );
};

export default CyberpunkNexus;
