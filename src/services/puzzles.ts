import {Puzzle} from '@/models/gameModel';
import puzzlesJSON from './puzzles.json';

export const puzzles = puzzlesJSON as Puzzle[];

export const userPuzzle: Puzzle = {
  FEN: '8/8/8/8/8/8/8/8',
  bestSolution: null,
};
