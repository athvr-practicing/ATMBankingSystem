import React, { useState } from 'react';
import { useATM } from '@/context/ATMContext';
import ATMHeader from './ATMHeader';
import { ArrowLeft, Loader2, ArrowUpCircle } from 'lucide-react';

const DepositScreen: React.FC = () => {
  const { currentAccount, deposit, setView, isLoading } = useATM();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const depositAmount = parseFloat(amount);

    if (!amount || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (depositAmount > 10000) {
      setError('Maximum deposit amount is $10,000');
      return;
    }

    const success = await deposit(depositAmount);
    if (success) {
      setView('dashboard');
    }
  };

  if (!currentAccount) return null;

  return (
    <div className="atm-container">
      <div className="atm-card w-full max-w-md animate-fade-in">
        <ATMHeader 
          title="Cash Deposit" 
          subtitle="Insert cash or check to deposit"
        />

        {/* Current Balance Display */}
        <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border/50 animate-slide-up">
          <span className="atm-label">Current Balance</span>
          <p className="font-mono text-2xl text-primary">
            ${currentAccount.balance.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="animate-slide-up animation-delay-100">
            <label className="atm-label flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4" />
              Deposit Amount
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
                max="10000"
                step="0.01"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum deposit: $10,000
            </p>
          </div>

          {/* Preview New Balance */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/30 animate-fade-in">
              <span className="text-xs text-success uppercase tracking-wider">
                New Balance After Deposit
              </span>
              <p className="font-mono text-xl text-success">
                ${(currentAccount.balance + parseFloat(amount)).toFixed(2)}
              </p>
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="atm-button flex items-center justify-center gap-2 animate-slide-up animation-delay-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Deposit'
            )}
          </button>
        </form>

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

export default DepositScreen;
