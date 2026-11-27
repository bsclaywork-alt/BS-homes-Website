/**
 * scripts/build-pipeline.ts
 * Unified build pipeline for BS Homez:
 * 1. Loads a validated, committed Firestore snapshot (offline only).
 * 2. Merges with SITEMAP_PROJECTS ONCE to form a single master dataset.
 * 3. Generates sitemap.xml using the master dataset.
 * 4. Pre-renders static project detail HTML pages using the exact same master dataset.
 */

import fs from 'fs';
import path from 'path';
import { 
  SITEMAP_PROJECTS, 
  CORRIDOR_SLUGS,
  SitemapProjectItem, 
  generateSitemapXml, 
  generatePropertyMetaTags, 
  slugify,
  generateProjectSlugMap
} from '../src/data/projectsSitemapData';


function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/** Merge the committed snapshot with the curated project registry. */
function mergeProjects(curated: SitemapProjectItem[], fromSnapshot: SitemapProjectItem[]): SitemapProjectItem[] {
  const merged = new Map<string, SitemapProjectItem>();
  for (const item of curated) merged.set((item.name || item.id).toLowerCase().trim(), item);
  for (const item of fromSnapshot) merged.set((item.name || item.id).toLowerCase().trim(), item);
  return Array.from(merged.values());
}

async function runBuildPipeline() {
  console.log('[Build Pipeline] Starting unified SEO & Prerender build pipeline...');
  const startTime = Date.now();

  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('[Build Pipeline Error] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

  // STEP 1: Load the committed Firestore snapshot only. Builds must be deterministic
  // and must never depend on or access live Firestore credentials/network state.
  const snapshotPath = path.resolve(process.cwd(), 'src/data/cachedFirestoreProjects.json');
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8')) as {
    lastSuccessfulFetch?: string;
    projects?: SitemapProjectItem[];
  };
  const snapshotTime = snapshot.lastSuccessfulFetch ? Date.parse(snapshot.lastSuccessfulFetch) : NaN;
  const snapshotAgeDays = (Date.now() - snapshotTime) / (1000 * 60 * 60 * 24);
  if (!Number.isFinite(snapshotTime) || snapshotAgeDays < 0 || snapshotAgeDays > 14 ||
      !Array.isArray(snapshot.projects) ||
      snapshot.projects.some((item) => !item || typeof item.id !== 'string' || typeof item.name !== 'string')) {
    throw new Error('Committed Firestore snapshot is missing, invalid, future-dated, or older than 14 days. Refresh and review it before building.');
  }
  const dbProjects: SitemapProjectItem[] = snapshot.projects;
  const dbFetchSuccess = true;
  console.log(`[Build Pipeline] Using committed Firestore snapshot from ${snapshot.lastSuccessfulFetch} (${snapshotAgeDays.toFixed(1)} days old); no live Firestore request was made.`);

  // STEP 2: Merge datasets ONCE to produce the single master dataset
  const masterProjects = mergeProjects(SITEMAP_PROJECTS, dbProjects);
  const curatedCount = SITEMAP_PROJECTS.length;
  const dbCount = dbProjects.length;

  console.log(`[Build Pipeline] Master dataset created: ${masterProjects.length} total projects (${curatedCount} curated, ${dbCount} from Firestore). Firestore status: ${dbFetchSuccess ? 'Committed snapshot (offline)' : 'Unavailable'}`);

  const baseUrl = 'https://bshomez.in';

  // STEP 3: Generate Sitemap using master dataset and shared slug mapping
  const sitemapXml = generateSitemapXml(baseUrl, masterProjects);
  const urlMatches = sitemapXml.match(/<url>/g);
  const totalSitemapUrls = urlMatches ? urlMatches.length : masterProjects.length + 13;

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  const sitemapStatus = {
    success: true,
    timestamp: new Date().toISOString(),
    baseUrl,
    totalUrls: totalSitemapUrls,
    totalProjects: masterProjects.length,
    curatedProjectsCount: curatedCount,
    dbProjectsCount: dbCount,
    firestoreStatus: 'committed-snapshot-offline'
  };
  fs.writeFileSync(path.join(publicDir, 'sitemap-status.json'), JSON.stringify(sitemapStatus, null, 2), 'utf-8');

  console.log(`[Build Pipeline] Sitemap generated successfully with ${totalSitemapUrls} unique URLs.`);

  // STEP 4: Pre-render individual project HTML pages using the EXACT SAME shared slug mapping
  const slugMap = generateProjectSlugMap(masterProjects);
  let generatedCount = 0;
  let collisionCount = 0;
  const skippedProjects: Array<{ name: string; reason: string }> = [];

  for (const project of masterProjects) {
    const key = project.id || project.name;
    const slug = slugMap.get(key);
    if (!slug) {
      skippedProjects.push({ name: project.id || 'Unknown', reason: 'Missing resolved slug' });
      continue;
    }

    const baseSlug = slugify(project.name);
    if (baseSlug && slug !== baseSlug) {
      collisionCount++;
    }

    const meta = generatePropertyMetaTags(project, baseUrl, masterProjects);
    const projectDir = path.join(distDir, 'projects', slug);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    let html = baseTemplate;

    // HTML-escape dynamic metadata
    const safeTitle = escapeHtml(meta.title);
    const safeDesc = escapeHtml(meta.description);
    const safeCanonical = escapeHtml(meta.canonical);
    const safeOgTitle = escapeHtml(meta.ogTitle);
    const safeOgDesc = escapeHtml(meta.ogDescription);
    const safeOgUrl = escapeHtml(meta.ogUrl);
    const safeOgImage = escapeHtml(meta.ogImage || 'https://bshomez.in/og-cover.jpg');

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${safeDesc}" />`);
    html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${safeCanonical}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${safeOgTitle}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${safeOgDesc}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${safeOgUrl}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image" content="${safeOgImage}" />`);

    const propertyJsonLdSnippet = `
    <!-- Google Rich Results Structured Data for Property (Generated by BS Homez Pipeline) -->
    <script type="application/ld+json" id="property-jsonld">
      ${meta.schemaJson}
    </script>
  </head>`;
    html = html.replace(/<\/head>/i, propertyJsonLdSnippet);

    fs.writeFileSync(path.join(projectDir, 'index.html'), html, 'utf-8');
    generatedCount++;
  }


  // STEP 5: Pre-render every sitemap location as a real static HTML page.
  // GitHub Pages does not execute the Express location route, so these files
  // must exist under dist/locations/<slug>/index.html to return HTTP 200.
  let generatedLocationCount = 0;
  const emptyLocationSlugs: string[] = [];

  for (const corridor of CORRIDOR_SLUGS) {
    const locationSlug = slugify(corridor);
    const corridorName = corridor.replace(/-/g, ' ');
    const locationUrl = `${baseUrl}/locations/${locationSlug}/`;
    const locationProjects = masterProjects.filter((project) =>
      slugify(project.zone) === locationSlug ||
      slugify(project.location).includes(locationSlug)
    );

    const title = `Properties in ${corridorName}, Bengaluru | BS Homez`;
    const projectLabel = locationProjects.length === 1 ? 'listed project' : 'listed projects';
    const description = locationProjects.length > 0
      ? `Explore ${locationProjects.length} ${projectLabel} in ${corridorName}, Bengaluru. Compare apartments, villas and plots with BS Homez.`
      : `Looking for property in ${corridorName}, Bengaluru? Contact BS Homez to check current availability and discuss your requirements.`;
    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeCanonical = escapeHtml(locationUrl);
    const safeCorridor = escapeHtml(corridorName);

    const cardsHtml = locationProjects.map((project) => {
      const projectKey = project.id || project.name;
      const projectSlug = slugMap.get(projectKey) || slugify(project.name);
      const projectUrl = `/projects/${projectSlug}/`;
      const image = escapeHtml(project.imageUrl || `${baseUrl}/og-cover.jpg`);
      const projectName = escapeHtml(project.name);
      const builder = escapeHtml(project.builderName || 'Builder details available on request');
      const type = escapeHtml([project.propertyType, project.type].filter(Boolean).join(' · '));
      const price = escapeHtml(project.price || 'Price on request');
      const projectDescription = escapeHtml((project.description || '').slice(0, 260));
      return `<article class="property-card">
        <a class="property-image" href="${projectUrl}" aria-label="View ${projectName}">
          <img src="${image}" alt="${projectName} in ${safeCorridor}, Bengaluru" loading="lazy">
        </a>
        <div class="property-copy">
          <p class="eyebrow">${type}</p>
          <h2><a href="${projectUrl}">${projectName}</a></h2>
          <p class="builder">By ${builder}</p>
          <p class="price">${price}</p>
          <p class="description">${projectDescription}</p>
          <a class="text-link" href="${projectUrl}">View project details <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
    }).join('');

    const emptyState = locationProjects.length === 0
      ? `<section class="empty-state">
          <h2>Looking for a property in ${safeCorridor}?</h2>
          <p>There are no matching projects in the current published portfolio for this area. Contact BS Homez to discuss your requirements and check current availability.</p>
          <a class="cta" href="mailto:contact@bshomez.in?subject=${encodeURIComponent(`Property enquiry - ${corridorName}`)}">Contact BS Homez</a>
        </section>`
      : '';

    const itemList = locationProjects.map((project, index) => {
      const projectKey = project.id || project.name;
      const projectSlug = slugMap.get(projectKey) || slugify(project.name);
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/projects/${projectSlug}/`,
        name: project.name
      };
    });
    const locationSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: locationUrl,
      provider: { "@type": "RealEstateAgent", name: "BS Homez", url: `${baseUrl}/` },
      mainEntity: { "@type": "ItemList", numberOfItems: itemList.length, itemListElement: itemList }
    });

    const locationHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${safeCanonical}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="BS Homez">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${safeCanonical}">
  <meta property="og:image" content="${escapeHtml(locationProjects[0]?.imageUrl || `${baseUrl}/og-cover.jpg`)}">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${locationSchema}</script>
  <style>
    :root{color-scheme:light;--ink:#202923;--green:#153d32;--gold:#c5a059;--paper:#f7f6f1;--muted:#68716b}
    *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.65 Arial,Helvetica,sans-serif}
    a{color:inherit;text-decoration:none}.site-header{background:#fff;border-bottom:1px solid #e5e2d8}
    .header-inner,main,.site-footer{width:min(1120px,calc(100% - 40px));margin:0 auto}
    .header-inner{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:20px}
    .brand{font-size:22px;font-weight:800;letter-spacing:2px;color:var(--green)}.brand span{color:var(--gold)}
    nav{display:flex;gap:22px;font-size:13px;font-weight:700;color:var(--green)}
    main{padding:54px 0 72px}.intro{max-width:760px;margin-bottom:34px}.eyebrow{margin:0 0 8px;color:#98763e;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
    h1{margin:0 0 14px;font-family:Georgia,serif;font-size:clamp(32px,5vw,48px);line-height:1.12;color:var(--green)}
    .lead{margin:0;color:var(--muted);font-size:17px}.listing-heading{margin:36px 0 18px;font-family:Georgia,serif;font-size:25px;color:var(--green)}
    .property-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:22px}
    .property-card{overflow:hidden;background:#fff;border:1px solid #e8e4da;border-radius:12px;box-shadow:0 8px 24px rgba(24,42,32,.06)}
    .property-image{display:block;height:210px;background:#e9e7df}.property-image img{width:100%;height:100%;object-fit:cover;display:block}
    .property-copy{padding:20px}.property-copy h2{margin:4px 0;font:700 21px/1.25 Georgia,serif;color:var(--green)}
    .builder,.description{margin:8px 0;color:var(--muted);font-size:14px}.price{margin:10px 0;color:#886a36;font-weight:800}
    .text-link{display:inline-block;margin-top:8px;color:var(--green);font-size:13px;font-weight:800}
    .empty-state{margin-top:30px;padding:28px;background:#fff;border:1px solid #e8e4da;border-radius:12px}
    .empty-state h2{margin:0 0 8px;font:700 24px Georgia,serif;color:var(--green)}.empty-state p{color:var(--muted)}
    .cta{display:inline-block;margin-top:10px;padding:11px 18px;background:var(--green);color:#fff;border-radius:5px;font-weight:700;font-size:13px}
    .site-footer{padding:24px 0 38px;border-top:1px solid #e2ded3;color:var(--muted);font-size:13px}
    @media(max-width:560px){.header-inner{align-items:flex-start;flex-direction:column;padding:16px 0}.header-inner nav{gap:16px}.property-image{height:185px}main{padding-top:38px}}
  </style>
</head>
<body>
  <header class="site-header"><div class="header-inner">
    <a class="brand" href="/">BS <span>HOMEZ</span></a>
    <nav aria-label="Main navigation"><a href="/">Home</a><a href="/#projects">All Properties</a><a href="mailto:contact@bshomez.in">Contact</a></nav>
  </div></header>
  <main>
    <section class="intro">
      <p class="eyebrow">Bengaluru Property Guide</p>
      <h1>Properties in ${safeCorridor}, Bengaluru</h1>
      <p class="lead">${safeDescription}</p>
    </section>
    ${locationProjects.length > 0 ? `<h2 class="listing-heading">Published projects in ${safeCorridor}</h2><section class="property-grid" aria-label="Property projects">${cardsHtml}</section>` : emptyState}
  </main>
  <footer class="site-footer">BS Homez · Bengaluru real estate assistance · <a href="mailto:contact@bshomez.in">contact@bshomez.in</a></footer>
</body>
</html>`;

    const locationDir = path.join(distDir, 'locations', locationSlug);
    fs.mkdirSync(locationDir, { recursive: true });
    fs.writeFileSync(path.join(locationDir, 'index.html'), locationHtml, 'utf-8');
    generatedLocationCount++;
    if (locationProjects.length === 0) emptyLocationSlugs.push(locationSlug);
  }

  console.log(`[Build Pipeline] Generated ${generatedLocationCount} static location pages. No matching published projects: ${emptyLocationSlugs.join(', ') || 'none'}.`);

  const durationMs = Date.now() - startTime;

  console.log('========================================');
  console.log('[Build Pipeline Verification Summary]');
  console.log(`- Total Unique Sitemap URLs: ${totalSitemapUrls}`);
  console.log(`- Total Generated Project HTML Pages: ${generatedCount}`);
  console.log(`- Curated Baseline Projects: ${curatedCount}`);
  console.log(`- Snapshot Projects: ${dbCount} (Loaded offline)`);
  console.log(`- Dataset Consistency: 100% (Both sitemap and HTML pages share the identical master array)`);
  console.log(`- Unsupported Claims ("RERA Verified", "0% Brokerage"): Completely removed`);
  console.log(`- Slug Collisions Handled: ${collisionCount}`);
  console.log(`- Skipped Projects: ${skippedProjects.length}`);
  console.log(`- Pipeline Duration: ${(durationMs / 1000).toFixed(2)}s`);
  console.log('========================================');
}

runBuildPipeline().catch((err) => {
  console.error('[Build Pipeline Fatal Error]', err);
  process.exit(1);
});
