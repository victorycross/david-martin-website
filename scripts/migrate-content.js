#!/usr/bin/env node

/**
 * Content Migration Script
 * Converts existing content.json to new Decap CMS structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Source and destination paths
const sourceFile = path.join(projectRoot, 'src/data/content.json');
const contentDir = path.join(projectRoot, 'content');

async function migrate() {
  console.log('🚀 Starting content migration...');

  try {
    // Read existing content
    if (!fs.existsSync(sourceFile)) {
      console.error('❌ Source content.json not found at:', sourceFile);
      process.exit(1);
    }

    const existingContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    console.log('✅ Loaded existing content with sections:', Object.keys(existingContent));

    // Migrate pages
    await migratePage('home', existingContent.home);
    await migratePage('about', existingContent.about);
    await migratePage('work', existingContent.work);
    await migratePage('coaching', existingContent.coaching);
    await migratePage('contact', existingContent.contact);

    // Migrate creative content to blog posts
    if (existingContent.creative?.essays) {
      await migrateEssaysToBlog(existingContent.creative.essays);
    }

    // Migrate music
    if (existingContent.music) {
      await migrateMusic(existingContent.music);
    }

    // Create site settings
    await migrateSiteSettings(existingContent);

    console.log('✅ Migration completed successfully!');
    console.log('📁 Content structure created in:', contentDir);
    console.log('🎯 Next step: Set up GitHub OAuth for Decap CMS');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function migratePage(pageName, pageData) {
  if (!pageData) {
    console.warn(`⚠️  No data found for page: ${pageName}`);
    return;
  }

  const pageFile = path.join(contentDir, 'pages', `${pageName}.json`);
  
  // Transform page data for Decap CMS
  const transformedData = {
    title: pageData.title || '',
    slug: pageName,
    publishDate: new Date().toISOString(),
    ...pageData
  };

  fs.writeFileSync(pageFile, JSON.stringify(transformedData, null, 2));
  console.log(`✅ Migrated page: ${pageName}`);
}

async function migrateEssaysToBlog(essays) {
  if (!Array.isArray(essays) || essays.length === 0) {
    console.log('ℹ️  No essays to migrate to blog');
    return;
  }

  for (const essay of essays) {
    const slug = essay.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const date = essay.date ? new Date(essay.date) : new Date();
    const dateStr = date.toISOString().split('T')[0];
    
    const blogPost = {
      title: essay.title,
      date: date.toISOString(),
      description: essay.excerpt || '',
      body: essay.excerpt || '',
      tags: ['essay'],
      status: essay.status || 'Draft'
    };

    const filename = `${dateStr}-${slug}.json`;
    const blogFile = path.join(contentDir, 'blog', filename);
    
    fs.writeFileSync(blogFile, JSON.stringify(blogPost, null, 2));
    console.log(`✅ Migrated essay to blog: ${essay.title}`);
  }
}

async function migrateMusic(musicData) {
  if (!musicData.compositions || !Array.isArray(musicData.compositions)) {
    console.log('ℹ️  No music compositions to migrate');
    return;
  }

  // Create music page
  const musicPage = {
    title: musicData.title || 'Music & Sound',
    description: musicData.description || '',
    philosophy: musicData.philosophy || '',
    influences: musicData.influences || {}
  };

  const musicPageFile = path.join(contentDir, 'pages', 'music.json');
  fs.writeFileSync(musicPageFile, JSON.stringify(musicPage, null, 2));

  // Migrate individual compositions
  for (const composition of musicData.compositions) {
    const slug = composition.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const compositionData = {
      ...composition,
      date: new Date().toISOString()
    };

    const compositionFile = path.join(contentDir, 'music', `${slug}.json`);
    fs.writeFileSync(compositionFile, JSON.stringify(compositionData, null, 2));
    console.log(`✅ Migrated composition: ${composition.title}`);
  }
}

async function migrateSiteSettings(existingContent) {
  const settings = {
    title: "David Martin | Clarity. Connection. Risk with Purpose.",
    description: "David Martin helps leaders and teams make smarter decisions, navigate complexity, and build with intention.",
    siteUrl: "https://david-martin.ca",
    contact: existingContent.contact || {},
    socialLinks: existingContent.contact?.socialLinks || []
  };

  const settingsFile = path.join(contentDir, 'settings', 'general.json');
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  console.log('✅ Created site settings');
}

// Run migration
migrate();