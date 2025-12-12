import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUGGESTED_CITIES } from '../client/src/data/cities';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const PROVIDERS_PATH = path.resolve(__dirname, '../client/src/data/providers.json');
const PUBLIC_DIR = path.resolve(__dirname, '../client/public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Base URL
const BASE_URL = 'https://mnplowfinder.com';

// Static Routes
const STATIC_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/partner', priority: '0.6', changefreq: 'monthly' },
];

// Helper to slugify text (matches ProviderCard.tsx but cleaner for URL safety)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ''); // Trim dashes
}

// Helper to create city slugs (matches post-build.ts)
function toCitySlug(city: string) {
  return `${city.toLowerCase().replace(/\s+/g, '-')}-mn-snow-removal`;
}

// Main generation function
async function generateSitemap() {
  console.log('🔍 Starting Sitemap Generation...');

  // 1. Read Providers
  const providersRaw = fs.readFileSync(PROVIDERS_PATH, 'utf-8');
  const providers = JSON.parse(providersRaw);
  console.log(`✅ Loaded ${providers.length} providers.`);

  // 2. Build URL List
  const urls = [];

  // Static
  for (const route of STATIC_ROUTES) {
    urls.push({
      loc: `${BASE_URL}${route.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      priority: route.priority,
      changefreq: route.changefreq
    });
  }

  // Cities
  for (const city of SUGGESTED_CITIES) {
    urls.push({
      loc: `${BASE_URL}/${toCitySlug(city)}`,
      lastmod: new Date().toISOString().split('T')[0],
      priority: '0.7',
      changefreq: 'weekly'
    });
  }

  // Providers
  for (const provider of providers) {
    const slug = slugify(provider.name);
    urls.push({
      loc: `${BASE_URL}/provider/${provider.id}/${slug}`,
      lastmod: new Date().toISOString().split('T')[0],
      priority: '0.8',
      changefreq: 'weekly'
    });
  }

  // 3. Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // 4. Write File
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`🎉 Sitemap written to ${SITEMAP_PATH}`);
  console.log(`📊 Total URLs: ${urls.length}`);
  
  // 5. Print Inventory for User
  console.log('\n--- URL INVENTORY ---');
  console.log(`Total Providers: ${providers.length}`);
  console.log(`Total Cities: ${SUGGESTED_CITIES.length}`);
  console.log(`Total Static: ${STATIC_ROUTES.length}`);
  console.log('---------------------');
}

generateSitemap().catch(console.error);
