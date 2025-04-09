import React from 'react';

const FormButton = ({ text, ...props }) => {
  return (
    <button
      style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
      }}
      {...props}
    >
      {text}
    </button>
  );
};

export default FormButton;