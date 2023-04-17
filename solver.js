import GameModel from "./gameModel.js";

function filterVisitedMoves(moves, path) {
    return moves.filter(move => {
        for (let pathMove of path) {
            if (move[0] === pathMove[0] && move[1] === pathMove[1]) {
                return false;
            }
        }
        return true;
    });
}

function getPossibleMoves(game, row, col) {
    let possibleMoves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (game.validateMove(row, col, i, j).status === true) {
                let savedBoardState = game.getBoard();
                game.movePiece(row, col, i, j);
                if (!game.findSquareThreat(i, j, true)) {
                    possibleMoves.push([i, j]);
                }

                game.loadPuzzle(savedBoardState);
            }
        }
    }

    return possibleMoves;
}

function solve(game, whitePieceLocation, blackKingLocation, maxDepth=5) {
    let queue = [{
        game: game,
        whitePieceLocation: whitePieceLocation,
        path: [whitePieceLocation]
    }];

    while (queue.length > 0) {
        let current = queue.shift();
        let currentGame = current.game;
        let currentWhitePieceLocation = current.whitePieceLocation;
        let [whiteRow, whiteCol] = currentWhitePieceLocation;
        let path = current.path;

        let [blackRow, blackCol] = blackKingLocation;
        if (currentGame.validateMove(whiteRow, whiteCol, blackRow, blackCol).status === true) {
            return path;
        }

        if (path.length > maxDepth) {
            continue;
        }

        let moves = getPossibleMoves(currentGame, whiteRow, whiteCol);
        moves = filterVisitedMoves(moves, path);

        for (let move of moves) {
            let [endRow, endCol] = move;
            let newGame = new GameModel();
            newGame.loadPuzzle(currentGame.getBoard());
            newGame.movePiece(whiteRow, whiteCol, endRow, endCol);
            let newPath = Array.from(path);
            newPath.push(move);
            queue.push({game: newGame, whitePieceLocation: [endRow, endCol], path: newPath});
        }
    }

    return null;
}

function solvePuzzle(puzzle) {
    let game = new GameModel();
    game.loadPuzzle(puzzle);

    let whitePieceLocation = game.locateWhitePiece();
    if (whitePieceLocation == null) {
        throw new Error('Could not locate white piece');
    }

    let blackKingLocation = game.locateBlackKing();
    if (blackKingLocation == null) {
        throw new Error('Could not locate black king');
    }

    return solve(game, whitePieceLocation, blackKingLocation);
}

export default solvePuzzle;
