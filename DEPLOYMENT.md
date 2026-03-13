# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NishanBajagain-NB/-MovieStream)

## Manual Deployment

### 1. Vercel Configuration

The project is already configured for Vercel deployment with:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework Preset**: Vite

### 2. Environment Variables

In your Vercel dashboard, add these environment variables:

```
VITE_API_BASE_URL=http://172.237.44.29:5000/api
VITE_TMDB_API_KEY=d976eef58afb6f80e41aff9983a59683
```

### 3. Deploy Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `NishanBajagain-NB/-MovieStream`

2. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - In project settings, add the environment variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### 4. Backend Connection

The frontend is configured to connect to your backend server at:
- **Backend URL**: `http://172.237.44.29:5000`
- **API Endpoint**: `http://172.237.44.29:5000/api`

Make sure your backend server is running on the VM before testing the deployed frontend.

### 5. Testing

After deployment:
1. Visit your Vercel URL
2. Test movie browsing and search
3. Test admin login with: `admin@nishanbajagain.com.np` / `Nishan1010@@##$$__`
4. Verify all features work with the VM backend

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly

### API Connection Issues
- Ensure backend server is running on VM
- Check CORS settings on backend allow your Vercel domain
- Verify firewall allows connections to port 5000

### 404 Errors
- The `vercel.json` file handles SPA routing
- All routes should redirect to `index.html`

## Production Checklist

- ✅ Backend deployed on VM (172.237.44.29:5000)
- ✅ Frontend repository cleaned up
- ✅ Environment variables configured
- ✅ Vercel deployment configured
- ✅ CORS settings updated for production domain
- ✅ All sensitive data removed from repository