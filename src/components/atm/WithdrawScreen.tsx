import React, { useState } from 'react';
import { useATM } from '@/context/ATMContext';
import ATMHeader from './ATMHeader';
import { ArrowLeft, Loader2, ArrowDownCircle } from 'lucide-react';

const WithdrawScreen: React.FC = () => {
  const { currentAccount, withdraw, setView, isLoading } = useATM();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const quickAmounts = [20, 50, 100, 200, 500, 1000];

  const handleWithdraw = async (withdrawAmount: number) => {
    setError('');

    if (withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (currentAccount && withdrawAmount > currentAccount.balance) {
      setError('Insufficient balance');
      return;
    }

    const success = await withdraw(withdrawAmount);
    if (success) {
      setView('dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWithdraw(parseFloat(amount));
  };

  if (!currentAccount) return null;

  return (
    <div className="atm-container">
      <div className="atm-card w-full max-w-md animate-fade-in">
        <ATMHeader 
          title="Cash Withdrawal" 
          subtitle={`Available: $${currentAccount.balance.toFixed(2)}`}
        />

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickAmounts.map((quickAmount, index) => (
            <button
              key={quickAmount}
              onClick={() => handleWithdraw(quickAmount)}
              disabled={isLoading || quickAmount > currentAccount.balance}
              className="atm-button-secondary text-center py-4 animate-slide-up disabled:opacity-30"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="font-mono text-lg">${quickAmount}</span>
            </button>
          ))}
        </div>

        {/* Custom Amount Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up animation-delay-300">
          <div>
            <label className="atm-label flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4" />
              Other Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-lg">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="atm-input pl-8"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="atm-button flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Withdraw'
            )}
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => setView('dashboard')}
          className="atm-button-secondary mt-4 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default WithdrawScreen;
