import React, { useState } from 'react';
import tarjetas from '../data/tarjetas'; // Importamos el mock de tarjetas
import '../styles/CardDetailsForm.css'; // Importa el archivo CSS
import OrderStatus from './OrderStatus'; 
import ConfirmationModal from './ConfirmationModal'; // Importa el modal de confirmación

const CardDetailsForm = ({ onPaymentProcess }) => {
  const [cardDetails, setCardDetails] = useState({ number: "", pin: "", name: "", documentType: "", documentNumber: "" });
  const [cardType, setCardType] = useState("");
  const [gateway, setGateway] = useState("");
  const [orderStatus, setOrderStatus] = useState("Pendiente"); // Estado inicial del pedido
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

  const generatePaymentNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // Genera un número aleatorio de 6 dígitos
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === "number" || name === "pin" || name === "documentNumber") ? value.replace(/\D/, '') : value;
    setCardDetails({
      ...cardDetails,
      [name]: newValue
    });
  };

  const handleCardTypeChange = (e) => {
    setCardType(e.target.value);
  };

  const handleDocumentTypeChange = (e) => {
    setCardDetails({
      ...cardDetails,
      documentType: e.target.value
    });
  };

  const handleGatewayChange = (e) => {
    setGateway(e.target.value);
  };

  const validateFields = () => {
    const { number, pin, name, documentType, documentNumber } = cardDetails;
    if (!cardType) return "Debe seleccionar el tipo de tarjeta.";
    if(!number && !pin && !name && !documentType && !documentNumber && !gateway) return "Debe ingresar los datos de la tarjeta.";
    if (!number || number.length < 16) return "Número de tarjeta inválido. Debe tener 16 dígitos.";
    if (!pin || pin.length < 4) return "El PIN debe tener 4 dígitos.";
    if (!name) return "Debe ingresar el nombre completo.";
    if (!documentType) return "Debe seleccionar un tipo de documento.";
    if (!documentNumber) return "Debe ingresar un número de documento.";
    if (!gateway) return "Debe seleccionar una pasarela de pago.";
    return null; // Todo está correcto
  };

  const validatePayment = () => {
    const { number, pin, name, documentType, documentNumber } = cardDetails;

    const matchingCard = tarjetas.find(tarjeta => 
      tarjeta.numero === number &&
      tarjeta.PIN === pin &&
      tarjeta.nombreCompleto === name &&
      tarjeta.tipoDocumento === documentType &&
      tarjeta.numeroDocumento === documentNumber &&
      tarjeta.tipo === cardType
    );

    return !!matchingCard; // Devuelve true si se encuentra una tarjeta que coincida
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    const validationError = validateFields();

    if (validationError) {
      onPaymentProcess(validationError, null, true); // Mostrar el mensaje de error y no procesar el pago
      return;
    }

    // Mostrar el modal de confirmación
    setShowModal(true);
  };

  const confirmPayment = () => {
    const isPaymentSuccessful = validatePayment();

    if (isPaymentSuccessful) {
      const paymentNumber = generatePaymentNumber(); // Genera el número solo si el pago es exitoso
      onPaymentProcess("Pago procesado correctamente", paymentNumber);
      setOrderStatus("Confirmado");
    } else {
      onPaymentProcess("Pago Rechazado, verifique los datos de la tarjeta e intente nuevamente", null, true);
    }

    setShowModal(false); // Ocultar el modal después de procesar
  };

  return (
    <div className="payment-form">
      <OrderStatus orderStatus={orderStatus} />
      <h3>Detalles de la Tarjeta</h3>
      <form onSubmit={handlePaymentSubmit}>
        <div>
          <label>Tipo de tarjeta:</label>
          <select value={cardType} onChange={handleCardTypeChange}>
            <option value="">Seleccione tipo de tarjeta</option>
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
          </select>
        </div>

        <input
          type="text"
          name="number"
          placeholder="Número de tarjeta (16 dígitos)"
          value={cardDetails.number}
          onChange={handleCardDetailsChange}
        />
        <input
          type="text"
          name="pin"
          placeholder="PIN (4 dígitos)"
          value={cardDetails.pin}
          onChange={handleCardDetailsChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={cardDetails.name}
          onChange={handleCardDetailsChange}
        />
        <div>
          <label>Tipo de documento:</label>
          <select value={cardDetails.documentType} onChange={handleDocumentTypeChange}>
            <option value="">Seleccione tipo de documento</option>
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>
        <input
          type="text"
          name="documentNumber"
          placeholder="Número de documento"
          value={cardDetails.documentNumber}
          onChange={handleCardDetailsChange}
        />

        <div>
          <p>Seleccione la pasarela de pago:</p>
          <select value={gateway} onChange={handleGatewayChange}>
            <option value="">Seleccione una pasarela</option>
            <option value="MercadoPago">MercadoPago</option>
            <option value="Stripe">Stripe</option>
          </select>
        </div>

        <div className="gateway-logos">
          {gateway === "MercadoPago" && (
            <img 
              src="https://www.mercadopago.com/org-img/MP3/home/logomp3.gif" 
              alt="MercadoPago" 
            />
          )}
          {gateway === "Stripe" && (
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              alt="Stripe" 
            />
          )}
        </div>

        <button type="submit">Procesar Pago</button>
      </form>

      {/* Renderizar el modal si showModal es true */}
      {showModal && (
        <ConfirmationModal 
          message="¿Está seguro de que desea procesar este pago?" 
          onConfirm={confirmPayment} 
          onCancel={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default CardDetailsForm;
