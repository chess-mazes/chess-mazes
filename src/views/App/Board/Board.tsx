import {pieceNames} from '@/models/pieceNames';
import {gameViewModel} from '@/services/gameViewModel';
import {preferencesViewModel} from '@/services/preferencesViewModel';
import {observer} from 'mobx-react';
import {FC, useCallback, useEffect} from 'react';
import Swal from 'sweetalert2';

export const moveSound = new Audio('./assets/moveSound/move.mp3');

export const Board: FC = observer(({}) => {
  const {
    board,
    moveCount,
    move,
    pieceClick,
    showGuides,
    threatStatus,
    longSolutionStatus,
    solvedStatus,
    onThreatMsgClosed,
    onLongSolutionMsgClosed,
    onSolvedMsgClosed,
    bestSolution,
  } = gameViewModel;
  const {soundMode} = preferencesViewModel;

  const onMove = useCallback(
    (row: number, col: number) => {
      const moved = move(row, col);
      if (moved && soundMode) moveSound.play();
    },
    [soundMode]
  );
  const onPieceClick = useCallback((row: number, col: number) => {
    pieceClick(row, col);
  }, []);

  useEffect(() => {
    if (threatStatus) {
      Swal.fire({
        title: 'Try again!',
        text: `You are threatened by ${pieceNames[threatStatus.piece]} at ${String.fromCharCode(
          65 + threatStatus.col
        )}${8 - threatStatus.row}.`,
        icon: 'error',
        confirmButtonText: 'OK',
        // when closed, reset the board:
        didClose: onThreatMsgClosed,
      });
    }
  }, [threatStatus, onThreatMsgClosed]);
  useEffect(() => {
    if (longSolutionStatus)
      Swal.fire({
        title: 'Try again!',
        text: `You have made ${moveCount} moves, but this puzzle can be solved in ${
          (bestSolution?.length ?? 0) - 1
        }. 👀`,
        icon: 'error',
        didClose: onLongSolutionMsgClosed,
      });
  }, [longSolutionStatus, moveCount, bestSolution, onLongSolutionMsgClosed]);
  useEffect(() => {
    if (solvedStatus) {
      Swal.fire({
        title: 'Good Job!',
        text: `You have successfully checked the black king.`,
        icon: 'success',
        confirmButtonText: 'OK',
        timerProgressBar: true,
        timer: 2000,
        didClose: onSolvedMsgClosed,
      });
    }
  }, [solvedStatus, onSolvedMsgClosed]);

  // In order to make the board div square at all times, while making sure it is the biggest it can be without overflow, I used two tricks:
  // 1. "aspect-square"- aspect-ratio: 1/1, which makes sure the board's width is always equal to its height.
  // 2. "max-h-full"- max-height: 100vw, which makes sure that the flex-auto will not stretch the board div beyond the width of the screen.
  // TODO: maybe it can be done better, but I couldn't make anything else work, so maybe in the future I'll revisit this.
  return (
    <div className="flex flex-col aspect-square max-w-full flex-auto max-h-full mx-auto text-black border-text">
      {Array.from({length: 8}, (_, _row) => {
        const row = 7 - _row;
        return (
          <div className="flex flex-auto flex-row" key={row}>
            {Array.from({length: 8}, (_, col) => {
              return (
                <div className="flex w-full h-full justify-center items-center" key={col}>
                  <div
                    className={`aspect-square w-full h-full relative flex justify-center items-center ${
                      (row + col) % 2 === 0 ? 'bg-chess-dark' : 'bg-chess-light'
                    }`}
                    onClick={() => {
                      onMove(_row, col);
                      onPieceClick(_row, col); // added
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      onMove(_row, col);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Square content={board[_row * 8 + col]} showGuides={showGuides} />
                    {col === 0 && <div className="absolute left-0 top-0 z-10">{row + 1}</div>}
                    {row === 0 && (
                      <div className="absolute right-0 bottom-0 z-10">
                        {String.fromCharCode(97 + col)}
                        {/* uppercase: {String.fromCharCode(65 + col)} */}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

export const Square: FC<{content: string; showGuides: boolean}> = ({content, showGuides}) => {
  if (content === '') return <></>;
  const player = content.toLowerCase() === content ? 'b' : 'w';
  const isWhite = player === 'w';
  return (
    <img
      className={`p-1 aspect-square object-contain ${
        player === 'w' ? (showGuides ? 'char-enable' : 'char-disable') : null
      } ${isWhite ? 'animate-chess-move' : ''}`}
      src={`./assets/pieceImages/${player}_${content.toLowerCase()}.png`}
      alt={content}
      width="90%"
      height="90%"
    ></img>
  );
};
