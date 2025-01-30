import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const banks = [
  { id: 'SBIN.NS', name: 'State Bank of India', code: 'SBI' },
  { id: 'AXISBANK.NS', name: 'Axis Bank', code: 'AXIS' },
  { id: 'HDFCBANK.NS', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'KOTAKBANK.NS', name: 'Kotak Bank', code: 'KOTAK' },
  { id: 'ICICIBANK.NS', name: 'ICICI Bank', code: 'ICICI' },
];

interface BankSelectorProps {
  onBankChange: (bankId: string) => void;
  selectedBank: string;
}

const BankSelector = ({ onBankChange, selectedBank }: BankSelectorProps) => {
  return (
    <div className="w-full max-w-xs">
      <Select value={selectedBank} onValueChange={onBankChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a bank" />
        </SelectTrigger>
        <SelectContent>
          {banks.map((bank) => (
            <SelectItem key={bank.id} value={bank.id}>
              {bank.name} ({bank.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BankSelector;