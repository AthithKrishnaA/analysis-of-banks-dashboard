
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, ShieldCheck, Zap, Globe, BadgePercent, ExternalLink } from 'lucide-react';

interface CreditCardOptionsProps {
  selectedBank: string;
  onClose: () => void;
}

interface CreditCardType {
  id: string;
  name: string;
  description: string;
  averageInterestRate: string;
  annualFee: string;
  benefits: string[];
  type: 'standard' | 'premium' | 'rewards' | 'business';
}

const CreditCardOptions = ({ selectedBank, onClose }: CreditCardOptionsProps) => {
  const { toast } = useToast();
  
  // Bank official website URLs
  const bankWebsites: Record<string, string> = {
    'SBIN.NS': 'https://www.onlinesbi.com',
    'AXISBANK.NS': 'https://www.axisbank.com',
    'HDFCBANK.NS': 'https://www.hdfcbank.com',
    'KOTAKBANK.NS': 'https://www.kotak.com',
    'ICICIBANK.NS': 'https://www.icicibank.com'
  };

  // Bank-specific credit card options
  const bankCreditCards: Record<string, CreditCardType[]> = {
    'SBIN.NS': [
      {
        id: 'sbi-1',
        name: 'SBI SimplySAVE Card',
        description: 'Perfect for everyday spending with cashback on utility bills',
        averageInterestRate: '3.5% per month',
        annualFee: '₹499 (waived on annual spend of ₹1,00,000)',
        benefits: ['5% cashback on utilities', '1% on all other spends', 'Fuel surcharge waiver'],
        type: 'standard'
      },
      {
        id: 'sbi-2',
        name: 'SBI PRIME Card',
        description: 'Premium card with higher credit limits and exclusive rewards',
        averageInterestRate: '3.35% per month',
        annualFee: '₹2,999 (waived on annual spend of ₹3,00,000)',
        benefits: ['Airport lounge access', 'Milestone rewards', '2x reward points on travel'],
        type: 'premium'
      },
      {
        id: 'sbi-3',
        name: 'SBI Business Advantage',
        description: 'Designed for business expenses with GST benefits',
        averageInterestRate: '3.1% per month',
        annualFee: '₹1,999',
        benefits: ['GST input benefits', 'Travel insurance', 'Expense categorization'],
        type: 'business'
      }
    ],
    'AXISBANK.NS': [
      {
        id: 'axis-1',
        name: 'Axis Neo Card',
        description: 'Digital-first lifestyle card with online shopping benefits',
        averageInterestRate: '3.4% per month',
        annualFee: '₹250 (waived on annual spend of ₹50,000)',
        benefits: ['2% cashback on online shopping', 'Movie ticket discounts', 'Welcome vouchers'],
        type: 'standard'
      },
      {
        id: 'axis-2',
        name: 'Axis Privilege Card',
        description: 'Lifestyle card with premium dining and travel benefits',
        averageInterestRate: '3.25% per month',
        annualFee: '₹3,500 (waived on annual spend of ₹3,50,000)',
        benefits: ['Complimentary lounge access', '4 reward points per ₹200', 'Golf privileges'],
        type: 'premium'
      }
    ],
    'HDFCBANK.NS': [
      {
        id: 'hdfc-1',
        name: 'HDFC Moneyback Card',
        description: 'Everyday cashback card for all purchases',
        averageInterestRate: '3.5% per month',
        annualFee: '₹500 (waived on annual spend of ₹1,50,000)',
        benefits: ['1.5% cashback on all spends', 'Fuel surcharge waiver', '10x rewards at partner merchants'],
        type: 'standard'
      },
      {
        id: 'hdfc-2',
        name: 'HDFC Regalia Gold',
        description: 'Premium travel and lifestyle card with superior rewards',
        averageInterestRate: '3.3% per month',
        annualFee: '₹2,500 (waived on annual spend of ₹3,00,000)',
        benefits: ['Unlimited airport lounge access', 'Higher reward points', 'Premium concierge services'],
        type: 'premium'
      },
      {
        id: 'hdfc-3',
        name: 'HDFC Business Regalia',
        description: 'Premium business card with travel and expense management benefits',
        averageInterestRate: '3.2% per month',
        annualFee: '₹2,500',
        benefits: ['Complimentary airport transfers', 'Expense management tools', 'Insurance coverage'],
        type: 'business'
      }
    ],
    'KOTAKBANK.NS': [
      {
        id: 'kotak-1',
        name: 'Kotak Essentia Platinum',
        description: 'Essential rewards card for everyday spending',
        averageInterestRate: '3.5% per month',
        annualFee: '₹700 (waived on annual spend of ₹1,00,000)',
        benefits: ['2 reward points per ₹100', 'Dining discounts', '1% fuel surcharge waiver'],
        type: 'standard'
      },
      {
        id: 'kotak-2',
        name: 'Kotak Royale Signature',
        description: 'Premium lifestyle card with enhanced rewards',
        averageInterestRate: '3.4% per month',
        annualFee: '₹2,499 (waived on annual spend of ₹2,50,000)',
        benefits: ['Airport lounge access', '5X rewards on weekend dining', 'Movie ticket offers'],
        type: 'premium'
      }
    ],
    'ICICIBANK.NS': [
      {
        id: 'icici-1',
        name: 'ICICI Platinum Chip',
        description: 'Everyday card with essential benefits and rewards',
        averageInterestRate: '3.5% per month',
        annualFee: '₹500 (waived on annual spend of ₹1,25,000)',
        benefits: ['2 reward points per ₹100', 'Fuel surcharge waiver', 'EMI conversion facility'],
        type: 'standard'
      },
      {
        id: 'icici-2',
        name: 'ICICI Sapphiro',
        description: 'Premium lifestyle card with travel and dining benefits',
        averageInterestRate: '3.3% per month',
        annualFee: '₹3,500 (waived on annual spend of ₹4,00,000)',
        benefits: ['Airport lounge access', 'Golf program', 'Higher reward points on travel'],
        type: 'premium'
      },
      {
        id: 'icici-3',
        name: 'ICICI Business Advantage',
        description: 'Business card with specialized expense management features',
        averageInterestRate: '3.2% per month',
        annualFee: '₹1,500',
        benefits: ['GST benefits', 'Expense categorization', 'Higher credit limits'],
        type: 'business'
      }
    ]
  };

  const availableCreditCards = bankCreditCards[selectedBank] || [];

  const handleApply = (cardId: string) => {
    const card = availableCreditCards.find(card => card.id === cardId);
    if (card) {
      const bankWebsite = bankWebsites[selectedBank] || '#';
      
      toast({
        title: "Application Initiated",
        description: (
          <div className="flex flex-col gap-2">
            <span>Your application for {card.name} is ready to proceed.</span>
            <a 
              href={bankWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              Visit {selectedBank.replace('.NS', '')} official website <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
        duration: 8000,
      });
      onClose();
    }
  };

  const getIconForCardType = (type: string) => {
    switch (type) {
      case 'premium':
        return <ShieldCheck className="h-5 w-5 text-purple-500" />;
      case 'rewards':
        return <BadgePercent className="h-5 w-5 text-amber-500" />;
      case 'business':
        return <Globe className="h-5 w-5 text-blue-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto p-6 w-full max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Credit Card Options for {selectedBank.replace('.NS', '')}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {availableCreditCards.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No credit card options available for this bank.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableCreditCards.map((card) => (
            <Card key={card.id} className="overflow-hidden border-2 hover:border-blue-200 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getIconForCardType(card.type)}
                    <CardTitle className="text-xl">{card.name}</CardTitle>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {card.type === 'premium' ? 'Premium' : 
                     card.type === 'business' ? 'Business' : 
                     card.type === 'rewards' ? 'Rewards' : 'Standard'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Interest Rate</span>
                    <span className="text-sm font-semibold text-red-600">{card.averageInterestRate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Annual Fee</span>
                    <span className="text-sm font-semibold">{card.annualFee}</span>
                  </div>
                  <div className="py-2">
                    <p className="text-sm font-medium text-gray-500 mb-2">Key Benefits</p>
                    <ul className="space-y-1">
                      {card.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <Zap className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleApply(card.id)} 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 flex items-center justify-center gap-2"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreditCardOptions;
