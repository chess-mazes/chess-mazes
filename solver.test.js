import puzzles from './assets/puzzles/puzzles';
import solvePuzzle from './solver';

describe('solver', () => {
    test('Should be always true', () => {
        expect(true).toBe(true);
    });

    test('Solve basic bishop puzzle', () => {
        const puzzle = [
            '', '', '', '', '', '', '', 'k',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', 'B',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
        ];

        let result = solvePuzzle(puzzle);
        expect(result).not.toBeNull();
        expect(result.length).toBe(3);
    });

    test('Solve existing puzzles', () => {
        for (let puzzle of puzzles) {
            expect(solvePuzzle(puzzle)).not.toBeNull();
        }
    });

    test('Test unsolvable puzzle', () => {
        const puzzle = [
            '', '', '', '', '', '', '', 'k',
            '', '', '', '', '', '', 'q', '',
            '', '', '', '', '', '', '', 'B',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', ''
        ];
        
        let result = solvePuzzle(puzzle);
        expect(result).toBeNull();
    });
});