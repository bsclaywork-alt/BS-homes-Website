export interface UploadedMediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  storagePath?: string;
  kind?: 'photo' | 'video';
  fileName: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  durationSec?: number;
  sha256?: string;
  hash?: string;
  source?: 'firebase-storage' | 'server-storage' | 'external-url' | 'google-drive';
  uploadedAt?: string;
}

export type SubmissionWorkflowStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Published'
  | 'Rejected'
  | 'Archived';

export type OfferWillingTo = 'Sell' | 'Rental';
export type OfferSellerType = 'Resale' | 'Builder' | 'Landlord';
export type OfferPropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Commercial';
export type OfferSocietyType = 'Gated' | 'Individual';
export type OfferPropertyStatus =
  | 'Ready to Move'
  | 'Under Construction'
  | 'EOI'
  | 'Nearing Completion';
export type OfferConfiguration = 'Studio' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5 BHK';
export type OfferDoorFacing =
  | 'East'
  | 'North'
  | 'West'
  | 'South'
  | 'South East'
  | 'North East';
export type OfferFurnishing = 'Semi Furnished' | 'Furnished' | 'Unfurnished';

export const OFFER_AMENITIES = [
  'Club House',
  'Gym',
  'Swimming Pool',
  'Kids Play Area',
  'Pet Park',
  'Outdoor Multipurpose Court',
  'Indoor Multipurpose Court',
  'Squash Court',
  'Multipurpose Hall',
  'Security',
  'CCTV',
  'Visitor Parking',
  'Lift',
  'Playground',
  'Home Theatre',
  'Super Market',
  'Salon',
  'Indoor Games',
  'Guest Rooms',
  'Garden',
  'Park',
  'Senior Citizen Park',
  'Walking and Jogging Track'
] as const;

export type OfferAmenity = (typeof OFFER_AMENITIES)[number];

export interface PropertySubmission {
  id?: string;
  publicPortfolioId: string;
  dedupKey?: string;

  // Section A: Owner Information (STRICTLY PRIVATE - Admin Only)
  ownerName: string;
  ownerMobile: string;
  propertyName: string;
  location: string;
  fullAddress: string;
  googleMapUrl: string;

  // Section B: Willing To
  willingTo: OfferWillingTo;
  sellerType?: OfferSellerType; // Only when willingTo === 'Sell'
  rentPerMonth?: number; // Only when willingTo === 'Rental'
  maintenance?: string;
  advance?: string;
  availableFrom?: string; // ISO YYYY-MM-DD calendar picker

  // Derived Portfolio Category
  targetCategory: 'Primary' | 'Resale' | 'Rental';

  // Section C: Property Details
  propertyType: OfferPropertyType;
  societyType: OfferSocietyType;
  expectedPrice?: number;
  propertyStatus: OfferPropertyStatus;
  possessionDate?: string; // ISO YYYY-MM-DD calendar picker
  configuration: OfferConfiguration;
  doorFacing: OfferDoorFacing;
  floorNumber: string;
  towerNumber: string;
  totalAcres: string;

  // Section D: Amenities
  amenities: string[];

  // Section E: Furnishing
  furnishing: OfferFurnishing;

  // Section F: Additional Info
  others: string; // Max 500 chars

  // Media
  photos: UploadedMediaItem[];
  video?: UploadedMediaItem | null;

  // Workflow & Audit
  submissionStatus: SubmissionWorkflowStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: any;
  isDeleted?: boolean;
  deletedAt?: any;
  createdAt: any;
  updatedAt?: any;
}

/**
 * Sanitized public portfolio document stored in `public_portfolio/{portfolioId}`.
 * STRICT PRIVACY INVARIANT: Must NEVER contain ownerName, ownerMobile, or private contact details.
 */
export interface PublicPortfolioItem {
  id: string;
  submissionId: string;
  name: string;
  location: string;
  publicAddressHint?: string;
  googleMapUrl?: string;
  category: 'Primary' | 'Resale' | 'Rental';
  propertyType: OfferPropertyType;
  societyType: OfferSocietyType;
  sellerType?: OfferSellerType;
  expectedPrice?: number;
  formattedPrice: string;
  rentPerMonth?: number;
  maintenance?: string;
  advance?: string;
  availableFrom?: string;
  propertyStatus: OfferPropertyStatus;
  possessionDate?: string;
  configuration: OfferConfiguration;
  doorFacing: OfferDoorFacing;
  floorNumber?: string;
  towerNumber?: string;
  totalAcres?: string;
  amenities: string[];
  furnishing: OfferFurnishing;
  others?: string;
  mainImageUrl: string;
  imageUrls: string[];
  photoThumbnails?: string[];
  videoUrl?: string;
  videoPosterUrl?: string;
  storagePaths?: string[];
  publicationStatus: SubmissionWorkflowStatus;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: any;
  updatedAt?: any;
}

export interface Project {
  id?: string;
  submissionId?: string;
  sourceCollection?: 'projects' | 'public_portfolio';
  publicationStatus?: SubmissionWorkflowStatus;
  name: string;
  description: string;
  price: string;
  location: string;
  locationTarget: string;
  zone:
    | 'Whitefield'
    | 'Hoskote'
    | 'Varthur'
    | 'Gunjur'
    | 'Hosa Road'
    | 'Kasavanahalli'
    | 'East Bangalore'
    | 'Off Sarjapur Road'
    | 'Sarjapur'
    | 'Electronic City'
    | 'Marathalli'
    | 'Bellandur'
    | 'South East Bangalore'
    | 'Bangalore East'
    | 'Bangalore North'
    | 'Bangalore West'
    | 'Bangalore South'
    | 'Bangalore Central'
    | 'All Zone';
  type: 'Primary' | 'Resale' | 'Rental' | 'Primary Sale';
  propertyType: 'Apartment' | 'Villa' | 'Plot' | 'Flat' | 'Commercial' | 'Stand Alone Building';
  builderCategory?: 'A+' | 'A' | 'B' | 'C';
  builderName?: string;
  approvalBody?: string;
  floorPlan?: string;
  floorPlanImageUrl?: string;
  configuration: string[];
  segment: string;
  handoverStatus?: "EOI" | "Under Construction" | "Ready to Move" | "Handed Over" | "Nearing Completion" | "Prelaunch" | "Official Launch";
  reraNumber?: string;
  handoverDate?: string;
  projectSize?: string;
  noOfTowers?: string;
  flatsPerFloor?: string;
  floorsHeight?: string;
  mapUrl?: string;
  paymentOffers?: string;
  imageUrls: string[];
  /** Whether project photos may be displayed on public website pages. Undefined preserves legacy visibility by project type. */
  showImagesOnline?: boolean;
  mobileImageUrl?: string;
  videoUrl?: string;
  mobileVideoUrl?: string;
  videoPosterUrl?: string;
  storagePaths?: string[];
  features: string[];
  priceChanged?: boolean;
  lastCheckedPrice?: string;
  lastPrice?: string;
  priceHistory?: { period: string; price: number; displayPrice: string }[];
  isPaused?: boolean;
  isDeleted?: boolean;
  sticker?: 'Sold Out' | 'Rented Out' | 'None';
  unitsRemaining?: number;
  isInventorySoldOut?: boolean;
  organicViews?: number;

  // Specific Rental & Resale Inventory Fields
  availableFrom?: string;
  mainDoorFacing?: string;
  tower?: string;
  floor?: string;
  residenceType?: 'Studio' | '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | string;
  tenantType?: 'Bachelors' | 'Spinsters' | 'Family' | string;
  amenitiesAvailability?: 'Yes' | 'No' | string;
  petFriendly?: 'Yes' | 'No' | string;
  furnishType?: 'Unfurnished' | 'Semi Furnished' | 'Full Furnished' | 'Furnished' | string;
  advance?: string;
  monthlyRental?: string;
  maintenance?: string;
  suba?: string;
  carpetArea?: string;
  carCloseParking?: '1' | '2' | '3' | '4' | string;
  balcony?: string;
  comments?: string;
  handedOverDate?: string;
  registrationStatus?: string;
  approvedAuthority?: 'BDA' | 'BBMP' | 'BMRDA' | 'STRR' | 'DTCP' | 'MPA' | 'SPA' | 'BIAPPA' | string;

  // Portfolio Curator Exact Fields
  projectTypeCategory?: 'Gated' | 'Stand Alone' | 'Individual' | string;
  presentStatus?: 'EOI' | 'Under Construction' | 'Nearing Completion' | 'Ready to Move-IN' | string;
  vaastuCompliant?: 'Yes' | 'No' | string;
  facingAvailable?: string[];
  floorRise?: string;
  totalUnits?: string;
  floorPlanSize?: string;
  bookingAmount?: string;
  interiorStatus?: 'Semi Furnished' | 'Un Furnished' | 'Fully Furnished' | 'Furnished' | 'Unfurnished' | string;
  availability?: 'Yes' | 'No' | string;
  floorAvailability?: string;
  saleFrom?: 'Investor' | 'Builder' | 'Land Lord' | 'Individual' | 'Resale' | 'Landlord' | string;
  aop?: '0-1 Year' | '2-5 Years' | '6-10 Years' | '11-15 Years' | '15+ Years' | string;
  expectedRentalIncome?: string;
  terrace?: 'Yes' | 'No' | string;
  garden?: 'Yes' | 'No' | string;
  projectWriteUps?: string;

  // SEO & Social Optimization
  metaTitle?: string;
  metaDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  imageAltText?: string;
  imageAltTexts?: Record<string, string>;
  canonicalUrl?: string;
  seoKeywords?: string[];
  seoLastSyncedAt?: string;
  seoSyncSource?: string;
  seoLastEdited?: string;
  seoRevisions?: SeoRevisionRecord[];

  createdAt: any;
  updatedAt?: any;
}

export interface SeoRevisionRecord {
  id: string;
  version: number;
  timestamp: string;
  author?: string;
  changeSummary: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  imageAltText?: string;
}

export interface Enquiry {
  id?: string;
  projectId: string;
  projectName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  interestedProjects?: string;
  preferredLocation?: string;
  preferredContactTime?: string;
  message: string;
  type: 'WhatsApp' | 'Email' | 'Form' | 'AI Chat' | 'Download Brochure' | 'Site Visit';
  enquiryCategory?: 'Primary' | 'Rental' | 'Resale' | 'Home Loan';
  propertyCategory?: 'Primary' | 'Resale' | 'Rent' | 'Home Loan';
  intentSentiment?: 'High' | 'Medium' | 'Low';
  timestamp: any;
  isDeleted?: boolean;
  deletedAt?: any;
}

export interface Opportunity {
  id?: string;
  name: string;
  mobile: string;
  email?: string;
  interested?: string;
  services?: string[];
  comment?: string;
  category?: 'Opportunity' | 'Business' | 'Property';
  propertyName?: string;
  propertyStatus?: 'Ready to Move' | 'Under Construction' | 'On Going' | 'Nearing Completion' | string;
  propertyType?: 'Villa' | 'Flat' | 'Plot' | string;
  rooms?: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | string;
  facing?: string;
  tower?: string;
  floorNumber?: string;
  willingTo?: 'Rent' | 'Sell' | string;
  expectedRent?: number;
  expectedSell?: number;
  notes?: string;
  intentScore?: number;
  timestamp: any;
}

export interface Subscription {
  id?: string;
  projectId: string;
  projectName: string;
  email: string;
  createdAt: any;
}

export interface Referral {
  id?: string;
  name: string;
  mobileNumber: string;
  budget: string;
  location: string;
  propertyType: 'Villa' | 'Flat' | 'Plot' | 'Stand Alone Building';
  unitType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK';
  contactDateTime: string;
  whatsappNumber: string;
  lookingFor: 'New Building' | 'Resale';
  resaleAge?: '0-1 Y' | '1-3 Y' | '3-5 Y' | '5-10Y' | '10+y' | '';
  referrerName?: string;
  referrerContact?: string;
  clientOpinion?: string;
  createdAt?: any;
}

export type PublicTabKey =
  | 'overview'
  | 'projects'
  | 'grow-business'
  | 'services'
  | 'why-choose'
  | 'insights'
  | 'opportunity'
  | 'referral'
  | 'loans'
  | 'testimonials'
  | 'faq'
  | 'about';

export type TabVisibilityConfig = Record<PublicTabKey, boolean>;

export const DEFAULT_TAB_VISIBILITY: TabVisibilityConfig = {
  overview: true,
  projects: true,
  'grow-business': true,
  services: true,
  'why-choose': true,
  insights: true,
  opportunity: true,
  referral: true,
  loans: true,
  testimonials: true,
  faq: true,
  about: true
};
