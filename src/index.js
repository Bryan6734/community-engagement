import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

reportWebVitals();
