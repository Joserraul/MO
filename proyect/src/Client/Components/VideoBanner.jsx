import React, { useState, useEffect, useRef, } from 'react';
import '../VideoBanner.css';

const VideoBanner = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(Math.floor(videos.length / 2)); // Iniciar en el medio
  const videoItemRefs = useRef([]);
  const videoRefs = useRef([]); // Ref para los elementos de video
  const intervalRef = useRef(null);
  const wrapperRef = useRef(null); // Ref para el wrapper para el scroll

  // Función para cargar el script de TikTok (ya no es necesaria si no se incrusta el reproductor)
  // const loadTikTokEmbedScript = useCallback(() => {
  //   if (window.tiktokEmbed) { // Evitar cargar el script múltiples veces
  //     window.tiktokEmbed.load();
  //     return;
  //   }
  //   const script = document.createElement('script');
  //   script.src = 'https://www.tiktok.com/embed.js';
  //   script.async = true;
  //   script.onload = () => {
  //     window.tiktokEmbed = window.tiktokEmbed || {};
  //     window.tiktokEmbed.load = () => {
  //       if (window.tiktok && window.tiktok.embed) {
  //         window.tiktok.embed.load();
  //       }
  //     };
  //     window.tiktokEmbed.load();
  //   };
  //   document.body.appendChild(script);
  // }, []);

  // useEffect(() => {
  //   loadTikTokEmbedScript(); // Cargar el script al montar el componente
  // }, [loadTikTokEmbedScript]);

  useEffect(() => {
    const goToNextVideo = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    // Establecer el intervalo de avance a 4 segundos (4000 ms)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(goToNextVideo, 4000); // 4 segundos de vista previa
    console.log('Current Video Index:', currentVideoIndex); // Depuración

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videos, currentVideoIndex]);

  // Efecto para controlar la reproducción de los videos
  useEffect(() => {
    videoRefs.current.forEach((videoElement, index) => {
      if (videoElement) {
        if (index === currentVideoIndex) {
          videoElement.play().catch(error => console.error("Error al intentar reproducir el video:", error));
        } else {
          videoElement.pause();
          videoElement.currentTime = 0; // Reiniciar el video al pausar
        }
      }
    });
  }, [currentVideoIndex]); // Se ejecuta cuando currentVideoIndex cambia

  // Efecto para el scroll del banner cuando cambia el video activo
  useEffect(() => {
    if (wrapperRef.current && videoItemRefs.current[currentVideoIndex]) {
      const videoElement = videoItemRefs.current[currentVideoIndex];
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const videoWidth = videoElement.offsetWidth;
      const scrollLeft = videoElement.offsetLeft - (wrapperWidth / 2) + (videoWidth / 2);

      wrapperRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentVideoIndex]); // Se ejecuta cuando currentVideoIndex cambia

  const handleVideoClick = (link) => {
    window.open(link, '_blank');
  };

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="video-banner-container">
      <div className="video-banner-wrapper" ref={wrapperRef}>
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={el => videoItemRefs.current[index] = el}
            className={`video-item ${index === currentVideoIndex ? 'active' : ''}`}
            onClick={() => handleVideoClick(video.link)}
          >
            <div className="video-placeholder">
              <video
                ref={el => videoRefs.current[index] = el} // Asignar ref al elemento de video
                src={video.videoSrc}
                // autoPlay={index === currentVideoIndex} // Controlado manualmente por useEffect
                muted
                loop
                playsInline
                // controls // Eliminado, ya que el usuario quiere vista previa y clic a TikTok
                className="video-player"
                onError={(e) => {
                  console.error(`Error al cargar el video ${video.id}:`, e.target.src, e);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="video-banner-controls">
        {videos.map((_, index) => (
          <button
            key={index}
            className={`control-dot ${index === currentVideoIndex ? 'active' : ''}`}
            onClick={() => setCurrentVideoIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoBanner;