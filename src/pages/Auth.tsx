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

const userTypes = [
  { id: 'student', label: 'Student', icon: School, description: 'Access student-focused banking products and educational resources' },
  { id: 'investor', label: 'Investor', icon: TrendingUp, description: 'Track investments and access advanced market analysis tools' },
  { id: 'loan_seeker', label: 'Seeking a Loan', icon: Building, description: 'Find loan options and financial planning tools' },
  { id: 'bank_employee', label: 'Bank Employee', icon: Briefcase, description: 'Access employee tools and internal dashboards' },
];

const blueTextClass = "text-blue-500";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [hasRequestedVerification, setHasRequestedVerification] = useState(false);
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

      setHasRequestedVerification(true);

      toast({
        title: "Verify Your Email",
        description: "Check your registered mail id for verification.",
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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url("/lovable-uploads/2be88b4a-36cd-4f33-97bf-b79268f74224.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {hasRequestedVerification ? (
        <Card className="w-[400px] bg-black text-white border-gray-800 bg-opacity-90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-white">Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 pb-6">
            <div className="text-center space-y-2">
              <p className="text-base text-gray-400">
                We've sent a verification link to your email:
              </p>
              <p className="text-lg text-white font-medium">{email}</p>
              <p className="text-base text-gray-400">
                Please check your registered mail id for verification and follow the instructions in your inbox.
              </p>
            </div>
            <Button className="w-full mt-4" onClick={() => setHasRequestedVerification(false)}>
              Back to Sign Up
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-md relative bg-black bg-opacity-60 rounded-lg backdrop-blur-md p-6">
          <Card className="w-full bg-transparent border-0 shadow-none">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-transparent bg-clip-text">Welcome</CardTitle>
              <CardDescription className="text-gray-300">
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
                      <Label htmlFor="email" className={blueTextClass}>Email</Label>
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
                      <Label htmlFor="password" className={blueTextClass}>Password</Label>
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
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className={blueTextClass}>Full Name</Label>
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
                      <Label htmlFor="signup-email" className={blueTextClass}>Email</Label>
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
                      <Label htmlFor="signup-password" className={blueTextClass}>Password</Label>
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
                      <Label htmlFor="confirm-password" className={blueTextClass}>Confirm Password</Label>
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
                      Sign Up
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

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
