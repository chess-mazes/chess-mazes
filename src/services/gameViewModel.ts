import {Board, GameModel, Move, Puzzle} from '@/models/gameModel';
import {Threat} from '@/models/threat';
import {loadFromFEN} from '@/services/fenLoader';
import {puzzles, userPuzzle} from '@/services/puzzles';
import {solvePuzzle} from '@/services/solver';
import {StorageEntry} from '@/services/storageEntry';
import {BoardColors, colorsList} from '@/views/App/boardColors/boardColors';
import {makeAutoObservable} from 'mobx';

type MoveCheck = ['valid'] | ['invalid'] | ['threat', Threat] | ['tooLong'] | ['solved'];

export class GameViewModel {
  // ! Note: for destructuring to work, all methods must be arrow functions
  // (with class methods, `this` is not bound to the class instance)
  private readonly gameModel: GameModel;
  public board: Board = [];
  public bestSolution: Puzzle['bestSolution'] = null;

  private schemeStorage = new StorageEntry<typeof this.boardColors>('boardColorScheme', 'default');
  public boardColors: BoardColors;

  private solvedStorage = new StorageEntry<typeof this.solvedPuzzles>('solvedPuzzles', []);
  public solvedPuzzles = new Array<number>();

  public puzzleId = 0;
  public isUserPuzzle = false;

  public moveCount = 0;

  public threatStatus: Threat | null | undefined = undefined;
  public longSolutionStatus: boolean = false;
  public solvedStatus: boolean = false;

  public setBoardColors = (colors: React.SetStateAction<typeof this.boardColors>) => {
    const newBoardColors = colors instanceof Function ? colors(this.boardColors) : colors;
    this.boardColors = newBoardColors;
    this.schemeStorage.set(newBoardColors);
  };
  public cycleBoardColors = () => {
    const nextSchemeIndex = (colorsList.indexOf(this.boardColors) + 1) % colorsList.length;
    this.setBoardColors(colorsList[nextSchemeIndex]);
  };

  public isSolved = (puzzleNum: number = this.puzzleId) => {
    return this.solvedPuzzles[puzzleNum] === puzzleNum;
  };
  private setSolved = (puzzleNum: number) => {
    this.solvedPuzzles[puzzleNum] = puzzleNum;
    this.solvedStorage.set(this.solvedPuzzles);
  };

  private switchBoardTo = (num: React.SetStateAction<number>) => {
    this.puzzleId = num instanceof Function ? num(this.puzzleId) : num;
    this.switchBoard();
  };

  private switchBoard = () => {
    this.moveCount = 0;
    const newPuzzle = this.isUserPuzzle ? userPuzzle : puzzles[this.puzzleId];
    const newBoard = loadFromFEN(newPuzzle.FEN);
    this.board = newBoard;
    this.gameModel.board = this.board;
    this.bestSolution = newPuzzle.bestSolution;

    document.location.hash = (this.puzzleId + 1).toString();
  };

  public loadFen = (fen: string) => {
    this.isUserPuzzle = true;
    const board = loadFromFEN(fen);
    userPuzzle.FEN = fen;
    userPuzzle.bestSolution = solvePuzzle(board);
    this.switchBoard();
  };

  public nextPuzzle = () => {
    this.isUserPuzzle = false;
    this.switchBoardTo((num) => (num + 1) % puzzles.length);
  };
  public previousPuzzle = () => {
    this.isUserPuzzle = false;
    this.switchBoardTo((num) => (num - 1 + puzzles.length) % puzzles.length);
  };

  public resetBoard = () => {
    this.switchBoard();
  };

  private setStatus = (moveCheck: MoveCheck = ['invalid']) => {
    const [status, threat] = moveCheck;
    this.threatStatus = threat;
    this.longSolutionStatus = status === 'tooLong';
    this.solvedStatus = status === 'solved';
  };

  public move = (...move: Move): boolean => {
    const moveFrom = this.gameModel.locateWhitePiece();
    if (!moveFrom) {
      console.error('Could not locate white piece');
      return false;
    }
    const checkResult = this.checkMove(...moveFrom, ...move);
    this.setStatus(checkResult);
    const [status, threat] = checkResult;
    if (status !== 'invalid') this.moveCount++;
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
    this.setStatus(undefined);
    this.resetBoard();
  };
  public onLongSolutionMsgClosed = () => {
    this.setStatus(undefined);
    this.resetBoard();
  };
  public onSolvedMsgClosed = () => {
    this.setStatus(undefined);
    this.setSolved(this.puzzleId);
    this.nextPuzzle();
  };

  constructor() {
    makeAutoObservable(this);
    this.boardColors = this.schemeStorage.get();
    this.solvedPuzzles = this.solvedStorage.get();

    const hashPuzzleNum = parseInt(document.location.hash.slice(1)) - 1;
    if (hashPuzzleNum !== this.puzzleId && hashPuzzleNum in puzzles) this.puzzleId = hashPuzzleNum;

    this.gameModel = new GameModel();
    this.switchBoard();
  }
}

export const gameViewModel = new GameViewModel();
