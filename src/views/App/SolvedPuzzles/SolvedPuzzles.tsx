import {gameViewModel} from '@/services/gameViewModel';
import {observer} from 'mobx-react';
import {FC} from 'react';

export interface SolvedPuzzlesProps {}

export const SolvedPuzzles: FC<SolvedPuzzlesProps> = observer(({}) => {
  const {solvedPuzzles} = gameViewModel;

  return (
    <div className="flex flex-col items-center py-1 px-3 rounded-3xl mx-auto bg-background3 my-1">
      <div className="flex flex-row justify-center items-center flex-wrap p-1">
        <p className="font-bold text-md mx-2">Solved:</p>
        {solvedPuzzles.length === 0 ? (
          <p className="text-md mx-2">None</p>
        ) : (
          solvedPuzzles
            .filter((id) => id !== null && id !== undefined)
            .map((puzzleId, index) => {
              return (
                <div
                  className="bg-background4 rounded-full w-7 h-7 m-1 flex items-center justify-center cursor-default hover:bg-background5"
                  key={puzzleId}
                >
                  {puzzleId + 1}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
});
