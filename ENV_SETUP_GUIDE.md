# 🔧 Environment Variables Setup Guide

## Quick Setup (Recommended)

Run the interactive setup script:

```bash
npm run setup:env
```

This will:
1. Prompt for your GitHub OAuth credentials
2. Create a `.env` file with your settings
3. Show you the next steps

## Manual Setup

### 1. Create Environment File

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your GitHub OAuth app credentials:

```env
# GitHub OAuth Configuration for Decap CMS
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here

# Site Configuration
VITE_SITE_URL=https://monumental-truffle-405167.netlify.app
VITE_CMS_BRANCH=cms-redesign
```

### 2. Get GitHub OAuth Credentials

1. **Go to**: https://github.com/settings/applications/
2. **Find your app**: "David Martin Website CMS"
3. **Copy**:
   - Client ID (starts with `Iv1.`)
   - Client Secret (click "Generate a new client secret" if needed)

### 3. Deploy with Environment Variables

```bash
npm run deploy:with-env
```

This automatically:
- Sets environment variables in Netlify
- Builds and deploys your site
- Shows you next steps

## Manual Netlify Environment Setup

If you prefer to set variables manually in Netlify dashboard:

1. **Go to**: https://app.netlify.com/projects/monumental-truffle-405167/configuration/general
2. **Click**: "Environment variables"
3. **Add**:
   ```
   GITHUB_CLIENT_ID = your_client_id
   GITHUB_CLIENT_SECRET = your_client_secret
   ```
4. **Deploy**: `netlify deploy --prod --dir=dist`

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` (won't be committed)
- ✅ Environment variables are encrypted in Netlify
- ✅ Client secret is never exposed to frontend
- ✅ OAuth flow is handled server-side

## 📋 Complete Deployment Checklist

### ✅ Prerequisites
- [ ] GitHub OAuth app created
- [ ] Repository cloned locally
- [ ] Dependencies installed (`npm install`)

### ✅ Environment Setup
- [ ] `.env` file created with credentials
- [ ] Environment variables set in Netlify
- [ ] Site built and deployed

### ✅ OAuth Configuration
- [ ] GitHub OAuth callback URL updated to:
  ```
  https://monumental-truffle-405167.netlify.app/api/auth
  ```

### ✅ Testing
- [ ] Website loads: https://monumental-truffle-405167.netlify.app
- [ ] CMS loads: https://monumental-truffle-405167.netlify.app/admin
- [ ] GitHub login works
- [ ] Content editing functional

## 🛠️ Available Commands

```bash
# Environment setup
npm run setup:env              # Interactive environment setup
npm run deploy:with-env        # Deploy with automatic env var setup

# Development
npm run cms:dev               # Local development with CMS proxy
npm run dev                   # Standard development server

# Deployment
npm run build                 # Build for production
netlify deploy --prod --dir=dist  # Deploy to Netlify

# CMS Management
npm run cms:local             # Switch to local development
npm run migrate               # Migrate content (if needed)
```

## 🚨 Troubleshooting

### Environment variables not working
```bash
# Check if .env file exists and has correct format
cat .env

# Check if variables are set in Netlify
netlify env:list
```

### OAuth login fails
1. Verify callback URL in GitHub OAuth app
2. Check environment variables are set
3. Ensure you have repository access
4. Check browser console for errors

### Deployment fails
```bash
# Check Netlify status
netlify status

# Re-authenticate if needed
netlify login

# Try manual deployment
netlify deploy --prod --dir=dist
```

---

**Ready to set up your environment? Run `npm run setup:env` to get started!**