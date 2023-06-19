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
  private musicModeStorage = new StorageEntry<boolean>('musicMode', false);
  public soundMode: boolean;
  public musicMode: boolean;

  public toggleSoundMode = () => {
    const newSoundMode = !this.soundMode;
    this.soundMode = newSoundMode;
    this.soundModeStorage.set(newSoundMode);
  };

  public toggleMusicMode = () => {
    const newMusicMode = !this.musicMode;
    this.musicMode = newMusicMode;
    this.musicModeStorage.set(newMusicMode);
  };

  constructor() {
    makeAutoObservable(this);
    this.themeMode = this.themeModeStorage.get();
    this.soundMode = this.soundModeStorage.get();
    this.musicMode = this.musicModeStorage.get();

    if (window.matchMedia)
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.setTheme(e.matches ? 'dark' : 'light');
      });
  }
}

export const preferencesViewModel = new PreferencesViewModel();
