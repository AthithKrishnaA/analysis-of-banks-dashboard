
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const SignOutButton = () => {
  return (
    <div className="fixed bottom-4 right-4">
      <Link to="/sign-out">
        <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/70">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </Link>
    </div>
  );
};

export default SignOutButton;
