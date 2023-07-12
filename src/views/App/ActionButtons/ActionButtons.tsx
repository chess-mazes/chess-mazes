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
import {unmountComponentAtNode} from 'react-dom';

export let audio = new Audio(playlist[0]);
export let currentSong = 0;

export const ActionButtons: FC = observer(({}) => {
  const {bestSolution, nextPuzzle, previousPuzzle, cycleBoardColors, loadFen} = gameViewModel;
  const {themeMode, toggleThemeMode, soundMode, toggleSoundMode, toggleMusicMode, musicMode} =
    preferencesViewModel;

  const musicModeChange = () => {
    if (musicMode) {
      playCurrSong();
    } else {
      audio.pause();
    }
  };

  const playNextSongListener = (ev: Event) => {
    playNextSong();
  };

  useEffect(() => {
    audio.addEventListener('ended', playNextSongListener);
    return () => {
      audio.removeEventListener('ended', playNextSongListener);
    };
  }, []);

  const playCurrSong = () => {
    audio.src = playlist[currentSong];
    audio.play().catch((e) => {
      if (e.name === 'NotAllowedError' || e.name === 'SecurityError') {
        console.log('Music autoplay not allowed, turning off music.');
        audio.pause();
        if (preferencesViewModel.musicMode) {
          preferencesViewModel.toggleMusicMode();
        }
      }
    });
  };

  const playNextSong = () => {
    currentSong = (currentSong + 1) % playlist.length;
    audio.src = playlist[currentSong];
    audio.pause();
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
    musicModeChange();
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
      <button className="button" id="btnMusic" onClick={musicModeButtonClick} title="Music on/off">
        {musicMode ? '🎵⏹️' : '🎵▶️'}
      </button>
      <button className="button" id="btnNextMusic" onClick={nextMusicButtonClick} title="Next Song">
        ⏭️
      </button>
      <button className="button" id="btnAbout" onClick={aboutButtonClick} title="About">
        ?
      </button>
    </div>
  );
});
