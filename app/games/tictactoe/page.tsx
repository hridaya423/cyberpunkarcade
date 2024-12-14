/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Bot, 
  Repeat, 
  Brain, 
  Cpu,
  Grid
} from 'lucide-react';

enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

enum GameMode {
  TWO_PLAYER = 'Two Player',
  VS_AI = 'VS AI'
}

type Player = 'X' | 'O';
type BoardState = (Player | null)[];

const CyberTicTacToe: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.TWO_PLAYER);
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    Draws: 0
  });

  const calculateWinner = useCallback((boardState: BoardState): Player | 'Draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
      [0, 4, 8], [2, 4, 6]  // Diagonals
    ];
    
    for (const [a, b, c] of lines) {
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a] as Player;
      }
    }
    
    return boardState.includes(null) ? null : 'Draw';
  }, []);

  const aiMove = useCallback((): number | null => {
    const emptySpaces = board.reduce<number[]>((acc, cell, idx) => 
      cell === null ? [...acc, idx] : acc, []);
    
    // If no empty spaces, return null
    if (emptySpaces.length === 0) return null;
    
    switch (aiDifficulty) {
      case Difficulty.EASY:
        return emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
      
      case Difficulty.MEDIUM:
        // Simple strategic selection with guaranteed move
        const strategicPriority = [4, 0, 2, 6, 8, 1, 3, 5, 7]
          .filter(move => emptySpaces.includes(move));
        
        return strategicPriority.length > 0 
          ? strategicPriority[0] 
          : emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
      
      case Difficulty.HARD:
        // First, check for winning or blocking moves
        for (const line of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
          const [a, b, c] = line;
          // Prioritize winning move
          if (board[a] === 'O' && board[b] === 'O' && board[c] === null && emptySpaces.includes(c)) return c;
          
          // Block player's potential wins
          if (board[a] === 'X' && board[b] === 'X' && board[c] === null && emptySpaces.includes(c)) return c;
        }
        
        // Prioritize center if empty
        if (emptySpaces.includes(4)) return 4;
        
        // If center is taken, have a robust response
        const cornerMoves = [0, 2, 6, 8].filter(corner => emptySpaces.includes(corner));
        if (cornerMoves.length > 0) return cornerMoves[0];
        
        // Fallback to any available edge
        const edgeMoves = [1, 3, 5, 7].filter(edge => emptySpaces.includes(edge));
        if (edgeMoves.length > 0) return edgeMoves[0];
        
        // Final fallback to any empty space
        return emptySpaces[0];
    }
  }, [board, aiDifficulty]);

  const handleClick = useCallback((index: number) => {
    // Prevent clicks if game is over or cell is occupied
    if (board[index] || winner || (gameMode === GameMode.VS_AI && !isXNext)) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const gameResult = calculateWinner(newBoard);
    
    if (gameResult) {
      setWinner(gameResult);
      
      setScores(prev => {
        if (gameResult === 'Draw') {
          return { ...prev, Draws: prev.Draws + 1 };
        }
        return { 
          ...prev, 
          [gameResult]: prev[gameResult] + 1 
        };
      });
    } else {
      setIsXNext(!isXNext);
      // AI Move for VS AI mode
      if (gameMode === GameMode.VS_AI) {
        setTimeout(() => {
          const emptySpaces = newBoard.reduce<number[]>((acc, cell, idx) => 
            cell === null ? [...acc, idx] : acc, []);
          
          const aiMoveIndex = aiMove();
          
          if (aiMoveIndex !== null && emptySpaces.includes(aiMoveIndex)) {
            const aiBoard = [...newBoard];
            aiBoard[aiMoveIndex] = 'O';
            setBoard(aiBoard);
            
            const aiResult = calculateWinner(aiBoard);
            if (aiResult) {
              setWinner(aiResult);
              
              setScores(prev => {
                if (aiResult === 'Draw') {
                  return { ...prev, Draws: prev.Draws + 1 };
                }
                return { 
                  ...prev, 
                  [aiResult]: prev[aiResult] + 1 
                };
              });
            } else {
              setIsXNext(true);
            }
          }
        }, 500);
      }
    }
  }, [board, isXNext, winner, gameMode, calculateWinner, aiMove]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Glowing Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-30 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-gray-800/60 rounded-2xl border border-cyan-500/20 p-6 shadow-2xl backdrop-blur-sm">
        {/* Title with Cyber Glow */}
        <h1 className="text-4xl font-bold text-center mb-8 relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Quantum Tic Tac Toe
          </span>
          <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-md -z-10 animate-pulse"></div>
        </h1>

        {/* Game Mode Selection with Cyber Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          {Object.values(GameMode).map(mode => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameMode(mode)}
              className={`
                px-4 py-2 rounded-lg transition-all duration-300 
                border border-transparent
                ${gameMode === mode 
                  ? 'bg-cyan-600/60 border-cyan-500 text-white' 
                  : 'bg-gray-700/40 hover:bg-gray-600/60 text-gray-300'}
                flex items-center space-x-2
              `}
            >
              {mode === GameMode.TWO_PLAYER ? <Users className="mr-2" /> : <Bot className="mr-2" />}
              {mode}
            </motion.button>
          ))}
        </div>

        {/* AI Difficulty Selector */}
        {gameMode === GameMode.VS_AI && (
          <div className="flex justify-center space-x-4 mb-6">
            {Object.values(Difficulty).map(diff => (
              <motion.button
                key={diff}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAiDifficulty(diff)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-300
                  border border-transparent
                  ${aiDifficulty === diff 
                    ? 'bg-cyan-600/60 border-cyan-500 text-white' 
                    : 'bg-gray-700/40 hover:bg-gray-600/60 text-gray-300'}
                  flex items-center space-x-2
                `}
              >
                {diff}
              </motion.button>
            ))}
          </div>
        )}

        {/* Futuristic Scoreboard */}
        <div className="flex justify-between mb-6 text-lg">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-bold">X:</span>
            <span className="text-white">{scores.X}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-400 font-bold">O:</span>
            <span className="text-white">{scores.O}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-bold">Draws:</span>
            <span className="text-white">{scores.Draws}</span>
          </div>
        </div>

        {/* Cyber Game Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 relative">
          {/* Holographic grid overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-lg"></div>
            <div className="absolute top-1/3 left-0 right-0 border-t-2 border-cyan-500/20"></div>
            <div className="absolute top-2/3 left-0 right-0 border-t-2 border-cyan-500/20"></div>
            <div className="absolute left-1/3 top-0 bottom-0 border-l-2 border-cyan-500/20"></div>
            <div className="absolute left-2/3 top-0 bottom-0 border-l-2 border-cyan-500/20"></div>
          </div>

          {board.map((cell, index) => (
            <motion.div
              key={index}
              className={`
                h-24 flex items-center justify-center 
                text-5xl font-bold cursor-pointer 
                rounded-lg transition-all duration-300
                relative overflow-hidden
                ${cell === 'X' ? 'text-cyan-400' : 
                  cell === 'O' ? 'text-purple-400' : 
                  'text-gray-500 hover:text-white'}
                ${!cell ? 'bg-gray-800/40 hover:bg-gray-700/50' : 'bg-gray-800/60'}
              `}
              onClick={() => handleClick(index)}
              whileHover={{ scale: cell ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Cyber effect for empty cells */}
              {!cell && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 hover:opacity-50 transition-opacity duration-300"></div>
              )}
              
              {/* Cell content */}
              <span className={`
                ${cell ? 'opacity-100' : 'opacity-30'}
                transition-opacity duration-300
              `}>
                {cell || '·'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Game Result with Cyber Effect */}
        {winner && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className={`
              text-2xl font-bold
              ${winner === 'Draw' ? 'text-gray-400' : 
                winner === 'X' ? 'text-cyan-400' : 'text-purple-400'}
            `}>
              {winner === 'Draw' 
                ? 'Quantum Entanglement: Draw' 
                : `${winner} Wins the Quantum Duel!`}
            </div>
          </motion.div>
        )}

        {/* Reset Button with Cyber Style */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="
              px-6 py-3 
              bg-gradient-to-r from-cyan-600/50 to-purple-600/50
              text-white rounded-lg 
              border border-cyan-500/30
              flex items-center space-x-2
              hover:from-cyan-600/70 hover:to-purple-600/70
              transition-all duration-300
            "
          >
            <Repeat className="mr-2" />
            Reset Quantum Matrix
          </motion.button>
        </div>
      </div>

      {/* Custom styles for grid background */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(34, 211, 238, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}

export default CyberTicTacToe;