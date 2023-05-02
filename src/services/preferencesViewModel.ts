import {StorageEntry} from '@/services/storageEntry';
import {makeAutoObservable} from 'mobx';

export type ThemeMode = 'light' | 'dark';

export class PreferencesViewModel {
  private themeModeStorage = new StorageEntry<ThemeMode>('theme', 'light');
  public themeMode: ThemeMode;
  public toggleThemeMode = () => {
    const newTheme = this.themeMode === 'light' ? 'dark' : 'light';
    this.themeMode = newTheme;
    this.themeModeStorage.set(newTheme);
  };

  private soundModeStorage = new StorageEntry<boolean>('soundMode', true);
  public soundMode: boolean;
  public toggleSoundMode = () => {
    const newSoundMode = !this.soundMode;
    this.soundMode = newSoundMode;
    this.soundModeStorage.set(newSoundMode);
  };

  constructor() {
    makeAutoObservable(this);
    this.themeMode = this.themeModeStorage.get();
    this.soundMode = this.soundModeStorage.get();
  }
}

export const preferencesViewModel = new PreferencesViewModel();
