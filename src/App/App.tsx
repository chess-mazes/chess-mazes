import { displayName, repository } from "@/../package.json";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ActionButtons } from "./ActionButtons/ActionButtons";
import "./App.css";
import { Board } from "./Board";
import { Theme, themeList } from "./themes/themes";
import "./themes/themes.css";

const App = () => {
  const [theme, setTheme] = useLocalStorage<Theme>("app-theme", themeList[0]);

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
      <div
        className={`flex flex-col items-center h-screen w-screen overflow-hidden theme-${theme}`}
      >
        <h1 className="py-2 m-0">{displayName}</h1>
        <Board />
        <ActionButtons theme={theme} setTheme={setTheme} />
      </div>
    </>
  );
};

export default App;
