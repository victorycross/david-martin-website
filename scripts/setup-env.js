#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps configure environment variables for Decap CMS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🔧 Setting up environment variables for Decap CMS\n');
  
  console.log('📋 You need GitHub OAuth app credentials from:');
  console.log('   https://github.com/settings/applications/\n');

  try {
    // Get GitHub OAuth credentials
    const clientId = await askQuestion('Enter your GitHub Client ID: ');
    if (!clientId) {
      console.error('❌ Client ID is required');
      process.exit(1);
    }

    const clientSecret = await askQuestion('Enter your GitHub Client Secret: ');
    if (!clientSecret) {
      console.error('❌ Client Secret is required');
      process.exit(1);
    }

    // Create .env file content
    const envContent = `# GitHub OAuth Configuration for Decap CMS
# Generated on ${new Date().toISOString()}

GITHUB_CLIENT_ID=${clientId}
GITHUB_CLIENT_SECRET=${clientSecret}

# Site Configuration
VITE_SITE_URL=https://monumental-truffle-405167.netlify.app
VITE_CMS_BRANCH=cms-redesign

# Optional: Add analytics or other services below
# VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# VITE_SENTRY_DSN=your_sentry_dsn_here
`;

    // Write .env file
    const envPath = path.join(projectRoot, '.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Environment file created successfully!');
    console.log(`📄 File location: ${envPath}`);
    
    // Deploy with environment variables
    console.log('\n🚀 Next steps:');
    console.log('1. Deploy to Netlify with environment variables:');
    console.log('   npm run deploy:with-env');
    console.log('\n2. Update your GitHub OAuth app callback URL to:');
    console.log('   https://monumental-truffle-405167.netlify.app/api/auth');
    console.log('\n3. Test your CMS at:');
    console.log('   https://monumental-truffle-405167.netlify.app/admin');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();