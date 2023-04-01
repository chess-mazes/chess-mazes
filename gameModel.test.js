import GameModel from './gameModel';

describe('GameModel', () => {
    test('Create a game', () => {
        const game = new GameModel();
        expect(game).toBeDefined();
    });

    test('Load a puzzle', () => {
        const game = new GameModel();
        let puzzle = [
            'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
            'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
            'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
        ];
            
        game.loadPuzzle(puzzle);

        expect(game.getBoard()).toEqual([
            'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
            'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
            'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
        ]);
    });

    test('Load a puzzle with invalid piece', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'X';
        expect(() => game.loadPuzzle(puzzle)).toThrow();
    });

    test('Move: Knight', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'N';
        game.loadPuzzle(puzzle);

        let result = game.movePiece(0, 0, 1, 2);
        expect(result).toBe(true);
        expect(game.getBoard()).toEqual([
            '', '', '', '', '', '', '', '',
            '', '', 'N', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', ''
        ]);
    });

    test('Move: Knight invalid move pattern', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'N';
        game.loadPuzzle(puzzle);

        let result = game.movePiece(0, 0, 1, 1);
        expect(result).toBe(false);
        expect(game.getBoard()).toEqual(puzzle);
    });

    test('Move: Knight to square occupied by a friendly piece', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'N';
        puzzle[8 + 2] = 'P';
        game.loadPuzzle(puzzle);

        let result = game.movePiece(0, 0, 1, 2);
        expect(result).toBe(false);
        expect(game.getBoard()).toEqual(puzzle);
    });

    test('Move: Knight takes black pawn', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'N';
        puzzle[GameModel.NumCols + 2] = 'p';
        game.loadPuzzle(puzzle);

        let result = game.movePiece(0, 0, 1, 2);
        expect(result).toBe(true);
        expect(game.getBoard()).toEqual([
            '', '', '', '', '', '', '', '',
            '', '', 'N', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', ''
        ]);
    });

    test('Move: Knight to all 8 possible positions', () => {
        const game = new GameModel();
        const startCol = 4;
        const startRow = 4;
        let puzzle = Array(64).fill('');
        const validPositions = [[2, 3], [2, 5], [3, 2], [3, 6], [5, 2], [5, 6], [6, 3], [6, 5]];

        puzzle[4 * GameModel.NumCols + 4] = 'N';
        game.loadPuzzle(puzzle);

        // Check all possible moves
        for (let i = 0; i < GameModel.NumRows; i++) {
            for (let j = 0; j < GameModel.NumCols; j++) {
                let result = game.validateMove(4, 4, i, j);
                if (validPositions.find(x => x[0] === i && x[1] === j)) {
                    expect(result.status).toBe(true);
                } else if (startCol === j && startRow === i) {
                    expect(result.status).toBe(false);
                    expect(result.reason).toBe('SameSquare');
                } else {
                    expect(result.status).toBe(false);
                    expect(result.reason).toBe('InvalidMovePattern');
                }
            }
        }
    });

    test('Move: Check that original array is not modified', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'R';

        let originalPuzzle = JSON.parse(JSON.stringify(puzzle));

        game.loadPuzzle(puzzle);
        game.movePiece(0, 8, 1, 0);

        expect(puzzle).toEqual(originalPuzzle);
    });

    test('Validation: ValidationResult returns status correctly', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'N';
        game.loadPuzzle(puzzle);

        let result = game.validateMove(0, 0, 1, 2);
        expect(result.status).toBe(true);     

        result = game.validateMove(0, 0, 1, 1);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('InvalidMovePattern');
    });

    test('Validation: Queen moves', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'Q';
        game.loadPuzzle(puzzle);

        expect(game.validateMove(0, 0, 0, 7).status).toBe(true);
        expect(game.validateMove(0, 0, 7, 7).status).toBe(true);
        expect(game.validateMove(0, 0, 7, 0).status).toBe(true);

        let result = game.validateMove(0, 0, 7, 1);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('InvalidMovePattern');
    });

    test('Validation: Rook moves', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'R';
        game.loadPuzzle(puzzle);

        let result = game.validateMove(0, 0, 0, 7);
        expect(result.status).toBe(true);

        result = game.validateMove(0, 0, 7, 7);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('InvalidMovePattern');
    });

    test('Validation: Blocked Rook moves', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'R';
        puzzle[1] = 'P';
        game.loadPuzzle(puzzle);
        
        let result = game.validateMove(0, 0, 0, 7);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('BlockedPath');
    });

    test('Validation: Bishop moves', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'B';
        game.loadPuzzle(puzzle);

        let result = game.validateMove(0, 0, 7, 7);
        expect(result.status).toBe(true);

        result = game.validateMove(0, 0, 7, 0);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('InvalidMovePattern');
    });

    test('Validation: Blocked Bishop moves', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'B';
        puzzle[GameModel.NumCols + 1] = 'P';
        game.loadPuzzle(puzzle);
        
        let result = game.validateMove(0, 0, 7, 7);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('BlockedPath');

        // Try backwards
        puzzle = Array(64).fill('');
        puzzle[GameModel.NumCols * 7 + 7] = 'B';
        puzzle[GameModel.NumCols * 6 + 6] = 'P';
        game.loadPuzzle(puzzle);

        result = game.validateMove(7, 7, 0, 0);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('BlockedPath');
    });
    
    test('Validation: Knight skips over pieces', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('P');
        puzzle[0] = 'N';
        puzzle[GameModel.NumCols + 2] = '';
        game.loadPuzzle(puzzle);
    
        let result = game.validateMove(0, 0, 1, 2);
        expect(result.status).toBe(true);
    });

    test('Validation: King moves', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'K';
        game.loadPuzzle(puzzle);

        let result = game.validateMove(0, 0, 0, 1);
        expect(result.status).toBe(true);

        result = game.validateMove(0, 0, 1, 1);
        expect(result.status).toBe(true);

        result = game.validateMove(0, 0, 1, 0);
        expect(result.status).toBe(true);

        result = game.validateMove(0, 0, 1, 2);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('InvalidMovePattern');
    });

    test('Validation: King cannot move into check', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[0] = 'K';
        puzzle[GameModel.NumCols + 1] = 'r';
        game.loadPuzzle(puzzle);

        let result = game.validateMove(0, 0, 0, 1);
        expect(result.status).toBe(false);
        expect(result.reason).toBe('KingThreatenedSquare');
    });

    test('Validation: Black bishop moves', () => {
        const game = new GameModel();
        let puzzle = Array(64).fill('');
        puzzle[GameModel.NumCols * 7 + 2] = 'b';
        game.loadPuzzle(puzzle);

        let result = game.validateMove(7, 2, 6, 1, true);
        expect(result.status).toBe(true);
    });
});
