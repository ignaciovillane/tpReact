import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransportistaSelector from './TransportistaSelector';
import PaymentMethodSelector from './PaymentMethodSelector';
import Messages from './Messages';
import OrderStatus from './OrderStatus';
import ConfirmationModal from './ConfirmationModal'; 

const PaymentForm = () => {
  const [transportista, setTransportista] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [messages, setMessages] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Pendiente");
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState(null);
  const [paymentNumber, setPaymentNumber] = useState(null); // Nuevo estado para el número de pago
  const [showModal, setShowModal] = useState(false); 
  const [paymentAction, setPaymentAction] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderStatus = sessionStorage.getItem("orderStatus");
    const storedPaymentMethod = sessionStorage.getItem("confirmedPaymentMethod");
    const storedPaymentNumber = sessionStorage.getItem("paymentNumber"); // Obtener el número de pago guardado

    if (storedOrderStatus) {
      setOrderStatus(storedOrderStatus);
    }
    
    if (storedPaymentMethod) {
      setConfirmedPaymentMethod(storedPaymentMethod);
    }

    if (storedPaymentNumber) {
      setPaymentNumber(storedPaymentNumber); // Establecer el número de pago si ya existe
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

    if (paymentMethod === "contado al retirar" || paymentMethod === "contado contra entrega") {
      setShowModal(true);
      setPaymentAction(paymentMethod); 
    } else if (paymentMethod === "tarjeta") {
      navigate("/card-details");
    }
  };

  const handleConfirm = () => {
    setShowModal(false);

    if (paymentAction === "contado al retirar" || paymentAction === "contado contra entrega") {
      const generatedPaymentNumber = generatePaymentNumber();
      setPaymentNumber(generatedPaymentNumber); // Guardar el número de pago
      sessionStorage.setItem("paymentNumber", generatedPaymentNumber); // Guardarlo en sessionStorage

      showFloatingMessage(`Pago procesado correctamente con ${paymentAction}`, null, false);
      setOrderStatus("Confirmado");
      sessionStorage.setItem("orderStatus", "Confirmado");

      if (!confirmedPaymentMethod) {
        setConfirmedPaymentMethod(paymentAction);
        sessionStorage.setItem("confirmedPaymentMethod", paymentAction);
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false); 
  };

  return (
    <div className="payment-form">
      <h2>Aceptar Cotización</h2>
      <OrderStatus orderStatus={orderStatus} paymentNumber={paymentNumber} />
      <Messages messages={messages} />
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
    </div>
  );
};

export default PaymentForm;
