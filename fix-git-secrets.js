#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing Git Secrets Issue...\n');

try {
  // Check if we're in a git repository
  execSync('git status', { stdio: 'ignore' });
  
  console.log('📋 Steps to fix the secret scanning issue:\n');
  
  console.log('1. 🗑️  Remove the problematic commit from history:');
  console.log('   git reset --soft HEAD~1');
  console.log('   git reset HEAD .');
  console.log('');
  
  console.log('2. 🔍 Verify .env files are ignored:');
  console.log('   git status');
  console.log('   (Should not show backend/.env or any .env files)');
  console.log('');
  
  console.log('3. ✅ Add files again (without secrets):');
  console.log('   git add .');
  console.log('');
  
  console.log('4. 💾 Commit again:');
  console.log('   git commit -m "Initial commit: MovieStream (secrets removed)"');
  console.log('');
  
  console.log('5. 🚀 Push to GitHub:');
  console.log('   git push origin main');
  console.log('');
  
  console.log('🔒 Security Check:');
  
  // Check if .env files exist and warn
  const envFiles = [
    'backend/.env',
    '.env'
  ];
  
  let hasSecrets = false;
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('AVNS_') || content.includes('streaming-ayushmabajagain')) {
        console.log(`❌ ${file} still contains real credentials!`);
        hasSecrets = true;
      } else {
        console.log(`✅ ${file} looks safe (no real credentials detected)`);
      }
    }
  }
  
  if (hasSecrets) {
    console.log('\n⚠️  WARNING: Some files still contain real credentials.');
    console.log('   Please replace them with placeholder values before committing.');
  } else {
    console.log('\n✅ All files look safe to commit!');
  }
  
  console.log('\n📝 Note: Your real credentials are still in the files for local development,');
  console.log('   but they should now be placeholder values that are safe to commit.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\nMake sure you\'re in the project directory and have git initialized.');
}