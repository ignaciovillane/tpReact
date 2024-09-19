import React from 'react';

// Componente PaymentMethodSelector

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div>
      <label htmlFor="payment-method">Forma de Pago:</label>
      <select id="payment-method" value={paymentMethod} onChange={handlePaymentMethodChange}>
        <option value="">Seleccione una forma de pago</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="contado al retirar">Contado al retirar</option>
        <option value="contado contra entrega">Contado contra entrega</option>
      </select>
    </div>
  );
};

export default PaymentMethodSelector;
