import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OTPVerification from './pages/auth/OTPVerification';

// Dashboard Pages
import Home from './pages/Home';
import Profile from './pages/Profile';

// Catalog Pages
import ManageProducts from './pages/catalog/ManageProducts';
import NewProduct from './pages/catalog/NewProduct';
import ManageProduct from './pages/catalog/ManageProduct';

// Order Pages
import ManageOrders from './pages/orders/ManageOrders';
import NewOrder from './pages/orders/NewOrder';
import ManageOrder from './pages/orders/ManageOrder';

// Customer Pages
import ManageCustomers from './pages/customers/ManageCustomers';
import NewCustomer from './pages/customers/NewCustomer';
import ManageCustomer from './pages/customers/ManageCustomer';

// Discount Pages
import ManageDiscounts from './pages/discounts/ManageDiscounts';
import CreateDiscount from './pages/discounts/CreateDiscount';
import ManageDiscount from './pages/discounts/ManageDiscount';

// Report Pages
import SalesReports from './pages/reports/SalesReports';
import CustomerGrowthReports from './pages/reports/CustomerGrowthReports';
import PaymentReports from './pages/reports/PaymentReports';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/otp-verification" element={<OTPVerification />} />
              
              {/* Dashboard Routes */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Home />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catalog Routes */}
              <Route 
                path="/catalog/manage-products" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageProducts />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/catalog/new-product" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <NewProduct />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/catalog/manage-product/:id" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageProduct />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Order Routes */}
              <Route 
                path="/orders/manage-orders" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageOrders />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders/new-order" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <NewOrder />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders/manage-order/:id" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageOrder />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Customer Routes */}
              <Route 
                path="/customers/manage-customers" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageCustomers />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customers/new-customer" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <NewCustomer />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customers/manage-customer/:id" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageCustomer />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Discount Routes */}
              <Route 
                path="/discounts/manage" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageDiscounts />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discounts/create" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CreateDiscount />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discounts/manage-discount/:id" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ManageDiscount />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Report Routes */}
              <Route 
                path="/reports/sales" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SalesReports />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports/customer-growth" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerGrowthReports />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports/payments" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PaymentReports />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Profile Route */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;