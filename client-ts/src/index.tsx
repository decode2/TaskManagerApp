import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import BackgroundOverlay from './components/BackgroundOverlay';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="relative min-h-screen bg-animated-gradient text-white">
    
      <BackgroundOverlay />
      <App />
    </div>
  </React.StrictMode>
);

reportWebVitals();
