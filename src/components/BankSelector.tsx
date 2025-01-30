import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

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
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="h-5 w-5 text-bank-primary" />
        <h2 className="text-lg font-semibold text-bank-primary">Select Bank</h2>
      </div>
      <Select value={selectedBank} onValueChange={onBankChange}>
        <SelectTrigger className="w-full bg-white border-2 border-blue-100 hover:border-blue-200 transition-colors">
          <SelectValue placeholder="Select a bank" />
        </SelectTrigger>
        <SelectContent>
          {banks.map((bank) => (
            <SelectItem 
              key={bank.id} 
              value={bank.id}
              className="hover:bg-blue-50 cursor-pointer py-2"
            >
              {bank.name} ({bank.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BankSelector;