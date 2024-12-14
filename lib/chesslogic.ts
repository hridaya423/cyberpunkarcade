/* eslint-disable @typescript-eslint/no-unused-vars */
export type Piece = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type Color = 'white' | 'black';

export interface ChessPiece {
  type: Piece;
  color: Color;
  position: string;
  hasMoved?: boolean;
}

export interface Move {
  from: string;
  to: string;
}

export class ChessGame {
  private board: (ChessPiece | null)[][];
  private currentPlayer: Color;
  private gameState: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  private moveHistory: Move[];
  private boardHistory: string[];
  private lastMovedPiece: ChessPiece | null;

  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.gameState = 'playing';
    this.moveHistory = [];
    this.boardHistory = [];
    this.lastMovedPiece = null;
    this.boardHistory.push(this.getBoardState());
  }

  // Utility methods for coordinate conversion
  private algebraicToCoords(pos: string): { row: number, col: number } {
    const col = pos.charCodeAt(0) - 97;
    const row = 8 - parseInt(pos[1]);
    return { row, col };
  }

  private coordsToAlgebraic(row: number, col: number): string {
    return `${String.fromCharCode(97 + col)}${8 - row}`;
  }

  // Simplified move validation methods
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  // Check if a player's king is in check
  private isInCheck(color: Color): boolean {
    const king = this.findKing(color);
    if (!king) return false;

    // Check if any opponent's piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color !== color) {
          // Get moves without recursively checking for check
          const moves = this.getPossibleMovesWithoutCheckRecursion(piece);
          if (moves.includes(king.position)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // A version of getPossibleMoves that doesn't check for check recursively
  private getPossibleMovesWithoutCheckRecursion(piece: ChessPiece): string[] {
    switch (piece.type) {
      case 'pawn':
        return this.getPawnMoves(piece);
      case 'rook':
        return this.getRookMoves(piece);
      case 'knight':
        return this.getKnightMoves(piece);
      case 'bishop':
        return this.getBishopMoves(piece);
      case 'queen':
        return this.getQueenMoves(piece);
      case 'king':
        return this.getKingMovesWithoutCheck(piece);
      default:
        return [];
    }
  }

  // Get possible moves with check validation
  getPossibleMoves(piece: ChessPiece): string[] {
    // Get initial moves without check consideration
    let moves = this.getPossibleMovesWithoutCheckRecursion(piece);

    // Filter out moves that would put the king in check
    moves = moves.filter(move => {
      // Simulate the move
      const fromCoords = this.algebraicToCoords(piece.position);
      const toCoords = this.algebraicToCoords(move);
      
      const originalPiece = this.board[toCoords.row][toCoords.col];
      const originalPosition = piece.position;

      // Update piece positions
      this.board[toCoords.row][toCoords.col] = piece;
      this.board[fromCoords.row][fromCoords.col] = null;
      piece.position = move;
      
      const wouldBeInCheck = this.isInCheck(piece.color);
      
      // Revert the simulated move
      this.board[fromCoords.row][fromCoords.col] = piece;
      this.board[toCoords.row][toCoords.col] = originalPiece;
      piece.position = originalPosition;
      
      return !wouldBeInCheck;
    });

    return moves;
  }

  // Specific move calculation methods
  private getPawnMoves(piece: ChessPiece): string[] {
    const moves: string[] = [];
    const { row, col } = this.algebraicToCoords(piece.position);
    const direction = piece.color === 'white' ? -1 : 1;

    // Check forward moves
    const forwardMove = this.coordsToAlgebraic(row + direction, col);
    if (this.isValidPosition(row + direction, col) && !this.board[row + direction][col]) {
      moves.push(forwardMove);

      // Initial two-square move
      if (!piece.hasMoved) {
        const doubleForwardMove = this.coordsToAlgebraic(row + 2 * direction, col);
        if (!this.board[row + 2 * direction][col]) {
          moves.push(doubleForwardMove);
        }
      }
    }

    // Capture moves
    const captureLeft = this.coordsToAlgebraic(row + direction, col - 1);
    const captureRight = this.coordsToAlgebraic(row + direction, col + 1);

    // Check left diagonal capture
    if (this.isValidPosition(row + direction, col - 1)) {
      const leftCapturePiece = this.board[row + direction][col - 1];
      if (leftCapturePiece && leftCapturePiece.color !== piece.color) {
        moves.push(captureLeft);
      }
    }

    // Check right diagonal capture
    if (this.isValidPosition(row + direction, col + 1)) {
      const rightCapturePiece = this.board[row + direction][col + 1];
      if (rightCapturePiece && rightCapturePiece.color !== piece.color) {
        moves.push(captureRight);
      }
    }

    return moves;
  }

  private getRookMoves(piece: ChessPiece): string[] {
    const moves: string[] = [];
    const { row, col } = this.algebraicToCoords(piece.position);
    
    // Directions: up, down, left, right
    const directions = [
      [0, 1], [0, -1], [1, 0], [-1, 0]
    ];

    for (const [dRow, dCol] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;
        
        if (!this.isValidPosition(newRow, newCol)) break;

        const targetPiece = this.board[newRow][newCol];
        const newPos = this.coordsToAlgebraic(newRow, newCol);
        
        if (!targetPiece) {
          moves.push(newPos);
          continue;
        }

        if (targetPiece.color !== piece.color) {
          moves.push(newPos);
        }
        break;
      }
    }

    return moves;
  }

  private getKnightMoves(piece: ChessPiece): string[] {
    const moves: string[] = [];
    const { row, col } = this.algebraicToCoords(piece.position);
    
    // Knight move offsets
    const offsets = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

    for (const [dRow, dCol] of offsets) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (!this.isValidPosition(newRow, newCol)) continue;

      const newPos = this.coordsToAlgebraic(newRow, newCol);
      const targetPiece = this.board[newRow][newCol];

      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }

    return moves;
  }

  private getBishopMoves(piece: ChessPiece): string[] {
    const moves: string[] = [];
    const { row, col } = this.algebraicToCoords(piece.position);
    
    // Diagonal directions
    const directions = [
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [dRow, dCol] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;
        
        if (!this.isValidPosition(newRow, newCol)) break;

        const targetPiece = this.board[newRow][newCol];
        const newPos = this.coordsToAlgebraic(newRow, newCol);
        
        if (!targetPiece) {
          moves.push(newPos);
          continue;
        }

        if (targetPiece.color !== piece.color) {
          moves.push(newPos);
        }
        break;
      }
    }

    return moves;
  }

  private getQueenMoves(piece: ChessPiece): string[] {
    // Queen combines rook and bishop moves
    return [
      ...this.getRookMoves(piece),
      ...this.getBishopMoves(piece)
    ];
  }

  // A version of getKingMoves that doesn't recursively check for check
  private getKingMovesWithoutCheck(piece: ChessPiece): string[] {
    const moves: string[] = [];
    const { row, col } = this.algebraicToCoords(piece.position);
    
    // All adjacent squares
    const offsets = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [dRow, dCol] of offsets) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (!this.isValidPosition(newRow, newCol)) continue;

      const newPos = this.coordsToAlgebraic(newRow, newCol);
      const targetPiece = this.board[newRow][newCol];

      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }

    // Basic castling check (simplified)
    if (!piece.hasMoved) {
      // Kingside castling
      if (this.canCastle(piece.color, 'kingside')) {
        moves.push(this.coordsToAlgebraic(row, col + 2));
      }
      // Queenside castling
      if (this.canCastle(piece.color, 'queenside')) {
        moves.push(this.coordsToAlgebraic(row, col - 2));
      }
    }

    return moves;
  }

  // Simplified castling check
  private canCastle(color: Color, side: 'kingside' | 'queenside'): boolean {
    const row = color === 'white' ? 7 : 0;
    const rookCol = side === 'kingside' ? 7 : 0;
    const rook = this.board[row][rookCol];
    const king = this.findKing(color);
  
    if (!rook || rook.type !== 'rook' || rook.hasMoved || !king || king.hasMoved) return false;
  
    const direction = side === 'kingside' ? 1 : -1;
    const { col } = this.algebraicToCoords(king.position);
    const targetCol = col + 2 * direction;
  
    // Check path is clear
    for (let c = col + direction; c !== targetCol; c += direction) {
      if (this.board[row][c]) return false;
    }
  
    return true;
  }

  // Make a move on the board
  makeMove(from: string, to: string): boolean {
    const fromCoords = this.algebraicToCoords(from);
    const toCoords = this.algebraicToCoords(to);

    const piece = this.board[fromCoords.row][fromCoords.col];
    if (!piece || piece.color !== this.currentPlayer) return false;

    const possibleMoves = this.getPossibleMoves(piece);
    if (!possibleMoves.includes(to)) return false;

    // Store the existing piece at the destination (for capture)
    const capturedPiece = this.board[toCoords.row][toCoords.col];

    // Actually move the piece
    this.board[toCoords.row][toCoords.col] = piece;
    this.board[fromCoords.row][fromCoords.col] = null;
    
    // Update piece position and movement status
    const originalPosition = piece.position;
    piece.position = to;
    piece.hasMoved = true;

    // Check if this move puts the king in check
    if (this.isInCheck(this.currentPlayer)) {
      // Revert the move
      this.board[fromCoords.row][fromCoords.col] = piece;
      this.board[toCoords.row][toCoords.col] = capturedPiece;
      piece.position = originalPosition;
      piece.hasMoved = false;
      return false;
    }

    // Record the move
    this.moveHistory.push({ from, to });
    this.lastMovedPiece = piece;

    // Record board state for threefold repetition
    const newBoardState = this.getBoardState();
    this.boardHistory.push(newBoardState);

    // Switch players
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

    // Update game state (simplified)
    this.updateGameState();

    return true;
  }

  // Find the king of a specific color
  private findKing(color: Color): ChessPiece | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          return piece;
        }
      }
    }
    return null;
  }

  // Update game state
  private updateGameState() {
    // Simplified game state update
    const opposingColor = this.currentPlayer === 'white' ? 'black' : 'white';
    const opposingPieces = this.board.flatMap(row => 
      row.filter(piece => piece && piece.color === opposingColor) as ChessPiece[]
    );

    const hasValidMoves = opposingPieces.some(piece => 
      this.getPossibleMoves(piece).length > 0
    );

    const isInCheck = this.isInCheck(opposingColor);

    if (isInCheck && !hasValidMoves) {
      this.gameState = 'checkmate';
    } else if (!hasValidMoves) {
      this.gameState = 'stalemate';
    } else if (isInCheck) {
      this.gameState = 'check';
    } else {
      this.gameState = 'playing';
    }
  }

  // Helpers for board initialization and state tracking
  private initializeBoard(): (ChessPiece | null)[][] {
    const newBoard: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Helper to setup row of pieces
    const setupRow = (color: Color, row: number) => {
      const pieces: Piece[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
      pieces.forEach((type, col) => {
        newBoard[row][col] = { 
          type, 
          color, 
          position: `${String.fromCharCode(97 + col)}${8 - row}`,
          hasMoved: false 
        };
      });
    };

    // Setup pawns
    [1, 6].forEach((row, index) => {
      for (let col = 0; col < 8; col++) {
        newBoard[row][col] = { 
          type: 'pawn', 
          color: index === 0 ? 'black' : 'white',
          position: `${String.fromCharCode(97 + col)}${8 - row}`,
          hasMoved: false 
        };
      }
    });

    setupRow('black', 0);
    setupRow('white', 7);

    return newBoard;
  }

  private getBoardState(): string {
    return this.board.map(row => 
      row.map(piece => 
        piece ? `${piece.type}-${piece.color}-${piece.position}` : 'null'
      ).join('|')
    ).join('\n');
  }

  // Getters for game state and board
  getBoard() {
    return this.board;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getGameState() {
    return this.gameState;
  }
}

export default ChessGame;