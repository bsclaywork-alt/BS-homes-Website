const fs = require('fs');
const path = require('path');
const { SITEMAP_PROJECTS, CORRIDOR_SLUGS, slugify, generatePropertyMetaTags } = require('../../src/data/projectsSitemapData.ts');

function getCorridorDisplayName(slug) {
  const mapping = {
    'whitefield': 'Whitefield',
    'hoskote': 'Hoskote',
    'varthur': 'Varthur',
    'gunjur': 'Gunjur',
    'hosa-road': 'Hosa Road',
    'kasavanahalli': 'Kasavanahalli',
    'off-sarjapur-road': 'Off Sarjapur Road',
    'sarjapur': 'Sarjapur',
    'electronic-city': 'Electronic City',
    'marathalli': 'Marathalli',
    'bellandur': 'Bellandur',
    'east-bangalore': 'East Bangalore'
  };
  return mapping[slug.toLowerCase()] || slug.replace(/-/g, ' ');
}

async function runStagingVerification() {
  console.log("=== STAGING BUILD & ROUTING VERIFICATION ===");
  const indexPath = path.join(process.cwd(), 'dist', 'index.html');
  const serverPath = path.join(process.cwd(), 'dist', 'server.cjs');

  console.log("Checking built artifacts:");
  console.log("- dist/index.html exists:", fs.existsSync(indexPath));
  console.log("- dist/server.cjs exists:", fs.existsSync(serverPath));

  if (!fs.existsSync(indexPath) || !fs.existsSync(serverPath)) {
    console.error("ERROR: Built artifacts missing!");
    process.exit(1);
  }

  const htmlTemplate = fs.readFileSync(indexPath, 'utf-8');
  console.log("- HTML template length:", htmlTemplate.length);
  console.log("- Dynamic canonical placeholder present:", htmlTemplate.includes('id="dynamic-canonical"'));

  let successCount = 0;
  
  const homeMetaValid = htmlTemplate.includes('canonical') && htmlTemplate.includes('BS Homez');
  if (homeMetaValid) successCount++;

  let locationPageCount = 0;
  let projectPageCount = 0;
  const failures = [];

  CORRIDOR_SLUGS.forEach(c => {
    const slug = slugify(c);
    const corridorName = getCorridorDisplayName(slug);
    const locationPath = path.join(process.cwd(), 'dist', 'locations', slug, 'index.html');
    if (!fs.existsSync(locationPath)) {
      failures.push(`Missing static location page: ${slug}`);
      return;
    }
    const html = fs.readFileSync(locationPath, 'utf-8');
    const expectedCanonical = `https://bshomez.in/locations/${slug}/`;
    if (!html.includes(`<link rel="canonical" href="${expectedCanonical}">`)) failures.push(`Incorrect location canonical: ${slug}`);
    if (!html.includes(`<h1>Properties in ${corridorName}, Bengaluru</h1>`)) failures.push(`Missing location H1: ${slug}`);
    if (!html.includes(`<title>Properties in ${corridorName}, Bengaluru | BS Homez</title>`)) failures.push(`Incorrect location title: ${slug}`);
    if (html.includes('class="property-grid"') && !html.includes('class="inventory-overview"')) failures.push(`Missing data-backed inventory overview: ${slug}`);
    locationPageCount++;
  });

  const bellandurPath = path.join(process.cwd(), 'dist', 'locations', 'bellandur', 'index.html');
  if (fs.existsSync(bellandurPath)) {
    const bellandurHtml = fs.readFileSync(bellandurPath, 'utf-8');
    if (!bellandurHtml.includes('Living and looking for property in Bellandur')) failures.push('Missing Bellandur location guidance');
    if (!bellandurHtml.includes('Outer Ring Road and Sarjapur Road corridors')) failures.push('Missing Bellandur corridor context');
  }

  const sumadhuraPath = path.join(process.cwd(), 'dist', 'projects', 'sumadhura-folium', 'index.html');
  if (!fs.existsSync(sumadhuraPath)) {
    failures.push('Missing curated Sumadhura Folium static project page');
  } else {
    const sumadhuraHtml = fs.readFileSync(sumadhuraPath, 'utf-8');
    if (!sumadhuraHtml.includes('<link rel="canonical" href="https://bshomez.in/projects/sumadhura-folium/"')) failures.push('Incorrect Sumadhura Folium canonical');
    if (!/<title>Sumadhura Folium[^<]*<\/title>/.test(sumadhuraHtml)) failures.push('Sumadhura Folium page has incorrect title');
  }

  const appSourcePath = path.join(process.cwd(), 'src', 'App.tsx');
  const appSource = fs.readFileSync(appSourcePath, 'utf-8');
  if (!appSource.includes('const baseUrl = "https://bshomez.in";')) failures.push('Dynamic SEO must use the non-www canonical domain');
  if (!appSource.includes('window.location.pathname.match(/^\\/projects\\/([^/]+)\\/?$/i)')) failures.push('Dynamic SEO must resolve clean project detail paths');
  if (!appSource.includes('href={`/locations/${slug}/`}')) failures.push('Homepage must expose crawlable location links');

  const projectsRoot = path.join(process.cwd(), 'dist', 'projects');
  if (fs.existsSync(projectsRoot)) {
    for (const slug of fs.readdirSync(projectsRoot)) {
      const projectPath = path.join(projectsRoot, slug, 'index.html');
      if (!fs.existsSync(projectPath)) continue;
      const html = fs.readFileSync(projectPath, 'utf-8');
      const expectedCanonical = `https://bshomez.in/projects/${slug}/`;
      if (!html.includes(`<link rel="canonical" href="${expectedCanonical}"`)) failures.push(`Incorrect project canonical: ${slug}`);
      if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`Missing project title: ${slug}`);
      projectPageCount++;
    }
  }

  SITEMAP_PROJECTS.forEach(p => {
    const meta = generatePropertyMetaTags(p, "https://bshomez.in");
    if (!meta.title || !meta.canonical || !meta.schemaJson) failures.push(`Incomplete generated project metadata: ${p.name}`);
  });

  if (failures.length) {
    console.error("\nStaging build verification failures:");
    failures.forEach(failure => console.error("- " + failure));
    process.exit(1);
  }

  console.log(`\nVerified ${locationPageCount} static location pages and ${projectPageCount} generated project pages with canonical and title checks.`);
  console.log("Staging verification completed successfully with 0 errors.");
}

runStagingVerification();
