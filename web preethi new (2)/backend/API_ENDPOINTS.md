# API Endpoints Quick Reference

**Base URL**: `http://localhost:5000/api`

---

## 🔐 Authentication (No auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new user account |
| POST | `/auth/login` | Login and get JWT token |
| POST | `/auth/verify-otp` | Verify email with OTP |
| POST | `/auth/resend-otp` | Resend OTP email |
| GET | `/auth/me` | Get current user (requires auth) |

---

## 📦 Products (Public access)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products?category=Kurti` | Get products by category |
| GET | `/products?category=new` | Get new arrivals |
| GET | `/products/:id` | Get single product by ID |
| GET | `/products/category/:category` | Get products by category |
| GET | `/products/categories/all` | Get all categories |

### Admin Only (requires auth + admin role):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create new product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

---

## 🛒 Cart (Requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add item to cart |
| PUT | `/cart/:productId` | Update item quantity |
| DELETE | `/cart/:productId` | Remove item from cart |
| DELETE | `/cart` | Clear entire cart |

---

## 📋 Orders (Requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order |
| GET | `/orders` | Get user's orders |
| GET | `/orders/:id` | Get single order |
| PUT | `/orders/:id/cancel` | Cancel order |

### Admin Only:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders/admin/all` | Get all orders |
| PUT | `/orders/:id/status` | Update order status |

---

## ✅ Health Check (No auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check server status |

---

## Request Examples

### Sign Up
```json
POST /api/auth/signup
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Add to Cart
```json
POST /api/cart
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
{
  "productId": 1,
  "quantity": 2
}
```

### Create Order
```json
POST /api/orders
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
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

---

## Response Format

### Success Response:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Status Codes

- `200` - OK (Success)
- `201` - Created
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (No/invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## Categories

Valid product categories:
- `Kurti`
- `Maternity Wears`
- `Sarees`
- `Jewelry`
- `Handbags`

---

## Order Statuses

Valid order statuses:
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

---

For detailed documentation, see [README.md](README.md)
