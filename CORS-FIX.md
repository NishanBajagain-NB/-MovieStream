# 🔧 CORS Fix for Backend Server

## Problem
Your frontend (running on Vercel or localhost) cannot connect to your backend on the VM (172.237.44.29:5000) due to CORS (Cross-Origin Resource Sharing) restrictions.

## Solution: Update Backend CORS Configuration

### Step 1: SSH into your VM

```bash
ssh root@172.237.44.29
```

### Step 2: Navigate to Backend Directory

```bash
cd ~/backend
```

### Step 3: Update server.js

Edit your `server.js` file:

```bash
nano server.js
```

### Step 4: Add CORS Configuration

Add this code **AFTER** your imports and **BEFORE** your routes:

```javascript
// CORS Configuration - Add this after imports, before routes
app.use((req, res, next) => {
  // Allow requests from any origin (for development)
  // For production, replace '*' with your specific domain
  res.header('Access-Control-Allow-Origin', '*');
  
  // For production with specific domain:
  // res.header('Access-Control-Allow-Origin', 'https://your-vercel-app.vercel.app');
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Alternative: Using cors package (if you have it installed)
// const cors = require('cors');
// app.use(cors({
//   origin: '*', // or your specific domain
//   credentials: true
// }));
```

### Step 5: Restart Backend Server

```bash
# If running with PM2
pm2 restart moviestream-backend

# Or if running manually
# Stop current process (Ctrl+C) then:
npm start
```

### Step 6: Test Connection

Visit your frontend and use the CORS Test component to verify the connection works.

## Alternative: Install and Use CORS Package

If you prefer using the official CORS package:

```bash
# Install cors package
npm install cors

# Then in server.js, add:
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-vercel-app.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Production Security

For production, replace `'*'` with your actual domain:

```javascript
// Development
res.header('Access-Control-Allow-Origin', '*');

// Production
res.header('Access-Control-Allow-Origin', 'https://your-vercel-app.vercel.app');
```

## Verification

After applying the fix:

1. ✅ Backend should respond to OPTIONS requests
2. ✅ Frontend should connect successfully
3. ✅ CORS Test component should show green success
4. ✅ Movies should load on homepage
5. ✅ Admin login should work

## Troubleshooting

If still not working:

1. **Check if backend is running**: `curl http://172.237.44.29:5000/health`
2. **Check firewall**: Ensure port 5000 is open
3. **Check logs**: Look at backend console for errors
4. **Test with curl**:
   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -X OPTIONS \
        http://172.237.44.29:5000/api/movies
   ```

The response should include CORS headers like:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`