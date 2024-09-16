import React from 'react';

const OrderStatus = ({ orderStatus, paymentNumber }) => {
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
      {orderStatus === 'Confirmado' && paymentNumber && (
        <p>
          Número de Pago: <span style={{ color: 'green' }}>{paymentNumber}</span> 
        </p>
      )}
    </div>
  );
};

export default OrderStatus;
