import { pieceImages, moveSound, aboutHtml } from './assets.js';
import { pieceNames, rowColToAlgebraic } from './pieceLookup.js';

class GameView {
    constructor(gameViewModel) {
        this.gameViewModel = gameViewModel;
        this.draggedPiece = null;
        gameViewModel.subscribe((event, data) => {
            console.log(`Event: ${event}`);
            
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
            } else if (event === 'Check') {
                this.checkPopup().then(() => this.gameViewModel.loadNextPuzzle());
            } else if (event === 'WhiteThreatened') {
                let threatText = `${pieceNames[data.piece]} at ${rowColToAlgebraic(data.row, data.col)}`;
                this.threatenedPopup(threatText).then(() => this.gameViewModel.loadCurrentPuzzle());
            } else if (event === 'SolvedPuzzlesChanged') {
                document.getElementById('txtSolved').innerText = `Solved: [${Array.from(data).sort().join(', ')}]`;
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

    checkPopup() {
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

    setupInputHandlers() {
        // Button click handlers
        document.getElementById('btnPrev').addEventListener('click', () => this.gameViewModel.loadPrevPuzzle());
        document.getElementById('btnNext').addEventListener('click', () => this.gameViewModel.loadNextPuzzle());
        document.getElementById('btnLoadFen').addEventListener('click', () => this.gameViewModel.loadFen(prompt('Enter FEN string:')));
        document.getElementById('btnSound').addEventListener('click', () => this.gameViewModel.toggleSound());
        document.getElementById('btnAbout').addEventListener('click', () => this.showAbout());

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
                pieceElement.classList.add(piece);
                squareElement.appendChild(pieceElement);
            }

            // Add the square to the board
            boardElement.appendChild(squareElement);
        }
    }
}

export default GameView;
