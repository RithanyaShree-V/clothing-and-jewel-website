# Twilio SMS Setup Guide

## Overview
This guide helps you set up real SMS sending for admin OTP authentication using Twilio.

## What is Twilio?
Twilio is a cloud communications platform that allows you to send SMS, voice calls, and more. It offers:
- **Free Trial**: $15 free credit (enough for testing)
- **Pay-as-you-go**: $0.0075 per SMS after free credits
- **Easy Integration**: Simple API
- **Global Coverage**: Supports most countries

## Step 1: Create Twilio Account

1. **Visit Twilio Console**
   - Go to: https://www.twilio.com/console
   - Sign up with your email

2. **Verify Your Phone**
   - Twilio will send you a verification code
   - Enter the code to verify your account

3. **Get Free Trial Credits**
   - New accounts get ~$15 in free trial credits
   - Enough for testing 2000+ SMS

## Step 2: Get Your Credentials

1. **Find Your Account SID**
   - Go to: https://www.twilio.com/console
   - You'll see: **Account SID** (looks like: ACxxxxxxxxxxxxx)
   - Copy this value

2. **Get Your Auth Token**
   - Below Account SID, you'll see: **Auth Token** (looks like: 32-character string)
   - Click "Show" if hidden
   - Copy this value

3. **Get a Twilio Phone Number**
   - Go to: https://www.twilio.com/console/phone-numbers/incoming
   - Click: "Get your first Twilio phone number"
   - Choose a phone number (doesn't matter which one)
   - You'll get something like: +1234567890

## Step 3: Configure Backend

### 3.1 Update .env File

Open `backend/.env` and update:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_32_char_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

Replace with your actual values:
- `TWILIO_ACCOUNT_SID` → Your Account SID
- `TWILIO_AUTH_TOKEN` → Your Auth Token
- `TWILIO_PHONE_NUMBER` → Your Twilio phone number

### 3.2 Install Twilio Package

The package is already installed, but you can verify:

```bash
cd backend
npm list twilio
```

Should show: `twilio@4.x.x` (or higher)

## Step 4: Update Admin Phone

You can change which phone number can access admin panel:

1. Open: `backend/controllers/adminController.js`
2. Find: `const ADMIN_PHONE = '8438859659';`
3. Replace with your phone number (10 digits, no +91 prefix)
4. Example: `const ADMIN_PHONE = '9876543210';`

## Step 5: Test SMS Sending

### Method 1: Direct Testing

1. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Request OTP**
   - Go to admin login
   - Enter your phone number
   - Check your phone for SMS

3. **What You'll See**
   - Backend logs: `[REAL SMS] OTP sent via Twilio to XXXXX. Message SID: ...`
   - Your phone: SMS with OTP

### Method 2: Test via API

```bash
# Test OTP request
curl -X POST http://localhost:5000/api/admin/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'
```

## Troubleshooting

### SMS Not Received

**Problem 1: "TWILIO_ACCOUNT_SID not configured"**
- ✅ Solution: Check your `.env` file has correct values
- ✅ Restart backend: `npm start`

**Problem 2: Invalid phone number**
- ✅ Solution: Use format with country code (+91 for India)
- ✅ Example: `+919876543210`

**Problem 3: Twilio says "phone number is not verified"**
- ✅ Solution: Verify your phone in Twilio console
- ✅ Go to: https://www.twilio.com/console/phone-numbers/verified

**Problem 4: "Authentication failed"**
- ✅ Solution: Check TWILIO_AUTH_TOKEN is correct
- ✅ Go to: https://www.twilio.com/console to verify

### Free Credits Running Out?

1. Check balance: https://www.twilio.com/console/billing/overview
2. Add payment method for continued service
3. SMS rates: $0.0075 per message in most countries

## Code Changes Made

### Backend Changes

**File**: `backend/controllers/adminController.js`

```javascript
// Initialize Twilio
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send OTP via SMS
const sendOTP = async (phoneNumber, otp) => {
  try {
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      const message = await twilioClient.messages.create({
        body: `Your admin login OTP is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phoneNumber}`
      });
      console.log(`[REAL SMS] OTP sent via Twilio`);
      return true;
    } else {
      console.log(`[MOCK SMS] OTP sent to ${phoneNumber}: ${otp}`);
      return true;
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};
```

## Key Files Updated

| File | Change |
|------|--------|
| `backend/.env` | Added Twilio credentials |
| `backend/controllers/adminController.js` | Integrated real SMS sending |
| `backend/package.json` | Added twilio package |

## Security Notes

⚠️ **Important Security Tips:**

1. **Never commit `.env` to Git**
   - Add `.env` to `.gitignore`
   - Your credentials are sensitive!

2. **In Production**:
   - Use environment variables or secrets manager
   - Never hardcode credentials
   - Use separate Twilio account for production

3. **Rate Limiting**
   - Add rate limiting to prevent OTP abuse
   - Current: 5 attempts per OTP

4. **Country Code**
   - Current setup uses +91 (India)
   - Change if using different country
   - Update in: `adminController.js` line that says `+91${phoneNumber}`

## FAQ

### Q: How much does SMS cost?
**A**: $0.0075 per SMS in most countries. Free trial includes $15 credit.

### Q: Can I use Twilio for production?
**A**: Yes! Twilio is production-ready and used by millions of apps.

### Q: How do I change the SMS message?
**A**: Edit in `adminController.js`, line with `body:` parameter.

### Q: Can I use international numbers?
**A**: Yes, but update country code from +91 to your country code.

### Q: What if I don't want real SMS?
**A**: Leave `.env` without Twilio credentials. System will mock SMS (log to console).

## Next Steps

1. ✅ Create Twilio account
2. ✅ Get credentials (Account SID, Auth Token, Phone Number)
3. ✅ Update `.env` file
4. ✅ Restart backend
5. ✅ Test OTP sending
6. ✅ Verify SMS received
7. ✅ Login to admin panel

## Support

- Twilio Docs: https://www.twilio.com/docs/sms
- Twilio Console: https://www.twilio.com/console
- Twilio Support: https://support.twilio.com

---

**Status**: ✅ Real SMS Integration Ready

Your system is now configured to send real SMS. Just add your Twilio credentials to `.env` and you're all set!
