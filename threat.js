class Threat {
    constructor(piece, pieceColor, row, col) {
        this.piece = piece;
        this.pieceColor = pieceColor;
        this.row = row;
        this.col = col;
    }

    toString() {
        return `Threat { piece: ${this.piece}, pieceColor: ${this.pieceColor}, row: ${this.row}, col: ${this.col} }`;        
    }
}

export default Threat;