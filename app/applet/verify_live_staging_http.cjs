const http = require('http');
const { SITEMAP_PROJECTS, CORRIDOR_SLUGS, slugify } = require('../../src/data/projectsSitemapData.ts');

async function testLiveStaging() {
  console.log("=== LIVE STAGING HTTP VERIFICATION (PORT 3000) ===");
  
  const baseUrl = 'http://localhost:3000';
  const sitemapUrls = [
    `${baseUrl}/`,
    ...CORRIDOR_SLUGS.map(c => `${baseUrl}/locations/${slugify(c)}/`),
    ...SITEMAP_PROJECTS.map(p => `${baseUrl}/projects/${slugify(p.name)}/`)
  ];

  console.log(`Total URLs to test via actual HTTP GET: ${sitemapUrls.length}`);

  let passes = 0;
  let failures = 0;
  const results = [];

  for (let i = 0; i < sitemapUrls.length; i++) {
    const testUrl = sitemapUrls[i];
    // Map localhost url back to production sitemap url for reporting
    const productionSitemapUrl = testUrl.replace('http://localhost:3000', 'https://bshomez.in');

    try {
      const resp = await fetch(testUrl);
      const status = resp.status;
      const html = await resp.text();

      // Extract canonical
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
      const extractedCanonical = canonicalMatch ? canonicalMatch[1] : '';
      const expectedCanonical = productionSitemapUrl;

      // Count occurrences of title, description, canonical
      const titleCount = (html.match(/<title>[\s\S]*?<\/title>/gi) || []).length;
      const descCount = (html.match(/<meta\s+name=["']description["'][\s\S]*?>/gi) || []).length;
      const canonicalCount = (html.match(/<link\s+rel=["']canonical["'][\s\S]*?>/gi) || []).length;

      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const pageTitle = titleMatch ? titleMatch[1] : '';

      const isStatusOk = status === 200;
      const isCanonicalExact = extractedCanonical === expectedCanonical;
      const isSingleTags = titleCount === 1 && descCount === 1 && canonicalCount === 1;

      if (isStatusOk && isCanonicalExact && isSingleTags) {
        passes++;
        results.push({ index: i + 1, url: productionSitemapUrl, status, canonical: extractedCanonical, statusLabel: 'PASS' });
      } else {
        failures++;
        results.push({ index: i + 1, url: productionSitemapUrl, status, canonical: extractedCanonical, statusLabel: `FAIL (Status:${status}, CanonMatch:${isCanonicalExact}, Counts: T=${titleCount},D=${descCount},C=${canonicalCount})` });
      }
    } catch (err) {
      failures++;
      results.push({ index: i + 1, url: productionSitemapUrl, status: 'ERROR', canonical: 'ERR', statusLabel: `FAIL (${err.message})` });
    }
  }

  // Test unknown slug 404
  let unknown404Pass = false;
  try {
    const unkRes = await fetch(`${baseUrl}/projects/non-existent-test-slug-99999/`);
    if (unkRes.status === 404) unknown404Pass = true;
  } catch (e) {}

  // Test sitemap.xml and robots.txt
  let sitemapOk = false;
  let robotsOk = false;
  try {
    const smRes = await fetch(`${baseUrl}/sitemap.xml`);
    const smText = await smRes.text();
    if (smRes.status === 200 && smText.includes('urlset')) sitemapOk = true;

    const rbRes = await fetch(`${baseUrl}/robots.txt`);
    const rbText = await rbRes.text();
    if (rbRes.status === 200 && rbText.includes('Sitemap:')) robotsOk = true;
  } catch (e) {}

  console.log(`\nHTTP Test Results Summary:`);
  console.log(`- Total URLs tested: ${sitemapUrls.length}`);
  console.log(`- Passes: ${passes}`);
  console.log(`- Failures: ${failures}`);
  console.log(`- Unknown Slug 404 Test: ${unknown404Pass ? 'PASS' : 'FAIL'}`);
  console.log(`- sitemap.xml test: ${sitemapOk ? 'PASS' : 'FAIL'}`);
  console.log(`- robots.txt test: ${robotsOk ? 'PASS' : 'FAIL'}`);

  results.forEach(r => {
    console.log(`${r.index}. [${r.statusLabel}] ${r.url} | Canonical: ${r.canonical}`);
  });
}

testLiveStaging();
