import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from './pages/login-page'
import MainPage from './pages/main-page'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './libs/libraries'

function App() {
  localStorage.setItem('isLoggedIn', false);



  return (
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/dashboard"  element={localStorage.getItem('isLoggedIn') ? <MainPage /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);
