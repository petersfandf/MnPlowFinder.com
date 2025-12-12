
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUGGESTED_CITIES } from '../client/src/data/cities';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(PROJECT_ROOT, 'dist/public');

// Convert string to slug (e.g. "Lake City" -> "lake-city-mn-snow-removal")
// Note: This logic must match the slug generation in App.tsx or wherever users navigate
// However, in CityPage.tsx, the logic is:
// if (slug.includes("lake-city")) ...
// So we should generate slugs that match what users expect.
// The user has been using "lake-city-mn-snow-removal" in examples.
// Let's stick to a standard pattern: lowercase, dash-separated, plus "-mn-snow-removal" suffix

function toSlug(city: string) {
  return `${city.toLowerCase().replace(/\s+/g, '-')}-mn-snow-removal`;
}

function toShortSlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, '-');
}

// Helper to slugify text (matches ProviderCard.tsx but cleaner for URL safety)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ''); // Trim dashes
}

function generateStaticPaths() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Dist directory ${DIST_DIR} does not exist. Run build first.`);
    process.exit(1);
  }

  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`index.html not found in ${DIST_DIR}`);
    process.exit(1);
  }

  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Load providers
  const PROVIDERS_PATH = path.resolve(__dirname, '../client/src/data/providers.json');
  const providersRaw = fs.readFileSync(PROVIDERS_PATH, 'utf-8');
  const providers = JSON.parse(providersRaw);
  
  // Define city routes to generate
  const cityRoutes = [
    'about',
    'partner',
    // Generate city pages (Long SEO versions)
    ...SUGGESTED_CITIES.map(toSlug),
    // Generate city pages (Short versions for user convenience)
    ...SUGGESTED_CITIES.map(toShortSlug)
  ];

  console.log(`Generating static paths for ${cityRoutes.length} city/static routes...`);

  cityRoutes.forEach(route => {
    const routeDir = path.join(DIST_DIR, route);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    // Write index.html copy
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtmlContent);
    console.log(`Created ${route}/index.html`);
  });

  console.log(`Generating static paths for ${providers.length} providers...`);

  // Generate provider routes: /provider/:id/:slug AND short /:slug
  providers.forEach((provider: any) => {
    const slug = slugify(provider.name);
    
    // 1. Nested directory structure: dist/public/provider/123/company-name
    const providerDir = path.join(DIST_DIR, 'provider', provider.id.toString(), slug);
    if (!fs.existsSync(providerDir)) {
      fs.mkdirSync(providerDir, { recursive: true });
    }
    fs.writeFileSync(path.join(providerDir, 'index.html'), indexHtmlContent);
    console.log(`Created provider/${provider.id}/${slug}/index.html`);

    // 2. Short URL structure: dist/public/company-name
    // Only create if it doesn't conflict with existing city routes or static pages
    const shortDir = path.join(DIST_DIR, slug);
    if (!fs.existsSync(shortDir)) {
       fs.mkdirSync(shortDir, { recursive: true });
       fs.writeFileSync(path.join(shortDir, 'index.html'), indexHtmlContent);
       console.log(`Created ${slug}/index.html (Short URL)`);
    } else {
       console.log(`Skipping short URL for ${slug} (Collision or exists)`);
    }
  });

  console.log('Static path generation complete.');
}

generateStaticPaths();
