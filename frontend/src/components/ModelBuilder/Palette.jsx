import React from 'react';
import './Palette.css';

const Palette = ({ onDragStart }) => {
  const objectTypes = [
    { type: 'Station', label: 'Stanowisko', icon: 'S' },
    { type: 'Buffer', label: 'Bufor', icon: 'B' },
    { type: 'Worker', label: 'Pracownik', icon: 'W' },
    { type: 'Connection', label: 'Polaczenie', icon: 'C' }
  ];

  return (
    <div className="palette">
      <h3>Paleta obiektow</h3>
      {objectTypes.map(obj => (
        <div
          key={obj.type}
          className="palette-item"
          draggable
          onDragStart={(e) => onDragStart(e, obj.type)}
        >
          <span className="icon">{obj.icon}</span>
          <span>{obj.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Palette;
