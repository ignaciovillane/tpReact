// emailService.js
import emailjs from 'emailjs-com';

// Función para enviar email

export const sendEmail = (transportista, paymentMethod) => {
  const templateParams = {
    transportista: transportista.name,
    paymentMethod,
    fechaRetiro: transportista.retiro,
    fechaEntrega: transportista.entrega,
    importe: transportista.importe
  };

  emailjs.send('service_ly79n74', 'template_sfzi6an', templateParams, 'Oqcf0Tp23cLo9kOM1')
    .then((response) => {
      console.log('Email enviado correctamente!', response.status, response.text);
    }, (err) => {
      console.error('Hubo un error al enviar el email:', err);
    });
};