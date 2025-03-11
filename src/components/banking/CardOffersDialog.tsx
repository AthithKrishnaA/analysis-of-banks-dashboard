
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CardOffersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBank: string;
}

const bankCards = {
  'SBIN.NS': [
    { name: 'SBI SimplySAVE Credit Card', fee: '499', cashback: '1%', url: 'https://www.onlinesbi.sbi/personal-banking/cards/credit-card/simplysave-sbi-card' },
    { name: 'SBI SimplyCLICK Credit Card', fee: '999', cashback: '5% on online spends', url: 'https://www.onlinesbi.sbi/personal-banking/cards/credit-card/simplyclick-sbi-card' },
    { name: 'SBI Prime Credit Card', fee: '2,999', cashback: '2% on all spends', url: 'https://www.onlinesbi.sbi/personal-banking/cards/credit-card/prime-sbi-card' },
  ],
  'AXISBANK.NS': [
    { name: 'Axis Bank Ace Credit Card', fee: 'Zero', cashback: '5% on bill payments', url: 'https://www.axisbank.com/retail/cards/credit-card/axis-ace-credit-card' },
    { name: 'Axis Bank Flipkart Credit Card', fee: '500', cashback: '5% on Flipkart', url: 'https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card' },
    { name: 'Axis Bank My Zone Credit Card', fee: '499', cashback: '2% on dining & entertainment', url: 'https://www.axisbank.com/retail/cards/credit-card/my-zone-credit-card' },
  ],
  'HDFCBANK.NS': [
    { name: 'HDFC Millenia Credit Card', fee: '1,000', cashback: '5% on Amazon, Flipkart', url: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card' },
    { name: 'HDFC Diners Club Black Credit Card', fee: '10,000', cashback: '10x rewards on partner brands', url: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-club-black' },
    { name: 'HDFC Regalia Credit Card', fee: '2,500', cashback: '4x rewards on dining & shopping', url: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-credit-card' },
  ],
  'KOTAKBANK.NS': [
    { name: 'Kotak Urbane Credit Card', fee: '700', cashback: '2x rewards on dining', url: 'https://www.kotak.com/en/personal-banking/cards/credit-cards/kotak-urbane-credit-card.html' },
    { name: 'Kotak 811 Dream Different Credit Card', fee: 'Zero', cashback: '1% cashback', url: 'https://www.kotak.com/en/personal-banking/cards/credit-cards/811-dream-different-credit-card.html' },
    { name: 'Kotak Royale Signature Credit Card', fee: '2,499', cashback: '4x rewards on travel', url: 'https://www.kotak.com/en/personal-banking/cards/credit-cards/kotak-royale-signature-credit-card.html' },
  ],
  'ICICIBANK.NS': [
    { name: 'ICICI Coral Credit Card', fee: '500', cashback: '2 reward points per ₹100', url: 'https://www.icicibank.com/card/credit-card/coral-credit-card' },
    { name: 'ICICI Amazon Pay Credit Card', fee: '500', cashback: '5% on Amazon', url: 'https://www.icicibank.com/card/credit-card/amazon-pay-credit-card' },
    { name: 'ICICI Platinum Chip Credit Card', fee: '199', cashback: '2 reward points per ₹100', url: 'https://www.icicibank.com/card/credit-card/platinum-chip-credit-card' },
  ],
};

const CardOffersDialog: React.FC<CardOffersDialogProps> = ({ 
  open, 
  onOpenChange,
  selectedBank 
}) => {
  const { toast } = useToast();
  const cards = bankCards[selectedBank as keyof typeof bankCards] || bankCards['SBIN.NS'];
  
  const handleVisitWebsite = (card: any) => {
    window.open(card.url, '_blank');
    toast({
      title: "Redirecting to bank website",
      description: `You're being redirected to apply for ${card.name}`,
      duration: 3000
    });
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            Credit Card Offers - {getBankName(selectedBank)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg text-blue-800">{card.name}</h3>
              
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Annual Fee:</span> ₹{card.fee}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Cashback/Rewards:</span> {card.cashback}
                </div>
              </div>
              
              <Button 
                onClick={() => handleVisitWebsite(card)} 
                className="mt-4 w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                Apply Now <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="text-xs text-gray-500 mt-2">
            *Card offers are subject to eligibility and bank terms. Visit the bank website for complete details.
          </div>
        </div>
        
        <DialogClose asChild>
          <Button variant="outline" className="mt-2">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CardOffersDialog;
