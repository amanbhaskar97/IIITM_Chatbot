import React from 'react';

const FormInput = ({ label, ...props }) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '5px' }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ced4da',
          fontSize: '16px'
        }}
        {...props}
      />
    </div>
  );
};

export default FormInput;