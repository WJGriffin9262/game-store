import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { GameProvider } from './context/GameContext';
import { CartProvider } from './context/CartContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <GameProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </GameProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
