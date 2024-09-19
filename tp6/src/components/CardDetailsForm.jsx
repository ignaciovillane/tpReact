import React, { useState, useEffect } from 'react'; // Importamos librerias
import tarjetas from '../data/tarjetas'; // Importamos archivo JSON de tarjetas
import '../styles/CardDetailsForm.css'; // Importamos archivo CSS
import OrderStatus from './OrderStatus'; // Importamos el componente OrderStatus
import ConfirmationModal from './ConfirmationModal'; // Importamos el componente ConfirmationModal
import { useLocation, useNavigate } from 'react-router-dom'; // Importamos libreria para navegar entre rutas
import { sendEmail } from './SendEmail'; // Importamos la funcion EmailJS


/* Componente CardDetailsForm */
const CardDetailsForm = ({ onPaymentProcess }) => {

  // Inicializamos variables

  const location = useLocation();
  const transportista = location.state?.transportista;
  const navigate = useNavigate(); 

  // UseState

  const [cardDetails, setCardDetails] = useState({ number: "", pin: "", name: "", documentType: "", documentNumber: "", expirationDate: ""});
  const [cardType, setCardType] = useState("");
  const [gateway, setGateway] = useState("");
  const [orderStatus, setOrderStatus] = useState(""); 
  const [paymentNumber, setPaymentNumber] = useState(null); 
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  // UseEffect para renderizar la pagina 

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
      setPaymentNumber(storedPaymentNumber); // Establecer el número de pago si ya existe
    }
  }, []);


  // Genera un número aleatorio de 6 dígitos

  const generatePaymentNumber = () => {

    return Math.floor(100000 + Math.random() * 900000);

  };

  // Funcion para obtener el tipo de tarjeta

  const getCardType = (number) => {

    const visaPattern = /^4\d{15}$/; // VISA
    const mastercardPattern = /^5[1-5]\d{14}$/; // MASTERCARD
  
    if (visaPattern.test(number)) {
      return "VISA";
    } else if (mastercardPattern.test(number)) {
      return "MASTERCARD";
    }
    return null; // No es VISA ni MASTERCARD

  };
  
  // Funcion para volver a la pagina principal

  const handleGoBack = () => {

    navigate('/');

  };
  
  // Funcion para manejar los detalles de la tarjeta

  const handleCardDetailsChange = (e) => {

    const { name, value } = e.target;
    const newValue = (name === "number" || name === "pin" || (name === "documentNumber" && cardDetails.documentType === "DNI")) ? value.replace(/\D/, '') : value;
    setCardDetails({
      ...cardDetails,
      [name]: newValue

    });
  };

  // Funcion para reiniciar el estado del pedido

  const handleResetSession = () => {

    sessionStorage.clear();
    setOrderStatus("Pendiente");
    setConfirmedPaymentMethod(null);
    setPaymentNumber(null);

  };

  // Funcion para manejar el tipo de tarjeta

  const handleCardTypeChange = (e) => {

    setCardType(e.target.value);

  };

  // Funcion para manejar el tipo de documento 

  const handleDocumentTypeChange = (e) => {

    setCardDetails({
      ...cardDetails,
      documentType: e.target.value

    });
  };

  // Funcion para manejar la pasarela de pago

  const handleGatewayChange = (e) => {

    setGateway(e.target.value);

  };

  // Funcion para validar campos

  const validateFields = () => {

    const { number, pin,expirationDate, name, documentType, documentNumber } = cardDetails;
    const cardMark = getCardType(number); 

    // Validaciones 

    if (!cardType) return "Debe seleccionar el tipo de tarjeta.";
    if (cardMark == null) return "Número de tarjeta inválido. Debe ser VISA o MASTERCARD.";
    if(!number && !pin && !name && !documentType && !documentNumber && !gateway) return "Debe ingresar los datos de la tarjeta.";
    if (!number || number.length < 16) return "Número de tarjeta inválido. Debe tener 16 dígitos.";
    if (!pin || pin.length < 4) return "El PIN debe tener 4 dígitos.";
    if (!expirationDate) return "Debe ingresar la fecha de vencimiento."; 

    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Mes actual (0 indexado)
    const currentYear = String(currentDate.getFullYear()).slice(-2); // Últimos 2 dígitos del año actual
    
    // Validar formato de la fecha de vencimiento
    
    const [month, year] = expirationDate.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return "Formato de fecha de vencimiento inválido. Use MM/AA.";
    }

    // Comparar si la tarjeta ha expirado

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "La tarjeta no es vigente.";
    }

    if (!name) return "Debe ingresar el nombre completo.";
    if (!documentType) return "Debe seleccionar un tipo de documento.";
    if (!documentNumber) return "Debe ingresar un número de documento.";
    if (!gateway) return "Debe seleccionar una pasarela de pago.";
    
    return null; 
  };

  // Funcion para validar pago

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
        return true;
      } else {
        return false; 
      }
    }
  
    return false;

  };

  // Funcion para procesar el pago

  const handlePaymentSubmit = (e) => {

    e.preventDefault();

    const validationError = validateFields();

    if (validationError) {
      onPaymentProcess(validationError, null, true); 
      return;
    }

    if (confirmedPaymentMethod) {
      onPaymentProcess("El pago ya fue procesado", null, true);
      return;
    }

    setShowModal(true);
  };

  // Funcion para confirmar el pago

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
    setShowModal(false);

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

        <button type="submit">Procesar Pago</button>
        <button onClick={handleGoBack} style={{ marginTop: '20px' }}>
        Volver a elegir medio de pago
      </button>
      </form>

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
