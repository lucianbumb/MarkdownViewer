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

  const signSteps = [
    { dir: distDir, cmd: 'sign-files sign all' },
    { dir: path.join(distDir, 'win-unpacked'), cmd: 'sign-files sign exe' },
    { dir: path.join(distDir, 'win-unpacked', 'resources'), cmd: 'sign-files sign exe' },
  ];

  for (const step of signSteps) {
    if (!fs.existsSync(step.dir)) {
      continue;
    }

    process.chdir(step.dir);
    console.log('📁 Working directory:', step.dir);
    console.log(`🔏 Running: ${step.cmd}\n`);
    execSync(step.cmd, { stdio: 'inherit' });
    console.log('');
  }
  
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
