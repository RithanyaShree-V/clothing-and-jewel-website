# Vedha's Clothing - Backend API

Complete backend API for Vedha's Clothing e-commerce platform with user authentication, product management, cart functionality, and order processing.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **Email**: nodemailer (for OTP)

## Prerequisites

Before running the backend, ensure you have:

- Node.js (v14 or higher)
- MongoDB installed and running locally OR MongoDB Atlas account
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vedhas-clothing
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
Update `MONGODB_URI` in `.env` with your Atlas connection string.

### 4. Seed Products Database

```bash
npm run seed
```

This will populate the database with all 50 products matching the frontend data.

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### 1. Sign Up
- **POST** `/api/auth/signup`
- **Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: `201 Created`

#### 2. Login
- **POST** `/api/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: JWT token + user data

#### 3. Verify OTP
- **POST** `/api/auth/verify-otp`
- **Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### 4. Resend OTP
- **POST** `/api/auth/resend-otp`
- **Body**:
```json
{
  "email": "john@example.com"
}
```

#### 5. Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`

---

### Product Endpoints

#### 1. Get All Products
- **GET** `/api/products`
- **Query Params**: 
  - `category` - Filter by category
  - `isNew` - Filter new arrivals
- **Example**: `/api/products?category=Kurti`

#### 2. Get Product by ID
- **GET** `/api/products/:id`
- **Example**: `/api/products/1`

#### 3. Get Products by Category
- **GET** `/api/products/category/:category`
- **Example**: `/api/products/category/Sarees`

#### 4. Get Categories
- **GET** `/api/products/categories/all`

#### 5. Create Product (Admin Only)
- **POST** `/api/products`
- **Headers**: `Authorization: Bearer <admin-token>`
- **Body**:
```json
{
  "id": 51,
  "name": "New Product",
  "category": "Kurti",
  "price": 29.99,
  "image": "/images/product.jpg",
  "description": "Product description",
  "isNew": true,
  "stock": 100
}
```

#### 6. Update Product (Admin Only)
- **PUT** `/api/products/:id`
- **Headers**: `Authorization: Bearer <admin-token>`

#### 7. Delete Product (Admin Only)
- **DELETE** `/api/products/:id`
- **Headers**: `Authorization: Bearer <admin-token>`

---

### Cart Endpoints (All require authentication)

#### 1. Get User Cart
- **GET** `/api/cart`
- **Headers**: `Authorization: Bearer <token>`

#### 2. Add to Cart
- **POST** `/api/cart`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

#### 3. Update Cart Item
- **PUT** `/api/cart/:productId`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "quantity": 3
}
```

#### 4. Remove from Cart
- **DELETE** `/api/cart/:productId`
- **Headers**: `Authorization: Bearer <token>`

#### 5. Clear Cart
- **DELETE** `/api/cart`
- **Headers**: `Authorization: Bearer <token>`

---

### Order Endpoints (All require authentication)

#### 1. Create Order
- **POST** `/api/orders`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Traditional Kurti",
      "price": 29.99,
      "image": "/images/dress/kurti/traditional kurti.jpg",
      "category": "Kurti",
      "quantity": 2
    }
  ],
  "shippingDetails": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, Country"
  },
  "subtotal": 59.98,
  "tax": 4.80,
  "total": 64.78
}
```

#### 2. Get User Orders
- **GET** `/api/orders`
- **Headers**: `Authorization: Bearer <token>`

#### 3. Get Order by ID
- **GET** `/api/orders/:id`
- **Headers**: `Authorization: Bearer <token>`

#### 4. Cancel Order
- **PUT** `/api/orders/:id/cancel`
- **Headers**: `Authorization: Bearer <token>`

#### 5. Get All Orders (Admin Only)
- **GET** `/api/orders/admin/all`
- **Headers**: `Authorization: Bearer <admin-token>`

#### 6. Update Order Status (Admin Only)
- **PUT** `/api/orders/:id/status`
- **Headers**: `Authorization: Bearer <admin-token>`
- **Body**:
```json
{
  "status": "shipped"
}
```
- **Valid statuses**: pending, processing, shipped, delivered, cancelled

---

### Health Check

#### Check Server Status
- **GET** `/api/health`
- **Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

## Database Schemas

### User Schema
```javascript
{
  fullName: String (required, min 2 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isVerified: Boolean (default: false),
  otp: String,
  otpExpiry: Date,
  createdAt: Date
}
```

### Product Schema
```javascript
{
  id: Number (required, unique),
  name: String (required),
  category: String (required, enum: categories),
  price: Number (required, min: 0),
  image: String (required),
  description: String (required),
  isNew: Boolean (default: false),
  stock: Number (default: 100, min: 0),
  createdAt: Date
}
```

### Cart Schema
```javascript
{
  user: ObjectId (ref: User, required),
  items: [{
    product: ObjectId (ref: Product),
    productId: Number,
    name: String,
    price: Number,
    image: String,
    category: String,
    quantity: Number (min: 1)
  }],
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: User, required),
  items: [{
    product: ObjectId (ref: Product),
    productId: Number,
    name: String,
    price: Number,
    image: String,
    category: String,
    quantity: Number
  }],
  shippingDetails: {
    fullName: String,
    email: String,
    address: String
  },
  subtotal: Number,
  tax: Number,
  total: Number,
  status: String (enum: statuses, default: 'pending'),
  paymentStatus: String (enum: payment statuses, default: 'completed'),
  createdAt: Date
}
```

---

## Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Protected Routes**: Middleware for authentication
4. **Role-Based Access**: Admin-only routes
5. **Input Validation**: express-validator
6. **Error Handling**: Centralized error middleware
7. **CORS**: Configured for frontend origin

---

## Creating an Admin User

To create an admin user, you can either:

### Option 1: Direct Database Insert
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: Sign up normally, then update via database
1. Sign up through the API
2. Update the user's role in MongoDB to 'admin'

---

## Testing the API

### Using cURL

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get products
curl http://localhost:5000/api/products

# Add to cart (replace <token> with actual JWT)
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productId":1,"quantity":2}'
```

### Using Postman

1. Import the endpoints listed above
2. Set up environment variables for `baseURL` and `token`
3. Test each endpoint

---

## Frontend Integration

### The frontend works WITHOUT any modifications!

The backend is designed to be a drop-in replacement for the localStorage-based frontend. The frontend will continue to work exactly as before.

### To integrate with frontend (optional):

1. Create an API service file in frontend (e.g., `src/services/api.js`)
2. Replace localStorage calls with API calls
3. Add axios or fetch for HTTP requests
4. Handle JWT token storage

Example integration:
```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## OTP Implementation

The OTP feature is currently **mocked** (logged to console). To implement real OTP:

1. Configure email service in `.env`
2. Update `authController.js` to send emails using nodemailer
3. For SMS OTP, integrate Twilio or similar service

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: whitelist your IP address

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### JWT Token Invalid
- Check `JWT_SECRET` matches between signup and login
- Ensure token is passed in `Authorization: Bearer <token>` format

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── cartController.js     # Cart management
│   ├── orderController.js    # Order processing
│   └── productController.js  # Product CRUD
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Error handling
│   └── validator.js         # Input validation
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Cart.js              # Cart schema
│   └── Order.js             # Order schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── cartRoutes.js        # Cart endpoints
│   ├── orderRoutes.js       # Order endpoints
│   └── productRoutes.js     # Product endpoints
├── scripts/
│   └── seedProducts.js      # Database seeding
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
└── server.js                # Entry point
```

---

## License

ISC

---

## Support

For issues or questions, please create an issue in the repository.
