import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import * as serviceWorker from './serviceWorker';

const isResizeObserverLoopError = (message?: string) =>
  typeof message === 'string' &&
  (message.includes('ResizeObserver loop completed') ||
    message.includes('ResizeObserver loop limit exceeded'));

const swallowResizeObserverError = (event: ErrorEvent) => {
  if (isResizeObserverLoopError(event.message)) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const overlays = document.querySelectorAll(
      'body > iframe[style*="z-index"]',
    );
    overlays.forEach((iframe) => {
      const parent = iframe.parentElement;
      if (!parent) return;
      const src = iframe.getAttribute('src') || '';
      if (src.startsWith('data:') || src === '') {
        (iframe as HTMLElement).style.display = 'none';
      }
    });
  }
};

window.addEventListener('error', swallowResizeObserverError, true);
window.addEventListener('error', swallowResizeObserverError);

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as { message?: string } | undefined;
  if (reason && isResizeObserverLoopError(reason.message)) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

if (typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined') {
  const OriginalResizeObserver = window.ResizeObserver;
  const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 16) => {
    let frame = 0;
    return function (this: unknown, ...args: Parameters<T>) {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fn.apply(this, args));
    } as T;
  };
  window.ResizeObserver = class ResizeObserverPatched extends OriginalResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super(debounce(callback));
    }
  };
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
