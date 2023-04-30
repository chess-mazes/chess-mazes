import {ViewModel, useViewModel} from '@/hooks/useViewModel';
import {StorageEntry} from '@/services/storageEntry';

export type ThemeMode = 'light' | 'dark';

export class PreferencesViewModel extends ViewModel {
  private themeModeStorage = new StorageEntry<ThemeMode>('theme', 'light');
  public themeMode: ThemeMode;
  public toggleThemeMode = () => {
    const newTheme = this.themeMode === 'light' ? 'dark' : 'light';
    this.themeMode = newTheme;
    this.notifyListeners();
    this.themeModeStorage.set(newTheme);
  };

  private soundModeStorage = new StorageEntry<boolean>('soundMode', true);
  public soundMode: boolean;
  public toggleSoundMode = () => {
    const newSoundMode = !this.soundMode;
    this.soundMode = newSoundMode;
    this.notifyListeners();
    this.soundModeStorage.set(newSoundMode);
  };

  constructor() {
    super();
    this.themeMode = this.themeModeStorage.get();
    this.soundMode = this.soundModeStorage.get();
  }
}

export const preferencesViewModel = new PreferencesViewModel();

export const usePreferencesViewModel = () => useViewModel(preferencesViewModel);
