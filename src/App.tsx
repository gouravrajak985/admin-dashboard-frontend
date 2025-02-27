import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
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
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/catalog/manage-products" element={<ManageProducts />} />
            <Route path="/catalog/new-product" element={<NewProduct />} />
            <Route path="/orders/manage-orders" element={<ManageOrders />} />
            <Route path="/orders/new-order" element={<NewOrder />} />
            <Route path="/customers/new-customer" element={<NewCustomer />} />
            <Route path="/customers/manage-customers" element={<ManageCustomers />} />
            <Route path="/discounts/manage" element={<ManageDiscounts />} />
            <Route path="/discounts/create" element={<CreateDiscount />} />
            <Route path="/reports/sales" element={<SalesReports />} />
            <Route path="/reports/customer-growth" element={<CustomerGrowthReports />} />
            <Route path="/reports/payments" element={<PaymentReports />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;