
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/components/AuthProvider';
import { LogOut, Home } from 'lucide-react';

const SignOut = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 border border-gray-100 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-transparent bg-clip-text">
            Sign Out
          </CardTitle>
          <CardDescription className="text-gray-500">
            Are you sure you want to sign out of your account?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 pt-6">
          <LogOut className="h-16 w-16 text-gray-400" />
          <p className="text-center text-sm text-gray-500">
            You will be redirected to the login page after signing out.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={handleSignOut} 
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
          <Button 
            onClick={handleCancel} 
            variant="outline" 
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignOut;
