
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee } from 'lucide-react';

interface FDRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBank: string;
}

const bankFDRates = {
  'SBIN.NS': [
    { tenure: '7-45 days', regular: '3.00', senior: '3.50' },
    { tenure: '46-179 days', regular: '4.50', senior: '5.00' },
    { tenure: '180-364 days', regular: '5.25', senior: '5.75' },
    { tenure: '1-2 years', regular: '5.50', senior: '6.00' },
    { tenure: '2-3 years', regular: '5.75', senior: '6.25' },
    { tenure: '3-5 years', regular: '6.00', senior: '6.50' },
    { tenure: '5-10 years', regular: '6.25', senior: '6.75' },
  ],
  'AXISBANK.NS': [
    { tenure: '7-45 days', regular: '3.25', senior: '3.75' },
    { tenure: '46-179 days', regular: '4.75', senior: '5.25' },
    { tenure: '180-364 days', regular: '5.45', senior: '5.95' },
    { tenure: '1-2 years', regular: '5.75', senior: '6.25' },
    { tenure: '2-3 years', regular: '6.00', senior: '6.50' },
    { tenure: '3-5 years', regular: '6.10', senior: '6.60' },
    { tenure: '5-10 years', regular: '6.35', senior: '6.85' },
  ],
  'HDFCBANK.NS': [
    { tenure: '7-45 days', regular: '3.50', senior: '4.00' },
    { tenure: '46-179 days', regular: '4.85', senior: '5.35' },
    { tenure: '180-364 days', regular: '5.50', senior: '6.00' },
    { tenure: '1-2 years', regular: '5.85', senior: '6.35' },
    { tenure: '2-3 years', regular: '6.10', senior: '6.60' },
    { tenure: '3-5 years', regular: '6.25', senior: '6.75' },
    { tenure: '5-10 years', regular: '6.50', senior: '7.00' },
  ],
  'KOTAKBANK.NS': [
    { tenure: '7-45 days', regular: '3.25', senior: '3.75' },
    { tenure: '46-179 days', regular: '4.65', senior: '5.15' },
    { tenure: '180-364 days', regular: '5.40', senior: '5.90' },
    { tenure: '1-2 years', regular: '5.70', senior: '6.20' },
    { tenure: '2-3 years', regular: '5.90', senior: '6.40' },
    { tenure: '3-5 years', regular: '6.10', senior: '6.60' },
    { tenure: '5-10 years', regular: '6.20', senior: '6.70' },
  ],
  'ICICIBANK.NS': [
    { tenure: '7-45 days', regular: '3.25', senior: '3.75' },
    { tenure: '46-179 days', regular: '4.65', senior: '5.15' },
    { tenure: '180-364 days', regular: '5.35', senior: '5.85' },
    { tenure: '1-2 years', regular: '5.65', senior: '6.15' },
    { tenure: '2-3 years', regular: '5.85', senior: '6.35' },
    { tenure: '3-5 years', regular: '6.10', senior: '6.60' },
    { tenure: '5-10 years', regular: '6.30', senior: '6.80' },
  ],
};

const FDRatesDialog: React.FC<FDRatesDialogProps> = ({ 
  open, 
  onOpenChange,
  selectedBank 
}) => {
  const rates = bankFDRates[selectedBank as keyof typeof bankFDRates] || bankFDRates['SBIN.NS'];
  
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-amber-500" />
            Fixed Deposit Rates - {getBankName(selectedBank)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenure</TableHead>
                <TableHead>Regular Rates (%)</TableHead>
                <TableHead>Senior Citizen Rates (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{rate.tenure}</TableCell>
                  <TableCell>{rate.regular}</TableCell>
                  <TableCell>{rate.senior}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="text-xs text-gray-500 mt-4">
            *Interest rates are subject to change. Please contact the bank for the latest rates.
            <br />
            *The above rates are per annum and applicable on domestic deposits below ₹2 crore.
          </div>
        </div>
        
        <DialogClose asChild>
          <Button variant="outline" className="mt-2">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default FDRatesDialog;
