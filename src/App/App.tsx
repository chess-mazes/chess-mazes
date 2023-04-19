import { useRef } from "react";
import { Board } from "./Board";
import { themeList } from "./themes/themes";
import { repository, displayName } from "@/../package.json";
import "./themes/themes.css";
import "./App.css";
import { ActionButtons } from "./ActionButtons";

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
      <div className="flex flex-col items-center h-screen w-screen overflow-hidden">
        <h1>{displayName}</h1>
        <Board theme={theme}></Board>
        <p>App view</p>
        <ActionButtons theme={theme}></ActionButtons>
      </div>
    </>
  );
};

export default App;
