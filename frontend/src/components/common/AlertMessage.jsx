import React from 'react';

const AlertMessage = ({ error, message }) => {
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 border border-red-300 rounded p-2 mb-4 text-sm">
        {error}
      </div>
    );
  }

  if (message) {
    return (
      <div className="bg-green-100 text-green-700 border border-green-300 rounded p-2 mb-4 text-sm">
        {message}
      </div>
    );
  }

  return null;
};

export default AlertMessage;
