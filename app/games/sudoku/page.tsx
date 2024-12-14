"use client";

import { useState, useEffect } from "react";
import { getSudoku } from "sudoku-gen";
import { motion } from "framer-motion";
import { Grid3x3, Braces, Cpu, Brain } from "lucide-react";
import Confetti from "react-confetti";
import CyberModal from "@/components/ui/Modal";

type Difficulty = "easy" | "medium" | "hard" | "expert";

const generatePuzzle = (difficulty: Difficulty) => {
  const { puzzle, solution } = getSudoku(difficulty);
  const puzzleArray = puzzle.split("").map((char) => (char === "-" ? 0 : parseInt(char, 10)));
  const solutionArray = solution.split("").map((char) => parseInt(char, 10));

  const puzzleGrid = [];
  const solutionGrid = [];
  for (let i = 0; i < 9; i++) {
    puzzleGrid.push(puzzleArray.slice(i * 9, i * 9 + 9));
    solutionGrid.push(solutionArray.slice(i * 9, i * 9 + 9));
  }

  return { puzzleGrid, solutionGrid };
};

export default function CyberSudoku() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [userInput, setUserInput] = useState<number[][]>([]);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const loadPuzzle = () => {
    const { puzzleGrid, solutionGrid } = generatePuzzle(difficulty);
    setPuzzle(puzzleGrid);
    setSolution(solutionGrid);
    setUserInput(puzzleGrid);
    setCompleted(false);
    setTimeElapsed(0);
    setIsRunning(true);
  };

  useEffect(() => {
    loadPuzzle();
  }, [difficulty]);

  const handleChange = (row: number, col: number, value: string) => {
    const updatedInput = userInput.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return value === "" ? 0 : parseInt(value, 10);
        }
        return cell;
      })
    );
    setUserInput(updatedInput);
    setIsRunning(true);
  };

  const handleSubmit = () => {
    if (JSON.stringify(userInput) === JSON.stringify(solution)) {
      setCompleted(true);
      setIsRunning(false);
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-cyan-900 min-h-screen py-10 overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-cyan/10"></div>
      </div>

      {/* Quantum Logic Container */}
      <div className="relative container mx-auto px-4 text-center">
        {/* Header with Cyber Aesthetic */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h1 className="text-6xl font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-cyber mb-4 flex items-center justify-center gap-4">
            <Cpu className="w-16 h-16 text-cyan-300 animate-pulse" />
            Cyber Sudoku
            <Brain className="w-16 h-16 text-cyan-300 animate-pulse" />
          </h1>
          <p className="text-xl text-cyan-200 max-w-2xl mx-auto opacity-80">
            Deconstruct digital logic matrices in quantum probability space
          </p>
        </motion.div>

        {/* Difficulty & Timer */}
        <div className="flex justify-center items-center mb-8 space-x-6">
          <div className="flex items-center space-x-2">
            <Braces className="text-cyan-400 w-6 h-6" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="bg-gray-800/80 text-cyan-200 p-2 rounded-lg border border-cyan-500/30 focus:ring-2 focus:ring-cyan-500 transition"
            >
              <option value="easy">Quantum Easy</option>
              <option value="medium">Neural Medium</option>
              <option value="hard">Cyber Hard</option>
              <option value="expert">Quantum Expert</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-cyan-300">
            <Grid3x3 className="w-6 h-6" />
            <span className="text-xl font-mono tracking-wider">
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>

        {/* Sudoku Grid */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-9 gap-1 mx-auto max-w-2xl bg-gray-900/50 p-2 rounded-xl border border-cyan-500/30 shadow-cyber"
        >
          {puzzle.flat().map((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const isSubgridBottom = row % 3 === 2 && row !== 8;
            const isSubgridRight = col % 3 === 2 && col !== 8;

            return (
              <motion.div
                key={index}
                className={`bg-gray-800/60 p-2 relative overflow-hidden ${
                  isSubgridBottom ? "border-b-4" : "border-b"
                } ${isSubgridRight ? "border-r-4" : "border-r"} border-cyan-500/30 
                transition-all duration-300 hover:bg-cyan-900/30`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <input
  type="text"
  maxLength={1}
  className={`bg-transparent text-cyan-200 text-center w-full outline-none 
  text-2xl font-mono font-bold 
  focus:text-cyan-50 focus:bg-cyan-500/20 
  disabled:text-cyan-700 disabled:opacity-60
  transition-all duration-300`}
  value={userInput[row][col] === 0 ? "" : userInput[row][col]}
  onChange={(e) => handleChange(row, col, e.target.value)}
  disabled={puzzle[row][col] !== 0}
  aria-label={`Quantum Cell ${row + 1}, ${col + 1}`}
  placeholder={puzzle[row][col] === 0 ? "◌" : ""}
/>
                <div className="absolute inset-0 border-2 border-transparent hover:border-cyan-500/40 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            );
          })}
        </motion.div>
        s
        <div className="mt-8 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadPuzzle}
            className="px-6 py-3 bg-cyan-800/50 text-cyan-200 rounded-lg 
            border border-cyan-500/30 hover:bg-cyan-700/60
            flex items-center space-x-2 transition-all duration-300"
          >
            <Cpu className="w-5 h-5" />
            <span>Reboot Puzzle</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-6 py-3 bg-cyan-600/50 text-cyan-100 rounded-lg 
            border border-cyan-500/30 hover:bg-cyan-500/60
            flex items-center space-x-2 transition-all duration-300"
          >
            <Brain className="w-5 h-5" />
            <span>Validate Matrix</span>
          </motion.button>
        </div>

        {completed && <Confetti className="fixed inset-0 z-50" />}
        {showModal && (
          <CyberModal
            title="Quantum Disruption Detected"
            message="Logic matrix not aligned. Recalibrate and retry."
            confirmText="Realign"
            cancelText="Abort"
            onConfirm={closeModal}
            onCancel={closeModal}
          />
        )}
      </div>

      {/* Cyber Background Styles */}
      <style jsx>{`
        .bg-grid-cyan {
          background-image: 
            linear-gradient(to right, rgba(8, 145, 178, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(8, 145, 178, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes cyber-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .drop-shadow-cyber {
          text-shadow: 
            0 0 10px rgba(34, 211, 238, 0.5),
            0 0 20px rgba(34, 211, 238, 0.3),
            0 0 40px rgba(34, 211, 238, 0.2);
        }

        .shadow-cyber {
          box-shadow: 
            0 0 20px rgba(34, 211, 238, 0.2),
            0 0 40px rgba(34, 211, 238, 0.1),
            inset 0 0 15px rgba(34, 211, 238, 0.1);
        }
      `}</style>
    </div>
  );
}