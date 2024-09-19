import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos libreria para navegar entre rutas
import TransportistaSelector from './TransportistaSelector'; // Importamos el componente TransportistaSelector
import PaymentMethodSelector from './PaymentMethodSelector'; // Importamos el componente PaymentMethodSelector
import OrderStatus from './OrderStatus'; // Importamos el componente OrderStatus
import ConfirmationModal from './ConfirmationModal'; // Importamos el componente ConfirmationModal
import { sendEmail } from './SendEmail'; // Importamos la función de email
import Notification, { showSuccessNotification, showErrorNotification } from './Notifications'; // Importamos el CustomToast y las funciones

// Componente PaymentForm

const PaymentForm = () => {

  // UseState
  const [transportista, setTransportista] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderStatus, setOrderStatus] = useState("Pendiente");
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState(null);
  const [paymentNumber, setPaymentNumber] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [paymentAction, setPaymentAction] = useState(null); 

  const navigate = useNavigate();

  // UseEffect al renderizar la pagina
  useEffect(() => {
    const storedOrderStatus = sessionStorage.getItem("orderStatus");
    const storedPaymentMethod = sessionStorage.getItem("confirmedPaymentMethod");
    const storedPaymentNumber = sessionStorage.getItem("paymentNumber"); 

    if (storedOrderStatus) {
      setOrderStatus(storedOrderStatus); // Establecer el estado del pedido
    }
    
    if (storedPaymentMethod) {
      setConfirmedPaymentMethod(storedPaymentMethod); // Establecer el método de pago confirmado
    }

    if (storedPaymentNumber) {
      setPaymentNumber(storedPaymentNumber);  // Establecer el número de pago si ya existe
    }
  }, []);

  // Funcion para procesar el pago

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!transportista && !paymentMethod) {
      showErrorNotification("Debe seleccionar un transportista y un medio de pago");
      return;
    }
    if (!transportista) {
      showErrorNotification("Debe seleccionar un transportista");
      return;
    }
    if (!paymentMethod) {
      showErrorNotification("Debe seleccionar un medio de pago");
      return;
    }

    if (confirmedPaymentMethod) {
      showErrorNotification("El pago ya fue procesado");
      return;
    }

    if (paymentMethod === "contado al retirar" || paymentMethod === "contado contra entrega") {
      setShowModal(true);
      setPaymentAction(paymentMethod); 
    } else if (paymentMethod === "tarjeta") {
      navigate("/card-details", {state: {transportista}});
    }
  };

  // Funcion para confirmar el pago

  const handleConfirm = () => {
    setShowModal(false);

    if (paymentAction === "contado al retirar" || paymentAction === "contado contra entrega") {

      showSuccessNotification(`Pago procesado correctamente con ${paymentAction}`);
      showSuccessNotification(`Notificación SMS enviada a transportista`)
      showSuccessNotification(`Email enviado a transportista.`);

      setOrderStatus("Confirmado");
      sessionStorage.setItem("orderStatus", "Confirmado");

      if (!confirmedPaymentMethod) {
        setConfirmedPaymentMethod(paymentAction);
        sessionStorage.setItem("confirmedPaymentMethod", paymentAction);
      }

      sendEmail(transportista, paymentAction);

    }
  };

  // Funcion para cancelar el pago

  const handleCancel = () => {
    setShowModal(false); 
  };

  // Funcion para resetear la sesion
  
  const handleResetSession = () => {
    sessionStorage.clear();
    setOrderStatus("Pendiente");
    setConfirmedPaymentMethod(null);
    setPaymentNumber(null);
  };

  return (
    <div className="payment-form">
      <h2>Aceptar Cotización</h2>
      <OrderStatus orderStatus={orderStatus} paymentNumber={paymentNumber} />
      <form onSubmit={handleSubmit}>
        <TransportistaSelector transportista={transportista} setTransportista={setTransportista} />
        <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        <button type="submit">Confirmar Cotización</button>
      </form>

      {showModal && (
        <ConfirmationModal 
          message={`¿Está seguro de que desea procesar el pago con ${paymentMethod}?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <button 
      onClick={handleResetSession} 
      style={{ position: 'fixed',bottom: '30px', right: '10px', padding: '5px 10px', width: 'auto', display: 'inline-block' }}
    >
      Reiniciar Sesión
    </button>
    <Notification />
    </div>

  );
};

export default PaymentForm;
