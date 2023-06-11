import {gameViewModel} from '@/services/gameViewModel';
import {preferencesViewModel} from '@/services/preferencesViewModel';
import {About} from '@/views/About';
import {FC, useCallback, useEffect} from 'react';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {observer} from 'mobx-react';
import playlist from '../musicAssets';

import './ActionButtons.css';

export let audio = new Audio(playlist[0]);

export const ActionButtons: FC = observer(({}) => {
  const {bestSolution, nextPuzzle, previousPuzzle, cycleBoardColors, loadFen} = gameViewModel;
  const {themeMode, toggleThemeMode, soundMode, toggleSoundMode, toggleMusicMode} =
    preferencesViewModel;

  const {musicMode} = preferencesViewModel;
  let currentSong = -1;

  const playMusicClicked = () => {
    if (musicMode) {
      currentSong = -1;
      playNextSong();
    } else {
      currentSong = -1;
      audio.pause();
      audio.removeEventListener('ended', playNextSongListener);
    }
  };

  const getCurrSong = () => {
    if (currentSong < playlist.length - 1) {
      currentSong += 1;
    } else {
      currentSong = 0;
    }
    return currentSong;
  };

  const playNextSongListener = (ev: Event) => {
    playNextSong();
  };

  const playNextSong = (_currentSong = getCurrSong()) => {
    audio.src = playlist[_currentSong];
    audio.addEventListener('ended', playNextSongListener);
    audio.play();
  };

  const nextMusicButtonClick = () => {
    if (musicMode) {
      audio.pause();
      playNextSong();
    }
  };

  const loadFenButtonClick = useCallback(() => {
    const fen = prompt('Enter FEN:');
    if (fen === null) return;
    loadFen(fen);
  }, [loadFen]);

  const darkModeButtonClick = useCallback(() => {
    toggleThemeMode();
  }, [toggleThemeMode]);

  const soundModeButtonClick = useCallback(() => {
    toggleSoundMode();
  }, [toggleSoundMode]);

  const musicModeButtonClick = useCallback(() => {
    toggleMusicMode();
  }, [toggleMusicMode]);

  useEffect(() => {
    playMusicClicked();
  }, [musicMode]);

  const cheatButtonClick = useCallback(() => {}, []);

  const aboutButtonClick = useCallback(() => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'About',
      html: ReactDOMServer.renderToStaticMarkup(<About />),
      confirmButtonText: 'Got it!',
      didOpen: () => {},
    });
  }, []);

  return (
    <div className={`flex flex-row justify-center flex-wrap my-3`}>
      <button className="button" id="btnPrevious" onClick={() => previousPuzzle()}>
        Previous
      </button>
      <button className="button" id="btnNext" onClick={() => nextPuzzle()}>
        Next
      </button>
      <button className="button" id="btnLoadFen" onClick={loadFenButtonClick}>
        Load FEN
      </button>
      <button className="button" id="btnSound" onClick={soundModeButtonClick} title="Sound on/off">
        {soundMode ? '🔊' : '🔇'}
      </button>
      <button className="button" id="btnNextTheme" onClick={cycleBoardColors} title="Change theme">
        🎨
      </button>
      <button
        className="button"
        id="btnDarkMode"
        value="dark"
        onClick={darkModeButtonClick}
        title="Dark/Light mode"
      >
        {themeMode === 'dark' ? '🌞' : '🌙'}
      </button>
      <button className="button hidden" id="btnCheat" onClick={cheatButtonClick}>
        ✨
      </button>
      <button className="button">
        <button
          className="button"
          id="btnMusic"
          onClick={musicModeButtonClick}
          title="Music on/off"
        >
          🎵
        </button>
        {/* <button className="button" id="btnPauseMusic" onClick={pauseMusicButtonClick} title="Pause Music">
            ⏸️
        </button> */}
        <button
          className="button"
          id="btnNextMusic"
          onClick={nextMusicButtonClick}
          title="Next Song"
        >
          ⏭️
        </button>
      </button>
      <button className="button" id="btnAbout" onClick={aboutButtonClick} title="About">
        ?
      </button>
    </div>
  );
});
