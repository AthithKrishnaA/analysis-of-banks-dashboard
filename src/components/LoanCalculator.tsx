
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, IndianRupee, Calendar, Percent, ArrowRight, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LoanCalculatorProps {
  selectedBank: string;
  onClose: () => void;
}

// Bank-specific loan parameters
const bankLoanParams: Record<string, {
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  baseRate: number;
  processingFeePercent: number;
  loanTypes: string[];
}> = {
  'SBIN.NS': {
    minAmount: 100000,
    maxAmount: 5000000,
    minTerm: 1,
    maxTerm: 30,
    baseRate: 8.5,
    processingFeePercent: 0.5,
    loanTypes: ['Home Loan', 'Personal Loan', 'Education Loan', 'Car Loan', 'Business Loan']
  },
  'AXISBANK.NS': {
    minAmount: 200000,
    maxAmount: 7000000,
    minTerm: 1,
    maxTerm: 25,
    baseRate: 8.75,
    processingFeePercent: 0.65,
    loanTypes: ['Home Loan', 'Personal Loan', 'Car Loan', 'Gold Loan']
  },
  'HDFCBANK.NS': {
    minAmount: 300000,
    maxAmount: 10000000,
    minTerm: 1,
    maxTerm: 30,
    baseRate: 8.35,
    processingFeePercent: 0.6,
    loanTypes: ['Home Loan', 'Personal Loan', 'Business Loan', 'Education Loan', 'Car Loan']
  },
  'KOTAKBANK.NS': {
    minAmount: 200000,
    maxAmount: 8000000,
    minTerm: 1,
    maxTerm: 25,
    baseRate: 8.7,
    processingFeePercent: 0.55,
    loanTypes: ['Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan']
  },
  'ICICIBANK.NS': {
    minAmount: 250000,
    maxAmount: 9000000,
    minTerm: 1,
    maxTerm: 30,
    baseRate: 8.6,
    processingFeePercent: 0.6,
    loanTypes: ['Home Loan', 'Personal Loan', 'Car Loan', 'Education Loan', 'Gold Loan']
  }
};

// Map bank IDs to their display names
const bankNames: Record<string, string> = {
  'SBIN.NS': 'State Bank of India',
  'AXISBANK.NS': 'Axis Bank',
  'HDFCBANK.NS': 'HDFC Bank',
  'KOTAKBANK.NS': 'Kotak Mahindra Bank',
  'ICICIBANK.NS': 'ICICI Bank'
};

const LoanCalculator = ({ selectedBank, onClose }: LoanCalculatorProps) => {
  const { toast } = useToast();
  const bankParams = bankLoanParams[selectedBank];
  const bankName = bankNames[selectedBank];
  
  const [loanType, setLoanType] = useState(bankParams.loanTypes[0]);
  const [loanAmount, setLoanAmount] = useState(bankParams.minAmount);
  const [loanTerm, setLoanTerm] = useState(10); // Default 10 years
  const [interestRate, setInterestRate] = useState(bankParams.baseRate);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [processingFee, setProcessingFee] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<{
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[]>([]);
  const [showAmortization, setShowAmortization] = useState(false);
  
  // Calculate loan on parameter changes
  useEffect(() => {
    // Adjust interest rate based on loan type
    let rateAdjustment = 0;
    switch(loanType) {
      case 'Home Loan':
        rateAdjustment = -0.5; // Lower rates for home loans
        break;
      case 'Personal Loan':
        rateAdjustment = 1.5; // Higher rates for personal loans
        break;
      case 'Business Loan':
        rateAdjustment = 0.75;
        break;
      case 'Education Loan':
        rateAdjustment = -0.25;
        break;
      case 'Car Loan':
        rateAdjustment = 0.5;
        break;
      case 'Gold Loan':
        rateAdjustment = 0.25;
        break;
    }
    
    // Further adjust based on loan term
    const termAdjustment = loanTerm > 15 ? 0.25 : 0;
    
    // Set the final interest rate
    const adjustedRate = bankParams.baseRate + rateAdjustment + termAdjustment;
    setInterestRate(parseFloat(adjustedRate.toFixed(2)));
    
    // Calculate EMI
    const principal = loanAmount;
    const ratePerMonth = adjustedRate / (12 * 100);
    const termInMonths = loanTerm * 12;
    
    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emiValue = principal * ratePerMonth * Math.pow(1 + ratePerMonth, termInMonths) / 
                    (Math.pow(1 + ratePerMonth, termInMonths) - 1);
    
    setEmi(isNaN(emiValue) ? 0 : emiValue);
    
    // Calculate total payment and interest
    const totalPaymentValue = emiValue * termInMonths;
    setTotalPayment(isNaN(totalPaymentValue) ? 0 : totalPaymentValue);
    setTotalInterest(isNaN(totalPaymentValue - principal) ? 0 : totalPaymentValue - principal);
    
    // Calculate processing fee
    setProcessingFee(principal * (bankParams.processingFeePercent / 100));
    
    // Generate amortization schedule
    const schedule = [];
    let balance = principal;
    for (let i = 1; i <= Math.min(termInMonths, 12); i++) { // Show first year only
      const interestPayment = balance * ratePerMonth;
      const principalPayment = emiValue - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        payment: i,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance < 0 ? 0 : balance
      });
    }
    
    setAmortizationSchedule(schedule);
  }, [loanAmount, loanTerm, loanType, selectedBank, bankParams]);
  
  const handleLoanAmountChange = (value: number[]) => {
    setLoanAmount(value[0]);
  };
  
  const handleLoanTermChange = (value: number[]) => {
    setLoanTerm(value[0]);
  };
  
  const handleApplyNow = () => {
    toast({
      title: "Loan Application Initiated",
      description: `Your ${loanType.toLowerCase()} application for ₹${loanAmount.toLocaleString()} has been submitted to ${bankName}. A representative will contact you shortly.`,
      duration: 5000,
    });
    onClose();
  };
  
  return (
    <Card className="w-full md:max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-6 w-6" />
            <span>{bankName} Loan Calculator</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-600">
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="loan-type" className="font-medium">Loan Type</Label>
            <Select value={loanType} onValueChange={setLoanType}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                {bankParams.loanTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="loan-amount" className="font-medium">Loan Amount</Label>
              <div className="flex items-center space-x-1 text-blue-700">
                <IndianRupee className="h-4 w-4" />
                <span className="font-semibold">{loanAmount.toLocaleString()}</span>
              </div>
            </div>
            <Slider
              id="loan-amount"
              value={[loanAmount]}
              min={bankParams.minAmount}
              max={bankParams.maxAmount}
              step={10000}
              onValueChange={handleLoanAmountChange}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹{bankParams.minAmount.toLocaleString()}</span>
              <span>₹{bankParams.maxAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="loan-term" className="font-medium">Loan Term (Years)</Label>
              <div className="flex items-center space-x-1 text-blue-700">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">{loanTerm} years</span>
              </div>
            </div>
            <Slider
              id="loan-term"
              value={[loanTerm]}
              min={bankParams.minTerm}
              max={bankParams.maxTerm}
              step={1}
              onValueChange={handleLoanTermChange}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{bankParams.minTerm} Year</span>
              <span>{bankParams.maxTerm} Years</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="h-5 w-5 text-blue-700" />
                <span className="font-medium">Interest Rate</span>
              </div>
              <span className="text-lg font-bold text-blue-700">{interestRate}%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Rate adjusted based on loan type, term, and {bankName} policies.
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Monthly EMI</div>
            <div className="text-xl font-bold">₹{Math.round(emi).toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Interest</div>
            <div className="text-xl font-bold">₹{Math.round(totalInterest).toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Payment</div>
            <div className="text-xl font-bold">₹{Math.round(totalPayment).toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-lg">
          <Info className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="text-sm">
            Processing Fee: <span className="font-semibold">₹{Math.round(processingFee).toLocaleString()}</span> 
            ({bankParams.processingFeePercent}% of loan amount)
          </div>
        </div>
        
        <Button 
          variant="link"
          className="text-blue-600 p-0"
          onClick={() => setShowAmortization(!showAmortization)}
        >
          {showAmortization ? "Hide" : "Show"} Amortization Schedule
        </Button>
        
        {showAmortization && (
          <div className="mt-2 border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Payment</th>
                  <th className="px-4 py-2 text-right">Principal</th>
                  <th className="px-4 py-2 text-right">Interest</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((row) => (
                  <tr key={row.payment} className="border-t">
                    <td className="px-4 py-2 text-left">{row.payment}</td>
                    <td className="px-4 py-2 text-right">₹{Math.round(row.principal).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₹{Math.round(row.interest).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₹{Math.round(row.balance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 text-xs text-gray-500 border-t">
              * Showing first 12 payments of {loanTerm * 12} total payments
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-6 rounded-b-lg">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleApplyNow}
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanCalculator;
