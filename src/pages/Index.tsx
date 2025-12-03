import { ATMProvider } from '@/context/ATMContext';
import ATMApp from '@/components/atm/ATMApp';

const Index = () => {
  return (
    <ATMProvider>
      <ATMApp />
    </ATMProvider>
  );
};

export default Index;
