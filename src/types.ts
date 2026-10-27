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
  propertyType: 'Apartment' | 'Villa' | 'Plot' | 'Flat';
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
  createdAt: any;
  updatedAt?: any;
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
  timestamp: any;
}

export interface Opportunity {
  id?: string;
  name: string;
  mobile: string;
  propertyName: string;
  propertyStatus: 'Ready to Move' | 'Under Construction' | 'On Going' | 'Nearing Completion';
  propertyType: 'Villa' | 'Flat' | 'Plot';
  rooms: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK';
  facing: string; // East, North, West, South, or custom choice
  tower?: string;
  floorNumber: string;
  willingTo: 'Rent' | 'Sell';
  expectedRent?: number;
  expectedSell?: number;
  notes?: string;
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
