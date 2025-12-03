import React, { useEffect } from 'react';
import { useATM } from '@/context/ATMContext';
import ATMHeader from './ATMHeader';
import { 
  ArrowLeft, 
  Loader2, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Send, 
  Download,
  Receipt
} from 'lucide-react';
import { format } from 'date-fns';

const StatementScreen: React.FC = () => {
  const { currentAccount, transactions, fetchTransactions, setView, isLoading } = useATM();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (!currentAccount) return null;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="w-5 h-5 text-success" />;
      case 'withdrawal':
        return <ArrowUpCircle className="w-5 h-5 text-destructive" />;
      case 'transfer_out':
        return <Send className="w-5 h-5 text-warning" />;
      case 'transfer_in':
        return <Download className="w-5 h-5 text-success" />;
      default:
        return <Receipt className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
        return 'text-success';
      case 'withdrawal':
      case 'transfer_out':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer_out':
        return 'Transfer Out';
      case 'transfer_in':
        return 'Transfer In';
      default:
        return type;
    }
  };

  const formatAmount = (type: string, amount: number) => {
    const prefix = type === 'deposit' || type === 'transfer_in' ? '+' : '-';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  return (
    <div className="atm-container">
      <div className="atm-card w-full max-w-md animate-fade-in">
        <ATMHeader 
          title="Mini Statement" 
          subtitle="Last 5 transactions"
        />

        {/* Current Balance */}
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 animate-slide-up">
          <span className="atm-label">Current Balance</span>
          <p className="font-mono text-2xl text-primary">
            ${currentAccount.balance.toFixed(2)}
          </p>
        </div>

        {/* Transactions List */}
        <div className="space-y-3 mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground animate-fade-in">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No transactions found</p>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div 
                key={transaction.id}
                className="atm-transaction animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {getTransactionLabel(transaction.type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${getTransactionColor(transaction.type)}`}>
                    {formatAmount(transaction.type, transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    Bal: ${transaction.balance_after.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
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

export default StatementScreen;
