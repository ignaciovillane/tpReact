import React from 'react';
// Componente para mostrar el estado del pedido
const OrderStatus = ({ orderStatus }) => {
  return (
    <div>
      <p>
        Estado del pedido:{" "}
        {orderStatus === 'Confirmado' ? (
          <span style={{ color: 'green' }}>Confirmado</span>
        ) : (
          "Envío"
        )}
      </p>
    </div>
  );
};
export default OrderStatus;
