import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import TransportistaSelector from './components/TransportistaSelector';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import Messages from './components/Messages';

const PaymentForm = () => {
  const [transportista, setTransportista] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate(); // Hook para redirigir

  const generatePaymentNumber = () => {
    return Math.floor(Math.random() * 1000000); // Generar un número de pago aleatorio
  };

  const showFloatingMessage = (newMessage, paymentNumber, isError = false) => {
    // Limpiamos mensajes anteriores antes de mostrar uno nuevo
    setMessages([]);

    const messageText = isError 
      ? newMessage 
      : `${newMessage}${paymentNumber ? ` - Nº de Pago: ${paymentNumber}` : ''}`;

    // Mostramos el nuevo mensaje
    setMessages([{ text: messageText, isError }]);

    // Ocultar el mensaje después de 4 segundos
    setTimeout(() => {
      setMessages([]);
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!transportista || !paymentMethod) {
      showFloatingMessage("Debe seleccionar un transportista y una forma de pago.", null, true);
      return;
    }

    if (paymentMethod === "tarjeta") {
      // Redirigimos a la página de detalles de la tarjeta
      navigate("/card-details"); // Asegúrate de tener esta ruta configurada
    } else if (paymentMethod === "contado al retirar" || paymentMethod === "contado contra entrega") {
      // Procesar el pago con "contado" y generar el número de pago
      const paymentNumber = generatePaymentNumber();
      showFloatingMessage(`Pago procesado correctamente con ${paymentMethod}`, paymentNumber);
    } else {
      // Procesar otros métodos de pago sin número
      showFloatingMessage(`Pago procesado correctamente con ${paymentMethod}`);
    }
  };

  
  return (
    <div className="payment-form">
      <h2>Aceptar Cotización</h2>
      <Messages messages={messages} />
      <form onSubmit={handleSubmit}>
        <TransportistaSelector transportista={transportista} setTransportista={setTransportista} />
        <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        <button type="submit">Confirmar Cotización</button>
      </form>
    </div>
  );
};

export default PaymentForm;
