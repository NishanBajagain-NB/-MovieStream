#!/bin/bash

echo "🚀 Quick Deploy MovieStream Backend to VM"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

VM_IP="172.237.44.29"
VM_USER="root"

echo -e "${BLUE}🎯 Target VM: ${VM_IP}${NC}"
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Backend directory not found!${NC}"
    echo "Please run this script from the movie-streaming-app directory"
    exit 1
fi

echo -e "${YELLOW}📦 Creating deployment package...${NC}"
tar -czf backend-deploy.tar.gz backend/

echo -e "${YELLOW}📤 Uploading to VM...${NC}"
if scp backend-deploy.tar.gz ${VM_USER}@${VM_IP}:~/; then
    echo -e "${GREEN}✅ Upload successful${NC}"
else
    echo -e "${RED}❌ Upload failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🚀 Deploying on VM...${NC}"
ssh ${VM_USER}@${VM_IP} << 'EOF'
echo "📦 Extracting files..."
cd ~
tar -xzf backend-deploy.tar.gz
cd backend

echo "🔧 Setting permissions..."
chmod +x deploy-vm.sh

echo "🚀 Running deployment..."
./deploy-vm.sh

echo ""
echo "✅ Deployment complete!"
echo "🔗 Backend URL: http://172.237.44.29:5000"
echo "🔗 API URL: http://172.237.44.29:5000/api"
echo "🔗 Health Check: http://172.237.44.29:5000/health"
echo ""
echo "🔐 Admin Credentials:"
echo "   Email: admin@nishanbajagain.com.np"
echo "   Password: Nishan1010@@##$$__"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 VM deployment completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}🧪 Test your backend:${NC}"
    echo "   curl http://${VM_IP}:5000/health"
    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo "1. Test backend: curl http://${VM_IP}:5000/health"
    echo "2. Update frontend .env to use VM backend"
    echo "3. Deploy frontend to Vercel"
    echo "4. Update CORS with your Vercel URL"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Cleanup
rm -f backend-deploy.tar.gz
echo -e "${GREEN}🧹 Cleanup completed${NC}"