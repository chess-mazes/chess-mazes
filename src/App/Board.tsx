import { FC } from "react";
import { Theme } from "./themes/themes";
import "./Board.css";

export interface BoardProps {
  theme: Theme;
}

// In order to make the board div square at all times, while making sure it is the biggest it can be without overflow, I used two tricks:
// 1. "aspect-square"- aspect-ratio: 1/1, which makes sure the board's width is always equal to its height.
// 2. "max-h-w-screen"- max-height: 100vw, which makes sure that the flex-auto will not stretch the board div beyond the width of the screen.
// TODO: maybe it can be done better, but I couldn't make anything else work, so maybe in the future I'll revisit this.
export const Board: FC<BoardProps> = ({ theme }) => {
  return (
    <div
      className={`theme-${theme} flex flex-col aspect-square max-w-full flex-auto max-h-w-screen`}
    >
      {Array.from({ length: 8 }, (_, row) => (
        <div className="flex flex-auto flex-row" key={row}>
          {Array.from({ length: 8 }, (_, col) => (
            <div
              className="flex flex-auto justify-center items-center"
              key={col}
            >
              <div
                className={`aspect-square square w-full h-full ${
                  (row + col) % 2 === 0 ? "white-square" : "black-square"
                }`}
                id={`square-${row}-${col}`}
                data-row={row}
                data-col={col}
              >
                {col === 0 && <div className="number-label">{row + 1}</div>}
                {row === 7 && (
                  <div className="letter-label">
                    {String.fromCharCode(65 + col)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
