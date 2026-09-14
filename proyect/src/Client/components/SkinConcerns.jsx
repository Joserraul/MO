import { useState } from 'react';
import '../styles/SkinConcerns.css';

const SKIN_INFO = [
  {
    key: 'morenas',
    name: 'Morenas',
    title: 'Pieles morenas',
    intro:
      'Las pieles morenas tienen un tono rico y cálido que brilla con fórmulas doradas y terracota.',
    tips: [
      'Bases de cobertura media: difuminan sin dejar capas visibles.',
      'Iluminadores dorados o bronce para un brillo natural.',
      'Labios en tonos terracota, rojo intenso o coral.',
      'Usa corrector en tono durazno para atenuar las ojeras.',
    ],
  },
  {
    key: 'claras',
    name: 'Claras',
    title: 'Pieles claras',
    intro:
      'Las pieles claras suelen tener subtonos rosados o neutros y necesitan protección solar diaria.',
    tips: [
      'Bases con subtono rosa o neutro para un acabado natural.',
      'Rubores en tonos rosados y melocotón sientan muy bien.',
      'Protector solar todos los días, incluso en días nublados.',
      'Evita bases muy oscuras: pueden dejarte un tono apagado.',
    ],
  },
  {
    key: 'triguenas',
    name: 'Trigüeñas',
    title: 'Pieles trigüeñas',
    intro:
      'Las pieles trigüeñas equilibran claridad y calidez: lo ideal es probar bases que conecten con el cuello.',
    tips: [
      'Bases de subtono neutro o cálido para evitar tonos grises.',
      'Bronceadores suaves para marcar el rostro.',
      'Labiales en tonos rosas, nude y terracota.',
      'Iluminador en tono champán para un look luminoso.',
    ],
  },
  {
    key: 'texturizadas',
    name: 'Texturizadas',
    title: 'Pieles texturizadas',
    intro:
      'La textura se nota más con productos pesados: elegir texturas ligeras cambia por completo el acabado.',
    tips: [
      'Usa una base fijadora (primer) de control de poros antes del maquillaje.',
      'Prefiere bases de textura ligera o serum-tint.',
      'Difumina con esponja o brocha de pelo sintético.',
      'Cierra el look con polvo mate o spray fijador.',
    ],
  },
  {
    key: 'acne',
    name: 'Acné',
    title: 'Pieles con acné',
    intro:
      'Con brotes activos, la regla es menos es más: productos no comedogénicos y cero manipulación de los granitos.',
    tips: [
      'Bases no comedogénicas y de cobertura modulable.',
      'Evita capas gruesas sobre los brotes inflamados.',
      'Lava brochas y esponjas con frecuencia.',
      'Nunca manipules los granitos: evita manchas y cicatrices.',
    ],
  },
  {
    key: 'delicadas',
    name: 'Delicadas',
    title: 'Pieles delicadas',
    intro:
      'Las pieles delicadas reaccionan a todo: perfumes, alcohol y fórmulas demasiado cargadas.',
    tips: [
      'Fórmulas sin fragancia y minimalistas.',
      'Limpia con agua micelar o limpiadores suaves.',
      'Aplica mascarillas calmantes antes y después del maquillaje.',
      'Evita exfoliantes granulares o ásperos.',
    ],
  },
];

function SkinConcerns() {
  const [selected, setSelected] = useState(null);

  const open = (skin) => {
    setSelected(skin);
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    setSelected(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="skin-section">
      <h2 className="section-title">Sobre tu piel</h2>
      <p className="section-sub">
        Elige tu tipo de piel y descubre cómo cuidarla y maquillarla mejor.
      </p>

      <div className="skin-list">
        {SKIN_INFO.map((skin) => (
          <button
            key={skin.key}
            type="button"
            className="skin-link"
            onClick={() => open(skin)}
          >
            <span className="skin-name">{skin.name}</span>
            <span className="skin-more">Ver consejos</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay skin-modal-overlay open" onClick={close}>
          <div className="modal-content skin-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={close} aria-label="Cerrar">
              ×
            </button>
            <h3 className="skin-modal-title">{selected.title}</h3>
            <p className="skin-modal-intro">{selected.intro}</p>
            <h4 className="skin-modal-subtitle">Consejos para tu piel</h4>
            <ul className="skin-modal-tips">
              {selected.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default SkinConcerns;