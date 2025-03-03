import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type SidebarContextType = {
  isExpanded: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize sidebar as collapsed by default
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      setIsExpanded(savedState === 'true');
    } else {
      // Default to collapsed
      setIsExpanded(false);
    }
  }, []);

  // Save preference when it changes
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', isExpanded.toString());
  }, [isExpanded]);

  // Handle outside clicks to close the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };

  const closeSidebar = () => {
    setIsExpanded(false);
  };

  const openSidebar = () => {
    setIsExpanded(true);
  };

  return (
    <SidebarContext.Provider value={{ 
      isExpanded, 
      toggleSidebar, 
      closeSidebar, 
      openSidebar,
      sidebarRef
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};