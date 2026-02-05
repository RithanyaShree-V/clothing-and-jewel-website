# 🚀 Quick Start Guide - Admin Panel Setup

## One-Time Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd "../web preethi new"
npm install
```

## Running the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm start
```
✅ Backend runs on: `http://localhost:5000`

### Terminal 2 - Start Frontend
```bash
cd "web preethi new"
npm start
```
✅ Frontend runs on: `http://localhost:3000`

## 🔐 Admin Login Credentials

**Phone Number**: `8438859659`

### First-Time Admin Access
1. Open `http://localhost:3000`
2. Click **"Admin Login"** in sidebar (Account section)
3. Enter phone: `8438859659`
4. Click "Send OTP"
5. Check backend console for OTP (currently mocked)
6. Example: If console shows `[MOCK SMS] OTP sent to 8438859659: 123456`
7. Enter OTP `123456` in the modal
8. Click "Verify & Login"
9. You're now in the Admin Panel!

## 📊 Admin Panel Features

Once logged in, you'll see:

### 📈 Dashboard
- Total Users count
- Total Orders count
- Total Products count
- Total Revenue
- Module status overview

### 👥 User Management (if enabled)
- View all registered users
- Delete user accounts
- See verification status
- View registration dates

### 📦 Stock Management
- View all products
- Edit prices in real-time
- Update stock quantities
- See stock status (High/Low/Out)

### 🛒 Order Management
- View all orders
- Update order status (Pending → Processing → Shipped → Delivered)
- See customer details
- View order items

### 🏷️ Discount Management
- Create new discount codes
- Set discount percentage
- Set usage limits
- Configure expiry dates

### ⚙️ Settings
- **Enable/Disable Modules**: Toggle features on/off
- **Employee Permissions**: Control what employees can access
- **Real-time Updates**: Changes apply immediately

## 🔧 Troubleshooting

### Issue: "Cannot GET /admin"
**Solution**: Make sure you're logged in as admin. The AdminPanel component will redirect to home if not authenticated.

### Issue: OTP Not Appearing
**Solution**: Check the backend terminal console. It will show something like:
```
[MOCK SMS] OTP sent to 9876543210: 123456
```

### Issue: "Phone number is not authorized"
**Solution**: Use exactly: `8438859659`
(This is intentional security - only this number can access admin panel)

### Issue: Backend connection failed
**Solution**: 
1. Ensure backend is running on port 5000
2. Check `.env` file exists in backend folder
3. Verify REACT_APP_API_BASE in frontend `.env`

## 📝 File Locations

### Backend Admin Files
- Models: `backend/models/Admin.js`, `AdminOtp.js`, `AdminSettings.js`
- Controller: `backend/controllers/adminController.js`
- Routes: `backend/routes/adminRoutes.js`
- Auth Middleware: `backend/middleware/adminAuth.js`

### Frontend Admin Files
- Main Panel: `src/components/AdminPanel.js`
- Login Modal: `src/components/AdminLogin.js`
- Dashboard: `src/components/AdminDashboard.js`
- User Mgmt: `src/components/UserManagement.js`
- Stock Mgmt: `src/components/StockManagement.js`
- Order Mgmt: `src/components/OrderManagement.js`
- Discount Mgmt: `src/components/DiscountManagement.js`
- Settings: `src/components/AdminSettings.js`
- Context: `src/context/AdminContext.js`

## 🎯 Next Steps

### To Use in Production
1. Change admin phone number:
   - Edit `backend/controllers/adminController.js`
   - Change `const ADMIN_PHONE = '8438859659'` to your number

2. Integrate real SMS service:
   - Install Twilio: `npm install twilio`
   - Add to `adminController.js` sendOTP function
   - Add credentials to `.env`

3. Security checklist:
   - ✅ Change JWT_SECRET to random string
   - ✅ Update MONGODB_URI
   - ✅ Set NODE_ENV=production
   - ✅ Enable HTTPS
   - ✅ Configure CORS origins

## 📞 Testing Admin Features

### Test User Management
1. Go to Admin Panel → User Management
2. See all registered users
3. Try deleting a test user

### Test Stock Management
1. Go to Admin Panel → Stock Management
2. Click "Edit" on any product
3. Change price or stock
4. Click "Save"
5. See real-time updates

### Test Order Management
1. Create an order as a customer first
2. Go to Admin Panel → Order Management
3. See the order in the list
4. Update its status
5. See the change reflected

### Test Discount Management
1. Go to Admin Panel → Discount Management
2. Fill in discount details
3. Click "Create Discount"
4. See it added to the list

### Test Settings
1. Go to Admin Panel → Settings
2. Toggle a module OFF
3. Go back to Admin Panel
4. See that module removed from sidebar
5. Toggle it back ON
6. See it reappear

## 🚀 Running Both Servers

**Easy Way** - Open 2 terminals:

Terminal 1:
```bash
cd backend && npm start
```

Terminal 2:
```bash
cd "web preethi new" && npm start
```

Both will start automatically!

## ✨ Success Indicators

You'll know everything is working when:

1. ✅ Both servers start without errors
2. ✅ Frontend loads at `http://localhost:3000`
3. ✅ You can see "Admin Login" button in sidebar
4. ✅ Admin Login modal opens when clicked
5. ✅ OTP is generated in backend console
6. ✅ Admin Panel loads after OTP verification
7. ✅ Dashboard shows statistics
8. ✅ All modules are accessible

## 📚 Full Documentation

For more detailed information:
- Admin Panel Setup: `ADMIN_PANEL_GUIDE.md`
- Complete README: `README_COMPLETE.md`
- API Endpoints: `backend/API_ENDPOINTS.md`

---

**Happy Admin Dashboard Usage!** 🎉

Made with ❤️ for modern e-commerce management.
