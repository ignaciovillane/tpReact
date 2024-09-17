import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importamos los estilos predeterminados

// Función para mostrar el toast de éxito
export const showSuccessNotification = (message) => {
  toast.success(message, {
    position: "bottom-left",
    autoClose: 4000, // Tiempo de duración (4 segundos)
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Función para mostrar el toast de error
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

// Componente ToastContainer que debe ser incluido en cada archivo donde quieras usar los toasts
const Notification = () => {
  return <ToastContainer />;
};

export default Notification;