import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import PaymentForm from './pages/PaymentForm.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';

// Al cambiar de página: restaura el scroll (por si un modal/carrito
// dejó el body con overflow:hidden) y vuelve al inicio de la página.
function ScrollReset() {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = 'unset';
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <ScrollReset />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<PaymentForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);