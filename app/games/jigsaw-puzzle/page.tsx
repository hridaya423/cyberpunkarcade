/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shuffle, RotateCcw, Eye, EyeOff, Volume2, VolumeX, Layers } from 'lucide-react';
import DynamicGridOverlay from '@/components/DynamicGridOverlay';

type PuzzlePiece = {
  id: number;
  currentPos: number;
  correctPos: number;
};

type PuzzleSize = 3 | 4 | 5;

interface JigsawPuzzleProps {
  customImageUrl?: string;
  initialSize?: PuzzleSize;
}

// Cyberpunk-themed image sources
const DEMO_IMAGES = [
    'https://picsum.photos/seed/puzzle1/600/600',
    'https://picsum.photos/seed/puzzle2/600/600',
    'https://picsum.photos/seed/puzzle3/600/600',
    'https://picsum.photos/seed/puzzle4/600/600',
    'https://picsum.photos/seed/puzzle5/600/600',
    'https://picsum.photos/seed/puzzle6/600/600',
    'https://picsum.photos/seed/puzzle7/600/600',
    'https://picsum.photos/seed/puzzle8/600/600',
    'https://picsum.photos/seed/puzzle9/600/600',
    'https://picsum.photos/seed/puzzle10/600/600'
  ];

const JigsawPuzzle = ({ customImageUrl, initialSize = 3 }: JigsawPuzzleProps) => {
  const [size, setSize] = useState<PuzzleSize>(initialSize);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [imageUrl, setImageUrl] = useState(customImageUrl || DEMO_IMAGES[0]);
  const puzzleRef = useRef<HTMLDivElement>(null);

  // Sound effects with improved audio handling
  const audioContext = useRef<AudioContext>();
  
  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.type = 'triangle'; // More cyberpunk-like sound
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  };

  const playPickupSound = () => playSound(440, 100);
  const playDropSound = () => playSound(330, 100);
  const playCompleteSound = () => {
    playSound(523.25, 100);
    setTimeout(() => playSound(659.25, 100), 100);
    setTimeout(() => playSound(783.99, 200), 200);
  };

  // Initialize puzzle with improved randomization
  const initializePuzzle = useCallback(() => {
    const totalPieces = size * size;
    const newPieces: PuzzlePiece[] = Array.from({ length: totalPieces }, (_, i) => ({
      id: i,
      currentPos: i,
      correctPos: i,
    }));

    // More thorough shuffling
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentPos, newPieces[j].currentPos] = 
      [newPieces[j].currentPos, newPieces[i].currentPos];
    }

    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
    setDraggedPiece(null);
  }, [size]);

  // Image loading with error handling
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error('Image failed to load, trying alternative image');
      setImageUrl(DEMO_IMAGES[0]);
    };
    img.src = imageUrl;
    setImageLoaded(false);
  }, [imageUrl]);

  useEffect(() => {
    if (imageLoaded) {
      initializePuzzle();
    }
  }, [initializePuzzle, imageLoaded]);

  // Completion check
  useEffect(() => {
    const isCompleted = pieces.every(piece => piece.currentPos === piece.correctPos);
    if (isCompleted && !isComplete) {
      setIsComplete(true);
      playCompleteSound();
    }
  }, [pieces, isComplete]);

  // Generate random cyberpunk-like image
  const generateRandomImage = () => {
    const randomImage = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
    setImageUrl(randomImage);
  };

  // Drag and Drop handlers with improved piece tracking
  const handleDragStart = (piece: PuzzlePiece) => {
    setDraggedPiece(piece);
    playPickupSound();
  };

  const handleDrop = (dropPiece: PuzzlePiece) => {
    if (!draggedPiece || draggedPiece.id === dropPiece.id) return;

    playDropSound();
    setPieces(prev => {
      const newPieces = prev.map(p => {
        if (p.id === draggedPiece.id) return { ...p, currentPos: dropPiece.currentPos };
        if (p.id === dropPiece.id) return { ...p, currentPos: draggedPiece.currentPos };
        return p;
      });
      return newPieces;
    });

    setMoves(prev => prev + 1);
    setDraggedPiece(null);
  };

  // Calculate piece dimensions
  const pieceWidth = 100 / size;
  const pieceHeight = 100 / size;

  // Get background position for a piece
  const getBackgroundPosition = (correctPos: number) => {
    const row = Math.floor(correctPos / size);
    const col = correctPos % size;
    return `${-(col * 100)}% ${-(row * 100)}%`;
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center 
                 bg-gradient-to-br from-[#030712] via-[#0a192f] to-[#111827] 
                 p-6 overflow-hidden relative"
    >
      {/* Cybernetic Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10" 
        style={{
          backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: 1
        }}
      />

      <div className="relative z-10 max-w-7xl w-full space-y-8">
        {/* Control Panel */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <select 
            className="bg-[#112240] text-cyan-300 px-4 py-3 rounded-xl 
                       border border-cyan-600/30 hover:border-cyan-400/50 
                       transition-all transform hover:scale-105 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={size}
            onChange={(e) => {
              const newSize = Number(e.target.value) as PuzzleSize;
              setSize(newSize);
              setTimeout(initializePuzzle, 0);
            }}
          >
            {[3, 4, 5].map(gridSize => (
              <option 
                key={gridSize} 
                value={gridSize} 
                className="bg-[#0a192f] text-cyan-300"
              >
                {gridSize}x{gridSize} Quantum Grid
              </option>
            ))}
          </select>
          
          {/* Action Buttons */}
          {[
            { 
              icon: <Shuffle size={16} className="text-cyan-300" />, 
              text: 'Quantum Shuffle', 
              onClick: generateRandomImage,
              color: 'cyan'
            },
            { 
              icon: <RotateCcw size={16} className="text-green-300" />, 
              text: 'Reset Fragments', 
              onClick: initializePuzzle,
              color: 'green'
            },
            { 
              icon: soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />, 
              text: soundEnabled ? 'Cyberspace Sound' : 'Mute Network', 
              onClick: () => setSoundEnabled(!soundEnabled),
              color: 'gray'
            }
          ].map(({ icon, text, onClick, color }) => (
            <button
              key={text}
              onClick={onClick}
              className={`flex items-center space-x-2 
                         bg-${color}-600/20 hover:bg-${color}-600/40 text-${color}-300 
                         px-4 py-3 rounded-xl border border-${color}-600/30 
                         hover:border-${color}-400/50 transition-all 
                         transform hover:scale-105 active:scale-95`}
            >
              {icon}
              <span>{text}</span>
            </button>
          ))}
        </div>

        {/* Puzzle Container */}
        {imageLoaded ? (
          <div 
            className="relative mx-auto overflow-hidden rounded-3xl shadow-2xl 
                       border-2 border-cyan-600/30 bg-gradient-to-br from-[#112240] to-[#0a192f]
                       transition-all duration-500 hover:shadow-cyan-500/50"
            style={{ 
              width: '80vmin', 
              height: '80vmin', 
              maxWidth: '800px', 
              maxHeight: '800px' 
            }}
          >
            {/* Quantum Preview Layer */}

            {/* Puzzle Grid */}
            <div 
              ref={puzzleRef}
              className="relative w-full h-full bg-gradient-to-br from-[#112240] to-[#0a192f] rounded-2xl overflow-hidden z-10"
            >
              {pieces
                .sort((a, b) => a.currentPos - b.currentPos)
                .map((piece) => (
                  <div
                    key={piece.id}
                    draggable
                    onDragStart={() => handleDragStart(piece)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(piece)}
                    className={`absolute transition-all duration-300 ease-in-out 
                      hover:brightness-110 cursor-move
                      ${draggedPiece?.id === piece.id ? 'opacity-50 z-20 scale-110' : 'z-10'}
                      ${isComplete ? 'cursor-default' : ''}`}
                    style={{
                      width: `${pieceWidth}%`,
                      height: `${pieceHeight}%`,
                      left: `${(piece.currentPos % size) * pieceWidth}%`,
                      top: `${Math.floor(piece.currentPos / size) * pieceHeight}%`,
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: `${size * 100}%`,
                      backgroundPosition: getBackgroundPosition(piece.correctPos),
                      border: '1px solid rgba(34, 211, 238, 0.2)', // Cyberpunk border
                      boxShadow: draggedPiece?.id === piece.id 
                        ? '0 0 20px rgba(34, 211, 238, 0.3)' 
                        : '0 4px 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div 
            className="w-80 h-80 mx-auto flex items-center justify-center 
                       bg-gradient-to-br from-[#112240] to-[#0a192f] 
                       rounded-3xl border-2 border-cyan-600/30 
                       animate-pulse"
          >
            <div className="text-cyan-300 text-xl font-mono">Quantum Loading...</div>
          </div>
        )}

        {/* Status Display */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xl text-cyan-300 font-mono tracking-widest">
            Fragmentation Attempts: 
            <span className="ml-2 text-cyan-100 font-bold">{moves}</span>
          </p>
          {isComplete && (
            <p className="text-2xl text-green-400 font-mono uppercase tracking-wider 
                          animate-pulse transform hover:scale-105 transition-all">
              Quantum Reality Reconstructed! 🌐
            </p>
          )}
        </div>
      </div>
    </div>
  );

};

export default JigsawPuzzle
