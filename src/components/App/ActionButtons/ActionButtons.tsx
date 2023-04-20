import { loadFromFEN } from "@/lib/puzzles/fenLoader";
import { puzzles } from "@/lib/puzzles/puzzles";
import { solvePuzzle } from "@/lib/tools/solver";
import { usePreferences } from "@/providers/preferencesProvider";
import { FC, useCallback } from "react";
import { Theme, themeList } from "../themes/themes";
import "./ActionButtons.css";

export interface ActionButtonsProps {
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  setPuzzleNum: React.Dispatch<React.SetStateAction<number>>;
}

export const ActionButtons: FC<ActionButtonsProps> = ({
  setTheme,
  setPuzzleNum,
}) => {
  const previousButtonClick = useCallback(() => {
    setPuzzleNum((prev) => {
      return (prev + puzzles.length - 1) % puzzles.length;
    });
  }, [setPuzzleNum]);
  const nextButtonClick = useCallback(() => {
    setPuzzleNum((prev) => {
      return (prev + 1) % puzzles.length;
    });
  }, [setPuzzleNum]);

  const loadFenButtonClick = useCallback(() => {
    // TODO: this can be implemented more elegantly
    const fen = prompt("Enter FEN:");
    if (fen === null) return;
    const board = loadFromFEN(fen);
    puzzles.push({
      board,
      solutionMoves: solvePuzzle(board)?.length ?? 0,
    });
    setPuzzleNum(puzzles.length - 1);
  }, [puzzles]);

  const nextThemeButtonClick = useCallback(() => {
    setTheme((theme) => {
      const nextThemeIndex = (themeList.indexOf(theme) + 1) % themeList.length;
      return themeList[nextThemeIndex];
    });
  }, [setTheme]);

  const { themeMode, setThemeMode, soundMode, setSoundMode } = usePreferences();
  const darkModeButtonClick = useCallback(() => {
    setThemeMode((themeMode) => (themeMode === "dark" ? "light" : "dark"));
  }, [setThemeMode]);
  const soundModeButtonClick = useCallback(() => {
    setSoundMode((soundMode) => !soundMode);
  }, [setSoundMode]);

  const cheatButtonClick = useCallback(() => {}, []);

  const aboutButtonClick = useCallback(() => {}, []);
  return (
    <div className={`flex flex-row justify-center flex-wrap`}>
      <button className="button" id="btnPrevious" onClick={previousButtonClick}>
        Previous
      </button>
      <button className="button" id="btnNext" onClick={nextButtonClick}>
        Next
      </button>
      <button className="button" id="btnLoadFen" onClick={loadFenButtonClick}>
        Load FEN
      </button>
      <button className="button" id="btnSound" onClick={soundModeButtonClick}>
        {soundMode ? "🔊" : "🔇"}
      </button>
      <button
        className="button"
        id="btnNextTheme"
        onClick={nextThemeButtonClick}
      >
        🎨
      </button>
      <button
        className="button"
        id="btnDarkMode"
        value="dark"
        onClick={darkModeButtonClick}
      >
        {themeMode === "dark" ? "🌞" : "🌙"}
      </button>
      <button
        className="button hidden"
        id="btnCheat"
        onClick={cheatButtonClick}
      >
        ✨
      </button>
      <button className="button" id="btnAbout" onClick={aboutButtonClick}>
        ?
      </button>
    </div>
  );
};
