import React from 'react';
import CardDetailsForm from './CardDetailsForm'; // Importamos el formulario de detalles de la tarjeta
import Notification, { showSuccessNotification, showErrorNotification } from './Notifications'; // Importamos las notificaciones

// Componente de detalles de la pagina de la tarjeta
const CardDetailsPage = () => {

  const handlePaymentProcess = (message, paymentMethod, isError = false) => {

    // Simplificamos el mensaje de confirmación de pago
    const messageText = isError 
      ? message 
      : `Pago procesado correctamente con ${paymentMethod}`;

    // Usamos el toast en lugar del manejo de mensajes anterior
    if (isError) {
      showErrorNotification(messageText);
    } else {

      showSuccessNotification(messageText);
      showSuccessNotification(`Notificación SMS enviada a transportista`)
      showSuccessNotification(`Email enviado a transportista.`);

      sessionStorage.setItem("orderStatus", "Confirmado");
      sessionStorage.setItem("confirmedPaymentMethod", paymentMethod);

    }
  };



  return (
    <div>
      <h2>Pago con tarjeta</h2>
      <CardDetailsForm onPaymentProcess={handlePaymentProcess} />
      <Notification />
    </div>
  );
};

export default CardDetailsPage;
