import { Project } from '../types';

export interface MultiPlatformSeoData {
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  imageAltText: string;
  canonicalUrl: string;
  ogImage: string;
  seoScore: number;
  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
    siteName: string;
    locale: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  whatsapp: {
    title: string;
    text: string;
    shareUrl: string;
  };
  linkedin: {
    title: string;
    summary: string;
    shareUrl: string;
  };
  telegram: {
    text: string;
    shareUrl: string;
  };
  facebook: {
    shareUrl: string;
  };
  schemaJsonLd: object;
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=85";
const BASE_DOMAIN = "https://bshomez.in";

/**
 * Calculates a comprehensive SEO Quality Score (0 - 100)
 */
export function calculateSeoScore(meta: {
  title?: string;
  description?: string;
  keywords?: string[];
  imageAltText?: string;
  hasImage?: boolean;
}): number {
  let score = 0;

  // Title: ideal 40 - 65 chars (+25 pts)
  const titleLen = meta.title?.trim().length || 0;
  if (titleLen >= 35 && titleLen <= 65) score += 25;
  else if (titleLen > 0) score += 12;

  // Description: ideal 120 - 165 chars (+25 pts)
  const descLen = meta.description?.trim().length || 0;
  if (descLen >= 120 && descLen <= 165) score += 25;
  else if (descLen >= 80) score += 15;
  else if (descLen > 0) score += 8;

  // Keywords: 5+ tags (+20 pts)
  const kwCount = meta.keywords?.length || 0;
  if (kwCount >= 8) score += 20;
  else if (kwCount >= 4) score += 12;
  else if (kwCount > 0) score += 6;

  // Image Alt Text (+15 pts)
  const altLen = meta.imageAltText?.trim().length || 0;
  if (altLen >= 20) score += 15;
  else if (altLen > 0) score += 8;

  // Image Present (+15 pts)
  if (meta.hasImage) score += 15;

  return Math.min(100, score);
}

/**
 * Automatically builds optimized multi-platform SEO & social sharing metadata for a property
 */
export function generateOptimizedSeoMetadata(
  project: Project,
  baseUrl: string = BASE_DOMAIN
): MultiPlatformSeoData {
  const targetId = project.id || project.name;
  const projectSlug = (project.name || targetId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const canonicalUrl = `${cleanBaseUrl}/projects/${projectSlug}/`;
  const coverImage = (project.imageUrls && project.imageUrls[0]) || project.mobileImageUrl || DEFAULT_BANNER;

  // 1. Title Generation: 50 - 60 chars target
  let metaTitle = project.metaTitle || project.seoTitle || '';
  if (!metaTitle) {
    const zoneStr = project.zone || project.location || 'Bangalore';
    const propType = project.propertyType || 'Apartment';
    metaTitle = `${project.name} in ${zoneStr}, Bangalore | ${propType} – BS Homez`.slice(0, 60);
  }

  // 2. Description Generation: 140 - 160 chars target
  let metaDescription = project.metaDescription || project.seoDescription || '';
  if (!metaDescription) {
    const builderStr = project.builderName ? `by ${project.builderName}` : '';
    const locStr = project.location || 'Bangalore';
    const priceStr = project.price ? `Price: ${project.price}.` : '';
    const amenitiesSnippet = (project.features && project.features.length > 0)
      ? project.features.slice(0, 3).join(', ')
      : 'Modern amenities, gated security';

    metaDescription = `${project.name} ${builderStr} in ${locStr}, Bangalore. ${priceStr} Features ${amenitiesSnippet}. RERA Verified. 0% Brokerage with BS Homez.`.slice(0, 160);
  }

  // 3. Keywords Generation
  let seoKeywords = project.seoKeywords || [];
  if (!seoKeywords || seoKeywords.length === 0) {
    const kwSet = new Set<string>([
      project.name,
      `${project.name} Bangalore`,
      `${project.name} Price`,
      `${project.propertyType} in ${project.zone || project.location || 'Bangalore'}`,
      `Buy ${project.propertyType} in Bangalore`,
      'BS Homez',
      '0% Builder Brokerage',
      'RERA Verified Bangalore',
      'East Bangalore Properties',
      ...(project.features || []).slice(0, 4).map(f => `${project.name} ${f}`)
    ]);
    seoKeywords = Array.from(kwSet).slice(0, 14);
  }

  // 4. Accessible Image Alt Text
  let imageAltText = (project as any).imageAltText || '';
  if (!imageAltText) {
    imageAltText = `${project.name} architectural exterior & amenities in ${project.location}, Bangalore - ${project.propertyType} by ${project.builderName || 'reputed builder'}`;
  }

  const seoScore = calculateSeoScore({
    title: metaTitle,
    description: metaDescription,
    keywords: seoKeywords,
    imageAltText,
    hasImage: Boolean(coverImage)
  });

  // Social Share formatting
  const shareText = `🌟 *${project.name}* (${project.propertyType}) in ${project.location}, Bangalore\n💰 Price: ${project.price || 'On Request'}\n🏗️ Developer: ${project.builderName || 'RERA Verified'}\n✅ 0% Brokerage with BS Homez\n\nExplore details, floor plans & brochure:\n${canonicalUrl}`;

  // Multi-platform URLs
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedTitle = encodeURIComponent(metaTitle);
  const encodedText = encodeURIComponent(shareText);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=BangaloreRealEstate,BSHomez,${(project.zone || 'Bangalore').replace(/\s+/g, '')}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`${project.name} - ${metaTitle}`)}`;

  // Schema.org JSON-LD Structured Graph for Google Search
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": project.propertyType === 'Villa' ? "SingleFamilyResidence" : project.propertyType === 'Plot' ? "LandParcel" : "ApartmentComplex",
        "@id": `${canonicalUrl}#property`,
        "name": project.name,
        "description": metaDescription,
        "url": canonicalUrl,
        "image": coverImage,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": project.location,
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "postalCode": "560066",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.9716,
          "longitude": 77.5946
        },
        "offers": {
          "@type": "Offer",
          "price": project.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl,
          "category": project.type || "Primary",
          "seller": {
            "@type": "RealEstateAgent",
            "name": "BS Homez",
            "email": "contact@bshomez.in",
            "url": baseUrl
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumbs`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Portfolios",
            "item": `${baseUrl}/?tab=projects`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": project.name,
            "item": canonicalUrl
          }
        ]
      }
    ]
  };

  return {
    metaTitle,
    metaDescription,
    seoKeywords,
    imageAltText,
    canonicalUrl,
    ogImage: coverImage,
    seoScore,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      image: coverImage,
      url: canonicalUrl,
      type: "website",
      siteName: "BS Homez",
      locale: "en_IN"
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      image: coverImage
    },
    whatsapp: {
      title: metaTitle,
      text: shareText,
      shareUrl: whatsappShareUrl
    },
    linkedin: {
      title: metaTitle,
      summary: metaDescription,
      shareUrl: linkedinShareUrl
    },
    telegram: {
      text: shareText,
      shareUrl: telegramShareUrl
    },
    facebook: {
      shareUrl: facebookShareUrl
    },
    schemaJsonLd
  };
}

/**
 * Automatically self-heals and enhances an array of projects so that all
 * properties possess 100% complete SEO titles, descriptions, keyword clusters,
 * and accessibility tags.
 */
export function autoEnhanceAllProjects(projects: Project[]): Project[] {
  return projects.map(proj => {
    // If project already has all SEO fields, keep it
    if (proj.metaTitle && proj.metaDescription && proj.seoKeywords && proj.seoKeywords.length > 0) {
      return proj;
    }

    const enhanced = generateOptimizedSeoMetadata(proj);
    return {
      ...proj,
      metaTitle: proj.metaTitle || enhanced.metaTitle,
      seoTitle: proj.seoTitle || enhanced.metaTitle,
      metaDescription: proj.metaDescription || enhanced.metaDescription,
      seoDescription: proj.seoDescription || enhanced.metaDescription,
      seoKeywords: (proj.seoKeywords && proj.seoKeywords.length > 0) ? proj.seoKeywords : enhanced.seoKeywords,
      imageAltText: (proj as any).imageAltText || enhanced.imageAltText,
      canonicalUrl: proj.canonicalUrl || enhanced.canonicalUrl,
      ogImage: proj.ogImage || enhanced.ogImage,
      seoLastSyncedAt: proj.seoLastSyncedAt || new Date().toISOString(),
      seoSyncSource: proj.seoSyncSource || 'AutoSeoEngine'
    };
  });
}
