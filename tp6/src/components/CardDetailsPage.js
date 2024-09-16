import React, { useState } from 'react';
import CardDetailsForm from './CardDetailsForm';
import Messages from './Messages';

const CardDetailsPage = () => {
  const [messages, setMessages] = useState([]);

  const showFloatingMessage = (newMessage, paymentNumber, isError = false) => {
    // Limpiamos el mensaje antes de mostrar uno nuevo
    setMessages([]);
    
    // Condicionamos el número de pago solo si el pago fue exitoso
    const messageText = isError 
      ? newMessage 
      : `${newMessage}${paymentNumber ? ` - Nº de Pago: ${paymentNumber}` : ''}`;

    // Mostramos el nuevo mensaje
    setMessages([{ text: messageText, isError }]);
    
    // Ocultamos el mensaje después de 4 segundos
    setTimeout(() => {
      setMessages([]);
    }, 4000);
  };

  const handlePaymentProcess = (message, paymentNumber, isError = false) => {
    showFloatingMessage(message, paymentNumber, isError);

    if (!isError) {
      // Actualizamos el estado del pedido a "Confirmado" en sessionStorage
      sessionStorage.setItem("orderStatus", "Confirmado");
      sessionStorage.setItem("confirmedPaymentMethod", "tarjeta");
    }
  };

  return (
    <div>
      <h2>Pago con tarjeta</h2>
      <CardDetailsForm onPaymentProcess={handlePaymentProcess} />
      <Messages messages={messages} />
    </div>
  );
};

export default CardDetailsPage;