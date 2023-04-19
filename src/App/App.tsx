import { useRef } from "react";
import { Board } from "./Board";
import { themeList, Theme } from "./themes/themes";
import "./themes/themes.css";

const App = () => {
  const theme = useRef(themeList[0]).current;

  return (
    <div>
      <Board theme={theme}></Board>
      <p>App view</p>
    </div>
  );
};

export default App;
