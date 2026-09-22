import React, { useState, useEffect, useRef } from 'react';
import '../styles/VideoBanner.css';

// Obtiene la miniatura (portada) del video desde el link usando el API oEmbed de TikTok.
// Ej: https://www.tiktok.com/oembed?url=<link> → { thumbnail_url, ... }
const fetchThumbnail = async (link) => {
  const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(link)}`);
  if (!res.ok) throw new Error('No se pudo obtener la miniatura');
  const data = await res.json();
  return data.thumbnail_url;
};

const VideoBanner = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(Math.floor(videos.length / 2)); // Iniciar en el medio
  const [thumbnails, setThumbnails] = useState({}); // id → url de la miniatura
  const videoItemRefs = useRef([]);
  const intervalRef = useRef(null);
  const wrapperRef = useRef(null); // Ref para el wrapper para el scroll

  // Cargar las miniaturas de todos los videos una sola vez
  useEffect(() => {
    let active = true;
    videos.forEach((video) => {
      fetchThumbnail(video.link)
        .then((url) => {
          if (active) {
            setThumbnails((prev) => ({ ...prev, [video.id]: url }));
          }
        })
        .catch(() => {}); // Si falla, se muestra el lugar reservado
    });
    return () => { active = false; };
  }, [videos]);

  useEffect(() => {
    const goToNextVideo = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(goToNextVideo, 4000); // 4 segundos por video

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videos, currentVideoIndex]);

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
  }, [currentVideoIndex]);

  // Al hacer clic: se abre el video en TikTok (vista previa, no se reproduce aquí)
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
            role="button"
            tabIndex={0}
            aria-label={`Ver video en TikTok ${index + 1}`}
          >
            <div className="video-placeholder">
              {thumbnails[video.id] ? (
                <img
                  src={thumbnails[video.id]}
                  alt={`Video de TikTok ${index + 1}`}
                  className="video-player"
                />
              ) : (
                <span className="video-loader">Cargando…</span>
              )}
              <span className="video-play-icon" />
            </div>
          </div>
        ))}
      </div>
      <div className="video-banner-controls">
        {videos.map((video, index) => (
          <button
            key={video.id}
            className={`control-dot ${index === currentVideoIndex ? 'active' : ''}`}
            onClick={() => setCurrentVideoIndex(index)}
            aria-label={`Video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoBanner;