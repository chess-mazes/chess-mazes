export const pieceNames: {[k: string]: string} = {
  p: 'Pawn',
  r: 'Rook',
  n: 'Knight',
  b: 'Bishop',
  q: 'Queen',
  k: 'King',
};

export const rowColToAlgebraic = (row: number, col: number) => {
  let rank = 8 - row;
  let file = String.fromCharCode(65 + col);
  return file + rank;
};
