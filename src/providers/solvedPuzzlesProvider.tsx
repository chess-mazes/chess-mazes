import {useLocalStorage} from '@/hooks/useLocalStorage';
import {createContext, useContext} from 'react';

export type SolvedList = number[];
export type SolvedContext = {
  solvedList: SolvedList;
  setSolvedList: React.Dispatch<React.SetStateAction<SolvedList>>;
};

export const defaultSolvedPuzzles: SolvedContext = {
  solvedList: [],
  setSolvedList: () => {},
};

export const SolvedPuzzlesContext = createContext<SolvedContext>(defaultSolvedPuzzles);
export const SolvedPuzzlesProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const [solvedList, setSolvedList] = useLocalStorage<SolvedList>(
    'solvedPuzzles',
    defaultSolvedPuzzles.solvedList
  );

  return (
    <SolvedPuzzlesContext.Provider
      value={{
        solvedList,
        setSolvedList,
      }}
    >
      {children}
    </SolvedPuzzlesContext.Provider>
  );
};

export const useSolvedPuzzles = () => useContext(SolvedPuzzlesContext);
