// IMPORTS
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import { Provider } from './context/emails';

// RENDER THE APP
const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route
        path="/:hash"
        element={
          <>
            <Provider>
              <App />
            </Provider>
          </>
        }
      />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
);
