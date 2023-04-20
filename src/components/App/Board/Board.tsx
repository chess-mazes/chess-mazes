import { FC, useRef } from "react";
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
  const boardElements = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => useRef<HTMLDivElement>(null))
  );

  return (
    <div
      className={`flex flex-col aspect-square max-w-full flex-auto max-h-[100vw]`}
    >
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
                  ref={boardElements[row][col]}
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
      className="p-1"
      src={`./assets/pieceImages/${player}_${content.toLowerCase()}.png`}
    ></img>
  );
};
