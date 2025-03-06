
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface RateAlertFormProps {
  selectedBank: string;
  onClose: () => void;
}

const bankTickers: Record<string, string> = {
  'SBIN.NS': 'State Bank of India',
  'AXISBANK.NS': 'Axis Bank',
  'HDFCBANK.NS': 'HDFC Bank',
  'KOTAKBANK.NS': 'Kotak Mahindra Bank',
  'ICICIBANK.NS': 'ICICI Bank'
};

const RateAlertForm = ({ selectedBank, onClose }: RateAlertFormProps) => {
  const { toast } = useToast();
  const [targetPrice, setTargetPrice] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!targetPrice || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter both target price and email address",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (isNaN(Number(targetPrice)) || Number(targetPrice) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid target price",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Simulate setting the alert
    toast({
      title: "Rate Alert Set",
      description: `You'll be notified at ${email} when ${bankTickers[selectedBank]} stock reaches ₹${targetPrice}`,
      duration: 5000,
    });
    
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Set Price Alert
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Get notified when {bankTickers[selectedBank]} stock reaches your target price
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-price">Target Price (₹)</Label>
            <Input
              id="target-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">
              Set Alert
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RateAlertForm;
