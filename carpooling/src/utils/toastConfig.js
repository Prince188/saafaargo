import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom toast configurations
export const toastConfig = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

// Pre-defined toast messages
export const showSuccess = (message) => {
    toast.success(message, toastConfig);
};

export const showError = (message) => {
    toast.error(message, toastConfig);
};

export const showInfo = (message) => {
    toast.info(message, toastConfig);
};

export const showWarning = (message) => {
    toast.warning(message, toastConfig);
};

export const showPromise = async (promise, messages) => {
    return toast.promise(promise, {
        pending: messages.pending || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong!'
    }, toastConfig);
};