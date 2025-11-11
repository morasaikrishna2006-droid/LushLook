const PasswordStrengthMeter = ({ password }) => {
  const getPasswordStrength = () => {
    const length = password.length;
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const color = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'][strength];

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
      </div>
      <p className={`text-sm mt-2 ${strength > 3 ? 'text-green-500' : 'text-gray-500'}`}>{strengthLabel}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
