import {PieceColor} from './gameModel';

export class Threat {
  constructor(
    public piece: string,
    public pieceColor: PieceColor,
    public row: number,
    public col: number
  ) {}

  toString() {    
    return `Threat { piece: ${this.piece}, pieceColor: ${this.pieceColor}, row: ${this.row}, col: ${this.col} }`;
  }
}
