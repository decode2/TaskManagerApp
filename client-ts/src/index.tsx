import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen transition-colors duration-300 bg-inherit">
      <App />
    </div>
  </React.StrictMode>
);

reportWebVitals();
