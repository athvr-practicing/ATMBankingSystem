import React from 'react';
import { Banknote } from 'lucide-react';

interface ATMHeaderProps {
  title: string;
  subtitle?: string;
}

const ATMHeader: React.FC<ATMHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="atm-header">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Banknote className="w-5 h-5 text-primary" />
        </div>
        <h1 className="atm-title">{title}</h1>
      </div>
      {subtitle && <p className="atm-subtitle">{subtitle}</p>}
    </div>
  );
};

export default ATMHeader;
