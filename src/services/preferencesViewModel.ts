import {StorageEntry} from '@/services/storageEntry';
import {makeAutoObservable} from 'mobx';

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
  public playlist = ['../music/Strobotone-Medieval-Theme01.mp3', '../music/Strobotone-Medieval-Theme02.mp3']
  public currentSong = 0
  public audio:HTMLAudioElement;
  public toggleSoundMode = () => {
    const newSoundMode = !this.soundMode;
    this.soundMode = newSoundMode;
    this.soundModeStorage.set(newSoundMode);

    if(this.soundMode){
        if (this.audio) {
            this.audio.pause();
        }
        console.log("start");
        this.currentSong = 0;
        this.playNext(this.playlist.length)
    }else{
        if (this.audio) {
            this.audio.pause();
        }
    }
  };
  public playNext = (length:number)=> { 
    // console.log(this._playlist.length)
    if (this.currentSong < length) { 
      this.audio = new Audio(require(this.playlist[this.currentSong])); 
      this.audio.addEventListener("ended", ()=>{
        this.playNext(length)}); 
      this.audio.play(); 
      console.log(`playing ${this.playlist[this.currentSong]}`); 
      this.currentSong += 1; 
    } else { 
        this.currentSong = 0
        this.playNext(length)
    } 
  }
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
