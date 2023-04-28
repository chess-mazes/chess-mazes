import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {PreferencesProvider} from './providers/preferencesProvider';
import App from './views/App/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </React.StrictMode>
);
