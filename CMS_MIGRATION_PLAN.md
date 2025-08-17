# Content Management System Migration Plan

## Current State Analysis
- **Current Setup**: Custom admin panel with direct GitHub API integration
- **Pain Points**: 
  - Manual GitHub token management
  - Complex save/update logic
  - No content versioning
  - Limited media management
  - Caching issues

## Proposed Architecture

### Phase 1: Content Structure Standardization
1. **Separate content from code**
   - Move all content to `/content` directory
   - Use standardized JSON/Markdown formats
   - Implement content schemas

2. **Create Content API Layer**
   - Unified interface for all content operations
   - Abstract storage mechanism
   - Support multiple backends (GitHub, CMS, Database)

### Phase 2: CMS Integration Options

#### Option A: Decap CMS (Recommended for GitHub Pages)
**Pros:**
- Git-based, works perfectly with GitHub Pages
- Visual editor interface
- No database required
- Free and open source
- OAuth authentication with GitHub

**Cons:**
- Requires Netlify Identity or custom OAuth app
- Limited to Git-based workflow

**Implementation:**
```yaml
# Already created at /public/admin/config.yml
backend:
  name: github
  repo: victorycross/david-martin-website
```

#### Option B: Strapi Headless CMS
**Pros:**
- Full-featured CMS with REST & GraphQL APIs
- Custom content types
- Media library built-in
- Role-based access control
- Self-hosted or cloud

**Cons:**
- Requires separate hosting
- Database required (PostgreSQL/MySQL/SQLite)
- More complex setup

#### Option C: Tina CMS
**Pros:**
- Git-based like Decap
- Visual editing on the actual site
- Real-time preview
- MDX support

**Cons:**
- Newer, less mature
- Requires build-time integration

### Phase 3: Implementation Steps

#### Step 1: Set up content structure
```bash
content/
├── pages/
│   ├── home.json
│   ├── about.json
│   └── contact.json
├── blog/
│   └── [markdown files]
├── projects/
│   └── [project files]
└── settings/
    └── site.json
```

#### Step 2: Create content schemas
```javascript
// schemas/page.schema.js
export const pageSchema = {
  title: { type: 'string', required: true },
  slug: { type: 'string', required: true },
  content: { type: 'blocks', required: true },
  seo: {
    title: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'image' }
  }
}
```

#### Step 3: Implement content hooks
```javascript
// Already created at /src/hooks/useContent.js
const { content, loading, error } = useContent('pages', 'home');
```

#### Step 4: Set up authentication
- For Decap CMS: GitHub OAuth App
- For Strapi: JWT or OAuth2
- For Tina: GitHub authentication

### Phase 4: Migration Process

1. **Export existing content**
   ```javascript
   // Export current content.json to new structure
   npm run migrate:export
   ```

2. **Transform content format**
   ```javascript
   // Transform to new schema
   npm run migrate:transform
   ```

3. **Import to new CMS**
   ```javascript
   // Import transformed content
   npm run migrate:import
   ```

### Phase 5: Testing & Deployment

1. **Test content operations**
   - Create, Read, Update, Delete
   - Media upload
   - Search functionality
   - Preview mode

2. **Performance optimization**
   - Static generation for content
   - CDN caching
   - Image optimization

3. **Deployment options**
   - GitHub Pages (static only)
   - Vercel/Netlify (with serverless functions)
   - Self-hosted (full-stack)

## Recommended Approach

For your use case (GitHub Pages, personal website), I recommend:

1. **Decap CMS** for content management
2. **GitHub as content storage**
3. **Static site generation** with Vite
4. **GitHub Actions** for automated deployment

This gives you:
- ✅ Visual content editor
- ✅ Version control for content
- ✅ No additional hosting costs
- ✅ Works with existing GitHub Pages setup
- ✅ Professional CMS experience

## Next Steps

1. Choose CMS option (Decap recommended)
2. Set up OAuth authentication
3. Migrate existing content
4. Test admin interface
5. Deploy to production

## Migration Commands

```bash
# Install dependencies
npm install decap-cms-app

# Set up OAuth (for Decap CMS)
# Create GitHub OAuth App:
# - Homepage URL: https://david-martin.ca
# - Callback URL: https://api.netlify.com/auth/done

# Run migration
npm run cms:migrate

# Test locally
npm run dev

# Deploy
npm run build && npm run deploy
```

## Timeline

- **Week 1**: Set up CMS infrastructure
- **Week 2**: Migrate content and test
- **Week 3**: Deploy and monitor

## Rollback Plan

If issues arise:
1. Git revert to previous commit
2. Restore original admin panel
3. Use backup content.json

## Support & Documentation

- [Decap CMS Docs](https://decapcms.org/docs/)
- [Strapi Docs](https://docs.strapi.io/)
- [Tina CMS Docs](https://tina.io/docs/)

---

**Decision Required**: Which CMS option would you like to proceed with?