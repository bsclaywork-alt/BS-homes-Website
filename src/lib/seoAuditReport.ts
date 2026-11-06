import { Project } from '../types';

export interface ImageAltAuditItem {
  id: string;
  projectId: string;
  projectName: string;
  propertyType: string;
  location: string;
  zone: string;
  imageRole: 'Primary Elevation' | 'Gallery Asset' | 'Mobile Banner' | 'Floor Plan' | 'Social Share Card' | 'Project Asset';
  imageIndex: number;
  imageUrl: string;
  currentAltText: string;
  status: 'OPTIMIZED' | 'MISSING' | 'GENERIC';
  recommendedAltText: string;
  charCount: number;
  priority: 'High' | 'Medium' | 'Low';
  wcagRule: string;
}

export interface SeoAuditSummary {
  projectName: string;
  totalImages: number;
  optimizedCount: number;
  missingCount: number;
  genericCount: number;
  healthScore: number; // 0 - 100%
  items: ImageAltAuditItem[];
  generatedAt: string;
}

/**
 * Generates an accessible, WCAG 2.2-compliant recommended alt text for an image
 */
export function generateRecommendedAltText(
  project: Project,
  role: ImageAltAuditItem['imageRole'],
  index: number
): string {
  const pName = project.name.trim();
  const pType = (project.propertyType || 'Apartment').toLowerCase();
  const pLoc = project.location || project.zone || 'Bangalore';
  const featuresSnippet = (project.features && project.features.length > 0)
    ? project.features.slice(0, 3).join(', ')
    : 'modern amenities and landscaped green open spaces';

  switch (role) {
    case 'Primary Elevation':
      return `${pName} - Contemporary architectural exterior elevation of luxury ${pType} in ${pLoc}, Bangalore highlighting ${featuresSnippet}.`;
    case 'Mobile Banner':
      return `${pName} - Responsive architectural view of ${pType} residences in ${pLoc}, Bangalore.`;
    case 'Floor Plan':
      return `${pName} - Master unit architectural floor plan and dimensional layout in ${pLoc}, Bangalore.`;
    case 'Social Share Card':
      return `${pName} - Verified RERA luxury ${pType} project in ${pLoc}, Bangalore by BS Homez.`;
    case 'Gallery Asset':
    default:
      if (index === 1) {
        return `${pName} - Clubhouse and lifestyle recreational amenities view in ${pLoc}, Bangalore.`;
      } else if (index === 2) {
        return `${pName} - Interior living space aesthetic and balcony architectural design in ${pLoc}, Bangalore.`;
      } else if (index === 3) {
        return `${pName} - Master bedroom and spatial interior finishing in ${pLoc}, Bangalore.`;
      }
      return `${pName} - Architectural gallery photo #${index + 1} showcasing ${pType} details in ${pLoc}, Bangalore.`;
  }
}

/**
 * Checks if alt text is missing, generic, or optimized
 */
export function evaluateAltTextStatus(alt: string | undefined | null): {
  status: 'OPTIMIZED' | 'MISSING' | 'GENERIC';
  cleanAlt: string;
} {
  const cleanAlt = (alt || '').trim();
  if (!cleanAlt) {
    return { status: 'MISSING', cleanAlt: '' };
  }

  const lower = cleanAlt.toLowerCase();
  const genericPlaceholders = [
    'image', 'photo', 'picture', 'img', 'dsc', 'screenshot', 'untitled',
    'banner', 'cover', 'test', 'placeholder', 'asset'
  ];

  // If very short or equals generic placeholders
  if (cleanAlt.length < 12 || genericPlaceholders.includes(lower)) {
    return { status: 'GENERIC', cleanAlt };
  }

  return { status: 'OPTIMIZED', cleanAlt };
}

/**
 * Compiles a comprehensive image alt text audit for a single project
 */
export function compileProjectImageAltAudit(
  project: Project,
  overrideMainAltText?: string
): SeoAuditSummary {
  const items: ImageAltAuditItem[] = [];
  const pId = project.id || project.name;
  const pName = project.name;
  const pType = project.propertyType || 'Apartment';
  const pLoc = project.location || project.zone || 'Bangalore';
  const pZone = project.zone || 'Bangalore';

  // 1. Primary & Gallery Images from imageUrls
  const urls = Array.isArray(project.imageUrls) ? project.imageUrls : [];
  urls.forEach((url, idx) => {
    if (!url || typeof url !== 'string' || !url.trim()) return;

    const isPrimary = idx === 0;
    const role: ImageAltAuditItem['imageRole'] = isPrimary ? 'Primary Elevation' : 'Gallery Asset';
    
    // Existing alt text resolution
    let existingAlt = '';
    if (isPrimary) {
      existingAlt = overrideMainAltText !== undefined 
        ? overrideMainAltText 
        : ((project as any).imageAltText || project.metaDescription?.slice(0, 80) || '');
    } else {
      existingAlt = ((project as any).imageAltTexts && (project as any).imageAltTexts[url]) || '';
    }

    const { status, cleanAlt } = evaluateAltTextStatus(existingAlt);
    const recommended = generateRecommendedAltText(project, role, idx);

    items.push({
      id: `${pId}-img-${idx}`,
      projectId: pId,
      projectName: pName,
      propertyType: pType,
      location: pLoc,
      zone: pZone,
      imageRole: role,
      imageIndex: idx,
      imageUrl: url.trim(),
      currentAltText: cleanAlt,
      status,
      recommendedAltText: recommended,
      charCount: cleanAlt.length,
      priority: isPrimary ? 'High' : 'Medium',
      wcagRule: 'WCAG 2.2 Level A - 1.1.1 Non-text Content'
    });
  });

  // 2. Mobile Image if distinct
  if (project.mobileImageUrl && typeof project.mobileImageUrl === 'string' && project.mobileImageUrl.trim()) {
    const mobUrl = project.mobileImageUrl.trim();
    if (!items.some(i => i.imageUrl === mobUrl)) {
      const existingAlt = ((project as any).mobileImageAltText || '');
      const { status, cleanAlt } = evaluateAltTextStatus(existingAlt);
      items.push({
        id: `${pId}-mobile-img`,
        projectId: pId,
        projectName: pName,
        propertyType: pType,
        location: pLoc,
        zone: pZone,
        imageRole: 'Mobile Banner',
        imageIndex: items.length,
        imageUrl: mobUrl,
        currentAltText: cleanAlt,
        status,
        recommendedAltText: generateRecommendedAltText(project, 'Mobile Banner', items.length),
        charCount: cleanAlt.length,
        priority: 'High',
        wcagRule: 'WCAG 2.2 Level A - 1.1.1 Non-text Content'
      });
    }
  }

  // 3. Floor Plan Image if distinct
  if (project.floorPlanImageUrl && typeof project.floorPlanImageUrl === 'string' && project.floorPlanImageUrl.trim()) {
    const fpUrl = project.floorPlanImageUrl.trim();
    if (!items.some(i => i.imageUrl === fpUrl)) {
      const existingAlt = ((project as any).floorPlanAltText || '');
      const { status, cleanAlt } = evaluateAltTextStatus(existingAlt);
      items.push({
        id: `${pId}-floorplan-img`,
        projectId: pId,
        projectName: pName,
        propertyType: pType,
        location: pLoc,
        zone: pZone,
        imageRole: 'Floor Plan',
        imageIndex: items.length,
        imageUrl: fpUrl,
        currentAltText: cleanAlt,
        status,
        recommendedAltText: generateRecommendedAltText(project, 'Floor Plan', items.length),
        charCount: cleanAlt.length,
        priority: 'Medium',
        wcagRule: 'WCAG 2.2 Level A - 1.1.1 Non-text Content'
      });
    }
  }

  // 4. Social OG Image if distinct
  if (project.ogImage && typeof project.ogImage === 'string' && project.ogImage.trim()) {
    const ogUrl = project.ogImage.trim();
    if (!items.some(i => i.imageUrl === ogUrl)) {
      const existingAlt = ((project as any).ogImageAlt || '');
      const { status, cleanAlt } = evaluateAltTextStatus(existingAlt);
      items.push({
        id: `${pId}-og-img`,
        projectId: pId,
        projectName: pName,
        propertyType: pType,
        location: pLoc,
        zone: pZone,
        imageRole: 'Social Share Card',
        imageIndex: items.length,
        imageUrl: ogUrl,
        currentAltText: cleanAlt,
        status,
        recommendedAltText: generateRecommendedAltText(project, 'Social Share Card', items.length),
        charCount: cleanAlt.length,
        priority: 'Low',
        wcagRule: 'WCAG 2.2 Level A - 1.1.1 Non-text Content'
      });
    }
  }

  const totalImages = items.length;
  const optimizedCount = items.filter(i => i.status === 'OPTIMIZED').length;
  const missingCount = items.filter(i => i.status === 'MISSING').length;
  const genericCount = items.filter(i => i.status === 'GENERIC').length;
  const healthScore = totalImages > 0 ? Math.round((optimizedCount / totalImages) * 100) : 100;

  return {
    projectName: pName,
    totalImages,
    optimizedCount,
    missingCount,
    genericCount,
    healthScore,
    items,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Compiles a portfolio-wide image alt text audit for all projects
 */
export function compilePortfolioImageAltAudit(projects: Project[]): {
  totalProjects: number;
  totalImages: number;
  optimizedCount: number;
  missingCount: number;
  genericCount: number;
  healthScore: number;
  items: ImageAltAuditItem[];
  summaries: SeoAuditSummary[];
  generatedAt: string;
} {
  const summaries: SeoAuditSummary[] = [];
  const allItems: ImageAltAuditItem[] = [];

  projects.forEach(p => {
    if (p.isDeleted) return;
    const summary = compileProjectImageAltAudit(p);
    summaries.push(summary);
    allItems.push(...summary.items);
  });

  const totalImages = allItems.length;
  const optimizedCount = allItems.filter(i => i.status === 'OPTIMIZED').length;
  const missingCount = allItems.filter(i => i.status === 'MISSING').length;
  const genericCount = allItems.filter(i => i.status === 'GENERIC').length;
  const healthScore = totalImages > 0 ? Math.round((optimizedCount / totalImages) * 100) : 100;

  return {
    totalProjects: summaries.length,
    totalImages,
    optimizedCount,
    missingCount,
    genericCount,
    healthScore,
    items: allItems,
    summaries,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Escapes values for standard RFC 4180 CSV export
 */
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Generates an RFC 4180 CSV string from audit items
 */
export function generateSeoAuditCsv(
  items: ImageAltAuditItem[],
  scopeTitle = 'BS Homez Project SEO Alt Text Audit'
): string {
  const headers = [
    'Project Name',
    'Project ID',
    'Property Type',
    'Location',
    'Zone',
    'Image Role',
    'Image Index',
    'Alt Text Status',
    'Current Alt Text',
    'Recommended WCAG Alt Text',
    'Character Count',
    'Priority',
    'WCAG Compliance Rule',
    'Image URL',
    'Audit Timestamp'
  ];

  const now = new Date().toISOString();
  const rows = items.map(item => {
    return [
      escapeCsv(item.projectName),
      escapeCsv(item.projectId),
      escapeCsv(item.propertyType),
      escapeCsv(item.location),
      escapeCsv(item.zone),
      escapeCsv(item.imageRole),
      escapeCsv(item.imageIndex + 1),
      escapeCsv(item.status),
      escapeCsv(item.currentAltText),
      escapeCsv(item.recommendedAltText),
      escapeCsv(item.charCount),
      escapeCsv(item.priority),
      escapeCsv(item.wcagRule),
      escapeCsv(item.imageUrl),
      escapeCsv(now)
    ].join(',');
  });

  // Include metadata commentary rows at the top for excel review
  const summaryHeader = [
    `# ${scopeTitle}`,
    `# Total Images Audited: ${items.length}`,
    `# Missing Alt Text: ${items.filter(i => i.status === 'MISSING').length}`,
    `# Generic Alt Text: ${items.filter(i => i.status === 'GENERIC').length}`,
    `# Optimized Alt Text: ${items.filter(i => i.status === 'OPTIMIZED').length}`,
    `# Generated At: ${now}`
  ].join('\r\n');

  return '\uFEFF' + summaryHeader + '\r\n\r\n' + headers.join(',') + '\r\n' + rows.join('\r\n');
}

/**
 * Triggers a browser file download of the CSV report
 */
export function downloadSeoAuditCsv(
  items: ImageAltAuditItem[],
  filename: string,
  scopeTitle?: string
): void {
  const csvData = generateSeoAuditCsv(items, scopeTitle);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
