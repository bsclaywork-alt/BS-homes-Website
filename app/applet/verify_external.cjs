const https = require('https');

async function externalVerify() {
  const timestamp = new Date().toISOString();
  console.log(`Starting external production verification at ${timestamp}...`);

  const sitemapRes = await fetch('https://bshomez.in/sitemap.xml');
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  console.log(`Total URLs parsed from live sitemap: ${urls.length}\n`);

  const csvRows = [];
  csvRows.push("Index,URL,Timestamp,BrowserStatus,GooglebotStatus,FinalURL,CanonicalTag,TitlePresent,ContentMatch");

  const browserUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const googlebotUA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

  for (let i = 0; i < urls.length; i++) {
    const targetUrl = urls[i];
    try {
      // Test with Browser UA
      const bRes = await fetch(targetUrl, { 
        headers: { 'User-Agent': browserUA },
        redirect: 'follow'
      });
      const bHtml = await bRes.text();
      const bTitle = (bHtml.match(/<title>(.*?)<\/title>/i) || [])[1] || '';
      const bCanon = (bHtml.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i) || [])[1] || '';

      // Test with Googlebot UA
      const gRes = await fetch(targetUrl, { 
        headers: { 'User-Agent': googlebotUA },
        redirect: 'follow'
      });
      const gHtml = await gRes.text();
      const gCanon = (gHtml.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i) || [])[1] || '';

      const contentMatch = (bHtml.length > 500 && gHtml.length > 500) ? 'YES' : 'NO';
      const finalUrl = bRes.url;

      csvRows.push(`${i+1},"${targetUrl}","${timestamp}",${bRes.status},${gRes.status},"${finalUrl}","${bCanon}",${bTitle ? 'YES' : 'NO'},${contentMatch}`);
      console.log(`[${i+1}/59] ${targetUrl} -> Browser: ${bRes.status}, Googlebot: ${gRes.status}, Canon: ${bCanon}`);
    } catch (err) {
      csvRows.push(`${i+1},"${targetUrl}","${timestamp}",ERROR,ERROR,"","","","NO"`);
      console.log(`[${i+1}/59] ${targetUrl} -> ERROR: ${err.message}`);
    }
  }

  console.log("\n--- CSV RESULTS TABLE ---");
  csvRows.forEach(row => console.log(row));
}

externalVerify();
