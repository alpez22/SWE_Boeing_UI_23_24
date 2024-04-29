import React from 'react';
import Button from 'react-bootstrap/Button';


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={backdropStyle} onClick={onClose}> {}
      <div style={modalStyle} onClick={e => e.stopPropagation()}> {}
        <button onClick={onClose} style={closeButtonStyle}>×</button>
        {children}
      </div>
    </div>
  );
};

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  position: 'relative',
  background: '#fff',
  borderRadius: '5px',
  padding: '20px',
  width: '50%',
  maxHeight: '80%',
  overflowY: 'auto',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '2.7em',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
};

export default Modal;
