import { displayName, repository } from "@/../package.json";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { puzzles } from "@/lib/puzzles/puzzles";
import { Board as BoardType } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButtons } from "./ActionButtons/ActionButtons";
import "./App.css";
import { Board } from "./Board";
import { Theme, themeList } from "./themes/themes";
import "./themes/themes.css";

export type BoardState = {
  board: BoardType;
  id: number;
};

export const initialBoardState: BoardState = {
  board: structuredClone(puzzles[0]),
  id: 0,
};

const App = () => {
  const [theme, setTheme] = useLocalStorage<Theme>("app-theme", themeList[0]);

  const boardState = useRef<BoardState>(initialBoardState).current;
  const [puzzleNum, _setPuzzleNum] = useState(0);

  const setPuzzleNum = useCallback(
    (newNum: number | ((prevNum: number) => number)) => {
      _setPuzzleNum((prev) => {
        const newPuzzleNum =
          typeof newNum === "function" ? newNum(prev) : newNum;
        boardState.id = newPuzzleNum;
        boardState.board = structuredClone(puzzles[newPuzzleNum]);
        document.location.hash = newPuzzleNum.toString();
        return newPuzzleNum;
      });
    },
    []
  );

  useEffect(() => {
    const hashPuzzleNum = parseInt(document.location.hash.slice(1));
    if (
      hashPuzzleNum !== puzzleNum &&
      hashPuzzleNum >= 0 &&
      hashPuzzleNum < puzzles.length
    ) {
      setPuzzleNum(hashPuzzleNum);
    }
  }, []);

  useEffect(() => {
    if (puzzleNum < 0 || puzzleNum >= puzzles.length) return;
    if (boardState.id !== puzzleNum) {
      boardState.id = puzzleNum;
      boardState.board = structuredClone(puzzles[puzzleNum]);
    }
  }, [puzzleNum]);

  return (
    <>
      <a
        className="github-fork-ribbon"
        href={repository.url}
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      >
        Fork me on GitHub
      </a>
      <div
        className={`flex flex-col items-center h-screen w-screen overflow-hidden theme-${theme}`}
      >
        <h1 className="py-2 m-0">{displayName}</h1>
        <Board boardState={boardState} setPuzzleNum={setPuzzleNum} />
        <ActionButtons setTheme={setTheme} setPuzzleNum={setPuzzleNum} />
      </div>
    </>
  );
};

export default App;
