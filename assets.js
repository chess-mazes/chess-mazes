const pieceImages = {
    "P": "./assets/pieceImages/w_p.png",
    "R": "./assets/pieceImages/w_r.png",
    "N": "./assets/pieceImages/w_n.png",
    "B": "./assets/pieceImages/w_b.png",
    "Q": "./assets/pieceImages/w_q.png",
    "K": "./assets/pieceImages/w_k.png",
    "p": "./assets/pieceImages/b_p.png",
    "r": "./assets/pieceImages/b_r.png",
    "n": "./assets/pieceImages/b_n.png",
    "b": "./assets/pieceImages/b_b.png",
    "q": "./assets/pieceImages/b_q.png",
    "k": "./assets/pieceImages/b_k.png"
};

const moveSound = new Audio('./assets/moveSound/move.mp3');
const buzzerSound = new Audio('./assets/buzzerSound/buzzerSound.wav');

const aboutHtml = `
<b>Chess Mazes</b> is a puzzle game that helps you visualize chess moves and avoid hanging pieces.

The game is based on the book <a href="https://www.amazon.com/Chess-Mazes-Kind-Puzzle-Everyone/dp/1888690232">"Chess Mazes"</a> (2004) by chess master Bruce Alberston.
<br><br>

<b>How to Play:</b>
Either drag and drop the pieces to move them, or click a target square to move your piece to it.
The goal is to check the black king without having your pieces threatened.
<br><br>

<b>Custom Puzzles:</b>
You can load custom puzzles by entering a <a href="https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation">FEN string</a> in the "Load FEN" dialog.
If you have access to the original book, you can convert puzzles to FEN strings using tools such as <a href="https://chessvision.ai">ChessVision.ai</a>.
<br><br>

<b>License:</b>
The puzzles that appear in the game are taken from the book <a href="https://www.amazon.com/Chess-Mazes-Kind-Puzzle-Everyone/dp/1888690232">"Chess Mazes"</a> (2004) by Bruce Alberston, and licensed under the "Fair Use" clause of the US Copyright Law.
The game implementation is licensed under the <a href="https://opensource.org/license/mit/">MIT license</a>.
See <i>ReadMe.md</i> for more details.
`

export { pieceImages, moveSound, aboutHtml, buzzerSound};
