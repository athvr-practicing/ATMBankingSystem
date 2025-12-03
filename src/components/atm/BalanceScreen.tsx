import React, { useEffect } from 'react';
import { useATM } from '@/context/ATMContext';
import ATMHeader from './ATMHeader';
import { ArrowLeft, Wallet, CreditCard, TrendingUp } from 'lucide-react';

const BalanceScreen: React.FC = () => {
  const { currentAccount, setView, refreshBalance, isLoading } = useATM();

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  if (!currentAccount) return null;

  const maskAccountNumber = (num: string) => {
    return `****  ****  ****  ${num.slice(-4)}`;
  };

  return (
    <div className="atm-container">
      <div className="atm-card w-full max-w-md animate-fade-in">
        <ATMHeader 
          title="Account Balance" 
          subtitle="Your current account summary"
        />

        {/* Main Balance Card */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/30 animate-slide-up animate-pulse-glow">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Available Balance
            </span>
          </div>
          <p className="atm-balance text-5xl">
            ${isLoading ? '---' : currentAccount.balance.toFixed(2)}
          </p>
        </div>

        {/* Account Details */}
        <div className="space-y-4 mb-6">
          <div className="atm-transaction animate-slide-up animation-delay-100">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <span className="atm-label block">Card Number</span>
                <span className="font-mono text-foreground">
                  {maskAccountNumber(currentAccount.account_number)}
                </span>
              </div>
            </div>
          </div>

          <div className="atm-transaction animate-slide-up animation-delay-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <div>
                <span className="atm-label block">Account Holder</span>
                <span className="text-foreground">
                  {currentAccount.holder_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4 animate-slide-up animation-delay-300">
          <button
            onClick={() => setView('withdraw')}
            className="atm-button-secondary py-3 text-sm"
          >
            Withdraw
          </button>
          <button
            onClick={() => setView('deposit')}
            className="atm-button-secondary py-3 text-sm"
          >
            Deposit
          </button>
        </div>

        <button
          onClick={() => setView('dashboard')}
          className="atm-button-secondary flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default BalanceScreen;
