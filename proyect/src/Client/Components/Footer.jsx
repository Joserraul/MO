import React, { useState, useEffect } from 'react';
import '../styles/Footer.css'; // Importa los estilos para el Footer
import { fetchBcvRate } from '../services/api.js';

// Importa las imágenes de la carpeta admin
import candelaImage from '../assets/admin/candela.jpeg';
import dianaImage from '../assets/admin/diana.jpg'; // ¡Corregida la extensión a .jpg!
import fioImage from '../assets/admin/fio.jpeg';
import jodaImage from '../assets/admin/joda.jpg';
import jrImage from '../assets/admin/jr.jpeg';

const TEAM = [
  { image: candelaImage, name: 'Candela', role: 'Equipo Makeup Oriente' },
  { image: dianaImage, name: 'Diana', role: 'Equipo Makeup Oriente' },
  { image: fioImage, name: 'Fio', role: 'Equipo Makeup Oriente' },
  { image: jodaImage, name: 'Joda', role: 'Equipo Makeup Oriente' },
  { image: jrImage, name: 'Jr', role: 'Equipo Makeup Oriente' },
];

const Footer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usdRate, setUsdRate] = useState(null);

  const goTo = (dir) => {
    setCurrentIndex((prev) => (prev + dir + TEAM.length) % TEAM.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TEAM.length);
    }, 4000); // Avanza cada 4 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  // Tasa de cambio BCV (se actualiza con la misma API del carrito)
  useEffect(() => {
    let active = true;
    fetchBcvRate()
      .then((rate) => {
        if (active) setUsdRate(rate);
      })
      .catch(() => {
        console.warn("No se pudo obtener la tasa BCV");
      });
    return () => { active = false; };
  }, []);

  const whatsappNumber = '584248555089'; // Reemplaza con tu número de WhatsApp
  const whatsappMessage = 'Hola, me gustaría obtener más información.'; // Mensaje predefinido
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const currentMember = TEAM[currentIndex];

  return (
    <>
      {/* Carrusel del equipo */}
      <section className="team-section">
        <h2 className="section-title">Nuestro equipo</h2>
        <div className="team-carousel">
          <button className="team-arrow" onClick={() => goTo(-1)} aria-label="Anterior">
            ‹
          </button>

          <div className="team-slide">
            <img src={currentMember.image} alt={currentMember.name} className="team-photo" />
            <p className="team-name">{currentMember.name}</p>
            <p className="team-role">{currentMember.role}</p>
          </div>

          <button className="team-arrow" onClick={() => goTo(1)} aria-label="Siguiente">
            ›
          </button>
        </div>

        <div className="team-dots">
          {TEAM.map((_, index) => (
            <button
              key={index}
              className={`team-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Miembro ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Info de la tienda */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Tienda</h3>
            <p>Cumana, Venezuela</p>
          </div>

          <div className="footer-section">
            <h3>Contacto</h3>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Escríbenos por WhatsApp
            </a>
          </div>

          <div className="footer-section">
            <h3>Síguenos</h3>
            <a href="https://www.instagram.com/makeup_oriente/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@makeup_oriente" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>

<div className="footer-section">
              <h3>Tasa de cambio</h3>
              <p>{usdRate ? `1 USD = Bs ${usdRate.toFixed(2)}` : "Consultando..."}</p>
            </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Makeup Oriente. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;