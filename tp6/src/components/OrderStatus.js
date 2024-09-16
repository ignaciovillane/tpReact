import React from 'react';
// Componente para mostrar el estado del pedido
const OrderStatus = ({ orderStatus }) => {
  return (
    <div>
      <p>
        Estado de pedido de envio:{" "}
        {orderStatus === 'Confirmado' ? (
          <span style={{ color: 'green' }}>Confirmado</span>
        ) : (
          "Pendiente"
        )}
      </p>
    </div>
  );
};
export default OrderStatus;
