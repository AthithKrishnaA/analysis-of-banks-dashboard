
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from 'lucide-react';

interface LoanCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBank: string;
}

const bankLoanRates = {
  'SBIN.NS': { home: 8.75, personal: 10.75, car: 9.15, education: 8.35 },
  'AXISBANK.NS': { home: 8.90, personal: 11.25, car: 9.30, education: 8.50 },
  'HDFCBANK.NS': { home: 8.70, personal: 10.50, car: 9.00, education: 8.25 },
  'KOTAKBANK.NS': { home: 8.85, personal: 10.90, car: 9.25, education: 8.45 },
  'ICICIBANK.NS': { home: 8.80, personal: 10.85, car: 9.20, education: 8.40 },
};

const LoanCalculatorDialog: React.FC<LoanCalculatorDialogProps> = ({ 
  open, 
  onOpenChange,
  selectedBank
}) => {
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [loanType, setLoanType] = useState<string>('home');
  const [loanTenure, setLoanTenure] = useState<string>('20');
  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const bankRates = bankLoanRates[selectedBank as keyof typeof bankLoanRates] || bankLoanRates['SBIN.NS'];
  
  const calculateLoan = () => {
    const amount = parseFloat(loanAmount);
    const tenure = parseFloat(loanTenure);
    const ratePerType = loanType as keyof typeof bankRates;
    const annualRate = bankRates[ratePerType];
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenure * 12;
    
    // EMI calculation formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emiValue = (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                    (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalPayment = emiValue * totalMonths;
    const interestPayment = totalPayment - amount;
    
    setEmi(Math.round(emiValue));
    setTotalInterest(Math.round(interestPayment));
    setTotalAmount(Math.round(totalPayment));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getBankName = (code: string) => {
    const bankNames: Record<string, string> = {
      'SBIN.NS': 'State Bank of India',
      'AXISBANK.NS': 'Axis Bank',
      'HDFCBANK.NS': 'HDFC Bank',
      'KOTAKBANK.NS': 'Kotak Mahindra Bank',
      'ICICIBANK.NS': 'ICICI Bank',
    };
    
    return bankNames[code] || code;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-500" />
            Loan Calculator - {getBankName(selectedBank)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="loanType">Loan Type</Label>
            <Select value={loanType} onValueChange={setLoanType}>
              <SelectTrigger id="loanType">
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home Loan ({bankRates.home}%)</SelectItem>
                <SelectItem value="personal">Personal Loan ({bankRates.personal}%)</SelectItem>
                <SelectItem value="car">Car Loan ({bankRates.car}%)</SelectItem>
                <SelectItem value="education">Education Loan ({bankRates.education}%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
            <Input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              min="10000"
              step="10000"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="loanTenure">Loan Tenure (Years)</Label>
            <Input
              id="loanTenure"
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              min="1"
              max="30"
            />
          </div>
          
          <Button onClick={calculateLoan} className="mt-2">Calculate EMI</Button>
          
          {emi !== null && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monthly EMI:</span>
                <span className="font-bold text-lg text-blue-600">{formatCurrency(emi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Interest:</span>
                <span className="text-red-600">{formatCurrency(totalInterest!)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span>{formatCurrency(totalAmount!)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                *Interest rates are subject to change. Please contact the bank for the latest rates.
              </div>
            </div>
          )}
        </div>
        
        <DialogClose asChild>
          <Button variant="outline" className="mt-2">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default LoanCalculatorDialog;
