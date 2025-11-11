import { useState } from 'react';

const PhoneInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    let formattedInput = '';

    if (input.length > 0) {
      formattedInput = '(' + input.substring(0, 3);
    }
    if (input.length > 3) {
      formattedInput += ') ' + input.substring(3, 6);
    }
    if (input.length > 6) {
      formattedInput += '-' + input.substring(6, 10);
    }
    
    onChange(formattedInput);
  };

  return (
    <input 
      type="tel" 
      placeholder="Phone Number" 
      value={value} 
      onChange={handleInputChange} 
      required 
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
    />
  );
};

export default PhoneInput;
