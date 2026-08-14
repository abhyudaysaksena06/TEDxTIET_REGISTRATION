import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import { BrowserRouter } from "react-router-dom";
import preloadMedia from './preloadMedia';

// Kick off image fetching before the first render, so media downloads while the
// preloader is on screen rather than starting when each route mounts.
preloadMedia();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<BrowserRouter> 
    <App />
</BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
