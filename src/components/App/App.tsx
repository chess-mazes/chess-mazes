import {displayName, repository} from '@/../package.json';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {puzzles} from '@/lib/puzzles/puzzles';
import {Puzzle} from '@/lib/types';
import {useCallback, useEffect, useRef, useState} from 'react';
import {ActionButtons} from './ActionButtons/ActionButtons';
import {Board} from './Board/Board';
import {Theme, themeList} from './themes/themes';
import './themes/themes.css';
import {SolvedPuzzlesProvider, useSolvedPuzzles} from '@/providers/solvedPuzzlesProvider';
import {SolvedPuzzles} from './SolvedPuzzles/SolvedPuzzles';

export type BoardState = {
  puzzle: Puzzle;
  id: number;
};

export const initialBoardState: BoardState = {
  puzzle: structuredClone(puzzles[0]),
  id: 0,
};

const App = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', themeList[0]);

  const boardState = useRef<BoardState>(initialBoardState).current;
  const [puzzleNum, _setPuzzleNum] = useState(0);
  const {solvedList} = useSolvedPuzzles();

  const setPuzzleNum = useCallback((newNum: number | ((prevNum: number) => number)) => {
    _setPuzzleNum((prev) => {
      const newPuzzleNum = typeof newNum === 'function' ? newNum(prev) : newNum;
      boardState.id = newPuzzleNum;
      boardState.puzzle = structuredClone(puzzles[newPuzzleNum]);
      document.location.hash = (newPuzzleNum + 1).toString();
      return newPuzzleNum;
    });
  }, []);

  useEffect(() => {
    const hashPuzzleNum = parseInt(document.location.hash.slice(1)) - 1;
    if (hashPuzzleNum !== puzzleNum && hashPuzzleNum >= 0 && hashPuzzleNum < puzzles.length) {
      setPuzzleNum(hashPuzzleNum);
    }
  }, []);

  return (
    <SolvedPuzzlesProvider>
      <div className={`flex flex-col h-screen w-screen overflow-hidden theme-${theme}`}>
        <div className="flex flex-row items-center w-full py-2">
          <p className="font-bold text-4xl mx-auto p-3 puzzle-title">
            {displayName} #{puzzleNum + 1} {puzzleNum in solvedList ? '✅' : ''}
          </p>
          <a
            className="github-fork-ribbon black right-top hidden md:block"
            href="https://github.com/chess-mazes/chess-mazes"
            data-ribbon="Fork me on GitHub"
            title="Fork me on GitHub"
          >
            Fork me on GitHub
          </a>
        </div>
        <div className="flex-grow overflow-hidden">
          <Board boardState={boardState} setPuzzleNum={setPuzzleNum} puzzleNum={puzzleNum} />
        </div>
        <ActionButtons setTheme={setTheme} setPuzzleNum={setPuzzleNum} />
        <SolvedPuzzles />
        <div className="vercel-banner-container flex justify-center">
          <div className="w-36 mt-2">
            <a href="https://vercel.com?utm_source=chess-mazes&utm_campaign=oss">
              <img
                className="vercel-banner"
                src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg"
                alt="Powered by Vercel"
              />
            </a>
          </div>
        </div>
      </div>
    </SolvedPuzzlesProvider>
  );
};

export default App;
