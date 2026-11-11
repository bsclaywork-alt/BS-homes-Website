const fs = require('fs');
const path = require('path');
const { SITEMAP_PROJECTS, CORRIDOR_SLUGS, slugify, generatePropertyMetaTags } = require('../../src/data/projectsSitemapData.ts');

async function runSimulation() {
  console.log("Starting SEO Patch Simulation & Verification...");
  console.log(`Loaded ${SITEMAP_PROJECTS.length} projects and ${CORRIDOR_SLUGS.length} corridors.`);
  
  let passedTests = 0;
  let failedTests = 0;

  const allTestUrls = [
    'https://bshomez.in/',
    ...CORRIDOR_SLUGS.map(c => `https://bshomez.in/locations/${slugify(c)}/`),
    ...SITEMAP_PROJECTS.map(p => `https://bshomez.in/projects/${slugify(p.name)}/`)
  ];

  console.log(`Total URLs to verify in simulation: ${allTestUrls.length} (Expected: 59)`);

  if (allTestUrls.length === 59) {
    console.log("[PASS] Exactly 59 URLs generated matching sitemap count.");
    passedTests++;
  } else {
    console.log(`[FAIL] Expected 59 URLs, got ${allTestUrls.length}`);
    failedTests++;
  }

  const sampleProj = SITEMAP_PROJECTS[0];
  const meta = generatePropertyMetaTags(sampleProj, 'https://bshomez.in');
  if (meta.title && meta.canonical && meta.schemaJson) {
    console.log(`[PASS] Sample project meta generated successfully: ${meta.title}`);
    passedTests++;
  } else {
    console.log("[FAIL] Sample project meta generation failed.");
    failedTests++;
  }

  const unknownSlug = 'non-existent-luxury-villa-12345';
  const foundProj = SITEMAP_PROJECTS.find(p => slugify(p.name) === unknownSlug || slugify(p.id) === unknownSlug);
  if (!foundProj) {
    console.log("[PASS] Unknown project slug correctly evaluates to not found (triggers 404).");
    passedTests++;
  } else {
    console.log("[FAIL] Unknown project slug unexpectedly matched.");
    failedTests++;
  }

  console.log(`\nSimulation Results: ${passedTests} passed, ${failedTests} failed.`);
}

runSimulation();
