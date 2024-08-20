import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleClose = () => {
    onClose();
  };

  const modalClasses = `flex justify-center items-center ${
    isOpen ? "" : "hidden"
  }`;

  const backdropClasses = "inset-0 bg-gray-500 opacity-75";

  return (
    <div className={modalClasses}>
      <div className="modal-overlay" onClick={handleClose} />
      <div className="modal-container z-50 mx-auto w-11/12 overflow-y-auto rounded bg-white shadow-lg md:max-w-md">
        <div className="modal-content py-4 px-6 text-left">
          <div className="modal-header">
            <button className="modal-close" onClick={handleClose}>
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.348 14.849a1 1 0 0 1-1.414 0L10 11.414l-2.93 2.93a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 0 1 0-1.414L7.586 10l-2.93-2.93a1 1 0 0 1 0-1.414l.707-.707a1 1 0 0 1 1.414 0L10 8.586l2.93-2.93a1 1 0 0 1 1.414 0l.707.707a1 1 0 0 1 0 1.414L12.414 10l2.93 2.93a1 1 0 0 1 0 1.414l-.707.707z" />
              </svg>
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
      <div className={backdropClasses} />
    </div>
  );
};
