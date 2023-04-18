import { pieceImages, moveSound, aboutHtml } from './assets.js';
import { pieceNames, rowColToAlgebraic } from './pieceLookup.js';

class GameView {
    constructor(gameViewModel) {
        this.gameViewModel = gameViewModel;
        this.draggedPiece = null;
        this.theme = 'theme-default';
        this.arrows = [];

        gameViewModel.subscribe((event, data) => {
            console.log(`Event: ${event} Data: ${data}`);
            
            if (event === 'BoardChanged') {
                this.drawBoard(data);
            } else if (event === 'TitleChanged') {
                document.getElementById('page-title').innerText = data;
            } else if (event === 'SoundToggled') {
                document.getElementById('btnSound').innerText = data ? 'Sound: On' : 'Sound: Off';
            } else if (event === 'ShowAbout') {
                this.showAbout();
            } else if (event === 'PlaySound') {
                moveSound.currentTime = 0;
                moveSound.play();
            } else if (event === 'PuzzleSolved') {
                this.puzzleSolvedPopup().then(() => this.gameViewModel.loadNextPuzzle());
            } else if (event === 'TooManyMoves') {
                let moveCount = data.moveCount;
                let maxMoves = data.maxMoves;
                this.tooManyMovesPopup(moveCount, maxMoves).then(
                    () => this.gameViewModel.loadCurrentPuzzle()
                );
            }
            else if (event === 'WhiteThreatened') {
                let threatText = `${pieceNames[data.piece]} at ${rowColToAlgebraic(data.row, data.col)}`;
                this.threatenedPopup(threatText).then(() => this.gameViewModel.loadCurrentPuzzle());
            } else if (event === 'SolvedPuzzlesChanged') {
                let solvedContainer = document.getElementById('solved-container');
                solvedContainer.innerHTML = 'Solved';

                let solvedItems = Array.from(data);
                if (solvedItems.length === 0) {
                    solvedItems = ['None'];
                }

                solvedItems.sort().forEach(puzzleNum => {
                    let solvedItem = document.createElement('div');
                    solvedItem.classList.add('solved-item');
                    solvedItem.innerText = puzzleNum;
                    solvedContainer.appendChild(solvedItem);
                });
            } else if (event === 'ThemeChanged') {
                let oldTheme = this.theme;
                this.theme = 'theme-' + data;

                Array.from(document.getElementsByClassName(oldTheme)).forEach(element => {
                    element.classList.remove(oldTheme);
                    element.classList.add(this.theme);
                });
            } else if (event === 'DrawArrow') {
                this.drawArrow(...data);
            } else if (event === 'ShowCheatButton') {
                document.getElementById('btnCheat').style.display = '';
            }
        });

        this.setupInputHandlers();
        gameViewModel.start(); // Start the game
    }

    threatenedPopup(threatText) {
        return Swal.fire({
            title: 'Try again!',
            text: `You are threatened by ${threatText}.`,
            icon: 'error',
            timerProgressBar: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'my-swal'
            }
        });
    }

    tooManyMovesPopup(moveCount, maxMoves) {
        return Swal.fire({
            title: 'Try again!',
            text: `You have made ${moveCount} moves, but this puzzle can be solved in ${maxMoves}. 👀`,
            icon: 'error',
            timerProgressBar: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'my-swal'
            }
        });
    }


    puzzleSolvedPopup() {
        return Swal.fire({
            title: 'Good job!',
            text: 'You have successfully checked the black king.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'my-swal'
            }
        });
    }

    drawArrow(startRow, startCol, endRow, endCol, color='blue') {
        let boardElement = document.getElementById('board');
        let startSquare = boardElement.querySelector(`[data-row="${startRow}"][data-col="${startCol}"]`);
        let endSquare = boardElement.querySelector(`[data-row="${endRow}"][data-col="${endCol}"]`);

        this.arrows.push(new LeaderLine(LeaderLine.pointAnchor(startSquare), LeaderLine.pointAnchor(endSquare), {color: color, size: 8, path: 'straight'}));
    }

    setupInputHandlers() {
        // Button click handlers
        document.getElementById('btnPrev').addEventListener('click', () => this.gameViewModel.loadPrevPuzzle());
        document.getElementById('btnNext').addEventListener('click', () => this.gameViewModel.loadNextPuzzle());
        document.getElementById('btnLoadFen').addEventListener('click', () => this.gameViewModel.loadFen(prompt('Enter FEN string:')));
        document.getElementById('btnSound').addEventListener('click', () => this.gameViewModel.toggleSound());
        document.getElementById('btnAbout').addEventListener('click', () => this.showAbout());
        document.getElementById('btnNextTheme').addEventListener('click', () => this.gameViewModel.loadNextTheme());
        document.getElementById('btnCheat').addEventListener('click', () => this.gameViewModel.cheatButtonPressed());
        document.getElementById('btnDarkMode').addEventListener('click', (event) => this.gameViewModel.applyThemeMode(event.target.value));

        // Board click handler
        document.getElementById('board').addEventListener('click', (event) => {
            let squareElement = event.target.closest('.square');
            if (squareElement) {
                let row = parseInt(squareElement.getAttribute('data-row'));
                let col = parseInt(squareElement.getAttribute('data-col'));
                this.gameViewModel.handleSquareClick(row, col);
            }
        });

        /* Board drag and drop handlers */
        document.getElementById('board').addEventListener('dragstart', (event) => {
            // check if the target has the class 'piece'
            if (!event.target.classList.contains('piece')) {
                return;
            }

            this.draggedPiece = event.target;
        });

        document.getElementById('board').addEventListener('dragover', (event) => event.preventDefault());

        document.getElementById('board').addEventListener('drop', (event) => {
            if (this.draggedPiece) {
                let squareElement = event.target.closest('.square');
                if (squareElement) {
                    let startRow = parseInt(this.draggedPiece.closest('.square').getAttribute('data-row'));
                    let startCol = parseInt(this.draggedPiece.closest('.square').getAttribute('data-col'));
                    let endRow = parseInt(squareElement.getAttribute('data-row'));
                    let endCol = parseInt(squareElement.getAttribute('data-col'));
                    this.gameViewModel.handleSquareDragDrop(startRow, startCol, endRow, endCol);
                }
            }

            this.draggedPiece = null;
        });

        // Detect when the user types a cheat code ("godsavethequeen")
        document.addEventListener('keydown', (event) => {
            // get the pressed key code
            let key = event.key;

            // If key is alphanumeric, add it to the cheat code
            if (key.match(/^[a-z0-9]$/i)) {
                this.gameViewModel.cheatKeyTyped(key);
            }
        });
    }

    showAbout() {
        Swal.fire({
            title: 'About',
            html: aboutHtml,
            confirmButtonText: 'Got it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.gameViewModel.setAboutRead();
            }
        });
    }
    
    drawBoard(board) {
        // (Re)draw the board
        const numRows = 8;
        const numCols = 8;

        // Clear arrows
        this.arrows.forEach(arrow => arrow.remove());
        this.arrows = [];

        let boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        // Create the squares
        for (let i = 0; i < board.length; i++) {
            let piece = board[i];
            let squareElement = document.createElement('div');
            squareElement.className = 'square';

            let rowNum = Math.floor(i / numCols);
            let colNum = i % numCols;

            // Set the row and column attributes
            squareElement.setAttribute('data-row', rowNum);
            squareElement.setAttribute('data-col', colNum);

            // Set the theme
            squareElement.classList.add(this.theme);

            // Alternate the colors of the squares
            squareElement.classList.add(((rowNum + colNum) % 2 === 0) ? 'light' : 'dark');

            // If it's the first column, add the row number
            if (colNum === 0) {
                let rowLabelElement = document.createElement('div');
                rowLabelElement.className = 'number-label';
                rowLabelElement.innerText = numRows - rowNum;
                squareElement.appendChild(rowLabelElement);
            }

            // If it's the last row, add the column letter
            if (rowNum === numRows - 1) {
                let colLabelElement = document.createElement('div');
                colLabelElement.className = 'letter-label';
                colLabelElement.innerText = String.fromCharCode('a'.charCodeAt(0) + colNum);            
                squareElement.appendChild(colLabelElement);
            }            

            // Add the piece image
            if (piece !== '') {
                let pieceElement = document.createElement('img');
                pieceElement.src = pieceImages[piece];
                pieceElement.className = 'piece';
                squareElement.appendChild(pieceElement);
            }

            // Add the square to the board
            boardElement.appendChild(squareElement);
        }
    }
}

export default GameView;
