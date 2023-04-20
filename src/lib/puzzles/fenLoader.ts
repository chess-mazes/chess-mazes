import { Board } from "../types";

const isNumeric = (str: string) => /^\d+$/.test(str);
const isDigit = (char: string) => isNumeric(char);

export const loadFromFEN = (fenString: string): Board => {
  let board: Board = [];
  let lines = fenString.split(" ")[0].split("/");
  if (lines.length !== 8) throw new Error("Invalid FEN string: " + fenString);

  for (const line of lines) {
    for (const char of line) {
      if (isDigit(char)) {
        for (let i = 0; i < char.charCodeAt(0); i++) {
          board.push("");
        }
      } else {
        board.push(char);
      }
    }
  }

  if (board.length !== 64) throw new Error("Invalid FEN string: " + fenString);
  return board;
};
