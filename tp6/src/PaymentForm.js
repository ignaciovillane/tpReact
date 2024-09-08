import React, { useState } from 'react';
//Trasnportistas disponibles para seleccionar
const transportistas = [
  { id: 1, name: "Jorge Rodriguez", rating: "4.5 de 5", retiro: "10-09-2024", entrega: "11-09-2024", importe: 1500 },
  { id: 2, name: "Luis Lopez", rating: "4.0 de 5", retiro: "12-09-2024", entrega: "13-09-2024", importe: 1800 }
];

const PaymentForm = () => {
  const [transportista, setTransportista] = useState(null);//Para manejar la selección de los transportistas
  const [paymentMethod, setPaymentMethod] = useState("");//Para manejar el metodo de pago
  const [cardDetails, setCardDetails] = useState({ number: "", pin: "", name: "", documentType: "", documentNumber: "" });//Para manejar el detalle de las tarjetas
  const [cardType, setCardType] = useState("");// Nuevo estado para crédito o débito
  const [gateway, setGateway] = useState("");// Estado para manejar la pasarela de pago
  const [orderStatus, setOrderStatus] = useState("Envío");// Estado inicial del pedido
  const [messages, setMessages] = useState([]); // Arreglo para almacenar los mensajes

// Mostrar y ocultar varios mensajes flotantes, le paso el mensaje como parametro y si el mensaje es error le paso true
const showFloatingMessage = (newMessage, isError = false) => {
  setMessages((prevMessages) => [...prevMessages, { text: newMessage, isError }]); // Agregar el nuevo mensaje al arreglo
  setTimeout(() => {
    setMessages((prevMessages) => prevMessages.slice(1)); // Eliminar el primer mensaje después de 4 segundos
  }, 4000);
};
// Función para determinar el color de fondo según el contenido del mensaje
const getMessageBackgroundColor = (isError) => {
  return isError ? 'red' : 'green'; // Fondo rojo para errores, verde para exito
};

//Evento cuando se elijen los transportistas
  const handleTransportistaChange = (e) => {
    const selectedTransportista = transportistas.find(t => t.name === e.target.value);
    setTransportista(selectedTransportista);
  };
//Evento cuando se elijen los medios de pago
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
//Evento cuando se completa el pago con tarjeta
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === "number" || name === "pin" || name === "documentNumber") ? value.replace(/\D/, '') : value;//solo permito números
    setCardDetails({
      ...cardDetails,
      [name]: newValue
    });
  };
//Evento cuando se elije el tipo de tarjeta 
  const handleCardTypeChange = (e) => {
    setCardType(e.target.value);
  };
//Evento cuando se elije la pasarela de pago
  const handleGatewayChange = (e) => {
    setGateway(e.target.value);
  };
//Evento cuando se clickea el boton Confirmar cotización
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transportista && !paymentMethod) {
           showFloatingMessage("Debe seleccionar un transportista y una forma de pago.",true);//le paso un true para que lo lea como error
      return;
    }
    if(!transportista)
    {
      showFloatingMessage("Debe seleccionar un transportista.",true);//le paso un true para que lo lea como error
      return;
    }
    if(!paymentMethod)
    {
      showFloatingMessage("Debe seleccionar una forma de pago.",true);//le paso un true para que lo lea como error
    }
    if (paymentMethod === "tarjeta" && (!cardDetails.number || !cardDetails.pin || !cardDetails.name)) {
     showFloatingMessage("Debe completar todos los detalles de la tarjeta.",true);//le paso un true para que lo lea como error
      return;
    }
    if (paymentMethod === "contado al retirar" || paymentMethod === "contado contra entrega") {
      setOrderStatus("Confirmado");
      showFloatingMessage("Pago procesado correctamente");
      const  messageEmail = `Se envió un correo con la cotización aceptada pagado con ${paymentMethod}`;
      showFloatingMessage(messageEmail);
    } else if (paymentMethod === "tarjeta") {
      const isPaymentSuccessful = Math.random() > 0.5;// 50% de que acepte o no el pago con tarjeta hay que ver como manejar esta parte
      if (isPaymentSuccessful) {
        const nroPago = Math.floor(1000 + Math.random() * 9000);  // Generar número de pago aleatorio de 4 dígitos
        const message = `Pago procesado correctamente con ${gateway} con el número de pago ${nroPago}`;
       const messageEmail = `Se envió un correo con la cotización aceptada pagado con ${paymentMethod} de ${cardType}`;
        setOrderStatus("Confirmado");//Cambia el estado del pedido a Confirmado
        showFloatingMessage(message);
        showFloatingMessage(messageEmail);
        showFloatingMessage("Se envio una notificación Push al Transportista");
      } else {
        showFloatingMessage("Pago Rechazado ingrese otra tarjeta o pruebe otro medio de pago",true);
         setOrderStatus("Envío");
      }
    }
  };
  //Muestra el logo de la tarjeta
  //el primer dígito de las tarjetas Visa es siempre un "4" si la tarjeta comienza con 4 va a mostrar el logo de Visa
  //el primer dígito de las tarjetas Mastercard es siempre un "5" si la tarjeta comienza con 5 va a mostrar el logo de Mastercard
  //Las tarjetas American Express (Amex) comienzan con un número dentro del rango de "34" o "37".Si comienza en este rango va a mostrar el logo de American Express
  const renderCardLogo = () => {
    const number = cardDetails.number;
    if (number.startsWith("4")) {
      return <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ width: '100px', height: 'auto' }} />;//Visa
    }
    if (number.startsWith("5")) {
      return <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="MasterCard" style={{ width: '100px', height: 'auto' }} />;//Mastercard
    }
    if (number.startsWith("34") || number.startsWith("35") || number.startsWith("36") || number.startsWith("37")) {
      return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1000px-American_Express_logo_%282018%29.svg.png" alt="American Express" style={{ width: '100px', height: 'auto' }} />;
    }//American Express
    return null;
  };
//Manejo el cambio de estado del pedido , si se acepta el pago cambia a estado Confirmado escrito en verde
  const renderOrderStatus = () => {
    if (orderStatus === "Confirmado") {
      return <p style={{ color: 'green' }}><strong>Estado del Pedido: {orderStatus}</strong></p>;
    }
    return <p><strong>Estado del Pedido: {orderStatus}</strong></p>;
  };

  return (
    <div className="payment-form">
      <h2>Aceptar Cotización</h2>
      {renderOrderStatus()}{/*estado del pedido */}
       {/* Mostrar los mensajes flotantes */}
       {messages.length > 0 && (
        <div style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          padding: '10px', borderRadius: '10px', zIndex: 1000
        }}>
          {messages.map((message, index) => (
            <p key={index} style={{ 
              margin: '5px 0', 
              backgroundColor: getMessageBackgroundColor(message.isError), 
              color: 'white', 
              padding: '5px', 
              borderRadius: '5px' 
            }}>
              {message.text}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Transportista Selector */}
        <div>
          <label htmlFor="transportista">Transportista:</label>
          <select id="transportista" value={transportista?.name || ""} onChange={handleTransportistaChange}>
            <option value="">Seleccione un transportista</option>
            {transportistas.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name} (Calificación: {t.rating})
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar Fecha de Retiro, Entrega e Importe */}
        {transportista && (
          <div className="details">
            <p><strong>Fecha de Retiro:</strong> {transportista.retiro}</p>
            <p><strong>Fecha de Entrega:</strong> {transportista.entrega}</p>
            <p><strong>Importe del Viaje:</strong> ${transportista.importe}</p>
          </div>
        )}

        {/* Selector de Forma de Pago */}
        <div>
          <label htmlFor="payment-method">Forma de Pago:</label>
          <select id="payment-method" value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="">Seleccione una forma de pago</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="contado al retirar">Contado al retirar</option>
            <option value="contado contra entrega">Contado contra entrega</option>
          </select>
        </div>

        {/* Si el pago es con tarjeta, mostrar campos de tarjeta */}
        {paymentMethod === "tarjeta" && (
          <div>
            <h3>Detalles de la Tarjeta</h3>
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
            {renderCardLogo()}
            <input
              type="text"
              name="pin"
              placeholder="PIN"
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
            <input
              type="text"
              name="documentType"
              placeholder="Tipo de documento"
              value={cardDetails.documentType}
              onChange={handleCardDetailsChange}
            />
            <input
              type="text"
              name="documentNumber"
              placeholder="Número de documento"
              value={cardDetails.documentNumber}
              onChange={handleCardDetailsChange}
            /> 
            {/* Selección de la pasarela de pago */}
            <div>
              <p>Seleccione la pasarela de pago:</p>
              <select value={gateway} onChange={handleGatewayChange}>
                <option value="">Seleccione una pasarela</option>
                <option value="MercadoPago">MercadoPago</option>
                <option value="Stripe">Stripe</option>
              </select>
            </div>
            {/* Mostrar logos de las pasarelas de pago */}
            <div className="gateway-logos">
              {gateway === "MercadoPago" && (
                <img 
                  src="https://www.mercadopago.com/org-img/MP3/home/logomp3.gif" 
                  alt="MercadoPago" 
                  style={{ width: '150px', height: 'auto' }} 
                />
              )}
              {gateway === "Stripe" && (
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Stripe" 
                  style={{ width: '100px', height: 'auto' }} 
                />
              )}
            </div>
          </div>
        )}
        <button type="submit">Confirmar Cotización</button>
      </form>
    </div>
  );
};
export default PaymentForm;