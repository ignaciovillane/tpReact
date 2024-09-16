import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransportistaSelector from './TransportistaSelector';
import PaymentMethodSelector from './PaymentMethodSelector';
import Messages from './Messages';
import OrderStatus from './OrderStatus';
import ConfirmationModal from './ConfirmationModal'; // Importamos el modal

const PaymentForm = () => {
  const [transportista, setTransportista] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [messages, setMessages] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Envío");
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [paymentAction, setPaymentAction] = useState(null); // Guarda si es tarjeta o contado

  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderStatus = sessionStorage.getItem("orderStatus");
    const storedPaymentMethod = sessionStorage.getItem("confirmedPaymentMethod");
    
    if (storedOrderStatus) {
      setOrderStatus(storedOrderStatus);
    }
    
    if (storedPaymentMethod) {
      setConfirmedPaymentMethod(storedPaymentMethod);
    }
  }, []);

  const generatePaymentNumber = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const showFloatingMessage = (newMessage, paymentNumber, isError = false) => {
    setMessages([]);

    const messageText = isError 
      ? newMessage 
      : `${newMessage}${paymentNumber ? ` - Nº de Pago: ${paymentNumber}` : ''}`;

    setMessages([{ text: messageText, isError }]);

    setTimeout(() => {
      setMessages([]);
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!transportista && !paymentMethod) {
      showFloatingMessage("Debe seleccionar un transportista y una forma de pago.", null, true);
      return;
    }
    if (!transportista) {
      showFloatingMessage("Debe seleccionar un transportista.", null, true);
      return;
    }
    if (!paymentMethod) {
      showFloatingMessage("Debe seleccionar una forma de pago.", null, true);
      return;
    }

    if (confirmedPaymentMethod) {
      showFloatingMessage(`El pago ya fue procesado`, null, true);
      return;
    }

    // Verificar si es "contado al retirar" o "contado contra entrega"
    if (paymentMethod === "contado al retirar" || paymentMethod === "contado contra entrega") {
      // Mostrar el modal de confirmación
      setShowModal(true);
      setPaymentAction(paymentMethod); // Guardamos el tipo de pago seleccionado
    } else if (paymentMethod === "tarjeta") {
      // Si es tarjeta, redirigir directamente
      navigate("/card-details");
    }
  };

  // Manejar la confirmación del modal
  const handleConfirm = () => {
    setShowModal(false); // Ocultar el modal

    if (paymentAction === "contado al retirar" || paymentAction === "contado contra entrega") {
      const paymentNumber = generatePaymentNumber();
      showFloatingMessage(`Pago procesado correctamente con ${paymentAction}`, paymentNumber);
      setOrderStatus("Confirmado");
      sessionStorage.setItem("orderStatus", "Confirmado");
      if (!confirmedPaymentMethod) {
        setConfirmedPaymentMethod(paymentAction);
        sessionStorage.setItem("confirmedPaymentMethod", paymentAction);
      }
    }
  };

  // Manejar la cancelación del modal
  const handleCancel = () => {
    setShowModal(false); // Simplemente cerramos el modal sin realizar la acción
  };

  return (
    <div className="payment-form">
      <h2>Aceptar Cotización</h2>
      <OrderStatus orderStatus={orderStatus} />
      <Messages messages={messages} />
      <form onSubmit={handleSubmit}>
        <TransportistaSelector transportista={transportista} setTransportista={setTransportista} />
        <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        <button type="submit">Confirmar Cotización</button>
      </form>

      {/* Renderizamos el modal solo si el estado showModal es true */}
      {showModal && (
        <ConfirmationModal 
          message={`¿Está seguro de que desea procesar el pago con ${paymentMethod}?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default PaymentForm;
