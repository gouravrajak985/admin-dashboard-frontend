import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, KeyRound } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const OTPVerification = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [email, setEmail] = useState('john@example.com'); // This would come from previous step

  // Create refs for each input
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  useEffect(() => {
    // Focus the first input when component mounts
    inputRefs[0].current?.focus();

    // Start the timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsResendDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // If a digit was entered and there's a next input, focus it
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // If backspace is pressed and current input is empty, focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs[5].current?.focus();
    }
  };

  const handleResendOTP = () => {
    // Reset timer and disable resend button
    setTimer(60);
    setIsResendDisabled(true);
    
    // Logic to resend OTP would go here
    console.log('Resending OTP...');
    
    // Start the timer again
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsResendDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    
    // Check if OTP is complete
    if (otpValue.length === 6) {
      // Verify OTP logic would go here
      console.log('Verifying OTP:', otpValue);
      
      // Navigate to dashboard on success
      navigate('/home');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full mx-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } rounded-lg shadow-lg p-8`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Verification Required</h2>
          <p className="text-sm text-gray-500">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-14 text-center text-xl font-bold rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            ))}
          </div>
          
          <p className="text-center text-sm text-gray-500 mb-6">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOTP}
              disabled={isResendDisabled}
              className={`font-medium ${
                isResendDisabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-primary hover:text-primary/80'
              }`}
            >
              Resend {isResendDisabled && `(${timer}s)`}
            </button>
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.some(digit => !digit)}
          className={`w-full py-3 rounded-md flex items-center justify-center font-medium ${
            otp.some(digit => !digit)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          Verify & Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;