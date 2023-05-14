import {Threat} from './threat';
import {ValidationResult} from './validationResult';
const b:any[] = []
export type Board = string[];
export type Puzzle = {board: Board; bestSolution: Move[] | undefined | null};
export type Move = [row: number, col: number];
export class PieceColor {
  static White = new PieceColor('White');
  static Black = new PieceColor('Black');
  static EmptySquare = new PieceColor('EmptySquare');

  constructor(public color: string) {}
  
  toString() {    
    return `PieceColor { color: ${this.color} }`;
  }
}

// Chess Maze model class
export class GameModel {
  static NumRows = 8;
  static NumCols = 8;
  static ValidPieces = ['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p', ''];
  private subscribers: Function[] = [];
  constructor(public board: Board = []) {}

  loadPuzzle(puzzle: Board) {
    
    let board = JSON.parse(JSON.stringify(puzzle));
    // Check if the puzzle is valid
    if (board.length !== GameModel.NumRows * GameModel.NumCols) {
      throw new Error('Invalid puzzle length');
    }

    for (let piece of board) {
      
      if (!GameModel.ValidPieces.includes(piece)) {        
        throw new Error('Invalid piece in puzzle');
      }
    }

    this.board = board;
    this.notifySubscribers(); // Notify subscribers that the board has changed
  }

  movePiece(startRow: number, startCol: number, endRow: number, endCol: number) {
    // Check if the move is valid
    if (!this.validateMove(startRow, startCol, endRow, endCol, false).status) {      
      return false;
    }

    let piece = this.board[startRow * 8 + startCol];    
    this.board[endRow * 8 + endCol] = piece;    
    this.board[startRow * 8 + startCol] = '';
    this.notifySubscribers(); // Notify subscribers that the board has changed

    return true;
  }

  validateMove(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    blackToMove = false
  )

   {
    // Check if the move is within the bounds of the board
    if (
      startRow < 0 ||
      startRow >= GameModel.NumRows ||
      startCol < 0 ||
      startCol >= GameModel.NumCols ||
      endRow < 0 ||
      endRow >= GameModel.NumRows ||
      endCol < 0 ||
      endCol >= GameModel.NumCols
    ) {
      return ValidationResult.OutOfBounds;
    }

    // Check if the start and end squares are the same
    if (startRow === endRow && startCol === endCol) {

      return ValidationResult.SameSquare;
    }

    // Check if the start square is empty
    if (this.board[startRow * 8 + startCol] === '')
    {
      return ValidationResult.EmptyStartSquare;
    }

    /* Check if the end square is occupied by a friendly piece */

    // Get start square piece color
    let startColor = this.getPieceColor(startRow, startCol);
    let endColor = this.getPieceColor(endRow, endCol);

    if (
      (blackToMove && startColor === PieceColor.White) ||
      (!blackToMove && startColor === PieceColor.Black)
    ) {
      return ValidationResult.EnemyPiece;
    }

    if (startColor === endColor) {      
      return ValidationResult.FriendlyPiece;
    }

    // Get start square piece type
    let pieceType = this.board[startRow * 8 + startCol].toLowerCase();

    // Check if the piece is a pawn
    if (pieceType === 'p') {
      const isWhite = startColor === PieceColor.White;
      const isMovingOneRow = isWhite ? endRow === startRow - 1 : endRow === startRow + 1;
      const isOnStartingRow = isWhite ? startRow === 6 : startRow === 1;
      const isMovingTwoRowsFromStart = isWhite ? endRow === startRow - 2 : endRow === startRow + 2;

      if (!isMovingOneRow && !(isOnStartingRow && isMovingTwoRowsFromStart)) {
        return ValidationResult.InvalidMovePattern;
      }

      // Check if the pawn is moving to the same column
      if (startCol !== endCol) {
        // Check if the pawn is moving to the adjacent column (capturing)
        if (Math.abs(startCol - endCol) !== 1) {
          return ValidationResult.InvalidMovePattern;
        }

        // Check if the pawn is moving two rows
        if (isMovingTwoRowsFromStart) {
          return ValidationResult.InvalidMovePattern;
        }

        // Check if the pawn is capturing an enemy piece
        if (endColor === PieceColor.EmptySquare) {
          return ValidationResult.PawnCapturingEmptySquare;
        }
      } else {
        // Check if the pawn is moving to an empty square
        if (endColor !== PieceColor.EmptySquare) {
          return ValidationResult.BlockedPath;
        }
      }
    } else if (pieceType == 'r') {
      // Check if the rook is moving horizontally or vertically
      if (startRow !== endRow && startCol !== endCol) {
        return ValidationResult.InvalidMovePattern;
      }
    } else if (pieceType == 'n') {
      // Check if the knight is moving in an L shape in any direction
      if (
        !(
          (Math.abs(endRow - startRow) === 2 && Math.abs(endCol - startCol) === 1) ||
          (Math.abs(endRow - startRow) === 1 && Math.abs(endCol - startCol) === 2)
        )
      ) {
        return ValidationResult.InvalidMovePattern;
      }
    } else if (pieceType == 'b') {
      // Check if the bishop is moving diagonally
      if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) {      
        return ValidationResult.InvalidMovePattern;
      }
    } else if (pieceType == 'q') {
      // Check if the queen is moving horizontally, vertically, or diagonally
      if (
        startRow !== endRow &&
        startCol !== endCol &&
        Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)
      ) {
        return ValidationResult.InvalidMovePattern;
      }
    } else if (pieceType == 'k') {
      // Check if the king is moving one square in any direction
      if (Math.abs(startRow - endRow) > 1 || Math.abs(startCol - endCol) > 1) {
        return ValidationResult.InvalidMovePattern;
      }

      // Check if the target square is threatened by an enemy piece
      if (this.findSquareThreat(endRow, endCol, startColor === PieceColor.White)) {
        return ValidationResult.KingThreatenedSquare;
      }
    }

    /* Check if the path is blocked */

    // Knight doesn't need to check for blocked path
    if (pieceType !== 'n') {
      // Check if the path is blocked by moving one square at a time
      let rowDelta = endRow - startRow;
      let colDelta = endCol - startCol;
      let rowStep = rowDelta === 0 ? 0 : rowDelta / Math.abs(rowDelta);
      let colStep = colDelta === 0 ? 0 : colDelta / Math.abs(colDelta);
      let row = startRow + rowStep;
      let col = startCol + colStep;
      while (row !== endRow || col !== endCol) {
        if (this.board[row * 8 + col] !== '') {
          return ValidationResult.BlockedPath;
        }
        row += rowStep;
        col += colStep;
      }
    }

    return ValidationResult.ValidMove;
  }

  getPieceColor(row: number, col: number) {
    let piece = this.board[row * 8 + col];
    if (piece === '') {
      return PieceColor.EmptySquare;
    } else if (piece.toLowerCase() === piece) {
      return PieceColor.Black;
    } else {
      return PieceColor.White;
    }
  }

  findSquareThreat(row: number, col: number, blackToMove = false) {
    // Check if the square is threatened by an enemy piece
    for (let i = 0; i < this.board.length; i++) {
      let piece = this.board[i];
      if (piece !== '') {
        let pieceColor = this.getPieceColor(Math.floor(i / 8), i % 8);
        if (pieceColor == (blackToMove ? PieceColor.Black : PieceColor.White)) {
          let pieceRow = Math.floor(i / 8);
          let pieceCol = i % 8;
          if (this.validateMove(pieceRow, pieceCol, row, col, blackToMove).status) {
            return new Threat(piece, pieceColor, pieceRow, pieceCol);
          }
        }
      }
    }

    return null;
  }

  locateWhitePiece(): Move | null {
    for (let i = 0; i < this.board.length; i++) {
      let row = Math.floor(i / 8);
      let col = i % 8;
      
      if (this.getPieceColor(row, col) === PieceColor.White) {
        return [row, col];
      }
    }

    return null;
  }

  locateBlackKing(): Move | null {
    for (let i = 0; i < this.board.length; i++) {
      let row = Math.floor(i / 8);
      let col = i % 8;

      if (this.board[i] === 'k') {
        return [row, col];
      }
    }

    return null;
  }

  getBoard() {
    
    return JSON.parse(JSON.stringify(this.board));
  }

  subscribe(callback: () => void) {
    this.subscribers.push(callback);
  }

  notifySubscribers() {
    for (let subscriber of this.subscribers) {
      subscriber();
    }
  }
}
