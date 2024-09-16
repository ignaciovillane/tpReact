import React from 'react';
import transportistas from '../data/transportistas';

const TransportistaSelector = ({ transportista, setTransportista }) => {
  const handleTransportistaChange = (e) => {
    const selectedTransportista = transportistas.find(t => t.name === e.target.value);
    setTransportista(selectedTransportista);
  };

  const getStarRating = (rating) => {
    const star = '⭐';
    return star.repeat(rating);
  };

  return (
    <div>
      <label htmlFor="transportista">Transportista:</label>
      <select id="transportista" value={transportista?.name || ""} onChange={handleTransportistaChange}>
        <option value="">Seleccione un transportista</option>
        {transportistas.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name} (Calificación: {getStarRating(t.rating)})
          </option>
        ))}
      </select>
      {transportista && (
        <div className="details">
          <p><strong>Fecha de Retiro:</strong> {transportista.retiro}</p>
          <p><strong>Fecha de Entrega:</strong> {transportista.entrega}</p>
          <p><strong>Importe del Viaje:</strong> ${transportista.importe}</p>
        </div>
      )}
    </div>
  );
};

export default TransportistaSelector;
