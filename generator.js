import solvePuzzle from "./solver.js";
import GameModel from "./gameModel.js";

// function generatePuzzle(depth, dof = 0) {
//     const pieces = ['q', 'r', 'b', 'n', 'p'];
//     let game = new GameModel();
//     let basePuzzle = [
//         '', '', '', '', '', '', '', 'k',
//         '', '', '', '', '', '', '', '',
//         '', '', '', '', '', '', '', 'B',
//         '', '', '', '', '', '', '', '',
//         '', '', '', '', '', '', '', '',
//         '', '', '', '', '', '', '', '',
//         '', '', '', '', '', '', '', '',
//         '', '', '', '', '', '', '', '',
//     ];

//     const limit = 10000;
//     let blackKingLocation = basePuzzle.indexOf('k');
//     let whitePieceLocation = basePuzzle.indexOf('B');
//     let counter = 0;
//     let curDepth = 2;
//     let puzzle;

//     console.log('Generating puzzle...');
//     game.loadPuzzle(basePuzzle);
//     let lastPuzzle = JSON.parse(JSON.stringify(basePuzzle));

//     while (curDepth < depth) {
//         let depthIncreased = false;
//         for (let i = 0; i < 64; i++) {
//             puzzle = JSON.parse(JSON.stringify(lastPuzzle));
//             if (i === blackKingLocation || i === whitePieceLocation) {
//                 continue;
//             }

//             for (let piece of pieces) {
//                 puzzle[i] = piece;
//                 game.loadPuzzle(puzzle);

//                 counter++;
//                 if (counter % limit === 0) {
//                     console.log('Quitting after ' + counter + ' iterations');
//                     return null;
//                 }

//                 let result = solvePuzzle(puzzle, depth);
//                 if (result === null) {
//                     console.log('Skipping unsolvable puzzle');
//                     continue;
//                 }
//                 else if (result.length - 1 > curDepth) {
//                     console.log('Depth Increased ' + (result.length - 1));
//                     depthIncreased = true;
//                     curDepth = result.length - 1;
//                     break;
//                 }
//             }
//             if (depthIncreased) { break; }
//         }

//         if (!depthIncreased) {
//             console.log('Could not increase depth');
//             return null;
//         }

//         lastPuzzle = puzzle;
//     }

//     console.log(`Generated puzzle (depth ${curDepth}) in ${counter} iterations`);
//     return lastPuzzle;
// }

function generatePuzzleRandom(depth, dof = 0) {
    const blackPieces = ['q', 'r', 'b', 'n', 'p'];
    const whitePieces = ['Q', 'R', 'B', 'N', 'P'];
    let game = new GameModel();
    const limit = 10000;
    let basePuzzle;
    let reachedMaxIterations = false;
    let lastPuzzle = null;
    let curDepth;
    let numIterations = 0;

    while (!lastPuzzle) {
        let blackKingLocation = Math.floor(Math.random() * 64);
        let whitePieceLocation;
        let puzzle;
        curDepth = 2;

        do {
            do {
                whitePieceLocation = Math.floor(Math.random() * 64);
            } while (whitePieceLocation === blackKingLocation);

            basePuzzle = Array(64).fill('');
            basePuzzle[blackKingLocation] = 'k';
            basePuzzle[whitePieceLocation] = whitePieces[Math.floor(Math.random() * whitePieces.length)];
        } while (!solvePuzzle(basePuzzle));

        console.log('Generating puzzle...');
        game.loadPuzzle(basePuzzle);
        lastPuzzle = JSON.parse(JSON.stringify(basePuzzle));

        while (curDepth < depth) {
            let depthIncreased = false;
            let checkedSquares = Array(64).fill(false);
            checkedSquares[blackKingLocation] = true;
            checkedSquares[whitePieceLocation] = true;

            while (checkedSquares.includes(false)) {
                let r = Math.floor(Math.random() * 64);
                if (checkedSquares[r]) { continue; }
                checkedSquares[r] = true;
                puzzle = JSON.parse(JSON.stringify(lastPuzzle));

                for (let piece of blackPieces) {
                    puzzle[r] = piece;
                    game.loadPuzzle(puzzle);

                    numIterations++;
                    if (numIterations % limit === 0) {
                        console.log('Quitting after ' + numIterations + ' iterations');
                        reachedMaxIterations = true;
                        break;
                    }

                    let result = solvePuzzle(puzzle, depth);
                    if (result === null) {
                        console.log('Skipping unsolvable puzzle');
                        continue;
                    }
                    else if (result.length - 1 > curDepth) {
                        console.log('Depth Increased ' + (result.length - 1));
                        depthIncreased = true;
                        curDepth = result.length - 1;
                        break;
                    }
                }
                if (depthIncreased || reachedMaxIterations) { break; }
            }

            if (!depthIncreased) {
                console.log('Could not increase depth');
                lastPuzzle = null;
                break;
            }

            if (reachedMaxIterations) {
                console.log('Reached max iterations');
                return null;
            }

            lastPuzzle = puzzle;
            if (lastPuzzle === null) { break; }
        }

        if (lastPuzzle === null) {
            console.log('Could not generate puzzle, trying again');
            continue;
        }
    }

    console.log(`Generated puzzle (depth ${curDepth}) in ${numIterations} iterations`);
    return lastPuzzle;
}

export { generatePuzzleRandom };