import { useState, useRef } from 'react';

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // On backspace, move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const value = e.clipboardData.getData('text');
    if (isNaN(value) || value.length !== length) {
        return;
    }
    const newOtp = value.split('');
    setOtp(newOtp);
    inputRefs.current[length - 1].focus();
    onComplete(value);
  };

  return (
    <div className="flex justify-center space-x-2" onPaste={handlePaste}>
      {otp.map((data, index) => {
        return (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={data}
            ref={el => inputRefs.current[index] = el}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onFocus={e => e.target.select()}
            className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
