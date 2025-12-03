import React from 'react';
import { useATM } from '@/context/ATMContext';
import ATMHeader from './ATMHeader';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Send, 
  Receipt, 
  Wallet,
  LogOut,
  CreditCard
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentAccount, setView, logout, refreshBalance } = useATM();

  React.useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  if (!currentAccount) return null;

  const maskAccountNumber = (num: string) => {
    return `****  ****  ****  ${num.slice(-4)}`;
  };

  const menuItems = [
    { 
      icon: ArrowDownCircle, 
      label: 'Withdraw', 
      view: 'withdraw' as const,
      description: 'Cash withdrawal'
    },
    { 
      icon: ArrowUpCircle, 
      label: 'Deposit', 
      view: 'deposit' as const,
      description: 'Cash or check'
    },
    { 
      icon: Wallet, 
      label: 'Balance', 
      view: 'balance' as const,
      description: 'Check balance'
    },
    { 
      icon: Send, 
      label: 'Transfer', 
      view: 'transfer' as const,
      description: 'Send money'
    },
    { 
      icon: Receipt, 
      label: 'Statement', 
      view: 'statement' as const,
      description: 'Recent activity'
    },
  ];

  return (
    <div className="atm-container">
      <div className="atm-card w-full max-w-lg animate-fade-in">
        <ATMHeader 
          title="Welcome Back" 
          subtitle={currentAccount.holder_name}
        />

        {/* Account Card */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Debit Card
            </span>
          </div>
          <p className="font-mono text-lg text-foreground/80 mb-4 tracking-widest">
            {maskAccountNumber(currentAccount.account_number)}
          </p>
          <div>
            <span className="atm-label">Available Balance</span>
            <p className="atm-balance">${currentAccount.balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {menuItems.map((item, index) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className="atm-menu-button animate-slide-up group"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="atm-menu-icon">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-foreground block">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="atm-button-danger flex items-center justify-center gap-2 animate-slide-up animation-delay-400"
        >
          <LogOut className="w-5 h-5" />
          Exit / Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
