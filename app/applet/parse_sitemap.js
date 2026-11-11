const https = require('https');
https.get('https://bshomez.in/sitemap.xml', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [...data.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    
    const homepage = [];
    const projects = [];
    const locations = [];
    const others = [];
    
    urls.forEach(url => {
      if (url === 'https://bshomez.in' || url === 'https://bshomez.in/') {
        homepage.push(url);
      } else if (url.includes('/projects/')) {
        projects.push(url);
      } else if (url.includes('/locations/')) {
        locations.push(url);
      } else {
        others.push(url);
      }
    });

    console.log("TOTAL URLS: " + urls.length + "\n");
    
    let counter = 1;
    console.log("=== HOMEPAGE ===");
    homepage.forEach(u => console.log((counter++) + ". " + u));
    
    console.log("\n=== PROJECT PAGES ===");
    projects.forEach(u => console.log((counter++) + ". " + u));
    
    console.log("\n=== LOCATION PAGES ===");
    locations.forEach(u => console.log((counter++) + ". " + u));
    
    if (others.length > 0) {
      console.log("\n=== OTHER PAGES ===");
      others.forEach(u => console.log((counter++) + ". " + u));
    }
  });
});
