import {ViewModel, useViewModel} from '@/hooks/useViewModel';
import {Board, GameModel, Move, Puzzle} from '@/models/gameModel';
import {Threat} from '@/models/threat';
import {loadFromFEN} from '@/services/fenLoader';
import {puzzles} from '@/services/puzzles';
import {solvePuzzle} from '@/services/solver';
import {StorageEntry} from '@/services/storageEntry';
import {BoardColors, colorsList} from '@/views/App/boardColors/boardColors';
type MoveCheck = ['valid'] | ['invalid'] | ['threat', Threat] | ['tooLong'] | ['solved'];

export class GameViewModel extends ViewModel {
  // ! Note: for destructuring to work, all methods must be arrow functions
  // (with class methods, `this` is not bound to the class instance)
  private readonly gameModel: GameModel;
  public board: Board = [];
  public bestSolution: Puzzle['bestSolution'];

  private schemeStorage = new StorageEntry<typeof this.boardColors>('boardColorScheme', 'default');
  public boardColors: BoardColors;

  private solvedStorage = new StorageEntry<typeof this.solvedPuzzles>('solvedPuzzles', []);
  public solvedPuzzles = new Array<number>();

  public puzzleId = 0;

  public moveCount = 0;

  public threatStatus: Threat | null | undefined = undefined;
  public longSolutionStatus: boolean = false;
  public solvedStatus: boolean = false;

  public setBoardColors = (colors: React.SetStateAction<typeof this.boardColors>) => {
    const newBoardColors = colors instanceof Function ? colors(this.boardColors) : colors;
    this.boardColors = newBoardColors;
    this.notifyListeners();
    this.schemeStorage.set(newBoardColors);
  };
  public cycleBoardColors = () => {
    const nextSchemeIndex = (colorsList.indexOf(this.boardColors) + 1) % colorsList.length;
    this.setBoardColors(colorsList[nextSchemeIndex]);
  };

  public isSolved = (puzzleNum: number = this.puzzleId) => {
    return this.solvedPuzzles[puzzleNum] === puzzleNum;
  };
  private setSolved = (puzzleNum: number, notify = false) => {
    this.solvedPuzzles[puzzleNum] = puzzleNum;
    if (notify) this.notifyListeners();
    this.solvedStorage.set(this.solvedPuzzles);
  };

  private switchBoardTo = (num: React.SetStateAction<number>, notify = true) => {
    this.puzzleId = num instanceof Function ? num(this.puzzleId) : num;
    this.switchBoard(notify);
  };

  private switchBoard = (notify = false) => {
    const newPuzzle = puzzles[this.puzzleId];
    this.board = structuredClone(newPuzzle.board);
    this.gameModel.board = this.board;
    this.bestSolution = newPuzzle.bestSolution;
    this.moveCount = 0;
    if (notify) this.notifyListeners();

    document.location.hash = (this.puzzleId + 1).toString();
    // Generating best solutions dynamically, on client:
    // TODO: if we have a static puzzle list, we can pre-generate best solutions
    // TODO: is it OK to notifyListeners(rerender) before updating bestSolution?
    if (newPuzzle.bestSolution === undefined) {
      newPuzzle.bestSolution = solvePuzzle(newPuzzle.board);
      this.bestSolution = newPuzzle.bestSolution;
    }
  };

  public loadFen = (fen: string) => {
    // TODO: this can be implemented more elegantly
    const board = loadFromFEN(fen);
    puzzles.push({
      board,
      bestSolution: solvePuzzle(board),
    });
    this.switchBoardTo(puzzles.length - 1);
  };

  public nextPuzzle = (notify = true) => {
    this.switchBoardTo((num) => (num + 1) % puzzles.length, notify);
  };
  public previousPuzzle = (notify = true) => {
    this.switchBoardTo((num) => (num - 1 + puzzles.length) % puzzles.length, notify);
  };

  public resetBoard = (notify = true) => {
    this.switchBoard(notify);
  };

  private setStatus = (moveCheck: MoveCheck = ['invalid'], notify = false) => {
    const [status, threat] = moveCheck;
    this.threatStatus = threat;
    this.longSolutionStatus = status === 'tooLong';
    this.solvedStatus = status === 'solved';
    if (notify) this.notifyListeners();
  };

  public move = (...move: Move): boolean => {
    const moveFrom = this.gameModel.locateWhitePiece();
    if (!moveFrom) {
      console.error('Could not locate white piece');
      return false;
    }
    const checkResult = this.checkMove(...moveFrom, ...move);
    this.setStatus(checkResult, false);
    const [status, threat] = checkResult;
    if (status !== 'invalid') this.moveCount++;
    this.notifyListeners();
    return status !== 'invalid';
  };

  private checkMove = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): MoveCheck => {
    const moved = this.gameModel.movePiece(fromRow, fromCol, toRow, toCol);
    if (!moved) return ['invalid'];
    const threat = this.gameModel.findSquareThreat(toRow, toCol, true);
    if (threat) {
      return ['threat', threat];
    }
    const kingLocation = this.gameModel.locateBlackKing();
    if (!kingLocation) {
      console.error('Could not locate black king');
      return ['invalid'];
    }
    const validation = this.gameModel.validateMove(toRow, toCol, ...kingLocation);
    if (validation.status) {
      // +2 because the solution length includes the initial position, and another one for the last (current) move
      if (this.moveCount + 2 > (this.bestSolution?.length ?? 1)) {
        return ['tooLong'];
      }
      return ['solved'];
    }
    return ['valid'];
  };

  public onThreatMsgClosed = () => {
    this.setStatus(undefined, false);
    this.resetBoard(true);
  };
  public onLongSolutionMsgClosed = () => {
    this.setStatus(undefined, false);
    this.resetBoard(true);
  };
  public onSolvedMsgClosed = () => {
    this.setStatus(undefined, false);
    this.setSolved(this.puzzleId, false);
    this.nextPuzzle(true);
  };

  constructor() {
    super();
    this.boardColors = this.schemeStorage.get();
    this.solvedPuzzles = this.solvedStorage.get();

    const hashPuzzleNum = parseInt(document.location.hash.slice(1)) - 1;
    if (hashPuzzleNum !== this.puzzleId && hashPuzzleNum in puzzles) this.puzzleId = hashPuzzleNum;

    this.gameModel = new GameModel();
    this.switchBoard(false);
  }
}

export const gameViewModel = new GameViewModel();

export const useGameViewModel = () => useViewModel(gameViewModel);
