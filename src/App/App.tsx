import { useRef } from "react";
import { Board } from "./Board";
import { themeList } from "./themes/themes";
import { repository } from "@/../package.json";
import "./themes/themes.css";
import "./App.css";

const App = () => {
  const theme = useRef(themeList[0]).current;

  return (
    <>
      <a
        className="github-fork-ribbon"
        href={repository.url}
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      >
        Fork me on GitHub
      </a>
      <div>
        <Board theme={theme}></Board>
        <p>App view</p>
      </div>
    </>
  );
};

export default App;
