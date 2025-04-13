import React from 'react';

const FormInput = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <input
        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
};

export default FormInput;
