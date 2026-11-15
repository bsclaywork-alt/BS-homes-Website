/**
 * scripts/update-sitemap.ts
 * Background script & automated pipeline to generate and update XML sitemaps
 * for all active real estate projects in Firestore and curated registries.
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, deleteApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setLogLevel, terminate } from 'firebase/firestore';
import { 
  generateSitemapXml, 
  SITEMAP_PROJECTS, 
  SitemapProjectItem 
} from '../src/data/projectsSitemapData';
import firebaseConfig from '../firebase-applet-config.json';

const LEGACY_PROJECT_NAMES = ['The Royal Orchard', 'East Gate Residences', 'Azure Lakes'];

// Prevent background ticks from repeatedly hitting Firestore after quota exhaustion or on fresh cache
let lastQuotaExceededTimestamp = 0;
const QUOTA_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours
const BACKGROUND_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

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

function readCachedSnapshot(cachePath: string, allowStaleOnQuota: boolean): SitemapProjectItem[] | null {
  try {
    if (!fs.existsSync(cachePath)) return null;
    const cacheRaw = fs.readFileSync(cachePath, 'utf-8');
    const cacheParsed = JSON.parse(cacheRaw);
    const lastFetchTime = cacheParsed.lastSuccessfulFetch ? new Date(cacheParsed.lastSuccessfulFetch).getTime() : 0;
    const ageDays = (Date.now() - lastFetchTime) / (1000 * 60 * 60 * 24);

    if (ageDays > 14 && !allowStaleOnQuota) {
      console.error(`[Build Error] Firestore snapshot cache is older than 14 days (last refreshed: ${cacheParsed.lastSuccessfulFetch}, age: ${ageDays.toFixed(1)} days). Stale inventory publishing blocked.`);
      process.exit(1);
    }

    return Array.isArray(cacheParsed.projects) ? cacheParsed.projects : [];
  } catch {
    return null;
  }
}

/**
 * Fetches all active projects from the Firestore database with snapshot caching and stale-cache protection
 */
export async function fetchActiveDbProjects(options?: { forceRefresh?: boolean }): Promise<SitemapProjectItem[]> {
  const cachePath = path.resolve(process.cwd(), 'src/data/cachedFirestoreProjects.json');
  const forceRefresh = options?.forceRefresh ?? false;

  // For automated background refreshes, skip live Firestore read if quota was recently exceeded or cache is still fresh
  if (!forceRefresh) {
    if (lastQuotaExceededTimestamp && Date.now() - lastQuotaExceededTimestamp < QUOTA_COOLDOWN_MS) {
      const cached = readCachedSnapshot(cachePath, true);
      if (cached) return cached;
    }

    try {
      if (fs.existsSync(cachePath)) {
        const cacheRaw = fs.readFileSync(cachePath, 'utf-8');
        const cacheParsed = JSON.parse(cacheRaw);
        const lastFetchTime = cacheParsed.lastSuccessfulFetch ? new Date(cacheParsed.lastSuccessfulFetch).getTime() : 0;
        if (lastFetchTime > 0 && Date.now() - lastFetchTime < BACKGROUND_CACHE_TTL_MS && Array.isArray(cacheParsed.projects)) {
          return cacheParsed.projects;
        }
      }
    } catch {
      // Proceed to live fetch if cache cannot be parsed
    }
  }

  let tempApp: FirebaseApp | null = null;
  let db: ReturnType<typeof getFirestore> | null = null;

  try {
    setLogLevel('silent');
    tempApp = initializeApp(firebaseConfig, `sitemap-fetch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    db = getFirestore(tempApp, firebaseConfig.firestoreDatabaseId);
    const snap = await getDocs(collection(db, 'projects'));

    const items: SitemapProjectItem[] = [];

    for (const doc of snap.docs) {
      const data = doc.data();

      // Skip deleted or paused projects (Reconciliation: prune inactive/deleted projects)
      if (data.isDeleted === true || data.isPaused === true) {
        continue;
      }

      // Skip legacy mock projects
      if (data.name && LEGACY_PROJECT_NAMES.includes(data.name)) {
        continue;
      }

      // Validate required fields
      if (!doc.id || !data.name) {
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

    // Reset quota cooldown on successful live fetch
    lastQuotaExceededTimestamp = 0;

    // Never overwrite with empty/failed result if successfully fetched but empty unexpectedly,
    // but if live fetch is valid, update the persistent JSON snapshot
    if (items.length > 0) {
      const cachePayload = {
        lastSuccessfulFetch: new Date().toISOString(),
        projectCount: items.length,
        dataSource: 'firestore-live',
        schemaVersion: '1.0',
        projects: items
      };
      try {
        fs.writeFileSync(cachePath, JSON.stringify(cachePayload, null, 2), 'utf-8');
        console.log(`[Firestore Cache] Successfully refreshed snapshot with ${items.length} active projects.`);
      } catch (cacheErr) {
        console.warn('[Firestore Cache] Warning writing snapshot file:', cacheErr);
      }
    }

    return items;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const isQuotaExceeded =
      errMsg.includes('Quota') ||
      errMsg.includes('quota') ||
      errMsg.includes('resource-exhausted') ||
      errMsg.includes('Free daily read units');

    if (isQuotaExceeded) {
      lastQuotaExceededTimestamp = Date.now();
      console.info('[Firestore Cache] Daily free-tier read quota reached; using cached project snapshot until quota resets.');
    } else {
      console.info('[Firestore Cache] Live Firestore fetch unavailable; falling back to cached snapshot:', errMsg);
    }

    const cachedProjects = readCachedSnapshot(cachePath, isQuotaExceeded);
    if (cachedProjects) {
      return cachedProjects;
    }

    console.info('[Firestore Cache] No cached snapshot found. Proceeding with curated baseline data.');
    return [];
  } finally {
    if (db) {
      await terminate(db).catch(() => {});
    }
    if (tempApp) {
      await deleteApp(tempApp).catch(() => {});
    }
  }
}

/**
 * Merges active database projects with curated projects
 */
export function mergeProjects(curated: SitemapProjectItem[], fromDb: SitemapProjectItem[]): SitemapProjectItem[] {
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
  forceRefresh?: boolean;
}): Promise<SitemapUpdateResult> {
  // Enforce production custom domain https://bshomez.in for search engines & web platforms
  const rawBase = options?.baseUrl || (process.env.APP_URL && !process.env.APP_URL.includes('run.app') ? process.env.APP_URL : 'https://bshomez.in');
  const baseUrl = rawBase.replace(/\/$/, '');
  const timestamp = new Date().toISOString();

  try {
    if (!options?.silent) {
      console.log(`[Sitemap Generator] Starting automated XML sitemap update for ${baseUrl}...`);
    }

    // 1. Fetch active projects from Firestore (respecting cache/cooldown unless forceRefresh is true)
    const dbProjects = await fetchActiveDbProjects({ forceRefresh: options?.forceRefresh });

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
