# Quick Start Guide - Vedha's Clothing Backend

## Option 1: Quick Start WITHOUT MongoDB (For Testing)

If you don't have MongoDB installed, you can use **MongoDB Atlas** (free cloud database):

### Steps:

1. **Sign up for MongoDB Atlas** (Free):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Create a free cluster (M0 Sandbox)
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **Update `.env` file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vedhas-clothing?retryWrites=true&w=majority
   ```
   Replace `username` and `password` with your Atlas credentials.

3. **Start the backend**:
   ```bash
   cd backend
   npm install
   npm run seed    # Populate database with products
   npm start       # Start server
   ```

4. **Server will run on**: http://localhost:5000

---

## Option 2: Local MongoDB Installation

### For Windows:

1. **Download MongoDB Community Server**:
   - Go to https://www.mongodb.com/try/download/community
   - Download Windows installer
   - Run installer (use default settings)

2. **Start MongoDB**:
   ```bash
   # Open Command Prompt as Administrator
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
   ```
   
   Or create Windows Service:
   ```bash
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg" --install
   net start MongoDB
   ```

3. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run seed
   npm start
   ```

---

## Verifying Backend is Running

### Test Health Endpoint:
```bash
# PowerShell
Invoke-WebRequest http://localhost:5000/api/health

# Or open in browser
http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Test Products Endpoint:
```bash
http://localhost:5000/api/products
```

---

## Complete Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database seeded (`npm run seed`)
- [ ] Backend server running (`npm start`)
- [ ] Health check passes
- [ ] Frontend still running on port 3000

---

## Common Issues

### Issue: MongoDB Connection Error
**Solution**: 
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas: Whitelist your IP (0.0.0.0/0 for testing)

### Issue: Port 5000 already in use
**Solution**: 
- Change `PORT=5001` in `.env`
- Update frontend API calls accordingly

### Issue: Cannot connect to backend from frontend
**Solution**:
- Check CORS settings in `server.js`
- Ensure `FRONTEND_URL=http://localhost:3000` in `.env`

---

## Next Steps

1. ✅ Backend is running
2. ✅ Frontend is running  
3. 🔄 **Optional**: Integrate frontend with backend APIs
4. 🔄 **Optional**: Create admin user for product management

### Create Admin User:

After signing up normally, update role in MongoDB:

**MongoDB Compass:**
```javascript
// Find user and update
{ email: "admin@example.com" }
// Update
{ $set: { role: "admin" } }
```

**MongoDB Shell:**
```bash
use vedhas-clothing
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## Testing APIs

### Using PowerShell (Windows):

**Sign Up:**
```powershell
$body = @{
    fullName = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method POST -Body $body -ContentType "application/json"
```

**Login:**
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
```

**Get Products:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/products"
```

**Add to Cart (requires login):**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}
$body = @{
    productId = 1
    quantity = 2
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

---

## File Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/              # Business logic
├── middleware/               # Auth, validation, errors
├── models/                   # Database schemas
├── routes/                   # API endpoints
├── scripts/
│   └── seedProducts.js      # Database seeding
├── .env                     # Configuration (create from .env.example)
├── .env.example             # Template
├── package.json
├── README.md                # Full documentation
└── server.js                # Entry point
```

---

## Support

For detailed API documentation, see [README.md](README.md)
