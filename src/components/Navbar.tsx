import React, { useState } from 'react';
import { Search, Sun, Moon, MessageCircle, Bell, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isExpanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };

  return (
    <nav className={cn(
      "fixed top-0 right-0 h-16 bg-background border-b border-border px-4 flex items-center justify-between z-10 transition-all duration-300",
      isExpanded ? "left-64" : "left-16"
    )}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 p-2 rounded-md">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;