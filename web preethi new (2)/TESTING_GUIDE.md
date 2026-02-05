# 🧪 Admin Panel Testing Guide

## Pre-Testing Checklist

- ✅ Both backend and frontend are running
- ✅ MongoDB is connected
- ✅ No errors in browser console or backend terminal
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000

---

## 🧪 Test Scenarios

### Test 1: Admin Login Flow

**Objective**: Verify OTP-based authentication works correctly

**Steps**:
1. Visit `http://localhost:3000`
2. Scroll down in sidebar to "Account" section
3. Click **"Admin Login"** button
4. Verify "Admin Login" modal appears
5. Enter phone number: `8438859659`
6. Click "Send OTP"
7. **Expected**: Modal says "OTP sent successfully"
8. Check backend terminal for log: `[MOCK SMS] OTP sent to 8438859659: XXXXXX`
9. Copy the 6-digit OTP from console
10. Enter OTP in the modal field
11. Click "Verify & Login"
12. **Expected**: Redirects to `/admin` with admin panel loaded

**Success Criteria**:
- ✅ OTP appears in backend console
- ✅ Modal accepts OTP
- ✅ Admin panel loads after verification

---

### Test 2: Admin Panel Navigation

**Objective**: Verify all menu items work correctly

**Steps**:
1. Login as admin (from Test 1)
2. Verify sidebar shows 6 menu items:
   - 📊 Dashboard
   - 👥 User Management
   - 📦 Stock Management
   - 🛒 Order Management
   - 🏷️ Discount Management
   - ⚙️ Settings
3. Click each menu item
4. **Expected**: Content changes, header updates

**Success Criteria**:
- ✅ All 6 modules are visible
- ✅ Clicking each shows different content
- ✅ Header text updates correctly
- ✅ No console errors

---

### Test 3: Dashboard Statistics

**Objective**: Verify dashboard loads and displays data

**Steps**:
1. Stay on Dashboard tab
2. Verify 4 stat cards visible:
   - 👥 Total Users
   - 🛒 Total Orders
   - 📦 Total Products
   - 💰 Total Revenue
3. Verify numbers display (could be 0 if no data)
4. Verify "Available Modules" section below
5. See status of all 4 modules

**Success Criteria**:
- ✅ 4 stat cards display
- ✅ Numbers appear (0 or actual count)
- ✅ Module status shows
- ✅ No loading errors

---

### Test 4: User Management Module

**Objective**: Test viewing and managing users

**Steps**:
1. Click "👥 User Management" in sidebar
2. **Expected**: Table shows all registered users (if any)
3. Table columns: Name, Email, Verified, Joined, Actions
4. If users exist:
   - See user names and emails
   - See verification status (Yes/No)
   - See registration dates
5. Try deleting a test user:
   - Click "Delete" button
   - Click "Confirm" to confirm deletion
   - **Expected**: User removed from table
6. Click "🔄 Refresh" button
   - **Expected**: Data reloads from backend

**Success Criteria**:
- ✅ Users display in table
- ✅ Delete functionality works
- ✅ Refresh updates data
- ✅ No console errors

---

### Test 5: Stock Management Module

**Objective**: Test product inventory management

**Steps**:
1. Click "📦 Stock Management" in sidebar
2. **Expected**: Table shows all products
3. Verify columns: Product Name, Price, Stock, Category, Actions
4. Try editing a product:
   - Click "Edit" button on any product
   - Inputs appear for price and stock
   - Change values
   - Click "Save"
   - **Expected**: Values update in table
5. Click back to edit same product
   - **Expected**: Shows updated values
6. Stock status indicators:
   - Green (High): stock > 10
   - Yellow (Low): stock 0-10
   - Red (Out): stock = 0

**Success Criteria**:
- ✅ Products display in table
- ✅ Edit mode activates
- ✅ Changes save correctly
- ✅ Stock indicators color-code properly
- ✅ No errors on save

---

### Test 6: Order Management Module

**Objective**: Test order tracking and status updates

**Steps**:
1. Click "🛒 Order Management" in sidebar
2. **Expected**: List of orders displays (if any orders exist)
3. Each order item shows:
   - Order ID
   - Customer name
   - Total price
   - Status dropdown
4. Click on an order to expand:
   - **Expected**: Details appear below
   - Shows customer email
   - Shows date
   - Shows items with quantities
5. Change order status:
   - Click status dropdown
   - Select different status (Pending → Processing, etc.)
   - **Expected**: Status updates immediately
6. Valid statuses: Pending, Processing, Shipped, Delivered, Cancelled

**Success Criteria**:
- ✅ Orders display in list
- ✅ Expand/collapse works
- ✅ Status dropdown functions
- ✅ Status changes reflected
- ✅ No errors on update

---

### Test 7: Discount Management Module

**Objective**: Test discount code creation

**Steps**:
1. Click "🏷️ Discount Management" in sidebar
2. See form with fields:
   - Discount Code (required)
   - Discount % (required)
   - Max Uses (required)
   - Expiry Date (optional)
   - Description (optional)
3. Create a test discount:
   - Code: `TEST20`
   - Percentage: `20`
   - Max Uses: `100`
   - Expiry: (select date or leave blank)
   - Description: `Test discount`
4. Click "+ Create Discount"
5. **Expected**: Discount card appears below
6. Card shows:
   - Code in large text
   - Percentage (20% OFF)
   - Usage count (0/100)
   - Expiry date (if set)
   - Description
7. Click "Delete" to remove discount
   - **Expected**: Card disappears

**Success Criteria**:
- ✅ Form validates (requires code, %, uses)
- ✅ Discount card creates
- ✅ Data displays correctly
- ✅ Delete works
- ✅ No form errors

---

### Test 8: Settings Module

**Objective**: Test module enable/disable

**Steps**:
1. Click "⚙️ Settings" in sidebar
2. See "Module Management" section with 4 toggles:
   - 👥 User Management
   - 📦 Stock Management
   - 🛒 Order Management
   - 🏷️ Discount Management
3. Each toggle shows status (✓ Enabled or ✗ Disabled)
4. Try disabling "User Management":
   - Click toggle OFF
   - **Expected**: Background changes color
   - Status shows "Disabled"
5. Go back to sidebar
   - **Expected**: User Management removed from menu
6. Go back to Settings
7. Toggle "User Management" back ON
   - **Expected**: Status shows "Enabled" again
8. Go to sidebar
   - **Expected**: User Management appears again
9. See "Employee Permissions" section with 4 toggles:
   - Stock Access
   - Orders Access
   - Users Access
   - Discounts Access

**Success Criteria**:
- ✅ All 8 toggles present
- ✅ Toggles change visual state
- ✅ Status text updates
- ✅ Menu items appear/disappear
- ✅ Changes are immediate (no page reload)

---

### Test 9: Admin Logout

**Objective**: Test logout functionality

**Steps**:
1. From any admin panel page
2. Click "🚪 Logout" button in sidebar
3. **Expected**: Confirmation dialog appears
4. Click "OK" to confirm
5. **Expected**: Redirects to home page (`http://localhost:3000`)
6. Sidebar now shows "Admin Login" button again
7. Try accessing `/admin` directly
   - **Expected**: Redirects to home (not authenticated)

**Success Criteria**:
- ✅ Logout button works
- ✅ Confirmation appears
- ✅ Redirects to home
- ✅ Admin links disappear from sidebar
- ✅ Cannot access /admin directly

---

### Test 10: Responsive Design

**Objective**: Test admin panel on mobile/tablet

**Steps**:
1. Open admin panel in Chrome
2. Press F12 to open DevTools
3. Click responsive design mode (Ctrl+Shift+M)
4. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1200px)
5. For each size, verify:
   - Content is readable
   - Buttons are clickable
   - Tables are usable (may scroll)
   - Forms are functional
   - No overlapping elements

**Success Criteria**:
- ✅ Mobile view is usable
- ✅ Tablet layout is good
- ✅ Desktop is optimal
- ✅ All text is readable
- ✅ No horizontal scrollbars (except tables)

---

### Test 11: Error Handling

**Objective**: Test error messages and validation

**Steps**:
1. **Test OTP Error**:
   - Go to Admin Login
   - Enter phone: `8438859659`
   - Enter wrong OTP: `000000`
   - **Expected**: Error message appears
   - Try 5 times
   - **Expected**: Message says "Max attempts exceeded"

2. **Test Wrong Phone**:
   - Go to Admin Login
   - Enter phone: `1234567890` (different)
   - Click "Send OTP"
   - **Expected**: Error says "not authorized"

3. **Test Network Error** (optional):
   - Stop backend server
   - Try admin action
   - **Expected**: Error message appears, not crash

**Success Criteria**:
- ✅ Invalid OTP shows error
- ✅ Wrong phone shows error
- ✅ Max attempts enforced
- ✅ No console errors
- ✅ App doesn't crash

---

### Test 12: Data Persistence

**Objective**: Test localStorage persistence

**Steps**:
1. Login as admin
2. Go to Admin Panel (any page)
3. Open browser DevTools (F12)
4. Go to Application → LocalStorage
5. Find `vedhasAdminToken` and `vedhasAdmin`
6. **Expected**: Both should have values
7. Refresh the page (F5)
8. **Expected**: Admin panel still loaded (no re-login needed)
9. Close browser tab completely
10. Reopen to `http://localhost:3000`
11. **Expected**: Admin link in sidebar (still logged in)
12. Click Admin Link
13. **Expected**: Goes directly to `/admin` (no login modal)
14. Go to Logout
15. Clear localStorage
16. Try accessing `/admin`
17. **Expected**: Redirects to home (logged out)

**Success Criteria**:
- ✅ Tokens stored in localStorage
- ✅ Refresh maintains login
- ✅ Browser close maintains login
- ✅ Logout clears storage
- ✅ Cannot access /admin when logged out

---

## 🔍 Visual Testing Checklist

### Colors
- ✅ Admin panel uses brown theme (#8b4513)
- ✅ Success messages are green
- ✅ Error messages are red
- ✅ Warnings are orange/yellow
- ✅ All text is readable (contrast ratio ≥ 4.5:1)

### Fonts
- ✅ Headers use serif font (Cormorant Garamond)
- ✅ Body text is readable
- ✅ Font sizes are appropriate
- ✅ Font weights create hierarchy

### Spacing
- ✅ Padding is consistent
- ✅ Margins are balanced
- ✅ No crowded elements
- ✅ Whitespace is used effectively

### Components
- ✅ Buttons are clickable (min 44px height)
- ✅ Forms have clear labels
- ✅ Tables are readable
- ✅ Cards have clear separation

---

## 📊 Performance Testing

### Load Times
1. Open DevTools (F12 → Network)
2. Reload admin panel
3. **Expected**: Initial load < 3 seconds
4. Check network panel:
   - ✅ CSS loads
   - ✅ JS loads
   - ✅ API calls complete

### Response Times
1. Click through modules
2. **Expected**: Instant response (no lag)
3. Edit operations:
   - ✅ Instant feedback
   - ✅ No spinning loaders (should complete <1s)

### Memory Usage
1. Open DevTools → Memory
2. Take heap snapshot before login
3. Login and use admin panel
4. Take heap snapshot after
5. **Expected**: Memory usage is reasonable (< 100MB growth)

---

## ✅ Final Verification

After all tests, verify:

- ✅ All features working
- ✅ No console errors (F12 → Console)
- ✅ No console warnings (should be clean)
- ✅ Responsive on mobile
- ✅ Responsive on tablet
- ✅ Responsive on desktop
- ✅ Smooth animations
- ✅ Quick load times
- ✅ Error handling works
- ✅ Data persists correctly

---

## 🎯 Test Results Documentation

Create a test results file:

```
Date: [Date]
Tester: [Name]
Browser: [Chrome/Firefox/Safari]
Device: [Desktop/Mobile/Tablet]

✅ Test 1: Admin Login - PASSED/FAILED
✅ Test 2: Navigation - PASSED/FAILED
✅ Test 3: Dashboard - PASSED/FAILED
✅ Test 4: User Management - PASSED/FAILED
✅ Test 5: Stock Management - PASSED/FAILED
✅ Test 6: Order Management - PASSED/FAILED
✅ Test 7: Discount Management - PASSED/FAILED
✅ Test 8: Settings - PASSED/FAILED
✅ Test 9: Logout - PASSED/FAILED
✅ Test 10: Responsive Design - PASSED/FAILED
✅ Test 11: Error Handling - PASSED/FAILED
✅ Test 12: Data Persistence - PASSED/FAILED

Overall Status: PASSED / NEEDS FIXES
Notes: [Any issues found]
```

---

## 🚀 Production Testing

Before going live:

1. **Load Testing**
   - Test with 100+ users
   - Verify performance
   - Check database load

2. **Security Testing**
   - Try SQL injection
   - Try XSS attacks
   - Try CSRF attacks
   - Verify protection

3. **Backup Testing**
   - Verify backups work
   - Test restore process
   - Verify data integrity

4. **Monitoring**
   - Setup error tracking
   - Setup performance monitoring
   - Setup security alerts

---

## 📞 If Tests Fail

### Common Issues and Solutions

**Issue**: OTP not appearing in console
- **Solution**: Check backend is running on port 5000
- **Check**: Terminal shows no errors
- **Restart**: Kill and restart backend

**Issue**: Cannot click Admin Login button
- **Solution**: Sidebar might not be visible
- **Check**: Scroll down in sidebar to Account section
- **Fix**: Refresh page if button missing

**Issue**: Module doesn't appear after toggle
- **Solution**: May need page refresh
- **Check**: Check Settings shows enabled
- **Try**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: Data doesn't save
- **Solution**: Check network tab for failed requests
- **Check**: Backend console for errors
- **Try**: Verify MongoDB connection

---

## 🎉 Success Criteria Met

When all tests pass, you have:

✅ Fully functional admin panel
✅ Secure OTP authentication
✅ Working user management
✅ Working stock management
✅ Working order management
✅ Working discount management
✅ Dynamic module control
✅ Employee permission management
✅ Responsive design
✅ Error handling
✅ Data persistence
✅ Production-ready code

**The admin panel is ready for deployment!** 🎊

---

**Happy Testing!** 🧪
