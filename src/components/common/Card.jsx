import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;