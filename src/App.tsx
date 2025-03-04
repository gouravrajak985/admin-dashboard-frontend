import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import ManageProducts from './pages/catalog/ManageProducts';
import NewProduct from './pages/catalog/NewProduct';
import ManageOrders from './pages/orders/ManageOrders';
import NewOrder from './pages/orders/NewOrder';
import NewCustomer from './pages/customers/NewCustomer';
import ManageCustomers from './pages/customers/ManageCustomers';
import Profile from './pages/Profile';
import ManageDiscounts from './pages/discounts/ManageDiscounts';
import CreateDiscount from './pages/discounts/CreateDiscount';
import SalesReports from './pages/reports/SalesReports';
import CustomerGrowthReports from './pages/reports/CustomerGrowthReports';
import PaymentReports from './pages/reports/PaymentReports';
import OTPVerification from './pages/auth/OTPVerification';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ManageProduct from './pages/catalog/ManageProduct';
import ManageCustomer from './pages/customers/ManageCustomer';
import ManageOrder from './pages/orders/ManageOrder';
import ManageDiscount from './pages/discounts/ManageDiscount';

function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setShowMobileWarning(true);
      } else {
        setShowMobileWarning(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <ThemeProvider>
      <SidebarProvider>
        {showMobileWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50">
            <div className="bg-white rounded-lg p-6 max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Mobile Access Restricted</h2>
              <p className="text-gray-600 mb-4">
                Please use a Laptop, Desktop, or tablet to access the seller dashboard. 
                It is not supported on mobile devices yet.
              </p>
            </div>
          </div>
        )}
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/otp-verification" element={<OTPVerification />} />
            
            {/* Dashboard Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<DashboardLayout><Home /></DashboardLayout>} />
            
            {/* Catalog Routes */}
            <Route path="/catalog/manage-products" element={<DashboardLayout><ManageProducts /></DashboardLayout>} />
            <Route path="/catalog/new-product" element={<DashboardLayout><NewProduct /></DashboardLayout>} />
            <Route path="/catalog/manage-product/:id" element={<DashboardLayout><ManageProduct /></DashboardLayout>} />
            
            {/* Order Routes */}
            <Route path="/orders/manage-orders" element={<DashboardLayout><ManageOrders /></DashboardLayout>} />
            <Route path="/orders/new-order" element={<DashboardLayout><NewOrder /></DashboardLayout>} />
            <Route path="/orders/manage-order/:id" element={<DashboardLayout><ManageOrder /></DashboardLayout>} />
            
            {/* Customer Routes */}
            <Route path="/customers/new-customer" element={<DashboardLayout><NewCustomer /></DashboardLayout>} />
            <Route path="/customers/manage-customers" element={<DashboardLayout><ManageCustomers /></DashboardLayout>} />
            <Route path="/customers/manage-customer/:id" element={<DashboardLayout><ManageCustomer /></DashboardLayout>} />
            
            {/* Discount Routes */}
            <Route path="/discounts/manage" element={<DashboardLayout><ManageDiscounts /></DashboardLayout>} />
            <Route path="/discounts/create" element={<DashboardLayout><CreateDiscount /></DashboardLayout>} />
            <Route path="/discounts/manage-discount/:id" element={<DashboardLayout><ManageDiscount /></DashboardLayout>} />
            
            {/* Report Routes */}
            <Route path="/reports/sales" element={<DashboardLayout><SalesReports /></DashboardLayout>} />
            <Route path="/reports/customer-growth" element={<DashboardLayout><CustomerGrowthReports /></DashboardLayout>} />
            <Route path="/reports/payments" element={<DashboardLayout><PaymentReports /></DashboardLayout>} />
            
            {/* Profile Route */}
            <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          </Routes>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;