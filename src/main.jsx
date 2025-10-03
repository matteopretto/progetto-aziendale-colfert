import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from './pages/login-page'
import MainPage from './pages/main-page'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  return (
    <StrictMode>
      <p>{setIsLoggedIn}</p>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/dashboard" element={isLoggedIn ? <MainPage /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);
