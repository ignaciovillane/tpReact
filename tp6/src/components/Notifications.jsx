import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importamos los estilos predeterminados

// Función para mostrar notificacion de éxito

export const showSuccessNotification = (message) => {

  toast.success(message, {
    position: "bottom-left",
    autoClose: 4000, 
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,

  });
};

// Función para mostrar notificacion de error

export const showErrorNotification = (message) => {
  toast.error(message, {
    position: "bottom-left",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Componente Notification

const Notification = () => {
  return <ToastContainer />;
};

export default Notification;