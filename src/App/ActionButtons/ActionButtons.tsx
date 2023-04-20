import { SetLocalObjectType } from "@/hooks/useLocalStorage";
import { FC, useCallback } from "react";
import { Theme, themeList } from "../themes/themes";
import "./ActionButtons.css";

export interface ActionButtonsProps {
  theme: Theme;
  setTheme: SetLocalObjectType<Theme>;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ theme, setTheme }) => {
  const previousButtonClick = useCallback(() => {}, []);
  const nextButtonClick = useCallback(() => {}, []);
  const loadFenButtonClick = useCallback(() => {}, []);
  const soundModeButtonClick = useCallback(() => {}, []);
  const nextThemeButtonClick = useCallback(() => {
    setTheme((theme) => {
      console.log(theme);
      const nextThemeIndex = (themeList.indexOf(theme) + 1) % themeList.length;
      console.log(themeList[nextThemeIndex]);
      return themeList[nextThemeIndex];
    });
  }, [setTheme]);
  const darkModeButtonClick = useCallback(() => {}, []);
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
        Sound: Off
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
        Dark Mode
      </button>
      <button
        className="button d-none"
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
