
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
import { Bell, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PriceAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBank: string;
}

const PriceAlertDialog: React.FC<PriceAlertDialogProps> = ({ 
  open, 
  onOpenChange,
  selectedBank 
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('above');
  const [pricePoint, setPricePoint] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !pricePoint) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
    
    toast({
      title: "Price Alert Set Successfully!",
      description: `You will be notified at ${email} when ${getBankName(selectedBank)} stock price goes ${alertType} ₹${pricePoint}`,
      duration: 5000,
    });
  };

  const handleReset = () => {
    setEmail('');
    setAlertType('above');
    setPricePoint('');
    setIsSubmitted(false);
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-500" />
            Set Price Alert - {getBankName(selectedBank)}
          </DialogTitle>
        </DialogHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <p className="text-xs text-gray-500">
                You'll receive an email notification when the price reaches your target
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="alertType">Alert Type</Label>
                <Select value={alertType} onValueChange={setAlertType}>
                  <SelectTrigger id="alertType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price Above</SelectItem>
                    <SelectItem value="below">Price Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="pricePoint">Price Point (₹)</Label>
                <Input
                  id="pricePoint"
                  type="number"
                  value={pricePoint}
                  onChange={(e) => setPricePoint(e.target.value)}
                  placeholder="Enter price"
                  min="1"
                  step="0.05"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="mt-2">Set Alert</Button>
            
            <p className="text-xs text-gray-500 mt-2">
              You will receive an email notification when the stock price reaches your target. 
              You can set multiple alerts for different price points.
            </p>
          </form>
        ) : (
          <div className="py-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Alert Successfully Set!</h3>
            <p className="text-gray-600 mb-6">
              We'll notify you at <span className="font-semibold">{email}</span> when {getBankName(selectedBank)} stock price goes {alertType} ₹{pricePoint}
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={handleReset} variant="outline">Set Another Alert</Button>
              <p className="text-xs text-gray-500">
                Please check your email spam folder if you don't receive notifications
              </p>
            </div>
          </div>
        )}
        
        <DialogClose asChild>
          <Button variant="outline" className="mt-2">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAlertDialog;
