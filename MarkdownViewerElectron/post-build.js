const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const distDir = path.join(__dirname, 'dist');

console.log('\n🔐 Starting post-build signing process...\n');

try {
  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    console.log('❌ dist directory not found. Build first.');
    process.exit(1);
  }

  // Change to dist directory and run sign-files
  process.chdir(distDir);
  
  console.log('📁 Working directory:', distDir);
  console.log('🔏 Running: sign-files sign all\n');
  
  execSync('sign-files sign all', { stdio: 'inherit' });
  
  console.log('\n✅ All files signed successfully!');
  console.log('📦 Ready for Microsoft Store submission\n');
  
} catch (error) {
  console.error('\n❌ Error during signing:', error.message);
  console.error('\nMake sure:');
  console.error('  1. sign-files command is available in your PATH');
  console.error('  2. Your code-signing certificate is properly configured');
  console.error('  3. You have permission to sign files\n');
  process.exit(1);
}
