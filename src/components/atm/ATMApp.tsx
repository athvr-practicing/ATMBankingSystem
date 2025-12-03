import React from 'react';
import { useATM } from '@/context/ATMContext';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';
import WithdrawScreen from './WithdrawScreen';
import DepositScreen from './DepositScreen';
import BalanceScreen from './BalanceScreen';
import TransferScreen from './TransferScreen';
import StatementScreen from './StatementScreen';

const ATMApp: React.FC = () => {
  const { currentView } = useATM();

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <Dashboard />;
      case 'withdraw':
        return <WithdrawScreen />;
      case 'deposit':
        return <DepositScreen />;
      case 'balance':
        return <BalanceScreen />;
      case 'transfer':
        return <TransferScreen />;
      case 'statement':
        return <StatementScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderView()}
    </div>
  );
};

export default ATMApp;
