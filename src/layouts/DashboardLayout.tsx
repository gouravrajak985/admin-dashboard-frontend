import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { LayoutDashboard } from 'lucide-react';
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className={cn(
          "flex-1 p-6 mt-16 transition-all duration-300 ease-in-out",
          isExpanded ? "ml-64" : "ml-16"
        )}>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <LayoutDashboard className="h-8 w-8 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;