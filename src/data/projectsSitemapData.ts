/**
 * projectsSitemapData.ts
 * Curated projects registry & dynamic XML sitemap generation for Google Search & SEO.
 */

export interface SitemapProjectItem {
  id: string;
  name: string;
  builderName: string;
  builderCategory?: string;
  propertyType: string;
  type: string;
  zone: string;
  location: string;
  price: string;
  description: string;
  reraNumber?: string;
  handoverDate?: string;
  imageUrl?: string;
  lastmod?: string;
}

export const SITEMAP_PROJECTS: SitemapProjectItem[] = [
  // Whitefield
  {
    id: 'curated_whitefield_primary_1',
    name: 'Prestige Somerville',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Whitefield',
    location: 'Whitefield - Varthur Road (Ramagondanahalli), Bangalore',
    price: 'Rs. 2.35 Cr - Rs. 3.85 Cr*',
    description: 'Iconic lakefront high-rise residential sanctuary on Whitefield - Varthur Main Road overlooking Varthur Lake. Featuring two-side open Vaastu residences, 84% landscaped greens, and premier connectivity to ITPL Whitefield and Deens Academy.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/290224/006660',
    handoverDate: 'December 2027',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_whitefield_resale_1',
    name: 'Brigade Woods Botanica',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Resale',
    zone: 'Whitefield',
    location: 'Whitefield ITPL Main Road (Pattandur Agrahara), Bangalore',
    price: 'Rs. 2.15 Cr - Rs. 3.40 Cr*',
    description: 'Ready-to-move boutique forest-themed residences on Whitefield ITPL Main Road. OC received, zero GST, surrounded by 15+ native tree species, minutes to Pattandur Agrahara Metro and Brigade Tech Gardens.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180621/001912',
    handoverDate: 'Immediate Possession (OC Received)',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_whitefield_rental_1',
    name: 'Total Environment Windmills of Your Mind',
    builderName: 'Total Environment',
    builderCategory: 'A+',
    propertyType: 'Villa',
    type: 'Rental',
    zone: 'Whitefield',
    location: 'Whitefield EPIP Zone (Nallurahalli Road), Bangalore',
    price: 'Rs. 1.35 L / month - Rs. 2.60 L / month*',
    description: 'Handcrafted earth-sheltered duplex sky-villas in Whitefield EPIP Zone beside SAP Labs and Vydehi Hospital. Each residence features private landscaped terrace gardens and bespoke woodwork.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/171015/000419',
    handoverDate: 'Ready for Immediate Lease',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_primary_aplus_godrej_woodscapes',
    name: 'Godrej Woodscapes',
    builderName: 'Godrej Properties',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Whitefield',
    location: 'Whitefield - Budigere Cross (Old Madras Road), Bangalore',
    price: 'Rs. 2.15 Cr - Rs. 3.45 Cr*',
    description: 'Forest-themed landmark township at Whitefield - Budigere Cross Junction featuring 1,500+ trees, a 68,000 Sq.Ft. clubhouse, and walk-in access to Orion Uptown Mall.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/170524/006882',
    handoverDate: 'December 2028',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_primary_c_radiant_jasmine',
    name: 'Radiant Jasmine Gardens',
    builderName: 'Radiant Structures',
    builderCategory: 'C',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Whitefield',
    location: 'Whitefield - Immadihalli Main Road, Bangalore',
    price: 'Rs. 78 Lakhs - Rs. 1.12 Cr*',
    description: 'Smart value primary apartment enclave in Whitefield Immadihalli near Hope Farm Junction. BBMP A-Khata, OC verified, 100% Vaastu compliant with rooftop pool.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210523/005944',
    handoverDate: 'Ready to Move',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },

  // Hoskote
  {
    id: 'curated_hoskote_primary_1',
    name: 'Sobha Galera',
    builderName: 'Sobha Limited',
    builderCategory: 'A+',
    propertyType: 'Villa',
    type: 'Primary',
    zone: 'Hoskote',
    location: 'Hoskote - Old Madras Road (Kannamangala), Bangalore',
    price: 'Rs. 4.65 Cr - Rs. 6.40 Cr*',
    description: 'Spanish-inspired boutique row villas along the Hoskote Old Madras Road Corridor. Crafted with terracotta roofs, double-height private courtyards, and pedestrian cobblestone boulevards.',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/160123/005601',
    handoverDate: 'December 2026',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_hoskote_resale_1',
    name: 'CJN Sai Fortune',
    builderName: 'CJN Properties',
    builderCategory: 'B',
    propertyType: 'Apartment',
    type: 'Resale',
    zone: 'Hoskote',
    location: 'Hoskote Town - NH-75 Old Madras Road, Bangalore',
    price: 'Rs. 68 Lakhs - Rs. 96 Lakhs*',
    description: 'Ready-to-move gated community on NH-75 Old Madras Road in Hoskote. Vaastu-compliant corner apartments with clear resale documentation and immediate registration.',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/181122/002159',
    handoverDate: 'Immediate Possession (OC Received)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_hoskote_rental_1',
    name: 'Brigade Golden Triangle Signature',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Rental',
    zone: 'Hoskote',
    location: 'Hoskote - Budigere Cross OMR (Kattamnallur), Bangalore',
    price: 'Rs. 45,000 / month - Rs. 68,000 / month*',
    description: 'Mixed-use landmark township at Hoskote - Budigere Cross Junction on Old Madras Road. Semi-furnished sky-view apartments available for immediate lease beside Orion Uptown Mall.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/171026/000912',
    handoverDate: 'Ready for Immediate Occupancy',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_primary_c_sri_sai_brindavan',
    name: 'Sri Sai Brindavan Enclave',
    builderName: 'Sri Sai Constructions',
    builderCategory: 'C',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Hoskote',
    location: 'Hoskote Town - NH-75 Old Madras Road, Bangalore',
    price: 'Rs. 58 Lakhs - Rs. 84 Lakhs*',
    description: 'Well-crafted mid-rise residential community in Hoskote near MVJ Hospital. BMRDA approved, ideal for first-time buyers seeking high capital growth on STRR highway.',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/091123/006391',
    handoverDate: 'Ready to Move',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },

  // Varthur
  {
    id: 'curated_varthur_primary_1',
    name: 'Prestige Raintree Park',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Varthur',
    location: 'Varthur Main Road (Opposite Varthur Lake), Bangalore',
    price: 'Rs. 2.85 Cr - Rs. 5.20 Cr*',
    description: 'Flagship 107-acre integrated lakefront township on Varthur Main Road opposite Varthur Lake. Ultra-luxury high-rise residences with panoramic lake views and a 1,05,000 Sq.Ft. clubhouse.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/290824/006981',
    handoverDate: 'June 2028',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_varthur_resale_1',
    name: 'Brigade Cornerstone Utopia (Eden & Serene)',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Resale',
    zone: 'Varthur',
    location: 'Varthur - Whitefield Main Road (Varthur Town), Bangalore',
    price: 'Rs. 1.58 Cr - Rs. 2.45 Cr*',
    description: 'Award-winning 47-acre smart integrated township on Varthur - Whitefield Main Road. Verified resale residences with multiplex, retail high street, and zero GST.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/181219/002236',
    handoverDate: 'Immediate Possession (OC Received)',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_varthur_rental_1',
    name: 'Prestige Lakeside Habitat',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Rental',
    zone: 'Varthur',
    location: 'Varthur - Gunjur Main Road (Varthur Lakefront), Bangalore',
    price: 'Rs. 68,000 / month - Rs. 1.35 L / month*',
    description: '102-acre Disney-themed lakefront township on Varthur - Gunjur Main Road. Furnished and semi-furnished apartments and villas available for corporate and expat lease.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/170915/000176',
    handoverDate: 'Ready for Immediate Move-In',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_primary_b_candeur_skyline',
    name: 'Candeur Skyline',
    builderName: 'Candeur Constructions',
    builderCategory: 'B',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Varthur',
    location: 'Varthur - Gunjur Main Road, Bangalore',
    price: 'Rs. 1.38 Cr - Rs. 2.12 Cr*',
    description: 'High-rise contemporary residential enclave in Varthur - Gunjur with sky-bridges, double-height entrance lobbies, and panoramic lake views.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/280423/005912',
    handoverDate: 'June 2027',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },

  // Gunjur
  {
    id: 'curated_gunjur_primary_1',
    name: 'Sobha Neopolis',
    builderName: 'Sobha Limited',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Gunjur',
    location: 'Gunjur - Panathur Main Road, Bangalore',
    price: 'Rs. 2.48 Cr - Rs. 4.55 Cr*',
    description: 'Santorini-themed Mediterranean luxury enclave on Gunjur - Panathur Main Road off Marathahalli-ORR. Featuring blue-domed architecture, cascading pools, and 3 grand clubhouses.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/200923/006269',
    handoverDate: 'December 2028',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_gunjur_resale_1',
    name: 'DSR Highland Greenz',
    builderName: 'DSR Infrastructure',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Resale',
    zone: 'Gunjur',
    location: 'Gunjur Palya - Varthur-Sarjapur Road, Bangalore',
    price: 'Rs. 1.18 Cr - Rs. 1.72 Cr*',
    description: 'Ready gated community in Gunjur Palya. Zero GST verified resale flats with immediate possession, 30,000 Sq.Ft. clubhouse, and walking distance to Chrysalis High.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210219/003922',
    handoverDate: 'Immediate Possession (Handed Over)',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_gunjur_rental_1',
    name: 'Candeur Landmark',
    builderName: 'Candeur Constructions',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Rental',
    zone: 'Gunjur',
    location: 'Gunjur - Varthur Main Road Junction, Bangalore',
    price: 'Rs. 46,000 / month - Rs. 68,000 / month*',
    description: 'High-rise residential community in Gunjur opposite Prestige Lakeside Habitat. Semi-furnished corner apartments with modular kitchen and wardrobes for executive rental.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/190131/002327',
    handoverDate: 'Ready for Immediate Lease',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_primary_c_slv_lakeview',
    name: 'SLV Lakeview Residency',
    builderName: 'SLV Infra Projects',
    builderCategory: 'C',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Gunjur',
    location: 'Gunjur - Krupanidhi College Road, Bangalore',
    price: 'Rs. 76 Lakhs - Rs. 1.08 Cr*',
    description: 'Boutique low-density apartment community in Gunjur near Krupanidhi College. Low maintenance, rooftop garden, pool, and 10 mins to Wipro SEZ Kodathi.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/150424/006794',
    handoverDate: 'December 2026',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },

  // Hosa Road
  {
    id: 'curated_hosaroad_primary_1',
    name: 'Assetz Canvas & Cove Phase 2',
    builderName: 'Assetz Property Group',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Hosa Road',
    location: 'Hosa Road - Begur Lakefront Corridor, Bangalore',
    price: 'Rs. 1.72 Cr - Rs. 2.55 Cr*',
    description: 'Biophilic lakefront high-rise enclave overlooking 52-acre Begur lake on Hosa Road. 85% open greens, 5 mins to Hosa Road Metro, and quick access to Electronic City.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/050723/006035',
    handoverDate: 'March 2028',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_hosaroad_resale_1',
    name: 'SNN Raj Etternia',
    builderName: 'SNN Builders',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Resale',
    zone: 'Hosa Road',
    location: 'Hosa Road - Haralur Link Road (Silver County), Bangalore',
    price: 'Rs. 2.05 Cr - Rs. 3.25 Cr*',
    description: 'Hilltop-inspired luxury community on Hosa Road - Haralur Link Road. Dual-lake views, 50,000 Sq.Ft. clubhouse, heated indoor pool, and zero GST verified resale title.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/171015/000492',
    handoverDate: 'Immediate Possession (OC Received)',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_hosaroad_rental_1',
    name: 'Purva Skywood',
    builderName: 'Puravankara Limited',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Rental',
    zone: 'Hosa Road',
    location: 'Hosa Road - Haralur Main Road (Lakedew Corridor), Bangalore',
    price: 'Rs. 62,000 / month - Rs. 88,000 / month*',
    description: 'Sprawling 12.8-acre handed-over residential sanctuary on Hosa Road - Haralur Main Road. 80% botanical gardens, Japanese zen pond, and immediate move-in ready lease.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/170921/000318',
    handoverDate: 'Ready for Immediate Move-In',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_primary_b_casagrand_flamingo',
    name: 'Casagrand Flamingo',
    builderName: 'Casagrand Builder',
    builderCategory: 'B',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Hosa Road',
    location: 'Hosa Road - HSR Extension Corridor, Bangalore',
    price: 'Rs. 1.42 Cr - Rs. 2.38 Cr*',
    description: 'Contemporary lifestyle residential community on Hosa Road offering 65+ world-class amenities, vehicle-free podium lawn, and 5 mins to Hosa Road Metro.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/140623/006011',
    handoverDate: 'Ready to Move',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },

  // Kasavanahalli
  {
    id: 'curated_kasavanahalli_primary_1',
    name: 'Assetz 63 Degree East (Tower D & E)',
    builderName: 'Assetz Property Group',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Kasavanahalli',
    location: 'Kasavanahalli - Off Sarjapur Road Corridor, Bangalore',
    price: 'Rs. 1.65 Cr - Rs. 2.48 Cr*',
    description: 'Sustainable eco-luxury residential township in Kasavanahalli off Sarjapur Road. 68% open green space, 15+ outdoor sports courts, and minutes to Wipro SEZ.',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/210928/004318',
    handoverDate: 'December 2026',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_kasavanahalli_resale_1',
    name: 'PSR Aster Villas & Residences',
    builderName: 'PSR Group & Puravankara',
    builderCategory: 'A',
    propertyType: 'Villa',
    type: 'Resale',
    zone: 'Kasavanahalli',
    location: 'Kasavanahalli Main Road (Beside Kasavanahalli Lake), Bangalore',
    price: 'Rs. 2.65 Cr - Rs. 4.40 Cr*',
    description: 'Boutique earth-toned luxury triplex villas on Kasavanahalli Main Road beside the lake. Private plunge decks, Italian marble, and clear resale title.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/190524/002578',
    handoverDate: 'Immediate Possession (OC Received)',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_kasavanahalli_rental_1',
    name: 'Bren Imperia',
    builderName: 'Bren Corporation',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Rental',
    zone: 'Kasavanahalli',
    location: 'Kasavanahalli - Haralur Main Road, Bangalore',
    price: 'Rs. 65,000 / month - Rs. 85,000 / month*',
    description: 'Contemporary luxury apartment enclave in Kasavanahalli - Haralur Road. Semi-furnished corner units ready for immediate executive lease near RMZ Ecoworld & Wipro.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/171028/000841',
    handoverDate: 'Ready for Immediate Lease',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_primary_c_bm_glorietta',
    name: 'BM Glorietta Phase 2',
    builderName: 'BM Developers',
    builderCategory: 'C',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Kasavanahalli',
    location: 'Kasavanahalli - Hosa Road Link Corridor, Bangalore',
    price: 'Rs. 82 Lakhs - Rs. 1.16 Cr*',
    description: 'Smart tech-belt primary homes in Kasavanahalli linking Hosa Road and Kaikondrahalli. Modern amenities, BBMP approved, close to Wipro HQ and metro.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/060923/006233',
    handoverDate: 'Ready to Move',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  // PLOTTED DEVELOPMENTS & VILLA PLOTS (Cat A+, A, B, C | Ready to Move & EOI)
  {
    id: 'curated_plot_prestige_marigold',
    name: 'Prestige Marigold (Phase 2 Plotted Enclave)',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    propertyType: 'Plot',
    type: 'Primary',
    zone: 'East-Bangalore',
    location: 'Off NH-648 & STRR Express Corridor, East Bangalore',
    price: 'Rs. 72 Lakhs - Rs. 1.65 Cr*',
    description: 'BDA & RERA approved premium villa plotted enclave with underground cabling, organic fruit orchards, and world-class clubhouse. 0% Brokerage with BS Homez.',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/220120/004652',
    handoverDate: 'Ready to Move (Immediate Registration)',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_plot_brigade_oasis_eoi',
    name: 'Brigade Oasis (Phase 3 EOI Plotted Launch)',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    propertyType: 'Plot',
    type: 'Primary',
    zone: 'East-Bangalore',
    location: 'Aerospace & Devanahalli - East Link Corridor, Bangalore',
    price: 'Rs. 65 Lakhs - Rs. 1.45 Cr*',
    description: 'Pre-launch priority allocation EOI open for 1200 to 2400 sq.ft villa plots with 40-ft wide blacktop roads, manicured boulevard trees, and high capital appreciation potential.',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/221021/005342',
    handoverDate: 'EOI Stage - Allocation 2026',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_plot_assetz_earth_essence',
    name: 'Assetz Earth & Essence Plotted Sanctuary',
    builderName: 'Assetz Property Group',
    builderCategory: 'A',
    propertyType: 'Plot',
    type: 'Primary',
    zone: 'Hoskote',
    location: 'Hoskote - Budigere Cross Corridor, Bangalore',
    price: 'Rs. 85 Lakhs - Rs. 1.95 Cr*',
    description: 'Biophilic plotted land surrounded by 500+ trees, rainwater swales, and eco-friendly infrastructure. Ready for bespoke villa construction.',
    reraNumber: 'PRM/KA/RERA/1251/309/PR/181123/002167',
    handoverDate: 'Ready for Registration',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_plot_century_seasons',
    name: 'Century Seasons & Meadows Plotted Estate',
    builderName: 'Century Real Estate',
    builderCategory: 'A',
    propertyType: 'Plot',
    type: 'Primary',
    zone: 'East-Bangalore',
    location: 'East Tech Link Highway & STRR, Bangalore',
    price: 'Rs. 58 Lakhs - Rs. 1.35 Cr*',
    description: 'Seasonal flora-themed plotted enclave equipped with piped water, storm-water drainage, and underground fiber optics.',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/201218/003714',
    handoverDate: 'Ready for Possession',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_plot_myhna_maple_leaf',
    name: 'Myhna Maple Leaf Plotted Enclave',
    builderName: 'Myhna Properties',
    builderCategory: 'B',
    propertyType: 'Plot',
    type: 'Primary',
    zone: 'Gunjur',
    location: 'Gunjur - Balagere Road, East Bangalore',
    price: 'Rs. 52 Lakhs - Rs. 1.15 Cr*',
    description: 'BMRDA & RERA certified residential plot layout near Whitefield and Outer Ring Road tech parks. Compound wall, LED streetlights, and 24/7 security.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210302/003998',
    handoverDate: 'Ready to Move / Immediate Khata Transfer',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_plot_radiant_silver_oak',
    name: 'Radiant Silver Oak Villa Plots',
    builderName: 'Radiant Structures',
    builderCategory: 'C',
    propertyType: 'Plot',
    type: 'Primary',
    zone: 'Sarjapur',
    location: 'Sarjapur - Bagalur Road, Bangalore',
    price: 'Rs. 38 Lakhs - Rs. 78 Lakhs*',
    description: 'High-yield plotted investment near educational hubs on Sarjapur road. Gated community with landscaped parks and tar roads.',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/220815/005167',
    handoverDate: 'Ready to Move',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_plot_slv_silicon_county_eoi',
    name: 'SLV Silicon County (EOI Villa Plots)',
    builderName: 'SLV Housing Development',
    builderCategory: 'C',
    propertyType: 'Plot',
    type: 'Primary',
    zone: 'Hosa-Road',
    location: 'Hosa Road - Singasandra East Junction, Bangalore',
    price: 'Rs. 44 Lakhs - Rs. 89 Lakhs*',
    description: 'Early bird pre-launch allotment for suburban plots minutes away from Electronic City Phase 2 and Hosa Road elevated expressway.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/240210/006621',
    handoverDate: 'EOI Phase - Possession Q4 2026',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  // RESIDENTIAL TOWERS & VILLAS (Cat A+, A, B, C | EOI, UC, Ready)
  {
    id: 'curated_sobha_oakshire_villas',
    name: 'Sobha Oakshire Tudor-Style Villas',
    builderName: 'Sobha Limited',
    builderCategory: 'A+',
    propertyType: 'Villa',
    type: 'Primary',
    zone: 'East-Bangalore',
    location: 'Off OMR - Budigere Cross Corridor, Bangalore',
    price: 'Rs. 4.85 Cr - Rs. 6.25 Cr*',
    description: 'Super-luxury English Tudor style 4BHK villas crafted with Sobha backward integration, private lawns, and multi-tier clubhouses.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/230301/005754',
    handoverDate: 'Under Construction (December 2026)',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_godrej_park_retreat_phase2',
    name: 'Godrej Park Retreat (Phase 2)',
    builderName: 'Godrej Properties',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Sarjapur',
    location: 'Sarjapur - Carmelaram Junction Corridor, Bangalore',
    price: 'Rs. 1.25 Cr - Rs. 2.10 Cr*',
    description: 'Resort-themed high-rise residences with 28,000 sq.ft clubhouse, 50+ experiential amenities, and direct access to Sarjapur tech parks.',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/220228/004739',
    handoverDate: 'Under Construction (June 2027)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_total_environment_tqe_ready',
    name: 'Total Environment In That Quiet Earth',
    builderName: 'Total Environment',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'East-Bangalore',
    location: 'Off Hennur - Budigere Cross Link, East Bangalore',
    price: 'Rs. 2.90 Cr - Rs. 4.60 Cr*',
    description: 'Ready-to-move handcrafted L20 & U20 cantilevered terrace garden homes with natural exposed wire-cut brickwork and Italian marble.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180516/001712',
    handoverDate: 'Ready to Move (OC Received)',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_birla_trimaya_phase2_eoi',
    name: 'Birla Trimaya (Phase 2 The Hills)',
    builderName: 'Birla Estates',
    builderCategory: 'A+',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'East-Bangalore',
    location: 'BK Halli Road, Aerospace - East Transit Corridor, Bangalore',
    price: 'Rs. 75 Lakhs - Rs. 2.85 Cr*',
    description: 'Pre-launch priority allocation EOI open for 50-acre mixed township designed by Broadway Malyan featuring 45-acre green lungs and lake view residences.',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/230906/006242',
    handoverDate: 'EOI Stage - Handover 2028',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_sumadhura_folium_uc',
    name: 'Sumadhura Folium',
    builderName: 'Sumadhura Infracon',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Whitefield',
    location: 'Whitefield - Borewell Road, Bangalore',
    price: 'Rs. 1.45 Cr - Rs. 2.60 Cr*',
    description: '83% open-space high-rise enclave close to ITPL, featuring 5 distinct themed zones and cantilevered rooftop observation deck.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/220601/004944',
    handoverDate: 'Under Construction (December 2026)',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_mana_dale_eoi',
    name: 'Mana Dale (Tower Solstice)',
    builderName: 'Mana Projects',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Sarjapur',
    location: 'Sarjapur - Kodathi Link Road, Bangalore',
    price: 'Rs. 1.35 Cr - Rs. 2.25 Cr*',
    description: 'Tropical rainforest inspired high-rise tower currently in priority EOI booking stage. Centered around a 100-year-old banyan tree with natural water bodies.',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/231103/006385',
    handoverDate: 'EOI Stage - Expected Handover 2027',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_shriram_greenfield_ready',
    name: 'Shriram Greenfield Phase 2',
    builderName: 'Shriram Properties',
    builderCategory: 'A',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Hoskote',
    location: 'Old Madras Road - Hoskote Corridor, Bangalore',
    price: 'Rs. 72 Lakhs - Rs. 1.15 Cr*',
    description: 'Ready-to-move 2 & 3 BHK homes in 40-acre mega township with zero GST and ready clubhouse amenities.',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/171014/000445',
    handoverDate: 'Ready to Move (OC Received)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_dsr_the_courtyard_ready',
    name: 'DSR The Courtyard',
    builderName: 'DSR Infrastructure',
    builderCategory: 'B',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Gunjur',
    location: 'Gunjur - Varthur Road, Bangalore',
    price: 'Rs. 98 Lakhs - Rs. 1.65 Cr*',
    description: 'Courtyard-centric architecture ensuring cross-ventilation and zero common walls. Ready for interior customization.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210518/004149',
    handoverDate: 'Ready to Move',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_bren_palms_lakeview_uc',
    name: 'Bren Palms Lakeview Residences',
    builderName: 'Bren Corporation',
    builderCategory: 'B',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Kasavanahalli',
    location: 'Kasavanahalli - Kaikondrahalli Lake Link, Bangalore',
    price: 'Rs. 1.18 Cr - Rs. 1.85 Cr*',
    description: 'Lakeview boutique residences with sky lounge, indoor sports hub, and seamless connectivity to Bellandur ORM tech spine.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/220912/005230',
    handoverDate: 'Under Construction (March 2026)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_casagrand_boulevard_eoi',
    name: 'Casagrand Boulevard (Phase 2)',
    builderName: 'Casagrand Builder',
    builderCategory: 'B',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'East-Bangalore',
    location: 'Hennur - Bagalur Main Corridor, East Bangalore',
    price: 'Rs. 68 Lakhs - Rs. 1.25 Cr*',
    description: '75+ lifestyle amenities with swimming pools, indoor badminton court, and collaborative work lounges in pre-launch allocation.',
    reraNumber: 'PRM/KA/RERA/1251/309/PR/230818/006180',
    handoverDate: 'EOI Stage - Expected Handover 2027',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_gopalan_lakefront_uc',
    name: 'Gopalan Lakefront Enclave',
    builderName: 'Gopalan Enterprises',
    builderCategory: 'B',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Electronic-City',
    location: 'Electronic City Phase 1 - Neeladri Road, Bangalore',
    price: 'Rs. 85 Lakhs - Rs. 1.35 Cr*',
    description: 'Spacious high-rise community situated right behind major tech corridors with landscaped podiums and clubhouse.',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/220414/004812',
    handoverDate: 'Under Construction (November 2026)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_sri_sai_golden_nest_ready',
    name: 'Sri Sai Golden Nest',
    builderName: 'Sri Sai Builders & Promoters',
    builderCategory: 'C',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Hosa-Road',
    location: 'Hosa Road Central, Near Metro Pillar, Bangalore',
    price: 'Rs. 55 Lakhs - Rs. 82 Lakhs*',
    description: 'Value-engineered 2 & 3 BHK ready homes with 100% Vaastu compliance, borewell plus Kaveri water, and dedicated stilt parking.',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/210719/004210',
    handoverDate: 'Ready to Move',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_durga_petals_horizon_uc',
    name: 'Durga Petals Horizon',
    builderName: 'Durga Projects',
    builderCategory: 'C',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Marathalli',
    location: 'Marathahalli - Outer Ring Road Junction, Bangalore',
    price: 'Rs. 78 Lakhs - Rs. 1.15 Cr*',
    description: 'Under-construction urban towers strategically positioned near Outer Ring Road tech parks with infinity pool and multi-gym.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/230114/005611',
    handoverDate: 'Under Construction (October 2026)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'curated_amrutha_heights_phase2_uc',
    name: 'Amrutha Heights (Phase 2)',
    builderName: 'Amrutha Shelters',
    builderCategory: 'C',
    propertyType: 'Apartment',
    type: 'Primary',
    zone: 'Varthur',
    location: 'Varthur - Gunjur Main Road, Bangalore',
    price: 'Rs. 62 Lakhs - Rs. 94 Lakhs*',
    description: 'High rental-yield affordable luxury apartments in the heart of Varthur tech catchment with children play zones and gym.',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/230620/006015',
    handoverDate: 'Under Construction (December 2026)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  }
];

export const CORRIDOR_SLUGS = [
  'Whitefield',
  'Hoskote',
  'Varthur',
  'Gunjur',
  'Hosa-Road',
  'Kasavanahalli',
  'Off-Sarjapur-Road',
  'Sarjapur',
  'Electronic-City',
  'Marathalli',
  'Bellandur',
  'East-Bangalore'
];

export const APP_TABS = [
  'overview',
  'projects',
  'services',
  'why-choose',
  'insights',
  'opportunity',
  'referral',
  'loans',
  'testimonials',
  'faq',
  'about'
];

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Builds the complete dynamic sitemap.xml
 */
export function generateSitemapXml(
  baseUrl: string, 
  projectsList: SitemapProjectItem[] = SITEMAP_PROJECTS
): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  // Core Landing & Tab URLs
  const coreUrls = [
    `  <url>
    <loc>${cleanBase}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...APP_TABS.map(tab => `  <url>
    <loc>${cleanBase}/?tab=${tab}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${tab === 'projects' ? '0.95' : '0.85'}</priority>
  </url>`),
    ...CORRIDOR_SLUGS.map(corridor => `  <url>
    <loc>${cleanBase}/?corridor=${corridor}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`)
  ];

  // Individual Property URLs with Google Image Extensions
  const projectUrls = projectsList.map(project => {
    const projectUrl = `${cleanBase}/?project=${encodeURIComponent(project.id || project.name)}`;
    const imageBlock = project.imageUrl ? `
    <image:image>
      <image:loc>${escapeXml(project.imageUrl)}</image:loc>
      <image:title>${escapeXml(project.name)} – ${escapeXml(project.location)}</image:title>
      <image:caption>${escapeXml(project.description.slice(0, 180))}</image:caption>
    </image:image>` : '';

    return `  <url>
    <loc>${projectUrl}</loc>
    <lastmod>${project.lastmod || today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>${imageBlock}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${coreUrls.join('\n')}
${projectUrls.join('\n')}
</urlset>`;
}

/**
 * Generates SEO meta tags and Schema.org JSON-LD for a specific property
 */
export function generatePropertyMetaTags(
  project: SitemapProjectItem, 
  baseUrl: string
) {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const propertyUrl = `${cleanBase}/?project=${encodeURIComponent(project.id || project.name)}`;
  const title = `${project.name} in ${project.zone}, Bangalore | Price, Floor Plans & Details – BS Homez`;
  
  // Clean description under 160 characters
  const shortDesc = `${project.name} by ${project.builderName} in ${project.location}. Price: ${project.price}. RERA Verified. 0% Brokerage on Primary with BS Homez.`;

  const ldJson = {
    "@context": "https://schema.org",
    "@type": project.propertyType === 'Villa' ? "SingleFamilyResidence" : project.propertyType === 'Plot' ? "LandParcel" : "ApartmentComplex",
    "name": project.name,
    "description": project.description,
    "url": propertyUrl,
    "image": project.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": project.location,
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": project.price,
      "availability": "https://schema.org/InStock",
      "url": propertyUrl
    },
    "seller": {
      "@type": "RealEstateAgent",
      "name": "BS Homez",
      "email": "contact@bshomez.in",
      "url": cleanBase
    }
  };

  return {
    title,
    description: shortDesc,
    canonical: propertyUrl,
    ogTitle: title,
    ogDescription: shortDesc,
    ogUrl: propertyUrl,
    ogImage: project.imageUrl || `${cleanBase}/og-cover.jpg`,
    twitterTitle: title,
    twitterDescription: shortDesc,
    twitterImage: project.imageUrl || `${cleanBase}/og-cover.jpg`,
    schemaJson: JSON.stringify(ldJson)
  };
}
