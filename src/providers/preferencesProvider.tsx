import {useLocalStorage} from '@/hooks/useLocalStorage';
import {createContext, useContext} from 'react';

export type ThemeMode = 'light' | 'dark';

export type Preferences = {
  themeMode: ThemeMode;
  setThemeMode: React.Dispatch<React.SetStateAction<Preferences['themeMode']>>;
  soundMode: boolean;
  setSoundMode: React.Dispatch<React.SetStateAction<Preferences['soundMode']>>;
};

export const defaultPreferences: Preferences = {
  themeMode:
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  setThemeMode: (theme) => {},
  soundMode: true,
  setSoundMode: (sound) => {},
};

export const PreferencesContext = createContext<Preferences>(defaultPreferences);
export const PreferencesProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const [themeMode, setTheme] = useLocalStorage<Preferences['themeMode']>(
    'themeMode',
    defaultPreferences.themeMode
  );
  const [sound, setSound] = useLocalStorage<Preferences['soundMode']>(
    'soundMode',
    defaultPreferences.soundMode
  );

  if (window.matchMedia)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    });

  return (
    <PreferencesContext.Provider
      value={{
        themeMode,
        setThemeMode: setTheme,
        soundMode: sound,
        setSoundMode: setSound,
      }}
    >
      <div className={`theme-mode-${themeMode}`}>{children}</div>
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (autoUpdate = true) => useContext(PreferencesContext);
