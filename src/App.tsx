import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from './lib/firebase';
import { 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronLeft,
  ChevronRight, 
  Info, 
  X,
  Play,
  Pause,
  User,
  Menu,
  ShieldCheck,
  TrendingUp,
  Plus,
  Trash,
  Search,
  Edit,
  LayoutGrid,
  Upload,
  Video as VideoIcon,
  Loader2,
  CheckCircle2,
  CreditCard,
  Target,
  Percent,
  Star,
  Compass,
  Heart,
  Handshake,
  Briefcase,
  Building2,
  FileSpreadsheet,
  Bell,
  Calculator,
  Download,
  Map,
  Layers,
  Calendar,
  Sparkles,
  ExternalLink,
  Globe,
  ArrowLeftRight,
  Scale,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Project, Enquiry, Opportunity, Referral } from './types';
import { Testimonials } from './components/Testimonials';
import { ReferralSection } from './components/ReferralSection';
import { FAQSection } from './components/FAQSection';
import { HomeLoanHub } from './components/HomeLoanHub';
import { InvestmentCalculator } from './components/InvestmentCalculator';
import { ProjectComparisonModal } from './components/ProjectComparisonModal';
import { SocialShareButtons } from './components/SocialShareButtons';
import { SEOPreviewModal } from './components/SEOPreviewModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import imgEastEoi from './assets/images/east_bangalore_eoi_towers_1791731720202.jpg';
import imgSouthEastConst from './assets/images/southeast_bangalore_construction_1791731732392.jpg';
import imgEastReady from './assets/images/east_bangalore_ready_move_1791731742991.jpg';
import imgSouthEastHanded from './assets/images/southeast_bangalore_handed_over_1791731753795.jpg';
import imgLuxuryResale from './assets/images/bangalore_luxury_resale_villa_1791731765054.jpg';
import imgWhitefieldTowers from './assets/images/whitefield_prestige_towers_1791784042652.jpg';
import imgHoskoteTownship from './assets/images/hoskote_villa_township_1791784056751.jpg';
import imgVarthurLakefront from './assets/images/varthur_lakefront_residences_1791784068308.jpg';
import imgGunjurSanctuary from './assets/images/gunjur_eden_sanctuary_1791784080314.jpg';
import imgHosaRoadSkyline from './assets/images/hosa_road_skyline_apartments_1791784092927.jpg';
import imgKasavanahalliVillas from './assets/images/kasavanahalli_boutique_villas_1791784104959.jpg';
import imgCatAPlusTowers from './assets/images/cat_aplus_ultra_towers_1791789047027.jpg';
import imgCatABiophilic from './assets/images/cat_a_biophilic_enclave_1791789057278.jpg';
import imgCatBModern from './assets/images/cat_b_modern_apartments_1791789069038.jpg';
import imgCatCBoutique from './assets/images/cat_c_boutique_residences_1791789082358.jpg';
import imgLuxuryPlotEstate from './assets/images/luxury_villa_plot_estate_1791789096814.jpg';

const LEGACY_PROJECT_NAMES = ['The Royal Orchard', 'East Gate Residences', 'Azure Lakes'];

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={cn("flex flex-col group select-none", className)}>
    <svg viewBox="0 0 450 180" className="w-48 md:w-56 h-auto text-white fill-current" xmlns="http://www.w3.org/2000/svg">
      {/* Red Roof */}
      <path 
        d="M 100,72 L 164,15 L 188,39 L 188,25 L 202,25 L 202,53 L 221,72 L 395,72 L 395,82 L 225,82 L 164,25 L 108,72 Z" 
        fill="#E32526" 
      />

      {/* BS letters */}
      <text 
        x="55" 
        y="132" 
        fill="currentColor" 
        fontSize="58" 
        fontWeight="900" 
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" 
        letterSpacing="0.05em"
      >
        BS
      </text>

      {/* Graphic House-H letter */}
      <g>
        {/* Left red pillar */}
        <rect x="150" y="76" width="12" height="56" fill="#E32526" />
        {/* Right red pillar */}
        <rect x="178" y="76" width="12" height="56" fill="#E32526" />
        {/* Crossbar */}
        <rect x="162" y="98" width="16" height="12" fill="#E32526" />
        {/* Up arrow inside */}
        <path d="M 162,98 L 170,80 L 178,98 Z" fill="currentColor" />
      </g>

      {/* Graphic O letter with concentric dot */}
      <g>
        {/* Outer Circle */}
        <circle cx="215" cy="104" r="21" fill="none" stroke="currentColor" strokeWidth="10" />
        {/* Inner Dot */}
        <circle cx="215" cy="104" r="5" fill="currentColor" />
      </g>

      {/* MEZ letters */}
      <text 
        x="248" 
        y="132" 
        fill="currentColor" 
        fontSize="58" 
        fontWeight="900" 
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" 
        letterSpacing="0.01em"
      >
        MEZ
      </text>

      {/* The thick underline bar */}
      <line x1="50" y1="140" x2="395" y2="140" stroke="currentColor" strokeWidth="5" />

      {/* The green spaced tagline under the underline */}
      <text 
        x="50" 
        y="162" 
        fill="#00A859" 
        fontSize="11" 
        fontWeight="900" 
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" 
        textLength="345"
        lengthAdjust="spacing"
      >
        TRUNING KEY MOMENTS
      </text>
    </svg>
  </div>
);

const MarketInsights = () => {
  const istTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const trendData = [
    { year: '2020', price: 4200 },
    { year: '2021', price: 4800 },
    { year: '2022', price: 5600 },
    { year: '2023', price: 6800 },
    { year: '2024', price: 8200 },
    { year: '2025', price: 9500 },
  ];

  const distributionData = [
    { name: 'Luxury Residentials', value: 35, color: '#C5A059' },
    { name: 'Premium High-Rise', value: 45, color: '#3b82f6' },
    { name: 'Exclusive Enclaves', value: 20, color: '#10b981' },
  ];

  const locationPerformance = [
    { location: 'EAST BANGALORE', demand: 85, growth: 12 },
    { location: 'NORTH CORRIDOR', demand: 70, growth: 18 },
    { location: 'SOUTH HUB', demand: 65, growth: 8 },
    { location: 'CENTRAL CORE', demand: 90, growth: 5 },
  ];

  return (
    <section id="insights" className="py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 bg-art-dark border-t border-white/5 relative">
      <div className="absolute right-12 top-24 z-10 hidden lg:block">
        <span className="vertical-text text-[9px] text-white/10 font-bold tracking-[0.5em] uppercase">Intelligence / LIVE {istTime} IST</span>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-start mb-12 sm:mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-art-gold text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] font-black block mb-4 sm:mb-6">Market Vault</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white leading-tight italic whitespace-nowrap">
              Strategic <span className="not-italic text-art-gold">Metrics.</span>
            </h2>
          </motion.div>
          <div className="space-y-6 sm:space-y-8">
            <p className="text-white/40 text-xs sm:text-[13px] leading-[1.8] sm:leading-[2] uppercase tracking-widest font-medium max-w-md">
              Our proprietary intelligence engine tracks capital appreciation across Bangalore's primary growth sectors.
            </p>
            <div className="flex gap-8 sm:gap-12">
               <div className="flex flex-col gap-1 sm:gap-2">
                 <span className="text-white text-2xl sm:text-3xl font-serif italic">+24%</span>
                 <span className="text-[8px] uppercase tracking-widest text-art-gold font-bold">Avg. YoY Appreciation</span>
               </div>
               <div className="flex flex-col gap-1 sm:gap-2">
                 <span className="text-white text-2xl sm:text-3xl font-serif italic">₹480Cr+</span>
                 <span className="text-[8px] uppercase tracking-widest text-art-gold font-bold">Asset Volume Advisory</span>
               </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          {/* Main Chart */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 sm:p-8 lg:p-12 rounded-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 sm:p-8">
               <TrendingUp className="text-art-gold/20" size={48} />
             </div>
             <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/40 mb-8 sm:mb-12">Capital Velocity / East Corridor</h3>
             <div className="h-[250px] sm:h-[320px] lg:h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData}>
                   <defs>
                     <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="4 4" stroke="#ffffff05" vertical={false} />
                   <XAxis dataKey="year" stroke="#ffffff20" fontSize={9} tickLine={false} axisLine={false} />
                   <YAxis hide />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #C5A05930', borderRadius: '0' }}
                     labelStyle={{ color: '#C5A059', fontWeight: 'bold', fontSize: '10px' }}
                   />
                   <Area type="monotone" dataKey="price" stroke="#C5A059" strokeWidth={2} fill="url(#colorVal)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 lg:gap-12">
            <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 lg:p-10 rounded-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-6 sm:mb-8">Asset Breakdown</h3>
               <div className="h-[180px] sm:h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={distributionData} innerRadius={50} outerRadius={75} paddingAngle={10} dataKey="value">
                       {distributionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: 'none', fontSize: '10px' }} />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div className="bg-art-gold p-6 sm:p-8 lg:p-10 rounded-sm">
              <span className="text-black text-[9px] font-black uppercase tracking-widest block mb-3 sm:mb-4">Investment Alpha</span>
              <p className="text-black text-lg sm:text-xl font-serif italic mb-4 sm:mb-6">"Strategic location selection precedes architectural preference."</p>
              <div className="w-12 h-px bg-black" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export type MainAppTab =
  | 'overview'
  | 'projects'
  | 'services'
  | 'why-choose'
  | 'insights'
  | 'opportunity'
  | 'referral'
  | 'testimonials'
  | 'loans'
  | 'faq'
  | 'about'
  | 'admin';

const Navbar = ({
  activeMainTab,
  onSelectTab,
  isAdminUser,
  onInquire
}: {
  activeMainTab: MainAppTab;
  onSelectTab: (tab: MainAppTab) => void;
  isAdminUser?: boolean;
  onInquire?: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links: Array<{ id: MainAppTab; name: string; isSpecial?: boolean }> = [
    { id: 'overview', name: 'Home' },
    { id: 'projects', name: 'Portfolios', isSpecial: true },
    { id: 'services', name: 'Expertise' },
    { id: 'why-choose', name: 'Philosophy' },
    { id: 'insights', name: 'Intelligence' },
    { id: 'opportunity', name: 'Offer Your Asset', isSpecial: true },
    { id: 'referral', name: 'Referral', isSpecial: true },
    { id: 'loans', name: 'Home Loans' },
    { id: 'testimonials', name: 'Client Voices' },
    { id: 'faq', name: 'FAQ' },
    { id: 'about', name: 'About' },
    ...(isAdminUser ? [{ id: 'admin' as MainAppTab, name: 'Admin Vault', isSpecial: true }] : [])
  ];

  const handleTabClick = (tab: MainAppTab) => {
    onSelectTab(tab);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-50 px-4 sm:px-6 md:px-10 transition-all duration-300 flex flex-col gap-3 max-w-[100vw]",
        scrolled
          ? "py-3 bg-art-dark/95 backdrop-blur-md border-b border-white/15 shadow-xl"
          : "py-4 bg-art-dark/95 backdrop-blur-md border-b border-white/10"
      )}>
        <div className="flex justify-between items-center w-full gap-4">
          <button
            type="button"
            onClick={() => handleTabClick('overview')}
            className="relative z-10 hover:opacity-80 transition-opacity shrink-0 text-left cursor-pointer"
          >
            <Logo />
          </button>

          <div className="relative z-10 flex items-center gap-4 sm:gap-6 shrink-0">
            <button
              type="button"
              onClick={onInquire}
              className="px-4 py-2 bg-art-gold text-black text-[10px] uppercase tracking-[0.25em] font-black hover:bg-white transition-colors whitespace-nowrap cursor-pointer rounded-sm"
            >
              Inquire Now
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex xl:hidden items-center gap-2.5 group cursor-pointer p-1"
              aria-label="Toggle navigation menu"
            >
              <span className="text-white text-[9px] uppercase tracking-[0.3em] font-bold hidden sm:block">All Tabs</span>
              <Menu className="text-white" size={22} />
            </button>
          </div>
        </div>

        {/* Dedicated Multi-Tab Navigation Bar (Separate Tabs - No Single Scrolling) */}
        <div className="w-full overflow-x-auto no-scrollbar border-t border-white/10 pt-2.5">
          <div className="flex items-center gap-1.5 min-w-max pb-1">
            {links.map(link => {
              const isActive = activeMainTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleTabClick(link.id)}
                  className={cn(
                    "px-4 py-2 rounded-sm text-[10px] uppercase tracking-[0.18em] font-black transition-all whitespace-nowrap cursor-pointer border",
                    isActive
                      ? "bg-art-gold text-black border-art-gold shadow-[0_0_20px_rgba(197,160,89,0.35)]"
                      : link.isSpecial
                      ? "bg-art-gold/10 text-art-gold border-art-gold/30 hover:bg-art-gold hover:text-black"
                      : "bg-white/[0.03] text-white/65 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/[0.08]"
                  )}
                >
                  {link.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-art-dark flex flex-col p-8 sm:p-12 overflow-y-auto select-none"
          >
            <div className="flex justify-between items-center mb-10">
              <Logo />
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-art-gold hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <X size={32} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {links.map((link) => {
                const isActive = activeMainTab === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleTabClick(link.id)}
                    className={cn(
                      "p-4 rounded-sm text-left font-serif italic text-xl transition-all border cursor-pointer flex items-center justify-between",
                      isActive
                        ? "bg-art-gold text-black border-art-gold font-bold"
                        : "bg-white/5 text-white border-white/10 hover:border-art-gold hover:text-art-gold"
                    )}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] text-art-gold uppercase tracking-[0.5em] font-black block mb-1">Private Vault Access</span>
                <a href="tel:+919108187205" className="text-2xl font-serif text-white italic">+91 91081 87205</a>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="py-3.5 px-8 bg-white/5 border border-white/10 hover:border-art-gold hover:text-art-gold transition-all text-white text-[10px] uppercase tracking-[0.25em] font-extrabold rounded-sm cursor-pointer"
              >
                Close Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ onConsult, onExplorePortfolios }: { onConsult?: () => void; onExplorePortfolios?: () => void }) => {
  const getISTGreeting = () => {
    const now = new Date();
    const istTime = new Date(now.getTime() + (new Date().getTimezoneOffset() * 60000) + (5.5 * 60 * 60 * 1000));
    const hour = istTime.getHours();
    
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <section className="w-full relative flex items-center py-10 sm:py-16 md:py-20 overflow-hidden bg-art-dark">
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-art-dark/85 z-10" />
      </div>

      {/* Vertical Graphic Elements */}
      <div className="absolute left-6 xl:left-10 bottom-12 z-20 hidden lg:block">
        <div className="flex flex-col items-center gap-12">
          <div className="w-[1px] h-24 bg-art-gold/30" />
          <span className="vertical-text text-[9px] text-white/20 font-bold select-none tracking-widest uppercase">Pinnacle Living / Bangalore</span>
        </div>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <span className="text-art-gold tracking-[0.3em] sm:tracking-[0.5em] uppercase block mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 font-bold text-xs sm:text-sm leading-relaxed">
                <span className="w-8 sm:w-12 h-[1px] bg-art-gold/40" />
                {getISTGreeting()} • Primary, Resale & Rental Advisory
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-none tracking-tighter mb-6 sm:mb-8 italic whitespace-nowrap">
                Legacy <span className="not-italic text-art-gold/80">Refined.</span>
              </h1>

              {/* Highly Prominent Brokerage Message */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3, duration: 0.8 }}
                 className="mb-8 sm:mb-10 inline-flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 md:p-8 border border-art-gold/15 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group w-full sm:w-auto rounded-sm"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-art-gold/40 to-transparent" />
                <span className="text-5xl sm:text-6xl md:text-7xl font-serif text-art-gold italic leading-none">0%</span>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl md:text-3xl font-serif tracking-widest italic font-light text-white">Brokerage Fee</span>
                  <span className="text-art-gold/70 text-[8px] uppercase tracking-[0.25em] sm:tracking-[0.4em] font-black mt-1.5">On All Primary Market Portfolio Acquisitions</span>
                  <span className="text-white/40 text-[8px] uppercase tracking-[0.2em] font-bold mt-1">Resale: 2% Commission • Rental: 1 Month Rent Commission</span>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 sm:gap-10">
                <p className="text-white/50 max-w-xs sm:max-w-sm text-[11px] leading-[1.8] font-medium uppercase tracking-[0.18em]">
                  Strategically curating high-performance Primary, Resale, and Rental residential portfolios across Bangalore's exclusive corridors.
                </p>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <motion.button 
                    type="button"
                    onClick={onExplorePortfolios}
                    whileHover={{ scale: 1.02 }}
                    className="bg-art-gold text-black px-8 sm:px-10 py-4 text-[10px] uppercase font-black tracking-[0.25em] sm:tracking-[0.3em] text-center w-full sm:w-auto cursor-pointer rounded-sm"
                  >
                    Open Portfolios Tab
                  </motion.button>
                  <button 
                    onClick={onConsult} 
                    className="text-white text-[10px] uppercase font-black tracking-[0.25em] sm:tracking-[0.3em] border-b border-white/20 pb-1 hover:border-art-gold transition-all text-center sm:text-left cursor-pointer w-full sm:w-auto"
                  >
                    Private Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column Metrics Window */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-end gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <div className="flex flex-col lg:items-end gap-1 lg:text-right">
              <span className="text-white text-3xl sm:text-4xl font-serif">100%</span>
              <span className="text-[9px] uppercase tracking-widest text-art-gold font-bold">Verified Direct Inventory</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col lg:items-end gap-1">
                <span className="text-[10px] text-white font-bold tracking-widest">EAST & SOUTH-EAST</span>
                <span className="text-[8px] text-white/40 uppercase tracking-[0.2em]">Primary Jurisdiction</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col lg:items-end gap-1">
                <span className="text-[10px] text-white font-bold tracking-widest">PRIMARY • RESALE • RENTAL</span>
                <span className="text-[8px] text-white/40 uppercase tracking-[0.2em]">Complete Lifecycle Stages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => (
  <section id="services" className="py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-12 bg-art-dark relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-art-gold/30 to-transparent" />
    
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-end mb-12 sm:mb-20 md:mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-art-gold text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] font-black block mb-4 sm:mb-6">Expertise & Nexus</span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white leading-tight italic whitespace-nowrap">
            Property <span className="not-italic text-art-gold">Intelligence.</span>
          </h2>
        </motion.div>
        <div className="max-w-md">
          <p className="text-white/40 text-xs sm:text-[13px] leading-[1.8] sm:leading-[2] uppercase tracking-widest font-medium pb-4 sm:pb-6 border-b border-art-gold/20">
            We operate at the intersection of architectural passion and strategic asset management, providing a gateway to the most coveted residential sanctuaries.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
        <div className="p-6 sm:p-8 lg:p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-6 sm:mb-12 group-hover:bg-art-gold transition-all duration-500">
              <ShieldCheck className="text-art-gold group-hover:text-black" size={28} />
            </div>
            <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-3 sm:mb-4 block">01 / Acquisition</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4 sm:mb-8">Primary Portfolios</h3>
            <p className="text-xs text-white/30 leading-[1.8] sm:leading-[2] uppercase tracking-[0.1em] font-medium mb-8">
              Direct access to major builders across all lifecycle stages—from EOI and Pre-launch to Ready-to-Move.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-6 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> 0% CLIENT BROKERAGE
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-6 sm:mb-12 group-hover:bg-art-gold transition-all duration-500">
              <TrendingUp className="text-art-gold group-hover:text-black" size={28} />
            </div>
            <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-3 sm:mb-4 block">02 / Growth</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4 sm:mb-8">Resale & Investment</h3>
            <p className="text-xs text-white/30 leading-[1.8] sm:leading-[2] uppercase tracking-[0.1em] font-medium mb-8">
              Maximize your equity through strategic secondary market positioning. We engineer high-yield exit strategies and portfolio rebalancing for long-term capital appreciation.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-6 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> PORTFOLIO OPTIMIZATION
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-6 sm:mb-12 group-hover:bg-art-gold transition-all duration-500">
              <CreditCard className="text-art-gold group-hover:text-black" size={28} />
            </div>
            <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-3 sm:mb-4 block">03 / Nexus</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4 sm:mb-8">Capital Concierge</h3>
            <p className="text-xs text-white/30 leading-[1.8] sm:leading-[2] uppercase tracking-[0.1em] font-medium mb-8">
              Strategic alliances with Tier-1 banking institutions. We orchestrate comprehensive doorstep concierge services, ensuring your financial structuring is as seamless as your sanctuary selection.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-6 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> SYNCHRONIZED APPROVALS
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-6 sm:mb-12 group-hover:bg-art-gold transition-all duration-500">
              <Home className="text-art-gold group-hover:text-black" size={28} />
            </div>
            <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-3 sm:mb-4 block">04 / Lifestyle</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4 sm:mb-8">Bespoke Design</h3>
            <p className="text-xs text-white/30 leading-[1.8] sm:leading-[2] uppercase tracking-[0.1em] font-medium mb-8">
              Curated interior design collaborations and 3D architectural visualization to personalize your new sanctuary.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-6 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> 3D VISUALIZATION SUPPORT
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyChoose = ({ onConsult }: { onConsult?: () => void }) => {
  const points = [
    {
      title: "Hands-on Sales, Resale & Rental Expertise",
      description: "Proven experience in Primary sales, Resale investments, and Rental leasing with a strong track record of successful closures.",
      icon: <Briefcase size={24} />,
      id: "01"
    },
    {
      title: "Trusted by Builders, Owners & Tenants",
      description: "Established relationships with all major Cat A+, A, B & C builders as well as verified property owners for seamless Primary, Resale, and Rental inventory.",
      icon: <Handshake size={24} />,
      id: "02"
    },
    {
      title: "Tailored Buying, Selling & Rental Solutions",
      description: "Bespoke property recommendations designed around each client’s unique purchase, resale exit, or rental home requirements.",
      icon: <Target size={24} />,
      id: "03"
    },
    {
      title: "Transparent Brokerage & Rental Terms",
      description: "0% Brokerage on Primary sales, 2% Commission on successful Resale closures, and 1 Month Rent as Commission on Rental placements—with zero hidden charges.",
      icon: <Percent size={24} />,
      id: "04"
    },
    {
      title: "Priority Sales & Rental Assistance",
      description: "Dedicated support at every stage—including site visits, tenant background verification, rental agreement drafting, and title checks.",
      icon: <Star size={24} />,
      id: "05"
    },
    {
      title: "End-to-End Sales & Rental Guidance",
      description: "From property search and rental tenant placement to Khata transfer, legal documentation, and final handover, we stand by you throughout the journey.",
      icon: <Compass size={24} />,
      id: "06"
    },
    {
      title: "Customer & Tenant First Philosophy",
      description: "Whether you are buying your dream sanctuary, selling an asset, or securing a curated rental home, your satisfaction is our highest priority.",
      icon: <Heart size={24} />,
      id: "07"
    }
  ];

  return (
    <section id="why-choose" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white/[0.01] relative overflow-hidden">
      <div className="absolute right-0 top-0 w-px h-full bg-white/5 hidden lg:block" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 mb-12 sm:mb-16 md:mb-24">
          <div className="max-w-2xl">
            <span className="text-art-gold text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] font-black block mb-4 sm:mb-6">Our Philosophy • Primary, Resale & Rental</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white tracking-tight italic whitespace-nowrap">
              Why Choose <span className="not-italic text-art-gold">BS Homez.</span>
            </h2>
          </div>
          <div className="lg:pb-8">
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black text-white/30">
              <div className="w-12 h-px bg-art-gold/30" /> Seven Pillars of Sales & Rental Trust
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 gap-y-10 sm:gap-y-16">
          {points.map((point) => {
            const colorMap: Record<string, string> = {
              "01": "#f4f3f2",
              "02": "#fbf9f5",
              "03": "#fbf9f5",
              "04": "#faf6ed",
              "05": "#f6f4f0",
              "06": "#f4f0e9",
              "07": "#f4f2ed",
            };
            return (
              <motion.div 
                key={point.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group h-full flex flex-col"
              >
                <div 
                  className="text-[10px] font-mono text-art-gold/20 font-black mb-6 group-hover:text-art-gold transition-colors duration-500"
                  style={{ color: colorMap[point.id] || undefined }}
                >
                  // {point.id}
                </div>
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm mb-8 text-art-gold border border-white/10 group-hover:bg-art-gold group-hover:text-black transition-all duration-500">
                  {point.icon}
                </div>
                <h3 className="text-2xl font-serif text-white mb-6 italic leading-snug">{point.title}</h3>
                <p className="text-[11px] text-white/30 uppercase tracking-widest leading-[2] font-medium group-hover:text-white/60 transition-colors">
                  {point.description}
                </p>
                <div className="mt-auto pt-8">
                  <div className="w-0 h-[1px] bg-art-gold group-hover:w-full transition-all duration-700" />
                </div>
              </motion.div>
            );
          })}
          
          {/* Decorative Call to Action Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative lg:col-span-1 xl:col-span-1 bg-art-gold p-10 flex flex-col justify-between"
          >
            <div>
              <span className="text-black text-[9px] font-black uppercase tracking-widest block mb-12">Actionable Intelligence</span>
              <h3 className="text-4xl font-serif text-black leading-[1.1] italic mb-6">Experience the Service Difference.</h3>
            </div>
            <button 
              onClick={onConsult} 
              className="flex items-center justify-between text-black text-[10px] uppercase font-black tracking-widest border-t border-black/20 pt-8 group/btn text-left mt-auto w-full"
            >
              Consult Now
              <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const compressUploadedImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const parsePrice = (priceStr: string): number => {
  const clean = priceStr.replace(/₹/g, '').toLowerCase().replace(/,/g, '');
  if (clean.includes('cr')) {
    return parseFloat(clean.replace('cr', '')) * 10000000;
  }
  if (clean.includes('l')) {
    return parseFloat(clean.replace('l', '')) * 100000;
  }
  return parseFloat(clean) || 0;
};

const formatPriceWithCondition = (priceStr?: string): string => {
  if (!priceStr) return '';
  const trimmed = priceStr.trim();
  if (!trimmed) return '';
  return trimmed.endsWith('*') ? trimmed : `${trimmed}*`;
};

const getCorridorDefaultImage = (zone?: string, type?: string, builderCategory?: string, propertyType?: string): string => {
  const normProp = propertyType === 'Flat' ? 'Apartment' : propertyType;
  if (normProp === 'Plot') return imgLuxuryPlotEstate;
  if (normProp === 'Villa') {
    if (zone === 'Hoskote') return imgHoskoteTownship;
    if (zone === 'Kasavanahalli') return imgKasavanahalliVillas;
    return imgLuxuryResale;
  }
  if (builderCategory === 'C') return imgCatCBoutique;
  if (builderCategory === 'B') return imgCatBModern;
  if (builderCategory === 'A') {
    if (zone === 'Hosa Road') return imgHosaRoadSkyline;
    if (zone === 'Gunjur') return imgGunjurSanctuary;
    return imgCatABiophilic;
  }
  if (builderCategory === 'A+') {
    if (zone === 'Whitefield') return imgWhitefieldTowers;
    if (zone === 'Varthur') return imgVarthurLakefront;
    if (zone === 'Gunjur') return imgGunjurSanctuary;
    return imgCatAPlusTowers;
  }
  switch (zone) {
    case 'Whitefield':
      return imgWhitefieldTowers;
    case 'Hoskote':
      return imgHoskoteTownship;
    case 'Varthur':
      return imgVarthurLakefront;
    case 'Gunjur':
      return imgGunjurSanctuary;
    case 'Hosa Road':
      return imgHosaRoadSkyline;
    case 'Kasavanahalli':
      return imgKasavanahalliVillas;
    case 'Off Sarjapur Road':
      return imgCatABiophilic;
    case 'Sarjapur':
      return imgSouthEastHanded;
    case 'Bellandur':
      return imgEastReady;
    default:
      return type === 'Resale' || type === 'Rental' ? imgLuxuryResale : imgCatAPlusTowers;
  }
};

const getSmartProjectImages = (zone?: string, type?: string, builderCategory?: string, propertyType?: string): string[] => {
  const primaryImg = getCorridorDefaultImage(zone, type, builderCategory, propertyType);
  const corridorSecondary = (() => {
    switch (zone) {
      case 'Whitefield': return imgWhitefieldTowers;
      case 'Hoskote': return imgHoskoteTownship;
      case 'Varthur': return imgVarthurLakefront;
      case 'Gunjur': return imgGunjurSanctuary;
      case 'Hosa Road': return imgHosaRoadSkyline;
      case 'Kasavanahalli': return imgKasavanahalliVillas;
      default: return imgEastReady;
    }
  })();
  const tierTertiary =
    propertyType === 'Plot'
      ? imgHoskoteTownship
      : propertyType === 'Villa'
      ? imgLuxuryResale
      : builderCategory === 'A+'
      ? imgCatAPlusTowers
      : builderCategory === 'A'
      ? imgCatABiophilic
      : builderCategory === 'B'
      ? imgCatBModern
      : builderCategory === 'C'
      ? imgCatCBoutique
      : imgSouthEastConst;

  return Array.from(new Set([primaryImg, corridorSecondary, tierTertiary]));
};

const ProjectCard: React.FC<{ 
  project: Project; 
  isAdmin?: boolean;
  isCompared?: boolean;
  comparedCount?: number;
  onToggleCompare?: (p: Project) => void;
  onEnquire: (p: Project) => void;
  onDownload: (p: Project) => void;
  onSaveProject: (updated: Project) => Promise<void>;
  onDeleteProject: (p: Project) => Promise<void>;
  onTogglePause: (p: Project) => Promise<void>;
}> = ({ 
  project, 
  isAdmin = false, 
  isCompared = false,
  comparedCount = 0,
  onToggleCompare,
  onEnquire, 
  onDownload, 
  onSaveProject, 
  onDeleteProject, 
  onTogglePause 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Inline Editing State (Primary: Entire Project Edit + Save/Discard; Resale & Rental: Edit & Upload Images + Save/Discard)
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editDraft, setEditDraft] = useState<Project>({ ...project });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isFetchingOnlineCard, setIsFetchingOnlineCard] = useState(false);
  const [uploadingImageCard, setUploadingImageCard] = useState(false);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditDraft({ ...project });
  }, [project]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes('@')) {
      setSubscribeError("Please enter a valid email address.");
      return;
    }

    setIsSubscribing(true);
    setSubscribeError('');

    try {
      await addDoc(collection(db, 'subscriptions'), {
        projectId: project.id || 'unspecified',
        projectName: project.name,
        email: subscribeEmail.trim().toLowerCase(),
        createdAt: serverTimestamp()
      });
      setSubscribeSuccess(true);
      setSubscribeEmail('');
      setTimeout(() => {
        setIsSubscribeOpen(false);
        setSubscribeSuccess(false);
      }, 4000);
    } catch (err: any) {
      console.error("Subscription setup failed:", err);
      setSubscribeError("Subscription issue. Please verify email and retry.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCardOnlineSync = async () => {
    if (!editDraft.name?.trim()) return;
    setIsFetchingOnlineCard(true);
    try {
      const res = await fetch('/api/projects/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: editDraft.name,
          corridorHint: editDraft.zone,
          portfolioTypeHint: editDraft.type === 'Primary Sale' ? 'Primary' : editDraft.type
        })
      });
      const data = await res.json();
      if (data?.project) {
        const newPrice = formatPriceWithCondition(data.project.price);
        const oldPrice = formatPriceWithCondition(editDraft.price || editDraft.lastPrice);
        const latestLastPrice = formatPriceWithCondition(data.project.lastPrice || newPrice || oldPrice);
        const latestHandoverDate = data.project.handoverDate || editDraft.handoverDate || 'December 2027';
        
        let priceChanged = false;
        
        if (newPrice && oldPrice) {
            const pNew = parsePrice(newPrice);
            const pOld = parsePrice(oldPrice);
            if (pOld > 0) {
                const change = Math.abs(pNew - pOld) / pOld;
                if (change > 0.05) { // 5% threshold
                    priceChanged = true;
                }
            }
        }

        const resolvedZone = data.project.zone || editDraft.zone;
        const resolvedType = data.project.type || editDraft.type;
        const resolvedCat = data.project.builderCategory || editDraft.builderCategory;
        const resolvedProp = data.project.propertyType || editDraft.propertyType;

        setEditDraft(prev => ({
          ...prev,
          ...data.project,
          price: newPrice || prev.price,
          lastPrice: latestLastPrice,
          lastCheckedPrice: oldPrice || latestLastPrice,
          handoverDate: latestHandoverDate,
          priceChanged,
          id: prev.id,
          imageUrls: getSmartProjectImages(resolvedZone, resolvedType, resolvedCat, resolvedProp)
        }));
      }
    } catch (err) {
      console.warn('Online card sync failed:', err);
    } finally {
      setIsFetchingOnlineCard(false);
    }
  };

  const handleCardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImageCard(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressUploadedImage(files[i]);
        uploadedUrls.push(compressed);
      }
      setEditDraft(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []).filter(Boolean), ...uploadedUrls]
      }));
    } catch (err) {
      console.error("Failed to compress/upload image:", err);
    } finally {
      setUploadingImageCard(false);
      e.target.value = '';
    }
  };

  const handleSaveInlineEdit = async () => {
    setIsSavingEdit(true);
    try {
      let updatedDraft = { ...editDraft };

      // Auto-update missing or outdated Last Price and Handover Date via online intelligence
      if (!updatedDraft.lastPrice?.trim() || !updatedDraft.handoverDate?.trim()) {
        try {
          const res = await fetch('/api/projects/lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectName: updatedDraft.name,
              corridorHint: updatedDraft.zone,
              portfolioTypeHint: updatedDraft.type === 'Primary Sale' ? 'Primary' : updatedDraft.type
            })
          });
          const data = await res.json();
          if (data?.project) {
            updatedDraft = {
              ...data.project,
              ...updatedDraft,
              price: updatedDraft.price?.trim() ? updatedDraft.price : data.project.price,
              lastPrice: updatedDraft.lastPrice?.trim() ? updatedDraft.lastPrice : (data.project.lastPrice || updatedDraft.price || data.project.price),
              handoverDate: updatedDraft.handoverDate?.trim() ? updatedDraft.handoverDate : (data.project.handoverDate || 'December 2027'),
            };
          }
        } catch (lookupErr) {
          console.warn('Auto lookup on inline save skipped:', lookupErr);
        }
      }

      const autoHandoverFallback =
        updatedDraft.handoverStatus === 'Ready to Move' || updatedDraft.handoverStatus === 'Handed Over'
          ? 'Immediate Possession (OC Received)'
          : 'December 2027';

      const formattedPrice = formatPriceWithCondition(updatedDraft.price);
      const formattedLastPrice = formatPriceWithCondition(updatedDraft.lastPrice?.trim() || formattedPrice);

      const cleaned: Project = {
        ...updatedDraft,
        price: formattedPrice,
        lastPrice: formattedLastPrice,
        lastCheckedPrice: formatPriceWithCondition(project.price && project.price !== formattedPrice ? project.price : (updatedDraft.lastCheckedPrice || formattedPrice)),
        handoverDate: updatedDraft.handoverDate?.trim() || autoHandoverFallback,
        propertyType: updatedDraft.propertyType === 'Flat' ? 'Apartment' : updatedDraft.propertyType,
        imageUrls: (updatedDraft.imageUrls || []).filter(Boolean).length > 0
          ? (updatedDraft.imageUrls || []).filter(Boolean)
          : getSmartProjectImages(updatedDraft.zone, updatedDraft.type, updatedDraft.builderCategory, updatedDraft.propertyType),
        features: (updatedDraft.features || []).filter(Boolean)
      };
      await onSaveProject(cleaned);
      setIsEditingCard(false);
    } catch (err) {
      console.error("Save project error:", err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDiscardInlineEdit = () => {
    setEditDraft({ ...project });
    setNewImageUrlInput('');
    setIsEditingCard(false);
  };

  const carouselItems = [
    ...(project.videoUrl ? [{ type: 'video' as const, url: project.videoUrl, mobileUrl: project.mobileVideoUrl }] : []),
    ...(project.imageUrls || []).filter(Boolean).map((url, idx) => ({ 
      type: 'image' as const, 
      url, 
      mobileUrl: idx === 0 && project.mobileImageUrl ? project.mobileImageUrl : undefined 
    }))
  ];
  if (carouselItems.length === 0) {
    carouselItems.push({
      type: 'image' as const,
      url: getCorridorDefaultImage(project.zone, project.type, project.builderCategory, project.propertyType),
      mobileUrl: undefined
    });
  }

  const displayType = project.type === 'Primary Sale' ? 'Primary' : project.type;
  const displayZone = project.zone === 'Bangalore East' ? 'East Bangalore' : project.zone;
  const displayPropertyType = project.propertyType === 'Flat' ? 'Apartment' : project.propertyType;
  const formattedMainPrice = formatPriceWithCondition(project.price);
  const effectiveLastPrice = formatPriceWithCondition(project.lastPrice || project.lastCheckedPrice || project.price);
  const effectiveHandoverDate = project.handoverDate || (project.handoverStatus === 'Ready to Move' || project.handoverStatus === 'Handed Over' ? 'Immediate Possession' : 'Scheduled Handover');
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.name} ${project.location} Bangalore`)}`;

  const inquiriesSocialCount = useMemo(() => {
    const seed = (project.name + (project.location || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (seed % 17) + 14;
  }, [project.name, project.location]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: isEditingCard ? 0 : -8,
        scale: isEditingCard ? 1 : 1.015,
        boxShadow: "0 30px 60px -12px rgba(212, 175, 55, 0.25), 0 20px 45px rgba(0, 0, 0, 0.85)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        opacity: { duration: 0.5 }
      }}
      className="group relative flex flex-col bg-white/[0.015] border border-white/[0.08] hover:border-art-gold/60 transition-all duration-300 overflow-hidden rounded-sm hover:shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
    >
      {project.priceChanged && (
         <div className="absolute top-4 left-4 z-20 bg-red-600/90 text-white text-[9px] font-black uppercase px-2 py-1 rounded-sm shadow-md">
            Price Alert
         </div>
      )}
      {/* Absolute-positioned Subscription mini-modal overlay inside the card body */}
      <AnimatePresence>
        {isSubscribeOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-art-dark/98 backdrop-blur-md z-30 flex flex-col justify-center p-8 border border-art-gold/30"
          >
            <button 
              onClick={() => {
                setIsSubscribeOpen(false);
                setSubscribeError('');
              }}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 z-40"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {!subscribeSuccess ? (
              <form onSubmit={handleSubscribeSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-art-gold/10 flex items-center justify-center mx-auto mb-4 border border-art-gold/25">
                    <Bell className="text-art-gold" size={16} />
                  </div>
                  <h4 className="text-lg font-serif italic text-white tracking-wide">Property Alerts</h4>
                  <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] leading-relaxed mt-2 px-1">
                    Receive priority email notification updates on any capital value adjustments within <br/>
                    <span className="text-art-gold font-bold font-serif italic normal-case tracking-normal">{project.name}</span>.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="email"
                    required
                    placeholder="Enter proprietary email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="w-full text-xs bg-white/[0.02] border border-white/15 focus:border-art-gold/50 text-white placeholder-white/20 px-4 py-3 rounded-sm outline-none transition-all font-mono"
                    disabled={isSubscribing}
                  />
                  {subscribeError && (
                    <p className="text-[10px] text-red-400 uppercase tracking-widest text-center font-bold">
                      {subscribeError}
                    </p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-art-gold text-black hover:bg-white hover:text-black font-black text-[9px] uppercase tracking-[0.25em] py-3.5 rounded-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Securing Spot...
                    </>
                  ) : (
                    "Authorize Alerts"
                  )}
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-6"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <CheckCircle2 className="text-green-400" size={22} />
                </div>
                <h4 className="text-base font-serif italic text-white">Registry Activated</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                  You are now registered to receive premium price advisory updates for {project.name}.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalculatorOpen && (
          <InvestmentCalculator project={project} onClose={() => setIsCalculatorOpen(false)} />
        )}
      </AnimatePresence>

      {/* Top Status, Builder Category & Corridor Header Banner */}
      <div className="px-5 py-3.5 bg-black/70 border-b border-white/10 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-[0.22em] px-2.5 py-0.5 bg-art-gold text-black rounded-sm">
            {displayType}
          </span>
          {project.builderCategory && (
            <span className="text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 bg-white/10 text-art-gold border border-art-gold/30 rounded-sm">
              Cat {project.builderCategory} Builder
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/90 flex items-center gap-1">
            <MapPin size={10} className="text-art-gold" />
            {displayZone}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(project);
              }}
              className={cn(
                "px-2.5 py-1 rounded-sm text-[8.5px] uppercase tracking-widest font-black border transition-all flex items-center gap-1 cursor-pointer",
                isCompared
                  ? "bg-art-gold text-black border-art-gold shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                  : "bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border-white/20"
              )}
              title={isCompared ? "Remove from comparison" : "Add to side-by-side comparison (up to 3)"}
            >
              <ArrowLeftRight size={10} className={isCompared ? "text-black" : "text-art-gold"} />
              <span>{isCompared ? "✓ Compared" : "+ Compare"}</span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePause(project);
                }}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-widest font-black border transition-all cursor-pointer",
                  project.isPaused ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-white/5 hover:bg-art-gold hover:text-black text-art-gold border-art-gold/35"
                )}
                title={project.isPaused ? "Unhide / Resume Project" : "Hide Project from Main View"}
              >
                {project.isPaused ? 'Unhide' : 'Hide'}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project);
                }}
                className="px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-widest font-black border bg-white/5 hover:bg-red-500/20 text-red-400 border-red-500/30 transition-all cursor-pointer"
                title="Remove Project from App"
              >
                Delete
              </button>
            </>
          )}

          {project.handoverStatus && (
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 border rounded-sm",
              project.handoverStatus === 'EOI' && "bg-art-gold/15 border-art-gold/40 text-art-gold",
              project.handoverStatus === 'Under Construction' && "bg-blue-500/15 border-blue-500/40 text-blue-300",
              project.handoverStatus === 'Ready to Move' && "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
              project.handoverStatus === 'Handed Over' && "bg-purple-500/15 border-purple-500/40 text-purple-300",
              !['EOI', 'Under Construction', 'Ready to Move', 'Handed Over'].includes(project.handoverStatus) && "bg-white/10 border-white/20 text-white/80"
            )}>
              {project.handoverStatus === 'Under Construction' ? 'Under .Construction' : project.handoverStatus}
            </span>
          )}
          
          {/* Direct Edit Trigger Button for Admin Only */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setEditDraft({ ...project });
                setIsEditingCard(!isEditingCard);
              }}
              className={cn(
                "px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-widest font-black border transition-all flex items-center gap-1 cursor-pointer",
                isEditingCard
                  ? "bg-art-gold text-black border-art-gold"
                  : "bg-white/5 hover:bg-art-gold hover:text-black text-art-gold border-art-gold/35"
              )}
              title="Edit Project Data"
            >
              <Edit size={11} />
              Edit Data
            </button>
          )}
        </div>
      </div>

      {/* Inline Editor Mode for Admin (All Data Fields Only — Image Option Removed for Production) */}
      {isAdmin && isEditingCard ? (
        <div className="p-6 bg-[#0d0d0d] border-b border-art-gold/30 space-y-5 font-sans z-20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black block">
                {`${displayType} Portfolio — Edit Project Data`}
              </span>
              <h4 className="text-lg font-serif italic text-white">{editDraft.name || 'Project Editor'}</h4>
            </div>
            <button
              type="button"
              onClick={handleCardOnlineSync}
              disabled={isFetchingOnlineCard}
              className="px-3 py-1.5 bg-art-gold/15 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40 rounded-sm text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isFetchingOnlineCard ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Auto-Fetch Online Details
            </button>
          </div>

          {/* Comprehensive Project Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Project Name</label>
              <input
                type="text"
                value={editDraft.name}
                onChange={e => setEditDraft({ ...editDraft, name: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Price / Rental Value (* Conditions Apply)</label>
              <input
                type="text"
                value={editDraft.price}
                onChange={e => setEditDraft({ ...editDraft, price: e.target.value, lastPrice: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-art-gold block mb-1 font-bold">Last Price (Auto-Updated *)</label>
              <input
                type="text"
                value={editDraft.lastPrice || editDraft.price || ''}
                onChange={e => setEditDraft({ ...editDraft, lastPrice: e.target.value })}
                placeholder="Auto-synced Last Price*"
                className="w-full bg-art-gold/10 border border-art-gold/30 rounded-sm p-2.5 text-xs text-art-gold font-mono outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-art-gold block mb-1 font-bold">Hand Over Date (Auto-Updated)</label>
              <input
                type="text"
                value={editDraft.handoverDate || ''}
                onChange={e => setEditDraft({ ...editDraft, handoverDate: e.target.value })}
                placeholder="e.g., December 2027 / Immediate"
                className="w-full bg-art-gold/10 border border-art-gold/30 rounded-sm p-2.5 text-xs text-art-gold font-mono outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Portfolio Type (Primary / Resale / Rental)</label>
              <select
                value={editDraft.type === 'Primary Sale' ? 'Primary' : editDraft.type}
                onChange={e => setEditDraft({ ...editDraft, type: e.target.value as any })}
                className="w-full bg-art-dark border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              >
                <option value="Primary">Primary</option>
                <option value="Resale">Resale</option>
                <option value="Rental">Rental</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Present Status</label>
              <select
                value={editDraft.handoverStatus || 'Under Construction'}
                onChange={e => {
                  const status = e.target.value as Project['handoverStatus'];
                  setEditDraft({ ...editDraft, handoverStatus: status });
                }}
                className="w-full bg-art-dark border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              >
                <option value="EOI">EOI</option>
                <option value="Under Construction">Under .Construction</option>
                <option value="Ready to Move">Ready To Move</option>
                <option value="Handed Over">Handed Over</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Property Type (Villa / Apartment / Plot)</label>
              <select
                value={editDraft.propertyType === 'Flat' ? 'Apartment' : editDraft.propertyType}
                onChange={e => setEditDraft({ ...editDraft, propertyType: e.target.value as any })}
                className="w-full bg-art-dark border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Builder Category & Name</label>
              <div className="flex gap-1.5">
                <select
                  value={editDraft.builderCategory || 'A'}
                  onChange={e => setEditDraft({ ...editDraft, builderCategory: e.target.value as any })}
                  className="bg-art-dark border border-white/15 rounded-sm p-2.5 text-xs text-art-gold font-bold outline-none focus:border-art-gold"
                >
                  <option value="A+">Cat A+</option>
                  <option value="A">Cat A</option>
                  <option value="B">Cat B</option>
                  <option value="C">Cat C</option>
                </select>
                <input
                  type="text"
                  value={editDraft.builderName || ''}
                  onChange={e => setEditDraft({ ...editDraft, builderName: e.target.value })}
                  placeholder="Builder Name"
                  className="flex-1 bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
                />
              </div>
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Corridor / Zone</label>
              <select
                value={editDraft.zone === 'Bangalore East' ? 'East Bangalore' : editDraft.zone}
                onChange={e => setEditDraft({ ...editDraft, zone: e.target.value as any })}
                className="w-full bg-art-dark border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              >
                <option value="Whitefield">Whitefield</option>
                <option value="Hoskote">Hoskote</option>
                <option value="Varthur">Varthur</option>
                <option value="Gunjur">Gunjur</option>
                <option value="Hosa Road">Hosa Road</option>
                <option value="Kasavanahalli">Kasavanahalli</option>
                <option value="East Bangalore">East Bangalore</option>
                <option value="Off Sarjapur Road">Off Sarjapur Road</option>
                <option value="Sarjapur">Sarjapur</option>
                <option value="Electronic City">Electronic City</option>
                <option value="Marathalli">Marathalli</option>
                <option value="Bellandur">Bellandur</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Location Name & Landmark</label>
              <input
                type="text"
                value={editDraft.location}
                onChange={e => setEditDraft({ ...editDraft, location: e.target.value })}
                placeholder="Location Name"
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">RERA Number</label>
              <input
                type="text"
                value={editDraft.reraNumber || ''}
                onChange={e => setEditDraft({ ...editDraft, reraNumber: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs font-mono text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Approval Body (BBMP / BDA / BMRDA)</label>
              <input
                type="text"
                value={editDraft.approvalBody || ''}
                onChange={e => setEditDraft({ ...editDraft, approvalBody: e.target.value })}
                placeholder="BBMP / BDA / BMRDA / RERA"
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Project Size</label>
              <input
                type="text"
                value={editDraft.projectSize || ''}
                onChange={e => setEditDraft({ ...editDraft, projectSize: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">No. Of Towers / Units</label>
              <input
                type="text"
                value={editDraft.noOfTowers || ''}
                onChange={e => setEditDraft({ ...editDraft, noOfTowers: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Flats / Units per Floor</label>
              <input
                type="text"
                value={editDraft.flatsPerFloor || ''}
                onChange={e => setEditDraft({ ...editDraft, flatsPerFloor: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">No. of Floors Height</label>
              <input
                type="text"
                value={editDraft.floorsHeight || ''}
                onChange={e => setEditDraft({ ...editDraft, floorsHeight: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Configurations (Comma Separated)</label>
              <input
                type="text"
                value={(editDraft.configuration || []).join(', ')}
                onChange={e => setEditDraft({ ...editDraft, configuration: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Floor Plan & Carpet / SBA Specifications</label>
            <input
              type="text"
              value={editDraft.floorPlan || ''}
              onChange={e => setEditDraft({ ...editDraft, floorPlan: e.target.value })}
              placeholder="e.g., 2 BHK: 1250 Sq.Ft. | 3 BHK: 1780 Sq.Ft. | 4 BHK: 2450 Sq.Ft."
              className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
            />
          </div>

          <div>
            <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Amenities (Comma Separated)</label>
            <input
              type="text"
              value={(editDraft.features || []).join(', ')}
              onChange={e => setEditDraft({ ...editDraft, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold"
            />
          </div>

          <div>
            <label className="text-[8px] uppercase tracking-widest text-white/45 block mb-1 font-bold">Project Writeup (Include Nearby Schools, Hospitals, IT Hubs, Malls, Bus Stop with kms)</label>
            <textarea
              rows={4}
              value={editDraft.description}
              onChange={e => setEditDraft({ ...editDraft, description: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-sm p-2.5 text-xs text-white outline-none focus:border-art-gold leading-relaxed"
            />
          </div>

          {/* Save & Discard Action Bar */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleSaveInlineEdit}
              disabled={isSavingEdit}
              className="flex-1 bg-art-gold hover:bg-white text-black font-black text-[10px] uppercase tracking-[0.25em] py-3 rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSavingEdit ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Save & Auto-Update Price / Handover
            </button>
            <button
              type="button"
              onClick={handleDiscardInlineEdit}
              disabled={isSavingEdit}
              className="px-5 py-3 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 border border-white/15 hover:border-red-500/30 font-black text-[10px] uppercase tracking-[0.25em] rounded-sm transition-all cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Project Name & Builder Pedigree Header */}
          <div className="px-6 pt-5 pb-4 bg-white/[0.01] border-b border-white/5">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <span className="text-art-gold text-[9px] uppercase tracking-[0.3em] font-black">
                {displayPropertyType} {project.builderName ? `• By ${project.builderName}` : `• ${project.segment}`}
              </span>
              {project.configuration && project.configuration.length > 0 && (
                <span className="text-white/55 text-[9px] font-mono uppercase tracking-wider">{project.configuration.join(' | ')}</span>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h3 className="text-2xl sm:text-3xl font-serif text-white italic group-hover:text-art-gold transition-colors duration-300">
                {project.name}
              </h3>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-serif italic text-art-gold font-bold block">
                  {formattedMainPrice}
                </span>
                <span className="text-[8px] uppercase tracking-[0.18em] text-white/45 font-mono block">
                  * Conditions Apply
                </span>
              </div>
            </div>

            {/* Prominent Location Name Badge */}
            <div className="mt-3 p-2.5 bg-white/[0.03] border border-white/10 rounded-sm flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-art-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-[8px] uppercase tracking-[0.22em] text-art-gold font-black block">
                    Location Name • {displayZone} Corridor
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {project.location}
                  </span>
                  {project.locationTarget && (
                    <span className="text-[10px] text-white/60 block mt-0.5">
                      {project.locationTarget}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] uppercase tracking-widest text-art-gold hover:text-white flex items-center gap-1 font-mono transition-colors px-2 py-1 bg-art-gold/10 border border-art-gold/30 rounded-sm"
              >
                <ExternalLink size={10} /> Map
              </a>
            </div>

            {/* Auto-Updated Last Price & Handover Date Highlight Bar */}
            <div className="grid grid-cols-2 gap-2 mt-2.5 p-2.5 bg-art-gold/[0.06] border border-art-gold/25 rounded-sm">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/45 font-bold flex items-center gap-1">
                  <Sparkles size={9} className="text-art-gold" /> Last Price (Updated)
                </span>
                <span className="text-[11px] font-mono font-bold text-art-gold truncate mt-0.5" title={`${effectiveLastPrice} (* Conditions Apply)`}>
                  {effectiveLastPrice}
                </span>
                <span className="text-[7px] uppercase tracking-widest text-white/40 font-mono">
                  * Conditions Apply
                </span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-2.5">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/45 font-bold flex items-center gap-1">
                  <Calendar size={9} className="text-art-gold" /> Handover Date
                </span>
                <span className="text-[11px] font-mono font-bold text-white/90 truncate mt-0.5">
                  {effectiveHandoverDate}
                </span>
                <span className="text-[7px] uppercase tracking-widest text-white/40 font-mono">
                  {project.reraNumber ? 'RERA Verified' : 'Verified Schedule'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Writeup (Including Nearby Schools, Hospitals, IT Hubs, Malls, Bus Stop with kms), Floor Plans & Specifications */}
          <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-20 space-y-4">
            <div className="bg-white/[0.02] p-3.5 rounded-sm border border-white/10">
              <span className="text-[8px] uppercase tracking-[0.22em] text-art-gold font-black block mb-1.5">
                Project Write-Up & Nearby Landmarks (in kms) — {project.location}
              </span>
              <p className={cn("text-xs text-white/85 leading-relaxed font-sans whitespace-pre-line", isExpanded ? "" : "line-clamp-5")}>
                {project.description}
              </p>
              {project.description && project.description.length > 180 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(prev => !prev)}
                  className="text-[9px] uppercase tracking-widest text-art-gold hover:text-white font-black mt-2 cursor-pointer"
                >
                  {isExpanded ? 'Show Less' : 'Read Full Write-Up & Nearby Kms'}
                </button>
              )}
            </div>

            {/* Key Project Specifications (RERA, Approval Body, Scale, Towers, Elevation) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[10px]">
              <div className="bg-white/[0.02] p-2.5 rounded-sm border border-white/5">
                <span className="text-[8px] uppercase tracking-widest text-white/40 block">RERA & Approval Body</span>
                <span className="text-white/90 font-mono truncate block" title={`${project.approvalBody || ''} | ${project.reraNumber || ''}`}>
                  {project.approvalBody || 'BBMP / BDA / RERA'}
                </span>
                {project.reraNumber && (
                  <span className="text-[8px] text-art-gold/80 font-mono truncate block mt-0.5" title={project.reraNumber}>
                    {project.reraNumber}
                  </span>
                )}
              </div>
              <div className="bg-white/[0.02] p-2.5 rounded-sm border border-white/5">
                <span className="text-[8px] uppercase tracking-widest text-white/40 block">Project Scale & Elevation</span>
                <span className="text-white/90 font-mono truncate block">
                  {project.projectSize || 'Luxury Enclave'} {project.noOfTowers ? `• ${project.noOfTowers}` : ''}
                </span>
                {(project.floorsHeight || project.flatsPerFloor) && (
                  <span className="text-[8px] text-white/55 font-mono truncate block mt-0.5">
                    {[project.floorsHeight, project.flatsPerFloor].filter(Boolean).join(' • ')}
                  </span>
                )}
              </div>
            </div>

            {project.floorPlan && (
              <div className="bg-white/[0.025] px-3 py-2.5 rounded-sm border border-art-gold/20 text-[10px]">
                <span className="text-[8px] uppercase tracking-widest text-art-gold font-black block mb-1 flex items-center gap-1.5">
                  <Layers size={10} /> Verified Floor Plan & SBA Breakdown
                </span>
                <p className="text-white/85 font-mono text-[10px] leading-relaxed">{project.floorPlan}</p>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.features.slice(0, 4).map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] uppercase tracking-wider font-mono px-2 py-1 bg-white/[0.03] border border-white/10 text-white/70 rounded-sm"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Action Footer with ROI Calculator, Alerts, Brochure & Enquire */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap mt-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="px-3 py-2 rounded-sm text-[9px] uppercase tracking-widest font-black border bg-white/5 hover:bg-white/15 text-white/80 border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator size={12} className="text-art-gold" />
                  ROI Model
                </button>
                {onToggleCompare && (
                  <button
                    type="button"
                    onClick={() => onToggleCompare(project)}
                    className={cn(
                      "px-2.5 py-2 rounded-sm text-[9px] uppercase tracking-widest font-black border transition-all flex items-center gap-1 cursor-pointer",
                      isCompared
                        ? "bg-art-gold text-black border-art-gold shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                        : "bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border-white/15"
                    )}
                    title="Compare specifications side-by-side"
                  >
                    <ArrowLeftRight size={11} className={isCompared ? "text-black" : "text-art-gold"} />
                    <span>{isCompared ? "In Compare" : "Compare"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSubscribeOpen(true)}
                  className="p-2 rounded-sm border bg-white/5 hover:bg-art-gold/20 text-art-gold border-white/15 transition-all cursor-pointer"
                  title="Subscribe to Price Alerts"
                >
                  <Bell size={12} />
                </button>
                <SocialShareButtons 
                  propertyTitle={project.name}
                  propertyHighlights={project.features || []}
                  propertyLink={`${window.location.origin}/?project=${encodeURIComponent(project.id || project.name)}`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDownload(project)}
                  className="px-3 py-2 rounded-sm text-[9px] uppercase tracking-widest font-black border bg-white/5 hover:bg-white hover:text-black text-white border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={11} />
                  Brochure
                </button>
                <button
                  type="button"
                  onClick={() => onEnquire(project)}
                  className="relative px-3.5 py-2 rounded-sm text-[9px] uppercase tracking-widest font-black bg-art-gold hover:bg-white text-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_2px_12px_rgba(197,160,89,0.3)]"
                  title={`${inquiriesSocialCount} verified buyer inquiries on ${project.name}`}
                >
                  <span>Inquire Now</span>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-mono font-bold bg-black text-art-gold rounded-full border border-black/20 shadow-sm">
                    {inquiriesSocialCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};


const ProjectCardSkeleton = () => {
  return (
    <div className="group relative flex flex-col bg-white/[0.01] border border-white/[0.05] overflow-hidden rounded-sm">
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="bg-white/10 h-6 w-3/4 rounded-sm shimmer-bg" />
        <div className="bg-white/[0.04] h-16 w-full rounded-sm shimmer-bg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.03] h-12 rounded-sm shimmer-bg" />
          <div className="bg-white/[0.03] h-12 rounded-sm shimmer-bg" />
          <div className="bg-white/[0.03] h-12 rounded-sm shimmer-bg" />
          <div className="bg-white/[0.03] h-12 rounded-sm shimmer-bg" />
        </div>
        <div className="bg-art-gold/20 h-10 w-full rounded-sm shimmer-bg" />
      </div>
    </div>
  );
};

const DownloadBrochureModal = ({
  project,
  allProjects,
  onClose
}: {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    interestedProjects: project?.name || '',
    preferredLocation: project?.location ? `${project.location} (${project.zone === 'Bangalore East' ? 'East Bangalore' : project.zone})` : 'East Bangalore'
  });
  const [mobileError, setMobileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    mobile: string;
    smsMessage: string;
  } | null>(null);

  useEffect(() => {
    if (project) {
      setFormData(prev => ({
        ...prev,
        interestedProjects: project.name,
        preferredLocation: project.location
          ? `${project.location} (${project.zone === 'Bangalore East' ? 'East Bangalore' : project.zone})`
          : 'East Bangalore'
      }));
      setMobileError('');
      setSubmittedData(null);
    }
  }, [project]);

  if (!project) return null;

  const generateBrochureSummaryFile = (proj: Project, customerName: string) => {
    const content = [
      `====================================================================`,
      `BS HOMEZ - ARTISANAL PORTRAITS OFFICIAL FACT SHEET & BROCHURE`,
      `====================================================================`,
      `Prepared Exclusively For: ${customerName}`,
      `Date: ${new Date().toLocaleDateString('en-IN')}`,
      ``,
      `PROJECT OVERVIEW`,
      `--------------------------------------------------------------------`,
      `Project Name           : ${proj.name}`,
      `Developer / Builder    : ${proj.builderName || 'Verified Premier Builder'} (Category ${proj.builderCategory || 'A'})`,
      `Portfolio Category     : ${proj.type === 'Primary Sale' ? 'Primary' : proj.type}`,
      `Property Type          : ${proj.propertyType === 'Flat' ? 'Apartment' : proj.propertyType}`,
      `Corridor / Zone        : ${proj.zone === 'Bangalore East' ? 'East Bangalore' : proj.zone}`,
      `Present Status         : ${proj.handoverStatus || 'Active'}`,
      `RERA Registration No.  : ${proj.reraNumber || 'PRM/KA/RERA/1251/446'}`,
      `Approval Body          : ${proj.approvalBody || 'BBMP / BDA / BMRDA & RERA'}`,
      `Hand Over Date         : ${proj.handoverDate || proj.handoverStatus || 'Scheduled'}`,
      `Indicative Value       : ${proj.price}`,
      `Configurations         : ${(proj.configuration || []).join(', ') || 'Luxury Residences'}`,
      ``,
      `FLOOR PLAN & ARCHITECTURAL SPECIFICATIONS`,
      `--------------------------------------------------------------------`,
      `Floor Plan & SBA       : ${proj.floorPlan || 'Vaastu Compliant Luxury Layouts'}`,
      `Project Size           : ${proj.projectSize || '12.5 Acres'}`,
      `No. Of Towers / Units  : ${proj.noOfTowers || '6 Towers'}`,
      `No. of Flats per Floor : ${proj.flatsPerFloor || '4 Residences per Floor'}`,
      `No. of Floors Height   : ${proj.floorsHeight || 'G + 28 Floors'}`,
      ``,
      `PROJECT WRITEUP`,
      `--------------------------------------------------------------------`,
      `${proj.description}`,
      ``,
      `CURATED AMENITIES`,
      `--------------------------------------------------------------------`,
      `${(proj.features || []).join(' | ')}`,
      ``,
      `LOCATION & CONNECTIVITY`,
      `--------------------------------------------------------------------`,
      `Micro-Location         : ${proj.location}`,
      `Landmark               : ${proj.locationTarget || 'Prime IT Corridor'}`,
      `Google Maps            : https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(proj.name + ' ' + proj.location + ' Bangalore')}`,
      ``,
      `====================================================================`,
      `Welcome message from BS Homez: In 24Hrs our team member will keep in touch with you.`,
      `Direct Advisory Desk: +91 91081 87205 | www.bshomez.co.in`,
      `====================================================================`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${proj.name.replace(/\s+/g, '_')}_BS_Homez_Brochure.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMobileError('');

    const digitsOnly = formData.mobile.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const enquiryPayload: Enquiry = {
        projectId: project.id || 'brochure_download',
        projectName: project.name,
        customerName: formData.name.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: digitsOnly,
        interestedProjects: formData.interestedProjects.trim(),
        preferredLocation: formData.preferredLocation.trim(),
        message: `Brochure Download Request | Interested Projects: ${formData.interestedProjects} | Preferred Location: ${formData.preferredLocation}`,
        type: 'Download Brochure',
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'enquiries'), enquiryPayload);

      let smsMessage = `Welcome to BS Homez, ${formData.name.trim()}! Thank you for your interest in ${formData.interestedProjects}. In 24Hrs our team member will keep in touch with you.`;
      try {
        const res = await fetch('/api/sms/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            mobile: digitsOnly,
            interestedProjects: formData.interestedProjects.trim(),
            preferredLocation: formData.preferredLocation.trim()
          })
        });
        const smsJson = await res.json();
        if (smsJson.message) {
          smsMessage = smsJson.message;
        }
      } catch (smsErr) {
        console.warn('SMS Gateway fallback used:', smsErr);
      }

      generateBrochureSummaryFile(project, formData.name.trim());

      setSubmittedData({
        name: formData.name.trim(),
        mobile: digitsOnly,
        smsMessage
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'enquiries');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-art-dark w-full max-w-xl border border-art-gold/30 rounded-sm shadow-2xl p-6 sm:p-10 overflow-y-auto max-h-[92vh] my-auto z-20 font-sans"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {submittedData ? (
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-emerald-400" size={34} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-art-gold font-black block mb-2">
                Brochure Dispatched & SMS Sent
              </span>
              <h3 className="text-3xl font-serif italic text-white">
                Welcome to BS Homez
              </h3>
              <p className="text-xs text-white/70 mt-3 max-w-md mx-auto leading-relaxed">
                In <strong className="text-art-gold">24Hrs</strong> our team member will keep in touch with you.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-art-gold/25 rounded-sm p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[9px] uppercase tracking-widest text-art-gold font-black flex items-center gap-1.5">
                  <Phone size={11} /> Text Message Dispatched to +91 {submittedData.mobile}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">Delivered</span>
              </div>
              <p className="text-xs text-white/85 font-mono leading-relaxed">
                "{submittedData.smsMessage}"
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-art-gold hover:bg-white text-black py-3.5 px-4 rounded-sm text-[10px] uppercase tracking-widest font-black transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-5 border-b border-white/10">
              <span className="text-art-gold uppercase tracking-[0.35em] text-[9px] mb-2 block font-black">
                Project Dossier & Brochure Download
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white italic">
                Download {project.name}
              </h3>
              <p className="text-xs text-white/50 mt-1.5">
                Complete your details below to download the project dossier and receive an instant welcome text message from BS Homez.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block text-white/60 font-bold">
                  Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-white/5 border border-white/15 rounded-sm p-3.5 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/25"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block text-white/60 font-bold">
                  Mobile Number (10 Digits) *
                </label>
                <div className="flex">
                  <span className="bg-white/10 border border-r-0 border-white/15 px-3.5 flex items-center text-xs text-art-gold font-mono font-bold rounded-l-sm">
                    +91
                  </span>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, mobile: val });
                      if (val.length === 10) setMobileError('');
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full bg-white/5 border border-white/15 rounded-r-sm p-3.5 text-white text-xs font-mono focus:border-art-gold outline-none transition-all placeholder:text-white/25"
                  />
                </div>
                {mobileError && (
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-1.5">
                    {mobileError}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block text-white/60 font-bold">
                  Email ID *
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-white/5 border border-white/15 rounded-sm p-3.5 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/25"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block text-white/60 font-bold">
                  Interested Projects *
                </label>
                <input
                  required
                  type="text"
                  list="bs-homez-projects-list"
                  value={formData.interestedProjects}
                  onChange={e => setFormData({ ...formData, interestedProjects: e.target.value })}
                  placeholder="Select or enter interested project(s)"
                  className="w-full bg-white/5 border border-white/15 rounded-sm p-3.5 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/25"
                />
                <datalist id="bs-homez-projects-list">
                  {allProjects.map(p => (
                    <option key={p.id || p.name} value={p.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block text-white/60 font-bold">
                  Preferred Location *
                </label>
                <input
                  required
                  type="text"
                  list="bs-homez-locations-list"
                  value={formData.preferredLocation}
                  onChange={e => setFormData({ ...formData, preferredLocation: e.target.value })}
                  placeholder="e.g., East Bangalore, Off Sarjapur Road, Sarjapur, Electronic City, Marathalli, Bellandur"
                  className="w-full bg-white/5 border border-white/15 rounded-sm p-3.5 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/25"
                />
                <datalist id="bs-homez-locations-list">
                  <option value="Whitefield, East Bangalore" />
                  <option value="Off Sarjapur Road, Bangalore" />
                  <option value="Sarjapur Main Road, Bangalore" />
                  <option value="Electronic City Phase 1 & 2, Bangalore" />
                  <option value="Marathalli, Outer Ring Road, Bangalore" />
                  <option value="Bellandur, EcoSpace Corridor, Bangalore" />
                </datalist>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-art-gold hover:bg-white text-black py-4 rounded-sm uppercase tracking-[0.25em] text-[11px] font-black transition-all disabled:opacity-50 mt-2 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Validating & Dispatching...
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Submit & Download Brochure
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ProjectGrid = ({ 
  projects, 
  isAdmin = false,
  hiddenCount = 0,
  showHidden = false,
  onToggleShowHidden,
  comparedProjectIds = [],
  onToggleCompare,
  onOpenCompareModal,
  onEnquire, 
  onDownload,
  onSaveProject,
  onDeleteProject,
  onTogglePause,
  onOpenNewProjectModal,
  isLoading 
}: { 
  projects: Project[]; 
  isAdmin?: boolean;
  hiddenCount?: number;
  showHidden?: boolean;
  onToggleShowHidden?: () => void;
  comparedProjectIds?: string[];
  onToggleCompare?: (p: Project) => void;
  onOpenCompareModal?: () => void;
  onEnquire: (p: Project) => void; 
  onDownload: (p: Project) => void;
  onSaveProject: (updated: Project) => Promise<void>;
  onDeleteProject: (p: Project) => Promise<void>;
  onTogglePause: (p: Project) => Promise<void>;
  onOpenNewProjectModal: () => void;
  isLoading?: boolean;
}) => {
  const [selectedType, setSelectedType] = useState<'All' | 'Primary' | 'Resale' | 'Rental'>('All');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All');
  const [selectedBuilderCat, setSelectedBuilderCat] = useState<'All' | 'A+' | 'A' | 'B' | 'C'>('All');
  const [selectedPropType, setSelectedPropType] = useState<'All' | 'Apartment' | 'Villa' | 'Plot'>('All');
  const [selectedHeaderStatus, setSelectedHeaderStatus] = useState<'All' | 'EOI' | 'Under Construction' | 'Ready to Move' | 'Handed Over'>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const quickProjectTags = [
    { id: 'All', label: 'All Attributes' },
    { id: 'Vastu-Compliant', label: 'Vastu-Compliant' },
    { id: 'Corner Units', label: 'Corner Units' },
    { id: 'Sea-view', label: 'Sea-view / Lakefront' },
    { id: 'Penthouse', label: 'Penthouse / Duplex' },
    { id: 'Gated Community', label: 'Gated Community' },
    { id: 'High ROI', label: 'High ROI' }
  ];

  const portfolioTypes: Array<'All' | 'Primary' | 'Resale' | 'Rental'> = ['All', 'Primary', 'Resale', 'Rental'];
  const corridors: Array<string> = [
    'All',
    'Whitefield',
    'Hoskote',
    'Varthur',
    'Gunjur',
    'Hosa Road',
    'Kasavanahalli',
    'East Bangalore',
    'Off Sarjapur Road',
    'Sarjapur',
    'Electronic City',
    'Marathalli',
    'Bellandur'
  ];
  const builderCategories: Array<'All' | 'A+' | 'A' | 'B' | 'C'> = ['All', 'A+', 'A', 'B', 'C'];
  const propertyTypesList: Array<'All' | 'Apartment' | 'Villa' | 'Plot'> = ['All', 'Apartment', 'Villa', 'Plot'];
  const statusHeaders: Array<{ key: 'All' | 'EOI' | 'Under Construction' | 'Ready to Move' | 'Handed Over'; label: string }> = [
    { key: 'All', label: 'All Phases' },
    { key: 'EOI', label: 'EOI' },
    { key: 'Under Construction', label: 'Under .Construction' },
    { key: 'Ready to Move', label: 'Ready To Move' },
    { key: 'Handed Over', label: 'Handed Over' }
  ];

  const displayedProjects = projects.filter(p => {
    if (LEGACY_PROJECT_NAMES.includes(p.name)) return false;
    if (p.isDeleted) return false;
    if (!(isAdmin && showHidden) && p.isPaused) return false;

    const normalizedType = p.type === 'Primary Sale' ? 'Primary' : p.type;
    if (selectedType !== 'All' && normalizedType !== selectedType) return false;

    const normalizedZone = p.zone === 'Bangalore East' ? 'East Bangalore' : p.zone;
    if (selectedCorridor !== 'All') {
      const corridorLower = selectedCorridor.toLowerCase();
      const matchesZone = normalizedZone.toLowerCase() === corridorLower;
      const matchesLocation = p.location.toLowerCase().includes(corridorLower);
      const matchesEastGroup =
        selectedCorridor === 'East Bangalore' &&
        ['East Bangalore', 'Whitefield', 'Hoskote', 'Varthur', 'Gunjur', 'Marathalli'].includes(normalizedZone);
      if (!matchesZone && !matchesLocation && !matchesEastGroup) {
        return false;
      }
    }

    if (selectedBuilderCat !== 'All' && p.builderCategory !== selectedBuilderCat) return false;

    const normalizedPropType = p.propertyType === 'Flat' ? 'Apartment' : p.propertyType;
    if (selectedPropType !== 'All' && normalizedPropType !== selectedPropType) return false;

    if (selectedHeaderStatus !== 'All' && p.handoverStatus !== selectedHeaderStatus) return false;

    if (selectedTag !== 'All') {
      const tagLower = selectedTag.toLowerCase();
      const hasTag = (p.features && p.features.some(f => f.toLowerCase().includes(tagLower))) ||
        p.description?.toLowerCase().includes(tagLower) ||
        (tagLower === 'sea-view' && (p.description?.toLowerCase().includes('lake') || p.description?.toLowerCase().includes('water') || p.description?.toLowerCase().includes('sea') || p.name.toLowerCase().includes('lake') || p.features?.some(f => f.toLowerCase().includes('lake') || f.toLowerCase().includes('water')))) ||
        (tagLower === 'corner units' && (p.description?.toLowerCase().includes('corner') || p.features?.some(f => f.toLowerCase().includes('corner')))) ||
        (tagLower === 'vastu-compliant' && (p.description?.toLowerCase().includes('vastu') || p.description?.toLowerCase().includes('vaastu') || p.features?.some(f => f.toLowerCase().includes('vastu')))) ||
        (tagLower === 'penthouse' && (p.configuration?.some(c => c.toLowerCase().includes('4') || c.toLowerCase().includes('5') || c.toLowerCase().includes('penthouse')) || p.description?.toLowerCase().includes('penthouse'))) ||
        (tagLower === 'high roi' && (p.description?.toLowerCase().includes('roi') || p.features?.some(f => f.toLowerCase().includes('roi')) || p.segment?.toLowerCase().includes('luxury')));
      if (!hasTag) return false;
    }

    return true;
  });

  const [activeFilterTab, setActiveFilterTab] = useState<'portfolio' | 'corridor' | 'builder' | 'asset' | 'status'>('portfolio');

  const activeFiltersCount = [
    selectedType !== 'All',
    selectedCorridor !== 'All',
    selectedBuilderCat !== 'All',
    selectedPropType !== 'All',
    selectedHeaderStatus !== 'All',
    selectedTag !== 'All'
  ].filter(Boolean).length;

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-art-dark relative">
      <div className="absolute left-12 top-0 w-px h-full bg-white/5 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 mb-10 sm:mb-14">
          <div>
            <span className="text-art-gold text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] font-black block mb-4 sm:mb-6">Archive / Portfolios</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white tracking-tight italic whitespace-nowrap">
              Artisanal <span className="not-italic text-art-gold">Portraits.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:items-end gap-4 pb-4 sm:pb-6 border-b border-art-gold/20">
            <p className="text-white/60 uppercase tracking-[0.18em] sm:tracking-[0.22em] font-bold text-xs text-right">
              Whitefield · Hoskote · Varthur · Gunjur · Hosa Road · Kasavanahalli · Sarjapur · Electronic City · Marathalli · Bellandur
            </p>
            {isAdmin && (
              <div className="flex flex-wrap items-center gap-3">
                {onToggleShowHidden && (
                  <button
                    type="button"
                    onClick={onToggleShowHidden}
                    className={cn(
                      "px-4 py-3.5 rounded-sm text-[10px] uppercase tracking-[0.2em] font-black border transition-all cursor-pointer",
                      showHidden
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-white/5 text-white/60 border-white/15 hover:text-white"
                    )}
                  >
                    {showHidden ? `Hide Hidden (${hiddenCount})` : `Show Hidden Projects (${hiddenCount})`}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenNewProjectModal}
                  className="bg-art-gold hover:bg-white text-black px-6 py-3.5 rounded-sm text-[10px] uppercase tracking-[0.25em] font-black transition-all shadow-[0_0_25px_rgba(197,160,89,0.3)] flex items-center gap-2 cursor-pointer w-max"
                >
                  <Sparkles size={14} />
                  + Add New Project (Auto-Check Online)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick-Filter Tag Bar under #projects */}
        <div className="mb-6 p-4 sm:p-5 bg-black/60 border border-white/10 rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-art-gold" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-art-gold font-bold">
                Quick-Filter Portfolio Attributes (Sea-view · Corner Units · Vastu-Compliant · Penthouses)
              </span>
            </div>
            {selectedTag !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedTag('All')}
                className="text-[9px] uppercase tracking-widest text-white/50 hover:text-art-gold transition-colors font-mono cursor-pointer self-start sm:self-auto"
              >
                Clear Attribute Filter (✕ {selectedTag})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickProjectTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.id)}
                className={cn(
                  "px-3.5 py-2 text-[10px] uppercase tracking-wider font-mono font-bold rounded-sm border transition-all cursor-pointer whitespace-nowrap",
                  selectedTag === tag.id
                    ? "bg-art-gold text-black border-art-gold shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-[1.02]"
                    : "bg-white/[0.03] text-white/70 border-white/10 hover:border-art-gold/50 hover:text-white"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dedicated Filter Category Tabs (Separate Tabs - Not Stacked Scrolling) */}
        <div className="mb-8 bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden">
          {/* Tab Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/40 p-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'portfolio', label: `01. Portfolio Type (${selectedType})` },
                { id: 'corridor', label: `02. Location Corridor (${selectedCorridor})` },
                { id: 'builder', label: `03. Builder Cat (${selectedBuilderCat === 'All' ? 'All' : `Cat ${selectedBuilderCat}`})` },
                { id: 'asset', label: `04. Property Type (${selectedPropType === 'All' ? 'All' : selectedPropType === 'Plot' ? 'Plots' : selectedPropType === 'Apartment' ? 'Apartments' : 'Villas'})` },
                { id: 'status', label: `05. Present Status (${selectedHeaderStatus})` }
              ].map((tabItem) => (
                <button
                  key={tabItem.id}
                  type="button"
                  onClick={() => setActiveFilterTab(tabItem.id as any)}
                  className={cn(
                    "px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] font-black rounded-sm transition-all cursor-pointer whitespace-nowrap border",
                    activeFilterTab === tabItem.id
                      ? "bg-art-gold text-black border-art-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                      : "bg-white/[0.03] text-white/60 border-white/10 hover:text-white hover:border-white/25"
                  )}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {onOpenCompareModal && (
                <button
                  type="button"
                  onClick={onOpenCompareModal}
                  className={cn(
                    "px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] font-black rounded-sm transition-all cursor-pointer flex items-center gap-1.5 border",
                    comparedProjectIds.length > 0
                      ? "bg-art-gold text-black border-art-gold shadow-[0_0_15px_rgba(197,160,89,0.3)] animate-pulse"
                      : "bg-white/[0.04] text-white/70 hover:text-white border-white/10 hover:border-white/20"
                  )}
                  title="Open side-by-side comparison matrix"
                >
                  <ArrowLeftRight size={12} className={comparedProjectIds.length > 0 ? "text-black" : "text-art-gold"} />
                  <span>Compare ({comparedProjectIds.length}/3)</span>
                </button>
              )}

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('All');
                    setSelectedCorridor('All');
                    setSelectedBuilderCat('All');
                    setSelectedPropType('All');
                    setSelectedHeaderStatus('All');
                    setSelectedTag('All');
                  }}
                  className="px-3.5 py-2 text-[9px] uppercase tracking-widest font-black text-art-gold hover:text-white border border-art-gold/30 rounded-sm cursor-pointer"
                >
                  Reset All ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Tab Content Panel */}
          <div className="p-5 sm:p-6">
            {activeFilterTab === 'portfolio' && (
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black block mb-3">
                  Select Portfolio Category (All · Primary · Resale · Rental)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {portfolioTypes.map(typeItem => (
                    <button
                      key={typeItem}
                      type="button"
                      onClick={() => setSelectedType(typeItem)}
                      className={cn(
                        "px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-black rounded-sm transition-all cursor-pointer whitespace-nowrap border",
                        selectedType === typeItem
                          ? "bg-art-gold text-black border-art-gold shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/30"
                      )}
                    >
                      {typeItem === 'All' ? 'All Portfolios' : typeItem}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterTab === 'corridor' && (
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black block mb-3">
                  Select Micro-Market Corridor
                </span>
                <div className="flex flex-wrap gap-2">
                  {corridors.map(corridor => (
                    <button
                      key={corridor}
                      type="button"
                      onClick={() => setSelectedCorridor(corridor)}
                      className={cn(
                        "px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] font-black rounded-sm border transition-all cursor-pointer whitespace-nowrap",
                        selectedCorridor === corridor
                          ? "bg-art-gold text-black border-art-gold shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/30"
                      )}
                    >
                      {corridor === 'All' ? 'All Corridors' : corridor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterTab === 'builder' && (
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black block mb-3">
                  Select Builder Tier (Cat A+ · Cat A · Cat B · Cat C)
                </span>
                <div className="flex flex-wrap gap-2">
                  {builderCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedBuilderCat(cat)}
                      className={cn(
                        "px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] font-black rounded-sm border transition-all cursor-pointer whitespace-nowrap",
                        selectedBuilderCat === cat
                          ? "bg-art-gold text-black border-art-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/30"
                      )}
                    >
                      {cat === 'All' ? 'All Builders' : `Category ${cat} Builders`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterTab === 'asset' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black">
                    Select Property Asset Type (Apartments · Villas · Plots)
                  </span>
                  {selectedPropType === 'Plot' && (
                    <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-sm border border-emerald-500/30">
                      Plotted Land &amp; Villa Plots Active
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {propertyTypesList.map(pt => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setSelectedPropType(pt)}
                      className={cn(
                        "px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] font-black rounded-sm border transition-all cursor-pointer whitespace-nowrap",
                        selectedPropType === pt
                          ? "bg-art-gold text-black border-art-gold shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/30"
                      )}
                    >
                      {pt === 'All' ? 'All Asset Types' : pt === 'Plot' ? 'Plots (Villa Plots & Plotted Land)' : pt === 'Apartment' ? 'Apartments' : 'Villas'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilterTab === 'status' && (
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black block mb-3">
                  Select Present Handover Status (EOI · Under .Construction · Ready To Move · Handed Over)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {statusHeaders.map(header => (
                    <button
                      key={header.key}
                      type="button"
                      onClick={() => setSelectedHeaderStatus(header.key)}
                      className={cn(
                        "py-3 px-4 text-[10px] uppercase tracking-[0.18em] font-black rounded-sm border transition-all cursor-pointer text-center whitespace-nowrap",
                        selectedHeaderStatus === header.key
                          ? "bg-art-gold text-black border-art-gold shadow-[0_0_15px_rgba(197,160,89,0.25)]"
                          : "bg-black/40 text-white/60 border-white/10 hover:text-white hover:border-white/25"
                      )}
                    >
                      {header.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Portfolio Commission Banners for Primary, Resale & Rental */}
        <AnimatePresence mode="wait">
          {selectedType === 'Resale' && (
            <motion.div
              key="resale-commission-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-art-gold/20 via-art-gold/10 to-transparent border border-art-gold/50 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-art-gold text-black flex items-center justify-center shrink-0 font-serif italic text-xl font-black">
                  2%
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-art-gold font-black block mb-1">
                    Resale Advisory Mandate • Transparent Brokerage Terms
                  </span>
                  <h4 className="text-lg sm:text-2xl font-serif italic text-white">
                    2% Commission on Successful Sale
                  </h4>
                  <p className="text-[11px] text-white/65 mt-0.5 font-sans">
                    End-to-end title verification, Khata transfer, legal documentation, and direct owner-to-buyer closure support. **
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-art-gold text-black text-[9px] uppercase tracking-[0.25em] font-black rounded-sm self-start sm:self-center whitespace-nowrap">
                2% On Successful Sale
              </span>
            </motion.div>
          )}

          {selectedType === 'Rental' && (
            <motion.div
              key="rental-commission-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-emerald-500/20 via-art-gold/10 to-transparent border border-art-gold/50 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
            >
              <div className="flex items-center gap-4">
                <div className="px-3.5 h-12 rounded-sm bg-art-gold text-black flex items-center justify-center shrink-0 font-serif italic text-base font-black whitespace-nowrap">
                  1 Month
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-art-gold font-black block mb-1">
                    Executive Rental & Leasing Desk • Transparent Fee Structure
                  </span>
                  <h4 className="text-lg sm:text-2xl font-serif italic text-white">
                    1 Month Rent as Commission
                  </h4>
                  <p className="text-[11px] text-white/65 mt-0.5 font-sans">
                    Includes tenant background verification, rental agreement drafting
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-art-gold text-black text-[9px] uppercase tracking-[0.25em] font-black rounded-sm self-start sm:self-center whitespace-nowrap">
                1 Month Rent A Commission
              </span>
            </motion.div>
          )}

          {selectedType === 'Primary' && (
            <motion.div
              key="primary-commission-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 p-4 sm:p-5 bg-white/[0.02] border border-art-gold/30 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-art-gold text-black font-serif italic font-black text-sm rounded-sm">0% Fee</span>
                <div>
                  <h4 className="text-sm sm:text-base font-serif italic text-white">
                    0% Brokerage Fee on All Primary Builder Acquisitions
                  </h4>
                  <p className="text-[10px] text-white/50">
                    Direct developer inventory with verified RERA compliance, transparent pricing, and 0% buyer brokerage.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedPropType === 'Plot' && (
            <motion.div
              key="plots-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 p-4 sm:p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-emerald-500 text-black font-mono font-black text-xs uppercase tracking-widest rounded-sm">
                  Villa Plots
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-serif italic text-white">
                    Curated Plotted Townships &amp; Villa Plots in Bangalore
                  </h4>
                  <p className="text-[10px] text-white/70">
                    BDA, BMRDA, BIAPA &amp; STRR approved A-Khata plots across Whitefield, Hoskote, Sarjapur, Varthur &amp; Electronic City with complete infrastructural verification.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={`skeleton-${i}`} />
            ))
          ) : displayedProjects.length === 0 ? (
            <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 border border-dashed border-white/10 rounded-sm bg-white/[0.01] space-y-4">
              <span className="text-art-gold uppercase tracking-[0.4em] text-[10px] block">Advisory Archive</span>
              <p className="text-white/60 font-serif italic text-xl">No matching portraits in this specific filter combination.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('All');
                  setSelectedCorridor('All');
                  setSelectedBuilderCat('All');
                  setSelectedPropType('All');
                  setSelectedHeaderStatus('All');
                }}
                className="px-6 py-2.5 bg-art-gold text-black text-[10px] uppercase tracking-widest font-black rounded-sm cursor-pointer"
              >
                Reset Portrait Filters
              </button>
            </div>
          ) : (
            displayedProjects.map((project) => (
              <ProjectCard 
                key={project.id || project.name} 
                project={project} 
                isAdmin={isAdmin}
                isCompared={comparedProjectIds.includes(project.id || '') || comparedProjectIds.includes(project.name)}
                comparedCount={comparedProjectIds.length}
                onToggleCompare={onToggleCompare}
                onEnquire={onEnquire} 
                onDownload={onDownload}
                onSaveProject={onSaveProject}
                onDeleteProject={onDeleteProject}
                onTogglePause={onTogglePause}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const EnquiryModal = ({ 
  project, 
  onClose,
  enquiryType = 'Acquire'
}: { 
  project: Project | null; 
  onClose: () => void;
  enquiryType?: 'Acquire' | 'Consult' | 'Inquire';
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContactTime: 'Morning (9:00 AM - 12:00 PM)',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getTitle = () => {
    switch (enquiryType) {
      case 'Consult':
        return 'Private Advisory Session';
      case 'Inquire':
        return 'General Portfolio Inquiry';
      case 'Acquire':
      default:
        return project ? `Acquire ${project.name}` : 'Priority Access Request';
    }
  };

  const getSubTitle = () => {
    switch (enquiryType) {
      case 'Consult':
        return 'Bespoke Portfolio Advisory Desk';
      case 'Inquire':
        return 'Direct Intelligence Group';
      case 'Acquire':
      default:
        return 'Exclusively Verified Direct Inventory';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    try {
      const enquiry: Enquiry = {
        projectId: project.id || 'unknown',
        projectName: project.name,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        preferredContactTime: formData.preferredContactTime,
        message: formData.message || `No custom requirements filed for type: ${enquiryType}`,
        type: 'Form',
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, 'enquiries'), enquiry);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, 'enquiries');
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-art-dark w-full max-w-2xl border border-white/10 rounded-sm shadow-2xl p-6 sm:p-8 md:p-12 overflow-y-auto max-h-[90vh] my-auto z-20"
      >
        {success ? (
          <div className="py-12 text-center">
            <div className="w-24 h-24 bg-art-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-art-gold" size={48} />
            </div>
            <h3 className="text-4xl font-serif mb-4 italic text-white">Transmission Recorded</h3>
            <p className="text-white/50 tracking-widest uppercase text-[10px]">A dedicated Relationship Advisor will contact you during your preferred time window.</p>
          </div>
        ) : (
          <>
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 transition-colors text-white/50 hover:text-white z-30">
              <X size={20} />
            </button>

            <div className="font-sans">
              <div className="mb-8 pb-5 border-b border-white/10">
                <span className="text-art-gold uppercase tracking-[0.4em] text-[10px] mb-2 block font-bold">{getSubTitle()}</span>
                <p className="text-md text-white/60 font-mono text-xs uppercase mb-1">Connecting with respect to:</p>
                <h3 className="text-2xl sm:text-3xl font-serif text-white italic">{getTitle()}</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Individual Identity *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20 text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Contact Phone Number *</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20 text-sm"
                      placeholder="+91 Mobile Number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Email Communication *</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20 text-sm"
                      placeholder="name@domain.com"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-art-gold font-bold">Preferred Contact Time *</label>
                    <select 
                      value={formData.preferredContactTime}
                      onChange={e => setFormData({...formData, preferredContactTime: e.target.value})}
                      className="w-full bg-[#151515] border border-white/15 focus:border-art-gold rounded-sm p-4 text-white outline-none transition-all text-xs font-mono"
                    >
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM – 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM – 8:00 PM)</option>
                      <option value="Weekend Anytime">Weekend Anytime</option>
                      <option value="Immediate / Urgent (Next 30 mins)">Immediate / Urgent (Next 30 mins)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Optional Notes / Particulars</label>
                  <textarea 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20 text-sm h-24 resize-none"
                    placeholder="Describe specific preferences (e.g. configurations, budget, timeline, floor choices)..."
                  />
                </div>

                <button 
                  disabled={submitting}
                  className="w-full bg-art-gold text-black py-4.5 rounded-sm uppercase tracking-[0.3em] text-[11px] font-black hover:bg-white transition-all disabled:opacity-50 mt-2 shadow-xl cursor-pointer"
                >
                  {submitting ? 'RECORDING INQUIRY...' : 'SUBMIT SECURED INQUIRY'}
                </button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const FileDropzone = ({ 
  label, 
  onUpload, 
  accept = "image/*", 
  previewUrl, 
  type = "image" 
}: { 
  label: string; 
  onUpload: (url: string) => void; 
  accept?: string; 
  previewUrl?: string;
  type?: "image" | "video";
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          // High compression to keep Base64 within Firestore limits
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (type === 'image') {
        const compressed = await compressImage(file);
        // Base64 approximation check
        const base64Size = compressed.length * 0.75;
        if (base64Size > 900 * 1024) {
          setError("Even after compression, this image is too large for database storage.");
          setIsUploading(false);
          return;
        }
        onUpload(compressed);
        setProgress(100);
      } else {
        // Video compression in browser is too heavy, just check size and show progress
        if (file.size > 800 * 1024) {
          setError("Video must be under 800KB for direct upload. Please use an external URL for larger videos.");
          setIsUploading(false);
          return;
        }

        const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        reader.onloadend = () => {
          onUpload(reader.result as string);
          setProgress(100);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setError("Asset processing failed.");
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={cn(
        "relative border-2 border-dashed rounded-sm transition-all group overflow-hidden",
        isDragging ? "border-art-gold bg-art-gold/5" : "border-white/10 bg-white/5 hover:border-white/20",
        error ? "border-red-500 bg-red-500/5" : "",
        previewUrl ? "aspect-[4/5] md:aspect-video" : "py-10"
      )}
    >
      {isUploading ? (
        <div className="absolute inset-0 bg-art-dark/90 z-50 flex flex-col items-center justify-center p-6">
           <Loader2 className="text-art-gold animate-spin mb-4" size={32} />
           <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="bg-art-gold h-full"
             />
           </div>
           <span className="text-[10px] uppercase font-bold tracking-widest text-art-gold">{progress}% Processing</span>
        </div>
      ) : previewUrl ? (
        <div className="absolute inset-0 group">
          {type === 'video' ? (
            <video src={previewUrl} className="w-full h-full object-cover" muted loop autoPlay />
          ) : (
            <img src={previewUrl} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-center">
              <Upload className="text-white mx-auto mb-2" size={24} />
              <span className="text-[10px] text-white uppercase font-bold tracking-widest">Replace Asset</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center px-6">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            {type === 'video' ? <VideoIcon size={20} className="text-art-gold" /> : <Upload size={20} className="text-art-gold" />}
          </div>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-1">{label}</p>
          <p className="text-[8px] text-white/20 uppercase tracking-widest">Drag & Drop or Click (Auto-Compress)</p>
          {error && <p className="mt-2 text-[9px] text-red-500 uppercase font-bold leading-tight">{error}</p>}
        </div>
      )}
      {!isUploading && (
        <input 
          type="file" 
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      )}
    </div>
  );
};

const ProjectForm = ({
  project,
  onClose,
  onProjectSaved
}: {
  project?: Project | null;
  onClose: () => void;
  onProjectSaved?: (savedProject: Project) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: project?.name || '',
    description: project?.description || '',
    price: project?.price || '',
    lastPrice: project?.lastPrice || project?.price || '',
    location: project?.location || '',
    locationTarget: project?.locationTarget || '',
    zone: project?.zone || 'Whitefield',
    type: project?.type || 'Primary',
    propertyType: project?.propertyType === 'Flat' ? 'Apartment' : (project?.propertyType || 'Apartment'),
    builderCategory: project?.builderCategory || 'A',
    builderName: project?.builderName || '',
    approvalBody: project?.approvalBody || 'BBMP / BDA & RERA Approved',
    floorPlan: project?.floorPlan || '',
    configuration: project?.configuration && project.configuration.length > 0 ? project.configuration : ['2 BHK', '3 BHK'],
    segment: project?.segment || 'Luxury',
    handoverStatus: project?.handoverStatus || 'Under Construction',
    reraNumber: project?.reraNumber || '',
    handoverDate: project?.handoverDate || '',
    projectSize: project?.projectSize || '',
    noOfTowers: project?.noOfTowers || '',
    flatsPerFloor: project?.flatsPerFloor || '',
    floorsHeight: project?.floorsHeight || '',
    mapUrl: project?.mapUrl || '',
    paymentOffers: project?.paymentOffers || '',
    imageUrls:
      project?.imageUrls && project.imageUrls.filter(Boolean).length > 0
        ? project.imageUrls
        : getSmartProjectImages(project?.zone || 'Whitefield', project?.type || 'Primary', project?.builderCategory || 'A', project?.propertyType || 'Apartment'),
    mobileImageUrl: project?.mobileImageUrl || '',
    videoUrl: project?.videoUrl || '',
    mobileVideoUrl: project?.mobileVideoUrl || '',
    features: project?.features && project.features.filter(Boolean).length > 0 ? project.features : ['Grand Clubhouse', 'Swimming Pool', '24/7 Security'],
    isPaused: project?.isPaused || false
  });
  const [submitting, setSubmitting] = useState(false);
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const [autoCheckBanner, setAutoCheckBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAutoCheckOnline = async (customName?: string) => {
    const targetName = (customName ?? formData.name ?? '').trim();
    if (!targetName) {
      setError('Please enter a Project Name first to auto-check online details.');
      return null;
    }
    setIsAutoChecking(true);
    setError(null);
    setAutoCheckBanner(null);

    try {
      const res = await fetch('/api/projects/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: targetName,
          corridorHint: formData.zone,
          portfolioTypeHint: formData.type === 'Primary Sale' ? 'Primary' : formData.type
        })
      });
      const json = await res.json();
      if (json?.project) {
        const fetched = json.project;
        const previousPrice = formData.price || formData.lastPrice;
        let priceChanged = false;
        if (previousPrice && fetched.price) {
          const pOld = parsePrice(previousPrice);
          const pNew = parsePrice(fetched.price);
          if (pOld > 0 && Math.abs(pNew - pOld) / pOld > 0.05) {
            priceChanged = true;
          }
        }

        const resolvedZone = fetched.zone || formData.zone || 'Whitefield';
        const resolvedType = fetched.type || formData.type || 'Primary';
        const resolvedCat = fetched.builderCategory || formData.builderCategory || 'A';
        const resolvedProp = fetched.propertyType || formData.propertyType || 'Apartment';

        const merged: Partial<Project> = {
          ...formData,
          ...fetched,
          name: fetched.name || targetName,
          price: formatPriceWithCondition(fetched.price || formData.price || 'Rs. 1.65 Cr onwards*'),
          lastPrice: formatPriceWithCondition(fetched.lastPrice || fetched.price || formData.lastPrice || 'Rs. 1.65 Cr onwards*'),
          lastCheckedPrice: formatPriceWithCondition(previousPrice || fetched.lastPrice || fetched.price),
          handoverDate: fetched.handoverDate || formData.handoverDate || 'December 2027',
          priceChanged,
          imageUrls: getSmartProjectImages(resolvedZone, resolvedType, resolvedCat, resolvedProp)
        };
        setFormData(merged);
        setAutoCheckBanner(
          `Auto-synced "${merged.name}" (Cat ${resolvedCat}): Images, Last Price (${merged.lastPrice}), Handover Date (${merged.handoverDate}), RERA (${merged.reraNumber}), Approval Body (${merged.approvalBody}), Floor Plan & Nearby Connectivity updated.`
        );
        return merged;
      }
    } catch (err) {
      console.warn('Online auto-check error:', err);
      setError('Could not reach online lookup service; using local details.');
    } finally {
      setIsAutoChecking(false);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let currentData = { ...formData };

      // Automatically check online & populate Last Price, Handover Date, Writeup, Floor Plan, RERA, Approval Body if missing
      if (
        currentData.name?.trim() &&
        (!currentData.description?.trim() ||
          !currentData.price?.trim() ||
          !currentData.lastPrice?.trim() ||
          !currentData.handoverDate?.trim() ||
          !currentData.reraNumber?.trim() ||
          !currentData.floorPlan?.trim())
      ) {
        const enriched = await handleAutoCheckOnline(currentData.name);
        if (enriched) {
          currentData = {
            ...enriched,
            ...Object.fromEntries(
              Object.entries(currentData).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
            ),
            price: currentData.price?.trim() ? currentData.price : enriched.price,
            lastPrice: currentData.lastPrice?.trim() ? currentData.lastPrice : (enriched.lastPrice || enriched.price),
            handoverDate: currentData.handoverDate?.trim() ? currentData.handoverDate : enriched.handoverDate,
            description: currentData.description?.trim() ? currentData.description : enriched.description,
            reraNumber: currentData.reraNumber?.trim() ? currentData.reraNumber : enriched.reraNumber,
            approvalBody: currentData.approvalBody?.trim() ? currentData.approvalBody : enriched.approvalBody,
            floorPlan: currentData.floorPlan?.trim() ? currentData.floorPlan : enriched.floorPlan,
            location: currentData.location?.trim() ? currentData.location : enriched.location
          };
        }
      }

      const defaultHandover =
        currentData.handoverStatus === 'Ready to Move' || currentData.handoverStatus === 'Handed Over'
          ? 'Immediate Possession (OC Received)'
          : 'December 2027';

      const finalPrice = formatPriceWithCondition(currentData.price?.trim() || 'Rs. 1.75 Cr onwards*');
      const finalLastPrice = formatPriceWithCondition(currentData.lastPrice?.trim() || finalPrice);
      const finalHandoverDate = currentData.handoverDate?.trim() || defaultHandover;
      const validImages = (currentData.imageUrls || []).map(u => u.trim()).filter(Boolean);

      const data: any = {
        ...currentData,
        name: (currentData.name || 'New Artisanal Portrait').trim(),
        price: finalPrice,
        lastPrice: finalLastPrice,
        lastCheckedPrice: project?.price && project.price !== finalPrice ? formatPriceWithCondition(project.price) : finalLastPrice,
        handoverDate: finalHandoverDate,
        location: (currentData.location || `${currentData.zone || 'Whitefield'}, Bangalore`).trim(),
        locationTarget: (currentData.locationTarget || `Prime Corridor in ${currentData.zone || 'Whitefield'}`).trim(),
        zone: currentData.zone || 'Whitefield',
        type: currentData.type || 'Primary',
        propertyType: currentData.propertyType === 'Flat' ? 'Apartment' : (currentData.propertyType || 'Apartment'),
        builderCategory: currentData.builderCategory || 'A',
        builderName: (currentData.builderName || 'Verified Premier Builder').trim(),
        approvalBody: (currentData.approvalBody || 'BBMP / BDA & Karnataka RERA Approved').trim(),
        floorPlan: (currentData.floorPlan || 'Vaastu Compliant Luxury Floor Plans').trim(),
        reraNumber: (currentData.reraNumber || 'PRM/KA/RERA/1251/446/PR/Verified').trim(),
        segment: (currentData.segment || 'Luxury').trim(),
        description: (currentData.description || `${currentData.name} in ${currentData.location || currentData.zone}, featuring bespoke residences, curated lifestyle amenities, and verified RERA compliance.`).trim(),
        imageUrls: validImages.length > 0 ? validImages : getSmartProjectImages(currentData.zone, currentData.type, currentData.builderCategory, currentData.propertyType),
        features: (currentData.features || []).map(f => f.trim()).filter(Boolean),
        configuration: (currentData.configuration || []).filter(Boolean),
        isPaused: Boolean(currentData.isPaused),
        isDeleted: false,
        createdAt: project?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const localFallbackId = project?.id || `local_${Date.now()}`;
      try {
        if (project?.id && !project.id.startsWith('curated_') && !project.id.startsWith('local_')) {
          await setDoc(doc(db, 'projects', project.id), data, { merge: true });
          if (onProjectSaved) onProjectSaved({ ...data, id: project.id });
        } else {
          const docRef = await addDoc(collection(db, 'projects'), data);
          if (onProjectSaved) onProjectSaved({ ...data, id: docRef.id });
        }
      } catch (dbErr) {
        console.warn('Firestore quota/write fallback: saving project locally', dbErr);
        const savedLocal = { ...data, id: localFallbackId, createdAt: Date.now(), updatedAt: Date.now() };
        try {
          const existingLocal: Project[] = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
          const filteredLocal = existingLocal.filter(
            item => item.id !== savedLocal.id && item.name.toLowerCase() !== savedLocal.name.toLowerCase()
          );
          localStorage.setItem('bs_homez_custom_projects', JSON.stringify([savedLocal, ...filteredLocal]));
        } catch {}
        if (onProjectSaved) onProjectSaved(savedLocal);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError(err?.message || 'Failed to save project. Please check your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-art-dark border border-art-gold/30 p-6 sm:p-10 max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-sm shadow-2xl z-10"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-art-gold font-black block mb-1">
              Artisanal Portraits • Online Auto-Discovery & Curation
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white italic">
              {project ? 'Edit Portfolio Archive' : 'Add New Project (Auto-Check Online)'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleAutoCheckOnline()}
              disabled={isAutoChecking}
              className="bg-art-gold/20 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/50 px-4 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAutoChecking ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isAutoChecking ? 'Checking Online...' : 'Auto-Fetch Online Details'}
            </button>
            <button type="button" onClick={onClose} className="text-white/40 hover:text-white p-2 cursor-pointer">
              <X />
            </button>
          </div>
        </div>

        {autoCheckBanner && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-sm flex items-center gap-3 text-xs text-emerald-300 font-mono">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{autoCheckBanner}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-10 text-left">
            {/* Left Column: Basic Info */}
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-art-gold">Project Name *</label>
                  <div className="flex gap-2">
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      onBlur={() => {
                        if (formData.name?.trim() && !formData.description?.trim()) {
                          handleAutoCheckOnline(formData.name);
                        }
                      }}
                      placeholder="e.g., Prestige Somerville, Sobha Galera..."
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Indicative Price / Rental * (* Conditions Apply)</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value, lastPrice: e.target.value})}
                    placeholder="Rs. 2.45 Cr onwards* or Rs. 85,000/mo*"
                  />
                </div>
              </div>

              {/* Highlighted Auto-Updated Last Price & Handover Date */}
              <div className="grid md:grid-cols-2 gap-4 p-3.5 bg-art-gold/[0.06] border border-art-gold/30 rounded-sm">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black tracking-widest text-art-gold flex items-center gap-1.5">
                    <Sparkles size={11} /> Last Price * (Auto-Updated)
                  </label>
                  <input 
                    className="w-full bg-black/50 border border-art-gold/30 p-3 text-art-gold font-mono text-xs outline-none focus:border-art-gold transition-all"
                    value={formData.lastPrice || formData.price || ''}
                    onChange={e => setFormData({...formData, lastPrice: e.target.value})}
                    placeholder="Auto-updated Last Price*"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black tracking-widest text-art-gold flex items-center gap-1.5">
                    <Calendar size={11} /> Hand Over Date (Auto-Updated)
                  </label>
                  <input 
                    className="w-full bg-black/50 border border-art-gold/30 p-3 text-white font-mono text-xs outline-none focus:border-art-gold transition-all"
                    value={formData.handoverDate || ''}
                    onChange={e => setFormData({...formData, handoverDate: e.target.value})}
                    placeholder="December 2027 / Immediate"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Corridor / Zone</label>
                  <select 
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all cursor-pointer"
                    value={formData.zone}
                    onChange={e => {
                      const nextZone = e.target.value as any;
                      setFormData({
                        ...formData,
                        zone: nextZone,
                        imageUrls: getSmartProjectImages(nextZone, formData.type, formData.builderCategory, formData.propertyType)
                      });
                    }}
                  >
                    <option value="Whitefield">Whitefield</option>
                    <option value="Hoskote">Hoskote</option>
                    <option value="Varthur">Varthur</option>
                    <option value="Gunjur">Gunjur</option>
                    <option value="Hosa Road">Hosa Road</option>
                    <option value="Kasavanahalli">Kasavanahalli</option>
                    <option value="East Bangalore">East Bangalore</option>
                    <option value="Off Sarjapur Road">Off Sarjapur Road</option>
                    <option value="Sarjapur">Sarjapur</option>
                    <option value="Electronic City">Electronic City</option>
                    <option value="Marathalli">Marathalli</option>
                    <option value="Bellandur">Bellandur</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Micro-Location</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="Whitefield, Hoskote, Varthur, Gunjur, Hosa Road, Kasavanahalli..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Portfolio Type</label>
                  <select 
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all cursor-pointer"
                    value={formData.type === 'Primary Sale' ? 'Primary' : formData.type}
                    onChange={e => {
                      const nextType = e.target.value as any;
                      setFormData({
                        ...formData,
                        type: nextType,
                        imageUrls: getSmartProjectImages(formData.zone, nextType, formData.builderCategory, formData.propertyType)
                      });
                    }}
                  >
                    <option value="Primary">Primary</option>
                    <option value="Resale">Resale</option>
                    <option value="Rental">Rental</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Property Type</label>
                  <select 
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all cursor-pointer"
                    value={formData.propertyType === 'Flat' ? 'Apartment' : formData.propertyType}
                    onChange={e => {
                      const nextProp = e.target.value as any;
                      setFormData({
                        ...formData,
                        propertyType: nextProp,
                        imageUrls: getSmartProjectImages(formData.zone, formData.type, formData.builderCategory, nextProp)
                      });
                    }}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Present Status</label>
                  <select 
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all cursor-pointer"
                    value={formData.handoverStatus}
                    onChange={e => {
                      const nextStatus = e.target.value as any;
                      const autoHandoverDate =
                        nextStatus === 'Ready to Move' || nextStatus === 'Handed Over'
                          ? 'Immediate Possession (OC Received)'
                          : nextStatus === 'EOI'
                          ? 'December 2028'
                          : 'December 2027';
                      setFormData({
                        ...formData,
                        handoverStatus: nextStatus,
                        handoverDate: formData.handoverDate || autoHandoverDate
                      });
                    }}
                  >
                    <option value="EOI">EOI</option>
                    <option value="Under Construction">Under .Construction</option>
                    <option value="Ready to Move">Ready To Move</option>
                    <option value="Handed Over">Handed Over</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Builder Category & Name</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.builderCategory || 'A'}
                      onChange={e => {
                        const nextCat = e.target.value as any;
                        setFormData({
                          ...formData,
                          builderCategory: nextCat,
                          segment: nextCat === 'A+' ? 'Ultra-Luxury' : nextCat === 'A' ? 'Premium Luxury' : nextCat === 'B' ? 'Value Luxury' : 'Smart Boutique',
                          imageUrls: getSmartProjectImages(formData.zone, formData.type, nextCat, formData.propertyType)
                        });
                      }}
                      className="bg-art-dark border border-white/15 p-3.5 text-xs text-art-gold font-bold outline-none focus:border-art-gold"
                    >
                      <option value="A+">Cat A+</option>
                      <option value="A">Cat A</option>
                      <option value="B">Cat B</option>
                      <option value="C">Cat C</option>
                    </select>
                    <input
                      className="flex-1 bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold"
                      value={formData.builderName || ''}
                      onChange={e => setFormData({ ...formData, builderName: e.target.value })}
                      placeholder="Builder Name"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Approval Body</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all"
                    value={formData.approvalBody || ''}
                    onChange={e => setFormData({...formData, approvalBody: e.target.value})}
                    placeholder="BBMP / BDA / BMRDA & RERA"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">RERA Number</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-art-gold transition-all font-mono text-xs"
                    value={formData.reraNumber || ''}
                    onChange={e => setFormData({...formData, reraNumber: e.target.value})}
                    placeholder="PRM/KA/RERA/1251/446/PR/..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Project Size</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all"
                    value={formData.projectSize || ''}
                    onChange={e => setFormData({...formData, projectSize: e.target.value})}
                    placeholder="21 Acres (1,368 Units)"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Floor Plan & SBA Specifications</label>
                <input 
                  className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all"
                  value={formData.floorPlan || ''}
                  onChange={e => setFormData({...formData, floorPlan: e.target.value})}
                  placeholder="2 BHK (1250 Sq.Ft.) | 3 BHK (1780 Sq.Ft.) | 4 BHK (2450 Sq.Ft.)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Amenities (Comma Separated)</label>
                <input 
                  className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-art-gold transition-all text-xs"
                  value={(formData.features || []).join(', ')}
                  onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  placeholder="Sky Clubhouse, Heated Infinity Pool, Co-working Lounge, Tennis Court..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Project Writeup (Max 2000 chars)</label>
                <textarea 
                  required
                  rows={4}
                  maxLength={2000}
                  className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-art-gold transition-all text-xs leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Writeup detailing architectural excellence, connectivity, and lifestyle..."
                />
              </div>
            </div>

            {/* Right Column: Uploads & Specs */}
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">No. Of Towers</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3 text-white outline-none focus:border-art-gold transition-all text-xs"
                    value={formData.noOfTowers || ''}
                    onChange={e => setFormData({...formData, noOfTowers: e.target.value})}
                    placeholder="10 Towers"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Flats Per Floor</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3 text-white outline-none focus:border-art-gold transition-all text-xs"
                    value={formData.flatsPerFloor || ''}
                    onChange={e => setFormData({...formData, flatsPerFloor: e.target.value})}
                    placeholder="4 Flats / Floor"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Floors Height</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3 text-white outline-none focus:border-art-gold transition-all text-xs"
                    value={formData.floorsHeight || ''}
                    onChange={e => setFormData({...formData, floorsHeight: e.target.value})}
                    placeholder="2B + G + 29 Floors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Units Configuration (Select Multiple)</label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5">
                  {['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Plots'].map(config => (
                    <button
                      key={config}
                      type="button"
                      onClick={() => {
                        const current = formData.configuration || [];
                        const updated = current.includes(config) 
                          ? current.filter(c => c !== config)
                          : [...current, config];
                        setFormData({...formData, configuration: updated});
                      }}
                      className={cn(
                        "p-2.5 text-[9px] border transition-all uppercase tracking-widest text-center cursor-pointer",
                        formData.configuration?.includes(config) 
                          ? "bg-art-gold border-art-gold text-black font-black" 
                          : "bg-white/5 border-white/10 text-white/40"
                      )}
                    >
                      {config}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-art-gold/[0.05] border border-art-gold/25 rounded-sm space-y-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black block">
                  Production Data-First Mode Enabled
                </span>
                <p className="text-xs text-white/75 leading-relaxed">
                  Image options are disabled for production. All verified project data — including Builder Category (A+, A, B, C), Location Name, Last Price (*), Handover Date, RERA Number, Approval Body, Floor Plan & SBA, and Nearby Connectivity (Schools, Hospitals, IT Hubs, Malls & Bus Stop in kms) — is automatically displayed.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-sm">
                <input 
                  type="checkbox"
                  id="formIsPaused"
                  checked={formData.isPaused || false}
                  onChange={e => setFormData({...formData, isPaused: e.target.checked})}
                  className="w-4 h-4 accent-art-gold rounded bg-white/5 border-white/10 outline-none cursor-pointer"
                />
                <label htmlFor="formIsPaused" className="text-[10px] uppercase font-bold tracking-widest text-white/80 cursor-pointer select-none">
                  Hide / Pause Project (Removes from main visitor portal)
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              type="submit"
              disabled={submitting || isAutoChecking}
              className="flex-1 bg-art-gold text-black py-5 uppercase tracking-[0.35em] text-xs font-black hover:bg-white transition-all shadow-xl disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'AUTO-UPDATING & SAVING...' : project ? 'SAVE & AUTO-UPDATE PROJECT' : 'PUBLISH NEW PROJECT TO PORTFOLIO'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 uppercase tracking-widest text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-center"
              >
                <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

const OpportunitySection = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    propertyName: '',
    propertyStatus: 'Ready to Move' as 'Ready to Move' | 'Under Construction' | 'On Going' | 'Nearing Completion',
    propertyType: 'Flat' as 'Villa' | 'Flat' | 'Plot',
    rooms: '3BHK' as '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK',
    facingSelection: 'East',
    customFacing: '',
    tower: '',
    floorNumber: '',
    willingTo: 'Sell' as 'Rent' | 'Sell',
    expectedRent: '',
    expectedSell: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const finalFacing = formData.facingSelection === 'Custom' 
      ? formData.customFacing.trim() 
      : formData.facingSelection;

    if (!finalFacing) {
      setError('Please specify the property facing orientation.');
      setSubmitting(false);
      return;
    }

    try {
      const opportunityData: any = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        propertyName: formData.propertyName.trim(),
        propertyStatus: formData.propertyStatus,
        propertyType: formData.propertyType,
        rooms: formData.rooms,
        facing: finalFacing,
        floorNumber: formData.floorNumber.trim() || 'Ground',
        willingTo: formData.willingTo,
        timestamp: serverTimestamp()
      };

      if (formData.tower.trim()) {
        opportunityData.tower = formData.tower.trim();
      }

      if (formData.notes.trim()) {
        opportunityData.notes = formData.notes.trim();
      }

      if (formData.willingTo === 'Rent') {
        const rentVal = parseFloat(formData.expectedRent);
        if (isNaN(rentVal) || rentVal <= 0) {
          setError('Expected rent must be a positive number.');
          setSubmitting(false);
          return;
        }
        opportunityData.expectedRent = rentVal;
      } else {
        const sellVal = parseFloat(formData.expectedSell);
        if (isNaN(sellVal) || sellVal <= 0) {
          setError('Expected sell price must be a positive number.');
          setSubmitting(false);
          return;
        }
        opportunityData.expectedSell = sellVal;
      }

      await addDoc(collection(db, 'opportunities'), opportunityData);
      setSuccess(true);
      setFormData({
        name: '',
        mobile: '',
        propertyName: '',
        propertyStatus: 'Ready to Move',
        propertyType: 'Flat',
        rooms: '3BHK',
        facingSelection: 'East',
        customFacing: '',
        tower: '',
        floorNumber: '',
        willingTo: 'Sell',
        expectedRent: '',
        expectedSell: '',
        notes: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting your property details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="opportunity" className="py-24 md:py-48 px-6 md:px-12 bg-white/[0.01] border-t border-white/5 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 bg-art-gold/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute left-12 top-0 w-px h-full bg-white/5 hidden lg:block" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-art-gold font-medium tracking-[0.5em] text-[10px] uppercase block mb-10 text-center">BS Homez Concierge</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight italic mb-8">
            Offer Your <span className="not-italic text-art-gold">Asset</span>
          </h2>
          <p className="text-sm font-light text-white/50 tracking-wide leading-relaxed max-w-2xl mx-auto">
            Authorize BS Homez to process your residential real estate assets. Complete the details below so that our direct HNWI and institutional channels can facilitate private placement.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-8 md:p-16 rounded-sm backdrop-blur-md font-sans">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h3 className="text-3xl font-serif mb-4 text-white italic">Asset Successfully Filed</h3>
              <p className="text-white/50 tracking-wide text-xs max-w-md mx-auto mb-10 leading-relaxed">
                Thank you. Your property listing request is registered in our private system. A senior relationship advisor will review the metadata and verify details before initiating direct placement.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-art-gold transition-colors font-sans"
              >
                Register Another Property
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-sm text-red-400 text-xs tracking-wider uppercase font-semibold font-sans">
                  Error: {error}
                </div>
              )}

              {/* Owner Details */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-art-gold border-b border-white/5 pb-4 mb-8 font-sans">
                  01. Owner Integrity
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold font-sans">Owner Name *</label>
                    <input 
                      required
                      type="text"
                      placeholder="Enter legal titleholder name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold font-sans">Mobile Number *</label>
                    <input 
                      required
                      type="tel"
                      placeholder="Enter active phone number"
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-art-gold border-b border-white/5 pb-4 mb-8 font-sans">
                  02. Real Estate Coordinates
                </h4>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="md:col-span-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold font-sans">Property Name *</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g., Prestige Lakeside Habitat, Sobha Royal Pavilion"
                      value={formData.propertyName}
                      onChange={e => setFormData({ ...formData, propertyName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold font-sans">Property Status *</label>
                    <select 
                      value={formData.propertyStatus}
                      onChange={e => setFormData({ ...formData, propertyStatus: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all cursor-pointer font-sans"
                    >
                      <option value="Ready to Move" className="bg-art-dark">Ready to Move</option>
                      <option value="Under Construction" className="bg-art-dark">Under Construction</option>
                      <option value="On Going" className="bg-art-dark">On Going</option>
                      <option value="Nearing Completion" className="bg-art-dark">Nearing Completion</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold font-sans">Property Type *</label>
                    <select 
                      value={formData.propertyType}
                      onChange={e => setFormData({ ...formData, propertyType: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all cursor-pointer font-sans"
                    >
                      <option value="Flat" className="bg-art-dark">Flat (Apartment)</option>
                      <option value="Villa" className="bg-art-dark">Villa</option>
                      <option value="Plot" className="bg-art-dark">Plot (Land)</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8 font-sans">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold">Rooms / Configuration *</label>
                    <select 
                      value={formData.rooms}
                      onChange={e => setFormData({ ...formData, rooms: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all cursor-pointer"
                    >
                      <option value="1BHK" className="bg-art-dark font-mono">1 BHK</option>
                      <option value="2BHK" className="bg-art-dark font-mono">2 BHK</option>
                      <option value="3BHK" className="bg-art-dark font-mono">3 BHK</option>
                      <option value="4BHK" className="bg-art-dark font-mono">4 BHK</option>
                      <option value="5BHK" className="bg-art-dark font-mono">5 BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold">Property Facing *</label>
                    <select 
                      value={formData.facingSelection}
                      onChange={e => setFormData({ ...formData, facingSelection: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all cursor-pointer"
                    >
                      <option value="East" className="bg-art-dark">East</option>
                      <option value="North" className="bg-art-dark">North</option>
                      <option value="West" className="bg-art-dark">West</option>
                      <option value="South" className="bg-art-dark">South</option>
                      <option value="Custom" className="bg-art-dark">Custom Choice...</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold">Floor Number *</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g., 4th Floor, Ground"
                      value={formData.floorNumber}
                      onChange={e => setFormData({ ...formData, floorNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>

                {formData.facingSelection === 'Custom' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 font-sans"
                  >
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold">Specify Custom Facing Orientation *</label>
                    <input 
                      required
                      type="text"
                      placeholder="Enter facing orientation (e.g., North-East, West-Facing Garden View)"
                      value={formData.customFacing}
                      onChange={e => setFormData({ ...formData, customFacing: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20"
                    />
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-8 font-sans">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold">Tower (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g., Tower 3, Block B"
                      value={formData.tower}
                      onChange={e => setFormData({ ...formData, tower: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Intent and Commercials */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-art-gold border-b border-white/5 pb-4 mb-8 font-sans">
                  03. Intent & Value Alignment
                </h4>
                <div className="mb-8 font-sans">
                  <label className="text-[9px] uppercase tracking-[0.2em] mb-4 block text-white/40 font-bold font-sans">Willing to *</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, willingTo: 'Sell' })}
                      className={cn(
                        "flex-1 py-4 border rounded-sm text-xs uppercase font-black tracking-widest transition-all",
                        formData.willingTo === 'Sell' 
                          ? "bg-art-gold text-black border-art-gold" 
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                      )}
                    >
                      Sell Property
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, willingTo: 'Rent' })}
                      className={cn(
                        "flex-1 py-4 border rounded-sm text-xs uppercase font-black tracking-widest transition-all",
                        formData.willingTo === 'Rent' 
                          ? "bg-art-gold text-black border-art-gold" 
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                      )}
                    >
                      Rent Property
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 font-sans">
                  {formData.willingTo === 'Rent' ? (
                    <motion.div 
                      key="rent"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold">Expected Rent (Rs. Monthly, numbers only) *</label>
                      <input 
                        required
                        type="number"
                        placeholder="e.g., 45000"
                        value={formData.expectedRent}
                        onChange={e => setFormData({ ...formData, expectedRent: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20 font-mono"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="sell"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <label className="text-[9px] uppercase tracking-[0.2em] mb-3 block text-white/40 font-bold">Expected Sell Price (Rs. total capital, numbers only) *</label>
                      <input 
                        required
                        type="number"
                        placeholder="e.g., 25000000"
                        value={formData.expectedSell}
                        onChange={e => setFormData({ ...formData, expectedSell: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20 font-mono"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="mt-8 font-sans">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] block text-white/40 font-bold">Additional Notes / Specifications (Upto 2000 chars)</label>
                    <span className={cn(
                      "text-[9px] font-mono",
                      formData.notes.length > 1900 ? "text-amber-400" : "text-white/20"
                    )}>
                      {formData.notes.length}/2000
                    </span>
                  </div>
                  <textarea 
                    maxLength={2000}
                    placeholder="Enter proprietary details, specific preferences, configuration desires, handover expectations, or any other notes (up to 2000 characters)..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs focus:border-art-gold outline-none transition-all placeholder:text-white/20 font-sans h-36 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-white hover:bg-art-gold text-black py-5 text-[11px] font-black uppercase tracking-[0.3em] transition-colors rounded-sm flex items-center justify-center gap-3 disabled:opacity-50 font-sans font-bold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin text-black" size={16} />
                    Processing Registry...
                  </>
                ) : (
                  "Submit Property Details"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const formatDateTime = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  try {
    let date: Date;
    if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (timestamp.seconds !== undefined) {
      date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return 'N/A';
  }
};

const escapeCSV = (str: any): string => {
  if (str === null || str === undefined) return '';
  const val = String(str);
  const escaped = val.replace(/"/g, '""');
  if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') || escaped.includes('\r')) {
    return `"${escaped}"`;
  }
  return val;
};

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model', text: string }>>([]);
  const [isPending, setIsPending] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(false);
  const [revertWithAmpleProps, setRevertWithAmpleProps] = useState(true);

  const getISTGreeting = () => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // IST is UTC + 5:30
    const ist = new Date(utc + (3600000 * 5.5));
    const hours = ist.getHours();
    
    let greeting = 'Good Evening';
    if (hours < 12) greeting = 'Good Morning';
    else if (hours < 17) greeting = 'Good Afternoon';
    
    const formattedTime = ist.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return {
      text: `${greeting} from BS Homez!`,
      timeStr: `IST Time: ${formattedTime}`
    };
  };

  const { text: istGreeting, timeStr: istTimeLabel } = getISTGreeting();

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !name.trim() && !phone.trim()) return;

    if (name.trim() && phone.trim()) {
      setIsPending(true);
      try {
        const leadMsg = message.trim() || "Interested in learning more about curated properties via AI Assistant.";
        const extraNote = revertWithAmpleProps 
          ? " [User requested: Revert with an ample of matched properties in due time]" 
          : "";
        
        await addDoc(collection(db, 'enquiries'), {
          projectId: 'ai_chat_lead',
          projectName: 'AI Assistant - Curated Portfolio Request',
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || 'no-email@bshomez.com',
          message: `${leadMsg}${extraNote}`,
          type: 'AI Chat',
          timestamp: serverTimestamp()
        });
        
        setChatHistory(prev => [
          ...prev, 
          { role: 'user', text: `Name: ${name}, Number: ${phone}. ${leadMsg}` },
          { 
            role: 'model', 
            text: `Wonderful! Allow us some time. We have locked in your advisory request. Our elite consultants will revert to you with an ample of matched luxury properties shortly.` 
          }
        ]);
        
        setSubmittedLead(true);
        setMessage('');
      } catch (err) {
        console.error("Error logging AI Chat lead", err);
      } finally {
        setIsPending(false);
      }
      return;
    }

    if (message.trim()) {
      const userMsg = message.trim();
      setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
      setMessage('');
      setIsPending(true);

      try {
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg,
            history: chatHistory
          })
        });
        const data = await response.json();
        setChatHistory(prev => [...prev, { role: 'model', text: data.response }]);
      } catch (err) {
        console.error("AI Chat API failed", err);
        setChatHistory(prev => [...prev, { role: 'model', text: "Thank you for reaching out to BS Homez. Please share your Name and Number, and our relationship executive will provide complete insights shortly." }]);
      } finally {
        setIsPending(false);
      }
    }
  };

  return (
    <div className="fixed left-6 bottom-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-[380px] h-[550px] bg-art-dark/95 border border-art-gold/30 rounded-lg flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl mb-4 overflow-hidden text-white"
          >
            {/* Header */}
            <div className="bg-white/[0.03] border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-art-dark animate-pulse" />
                  <div className="w-10 h-10 rounded-full border border-art-gold/30 flex items-center justify-center bg-art-gold/10">
                    <MessageCircle size={18} className="text-art-gold animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white text-xs font-serif italic tracking-wide">BS Homez AI Real Estate Assistant</h4>
                  <p className="text-[9px] text-white/40 font-mono">{istTimeLabel}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-all p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages / Request Box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {/* Default Welcome greetings */}
              <div className="bg-white/[0.03] border border-white/5 rounded-sm p-3.5 space-y-3">
                <p className="font-serif italic text-sm text-art-gold font-medium">{istGreeting}</p>
                <p className="text-white/70 leading-relaxed">
                  We are absolutely delighted to welcome you. We are here to assist you with elite real estate advisory and help find your luxurious dream property in Bangalore.
                </p>
                
                {!submittedLead && (
                  <div className="border-t border-white/5 pt-3 space-y-2.5">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Please share your details to query matching portfolios:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-sm">
                        <span className="text-[10px] text-art-gold font-mono w-14">Name :</span>
                        <input 
                          type="text" 
                          placeholder="Your Exquisite Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-transparent text-white outline-none w-full text-xs placeholder:text-white/20"
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-sm">
                        <span className="text-[10px] text-art-gold font-mono w-14">Number :</span>
                        <input 
                          type="tel" 
                          placeholder="Your Contact Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-transparent text-white outline-none w-full text-xs placeholder:text-white/20 cursor-text"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2 pt-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={revertWithAmpleProps}
                        onChange={(e) => setRevertWithAmpleProps(e.target.checked)}
                        className="mt-0.5 rounded border-white/15 bg-white/5 text-art-gold focus:ring-transparent"
                      />
                      <span className="text-[10px] text-white/50 group-hover:text-white/80 transition-all font-sans leading-relaxed">
                        Allow us some time, we will revert with an ample of matched luxury properties.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Dynamic Chat messages */}
              {chatHistory.map((chat, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-3 rounded-sm leading-relaxed max-w-[85%] font-sans",
                    chat.role === 'user' 
                      ? "bg-art-gold/15 text-white/90 border border-art-gold/15 ml-auto text-right" 
                      : "bg-white/[0.04] text-white/80 border border-white/5 mr-auto"
                  )}
                >
                  {chat.text}
                </div>
              ))}

              {isPending && (
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono pl-1">
                  <Loader2 size={12} className="animate-spin text-art-gold" />
                  BS Expert is processing...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendQuery} className="p-3 bg-white/[0.02] border-t border-white/5 flex gap-2">
              <input 
                type="text"
                placeholder={(!name.trim() || !phone.trim()) && !submittedLead
                  ? "Enter Details Above or Ask a Question..."
                  : "How can we assist you today?"
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-white/5 border border-white/15 rounded-sm px-3 py-2 text-white text-xs placeholder:text-white/20 outline-none focus:border-art-gold/50"
              />
              <button 
                type="submit"
                disabled={isPending || (!message.trim() && (!name.trim() || !phone.trim()))}
                className="bg-art-gold hover:bg-art-gold/90 text-black px-4 py-2 rounded-sm text-xs font-bold transition-all disabled:opacity-30 flex items-center justify-center whitespace-nowrap"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-art-gold hover:bg-art-gold/95 text-black rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.4)] relative border border-white/10 group"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/80 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-black text-[9px] text-art-gold font-bold items-center justify-center font-mono">1</span>
        </span>
        <MessageCircle size={24} className="group-hover:rotate-12 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};

const AdminView = ({ 
  enquiries, 
  projects, 
  opportunities, 
  referrals = [], 
  showProjectModal, 
  setShowProjectModal, 
  editingProject, 
  setEditingProject,
  onOpenSeoPreview
}: { 
  enquiries: Enquiry[], 
  projects: Project[], 
  opportunities: Opportunity[], 
  referrals?: Referral[], 
  showProjectModal: boolean, 
  setShowProjectModal: (val: boolean) => void, 
  editingProject: Project | null, 
  setEditingProject: (p: Project | null) => void,
  onOpenSeoPreview?: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'portfolio' | 'opportunities' | 'referrals'>('leads');

  const exportEnquiriesExcel = () => {
    const headers = [
      'Order',
      'Date & Time Enquired',
      'Customer Name',
      'Phone',
      'Email',
      'Preferred Contact Time',
      'Portfolio Interest (Project)',
      'Interested Projects',
      'Preferred Location',
      'Communication Channel',
      'Intelligence / Message'
    ];
    const rows = enquiries.map((enq, index) => [
      index + 1,
      formatDateTime(enq.timestamp),
      enq.customerName,
      enq.customerPhone,
      enq.customerEmail,
      enq.preferredContactTime || 'Standard Hours',
      enq.projectName,
      enq.interestedProjects || enq.projectName,
      enq.preferredLocation || '',
      enq.type,
      enq.message || ''
    ]);
    
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BS_Homez_Customer_Intelligence_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportOpportunitiesExcel = () => {
    const headers = [
      'Order', 'Date & Time Filed', 'Owner Name', 'Contact Mobile', 'Property Name', 
      'Property Type', 'Willing To', 'Expected Income (Rs.)', 'Property Status', 
      'Facing Direction', 'Rooms Specification', 'Floor Detail', 'Tower Detail', 'Advisory Notes'
    ];
    const rows = opportunities.map((opp, index) => [
      index + 1,
      formatDateTime(opp.timestamp),
      opp.name,
      opp.mobile,
      opp.propertyName,
      opp.propertyType,
      opp.willingTo,
      opp.willingTo === 'Rent' ? opp.expectedRent || 0 : opp.expectedSell || 0,
      opp.propertyStatus,
      opp.facing,
      opp.rooms,
      opp.floorNumber,
      opp.tower || '',
      opp.notes || ''
    ]);
    
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BS_Homez_Sell_Rent_Offers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportReferralsExcel = () => {
    const headers = [
      'Order', 'Date & Time Filed', 'Referrer Name', 'Referrer Contact', 'Referred Name', 
      'Referred Mobile', 'WhatsApp', 'Budget Range', 'Location Preferred', 
      'Property Type', 'Unit Choice', 'Contact Preference', 'Looking For', 'Property Age (Resale)', 'Opinion'
    ];
    const rows = referrals.map((ref, index) => [
      index + 1,
      formatDateTime(ref.createdAt),
      ref.referrerName || '',
      ref.referrerContact || '',
      ref.name,
      ref.mobileNumber,
      ref.whatsappNumber,
      ref.budget,
      ref.location,
      ref.propertyType,
      ref.unitType,
      ref.contactDateTime,
      ref.lookingFor,
      ref.lookingFor === 'Resale' ? ref.resaleAge || '' : 'N/A',
      ref.clientOpinion || ''
    ]);
    
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BS_Homez_Submissions_Referrals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-24 px-8 max-w-7xl mx-auto">
      <div className="mb-12 border-b border-white/10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-serif italic text-white flex items-center gap-6">
            <User className="text-art-gold" size={40} /> Admin <span className="not-italic text-art-gold">Vault</span>
          </h2>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <p className="text-white/30 uppercase tracking-[0.4em] text-[10px] font-bold">Synchronized Multi-Asset Management</p>
            {onOpenSeoPreview && (
              <>
                <span className="text-white/20 hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={onOpenSeoPreview}
                  className="text-[9px] uppercase tracking-widest text-art-gold hover:text-white flex items-center gap-1.5 transition-colors font-bold cursor-pointer bg-art-gold/10 hover:bg-art-gold/20 px-2.5 py-1 rounded border border-art-gold/30"
                >
                  <Globe size={11} className="animate-pulse text-art-gold" />
                  <span>Inspect Google & Meta SEO</span>
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap w-full md:w-auto bg-[#121212]/90 border border-white/10 p-1.5 rounded-sm overflow-x-auto gap-2 md:gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
           <button 
             onClick={() => setActiveTab('leads')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'leads' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <MessageCircle size={15} className={cn("transition-transform duration-300", activeTab === 'leads' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <span>Customer Intelligence</span>
           </button>
           <button 
             onClick={() => setActiveTab('opportunities')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'opportunities' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <TrendingUp size={15} className={cn("transition-transform duration-300", activeTab === 'opportunities' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <span>Sell/Rent Offers</span>
           </button>
           <button 
             onClick={() => setActiveTab('referrals')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'referrals' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <Handshake size={15} className={cn("transition-transform duration-300", activeTab === 'referrals' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <span>Referral Registry</span>
           </button>
           <button 
             onClick={() => setActiveTab('portfolio')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'portfolio' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <LayoutGrid size={15} className={cn("transition-transform duration-300", activeTab === 'portfolio' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <span>Portfolio Curator</span>
           </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-sm">
            <div>
              <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Secure Access Record logs</p>
              <h3 className="text-lg font-serif italic text-white">Active Customer Intelligence ({enquiries.length})</h3>
            </div>
            <button 
              onClick={exportEnquiriesExcel}
              className="flex items-center gap-2 bg-art-gold/10 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/30 px-5 py-3 rounded-sm text-[10px] uppercase font-black tracking-widest transition-all"
            >
              <FileSpreadsheet size={14} />
              Export to Excel
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-white/10 text-[10px] uppercase tracking-[0.2em] font-black text-art-gold">
                 <tr>
                   <th className="px-8 py-6">Identity</th>
                   <th className="px-8 py-6">Enquired At</th>
                   <th className="px-8 py-6">Preferred Callback Time</th>
                   <th className="px-8 py-6">Portfolio Interests & Preferred Location</th>
                   <th className="px-8 py-6">Communication</th>
                   <th className="px-8 py-6">Intelligence</th>
                   <th className="px-8 py-6">Origin</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {enquiries.length === 0 && (
                   <tr>
                     <td colSpan={7} className="px-10 py-20 text-center text-white/20 italic tracking-widest">No intelligence recorded in current session.</td>
                   </tr>
                 )}
                 {enquiries.map((enq) => (
                   <tr key={enq.id} className="hover:bg-white/5 transition-colors group">
                     <td className="px-8 py-6 font-serif text-lg text-white">{enq.customerName}</td>
                     <td className="px-8 py-6 text-[11px] font-mono text-white/60">
                       {formatDateTime(enq.timestamp)}
                     </td>
                     <td className="px-8 py-6">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-art-gold/10 border border-art-gold/30 rounded-sm text-art-gold font-mono text-[10px] whitespace-nowrap">
                         <Clock size={12} className="text-art-gold shrink-0" />
                         <span>{enq.preferredContactTime || 'Standard Hours'}</span>
                       </div>
                     </td>
                     <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                         <span className="text-art-gold font-mono text-sm uppercase tracking-tighter">
                           {enq.interestedProjects || enq.projectName}
                         </span>
                         {enq.preferredLocation && (
                           <span className="text-[10px] text-white/50 font-mono">
                             Pref. Location: {enq.preferredLocation}
                           </span>
                         )}
                       </div>
                     </td>
                     <td className="px-8 py-6 text-[11px] font-mono">
                       <div className="flex flex-col gap-1.5">
                         <span className="text-white">{enq.customerPhone}</span>
                         <span className="text-white/40">{enq.customerEmail}</span>
                       </div>
                     </td>
                     <td className="px-8 py-6 text-[11px] text-white/50 italic max-w-sm line-clamp-2 leading-relaxed">
                       {enq.message ? `"${enq.message}"` : 'NO CONTEXT PROVIDED'}
                     </td>
                     <td className="px-8 py-6">
                       <span className={cn(
                         "text-[9px] px-3 py-1 rounded-sm uppercase font-black tracking-widest whitespace-nowrap",
                         enq.type === 'WhatsApp'
                           ? "bg-green-500/20 text-green-500 border border-green-500/20"
                           : enq.type === 'Download Brochure'
                           ? "bg-art-gold/20 text-art-gold border border-art-gold/30"
                           : "bg-blue-500/20 text-blue-500 border border-blue-500/20"
                       )}>
                         {enq.type}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'opportunities' ? (
        <div className="space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-sm">
            <div>
              <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Asset Verification Pipeline</p>
              <h3 className="text-lg font-serif italic text-white font-sans">Active Sell/Rent Offers ({opportunities.length})</h3>
            </div>
            <button 
              onClick={exportOpportunitiesExcel}
              className="flex items-center gap-2 bg-art-gold/10 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/30 px-5 py-3 rounded-sm text-[10px] uppercase font-black tracking-widest transition-all font-sans"
            >
              <FileSpreadsheet size={14} />
              Export to Excel
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden font-sans">
            <table className="w-full text-left">
               <thead className="bg-white/10 text-[10px] uppercase tracking-[0.2em] font-black text-art-gold font-sans">
                 <tr>
                   <th className="px-10 py-8">Owner</th>
                   <th className="px-10 py-8">Offered At</th>
                   <th className="px-10 py-8">Property Coordinate</th>
                   <th className="px-10 py-8">Model & Offering</th>
                   <th className="px-10 py-8">Attributes</th>
                   <th className="px-10 py-8">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {opportunities.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-10 py-20 text-center text-white/20 italic tracking-widest font-serif text-sm">No property opportunities filed in current database scope.</td>
                    </tr>
                  )}
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-8 font-sans">
                        <div className="flex flex-col gap-1">
                          <span className="font-serif text-lg text-white">{opp.name}</span>
                          <span className="text-white/40 font-mono text-xs">{opp.mobile}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-[11px] font-mono text-white/60">
                        {formatDateTime(opp.timestamp)}
                      </td>
                    <td className="px-10 py-8 font-sans">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-semibold text-sm">{opp.propertyName}</span>
                        <span className="text-art-gold font-mono text-[10px] uppercase font-bold tracking-widest">{opp.propertyType}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 font-sans">
                      <div className="flex flex-col gap-1">
                        <span className={cn(
                          "text-[9px] px-3 py-1 rounded-sm uppercase font-black tracking-widest w-max",
                          opp.willingTo === 'Rent' ? "bg-amber-500/20 text-amber-500 border border-amber-500/20" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20"
                        )}>
                          For {opp.willingTo}
                        </span>
                        <span className="text-white font-mono text-sm leading-6">
                          {opp.willingTo === 'Rent' 
                            ? `Rs. ${(opp.expectedRent ?? 0).toLocaleString()}/month`
                            : `Rs. ${(opp.expectedSell ?? 0).toLocaleString()}`
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-mono font-sans">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-white/60">
                        <span>Status: <strong className="text-white font-medium">{opp.propertyStatus}</strong></span>
                        <span>Facing: <strong className="text-white font-medium">{opp.facing}</strong></span>
                        <span>Rooms: <strong className="text-white font-medium">{opp.rooms}</strong></span>
                        <span>Floor: <strong className="text-white font-medium">{opp.floorNumber}</strong></span>
                        {opp.tower && <span className="col-span-2">Tower: <strong className="text-white font-medium">{opp.tower}</strong></span>}
                      </div>
                      {opp.notes && (
                        <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-art-gold/85 leading-relaxed font-sans break-words bg-white/[0.02] p-2 rounded-sm border border-white/5">
                          <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1 font-bold">Advisory Notes:</span>
                          "{opp.notes}"
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-8 font-sans">
                      <button 
                        onClick={async () => {
                          if (confirm('Verify deletion of this opportunity entry?')) {
                            try {
                              await deleteDoc(doc(db, 'opportunities', opp.id!));
                            } catch (err) {
                              handleFirestoreError(err, OperationType.DELETE, `opportunities/${opp.id}`);
                            }
                          }
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 p-3 flex justify-center text-red-500 transition-all rounded-sm"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    ) : activeTab === 'referrals' ? (
      <div className="space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-sm font-sans">
          <div>
            <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Advocacy Referral Log</p>
            <h3 className="text-lg font-serif italic text-white font-sans">Active System Referrals ({referrals.length})</h3>
          </div>
          <button 
            onClick={exportReferralsExcel}
            className="flex items-center gap-2 bg-art-gold/10 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/30 px-5 py-3 rounded-sm text-[10px] uppercase font-black tracking-widest transition-all"
          >
            Export Referrals
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden overflow-x-auto font-sans">
          <table className="w-full text-left">
             <thead className="bg-white/10 text-[10px] uppercase tracking-[0.2em] font-black text-art-gold font-sans">
               <tr>
                 <th className="px-10 py-8">Advocate Info</th>
                 <th className="px-10 py-8">Friend / Family (Client)</th>
                 <th className="px-10 py-8">Budget & Location</th>
                 <th className="px-10 py-8">Specification</th>
                 <th className="px-10 py-8">Contact Schedule</th>
                 <th className="px-10 py-8">Advisory Notes</th>
                 <th className="px-10 py-8 text-right font-sans">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5 font-sans">
                {referrals.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-10 py-20 text-center text-white/20 italic tracking-widest font-serif text-sm">No referrals filed in current database scope.</td>
                  </tr>
                )}
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-10 py-8">
                       <p className="text-white font-serif italic text-sm">{ref.referrerName || 'Anonymous'}</p>
                       <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">{ref.referrerContact}</p>
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-white font-serif italic text-sm">{ref.name}</p>
                       <p className="text-white/40 text-[10px] font-mono mt-1">Mob: {ref.mobileNumber}</p>
                       <p className="text-emerald-400 text-[10px] font-mono mt-0.5">WA: {ref.whatsappNumber}</p>
                    </td>
                    <td className="px-10 py-8 font-sans">
                       <span className="inline-block px-2.5 py-1 text-[9px] uppercase font-black tracking-widest bg-art-gold/10 text-art-gold border border-art-gold/25 rounded-full mb-1">{ref.budget}</span>
                       <p className="text-white/50 text-xs flex items-center gap-1.5 mt-1">
                         <MapPin size={10} className="text-art-gold/60" /> {ref.location}
                       </p>
                    </td>
                    <td className="px-10 py-8 text-xs">
                       <p className="text-white/80 font-bold">{ref.propertyType} • {ref.unitType}</p>
                       <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                         {ref.lookingFor} {ref.lookingFor === 'Resale' ? `(Age: ${ref.resaleAge})` : ''}
                       </p>
                    </td>
                    <td className="px-10 py-8 font-mono text-[10px] text-white/60">
                       {ref.contactDateTime ? ref.contactDateTime.replace('T', ' ') : 'N/A'}
                    </td>
                    <td className="px-10 py-8 text-xs text-white/50 max-w-xs truncate" title={ref.clientOpinion}>
                       {ref.clientOpinion || <span className="italic text-white/20">No opinions described</span>}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={async () => {
                          if (confirm('Verify deletion of this referral log record?')) {
                            try {
                              await deleteDoc(doc(db, 'referrals', ref.id!));
                            } catch (err) {
                              handleFirestoreError(err, OperationType.DELETE, `referrals/${ref.id}`);
                            }
                          }
                        }}
                        className="text-red-400 hover:text-red-500 bg-red-500/10 hover:bg-red-500/15 p-3 rounded-sm transition-all"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    ) : (
        <div className="space-y-8">
          {/* Online Publishing & Google SEO Lead Hub for Admin */}
          <div className="p-6 bg-art-gold/[0.06] border border-art-gold/30 rounded-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-art-gold font-black block mb-1">
                  Online Publishing & Google Top-Ranking SEO Hub
                </span>
                <h3 className="text-xl font-serif italic text-white">
                  Production Link & Google Search Lead Generation Active
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-art-gold text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white transition-all flex items-center gap-1.5"
                >
                  <ExternalLink size={12} /> Open Production Link
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white hover:text-black transition-all flex items-center gap-1.5"
                >
                  <Globe size={12} /> View Sitemap.xml
                </a>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-xs text-white/75">
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-sm">
                <strong className="text-art-gold uppercase text-[9px] tracking-widest block mb-1">1. Official Production URL</strong>
                <span className="font-mono text-[11px] break-all text-white">https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app</span>
              </div>
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-sm">
                <strong className="text-art-gold uppercase text-[9px] tracking-widest block mb-1">2. Google Search Keywords Configured</strong>
                <span>Buy, Sale, Resale, Rent Properties in Whitefield, Hoskote, Varthur, Gunjur, Hosa Road, Kasavanahalli & Sarjapur (JSON-LD RealEstateAgent Schema + Sitemap active).</span>
              </div>
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-sm">
                <strong className="text-art-gold uppercase text-[9px] tracking-widest block mb-1">3. Publish on Google Business & Search Console</strong>
                <span>Submit your Production Link and <code className="text-art-gold">/sitemap.xml</code> in Google Search Console & Google Business Profile to rank at the top of local property searches.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
              className="bg-art-gold text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Curate New Project
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.filter(p => !LEGACY_PROJECT_NAMES.includes(p.name) && !p.isDeleted).map((p) => (
              <div key={p.id || p.name} className="bg-white/5 border border-white/10 p-6 rounded-sm group relative">
                {p.isPaused && (
                  <div className="absolute top-4 right-4 z-20 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg">
                    Hidden
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[9px] text-art-gold font-black uppercase tracking-widest">{p.type} • Cat {p.builderCategory || 'A'}</span>
                  <span className="text-[9px] text-white/50 font-mono uppercase">{p.handoverStatus}</span>
                </div>
                <h4 className="text-white font-serif text-lg mb-1 truncate">{p.name}</h4>
                <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">{p.location} ({p.zone})</p>
                <p className="text-[9px] text-white/45 font-mono mb-2 truncate">{p.builderName || 'Verified Builder'} • {p.approvalBody || 'RERA Approved'}</p>
                <p className="text-[9px] text-emerald-400 font-mono mb-4">
                  Last Price: {p.lastPrice || p.price} • Handover: {p.handoverDate || 'Immediate'}
                </p>
                {p.id && (
                  <div className="flex gap-2">
                     <button 
                       onClick={() => { setEditingProject(p); setShowProjectModal(true); }}
                       className="flex-1 bg-white/10 hover:bg-white/20 p-3 flex justify-center text-white transition-all rounded-sm cursor-pointer"
                       title="Edit project"
                     >
                       <Edit size={14} />
                     </button>
                     <button 
                       onClick={async () => {
                         if (p.id && !p.id.startsWith('curated_') && !p.id.startsWith('local_')) {
                           try {
                             await updateDoc(doc(db, 'projects', p.id), { isPaused: !p.isPaused });
                           } catch (err) {
                             console.warn(err);
                           }
                         }
                       }}
                       className={cn(
                         "p-3 flex justify-center transition-all rounded-sm cursor-pointer",
                         p.isPaused 
                           ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400" 
                           : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500"
                       )}
                       title={p.isPaused ? "Resume project (mark active)" : "Pause project (hide from main page)"}
                     >
                       {p.isPaused ? <Play size={14} /> : <Pause size={14} />}
                     </button>
                     <button 
                       onClick={async () => {
                         if (p.id && !p.id.startsWith('curated_') && !p.id.startsWith('local_')) {
                           try {
                             await deleteDoc(doc(db, 'projects', p.id));
                           } catch (err) {
                             console.warn(err);
                           }
                         }
                       }}
                       className="bg-red-500/10 hover:bg-red-500/20 p-3 flex justify-center text-red-500 transition-all rounded-sm cursor-pointer"
                       title="Delete project"
                     >
                       <Trash size={14} />
                     </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Curated East & South East Bangalore Portfolio (Primary, Resale, Rental) ---
const CURATED_ARTISANAL_PROJECTS: Project[] = [
  // ================= WHITEFIELD (Primary, Resale, Rental) =================
  {
    id: 'curated_whitefield_primary_1',
    name: 'Prestige Somerville',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    approvalBody: 'BBMP & BDA Approved',
    floorPlan: '3 BHK Classic (1773 Sq.Ft.) · 3.5 BHK Luxe (1962 Sq.Ft.) · 4 BHK + Maid (2616 Sq.Ft.)',
    description: 'Iconic lakefront high-rise residential sanctuary at Location: Whitefield - Varthur Main Road (Ramagondanahalli), overlooking Varthur Lake. Designed with two-side open Vaastu residences, expansive sky-decks, and 84% landscaped biophilic open greens. Nearby Connectivity (Whitefield): Schools: The Deens Academy (2.1 km), Greenwood High International (4.5 km), Ryan International (3.2 km) | Hospitals: Manipal Hospital Varthur Road (1.2 km), Columbia Asia / Manipal Whitefield (2.8 km), Vydehi Hospital (4.1 km) | IT Hubs: Sigma Soft Tech Park (0.6 km), ITPL / ITPB Whitefield (3.8 km), Prestige Tech Cloud (3.0 km) | Malls: Nexus Forum Shantiniketan Mall (3.6 km), Virginia Mall (1.1 km), Phoenix Marketcity (7.2 km) | Bus Stop & Transit: Ramagondanahalli BMTC Bus Stop (0.2 km), Hope Farm Metro Station (3.4 km).',
    price: 'Rs. 2.35 Cr - Rs. 3.85 Cr*',
    lastPrice: 'Rs. 2.42 Cr onwards*',
    location: 'Whitefield - Varthur Road (Ramagondanahalli)',
    locationTarget: 'Ramagondanahalli Bus Stop (0.2 km) • Manipal Hospital (1.2 km) • ITPL (3.8 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '3.5 BHK', '4 BHK'],
    segment: 'Ultra-Luxury',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/290224/006660',
    handoverDate: 'December 2027',
    projectSize: '6.58 Acres (306 Residences)',
    noOfTowers: '2 High-Rise Towers',
    flatsPerFloor: '4 Residences per Floor',
    floorsHeight: '2B + G + 17 Floors',
    imageUrls: [imgWhitefieldTowers, imgVarthurLakefront, imgEastReady],
    features: [
      '25,000 Sq.Ft. Lakeview Imperial Clubhouse',
      'Temperature-Controlled Infinity Pool',
      'Sky-Lounge & Co-Working Pods',
      'Squash & Indoor Badminton Arena',
      'EV Fast-Charging Bays',
      '24/7 Tier-3 Biometric Security'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10:90 Construction Linked Plan Available*',
    createdAt: null
  },
  {
    id: 'curated_whitefield_resale_1',
    name: 'Brigade Woods Botanica',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    approvalBody: 'BBMP OC Received',
    floorPlan: '3 BHK Garden Suite (1690 Sq.Ft.) · 4 BHK Corner (2190 Sq.Ft.)',
    description: 'Ready-to-move boutique forest-themed residences nestled at Location: Whitefield ITPL Main Road (Pattandur Agrahara). Surrounded by 15+ native botanical tree species, offering immediate possession with Occupancy Certificate received and zero GST. Nearby Connectivity (Whitefield ITPL): Schools: Gopalan International School (2.3 km), Deens Academy Whitefield (1.8 km), Glentree Academy (2.9 km) | Hospitals: Vydehi Super Specialty Hospital (1.4 km), Manipal Hospital Whitefield (1.9 km), Aster Whitefield Hospital (2.5 km) | IT Hubs: Brigade Tech Gardens (0.8 km), ITPL Main Campus (1.2 km), EPIP Zone SAP Labs (1.6 km) | Malls: Park Square Mall ITPL (1.2 km), Nexus Shantiniketan Mall (2.1 km), Inorbit Mall (1.5 km) | Bus Stop & Transit: GR Tech Park BMTC Bus Stop (0.3 km), Pattandur Agrahara Metro Station (0.9 km).',
    price: 'Rs. 2.15 Cr - Rs. 3.40 Cr*',
    lastPrice: 'Rs. 2.22 Cr (Verified Resale)*',
    location: 'Whitefield ITPL Main Road (Pattandur Agrahara)',
    locationTarget: 'GR Tech Park Bus Stop (0.3 km) • Pattandur Metro (0.9 km) • ITPL (1.2 km)',
    zone: 'Whitefield',
    type: 'Resale',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Ready Luxury Resale',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180621/001912',
    handoverDate: 'Immediate Possession (OC Received)',
    projectSize: '6.3 Acres',
    noOfTowers: '14 Boutique Blocks',
    flatsPerFloor: '4 Flats per Floor',
    floorsHeight: 'B + G + 4 Floors',
    imageUrls: [imgEastReady, imgWhitefieldTowers, imgLuxuryResale],
    features: [
      'OC Received - Zero GST',
      'Forest Canopy Skywalk',
      'Temperature Controlled Lap Pool',
      'Organic Herb & Butterfly Sanctuary',
      'Tennis & Basketball Courts',
      '100% DG Power Backup'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Key Handover • Clear Resale Title*',
    createdAt: null
  },
  {
    id: 'curated_whitefield_rental_1',
    name: 'Total Environment Windmills of Your Mind',
    builderName: 'Total Environment',
    builderCategory: 'A+',
    approvalBody: 'BBMP OC Received',
    floorPlan: '3 BHK C20 Simplex + Garden (2450 Sq.Ft.) · 4 BHK D60 Duplex Villa (5924 Sq.Ft.)',
    description: 'Earth-sheltered handcrafted duplex sky-villas and simplexes at Location: Whitefield EPIP Zone (Nallurahalli Road), curated for expatriate and CXO corporate leases. Every residence features a private landscaped terrace garden, wooden deck, and water body. Nearby Connectivity (Whitefield EPIP): Schools:Vydehi School of Excellence (0.9 km), Gopalan National School (2.2 km), Deens Academy (2.5 km) | Hospitals: Vydehi Institute of Medical Sciences (0.8 km), Sri Sathya Sai Super Speciality Hospital (1.6 km), Manipal Hospital (2.4 km) | IT Hubs: SAP Labs Campus (1.1 km), Qualcomm & GE EPIP Zone (0.7 km), ITPL (2.2 km) | Malls: Inorbit Mall Whitefield (1.2 km), Nexus Shantiniketan (2.4 km), Phoenix Marketcity (5.5 km) | Bus Stop & Transit: Vydehi EPIP BMTC Bus Stop (0.3 km), Sri Sathya Sai Hospital Metro Station (1.1 km).',
    price: 'Rs. 1.35 L / month - Rs. 2.60 L / month*',
    lastPrice: 'Rs. 1.40 L / month (Corporate Lease)*',
    location: 'Whitefield EPIP Zone (Beside Vydehi & SAP Labs)',
    locationTarget: 'EPIP Bus Stop (0.3 km) • Vydehi Hospital (0.8 km) • Metro (1.1 km)',
    zone: 'Whitefield',
    type: 'Rental',
    propertyType: 'Villa',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Executive Rental',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/171015/000419',
    handoverDate: 'Ready for Immediate Lease',
    projectSize: '24.0 Acres',
    noOfTowers: '7 High-Rise Towers + Villas',
    flatsPerFloor: '2 Duplexes per Floor',
    floorsHeight: 'B + G + 19 Floors',
    imageUrls: [imgLuxuryResale, imgWhitefieldTowers, imgEastReady],
    features: [
      'Private Terrace Garden in Every Residence',
      'Windmills Craft Brewery & Jazz Theatre Access',
      'Centralized VRV Air Conditioning',
      'Imported Poggenpohl Modular Kitchen',
      'Squash, Tennis & Golf Simulator',
      'Concierge & Housekeeping Desk'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Expat & Corporate Lease Ready • Fully Furnished*',
    createdAt: null
  },

  // ================= HOSKOTE (Primary, Resale, Rental) =================
  {
    id: 'curated_hoskote_primary_1',
    name: 'Sobha Galera',
    builderName: 'Sobha Limited',
    builderCategory: 'A+',
    approvalBody: 'BMRDA / HPA & RERA Approved',
    floorPlan: '4 BHK Row Villa Dual Courtyard (3009 Sq.Ft.) · 4 BHK Triplex Villa (4340 Sq.Ft.)',
    description: 'Spanish-inspired boutique row villas at Location: Hoskote - Old Madras Road Corridor (Kannamangala - Ardendale Link). Crafted with terracotta roofs, private double-height courtyards, and serene pedestrian boulevards. Nearby Connectivity (Hoskote - OMR): Schools:Vibgyor High Kadugodi (3.2 km), Narayana E-Techno School Hoskote (4.1 km), Capstone High (3.8 km) | Hospitals: MVJ Medical College & Research Hospital (4.5 km), Manipal Hospital Whitefield (7.8 km), Ovum Woman & Child Hospital (3.9 km) | IT Hubs: Bearys Global Research Triangle (2.6 km), Aero SEZ & Budigere Tech Corridor (6.5 km), ITPL Whitefield (6.8 km) | Malls: Orion Uptown Mall OMR (3.4 km), SBR Lucky Mall (3.9 km), Nexus Shantiniketan (7.5 km) | Bus Stop & Transit: Kannamangala Gate BMTC Bus Stop (0.6 km), Kadugodi Tree Park Metro Station (4.2 km).',
    price: 'Rs. 4.65 Cr - Rs. 6.40 Cr*',
    lastPrice: 'Rs. 4.78 Cr onwards*',
    location: 'Hoskote - Old Madras Road (Kannamangala)',
    locationTarget: 'Kannamangala Bus Stop (0.6 km) • Orion Uptown Mall (3.4 km) • Kadugodi Metro (4.2 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Villa',
    configuration: ['4 BHK'],
    segment: 'Bespoke Row Villas',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/160123/005601',
    handoverDate: 'December 2026',
    projectSize: '4.08 Acres (40 Exclusive Row Villas)',
    noOfTowers: '40 Independent Row Villas',
    flatsPerFloor: 'Independent Triplex Units',
    floorsHeight: 'G + 2 Floors + Terrace',
    imageUrls: [imgHoskoteTownship, imgKasavanahalliVillas, imgEastEoi],
    features: [
      'Club Margarita Spanish Clubhouse',
      'Private Landscaped Backyard & Deck',
      '2 Covered Private Garage Bays per Villa',
      'Fountain Plaza & Reflexology Trail',
      'Solar Water Heating & Rainwater Harvesting',
      '24/7 Perimeter Intrusion Security'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Milestone Linked Builder Payment Plan*',
    createdAt: null
  },
  {
    id: 'curated_hoskote_resale_1',
    name: 'CJN Sai Fortune',
    builderName: 'CJN Properties',
    builderCategory: 'B',
    approvalBody: 'BMRDA / HPA OC Received',
    floorPlan: '2 BHK Smart (1115 Sq.Ft.) · 3 BHK Family (1465 Sq.Ft.)',
    description: 'Well-established ready-to-move gated community at Location: Hoskote Town - NH-75 Old Madras Road Corridor. Offering Vaastu-compliant corner apartments with clear resale documentation, immediate registration, and direct STRR connectivity. Nearby Connectivity (Hoskote NH-75): Schools:The Brigade School OMR (5.8 km), Global Residential School Hoskote (1.8 km), Citizen Public School (1.4 km) | Hospitals: MVJ Medical College & Super Specialty Hospital (1.5 km), Silicon City Hospital Hoskote (1.9 km), Mission Hospital (2.2 km) | IT Hubs & Hubs: Hoskote Auto & Logistics SEZ (2.8 km), Bearys Global Research Triangle (6.2 km), Whitefield ITPL (11.5 km) | Malls: Orion Uptown Mall OMR (5.4 km), Hoskote Town Central Plaza (1.2 km) | Bus Stop & Transit: Hoskote Toll Gate BMTC Bus Stop (0.4 km), Kadugodi Whitefield Metro Station (9.8 km).',
    price: 'Rs. 68 Lakhs - Rs. 96 Lakhs*',
    lastPrice: 'Rs. 72 Lakhs (Verified Resale)*',
    location: 'Hoskote Town - NH-75 Old Madras Road',
    locationTarget: 'Hoskote Toll Bus Stop (0.4 km) • MVJ Hospital (1.5 km) • Orion Uptown Mall (5.4 km)',
    zone: 'Hoskote',
    type: 'Resale',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Value Luxury Resale',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/181122/002159',
    handoverDate: 'Immediate Possession (OC Received)',
    projectSize: '2.5 Acres (216 Units)',
    noOfTowers: '3 Residential Wings',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: 'B + G + 11 Floors',
    imageUrls: [imgHoskoteTownship, imgSouthEastHanded, imgEastReady],
    features: [
      'Multi-Level Clubhouse & Gymnasium',
      'Swimming Pool & Toddlers Pool',
      'Landscaped Amphitheatre',
      'Children Play Park & Jogging Track',
      '24/7 CCTV Surveillance & Power Backup',
      'Cauvery & Borewell Dual Water Supply'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Bank Loan Approved across SBI & HDFC*',
    createdAt: null
  },
  {
    id: 'curated_hoskote_rental_1',
    name: 'Brigade Golden Triangle Signature',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    approvalBody: 'BMRDA & BBMP OC Received',
    floorPlan: '3 BHK Executive (1670 Sq.Ft.) · 3.5 BHK + Study (1980 Sq.Ft.)',
    description: 'Mixed-use landmark township at Location: Hoskote - Budigere Cross Junction on Old Madras Road (Kattamnallur). Semi-furnished sky-view apartments available for immediate family and corporate rental right beside Orion Uptown Mall. Nearby Connectivity (Hoskote - Budigere Cross): Schools:Vibgyor High Kadugodi (3.5 km), New Baldwin International School (2.1 km), One World International School (2.8 km) | Hospitals: East Point Medical College Hospital (4.2 km), MVJ Hospital (4.8 km), Manipal Hospital Whitefield (8.2 km) | IT Hubs: Signature Business Park on Campus (0.1 km), Bearys Global Research Triangle (2.9 km), Whitefield ITPL (7.4 km) | Malls: Orion Uptown Mall (0.1 km walk-in), SBR Lucky Mall (4.2 km) | Bus Stop & Transit: Budigere Cross BMTC Bus Stop (0.2 km), Whitefield (Kadugodi) Metro Station (5.6 km).',
    price: 'Rs. 45,000 / month - Rs. 68,000 / month*',
    lastPrice: 'Rs. 48,000 / month (Latest Lease)*',
    location: 'Hoskote - Budigere Cross OMR (Kattamnallur)',
    locationTarget: 'Orion Uptown Mall (0.1 km) • Budigere Cross Bus Stop (0.2 km) • Kadugodi Metro (5.6 km)',
    zone: 'Hoskote',
    type: 'Rental',
    propertyType: 'Apartment',
    configuration: ['3 BHK'],
    segment: 'Township Rental',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/171026/000912',
    handoverDate: 'Ready for Immediate Occupancy',
    projectSize: '20.0 Acres Integrated Township',
    noOfTowers: '7 Residential Towers',
    flatsPerFloor: '4 Flats per Floor',
    floorsHeight: '2B + G + 19 Floors',
    imageUrls: [imgHoskoteTownship, imgEastReady, imgLuxuryResale],
    features: [
      'Direct Access to Orion Uptown Mall',
      'Olympic-Size Swimming Pool & Spa',
      'Modular Kitchen with Hob & Chimney',
      'Tennis, Basketball & Badminton Courts',
      'Dedicated Covered Car Parking',
      '24/7 Township Security & Maintenance'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Immediate Key Handover • Family & Corporate Lease*',
    createdAt: null
  },

  // ================= VARTHUR (Primary, Resale, Rental) =================
  {
    id: 'curated_varthur_primary_1',
    name: 'Prestige Raintree Park',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    approvalBody: 'BDA & Karnataka RERA Approved',
    floorPlan: '3 BHK Regal (2005 Sq.Ft.) · 4 BHK + Maid (2540 Sq.Ft.) · 5 BHK Studio (3700 Sq.Ft.)',
    description: 'Flagship 107-acre integrated lakefront township at Location: Varthur Main Road (Opposite Varthur Lake, Whitefield-Varthur Corridor). Phase 1 offers ultra-luxury high-rise residences with panoramic water views and a 1,05,000 Sq.Ft. imperial clubhouse. Nearby Connectivity (Varthur): Schools:Greenwood High International (3.4 km), Chrysalis High Varthur (1.9 km), The Deens Academy (3.1 km), Inventure Academy (4.2 km) | Hospitals: Manipal Hospital Varthur Road (1.8 km), Sahasra Hospital Varthur (0.9 km), Columbia Asia Whitefield (3.2 km) | IT Hubs: Prestige Tech Park in Township (0.2 km), Sigma Soft Tech Park (1.4 km), ITPL Whitefield (4.8 km), RMZ Ecoworld (7.5 km) | Malls: Virginia Mall (1.6 km), Nexus Forum Value Mall (2.4 km), Nexus Shantiniketan (4.9 km) | Bus Stop & Transit: Varthur Kodi BMTC Bus Stop (0.3 km), Hope Farm Metro Station (4.5 km).',
    price: 'Rs. 2.85 Cr - Rs. 5.20 Cr*',
    lastPrice: 'Rs. 2.92 Cr onwards*',
    location: 'Varthur Main Road (Opposite Varthur Lake)',
    locationTarget: 'Varthur Kodi Bus Stop (0.3 km) • Manipal Hospital (1.8 km) • Greenwood High (3.4 km)',
    zone: 'Varthur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK', '5 BHK'],
    segment: 'Lakefront Mega Township',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/290824/006981',
    handoverDate: 'June 2028',
    projectSize: '21.0 Acres Phase 1 (1,520 Units)',
    noOfTowers: '18 Iconic Towers',
    flatsPerFloor: '4 Residences per Floor',
    floorsHeight: '2B + G + 19 Floors',
    imageUrls: [imgVarthurLakefront, imgWhitefieldTowers, imgSouthEastConst],
    features: [
      '1,05,000 Sq.Ft. Lakefront Imperial Clubhouse',
      'Sky-Bridge Jogging & Cycling Track',
      'Private Cinema, Bowling Alley & Squash Courts',
      'Heated Indoor Pool & Infinity Lap Pool',
      'Integrated Tech Park & Retail Mall in Township',
      'Lakefront Botanical Promenade'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Priority Allotment & Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_varthur_resale_1',
    name: 'Brigade Cornerstone Utopia (Eden & Serene)',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    approvalBody: 'BDA OC Received & RERA Verified',
    floorPlan: '2 BHK Luxe (1242 Sq.Ft.) · 3 BHK Regal (1656 Sq.Ft.) · 3 BHK Grand (1905 Sq.Ft.)',
    description: 'Award-winning 47-acre smart integrated township at Location: Varthur - Whitefield Main Road (Near Varthur Police Station). Handed-over residences available for immediate resale with multiplex, retail boulevard, office spaces, and lush central greens inside the campus. Nearby Connectivity (Varthur - Sarjapur Road): Schools:Greenwood High ICSE/IB (1.8 km), Oakridge International School (2.6 km), Inventure Academy (2.9 km), Chrysalis High (1.4 km) | Hospitals: Sahasra Hospital Varthur (1.1 km), Manipal Hospital Varthur Road (3.1 km), Belenus Champion Hospital (4.5 km) | IT Hubs: Wipro SEZ Kodathi (5.8 km), RGA Tech Park (6.2 km), ITPL Whitefield (6.4 km), Sigma Tech Park (2.9 km) | Malls: Utopia High-Street Retail & Multiplex (0.1 km on campus), Virginia Mall (3.2 km), Nexus Value Mall (3.8 km) | Bus Stop & Transit: Varthur Police Station BMTC Bus Stop (0.2 km), Kadugodi / Hope Farm Metro (5.9 km).',
    price: 'Rs. 1.58 Cr - Rs. 2.45 Cr*',
    lastPrice: 'Rs. 1.64 Cr (Verified Resale)*',
    location: 'Varthur - Whitefield Main Road (Varthur Town)',
    locationTarget: 'Varthur Bus Stop (0.2 km) • Greenwood High (1.8 km) • Manipal Hospital (3.1 km)',
    zone: 'Varthur',
    type: 'Resale',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Integrated Township Resale',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/181219/002236',
    handoverDate: 'Handed Over (Immediate Registration)',
    projectSize: '47.0 Acres Integrated Township',
    noOfTowers: '12 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 26 Floors',
    imageUrls: [imgVarthurLakefront, imgSouthEastHanded, imgEastReady],
    features: [
      'OC Received • Zero GST on Resale',
      '2 Grand Clubhouses & 3 Swimming Pools',
      'In-house Multiplex & Retail High Street',
      'Botanical Amphitheatre & Miyawaki Forest',
      'Smart Home Automation & EV Charging',
      'Walkable to International IB/ICSE Schools'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Clear Resale Title • Immediate Possession*',
    createdAt: null
  },
  {
    id: 'curated_varthur_rental_1',
    name: 'Prestige Lakeside Habitat',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    approvalBody: 'BDA OC Received',
    floorPlan: '3 BHK Apartment (1655 - 2321 Sq.Ft.) · 4 BHK Disney-Themed Villa (3117 Sq.Ft.)',
    description: '102-acre Disney-themed lakefront township at Location: Varthur - Gunjur Main Road overlooking Varthur Lake. Semi-furnished and fully-furnished luxury apartments and villas available for immediate corporate lease. Nearby Connectivity (Varthur - Gunjur): Schools:Oakridge International School (1.6 km), Greenwood High (1.9 km), Inventure Academy (2.2 km), Global Indian International School (2.5 km) | Hospitals: Sahasra Hospital Varthur (1.5 km), Manipal Hospital Varthur Road (3.8 km), Spandana Hospital (2.8 km) | IT Hubs: Wipro Corporate SEZ (5.2 km), RGA Tech Park Sarjapur Road (5.5 km), Cessna Business Park ORR (7.4 km), ITPL Whitefield (7.2 km) | Malls: Virginia Mall (3.9 km), Market Square Mall Sarjapur Road (5.6 km), Nexus Forum Value Mall (4.3 km) | Bus Stop & Transit: Gunjur - Varthur BMTC Bus Stop (0.3 km), Carmelaram Railway Station (4.4 km).',
    price: 'Rs. 68,000 / month - Rs. 1.35 L / month*',
    lastPrice: 'Rs. 72,000 / month (Latest Verified Lease)*',
    location: 'Varthur - Gunjur Main Road (Varthur Lakefront)',
    locationTarget: 'Gunjur-Varthur Bus Stop (0.3 km) • Oakridge School (1.6 km) • Wipro SEZ (5.2 km)',
    zone: 'Varthur',
    type: 'Rental',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Lakefront Township Rental',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/170915/000176',
    handoverDate: 'Ready for Immediate Move-In',
    projectSize: '102.0 Acres (80 Acres Open Space)',
    noOfTowers: '24 High-Rise Towers + 271 Villas',
    flatsPerFloor: '4 to 6 Flats per Floor',
    floorsHeight: '2B + G + 29 Floors',
    imageUrls: [imgVarthurLakefront, imgLuxuryResale, imgEastReady],
    features: [
      '80 Acres of Landscaped Open Greens',
      '4 Clubhouses & 4 Swimming Pools',
      'Cricket Pitch, Tennis, Golf Putting & Skating Rink',
      'In-Complex Supermarket, Pharmacy & Salon',
      'Modular Kitchen, Wardrobes & Geysers Installed',
      '24/7 Shuttle & Tier-3 Township Security'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Immediate Key Handover • Pet-Friendly Community*',
    createdAt: null
  },

  // ================= GUNJUR (Primary, Resale, Rental) =================
  {
    id: 'curated_gunjur_primary_1',
    name: 'Sobha Neopolis',
    builderName: 'Sobha Limited',
    builderCategory: 'A+',
    approvalBody: 'BBMP & BDA Approved',
    floorPlan: '3 BHK (1915 Sq.Ft.) · 3.5 BHK (2178 Sq.Ft.) · 4 BHK (2481 Sq.Ft.)',
    description: 'Meandering Santorini-themed luxury enclave nestled at Location: Gunjur - Panathur Main Road (Off Marathahalli-ORR Corridor). Designed with blue-domed Mediterranean architecture, cascading water plazas, and three iconic clubhouses totaling 77,850 Sq.Ft. Nearby Connectivity (Gunjur - Panathur): Schools:New Horizon Gurukul (3.2 km), VIBGYOR High Marathahalli (2.6 km), Chrysalis High Gunjur (2.8 km), Gear Innovative International (3.4 km) | Hospitals: Sakra World Hospital Bellandur (3.9 km), Manipal Hospital Varthur Road (4.1 km), Maya Multi Specialty Hospital (2.1 km) | IT Hubs: Embassy TechVillage ORR (3.4 km), Prestige Tech Park Kadubeesanahalli (2.9 km), Cessna Business Park (2.7 km), RMZ Ecoworld (4.2 km) | Malls: Brookfield Mall (4.8 km), Central Mall Bellandur (4.5 km), Virginia Mall (4.3 km) | Bus Stop & Transit: Panathur Dinne BMTC Bus Stop (0.5 km), Belandur Road Railway Station (1.2 km), Upcoming Kadubeesanahalli ORR Metro (2.8 km).',
    price: 'Rs. 2.48 Cr - Rs. 4.55 Cr*',
    lastPrice: 'Rs. 2.55 Cr onwards*',
    location: 'Gunjur - Panathur Main Road',
    locationTarget: 'Panathur Bus Stop (0.5 km) • Cessna Tech Park (2.7 km) • Sakra Hospital (3.9 km)',
    zone: 'Gunjur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Mediterranean Ultra-Luxury',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/200923/006269',
    handoverDate: 'December 2028',
    projectSize: '25.86 Acres (1,875 Residences)',
    noOfTowers: '19 Iconic Towers',
    flatsPerFloor: '4 Residences per Floor',
    floorsHeight: '2B + G + 18 Floors',
    imageUrls: [imgGunjurSanctuary, imgEastEoi, imgWhitefieldTowers],
    features: [
      '77,850 Sq.Ft. across 3 Signature Clubhouses',
      'Santorini Blue-Domed Piazza & Cascading Pools',
      'Indoor Heated Pool & Aqua Gym',
      'Co-Working Business Suites & Library',
      'Foliage Walkways & Pet Park',
      '100% Vaastu-Compliant Zero-Wall-Sharing Layouts'
    ],
    handoverStatus: 'EOI',
    paymentOffers: 'Priority EOI Window • Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_gunjur_resale_1',
    name: 'DSR Highland Greenz',
    builderName: 'DSR Infrastructure',
    builderCategory: 'A',
    approvalBody: 'BBMP OC Received & RERA Approved',
    floorPlan: '2 BHK Comfort (1106 Sq.Ft.) · 3 BHK Grand (1452 - 1756 Sq.Ft.)',
    description: 'Ready-to-move luxury gated apartment community at Location: Gunjur Palya - Sarjapur-Varthur Main Road. Surrounded by lush greenery and international schools, offering verified resale apartments with zero GST and immediate possession. Nearby Connectivity (Gunjur Palya): Schools:Chrysalis High Gunjur (0.9 km), Krupanidhi Group of Institutions (0.6 km), Greenwood High (2.4 km), Oakridge International (2.8 km) | Hospitals: Spandana Hospital Gunjur (1.2 km), Belenus Champion Hospital (3.8 km), Manipal Hospital Sarjapur Road (5.2 km) | IT Hubs: Wipro SEZ Kodathi (3.6 km), RGA Tech Park Sarjapur Road (4.1 km), Vaishnavi Tech Park (6.2 km) | Malls: Market Square Mall Sarjapur Road (4.5 km), Decathlon Anubhava Sarjapur Road (3.4 km), Virginia Mall (5.1 km) | Bus Stop & Transit: Gunjur Palya BMTC Bus Stop (0.2 km), Carmelaram Railway Station (2.9 km).',
    price: 'Rs. 1.18 Cr - Rs. 1.72 Cr*',
    lastPrice: 'Rs. 1.24 Cr (Verified Resale)*',
    location: 'Gunjur Palya - Varthur-Sarjapur Road',
    locationTarget: 'Gunjur Palya Bus Stop (0.2 km) • Chrysalis High (0.9 km) • Wipro SEZ (3.6 km)',
    zone: 'Gunjur',
    type: 'Resale',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Ready Gated Resale',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210219/003922',
    handoverDate: 'Immediate Possession (Handed Over)',
    projectSize: '9.5 Acres (889 Residences)',
    noOfTowers: '8 Residential Blocks',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 14 Floors',
    imageUrls: [imgGunjurSanctuary, imgSouthEastHanded, imgEastReady],
    features: [
      '30,000 Sq.Ft. Imperial Clubhouse',
      'Resort-Style Lap Pool & Kids Pool',
      'Cricket Practice Net & Tennis Court',
      'Open-Air Amphitheatre & Yoga Deck',
      'EV Charging & 24/7 DG Backup',
      'Direct Access to Sarjapur & Varthur IT Hubs'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Registration • Clear Title Verified*',
    createdAt: null
  },
  {
    id: 'curated_gunjur_rental_1',
    name: 'Candeur Landmark',
    builderName: 'Candeur Constructions',
    builderCategory: 'A',
    approvalBody: 'BBMP OC Received',
    floorPlan: '2 BHK Executive (1205 Sq.Ft.) · 3 BHK Corner (1675 Sq.Ft.)',
    description: 'High-rise residential community at Location: Gunjur - Varthur Main Road Junction (Opposite Prestige Lakeside Habitat). Semi-furnished corner apartments with modular kitchen, wardrobes, and panoramic views available for immediate family and IT professional lease. Nearby Connectivity (Gunjur Village): Schools:Chrysalis High Gunjur (1.1 km), Oakridge International (1.8 km), Greenwood High (2.1 km), Global Indian International School (2.3 km) | Hospitals: Sahasra Hospital (1.7 km), Spandana Hospital (1.4 km), Manipal Hospital Varthur Road (4.0 km) | IT Hubs: Wipro Corporate Campus (4.6 km), RGA Tech Park (4.9 km), Sigma Soft Tech Park (3.8 km), Cessna Tech Park (6.8 km) | Malls: Virginia Mall Whitefield (4.1 km), Nexus Value Mall (4.5 km), Market Square Mall (5.0 km) | Bus Stop & Transit: Gunjur Bus Depot & BMTC Stop (0.2 km), Carmelaram Station (3.8 km).',
    price: 'Rs. 46,000 / month - Rs. 68,000 / month*',
    lastPrice: 'Rs. 49,000 / month (Verified Lease)*',
    location: 'Gunjur - Varthur Main Road Junction',
    locationTarget: 'Gunjur Bus Stop (0.2 km) • Chrysalis High (1.1 km) • Wipro Campus (4.6 km)',
    zone: 'Gunjur',
    type: 'Rental',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Executive High-Rise Rental',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/190131/002327',
    handoverDate: 'Ready for Immediate Lease',
    projectSize: '11.5 Acres (868 Units)',
    noOfTowers: '5 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 23 Floors',
    imageUrls: [imgGunjurSanctuary, imgEastReady, imgLuxuryResale],
    features: [
      '27,000 Sq.Ft. 4-Level Clubhouse',
      'Half-Olympic Swimming Pool & Jacuzzi',
      'Skating Rink, Tennis & Basketball Courts',
      'Supermarket, Creche & Salon Inside Campus',
      'Semi-Furnished with Wardrobes, Chimney & Geysers',
      'Covered Car Parking & 24/7 Security'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Immediate Occupancy • Family & Corporate Tenants*',
    createdAt: null
  },

  // ================= HOSA ROAD (Primary, Resale, Rental) =================
  {
    id: 'curated_hosaroad_primary_1',
    name: 'Assetz Canvas & Cove Phase 2',
    builderName: 'Assetz Property Group',
    builderCategory: 'A',
    approvalBody: 'BBMP & BDA Approved',
    floorPlan: '3 BHK Lakeview (1503 Sq.Ft.) · 3 BHK Luxe (1833 Sq.Ft.) · 4 BHK (2185 Sq.Ft.)',
    description: 'Biophilic lakefront high-rise enclave at Location: Hosa Road - Begur Lakefront Corridor (Off Hosur Road), overlooking a serene 52-acre natural lake. Designed with 85% open green spaces, zero-carbon water recycling, and direct access to Hosa Road Metro Station. Nearby Connectivity (Hosa Road): Schools:PES University EC Campus (2.2 km), Vibgyor High Electronic City (2.8 km), Orchids The International School (2.4 km), Notre Dame Academy (1.6 km) | Hospitals: Springleaf Hospital (2.5 km), Kauvery Hospital Electronic City (3.2 km), Narayana Institute of Cardiac Sciences (6.4 km), Motherhood Hospital (4.8 km) | IT Hubs: Infosys HQ Electronic City Phase 1 (3.8 km), Wipro Electronic City (4.2 km), Tech Mahindra & TCS (4.5 km), RMZ Ecospace Bellandur (7.9 km) | Malls: M5 Ecity Mall (3.4 km), Royal Meenakshi Mall (6.8 km), Market Square Mall (6.5 km) | Bus Stop & Transit: Hosa Road Junction BMTC Bus Stop (1.4 km), Hosa Road Yellow Line Metro Station (1.6 km).',
    price: 'Rs. 1.72 Cr - Rs. 2.55 Cr*',
    lastPrice: 'Rs. 1.78 Cr onwards*',
    location: 'Hosa Road - Begur Lakefront Corridor',
    locationTarget: 'Hosa Road Bus Stop (1.4 km) • Hosa Road Metro (1.6 km) • Infosys E-City (3.8 km)',
    zone: 'Hosa Road',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Eco-Luxury Lakefront',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/050723/006035',
    handoverDate: 'March 2028',
    projectSize: '17.0 Acres Lakefront Enclave',
    noOfTowers: '6 High-Rise Towers',
    flatsPerFloor: '6 Residences per Floor',
    floorsHeight: '2B + G + 27 Floors',
    imageUrls: [imgHosaRoadSkyline, imgSouthEastConst, imgVarthurLakefront],
    features: [
      'Overlooking 52-Acre Natural Lake',
      '2.5-Acre Central Biophilic Park',
      'Waterside Infinity Pool & Sunset Deck',
      'Bouldering Wall, Padel & Squash Courts',
      'Outdoor Co-Working Pods with High-Speed Wi-Fi',
      '5 Mins to Hosa Road Yellow Line Metro'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Builder Subvention & Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_hosaroad_resale_1',
    name: 'SNN Raj Etternia',
    builderName: 'SNN Builders',
    builderCategory: 'A',
    approvalBody: 'BDA & BBMP OC Received',
    floorPlan: '3 BHK Classic (1810 Sq.Ft.) · 3 BHK + Maid (2135 Sq.Ft.) · 4 BHK Penthouse (3120 Sq.Ft.)',
    description: 'Landmark hilltop-inspired ready-to-move luxury community at Location: Hosa Road - Haralur Link Road (PWD Quarters / Silver County Road). Offering panoramic views of Kasavanahalli and Hosa Road lakes with a massive 50,000 Sq.Ft. clubhouse and zero GST resale units. Nearby Connectivity (Hosa Road - Haralur): Schools:Vibgyor High Haralur (1.4 km), Orchids International School (1.8 km), Cambridge Public School HSR (2.9 km), Freedom International HSR (3.2 km) | Hospitals: Manipal Hospital Sarjapur Road (3.8 km), Kauvery Hospital (3.5 km), Narayana Multispeciality HSR (3.1 km), Motherhood Sarjapur (3.6 km) | IT Hubs: AMR Tech Park Hosur Road (4.1 km), RMZ Ecospace Bellandur (4.8 km), Wipro Corporate Office Sarjapur Road (4.4 km), Electronic City Phase 1 (5.5 km) | Malls: Market Square Mall Sarjapur Road (3.9 km), M5 Ecity Mall (4.8 km), HSR High Street (3.0 km) | Bus Stop & Transit: Haralur Cross / Silver County BMTC Bus Stop (0.4 km), Hosa Road Metro Station (2.9 km).',
    price: 'Rs. 2.05 Cr - Rs. 3.25 Cr*',
    lastPrice: 'Rs. 2.12 Cr (Verified Resale)*',
    location: 'Hosa Road - Haralur Link Road (Silver County)',
    locationTarget: 'Haralur Bus Stop (0.4 km) • Vibgyor High (1.4 km) • Hosa Road Metro (2.9 km)',
    zone: 'Hosa Road',
    type: 'Resale',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Signature Resale',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/171015/000492',
    handoverDate: 'Immediate Possession (OC Received)',
    projectSize: '14.0 Acres (780 Residences)',
    noOfTowers: '11 High-Rise Towers',
    flatsPerFloor: '4 Flats per Floor',
    floorsHeight: '2B + G + 19 Floors',
    imageUrls: [imgHosaRoadSkyline, imgSouthEastHanded, imgLuxuryResale],
    features: [
      'OC Received • Clear Direct Resale Title',
      '50,000 Sq.Ft. Luxury Clubhouse & Spa',
      '3 Swimming Pools including Heated Indoor Pool',
      'Squash, Tennis, Cricket Net & Mini Golf',
      'Dual-Lake Panoramic Views from Balconies',
      '100% DG Backup & Piped Gas'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Immediate Key Handover • Bank Loan Approved*',
    createdAt: null
  },
  {
    id: 'curated_hosaroad_rental_1',
    name: 'Purva Skywood',
    builderName: 'Puravankara Limited',
    builderCategory: 'A+',
    approvalBody: 'BDA & BBMP OC Received',
    floorPlan: '3 BHK Comfort (1666 Sq.Ft.) · 3 BHK Grand (1929 Sq.Ft.) · 4 BHK (2340 Sq.Ft.)',
    description: 'Sprawling 12.8-acre handed-over residential sanctuary at Location: Hosa Road - Off Sarjapur Haralur Corridor (Lakedew Residency Road). Surrounded by 80% open botanical gardens and Japanese zen ponds, available for immediate family and corporate rental. Nearby Connectivity (Hosa Road - Haralur): Schools:Vibgyor High Haralur (0.8 km), National Public School HSR (3.4 km), EuroSchool HSR (2.9 km) | Hospitals: Narayana Multispeciality Hospital HSR (2.8 km), Manipal Hospital Sarjapur Road (3.5 km), Motherhood Hospital (3.2 km) | IT Hubs: RMZ Ecospace Bellandur (4.2 km), Wipro Corporate HQ (3.9 km), Vaishnavi Tech Park (3.6 km), AMR Tech Park (3.8 km) | Malls: Market Square Mall (3.5 km), Central Mall Bellandur (4.4 km), HSR Sector 2 High Street (2.6 km) | Bus Stop & Transit: Haralur Lakedew BMTC Bus Stop (0.3 km), Kudlu Gate & Hosa Road Metro Stations (2.8 km).',
    price: 'Rs. 62,000 / month - Rs. 88,000 / month*',
    lastPrice: 'Rs. 65,000 / month (Verified Lease)*',
    location: 'Hosa Road - Haralur Main Road (Lakedew Corridor)',
    locationTarget: 'Haralur Bus Stop (0.3 km) • Vibgyor School (0.8 km) • Hosa Road Metro (2.8 km)',
    zone: 'Hosa Road',
    type: 'Rental',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Executive Garden Rental',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/170921/000318',
    handoverDate: 'Ready for Immediate Move-In',
    projectSize: '12.81 Acres (728 Units)',
    noOfTowers: '7 High-Rise Towers',
    flatsPerFloor: '4 Flats per Floor',
    floorsHeight: '2B + G + 20 Floors',
    imageUrls: [imgHosaRoadSkyline, imgEastReady, imgLuxuryResale],
    features: [
      'Japanese Zen Garden & Koi Pond',
      'Full-Size Swimming Pool & Wellness Club',
      'Tennis, Basketball & Cricket Practice Pitch',
      'Semi-Furnished with Modular Kitchen & Wardrobes',
      'In-Complex Supermarket & Children Daycare',
      '24/7 Tier-3 Security & Full Power Backup'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Immediate Key Handover • Corporate Lease Ready*',
    createdAt: null
  },

  // ================= KASAVANAHALLI (Primary, Resale, Rental) =================
  {
    id: 'curated_kasavanahalli_primary_1',
    name: 'Assetz 63 Degree East (Tower D & E)',
    builderName: 'Assetz Property Group',
    builderCategory: 'A',
    approvalBody: 'BMRDA / BBMP & RERA Approved',
    floorPlan: '3 BHK Smart (1458 Sq.Ft.) · 3 BHK Luxe (1785 Sq.Ft.) · 4 BHK (2210 Sq.Ft.)',
    description: 'Sustainable eco-luxury residential township at Location: Kasavanahalli - Off Sarjapur Road Corridor (Kodathi - Kasavanahalli Link). Designed with 68% open green spaces, 15+ outdoor sports courts, and high-efficiency layouts minutes from Wipro Corporate Office. Nearby Connectivity (Kasavanahalli - Off Sarjapur): Schools:Delhi Public School (DPS) East (2.2 km), Prakriya Green Wisdom School (1.8 km), Harvest International School (1.6 km), Asia Pacific World School (2.9 km) | Hospitals: Belenus Champion Hospital (2.4 km), Motherhood Hospital Sarjapur Road (3.1 km), Manipal Hospital Sarjapur Road (3.8 km), Sakra World Hospital (5.4 km) | IT Hubs: Wipro SEZ Campus (1.9 km), RGA Tech Park (2.1 km), RMZ Ecoworld Bellandur (4.8 km), Vaishnavi Tech Park (4.2 km) | Malls: Market Square Mall Sarjapur Road (2.9 km), Decathlon Sarjapur Road (1.7 km), Central Mall Bellandur (5.1 km) | Bus Stop & Transit: Kasavanahalli / Kodathi Gate BMTC Bus Stop (0.5 km), Carmelaram Railway Station (2.2 km), Upcoming Iblur ORR Metro (4.8 km).',
    price: 'Rs. 1.65 Cr - Rs. 2.48 Cr*',
    lastPrice: 'Rs. 1.72 Cr onwards*',
    location: 'Kasavanahalli - Off Sarjapur Road Corridor',
    locationTarget: 'Kasavanahalli Bus Stop (0.5 km) • Wipro SEZ (1.9 km) • Manipal Hospital (3.8 km)',
    zone: 'Kasavanahalli',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Sustainable Luxury',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/210928/004318',
    handoverDate: 'December 2026',
    projectSize: '17.7 Acres Township',
    noOfTowers: '5 High-Rise Towers',
    flatsPerFloor: '8 Residences per Floor',
    floorsHeight: '2B + G + 14 Floors',
    imageUrls: [imgKasavanahalliVillas, imgSouthEastConst, imgGunjurSanctuary],
    features: [
      '40,000 Sq.Ft. Dual-Clubhouse Precinct',
      '4 Swimming Pools including Lap & Heated Pools',
      'Padel, Squash, Tennis & Futsal Courts',
      'Organic Community Farming & Miyawaki Forest',
      'Dedicated Co-Working Lounge',
      'IGBC Gold Pre-Certified Green Homes'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10:90 Flexi Payment Plan Available*',
    createdAt: null
  },
  {
    id: 'curated_kasavanahalli_resale_1',
    name: 'PSR Aster Villas & Residences',
    builderName: 'PSR Group & Puravankara',
    builderCategory: 'A',
    approvalBody: 'BBMP OC Received & RERA Verified',
    floorPlan: '3 BHK Boutique Residence (1790 Sq.Ft.) · 4 BHK Triplex Villa (3250 Sq.Ft.)',
    description: 'Boutique earth-toned luxury villas and low-density residences at Location: Kasavanahalli Main Road (Adjacent to Kasavanahalli Lake & HSR Extension). Offering private landscaped plunge decks, Italian marble flooring, and clear resale title. Nearby Connectivity (Kasavanahalli Main Road): Schools:Asia Pacific World School (0.8 km), Vibgyor High Haralur (1.5 km), BRS Global School (0.6 km), Orchids International School (1.4 km) | Hospitals: Manipal Hospital Sarjapur Road (2.1 km), Motherhood Hospital (1.9 km), Cloudnine Hospital Bellandur (3.2 km), Sakra World Hospital (4.1 km) | IT Hubs: Wipro Corporate HQ (1.8 km), Vaishnavi Tech Park (2.2 km), RMZ Ecospace & Ecoworld Bellandur (3.4 km), RGA Tech Park (2.9 km) | Malls: Market Square Mall Sarjapur Road (1.7 km), Central Mall Bellandur (3.3 km), Total Mall Sarjapur Road (1.9 km) | Bus Stop & Transit: Kasavanahalli Lake BMTC Bus Stop (0.2 km), Upcoming Iblur Junction Metro Station (2.6 km).',
    price: 'Rs. 2.65 Cr - Rs. 4.40 Cr*',
    lastPrice: 'Rs. 2.75 Cr (Verified Resale)*',
    location: 'Kasavanahalli Main Road (Beside Kasavanahalli Lake)',
    locationTarget: 'Kasavanahalli Bus Stop (0.2 km) • Market Square Mall (1.7 km) • Wipro HQ (1.8 km)',
    zone: 'Kasavanahalli',
    type: 'Resale',
    propertyType: 'Villa',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Boutique Villa Resale',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/190524/002578',
    handoverDate: 'Immediate Possession (OC Received)',
    projectSize: '5.2 Acres Gated Enclave',
    noOfTowers: 'Boutique Villas & Low-Rise Blocks',
    flatsPerFloor: 'Independent Villas & 2 per Floor',
    floorsHeight: 'G + 2 Triplex / G + 4',
    imageUrls: [imgKasavanahalliVillas, imgLuxuryResale, imgSouthEastHanded],
    features: [
      'OC Received • Zero GST on Resale',
      'Private Terrace Deck & Landscaped Garden',
      'Clubhouse with Heated Pool & Gymnasium',
      'Cobblestone Boulevards & Frangipani Avenue',
      '2 Covered Private Car Parks per Unit',
      'Walking Distance to Kasavanahalli Lake Park'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Direct Owner Verified Resale • Immediate Registration*',
    createdAt: null
  },
  {
    id: 'curated_kasavanahalli_rental_1',
    name: 'Bren Imperia',
    builderName: 'Bren Corporation',
    builderCategory: 'A',
    approvalBody: 'BBMP OC Received',
    floorPlan: '3 BHK Executive (1745 Sq.Ft.) · 3.5 BHK Luxe (1990 Sq.Ft.)',
    description: 'Handed-over contemporary luxury apartment enclave at Location: Kasavanahalli - Haralur Main Road. Semi-furnished Vaastu-compliant corner units available for immediate executive rental with proximity to RMZ Ecoworld and Wipro SEZ. Nearby Connectivity (Kasavanahalli - Haralur): Schools:Vibgyor High Haralur (0.7 km), Asia Pacific World School (1.1 km),Amrita Vidyalayam (1.6 km), National Public School HSR (3.5 km) | Hospitals: Motherhood Hospital Sarjapur Road (1.8 km), Manipal Hospital Sarjapur Road (2.0 km), Sakra World Hospital (3.9 km), Narayana Multispeciality HSR (3.0 km) | IT Hubs: Wipro Corporate HQ (1.6 km), Vaishnavi Tech Park (2.0 km), RMZ Ecospace Bellandur (3.1 km), Embassy TechVillage (4.2 km) | Malls: Market Square Mall (1.6 km), Soul Space Spirit Centro Mall Bellandur (3.0 km), HSR High Street (2.8 km) | Bus Stop & Transit: Kasavanahalli Cross BMTC Bus Stop (0.3 km), Upcoming Iblur Metro Station (2.4 km).',
    price: 'Rs. 65,000 / month - Rs. 85,000 / month*',
    lastPrice: 'Rs. 68,000 / month (Latest Verified Lease)*',
    location: 'Kasavanahalli - Haralur Main Road',
    locationTarget: 'Kasavanahalli Bus Stop (0.3 km) • Wipro HQ (1.6 km) • Manipal Hospital (2.0 km)',
    zone: 'Kasavanahalli',
    type: 'Rental',
    propertyType: 'Apartment',
    configuration: ['3 BHK'],
    segment: 'Executive Tech-Belt Rental',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/171028/000841',
    handoverDate: 'Ready for Immediate Lease',
    projectSize: '8.5 Acres (476 Residences)',
    noOfTowers: '6 High-Rise Towers',
    flatsPerFloor: '4 Flats per Floor',
    floorsHeight: '2B + G + 15 Floors',
    imageUrls: [imgKasavanahalliVillas, imgEastReady, imgSouthEastHanded],
    features: [
      'Resort-Style Infinity Pool & Clubhouse',
      'Championship Tennis, Badminton & Squash Courts',
      'Semi-Furnished with Designer Wardrobes & Modular Kitchen',
      'Rooftop Sky-Track & Meditation Pavilion',
      '2 Covered Car Parks & EV Charging Point',
      '100% DG Power Backup & 24/7 Security'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Immediate Key Handover • Corporate & Family Lease*',
    createdAt: null
  },

  // ================= ADDITIONAL PRIMARY PROJECTS ACROSS CAT A+, A, B, C BUILDERS =================

  // --- CATEGORY A+ PRIMARY PROJECTS (Tier-1 Flagship Developers) ---
  {
    id: 'curated_primary_aplus_godrej_woodscapes',
    name: 'Godrej Woodscapes',
    builderName: 'Godrej Properties',
    builderCategory: 'A+',
    approvalBody: 'BBMP / BMRDA & Karnataka RERA Approved',
    floorPlan: '3 BHK Luxe (1998 Sq.Ft.) · 3.5 BHK Regal (2415 Sq.Ft.) · 4 BHK + Maid (2898 Sq.Ft.)',
    description: 'Forest-themed landmark township at Location: Whitefield - Budigere Cross Junction (Old Madras Road Corridor) featuring 1,500+ fully grown native trees, a 68,000 Sq.Ft. imperial clubhouse, and high-street retail boulevard. Nearby Connectivity (Whitefield - Budigere Cross): Schools: Vibgyor High Kadugodi (3.4 km), New Baldwin International School (2.0 km), One World International School (2.6 km) | Hospitals: Manipal Hospital Whitefield (7.9 km), East Point Hospital (4.1 km), MVJ Medical College Hospital (4.7 km) | IT Hubs: Bearys Global Research Triangle (2.7 km), ITPL Whitefield (7.1 km), Aero SEZ Budigere (8.4 km) | Malls: Orion Uptown Mall OMR (0.2 km walk), SBR Lucky Mall (4.0 km), Nexus Shantiniketan (7.4 km) | Bus Stop & Transit: Budigere Cross BMTC Bus Stop (0.2 km), Kadugodi Tree Park Metro Station (5.4 km).',
    price: 'Rs. 2.15 Cr - Rs. 3.45 Cr*',
    lastPrice: 'Rs. 2.22 Cr onwards*',
    location: 'Whitefield - Budigere Cross (Old Madras Road)',
    locationTarget: 'Budigere Cross Bus Stop (0.2 km) • Orion Uptown Mall (0.2 km) • Kadugodi Metro (5.4 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '3.5 BHK', '4 BHK'],
    segment: 'Ultra-Luxury Forest Township',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/170524/006882',
    handoverDate: 'December 2028',
    projectSize: '28.15 Acres (2,400 Residences)',
    noOfTowers: '15 High-Rise Towers',
    flatsPerFloor: '4 Corner Flats per Floor',
    floorsHeight: '2B + G + 38 Floors',
    imageUrls: [imgCatAPlusTowers, imgWhitefieldTowers, imgEastEoi],
    features: [
      '68,000 Sq.Ft. Forest-Themed Clubhouse',
      'Sky-Deck Infinity Pool & Heated Lap Pool',
      '3-Acre Central Botanical Forest Walk',
      'Integrated High-Street Retail Plaza',
      'Indoor Badminton, Squash & Padel Courts',
      '100% Vaastu Corner Residences with Private Foyer'
    ],
    handoverStatus: 'EOI',
    paymentOffers: '20:80 Builder Subvention & CLP Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_aplus_brigade_sanctuary',
    name: 'Brigade Sanctuary',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    approvalBody: 'BDA & Karnataka RERA Approved',
    floorPlan: '3 BHK Classic (1650 Sq.Ft.) · 3 BHK Grand (2027 Sq.Ft.) · 4 BHK Luxe (2491 Sq.Ft.)',
    description: 'Nature-first luxury residential enclave at Location: Varthur - Sarjapur Main Road (Dommasandra Circle Link), preserving 500+ heritage trees and 80% open landscaped greens right in the education and IT belt. Nearby Connectivity (Varthur - Sarjapur Road): Schools: Greenwood High International (1.1 km), Oakridge International School (1.4 km), Inventure Academy (1.7 km), TISB (2.2 km) | Hospitals: Manipal Hospital Varthur Road (4.4 km), Sahasra Hospital Varthur (2.8 km), Belenus Champion Hospital (4.1 km) | IT Hubs: Wipro SEZ Kodathi (4.5 km), RGA Tech Park Sarjapur Road (4.9 km), Prestige Tech Park (8.2 km), ITPL Whitefield (8.8 km) | Malls: Virginia Mall (5.2 km), Market Square Mall Sarjapur Road (5.4 km), Decathlon Sarjapur Road (4.0 km) | Bus Stop & Transit: Dommasandra / Sulikunte BMTC Bus Stop (0.2 km), Carmelaram Station (4.2 km).',
    price: 'Rs. 1.98 Cr - Rs. 3.18 Cr*',
    lastPrice: 'Rs. 2.06 Cr onwards*',
    location: 'Varthur - Sarjapur Main Road (Dommasandra)',
    locationTarget: 'Dommasandra Bus Stop (0.2 km) • Greenwood High (1.1 km) • Wipro SEZ (4.5 km)',
    zone: 'Varthur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Biophilic Ultra-Luxury',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/041123/006372',
    handoverDate: 'December 2028',
    projectSize: '14.0 Acres (1,275 Units)',
    noOfTowers: '8 Iconic Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 27 Floors',
    imageUrls: [imgCatAPlusTowers, imgVarthurLakefront, imgGunjurSanctuary],
    features: [
      '35,000 Sq.Ft. Natural Stone Clubhouse',
      '500+ Preserved Heritage Trees & Canopy Walk',
      'Olympic-Length Lap Pool & Kids Aqua Zone',
      'Amphitheatre, Tennis & Cricket Nets',
      'Co-Working Pods & Private Mini Theatre',
      'Walkable to Top International IB/ICSE Schools'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10% Booking • Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_aplus_lodha_azur',
    name: 'Lodha Azur',
    builderName: 'Lodha Group (Macrotech)',
    builderCategory: 'A+',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '3 BHK Regal (1950 Sq.Ft.) · 3.5 BHK Luxe (2300 Sq.Ft.) · 4 BHK Sky Villa (3050 Sq.Ft.)',
    description: 'Ultra-luxury waterfront residential landmark at Location: Hosa Road - Begur / Akshayanagar Lakefront Corridor, overlooking the serene Hullimavu-Begur Lake with expansive wrap-around sundecks and Club Saint Amand hospitality. Nearby Connectivity (Hosa Road - Begur Lakefront): Schools: Vibgyor High Electronic City / BTM (1.8 km), National Public School Gottigere (2.6 km), Notre Dame Academy (2.1 km), Mitra Academy (2.4 km) | Hospitals: Fortis Hospital Bannerghatta (3.2 km), Apollo Hospital (3.5 km), Kauvery Hospital Electronic City (4.6 km) | IT Hubs: Infosys Electronic City Phase 1 (5.4 km), Kalyani Magnum Tech Park (4.1 km), AMR Tech Park Hosur Road (3.8 km), RMZ Ecospace (8.2 km) | Malls: Royal Meenakshi Mall (2.4 km), Vega City Mall (4.2 km), M5 Ecity Mall (4.9 km) | Bus Stop & Transit: Begur Koppa Road BMTC Bus Stop (0.3 km), Hosa Road & Hulimavu Metro Stations (2.5 km).',
    price: 'Rs. 2.65 Cr - Rs. 4.30 Cr*',
    lastPrice: 'Rs. 2.74 Cr onwards*',
    location: 'Hosa Road - Begur Lakefront Corridor',
    locationTarget: 'Begur Bus Stop (0.3 km) • Royal Meenakshi Mall (2.4 km) • Hosa Road Metro (2.5 km)',
    zone: 'Hosa Road',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '3.5 BHK', '4 BHK'],
    segment: 'Waterfront Ultra-Luxury',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/210324/006728',
    handoverDate: 'April 2028',
    projectSize: '10.2 Acres Waterfront Estate',
    noOfTowers: '4 Super-Luxury Towers',
    flatsPerFloor: '4 Corner Residences per Floor',
    floorsHeight: '2B + G + 28 Floors',
    imageUrls: [imgCatAPlusTowers, imgHosaRoadSkyline, imgVarthurLakefront],
    features: [
      'Private Lakefront Promenade & Jetty Deck',
      'Saint Amand 5-Star Hospitality Concierge',
      'Heated Infinity Pool Overlooking Natural Lake',
      'Private Dining Lounge & Cigar Room',
      'Indoor Badminton, Squash & Pilates Studio',
      'Private Elevator Foyers in Select 4 BHKs'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Flexi Milestone Payment Plan Available*',
    createdAt: null
  },
  {
    id: 'curated_primary_aplus_te_tangled_green',
    name: 'Total Environment Tangled Up in Green',
    builderName: 'Total Environment',
    builderCategory: 'A+',
    approvalBody: 'BMRDA / STRR & RERA Approved',
    floorPlan: 'Villa Plots: 1800 Sq.Ft. (30x60) · 2400 Sq.Ft. (40x60) · 3200 Sq.Ft. Custom Earth Villa Plots',
    description: 'Handcrafted botanical plotted villa estate at Location: Hoskote - Devanahalli STRR Link Corridor, featuring a 10-acre central tree museum, eucalyptus boulevard, underground utilities, and red-brick clubhouse. Nearby Connectivity (Hoskote STRR Corridor): Schools: Akash International School (4.2 km), Sterling English School (3.5 km), Vibgyor High (7.8 km) | Hospitals: MVJ Medical College & Research Hospital (6.5 km), Ramaiah Leena Hospital (5.2 km), Manipal Hospital (11.2 km) | IT Hubs: Aerospace SEZ & KIADB Hardware Park (5.8 km), Hoskote Logistics & Auto Hub (6.0 km), Bearys Global Research Triangle (8.5 km) | Malls: Orion Uptown Mall OMR (8.2 km), Galleria Mall (11.5 km) | Bus Stop & Transit: STRR Junction BMTC Bus Stop (0.4 km), Upcoming STRR / Airport Metro Link (4.8 km).',
    price: 'Rs. 1.68 Cr - Rs. 3.40 Cr*',
    lastPrice: 'Rs. 1.75 Cr onwards*',
    location: 'Hoskote - STRR Botanical Corridor',
    locationTarget: 'STRR Bus Stop (0.4 km) • Aerospace SEZ (5.8 km) • MVJ Hospital (6.5 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['Plots', '3 BHK', '4 BHK'],
    segment: 'Bespoke Botanical Villa Plots',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/080124/006538',
    handoverDate: 'Ready for Villa Construction (2026)',
    projectSize: '115.0 Acres Botanical Estate',
    noOfTowers: '968 Curated Villa Plots',
    flatsPerFloor: '1800 to 5000 Sq.Ft. Plots',
    floorsHeight: 'Custom G + 2 Earth Villas',
    imageUrls: [imgLuxuryPlotEstate, imgHoskoteTownship, imgCatABiophilic],
    features: [
      '10-Acre Tree Museum & Botanical Sanctuary',
      'Cobblestone Boulevards & Cycling Trails',
      'Earth-Sheltered Clubhouse & Craft Brewery',
      'Underground Fiber, Power & Water Lines',
      'Amphitheatre, Tennis & Equestrian Trail',
      'Direct STRR 6-Lane Expressway Connectivity'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Plot Registration & Bank Loan Approved*',
    createdAt: null
  },

  // --- CATEGORY A PRIMARY PROJECTS (Premier Regional & Corporate Builders) ---
  {
    id: 'curated_primary_a_sumadhura_folium',
    name: 'Sumadhura Folium Phase 2',
    builderName: 'Sumadhura Infracon',
    builderCategory: 'A',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '3 BHK Lakeview (1685 Sq.Ft.) · 3.5 BHK Regal (2015 Sq.Ft.) · 4 BHK Luxe (2540 Sq.Ft.)',
    description: 'Biophilic lakefront high-rise enclave at Location: Whitefield Borewell Road (Nallurahalli - Siddapura Lakefront), bordered by 500+ meters of serene lake promenade and 82% open green gardens. Nearby Connectivity (Whitefield Borewell Road): Schools: Deens Academy Whitefield (1.4 km), Vydehi School of Excellence (1.9 km), Glentree Academy (1.6 km), Ryan International (2.8 km) | Hospitals: Manipal Hospital Varthur Road (1.6 km), Vydehi Super Specialty Hospital (2.1 km), Columbia Asia Whitefield (1.9 km) | IT Hubs: Sigma Soft Tech Park (1.1 km), ITPL / ITPB Whitefield (2.8 km), EPIP Zone SAP Labs (2.3 km), Brigade Tech Gardens (2.5 km) | Malls: Virginia Mall (1.4 km), Inorbit Mall Whitefield (2.2 km), Nexus Forum Shantiniketan (2.9 km) | Bus Stop & Transit: Borewell Road / Nallurahalli BMTC Bus Stop (0.3 km), Nallurahalli Metro Station (1.8 km).',
    price: 'Rs. 2.08 Cr - Rs. 3.35 Cr*',
    lastPrice: 'Rs. 2.16 Cr onwards*',
    location: 'Whitefield Borewell Road (Nallurahalli Lakefront)',
    locationTarget: 'Borewell Rd Bus Stop (0.3 km) • Manipal Hospital (1.6 km) • Nallurahalli Metro (1.8 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Lakefront Premium Luxury',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180923/006262',
    handoverDate: 'December 2027',
    projectSize: '16.5 Acres Lakefront Campus',
    noOfTowers: '5 High-Rise Towers',
    flatsPerFloor: '4 Residences per Floor',
    floorsHeight: '2B + G + 29 Floors',
    imageUrls: [imgCatABiophilic, imgWhitefieldTowers, imgVarthurLakefront],
    features: [
      '50,000 Sq.Ft. Floating-Style Clubhouse',
      '500m Private Lakefront Jogging Promenade',
      'Heated Indoor Swimming Pool & Spa',
      'Sky-Cinema, Squash & Indoor Badminton',
      'Smart Biometric Locks & EV Charging Bays',
      '5 Mins from Whitefield ITPL & Metro'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10:90 No Pre-EMI Scheme Available*',
    createdAt: null
  },
  {
    id: 'curated_primary_a_adarsh_tropica',
    name: 'Adarsh Tropica Phase 2',
    builderName: 'Adarsh Developers',
    builderCategory: 'A',
    approvalBody: 'BBMP / BDA & RERA Approved',
    floorPlan: '2 BHK Premium (980 Sq.Ft.) · 3 BHK Smart (1385 Sq.Ft.) · 3 BHK Luxe (1610 Sq.Ft.)',
    description: 'Tropical resort-themed residential community at Location: Off Sarjapur Road - Choodasandra (Hosa Road - Kasavanahalli Link Corridor), featuring zero-dead-space floor plans and a lush central palm lagoon. Nearby Connectivity (Off Sarjapur Road - Choodasandra): Schools: Notre Dame Academy (0.8 km), Harvest International School (2.1 km), Vibgyor High Haralur (2.4 km), DPS East (3.8 km) | Hospitals: Springleaf Hospital (1.9 km), Motherhood Hospital Sarjapur Road (2.9 km), Manipal Hospital Sarjapur Road (3.4 km) | IT Hubs: Wipro Corporate HQ (2.6 km), RGA Tech Park (3.1 km), AMR Tech Park Hosur Road (3.9 km), Infosys Electronic City (4.8 km) | Malls: Market Square Mall Sarjapur Road (3.2 km), M5 Ecity Mall (4.1 km), Decathlon Sarjapur Road (2.8 km) | Bus Stop & Transit: Choodasandra Circle BMTC Bus Stop (0.3 km), Hosa Road Metro Station (2.6 km).',
    price: 'Rs. 1.24 Cr - Rs. 1.88 Cr*',
    lastPrice: 'Rs. 1.29 Cr onwards*',
    location: 'Off Sarjapur Road - Choodasandra (Hosa Road Link)',
    locationTarget: 'Choodasandra Bus Stop (0.3 km) • Hosa Road Metro (2.6 km) • Wipro HQ (2.6 km)',
    zone: 'Off Sarjapur Road',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Tropical Premium Homes',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/140224/006641',
    handoverDate: 'March 2028',
    projectSize: '13.5 Acres Tropical Enclave',
    noOfTowers: '6 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 24 Floors',
    imageUrls: [imgCatABiophilic, imgHosaRoadSkyline, imgKasavanahalliVillas],
    features: [
      '32,000 Sq.Ft. Tropical Clubhouse & Lagoon Pool',
      'Outdoor Co-Working Cabanas & Wi-Fi Pods',
      'Tennis, Basketball & Futsal Arena',
      'Butterfly Park & Senior Citizen Zen Zone',
      'Aluminum Formwork Mivan Construction',
      '10 Mins to Hosa Road Metro & Sarjapur IT Belt'
    ],
    handoverStatus: 'EOI',
    paymentOffers: 'EOI Priority Pricing • 0% Brokerage*',
    createdAt: null
  },
  {
    id: 'curated_primary_a_mana_dale',
    name: 'Mana Dale',
    builderName: 'Mana Projects',
    builderCategory: 'A',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '3 BHK Classic (1560 Sq.Ft.) · 3 BHK + Maid (1895 Sq.Ft.) · 4 BHK Grand (2380 Sq.Ft.)',
    description: 'Biophilic living sanctuary at Location: Kasavanahalli - Off Sarjapur Road (Kodathi Gate adjacent to Wipro SEZ), built around 100+ preserved mango and banyan trees with a 55,000 Sq.Ft. clubhouse. Nearby Connectivity (Kasavanahalli - Kodathi): Schools: Prakriya Green Wisdom School (0.9 km), DPS East (1.8 km), Harvest International School (1.4 km), Greenwood High (3.2 km) | Hospitals: Belenus Champion Hospital (1.9 km), Motherhood Hospital (2.8 km), Manipal Hospital Sarjapur Road (3.5 km), Sakra World Hospital (5.1 km) | IT Hubs: Wipro SEZ Campus (0.8 km), RGA Tech Park (1.2 km), Vaishnavi Tech Park (3.9 km), RMZ Ecoworld (4.6 km) | Malls: Decathlon Sarjapur Road (0.9 km), Market Square Mall (2.7 km), Central Mall Bellandur (4.8 km) | Bus Stop & Transit: Kodathi Gate BMTC Bus Stop (0.2 km), Carmelaram Railway Station (1.6 km).',
    price: 'Rs. 1.74 Cr - Rs. 2.68 Cr*',
    lastPrice: 'Rs. 1.81 Cr onwards*',
    location: 'Kasavanahalli - Kodathi (Off Sarjapur Road)',
    locationTarget: 'Kodathi Bus Stop (0.2 km) • Wipro SEZ (0.8 km) • RGA Tech Park (1.2 km)',
    zone: 'Kasavanahalli',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Biophilic Tech-Corridor Luxury',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/191223/006488',
    handoverDate: 'December 2027',
    projectSize: '6.89 Acres (680 Residences)',
    noOfTowers: '6 Biophilic Towers',
    flatsPerFloor: '4 to 6 Flats per Floor',
    floorsHeight: '2B + G + 22 Floors',
    imageUrls: [imgCatABiophilic, imgKasavanahalliVillas, imgGunjurSanctuary],
    features: [
      '55,000 Sq.Ft. Earth-Inspired Clubhouse',
      'Canopy Skywalk Amidst 100+ Native Trees',
      'Heated Indoor Pool & Resort Lagoon Pool',
      'Box Cricket, Padel, Squash & Badminton Courts',
      'Walk-to-Work from Wipro SEZ & RGA Tech Park',
      'Smart Home Automation & EV Charging'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10:90 Subvention Plan & Direct Builder Allotment*',
    createdAt: null
  },
  {
    id: 'curated_primary_a_purva_tranquillity',
    name: 'Purva Tranquillity Villa Plots',
    builderName: 'Puravankara (Purva Land)',
    builderCategory: 'A',
    approvalBody: 'BMRDA / STRR & RERA Approved (A-Khata)',
    floorPlan: 'Villa Plots: 1200 Sq.Ft. (30x40) · 1500 Sq.Ft. (30x50) · 2400 Sq.Ft. (40x60) Corner Plots',
    description: 'Nature-themed 71-acre plotted development at Location: Sarjapur - Attibele Road (Sompura Gate, South-East Bangalore), featuring 12 themed botanical parks, underground infrastructure, and a ready luxury clubhouse. Nearby Connectivity (Sarjapur - Sompura Gate): Schools: Indus International School (2.4 km), Azim Premji University (1.9 km), Greenwood High (8.2 km), Silver Oaks International (4.6 km) | Hospitals: Town Hospital Sarjapur (2.1 km), Spandana Hospital (4.5 km), Narayana Health City (9.2 km) | IT Hubs: Proposed Infosys 202-Acre Sarjapur Campus (2.8 km), Wipro SEZ Kodathi (9.4 km), Electronic City Phase 2 (10.5 km) | Malls: D-Mart Sarjapur (2.2 km), Market Square Mall (9.8 km), M5 Ecity Mall (10.2 km) | Bus Stop & Transit: Sompura Gate BMTC Bus Stop (0.2 km), Upcoming Sarjapur Red Line Metro Terminus (2.5 km).',
    price: 'Rs. 92 Lakhs - Rs. 1.95 Cr*',
    lastPrice: 'Rs. 96 Lakhs onwards*',
    location: 'Sarjapur - Sompura Gate (STRR Link Road)',
    locationTarget: 'Sompura Gate Bus Stop (0.2 km) • Indus Intl School (2.4 km) • Infosys Campus (2.8 km)',
    zone: 'Sarjapur',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['Plots'],
    segment: 'Themed Villa Plots',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/180322/004769',
    handoverDate: 'Ready for Registration & Villa Construction',
    projectSize: '71.0 Acres (800 Villa Plots)',
    noOfTowers: '800 Villa Plots',
    flatsPerFloor: '1200 - 2400 Sq.Ft. Plots',
    floorsHeight: 'G + 2 Independent Villa Approval',
    imageUrls: [imgLuxuryPlotEstate, imgSouthEastHanded, imgKasavanahalliVillas],
    features: [
      '71-Acre Master-Planned Plotted Township',
      '12 Themed Botanical Parks & Butterfly Garden',
      'Grand Clubhouse with Swimming Pool & Gym',
      'Tennis, Basketball & Cricket Practice Nets',
      'Underground Water, Sewage & Electrical Cabling',
      'Immediate A-Khata Plot Registration'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Registration • SBI & HDFC Plot Loans*',
    createdAt: null
  },
  {
    id: 'curated_primary_a_sattva_green_groves',
    name: 'Sattva Green Groves',
    builderName: 'Sattva Group',
    builderCategory: 'A',
    approvalBody: 'BMRDA & Karnataka RERA Approved',
    floorPlan: 'Plots: 600 Sq.Ft. · 1200 Sq.Ft. (30x40) · 1500 Sq.Ft. (30x50) · 1800 Sq.Ft.',
    description: 'Boutique gated plotted community at Location: Hoskote - Old Madras Road Highway Corridor, crafted with wide black-top avenues, landscaped tree boulevards, and a modern lifestyle clubhouse. Nearby Connectivity (Hoskote - OMR): Schools: Capstone High International School (1.8 km), Vibgyor High Kadugodi (6.4 km), Global Residential School Hoskote (2.2 km) | Hospitals: MVJ Medical College & Research Hospital (1.9 km), Silicon City Hospital Hoskote (2.4 km), Manipal Hospital Whitefield (9.8 km) | IT Hubs: Hoskote Industrial & Auto SEZ (3.2 km), Aero SEZ Devanahalli Link (9.5 km), Bearys Global Research Triangle (5.8 km), ITPL Whitefield (10.5 km) | Malls: Orion Uptown Mall OMR (4.8 km), SBR Lucky Mall (5.5 km) | Bus Stop & Transit: Dandupalya / Hoskote OMR BMTC Bus Stop (0.3 km), Kadugodi Metro Station (8.8 km).',
    price: 'Rs. 64 Lakhs - Rs. 1.42 Cr*',
    lastPrice: 'Rs. 68 Lakhs onwards*',
    location: 'Hoskote - Old Madras Road (NH-75 Corridor)',
    locationTarget: 'Hoskote OMR Bus Stop (0.3 km) • MVJ Hospital (1.9 km) • Orion Uptown Mall (4.8 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['Plots'],
    segment: 'Gated Plotted Enclave',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/240524/006915',
    handoverDate: 'December 2026',
    projectSize: '42.0 Acres (700 Villa Plots)',
    noOfTowers: '700 Villa Plots',
    flatsPerFloor: '600 - 1800 Sq.Ft. Plots',
    floorsHeight: 'BMRDA Approved Villa Plots',
    imageUrls: [imgLuxuryPlotEstate, imgHoskoteTownship, imgEastReady],
    features: [
      '25,000 Sq.Ft. Lifestyle Clubhouse & Pool',
      '40-Feet & 60-Feet Wide Tree-Lined Avenues',
      '24/7 Boom Barrier & Perimeter CCTV Security',
      'Underground Electricity & Optical Fiber Ducts',
      'Outdoor Gym, Amphitheatre & Kids Park',
      'Direct NH-75 & STRR Expressway Access'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10% Booking • Milestone Plot Payment Plan*',
    createdAt: null
  },

  // --- CATEGORY B PRIMARY PROJECTS (Reputed Mid-Market & Value-Luxury Builders) ---
  {
    id: 'curated_primary_b_dsr_elixir',
    name: 'DSR Elixir Boutique Villas',
    builderName: 'DSR Infrastructure',
    builderCategory: 'B',
    approvalBody: 'BMRDA / BBMP & RERA Approved',
    floorPlan: '4 BHK Triplex Villa (2550 Sq.Ft.) · 4 BHK Corner Villa (3280 Sq.Ft.) · 5 BHK Mansion (3950 Sq.Ft.)',
    description: 'Contemporary gated triplex villa community at Location: Whitefield - Soukya Road (Kadugodi Extension), offering independent private gardens, terrace gazebos, and low-density serene living. Nearby Connectivity (Whitefield - Soukya Road): Schools: Deens Academy Gunjur / Whitefield (3.2 km), Pragathi School (2.4 km), Vibgyor High Kadugodi (3.6 km), Chrysalis High (3.9 km) | Hospitals: Soukya International Holistic Health Centre (0.6 km), Sri Sathya Sai Hospital (5.4 km), Manipal Hospital Whitefield (5.8 km) | IT Hubs: Bearys Global Research Triangle (3.5 km), ITPL Whitefield (5.2 km), EPIP Zone (5.9 km) | Malls: SBR Lucky Mall (3.4 km), Orion Uptown Mall (4.6 km), Nexus Shantiniketan (5.8 km) | Bus Stop & Transit: Soukya Road BMTC Bus Stop (0.2 km), Whitefield (Kadugodi) Metro Station & Railway Station (3.9 km).',
    price: 'Rs. 2.45 Cr - Rs. 3.65 Cr*',
    lastPrice: 'Rs. 2.52 Cr onwards*',
    location: 'Whitefield - Soukya Road (Kadugodi Extension)',
    locationTarget: 'Soukya Rd Bus Stop (0.2 km) • Kadugodi Metro (3.9 km) • ITPL (5.2 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Villa',
    configuration: ['4 BHK', '5 BHK'],
    segment: 'Value-Luxury Triplex Villas',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/190722/005082',
    handoverDate: 'June 2026',
    projectSize: '10.75 Acres (162 Independent Villas)',
    noOfTowers: '162 Independent Triplex Villas',
    flatsPerFloor: 'Independent Row & Corner Villas',
    floorsHeight: 'G + 2 Floors + Private Sky Deck',
    imageUrls: [imgKasavanahalliVillas, imgHoskoteTownship, imgCatBModern],
    features: [
      '20,000 Sq.Ft. Villa Clubhouse & Lap Pool',
      'Private Lawn & 2 Covered Car Parks per Villa',
      'Indoor Badminton, Squash & Gymnasium',
      'Jogging Track, Pet Park & Amphitheatre',
      'Solar Water Heater & EV Charging Provision',
      '10 Mins to Kadugodi Whitefield Metro Station'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Direct Builder Villa Inventory • 0% Brokerage*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_bren_zahara',
    name: 'Bren Zahara',
    builderName: 'Bren Corporation',
    builderCategory: 'B',
    approvalBody: 'BBMP OC Received & RERA Approved',
    floorPlan: '3 BHK Smart (1675 Sq.Ft.) · 3 BHK Grand (1780 Sq.Ft.)',
    description: 'Spanish-courtyard inspired primary residential enclave at Location: Kasavanahalli - Off Sarjapur Road (Behind Wipro Corporate Office), crafted with Mivan construction, cross-ventilated corner layouts, and ready club amenities. Nearby Connectivity (Kasavanahalli - Off Sarjapur): Schools: BRS Global School (0.5 km), Asia Pacific World School (0.9 km), Vibgyor High Haralur (1.6 km), DPS East (2.6 km) | Hospitals: Motherhood Hospital Sarjapur Road (1.6 km), Manipal Hospital Sarjapur Road (1.9 km), Belenus Champion Hospital (2.1 km) | IT Hubs: Wipro Corporate HQ (1.2 km), RGA Tech Park (2.4 km), Vaishnavi Tech Park (1.9 km), RMZ Ecoworld (3.5 km) | Malls: Market Square Mall Sarjapur Road (1.5 km), Decathlon Sarjapur Road (2.1 km), Central Mall Bellandur (3.4 km) | Bus Stop & Transit: Kasavanahalli Main BMTC Bus Stop (0.3 km), Carmelaram Station (2.6 km), Upcoming Iblur Metro (2.5 km).',
    price: 'Rs. 1.54 Cr - Rs. 1.82 Cr*',
    lastPrice: 'Rs. 1.59 Cr onwards*',
    location: 'Kasavanahalli Main Road (Behind Wipro HQ)',
    locationTarget: 'Kasavanahalli Bus Stop (0.3 km) • Wipro HQ (1.2 km) • Manipal Hospital (1.9 km)',
    zone: 'Kasavanahalli',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK'],
    segment: 'Contemporary Value Luxury',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/210302/003971',
    handoverDate: 'Ready to Move (OC Received)',
    projectSize: '4.1 Acres (304 Residences)',
    noOfTowers: '4 Contemporary Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: 'B + G + 13 Floors',
    imageUrls: [imgCatBModern, imgKasavanahalliVillas, imgEastReady],
    features: [
      'Ready to Move with Occupancy Certificate (Zero GST)',
      'Heated Swimming Pool & Fitness Center',
      'Spanish Central Courtyard & Amphitheatre',
      'Multi-Purpose Sports Court & Skating Rink',
      'Co-Working Lounge & Creche',
      '5 Mins from Wipro HQ & Sarjapur Main Road'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Ready Primary Inventory • Zero GST on OC Units*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_gopalan_florenza',
    name: 'Gopalan Florenza',
    builderName: 'Gopalan Enterprises',
    builderCategory: 'B',
    approvalBody: 'BMRDA / BBMP & RERA Approved',
    floorPlan: '2 BHK Smart (1165 Sq.Ft.) · 3 BHK Comfort (1540 Sq.Ft.) · 3 BHK Luxe (1790 Sq.Ft.)',
    description: 'Modern family-focused gated community at Location: Hoskote - Old Madras Road (Budigere Cross - Kattamnallur), designed with Vaastu-compliant east/north facing homes, podium gardens, and high rental yield potential. Nearby Connectivity (Hoskote - OMR): Schools: Gopalan National School (3.8 km), Vibgyor High Kadugodi (3.6 km), New Baldwin International (1.9 km) | Hospitals: East Point Hospital (3.9 km), MVJ Hospital (4.4 km), Sri Sathya Sai Hospital (6.8 km) | IT Hubs: Bearys Global Research Triangle (2.4 km), Signature Business Park (0.5 km), ITPL Whitefield (7.2 km) | Malls: Orion Uptown Mall OMR (0.5 km), Gopalan Grand Mall (9.2 km), SBR Lucky Mall (4.1 km) | Bus Stop & Transit: Kattamnallur / Budigere Cross BMTC Bus Stop (0.3 km), Kadugodi Metro Station (5.5 km).',
    price: 'Rs. 98 Lakhs - Rs. 1.48 Cr*',
    lastPrice: 'Rs. 1.04 Cr onwards*',
    location: 'Hoskote - Old Madras Road (Kattamnallur)',
    locationTarget: 'Kattamnallur Bus Stop (0.3 km) • Orion Uptown Mall (0.5 km) • Kadugodi Metro (5.5 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Value Luxury Apartments',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/110823/006145',
    handoverDate: 'September 2027',
    projectSize: '5.5 Acres (420 Residences)',
    noOfTowers: '4 Residential Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 18 Floors',
    imageUrls: [imgCatBModern, imgHoskoteTownship, imgSouthEastConst],
    features: [
      '22,000 Sq.Ft. Clubhouse & Lap Swimming Pool',
      'Indoor Badminton, Table Tennis & Gym',
      'Vehicle-Free Central Podium Park',
      'Children Play Lawn & Senior Citizen Deck',
      '100% Vaastu East & North Facing Entrances',
      'Walkable to Orion Uptown Mall on OMR'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10% Down Payment • Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_candeur_skyline',
    name: 'Candeur Skyline',
    builderName: 'Candeur Constructions',
    builderCategory: 'B',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2.5 BHK (1395 Sq.Ft.) · 3 BHK Regal (1760 Sq.Ft.) · 3.5 BHK Sky Suite (2120 Sq.Ft.)',
    description: 'High-rise contemporary residential enclave at Location: Varthur - Gunjur Main Road (Beside Krupanidhi & Chrysalis High), featuring sky-bridges, double-height entrance lobbies, and panoramic lake views. Nearby Connectivity (Varthur - Gunjur): Schools: Chrysalis High Gunjur (0.6 km), Oakridge International School (1.9 km), Greenwood High (2.2 km), Global Indian International (2.4 km) | Hospitals: Sahasra Hospital Varthur (1.4 km), Spandana Hospital Gunjur (1.1 km), Manipal Hospital Varthur Road (3.6 km) | IT Hubs: Wipro SEZ Kodathi (4.2 km), RGA Tech Park (4.6 km), Sigma Soft Tech Park (3.4 km), ITPL Whitefield (6.8 km) | Malls: Virginia Mall (3.7 km), Nexus Value Mall (4.2 km), Market Square Mall (4.9 km) | Bus Stop & Transit: Gunjur - Varthur BMTC Bus Stop (0.2 km), Carmelaram Railway Station (3.5 km).',
    price: 'Rs. 1.38 Cr - Rs. 2.12 Cr*',
    lastPrice: 'Rs. 1.44 Cr onwards*',
    location: 'Varthur - Gunjur Main Road',
    locationTarget: 'Gunjur-Varthur Bus Stop (0.2 km) • Chrysalis High (0.6 km) • Wipro SEZ (4.2 km)',
    zone: 'Varthur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'High-Rise Value Luxury',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/280423/005912',
    handoverDate: 'June 2027',
    projectSize: '6.2 Acres (512 Residences)',
    noOfTowers: '5 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 21 Floors',
    imageUrls: [imgCatBModern, imgVarthurLakefront, imgGunjurSanctuary],
    features: [
      '28,000 Sq.Ft. 4-Level Lifestyle Clubhouse',
      'Half-Olympic Swimming Pool & Kids Splash Pad',
      'Rooftop Jogging Track & Sky Yoga Deck',
      'Cricket Practice Net, Tennis & Basketball Court',
      'In-Complex Supermarket & Pharmacy',
      'Zero Common Wall Sharing Design'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Direct Developer Pricing • Flexible CLP*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_casagrand_flamingo',
    name: 'Casagrand Flamingo',
    builderName: 'Casagrand Builder',
    builderCategory: 'B',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK Luxe (1320 Sq.Ft.) · 3 BHK Grand (1740 Sq.Ft.) · 4 BHK Signature (2390 Sq.Ft.)',
    description: 'Contemporary lifestyle residential community at Location: Hosa Road - HSR Layout Extension Corridor, offering 65+ world-class lifestyle amenities, vehicle-free central podium, and 75% open landscaped space. Nearby Connectivity (Hosa Road - HSR Extension): Schools: Vibgyor High Haralur (1.2 km), Freedom International School HSR (2.4 km), National Public School HSR (2.9 km), Orchids International (1.5 km) | Hospitals: Narayana Multispeciality Hospital HSR (2.2 km), Manipal Hospital Sarjapur Road (3.4 km), Kauvery Hospital (3.1 km) | IT Hubs: AMR Tech Park Hosur Road (2.9 km), RMZ Ecospace Bellandur (4.4 km), Wipro Corporate HQ (4.2 km), Electronic City Phase 1 (4.9 km) | Malls: Market Square Mall (3.6 km), M5 Ecity Mall (4.4 km), HSR Sector 2 High Street (2.2 km) | Bus Stop & Transit: Hosa Road / Kudlu Gate BMTC Bus Stop (0.5 km), Kudlu Gate & Hosa Road Yellow Line Metro Stations (1.4 km).',
    price: 'Rs. 1.42 Cr - Rs. 2.38 Cr*',
    lastPrice: 'Rs. 1.48 Cr onwards*',
    location: 'Hosa Road - HSR Extension Corridor',
    locationTarget: 'Kudlu Gate Bus Stop (0.5 km) • Hosa Road Metro (1.4 km) • AMR Tech Park (2.9 km)',
    zone: 'Hosa Road',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK', '4 BHK'],
    segment: 'Contemporary Podium Living',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/140623/006011',
    handoverDate: 'Ready to Move (2026)',
    projectSize: '5.18 Acres (318 Residences)',
    noOfTowers: '3 Podium Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 14 Floors',
    imageUrls: [imgCatBModern, imgHosaRoadSkyline, imgEastReady],
    features: [
      '65+ Resort-Style Amenities & Sky Cinema',
      'Vehicle-Free 2-Acre Central Podium Lawn',
      'Swimming Pool with Jacuzzi & Poolside Cafe',
      'Video Gaming Lounge, Gym & CrossFit Zone',
      '5 Mins to Hosa Road & Kudlu Gate Metro',
      'Direct Access to HSR Layout & Electronic City'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Ready Primary Units • Immediate Possession*',
    createdAt: null
  },

  // --- CATEGORY C PRIMARY PROJECTS (Smart Boutique & Local Value Builders) ---
  {
    id: 'curated_primary_c_radiant_jasmine',
    name: 'Radiant Jasmine Gardens',
    builderName: 'Radiant Structures',
    builderCategory: 'C',
    approvalBody: 'BBMP & RERA Approved (A-Khata)',
    floorPlan: '2 BHK Smart (1085 Sq.Ft.) · 2.5 BHK Study (1260 Sq.Ft.) · 3 BHK Family (1440 Sq.Ft.)',
    description: 'Smart value-for-money primary apartment enclave at Location: Whitefield - Immadihalli Main Road (Near Hagadur & Hope Farm Junction), offering spacious balconies, 100% Vaastu compliance, and immediate proximity to Whitefield IT hubs. Nearby Connectivity (Whitefield - Immadihalli): Schools: Deens Academy Whitefield (1.9 km), Glentree Academy (2.1 km), Whitefield Global School (1.6 km), Ryan International (3.4 km) | Hospitals: Manipal Hospital Varthur Road (2.2 km), Columbia Asia Whitefield (2.4 km), Aster Whitefield Hospital (3.8 km) | IT Hubs: Sigma Soft Tech Park (1.9 km), ITPL / ITPB Whitefield (3.2 km), GR Tech Park (2.9 km) | Malls: Virginia Mall (2.0 km), Park Square Mall ITPL (3.2 km), Nexus Forum Shantiniketan (3.9 km) | Bus Stop & Transit: Immadihalli Main BMTC Bus Stop (0.2 km), Hope Farm Channasandra Metro Station (2.6 km).',
    price: 'Rs. 78 Lakhs - Rs. 1.12 Cr*',
    lastPrice: 'Rs. 82 Lakhs onwards*',
    location: 'Whitefield - Immadihalli Main Road (Hope Farm Link)',
    locationTarget: 'Immadihalli Bus Stop (0.2 km) • Manipal Hospital (2.2 km) • Hope Farm Metro (2.6 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Smart Boutique Homes',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210523/005944',
    handoverDate: 'Ready to Move (Immediate Registration)',
    projectSize: '2.1 Acres (164 Units)',
    noOfTowers: '2 Boutique Blocks',
    flatsPerFloor: '8 Flats per Floor',
    floorsHeight: 'B + G + 5 Floors',
    imageUrls: [imgCatCBoutique, imgWhitefieldTowers, imgEastReady],
    features: [
      'BBMP A-Khata & OC Verified',
      'Rooftop Swimming Pool & Fitness Gym',
      'Air-Conditioned Party Hall & Indoor Games',
      'Children Play Park & Walking Track',
      'Cauvery Water Connection & 24/7 DG Backup',
      'Covered Basement Car Parking & CCTV Security'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: '90% Home Loan Approved • Zero Brokerage*',
    createdAt: null
  },
  {
    id: 'curated_primary_c_sri_sai_brindavan',
    name: 'Sri Sai Brindavan Enclave',
    builderName: 'Sri Sai Constructions',
    builderCategory: 'C',
    approvalBody: 'BMRDA / HPA & RERA Approved',
    floorPlan: '2 BHK Compact (1040 Sq.Ft.) · 3 BHK Corner (1350 Sq.Ft.)',
    description: 'Well-crafted mid-rise residential community at Location: Hoskote Town - NH-75 Old Madras Road (Near MVJ Hospital & Toll Plaza), ideal for first-time homebuyers and high-yield investors along the booming East Bangalore corridor. Nearby Connectivity (Hoskote Town NH-75): Schools: Citizen Public School Hoskote (1.1 km), Global Residential School (1.5 km), The Brigade School OMR (5.4 km) | Hospitals: MVJ Medical College & Research Hospital (1.2 km), Silicon City Hospital (1.6 km), Mission Hospital (1.9 km) | IT Hubs: Hoskote Auto & Logistics SEZ (2.4 km), Bearys Global Research Triangle (5.9 km), ITPL Whitefield (10.8 km) | Malls: Orion Uptown Mall OMR (5.1 km), Hoskote Central Shopping Plaza (0.9 km) | Bus Stop & Transit: Hoskote Bus Stand & NH-75 BMTC Stop (0.3 km), Kadugodi Whitefield Metro Station (9.2 km).',
    price: 'Rs. 58 Lakhs - Rs. 84 Lakhs*',
    lastPrice: 'Rs. 61 Lakhs onwards*',
    location: 'Hoskote Town - NH-75 Old Madras Road',
    locationTarget: 'Hoskote Bus Stop (0.3 km) • MVJ Hospital (1.2 km) • Orion Uptown Mall (5.1 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Smart Affordable Luxury',
    reraNumber: 'PRM/KA/RERA/1250/304/PR/091123/006391',
    handoverDate: 'Ready to Move (2026)',
    projectSize: '1.8 Acres (140 Units)',
    noOfTowers: '2 Residential Wings',
    flatsPerFloor: '7 Flats per Floor',
    floorsHeight: 'S + G + 5 Floors',
    imageUrls: [imgCatCBoutique, imgHoskoteTownship, imgSouthEastHanded],
    features: [
      'BMRDA Approved Clear A-Khata Title',
      'Clubhouse with Equipped Gymnasium & Party Hall',
      'Landscaped Courtyard & Kids Play Area',
      '100% Vaastu Compliant Zero-Wastage Layouts',
      '24/7 Security, Intercom & Power Backup',
      'Direct NH-75 & STRR Highway Access'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Possession • SBI & LIC HFL Approved*',
    createdAt: null
  },
  {
    id: 'curated_primary_c_slv_lakeview',
    name: 'SLV Lakeview Residency',
    builderName: 'SLV Infra Projects',
    builderCategory: 'C',
    approvalBody: 'BBMP & RERA Approved',
    floorPlan: '2 BHK Classic (1120 Sq.Ft.) · 3 BHK Lakefacing (1485 Sq.Ft.)',
    description: 'Boutique mid-rise residential apartment at Location: Gunjur - Krupanidhi College Road (Varthur-Sarjapur Corridor), offering peaceful residential living with low maintenance charges and quick access to Wipro SEZ and ORR tech parks. Nearby Connectivity (Gunjur - Krupanidhi Road): Schools: Krupanidhi International School & College (0.4 km), Chrysalis High Gunjur (0.8 km), Greenwood High (2.3 km), Oakridge International (2.7 km) | Hospitals: Spandana Hospital Gunjur (0.9 km), Sahasra Hospital Varthur (1.9 km), Belenus Champion Hospital (3.5 km) | IT Hubs: Wipro SEZ Kodathi (3.2 km), RGA Tech Park (3.8 km), Cessna Business Park ORR (5.9 km) | Malls: Decathlon Sarjapur Road (3.1 km), Market Square Mall (4.2 km), Virginia Mall (4.8 km) | Bus Stop & Transit: Krupanidhi College BMTC Bus Stop (0.2 km), Carmelaram Railway Station (2.5 km).',
    price: 'Rs. 76 Lakhs - Rs. 1.08 Cr*',
    lastPrice: 'Rs. 79 Lakhs onwards*',
    location: 'Gunjur - Krupanidhi College Road',
    locationTarget: 'Krupanidhi Bus Stop (0.2 km) • Spandana Hospital (0.9 km) • Wipro SEZ (3.2 km)',
    zone: 'Gunjur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Boutique Urban Homes',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/150424/006794',
    handoverDate: 'December 2026',
    projectSize: '1.5 Acres (112 Residences)',
    noOfTowers: '2 Boutique Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: 'B + G + 5 Floors',
    imageUrls: [imgCatCBoutique, imgGunjurSanctuary, imgCatBModern],
    features: [
      'Low-Density Boutique Living (Only 112 Homes)',
      'Swimming Pool, Gymnasium & Multipurpose Hall',
      'Rooftop Terrace Garden & Walking Track',
      'Rainwater Harvesting & Solar Lighting',
      'Dedicated Covered Car Parking',
      '10 Mins to Wipro SEZ & Carmelaram Station'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10% Booking • Flexible Milestone Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_c_bm_glorietta',
    name: 'BM Glorietta Phase 2',
    builderName: 'BM Developers',
    builderCategory: 'C',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK Smart (1095 Sq.Ft.) · 3 BHK Executive (1425 Sq.Ft.)',
    description: 'Value-packed primary apartment community at Location: Kasavanahalli - Hosa Road Link (Kaikondrahalli - Rayasandra Corridor), offering modern lifestyle amenities at an attractive price point inside the IT belt. Nearby Connectivity (Kasavanahalli - Hosa Road Link): Schools: Orchids The International School (1.1 km), Vibgyor High Haralur (1.5 km), Notre Dame Academy (1.4 km), BRS Global School (1.2 km) | Hospitals: Motherhood Hospital Sarjapur Road (2.1 km), Manipal Hospital Sarjapur Road (2.4 km), Springleaf Hospital (2.0 km) | IT Hubs: Wipro Corporate HQ (1.9 km), Vaishnavi Tech Park (2.3 km), RGA Tech Park (2.8 km), RMZ Ecospace Bellandur (3.8 km) | Malls: Market Square Mall Sarjapur Road (2.0 km), Central Mall Bellandur (3.7 km) | Bus Stop & Transit: Kasavanahalli / Rayasandra Cross BMTC Bus Stop (0.3 km), Hosa Road Yellow Line Metro Station (2.4 km).',
    price: 'Rs. 82 Lakhs - Rs. 1.16 Cr*',
    lastPrice: 'Rs. 85 Lakhs onwards*',
    location: 'Kasavanahalli - Hosa Road Link Corridor',
    locationTarget: 'Kasavanahalli Bus Stop (0.3 km) • Wipro HQ (1.9 km) • Hosa Road Metro (2.4 km)',
    zone: 'Kasavanahalli',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Smart Tech-Belt Homes',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/060923/006233',
    handoverDate: 'Ready to Move (Immediate Possession)',
    projectSize: '2.2 Acres (176 Units)',
    noOfTowers: '3 Residential Blocks',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: 'B + G + 5 Floors',
    imageUrls: [imgCatCBoutique, imgHosaRoadSkyline, imgKasavanahalliVillas],
    features: [
      'Ready to Move Primary Flats • Zero Brokerage',
      'Swimming Pool, Gymnasium & Indoor Games Room',
      'Children Play Area & Landscaped Sit-Outs',
      '24/7 CCTV Surveillance & Security Cabin',
      '100% Power Backup for Common Areas & Lifts',
      'Minutes from Sarjapur Road & Hosa Road Metro'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Direct Builder Price • Immediate Key Handover*',
    createdAt: null
  },

  // ================= ADDITIONAL EAST & SOUTH-EAST BANGALORE LANDMARKS =================
  {
    id: 'curated_se_handed_4',
    name: 'Assetz Marq 3.0 Sky Enclave',
    builderName: 'Assetz Property Group',
    builderCategory: 'A',
    approvalBody: 'BMRDA & RERA Approved',
    floorPlan: '3 BHK + 3T (1665 Sq.Ft.) · 4 BHK Luxe (2275 Sq.Ft.)',
    description: 'Handed-over landmark community at Location: Whitefield - Hoskote Main Road (Kannamangala, East Bangalore) featuring high-efficiency luxury residences with expansive private sundecks, 6-acre central linear park, and an active international resident community. Nearby Connectivity (Whitefield - Hoskote Road): Schools:Vibgyor High Kadugodi (2.8 km), Pragathi SchoolInside Township (0.1 km), Deens Academy (5.2 km) | Hospitals: Manipal Hospital Whitefield (6.8 km), Sri Sathya Sai Hospital (6.2 km), MVJ Hospital (4.9 km) | IT Hubs: Bearys Global Research Triangle (1.8 km), ITPL Whitefield (5.9 km), Brigade Tech Gardens (7.2 km) | Malls: Orion Uptown Mall (2.9 km), SBR Lucky Mall (3.4 km), Nexus Shantiniketan (6.8 km) | Bus Stop & Transit: Kannamangala BMTC Bus Stop (0.2 km), Kadugodi Tree Park Metro Station (3.8 km).',
    price: 'Rs. 1.95 Cr - Rs. 2.90 Cr*',
    lastPrice: 'Rs. 2.05 Cr (Latest Verified Transaction)*',
    location: 'Whitefield - Hoskote Main Road (Kannamangala)',
    locationTarget: 'Kannamangala Bus Stop (0.2 km) • Orion Uptown Mall (2.9 km) • Kadugodi Metro (3.8 km)',
    zone: 'Sarjapur',
    type: 'Resale',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Verified Resale',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/190913/002892',
    handoverDate: 'Handed Over (2025)',
    projectSize: '22.0 Acres',
    noOfTowers: '8 Landmark Towers',
    flatsPerFloor: '5 Flats per Floor',
    floorsHeight: '2B + G + 28 Floors',
    imageUrls: [imgSouthEastHanded, imgEastReady, imgLuxuryResale],
    features: [
      '2 Dual-Level Clubhouses',
      '6-Acre Central Linear Park',
      'Rooftop Party & BBQ Deck',
      'ICSE/CBSE School Inside Township',
      '25-Meter Lap Swimming Pool',
      'Dedicated Co-Working Pods'
    ],
    handoverStatus: 'Handed Over',
    paymentOffers: 'Direct Owner Verified Resale • Immediate Registration*',
    createdAt: null
  },
  {
    id: 'curated_se_rental_6',
    name: 'Adarsh Palm Retreat Mayberry Towers',
    builderName: 'Adarsh Developers',
    builderCategory: 'A+',
    approvalBody: 'BDA & BBMP Approved',
    floorPlan: '3 BHK Executive (1910 Sq.Ft.) · 4 BHK + Staff (2650 Sq.Ft.)',
    description: 'Executive luxury rental apartments at Location: Bellandur - Outer Ring Road (Behind RMZ Ecoworld). Walking distance to RMZ Ecoworld and Ecospace with resort-grade club amenities. Nearby Connectivity (Bellandur ORR): Schools:New Horizon Gurukul (1.8 km), Gear Innovative International School (1.4 km), Neev Academy (2.9 km), DPS East (5.2 km) | Hospitals: Sakra World Hospital (1.2 km), Manipal Hospital Sarjapur Road (3.4 km), Cloudnine Hospital Bellandur (2.5 km) | IT Hubs: RMZ Ecoworld (0.3 km walk), Intel Campus ORR (0.8 km), Embassy TechVillage (1.9 km), RMZ Ecospace (2.1 km) | Malls: Central Mall Bellandur (2.2 km), Market Square Mall (3.6 km), Brookfield Mall (5.5 km) | Bus Stop & Transit: Devarabisanahalli / Ecoworld BMTC Bus Stop (0.5 km), Upcoming Bellandur & Ecoworld ORR Metro Stations (0.7 km).',
    price: 'Rs. 85,000 / month - Rs. 1.45 L / month*',
    lastPrice: 'Rs. 92,000 / month (Verified Lease Rate)*',
    location: 'Bellandur - Outer Ring Road (Behind RMZ Ecoworld)',
    locationTarget: 'RMZ Ecoworld (0.3 km) • Ecoworld Bus Stop (0.5 km) • Sakra Hospital (1.2 km)',
    zone: 'Bellandur',
    type: 'Rental',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Corporate Rental',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180516/001745',
    handoverDate: 'Ready to Move (Immediate Occupancy)',
    projectSize: '18.5 Acres',
    noOfTowers: '12 Towers',
    flatsPerFloor: '4 Flats per Floor',
    floorsHeight: '2B + G + 14 Floors',
    imageUrls: [imgSouthEastConst, imgLuxuryResale, imgSouthEastHanded],
    features: [
      'Walk-to-Work (RMZ Ecoworld)',
      '50,000 Sq.Ft. Leisure Clubhouse',
      '3 Swimming Pools & Spa',
      'Semi-Furnished with Wardrobes & AC',
      '2 Covered Car Parks per Unit',
      '24/7 High-Speed Fiber & DG Backup'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Corporate Lease Assistance Available*',
    createdAt: null
  },

  // ================= CATEGORY A+ PLOTTED TOWNSHIPS & LAUNCHES (EOI / READY / UNDER CONSTRUCTION) =================
  {
    id: 'curated_plot_prestige_marigold',
    name: 'Prestige Marigold (Phase 2 Plotted Enclave)',
    builderName: 'Prestige Group',
    builderCategory: 'A+',
    approvalBody: 'BMRDA & STRR Approved (A-Khata)',
    floorPlan: '30x40 (1200 Sq.Ft.) · 30x50 (1500 Sq.Ft.) · 40x60 (2400 Sq.Ft.) Plotted Land',
    description: 'Master-planned 50+ acre luxury plotted development at Location: Hoskote - Budigere Cross & STRR Satellite Ring Road Belt. Featuring 60-ft wide asphalted boulevards, underground electrical cabling, piped water network, and a grand 20,000 Sq.Ft. clubhouse ready for immediate villa construction. Nearby Connectivity (Hoskote - STRR): Schools: Vibgyor High Kadugodi (3.6 km), Narayana e-Techno Hoskote (3.2 km), Capstone High (3.5 km) | Hospitals: MVJ Medical College & Hospital (3.8 km), East Point Hospital (4.5 km) | IT Hubs: Bearys Global Research Triangle (3.8 km), Hoskote Industrial SEZ (2.9 km), ITPL Whitefield (8.5 km) | Malls: Orion Uptown Mall OMR (3.9 km) | Bus Stop & Transit: Hoskote STRR Junction BMTC Bus Stop (0.4 km), Whitefield Metro (7.5 km).',
    price: 'Rs. 85 Lakhs - Rs. 1.65 Cr*',
    lastPrice: 'Rs. 88 Lakhs onwards*',
    location: 'Hoskote - Budigere Cross & STRR Belt, Bangalore',
    locationTarget: 'Hoskote STRR Stop (0.4 km) • Orion Uptown Mall (3.9 km) • MVJ Hospital (3.8 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['1200 Sq.Ft.', '1500 Sq.Ft.', '2400 Sq.Ft.'],
    segment: 'Luxury Plotted Township',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/220124/004652',
    handoverDate: 'Ready for Immediate Registration & Construction',
    projectSize: '50.0 Acres Plotted Township (396 Villa Plots)',
    noOfTowers: '396 Villa Plots',
    flatsPerFloor: 'Independent Villa Plots',
    floorsHeight: 'Villa Plot Development',
    imageUrls: [imgLuxuryPlotEstate, imgHoskoteTownship, imgEastReady],
    features: [
      'BMRDA & STRR Approved Clear A-Khata Title',
      '20,000 Sq.Ft. Grand Plotted Clubhouse',
      '100% Underground Cabling, Fiber & Water Piped Network',
      '60-Ft Wide Tree-Lined Asphalted Boulevards',
      'Half-Olympic Swimming Pool & Multi-Sports Arena',
      '24/7 Gated Perimeter Security & RFID Entry'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Instant Registration • 80% Bank Loan Approved via SBI & HDFC*',
    createdAt: null
  },
  {
    id: 'curated_plot_brigade_oasis_eoi',
    name: 'Brigade Oasis (Phase 3 EOI Plotted Launch)',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    approvalBody: 'BMRDA & Karnataka RERA Approved',
    floorPlan: '30x40 (1200 Sq.Ft.) · 30x50 (1500 Sq.Ft.) · 40x60 (2400 Sq.Ft.) Villa Plots',
    description: 'Premier nature-inspired plotted sanctuary at Location: Old Madras Road - Hoskote Expressway Corridor. Offering high-appreciation residential villa plots with 10+ theme gardens, pedestrian-first streetscapes, and priority allotment in the current pre-launch EOI window. Nearby Connectivity (OMR Hoskote): Schools: The Brigade School OMR (4.8 km), New Baldwin International (2.6 km) | Hospitals: MVJ Super Specialty Hospital (3.4 km), Silicon City Hospital (2.8 km) | IT Hubs: Signature Business Park (3.2 km), Whitefield ITPL (9.2 km) | Malls: Orion Uptown Mall (4.1 km) | Bus Stop: Hoskote Highway Stop (0.3 km).',
    price: 'Rs. 68 Lakhs - Rs. 1.45 Cr*',
    lastPrice: 'Rs. 72 Lakhs onwards*',
    location: 'Old Madras Road - Hoskote Corridor, Bangalore',
    locationTarget: 'Hoskote Toll (0.3 km) • Orion Uptown Mall (4.1 km) • Brigade School (4.8 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['1200 Sq.Ft.', '1500 Sq.Ft.', '2400 Sq.Ft.'],
    segment: 'Nature Plotted Enclave',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/140324/006712',
    handoverDate: 'December 2026',
    projectSize: '40.0 Acres (340 Plots)',
    noOfTowers: '340 Villa Plots',
    flatsPerFloor: 'Independent Villa Plots',
    floorsHeight: 'Villa Plot Layout',
    imageUrls: [imgLuxuryPlotEstate, imgEastEoi, imgHoskoteTownship],
    features: [
      'Pre-Launch EOI Window • Priority Pricing',
      'Grand Lifestyle Clubhouse with Terrace Lounge',
      'Botanical Gardens & Sensory Play Park',
      'Underground Storm Water Drainage & Solar Streetlights',
      'Wide Internal Concrete Roads with Paver Walkways',
      'Direct Expressway & STRR Connectivity'
    ],
    handoverStatus: 'EOI',
    paymentOffers: 'Priority EOI Booking • 10:90 Milestone Plan*',
    createdAt: null
  },
  {
    id: 'curated_villa_sobha_oakshire',
    name: 'Sobha Oakshire Tudor-Style Villas',
    builderName: 'Sobha Limited',
    builderCategory: 'A+',
    approvalBody: 'BBMP & BDA Approved',
    floorPlan: '4 BHK Triplex (3440 Sq.Ft. SBA) · 4.5 BHK Regal Villa (4120 Sq.Ft. SBA)',
    description: 'English Tudor-style luxury independent triplex villas at Location: Whitefield - Hoskote Extension Corridor. Features gabled roofs, handcrafted brickwork, private garden lawns, and an elite 25,000 Sq.Ft. Clubhouse. Nearby Connectivity (Whitefield Extension): Schools: Vibgyor High Kadugodi (2.8 km), Deens Academy Whitefield (3.6 km) | Hospitals: Manipal Hospital Whitefield (6.2 km), MVJ Hospital (4.2 km) | IT Hubs: Bearys Global Research Triangle (2.4 km), ITPL Whitefield (5.8 km) | Malls: Orion Uptown Mall (2.9 km), Nexus Shantiniketan (6.4 km).',
    price: 'Rs. 3.95 Cr - Rs. 5.60 Cr*',
    lastPrice: 'Rs. 4.10 Cr onwards*',
    location: 'Whitefield - Hoskote Extension Corridor, Bangalore',
    locationTarget: 'Kadugodi Metro (4.5 km) • Bearys Tech Park (2.4 km) • Orion Uptown (2.9 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Villa',
    configuration: ['4 BHK', '4.5 BHK'],
    segment: 'Ultra-Luxury English Villas',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/190823/006180',
    handoverDate: 'June 2027',
    projectSize: '8.5 Acres (80 Exclusive Triplex Villas)',
    noOfTowers: '80 Independent Villas',
    flatsPerFloor: 'Independent Villa Plots',
    floorsHeight: 'G + 2 Floors + Private Terrace',
    imageUrls: [imgKasavanahalliVillas, imgSouthEastConst, imgWhitefieldTowers],
    features: [
      'Private Landscaped Backyard with Wooden Deck',
      'Sobha Signature German Quality Construction',
      'Exclusive 25,000 Sq.Ft. Tudor Clubhouse & Heated Pool',
      '2 Covered Dedicated Car Parks per Villa',
      '100% DG Power Backup & Rainwater Harvesting',
      'CCTV Secured Gated Community'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '20:80 Builder Subvention & Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_aplus_godrej_park_retreat',
    name: 'Godrej Park Retreat (Phase 2)',
    builderName: 'Godrej Properties',
    builderCategory: 'A+',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK Smart (1103 Sq.Ft.) · 3 BHK Luxe (1450 Sq.Ft.) · 3.5 BHK (1740 Sq.Ft.)',
    description: 'Resort-style contemporary high-rise towers at Location: Sarjapur Road - Carmelaram / Hadosiddapura Corridor. Features 28,000 Sq.Ft. lifestyle clubhouse, 50+ resort amenities, and immediate proximity to Wipro SEZ and RGA Tech Park. Nearby Connectivity (Sarjapur Road): Schools: DPS East (2.4 km), Primus International (2.8 km), Greenwood High (4.1 km) | Hospitals: Manipal Hospital Sarjapur (3.6 km), Motherhood (3.1 km) | IT Hubs: Wipro Corporate Office (1.8 km), RGA Tech Park (2.2 km), RMZ Ecoworld (4.6 km).',
    price: 'Rs. 1.25 Cr - Rs. 2.10 Cr*',
    lastPrice: 'Rs. 1.32 Cr onwards*',
    location: 'Sarjapur Road - Carmelaram / Hadosiddapura, Bangalore',
    locationTarget: 'Carmelaram Station (1.5 km) • Wipro HQ (1.8 km) • Manipal Hospital (3.6 km)',
    zone: 'Sarjapur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Contemporary Resort Living',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/280222/004743',
    handoverDate: 'December 2027',
    projectSize: '13.0 Acres (8 Towers)',
    noOfTowers: '8 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 27 Floors',
    imageUrls: [imgCatAPlusTowers, imgSouthEastConst, imgWhitefieldTowers],
    features: [
      '28,000 Sq.Ft. 3-Level Resort Clubhouse',
      'Infinity Edge Swimming Pool & Sky Lounge',
      'Indoor Squash, Badminton & Mini Theater',
      'EV Charging Bays & 100% DG Power Backup',
      '5 Mins to Wipro SEZ & Upcoming Sarjapur Metro',
      'Zero Brokerage Direct Builder Inventory'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10:90 Construction Linked Payment Plan Available*',
    createdAt: null
  },
  {
    id: 'curated_primary_aplus_total_env_quiet_earth',
    name: 'Total Environment In That Quiet Earth',
    builderName: 'Total Environment',
    builderCategory: 'A+',
    approvalBody: 'BBMP & BDA OC Received',
    floorPlan: '3 BHK L20 (2305 Sq.Ft.) · 3.5 BHK H20 (2890 Sq.Ft.) · 4 BHK V35 (3430 Sq.Ft.)',
    description: 'Earth-sheltered handcrafted luxury residences at Location: East Bangalore - Hennur Corridor. Every home features an expansive landscaped terrace garden with real grass and wooden deck, bespoke wire-cut brick construction, and custom imported woodwork. Ready for immediate handover. Nearby Connectivity: Schools: Legacy School (1.8 km), Delhi Public School North (4.5 km) | Hospitals: Aster CMI Hospital (6.8 km), Regal Hospital (2.1 km) | IT Hubs: Manyata Tech Park (5.4 km), Bagmane Tech Park (8.2 km).',
    price: 'Rs. 2.45 Cr - Rs. 4.20 Cr*',
    lastPrice: 'Rs. 2.58 Cr (Ready Homes)*',
    location: 'East Bangalore - Hennur Corridor, Bangalore',
    locationTarget: 'Hennur Junction (1.2 km) • Manyata Tech Park (5.4 km) • DPS North (4.5 km)',
    zone: 'East Bangalore',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '4 BHK'],
    segment: 'Artisanal Biophilic Luxury',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180516/001740',
    handoverDate: 'Ready to Move (Immediate Handover)',
    projectSize: '14.5 Acres (4 High-Rise Towers & Villas)',
    noOfTowers: '4 Signature Towers',
    flatsPerFloor: '2 to 4 Residences per Floor',
    floorsHeight: '2B + G + 28 Floors',
    imageUrls: [imgCatAPlusTowers, imgEastReady, imgLuxuryResale],
    features: [
      'Private Terrace Garden in Every Home',
      'Heated Indoor Pool, Gym & Squash Courts',
      'Imported Kitchen with Siemens Appliances',
      'Centralized Heat Pump & VRV Air Conditioning',
      'OC Received • Zero GST on Immediate Handover',
      '2 Covered Reserved Basements Car Parks'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Key Handover • Customized Interior Upgrade Options*',
    createdAt: null
  },
  {
    id: 'curated_primary_aplus_birla_trimaya_eoi',
    name: 'Birla Trimaya (Phase 2 The Hills)',
    builderName: 'Birla Estates',
    builderCategory: 'A+',
    approvalBody: 'BMRDA & Karnataka RERA Approved',
    floorPlan: '2 BHK Elegant (1080 Sq.Ft.) · 3 BHK Luxe (1540 Sq.Ft.) · 4 BHK Duplex (2520 Sq.Ft.)',
    description: '52-acre mega township at Location: East Bangalore - Airport Link Highway Corridor. Features a 45,000 Sq.Ft. clubhouse, 8-acre central lake park, and high-street shopping boulevard. Phase 2 The Hills is currently open for pre-launch EOI applications. Nearby Connectivity: Schools: Stonehill International (4.2 km), Ryan International (5.1 km) | Hospitals: Aster Hospital (8.2 km), Manipal Hospital (9.1 km) | IT Hubs: KIADB Aerospace & Hardware SEZ (2.9 km), IFCI Financial City (4.2 km).',
    price: 'Rs. 1.15 Cr - Rs. 2.65 Cr*',
    lastPrice: 'Rs. 1.22 Cr onwards*',
    location: 'East Bangalore - Airport Link Highway Corridor, Bangalore',
    locationTarget: 'Aerospace SEZ (2.9 km) • Stonehill School (4.2 km) • Airport Toll (6.5 km)',
    zone: 'East Bangalore',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK', '4 BHK'],
    segment: 'Integrated Mega Township',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/050923/006241',
    handoverDate: 'December 2028',
    projectSize: '52.0 Acres (8 Towers in Phase 2)',
    noOfTowers: '8 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 25 Floors',
    imageUrls: [imgCatAPlusTowers, imgEastEoi, imgWhitefieldTowers],
    features: [
      '45,000 Sq.Ft. Imperial Hill Clubhouse',
      '8-Acre Central Lake & Promenade',
      'Over 80% Open Green Biophilic Spaces',
      'Pre-Launch EOI Priority Window Active',
      'High-Street Retail & Dining Boulevard in Township',
      'Direct Highway Access & Rapid Appreciation'
    ],
    handoverStatus: 'EOI',
    paymentOffers: 'Priority EOI Allocation • 20:80 CLP Scheme*',
    createdAt: null
  },

  // ================= CATEGORY A DEVELOPERS (PLOTS, EOI, UNDER CONSTRUCTION, READY) =================
  {
    id: 'curated_plot_assetz_earth_essence',
    name: 'Assetz Earth & Essence Plotted Sanctuary',
    builderName: 'Assetz Property Group',
    builderCategory: 'A',
    approvalBody: 'BMRDA & RERA Approved (A-Khata)',
    floorPlan: '30x50 (1500 Sq.Ft.) · 40x60 (2400 Sq.Ft.) · 50x60 (3000 Sq.Ft.) Villa Plots',
    description: 'Eco-conscious 16.8-acre plotted development at Location: Off Hoskote - International Airport Link Corridor. Crafted with native orchards, natural bio-swales, underground services, and ready-to-register A-Khata plots for building bespoke luxury villas. Nearby Connectivity: Schools: Canadian International School (6.2 km), Delhi Public School (5.8 km) | Hospitals: Columbia Asia / Manipal (7.2 km) | IT Hubs: Aerospace SEZ (4.5 km), ITPL (11.2 km).',
    price: 'Rs. 95 Lakhs - Rs. 1.85 Cr*',
    lastPrice: 'Rs. 98 Lakhs onwards*',
    location: 'Off Hoskote - International Airport Link Corridor, Bangalore',
    locationTarget: 'STRR Interchange (1.8 km) • Aerospace SEZ (4.5 km) • Hoskote (6.5 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['1500 Sq.Ft.', '2400 Sq.Ft.', '3000 Sq.Ft.'],
    segment: 'Eco-Luxury Villa Plots',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/190624/002621',
    handoverDate: 'Ready to Move (Immediate Registration)',
    projectSize: '16.8 Acres Plotted Community (180 Plots)',
    noOfTowers: '180 Villa Plots',
    flatsPerFloor: 'Independent Villa Plots',
    floorsHeight: 'Villa Plot Enclave',
    imageUrls: [imgLuxuryPlotEstate, imgCatABiophilic, imgHoskoteTownship],
    features: [
      'BMRDA Approved Clear A-Khata Title',
      'Underground Electrical, Fiber & Water Distribution',
      '15,000 Sq.Ft. Clubhouse with Pool & Organic Farm',
      'Wide Cobblestone-Paved Internal Avenues',
      'Ready for Immediate Construction & Handover',
      'Zero Brokerage Acquisition Desk'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Instant Registration • 80% Bank Loan Approved*',
    createdAt: null
  },
  {
    id: 'curated_plot_century_seasons',
    name: 'Century Seasons & Meadows Plotted Estate',
    builderName: 'Century Real Estate',
    builderCategory: 'A',
    approvalBody: 'BMRDA & STRR Approved (A-Khata)',
    floorPlan: '30x40 (1200 Sq.Ft.) · 30x50 (1500 Sq.Ft.) · 40x60 (2400 Sq.Ft.) Villa Plots',
    description: 'Serene 25-acre plotted residential sanctuary along the East Bangalore - STRR Expressway Corridor. Complete with fully grown canopy trees, asphalted avenues, underground utilities, and ready-to-construct plots with clear titles. Nearby Connectivity: Schools: Chrysalis High (3.8 km), Vibgyor High (4.2 km) | Hospitals: MVJ Hospital (3.5 km) | Transit: STRR Main Road (0.2 km).',
    price: 'Rs. 78 Lakhs - Rs. 1.60 Cr*',
    lastPrice: 'Rs. 82 Lakhs onwards*',
    location: 'East Bangalore - STRR Expressway Corridor, Bangalore',
    locationTarget: 'STRR Express Highway (0.2 km) • MVJ Hospital (3.5 km) • Hoskote Town (3.8 km)',
    zone: 'East Bangalore',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['1200 Sq.Ft.', '1500 Sq.Ft.', '2400 Sq.Ft.'],
    segment: 'Premium Plotted Sanctuary',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/201015/003642',
    handoverDate: 'Ready to Move',
    projectSize: '25.0 Acres (260 Plots)',
    noOfTowers: '260 Villa Plots',
    flatsPerFloor: 'Independent Plots',
    floorsHeight: 'Villa Plot Layout',
    imageUrls: [imgLuxuryPlotEstate, imgEastReady, imgCatABiophilic],
    features: [
      'BMRDA Approved Clear Title with Instant Khata',
      'Underground Drainage, Sewage Treatment & Water Supply',
      'Full-Service Clubhouse & Tennis Court',
      'Over 2,000 Native Trees & Landscaped Central Park',
      '24/7 Security Patrol & CCTV Surveillance',
      'Direct STRR Expressway Access'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Ready for Immediate Handover • Bank Loan from Leading Lenders*',
    createdAt: null
  },
  {
    id: 'curated_sumadhura_folium_uc',
    name: 'Sumadhura Folium (Park & Lake Residences)',
    builderName: 'Sumadhura Group',
    builderCategory: 'A',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK (1280 Sq.Ft.) · 3 BHK (1650 - 1880 Sq.Ft.) · 4 BHK Sky Villa (2450 Sq.Ft.)',
    description: 'Nature-infused biophilic high-rise towers at Location: Whitefield - Borewell Road & ITPL Corridor. Features 35,000 Sq.Ft. dual clubhouse, sky-gardens, lakefront view decks, and seamless access to ITPL and Hope Farm Metro. Nearby Connectivity (Whitefield Borewell): Schools: Deens Academy (1.8 km), Ryan International (2.4 km) | Hospitals: Manipal Hospital Whitefield (1.9 km), Vydehi (2.8 km) | IT Hubs: ITPL (1.8 km), Brigade Tech Gardens (2.1 km).',
    price: 'Rs. 1.48 Cr - Rs. 2.35 Cr*',
    lastPrice: 'Rs. 1.55 Cr onwards*',
    location: 'Whitefield - Borewell Road & ITPL Corridor, Bangalore',
    locationTarget: 'Borewell Bus Stop (0.3 km) • ITPL (1.8 km) • Hope Farm Metro (2.2 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK', '4 BHK'],
    segment: 'Biophilic Luxury High-Rise',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/220311/004781',
    handoverDate: 'December 2026',
    projectSize: '16.5 Acres (7 High-Rise Towers)',
    noOfTowers: '7 High-Rise Towers',
    flatsPerFloor: '4 to 6 Flats per Floor',
    floorsHeight: '2B + G + 24 Floors',
    imageUrls: [imgCatABiophilic, imgWhitefieldTowers, imgSouthEastConst],
    features: [
      '35,000 Sq.Ft. Dual Clubhouses with Sky Lounge',
      'Biophilic Botanical Gardens & Reflexology Trail',
      'Half-Olympic Swimming Pool & Kids Splash Zone',
      'Squash Court, Badminton, Aerobics & Gym',
      '5 Mins to ITPL & Hope Farm Metro Station',
      '100% Vaastu Compliant 3-Side Open Homes'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '15:85 Milestone Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_a_mana_dale_eoi',
    name: 'Mana Dale (Tower Solstice EOI)',
    builderName: 'Mana Projects',
    builderCategory: 'A',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '3 BHK (1620 Sq.Ft.) · 3.5 BHK (1940 Sq.Ft.) · 4 BHK (2350 Sq.Ft.)',
    description: 'Eco-conscious forest living apartment enclave at Location: Sarjapur Road - Kodathi Corridor. Features a 55,000 Sq.Ft. clubhouse, natural foliage forest walk, and zero wall sharing between residences. EOI window active for Tower Solstice. Nearby Connectivity (Sarjapur - Kodathi): Schools: DPS East (1.8 km), Harvest International (1.4 km) | Hospitals: Belenus Hospital (1.9 km), Manipal Hospital (3.2 km) | IT Hubs: Wipro SEZ (1.5 km), RGA Tech Park (1.8 km).',
    price: 'Rs. 1.35 Cr - Rs. 2.25 Cr*',
    lastPrice: 'Rs. 1.42 Cr onwards*',
    location: 'Sarjapur Road - Kodathi Corridor, Bangalore',
    locationTarget: 'Kodathi Bus Stop (0.4 km) • Wipro SEZ (1.5 km) • DPS East (1.8 km)',
    zone: 'Sarjapur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['3 BHK', '3.5 BHK', '4 BHK'],
    segment: 'Forest Living Luxury',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/171123/006412',
    handoverDate: 'December 2028',
    projectSize: '6.8 Acres (5 High-Rise Towers)',
    noOfTowers: '5 High-Rise Towers',
    flatsPerFloor: '4 Flats per Floor',
    floorsHeight: '2B + G + 26 Floors',
    imageUrls: [imgCatABiophilic, imgEastEoi, imgSouthEastConst],
    features: [
      '55,000 Sq.Ft. Ultra Clubhouse & Sky-Walk',
      '100-Year-Old Natural Tree Sanctuary Preserved',
      'Temperature-Controlled Pool & Health Club',
      'Pre-Launch EOI Window • Priority Allotment',
      'Minutes to Wipro Corporate Office & RGA Park',
      'Zero Common Wall Design'
    ],
    handoverStatus: 'EOI',
    paymentOffers: 'Priority EOI Allocation • Flexible CLP*',
    createdAt: null
  },
  {
    id: 'curated_primary_a_shriram_greenfield',
    name: 'Shriram Greenfield Phase 2',
    builderName: 'Shriram Properties',
    builderCategory: 'A',
    approvalBody: 'BMRDA & BBMP OC Received',
    floorPlan: '2 BHK (1015 Sq.Ft.) · 2.5 BHK (1225 Sq.Ft.) · 3 BHK (1485 Sq.Ft.)',
    description: 'Award-winning ready-to-move township at Location: Whitefield - Hoskote Road (Budigere Cross). Offering OC-received smart residential homes with zero GST, 19.5 acres of lush landscaped spaces, and direct connectivity to OMR and Whitefield IT belt. Nearby Connectivity: Schools: Vibgyor High (2.9 km), New Baldwin (1.8 km) | Hospitals: East Point Hospital (3.2 km) | IT Hubs: Bearys Global Research Triangle (2.4 km), ITPL (6.8 km).',
    price: 'Rs. 88 Lakhs - Rs. 1.38 Cr*',
    lastPrice: 'Rs. 92 Lakhs (Ready to Move)*',
    location: 'Whitefield - Hoskote Road (Budigere Cross), Bangalore',
    locationTarget: 'Budigere Bus Stop (0.3 km) • Orion Uptown (1.8 km) • ITPL (6.8 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Smart Township Living',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180219/002319',
    handoverDate: 'Ready to Move (Immediate Handover)',
    projectSize: '19.5 Acres (9 Towers)',
    noOfTowers: '9 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 19 Floors',
    imageUrls: [imgCatABiophilic, imgEastReady, imgHoskoteTownship],
    features: [
      'OC Received • Zero GST • Ready for Handover',
      '30,000 Sq.Ft. Lifestyle Clubhouse & 2 Pools',
      'Tennis, Basketball, Cricket Pitch & Skating Rink',
      'In-Campus Supermarket, Pharmacy & Creche',
      'Covered Car Parking & 24/7 Security Backup',
      'Approved by SBI, HDFC & All Major Banks'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Key Handover • Ready for Registration*',
    createdAt: null
  },

  // ================= CATEGORY B BUILDERS (PLOTS, READY, UNDER CONSTRUCTION, EOI) =================
  {
    id: 'curated_plot_myhna_maple_leaf',
    name: 'Myhna Maple Leaf Plotted Enclave',
    builderName: 'Myhna Properties',
    builderCategory: 'B',
    approvalBody: 'BMRDA & RERA Approved (A-Khata)',
    floorPlan: '30x40 (1200 Sq.Ft.) · 30x50 (1500 Sq.Ft.) Plotted Land',
    description: 'Boutique gated plotted community at Location: Varthur - Gunjur Link Road. Ready for immediate registration and villa construction with paved internal roads, underground drainage, and individual water connections. Nearby Connectivity (Varthur - Gunjur): Schools: Chrysalis High (1.2 km), Oakridge International (2.2 km) | Hospitals: Sahasra Hospital (1.6 km) | IT Hubs: Wipro SEZ (4.5 km), ITPL (6.5 km).',
    price: 'Rs. 65 Lakhs - Rs. 1.18 Cr*',
    lastPrice: 'Rs. 68 Lakhs onwards*',
    location: 'Varthur - Gunjur Link Road, Bangalore',
    locationTarget: 'Gunjur Stop (0.4 km) • Chrysalis High (1.2 km) • Wipro SEZ (4.5 km)',
    zone: 'Varthur',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['1200 Sq.Ft.', '1500 Sq.Ft.'],
    segment: 'Boutique Villa Plots',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210815/004271',
    handoverDate: 'Ready to Move (Immediate Handover)',
    projectSize: '8.2 Acres (110 Plots)',
    noOfTowers: '110 Plots',
    flatsPerFloor: 'Independent Plots',
    floorsHeight: 'Villa Plot Layout',
    imageUrls: [imgLuxuryPlotEstate, imgVarthurLakefront, imgEastReady],
    features: [
      'BMRDA Approved Clear A-Khata Title',
      'Paved Internal Roads with LED Streetlights',
      'Underground Drainage & Water Supply Lines',
      'Landscaped Kids Park & Jogging Track',
      '24/7 Security & CCTV Compound Wall',
      '100% Vaastu Verified East & North Facing Plots'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Instant Registration • Bank Loan Approved*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_dsr_courtyard',
    name: 'DSR The Courtyard',
    builderName: 'DSR Infrastructure',
    builderCategory: 'B',
    approvalBody: 'BBMP & RERA Approved (OC Received)',
    floorPlan: '2 BHK (1180 Sq.Ft.) · 3 BHK (1560 Sq.Ft.) · 3 BHK Lakeview (1780 Sq.Ft.)',
    description: 'Ready-to-move mid-rise luxury residential community at Location: Gunjur - Varthur Link Road. Features an open central courtyard, clubhouse, swimming pool, and zero GST resale and primary inventory. Nearby Connectivity: Schools: Krupanidhi College (0.5 km), Chrysalis High (1.1 km) | Hospitals: Spandana Hospital (1.2 km) | IT Hubs: Wipro SEZ (3.8 km), RGA Tech Park (4.2 km).',
    price: 'Rs. 1.12 Cr - Rs. 1.68 Cr*',
    lastPrice: 'Rs. 1.18 Cr (Ready Homes)*',
    location: 'Gunjur - Varthur Link Road, Bangalore',
    locationTarget: 'Krupanidhi Stop (0.3 km) • Chrysalis High (1.1 km) • Wipro SEZ (3.8 km)',
    zone: 'Gunjur',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Courtyard Gated Residences',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/190822/002819',
    handoverDate: 'Ready to Move',
    projectSize: '5.5 Acres (320 Units)',
    noOfTowers: '4 Residential Wings',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 12 Floors',
    imageUrls: [imgCatBModern, imgEastReady, imgGunjurSanctuary],
    features: [
      'OC Received • Zero GST • Clear Title',
      'Clubhouse with Gymnasium & Rooftop Terrace',
      'Swimming Pool & Children Play Park',
      'Covered Car Parking & 100% DG Backup',
      '10 Mins to Carmelaram Station & Wipro SEZ',
      'Dual Borewell & Cauvery Water Connection'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Key Handover • 0% Brokerage*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_bren_palms',
    name: 'Bren Palms Lakeview Residences',
    builderName: 'Bren Corporation',
    builderCategory: 'B',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK (1190 Sq.Ft.) · 3 BHK (1540 Sq.Ft.) · 3.5 BHK (1820 Sq.Ft.)',
    description: 'Contemporary high-rise residential towers at Location: Hosa Road - Kudlu Gate Corridor. Features lake views, football turf, infinity pool, and seamless connectivity to the upcoming Yellow Line Metro and Electronic City IT parks. Nearby Connectivity: Schools: Vibgyor High (1.6 km) | Hospitals: Springleaf Hospital (2.1 km), Kauvery (3.0 km) | IT Hubs: AMR Tech Park (2.4 km), Infosys E-City (4.2 km).',
    price: 'Rs. 1.28 Cr - Rs. 1.95 Cr*',
    lastPrice: 'Rs. 1.34 Cr onwards*',
    location: 'Hosa Road - Kudlu Gate Corridor, Bangalore',
    locationTarget: 'Kudlu Gate (1.2 km) • Hosa Road Metro (1.8 km) • AMR Tech Park (2.4 km)',
    zone: 'Hosa Road',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Modern Tech-Belt Residences',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/230118/005642',
    handoverDate: 'December 2026',
    projectSize: '6.2 Acres (480 Units)',
    noOfTowers: '4 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 18 Floors',
    imageUrls: [imgCatBModern, imgHosaRoadSkyline, imgSouthEastConst],
    features: [
      'Overlooking Natural Lake & Botanical Greenery',
      '20,000 Sq.Ft. Clubhouse with Heated Pool',
      'Football Turf, Tennis & Badminton Courts',
      'EV Charging Bays & 100% DG Power Backup',
      'Minutes to Kudlu Gate & Hosa Road Metro',
      'Direct Builder Inventory with Flexible Milestones'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '10:90 Construction Linked Payment Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_casagrand_boulevard_eoi',
    name: 'Casagrand Boulevard (Phase 2 EOI)',
    builderName: 'Casagrand Builder',
    builderCategory: 'B',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK (1090 Sq.Ft.) · 3 BHK (1480 Sq.Ft.) · 3 BHK Royale (1690 Sq.Ft.)',
    description: 'Resort-themed high-rise community at Location: East Bangalore - Budigere & Old Madras Link. Offering 75+ lifestyle amenities, expansive landscaped central podium, and attractive pre-launch EOI pricing for smart residential buyers. Nearby Connectivity: Schools: New Baldwin International (1.9 km) | Hospitals: East Point Hospital (2.8 km) | IT Hubs: Bearys Tech Park (2.9 km), ITPL (6.8 km).',
    price: 'Rs. 95 Lakhs - Rs. 1.55 Cr*',
    lastPrice: 'Rs. 99 Lakhs onwards*',
    location: 'East Bangalore - Budigere & Old Madras Link, Bangalore',
    locationTarget: 'Budigere Cross (1.5 km) • Bearys Tech Park (2.9 km) • OMR Highway (2.1 km)',
    zone: 'East Bangalore',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Resort-Style Community',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/231122/006421',
    handoverDate: 'December 2027',
    projectSize: '7.5 Acres (6 Towers)',
    noOfTowers: '6 High-Rise Towers',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: '2B + G + 16 Floors',
    imageUrls: [imgCatBModern, imgEastEoi, imgWhitefieldTowers],
    features: [
      '75+ Lifestyle Amenities & Resort Pool',
      'Vehicle-Free Central Podium Lawn',
      'Pre-Launch EOI Window • Priority Allotment',
      'Gaming Arcade, Cinema & Co-Working Hub',
      'Seamless Access to OMR & Whitefield Metro',
      'Zero Brokerage Direct Allocation'
    ],
    handoverStatus: 'EOI',
    paymentOffers: 'Special Pre-launch Pricing • 20:80 CLP Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_b_gopalan_lakefront',
    name: 'Gopalan Lakefront Enclave',
    builderName: 'Gopalan Enterprises',
    builderCategory: 'B',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK Smart (1150 Sq.Ft.) · 3 BHK Family (1520 Sq.Ft.)',
    description: 'Lakeview residential apartment community at Location: Electronic City - Hosa Road Link Corridor. Features Vaastu compliant layouts, clubhouse with indoor games, gym, and swift connectivity to Electronic City Phase 1 tech campuses. Nearby Connectivity: Schools: Orchids The International (1.8 km) | Hospitals: Kauvery Hospital (2.5 km) | IT Hubs: Infosys Campus (3.5 km), Wipro E-City (3.8 km).',
    price: 'Rs. 89 Lakhs - Rs. 1.35 Cr*',
    lastPrice: 'Rs. 94 Lakhs onwards*',
    location: 'Electronic City - Hosa Road Link Corridor, Bangalore',
    locationTarget: 'Electronic City Toll (2.2 km) • Infosys HQ (3.5 km) • Metro (2.0 km)',
    zone: 'Electronic City',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Smart Tech Residences',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/221018/005319',
    handoverDate: 'September 2026',
    projectSize: '4.8 Acres (320 Units)',
    noOfTowers: '4 Residential Blocks',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: 'B + G + 12 Floors',
    imageUrls: [imgCatBModern, imgSouthEastConst, imgHosaRoadSkyline],
    features: [
      'Overlooking Natural Lake Views',
      'Clubhouse with Indoor Badminton & Gym',
      'Swimming Pool & Children Play Park',
      'Covered Parking & 24/7 Security Backup',
      'Minutes to Electronic City IT Hubs',
      'BBMP A-Khata Approved Construction'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Milestone Linked Payment Scheme Available*',
    createdAt: null
  },

  // ================= CATEGORY C BUILDERS (PLOTS, READY, UNDER CONSTRUCTION, EOI) =================
  {
    id: 'curated_plot_radiant_silver_oak',
    name: 'Radiant Silver Oak Villa Plots',
    builderName: 'Radiant Structures',
    builderCategory: 'C',
    approvalBody: 'BMRDA & STRR Approved (A-Khata)',
    floorPlan: '30x40 (1200 Sq.Ft.) · 30x50 (1500 Sq.Ft.) Villa Plots',
    description: 'Approved plotted development at Location: Hoskote - Kattamnallur STRR Belt. Offering clear A-Khata villa plots with asphalted roads, water connection, and immediate registration for residential villa construction. Nearby Connectivity: Schools: Citizen Public School (1.4 km) | Hospitals: MVJ Hospital (2.5 km) | Highway: STRR Link Road (0.2 km).',
    price: 'Rs. 42 Lakhs - Rs. 75 Lakhs*',
    lastPrice: 'Rs. 45 Lakhs onwards*',
    location: 'Hoskote - Kattamnallur STRR Belt, Bangalore',
    locationTarget: 'STRR Link (0.2 km) • MVJ Hospital (2.5 km) • Hoskote Town (2.8 km)',
    zone: 'Hoskote',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['1200 Sq.Ft.', '1500 Sq.Ft.'],
    segment: 'Smart Value Villa Plots',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/200812/003512',
    handoverDate: 'Ready to Move (Immediate Registration)',
    projectSize: '6.5 Acres (92 Plots)',
    noOfTowers: '92 Villa Plots',
    flatsPerFloor: 'Independent Plots',
    floorsHeight: 'Villa Plot Layout',
    imageUrls: [imgLuxuryPlotEstate, imgCatCBoutique, imgHoskoteTownship],
    features: [
      'BMRDA Approved Clear Title with Individual A-Khata',
      'Paved Internal Roads, Streetlights & Water Supply',
      'Compound Wall Gated Security with CCTV',
      'Park, Jogging Track & Children Play Area',
      'Ready for Immediate Construction',
      'Bank Loan from SBI, Canara Bank & LIC HFL'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Instant Registration • Attractive Loan Options*',
    createdAt: null
  },
  {
    id: 'curated_plot_slv_silicon_county_eoi',
    name: 'SLV Silicon County (EOI Villa Plots)',
    builderName: 'SLV Infra Projects',
    builderCategory: 'C',
    approvalBody: 'BMRDA / BDA Approved',
    floorPlan: '30x40 (1200 Sq.Ft.) · 30x50 (1500 Sq.Ft.) Villa Plots',
    description: 'Pre-launch plotted development at Location: Electronic City Phase 2 - Chandapura Belt. Features wide internal roads, underground drainage, and early bird EOI allotment prices for IT professionals and high-yield investors. Nearby Connectivity: Schools: Delhi Public School E-City (2.8 km) | Hospitals: Narayana Hrudayalaya (3.5 km) | IT Hubs: Electronic City Phase 2 (4.2 km).',
    price: 'Rs. 38 Lakhs - Rs. 68 Lakhs*',
    lastPrice: 'Rs. 41 Lakhs onwards*',
    location: 'Electronic City Phase 2 - Chandapura Belt, Bangalore',
    locationTarget: 'Chandapura Circle (1.4 km) • Narayana Hrudayalaya (3.5 km) • E-City (4.2 km)',
    zone: 'Electronic City',
    type: 'Primary',
    propertyType: 'Plot',
    configuration: ['1200 Sq.Ft.', '1500 Sq.Ft.'],
    segment: 'High-Yield Plotted Enclave',
    reraNumber: 'PRM/KA/RERA/1251/308/PR/231015/006312',
    handoverDate: 'December 2026',
    projectSize: '9.0 Acres (125 Villa Plots)',
    noOfTowers: '125 Villa Plots',
    flatsPerFloor: 'Independent Plots',
    floorsHeight: 'Villa Plot Layout',
    imageUrls: [imgLuxuryPlotEstate, imgCatCBoutique, imgEastEoi],
    features: [
      'Pre-Launch EOI Window • Early Bird Pricing',
      'BMRDA Approved Layout with Individual E-Khata',
      'Underground Drainage, Overhead Tank & Power Lines',
      'Landscaped Central Park & Outdoor Fitness Station',
      '10 Mins to Electronic City Metro & Narayana Health City',
      'Direct Verification Inventory with Zero Brokerage'
    ],
    handoverStatus: 'EOI',
    paymentOffers: 'Special Launch EOI Offer • Easy Installment Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_c_sri_sai_golden_nest',
    name: 'Sri Sai Golden Nest',
    builderName: 'Sri Sai Constructions',
    builderCategory: 'C',
    approvalBody: 'BBMP Approved (A-Khata)',
    floorPlan: '2 BHK (1060 Sq.Ft.) · 3 BHK (1390 Sq.Ft.)',
    description: 'Ready-to-move boutique apartment building at Location: Whitefield - Channasandra / Kadugodi Link. 100% Vaastu compliant, low maintenance charges, and immediate occupancy with occupancy certificate verified. Nearby Connectivity (Whitefield Channasandra): Schools: Whitefield Global School (1.4 km), Glentree Academy (1.8 km) | Hospitals: Columbia Asia Whitefield (2.8 km) | Metro: Channasandra / Kadugodi Metro (1.2 km).',
    price: 'Rs. 65 Lakhs - Rs. 92 Lakhs*',
    lastPrice: 'Rs. 68 Lakhs (Ready Homes)*',
    location: 'Whitefield - Channasandra / Kadugodi Link, Bangalore',
    locationTarget: 'Kadugodi Metro (1.2 km) • Whitefield Global School (1.4 km) • ITPL (3.5 km)',
    zone: 'Whitefield',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Smart Boutique Living',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/210418/004128',
    handoverDate: 'Ready to Move',
    projectSize: '1.2 Acres (72 Units)',
    noOfTowers: '1 Boutique Wing',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: 'S + G + 5 Floors',
    imageUrls: [imgCatCBoutique, imgEastReady, imgWhitefieldTowers],
    features: [
      'BBMP A-Khata with OC Verified',
      'Gymnasium, Party Hall & Kids Play Area',
      'Lift, 24/7 Power Backup & Covered Car Parking',
      'Cauvery Water & Borewell Supply',
      'Walkable to Channasandra BMTC & Metro Link',
      'Ready for Immediate Registration & Possession'
    ],
    handoverStatus: 'Ready to Move',
    paymentOffers: 'Immediate Handover • Up to 90% Home Loan Approved*',
    createdAt: null
  },
  {
    id: 'curated_primary_c_durga_petals',
    name: 'Durga Petals Horizon',
    builderName: 'Durga Projects',
    builderCategory: 'C',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK Smart (1120 Sq.Ft.) · 3 BHK Comfort (1460 Sq.Ft.)',
    description: 'Under-construction contemporary residential enclave at Location: Marathahalli - Outer Ring Road Corridor. Features modern lifestyle amenities, covered basement car parking, and unbeatable connectivity to ORR IT corridor and Whitefield. Nearby Connectivity: Schools: Ryan International (2.4 km) | Hospitals: Sakra World Hospital (3.2 km) | IT Hubs: Prestige Tech Park (1.8 km), Cessna (2.2 km).',
    price: 'Rs. 79 Lakhs - Rs. 1.18 Cr*',
    lastPrice: 'Rs. 83 Lakhs onwards*',
    location: 'Marathahalli - Outer Ring Road Corridor, Bangalore',
    locationTarget: 'Marathahalli Bridge (1.2 km) • Prestige Tech Park (1.8 km) • Sakra Hospital (3.2 km)',
    zone: 'Marathalli',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Value Urban Homes',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/230412/005882',
    handoverDate: 'December 2026',
    projectSize: '2.5 Acres (140 Residences)',
    noOfTowers: '2 Towers',
    flatsPerFloor: '7 Flats per Floor',
    floorsHeight: '2B + G + 8 Floors',
    imageUrls: [imgCatCBoutique, imgSouthEastConst, imgEastReady],
    features: [
      'BBMP & Karnataka RERA Approved',
      'Clubhouse with Fitness Center & Indoor Games',
      'Rooftop Swimming Pool & Walking Path',
      '100% Power Backup & 24/7 Security CCTV',
      'Minutes to ORR IT Hubs & Marathahalli Market',
      'Direct Developer Inventory with Zero Brokerage'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: '15% Booking • Milestone Construction Linked Plan*',
    createdAt: null
  },
  {
    id: 'curated_primary_c_amrutha_heights',
    name: 'Amrutha Heights (Phase 2 Tower)',
    builderName: 'Amrutha Constructions',
    builderCategory: 'C',
    approvalBody: 'BBMP & Karnataka RERA Approved',
    floorPlan: '2 BHK Executive (1140 Sq.Ft.) · 3 BHK (1495 Sq.Ft.)',
    description: 'Mid-rise value residential community at Location: Kasavanahalli - Harlur Link Road. Well-ventilated corner units with low maintenance charges, dedicated parking, and swift access to Wipro Corporate Office and RMZ Ecospace Bellandur. Nearby Connectivity: Schools: Vibgyor Haralur (1.2 km), Asia Pacific (1.5 km) | Hospitals: Motherhood (2.0 km) | IT Hubs: Wipro HQ (1.8 km), Ecospace (3.2 km).',
    price: 'Rs. 84 Lakhs - Rs. 1.22 Cr*',
    lastPrice: 'Rs. 87 Lakhs onwards*',
    location: 'Kasavanahalli - Harlur Link Road, Bangalore',
    locationTarget: 'Kasavanahalli Stop (0.4 km) • Wipro HQ (1.8 km) • Motherhood Hospital (2.0 km)',
    zone: 'Kasavanahalli',
    type: 'Primary',
    propertyType: 'Apartment',
    configuration: ['2 BHK', '3 BHK'],
    segment: 'Boutique Tech-Belt Homes',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/230919/006277',
    handoverDate: 'March 2027',
    projectSize: '2.2 Acres (120 Units)',
    noOfTowers: '2 Blocks',
    flatsPerFloor: '6 Flats per Floor',
    floorsHeight: 'B + G + 7 Floors',
    imageUrls: [imgCatCBoutique, imgKasavanahalliVillas, imgSouthEastConst],
    features: [
      'BBMP A-Khata Approved Construction',
      'Swimming Pool, Gymnasium & Party Hall',
      'Children Play Park & Rainwater Harvesting',
      'Covered Car Parking & 24/7 DG Power Backup',
      '5 Mins to Wipro Corporate Office & Haralur Lake',
      'Direct Builder Inventory with 0% Brokerage'
    ],
    handoverStatus: 'Under Construction',
    paymentOffers: 'Flexible Milestone Construction Linked Plan*',
    createdAt: null
  }
];

const inferBuilderCategoryAndName = (project: Partial<Project>): { builderCategory: 'A+' | 'A' | 'B' | 'C'; builderName: string } => {
  const combined = `${project.name || ''} ${project.builderName || ''}`.toLowerCase();
  if (
    combined.includes('prestige') ||
    combined.includes('sobha') ||
    combined.includes('brigade') ||
    combined.includes('godrej') ||
    combined.includes('total environment') ||
    combined.includes('lodha') ||
    combined.includes('embassy') ||
    combined.includes('birla')
  ) {
    return {
      builderCategory: 'A+',
      builderName: project.builderName || `${(project.name || 'Premier').split(' ')[0]} Group`
    };
  }
  if (
    combined.includes('assetz') ||
    combined.includes('sumadhura') ||
    combined.includes('adarsh') ||
    combined.includes('purva') ||
    combined.includes('sattva') ||
    combined.includes('salarpuria') ||
    combined.includes('mana') ||
    combined.includes('shriram') ||
    combined.includes('century') ||
    combined.includes('provident')
  ) {
    return {
      builderCategory: 'A',
      builderName: project.builderName || `${(project.name || 'Premier').split(' ')[0]} Developers`
    };
  }
  if (
    combined.includes('dsr') ||
    combined.includes('bren') ||
    combined.includes('gopalan') ||
    combined.includes('candeur') ||
    combined.includes('casagrand') ||
    combined.includes('sjr') ||
    combined.includes('myhna') ||
    combined.includes('cjn')
  ) {
    return {
      builderCategory: 'B',
      builderName: project.builderName || `${(project.name || 'Premier').split(' ')[0]} Builders`
    };
  }
  if (
    combined.includes('radiant') ||
    combined.includes('sri sai') ||
    combined.includes('slv') ||
    combined.includes('bm ') ||
    combined.includes('amrutha') ||
    combined.includes('durga') ||
    combined.includes('enclave') ||
    combined.includes('residency')
  ) {
    return {
      builderCategory: 'C',
      builderName: project.builderName || `${(project.name || 'Boutique').split(' ')[0]} Constructions`
    };
  }
  return {
    builderCategory: (project.builderCategory as 'A+' | 'A' | 'B' | 'C') || 'A',
    builderName: project.builderName || 'Verified Bangalore Developer'
  };
};

const autoEnrichProjectData = (p: Project): Project => {
  const curatedMatch = CURATED_ARTISANAL_PROJECTS.find(
    c => c.id === p.id || c.name.trim().toLowerCase() === (p.name || '').trim().toLowerCase()
  );

  const inferred = inferBuilderCategoryAndName(p);
  const resolvedCategory = p.builderCategory || curatedMatch?.builderCategory || inferred.builderCategory;
  const resolvedBuilderName = p.builderName || curatedMatch?.builderName || inferred.builderName;
  const resolvedZone = p.zone || curatedMatch?.zone || 'Whitefield';
  const resolvedType = p.type === 'Primary Sale' ? 'Primary' : (p.type || curatedMatch?.type || 'Primary');
  const resolvedPropertyType = p.propertyType === 'Flat' ? 'Apartment' : (p.propertyType || curatedMatch?.propertyType || 'Apartment');
  const resolvedStatus = p.handoverStatus || curatedMatch?.handoverStatus || 'Under Construction';

  const hasValidLocalImages =
    Array.isArray(p.imageUrls) &&
    p.imageUrls.filter(Boolean).length > 0 &&
    !p.imageUrls.some(u => u.includes('unsplash.com') || u.includes('picsum.photos'));

  const resolvedImages = curatedMatch?.imageUrls
    ? curatedMatch.imageUrls
    : hasValidLocalImages
    ? p.imageUrls
    : getSmartProjectImages(resolvedZone, resolvedType, resolvedCategory, resolvedPropertyType);

  const defaultConnectivitySuffix = `Nearby Connectivity (${resolvedZone}): Schools: Deens Academy / Greenwood High / Vibgyor High (1.8 km) | Hospitals: Manipal Hospital / Sakra World / Motherhood Hospital (2.4 km) | IT Hubs: ITPL Whitefield / Wipro SEZ / RMZ Ecoworld (3.2 km) | Malls: Nexus Shantiniketan / Orion Uptown / Market Square Mall (2.9 km) | Bus Stop & Transit: ${resolvedZone} Main BMTC Bus Stop (0.3 km), Nearest Metro Station (2.6 km).`;

  const rawDesc = curatedMatch?.description || p.description || `${p.name} by ${resolvedBuilderName} in ${p.location || resolvedZone}, Bangalore.`;
  const enrichedDescription = rawDesc.includes('Nearby Connectivity')
    ? rawDesc
    : `${rawDesc} ${defaultConnectivitySuffix}`;

  const resolvedPrice = formatPriceWithCondition(p.price || curatedMatch?.price || 'Rs. 1.65 Cr onwards*');
  const resolvedLastPrice = formatPriceWithCondition(p.lastPrice || curatedMatch?.lastPrice || resolvedPrice);
  const resolvedHandoverDate =
    p.handoverDate ||
    curatedMatch?.handoverDate ||
    (resolvedStatus === 'Ready to Move' || resolvedStatus === 'Handed Over'
      ? 'Immediate Possession (OC Received)'
      : 'December 2027');

  return {
    ...(curatedMatch || {}),
    ...p,
    builderCategory: resolvedCategory,
    builderName: resolvedBuilderName,
    zone: resolvedZone,
    type: resolvedType,
    propertyType: resolvedPropertyType,
    handoverStatus: resolvedStatus,
    price: resolvedPrice,
    lastPrice: resolvedLastPrice,
    handoverDate: resolvedHandoverDate,
    location: p.location || curatedMatch?.location || `${resolvedZone}, Bangalore`,
    locationTarget:
      p.locationTarget ||
      curatedMatch?.locationTarget ||
      `${resolvedZone} Bus Stop (0.3 km) • Hospital (2.2 km) • IT Hub (3.2 km)`,
    approvalBody: p.approvalBody || curatedMatch?.approvalBody || 'BBMP / BDA & Karnataka RERA Approved',
    floorPlan: p.floorPlan || curatedMatch?.floorPlan || '2 BHK (1220 Sq.Ft.) · 3 BHK (1685 Sq.Ft.) · 4 BHK (2340 Sq.Ft.)',
    reraNumber: p.reraNumber || curatedMatch?.reraNumber || 'PRM/KA/RERA/1251/446/PR/Verified',
    description: enrichedDescription,
    imageUrls: resolvedImages,
    features:
      p.features && p.features.filter(Boolean).length > 0
        ? p.features
        : curatedMatch?.features || [
            'Grand Lifestyle Clubhouse & Swimming Pool',
            'Indoor Badminton, Squash & Gymnasium',
            'Landscaped Central Courtyard & Kids Park',
            '24/7 Tier-3 CCTV Security & Power Backup'
          ]
  };
};

// --- Main App ---

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem('bs_homez_portfolio_offline_cache');
      if (cached) {
        const parsed: Project[] = JSON.parse(cached);
        if (parsed && parsed.length > 0) return parsed;
      }
      const localCustom: Project[] = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
      const localNames = new Set(localCustom.map(p => p.name.toLowerCase()));
      return [
        ...localCustom.map(autoEnrichProjectData),
        ...CURATED_ARTISANAL_PROJECTS.filter(c => !localNames.has(c.name.toLowerCase())).map(autoEnrichProjectData)
      ];
    } catch {
      return CURATED_ARTISANAL_PROJECTS.map(autoEnrichProjectData);
    }
  });
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return !localStorage.getItem('bs_homez_portfolio_offline_cache');
    } catch {
      return true;
    }
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [downloadProject, setDownloadProject] = useState<Project | null>(null);
  const [enquiryType, setEnquiryType] = useState<'Acquire' | 'Consult' | 'Inquire'>('Acquire');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    location: 'All',
    zone: 'All',
    price: 'All',
    propertyType: 'All',
    handoverStatus: 'All'
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showHiddenProjects, setShowHiddenProjects] = useState(false);
  const [hiddenProjectIds, setHiddenProjectIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('bs_homez_hidden_projects') || '[]');
    } catch {
      return [];
    }
  });
  const [deletedProjectIds, setDeletedProjectIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('bs_homez_deleted_projects') || '[]');
    } catch {
      return [];
    }
  });

  const [activePropertyUrlId, setActivePropertyUrlId] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get('project');
    } catch {
      return null;
    }
  });

  // --- Project Comparison State (Up to 3 properties) ---
  const [comparedProjectIds, setComparedProjectIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('bs_homez_compared_projects') || '[]');
    } catch {
      return [];
    }
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareToast, setCompareToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('bs_homez_compared_projects', JSON.stringify(comparedProjectIds));
    } catch {}
  }, [comparedProjectIds]);

  const handleToggleCompare = (proj: Project) => {
    const key = proj.id || proj.name;
    setComparedProjectIds(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      if (prev.length >= 3) {
        setCompareToast("Maximum 3 properties can be compared side-by-side. Remove one to add another.");
        setTimeout(() => setCompareToast(null), 3500);
        return prev;
      }
      return [...prev, key];
    });
  };

  const handleRemoveCompare = (keyOrId: string) => {
    setComparedProjectIds(prev => prev.filter(k => k !== keyOrId));
  };

  const handleClearCompare = () => {
    setComparedProjectIds([]);
  };

  const handleAddProjectToCompare = (proj: Project) => {
    const key = proj.id || proj.name;
    setComparedProjectIds(prev => {
      if (prev.includes(key)) return prev;
      if (prev.length >= 3) {
        setCompareToast("Maximum 3 properties can be compared side-by-side. Remove one to add another.");
        setTimeout(() => setCompareToast(null), 3500);
        return prev;
      }
      return [...prev, key];
    });
  };

  const [activeMainTab, setActiveMainTab] = useState<MainAppTab>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as MainAppTab;
      if (tabParam && ['overview', 'projects', 'services', 'why-choose', 'insights', 'opportunity', 'referral', 'testimonials', 'loans', 'faq', 'about', 'admin'].includes(tabParam)) {
        return tabParam;
      }
      if (params.get('project') || params.get('corridor')) {
        return 'projects';
      }
    } catch {}
    return 'projects';
  });

  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [currentSeoSnapshot, setCurrentSeoSnapshot] = useState({
    title: "BS Homez – Buy, Sale, Resale & Rent Luxury Properties in Bangalore",
    description: "BS Homez: Buy, Sale, Resale & Rent RERA-verified Apartments, Villas & Plots in Whitefield, Hoskote, Varthur, Gunjur, Hosa Road, Kasavanahalli & Sarjapur, Bangalore.",
    canonicalUrl: "https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app/",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=85"
  });

  // Merge local hidden/deleted preferences with Firestore state & auto-enrich all project data with memoization
  const effectiveProjects = useMemo(() => {
    return projects.map(rawProj => {
      const p = autoEnrichProjectData(rawProj);
      const key = p.id || p.name;
      const isLocallyHidden = hiddenProjectIds.includes(key) || hiddenProjectIds.includes(p.name);
      const isLocallyDeleted = deletedProjectIds.includes(key) || deletedProjectIds.includes(p.name);
      return {
        ...p,
        price: formatPriceWithCondition(p.price),
        lastPrice: formatPriceWithCondition(p.lastPrice || p.price),
        isPaused: p.isPaused || isLocallyHidden,
        isDeleted: p.isDeleted || isLocallyDeleted
      };
    });
  }, [projects, hiddenProjectIds, deletedProjectIds]);

  const comparedProjects = useMemo(() => {
    return effectiveProjects.filter(
      p => comparedProjectIds.includes(p.id || '') || comparedProjectIds.includes(p.name)
    );
  }, [effectiveProjects, comparedProjectIds]);

  // --- Dynamic SEO Meta Tags & Schema.org JSON-LD Injection for Google, Meta & Social Spiders ---
  useEffect(() => {
    const baseUrl = "https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app";
    const defaultImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=85";

    // Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeName, attributeValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Helper to set canonical tag
    const setCanonical = (href: string) => {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', href);
    };

    const params = new URLSearchParams(window.location.search);
    const projectQuery = activePropertyUrlId || params.get('project');

    // Case 1: Specific Project Detail (Modal open or URL direct link)
    const activeProjectTarget = selectedProject || (projectQuery
      ? effectiveProjects.find(
          p => (p.id && p.id.toLowerCase() === decodeURIComponent(projectQuery).trim().toLowerCase()) ||
               p.name.toLowerCase() === decodeURIComponent(projectQuery).trim().toLowerCase()
        )
      : null);

    if (activeProjectTarget) {
      const propertyParam = encodeURIComponent(activeProjectTarget.id || activeProjectTarget.name);
      const canonicalUrl = `${baseUrl}/?project=${propertyParam}`;
      const pageTitle = `${activeProjectTarget.name} in ${activeProjectTarget.zone}, Bangalore | Price, Floor Plans – BS Homez`;
      const pageDesc = `${activeProjectTarget.name} by ${activeProjectTarget.builderName || 'Verified Builder'} in ${activeProjectTarget.location}, Bangalore. Price: ${activeProjectTarget.price}. Handover: ${activeProjectTarget.handoverDate || 'Immediate'}. RERA: ${activeProjectTarget.reraNumber || 'Verified'}. 0% buyer brokerage with BS Homez.`;
      const propertyImage = activeProjectTarget.imageUrls?.[0] || defaultImage;

      // 1. Update Document Title
      document.title = pageTitle;

      // 2. Standard Meta Tags
      setMetaTag('name', 'description', pageDesc);
      setMetaTag('name', 'keywords', `${activeProjectTarget.name}, ${activeProjectTarget.location}, ${activeProjectTarget.zone} properties, Buy ${activeProjectTarget.propertyType} Bangalore, ${activeProjectTarget.builderName}, BS Homez`);
      setCanonical(canonicalUrl);

      // 3. OpenGraph / Meta Social Tags
      setMetaTag('property', 'og:title', pageTitle);
      setMetaTag('property', 'og:description', pageDesc);
      setMetaTag('property', 'og:url', canonicalUrl);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:image', propertyImage);
      setMetaTag('property', 'og:image:secure_url', propertyImage);
      setMetaTag('property', 'og:image:width', '1200');
      setMetaTag('property', 'og:image:height', '630');
      setMetaTag('property', 'og:image:alt', `${activeProjectTarget.name} Bangalore`);

      // 4. Twitter Card Tags
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', pageTitle);
      setMetaTag('name', 'twitter:description', pageDesc);
      setMetaTag('name', 'twitter:image', propertyImage);
      setMetaTag('name', 'twitter:image:alt', `${activeProjectTarget.name} Bangalore`);

      // 5. Update Snapshot for Live SERP & Meta preview
      setCurrentSeoSnapshot({
        title: pageTitle,
        description: pageDesc,
        canonicalUrl: canonicalUrl,
        imageUrl: propertyImage
      });

      // 6. Property Schema.org JSON-LD Structured Data
      let jsonLdScript = document.getElementById('property-seo-jsonld') as HTMLScriptElement | null;
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'property-seo-jsonld';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }

      const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "name": activeProjectTarget.name,
            "description": activeProjectTarget.description,
            "url": canonicalUrl,
            "image": propertyImage,
            "category": `Real Estate > ${activeProjectTarget.propertyType} Properties`,
            "brand": {
              "@type": "Brand",
              "name": activeProjectTarget.builderName || "BS Homez Verified"
            },
            "offers": {
              "@type": "Offer",
              "price": activeProjectTarget.price,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "url": canonicalUrl,
              "seller": {
                "@type": "Organization",
                "name": "BS Homez",
                "telephone": "+91-9108187205",
                "email": "contact@bshomez.co.in",
                "url": baseUrl
              }
            }
          },
          {
            "@type": activeProjectTarget.propertyType === 'Villa' ? "SingleFamilyResidence" : activeProjectTarget.propertyType === 'Plot' ? "LandParcel" : "ApartmentComplex",
            "name": activeProjectTarget.name,
            "description": activeProjectTarget.description,
            "url": canonicalUrl,
            "image": propertyImage,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": activeProjectTarget.location,
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "postalCode": "560066",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 12.9698,
              "longitude": 77.7500
            },
            "offers": {
              "@type": "Offer",
              "price": activeProjectTarget.price,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "url": canonicalUrl,
              "category": activeProjectTarget.type,
              "seller": {
                "@type": "Organization",
                "name": "BS Homez",
                "telephone": "+91-9108187205",
                "email": "contact@bshomez.co.in",
                "url": baseUrl
              }
            }
          }
        ]
      };

      jsonLdScript.textContent = JSON.stringify(schemaData, null, 2);
      return;
    }

    // Clean up property specific schema if not viewing a project
    const propertyScript = document.getElementById('property-seo-jsonld');
    if (propertyScript) propertyScript.remove();

    // Case 2: Specific Corridor Filter Active
    if (activeMainTab === 'projects' && filters.zone && filters.zone !== 'All') {
      const zoneEncoded = encodeURIComponent(filters.zone.replace(/\s+/g, '-'));
      const canonicalUrl = `${baseUrl}/?corridor=${zoneEncoded}`;
      const pageTitle = `Luxury Properties in ${filters.zone}, Bangalore | Apartments, Villas & Plots – BS Homez`;
      const pageDesc = `Explore RERA-verified luxury apartments, villas, and plots across ${filters.zone}, Bangalore. Direct builder tie-ups with 0% brokerage on primary purchases with BS Homez.`;

      document.title = pageTitle;
      setMetaTag('name', 'description', pageDesc);
      setMetaTag('name', 'keywords', `${filters.zone} properties, Flats in ${filters.zone}, Villas in ${filters.zone}, Plots in ${filters.zone}, Bangalore Real Estate, BS Homez`);
      setCanonical(canonicalUrl);

      setMetaTag('property', 'og:title', pageTitle);
      setMetaTag('property', 'og:description', pageDesc);
      setMetaTag('property', 'og:url', canonicalUrl);
      setMetaTag('property', 'og:image', defaultImage);

      setMetaTag('name', 'twitter:title', pageTitle);
      setMetaTag('name', 'twitter:description', pageDesc);
      setMetaTag('name', 'twitter:image', defaultImage);

      setCurrentSeoSnapshot({
        title: pageTitle,
        description: pageDesc,
        canonicalUrl: canonicalUrl,
        imageUrl: defaultImage
      });
      return;
    }

    // Case 3: Other Main Tabs
    let tabTitle = "BS Homez – Buy, Sale, Resale & Rent Luxury Properties in Bangalore";
    let tabDesc = "BS Homez: Buy, Sale, Resale & Rent RERA-verified Apartments, Villas & Plots in Whitefield, Hoskote, Varthur, Gunjur, Hosa Road, Kasavanahalli & Sarjapur, Bangalore.";
    let tabUrl = `${baseUrl}/`;

    if (activeMainTab === 'loans') {
      tabTitle = "Home Loan Eligibility & Interest Calculator | Low LTV Mortgage Hub – BS Homez";
      tabDesc = "Calculate EMI, evaluate Loan-To-Value (LTV) ratios, and discover exclusive tie-up interest rates from SBI, HDFC & ICICI for Bangalore properties with BS Homez.";
      tabUrl = `${baseUrl}/?tab=loans`;
    } else if (activeMainTab === 'services') {
      tabTitle = "Bangalore Real Estate Advisory Services – Buy (0% Brokerage), Resale & Rent – BS Homez";
      tabDesc = "Explore transparent real estate services in East & South-East Bangalore: 0% primary buyer brokerage, 2% resale closing, and executive corporate rental desks.";
      tabUrl = `${baseUrl}/?tab=services`;
    } else if (activeMainTab === 'insights') {
      tabTitle = "Bangalore Real Estate Market Insights & Price Appreciation Trends – BS Homez";
      tabDesc = "Quarterly capital appreciation trends, rental yields, and upcoming Metro / STRR infrastructure impact reports across Whitefield, Hoskote, Varthur & Sarjapur.";
      tabUrl = `${baseUrl}/?tab=insights`;
    } else if (activeMainTab === 'opportunity') {
      tabTitle = "List Your Property for Sale or Rent in Bangalore | Direct Verification – BS Homez";
      tabDesc = "List your apartment, villa, or plot in Bangalore with BS Homez. Dedicated high-intent buyer and tenant matching with verified legal assistance.";
      tabUrl = `${baseUrl}/?tab=opportunity`;
    } else if (activeMainTab === 'referral') {
      tabTitle = "Client Referral Registry & Rewards | BS Homez Real Estate Advisory";
      tabDesc = "Recommend friends and colleagues seeking verified luxury homes in Bangalore. Benefit from priority advisory and dedicated relationship management.";
      tabUrl = `${baseUrl}/?tab=referral`;
    } else if (activeMainTab === 'faq') {
      tabTitle = "Frequently Asked Questions (FAQ) – Buying, Selling & Renting with BS Homez";
      tabDesc = "Clear answers on 0% builder brokerage, resale title verification, RERA approvals, and home loans for properties in Bangalore.";
      tabUrl = `${baseUrl}/?tab=faq`;
    } else if (activeMainTab === 'about') {
      tabTitle = "About BS Homez – Luxury & RERA-Verified Real Estate Advisory, Bangalore";
      tabDesc = "Learn about BS Homez's mission, localized corridor expertise, developer partnerships, and fiduciary advisory standards across Bangalore.";
      tabUrl = `${baseUrl}/?tab=about`;
    }

    document.title = tabTitle;
    setMetaTag('name', 'description', tabDesc);
    setMetaTag('name', 'keywords', 'Buy Property Bangalore, Sale Property Bangalore, Resale Flats Whitefield, Rent Apartments Bangalore, Villas in Sarjapur, Plots in Hoskote, BS Homez');
    setCanonical(tabUrl);

    setMetaTag('property', 'og:title', tabTitle);
    setMetaTag('property', 'og:description', tabDesc);
    setMetaTag('property', 'og:url', tabUrl);
    setMetaTag('property', 'og:image', defaultImage);

    setMetaTag('name', 'twitter:title', tabTitle);
    setMetaTag('name', 'twitter:description', tabDesc);
    setMetaTag('name', 'twitter:image', defaultImage);

    setCurrentSeoSnapshot({
      title: tabTitle,
      description: tabDesc,
      canonicalUrl: tabUrl,
      imageUrl: defaultImage
    });
  }, [effectiveProjects, activePropertyUrlId, selectedProject, activeMainTab, filters.zone]);

  // Initial URL search parameters detection (tab, corridor, project)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as MainAppTab;
      if (tabParam && ['overview', 'projects', 'services', 'why-choose', 'insights', 'opportunity', 'referral', 'testimonials', 'loans', 'faq', 'about', 'admin'].includes(tabParam)) {
        setActiveMainTab(tabParam);
      }
      const corridorParam = params.get('corridor');
      if (corridorParam) {
        const normalized = corridorParam.replace(/-/g, ' ');
        setFilters(f => ({ ...f, zone: normalized }));
        setActiveMainTab('projects');
      }
      const projectParam = params.get('project');
      if (projectParam) {
        setActivePropertyUrlId(projectParam);
        setActiveMainTab('projects');
      }
    } catch (e) {
      console.warn("URL params parsing notice:", e);
    }
  }, []);

  // Prevent Copying of text across the app for all online visitors except admin
  useEffect(() => {
    if (isAdmin) return;

    const handleCopy = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'u', 'U', 's', 'S', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdmin]);

  const hiddenProjectsCount = useMemo(() => {
    return effectiveProjects.filter(
      p => !p.isDeleted && !LEGACY_PROJECT_NAMES.includes(p.name) && p.isPaused
    ).length;
  }, [effectiveProjects]);

  const filteredProjects = useMemo(() => {
    const list = effectiveProjects.filter(p => {
      if (p.isDeleted) return false;
      if (LEGACY_PROJECT_NAMES.includes(p.name)) return false;
      if (filters.location !== 'All' && !p.location.toLowerCase().includes(filters.location.toLowerCase()) && !p.zone.toLowerCase().includes(filters.location.toLowerCase())) return false;
      const normalizedZone = p.zone === 'Bangalore East' ? 'East Bangalore' : p.zone;
      if (filters.zone !== 'All' && normalizedZone !== filters.zone && p.zone !== filters.zone && !p.location.toLowerCase().includes(filters.zone.toLowerCase())) return false;
      if (filters.propertyType !== 'All') {
        const normProp = p.propertyType === 'Flat' ? 'Apartment' : p.propertyType;
        const filterProp = filters.propertyType === 'Flat' ? 'Apartment' : filters.propertyType;
        if (normProp !== filterProp && p.propertyType !== filters.propertyType) return false;
      }
      if (filters.handoverStatus !== 'All' && p.handoverStatus !== filters.handoverStatus) return false;
      
      if (filters.price !== 'All') {
        const priceStr = p.price.toLowerCase();
        if (filters.price === 'Under Rs. 1 Cr') {
           const isLakhs = priceStr.includes('l') || priceStr.includes('month');
           const isLowCr = priceStr.includes('0.') && priceStr.includes('cr');
           if (!isLakhs && !isLowCr) return false;
        } else if (filters.price === 'Rs. 1 Cr - 3 Cr') {
           const hasMidCr = /([1-2](\.\d+)?|3(\.0+)?)\s*cr/.test(priceStr);
           if (!hasMidCr) return false;
        } else if (filters.price === 'Rs. 3 Cr+') {
           const match = priceStr.match(/(\d+(\.\d+)?)\s*cr/g);
           if (match) {
             const hasThreePlus = match.some(m => parseFloat(m) >= 3);
             if (!hasThreePlus) return false;
           } else {
             return false;
           }
        }
      }
      return true;
    });

    if (activePropertyUrlId) {
      const cleanId = decodeURIComponent(activePropertyUrlId).toLowerCase();
      list.sort((a, b) => {
        const aMatch = (a.id && a.id.toLowerCase() === cleanId) || a.name.toLowerCase() === cleanId;
        const bMatch = (b.id && b.id.toLowerCase() === cleanId) || b.name.toLowerCase() === cleanId;
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    return list;
  }, [effectiveProjects, filters, activePropertyUrlId]);

  const handleSaveProject = async (updated: Project) => {
    const formattedUpdated: Project = autoEnrichProjectData({
      ...updated,
      price: formatPriceWithCondition(updated.price),
      lastPrice: formatPriceWithCondition(updated.lastPrice || updated.price)
    });

    try {
      const existingLocal: Project[] = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
      const filteredLocal = existingLocal.filter(
        item => item.id !== formattedUpdated.id && item.name.toLowerCase() !== formattedUpdated.name.toLowerCase()
      );
      localStorage.setItem('bs_homez_custom_projects', JSON.stringify([formattedUpdated, ...filteredLocal]));
    } catch {}

    // Update optimistic state immediately
    setProjects(prev => {
      const exists = prev.some(item => (item.id && item.id === formattedUpdated.id) || item.name.toLowerCase() === formattedUpdated.name.toLowerCase());
      if (exists) {
        return prev.map(item =>
          (item.id && item.id === formattedUpdated.id) || item.name.toLowerCase() === formattedUpdated.name.toLowerCase()
            ? { ...item, ...formattedUpdated }
            : item
        );
      }
      return [formattedUpdated, ...prev];
    });

    try {
      const payload: any = {
        ...formattedUpdated,
        lastPrice: formattedUpdated.lastPrice || formattedUpdated.price,
        handoverDate: formattedUpdated.handoverDate || 'December 2027',
        updatedAt: serverTimestamp()
      };
      delete payload.id;

      if (formattedUpdated.id && !formattedUpdated.id.startsWith('curated_') && !formattedUpdated.id.startsWith('local_')) {
        await updateDoc(doc(db, 'projects', formattedUpdated.id), payload);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn('Saved project locally:', err);
    }
  };

  const handleTogglePauseProject = async (project: Project) => {
    const key = project.id || project.name;
    const nextPaused = !project.isPaused;

    setHiddenProjectIds(prev => {
      const next = nextPaused
        ? Array.from(new Set([...prev, key, project.name]))
        : prev.filter(item => item !== key && item !== project.name);
      try {
        localStorage.setItem('bs_homez_hidden_projects', JSON.stringify(next));
      } catch {}
      return next;
    });

    setProjects(prev =>
      prev.map(p =>
        (p.id && p.id === project.id) || p.name === project.name
          ? { ...p, isPaused: nextPaused }
          : p
      )
    );

    if (project.id && !project.id.startsWith('curated_') && !project.id.startsWith('local_')) {
      try {
        await updateDoc(doc(db, 'projects', project.id), {
          isPaused: nextPaused,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Updated project visibility in local state:', err);
      }
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const key = project.id || project.name;

    setDeletedProjectIds(prev => {
      const next = Array.from(new Set([...prev, key, project.name]));
      try {
        localStorage.setItem('bs_homez_deleted_projects', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      const existingLocal: Project[] = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
      const filteredLocal = existingLocal.filter(
        item => item.id !== project.id && item.name.toLowerCase() !== project.name.toLowerCase()
      );
      localStorage.setItem('bs_homez_custom_projects', JSON.stringify(filteredLocal));
    } catch {}

    setProjects(prev =>
      prev.filter(p => !((p.id && p.id === project.id) || p.name === project.name))
    );

    if (project.id && !project.id.startsWith('curated_') && !project.id.startsWith('local_')) {
      try {
        await deleteDoc(doc(db, 'projects', project.id));
      } catch (err) {
        console.warn('Deleted project from local view:', err);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setIsAdmin(true);
      else setIsAdmin(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const getMergedWithLocal = (dbDocs: Project[] = []) => {
      let localCustom: Project[] = [];
      try {
        localCustom = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
      } catch {}
      const combinedCustom = [...localCustom.map(autoEnrichProjectData)];
      for (const docItem of dbDocs) {
        if (!combinedCustom.some(c => c.name.toLowerCase() === docItem.name.toLowerCase())) {
          combinedCustom.push(autoEnrichProjectData(docItem));
        }
      }
      const existingNames = new Set(combinedCustom.map(d => d.name.toLowerCase()));
      return [
        ...combinedCustom,
        ...CURATED_ARTISANAL_PROJECTS.filter(c => !existingNames.has(c.name.toLowerCase())).map(autoEnrichProjectData)
      ];
    };

    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      const dbDocs = snapshot.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Project))
        .filter(p => !LEGACY_PROJECT_NAMES.includes(p.name));

      const merged = getMergedWithLocal(dbDocs);
      setProjects(merged);
      setIsLoading(false);
      try {
        localStorage.setItem('bs_homez_portfolio_offline_cache', JSON.stringify(merged));
      } catch {}
    }, (err) => {
      console.warn('Using curated & local projects fallback:', err);
      const fallback = getMergedWithLocal([]);
      setProjects(fallback);
      setIsLoading(false);
    });

    return () => unsubProjects();
  }, []);

  // Automatically purge legacy projects from Firestore when admin is signed in
  useEffect(() => {
    if (!user) return;
    const cleanupLegacyAndSeed = async () => {
      try {
        const snap = await getDocs(collection(db, 'projects'));
        for (const d of snap.docs) {
          const data = d.data();
          if (LEGACY_PROJECT_NAMES.includes(data.name)) {
            await deleteDoc(doc(db, 'projects', d.id));
          }
        }
      } catch (err) {
        console.warn('Legacy cleanup skipped:', err);
      }
    };
    cleanupLegacyAndSeed();
  }, [user]);

  useEffect(() => {
    let unsubEnquiries: () => void = () => {};
    
    if (user) {
      unsubEnquiries = onSnapshot(query(collection(db, 'enquiries'), orderBy('timestamp', 'desc')), (snapshot) => {
        setEnquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enquiry)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'enquiries'));
    } else {
      setEnquiries([]);
    }

    return () => unsubEnquiries();
  }, [user]);

  useEffect(() => {
    let unsubOpportunities: () => void = () => {};
    
    if (user) {
      unsubOpportunities = onSnapshot(query(collection(db, 'opportunities'), orderBy('timestamp', 'desc')), (snapshot) => {
        setOpportunities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'opportunities'));
    } else {
      setOpportunities([]);
    }

    return () => unsubOpportunities();
  }, [user]);

  useEffect(() => {
    let unsubReferrals: () => void = () => {};
    
    if (user) {
      unsubReferrals = onSnapshot(query(collection(db, 'referrals'), orderBy('createdAt', 'desc')), (snapshot) => {
        setReferrals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Referral)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'referrals'));
    } else {
      setReferrals([]);
    }

    return () => unsubReferrals();
  }, [user]);

  const handleEnquireProject = (project: Project) => {
    setEnquiryType('Acquire');
    setSelectedProject(project);
    setActivePropertyUrlId(project.id || project.name);
    try {
      window.history.replaceState({}, '', `/?project=${encodeURIComponent(project.id || project.name)}`);
    } catch {}
  };

  const handleDownloadBrochure = (project: Project) => {
    setDownloadProject(project);
    setActivePropertyUrlId(project.id || project.name);
    try {
      window.history.replaceState({}, '', `/?project=${encodeURIComponent(project.id || project.name)}`);
    } catch {}
  };

  const handleGeneralInquiry = () => {
    setEnquiryType('Inquire');
    setSelectedProject({
      id: 'general_inquiry',
      name: 'BS Homez General Portfolio',
      description: 'General inquiry regarding direct verification inventory and verification channels.',
      price: 'N/A',
      location: 'Whitefield & East Bangalore',
      locationTarget: '',
      zone: 'Whitefield',
      type: 'Primary',
      propertyType: 'Flat',
      configuration: [],
      segment: 'INVESTIGATION',
      imageUrls: [],
      createdAt: null
    });
  };

  const handlePrivateConsultation = () => {
    setEnquiryType('Consult');
    setSelectedProject({
      id: 'consultation',
      name: 'Private Investment Portfolio Consultation',
      description: 'Elite real estate consultation with principal advisors of BS Homez.',
      price: 'N/A',
      location: 'Whitefield, Hoskote, Varthur, Gunjur, Hosa Road & Kasavanahalli',
      locationTarget: '',
      zone: 'Whitefield',
      type: 'Primary',
      propertyType: 'Flat',
      configuration: [],
      segment: 'ADVISORY',
      imageUrls: [],
      createdAt: null
    });
  };

  const handleSelectTab = (tab: MainAppTab) => {
    setActiveMainTab(tab);
    if (tab !== 'projects') {
      setActivePropertyUrlId(null);
    }
    try {
      const url = tab === 'overview' ? '/' : `/?tab=${tab}`;
      window.history.replaceState({}, '', url);
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-art-dark">
      <Navbar
        activeMainTab={activeMainTab}
        onSelectTab={handleSelectTab}
        isAdminUser={Boolean(user)}
        onInquire={handleGeneralInquiry}
      />
      
      <main className="flex-grow pt-28 sm:pt-32">
        {activeMainTab === 'overview' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-12">
            {/* Framed Home Window */}
            <div className="border border-white/10 bg-white/[0.01] rounded-sm overflow-hidden shadow-2xl">
              <Hero
                onConsult={handlePrivateConsultation}
                onExplorePortfolios={() => setActiveMainTab('projects')}
              />
              {/* Quick Tab Directory Cards inside the Home Window */}
              <section className="py-10 sm:py-12 px-4 sm:px-8 md:px-12 bg-art-dark/90 border-t border-white/10">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-art-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-2">
                      Dedicated Workspace Tabs
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif text-white italic">
                      Explore by <span className="not-italic text-art-gold">Dedicated Tab.</span>
                    </h2>
                  </div>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest">
                    Select any tab below to open its dedicated view.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {[
                    { id: 'projects' as MainAppTab, title: 'Artisanal Portraits', sub: 'Primary, Resale & Rental Portfolios' },
                    { id: 'services' as MainAppTab, title: 'Property Intelligence', sub: '0% Primary, Resale & Rental Services' },
                    { id: 'why-choose' as MainAppTab, title: 'Philosophy', sub: 'Sales, Resale & Rental Pillars of Trust' },
                    { id: 'insights' as MainAppTab, title: 'Market Vault & Metrics', sub: 'East Corridor Capital Velocity' },
                    { id: 'opportunity' as MainAppTab, title: 'Offer Your Asset', sub: 'List Property for Sale or Rent' },
                    { id: 'referral' as MainAppTab, title: 'Referral Program', sub: 'Introduce Friends & Family' },
                    { id: 'loans' as MainAppTab, title: 'Home Loan Hub', sub: 'EMI & Tier-1 Banking Concierge' },
                    { id: 'testimonials' as MainAppTab, title: 'Client Voices', sub: 'Verified Homebuyer & Tenant Stories' },
                    { id: 'faq' as MainAppTab, title: 'Advisory FAQ', sub: 'RERA, Khata, Resale & Rental Answers' },
                    { id: 'about' as MainAppTab, title: 'Guided Excellence', sub: '100+ Tied Builders Across Bangalore' }
                  ].map(card => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setActiveMainTab(card.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-5 bg-white/[0.02] hover:bg-art-gold/10 border border-white/10 hover:border-art-gold rounded-sm text-left transition-all group cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[8px] uppercase tracking-[0.25em] text-art-gold font-black block mb-1.5">
                          Open Tab
                        </span>
                        <h3 className="text-lg font-serif italic text-white group-hover:text-art-gold transition-colors leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{card.sub}</p>
                      </div>
                      <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[8px] uppercase tracking-widest text-white/60 group-hover:text-art-gold font-bold">
                        <span>Switch Tab</span>
                        <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeMainTab === 'projects' && (
          <ProjectGrid 
            projects={filteredProjects} 
            isAdmin={Boolean(user)}
            hiddenCount={hiddenProjectsCount}
            showHidden={showHiddenProjects}
            onToggleShowHidden={() => setShowHiddenProjects(prev => !prev)}
            comparedProjectIds={comparedProjectIds}
            onToggleCompare={handleToggleCompare}
            onOpenCompareModal={() => setIsCompareModalOpen(true)}
            onEnquire={handleEnquireProject} 
            onDownload={handleDownloadBrochure}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onTogglePause={handleTogglePauseProject}
            onOpenNewProjectModal={() => {
              setEditingProject(null);
              setShowProjectModal(true);
            }}
            isLoading={isLoading} 
          />
        )}

        {activeMainTab === 'services' && <Services />}

        {activeMainTab === 'why-choose' && <WhyChoose onConsult={handlePrivateConsultation} />}

        {activeMainTab === 'insights' && <MarketInsights />}

        {activeMainTab === 'opportunity' && <OpportunitySection />}

        {activeMainTab === 'referral' && <ReferralSection />}

        {activeMainTab === 'testimonials' && <Testimonials />}

        {activeMainTab === 'loans' && <HomeLoanHub />}

        {activeMainTab === 'faq' && <FAQSection />}

        {activeMainTab === 'about' && (
          <section id="about" className="py-24 md:py-32 px-6 md:px-8 bg-art-dark text-art-light">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-6xl font-serif mb-10 italic">Guided <span className="not-italic text-art-gold">Excellence</span></h2>
              <p className="text-lg font-light text-white/50 tracking-wide leading-relaxed mb-16 max-w-2xl mx-auto">
                BS Homez tied up with all major builders. We are currently serving Whitefield, Hoskote, Varthur, Gunjur, Hosa Road, Kasavanahalli, and East & South East Bangalore corridors. 
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 border-y border-white/10 py-16">
                <div className="flex flex-col gap-3">
                  <span className="text-5xl font-serif text-art-gold">100+</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Tied Builders</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-5xl font-serif text-art-gold">0%</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Primary Fee</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-5xl font-serif text-art-gold">24hr</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Response</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeMainTab === 'admin' && user && (
          <AdminView
            enquiries={enquiries}
            projects={effectiveProjects}
            opportunities={opportunities}
            referrals={referrals}
            showProjectModal={showProjectModal}
            setShowProjectModal={setShowProjectModal}
            editingProject={editingProject}
            setEditingProject={setEditingProject}
            onOpenSeoPreview={() => setIsSeoModalOpen(true)}
          />
        )}

        {/* Admin Login / Vault Switcher Bar */}
        <div className="flex justify-center py-10 opacity-60 hover:opacity-100 transition-opacity flex-col items-center gap-4 border-t border-white/5">
           {!user ? (
             <button 
               onClick={handleLogin}
               className="text-[10px] bg-white/10 px-6 py-2.5 rounded-sm uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-all cursor-pointer"
             >
               <ShieldCheck size={14} /> Admin Relationship Login
             </button>
           ) : (
             <div className="flex flex-col items-center gap-2">
               <span className="text-[10px] uppercase tracking-widest text-white/50">Logged in as {user.email}</span>
               <div className="flex gap-4">
                 <button 
                   onClick={() => {
                     setActiveMainTab(activeMainTab === 'admin' ? 'projects' : 'admin');
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }}
                   className="text-[10px] bg-art-gold/20 text-art-gold px-6 py-2 rounded-sm uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer"
                 >
                   {activeMainTab === 'admin' ? 'Return to Portfolios Tab' : 'Open Admin Vault Tab'}
                 </button>
                 <button 
                   onClick={handleLogout}
                   className="text-[10px] bg-red-500/10 text-red-500 px-6 py-2 rounded-sm uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer"
                 >
                   Logout
                 </button>
               </div>
             </div>
           )}
        </div>
      </main>

      <footer className="bg-art-dark text-art-light py-16 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <Logo className="scale-110 origin-left" />
          <div className="flex flex-col md:flex-row gap-12 text-[10px] uppercase tracking-[0.2em] font-bold">
            <div className="flex flex-col gap-3 text-white/40">
              <span className="text-white mb-1 underline decoration-art-gold/50 underline-offset-8">Portfolio Tabs</span>
              <button type="button" onClick={() => { setActiveMainTab('projects'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Artisanal Portraits</button>
              <button type="button" onClick={() => { setActiveMainTab('opportunity'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Offer Your Asset</button>
              <button type="button" onClick={() => { setActiveMainTab('referral'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Referral Program</button>
            </div>
            <div className="flex flex-col gap-3 text-white/40">
              <span className="text-white mb-1 underline decoration-art-gold/50 underline-offset-8">Advisory Tabs</span>
              <button type="button" onClick={() => { setActiveMainTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Expertise & Services</button>
              <button type="button" onClick={() => { setActiveMainTab('insights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Market Analysis</button>
              <button type="button" onClick={() => { setActiveMainTab('loans'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Home Loan Hub</button>
            </div>
            <div className="flex flex-col gap-3 text-white/40">
              <span className="text-white mb-1 underline decoration-art-gold/50 underline-offset-8">Digital Presence</span>
              <span className="text-art-gold font-black">www.bshomez.co.in</span>
              <a href="mailto:contact@bshomez.co.in" className="hover:text-art-gold transition-colors">contact@bshomez.co.in</a>
              <button 
                type="button" 
                onClick={() => setIsSeoModalOpen(true)}
                className="flex items-center gap-1.5 text-art-gold hover:text-white transition-colors cursor-pointer text-left font-bold"
              >
                <Globe size={11} className="text-art-gold shrink-0 animate-pulse" />
                <span>Google · Meta · X SEO Visualizer</span>
              </button>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
            © 2026 BS Homez. Architectural Integrity Guaranteed.
          </div>
        </div>

        {/* Official Disclaimers in small font */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 space-y-1.5 text-left">
          <p className="text-[9px] text-white/40 font-mono tracking-wide leading-relaxed">
            *For the official project completion date as per RERA, please contact us. We’ll be happy to provide the correct information.
          </p>
          <p className="text-[9px] text-white/40 font-mono tracking-wide leading-relaxed">
            *For accurate project information, please feel free to contact us. We’ll be happy to assist you!
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showProjectModal && (
          <ProjectForm 
            project={editingProject} 
            onClose={() => {
              setShowProjectModal(false);
              setEditingProject(null);
            }}
            onProjectSaved={(savedProject) => {
              setProjects(prev => {
                const exists = prev.some(p => (p.id && p.id === savedProject.id) || p.name.toLowerCase() === savedProject.name.toLowerCase());
                if (exists) {
                  return prev.map(p =>
                    (p.id && p.id === savedProject.id) || p.name.toLowerCase() === savedProject.name.toLowerCase()
                      ? { ...p, ...savedProject }
                      : p
                  );
                }
                return [savedProject, ...prev];
              });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <EnquiryModal 
            project={selectedProject} 
            enquiryType={enquiryType}
            onClose={() => {
              setSelectedProject(null);
              try {
                window.history.replaceState({}, '', '/?tab=projects');
                setActivePropertyUrlId(null);
              } catch {}
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {downloadProject && (
          <DownloadBrochureModal
            project={downloadProject}
            allProjects={effectiveProjects}
            onClose={() => {
              setDownloadProject(null);
              try {
                window.history.replaceState({}, '', '/?tab=projects');
                setActivePropertyUrlId(null);
              } catch {}
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Project Comparison Dock */}
      <AnimatePresence>
        {comparedProjectIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/95 backdrop-blur-xl border border-art-gold/50 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.85)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4 max-w-[95vw]"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-art-gold text-black rounded-full flex items-center justify-center font-black text-xs">
                {comparedProjectIds.length}
              </div>
              <span className="text-[10px] sm:text-xs text-white font-serif italic hidden md:inline">
                {comparedProjectIds.length} of 3 Properties Selected
              </span>
            </div>

            <div className="flex items-center gap-1.5 max-w-[160px] sm:max-w-xs overflow-x-auto py-1">
              {comparedProjects.map(cp => (
                <div key={cp.id || cp.name} className="flex items-center gap-1 px-2.5 py-0.5 sm:py-1 bg-white/10 border border-white/15 rounded-full text-[9px] text-white shrink-0 font-mono">
                  <span className="truncate max-w-[70px] sm:max-w-[100px]">{cp.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompare(cp.id || cp.name)}
                    className="text-white/40 hover:text-red-400 cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-art-gold hover:bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
              >
                <ArrowLeftRight size={11} />
                <span>Compare Side-by-Side</span>
              </button>
              <button
                type="button"
                onClick={handleClearCompare}
                className="p-1.5 text-white/40 hover:text-white rounded-full transition-colors cursor-pointer"
                title="Clear all compared properties"
              >
                <Trash size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Toast Notification */}
      <AnimatePresence>
        {compareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-black px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 font-mono"
          >
            <Info size={15} />
            <span>{compareToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Comparison Modal */}
      <ProjectComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedProjects={comparedProjects}
        allProjects={effectiveProjects}
        onRemoveProject={handleRemoveCompare}
        onAddProject={handleAddProjectToCompare}
        onClearAll={handleClearCompare}
        onEnquire={(p) => {
          setIsCompareModalOpen(false);
          handleEnquireProject(p);
        }}
        onDownload={(p) => {
          setIsCompareModalOpen(false);
          handleDownloadBrochure(p);
        }}
      />

      {/* Real-Time Google SERP, Meta & Twitter Card Visualizer */}
      <SEOPreviewModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        currentTitle={currentSeoSnapshot.title}
        currentDescription={currentSeoSnapshot.description}
        currentCanonicalUrl={currentSeoSnapshot.canonicalUrl}
        currentImageUrl={currentSeoSnapshot.imageUrl}
        activeTab={activeMainTab}
        selectedProject={selectedProject}
      />

      <AIChatAssistant />
    </div>
  );
}

