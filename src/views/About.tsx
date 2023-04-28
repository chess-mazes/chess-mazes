export function About() {
  return (
    <div>
      <b>Chess Mazes</b> is a puzzle game that helps you visualize chess moves and avoid hanging
      pieces. The game is based on the book{' '}
      <a
        className="about-link"
        href="https://www.amazon.com/Chess-Mazes-Kind-Puzzle-Everyone/dp/1888690232"
      >
        "Chess Mazes"
      </a>{' '}
      (2004) by chess master Bruce Alberston.
      <br></br>
      <br></br>
      <b>How to Play:</b> Either drag and drop the pieces to move them, or click a target square to
      move your piece to it. The goal is to check the black king without having your pieces
      threatened.
      <br></br>
      <br></br>
      <b>Custom Puzzles:</b> You can load custom puzzles by entering a{' '}
      <a
        className="about-link"
        href="https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation"
      >
        FEN string
      </a>{' '}
      in the "Load FEN" dialog. If you have access to the original book, you can convert puzzles to
      FEN strings using tools such as{' '}
      <a className="about-link" href="https://chessvision.ai">
        ChessVision.ai
      </a>
      .<br></br>
      <br></br>
      <b>License:</b> The puzzles that appear in the game are taken from the book{' '}
      <a
        className="about-link"
        href="https://www.amazon.com/Chess-Mazes-Kind-Puzzle-Everyone/dp/1888690232"
      >
        "Chess Mazes"
      </a>{' '}
      (2004) by Bruce Alberston, and licensed under the "Fair Use" clause of the US Copyright Law.
      The game implementation is licensed under the{' '}
      <a className="about-link" href="https://opensource.org/license/mit/">
        MIT license
      </a>
      . See <i>ReadMe.md</i> for more details.
    </div>
  );
}
