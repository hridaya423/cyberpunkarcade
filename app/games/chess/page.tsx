// /* eslint-disable react/display-name */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client'
// import React, { useState, useMemo, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Cpu, 
//   Crosshair, 
//   ShieldHalf, 
//   Grid3x3,
// } from 'lucide-react';

// // Import the chess logic (assuming you have a corresponding TypeScript file)
// import ChessGame, { ChessPiece, Color, GameState } from '@/lib/chessLogic';

// // Cyberpunk color palette and styling constants
// const cyberpunkColors = {
//   background: 'bg-gradient-to-br from-zinc-900 via-black to-red-900',
//   board: 'bg-zinc-800 border-4 border-red-500/30 shadow-2xl shadow-red-500/20',
//   square: {
//     light: 'bg-zinc-700/50 hover:bg-red-500/20 transition-all duration-300',
//     dark: 'bg-zinc-800/70 hover:bg-red-500/30 transition-all duration-300',
//     highlight: 'bg-red-500/40 border-2 border-red-300 animate-pulse',
//     possibleMove: 'bg-green-500/30 border-2 border-green-300 animate-pulse'
//   },
//   pieces: {
//     white: 'text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.7)]',
//     black: 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.7)]'
//   },
//   status: {
//     playing: 'text-cyan-300',
//     check: 'text-red-500 animate-pulse',
//     checkmate: 'text-red-700 line-through',
//     stalemate: 'text-yellow-500',
//     draw: 'text-purple-500'
//   }
// } as const;

// // Piece unicode characters with a techy look
// const pieceIcons: Record<keyof Omit<ChessPiece, 'color'>, Record<Color, string>> = {
//   king: { white: '♔', black: '♚' },
//   queen: { white: '♕', black: '♛' },
//   rook: { white: '♖', black: '♜' },
//   bishop: { white: '♗', black: '♝' },
//   knight: { white: '♘', black: '♞' },
//   pawn: { white: '♙', black: '♟' }
// };

// // Position type for selected piece and moves
// interface Position {
//   row: number;
//   col: number;
// }

// const CyberpunkChess: React.FC = () => {
//   // Create game instance with useMemo to prevent unnecessary re-creation
//   const chessGame = useMemo(() => new ChessGame(), []);
  
//   // State management with explicit types
//   const [board, setBoard] = useState<ChessPiece[][]>(chessGame.getBoard());
//   const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
//   const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState<Color>(chessGame.getCurrentPlayer());
//   const [gameState, setGameState] = useState<GameState>(chessGame.getGameState());

//   // Render piece with cyberpunk styling and animations
//   const renderPiece = useCallback((piece: ChessPiece | null) => {
//     if (!piece) return null;

//     return (
//       <motion.div 
//         className={`text-4xl cursor-pointer select-none ${cyberpunkColors.pieces[piece.color as keyof typeof cyberpunkColors.pieces]}`}
//         whileHover={{ scale: 1.1, rotate: 5 }}
//         whileTap={{ scale: 0.9 }}
//         initial={{ opacity: 0, scale: 0.5 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 10 }}
//       >
//         {pieceIcons[piece.type][piece.color]}
//       </motion.div>
//     );
//   }, []);

//   // Handle piece selection and movement
//   const handleSquareClick = useCallback((rowIndex: number, colIndex: number) => {
//     const clickedPiece = board[rowIndex][colIndex];
//     const algebraicPos = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;

//     // If no piece is selected, select the piece
//     if (!selectedPiece) {
//       if (clickedPiece && clickedPiece.color === currentPlayer) {
//         setSelectedPiece({ row: rowIndex, col: colIndex });
//         // Get possible moves for the selected piece
//         const moves = chessGame.getPossibleMoves(clickedPiece);
//         setPossibleMoves(moves);
//       }
//       return;
//     }

//     // If a piece is already selected
//     if (selectedPiece) {
//       const fromPos = `${String.fromCharCode(97 + selectedPiece.col)}${8 - selectedPiece.row}`;
      
//       // Try to make the move
//       const moveResult = chessGame.makeMove(fromPos, algebraicPos);
      
//       if (moveResult) {
//         // Update board and game state
//         setBoard([...chessGame.getBoard()]);
//         setCurrentPlayer(chessGame.getCurrentPlayer());
//         setGameState(chessGame.getGameState());
//       }

//       // Reset selection
//       setSelectedPiece(null);
//       setPossibleMoves([]);
//     }
//   }, [board, currentPlayer, chessGame, selectedPiece]);

// // Cyberpunk Header Component
// const CyberpunkHeader = React.memo(() => {
//     const Header = () => (
//       <motion.div 
//         className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex items-center space-x-4">
//           <Cpu className="w-12 h-12 text-red-300 stroke-[1.5]" />
//           <h1 className="text-3xl font-bold text-cyan-300 tracking-wider">
//             DIGITAL CHESS WARFARE
//           </h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <Crosshair className="w-8 h-8 text-green-400 animate-ping" />
//           <ShieldHalf className="w-8 h-8 text-purple-500" />
//           <Grid3x3 className="w-8 h-8 text-blue-300" />
//         </div>
//       </motion.div>
//     );
    
//     Header.displayName = 'CyberpunkHeader';
//     return <Header />;
//   });
  
//   // Status Bar Component
//   const StatusBar = React.memo(() => {
//     const Bar = () => (
//       <motion.div 
//         className="p-4 bg-black/50 backdrop-blur-sm text-center"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <p className={`text-xl ${cyberpunkColors.status[gameState as keyof typeof cyberpunkColors.status]}`}>
//           {gameState === 'playing' ? (
//             <>
//               Current Player: <span className={cyberpunkColors.pieces[currentPlayer as keyof typeof cyberpunkColors.pieces]}>
//                 {currentPlayer.toUpperCase()}
//               </span>
//             </>
//           ) : (
//             <>Game State: {gameState.toUpperCase()}</>
//           )}
//         </p>
//         <p className="text-sm text-red-300 opacity-70 mt-1">
//           Algorithmic Battlefield: Strategic Combat Engaged
//         </p>
//       </motion.div>
//     );
    
//     Bar.displayName = 'StatusBar';
//     return <Bar />;
//   });
//   // Render the chess board
//   return (
//     <div className={`min-h-screen ${cyberpunkColors.background} flex flex-col`}>
//       <CyberpunkHeader />
      
//       <motion.div 
//         className="flex-grow flex items-center justify-center p-8"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.7 }}
//       >
//         <div className={`grid grid-cols-8 gap-1 ${cyberpunkColors.board} p-2 rounded-xl`}>
//           {board.map((row, rowIndex) => 
//             row.map((piece, colIndex) => {
//               const isLightSquare = (rowIndex + colIndex) % 2 === 1;
//               const isSelected = 
//                 selectedPiece?.row === rowIndex && 
//                 selectedPiece?.col === colIndex;
              
//               const isPossibleMove = possibleMoves.includes(
//                 `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
//               );

//               const squareClass = `aspect-square flex items-center justify-center 
//                 ${isLightSquare ? cyberpunkColors.square.light : cyberpunkColors.square.dark}
//                 ${isSelected ? cyberpunkColors.square.highlight : ''}
//                 ${isPossibleMove ? cyberpunkColors.square.possibleMove : ''}`;

//               return (
//                 <motion.div 
//                   key={`${rowIndex}-${colIndex}`}
//                   className={squareClass}
//                   whileHover={{ scale: 1.05 }}
//                   onClick={() => handleSquareClick(rowIndex, colIndex)}
//                 >
//                   {renderPiece(piece)}
//                 </motion.div>
//               );
//             })
//           )}
//         </div>
//       </motion.div>

//       <StatusBar />
//     </div>
//   );
// };

// export default CyberpunkChess;
