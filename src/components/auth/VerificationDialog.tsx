
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface VerificationDialogProps {
  email: string;
  otp: string;
  setOTP: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  loading: boolean;
}

const VerificationDialog = ({
  email,
  otp,
  setOTP,
  onVerify,
  onResend,
  onBack,
  loading
}: VerificationDialogProps) => {
  return (
    <Card className="w-[400px] bg-black text-white border-gray-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl text-white">Verification Required</CardTitle>
        <CardDescription className="text-gray-400">
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">We've sent a verification code to</p>
          <p className="text-sm text-white font-medium">{email}</p>
          <p className="text-xs text-gray-400">Enter the code to verify your account</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Verification Code</label>
            <InputOTP
              value={otp}
              onChange={setOTP}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2 justify-center">
                  {slots.map((slot, idx) => (
                    <InputOTPSlot 
                      key={idx} 
                      {...slot} 
                      index={idx}
                      className="w-12 h-12 text-lg bg-transparent border-gray-700 text-white"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>

          <Button
            onClick={onVerify}
            disabled={loading || otp.length !== 6}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            Verify Email
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{' '}
              <button
                onClick={onResend}
                className="text-blue-500 hover:text-blue-400 underline"
                disabled={loading}
              >
                Resend
              </button>
            </p>
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-300 text-sm"
              disabled={loading}
            >
              Back to Sign Up
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationDialog;
