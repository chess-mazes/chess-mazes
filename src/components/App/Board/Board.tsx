import { useForceUpdate } from "@/hooks/useForceUpdate";
import { GameModel } from "@/lib/model/gameModel";
import { puzzles } from "@/lib/puzzles/puzzles";
import { pieceNames } from "@/lib/tools/pieceLookup";
import { usePreferences } from "@/providers/preferencesProvider";
import { FC, useCallback, useEffect, useRef } from "react";
import { BoardState } from "../App";
import "./Board.css";

export interface BoardProps {
  boardState: BoardState;
  puzzleNum: number;
  setPuzzleNum: React.Dispatch<React.SetStateAction<number>>;
}

// In order to make the board div square at all times, while making sure it is the biggest it can be without overflow, I used two tricks:
// 1. "aspect-square"- aspect-ratio: 1/1, which makes sure the board's width is always equal to its height.
// 2. "max-h-[100vw]"- max-height: 100vw, which makes sure that the flex-auto will not stretch the board div beyond the width of the screen.
// TODO: maybe it can be done better, but I couldn't make anything else work, so maybe in the future I'll revisit this.
export const Board: FC<BoardProps> = ({
  boardState,
  setPuzzleNum,
  puzzleNum,
}) => {
  const forceUpdate = useForceUpdate();
  const moveCount = useRef(0);
  const moveSound = useRef(new Audio("/assets/moveSound/move.mp3")).current;

  const { soundMode } = usePreferences();

  const move = useCallback(
    (boardS: BoardState, row: number, col: number) => {
      // TODO: replace alert with a toast
      const game = new GameModel(boardS.puzzle.board);
      const pieceLoc = game.locateWhitePiece();
      if (!pieceLoc) return;
      const [startRow, startCol] = pieceLoc;
      const oldBoard = structuredClone(boardS.puzzle.board);
      const moved = game.movePiece(startRow, startCol, row, col);
      if (moved) {
        if (soundMode) moveSound.play();
        const threat = game.findSquareThreat(row, col, true);
        if (threat) {
          alert(
            "You can't move there, it's threatened by " +
              pieceNames[threat.piece] +
              " at " +
              String.fromCharCode(65 + threat.col) +
              (8 - threat.row)
          );
          // undo the move
          boardS.puzzle.board = oldBoard;
          game.board = oldBoard;
          return;
        }
        moveCount.current++;
        forceUpdate();

        // check if the puzzle is solved
        const kingLoc = game.locateBlackKing();
        if (!kingLoc) return;
        if (game.validateMove(row, col, ...kingLoc).status) {
          if (moveCount.current > boardS.puzzle.solutionMoves) {
            alert(
              "You solved the puzzle, but it took you " +
                moveCount.current +
                " moves, while the best  solution takes " +
                boardS.puzzle.solutionMoves +
                " moves."
            );
            boardS.puzzle.board = structuredClone(puzzles[puzzleNum].board);
            moveCount.current = 0;
            forceUpdate();
            return;
          }
          alert("You solved the puzzle!");
          setPuzzleNum((prev) => prev + 1);
        }
      }
    },
    [puzzleNum, forceUpdate, setPuzzleNum, soundMode]
  );

  useEffect(() => {
    moveCount.current = 0;
  }, [puzzleNum]);

  return (
    <div className="flex flex-col aspect-square max-w-full flex-auto max-h-[100%] mx-auto text-black">
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
                  <Square content={boardState.puzzle.board[_row * 8 + col]} />
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
