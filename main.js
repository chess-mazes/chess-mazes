import GameModel from "./gameModel.js";
import GameViewModel from "./gameViewModel.js";
import GameView from "./gameView.js";

function main() {
    /*

    This app is built using the Model-View-ViewModel (MVVM) pattern.

    The Model is the gameModel.js file. It contains the game logic - Moving pieces, etc.
    The ViewModel is the gameViewModel.js file. It contains the logic for managing the UI - Keeping track of the current puzzle, etc.
    The View is the gameView.js file. It contains the UI drawing code - Drawing the board, etc.

    The ViewModel subscribes to the Model. When the Model changes, the ViewModel is notified.
    The View subscribes to the ViewModel. When the ViewModel changes, the View is notified.

    When the user drags a piece, the View notifies the ViewModel that the piece was dragged.
    The ViewModel then updates the Model, which notifies the ViewModel that the board changed.
    The ViewModel then notifies the View with the new state of the board, which then redraws the board.

    Some actions, such as clicking the "About" button, are handled only by the View and ViewModel as they do not affect the Model (the game state).

    */

    new GameView(new GameViewModel(new GameModel()));

    /* TODO */

    // Now: Add move counter (and num of moves needed for solution)

    // Add tests for all pieces (including pawn)
    // Change puzzles to more varied and interesting ones
    // Add piece themes
    // Fix main / gh-pages sync
    // Fix ViewPort
    // Publish
}

main();
