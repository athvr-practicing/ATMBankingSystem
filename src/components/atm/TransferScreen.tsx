import React, { useState } from 'react';
import { useATM } from '@/context/ATMContext';
import ATMHeader from './ATMHeader';
import { ArrowLeft, Loader2, Send, User, DollarSign } from 'lucide-react';

const TransferScreen: React.FC = () => {
  const { currentAccount, transfer, setView, isLoading } = useATM();
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'details' | 'confirm'>('details');

  const handleContinue = () => {
    setError('');

    if (!recipientAccount.trim()) {
      setError('Please enter recipient account number');
      return;
    }

    if (recipientAccount.length !== 16) {
      setError('Account number must be 16 digits');
      return;
    }

    if (recipientAccount === currentAccount?.account_number) {
      setError('Cannot transfer to your own account');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (currentAccount && parseFloat(amount) > currentAccount.balance) {
      setError('Insufficient balance');
      return;
    }

    setStep('confirm');
  };

  const handleTransfer = async () => {
    const success = await transfer(recipientAccount, parseFloat(amount));
    if (success) {
      setView('dashboard');
    }
  };

  if (!currentAccount) return null;

  return (
    <div className="atm-container">
      <div className="atm-card w-full max-w-md animate-fade-in">
        <ATMHeader 
          title="Fund Transfer" 
          subtitle={`Available: $${currentAccount.balance.toFixed(2)}`}
        />

        {step === 'details' ? (
          <div className="space-y-4">
            {/* Recipient Account */}
            <div className="animate-slide-up">
              <label className="atm-label flex items-center gap-2">
                <User className="w-4 h-4" />
                Recipient Account Number
              </label>
              <input
                type="text"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="Enter 16-digit account number"
                className="atm-input"
                maxLength={16}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Demo: 9876543210987654 (Jane Smith)
              </p>
            </div>

            {/* Amount */}
            <div className="animate-slide-up animation-delay-100">
              <label className="atm-label flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Transfer Amount
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
              onClick={handleContinue}
              disabled={!recipientAccount || !amount}
              className="atm-button flex items-center justify-center gap-2 animate-slide-up animation-delay-200"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Confirmation Details */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-3 animate-slide-up">
              <div>
                <span className="atm-label">Recipient Account</span>
                <p className="font-mono text-foreground">
                  {recipientAccount.replace(/(.{4})/g, '$1 ').trim()}
                </p>
              </div>
              <div>
                <span className="atm-label">Transfer Amount</span>
                <p className="font-mono text-2xl text-primary">
                  ${parseFloat(amount).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="atm-label">Balance After Transfer</span>
                <p className="font-mono text-foreground">
                  ${(currentAccount.balance - parseFloat(amount)).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 animate-slide-up animation-delay-100">
              <p className="text-sm text-warning text-center">
                Please verify the details before confirming the transfer.
              </p>
            </div>

            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleTransfer}
              disabled={isLoading}
              className="atm-button flex items-center justify-center gap-2 animate-slide-up animation-delay-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Confirm Transfer
                </>
              )}
            </button>

            <button
              onClick={() => setStep('details')}
              className="atm-button-secondary"
              disabled={isLoading}
            >
              Edit Details
            </button>
          </div>
        )}

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

export default TransferScreen;
