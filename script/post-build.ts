
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUGGESTED_CITIES } from '../client/src/data/cities';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(PROJECT_ROOT, 'dist');

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

  // Define routes to generate
  const routes = [
    'about',
    'partner',
    // Generate city pages (Long SEO versions)
    ...SUGGESTED_CITIES.map(toSlug),
    // Generate city pages (Short versions for user convenience)
    ...SUGGESTED_CITIES.map(toShortSlug)
  ];

  console.log(`Generating static paths for ${routes.length} routes...`);

  routes.forEach(route => {
    const routeDir = path.join(DIST_DIR, route);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    // Write index.html copy
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtmlContent);
    console.log(`Created ${route}/index.html`);
  });

  console.log('Static path generation complete.');
}

generateStaticPaths();
