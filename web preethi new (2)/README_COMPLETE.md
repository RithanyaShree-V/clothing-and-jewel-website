# Vedha's Clothing - E-Commerce Platform with Complete Admin Panel

A modern, full-stack e-commerce platform for clothing with comprehensive admin management system.

## 🎯 Key Features

### Customer Features
- Browse products by category
- User authentication (Sign up/Sign in)
- Shopping cart with persistent storage
- Wishlist management
- Order checkout and tracking
- Responsive design for all devices

### Admin Features ⭐
- **OTP-Based Secure Login** (Phone + OTP only)
- **Complete User Management** - View, manage, delete users
- **Inventory Management** - Update stock and prices in real-time
- **Order Management** - Track and update order status
- **Discount Management** - Create and manage promotional codes
- **Dynamic Module Control** - Enable/disable features as needed
- **Employee Management** - Create and manage staff with custom permissions
- **Real-time Dashboard** - Statistics and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone/Extract the project**
   ```bash
   cd "web preethi new (2)"
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file with MongoDB credentials
   npm start
   ```
   Backend runs on: `http://localhost:5000`

3. **Setup Frontend**
   ```bash
   cd "../web preethi new"
   npm install
   npm start
   ```
   Frontend runs on: `http://localhost:3000`

## 📱 Admin Panel Access

### Login Steps
1. Click **"Admin Login"** in the sidebar (Account section)
2. Enter authorized phone: `8438859659`
3. Receive and enter OTP
4. Access full admin dashboard

### Admin Dashboard Includes
- 📊 Statistics & Analytics
- 👥 User Management
- 📦 Stock & Inventory
- 🛒 Order Tracking
- 🏷️ Discount Management
- ⚙️ Settings & Permissions

## 📁 Project Structure

```
project1/
├── backend/                    # Node.js + Express API
│   ├── models/                # Database schemas
│   │   ├── Admin.js
│   │   ├── AdminOtp.js
│   │   ├── AdminSettings.js
│   │   ├── Employee.js
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/           # Business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/                # API endpoints
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/            # Auth, validation, error handling
│   │   ├── adminAuth.js
│   │   ├── auth.js
│   │   ├── validator.js
│   │   └── errorHandler.js
│   ├── config/                # Database config
│   └── server.js              # Entry point
│
└── web preethi new/           # React Frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── AdminPanel.js
    │   │   ├── AdminLogin.js
    │   │   ├── AdminDashboard.js
    │   │   ├── UserManagement.js
    │   │   ├── StockManagement.js
    │   │   ├── OrderManagement.js
    │   │   ├── DiscountManagement.js
    │   │   ├── AdminSettings.js
    │   │   ├── Sidebar.js
    │   │   ├── ProductCard.js
    │   │   └── (other components)
    │   ├── context/           # State management
    │   │   ├── AdminContext.js
    │   │   ├── AuthContext.js
    │   │   ├── CartContext.js
    │   │   └── WishlistContext.js
    │   ├── pages/             # Page components
    │   │   ├── Home.js
    │   │   ├── AllProducts.js
    │   │   ├── ProductDetail.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── OrderSuccess.js
    │   │   ├── SignIn.js
    │   │   ├── SignUp.js
    │   │   └── Wishlist.js
    │   ├── data/              # Static data
    │   │   └── products.js
    │   ├── utils/             # Helper functions
    │   │   └── currency.js
    │   ├── App.js             # Root component
    │   └── index.js           # Entry point
    └── public/                # Static files
```

## 🔐 Security Features

- **OTP-Based Authentication**: No passwords for admin
- **JWT Tokens**: Secure session management
- **Role-Based Access**: Different permission levels
- **Input Validation**: Server-side validation
- **CORS Protection**: Secure API communication
- **Password Hashing**: Bcrypt encryption

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **CSS3** - Styling
- **React Icons** - Icon library

## 📝 API Endpoints

### Admin APIs
```
POST   /api/admin/request-otp          - Request OTP
POST   /api/admin/verify-otp           - Verify OTP & Login
GET    /api/admin/settings             - Get settings
PUT    /api/admin/settings             - Update settings
GET    /api/admin/users                - Get all users
DELETE /api/admin/users/:userId        - Delete user
GET    /api/admin/stock                - Get products
PUT    /api/admin/stock/:productId     - Update stock
GET    /api/admin/orders               - Get orders
PUT    /api/admin/orders/:orderId      - Update order status
POST   /api/admin/discounts            - Create discount
POST   /api/admin/employees            - Create employee
GET    /api/admin/employees            - Get employees
PUT    /api/admin/employees/:id        - Update employee
DELETE /api/admin/employees/:id        - Delete employee
```

### User APIs
```
POST   /api/auth/signup                - Register user
POST   /api/auth/login                 - Login user
GET    /api/products                   - Get all products
GET    /api/products/:id               - Get product details
POST   /api/cart/add                   - Add to cart
GET    /api/cart                       - Get cart items
POST   /api/orders                     - Create order
```

## 🎨 Customization

### Change Admin Phone Number
Edit `backend/controllers/adminController.js`:
```javascript
const ADMIN_PHONE = '8438859659'; // Change to your phone
```

### Integrate Real SMS Service
1. Install Twilio: `npm install twilio`
2. Update `adminController.js` `sendOTP` function
3. Add credentials to `.env`

### Styling
All CSS files are modular and easy to customize:
- Admin Panel: `src/components/AdminPanel.css`
- Admin Login: `src/components/AdminLogin.css`
- Management: `src/components/ManagementModules.css`

## 📚 Documentation

- **[Admin Panel Setup Guide](./ADMIN_PANEL_GUIDE.md)** - Detailed admin features
- **[API Documentation](./backend/API_ENDPOINTS.md)** - Complete API reference
- **[MongoDB Setup](./backend/MONGODB_SETUP.md)** - Database configuration

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Frontend Not Loading
```bash
# Check .env file exists with correct API URL
# Clear browser cache and reload
# Check console for errors
```

### OTP Not Working
- Verify phone number is `8438859659`
- Check backend console for OTP logs
- Ensure JWT_SECRET is set in `.env`

### MongoDB Connection Failed
- Verify MongoDB is running
- Check MONGODB_URI in `.env`
- Test connection: `mongo mongodb://localhost:27017/vedhas_clothing`

## 📊 Features Checklist

- ✅ User Authentication (Email/Password)
- ✅ Admin Authentication (Phone + OTP)
- ✅ Product Browsing & Filtering
- ✅ Shopping Cart
- ✅ Order Management
- ✅ User Management
- ✅ Stock Management
- ✅ Discount Management
- ✅ Employee Management
- ✅ Real-time Dashboard
- ✅ Module Control
- ✅ Permission Management
- ✅ Responsive Design
- ✅ Error Handling
- ✅ Data Validation
- ✅ Secure Authentication

## 🚀 Deployment

### Prerequisites for Production
1. Change admin phone to your actual number
2. Integrate real SMS service
3. Update JWT_SECRET
4. Use secure database credentials
5. Enable HTTPS
6. Set NODE_ENV=production
7. Configure proper CORS origins

### Deploy to Heroku
```bash
# Backend
cd backend
heroku create your-app-name-api
git push heroku main

# Frontend
cd "../web preethi new"
npm run build
# Deploy to Vercel/Netlify
```

## 📞 Support

For issues or feature requests, please check:
1. Backend logs: `npm start` output
2. Browser console: F12 → Console
3. Network tab: Check API calls
4. Documentation files in the project

## 📄 License

This project is provided as-is for educational and commercial use.

## ✨ Credits

Built with ❤️ for modern e-commerce solutions.

---

**Last Updated**: January 2026
**Version**: 2.0.0 (With Admin Panel)
**Status**: Production Ready ✓

For detailed information about the Admin Panel, see [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)
