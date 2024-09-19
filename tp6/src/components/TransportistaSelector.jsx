import React from 'react';
import transportistas from '../data/transportistas';

// Componente TransportistaSelector

const TransportistaSelector = ({ transportista, setTransportista }) => {

  const handleSelectTransportista = (selectedTransportista) => {
    setTransportista(selectedTransportista);
    console.log(selectedTransportista)
  };

  const getStarRating = (rating) => {
    const star = '⭐';
    return star.repeat(rating);
  };

  return (
    <div>
      <p>Cotizaciones disponibles:</p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Calificación</th>
            <th>Fecha de Retiro</th>
            <th>Fecha de Entrega</th>
            <th>Importe del Viaje</th>
            <th>Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          {transportistas.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{getStarRating(t.rating)}</td>
              <td>{t.retiro}</td>
              <td>{t.entrega}</td>
              <td>${t.importe}</td>
              <td>
                <button
                  onClick={() => handleSelectTransportista(t)}
                  disabled={transportista?.id === t.id}
                  className={transportista?.id === t.id ? "table-button selected" : "table button"}
                >
                  {transportista?.id === t.id ? "Seleccionado" : "Seleccionar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransportistaSelector;