import React, { type ReactNode } from 'react'; // Added 'type' keyword here

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted-light dark:text-text-muted-dark hover:text-opacity-80">
          <i className="fas fa-times fa-lg"></i>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-main-light dark:text-text-main-dark">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;