// import { solvePuzzle } from "../tools/solver";
import {Puzzle} from '../types';
import {loadFromFEN} from './fenLoader';

// TODO: All this puzzle loading & solving code can be much more elegant and efficient

export const puzzles: Puzzle[] = [
  // board setup with just 1 black king and 1 white bishop
  {board: loadFromFEN('7k/8/7B/8/8/8/8/8'), solutionMoves: 2},
  {board: loadFromFEN('7k/8/7B/8/8/5n2/8/8'), solutionMoves: 2},
  {board: loadFromFEN('7k/8/5p1B/8/2r5/8/5r2/8'), solutionMoves: 5},
  {board: loadFromFEN('2b5/8/1n5n/8/2k2r2/8/8/7B'), solutionMoves: 4},
  {board: loadFromFEN('8/8/5n2/1k6/8/4r3/8/1B6'), solutionMoves: 5},
  {board: loadFromFEN('2B5/8/2pn4/8/5n2/8/8/1k6'), solutionMoves: 5},
];

// puzzles.forEach((puzzle) => {
//   puzzle.solutionMoves = solvePuzzle(puzzle.board)?.length ?? -1;
// });
