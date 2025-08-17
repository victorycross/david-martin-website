# GitHub OAuth Setup for Decap CMS

## 📋 Step-by-Step GitHub OAuth Configuration

### Step 1: Create GitHub OAuth Application

1. **Navigate to GitHub OAuth Apps**:
   ```
   https://github.com/settings/applications/new
   ```

2. **Fill in Application Details**:
   ```
   Application name: David Martin Website CMS
   Homepage URL: https://david-martin.ca
   Application description: Content management system for david-martin.ca
   Authorization callback URL: https://api.netlify.com/auth/done
   ```

3. **Click "Register application"**

4. **Copy your credentials**:
   - **Client ID**: `Iv1.xxxxxxxxxx` (public, safe to share)
   - **Client Secret**: `xxxxxxxxxxxx` (private, keep secure!)

### Step 2: Choose Deployment Platform

#### Option A: Netlify (Recommended) ⭐

**Benefits:**
- Built-in GitHub OAuth support
- Serverless functions included
- Free tier available
- Better performance than GitHub Pages

**Setup:**
```bash
# Deploy to Netlify with OAuth
npm run cms:deploy:netlify

# Or manually:
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Environment Variables** (Set in Netlify Dashboard):
```
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

#### Option B: GitHub Pages + OAuth Proxy

**Benefits:**
- Keep current GitHub Pages hosting
- Free hosting
- Custom domain support

**Limitations:**
- Requires external OAuth service
- More complex setup

**Setup:**
```bash
# Deploy to GitHub Pages
npm run cms:deploy:github

# Set up separate OAuth proxy on Netlify
# (Follow Netlify setup above for auth only)
```

### Step 3: Configure OAuth Callback URLs

Update your GitHub OAuth app based on your deployment:

#### For Netlify:
```
Authorization callback URL: https://your-site.netlify.app/api/auth
```

#### For GitHub Pages + Netlify Proxy:
```
Authorization callback URL: https://your-oauth-proxy.netlify.app/api/auth
```

### Step 4: Update CMS Configuration

**For Production (remove local backend):**

Edit `/public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: victorycross/david-martin-website
  branch: cms-redesign
  base_url: https://david-martin.ca  # Your site URL
  auth_endpoint: /api/auth
  # Remove or comment out local_backend: true
```

**For Local Development:**
```yaml
local_backend: true  # Keep this for local testing
```

### Step 5: Test Authentication

1. **Build and deploy your site**:
   ```bash
   npm run build
   npm run deploy  # or your deployment method
   ```

2. **Visit your admin panel**:
   ```
   https://david-martin.ca/admin
   ```

3. **Click "Login with GitHub"**

4. **Authorize the application**

5. **Start managing your content!**

## 🔧 Deployment Commands Reference

```bash
# Local development (no OAuth needed)
npm run cms:dev

# Deploy to Netlify with OAuth
npm run cms:deploy:netlify

# Deploy to GitHub Pages 
npm run cms:deploy:github

# Switch back to local development
npm run cms:local
```

## 🛠️ Troubleshooting OAuth Issues

### "Authorization callback URL mismatch"
- Check your GitHub OAuth app callback URL
- Ensure it matches your deployment URL
- Common formats:
  - Netlify: `https://site-name.netlify.app/api/auth`
  - Custom domain: `https://david-martin.ca/api/auth`

### "Client ID not found"
- Verify `GITHUB_CLIENT_ID` environment variable
- Check for typos in the client ID
- Ensure the OAuth app is registered

### "Access denied"
- Verify you have push access to the repository
- Check that the OAuth app is authorized
- Ensure the repository name matches the config

### "Cannot connect to GitHub"
- Check your internet connection
- Verify GitHub API is accessible
- Check browser console for detailed errors

### CMS loads but won't authenticate
1. Check browser network tab for failed requests
2. Verify OAuth app callback URL
3. Check environment variables are set
4. Ensure OAuth app is active (not suspended)

## 🔒 Security Best Practices

### Client Secret Security
- **Never commit client secret to Git**
- Store in environment variables only
- Rotate secrets regularly
- Use different apps for dev/prod

### Repository Access
- Only grant OAuth access to specific repositories
- Use fine-grained permissions when possible
- Regularly review OAuth app permissions
- Remove unused OAuth apps

### Branch Protection
- Enable branch protection on main branch
- Require pull request reviews
- Enable status checks
- Consider required reviewers

## 📊 Platform Comparison

| Feature | GitHub Pages | Netlify | Vercel |
|---------|-------------|---------|--------|
| OAuth Support | External proxy needed | Built-in | Built-in |
| Serverless Functions | No | Yes | Yes |
| Custom Domains | Yes | Yes | Yes |
| SSL/HTTPS | Yes | Yes | Yes |
| Build Time | ~2-5 mins | ~1-2 mins | ~30s-1 min |
| Cost | Free | Free tier | Free tier |

## 🚀 Production Checklist

- [ ] GitHub OAuth app created
- [ ] Client ID and Secret secured
- [ ] Deployment platform chosen
- [ ] Environment variables configured
- [ ] Callback URLs updated
- [ ] CMS configuration updated for production
- [ ] Site deployed and accessible
- [ ] Admin panel accessible
- [ ] OAuth login tested
- [ ] Content editing tested
- [ ] Branch protection enabled

## 📚 Additional Resources

- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [Decap CMS Authentication](https://decapcms.org/docs/authentication-backends/)
- [OAuth Security Best Practices](https://tools.ietf.org/html/rfc6749#section-10)

---

**Need Help?** The setup scripts will guide you through each step:
- `npm run cms:deploy:netlify` - Full Netlify setup
- `npm run cms:deploy:github` - GitHub Pages setup
- `npm run cms:local` - Local development