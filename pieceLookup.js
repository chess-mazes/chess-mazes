const pieceNames = {
    'p': 'Pawn',
    'r': 'Rook',
    'n': 'Knight',
    'b': 'Bishop',
    'q': 'Queen',
    'k': 'King',
}

function rowColToAlgebraic(row, col) {
    let rank = 8 - row;
    let file = String.fromCharCode(65 + col);
    return file + rank;
}

export { pieceNames, rowColToAlgebraic };
