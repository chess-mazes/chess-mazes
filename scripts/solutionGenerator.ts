import {readFileSync, writeFileSync} from 'fs';
import {Puzzle} from '../src/models/gameModel';
import {loadFromFEN} from '../src/services/fenLoader';
import {solvePuzzle} from '../src/services/solver';

export const puzzlePath = './src/services/puzzles.json';

export const generateSolution = (all = false) => {
  const puzzles = JSON.parse(readFileSync(puzzlePath, 'utf8'));
  for (const pid in puzzles) {
    const puzzle = puzzles[pid] as Puzzle;
    if (all || !puzzle.bestSolution) {
      const solution = solvePuzzle(loadFromFEN(puzzle.FEN));
      if (!solution) {
        console.log(`No solution found for puzzle ${pid}:`);
        console.log(puzzle.FEN);
      }
      puzzle.bestSolution = solution;
    }
  }
  return puzzles;
};

export const main = () => {
  const args = process.argv.slice(2);
  const help = args.includes('--help');
  if (help) {
    console.log('Usage: npm run generate-solutions [--all]');
    return;
  }
  const all = args.includes('--all');
  console.log('Generating solutions...');
  const puzzles = generateSolution(all);
  console.log('Saving puzzles...');
  // console.log(puzzles);
  writeFileSync(puzzlePath, JSON.stringify(puzzles));
};

main();
