import { useForceUpdate } from "@/hooks/useForceUpdate";
import { GameModel } from "@/lib/model/gameModel";
import { FC, useCallback } from "react";
import { BoardState } from "../App";
import "./Board.css";

export interface BoardProps {
  boardState: BoardState;
  setPuzzleNum: React.Dispatch<React.SetStateAction<number>>;
}

// In order to make the board div square at all times, while making sure it is the biggest it can be without overflow, I used two tricks:
// 1. "aspect-square"- aspect-ratio: 1/1, which makes sure the board's width is always equal to its height.
// 2. "max-h-w-screen"- max-height: 100vw, which makes sure that the flex-auto will not stretch the board div beyond the width of the screen.
// TODO: maybe it can be done better, but I couldn't make anything else work, so maybe in the future I'll revisit this.
export const Board: FC<BoardProps> = ({ boardState, setPuzzleNum }) => {
  const forceUpdate = useForceUpdate();

  const move = useCallback((board: BoardState, row: number, col: number) => {
    const game = new GameModel();
    game.loadPuzzle(board.board);
    const pieceLoc = game.locateWhitePiece();
    if (!pieceLoc) return;
    const [startRow, startCol] = pieceLoc;
    const moved = game.movePiece(startRow, startCol, row, col);
    if (moved) {
      // TODO: play sound
      const threat = game.findSquareThreat(row, col, true);
      if (threat) {
        // TODO: add a "threatened" toast here
        game.movePiece(row, col, startRow, startCol);
        return;
      }
      board.board = game.getBoard();
      forceUpdate();

      // TODO: check if the puzzle is solved
    }
  }, []);

  return (
    <div className="flex flex-col aspect-square max-w-full flex-auto max-h-[100vw] text-black">
      {Array.from({ length: 8 }, (_, _row) => {
        const row = 7 - _row;
        return (
          <div className="flex flex-auto flex-row" key={row}>
            {Array.from({ length: 8 }, (_, col) => (
              <div
                className="flex w-full h-full justify-center items-center"
                key={col}
              >
                <div
                  className={`aspect-square square w-full h-full  ${
                    (row + col) % 2 === 0 ? "bg-chess-light" : "bg-chess-dark"
                  }`}
                  onClick={() => move(boardState, _row, col)}
                  onDrop={(e) => {
                    e.preventDefault();
                    move(boardState, _row, col);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Square content={boardState.board[_row * 8 + col]} />
                  {col === 0 && <div className="number-label">{row + 1}</div>}
                  {row === 0 && (
                    <div className="letter-label">
                      {String.fromCharCode(97 + col)}
                      {/* uppercase: {String.fromCharCode(65 + col)} */}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
export const Square: FC<{ content: string }> = ({ content }) => {
  if (content === "") return <></>;
  const player = content.toLowerCase() === content ? "b" : "w";
  return (
    <img
      className="p-1 aspect-square object-contain"
      src={`./assets/pieceImages/${player}_${content.toLowerCase()}.png`}
      alt={content}
      width="100%"
      height="100%"
    ></img>
  );
};
