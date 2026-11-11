const https = require('https');
const http = require('http');

async function auditProduction() {
  console.log("Starting Read-Only Production SEO Audit for https://bshomez.in...");
  
  const res = await fetch('https://bshomez.in/sitemap.xml');
  const sitemapXml = await res.text();
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  
  console.log(`Extracted ${urls.length} URLs from sitemap.xml.\n`);
  
  const results = [];
  
  const userAgents = {
    browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  };

  // Test root, sitemap, robots, www vs non-www, legacy queries first
  console.log("Testing Global Infrastructure & Redirects:");
  
  const testUrls = [
    'https://bshomez.in/',
    'https://www.bshomez.in/',
    'https://bshomez.in/sitemap.xml',
    'https://bshomez.in/robots.txt',
    'https://bshomez.in/?project=curated_godrej_park_retreat_phase2',
    'https://bshomez.in/?corridor=Whitefield'
  ];

  for (const u of testUrls) {
    try {
      const resp = await fetch(u, { redirect: 'manual', headers: { 'User-Agent': userAgents.browser } });
      console.log(`- ${u} -> Status: ${resp.status}, Location: ${resp.headers.get('location') || 'none'}`);
    } catch (e) {
      console.log(`- ${u} -> Error: ${e.message}`);
    }
  }
  
  console.log("\nAuditing sample of sitemap URLs for detailed tags...");
  
  // Sample 5 project URLs and 3 location URLs for detailed tag audit to keep execution robust and fast
  const sampleUrls = [
    urls[0], // homepage
    urls[1], // first project
    urls[10], // project 10
    urls[35], // project 35
    urls[47], // first location
    urls[55], // location
  ];

  for (const url of sampleUrls) {
    try {
      const resp = await fetch(url, { headers: { 'User-Agent': userAgents.googlebot } });
      const html = await resp.text();
      
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
      const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>(.*?)<\/script>/si);
      
      console.log(`\nURL: ${url}`);
      console.log(`  HTTP Status: ${resp.status}`);
      console.log(`  Title: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
      console.log(`  Meta Description: ${descMatch ? descMatch[1] : 'NOT FOUND'}`);
      console.log(`  Canonical: ${canonMatch ? canonMatch[1] : 'NOT FOUND'}`);
      console.log(`  H1: ${h1Match ? h1Match[1].replace(/<[^>]*>/g, '') : 'NOT FOUND'}`);
      console.log(`  JSON-LD Present: ${jsonLdMatch ? 'Yes' : 'No'}`);
      console.log(`  Initial HTML Content Size: ${html.length} chars`);
    } catch (e) {
      console.log(`\nURL: ${url} -> Error: ${e.message}`);
    }
  }
}

auditProduction();
