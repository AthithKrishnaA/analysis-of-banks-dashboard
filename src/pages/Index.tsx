import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { LogOut } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Link } from "react-router-dom";

const Index = () => {
  const { signOut } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-transparent bg-clip-text">
            Banking Dashboard
          </h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-violet-500 to-blue-500 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Banking Dashboard
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Your complete banking solution with advanced analytics and financial tools.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/predictive-analysis"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Predictive Analysis
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            AI-powered market predictions and financial forecasting
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>

        <Menubar className="border-none bg-transparent p-0">
          <MenubarMenu>
            <MenubarTrigger className="font-bold">Quick Actions</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Transaction <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>View Statement</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Settings</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
            <p className="text-gray-500">View your account details and recent transactions</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Financial Insights</h2>
            <p className="text-gray-500">AI-powered analysis of your spending patterns</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Investment Portfolio</h2>
            <p className="text-gray-500">Track your investments and market performance</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium">Complete Your Profile</h3>
              <p className="text-sm text-gray-500">Add missing information to unlock more features</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium">Explore Investment Options</h3>
              <p className="text-sm text-gray-500">Discover new ways to grow your wealth</p>
            </div>
          </div>
        </div>
        
        {/* Sign Out Section */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t">
          <div className="max-w-7xl mx-auto flex justify-end">
            <Button 
              variant="destructive" 
              onClick={signOut} 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
