export interface Project {
  id?: string;
  name: string;
  description: string;
  price: string;
  location: string;
  type: 'Primary Sale' | 'Resale';
  propertyType: 'Flat' | 'Villa' | 'Plot';
  configuration: string[];
  segment: string;
  handoverStatus?: "Under Construction" | "Nearing Completion" | "Ready to Move" | "EOI" | "Prelaunch" | "Official Launch";
  paymentOffers?: string;
  imageUrls: string[];
  mobileImageUrl?: string;
  videoUrl?: string;
  mobileVideoUrl?: string;
  features: string[];
  createdAt: any;
}

export interface Enquiry {
  id?: string;
  projectId: string;
  projectName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  type: 'WhatsApp' | 'Email' | 'Form';
  timestamp: any;
}
