
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, Lock, User, School, TrendingUp, Building, Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const userTypes = [
  { id: 'student', label: 'Student', icon: School, description: 'Access student-focused banking products and educational resources' },
  { id: 'investor', label: 'Investor', icon: TrendingUp, description: 'Track investments and access advanced market analysis tools' },
  { id: 'loan_seeker', label: 'Seeking a Loan', icon: Building, description: 'Find loan options and financial planning tools' },
  { id: 'bank_employee', label: 'Bank Employee', icon: Briefcase, description: 'Access employee tools and internal dashboards' },
];

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const handleUserTypeSelection = async (userType: string) => {
    if (!selectedUserId) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { user_type: userType }
      });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: `Your profile has been set up as a ${userType.replace('_', ' ')}.`,
      });

      setShowUserTypeModal(false);
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // First create the user with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Then send a one-time password to the email for verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (otpError) throw otpError;

      setShowOTPInput(true);
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code. Enter it below to complete your signup.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (error) throw error;

      if (data.user) {
        setSelectedUserId(data.user.id);
        setShowUserTypeModal(true);
        setShowOTPInput(false);
        toast({
          title: "Email Verified!",
          description: "Your email has been verified. Now please select your user type.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-200 rounded-full filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-8 -right-4 w-28 h-28 bg-blue-200 rounded-full filter blur-xl opacity-70"></div>
        
        <Card className="w-full backdrop-blur-sm bg-white/90 border border-gray-100 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-transparent bg-clip-text">Welcome</CardTitle>
            <CardDescription className="text-gray-500">
              Sign in or sign up to access your banking dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                {!showOTPInput ? (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Send Verification Code
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <Label>Enter verification code sent to {email}</Label>
                    <InputOTP
                      value={otp}
                      onChange={(value: string) => setOTP(value)}
                      maxLength={6}
                      render={({ slots }) => (
                        <InputOTPGroup className="gap-2">
                          {slots.map((slot, idx) => (
                            <InputOTPSlot key={idx} {...slot} index={idx} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                    <Button 
                      type="button"
                      onClick={handleOTPVerification}
                      className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Verify Code
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showUserTypeModal} onOpenChange={setShowUserTypeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>What best describes you?</DialogTitle>
            <DialogDescription>
              Select your user type to personalize your banking experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            {userTypes.map(type => (
              <Button
                key={type.id}
                variant="outline"
                className="flex justify-start items-center gap-3 h-auto p-4 hover:bg-slate-50"
                onClick={() => handleUserTypeSelection(type.id)}
                disabled={loading}
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <type.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
