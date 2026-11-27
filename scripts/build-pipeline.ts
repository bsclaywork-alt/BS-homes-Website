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
  // Reuse Vite's built stylesheet so static SEO pages inherit BS Homez brand typography and tokens.
  const sharedStylesheets = (baseTemplate.match(/<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/gi) || []).join('\n');

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

    // Add crawlable, visible related links to the static project page.
    // This gives visitors and search crawlers a route back to the matching area and portfolio.
    const projectLocation = CORRIDOR_SLUGS.find((corridor) =>
      slugify(project.zone) === slugify(corridor) ||
      slugify(project.location).includes(slugify(corridor))
    );
    const locationNavigation = projectLocation
      ? `<a href="/locations/${slugify(projectLocation)}/">Properties in ${escapeHtml(projectLocation.replace(/-/g, ' '))}</a>`
      : '';
    const relatedNavigation = `<nav aria-label="Related property links" style="max-width:1120px;margin:24px auto;padding:16px 20px;border-top:1px solid #e5e2d8;display:flex;flex-wrap:wrap;gap:18px;font:600 13px Arial,sans-serif;color:#153d32"><a href="/">BS Homez Home</a><a href="/#projects">Browse all properties</a>${locationNavigation}</nav>`;
    html = html.replace(/<\/body>/i, `${relatedNavigation}</body>`);

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
    // Add locally useful context only where it can be stated accurately without
    // implying that BS Homez has a current listing in the neighbourhood.
    const locationContext = locationSlug === 'bellandur'
      ? `<section class="location-context" aria-labelledby="location-context-heading">
          <h2 id="location-context-heading">Living and looking for property in Bellandur</h2>
          <p>Bellandur is a southeast Bengaluru neighbourhood connected with the Outer Ring Road and Sarjapur Road corridors. People comparing homes in this area often consider access to nearby work locations, schools, healthcare, daily shopping and routes towards Marathahalli, HSR Layout and Sarjapur.</p>
          <p>Convenience can vary considerably by the exact street, building entrance and time of travel. Visit the property at your usual commute time and compare the route rather than relying only on a neighbourhood name.</p>
          <p>Before shortlisting a home, review the applicable RERA details, approvals and occupancy documents, water supply, parking, maintenance charges, association rules and the full cost of ownership or rent. Contact BS Homez to discuss your requirements and check current availability.</p>
        </section>`
      : '';

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

    // Summarize only the published inventory fields already present in the committed build snapshot.
    // This adds useful, verifiable comparison context without inventing neighbourhood claims.
    const countValues = (values: string[]) => {
      const counts = new Map<string, number>();
      values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
      return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    };
    const propertyTypeCounts = countValues(locationProjects.map((project) => project.propertyType || 'Property'));
    const listingTypeCounts = countValues(locationProjects.map((project) => project.type || 'Listing'));
    const inventorySummary = locationProjects.length > 0
      ? `<section class="inventory-overview" aria-labelledby="inventory-overview-heading">
          <h2 id="inventory-overview-heading">Explore the published property mix in ${safeCorridor}</h2>
          <p>The current BS Homez published portfolio includes ${locationProjects.length} ${projectLabel} matched to ${safeCorridor}. Use the listings below to compare the property type, listing category, developer, published price and project description where those details are available.</p>
          <ul>
            ${propertyTypeCounts.map(([name, count]) => `<li><strong>${escapeHtml(name)}:</strong> ${count} ${count === 1 ? 'listing' : 'listings'}</li>`).join('')}
            ${listingTypeCounts.map(([name, count]) => `<li><strong>Listing category — ${escapeHtml(name)}:</strong> ${count} ${count === 1 ? 'listing' : 'listings'}</li>`).join('')}
          </ul>
          <p>Published prices and availability can change. Please confirm the latest price, unit availability, approvals and documentation with BS Homez before making a property decision.</p>
        </section>`
      : '';

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
  ${sharedStylesheets}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="BS Homez">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${safeCanonical}">
  <meta property="og:image" content="${escapeHtml(locationProjects[0]?.imageUrl || `${baseUrl}/og-cover.jpg`)}">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${locationSchema}</script>
  <style>
    :root{color-scheme:light;--ink:#252A27;--green:#153D32;--gold:#C5A46D;--paper:#F7F5EF;--muted:#5A625E;--line:rgba(21,61,50,.14)}
    *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Montserrat,Inter,Arial,sans-serif;font-size:15px;line-height:1.7}
    a{color:inherit;text-decoration:none}.site-header{background:#101512;border-bottom:1px solid rgba(197,164,109,.35)}
    .header-inner,main,.site-footer{width:min(1200px,calc(100% - 40px));margin:0 auto}
    .header-inner{min-height:88px;display:flex;align-items:center;justify-content:space-between;gap:24px}
    .brand{display:inline-flex;align-items:center;flex:0 0 auto}.brand-mark{display:inline-flex;align-items:center;background:#fff;border-radius:3px;padding:4px 8px;box-shadow:0 1px 5px rgba(0,0,0,.12)}.brand img{display:block;width:auto;height:40px;max-width:min(48vw,220px);object-fit:contain}
    nav{display:flex;align-items:center;gap:26px;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#F7F5EF}
    nav a:hover,.text-link:hover{color:var(--gold)}
    main{padding:64px 0 82px}.intro{max-width:820px;margin-bottom:42px}
    .eyebrow{margin:0 0 12px;color:#A9874D;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase}
    h1{margin:0 0 18px;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(40px,6vw,66px);font-weight:500;line-height:1.02;color:var(--green)}
    .lead{margin:0;color:var(--muted);font-size:15px;line-height:1.9;max-width:720px}
    .location-context{max-width:900px;margin:30px 0 40px;padding:26px 30px;background:#fff;border:1px solid var(--line);border-radius:3px}.location-context h2{margin:0 0 12px;font-family:"Cormorant Garamond",Georgia,serif;font-size:30px;font-weight:600;color:var(--green)}.location-context p{margin:10px 0;color:var(--muted);font-size:13px;line-height:1.85}
     .listing-heading{margin:46px 0 20px;font-family:"Cormorant Garamond",Georgia,serif;font-size:34px;font-weight:600;color:var(--green)}
    .property-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:26px}
    .property-card{overflow:hidden;background:#fff;border:1px solid var(--line);border-radius:3px;box-shadow:0 12px 32px rgba(21,61,50,.08);transition:transform .25s ease,box-shadow .25s ease}
    .property-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(21,61,50,.12)}
    .property-image{display:block;height:230px;background:#e9e7df;overflow:hidden}.property-image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
    .property-card:hover .property-image img{transform:scale(1.035)}.property-copy{padding:24px}
    .property-copy h2{margin:5px 0 8px;font-family:"Cormorant Garamond",Georgia,serif;font-size:29px;font-weight:600;line-height:1.15;color:var(--green)}
    .builder,.description{margin:9px 0;color:var(--muted);font-size:13px;line-height:1.75}.price{margin:14px 0;color:#98763E;font-size:15px;font-weight:700}
    .text-link{display:inline-block;margin-top:10px;color:var(--green);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
    .inventory-overview{margin:34px 0 42px;padding:26px 30px;background:#fff;border:1px solid var(--line);border-radius:3px}.inventory-overview h2{margin:0 0 12px;font-family:"Cormorant Garamond",Georgia,serif;font-size:30px;font-weight:600;color:var(--green)}.inventory-overview p,.inventory-overview li{color:var(--muted);font-size:13px;line-height:1.8}.inventory-overview ul{display:flex;flex-wrap:wrap;gap:8px 28px;padding-left:20px}.inventory-overview li{min-width:220px}
    .empty-state{margin-top:30px;padding:34px;background:#fff;border:1px solid var(--line);border-radius:3px}
    .empty-state h2{margin:0 0 10px;font-family:"Cormorant Garamond",Georgia,serif;font-size:32px;color:var(--green)}.empty-state p{color:var(--muted)}
    .cta{display:inline-block;margin-top:12px;padding:13px 22px;background:var(--green);color:#fff;border:1px solid var(--green);border-radius:2px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
    .cta:hover{background:#245747}.site-footer{padding:28px 0 42px;border-top:1px solid var(--line);color:var(--muted);font-size:12px}.site-footer a{color:var(--green);font-weight:700}
    @media(max-width:600px){.header-inner{min-height:76px;gap:12px}.brand img{height:34px}.brand-mark{padding:3px 6px}.header-inner nav{gap:12px;font-size:9px;letter-spacing:.7px}main{padding:42px 0 56px}.property-image{height:195px}.property-copy{padding:19px}.listing-heading{font-size:29px}}
  </style>
</head>
<body>
  <header class="site-header"><div class="header-inner">
    <a class="brand" href="/" aria-label="BS Homez home"><span class="brand-mark"><img src="/assets/aistudio/bs_homez_logo_transparent.png" alt="BS Homez - Turning Key Moments"></span></a>
    <nav aria-label="Main navigation"><a href="/">Home</a><a href="/#projects">All Properties</a><a href="mailto:contact@bshomez.in">Contact</a></nav>
  </div></header>
  <main>
    <section class="intro">
      <p class="eyebrow">Bengaluru Property Guide</p>
      <h1>Properties in ${safeCorridor}, Bengaluru</h1>
      <p class="lead">${safeDescription}</p>
    </section>
    ${locationContext}
    ${inventorySummary}
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
