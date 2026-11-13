const https = require('https');

async function reconcileProduction() {
  console.log("=== PRODUCTION RECONCILIATION & LIVE HTTP AUDIT ===");

  const targets = [
    'https://bshomez.in/',
    'https://www.bshomez.in/',
    'https://bshomez.in/projects/prestige-somerville/',
    'https://bshomez.in/locations/whitefield/',
    'https://bshomez.in/sitemap.xml',
    'https://bshomez.in/robots.txt'
  ];

  for (const url of targets) {
    try {
      const resp = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' } });
      const location = resp.headers.get('location') || 'none';
      let bodySnippet = '';
      if (resp.status === 200) {
        const text = await resp.text();
        bodySnippet = text.slice(0, 150).replace(/\n/g, ' ');
      }
      console.log(`\nURL: ${url}`);
      console.log(`  Status: ${resp.status}`);
      console.log(`  Location Header: ${location}`);
      console.log(`  Content-Type: ${resp.headers.get('content-type')}`);
      if (bodySnippet) {
        console.log(`  Body Snippet: ${bodySnippet}...`);
      }
    } catch (err) {
      console.log(`\nURL: ${url} -> Error: ${err.message}`);
    }
  }

  // Fetch robots.txt content explicitly
  try {
    const rbResp = await fetch('https://bshomez.in/robots.txt');
    const rbText = await rbResp.text();
    console.log("\n--- ROBOT.TXT CONTENT ---");
    console.log(rbText);
  } catch (e) {
    console.log("Failed to fetch robots.txt:", e.message);
  }
}

reconcileProduction();
