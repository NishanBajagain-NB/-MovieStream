#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MovieStream in Production Mode...\n');

// Start backend server
console.log('📡 Starting Backend Server...');
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.error('❌ Backend Error:', error);
});

backend.on('close', (code) => {
  console.log(`🛑 Backend process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MovieStream...');
  backend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MovieStream...');
  backend.kill('SIGTERM');
  process.exit(0);
});