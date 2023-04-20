import { FC } from "react";
import { Theme } from "../themes/themes";
import "./ActionButtons.css";

export interface ActionButtonsProps {
  theme: Theme;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ theme }) => {
  return (
    <div className={`theme-${theme} flex flex-row justify-center flex-wrap`}>
      <button className="button" id="btnPrev">
        Previous
      </button>
      <button className="button" id="btnNext">
        Next
      </button>
      <button className="button" id="btnLoadFen">
        Load FEN
      </button>
      <button className="button" id="btnSound">
        Sound: Off
      </button>
      <button className="button" id="btnNextTheme">
        🎨
      </button>
      <button className="button" id="btnDarkMode" value="dark">
        Dark Mode
      </button>
      <button className="button d-none" id="btnCheat">
        ✨
      </button>
      <button className="button" id="btnAbout">
        ?
      </button>
    </div>
  );
};
