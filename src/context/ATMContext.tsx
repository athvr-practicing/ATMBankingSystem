import React, { createContext, useContext, useState, useCallback } from 'react';
import { Account, Transaction, ATMView } from '@/types/atm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ATMContextType {
  currentAccount: Account | null;
  currentView: ATMView;
  isLoading: boolean;
  transactions: Transaction[];
  login: (accountNumber: string, pin: string) => Promise<boolean>;
  logout: () => void;
  setView: (view: ATMView) => void;
  withdraw: (amount: number) => Promise<boolean>;
  deposit: (amount: number) => Promise<boolean>;
  transfer: (recipientAccount: string, amount: number) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const ATMContext = createContext<ATMContextType | undefined>(undefined);

export const ATMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [currentView, setCurrentView] = useState<ATMView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const login = useCallback(async (accountNumber: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('account_number', accountNumber)
        .single();

      if (error || !data) {
        toast.error('Invalid card number');
        return false;
      }

      if (data.pin !== pin) {
        toast.error('Invalid PIN');
        return false;
      }

      setCurrentAccount({
        ...data,
        balance: parseFloat(data.balance as unknown as string)
      });
      setCurrentView('dashboard');
      toast.success('Login successful');
      return true;
    } catch (error) {
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentAccount(null);
    setTransactions([]);
    setCurrentView('login');
    toast.success('Logged out successfully');
  }, []);

  const setView = useCallback((view: ATMView) => {
    setCurrentView(view);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!currentAccount) return;
    
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', currentAccount.id)
      .single();

    if (data && !error) {
      setCurrentAccount(prev => prev ? { 
        ...prev, 
        balance: parseFloat(data.balance as unknown as string) 
      } : null);
    }
  }, [currentAccount]);

  const withdraw = useCallback(async (amount: number): Promise<boolean> => {
    if (!currentAccount) return false;
    setIsLoading(true);

    try {
      if (amount > currentAccount.balance) {
        toast.error('Insufficient balance');
        return false;
      }

      const newBalance = currentAccount.balance - amount;

      const { error: updateError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', currentAccount.id);

      if (updateError) {
        toast.error('Withdrawal failed');
        return false;
      }

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: currentAccount.id,
          type: 'withdrawal',
          amount: amount,
          description: 'ATM Withdrawal',
          balance_after: newBalance
        });

      if (transactionError) {
        console.error('Transaction logging failed:', transactionError);
      }

      setCurrentAccount(prev => prev ? { ...prev, balance: newBalance } : null);
      toast.success(`$${amount.toFixed(2)} withdrawn successfully`);
      return true;
    } catch (error) {
      toast.error('An error occurred during withdrawal');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const deposit = useCallback(async (amount: number): Promise<boolean> => {
    if (!currentAccount) return false;
    setIsLoading(true);

    try {
      const newBalance = currentAccount.balance + amount;

      const { error: updateError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', currentAccount.id);

      if (updateError) {
        toast.error('Deposit failed');
        return false;
      }

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: currentAccount.id,
          type: 'deposit',
          amount: amount,
          description: 'ATM Deposit',
          balance_after: newBalance
        });

      if (transactionError) {
        console.error('Transaction logging failed:', transactionError);
      }

      setCurrentAccount(prev => prev ? { ...prev, balance: newBalance } : null);
      toast.success(`$${amount.toFixed(2)} deposited successfully`);
      return true;
    } catch (error) {
      toast.error('An error occurred during deposit');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const transfer = useCallback(async (recipientAccount: string, amount: number): Promise<boolean> => {
    if (!currentAccount) return false;
    setIsLoading(true);

    try {
      if (amount > currentAccount.balance) {
        toast.error('Insufficient balance');
        return false;
      }

      if (recipientAccount === currentAccount.account_number) {
        toast.error('Cannot transfer to your own account');
        return false;
      }

      // Find recipient account
      const { data: recipient, error: findError } = await supabase
        .from('accounts')
        .select('*')
        .eq('account_number', recipientAccount)
        .single();

      if (findError || !recipient) {
        toast.error('Recipient account not found');
        return false;
      }

      const senderNewBalance = currentAccount.balance - amount;
      const recipientNewBalance = parseFloat(recipient.balance as unknown as string) + amount;

      // Update sender balance
      const { error: senderError } = await supabase
        .from('accounts')
        .update({ balance: senderNewBalance })
        .eq('id', currentAccount.id);

      if (senderError) {
        toast.error('Transfer failed');
        return false;
      }

      // Update recipient balance
      const { error: recipientError } = await supabase
        .from('accounts')
        .update({ balance: recipientNewBalance })
        .eq('id', recipient.id);

      if (recipientError) {
        // Rollback sender balance
        await supabase
          .from('accounts')
          .update({ balance: currentAccount.balance })
          .eq('id', currentAccount.id);
        toast.error('Transfer failed');
        return false;
      }

      // Log transactions
      await supabase.from('transactions').insert([
        {
          account_id: currentAccount.id,
          type: 'transfer_out',
          amount: amount,
          recipient_account: recipientAccount,
          description: `Transfer to ${recipientAccount}`,
          balance_after: senderNewBalance
        },
        {
          account_id: recipient.id,
          type: 'transfer_in',
          amount: amount,
          recipient_account: currentAccount.account_number,
          description: `Transfer from ${currentAccount.account_number}`,
          balance_after: recipientNewBalance
        }
      ]);

      setCurrentAccount(prev => prev ? { ...prev, balance: senderNewBalance } : null);
      toast.success(`$${amount.toFixed(2)} transferred successfully`);
      return true;
    } catch (error) {
      toast.error('An error occurred during transfer');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const fetchTransactions = useCallback(async () => {
    if (!currentAccount) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', currentAccount.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        toast.error('Failed to fetch transactions');
        return;
      }

      setTransactions(data?.map(t => ({
        ...t,
        type: t.type as Transaction['type'],
        amount: parseFloat(t.amount as unknown as string),
        balance_after: parseFloat(t.balance_after as unknown as string)
      })) || []);
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  return (
    <ATMContext.Provider
      value={{
        currentAccount,
        currentView,
        isLoading,
        transactions,
        login,
        logout,
        setView,
        withdraw,
        deposit,
        transfer,
        fetchTransactions,
        refreshBalance
      }}
    >
      {children}
    </ATMContext.Provider>
  );
};

export const useATM = () => {
  const context = useContext(ATMContext);
  if (context === undefined) {
    throw new Error('useATM must be used within an ATMProvider');
  }
  return context;
};
