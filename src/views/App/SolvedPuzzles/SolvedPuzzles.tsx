import {useGameViewModel} from '@/services/gameViewModel';
import {FC} from 'react';

export interface SolvedPuzzlesProps {}

export const SolvedPuzzles: FC<SolvedPuzzlesProps> = ({}) => {
  const {solvedPuzzles} = useGameViewModel();

  return (
    <div className="flex flex-col items-center py-1 px-3 rounded-3xl mx-auto bg-background3 my-1">
      <div className="flex flex-row justify-center items-center flex-wrap p-1">
        <p className="font-bold text-md mx-2">Solved:</p>
        {solvedPuzzles.length === 0 ? (
          <p className="text-md mx-2">None</p>
        ) : (
          solvedPuzzles.map((puzzleId, index) => {
            if (puzzleId === null) return null;
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
};
