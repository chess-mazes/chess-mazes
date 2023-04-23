import { loadFromFEN } from "@/lib/puzzles/fenLoader";
import { puzzles } from "@/lib/puzzles/puzzles";
import { solvePuzzle } from "@/lib/tools/solver";
import { usePreferences } from "@/providers/preferencesProvider";
import { FC, useCallback } from "react";
import { Theme, themeList } from "../themes/themes";
import "./ActionButtons.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactDOMServer from "react-dom/server";
import { About } from "@/components/About";
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
            const nextThemeIndex =
                (themeList.indexOf(theme) + 1) % themeList.length;
            return themeList[nextThemeIndex];
        });
    }, [setTheme]);

    const { themeMode, setThemeMode, soundMode, setSoundMode } =
        usePreferences();
    const darkModeButtonClick = useCallback(() => {
        setThemeMode((themeMode) => (themeMode === "dark" ? "light" : "dark"));
    }, [setThemeMode]);
    const soundModeButtonClick = useCallback(() => {
        setSoundMode((soundMode) => !soundMode);
    }, [setSoundMode]);

    const cheatButtonClick = useCallback(() => {}, []);

    const aboutButtonClick = useCallback(() => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: "About",
            html: ReactDOMServer.renderToStaticMarkup(<About />),
            confirmButtonText: "Got it!",
            didOpen: () => {},
        });
    }, []);
    return (
        <div className={`flex flex-row justify-center flex-wrap my-10`}>
            <button
                className="button"
                id="btnPrevious"
                onClick={previousButtonClick}
            >
                Previous
            </button>
            <button className="button" id="btnNext" onClick={nextButtonClick}>
                Next
            </button>
            <button
                className="button"
                id="btnLoadFen"
                onClick={loadFenButtonClick}
            >
                Load FEN
            </button>
            <button
                className="button"
                id="btnSound"
                onClick={soundModeButtonClick}
                title="Sound on/off"

            >
                {soundMode ? "🔊" : "🔇"}
            </button>
            <button
                className="button"
                id="btnNextTheme"
                onClick={nextThemeButtonClick}
                title="Change theme"
            >
                🎨
            </button>
            <button
                className="button"
                id="btnDarkMode"
                value="dark"
                onClick={darkModeButtonClick}
                title="Dark/Light mode"

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
            <button className="button" id="btnAbout" onClick={aboutButtonClick} 
                            title="About"

            >
                ?
            </button>
        </div>
    );
};
