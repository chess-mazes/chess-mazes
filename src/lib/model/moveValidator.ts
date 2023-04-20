import { Board } from "../types";

export function isValidMove(
  board: Board,
  startCol: number,
  startRow: number,
  endCol: number,
  endRow: number,
  verbose = false,
  blackToMove = false
) {
  let piece = board[startRow * 8 + startCol];
  if (piece === "") return false;

  if (blackToMove) {
    if (piece.toLowerCase() !== piece) {
      if (verbose) console.log("invalid - white piece");
      return false;
    }
  } else if (piece.toLowerCase() == piece) {
    if (verbose) console.log("invalid - black piece");
    return false;
  }

  piece = piece.toLowerCase();

  if (piece == "p") {
    const direction = blackToMove ? 1 : -1;

    // Check if the pawn is moving to next row
    if (endRow !== startRow + direction) {
      if (verbose) console.log("invalid - not moving to next row");
      return false;
    }

    // Check if pawn is moving diagonally to either side
    if (endCol !== startCol - 1 && endCol !== startCol + 1) {
      if (verbose) console.log("invalid - not moving diagonally");
      return false;
    }

    // Check if the pawn is moving to a square with a friendly piece
    if (
      board[endRow * 8 + endCol].toLowerCase() === board[endRow * 8 + endCol]
    ) {
      if (verbose) console.log("invalid - moving to friendly square");
      return false;
    }
  } else if (piece === "b") {
    // Check if the bishop is moving diagonally
    if (Math.abs(endRow - startRow) !== Math.abs(endCol - startCol)) {
      if (verbose) console.log("invalid - not moving diagonally");
      return false;
    }
  } else if (piece === "n") {
    // Check if the knight is moving two squares vertically and one square horizontally, in any direction
    if (
      !(
        (Math.abs(endRow - startRow) === 2 &&
          Math.abs(endCol - startCol) === 1) ||
        (Math.abs(endRow - startRow) === 1 && Math.abs(endCol - startCol) === 2)
      )
    ) {
      if (verbose)
        console.log(
          "invalid - not moving two squares vertically and one square horizontally"
        );
      return false;
    }
  } else if (piece === "k") {
    // Check if the king is moving more than one square
    if (Math.abs(endRow - startRow) > 1 || Math.abs(endCol - startCol) > 1) {
      if (verbose) console.log("invalid - moving more than one square");
      return false;
    }
  } else if (piece === "r") {
    // Check if the rook is moving horizontally or vertically
    if (endRow !== startRow && endCol !== startCol) {
      if (verbose)
        console.log("invalid - not moving horizontally or vertically");
      return false;
    }
  } else if (piece === "q") {
    // Check if the queen is moving horizontally, vertically, or diagonally
    if (
      endRow !== startRow &&
      endCol !== startCol &&
      Math.abs(endRow - startRow) !== Math.abs(endCol - startCol)
    ) {
      if (verbose)
        console.log(
          "invalid - not moving horizontally, vertically, or diagonally"
        );
      return false;
    }
  }

  // Check if blocked by another piece
  if (piece === "b" || piece === "r" || piece === "q") {
    for (
      let i = 1;
      i < Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol));
      i++
    ) {
      let row = startRow + Math.sign(endRow - startRow) * i;
      let col = startCol + Math.sign(endCol - startCol) * i;
      if (board[row * 8 + col] !== "") {
        if (verbose) console.log("invalid - blocked by another piece");
        return false;
      }
    }
  }

  if (verbose)
    console.log(
      `valid - from (${startCol}, ${startRow}) to (${endCol}, ${endRow})`
    );
  return true;
}

export default isValidMove;
