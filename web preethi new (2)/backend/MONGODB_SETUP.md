# MongoDB Atlas Quick Setup Guide

## Problem
Your backend can't connect to MongoDB because it's not installed/running locally.

## ✅ Solution 1: MongoDB Atlas (Recommended - 5 minutes)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free, no credit card)
3. Choose "Build a Database" → "FREE" (M0 Sandbox)

### Step 2: Create Cluster
1. Choose AWS (or any provider)
2. Choose closest region
3. Click "Create Cluster" (takes 2-3 minutes)

### Step 3: Setup Database Access
1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `vedhasadmin`
5. Password: `vedhas123` (or any password)
6. Set user privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Setup Network Access
1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Databases"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It looks like: `mongodb+srv://vedhasadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update .env File
Open `backend/.env` and replace the MONGODB_URI line:

```env
MONGODB_URI=mongodb+srv://vedhasadmin:vedhas123@cluster0.xxxxx.mongodb.net/vedhas-clothing?retryWrites=true&w=majority
```

**Important**: Replace `<password>` with your actual password and update the cluster URL with your actual cluster URL.

### Step 7: Test Backend
```powershell
cd "C:\Users\dell\Downloads\web preethi new (2)\backend"
npm run seed
npm start
```

---

## ⚙️ Solution 2: Install MongoDB Locally (Windows)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select: Windows x64
3. Download the MSI installer

### Step 2: Install MongoDB
1. Run the installer
2. Choose "Complete" installation
3. Install "MongoDB as a Service" (check this option)
4. Keep default settings

### Step 3: Start MongoDB Service
Open PowerShell as Administrator:
```powershell
# Start MongoDB service
net start MongoDB

# Or if using mongod directly
cd "C:\Program Files\MongoDB\Server\7.0\bin"
.\mongod.exe --dbpath "C:\data\db"
```

### Step 4: Create Data Directory
```powershell
# Create directory for MongoDB data
New-Item -ItemType Directory -Force -Path "C:\data\db"
```

### Step 5: Test Connection
```powershell
# In a new terminal
cd "C:\Users\dell\Downloads\web preethi new (2)\backend"
npm run seed
npm start
```

---

## 🔧 Quick Test After Setup

Once MongoDB is running (Atlas or local):

```powershell
# 1. Seed the database
cd "C:\Users\dell\Downloads\web preethi new (2)\backend"
npm run seed

# 2. Start backend
npm start

# 3. Test in browser
# Open: http://localhost:5000/api/health
```

---

## ✅ Expected Output

After successful connection:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server is running in development mode on port 5000
```

---

## ❌ If You Still See Errors

### Error: "Authentication failed"
- Check your MongoDB Atlas username/password in .env
- Make sure you replaced `<password>` in connection string

### Error: "ECONNREFUSED"
- For Atlas: Check Network Access allows 0.0.0.0/0
- For Local: Ensure MongoDB service is running

### Error: "Bad auth"
- Your password contains special characters
- Encode the password: https://www.urlencoder.org/
- Use encoded password in connection string

---

## 📞 Need Help?

If you're stuck, the **MongoDB Atlas (Solution 1)** is easiest and takes just 5 minutes!
