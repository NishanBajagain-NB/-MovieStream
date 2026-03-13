# 🖥️ Ubuntu VM Backend Setup Guide

## 📋 Prerequisites
- Ubuntu VM with sudo access
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy (optional)

## 🚀 Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (optional, for reverse proxy)
sudo apt install nginx -y
```

## 📁 Step 2: Deploy Backend Code

```bash
# Clone your repository
git clone https://github.com/NishanBajagain-NB/-MovieStream.git
cd -MovieStream/backend

# Install dependencies
npm install

# Create production environment file
nano .env.production
```

### Environment File (.env.production):
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (Replace with your actual values)
DB_HOST=your-database-host.com
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
DB_SSL=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password

# CORS Configuration (Update with your Vercel URL)
FRONTEND_URL=https://your-vercel-app.vercel.app

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 🔧 Step 3: Start Backend with PM2

```bash
# Start the backend server
pm2 start server.js --name "moviestream-backend" --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 🌐 Step 4: Configure Nginx (Optional but Recommended)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/moviestream-backend
```

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-vm-ip-or-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/moviestream-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Step 5: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 🔥 Step 6: Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 5000  # Backend (if not using Nginx)
sudo ufw enable
```

## 📊 Step 7: Monitor and Manage

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs moviestream-backend

# Restart backend
pm2 restart moviestream-backend

# Stop backend
pm2 stop moviestream-backend
```

## 🔄 Step 8: Auto-Deploy Script (Optional)

Create `deploy.sh`:
```bash
#!/bin/bash
cd /path/to/-MovieStream/backend
git pull origin main
npm install
pm2 restart moviestream-backend
echo "Backend deployed successfully!"
```

## 🎯 Your Backend URLs

After setup, your backend will be available at:
- **Direct**: `http://your-vm-ip:5000`
- **With Nginx**: `http://your-domain.com`
- **With SSL**: `https://your-domain.com`

## 🔧 Troubleshooting

### Check if backend is running:
```bash
curl http://localhost:5000/health
```

### Check PM2 logs:
```bash
pm2 logs moviestream-backend --lines 50
```

### Restart services:
```bash
pm2 restart moviestream-backend
sudo systemctl restart nginx
```

---

**Your backend will be running 24/7 on your Ubuntu VM with automatic restarts!** 🚀