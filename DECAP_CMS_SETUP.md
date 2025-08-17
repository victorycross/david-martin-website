# Decap CMS Setup Guide

## ✅ What's Been Completed

1. **Decap CMS Installation** - Visual content management interface
2. **Content Migration** - All existing content converted to new structure
3. **Local Development Setup** - Proxy server for testing without OAuth
4. **Content API Layer** - Unified interface for content operations
5. **React Hooks** - Easy content management in components

## 🚀 Quick Start (Local Development)

### Test the CMS Locally (No GitHub OAuth needed)

```bash
# Start local CMS with proxy
npm run cms:dev

# Or start components separately:
npm run cms:proxy  # In one terminal
npm run dev        # In another terminal
```

Then visit:
- **CMS Admin**: http://localhost:5173/admin
- **Website**: http://localhost:5173

## 🔧 GitHub OAuth Setup (For Production)

To use the CMS in production, you need to set up GitHub OAuth:

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Fill in the details:
   ```
   Application name: David Martin Website CMS
   Homepage URL: https://david-martin.ca
   Authorization callback URL: https://api.netlify.com/auth/done
   ```
3. Click "Register application"
4. Note down your **Client ID** and **Client Secret**

### Step 2: Deploy to Production

#### Option A: Deploy to Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy

# Set environment variables in Netlify dashboard:
# GITHUB_CLIENT_ID=your_client_id
# GITHUB_CLIENT_SECRET=your_client_secret

# Deploy to production
netlify deploy --prod
```

#### Option B: Deploy to GitHub Pages with OAuth Proxy

Since GitHub Pages doesn't support serverless functions, you'll need:
1. A separate OAuth proxy service (Netlify Functions, Vercel, etc.)
2. Update `config.yml` with your proxy URL

### Step 3: Update CMS Configuration

For production, update `/public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: victorycross/david-martin-website
  branch: cms-redesign
  # Remove local_backend: true for production
```

## 📁 Content Structure

Your content is now organized as:

```
content/
├── pages/          # Website pages (Home, About, etc.)
├── blog/           # Essays and blog posts
├── music/          # Music compositions
├── ideas/          # Ideas in progress
├── observations/   # Quick thoughts
└── settings/       # Site configuration
```

## 🎯 Using the CMS

### Content Types Available:

1. **📄 Pages** - Main website pages
   - Home, About, Work, Coaching, Contact, Music

2. **📝 Essays & Blog** - Written content
   - Markdown support
   - Tags and categories
   - Draft/Published status

3. **🎼 Music Compositions** - Musical works
   - Metadata (instrument, duration)
   - Audio file uploads

4. **💡 Ideas in Progress** - Project tracking
   - Status tracking
   - Development notes

5. **🔍 Observations** - Quick insights
   - Date-based
   - Tagging system

6. **⚙️ Site Settings** - Global configuration
   - Contact information
   - Social links
   - Site metadata

### Editorial Workflow

The CMS supports a full editorial workflow:
- **Draft** → **In Review** → **Ready** → **Published**
- Pull request-based publishing
- Content previews before going live

## 🛠️ Development Commands

```bash
# Content migration (if needed)
npm run migrate

# Local CMS development
npm run cms:dev

# CMS proxy only
npm run cms:proxy

# Regular development
npm run dev

# Build for production
npm run build
```

## 🎨 Customizing the CMS

### Adding New Content Types

Edit `/public/admin/config.yml`:

```yaml
collections:
  - name: "testimonials"
    label: "💬 Testimonials"
    folder: "content/testimonials"
    create: true
    fields:
      - { label: "Name", name: "name", widget: "string" }
      - { label: "Quote", name: "quote", widget: "text" }
      - { label: "Company", name: "company", widget: "string" }
```

### Custom Widgets

You can add custom widgets for specialized content:

```yaml
fields:
  - label: "Color Picker"
    name: "color"
    widget: "color"
  - label: "Date Range"
    name: "dateRange"
    widget: "daterange"
```

## 🔒 Security Features

- **GitHub OAuth** - Secure authentication
- **Repository Permissions** - Only collaborators can edit
- **Editorial Workflow** - Review before publish
- **Branch Protection** - Changes via pull requests
- **Git History** - Full version control

## 🚦 Deployment Options

### Current Setup (GitHub Pages)
- Free hosting
- Automatic deploys on push
- Custom domain support
- Limited to static sites

### Recommended Upgrade (Netlify)
- CMS authentication built-in
- Form handling
- Serverless functions
- Better performance

### Alternative (Vercel)
- Similar to Netlify
- Excellent Next.js integration
- Global CDN

## 📊 Content API Usage

Use the content hooks in your React components:

```jsx
import { useContent, useContentList } from '../hooks/useContent'

// Single content item
const { content, loading, error } = useContent('pages', 'home')

// List of content
const { items, loading, hasMore } = useContentList('blog', { limit: 10 })

// Save content
const { save, saving } = useSaveContent()
await save('pages', 'home', updatedData)
```

## 🐛 Troubleshooting

### CMS Won't Load
- Check if proxy server is running (`npm run cms:proxy`)
- Verify config.yml syntax
- Check browser console for errors

### Authentication Issues
- Verify GitHub OAuth app settings
- Check callback URL matches
- Ensure user has repository access

### Content Not Saving
- Check GitHub token permissions
- Verify repository write access
- Look for merge conflicts

## 📚 Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Netlify CMS Migration](https://decapcms.org/docs/netlify-cms-migration/)

---

**Next Steps:**
1. Test locally with `npm run cms:dev`
2. Set up GitHub OAuth for production
3. Choose deployment platform (Netlify recommended)
4. Customize content types as needed