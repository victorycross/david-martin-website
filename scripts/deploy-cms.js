#!/usr/bin/env node

/**
 * CMS Deployment Script
 * Handles deployment to different platforms with proper configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const CONFIG_FILE = path.join(projectRoot, 'public/admin/config.yml');

async function main() {
  const args = process.argv.slice(2);
  const platform = args[0] || 'github-pages';
  
  console.log(`🚀 Deploying CMS to: ${platform}`);

  try {
    switch (platform) {
      case 'netlify':
        await deployToNetlify();
        break;
      case 'github-pages':
        await deployToGitHubPages();
        break;
      case 'local':
        await setupLocalDevelopment();
        break;
      default:
        console.error('❌ Unknown platform. Use: netlify, github-pages, or local');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

async function deployToNetlify() {
  console.log('📦 Deploying to Netlify with OAuth support...');
  
  // Update config for Netlify
  updateConfigForPlatform('netlify');
  
  // Build the project
  await execAsync('npm run build');
  console.log('✅ Build completed');
  
  // Check if Netlify CLI is available
  try {
    await execAsync('netlify --version');
  } catch (error) {
    console.log('📥 Installing Netlify CLI...');
    await execAsync('npm install -g netlify-cli');
  }
  
  // Deploy to Netlify
  console.log('🌐 Deploying to Netlify...');
  const { stdout } = await execAsync('netlify deploy --prod --dir=dist');
  console.log(stdout);
  
  console.log(`
  ✅ Deployment to Netlify complete!
  
  📋 Next steps:
  1. Set environment variables in Netlify dashboard:
     - GITHUB_CLIENT_ID=your_github_client_id
     - GITHUB_CLIENT_SECRET=your_github_client_secret
  
  2. Update your GitHub OAuth app callback URL to:
     https://your-netlify-domain.netlify.app/api/auth
  
  3. Visit your admin panel at:
     https://your-netlify-domain.netlify.app/admin
  `);
}

async function deployToGitHubPages() {
  console.log('📦 Deploying to GitHub Pages...');
  
  // For GitHub Pages, we need a different OAuth setup
  updateConfigForPlatform('github-pages');
  
  // Build the project
  await execAsync('npm run build');
  console.log('✅ Build completed');
  
  // Deploy to GitHub Pages
  await execAsync('npm run deploy');
  console.log('✅ Deployed to GitHub Pages');
  
  console.log(`
  ⚠️  GitHub Pages OAuth Setup Required:
  
  Since GitHub Pages doesn't support serverless functions, you need:
  
  1. Deploy your auth proxy to Netlify (free):
     npm run cms:deploy netlify
  
  2. Update your CMS config to point to the Netlify auth endpoint
  
  3. Or use Netlify Identity (recommended):
     https://docs.netlify.com/visitor-access/identity/
  
  🔗 Alternative: Consider migrating to Netlify for full CMS support
  `);
}

async function setupLocalDevelopment() {
  console.log('🛠️  Setting up local development...');
  
  updateConfigForPlatform('local');
  
  console.log(`
  ✅ Local development configured!
  
  📋 To start developing:
  
  1. Start the CMS proxy and dev server:
     npm run cms:dev
  
  2. Visit your local admin panel:
     http://localhost:5173/admin
  
  3. No OAuth required for local development
  `);
}

function updateConfigForPlatform(platform) {
  let config = fs.readFileSync(CONFIG_FILE, 'utf8');
  
  switch (platform) {
    case 'netlify':
      config = config.replace(
        /# local_backend: true/g,
        '# local_backend: true  # Disabled for Netlify'
      );
      config = config.replace(
        /local_backend: true/g,
        '# local_backend: true  # Disabled for Netlify'
      );
      break;
      
    case 'github-pages':
      config = config.replace(
        /# local_backend: true/g,
        '# local_backend: true  # Disabled for GitHub Pages'
      );
      config = config.replace(
        /local_backend: true/g,
        '# local_backend: true  # Disabled for GitHub Pages'
      );
      // Add note about OAuth proxy needed
      if (!config.includes('# NOTE: GitHub Pages requires external OAuth proxy')) {
        config = config.replace(
          /auth_endpoint: \/api\/auth/g,
          'auth_endpoint: /api/auth\n  # NOTE: GitHub Pages requires external OAuth proxy'
        );
      }
      break;
      
    case 'local':
      config = config.replace(
        /# local_backend: true/g,
        'local_backend: true'
      );
      break;
  }
  
  fs.writeFileSync(CONFIG_FILE, config);
  console.log(`✅ Updated config for ${platform}`);
}

// Run the script
main();