export interface Account {
  id: string;
  account_number: string;
  pin: string;
  holder_name: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
  amount: number;
  recipient_account: string | null;
  description: string | null;
  balance_after: number;
  created_at: string;
}

export type ATMView = 
  | 'login' 
  | 'dashboard' 
  | 'withdraw' 
  | 'deposit' 
  | 'balance' 
  | 'transfer' 
  | 'statement';
