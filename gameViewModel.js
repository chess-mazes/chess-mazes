import puzzles from './assets/puzzles/puzzles.js';
import loadFromFEN from './fenLoader.js';
import themes from './themes.js';
import GameModel from './gameModel.js';
import solvePuzzle from './solver.js';

class GameViewModel {
    constructor(gameModel) {
        this._gameModel = gameModel;
        this._subscribers = [];
        this._curPuzzle = 0;
        this._curTheme = 0;
        this._curThemeMode = "light";
        this._soundOn = false;
        this._title = 'Chess Mazes';
        this._solvedPuzzles = new Set();
        this._customPuzzle = false;
        this._solutionLength = null;
        this._moveCount = 0;
        this._cheatCode = 'amaze';
        this._enteredCheatCode = "";

        gameModel.subscribe(this._boardChanged.bind(this));
        this._playlist = ['./music/Strobotone-Medieval-Theme01.mp3', './music/Strobotone-Medieval-Theme02.mp3']
        this._currentSong = 0
        this._audio = false
    }

    subscribe(callback) {
        this._subscribers.push(callback);
    }

    start() {
        if (localStorage.getItem('soundOn') === 'true') {
            this.toggleSound();
        }

        // Apply themeMode according to localStorage value
        localStorage.getItem('themeMode') === 'dark' ? this.applyThemeMode('dark') : this.applyThemeMode('light');

        let puzzleNum = null;
        if (document.location.hash) {
            puzzleNum = parseInt(document.location.hash.substring(1));
        }

        if (puzzleNum >= 1 && puzzleNum <= puzzles.length) {
            this._curPuzzle = puzzleNum - 1;
        } else if (localStorage.getItem('curPuzzle')) {
            this._curPuzzle = parseInt(localStorage.getItem('curPuzzle'));
        }

        if (localStorage.getItem('curTheme')) {
            this._curTheme = parseInt(localStorage.getItem('curTheme'));
            this.loadCurrentTheme();
        }

        if (localStorage.getItem('solvedPuzzles')) {
            this._solvedPuzzles = new Set(JSON.parse(localStorage.getItem('solvedPuzzles')));
            this._notifySubscribers('SolvedPuzzlesChanged', this._solvedPuzzles);
        }

        this.loadCurrentPuzzle();

        if (localStorage.getItem('aboutRead') !== 'true') {
            this._notifySubscribers('ShowAbout', null);
        }
    }

    applyThemeMode(mode) {
        this._curThemeMode = mode;
        localStorage.setItem("themeMode", this._curThemeMode);
        this._notifySubscribers("ChangeThemeMode", mode);
    }

    loadCurrentPuzzle() {
        let solvedText = this._solvedPuzzles.has(this._curPuzzle + 1) ? ' ✅' : '';

        this._gameModel.loadPuzzle(puzzles[this._curPuzzle]);
        this._solvePuzzle(puzzles[this._curPuzzle]);
        this._setTitle(`Chess Mazes #${this._curPuzzle + 1}${solvedText}`);
        this._customPuzzle = false;
        localStorage.setItem('curPuzzle', this._curPuzzle);
        document.location.hash = this._curPuzzle + 1;
        this._moveCount = 0;
    }

    loadNextPuzzle() {
        this._curPuzzle = (this._curPuzzle + 1) % puzzles.length;
        localStorage.setItem('curPuzzle', this._curPuzzle);
        this.loadCurrentPuzzle(puzzles[this._curPuzzle]);
    }

    loadPrevPuzzle() {
        this._curPuzzle = (this._curPuzzle - 1 + puzzles.length) % puzzles.length;
        localStorage.setItem('curPuzzle', this._curPuzzle);
        this.loadCurrentPuzzle();
    }

    loadCurrentTheme() {
        this._notifySubscribers('ThemeChanged', themes[this._curTheme]);
        localStorage.setItem('curTheme', this._curTheme);
    }

    loadNextTheme() {
        this._curTheme = (this._curTheme + 1) % themes.length;
        this.loadCurrentTheme();
    }

    loadPrevTheme() {
        this._curTheme = (this._curTheme - 1 + themes.length) % themes.length;
        this.loadCurrentTheme();
    }

    loadFen(fenString) {
        let puzzle = loadFromFEN(fenString);
        this._gameModel.loadPuzzle(puzzle);
        this._solvePuzzle(puzzle)
        this._moveCount = 0;
        this._customPuzzle = true;
        this._setTitle('Custom Puzzle');
        document.location.hash = '';
    }

    setAboutRead(status = true) {
        localStorage.setItem('aboutRead', status);
    }


    // toggleSound() {
    //     this._soundOn = !this._soundOn;
    //     localStorage.setItem('soundOn', this._soundOn);
    //     this._notifySubscribers('SoundToggled', this._soundOn);

    //     if(this._soundOn){
    //         this.soundIsOn(this._currentSong)
    //     }
    // }
    // soundIsOn(currentSong){
    //     while(currentSong < this._playlist.length){
    //         let audio = new Audio(this._playlist[currentSong])
    //         audio.play()
    //         currentSong += 1
    //     }
    //     soundIsOn(0)
    // }

    toggleSound() {
        this._soundOn = !this._soundOn;
        localStorage.setItem('soundOn', this._soundOn);
        this._notifySubscribers('SoundToggled', this._soundOn);

        if(this._soundOn){
            if (this._audio) {
                this._audio.pause();
            }
            console.log("start");
            this._currentSong = 0;
            this.playNext()
        }
    }

    playNext() { 
        if (this._currentSong < this._playlist.length) { 
          this._audio = new Audio(this._playlist[this._currentSong]); 
          this._audio.addEventListener("ended", this.playNext); 
          this._audio.play(); 
          console.log(`playing ${this._playlist[this._currentSong]}`); 
          this._currentSong += 1; 
        } else { 
            this._currentSong = 0
            this.playNext()
        } 
      }  

    handleSquareClick(row, col) {
        let whitePieceLocation = this._gameModel.locateWhitePiece();
        if (whitePieceLocation == null) {
            throw new Error('Could not locate white piece');
        }

        this._movePiece(...whitePieceLocation, row, col);
    }

    handleSquareDragDrop(startRow, startCol, endRow, endCol) {
        this._movePiece(startRow, startCol, endRow, endCol);
    }

    _movePiece(startRow, startCol, endRow, endCol) {
        if (!this._gameModel.movePiece(startRow, startCol, endRow, endCol)) {
            return;
        }

        this._moveCount++;

        if (this._soundOn) {
            this._notifySubscribers('PlaySound', null);
        }

        // Check if we are threatened
        let threat = this._gameModel.findSquareThreat(endRow, endCol, true);
        if (threat) {
            this._notifySubscribers('WhiteThreatened', threat);
            return;            
        }

        // Check if the black king is threatened
        let blackKingLocation = this._gameModel.locateBlackKing();
        if (blackKingLocation == null) {
            throw new Error('Could not locate black king');
        }

        if (this._gameModel.validateMove(endRow, endCol, ...blackKingLocation).status === true) {
            if (this._solutionLength != null && this._moveCount > this._solutionLength) {
                this._notifySubscribers('TooManyMoves', {
                    moveCount: this._moveCount,
                    maxMoves: this._solutionLength
                });
            } else {
                this._notifySubscribers('PuzzleSolved', null);
                this._puzzleSolved();
            }
        }
    }

    _puzzleSolved() {
        if (!this._customPuzzle) {
            this._solvedPuzzles.add(this._curPuzzle + 1);
            localStorage.setItem('solvedPuzzles', JSON.stringify(Array.from(this._solvedPuzzles)));
            this._notifySubscribers('SolvedPuzzlesChanged', this._solvedPuzzles);
        }
    }

    _boardChanged() {
        this._notifySubscribers('BoardChanged', this._gameModel.getBoard());
    }

    _setTitle(title) {
        this._title = title;
        this._notifySubscribers('TitleChanged', this._title);
    }

    _notifySubscribers(event, data=null) {
        for (let subscriber of this._subscribers) {
            subscriber(event, data);
        }
    }

    _solvePuzzle(puzzle, drawArrows=false) {
        console.log('Solving puzzle...');
        let startTime = performance.now();

        let result = solvePuzzle(puzzle);
        if (result == null) {
            console.log('Could not solve puzzle');
            this._solutionLength = null;
        }

        this._solutionLength = result.length - 1;
        console.log(`Solved puzzle using ${this._solutionLength} moves in ${performance.now() - startTime} ms`);

        if (drawArrows) {
            // Draw the solution using DrawArrow events
            let [startRow, startCol] = result[0];
            for (let i = 1; i < result.length; i++) {
                let [endRow, endCol] = result[i];
                this._notifySubscribers('DrawArrow', [startRow, startCol, endRow, endCol]);
                [startRow, startCol] = [endRow, endCol];
            }
        }
    }

    cheatKeyTyped(key) {
        this._enteredCheatCode += key;
        
        // Slice the entered cheat to the length of the actual cheat code
        this._enteredCheatCode = this._enteredCheatCode.slice(-this._cheatCode.length);
        if (this._enteredCheatCode === this._cheatCode) {
            this._enteredCheatCode = '';
            this._notifySubscribers('ShowCheatButton', null);
        }
    }

    cheatButtonPressed() {
        if (this._customPuzzle) {
            this._solvePuzzle(this._gameModel.getBoard(), true);
        } else {
            this._solvePuzzle(puzzles[this._curPuzzle], true);
        }
    }
}

export default GameViewModel;
