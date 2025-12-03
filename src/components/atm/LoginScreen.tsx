import React, { useState } from 'react';
import { useATM } from '@/context/ATMContext';
import ATMHeader from './ATMHeader';
import { CreditCard, Lock, Loader2 } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login, isLoading } = useATM();
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accountNumber.trim()) {
      setError('Please enter your card number');
      return;
    }

    if (accountNumber.length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }

    if (!pin.trim()) {
      setError('Please enter your PIN');
      return;
    }

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    const success = await login(accountNumber, pin);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  const handlePinKeypad = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handlePinClear = () => {
    setPin('');
  };

  const handlePinBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="atm-container">
      <div className="atm-card w-full max-w-md animate-fade-in">
        <ATMHeader 
          title="SecureBank ATM" 
          subtitle="Please insert your card and enter PIN"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Number Input */}
          <div className="animate-slide-up animation-delay-100">
            <label className="atm-label flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Card Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="Enter 16-digit card number"
              className="atm-input"
              maxLength={16}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Demo: 1234567890123456 or 9876543210987654
            </p>
          </div>

          {/* PIN Display */}
          <div className="animate-slide-up animation-delay-200">
            <label className="atm-label flex items-center gap-2">
              <Lock className="w-4 h-4" />
              PIN
            </label>
            <div className="atm-input text-center text-2xl tracking-[0.5em] h-14 flex items-center justify-center">
              {'•'.repeat(pin.length)}
              {pin.length < 4 && <span className="animate-pulse text-muted-foreground">_</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Demo PINs: 1234 or 4321
            </p>
          </div>

          {/* PIN Keypad */}
          <div className="animate-slide-up animation-delay-300">
            <div className="atm-keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinKeypad(digit)}
                  className="atm-key"
                  disabled={isLoading}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePinClear}
                className="atm-key text-destructive text-sm"
                disabled={isLoading}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handlePinKeypad('0')}
                className="atm-key"
                disabled={isLoading}
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinBackspace}
                className="atm-key text-warning text-sm"
                disabled={isLoading}
              >
                ←
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="atm-button animate-slide-up animation-delay-400 flex items-center justify-center gap-2"
            disabled={isLoading || pin.length !== 4}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Enter'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
