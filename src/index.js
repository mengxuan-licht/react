// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // 注意這是 client，不是 react-dom
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
