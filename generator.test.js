import {generatePuzzle, generatePuzzleRandom} from "./generator.js";

describe('generator', () => {
    test('Generate puzzle difficulty 1', () => {
        console.log(generatePuzzle(1));
    });

    test('Generate Puzzle difficulty 2', () => {
        console.log(generatePuzzle(2));
    });

    test('Generate Puzzle difficulty 3', () => {
        console.log(generatePuzzle(3));
    });

    test('generatePuzzleRandom', () => {
        console.log(generatePuzzleRandom(1));
    });
});