#!/bin/bash

echo "🚀 Deploying MovieStream Backend to Ubuntu VM"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo -e "${RED}❌ Error: backend/server.js not found. Run this script from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Step 1: Installing backend dependencies...${NC}"
cd backend
npm install

echo -e "${YELLOW}📋 Step 2: Creating production environment file...${NC}"
cat > .env.production << EOF
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
EOF

echo -e "${YELLOW}📋 Step 3: Testing backend server...${NC}"
timeout 10s node server.js &
SERVER_PID=$!
sleep 3

if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server test successful!${NC}"
    kill $SERVER_PID 2>/dev/null
else
    echo -e "${RED}❌ Backend server test failed!${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo -e "${YELLOW}📋 Step 4: Setting up PM2...${NC}"
# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Stop existing process if running
pm2 stop moviestream-backend 2>/dev/null || true
pm2 delete moviestream-backend 2>/dev/null || true

# Start new process
pm2 start server.js --name "moviestream-backend" --env production

# Save PM2 configuration
pm2 save

echo -e "${YELLOW}📋 Step 5: Setting up PM2 startup...${NC}"
pm2 startup | grep "sudo" | bash

echo -e "${GREEN}🎉 Backend deployment completed!${NC}"
echo ""
echo -e "${YELLOW}📊 Backend Status:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}🔗 Backend URLs:${NC}"
echo "   Health Check: http://localhost:5000/health"
echo "   API Base: http://localhost:5000/api"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update your Vercel frontend environment variables"
echo "2. Set VITE_API_BASE_URL to your VM's public IP or domain"
echo "3. Configure firewall to allow port 5000"
echo "4. Optional: Set up Nginx reverse proxy"
echo ""
echo -e "${YELLOW}🔧 Useful Commands:${NC}"
echo "   pm2 status                    # Check status"
echo "   pm2 logs moviestream-backend  # View logs"
echo "   pm2 restart moviestream-backend # Restart"
echo ""