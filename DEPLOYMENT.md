# 🚀 Complete Production Deployment Guide

## Overview
This guide covers deploying the MovieStream application with:
- **Backend**: Ubuntu VM (172.237.44.29:5000)
- **Frontend**: Vercel
- **Database**: Aiven MySQL (already configured)

## 🖥️ Backend Deployment (Ubuntu VM)

### Step 1: Upload Backend to VM

```bash
# On your local machine, create a deployment package
cd movie-streaming-app
tar -czf backend.tar.gz backend/

# Upload to VM (replace with your method)
scp backend.tar.gz root@172.237.44.29:~/
```

### Step 2: Deploy on VM

```bash
# SSH into VM
ssh root@172.237.44.29

# Extract and setup
cd ~
tar -xzf backend.tar.gz
cd backend

# Make deploy script executable and run
chmod +x deploy-vm.sh
./deploy-vm.sh
```

The script will:
- ✅ Install Node.js and dependencies
- ✅ Configure firewall (port 5000)
- ✅ Test server functionality
- ✅ Setup PM2 for process management
- ✅ Configure auto-startup
- ✅ Test external access

### Step 3: Verify Backend

```bash
# Test locally on VM
curl http://localhost:5000/health

# Test externally
curl http://172.237.44.29:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "MovieStream API Server is running",
  "environment": "production",
  "timestamp": "2024-03-13T..."
}
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Environment Variables

In Vercel dashboard, add these environment variables:

```
VITE_API_BASE_URL=http://172.237.44.29:5000/api
VITE_TMDB_API_KEY=d976eef58afb6f80e41aff9983a59683
```

### Step 2: Deploy to Vercel

**Option A: Automatic (Recommended)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `NishanBajagain-NB/-MovieStream`
4. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add environment variables
6. Deploy

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd movie-streaming-app
vercel --prod
```

### Step 3: Update CORS (Important!)

After getting your Vercel URL (e.g., `https://your-app.vercel.app`):

```bash
# SSH into VM
ssh root@172.237.44.29

# Update backend environment
cd ~/backend
nano .env

# Update this line:
FRONTEND_URL=https://your-vercel-app.vercel.app

# Restart backend
pm2 restart moviestream-backend
```

## 🔧 Production Configuration

### Backend Features
- ✅ Production-ready CORS configuration
- ✅ Security headers (Helmet)
- ✅ Rate limiting
- ✅ Request logging
- ✅ Error handling
- ✅ PM2 process management
- ✅ Auto-restart on crashes
- ✅ SSL database connection

### Frontend Features
- ✅ Optimized Vite build
- ✅ Code splitting
- ✅ Security headers
- ✅ SPA routing
- ✅ Error boundaries
- ✅ Connection testing
- ✅ CORS debugging tools

## 🧪 Testing Checklist

### Backend Tests
- [ ] Health check: `curl http://172.237.44.29:5000/health`
- [ ] API endpoints: `curl http://172.237.44.29:5000/api/movies`
- [ ] CORS headers: Check browser network tab
- [ ] PM2 status: `pm2 status`
- [ ] Logs: `pm2 logs moviestream-backend`

### Frontend Tests
- [ ] Homepage loads
- [ ] Movies display correctly
- [ ] Search functionality works
- [ ] Admin login works
- [ ] CORS test passes
- [ ] Connection test passes

### Full Integration Tests
- [ ] Browse movies from frontend
- [ ] Search movies
- [ ] Admin panel access
- [ ] Add/edit/delete movies
- [ ] Ads management
- [ ] Site settings

## 🚨 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
pm2 status

# View logs
pm2 logs moviestream-backend

# Restart backend
pm2 restart moviestream-backend

# Check firewall
sudo ufw status

# Test database connection
cd ~/backend && node -e "require('./database/connection').testConnection()"
```

### Frontend Issues
- Check Vercel deployment logs
- Verify environment variables
- Test API connection with browser dev tools
- Use CORS Test component on homepage

### CORS Issues
- Ensure FRONTEND_URL is set correctly in backend .env
- Check browser console for CORS errors
- Verify PM2 restarted after .env changes

## 📊 Monitoring

### Backend Monitoring
```bash
# PM2 monitoring
pm2 monit

# System resources
htop

# Disk space
df -h

# Network connections
netstat -tulpn | grep :5000
```

### Frontend Monitoring
- Vercel Analytics (if enabled)
- Browser dev tools
- Connection test component

## 🔒 Security Considerations

### Backend Security
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ JWT authentication
- ✅ Input validation
- ✅ SSL database connection

### Frontend Security
- ✅ Environment variables for sensitive data
- ✅ No hardcoded secrets
- ✅ Security headers via Vercel
- ✅ HTTPS only in production

## 🎯 Performance Optimization

### Backend
- ✅ Database connection pooling
- ✅ Response compression
- ✅ Efficient queries
- ✅ Caching headers

### Frontend
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Bundle optimization

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review logs (PM2 for backend, Vercel for frontend)
3. Test individual components
4. Verify environment variables

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Backend health check returns 200
- ✅ Frontend loads without errors
- ✅ Movies display on homepage
- ✅ Search functionality works
- ✅ Admin login successful
- ✅ CORS test passes
- ✅ All admin features functional