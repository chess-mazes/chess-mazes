import puzzles from "./puzzles.js";
import isValidMove from "./moveValidator.js";
import pieceImages from "./assets.js";
import loadFromFEN from "./fenLoader.js";

const board = document.getElementById("board");
const moveSound = new Audio("move.mp3");

let curPuzzle = 0;
let solvedPuzzles = new Set();
let pieces = JSON.parse(JSON.stringify(puzzles[curPuzzle]));
let draggedPiece = null;
let startCol, startRow;
let customPuzzle = false;
let originalCustomBoard = null;

function setupButtonHandlers() {
    document.getElementById("btnPrev").addEventListener("click", () => {
        curPuzzle--;
        if (curPuzzle < 0) {
            curPuzzle = puzzles.length - 1;
        }

        document.location.hash = curPuzzle + 1;
        pieces = JSON.parse(JSON.stringify(puzzles[curPuzzle]));
        customPuzzle = false;
        drawBoard();
    });

    document.getElementById("btnNext").addEventListener("click", () => {
        curPuzzle++;
        if (curPuzzle >= puzzles.length) {
            curPuzzle = 0;
        }

        document.location.hash = curPuzzle + 1;
        pieces = JSON.parse(JSON.stringify(puzzles[curPuzzle]));
        customPuzzle = false;
        drawBoard();
    });

    document.getElementById("btnLoadFen").addEventListener("click", () => {
        const fen = prompt("FEN string");
        if (fen) {
            originalCustomBoard = loadFromFEN(fen);
            if (originalCustomBoard) {
                pieces = JSON.parse(JSON.stringify(originalCustomBoard));
                customPuzzle = true;
                document.getElementById("page-title").innerText = "Chess Maze (Custom)";
                drawBoard();
            }
        }
    });
}

function drawBoard() {
    if (!customPuzzle) {
        let solvedText = solvedPuzzles.has(curPuzzle + 1) ? "✅" : "";
        document.getElementById("page-title").innerText = `Chess Maze #${curPuzzle + 1} ${solvedText}`;
    }

    board.innerHTML = "";
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.classList.add((i + j) % 2 ? "black" : "white");
            square.dataset.row = i;
            square.dataset.col = j;

            const piece = pieces[i * 8 + j];
            if (piece !== "") {
                const img = document.createElement("img");
                img.src = pieceImages[piece];
                img.style.position = 'absolute';
                square.appendChild(img);
            }

            board.appendChild(square);

            // Draw coordinates at the edge of the board, at the corner of the square
            if (j === 0) {
                const text = document.createElement("div");
                text.classList.add("letter-coords");
                text.innerHTML = 8 - i;
                square.appendChild(text);

                // align the element to the left and top of the square
            }

            if (i === 7) {
                const text = document.createElement("div");
                text.classList.add("number-coords");
                text.innerHTML = String.fromCharCode(97 + j);
                square.appendChild(text);

                // align the element to the right and bottom of the square
                text.style.marginLeft = "auto";
                text.style.marginTop = "auto";
            }

        }
    }

    const squares = document.querySelectorAll(".square");
    const pieceElements = document.querySelectorAll(".square img");

    for (let pieceElement of pieceElements) {
        // check if the piece is white
        // get the piece's location
        let [col, row] = [parseInt(pieceElement.parentElement.dataset.col), parseInt(pieceElement.parentElement.dataset.row)];
        let piece = pieces[row * 8 + col];
        if (piece === piece.toUpperCase()) {
            pieceElement.draggable = true;
        }
    }

    const [whiteCol, whiteRow] = locateWhitePiece(pieces);

    for (let square of squares) {
        square.addEventListener("dragstart", dragStart);
        square.addEventListener("dragover", dragOver);
        square.addEventListener("drop", dragDrop);

        square.addEventListener("click", () => {
            const col = parseInt(square.dataset.col);
            const row = parseInt(square.dataset.row);

            // Check if white piece can move to the square
            const [startCol, startRow] = locateWhitePiece(pieces);
            if (isValidMove(pieces, startCol, startRow, col, row)) {
                moveWhitePieceTo(col, row);
                drawBoard();
            }
        });

        // if white piece can move to the square, highlight it
        // if (isValidMove(pieces, whiteCol, whiteRow, parseInt(square.dataset.col), parseInt(square.dataset.row))) {
        //     square.classList.add("highlight");
        // } else {
        //     square.classList.remove("highlight");
        // }
    }
}

function coordsToLocation(row, col) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return letters[col] + (8 - row);
}

function dragStart(event) {
    draggedPiece = event.target;
    draggedPiece.classList.add("dragged");
    startCol = parseInt(event.target.parentElement.dataset.col);
    startRow = parseInt(event.target.parentElement.dataset.row);
}

function dragOver(event) {
    event.preventDefault();
}

function resetBoard() {
    if (customPuzzle) {
        pieces = JSON.parse(JSON.stringify(originalCustomBoard));
    } else {
        pieces = JSON.parse(JSON.stringify(puzzles[curPuzzle]));
    }
    
    drawBoard();
}

function moveWhitePieceTo(col, row) {
    const [startCol, startRow] = locateWhitePiece(pieces);
    let movedPiece = document.querySelector(`[data-row="${startRow}"][data-col="${startCol}"] img`);
    let targetSquare = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = pieces[startRow * 8 + startCol];
    pieces[startRow * 8 + startCol] = "";
    pieces[row * 8 + col] = piece;
    // remove only child img element from target square
    [...targetSquare.children].forEach(
        child => child.tagName.toLowerCase() === "img" && child.remove()
    );

    targetSquare.appendChild(movedPiece);
    moveSound.currentTime = 0;
    moveSound.play();

    if (isThreatened(col, row)) {
        Swal.fire({
            title: 'Try again!',
            text: 'You are threatened by a black piece.',
            icon: 'error',
            //timer: 2000,
            timerProgressBar: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'my-swal'
            }
        }).then(() => {
            resetBoard();
        });
    } else if (isThreatened(...locateBlackKing(pieces))) {
        Swal.fire({
            title: 'Good job!',
            text: 'You have successfully checked the black king.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'my-swal'
            }
        }).then(() => {
            if (!customPuzzle) {
                solvedPuzzles.add(curPuzzle + 1);
                localStorage.setItem("solvedPuzzles", JSON.stringify(Array.from(solvedPuzzles)));
                document.getElementById("txtSolved").innerText = `Solved: [${Array.from(solvedPuzzles).sort().join(", ")}]`;
                document.getElementById("btnNext").click();
            }
        });
    };
}

function dragDrop(event) {
    draggedPiece.classList.remove("dragged");

    let target = event.target;
    if (event.target.tagName.toLowerCase() === "img") {
        console.log("dropped on image");
        target = event.target.parentElement;
    };

    const endCol = parseInt(target.dataset.col);
    const endRow = parseInt(target.dataset.row);
    console.log(`dragEnd: {${startRow}, ${startCol}} -> {${endRow}, ${endCol}}`);

    // Check if start and end are the same
    if (startCol === endCol && startRow === endRow) {
        return;
    }

    if (isValidMove(pieces, startCol, startRow, endCol, endRow, true)) {
        moveWhitePieceTo(endCol, endRow);
        drawBoard();
    }

    draggedPiece = null;
}

function isThreatened(col, row, debug = false) {
    const isWhite = pieces[row * 8 + col].toLowerCase() !== pieces[row * 8 + col];

    // Check if any piece can move to the square
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (pieces[i * 8 + j] === "") continue;
            if (debug) console.log(`Checking if ${pieces[i * 8 + j]} at ${coordsToLocation(i, j)} can move to ${coordsToLocation(row, col)}`);
            if (isValidMove(pieces, j, i, col, row, true, isWhite)) {
                if (debug) console.log(`Threatened by ${pieces[i * 8 + j]} at ${coordsToLocation(i, j)}`);
                return true;
            }
        }
    }

    return false;
}

function locateBlackKing(board) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i * 8 + j] === "k") {
                return [j, i];
            }
        }
    }
}

function locateWhitePiece(board) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let piece = board[i * 8 + j];
            if (piece !== "" && piece.toLowerCase() !== piece) {
                return [j, i];
            }
        }
    }
}

function loadSolvedPuzzles() {
    const solved = localStorage.getItem("solvedPuzzles");
    if (solved) {
        solvedPuzzles = new Set(JSON.parse(solved));
    }

    document.getElementById("txtSolved").innerText = `Solved: [${Array.from(solvedPuzzles).sort().join(", ")}]`;
}

function loadCurrentPuzzle() {
    const hash = window.location.hash;
    if (hash) {
        const puzzle = parseInt(hash.substring(1));
        if (puzzle >= 1 && puzzle <= puzzles.length) {
            curPuzzle = puzzle - 1;
        }
    }
}

function main() {
    loadCurrentPuzzle();
    loadSolvedPuzzles();
    setupButtonHandlers();
    resetBoard();
}

// On document ready, call main
document.addEventListener("DOMContentLoaded", main);