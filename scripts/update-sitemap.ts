/**
 * scripts/update-sitemap.ts
 * Background script & automated pipeline to generate and update XML sitemaps
 * for all active real estate projects in Firestore and curated registries.
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { 
  generateSitemapXml, 
  SITEMAP_PROJECTS, 
  SitemapProjectItem 
} from '../src/data/projectsSitemapData';
import firebaseConfig from '../firebase-applet-config.json';

const LEGACY_PROJECT_NAMES = ['The Royal Orchard', 'East Gate Residences', 'Azure Lakes'];

export interface SitemapUpdateResult {
  success: boolean;
  timestamp: string;
  baseUrl: string;
  totalUrls: number;
  totalProjects: number;
  dbProjectsCount: number;
  curatedProjectsCount: number;
  outputPath: string;
  error?: string;
}

/**
 * Fetches all active projects from the Firestore database
 */
async function fetchActiveDbProjects(): Promise<SitemapProjectItem[]> {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    const snap = await getDocs(collection(db, 'projects'));

    const items: SitemapProjectItem[] = [];

    for (const doc of snap.docs) {
      const data = doc.data();

      // Skip deleted or paused projects
      if (data.isDeleted === true || data.isPaused === true) {
        continue;
      }

      // Skip legacy mock projects
      if (data.name && LEGACY_PROJECT_NAMES.includes(data.name)) {
        continue;
      }

      // Format lastmod from updatedAt or createdAt
      let lastmod = new Date().toISOString().split('T')[0];
      if (data.updatedAt?.toDate) {
        lastmod = data.updatedAt.toDate().toISOString().split('T')[0];
      } else if (data.createdAt?.toDate) {
        lastmod = data.createdAt.toDate().toISOString().split('T')[0];
      }

      // Resolve primary image
      let imageUrl = data.heroImage || (data.imageUrls && data.imageUrls[0]) || '';
      if (!imageUrl || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
        imageUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
      }

      items.push({
        id: doc.id,
        name: data.name || 'BS Homez Luxury Project',
        builderName: data.builderName || 'Premier Bangalore Developer',
        builderCategory: data.builderCategory || 'A',
        propertyType: data.propertyType || 'Apartment',
        type: data.type || 'Primary',
        zone: data.zone || 'Whitefield',
        location: data.location || 'Bangalore East',
        price: data.price || data.lastPrice || 'Price on Request',
        description: data.description || `${data.name} in ${data.location || 'Bangalore'}, verified luxury residential project by BS Homez.`,
        reraNumber: data.reraNumber || '',
        handoverDate: data.handoverDate || 'Ready to Move',
        imageUrl,
        lastmod
      });
    }

    return items;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (
      errMsg.includes('Quota') ||
      errMsg.includes('quota') ||
      errMsg.includes('resource-exhausted') ||
      (err as { code?: string })?.code === 'resource-exhausted'
    ) {
      console.info('[Sitemap Generator] Daily Firestore read quota reached; generated sitemap using verified curated baseline data.');
    } else {
      console.warn('[Sitemap Generator] Notice fetching from Firestore, proceeding with curated baseline:', errMsg);
    }
    return [];
  }
}

/**
 * Merges active database projects with curated projects
 */
function mergeProjects(curated: SitemapProjectItem[], fromDb: SitemapProjectItem[]): SitemapProjectItem[] {
  const mergedMap = new Map<string, SitemapProjectItem>();

  // Add curated projects first
  for (const item of curated) {
    const key = (item.name || item.id).toLowerCase().trim();
    mergedMap.set(key, item);
  }

  // Database active items override or add
  for (const dbItem of fromDb) {
    const key = (dbItem.name || dbItem.id).toLowerCase().trim();
    mergedMap.set(key, dbItem);
  }

  return Array.from(mergedMap.values());
}

/**
 * Generates and updates sitemap.xml on disk & returns status
 */
export async function updateSitemap(options?: { 
  baseUrl?: string; 
  silent?: boolean;
}): Promise<SitemapUpdateResult> {
  // Enforce production custom domain https://bshomez.in for search engines & web platforms
  const rawBase = options?.baseUrl || (process.env.APP_URL && !process.env.APP_URL.includes('run.app') ? process.env.APP_URL : 'https://bshomez.in');
  const baseUrl = rawBase.replace(/\/$/, '');
  const timestamp = new Date().toISOString();

  try {
    if (!options?.silent) {
      console.log(`[Sitemap Generator] Starting automated XML sitemap update for ${baseUrl}...`);
    }

    // 1. Fetch active projects from Firestore
    const dbProjects = await fetchActiveDbProjects();

    // 2. Merge with curated baseline projects
    const allActiveProjects = mergeProjects(SITEMAP_PROJECTS, dbProjects);

    // 3. Generate dynamic XML sitemap
    const sitemapXml = generateSitemapXml(baseUrl, allActiveProjects);

    // 4. Calculate total URLs (Core tabs + corridors + projects)
    const urlMatches = sitemapXml.match(/<url>/g);
    const totalUrls = urlMatches ? urlMatches.length : allActiveProjects.length;

    // 5. Write to public/sitemap.xml
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');

    // 6. Write to dist/sitemap.xml if dist directory exists
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    }

    // 7. Write audit status file public/sitemap-status.json
    const statusResult: SitemapUpdateResult = {
      success: true,
      timestamp,
      baseUrl,
      totalUrls,
      totalProjects: allActiveProjects.length,
      dbProjectsCount: dbProjects.length,
      curatedProjectsCount: SITEMAP_PROJECTS.length,
      outputPath: publicSitemapPath
    };

    fs.writeFileSync(
      path.join(publicDir, 'sitemap-status.json'),
      JSON.stringify(statusResult, null, 2),
      'utf-8'
    );

    if (!options?.silent) {
      console.log(`[Sitemap Generator] Successfully generated sitemap with ${totalUrls} URLs (${allActiveProjects.length} projects, ${dbProjects.length} from database).`);
      console.log(`[Sitemap Generator] Saved to: ${publicSitemapPath}`);
    }

    return statusResult;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error('[Sitemap Generator] Error updating sitemap:', err);
    return {
      success: false,
      timestamp,
      baseUrl,
      totalUrls: 0,
      totalProjects: 0,
      dbProjectsCount: 0,
      curatedProjectsCount: 0,
      outputPath: '',
      error: errorMsg
    };
  }
}

// If executed directly from command line (e.g. tsx scripts/update-sitemap.ts)
const isDirectExecution = process.argv[1] && process.argv[1].includes('update-sitemap');
if (isDirectExecution) {
  updateSitemap().then((res) => {
    if (res.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}
