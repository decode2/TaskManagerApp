import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import BackgroundOverlay from './components/BackgroundOverlay';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="relative min-h-screen overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-light-animated-gradient dark:bg-dark-animated-gradient bg-[length:400%_400%] animate-gradient-x"></div>

      {/* Optional overlay (for blur/fade effect) */}
      <BackgroundOverlay />

      {/* Main App */}
      <App />
    </div>
  </React.StrictMode>
);

reportWebVitals();
