#!/usr/bin/env node

/**
 * Local Decap CMS Proxy Server
 * Allows testing CMS without GitHub OAuth during development
 */

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🚀 Starting Decap CMS Proxy Server...');
console.log('📁 Project root:', projectRoot);

// Start the proxy server
const proxyServer = exec('npx decap-server', { cwd: projectRoot });

proxyServer.stdout.on('data', (data) => {
  console.log(`🖥️  Proxy: ${data.toString().trim()}`);
});

proxyServer.stderr.on('data', (data) => {
  console.error(`❌ Proxy Error: ${data.toString().trim()}`);
});

proxyServer.on('close', (code) => {
  console.log(`🔚 Proxy server exited with code ${code}`);
});

// Start the development server in parallel
setTimeout(() => {
  console.log('🌐 Starting Vite development server...');
  const devServer = exec('npm run dev', { cwd: projectRoot });

  devServer.stdout.on('data', (data) => {
    console.log(`🔧 Dev: ${data.toString().trim()}`);
  });

  devServer.stderr.on('data', (data) => {
    console.error(`❌ Dev Error: ${data.toString().trim()}`);
  });

  devServer.on('close', (code) => {
    console.log(`🔚 Dev server exited with code ${code}`);
    proxyServer.kill();
  });
}, 2000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down servers...');
  proxyServer.kill();
  process.exit(0);
});

console.log('✅ Servers starting...');
console.log('📝 CMS Admin: http://localhost:5173/admin');
console.log('🌐 Website: http://localhost:5173');
console.log('⚡ Use Ctrl+C to stop');