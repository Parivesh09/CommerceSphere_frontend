import type { ToastOptions } from 'react-hot-toast';
import toast, { Toaster } from 'react-hot-toast';


export { Toaster };


const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: 'var(--color-surface-container-lowest)',
    color: 'var(--color-on-surface)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};


export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      icon: '✓',
      style: {
        ...defaultOptions.style,
        ...options?.style,
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...defaultOptions,
      ...options,
      icon: '✕',
      style: {
        ...defaultOptions.style,
        ...options?.style,
      },
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      ...defaultOptions,
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ',
      style: {
        ...defaultOptions.style,
        ...options?.style,
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      messages,
      {
        ...defaultOptions,
        ...options,
      }
    );
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  remove: (toastId?: string) => {
    toast.remove(toastId);
  },
};


export { toast };


export const ToasterProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        ...defaultOptions,
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--color-on-primary)',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: 'var(--color-error)',
            secondary: 'var(--color-on-primary)',
          },
        },
        loading: {
          iconTheme: {
            primary: 'var(--color-info)',
            secondary: 'var(--color-on-primary)',
          },
        },
      }}
    />
  );
};
