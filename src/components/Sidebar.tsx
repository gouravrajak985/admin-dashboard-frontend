import React, { useState } from 'react';
import { ChevronDown, Home, ShoppingBag, Package, Users, LogOut, Tag, BarChart, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutDialog from './LogoutDialog';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItemProps { 
  icon: React.ElementType;
  label: string;
  subItems?: string[];
  isActive?: boolean;
  path?: string;
  subItemPaths?: string[];
  isOpen?: boolean;
  onToggle?: (id: string) => void;
  id: string;
}

const MenuItem = ({ 
  icon: Icon, 
  label, 
  subItems = [], 
  isActive = false,
  path,
  subItemPaths = [],
  isOpen,
  onToggle,
  id
}: MenuItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded } = useSidebar();

  const handleClick = () => {
    if (subItems.length > 0) {
      onToggle?.(id);
    } else if (path) {
      navigate(path);
    }
  };

  const isSubItemActive = (path: string) => location.pathname === path;

  return (
    <div>
      <Button
        onClick={handleClick}
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start text-left",
          isActive && "border-l-2 border-primary rounded-none",
          !isExpanded && "px-2"
        )}
      >
        <Icon className={cn("h-5 w-5", isExpanded ? "mr-3" : "mr-0")} />
        {isExpanded && <span className="flex-1 text-left transition-opacity duration-200">{label}</span>}
        {isExpanded && subItems.length > 0 && (
          <ChevronDown className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </Button>
      {isExpanded && isOpen && subItems.length > 0 && (
        <div className="ml-8 border-l border-border">
          {subItems.map((item, index) => (
            <Button
              key={item}
              onClick={() => navigate(subItemPaths[index])}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left pl-4 py-2 text-sm",
                isSubItemActive(subItemPaths[index]) && "bg-secondary"
              )}
            >
              {item}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { isExpanded, toggleSidebar, openSidebar, closeSidebar, sidebarRef } = useSidebar();
  const { theme } = useTheme();
  
  // Automatically open the Reports menu if we're on a reports page
  React.useEffect(() => {
    if (location.pathname.startsWith('/reports')) {
      setOpenMenuId('reports');
    }
  }, [location.pathname]);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    setIsLogoutDialogOpen(false);
  };

  return (
    <>
      <aside 
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 h-screen border-r border-border bg-background transition-all duration-300 ease-in-out z-20 group",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={openSidebar}
        onMouseLeave={closeSidebar}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-border justify-between">
          {isExpanded ? (
            <h1 className="text-xl font-bold truncate">Avirrav Ecommerce</h1>
          ) : (
            <span className="mx-auto">
              <Package className="h-6 w-6 text-primary" />
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-2">
            <MenuItem 
              icon={Home} 
              label="Home" 
              isActive={location.pathname === '/home'}
              path="/home"
              id="home"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'home'}
            />
            <MenuItem 
              icon={Package} 
              label="Catalog" 
              subItems={['Manage Products', 'New Product']}
              subItemPaths={['/catalog/manage-products', '/catalog/new-product']}
              isActive={location.pathname.startsWith('/catalog')}
              id="catalog"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'catalog'}
            />
            <MenuItem 
              icon={ShoppingBag} 
              label="Orders" 
              subItems={['Manage Orders', 'Add Order']}
              subItemPaths={['/orders/manage-orders', '/orders/new-order']}
              isActive={location.pathname.startsWith('/orders')}
              id="orders"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'orders'}
            />
            <MenuItem 
              icon={Users} 
              label="Customers" 
              subItems={['Manage Customers', 'Add Customer']}
              subItemPaths={['/customers/manage-customers', '/customers/new-customer']}
              isActive={location.pathname.startsWith('/customers')}
              id="customers"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'customers'}
            />
            <MenuItem 
              icon={Tag} 
              label="Discounts" 
              subItems={['Manage Discounts', 'Create Discount']}
              subItemPaths={['/discounts/manage', '/discounts/create']}
              isActive={location.pathname.startsWith('/discounts')}
              id="discounts"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'discounts'}
            />
            <MenuItem 
              icon={BarChart} 
              label="Reports & Analytics" 
              subItems={['Sales Reports', 'Customer Growth', 'Payment Reports']}
              subItemPaths={[
                '/reports/sales', 
                '/reports/customer-growth', 
                '/reports/payments'
              ]}
              isActive={location.pathname.startsWith('/reports')}
              id="reports"
              onToggle={handleMenuToggle}
              isOpen={openMenuId === 'reports'}
            />
          </nav>

          {/* Logout Button */}
          <div className={cn("p-4 border-t border-border", !isExpanded && "px-2")}>
            <Button
              onClick={() => setIsLogoutDialogOpen(true)}
              variant="outline"
              className={cn("w-full flex items-center", !isExpanded && "justify-center px-0")}
            >
              <LogOut className={cn("h-5 w-5", isExpanded && "mr-3")} />
              {isExpanded && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;