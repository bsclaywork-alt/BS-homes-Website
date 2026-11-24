import {
  OFFER_AMENITIES,
  OfferConfiguration,
  OfferDoorFacing,
  OfferFurnishing,
  OfferPropertyStatus,
  OfferPropertyType,
  OfferSellerType,
  OfferSocietyType,
  OfferWillingTo,
  Project,
  PropertySubmission,
  PublicPortfolioItem,
  SubmissionWorkflowStatus,
  UploadedMediaItem
} from '../types';
import { validateMobileNumber } from '../components/PhoneInputWithCountry';

export interface OfferAssetFormInput {
  ownerName: string;
  ownerMobile: string;
  countryCode?: string;
  propertyName: string;
  location: string;
  fullAddress: string;
  googleMapUrl: string;
  reraNumber: string;
  willingTo: OfferWillingTo;
  sellerType: OfferSellerType;
  rentPerMonth: string;
  maintenance: string;
  advance: string;
  availableFrom: string;
  propertyType: OfferPropertyType;
  societyType: OfferSocietyType;
  expectedPrice: string;
  propertyStatus: OfferPropertyStatus;
  possessionDate: string;
  configuration: OfferConfiguration;
  doorFacing: OfferDoorFacing;
  floorNumber: string;
  towerNumber: string;
  totalAcres: string;
  amenities: string[];
  furnishing: OfferFurnishing;
  others: string;
  photos: UploadedMediaItem[];
  video: UploadedMediaItem | null;
}

export const INITIAL_OFFER_ASSET_FORM: OfferAssetFormInput = {
  ownerName: '',
  ownerMobile: '',
  countryCode: '+91',
  propertyName: '',
  location: '',
  fullAddress: '',
  googleMapUrl: '',
  reraNumber: '',
  willingTo: 'Sell',
  sellerType: 'Resale',
  rentPerMonth: '',
  maintenance: '',
  advance: '',
  availableFrom: '',
  propertyType: 'Apartment',
  societyType: 'Gated',
  expectedPrice: '',
  propertyStatus: 'Ready to Move',
  possessionDate: '',
  configuration: '3 BHK',
  doorFacing: 'East',
  floorNumber: '',
  towerNumber: '',
  totalAcres: '',
  amenities: [],
  furnishing: 'Semi Furnished',
  others: '',
  photos: [],
  video: null
};

export const PRIVATE_OWNER_FIELDS = [
  'ownerName',
  'ownerMobile',
  'ownerPhone',
  'ownerEmail',
  'ownerContact',
  'fullAddress',
  'privateNotes',
  'mobile',
  'phone',
  'email'
] as const;

export function resolveTargetPortfolioCategory(
  willingTo: OfferWillingTo,
  sellerType?: OfferSellerType
): 'Primary' | 'Resale' | 'Rental' {
  if (willingTo === 'Rental') return 'Rental';
  if (sellerType === 'Builder') return 'Primary';
  return 'Resale';
}

export function formatIndianCurrencyCompact(value: number | string | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
  if (!num || !Number.isFinite(num) || num <= 0) return 'Price on Request*';
  if (num >= 10000000) {
    return `Rs. ${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr*`;
  }
  if (num >= 100000) {
    return `Rs. ${(num / 100000).toFixed(2).replace(/\.00$/, '')} L*`;
  }
  return `Rs. ${Math.round(num).toLocaleString('en-IN')}*`;
}

export function formatMonthlyRentCompact(value: number | string | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
  if (!num || !Number.isFinite(num) || num <= 0) return 'Rent on Request*';
  return `Rs. ${Math.round(num).toLocaleString('en-IN')} / month*`;
}

export function validateOfferAssetInput(input: OfferAssetFormInput): {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
} {
  const errors: Record<string, string> = {};

  if (!input.ownerName || input.ownerName.trim().length < 2) {
    errors.ownerName = 'Owner Name is required (minimum 2 characters).';
  }

  const phoneValidation = validateMobileNumber(input.countryCode || '+91', input.ownerMobile);
  if (!phoneValidation.isValid) {
    errors.ownerMobile = phoneValidation.message || 'Please enter a valid Owner Mobile Number.';
  }

  if (!input.propertyName || input.propertyName.trim().length < 2) {
    errors.propertyName = 'Property / Project Name is required.';
  }

  if (!input.location || input.location.trim().length < 2) {
    errors.location = 'Location is required.';
  }

  if (input.googleMapUrl && input.googleMapUrl.trim()) {
    try {
      const parsed = new URL(input.googleMapUrl.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        errors.googleMapUrl = 'Google Map Location must be a valid http(s) URL.';
      }
    } catch {
      errors.googleMapUrl = 'Google Map Location must be a valid URL (e.g. https://maps.google.com/...).';
    }
  }

  if (input.willingTo === 'Sell') {
    if (!['Resale', 'Builder', 'Landlord'].includes(input.sellerType)) {
      errors.sellerType = 'Please choose Resale, Builder, or Landlord.';
    }
    const priceNum = parseFloat(String(input.expectedPrice || '').replace(/,/g, ''));
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      errors.expectedPrice = 'Expected Price must be a valid positive number.';
    }
  } else if (input.willingTo === 'Rental') {
    const rentNum = parseFloat(String(input.rentPerMonth || '').replace(/,/g, ''));
    if (!Number.isFinite(rentNum) || rentNum <= 0) {
      errors.rentPerMonth = 'Rent per Month must be a valid positive number.';
    }
  } else {
    errors.willingTo = 'Please select Sell Property or Rental.';
  }

  if (input.others && input.others.length > 10000) {
    errors.others = 'Additional info must not exceed 10,000 characters.';
  }

  if (input.video?.durationSec && input.video.durationSec > 180) {
    errors.video = 'Walkthrough video exceeds the maximum 3 minutes (180 seconds) duration.';
  }

  const firstError = Object.values(errors)[0];
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError
  };
}

export function buildSubmissionDedupKey(input: OfferAssetFormInput): string {
  const digits = input.ownerMobile.replace(/\D/g, '').slice(-10);
  const prop = input.propertyName.trim().toLowerCase().replace(/\s+/g, '-');
  const loc = input.location.trim().toLowerCase().replace(/\s+/g, '-');
  return `${digits}_${prop}_${loc}_${input.willingTo.toLowerCase()}`;
}

export function createPropertySubmissionRecord(
  input: OfferAssetFormInput,
  ids: { submissionId: string; publicPortfolioId: string },
  options?: { status?: SubmissionWorkflowStatus; createdAt?: any }
): PropertySubmission {
  const category = resolveTargetPortfolioCategory(input.willingTo, input.sellerType);
  const validAmenities = (input.amenities || []).filter((a) =>
    (OFFER_AMENITIES as readonly string[]).includes(a)
  );
  const status: SubmissionWorkflowStatus = options?.status || 'Pending Review';
  const createdAt = options?.createdAt ?? new Date().toISOString();

  const base: PropertySubmission = {
    id: ids.submissionId,
    publicPortfolioId: ids.publicPortfolioId,
    dedupKey: buildSubmissionDedupKey(input),
    ownerName: input.ownerName.trim(),
    ownerMobile: input.ownerMobile.trim(),
    ownerCountryCode: input.countryCode || '+91',
    propertyName: input.propertyName.trim(),
    location: input.location.trim(),
    fullAddress: input.fullAddress.trim(),
    googleMapUrl: input.googleMapUrl.trim(),
    reraNumber: input.reraNumber.trim(),
    willingTo: input.willingTo,
    targetCategory: category,
    propertyType: input.propertyType,
    societyType: input.societyType,
    propertyStatus: input.propertyStatus,
    possessionDate: input.possessionDate || '',
    configuration: input.configuration,
    doorFacing: input.doorFacing,
    floorNumber: input.floorNumber.trim(),
    towerNumber: input.towerNumber.trim(),
    totalAcres: input.totalAcres.trim(),
    amenities: validAmenities,
    furnishing: input.furnishing,
    others: input.others.trim().slice(0, 10000),
    photos: input.photos || [],
    video: input.video || null,
    submissionStatus: status,
    isDeleted: false,
    createdAt,
    updatedAt: createdAt
  };

  if (input.willingTo === 'Sell') {
    base.sellerType = input.sellerType;
    base.expectedPrice = parseFloat(String(input.expectedPrice).replace(/,/g, ''));
  } else {
    base.rentPerMonth = parseFloat(String(input.rentPerMonth).replace(/,/g, ''));
    base.maintenance = input.maintenance.trim();
    base.advance = input.advance.trim();
    base.availableFrom = input.availableFrom || '';
  }

  return base;
}

/**
 * Produces a strictly sanitized PublicPortfolioItem.
 * Guarantees that ownerName, ownerMobile, fullAddress, and any contact PII are NEVER included.
 */
export function buildSanitizedPublicPortfolioRecord(
  submission: PropertySubmission,
  options?: { publicationStatus?: SubmissionWorkflowStatus }
): PublicPortfolioItem {
  const pubStatus: SubmissionWorkflowStatus =
    options?.publicationStatus || submission.submissionStatus || 'Pending Review';
  const category = resolveTargetPortfolioCategory(submission.willingTo, submission.sellerType);
  const imageUrls = (submission.photos || []).map((p) => p.url).filter(Boolean);
  const photoThumbnails = (submission.photos || [])
    .map((p) => p.thumbnailUrl || p.url)
    .filter(Boolean);

  const storagePaths: string[] = [];
  for (const photo of submission.photos || []) {
    if (photo.storagePath) storagePaths.push(photo.storagePath);
  }
  if (submission.video?.storagePath) {
    storagePaths.push(submission.video.storagePath);
  }

  const formattedPrice =
    category === 'Rental'
      ? formatMonthlyRentCompact(submission.rentPerMonth)
      : formatIndianCurrencyCompact(submission.expectedPrice);

  const sanitized: Record<string, any> = {
    id: submission.publicPortfolioId,
    submissionId: submission.id || '',
    name: submission.propertyName.trim(),
    location: submission.location.trim(),
    googleMapUrl: submission.googleMapUrl?.trim() || '',
    reraNumber: submission.reraNumber?.trim() || '',
    category,
    propertyType: submission.propertyType,
    societyType: submission.societyType,
    formattedPrice,
    propertyStatus: submission.propertyStatus,
    possessionDate: submission.possessionDate || '',
    configuration: submission.configuration,
    doorFacing: submission.doorFacing,
    floorNumber: submission.floorNumber || '',
    towerNumber: submission.towerNumber || '',
    totalAcres: submission.totalAcres || '',
    amenities: [...(submission.amenities || [])],
    furnishing: submission.furnishing,
    others: (submission.others || '').slice(0, 10000),
    mainImageUrl: imageUrls[0] || '',
    imageUrls,
    photoThumbnails,
    videoUrl: submission.video?.url || '',
    videoPosterUrl: submission.video?.posterUrl || '',
    storagePaths,
    publicationStatus: pubStatus,
    isPublished: pubStatus === 'Published',
    isDeleted: Boolean(submission.isDeleted),
    createdAt: submission.createdAt || new Date().toISOString(),
    updatedAt: submission.updatedAt || new Date().toISOString()
  };

  if (submission.willingTo === 'Sell') {
    sanitized.sellerType = submission.sellerType;
    if (submission.expectedPrice !== undefined) {
      sanitized.expectedPrice = submission.expectedPrice;
    }
  } else {
    if (submission.rentPerMonth !== undefined) {
      sanitized.rentPerMonth = submission.rentPerMonth;
    }
    if (submission.maintenance) sanitized.maintenance = submission.maintenance;
    if (submission.advance) sanitized.advance = submission.advance;
    if (submission.availableFrom) sanitized.availableFrom = submission.availableFrom;
  }

  // Runtime safeguard: strip any forbidden private field if ever passed accidentally
  for (const key of PRIVATE_OWNER_FIELDS) {
    if (key in sanitized) {
      delete sanitized[key];
    }
  }

  return sanitized as PublicPortfolioItem;
}

/**
 * Explicitly allowlists curator-editable fields for public_portfolio.
 * Never spreads a Project object, which may contain private/internal fields.
 */
export function buildPublicPortfolioCuratorUpdate(
  project: Project,
  existing: PublicPortfolioItem
): Partial<PublicPortfolioItem> {
  const formattedPrice = String(project.price || existing.formattedPrice).trim().slice(0, 150);
  const category = (['Primary', 'Resale', 'Rental'].includes(project.type)
    ? project.type : existing.category) as PublicPortfolioItem['category'];
  const numericPrice = Number(formattedPrice.replace(/[^0-9.]/g, ''));
  const update: Partial<PublicPortfolioItem> = {
    name: String(project.name || existing.name).trim().slice(0, 200),
    location: String(project.location || existing.location).trim().slice(0, 200),
    category,
    formattedPrice,
    configuration: (project.configuration?.[0] || existing.configuration) as PublicPortfolioItem['configuration'],
    amenities: Array.isArray(project.features) ? project.features.filter(Boolean).slice(0, 50) : existing.amenities,
    imageUrls: Array.isArray(project.imageUrls) ? project.imageUrls.filter(Boolean).slice(0, 25) : existing.imageUrls,
    mainImageUrl: String(project.mobileImageUrl || project.imageUrls?.[0] || existing.mainImageUrl || ''),
    videoUrl: String(project.videoUrl || existing.videoUrl || ''),
    googleMapUrl: String(project.mapUrl || existing.googleMapUrl || '').slice(0, 1000),
    reraNumber: String(project.reraNumber || existing.reraNumber || '').slice(0, 150),
    totalAcres: String(project.totalAcres || existing.totalAcres || '').slice(0, 100),
    floorNumber: String(project.floor || existing.floorNumber || '').slice(0, 100),
    towerNumber: String(project.tower || existing.towerNumber || '').slice(0, 100),
    maintenance: String(project.maintenance || existing.maintenance || '').slice(0, 100),
    advance: String(project.advance || existing.advance || '').slice(0, 100),
    availableFrom: String(project.availableFrom || existing.availableFrom || '').slice(0, 100),
    projectTypeCategory: String(project.projectTypeCategory || existing.projectTypeCategory || '').slice(0, 100),
    presentStatus: String(project.presentStatus || project.handoverStatus || existing.presentStatus || existing.propertyStatus || '').slice(0, 100),
    vaastuCompliant: String(project.vaastuCompliant || existing.vaastuCompliant || '').slice(0, 20),
    facingAvailable: Array.isArray(project.facingAvailable) ? project.facingAvailable.filter(Boolean).slice(0, 16) : existing.facingAvailable,
    floorRise: String(project.floorRise || existing.floorRise || '').slice(0, 100),
    totalUnits: String(project.totalUnits || existing.totalUnits || '').slice(0, 100),
    floorPlanSize: String(project.floorPlanSize || existing.floorPlanSize || '').slice(0, 150),
    bookingAmount: String(project.bookingAmount || existing.bookingAmount || '').slice(0, 100),
    interiorStatus: String(project.interiorStatus || project.furnishType || existing.interiorStatus || existing.furnishing || '').slice(0, 100),
    availability: String(project.availability || existing.availability || '').slice(0, 20),
    floorAvailability: String(project.floorAvailability || existing.floorAvailability || '').slice(0, 150),
    saleFrom: String(project.saleFrom || existing.saleFrom || existing.sellerType || '').slice(0, 100),
    aop: String(project.aop || existing.aop || '').slice(0, 50),
    expectedRentalIncome: String(project.expectedRentalIncome || existing.expectedRentalIncome || '').slice(0, 100),
    terrace: String(project.terrace || existing.terrace || '').slice(0, 20),
    garden: String(project.garden || existing.garden || '').slice(0, 20),
    projectWriteUps: String(project.projectWriteUps || project.description || existing.projectWriteUps || existing.others || '').slice(0, 10000)
  };
  if (Number.isFinite(numericPrice) && numericPrice > 0) {
    if (category === 'Rental') update.rentPerMonth = numericPrice;
    else update.expectedPrice = numericPrice;
  }
  return Object.fromEntries(
    Object.entries(update).filter(([, value]) => value !== undefined)
  ) as Partial<PublicPortfolioItem>;
}

export function publicPortfolioToProject(item: PublicPortfolioItem): Project {
  const handoverStatus: Project['handoverStatus'] =
    item.propertyStatus === 'EOI'
      ? 'EOI'
      : item.propertyStatus === 'Under Construction'
      ? 'Under Construction'
      : item.propertyStatus === 'Nearing Completion'
      ? 'Nearing Completion'
      : 'Ready to Move';

  const furnishMap: Record<OfferFurnishing, Project['furnishType']> = {
    'Semi Furnished': 'Semi Furnished',
    Furnished: 'Full Furnished',
    Unfurnished: 'Unfurnished'
  };

  return {
    id: item.id,
    submissionId: item.submissionId,
    sourceCollection: 'public_portfolio',
    publicationStatus: item.publicationStatus,
    name: item.name,
    description:
      item.others ||
      `${item.configuration} ${item.propertyType} in ${item.location} (${item.societyType} community, ${item.furnishing}).`,
    price: item.formattedPrice,
    lastPrice: item.formattedPrice,
    location: item.location,
    locationTarget: item.location,
    zone: 'East Bangalore',
    type: item.category,
    propertyType: item.propertyType,
    configuration: [item.configuration],
    segment: item.category === 'Rental' ? 'Curated Rental' : 'Verified Owner Listing',
    handoverStatus,
    reraNumber: item.reraNumber || '',
    handoverDate: item.possessionDate || item.availableFrom || 'Available',
    availableFrom: item.availableFrom || item.possessionDate || '',
    projectSize: item.totalAcres ? `${item.totalAcres} Acres` : '',
    mapUrl: item.googleMapUrl || '',
    imageUrls: item.imageUrls || [],
    mobileImageUrl: item.mainImageUrl || item.imageUrls?.[0] || '',
    videoUrl: item.videoUrl || '',
    mobileVideoUrl: item.videoUrl || '',
    videoPosterUrl: item.videoPosterUrl || '',
    storagePaths: item.storagePaths || [],
    features: item.amenities || [],
    mainDoorFacing: item.doorFacing,
    floor: item.floorNumber || '',
    tower: item.towerNumber || '',
    residenceType: item.configuration.replace(/\s+/g, ''),
    furnishType: furnishMap[item.furnishing] || 'Semi Furnished',
    interiorStatus: item.furnishing,
    projectTypeCategory: item.societyType === 'Gated' ? 'Gated' : 'Individual',
    saleFrom: item.sellerType || undefined,
    monthlyRental: item.rentPerMonth ? `Rs. ${item.rentPerMonth.toLocaleString('en-IN')}/mo` : '',
    maintenance: item.maintenance || '',
    advance: item.advance || '',
    isPaused: !item.isPublished,
    isDeleted: Boolean(item.isDeleted),
    createdAt: item.createdAt,
    projectTypeCategory: item.projectTypeCategory || (item.societyType === 'Gated' ? 'Gated' : 'Individual'),
    presentStatus: item.presentStatus || item.propertyStatus,
    vaastuCompliant: item.vaastuCompliant,
    facingAvailable: item.facingAvailable,
    floorRise: item.floorRise,
    totalUnits: item.totalUnits,
    floorPlanSize: item.floorPlanSize,
    bookingAmount: item.bookingAmount,
    interiorStatus: item.interiorStatus || item.furnishing,
    availability: item.availability,
    floorAvailability: item.floorAvailability,
    aop: item.aop,
    expectedRentalIncome: item.expectedRentalIncome,
    terrace: item.terrace,
    garden: item.garden,
    projectWriteUps: item.projectWriteUps || item.others,
    updatedAt: item.updatedAt
  };
}

/**
 * Safely collects Storage object paths/URLs owned ONLY by the target item and NOT referenced
 * by any other active property or submission, preventing accidental deletion of shared media.
 */
export function findUnsharedMediaPaths(
  targetMediaRefs: string[],
  remainingItems: Array<{ imageUrls?: string[]; videoUrl?: string; storagePaths?: string[] }>
): string[] {
  const cleanTarget = Array.from(new Set(targetMediaRefs.map((s) => s.trim()).filter(Boolean)));
  if (cleanTarget.length === 0) return [];

  const referencedElsewhere = new Set<string>();
  for (const item of remainingItems) {
    for (const url of item.imageUrls || []) {
      if (url) referencedElsewhere.add(url.trim());
    }
    if (item.videoUrl) referencedElsewhere.add(item.videoUrl.trim());
    for (const sp of item.storagePaths || []) {
      if (sp) referencedElsewhere.add(sp.trim());
    }
  }

  return cleanTarget.filter((refPath) => !referencedElsewhere.has(refPath));
}
