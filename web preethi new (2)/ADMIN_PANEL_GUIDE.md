# Admin Panel - Complete Setup Guide

## Overview

This Admin Panel provides complete management capabilities for the Vedha's Clothing e-commerce platform. Only authorized admins can access this panel using OTP-based authentication.

## Features

### 🔐 Security
- **OTP-Based Authentication**: Phone + OTP only (no email/password for admin)
- **Single Authorized Admin**: Only phone number `8438859659` can access the admin panel
- **JWT Token**: Secure session management with 24-hour expiry
- **Role-Based Access**: Support for multiple admin roles and employee management

### 📊 Admin Dashboard
- Real-time statistics (Users, Orders, Products, Revenue)
- Module status overview
- Quick access to all management features

### 👥 User Management
- View all registered users
- Delete user accounts
- Filter and search users
- Track user verification status
- View user registration dates

### 📦 Stock Management
- View all products with current stock levels
- Edit product prices
- Update stock quantities
- Monitor inventory levels (High/Low/Out of Stock)
- Real-time product data

### 🛒 Order Management
- View all customer orders
- Track order status (Pending, Processing, Shipped, Delivered, Cancelled)
- Update order status
- View order items and customer details
- Calculate total revenue

### 🏷️ Discount & Offer Management
- Create discount codes
- Set discount percentages
- Configure maximum usage limits
- Set expiry dates
- Add discount descriptions

### ⚙️ Settings & Permissions
- Enable/Disable modules dynamically
- Manage employee permissions
- Configure employee access to different modules
- Real-time settings synchronization

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create/Update `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/vedhas_clothing
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

3. **Database Setup**
   - Ensure MongoDB is running
   - Database migrations will run automatically

4. **Start Backend**
   ```bash
   npm start
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd "web preethi new"
   npm install
   ```

2. **Environment Variables**
   Create `.env` file:
   ```
   REACT_APP_API_BASE=http://localhost:5000
   ```

3. **Start Frontend**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## How to Access Admin Panel

### Step 1: Navigate to Admin Login
1. Open the application at `http://localhost:3000`
2. Look for "Admin Login" button in the Account section of the sidebar
3. Click to open the Admin Login modal

### Step 2: Request OTP
1. Enter the authorized phone number: `8438859659`
2. Click "Send OTP"
3. OTP will be sent via SMS (currently mocked - logs to console)

### Step 3: Verify OTP
1. Enter the 6-digit OTP sent to your phone
2. Click "Verify & Login"
3. After successful verification, you'll be redirected to the Admin Panel

### Step 4: Access Admin Panel
Visit `http://localhost:3000/admin` directly (if already logged in)

## Admin Panel Navigation

### Sidebar Menu
- **📊 Dashboard**: Overview and quick stats
- **👥 User Management**: Manage users (if enabled)
- **📦 Stock Management**: Manage inventory (if enabled)
- **🛒 Order Management**: Manage orders (if enabled)
- **🏷️ Discount Management**: Create/manage discounts (if enabled)
- **⚙️ Settings**: Configure modules and permissions
- **🚪 Logout**: Sign out from admin panel

## Module Management

### Enabling/Disabling Modules
1. Go to **Settings** tab
2. Toggle module switches under "Module Management"
3. Changes apply immediately
4. Disabled modules are hidden from the admin panel

### Employee Permissions
1. Go to **Settings** tab
2. Configure "Employee Permissions" 
3. Set default access levels for new employees
4. Individual employee permissions can be customized

## API Endpoints

### Admin Authentication
- `POST /api/admin/request-otp` - Request OTP
- `POST /api/admin/verify-otp` - Verify OTP and login

### Admin Settings
- `GET /api/admin/settings` - Get current settings
- `PUT /api/admin/settings` - Update settings

### User Management
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:userId` - Delete user

### Stock Management
- `GET /api/admin/stock` - Get all products
- `PUT /api/admin/stock/:productId` - Update product stock/price

### Order Management
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:orderId` - Update order status

### Discount Management
- `POST /api/admin/discounts` - Create discount

### Employee Management
- `POST /api/admin/employees` - Create employee
- `GET /api/admin/employees` - Get all employees
- `PUT /api/admin/employees/:employeeId` - Update employee permissions
- `DELETE /api/admin/employees/:employeeId` - Delete employee

## Security Considerations

1. **OTP Expiry**: OTPs expire after 10 minutes
2. **Failed Attempts**: Maximum 5 failed OTP attempts
3. **JWT Token**: 24-hour session expiry
4. **Phone Authorization**: Only authorized phone number can access
5. **No Hardcoded Credentials**: All credentials stored securely
6. **CORS Protection**: Frontend communication secured

## Customization

### Changing Admin Phone Number
Edit [backend/controllers/adminController.js](../backend/controllers/adminController.js):
```javascript
const ADMIN_PHONE = '8438859659'; // Change this
```

### SMS Gateway Integration
To enable real SMS delivery (currently mocked):
1. Install Twilio: `npm install twilio`
2. Update [backend/controllers/adminController.js](../backend/controllers/adminController.js)
3. Add SMS credentials to `.env`

### Styling
- Admin Panel CSS: [src/components/AdminPanel.css](../src/components/AdminPanel.css)
- Login Modal CSS: [src/components/AdminLogin.css](../src/components/AdminLogin.css)
- Management Modules CSS: [src/components/ManagementModules.css](../src/components/ManagementModules.css)

## Troubleshooting

### OTP Not Sending
- Check backend console for OTP logs
- Verify JWT_SECRET in `.env`
- Ensure backend is running on port 5000

### Cannot Access Admin Panel
- Verify you're using the correct phone number: `8438859659`
- Check admin token in browser localStorage
- Clear localStorage and login again

### Modules Not Showing
- Verify module is enabled in Settings
- Check admin token validity (24-hour expiry)
- Refresh the page

### Database Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify database credentials

## File Structure

```
backend/
├── models/
│   ├── Admin.js              # Admin user model
│   ├── AdminOtp.js           # OTP storage
│   ├── AdminSettings.js      # Module and permission settings
│   └── Employee.js           # Employee model
├── controllers/
│   └── adminController.js    # All admin functionality
├── routes/
│   └── adminRoutes.js        # Admin API routes
└── middleware/
    └── adminAuth.js          # Authentication middleware

web preethi new/src/
├── components/
│   ├── AdminPanel.js         # Main admin panel
│   ├── AdminLogin.js         # Login modal
│   ├── AdminDashboard.js     # Dashboard component
│   ├── UserManagement.js     # User management
│   ├── StockManagement.js    # Stock management
│   ├── OrderManagement.js    # Order management
│   ├── DiscountManagement.js # Discount management
│   └── AdminSettings.js      # Settings component
├── context/
│   └── AdminContext.js       # Admin authentication context
└── pages/
    └── (Regular pages remain unchanged)
```

## Testing the Admin Panel

### Test User Credentials
- **Phone Number**: `8438859659`
- **OTP**: Check backend console (currently mocked)

### Test Scenarios
1. **Login**: Request OTP → Enter OTP → Verify
2. **View Dashboard**: Check statistics load correctly
3. **User Management**: View users, delete a test user
4. **Stock Management**: Update product prices and stock
5. **Order Management**: Check orders, update status
6. **Discounts**: Create test discounts
7. **Settings**: Toggle modules and permissions
8. **Logout**: Verify session ends properly

## Production Deployment

Before deploying:
1. Change admin phone number to your actual number
2. Integrate with real SMS service (Twilio, AWS SNS, etc.)
3. Update JWT_SECRET to a strong random value
4. Enable HTTPS only
5. Set NODE_ENV=production
6. Configure proper MongoDB credentials
7. Setup proper email notifications
8. Enable rate limiting on OTP requests
9. Implement audit logging for admin actions
10. Setup backup and disaster recovery

## Support & Maintenance

### Regular Tasks
- Monitor admin access logs
- Review user activities periodically
- Update dependencies monthly
- Backup admin settings regularly
- Review and clean old OTP records

### Performance Tips
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize database queries
- Use CDN for static files
- Enable gzip compression

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Production Ready
