#!/bin/bash

echo "🚀 Deploying MovieStream Backend to Ubuntu VM"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get VM IP
VM_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "172.237.44.29")

echo -e "${BLUE}🌐 VM IP Address: ${VM_IP}${NC}"
echo ""

echo -e "${YELLOW}📋 Step 1: System Updates...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}📋 Step 2: Installing Node.js and npm...${NC}"
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo -e "${YELLOW}📋 Step 3: Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}📋 Step 4: Setting up firewall...${NC}"
sudo ufw allow 5000/tcp
sudo ufw allow ssh
sudo ufw --force enable

echo -e "${YELLOW}📋 Step 5: Testing server...${NC}"
timeout 10s node server.js &
SERVER_PID=$!
sleep 5

if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Server test successful!${NC}"
    kill $SERVER_PID 2>/dev/null
else
    echo -e "${RED}❌ Server test failed!${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo -e "${YELLOW}📋 Step 6: Setting up PM2...${NC}"
# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Stop existing process if running
pm2 stop moviestream-backend 2>/dev/null || true
pm2 delete moviestream-backend 2>/dev/null || true

# Start new process with production environment
pm2 start server.js --name "moviestream-backend" --env production

# Save PM2 configuration
pm2 save

echo -e "${YELLOW}📋 Step 7: Setting up PM2 startup...${NC}"
pm2 startup | grep "sudo" | bash || true

echo -e "${YELLOW}📋 Step 8: Testing external access...${NC}"
sleep 3
if curl -s http://${VM_IP}:5000/health > /dev/null; then
    echo -e "${GREEN}✅ External access test successful!${NC}"
else
    echo -e "${YELLOW}⚠️  External access test failed - check firewall settings${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Backend deployment completed!${NC}"
echo ""
echo -e "${YELLOW}📊 Backend Status:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}🔗 Backend URLs:${NC}"
echo "   Local Health Check: http://localhost:5000/health"
echo "   External Health Check: http://${VM_IP}:5000/health"
echo "   API Base URL: http://${VM_IP}:5000/api"
echo ""
echo -e "${YELLOW}📋 Frontend Environment Variable:${NC}"
echo "   VITE_API_BASE_URL=http://${VM_IP}:5000/api"
echo ""
echo -e "${YELLOW}🔧 Useful Commands:${NC}"
echo "   pm2 status                    # Check status"
echo "   pm2 logs moviestream-backend  # View logs"
echo "   pm2 restart moviestream-backend # Restart"
echo "   pm2 monit                     # Monitor"
echo ""
echo -e "${BLUE}🚀 Next: Deploy frontend to Vercel with the API URL above${NC}"