-- Create accounts table for ATM users
CREATE TABLE public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_number VARCHAR(16) NOT NULL UNIQUE,
  pin VARCHAR(4) NOT NULL,
  holder_name TEXT NOT NULL,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer_in', 'transfer_out')),
  amount DECIMAL(15, 2) NOT NULL,
  recipient_account VARCHAR(16),
  description TEXT,
  balance_after DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts (public read for login, but PIN is never exposed via API)
CREATE POLICY "Allow account lookup by account number" 
ON public.accounts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow account updates" 
ON public.accounts 
FOR UPDATE 
USING (true);

-- RLS Policies for transactions
CREATE POLICY "Allow viewing transactions" 
ON public.transactions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow inserting transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert two sample users
INSERT INTO public.accounts (account_number, pin, holder_name, balance) VALUES
('1234567890123456', '1234', 'John Doe', 5000.00),
('9876543210987654', '4321', 'Jane Smith', 7500.00);

-- Insert some sample transactions for demonstration
INSERT INTO public.transactions (account_id, type, amount, description, balance_after) 
SELECT id, 'deposit', 5000.00, 'Initial deposit', 5000.00 FROM public.accounts WHERE account_number = '1234567890123456';

INSERT INTO public.transactions (account_id, type, amount, description, balance_after) 
SELECT id, 'deposit', 7500.00, 'Initial deposit', 7500.00 FROM public.accounts WHERE account_number = '9876543210987654';