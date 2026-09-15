// Ensure window.fetch is writable and configurable in all browser/sandbox environments
try {
  const win = typeof window !== 'undefined' ? window : globalThis;
  const rawFetch = win.fetch;
  if (typeof rawFetch === 'function') {
    let currentFetch = typeof rawFetch.bind === 'function' ? rawFetch.bind(win) : rawFetch;
    try {
      Object.defineProperty(win, 'fetch', {
        get: () => currentFetch,
        set: (fn) => {
          currentFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    } catch {
      try {
        Object.defineProperty(win, 'fetch', {
          value: currentFetch,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      } catch {
        // Safe fallback
      }
    }
  }
} catch {
  // Safe fallback
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
