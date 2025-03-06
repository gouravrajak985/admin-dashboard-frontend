# Admin Dashboard UI Build Guide

This guide provides step-by-step instructions for building the admin dashboard UI using React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Project Setup Steps

1. **Initial Setup**
   - Create a new Vite project with React and TypeScript
   - Install and configure Tailwind CSS
   - Set up shadcn/ui components
   - Configure project structure

2. **Core Configuration Files**
   - Set up TypeScript configuration
   - Configure Tailwind CSS
   - Set up path aliases
   - Configure ESLint

3. **Context and Utils**
   - Create Theme context
   - Create Sidebar context
   - Set up utility functions

4. **Component Building Order**

   a. **UI Components (src/components/ui/)**
   - button.tsx
   - input.tsx
   - card.tsx
   - avatar.tsx
   - badge.tsx
   - dialog.tsx
   - dropdown-menu.tsx
   - separator.tsx
   - tabs.tsx
   - textarea.tsx
   - calendar.tsx
   - popover.tsx
   - select.tsx
   - label.tsx
   - table.tsx

   b. **Custom UI Components**
   - data-table.tsx
   - status-badge.tsx
   - page-header.tsx
   - search-input.tsx
   - filter-dropdown.tsx
   - date-range-picker.tsx
   - export-buttons.tsx
   - summary-card.tsx
   - form-input.tsx
   - form-textarea.tsx
   - form-select.tsx
   - action-button.tsx
   - icon-button.tsx
   - card-container.tsx
   - period-selector.tsx
   - image-upload.tsx

   c. **Core Components**
   - Loader.tsx
   - Message.tsx
   - LogoutDialog.tsx
   - Navbar.tsx
   - Sidebar.tsx
   - StatCard.tsx

4. **Layout Components**
   - DashboardLayout.tsx

5. **Pages**
   - Home.tsx
   - Profile.tsx
   
   a. **Auth Pages**
   - Login.tsx
   - Signup.tsx
   - OTPVerification.tsx
   
   b. **Catalog Pages**
   - ManageProducts.tsx
   - NewProduct.tsx
   - ManageProduct.tsx
   
   c. **Order Pages**
   - ManageOrders.tsx
   - NewOrder.tsx
   - ManageOrder.tsx
   
   d. **Customer Pages**
   - ManageCustomers.tsx
   - NewCustomer.tsx
   - ManageCustomer.tsx
   
   e. **Discount Pages**
   - ManageDiscounts.tsx
   - CreateDiscount.tsx
   - ManageDiscount.tsx
   
   f. **Report Pages**
   - SalesReports.tsx
   - CustomerGrowthReports.tsx
   - PaymentReports.tsx

6. **Redux Setup**
   - Set up store
   - Create auth slice
   - Create product slice
   - Create order slice
   - Create customer slice
   - Create discount slice

## Build Instructions

1. **Initial Project Setup**
   ```bash
   npm create vite@latest my-admin-dashboard -- --template react-ts
   cd my-admin-dashboard
   npm install
   ```

2. **Install Required Dependencies**
   ```bash
   # Core dependencies
   npm install @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tabs
   
   # UI and styling
   npm install class-variance-authority clsx tailwind-merge tailwindcss-animate lucide-react
   
   # Routing and state management
   npm install react-router-dom @reduxjs/toolkit
   
   # Date handling
   npm install date-fns
   ```

3. **Configure Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Follow Component Building Order**
   - Create each component in the order listed above
   - Test each component as you build
   - Ensure proper TypeScript types
   - Maintain consistent styling

5. **Testing**
   - Test navigation flow
   - Verify responsive design
   - Check dark/light theme switching
   - Validate form submissions
   - Test data display components

## Project Structure
```
src/
├── components/
│   ├── ui/
│   │   └── [ui components]
│   └── [core components]
├── context/
│   ├── ThemeContext.tsx
│   └── SidebarContext.tsx
├── layouts/
│   └── DashboardLayout.tsx
├── lib/
│   └── utils.ts
├── pages/
│   ├── auth/
│   ├── catalog/
│   ├── customers/
│   ├── discounts/
│   ├── orders/
│   ├── reports/
│   └── [main pages]
├── redux/
│   ├── slices/
│   └── store.ts
└── App.tsx
```

## Features
- Responsive design
- Dark/light theme support
- Authentication flow
- Product management
- Order management
- Customer management
- Discount management
- Reports and analytics
- Form validation
- Data tables with sorting and filtering
- Export functionality
- Image upload preview
- Interactive charts
- Real-time updates

## Best Practices
- Use TypeScript for type safety
- Follow component composition patterns
- Implement proper error handling
- Maintain consistent styling
- Use proper state management
- Follow accessibility guidelines
- Implement proper loading states
- Handle edge cases
- Use proper form validation
- Implement proper routing guards

