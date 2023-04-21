import { displayName, repository } from "@/../package.json";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { puzzles } from "@/lib/puzzles/puzzles";
import { Puzzle } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButtons } from "./ActionButtons/ActionButtons";
import { Board } from "./Board/Board";
import { Theme, themeList } from "./themes/themes";
import "./themes/themes.css";

export type BoardState = {
    puzzle: Puzzle;
    id: number;
};

export const initialBoardState: BoardState = {
    puzzle: structuredClone(puzzles[0]),
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
                boardState.puzzle = structuredClone(puzzles[newPuzzleNum]);
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

    return (
        <div
            className={`flex flex-col h-screen w-screen overflow-hidden theme-${theme}`}
        >
            <div className="flex flex-row items-center w-full py-2">
                <p className="font-bold text-4xl mx-auto p-3">
                    {displayName} #{puzzleNum}
                </p>
                <a
                    className="github-fork-ribbon black right-top"
                    href="https://github.com/eternaleclipse/chess-mazes"
                    data-ribbon="Fork me on GitHub"
                    title="Fork me on GitHub"
                >
                    Fork me on GitHub
                </a>
                <a
                    href={repository.url}
                    title="Fork me on GitHub"
                    className="pe-2 absolute text-blue-600 hover:text-blue-400 right-0 sm:hidden"
                >
                    GitHub
                </a>
            </div>
            <div className="flex-grow overflow-hidden">
                <Board
                    boardState={boardState}
                    setPuzzleNum={setPuzzleNum}
                    puzzleNum={puzzleNum}
                />
            </div>
            <ActionButtons setTheme={setTheme} setPuzzleNum={setPuzzleNum} />
        </div>
    );
};

export default App;
