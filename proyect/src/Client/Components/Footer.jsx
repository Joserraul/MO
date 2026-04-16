import React, { useState, useEffect } from 'react';
import '../Style/Footer.css'; // Importa los estilos para el Footer

// Importa las imágenes de la carpeta admi
import candelaImage from '../assets/admi/candela.jpeg';
import dianaImage from '../assets/admi/diana.jpg'; // ¡Corregida la extensión a .jpg!
import fioImage from '../assets/admi/fio.jpeg';
import jrImage from '../assets/admi/jr.jpeg';
const Footer = () => {
  const adminImages = [candelaImage, dianaImage, fioImage, jrImage,];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % adminImages.length
      );
    }, 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [adminImages.length]);

  const whatsappNumber = '584248555089'; // Reemplaza con tu número de WhatsApp
  const whatsappMessage = 'Hola, me gustaría obtener más información.'; // Mensaje predefinido
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Ubicación</h3>
          <p>Cumana, Venezuela</p>
        </div>

        <div className="footer-section">
          <h3>Tasa de Cambio</h3>
          <p>€bdv 123</p> {/* Esto podría ser dinámico en el futuro */}
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
            Contactar por WhatsApp
          </a>
        </div>

        <div className="footer-section social-links">
          <h3>Síguenos</h3>
          <a href="https://www.instagram.com/makeup_oriente/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@makeup_oriente" target="_blank" rel="noopener noreferrer">TikTok</a>
        </div>

        <div className="footer-section admin-images">
          {/* Aquí se mostrará la imagen rotativa */}
          <img
            src={adminImages[currentImageIndex]}
            alt="Equipo de administración"
            className="admin-rotating-image"
          />
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Makeup Oriente. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;