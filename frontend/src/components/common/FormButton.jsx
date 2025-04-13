import React from 'react';

const FormButton = ({ text, ...props }) => {
  return (
    <button
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
      {...props}
    >
      {text}
    </button>
  );
};

export default FormButton;
