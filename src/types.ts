export interface Project {
  id?: string;
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
  mobileImageUrl?: string;
  videoUrl?: string;
  mobileVideoUrl?: string;
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
  furnishType?: 'Unfurnished' | 'Semi Furnished' | 'Full Furnished' | string;
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

  // SEO & Social Optimization
  metaTitle?: string;
  metaDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
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
  type: 'WhatsApp' | 'Email' | 'Form' | 'AI Chat' | 'Download Brochure';
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
  facing?: string; // East, North, West, South, or custom choice
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
