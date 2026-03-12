#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 MovieStream Vercel Deployment Helper\n');

// Check if vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually:');
    console.error('   npm install -g vercel');
    process.exit(1);
  }
}

// Check if project is ready for deployment
console.log('\n📋 Pre-deployment checks...');

const requiredFiles = [
  'vercel.json',
  'package.json',
  'backend/server.js',
  'src/App.jsx'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Please check your project structure.');
  process.exit(1);
}

// Build the project
console.log('\n🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed. Please fix build errors before deploying.');
  process.exit(1);
}

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('\n🎉 Deployment successful!');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Configure environment variables in Vercel dashboard');
  console.log('2. Test your deployment');
  console.log('3. Set up custom domain (optional)');
  console.log('\n📖 See VERCEL-DEPLOYMENT.md for detailed instructions');
  
} catch (error) {
  console.error('\n❌ Deployment failed. Please check the error messages above.');
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure you\'re logged in to Vercel: vercel login');
  console.log('2. Check your internet connection');
  console.log('3. Verify your project configuration');
}