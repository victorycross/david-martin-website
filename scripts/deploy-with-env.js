#!/usr/bin/env node

/**
 * Deploy with Environment Variables
 * Automatically sets environment variables in Netlify and deploys
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

async function loadEnvFile() {
  const envPath = path.join(projectRoot, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Run: npm run setup:env');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
    }
  });

  return envVars;
}

async function setNetlifyEnvVars(envVars) {
  console.log('🔧 Setting environment variables in Netlify...');
  
  for (const [key, value] of Object.entries(envVars)) {
    if (key.startsWith('GITHUB_') || key.startsWith('VITE_')) {
      try {
        console.log(`   Setting ${key}...`);
        await execAsync(`netlify env:set ${key} "${value}"`);
      } catch (error) {
        console.warn(`⚠️  Failed to set ${key}: ${error.message}`);
      }
    }
  }
}

async function deployToNetlify() {
  console.log('🚀 Building and deploying to Netlify...');
  
  try {
    const { stdout } = await execAsync('netlify deploy --prod --dir=dist');
    console.log(stdout);
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Deploying with environment variables...\n');

  try {
    // Load environment variables
    const envVars = await loadEnvFile();
    console.log(`✅ Loaded ${Object.keys(envVars).length} environment variables`);

    // Set environment variables in Netlify
    await setNetlifyEnvVars(envVars);
    console.log('✅ Environment variables updated in Netlify');

    // Deploy to Netlify
    await deployToNetlify();
    console.log('✅ Deployment completed successfully!');

    // Show next steps
    console.log('\n🎯 Next steps:');
    console.log('1. Update GitHub OAuth callback URL:');
    console.log('   https://github.com/settings/applications/');
    console.log('   Set to: https://monumental-truffle-405167.netlify.app/api/auth');
    console.log('\n2. Test your CMS:');
    console.log('   https://monumental-truffle-405167.netlify.app/admin');

  } catch (error) {
    console.error('❌ Process failed:', error.message);
    process.exit(1);
  }
}

main();