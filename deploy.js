const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Deploying to GitHub Pages...');
  process.chdir(path.join(__dirname, 'build'));
  
  // Initialize git in build directory
  execSync('git init', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  execSync('git branch -M gh-pages', { stdio: 'inherit' });
  execSync('git remote add origin https://github.com/Vikas0401/Hotel_management.git', { stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { stdio: 'inherit' });
  
  console.log('Deployment successful!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}