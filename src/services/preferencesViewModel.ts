import {StorageEntry} from '@/services/storageEntry';
import {makeAutoObservable} from 'mobx';
import playlist from '@/views/App/musicAssets';
export type ThemeMode = 'light' | 'dark';

export class PreferencesViewModel {
  private themeModeStorage = new StorageEntry<ThemeMode>(
    'theme',
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  );
  public themeMode: ThemeMode;
  public toggleThemeMode = () => {
    const newTheme = this.themeMode === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  };
  private setTheme = (theme: ThemeMode) => {
    this.themeMode = theme;
    this.themeModeStorage.set(theme);
  };

  private soundModeStorage = new StorageEntry<boolean>('soundMode', true);
  public soundMode: boolean;

  public currentSong = 0;
  public audio: HTMLAudioElement | undefined;
  public toggleSoundMode = () => {
    const newSoundMode = !this.soundMode;
    this.soundMode = newSoundMode;
    this.soundModeStorage.set(newSoundMode);

    // if (this.audio) {
    //   this.audio.pause();
    // } 
    // if (this.soundMode) {
    //   this.currentSong = 0;
    //   this.playNext(playlist.length);
    // } 
  };

  // public playNext = (length: number) => {
  //   if (this.currentSong < length) {
  //     this.audio = new Audio(playlist[this.currentSong]);
  //     this.audio.addEventListener('ended', () => {
  //       this.playNext(length);
  //     });
  //     let playPromise = this.audio.play();

  //     if (playPromise !== undefined) {
  //       playPromise.then(function () {}).catch(function (error) {
  //         error = 'the song is not available'
  //         console.log(error)
  //         return
  //       });
  //     }
  //     this.currentSong += 1;
  //   } else {
  //     this.currentSong = 0;
  //     this.playNext(length);
  //   }
  // };
  constructor() {
    makeAutoObservable(this);
    this.themeMode = this.themeModeStorage.get();
    this.soundMode = this.soundModeStorage.get();

    if (window.matchMedia)
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.setTheme(e.matches ? 'dark' : 'light');
      });
  }
}

export const preferencesViewModel = new PreferencesViewModel();
