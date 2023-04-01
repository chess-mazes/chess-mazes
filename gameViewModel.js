import puzzles from './assets/puzzles/puzzles.js';
import loadFromFEN from './fenLoader.js';

class GameViewModel {
    constructor(gameModel) {
        this._gameModel = gameModel;
        this._subscribers = [];
        this._curPuzzle = 0;
        this._soundOn = false;
        this._title = 'Chess Mazes';
        this._solvedPuzzles = new Set();
        this._customPuzzle = false;

        gameModel.subscribe(this._boardChanged.bind(this));
    }

    subscribe(callback) {
        this._subscribers.push(callback);
    }

    start() {
        if (localStorage.getItem('soundOn') === 'true') {
            this.toggleSound();
        }

        if (localStorage.getItem('curPuzzle')) {
            this._curPuzzle = parseInt(localStorage.getItem('curPuzzle'));
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

    loadCurrentPuzzle() {
        let solvedText = this._solvedPuzzles.has(this._curPuzzle + 1) ? ' ✅' : '';

        this._gameModel.loadPuzzle(puzzles[this._curPuzzle]);
        this._setTitle(`Chess Mazes #${this._curPuzzle + 1}${solvedText}`);
        this._customPuzzle = false;
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

    loadFen(fenString) {
        let puzzle = loadFromFEN(fenString);
        this._gameModel.loadPuzzle(puzzle);
        this._customPuzzle = true;
        this._setTitle('Custom Puzzle');
    }

    setAboutRead(status = true) {
        localStorage.setItem('aboutRead', status);
    }

    toggleSound() {
        this._soundOn = !this._soundOn;
        localStorage.setItem('soundOn', this._soundOn);
        this._notifySubscribers('SoundToggled', this._soundOn);
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
            this._notifySubscribers('Check');
            this._puzzleSolved();
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
}

export default GameViewModel;
