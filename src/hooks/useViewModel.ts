import {useEffect} from 'react';
import {useForceUpdate} from './useForceUpdate';

export abstract class ViewModel {
  private listeners = new Array<() => void>();
  protected notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
  public addListener(listener: () => void) {
    this.listeners.push(listener);
  }
  public removeListener(listener: () => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}

export const useViewModel = <T extends ViewModel>(viewModel: T): T => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    viewModel.addListener(forceUpdate);
    return () => {
      viewModel.removeListener(forceUpdate);
    };
  }, [viewModel]);
  return viewModel;
};
