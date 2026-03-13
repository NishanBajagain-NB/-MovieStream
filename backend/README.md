# 🖥️ MovieStream Backend - Ubuntu VM Deployment

## 📋 Quick Setup

### 1. Upload Backend to VM
```bash
# Option 1: Clone from GitHub (recommended)
git clone https://github.com/NishanBajagain-NB/-MovieStream.git
cd -MovieStream/backend

# Option 2: Upload just the backend folder via SCP
scp -r backend/ user@your-vm-ip:/home/user/moviestream-backend/
```

### 2. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 3. Deploy Backend
```bash
# Make deploy script executable
chmod +x deploy-vm.sh

# Run deployment
./deploy-vm.sh
```

### 4. Configure Firewall
```bash
# Allow backend port
sudo ufw allow 5000
sudo ufw enable

# Check status
sudo ufw status
```

### 5. Test Backend
```bash
# Test locally
curl http://localhost:5000/health

# Test from outside (replace with your VM IP)
curl http://YOUR_VM_IP:5000/health
```

## 🔧 Environment Configuration

The backend uses `.env.production` file with your real credentials:
- ✅ Aiven MySQL database
- ✅ Admin credentials
- ✅ JWT secrets
- ✅ CORS settings

## 📊 Management Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs moviestream-backend

# Restart backend
pm2 restart moviestream-backend

# Stop backend
pm2 stop moviestream-backend

# Monitor in real-time
pm2 monit
```

## 🌐 API Endpoints

After deployment, your backend will provide:
- **Health Check**: `http://YOUR_VM_IP:5000/health`
- **Movies API**: `http://YOUR_VM_IP:5000/api/movies`
- **Admin API**: `http://YOUR_VM_IP:5000/api/admin`
- **All APIs**: `http://YOUR_VM_IP:5000/api/*`

## 🔄 Auto-Restart

PM2 ensures your backend:
- ✅ Starts automatically on VM boot
- ✅ Restarts if it crashes
- ✅ Runs in production mode
- ✅ Logs all activity

## 🎯 Next Steps

1. **Deploy backend** on your Ubuntu VM
2. **Get your VM's public IP**
3. **Update frontend** environment variables
4. **Deploy frontend** on Vercel

Your backend will be running 24/7 on your VM! 🚀