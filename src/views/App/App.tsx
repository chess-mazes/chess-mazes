import {displayName} from '@/../package.json';
import {gameViewModel} from '@/services/gameViewModel';
import {preferencesViewModel} from '@/services/preferencesViewModel';
import {observer} from 'mobx-react';
import {ActionButtons} from './ActionButtons/ActionButtons';
import {Board} from './Board/Board';
import {SolvedPuzzles} from './SolvedPuzzles/SolvedPuzzles';
import {boardColorClass} from './boardColors/boardColors';

import './boardColors/boardColors.css';

const App = observer(() => {
  const {boardColors, puzzleId: puzzleNum, isSolved} = gameViewModel;
  const {themeMode} = preferencesViewModel;

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden ${boardColorClass(
        boardColors
      )} theme-mode-${themeMode}`}
    >
      <div className="flex flex-row items-center w-full py-2">
        <p className="font-bold text-4xl mx-auto p-3 puzzle-title">
          {displayName} #{puzzleNum + 1} {isSolved(puzzleNum) ? '✅' : ''}
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
        <Board />
      </div>
      <ActionButtons />
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
  );
});

export default App;
