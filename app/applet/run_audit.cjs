const https = require('https');

async function runAudit() {
  const sitemapRes = await fetch('https://bshomez.in/sitemap.xml');
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  console.log(`Total sitemap URLs: ${urls.length}`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
      const html = await resp.text();
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
      const status = resp.status;
      const title = titleMatch ? titleMatch[1] : 'NONE';
      const canon = canonMatch ? canonMatch[1] : 'NONE';
      
      if (status === 200) {
        ok++;
        console.log(`${i+1}. [200 OK] ${url} | Title: ${title.slice(0, 35)}... | Canon: ${canon}`);
      } else {
        fail++;
        console.log(`${i+1}. [Status ${status}] ${url}`);
      }
    } catch (e) {
      fail++;
      console.log(`${i+1}. [ERROR] ${url} -> ${e.message}`);
    }
  }
  console.log(`\nSummary: ${ok} successes, ${fail} failures.`);
}

runAudit();
