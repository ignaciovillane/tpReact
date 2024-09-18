import React, { useState, useEffect } from 'react';
import tarjetas from '../data/tarjetas'; 
import '../styles/CardDetailsForm.css'; 
import OrderStatus from './OrderStatus'; 
import ConfirmationModal from './ConfirmationModal'; 
import { useLocation, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { sendEmail } from './SendEmail'; // Importamos la función


const CardDetailsForm = ({ onPaymentProcess }) => {
  const location = useLocation();
  const transportista = location.state?.transportista;
  const navigate = useNavigate(); // Hook para navegar entre rutas

  const [cardDetails, setCardDetails] = useState({ number: "", pin: "", name: "", documentType: "", documentNumber: "", expirationDate: ""});
  const [cardType, setCardType] = useState("");
  const [gateway, setGateway] = useState("");
  const [orderStatus, setOrderStatus] = useState(""); 
  const [paymentNumber, setPaymentNumber] = useState(null); // Nuevo estado para el número de pago
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState(null);

  const [showModal, setShowModal] = useState(false); 

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
    return Math.floor(100000 + Math.random() * 900000); // Genera un número aleatorio de 6 dígitos
  };

  const handleGoBack = () => {
    // Volver a la página principal para seleccionar otro método de pago
    navigate('/');
  };
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === "number" || name === "pin" || (name === "documentNumber" && cardDetails.documentType === "DNI")) ? value.replace(/\D/, '') : value;
    setCardDetails({
      ...cardDetails,
      [name]: newValue
    });
  };

  const handleResetSession = () => {
    sessionStorage.clear();
    setOrderStatus("Pendiente");
    setConfirmedPaymentMethod(null);
    setPaymentNumber(null);
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
    const { number, pin,expirationDate, name, documentType, documentNumber } = cardDetails;
    if (!cardType) return "Debe seleccionar el tipo de tarjeta.";
    if(!number && !pin && !name && !documentType && !documentNumber && !gateway) return "Debe ingresar los datos de la tarjeta.";
    if (!number || number.length < 16) return "Número de tarjeta inválido. Debe tener 16 dígitos.";
    if (!pin || pin.length < 4) return "El PIN debe tener 4 dígitos.";
    if (!expirationDate) return "Debe ingresar la fecha de vencimiento."; 
    if (!name) return "Debe ingresar el nombre completo.";
    if (!documentType) return "Debe seleccionar un tipo de documento.";
    if (!documentNumber) return "Debe ingresar un número de documento.";
    if (!gateway) return "Debe seleccionar una pasarela de pago.";

    const [month, year] = expirationDate.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return "Formato de fecha de vencimiento inválido. Use MM/AA.";
    }
    return null; // Todo está correcto
  };

  const validatePayment = () => {
    const { number, pin, name, documentType, documentNumber, expirationDate } = cardDetails;

    const matchingCard = tarjetas.find(tarjeta => 
      tarjeta.numero === number &&
      tarjeta.PIN === pin &&
      tarjeta.fechaVencimiento === expirationDate && 
      tarjeta.nombreCompleto === name &&
      tarjeta.tipoDocumento === documentType &&
      tarjeta.numeroDocumento === documentNumber &&
      tarjeta.tipo === cardType
    );

    if (matchingCard) {
      if (parseFloat(matchingCard.saldo) >= parseFloat(transportista.importe)) {
        return true; // El saldo es suficiente
      } else {
        return false; // El saldo no es suficiente
      }
    }
  
    return false; // No se encontró una tarjeta válida

  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    const validationError = validateFields();

    if (validationError) {
      onPaymentProcess(validationError, null, true); // Mostrar el mensaje de error y no procesar el pago
      return;
    }

    if (confirmedPaymentMethod) {
      onPaymentProcess("El pago ya fue procesado", null, true);
      return;
    }

    // Mostrar el modal de confirmación
    setShowModal(true);
  };

  const confirmPayment = () => {
    const isPaymentSuccessful = validatePayment();

    if (isPaymentSuccessful) {
      const generatedPaymentNumber = generatePaymentNumber(); 
      const confirmedPaymentMethod = "tarjeta"
      setConfirmedPaymentMethod(confirmedPaymentMethod)
      setPaymentNumber(generatedPaymentNumber); 

      onPaymentProcess("Pago procesado correctamente", confirmedPaymentMethod);


      sessionStorage.setItem("paymentNumber", generatedPaymentNumber); 
      setOrderStatus("Confirmado");
      sendEmail(transportista, confirmedPaymentMethod);
    } else {
      onPaymentProcess("Pago Rechazado, verifique los datos de la tarjeta e intente nuevamente o pruebe con otro medio de pago", null, true);
    }

    setShowModal(false); // Ocultar el modal después de procesar
  };

  return (
    <div className="payment-form">
      <OrderStatus orderStatus={orderStatus} paymentNumber={paymentNumber}/>
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
          name="expirationDate" 
          placeholder="Fecha de vencimiento (MM/AA)"
          value={cardDetails.expirationDate}
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
        <button onClick={handleGoBack} style={{ marginTop: '20px' }}>
        Volver a elegir medio de pago
      </button>
      </form>

      {/* Renderizar el modal si showModal es true */}
      {showModal && (
        <ConfirmationModal 
          message="¿Está seguro de que desea procesar este pago?" 
          onConfirm={confirmPayment} 
          onCancel={() => setShowModal(false)} 
        />
      )}
    <button 
      onClick={handleResetSession} 
      style={{ position: 'fixed',bottom: '30px', right: '10px', padding: '5px 10px', width: 'auto', display: 'inline-block' }}
    >
      Reiniciar Sesión
    </button>
    </div>
  );
};

export default CardDetailsForm;