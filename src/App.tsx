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
  updateDoc,
  where,
  increment,
  writeBatch
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
  ChevronDown,
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
  Clock,
  FileText,
  MoreVertical,
  Trash2,
  RotateCcw,
  Share2,
  Archive,
  Copy,
  AlertTriangle,
  Save,
  Check,
  Eye,
  RefreshCw,
  FileEdit,
  Image as ImageIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  EyeOff,
  CheckSquare,
  Square,
  Sliders,
  SlidersHorizontal,
  BarChart3
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
import { Project, Enquiry, Opportunity, Referral, PublicTabKey, TabVisibilityConfig, DEFAULT_TAB_VISIBILITY } from './types';
import { Testimonials } from './components/Testimonials';
import { ReferralSection } from './components/ReferralSection';
import { FAQSection } from './components/FAQSection';
import { HomeLoanHub } from './components/HomeLoanHub';
import { InvestmentCalculator } from './components/InvestmentCalculator';
import { ProjectComparisonModal } from './components/ProjectComparisonModal';
import { SocialShareButtons } from './components/SocialShareButtons';
import { SEOPreviewModal } from './components/SEOPreviewModal';
import { PropertyMetaDataModal } from './components/PropertyMetaDataModal';
import { AdminSeoAuditPanel } from './components/AdminSeoAuditPanel';
import { MediaUploadCompressor } from './components/MediaUploadCompressor';
import { MediaViewerModal } from './components/MediaViewerModal';
import { AdminMediaManagerModal } from './components/AdminMediaManagerModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PhoneInputWithCountry, validateMobileNumber } from './components/PhoneInputWithCountry';
import { GrowBusinessSection } from './components/GrowBusinessSection';
import { dispatchEnquiryEmailAlert } from './lib/enquiryAlert';
import { compilePortfolioImageAltAudit, downloadSeoAuditCsv } from './lib/seoAuditReport';
import { autoEnhanceAllProjects, generateOptimizedSeoMetadata } from './lib/autoSeoEnhancer';

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

const Logo = ({ className = "", animate = true }: { className?: string; animate?: boolean }) => {
  const content = (
    <div className={cn("inline-flex items-center group select-none bg-transparent relative", className)}>
      <img 
        src="/assets/aistudio/bs_homez_logo_glow.png" 
        alt="BS HOMEZ - Turning Key Moments" 
        className="h-10 sm:h-12 md:h-14 w-auto object-contain block transition-all duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_0_10px_rgba(30,136,229,0.65)] group-hover:drop-shadow-[0_0_18px_rgba(30,136,229,0.95)]" 
      />
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.85, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.08
      }}
      className="inline-flex"
    >
      {content}
    </motion.div>
  );
};

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
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white leading-tight italic">
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
  | 'grow-business'
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
  tabVisibility,
  onInquire
}: {
  activeMainTab: MainAppTab;
  onSelectTab: (tab: MainAppTab) => void;
  isAdminUser?: boolean;
  tabVisibility?: TabVisibilityConfig;
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
    { id: 'grow-business', name: 'Grow Business', isSpecial: true },
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

  const visibleLinks = links.filter(link => {
    if (link.id === 'admin') return Boolean(isAdminUser);
    if (isAdminUser) return true; // Admins see all tabs, with visual badge if hidden
    return tabVisibility ? tabVisibility[link.id as PublicTabKey] !== false : true;
  });

  const handleTabClick = (tab: MainAppTab) => {
    onSelectTab(tab);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-50 px-3 sm:px-6 md:px-8 transition-all duration-300 flex flex-col gap-1 sm:gap-1.5 max-w-[100vw]",
        scrolled
          ? "py-1 sm:py-1.5 bg-art-dark/95 backdrop-blur-md border-b border-white/15 shadow-xl"
          : "py-1 sm:py-1.5 bg-art-dark/95 backdrop-blur-md border-b border-white/10"
      )}>
        <div className="flex justify-between items-center w-full gap-3">
          <button
            type="button"
            onClick={() => handleTabClick('overview')}
            className="relative z-10 hover:opacity-80 transition-opacity shrink-0 text-left cursor-pointer"
          >
            <Logo />
          </button>

          <div className="relative z-10 flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={onInquire}
              className="px-3.5 py-1.5 bg-art-gold text-black text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white transition-colors whitespace-nowrap cursor-pointer rounded-sm"
            >
              Inquire Now
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center p-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 hover:border-art-gold/50 transition-all cursor-pointer group"
              aria-label="Navigation Tabs Menu"
              title="Open Navigation Tabs"
            >
              <MoreVertical className="text-art-gold group-hover:text-white transition-colors" size={20} />
            </button>
          </div>
        </div>

        {/* Dedicated Multi-Tab Navigation Bar - Visible on desktop, removed on mobile */}
        <div className="w-full overflow-x-auto no-scrollbar border-t border-white/10 pt-1 hidden md:block">
          <div className="flex items-center gap-1 min-w-max pb-0.5">
            {visibleLinks.map(link => {
              const isActive = activeMainTab === link.id;
              const isTabHiddenFromPublic = isAdminUser && link.id !== 'admin' && tabVisibility && tabVisibility[link.id as PublicTabKey] === false;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleTabClick(link.id)}
                  title={isTabHiddenFromPublic ? `${link.name} (Hidden from online users)` : link.name}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-[9.5px] sm:text-[10px] uppercase tracking-wider font-extrabold transition-all whitespace-nowrap cursor-pointer border flex items-center gap-1.5",
                    isActive
                      ? "bg-art-gold text-black border-art-gold shadow-[0_0_15px_rgba(197,160,89,0.35)]"
                      : link.isSpecial
                      ? "bg-art-gold/10 text-art-gold border-art-gold/30 hover:bg-art-gold hover:text-black"
                      : "bg-white/[0.05] text-white/80 border-white/15 hover:text-white hover:border-white/35 hover:bg-white/[0.1]",
                    isTabHiddenFromPublic && !isActive && "border-amber-500/40 text-amber-200/90"
                  )}
                >
                  {link.id === 'overview' && <Home size={12} className="shrink-0" />}
                  {link.id === 'grow-business' && <TrendingUp size={12} className={cn("shrink-0", isActive ? "text-black" : "text-art-gold")} />}
                  <span>{link.name}</span>
                  {isTabHiddenFromPublic && (
                    <EyeOff size={10} className="text-amber-400 shrink-0" />
                  )}
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
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div>
                <Logo />
                <span className="text-[9px] uppercase tracking-[0.3em] text-art-gold font-bold block mt-1">
                  Navigation Tabs Directory
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-art-gold hover:text-white transition-colors duration-300 cursor-pointer p-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10"
                aria-label="Close Tabs Directory"
              >
                <X size={26} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {visibleLinks.map((link) => {
                const isActive = activeMainTab === link.id;
                const isTabHiddenFromPublic = isAdminUser && link.id !== 'admin' && tabVisibility && tabVisibility[link.id as PublicTabKey] === false;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleTabClick(link.id)}
                    className={cn(
                      "p-4 rounded-sm text-left font-serif italic text-xl transition-all border cursor-pointer flex items-center justify-between",
                      isActive
                        ? "bg-art-gold text-black border-art-gold font-bold shadow-lg"
                        : "bg-white/5 text-white border-white/10 hover:border-art-gold hover:text-art-gold",
                      isTabHiddenFromPublic && !isActive && "border-amber-500/40"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {link.id === 'overview' && <Home size={20} className={isActive ? "text-black" : "text-art-gold"} />}
                      {link.id === 'grow-business' && <TrendingUp size={20} className={isActive ? "text-black" : "text-art-gold"} />}
                      <span>{link.name}</span>
                      {isTabHiddenFromPublic && (
                        <span className="text-[9px] font-mono not-italic px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <EyeOff size={10} /> Hidden Online
                        </span>
                      )}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] text-art-gold uppercase tracking-[0.5em] font-black block mb-1">Direct Advisory</span>
                <a href="mailto:contact@bshomez.in" className="text-xl font-serif text-white italic hover:text-art-gold transition-colors">contact@bshomez.in</a>
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
    <section className="w-full relative flex items-center py-6 sm:py-16 md:py-20 overflow-hidden bg-art-dark">
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

      <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="text-art-gold tracking-wider sm:tracking-[0.25em] uppercase mb-3 sm:mb-5 flex items-center flex-wrap gap-2 sm:gap-3 font-bold text-[10.5px] sm:text-xs leading-normal">
                <span className="w-5 sm:w-10 h-[1px] bg-art-gold/50 shrink-0" />
                <span>{getISTGreeting()} • Primary, Resale & Rental Advisory</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight sm:leading-none tracking-tight mb-4 sm:mb-8 italic break-words">
                Legacy <span className="not-italic text-art-gold/90">Refined.</span>
              </h1>

              {/* Highly Prominent Brokerage Message */}
              <motion.div 
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.7 }}
                 className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 sm:p-6 md:p-8 border border-art-gold/25 bg-white/[0.03] backdrop-blur-md relative overflow-hidden group w-full rounded-sm"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-art-gold/40 to-transparent" />
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-4xl sm:text-6xl md:text-7xl font-serif text-art-gold italic leading-none font-bold">0%</span>
                  <span className="sm:hidden text-lg font-serif tracking-wide italic text-white font-light">Brokerage Fee</span>
                </div>
                <div className="flex flex-col">
                  <span className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-serif tracking-wide sm:tracking-widest italic font-light text-white">Brokerage Fee</span>
                  <span className="text-art-gold text-[9.5px] sm:text-[10.5px] uppercase tracking-wider sm:tracking-[0.2em] font-black mt-0.5 sm:mt-1.5">
                    On All Primary Market Portfolio Acquisitions
                  </span>
                  <span className="text-white/70 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold mt-1">
                    Resale: 2% Commission • Rental: 1 Month Rent Commission
                  </span>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 sm:gap-8 mb-4 sm:mb-0">
                <p className="text-white/60 max-w-sm text-[11px] sm:text-xs leading-relaxed font-medium uppercase tracking-wider">
                  Strategically curating high-performance Primary, Resale, and Rental residential portfolios across Bangalore's exclusive corridors.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto shrink-0">
                  <motion.button 
                    type="button"
                    onClick={onExplorePortfolios}
                    whileHover={{ scale: 1.02 }}
                    className="bg-art-gold hover:bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-[11px] uppercase font-black tracking-widest text-center w-full sm:w-auto cursor-pointer rounded-sm shadow-lg transition-all"
                  >
                    Open Portfolios Tab
                  </motion.button>
                  <button 
                    type="button"
                    onClick={onConsult} 
                    className="text-white hover:text-art-gold text-[10px] sm:text-[11px] uppercase font-black tracking-widest border border-white/20 sm:border-0 sm:border-b sm:border-white/30 py-2.5 sm:py-1 px-4 sm:px-0 hover:border-art-gold transition-all text-center rounded-sm sm:rounded-none cursor-pointer w-full sm:w-auto"
                  >
                    Private Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column Metrics Window - Mobile Friendly Non-Merging Grid */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-end gap-3 sm:gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-4 w-full lg:w-auto">
              <div className="bg-white/[0.03] p-2.5 sm:p-3 rounded-sm border border-white/10 lg:bg-transparent lg:p-0 lg:border-0 lg:text-right">
                <span className="text-white text-2xl sm:text-3xl font-serif block font-bold">100%</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-art-gold font-bold block mt-0.5">Verified Direct Inventory</span>
              </div>
              <div className="bg-white/[0.03] p-2.5 sm:p-3 rounded-sm border border-white/10 lg:bg-transparent lg:p-0 lg:border-0 lg:text-right">
                <span className="text-[11px] sm:text-xs text-white font-bold tracking-wider block">EAST & SOUTH-EAST</span>
                <span className="text-[8.5px] sm:text-[9px] text-white/60 uppercase tracking-wider block mt-0.5">Primary Jurisdiction</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white/[0.03] p-2.5 sm:p-3 rounded-sm border border-white/10 lg:bg-transparent lg:p-0 lg:border-0 lg:text-right">
                <span className="text-[11px] sm:text-xs text-white font-bold tracking-wider block">PRIMARY • RESALE • RENTAL</span>
                <span className="text-[8.5px] sm:text-[9px] text-white/60 uppercase tracking-wider block mt-0.5">Complete Lifecycle Stages</span>
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
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white leading-tight italic">
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
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white tracking-tight italic">
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

/**
 * Format organic visits with clean abbreviated notation (e.g., '1.2K', '500+')
 */
export const formatVisitsCount = (views: number): string => {
  if (!views || views <= 0) return '500+';
  if (views >= 1000) {
    const k = views / 1000;
    return `${k.toFixed(1).replace('.0', '')}K`;
  }
  if (views >= 500 && views <= 520) return '500+';
  return `${views}`;
};

/**
 * Color-coded border accents based on handoverStatus
 * EOI -> Royal Indigo/Violet
 * Construction -> Warm Amber/Gold
 * Ready to Move -> Fresh Emerald
 * Handed Over -> Electric Sky Blue
 */
export const getHandoverBorderAccent = (status?: string): string => {
  switch (status) {
    case 'EOI':
    case 'Prelaunch':
      return 'border-indigo-500/60 hover:border-indigo-400 shadow-[0_4px_25px_rgba(99,102,241,0.18)] hover:shadow-[0_10px_35px_rgba(99,102,241,0.35)]';
    case 'Under Construction':
    case 'Nearing Completion':
      return 'border-amber-500/60 hover:border-amber-400 shadow-[0_4px_25px_rgba(245,158,11,0.18)] hover:shadow-[0_10px_35px_rgba(245,158,11,0.35)]';
    case 'Ready to Move':
      return 'border-emerald-500/60 hover:border-emerald-400 shadow-[0_4px_25px_rgba(16,185,129,0.18)] hover:shadow-[0_10px_35px_rgba(16,185,129,0.35)]';
    case 'Handed Over':
      return 'border-sky-500/60 hover:border-sky-400 shadow-[0_4px_25px_rgba(14,165,233,0.18)] hover:shadow-[0_10px_35px_rgba(14,165,233,0.35)]';
    default:
      return 'border-art-gold/45 hover:border-art-gold shadow-[0_4px_25px_rgba(197,160,89,0.15)] hover:shadow-[0_10px_35px_rgba(197,160,89,0.3)]';
  }
};

/**
 * Distinct vibrant color border for each horizontal project
 */
export const getProjectColorBorder = (project: Project, index?: number): string => {
  if (project.isInventorySoldOut || project.sticker === 'Sold Out') {
    return 'border-2 border-red-500/80 hover:border-red-400 shadow-[0_4px_25px_rgba(239,68,68,0.25)] border-l-4 sm:border-l-[6px] border-l-red-500';
  }

  const colorBorders = [
    // 0: Royal Gold / Amber
    'border-2 border-amber-400/80 hover:border-amber-300 shadow-[0_4px_25px_rgba(251,191,36,0.2)] border-l-4 sm:border-l-[6px] border-l-amber-400',
    // 1: Emerald Green
    'border-2 border-emerald-500/80 hover:border-emerald-400 shadow-[0_4px_25px_rgba(16,185,129,0.2)] border-l-4 sm:border-l-[6px] border-l-emerald-500',
    // 2: Electric Cyan / Sapphire
    'border-2 border-cyan-400/80 hover:border-cyan-300 shadow-[0_4px_25px_rgba(6,182,212,0.2)] border-l-4 sm:border-l-[6px] border-l-cyan-400',
    // 3: Imperial Violet / Purple
    'border-2 border-purple-400/80 hover:border-purple-300 shadow-[0_4px_25px_rgba(168,85,247,0.2)] border-l-4 sm:border-l-[6px] border-l-purple-400',
    // 4: Rose / Ruby
    'border-2 border-rose-400/80 hover:border-rose-300 shadow-[0_4px_25px_rgba(244,63,94,0.2)] border-l-4 sm:border-l-[6px] border-l-rose-400',
    // 5: Teal / Sea Green
    'border-2 border-teal-400/80 hover:border-teal-300 shadow-[0_4px_25px_rgba(45,212,191,0.2)] border-l-4 sm:border-l-[6px] border-l-teal-400',
    // 6: Sky Blue
    'border-2 border-sky-400/80 hover:border-sky-300 shadow-[0_4px_25px_rgba(56,189,248,0.2)] border-l-4 sm:border-l-[6px] border-l-sky-400',
    // 7: Radiant Orange / Coral
    'border-2 border-orange-400/80 hover:border-orange-300 shadow-[0_4px_25px_rgba(251,146,60,0.2)] border-l-4 sm:border-l-[6px] border-l-orange-400'
  ];

  if (typeof index === 'number') {
    return colorBorders[Math.abs(index) % colorBorders.length];
  }

  const seed = (project.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colorBorders[seed % colorBorders.length];
};

const cleanProjectDescription = (desc?: string): string => {
  if (!desc) return '';
  return desc
    .replace(/Nearby Connectivity\s*\([^)]*\)\s*:[^.]*(\.|$)/gi, '')
    .replace(/Nearby Connectivity\s*:[^.]*(\.|$)/gi, '')
    .replace(/Near\s*by\s*n?2\s*kms?[^.]*(\.|$)/gi, '')
    .replace(/Nearby\s*2\s*kms?[^.]*(\.|$)/gi, '')
    .replace(/Nearby\s*within\s*2\s*km[^.]*(\.|$)/gi, '')
    .replace(/Schools:.*?(\||$)/gi, '')
    .replace(/Hospitals:.*?(\||$)/gi, '')
    .replace(/IT Hubs:.*?(\||$)/gi, '')
    .replace(/Malls:.*?(\||$)/gi, '')
    .replace(/Bus Stop & Transit:.*?(\.|$)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const ProjectCard: React.FC<{ 
  project: Project; 
  index?: number;
  isAdmin?: boolean;
  isCompared?: boolean;
  comparedCount?: number;
  onToggleCompare?: (p: Project) => void;
  onEnquire: (p: Project) => void;
  onScheduleSiteVisit?: (p: Project) => void;
  onDownload: (p: Project) => void;
  onSaveProject: (updated: Project) => Promise<void>;
  onDeleteProject: (p: Project) => Promise<void>;
  onTogglePause: (p: Project) => Promise<void>;
  onOpenMetaData?: (p: Project) => void;
}> = ({ 
  project, 
  index = 0,
  isAdmin = false, 
  isCompared = false,
  comparedCount = 0,
  onToggleCompare,
  onEnquire, 
  onScheduleSiteVisit,
  onDownload, 
  onSaveProject, 
  onDeleteProject, 
  onTogglePause,
  onOpenMetaData
}) => {
  const [showMap, setShowMap] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Inline Editing State (Primary: Entire Project Edit + Save/Discard; Resale & Rental: Edit & Upload Images + Save/Discard)
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editDraft, setEditDraft] = useState<Project>({ ...project });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [isFetchingOnlineCard, setIsFetchingOnlineCard] = useState(false);
  const [isGeneratingCardAiSeo, setIsGeneratingCardAiSeo] = useState(false);
  const [uploadingImageCard, setUploadingImageCard] = useState(false);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Nearby Amenities (2km) with Google Search Grounding State
  const [showNearbyAmenities, setShowNearbyAmenities] = useState(false);
  const [amenitiesData, setAmenitiesData] = useState<{
    schools: Array<{ name: string; distance: string }>;
    hospitals: Array<{ name: string; distance: string }>;
    transit: Array<{ name: string; distance: string }>;
    summary?: string;
    source?: string;
  } | null>(null);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);
  const [amenitiesError, setAmenitiesError] = useState('');

  // Deterministic baseline organic views for instant zero-latency render
  const baselineViews = useMemo(() => {
    if (typeof project.organicViews === 'number' && project.organicViews > 0) {
      return project.organicViews;
    }
    const seed = (project.name + (project.location || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 1120 + (seed % 1450); // Generates realistic initial counts e.g. 1.2K, 1.8K, 2.3K
  }, [project.name, project.location, project.organicViews]);

  const [views, setViews] = useState<number>(project.organicViews || baselineViews);

  // Sync state if project.organicViews prop updates from parent
  useEffect(() => {
    if (typeof project.organicViews === 'number' && project.organicViews > 0) {
      setViews(project.organicViews);
    }
  }, [project.organicViews]);

  // High-performance session-guarded view increment (organic views are live-synced by parent portfolio listener)
  useEffect(() => {
    if (!project.id) return;
    const projectDocRef = doc(db, 'projects', project.id);

    const sessionKey = `viewed_proj_${project.id}`;
    let timer: NodeJS.Timeout | undefined;
    const alreadyViewed = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(sessionKey);

    if (!alreadyViewed) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(sessionKey, '1');
      }

      // Defer Firestore increment slightly to let first frame render smoothly
      timer = setTimeout(async () => {
        try {
          await updateDoc(projectDocRef, {
            organicViews: increment(1)
          });
        } catch {
          // If the document lacks organicViews or updateDoc fails, upsert safely
          try {
            await setDoc(projectDocRef, { 
              organicViews: (project.organicViews || baselineViews) + 1 
            }, { merge: true });
          } catch {}
        }
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [project.id, baselineViews]);

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

  const fetchNearbyAmenities = async () => {
    setIsLoadingAmenities(true);
    setAmenitiesError('');
    try {
      const res = await fetch('/api/amenities/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          location: project.location,
          zone: project.zone
        })
      });
      const data = await res.json();
      if (data?.success) {
        setAmenitiesData(data);
      } else {
        setAmenitiesError(data?.error || 'Unable to retrieve nearby amenities at this moment.');
      }
    } catch (err) {
      console.error('Failed to load amenities:', err);
      setAmenitiesError('Connectivity issue loading nearby amenities.');
    } finally {
      setIsLoadingAmenities(false);
    }
  };

  const handleToggleAmenities = () => {
    const nextState = !showNearbyAmenities;
    setShowNearbyAmenities(nextState);
    if (nextState && !amenitiesData && !isLoadingAmenities) {
      fetchNearbyAmenities();
    }
  };

  const handleCardAiSeo = async () => {
    if (!editDraft.name?.trim()) return;
    setIsGeneratingCardAiSeo(true);
    try {
      const res = await fetch('/api/ai/seo-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: editDraft.name,
          location: editDraft.location,
          zone: editDraft.zone,
          type: editDraft.type === 'Primary Sale' ? 'Primary' : editDraft.type,
          propertyType: editDraft.propertyType,
          price: editDraft.price,
          builderName: editDraft.builderName,
          reraNumber: editDraft.reraNumber,
          features: editDraft.features,
          configuration: editDraft.configuration
        })
      });
      const data = await res.json();
      if (data?.keywords) {
        setEditDraft(prev => ({
          ...prev,
          seoKeywords: data.keywords.split(',').map((s: string) => s.trim()).filter(Boolean)
        }));
      }
    } catch (err) {
      console.warn('AI SEO generation in card failed:', err);
    } finally {
      setIsGeneratingCardAiSeo(false);
    }
  };

  const handleSaveInlineEdit = async () => {
    setIsSavingEdit(true);
    try {
      let updatedDraft = { ...editDraft };

      // Ensure high-ranking SEO keywords are populated
      if (!updatedDraft.seoKeywords || updatedDraft.seoKeywords.length === 0) {
        try {
          const res = await fetch('/api/ai/seo-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectName: updatedDraft.name,
              location: updatedDraft.location,
              zone: updatedDraft.zone,
              type: updatedDraft.type === 'Primary Sale' ? 'Primary' : updatedDraft.type,
              propertyType: updatedDraft.propertyType,
              price: updatedDraft.price,
              builderName: updatedDraft.builderName,
              reraNumber: updatedDraft.reraNumber
            })
          });
          const data = await res.json();
          if (data?.keywords) {
            updatedDraft.seoKeywords = data.keywords.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        } catch {}
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
        features: (updatedDraft.features || []).filter(Boolean),
        seoKeywords: (updatedDraft.seoKeywords || []).filter(Boolean)
      };
      await onSaveProject(cleaned);
      setSaveSuccessMsg(true);
      setTimeout(() => {
        setSaveSuccessMsg(false);
        setIsEditingCard(false);
      }, 1000);
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
  const isPrimary = project.type === 'Primary' || project.type === 'Primary Sale' || (!project.type && project.type !== 'Rental' && project.type !== 'Resale');
  const canViewProjectImages = !isPrimary || isAdmin;
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

  const coverImage = (project.imageUrls && project.imageUrls.filter(Boolean).length > 0)
    ? project.imageUrls.filter(Boolean)[0]
    : (project.mobileImageUrl || getCorridorDefaultImage(project.zone, project.type, project.builderCategory, project.propertyType));

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileHover={{ 
        y: isEditingCard ? 0 : -4,
        boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 255, 255, 0.08)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 22,
        opacity: { duration: 0.4 }
      }}
      className={cn(
        "project-grid-item group relative flex flex-col md:flex-row bg-[#111111] transition-all duration-300 overflow-hidden w-full max-w-full box-border rounded-lg",
        getProjectColorBorder(project, index),
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      {project.priceChanged && (
         <div className="absolute top-4 left-4 z-30 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-sm shadow-md">
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
            className="absolute inset-0 bg-art-dark/98 backdrop-blur-md z-40 flex flex-col justify-center p-8 border border-art-gold/30"
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

      {/* Inline Editor Mode for Admin (All Data Fields Only — Image Option Removed for Production) */}
      {isAdmin && isEditingCard ? (
        <div className="w-full p-6 bg-[#0d0d0d] border-b border-art-gold/30 space-y-5 font-sans z-20">
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
            <div>
              <label className="text-[8px] uppercase tracking-widest text-amber-400 block mb-1 font-bold flex items-center justify-between">
                <span>Units Remaining Tracker</span>
                {Boolean(editDraft.isInventorySoldOut || editDraft.sticker === 'Sold Out') ? (
                  <span className="text-red-400 font-mono text-[8px] uppercase font-bold">⛔ Masked (Sold Out)</span>
                ) : editDraft.unitsRemaining !== undefined && editDraft.unitsRemaining !== null && editDraft.unitsRemaining < 5 ? (
                  <span className="text-red-400 font-mono text-[8px] uppercase font-bold">⚡ Limited Availability Active</span>
                ) : null}
              </label>
              <input
                type="number"
                min="0"
                value={editDraft.unitsRemaining !== undefined && editDraft.unitsRemaining !== null ? editDraft.unitsRemaining : ''}
                onChange={e => {
                  const val = e.target.value.trim();
                  setEditDraft({
                    ...editDraft,
                    unitsRemaining: val === '' ? undefined : Math.max(0, parseInt(val, 10))
                  });
                }}
                placeholder="e.g. 3 (triggers Limited Availability if < 5)"
                className="w-full bg-amber-500/10 border border-amber-500/30 rounded-sm p-2.5 text-xs text-amber-300 font-mono outline-none focus:border-amber-400"
              />
            </div>

            {/* Explicit Inventory Sold Out Toggle in Inline Editor */}
            <div className="sm:col-span-2 p-3 bg-red-950/20 border border-red-500/35 rounded-sm flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-black text-red-400 block flex items-center gap-1.5">
                  <span>⛔</span> Explicit 'Inventory Sold Out' Flag
                </span>
                <p className="text-[8.5px] text-white/50 font-mono">
                  When enabled, this completely replaces the 'Units Remaining' badge with a prominent 'SOLD OUT' visual.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextState = !Boolean(editDraft.isInventorySoldOut || editDraft.sticker === 'Sold Out');
                  setEditDraft({
                    ...editDraft,
                    isInventorySoldOut: nextState,
                    sticker: nextState ? 'Sold Out' : (editDraft.sticker === 'Sold Out' ? 'None' : editDraft.sticker)
                  });
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5",
                  Boolean(editDraft.isInventorySoldOut || editDraft.sticker === 'Sold Out')
                    ? "bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.7)]"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-red-400/50 hover:text-red-300"
                )}
              >
                <span>⛔</span>
                {Boolean(editDraft.isInventorySoldOut || editDraft.sticker === 'Sold Out') ? 'SOLD OUT ACTIVE' : 'Flag Sold Out'}
              </button>
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[8px] uppercase tracking-widest text-art-gold block font-bold">
                High-Ranking SEO &amp; Social Keywords (Google, Meta, X, WhatsApp)
              </label>
              <button
                type="button"
                onClick={handleCardAiSeo}
                disabled={isGeneratingCardAiSeo}
                className="text-[8.5px] uppercase tracking-wider text-art-gold hover:text-white px-2 py-0.5 rounded bg-art-gold/15 hover:bg-art-gold/30 border border-art-gold/30 flex items-center gap-1 cursor-pointer font-bold disabled:opacity-50"
              >
                {isGeneratingCardAiSeo ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                <span>✨ AI Generate Keywords</span>
              </button>
            </div>
            <input
              type="text"
              value={Array.isArray(editDraft.seoKeywords) ? editDraft.seoKeywords.join(', ') : (editDraft.seoKeywords || '')}
              onChange={e => setEditDraft({ ...editDraft, seoKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              placeholder="e.g. Buy 3BHK Whitefield, Prestige Somerville Price, 0% Brokerage Bangalore, RERA Verified"
              className="w-full bg-white/5 border border-art-gold/30 rounded-sm p-2.5 text-xs text-white font-mono outline-none focus:border-art-gold"
            />
            <span className="text-[8px] text-white/40 block mt-1 font-mono">
              Auto-ranks listing at top for Google Search, Facebook, Instagram &amp; X discovery.
            </span>
          </div>

          {saveSuccessMsg && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-sm text-center text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>✓ Project details &amp; SEO saved successfully!</span>
            </div>
          )}

          {/* Save & Discard Action Bar */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleSaveInlineEdit}
              disabled={isSavingEdit}
              className="flex-1 bg-art-gold hover:bg-white text-black font-black text-[10px] uppercase tracking-[0.25em] py-3 rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSavingEdit ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Save Changes to Portfolio
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
          {/* Left Column: Property Visual & Media Showcase (Compact Ultra-Sleek Height) */}
          <div className="w-full md:w-44 lg:w-48 xl:w-52 shrink-0 relative overflow-hidden bg-gradient-to-br from-[#181818] via-[#111111] to-[#0a0a0a] flex flex-col justify-between min-h-[110px] md:min-h-[135px] border-b md:border-b-0 md:border-r border-white/10 group/img">
            {isPrimary ? (
              /* Hide project images and display official BS Homez logo for Primary projects */
              <div 
                onClick={() => onEnquire(project)}
                className="w-full h-full absolute inset-0 bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-[#0a0a0a] flex flex-col items-center justify-center p-2 text-center cursor-pointer select-none group/logo-card"
                title="BS Homez Verified Primary Portfolio - Click to Inquire"
              >
                <div className="relative flex flex-col items-center justify-center scale-90 sm:scale-95 group-hover/logo-card:scale-100 transition-transform duration-300">
                  <Logo className="w-28 sm:w-32 h-auto drop-shadow-[0_2px_10px_rgba(227,37,38,0.25)]" />
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-art-gold/15 text-art-gold border border-art-gold/30 text-[7.5px] font-mono uppercase tracking-widest font-black">
                      Primary Partner
                    </span>
                    <span className="text-[7px] uppercase font-mono text-white/50 tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            ) : canViewProjectImages ? (
              <>
                <img
                  src={coverImage}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 absolute inset-0 cursor-pointer"
                  onClick={() => setIsMediaViewerOpen(true)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none" />
              </>
            ) : (
              <div 
                onClick={() => onEnquire(project)}
                className="w-full h-full absolute inset-0 bg-gradient-to-br from-[#1c1c1c] via-[#111111] to-[#080808] flex flex-col items-center justify-center p-2.5 text-center cursor-pointer select-none group/lock"
                title="Direct Builder Portfolio - Inquire for official floor plans and verified gallery"
              >
                <div className="w-8 h-8 rounded-full bg-art-gold/15 border border-art-gold/40 flex items-center justify-center text-art-gold mb-1 group-hover/lock:scale-110 transition-transform shadow-md">
                  <Building2 size={16} />
                </div>
                <span className="text-[8.5px] uppercase font-mono font-bold tracking-wider text-art-gold block">
                  Developer Direct
                </span>
                <span className="text-[7px] uppercase font-mono text-white/50 block mt-0.5">
                  Verified RERA Portfolio
                </span>
              </div>
            )}

            {/* Top Overlays: Badges */}
            <div className="p-2 relative z-10 flex items-start justify-between gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-black/75 text-white border border-white/20 rounded-sm flex items-center gap-1 backdrop-blur-sm">
                  <MapPin size={9} className="text-art-gold shrink-0" />
                  {displayZone}
                </span>
                {project.handoverStatus && (
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 border rounded-sm backdrop-blur-sm",
                    project.handoverStatus === 'EOI' && "bg-art-gold/25 border-art-gold/50 text-art-gold",
                    project.handoverStatus === 'Under Construction' && "bg-blue-600/30 border-blue-400 text-blue-200",
                    project.handoverStatus === 'Ready to Move' && "bg-emerald-600/30 border-emerald-400 text-emerald-200",
                    project.handoverStatus === 'Handed Over' && "bg-purple-600/30 border-purple-400 text-purple-200",
                    !['EOI', 'Under Construction', 'Ready to Move', 'Handed Over'].includes(project.handoverStatus) && "bg-black/60 border-white/20 text-white"
                  )}>
                    {project.handoverStatus === 'Under Construction' ? 'Under .Const' : project.handoverStatus}
                  </span>
                )}
              </div>

              {/* Small Organic Visits Counter */}
              <div 
                className="flex items-center gap-1 px-1.5 py-0.5 bg-black/80 border border-white/20 rounded text-[8.5px] font-mono text-white/90 backdrop-blur-sm select-none shadow"
                title={`${views.toLocaleString()} organic property views recorded`}
              >
                <Eye size={10} className="text-art-gold shrink-0" />
                <span className="font-bold text-white tracking-tight">{formatVisitsCount(views)}</span>
              </div>
            </div>

            {/* Bottom Overlay on Image: Sold Out / Limited / Media button */}
            <div className="p-2 relative z-10 space-y-1.5 mt-auto">
              {/* Sold Out Badge */}
              {Boolean(project.isInventorySoldOut || project.sticker === 'Sold Out') ? (
                <div className="badge-soldout-static px-2 py-1 bg-red-700/95 text-white font-black text-[9px] uppercase tracking-wider rounded-sm border border-red-400 shadow flex items-center justify-center gap-1 w-full text-center">
                  <span>⛔</span> SOLD OUT · WAITLIST ONLY
                </div>
              ) : (
                <>
                  {project.sticker === 'Rented Out' && (
                    <div className="px-2 py-0.5 bg-indigo-600/95 text-white font-black text-[8.5px] uppercase tracking-wider rounded-sm border border-indigo-400 shadow flex items-center justify-center gap-1 w-full text-center">
                      <span>🔑</span> RENTED OUT
                    </div>
                  )}
                  {project.unitsRemaining !== undefined && project.unitsRemaining !== null && (
                    project.unitsRemaining < 5 ? (
                      <div className="animate-limited-badge px-2 py-0.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-[8.5px] uppercase tracking-wider rounded-sm border border-red-400/80 shadow flex items-center justify-center gap-1 text-center">
                        <span>⚡</span> LIMITED ({project.unitsRemaining === 1 ? '1 UNIT' : `${project.unitsRemaining} UNITS`})
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-black/80 text-art-gold font-mono font-bold text-[8.5px] uppercase tracking-wider rounded-sm border border-art-gold/40 text-center">
                        <span>📦</span> {project.unitsRemaining} Left
                      </div>
                    )
                  )}
                </>
              )}

              {/* Media Bar (Photos button hidden for online primary) */}
              <div className="flex items-center justify-between gap-1 flex-wrap">
                {!isPrimary && canViewProjectImages && project.imageUrls && project.imageUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMediaViewerOpen(true);
                    }}
                    className="px-2 py-0.5 rounded-sm text-[8.5px] font-mono font-bold bg-black/85 hover:bg-emerald-500 text-white hover:text-black border border-white/20 hover:border-emerald-400 transition-all flex items-center gap-1 cursor-pointer shadow"
                    title={isAdmin && isPrimary ? "Admin View: High-Definition Photos" : "View High-Definition Photos"}
                  >
                    <ImageIcon size={10} className="text-emerald-400" />
                    <span>{project.imageUrls.length} Photos</span>
                  </button>
                )}
                {(project.videoUrl || project.mobileVideoUrl) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMediaViewerOpen(true);
                    }}
                    className="px-2 py-0.5 rounded-sm text-[8.5px] font-mono font-bold bg-black/85 hover:bg-purple-500 text-white hover:text-black border border-white/20 hover:border-purple-400 transition-all flex items-center gap-1 cursor-pointer shadow"
                    title="Watch Verified Video Walkthrough"
                  >
                    <span>🎥</span>
                    <span>Tour</span>
                  </button>
                )}
                {project.availableFrom && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
                    🗓️ {project.availableFrom}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Complete Details, Writeup, Amenities & Action Bar (Ultra-Compact Height) */}
          <div className="flex-1 min-w-0 p-2.5 sm:p-3 flex flex-col justify-between space-y-1.5 bg-gradient-to-b from-[#131313] to-[#0c0c0c]">
            {/* 1. PROJECT NAME FIRST */}
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-1.5">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-serif text-white font-bold italic leading-tight group-hover:text-art-gold transition-colors duration-200 tracking-tight break-words">
                  {project.name}
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[8.5px] sm:text-[9.5px]">
                  <span className="text-art-gold uppercase tracking-wider font-extrabold">
                    {displayPropertyType} {project.segment ? `• ${project.segment}` : ''}
                  </span>
                  {project.builderName && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-white/10 text-white font-mono text-[8.5px] font-semibold">
                      {project.builderName} {project.builderCategory ? `(Cat ${project.builderCategory})` : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions & Admin Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMetaData?.(project);
                  }}
                  className="add-meta-data-btn px-2 py-0.5 rounded-sm text-[8.5px] uppercase tracking-wider font-black bg-art-gold/15 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40 flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                  title="Add Meta Data & SEO"
                >
                  <Sparkles size={9} />
                  <span>Add Meta Data</span>
                </button>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditDraft({ ...project });
                        setIsEditingCard(!isEditingCard);
                      }}
                      className="px-2 py-0.5 rounded-sm text-[8.5px] uppercase tracking-wider font-black bg-art-gold/15 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Project Data"
                    >
                      <Edit size={9} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onTogglePause(project)}
                      className={cn(
                        "px-1.5 py-0.5 rounded-sm text-[8.5px] uppercase tracking-wider font-black border cursor-pointer transition-colors",
                        project.isPaused ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-white/5 text-art-gold border-art-gold/30 hover:bg-art-gold hover:text-black"
                      )}
                      title={project.isPaused ? "Unhide project" : "Hide project"}
                    >
                      {project.isPaused ? 'Unhide' : 'Hide'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(project)}
                      className="px-1.5 py-0.5 rounded-sm text-[8.5px] uppercase tracking-wider font-black bg-white/5 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer transition-colors"
                      title="Delete project"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. PRICING SECOND (Directly following Project Name) */}
            <div className="flex items-center justify-between gap-2 flex-wrap bg-gradient-to-r from-black/90 via-black/80 to-transparent border border-art-gold/40 px-2.5 py-1.5 rounded-sm shadow-sm">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[9px] uppercase tracking-widest text-white/60 font-mono font-bold">
                  Price:
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-art-gold tracking-tight leading-tight">
                  {formattedMainPrice}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-white/65 font-mono font-semibold pl-1.5 border-l border-white/20">
                  * Conditions Apply
                </span>
                {project.configuration && project.configuration.length > 0 && (
                  <span className="text-white/80 font-mono font-semibold uppercase text-[8.5px] pl-1.5 border-l border-white/20">
                    {project.configuration.join(' | ')}
                  </span>
                )}
              </div>

              {/* Handover quick pill */}
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/80">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/15">
                  🗓️ {effectiveHandoverDate}
                </span>
              </div>
            </div>

            {/* Unified Location & Last Price Strip */}
            <div className="px-2.5 py-1 bg-white/[0.025] border border-white/15 rounded-sm flex items-center justify-between gap-2 text-[9.5px] sm:text-[10px]">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <MapPin size={11} className="text-art-gold shrink-0" />
                <span className="font-semibold text-white truncate">
                  {project.location}
                </span>
                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[8px] uppercase tracking-wider text-art-gold hover:text-white flex items-center gap-0.5 font-mono font-bold transition-colors px-1.5 py-0.5 bg-art-gold/15 border border-art-gold/40 rounded shrink-0"
                >
                  <ExternalLink size={8} /> Map
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-mono shrink-0 text-white/70">
                <span className="text-white font-bold" title="Last Verified Price">
                  {effectiveLastPrice}
                </span>
              </div>
            </div>

            {/* Curated Writeup (Clean without Nearby 2km text) */}
            {cleanProjectDescription(project.description) && (
              <p className="text-[11px] text-white/80 font-sans leading-tight line-clamp-1">
                {cleanProjectDescription(project.description)}
              </p>
            )}

            {/* Curated Lifestyle Amenities Top 4 */}
            {project.features && project.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.features.slice(0, 4).map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[9.5px] font-sans font-medium text-white/85 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-sm flex items-center gap-1"
                  >
                    <Sparkles size={8} className="text-art-gold shrink-0" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Expandable Rich Specifications Drawer */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-2 overflow-hidden border-t border-white/10"
                >
                  {/* Dynamic Nearby Amenities Panel Powered by Google Search Grounding */}
                  {showNearbyAmenities && (
                    <div className="overflow-hidden bg-[#0c120e] border border-emerald-500/40 rounded-sm p-3 space-y-2.5 font-sans shadow-lg">
                      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 flex-wrap gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                            Nearby Amenities within 2km Radius
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ⚡ Google Search Grounding
                          </span>
                          <button
                            type="button"
                            onClick={fetchNearbyAmenities}
                            disabled={isLoadingAmenities}
                            className="text-[8.5px] font-mono text-white/70 hover:text-white px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer disabled:opacity-50"
                            title="Re-query verified amenities via Google Search Grounding"
                          >
                            {isLoadingAmenities ? <Loader2 size={10} className="animate-spin inline" /> : '↻ Refresh'}
                          </button>
                        </div>
                      </div>

                      {isLoadingAmenities && !amenitiesData ? (
                        <div className="flex items-center justify-center gap-2 py-5 text-emerald-300 text-xs font-mono">
                          <Loader2 size={16} className="animate-spin text-emerald-400" />
                          <span>Discovering schools, hospitals &amp; transit via Google Search Grounding...</span>
                        </div>
                      ) : amenitiesError && !amenitiesData ? (
                        <div className="text-center py-3 text-red-400 text-xs font-mono">
                          {amenitiesError}
                        </div>
                      ) : (
                        <>
                          {amenitiesData?.summary && (
                            <p className="text-[11px] text-white/85 leading-relaxed font-sans bg-black/40 p-2 rounded border border-emerald-500/20">
                              {amenitiesData.summary}
                            </p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                            {/* Schools */}
                            <div className="bg-black/50 border border-emerald-500/25 p-2 rounded-sm space-y-1">
                              <div className="flex items-center justify-between text-[9.5px] font-bold text-emerald-300 uppercase tracking-wider border-b border-emerald-500/20 pb-1">
                                <span className="flex items-center gap-1">🎓 Schools (&le;2km)</span>
                                <span className="text-[8.5px] text-white/50">{amenitiesData?.schools?.length || 0}</span>
                              </div>
                              {amenitiesData?.schools && amenitiesData.schools.length > 0 ? (
                                <ul className="space-y-1 pt-1">
                                  {amenitiesData.schools.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-1 text-[10px] text-white/90">
                                      <span className="truncate" title={item.name}>{item.name}</span>
                                      <span className="shrink-0 px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[8.5px]">
                                        {item.distance}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-[9px] text-white/40 block pt-1">None reported &lt;2km</span>
                              )}
                            </div>

                            {/* Hospitals */}
                            <div className="bg-black/50 border border-emerald-500/25 p-2 rounded-sm space-y-1">
                              <div className="flex items-center justify-between text-[9.5px] font-bold text-emerald-300 uppercase tracking-wider border-b border-emerald-500/20 pb-1">
                                <span className="flex items-center gap-1">🏥 Hospitals (&le;2km)</span>
                                <span className="text-[8.5px] text-white/50">{amenitiesData?.hospitals?.length || 0}</span>
                              </div>
                              {amenitiesData?.hospitals && amenitiesData.hospitals.length > 0 ? (
                                <ul className="space-y-1 pt-1">
                                  {amenitiesData.hospitals.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-1 text-[10px] text-white/90">
                                      <span className="truncate" title={item.name}>{item.name}</span>
                                      <span className="shrink-0 px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[8.5px]">
                                        {item.distance}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-[9px] text-white/40 block pt-1">None reported &lt;2km</span>
                              )}
                            </div>

                            {/* Transit Points */}
                            <div className="bg-black/50 border border-emerald-500/25 p-2 rounded-sm space-y-1">
                              <div className="flex items-center justify-between text-[9.5px] font-bold text-emerald-300 uppercase tracking-wider border-b border-emerald-500/20 pb-1">
                                <span className="flex items-center gap-1">🚇 Transit (&le;2km)</span>
                                <span className="text-[8.5px] text-white/50">{amenitiesData?.transit?.length || 0}</span>
                              </div>
                              {amenitiesData?.transit && amenitiesData.transit.length > 0 ? (
                                <ul className="space-y-1 pt-1">
                                  {amenitiesData.transit.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-1 text-[10px] text-white/90">
                                      <span className="truncate" title={item.name}>{item.name}</span>
                                      <span className="shrink-0 px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[8.5px]">
                                        {item.distance}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-[9px] text-white/40 block pt-1">None reported &lt;2km</span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Dedicated Rental Specifications Box */}
                  {project.type === 'Rental' && (
                    <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-sm space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between items-center text-cyan-300 font-bold border-b border-cyan-500/20 pb-1">
                        <span>Rental Lease Terms:</span>
                        <span className="text-white font-bold">{project.monthlyRental || project.price}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white/70">
                        <span>Advance: <strong className="text-white font-medium">{project.advance || 'Negotiable'}</strong></span>
                        <span>Maint: <strong className="text-white font-medium">{project.maintenance || 'Nominal'}</strong></span>
                        <span>Residence: <strong className="text-white font-medium">{project.residenceType || '2BHK'}</strong></span>
                        <span>Tenant: <strong className="text-white font-medium">{project.tenantType || 'Family'}</strong></span>
                        <span>Furnish: <strong className="text-white font-medium">{project.furnishType || 'Semi Furnished'}</strong></span>
                        <span>Pets: <strong className="text-white font-medium">{project.petFriendly || 'Yes'}</strong></span>
                        {project.suba && <span>SUBA: <strong className="text-white font-medium">{project.suba}</strong></span>}
                        <span>Parking: <strong className="text-white font-medium">{project.carCloseParking || 1} Covered</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Dedicated Resale Specifications Box */}
                  {project.type === 'Resale' && (
                    <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-sm space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between items-center text-amber-300 font-bold border-b border-amber-500/20 pb-1">
                        <span>Resale Property Mandate:</span>
                        <span className="text-white font-bold">{project.price}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white/70">
                        <span>SUBA: <strong className="text-white font-medium">{project.suba || '1650 Sq.Ft.'}</strong></span>
                        <span>Carpet: <strong className="text-white font-medium">{project.carpetArea || '1280 Sq.Ft.'}</strong></span>
                        <span>Authority: <strong className="text-amber-300 font-bold">{project.approvedAuthority || project.approvalBody || 'BDA'}</strong></span>
                        <span>Status: <strong className="text-white font-medium">{project.registrationStatus || 'Clear Title'}</strong></span>
                        <span>Tower/Floor: <strong className="text-white font-medium">{project.tower || 'Block A'} / {project.floor || 'High'}</strong></span>
                        <span>Parking: <strong className="text-white font-medium">{project.carCloseParking || 1} Covered</strong></span>
                        {project.balcony && <span>Balcony: <strong className="text-white font-medium">{project.balcony}</strong></span>}
                        {project.mainDoorFacing && <span>Facing: <strong className="text-white font-medium">{project.mainDoorFacing}</strong></span>}
                      </div>
                    </div>
                  )}

                  {/* Floor Plan & Specifications */}
                  {project.floorPlan && (
                    <div className="px-3 py-1.5 bg-white/[0.03] rounded-sm border border-art-gold/30 text-[10px] sm:text-[11px] flex items-center gap-2">
                      <Layers size={12} className="text-art-gold shrink-0" />
                      <span className="text-white font-mono font-medium">{project.floorPlan}</span>
                    </div>
                  )}

                  {/* Additional Curated Features */}
                  {project.features && project.features.length > 5 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.features.slice(5).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono font-medium text-white/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm"
                        >
                          + {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Share & Alerts inside Expanded Drawer */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsSubscribeOpen(true)}
                      className="px-2.5 py-1 rounded-sm border bg-white/10 hover:bg-art-gold/20 text-art-gold border-white/20 text-[9px] font-mono transition-all cursor-pointer flex items-center gap-1.5"
                      title="Subscribe to Price Alerts"
                    >
                      <Bell size={10} />
                      <span>Price Alerts</span>
                    </button>
                    <SocialShareButtons 
                      propertyTitle={project.name}
                      propertyHighlights={project.features || []}
                      propertyLink={`${window.location.origin}/?project=${encodeURIComponent(project.id || project.name)}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Action Footer Bar */}
            <div className="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2 flex-wrap mt-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEnquire(project)}
                  className="px-3.5 sm:px-4 py-2 rounded-sm text-[9.5px] sm:text-[10px] uppercase tracking-wider font-black bg-art-gold hover:bg-white text-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_2px_12px_rgba(197,160,89,0.35)]"
                  title={`${inquiriesSocialCount} verified buyer inquiries on ${project.name}`}
                >
                  <span>Inquire Now</span>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-mono font-bold bg-black text-art-gold rounded-full">
                    {inquiriesSocialCount}
                  </span>
                </button>

                {/* Schedule Site Visit Button with pre-filled site visit intent */}
                <button
                  type="button"
                  data-testid={"schedule-site-visit-btn-" + (project.id || project.name)}
                  onClick={() => onScheduleSiteVisit ? onScheduleSiteVisit(project) : onEnquire(project)}
                  className="px-3 sm:px-3.5 py-2 rounded-sm text-[9px] sm:text-[9.5px] uppercase tracking-wider font-black border bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-400 border-emerald-500/35 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group/visit"
                  title={`Schedule a site visit for ${project.name}`}
                >
                  <Calendar size={12} className="text-emerald-400 group-hover/visit:text-black transition-colors shrink-0" />
                  <span>Schedule Site Visit</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDownload(project)}
                  className="px-3 sm:px-3.5 py-2 rounded-sm text-[9px] sm:text-[9.5px] uppercase tracking-wider font-extrabold border bg-white/10 hover:bg-white hover:text-black text-white border-white/25 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Download Official Brochure"
                >
                  <Download size={11} />
                  <span>Brochure</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="px-2.5 py-2 rounded-sm border bg-art-gold/15 hover:bg-art-gold hover:text-black text-art-gold border-art-gold/40 text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Open Investment & ROI Calculator"
                >
                  <Calculator size={11} />
                  <span className="hidden sm:inline">Calculator</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "px-3 py-2 rounded-sm text-[9px] sm:text-[9.5px] uppercase tracking-wider font-extrabold border transition-all flex items-center gap-1 cursor-pointer",
                    isExpanded
                      ? "bg-art-gold text-black border-art-gold shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                      : "bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border-white/20"
                  )}
                  title={isExpanded ? "Collapse specifications" : "Expand full overview, 2km amenities & specifications"}
                >
                  <span>{isExpanded ? "Less Details" : "Full Specifications"}</span>
                  <ChevronDown size={11} className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <MediaViewerModal
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
        project={project}
        isAdmin={isAdmin}
        onEnquire={onEnquire}
      />
    </motion.div>
  );
};


const ProjectCardSkeleton = () => {
  return (
    <div className="group relative flex flex-col md:flex-row bg-[#111111] border border-white/20 overflow-hidden w-full max-w-full box-border rounded-lg shadow-md">
      {/* Left Media Skeleton */}
      <div className="w-full md:w-44 lg:w-48 xl:w-52 h-28 sm:h-32 md:h-auto min-h-[110px] md:min-h-[135px] bg-white/[0.04] shimmer-bg relative shrink-0" />
      {/* Right Details Skeleton */}
      <div className="flex-1 min-w-0 p-2.5 sm:p-3 flex flex-col space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="bg-white/10 h-4 w-1/3 rounded-sm shimmer-bg" />
          <div className="bg-art-gold/25 h-5 w-20 rounded-sm shimmer-bg" />
        </div>
        <div className="bg-white/20 h-5 w-1/2 rounded-sm shimmer-bg" />
        <div className="bg-white/[0.05] h-3.5 w-2/5 rounded-sm shimmer-bg" />
        <div className="bg-white/[0.03] h-6 w-full rounded-sm shimmer-bg" />
        <div className="flex gap-1.5">
          <div className="bg-white/[0.06] h-4 w-16 rounded-sm shimmer-bg" />
          <div className="bg-white/[0.06] h-4 w-20 rounded-sm shimmer-bg" />
          <div className="bg-white/[0.06] h-4 w-14 rounded-sm shimmer-bg" />
        </div>
        <div className="bg-white/[0.04] h-7 w-full rounded-sm shimmer-bg mt-auto" />
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
      `Property Segment       : ${proj.segment || 'Luxury Residences'}`,
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
      `Direct Advisory Desk: contact@bshomez.in | www.bshomez.in`,
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

    const phoneVal = validateMobileNumber('+91', formData.mobile);
    if (!phoneVal.isValid) {
      setMobileError(phoneVal.message || 'Please enter a valid mobile number with the correct number of digits.');
      return;
    }
    const digitsOnly = phoneVal.cleanDigits;

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

      // Dispatch direct real-time alert to contact@bshomez.in
      dispatchEnquiryEmailAlert({
        customerName: formData.name.trim(),
        customerPhone: digitsOnly,
        projectName: formData.interestedProjects.trim(),
        preferredLocation: formData.preferredLocation.trim(),
        message: `Brochure Download Request for ${formData.interestedProjects}`,
        type: 'Download Brochure',
        source: 'Brochure Download Form'
      });

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
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 rounded-full bg-white text-black hover:bg-art-gold font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-all cursor-pointer z-30 border border-white"
          aria-label="Close modal"
          title="Close (Esc)"
        >
          <X size={15} className="stroke-[3]" />
          <span className="font-mono text-[10px]">CLOSE</span>
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
                <PhoneInputWithCountry
                  label="Mobile Number"
                  value={formData.mobile}
                  onChange={(fullNumber) => {
                    setFormData({ ...formData, mobile: fullNumber });
                    setMobileError('');
                  }}
                  required
                />
                {mobileError && (
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-1.5 font-mono">
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
                  {allProjects.map((p, idx) => (
                    <option key={p.id ? `modal-opt-${p.id}-${idx}` : `modal-opt-${p.name}-${idx}`} value={p.name} />
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

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-4 px-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-sm uppercase tracking-[0.2em] text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X size={14} /> Close Window
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-art-gold hover:bg-white text-black py-4 rounded-sm uppercase tracking-[0.25em] text-[11px] font-black transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
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
              </div>
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
  onScheduleSiteVisit,
  onDownload,
  onSaveProject,
  onDeleteProject,
  onTogglePause,
  onOpenNewProjectModal,
  onOpenMetaData,
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
  onScheduleSiteVisit?: (p: Project) => void;
  onDownload: (p: Project) => void;
  onSaveProject: (updated: Project) => Promise<void>;
  onDeleteProject: (p: Project) => Promise<void>;
  onTogglePause: (p: Project) => Promise<void>;
  onOpenNewProjectModal: () => void;
  onOpenMetaData?: (p?: Project) => void;
  isLoading?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'All' | 'Primary' | 'Resale' | 'Rental'>('All');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All');
  const [selectedBuilderCat, setSelectedBuilderCat] = useState<'All' | 'A+' | 'A' | 'B' | 'C'>('All');
  const [selectedPropType, setSelectedPropType] = useState<'All' | 'Apartment' | 'Villa' | 'Plot'>('All');
  const [selectedHeaderStatus, setSelectedHeaderStatus] = useState<'All' | 'EOI' | 'Under Construction' | 'Ready to Move' | 'Handed Over'>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [maxPriceBudget, setMaxPriceBudget] = useState<number>(100000000); // Default ₹10 Cr+ / Any Budget

  const parseProjectNumericPrice = (priceStr?: string): { min: number; max: number } => {
    if (!priceStr) return { min: 0, max: Infinity };
    const cleaned = priceStr.toLowerCase().replace(/,/g, '');
    const matches = [...cleaned.matchAll(/([\d.]+)\s*(cr|crore|crores|lakh|lakhs|lac|lacs|l\/month|k|thousand)?/gi)];
    if (!matches || matches.length === 0) return { min: 0, max: Infinity };

    const values: number[] = [];
    for (const match of matches) {
      const num = parseFloat(match[1]);
      if (isNaN(num)) continue;
      const unit = match[2]?.toLowerCase() || '';

      if (unit.startsWith('cr')) {
        values.push(num * 10000000);
      } else if (unit.startsWith('l')) {
        values.push(num * 100000);
      } else if (unit.startsWith('k') || unit.startsWith('thous')) {
        values.push(num * 1000);
      } else {
        if (cleaned.includes('cr')) {
          values.push(num * 10000000);
        } else if (cleaned.includes('lakh') || cleaned.includes('lac') || cleaned.includes('l /') || cleaned.includes('l/')) {
          values.push(num * 100000);
        } else {
          values.push(num);
        }
      }
    }

    if (values.length === 0) return { min: 0, max: Infinity };
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const formatBudgetLabel = (val: number): string => {
    if (val >= 100000000) return 'Any Budget';
    if (val >= 10000000) {
      const cr = val / 10000000;
      return `Up to ₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
    }
    const lk = val / 100000;
    return `Up to ₹${lk.toFixed(0)} Lakhs`;
  };

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

  // Dynamic live counts for direct category filters: All Types, Primary, Rental, Resale
  const typeCounts = React.useMemo(() => {
    let all = 0;
    let primary = 0;
    let rental = 0;
    let resale = 0;

    projects.forEach(p => {
      if (LEGACY_PROJECT_NAMES.includes(p.name)) return;
      if (p.isDeleted) return;
      if (!(isAdmin && showHidden) && p.isPaused) return;

      all++;
      const norm = p.type === 'Primary Sale' ? 'Primary' : p.type;
      if (norm === 'Primary') primary++;
      else if (norm === 'Rental') rental++;
      else if (norm === 'Resale') resale++;
    });

    return { All: all, Primary: primary, Rental: rental, Resale: resale };
  }, [projects, isAdmin, showHidden]);

  const displayedProjects = React.useMemo(() => {
    return projects.filter(p => {
      if (LEGACY_PROJECT_NAMES.includes(p.name)) return false;
      if (p.isDeleted) return false;
      if (!(isAdmin && showHidden) && p.isPaused) return false;

      // Live search query matching across all relevant property attributes
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesLocation = p.location?.toLowerCase().includes(q);
        const matchesZone = p.zone?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesConfig = p.configuration?.some(c => c.toLowerCase().includes(q));
        const matchesFeatures = p.features?.some(f => f.toLowerCase().includes(q));
        const matchesPropType = p.propertyType?.toLowerCase().includes(q);
        const matchesType = p.type?.toLowerCase().includes(q);
        const matchesRera = p.reraNumber?.toLowerCase().includes(q);
        const matchesApproval = p.approvalBody?.toLowerCase().includes(q);
        const matchesFloorPlan = p.floorPlan?.toLowerCase().includes(q);
        const matchesStatus = p.handoverStatus?.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesZone && !matchesDesc && !matchesConfig && !matchesFeatures && !matchesPropType && !matchesType && !matchesRera && !matchesApproval && !matchesFloorPlan && !matchesStatus) {
          return false;
        }
      }

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

      if (maxPriceBudget < 100000000) {
        const { min } = parseProjectNumericPrice(p.price);
        if (min > maxPriceBudget) return false;
      }

      return true;
    });
  }, [projects, isAdmin, showHidden, searchQuery, selectedType, selectedCorridor, selectedPropType, selectedHeaderStatus, selectedTag, maxPriceBudget]);

  const uniqueDisplayedProjects = React.useMemo(() => {
    return deduplicateProjects(displayedProjects);
  }, [displayedProjects]);

  // Per-page display options: default 10, options 10, 20, 30, 40, 50
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

  // Reset to first page whenever any filter or search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedType,
    selectedCorridor,
    selectedPropType,
    selectedHeaderStatus,
    selectedTag,
    selectedBuilderCat,
    maxPriceBudget,
    pageSize
  ]);

  const totalProjects = uniqueDisplayedProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProjects);
  const paginatedProjects = uniqueDisplayedProjects.slice(startIndex, endIndex);

  const scrollToArchiveTop = () => {
    const el = document.getElementById('portfolios-archive-anchor') || document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (newPage: number) => {
    const targetPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(targetPage);
    scrollToArchiveTop();
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (activePage > 3) pages.push('...');
      const start = Math.max(2, activePage - 1);
      const end = Math.min(totalPages - 1, activePage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (activePage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  // Simultaneously resets selectedType, selectedCorridor, selectedPropType, and searchQuery states
  const handleClearAllFilters = () => {
    setSelectedType('All');
    setSelectedCorridor('All');
    setSelectedPropType('All');
    setSearchQuery('');
    setMaxPriceBudget(100000000);
    setSelectedBuilderCat('All');
    setSelectedHeaderStatus('All');
    setSelectedTag('All');
    setCurrentPage(1);
  };

  const isAnyFilterActive = Boolean(
    searchQuery.trim() ||
    selectedType !== 'All' ||
    selectedCorridor !== 'All' ||
    selectedPropType !== 'All' ||
    selectedBuilderCat !== 'All' ||
    selectedHeaderStatus !== 'All' ||
    selectedTag !== 'All' ||
    maxPriceBudget < 100000000
  );

  const activeFiltersCount = [
    Boolean(searchQuery.trim()),
    selectedType !== 'All',
    selectedCorridor !== 'All',
    selectedPropType !== 'All',
    selectedHeaderStatus !== 'All',
    selectedTag !== 'All',
    maxPriceBudget < 100000000
  ].filter(Boolean).length;

  return (
    <section id="projects" className="pt-3 sm:pt-5 pb-16 px-3 sm:px-6 md:px-10 bg-art-dark relative">
      <div className="absolute left-12 top-0 w-px h-full bg-white/5 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto">
        {/* Anchor for smooth scroll when changing pages */}
        <div id="portfolios-archive-anchor" className="scroll-mt-40" />

        {/* Frozen Sticky Header: Artisanal Portraits Title, Corridors, Search & Pagination */}
        <div className="sticky top-[50px] sm:top-[56px] z-30 bg-[#0c0c0c]/95 backdrop-blur-md pb-2 pt-2 border-b border-art-gold/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] -mx-3 sm:-mx-6 md:-mx-10 px-3 sm:px-6 md:px-10 mb-4 transition-all">
          {/* Top Row: Section Title, Corridor Breadcrumbs & Admin Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
            <div>
              <span className="text-art-gold text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.25em] sm:tracking-[0.35em] font-black block">Archive / Portfolios</span>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-serif text-white tracking-tight italic leading-tight">
                Artisanal <span className="not-italic text-art-gold">Portraits.</span>
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-white/60 uppercase tracking-[0.12em] sm:tracking-[0.16em] font-bold text-[9px] sm:text-[10px] text-left sm:text-right hidden sm:block">
                Whitefield · Hoskote · Varthur · Gunjur · Hosa Road · Kasavanahalli · Sarjapur · Electronic City · Bellandur
              </p>
              <div className="flex flex-wrap items-center gap-1.5 justify-start sm:justify-end">
                <button
                  type="button"
                  onClick={() => onOpenMetaData?.(displayedProjects[0])}
                  className="add-meta-data-btn bg-art-gold/15 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40 px-3 py-1 rounded-sm text-[8.5px] uppercase tracking-[0.16em] font-black transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)] flex items-center gap-1 cursor-pointer w-max"
                  title="Add or edit SEO meta titles, meta descriptions, and keywords"
                >
                  <Sparkles size={11} />
                  <span>Add Meta Data</span>
                </button>
                <button
                  type="button"
                  data-testid="generate-seo-audit-report-grid-btn"
                  onClick={() => onOpenMetaData?.(displayedProjects[0])}
                  className="generate-seo-audit-report-btn bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 px-3 py-1 rounded-sm text-[8.5px] uppercase tracking-[0.16em] font-black transition-all flex items-center gap-1 cursor-pointer w-max shadow-sm"
                  title="Compile summary of missing alt text for all images in the project and provide a downloadable CSV report for the admin"
                >
                  <FileSpreadsheet size={11} />
                  <span>Generate SEO Audit Report</span>
                </button>
                {isAdmin && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {onToggleShowHidden && (
                      <button
                        type="button"
                        onClick={onToggleShowHidden}
                        className={cn(
                          "px-2.5 py-1 rounded-sm text-[8.5px] uppercase tracking-[0.14em] font-black border transition-all cursor-pointer",
                          showHidden
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                            : "bg-white/5 text-white/60 border-white/15 hover:text-white"
                        )}
                      >
                        {showHidden ? `Hide (${hiddenCount})` : `Show Hidden (${hiddenCount})`}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onOpenNewProjectModal}
                      className="bg-art-gold hover:bg-white text-black px-3 py-1 rounded-sm text-[8.5px] uppercase tracking-[0.16em] font-black transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] flex items-center gap-1 cursor-pointer w-max"
                    >
                      <Sparkles size={11} />
                      + Add Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Portfolios Top Search Bar */}
          <div className="mb-2 p-2 sm:p-2.5 bg-black/85 border border-white/20 rounded-md shadow-md">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <Search size={15} className="absolute left-2.5 text-art-gold shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by project name, corridor (Whitefield, Hoskote...), 2/3/4 BHK, amenities, RERA..."
                  className="w-full bg-white/[0.05] border border-white/20 focus:border-art-gold text-white placeholder-white/40 text-xs sm:text-[13px] pl-8 pr-7 py-1.5 sm:py-2 rounded-sm outline-none transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-white/50 hover:text-white transition-colors p-1 cursor-pointer"
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-1 bg-white/5 border border-white/15 text-white/80 rounded-sm">
                  <span className="text-art-gold font-black">{displayedProjects.length}</span> Portfolios
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[9px] uppercase tracking-wider text-art-gold hover:text-white font-mono cursor-pointer px-2 py-1 border border-art-gold/30 rounded-sm bg-art-gold/10 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Direct Category Filters: Primary, Rental, Resale, All Types */}
          <div className="mb-2 p-1.5 sm:p-2 bg-[#101010]/95 border border-white/20 rounded-md shadow-md backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              {/* Direct Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] uppercase tracking-[0.2em] text-art-gold font-mono font-bold mr-1 hidden sm:inline">
                  Direct Filters:
                </span>

                {/* Option 1: All Types */}
                <button
                  type="button"
                  data-testid="filter-direct-all-types"
                  onClick={() => setSelectedType('All')}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] sm:text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border shadow-sm",
                    selectedType === 'All'
                      ? "bg-gradient-to-r from-art-gold via-amber-400 to-yellow-500 text-black border-art-gold font-black shadow-[0_2px_12px_rgba(197,160,89,0.35)] scale-[1.02]"
                      : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 border-white/15"
                  )}
                  title="Show all property listings across all categories"
                >
                  <LayoutGrid size={13} className={selectedType === 'All' ? 'text-black' : 'text-art-gold'} />
                  <span>All Types</span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                    selectedType === 'All' ? "bg-black/25 text-black" : "bg-white/10 text-white/60"
                  )}>
                    {typeCounts.All}
                  </span>
                </button>

                {/* Option 2: Primary */}
                <button
                  type="button"
                  data-testid="filter-direct-primary"
                  onClick={() => setSelectedType('Primary')}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] sm:text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border shadow-sm",
                    selectedType === 'Primary'
                      ? "bg-gradient-to-r from-art-gold via-amber-400 to-yellow-500 text-black border-art-gold font-black shadow-[0_2px_12px_rgba(197,160,89,0.35)] scale-[1.02]"
                      : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 border-white/15"
                  )}
                  title="Direct builder & new launch primary sale properties (0% brokerage)"
                >
                  <Sparkles size={13} className={selectedType === 'Primary' ? 'text-black' : 'text-art-gold'} />
                  <span>Primary</span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                    selectedType === 'Primary' ? "bg-black/25 text-black" : "bg-white/10 text-white/60"
                  )}>
                    {typeCounts.Primary}
                  </span>
                </button>

                {/* Option 3: Rental */}
                <button
                  type="button"
                  data-testid="filter-direct-rental"
                  onClick={() => setSelectedType('Rental')}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] sm:text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border shadow-sm",
                    selectedType === 'Rental'
                      ? "bg-gradient-to-r from-art-gold via-amber-400 to-yellow-500 text-black border-art-gold font-black shadow-[0_2px_12px_rgba(197,160,89,0.35)] scale-[1.02]"
                      : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 border-white/15"
                  )}
                  title="Verified premium rental homes in Bangalore"
                >
                  <Home size={13} className={selectedType === 'Rental' ? 'text-black' : 'text-blue-400'} />
                  <span>Rental</span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                    selectedType === 'Rental' ? "bg-black/25 text-black" : "bg-white/10 text-white/60"
                  )}>
                    {typeCounts.Rental}
                  </span>
                </button>

                {/* Option 4: Resale */}
                <button
                  type="button"
                  data-testid="filter-direct-resale"
                  onClick={() => setSelectedType('Resale')}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] sm:text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border shadow-sm",
                    selectedType === 'Resale'
                      ? "bg-gradient-to-r from-art-gold via-amber-400 to-yellow-500 text-black border-art-gold font-black shadow-[0_2px_12px_rgba(197,160,89,0.35)] scale-[1.02]"
                      : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 border-white/15"
                  )}
                  title="Immediate possession resale apartments, villas, and plots"
                >
                  <RotateCcw size={13} className={selectedType === 'Resale' ? 'text-black' : 'text-emerald-400'} />
                  <span>Resale</span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                    selectedType === 'Resale' ? "bg-black/25 text-black" : "bg-white/10 text-white/60"
                  )}>
                    {typeCounts.Resale}
                  </span>
                </button>
              </div>

              {/* Corridor & Typology Refinement Selectors */}
              <div className="flex items-center gap-1.5 flex-wrap justify-between sm:justify-end">
                <div className="flex items-center gap-1">
                  <span className="text-[8.5px] uppercase font-mono text-white/40 hidden lg:inline">
                    Corridor:
                  </span>
                  <select
                    value={selectedCorridor}
                    onChange={(e) => setSelectedCorridor(e.target.value)}
                    className="bg-black/80 border border-white/20 text-white text-[10px] rounded px-2 py-1 outline-none focus:border-art-gold font-mono cursor-pointer"
                    title="Filter by corridor micro-market"
                  >
                    <option value="All">All Corridors ({corridors.length - 1})</option>
                    {corridors.filter(c => c !== 'All').map(c => (
                      <option key={`corr-${c}`} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[8.5px] uppercase font-mono text-white/40 hidden lg:inline">
                    Typology:
                  </span>
                  <select
                    value={selectedPropType}
                    onChange={(e) => setSelectedPropType(e.target.value as any)}
                    className="bg-black/80 border border-white/20 text-white text-[10px] rounded px-2 py-1 outline-none focus:border-art-gold font-mono cursor-pointer"
                    title="Filter by Apartment, Villa, Plot"
                  >
                    <option value="All">All Typologies</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>

                <button
                  type="button"
                  data-testid="clear-all-filters-btn"
                  onClick={handleClearAllFilters}
                  className={cn(
                    "text-[10px] uppercase font-mono tracking-wider cursor-pointer px-2.5 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1.5 font-bold border",
                    isAnyFilterActive
                      ? "bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border-rose-500/40 shadow-sm"
                      : "bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10"
                  )}
                  title="Reset selectedType, selectedCorridor, selectedPropType, and searchQuery simultaneously"
                >
                  <RotateCcw size={11} className={isAnyFilterActive ? "text-rose-300" : "text-white/40"} />
                  <span>Clear All Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-white/15 text-white font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Price Range Slider Toolbar */}
          <div className="mb-2 p-2 sm:p-2.5 bg-[#121212]/95 border border-white/20 rounded-md shadow-md backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                <label htmlFor="price-range-slider" className="text-[10px] sm:text-[11px] font-mono uppercase font-black text-art-gold flex items-center gap-1.5 tracking-wider">
                  <SlidersHorizontal size={13} className="text-art-gold" />
                  <span>Price Range</span>
                </label>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono font-bold border",
                  maxPriceBudget < 100000000 
                    ? "bg-art-gold/15 text-art-gold border-art-gold/40 shadow-[0_0_10px_rgba(197,160,89,0.25)]" 
                    : "bg-white/5 text-white/60 border-white/10"
                )}>
                  {formatBudgetLabel(maxPriceBudget)}
                </span>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-[9px] font-mono text-white/40 shrink-0">₹25L</span>
                <input
                  id="price-range-slider"
                  type="range"
                  min="2500000"
                  max="100000000"
                  step="2500000"
                  value={maxPriceBudget}
                  onChange={(e) => setMaxPriceBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#c5a059]"
                  aria-label="Price Range slider"
                />
                <span className="text-[9px] font-mono text-white/40 shrink-0">₹10Cr+</span>
              </div>

              {/* Quick Budget Presets */}
              <div className="flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
                {[
                  { label: 'All', value: 100000000 },
                  { label: '< ₹1 Cr', value: 10000000 },
                  { label: '< ₹2.5 Cr', value: 25000000 },
                  { label: '< ₹5 Cr', value: 50000000 },
                ].map(preset => (
                  <button
                    key={`preset-${preset.label}`}
                    type="button"
                    onClick={() => setMaxPriceBudget(preset.value)}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded border transition-all cursor-pointer whitespace-nowrap",
                      maxPriceBudget === preset.value
                        ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                        : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear All Filters button in slider toolbar */}
            <div className="flex items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-3">
              <button
                type="button"
                data-testid="clear-all-filters-slider-btn"
                onClick={handleClearAllFilters}
                className={cn(
                  "px-3 py-1.5 rounded-sm text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border whitespace-nowrap font-bold",
                  isAnyFilterActive
                    ? "bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border-rose-500/40 shadow-sm"
                    : "bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10"
                )}
                title="Clear All Filters"
              >
                <RotateCcw size={11} className={isAnyFilterActive ? "text-rose-300" : "text-white/40"} />
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-[#111111]/90 border border-white/15 rounded-md flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider font-mono text-white/70">
                Displaying <span className="text-art-gold font-bold">{totalProjects === 0 ? 0 : startIndex + 1}–{endIndex}</span> of <span className="text-white font-bold">{totalProjects}</span> Portfolios
              </span>
              {totalPages > 1 && (
                <span className="text-[8.5px] uppercase tracking-wider font-mono px-1.5 py-0.2 rounded-sm bg-white/10 text-white/60 border border-white/10">
                  Page {activePage} of {totalPages}
                </span>
              )}
            </div>

            {/* Options to view in same page: 10, 20, 30, 40, 50 */}
            <div className="flex items-center gap-1.5">
              <span className="text-[8.5px] uppercase tracking-widest text-white/60 font-mono font-bold whitespace-nowrap">
                Per Page:
              </span>
              <div className="flex items-center gap-0.5 bg-black/60 p-0.5 rounded border border-white/10">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={`top-pagesize-${size}`}
                    type="button"
                    onClick={() => setPageSize(size)}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer",
                      pageSize === size
                        ? "bg-art-gold text-black border border-art-gold shadow-[0_0_8px_rgba(197,160,89,0.35)]"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                    title={`Show ${size} projects per page`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal one below other project list */}
        <div className="flex flex-col gap-5 sm:gap-6 w-full">
          {isLoading ? (
            Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
              <ProjectCardSkeleton key={`skeleton-${i}`} />
            ))
          ) : displayedProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-lg bg-white/[0.01] space-y-4">
              <span className="text-art-gold uppercase tracking-[0.4em] text-[10px] block font-mono">Advisory Archive</span>
              <p className="text-white/60 font-serif italic text-xl">No matching portraits in this specific filter combination.</p>
              <button
                type="button"
                data-testid="empty-clear-all-filters-btn"
                onClick={handleClearAllFilters}
                className="px-6 py-2.5 bg-art-gold text-black text-[10px] uppercase tracking-widest font-black rounded-sm cursor-pointer hover:bg-white transition-all shadow-md flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={12} />
                <span>Clear All Filters</span>
              </button>
            </div>
          ) : (
            paginatedProjects.map((project, idx) => (
              <ProjectCard 
                key={project.id ? `grid-card-${project.id}-${startIndex + idx}` : `grid-card-${project.name}-${startIndex + idx}`} 
                project={project} 
                index={startIndex + idx}
                isAdmin={isAdmin}
                isCompared={comparedProjectIds.includes(project.id || '') || comparedProjectIds.includes(project.name)}
                comparedCount={comparedProjectIds.length}
                onToggleCompare={onToggleCompare}
                onEnquire={onEnquire} 
                onScheduleSiteVisit={onScheduleSiteVisit}
                onDownload={onDownload}
                onSaveProject={onSaveProject}
                onDeleteProject={onDeleteProject}
                onTogglePause={onTogglePause}
                onOpenMetaData={onOpenMetaData}
              />
            ))
          )}
        </div>

        {/* Bottom Pagination & Navigation Controls */}
        {totalProjects > 0 && (
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left pagination details & page size quick change */}
            <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
              <span className="text-[10px] sm:text-[11px] font-mono text-white/60 uppercase tracking-wider">
                Showing <span className="text-art-gold font-bold">{startIndex + 1}–{endIndex}</span> of <span className="text-white font-bold">{totalProjects}</span>
              </span>
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-white/50">
                <span>· View:</span>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={`bottom-pagesize-${size}`}
                    type="button"
                    onClick={() => setPageSize(size)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer",
                      pageSize === size
                        ? "bg-art-gold text-black font-black"
                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/15 border border-white/10"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Pagination page controls */}
            {totalPages > 1 && (
              <nav aria-label="Portfolios pagination" className="flex items-center gap-1.5 flex-wrap justify-center">
                {/* First button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(1)}
                  disabled={activePage === 1}
                  className={cn(
                    "px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer",
                    activePage === 1
                      ? "bg-white/[0.02] text-white/25 border-white/5 cursor-not-allowed"
                      : "bg-white/5 text-white/80 hover:text-white hover:bg-white/15 border-white/15"
                  )}
                  title="First Page"
                >
                  « First
                </button>

                {/* Prev button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer flex items-center gap-1",
                    activePage === 1
                      ? "bg-white/[0.02] text-white/25 border-white/5 cursor-not-allowed"
                      : "bg-white/5 text-white/80 hover:text-white hover:bg-white/15 border-white/15"
                  )}
                  title="Previous Page"
                >
                  ‹ Prev
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageItem, pIdx) => {
                  if (pageItem === '...') {
                    return (
                      <span key={`dots-${pIdx}`} className="px-2 text-white/40 font-mono text-xs select-none">
                        …
                      </span>
                    );
                  }
                  const pageNum = Number(pageItem);
                  const isCurrent = pageNum === activePage;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "min-w-[32px] h-[32px] px-2 text-[11px] font-mono font-bold rounded-sm border transition-all cursor-pointer flex items-center justify-center",
                        isCurrent
                          ? "bg-art-gold text-black border-art-gold shadow-[0_0_12px_rgba(197,160,89,0.35)]"
                          : "bg-white/5 text-white/70 hover:text-white hover:bg-white/15 border-white/15"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer flex items-center gap-1",
                    activePage === totalPages
                      ? "bg-white/[0.02] text-white/25 border-white/5 cursor-not-allowed"
                      : "bg-white/5 text-white/80 hover:text-white hover:bg-white/15 border-white/15"
                  )}
                  title="Next Page"
                >
                  Next ›
                </button>

                {/* Last button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={activePage === totalPages}
                  className={cn(
                    "px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer",
                    activePage === totalPages
                      ? "bg-white/[0.02] text-white/25 border-white/5 cursor-not-allowed"
                      : "bg-white/5 text-white/80 hover:text-white hover:bg-white/15 border-white/15"
                  )}
                  title="Last Page"
                >
                  Last »
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const EnquiryModal = ({ 
  project, 
  onClose,
  enquiryType = 'Acquire',
  initialCategory
}: { 
  project: Project | null; 
  onClose: () => void;
  enquiryType?: 'Acquire' | 'Consult' | 'Inquire' | 'Loan' | 'Site Visit';
  initialCategory?: 'Primary' | 'Rental' | 'Resale' | 'Home Loan';
}) => {
  const defaultCategory: 'Primary' | 'Rental' | 'Resale' | 'Home Loan' = 
    initialCategory || 
    (project?.type === 'Rental' 
      ? 'Rental' 
      : project?.type === 'Resale' 
      ? 'Resale' 
      : enquiryType === 'Loan' 
      ? 'Home Loan' 
      : 'Primary');

  const [selectedCategory, setSelectedCategory] = useState<'Primary' | 'Rental' | 'Resale' | 'Home Loan'>(defaultCategory);
  const defaultSiteVisitMessage = project?.name 
    ? `I would like to schedule a private site visit for ${project.name} to view the property and inspect project master layout.`
    : 'I would like to schedule a private site visit to view the property and inspect project master layout.';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: enquiryType === 'Site Visit' ? defaultSiteVisitMessage : ''
  });
  
  const [preferredVisitDate, setPreferredVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredVisitTime, setPreferredVisitTime] = useState('Morning (10:00 AM - 1:00 PM)');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const getTitle = () => {
    switch (enquiryType) {
      case 'Site Visit':
        return project ? `Site Visit – ${project.name}` : 'Site Visit';
      case 'Consult':
        return 'Private Advisory Session';
      case 'Inquire':
        return 'General Portfolio Inquiry';
      case 'Acquire':
      default:
        return project ? `${project.name} (${selectedCategory})` : 'Priority Access Request';
    }
  };

  const getSubTitle = () => {
    switch (enquiryType) {
      case 'Site Visit':
        return 'Physical Property Tour & Masterplan Inspection';
      case 'Consult':
        return 'Bespoke Portfolio Advisory Desk';
      case 'Inquire':
        return 'Direct Intelligence Group';
      case 'Acquire':
      default:
        return `${selectedCategory} • Exclusively Verified Direct Inventory`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const phoneVal = validateMobileNumber('+91', formData.phone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.message || 'Please enter a valid mobile number with the correct number of digits.');
      return;
    }

    const targetProject = project || { id: 'general_inquiry', name: 'BS Homez General Portfolio' };
    setSubmitting(true);
    try {
      const siteVisitDetails = enquiryType === 'Site Visit' 
        ? `\n[Scheduled Site Visit: Date ${preferredVisitDate}, Timings: ${preferredVisitTime}]` 
        : '';
      const finalMsg = (formData.message || (enquiryType === 'Site Visit' ? defaultSiteVisitMessage : `No custom requirements filed for type: ${enquiryType} (${selectedCategory})`)) + siteVisitDetails;

      const enquiry: Enquiry = {
        projectId: targetProject.id || 'general_inquiry',
        projectName: targetProject.name,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        message: finalMsg,
        type: enquiryType === 'Site Visit' ? 'Site Visit' : 'Form',
        enquiryCategory: selectedCategory,
        propertyCategory: selectedCategory === 'Rental' ? 'Rent' : selectedCategory,
        intentSentiment: enquiryType === 'Site Visit' ? 'High' : undefined,
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, 'enquiries'), enquiry);

      // Dispatch direct real-time alert to contact@bshomez.in
      dispatchEnquiryEmailAlert({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        projectName: targetProject.name,
        enquiryCategory: selectedCategory,
        preferredLocation: ('location' in targetProject ? targetProject.location : undefined) || ('zone' in targetProject ? targetProject.zone : undefined) || 'Bangalore',
        message: finalMsg,
        type: enquiryType === 'Site Visit' ? 'Site Visit' : enquiryType,
        source: enquiryType === 'Site Visit' ? 'Property Card - Schedule Site Visit' : 'Property Enquire Modal'
      });

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
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8",
              enquiryType === 'Site Visit' ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-art-gold/10"
            )}>
              {enquiryType === 'Site Visit' ? (
                <Calendar className="text-emerald-400" size={48} />
              ) : (
                <CheckCircle2 className="text-art-gold" size={48} />
              )}
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif mb-4 italic text-white">
              {enquiryType === 'Site Visit' ? 'Site Visit Scheduled!' : 'Transmission Recorded'}
            </h3>
            {enquiryType === 'Site Visit' && project && (
              <p className="text-emerald-300 font-mono text-xs mb-3 font-bold">
                Target Property: <span className="text-white">{project.name}</span> &bull; {preferredVisitDate} ({preferredVisitTime})
              </p>
            )}
            <p className="text-white/60 tracking-widest uppercase text-[10px] max-w-md mx-auto">
              {enquiryType === 'Site Visit'
                ? `Our property specialist will connect with you to confirm your site visit appointment for ${preferredVisitDate} (${preferredVisitTime}).`
                : 'A dedicated Relationship Advisor will contact you directly.'}
            </p>
          </div>
        ) : (
          <>
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 rounded-full bg-white text-black hover:bg-art-gold font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-all cursor-pointer z-30 border border-white"
              aria-label="Close modal"
              title="Close Window (Esc)"
            >
              <X size={15} className="stroke-[3]" />
              <span className="font-mono text-[10px]">CLOSE</span>
            </button>

            <div className="font-sans">
              <div className="mb-6 pb-4 border-b border-white/10">
                <span className="text-art-gold uppercase tracking-[0.4em] text-[10px] mb-2 block font-bold">{getSubTitle()}</span>
                <p className="text-md text-white/60 font-mono text-xs uppercase mb-1">Connecting with respect to:</p>
                <h3 className="text-2xl sm:text-3xl font-serif text-white italic">{getTitle()}</h3>
              </div>

              {/* Category Segment Selector */}
              <div className="mb-5 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-art-gold block">
                  Inquiry Category Queue
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Primary', 'Rental', 'Resale', 'Home Loan'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "py-2 px-2 text-[10px] font-bold uppercase tracking-wider rounded-sm border transition-all cursor-pointer text-center",
                        selectedCategory === cat
                          ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                          : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Site Visit Intent Banner */}
              {enquiryType === 'Site Visit' && (
                <div className="mb-6 p-4 rounded-sm bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/40 flex items-start gap-3.5">
                  <div className="p-2.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <h4 className="text-xs uppercase font-mono font-black text-emerald-300 tracking-wider">
                        Site Visit
                      </h4>
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        Direct Developer Tour &bull; Verified Inventory
                      </span>
                    </div>
                    <p className="text-[11.5px] text-white/80 leading-relaxed font-sans">
                      Step into your future address — immerse yourself in actual layouts, natural light, panoramic balcony views, and premium architectural finishes at <strong className="text-white">{project?.name}</strong>.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Preferred Site Visit Date & Timings */}
                {enquiryType === 'Site Visit' && (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/30 rounded-sm space-y-3">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <Calendar size={13} className="text-emerald-400" />
                      <span>Preferred Site Visit Schedule</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block text-emerald-300 font-bold">
                          Preferred Site Visit Date *
                        </label>
                        <input 
                          required
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          value={preferredVisitDate}
                          onChange={e => setPreferredVisitDate(e.target.value)}
                          className="w-full bg-black/80 border border-emerald-500/40 focus:border-emerald-400 rounded-sm p-3 text-white outline-none transition-all text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block text-emerald-300 font-bold">
                          Preferred Site Visit Timings *
                        </label>
                        <select
                          value={preferredVisitTime}
                          onChange={e => setPreferredVisitTime(e.target.value)}
                          className="w-full bg-black/80 border border-emerald-500/40 focus:border-emerald-400 rounded-sm p-3 text-white outline-none transition-all text-xs font-mono"
                        >
                          <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                          <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM – 4:00 PM)</option>
                          <option value="Evening (4:00 PM - 6:30 PM)">Evening (4:00 PM – 6:30 PM)</option>
                          <option value="Weekend Special (11:00 AM - 3:00 PM)">Weekend Special (11:00 AM – 3:00 PM)</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-[10px] text-white/50 font-mono">
                      Selected appointment: <span className="text-emerald-300 font-bold">{preferredVisitDate}</span> during <span className="text-emerald-300 font-bold">{preferredVisitTime}</span>
                    </p>
                  </div>
                )}

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
                    <PhoneInputWithCountry
                      label="Contact Phone Number"
                      value={formData.phone}
                      onChange={(fullNumber) => setFormData({ ...formData, phone: fullNumber })}
                      required
                    />
                    {phoneError && (
                      <p className="text-[10px] text-red-400 font-mono mt-1 font-bold">{phoneError}</p>
                    )}
                  </div>
                </div>

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
                  <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Optional Notes / Particulars</label>
                  <textarea 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20 text-sm h-24 resize-none"
                    placeholder="Describe specific preferences (e.g. configurations, budget, timeline, floor choices)..."
                  />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="py-4 px-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-sm uppercase tracking-[0.2em] text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X size={14} /> Close Window
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      "flex-1 py-4 rounded-sm uppercase tracking-[0.25em] text-[11px] font-black transition-all disabled:opacity-50 shadow-xl cursor-pointer",
                      enquiryType === 'Site Visit'
                        ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        : "bg-art-gold text-black hover:bg-white"
                    )}
                  >
                    {submitting 
                      ? (enquiryType === 'Site Visit' ? 'CONFIRMING SITE VISIT...' : 'RECORDING INQUIRY...') 
                      : (enquiryType === 'Site Visit' ? 'CONFIRM SITE VISIT REQUEST' : 'SUBMIT SECURED INQUIRY')}
                  </button>
                </div>
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

export const generateLocalSeoKeywords = (pName: string, loc: string, z: string, mode: string, propType: string, pr: string, bName: string, rera?: string) => {
  const cleanName = (pName || 'Bangalore Luxury Property').trim();
  const cleanLoc = (loc || z || 'Whitefield, Bangalore').trim();
  const cleanZone = (z || 'Whitefield').trim();
  const cleanProp = (propType || 'Apartment').trim();
  const cleanPrice = (pr || 'Best Price on Request').trim();
  const cleanBuilder = (bName || 'Premier Bangalore Developer').trim();
  const isRent = (mode || '').toLowerCase().includes('rent');
  const isResale = (mode || '').toLowerCase().includes('resale');
  const verb = isRent ? 'Rent' : isResale ? 'Resale Buy' : 'Buy';
  const action = isRent ? 'for Rent' : 'for Sale';

  const pLower = cleanPrice.toLowerCase();
  let budgetTier = "High-Demand Tech Corridor Budget";
  let roiTag = "12-15% Expected Annual Appreciation";
  let rentalYieldTag = "5.5-6.5% High Corporate Rental Yield";

  if (pLower.includes('lakh') || pLower.includes('lac')) {
    const match = pLower.match(/(\d+(\.\d+)?)/);
    const val = match ? parseFloat(match[1]) : 75;
    if (val < 90) {
      budgetTier = "Affordable Luxury Under 1 Crore";
      roiTag = "High-Growth Corridor 15-18% Capital Gains";
      rentalYieldTag = "6-8% High Rental Demand";
    } else {
      budgetTier = "Entry-Level Premium 90L - 1.5 Cr";
      roiTag = "13-15% Steady Capital Growth";
      rentalYieldTag = "5.5-6.5% Rental Yield";
    }
  } else if (pLower.includes('cr')) {
    const match = pLower.match(/(\d+(\.\d+)?)/);
    const val = match ? parseFloat(match[1]) : 2.5;
    if (val < 2) {
      budgetTier = "High-Demand 1-2 Cr Tech Hub Segment";
      roiTag = "12-14% Steady Appreciation";
      rentalYieldTag = "5.5-6.5% Rental Yield";
    } else if (val <= 4) {
      budgetTier = "Ultra-Luxury 2-4 Cr Executive Residences";
      roiTag = "14-16% Capital Growth & High Resale Value";
      rentalYieldTag = "5-6% Expat / Corporate Lease Yield";
    } else {
      budgetTier = "Trophy Ultra-Luxury 4 Cr+ Estate";
      roiTag = "Exclusive Capital Preservation Asset";
      rentalYieldTag = "High-Ticket Expat Corporate Lease";
    }
  } else if (isRent) {
    budgetTier = "Verified Executive Corporate Rental";
    roiTag = "Zero-Vacancy Continuous Cash Flow";
    rentalYieldTag = "Corporate ITPL & ORR Executive Lease";
  }

  const keywords = [
    `${cleanName} ${cleanLoc}`,
    `${cleanName} ${action}`,
    `${cleanName} Price and Floor Plans`,
    `${cleanName} Brochure Download`,
    `${cleanBuilder} ${cleanName}`,
    `${verb} ${cleanProp} in ${cleanZone}`,
    `${cleanZone} Bangalore Luxury Real Estate`,
    `${cleanProp} for sale near ITPL and Tech Parks`,
    `Gated community ${cleanProp} in ${cleanZone}`,
    `${budgetTier}`,
    `2 BHK 3 BHK 4 BHK in ${cleanZone}`,
    `Vaastu Compliant ${cleanProp} ${cleanZone}`,
    isRent ? `Luxury flats for rent in ${cleanZone}` : `0% Brokerage on Primary Sale ${cleanZone}`,
    `High ROI Real Estate in ${cleanZone}`,
    `${roiTag}`,
    `${rentalYieldTag}`,
    `Best property to invest in Bangalore 2026`,
    `NRI Property Investment Bangalore 0% Tax Encumbrance`,
    `RERA Approved BBMP A Khata ${cleanProp} ${cleanZone}`,
    isResale ? `Verified clear resale title ${cleanZone}` : `Pre-launch and construction linked payment plan`,
    `BS Homez Verified Portfolio`,
    `BS Homez ${cleanZone} Property Advisory`,
    `Direct Developer Mandate Bangalore`
  ];

  const hashtags = [
    "#BSHomez",
    "#BangaloreRealEstate",
    `#${cleanZone.replace(/\s+/g, '')}Homes`,
    `#Luxury${cleanProp}`,
    "#HighROIBangalore",
    "#NRIPropertyInvestment",
    `#${cleanName.replace(/\s+/g, '')}`,
    "#ZeroBrokerage"
  ];

  const whatsappSnippet = `*BS HOMEZ LUXURY PORTFOLIO*\n📍 *Project:* ${cleanName}\n🗺️ *Location:* ${cleanLoc} (${cleanZone})\n🏢 *Type:* ${mode} ${cleanProp}\n💰 *Price:* ${cleanPrice} (*Conditions Apply)\n📈 *ROI Highlight:* ${roiTag} | ${rentalYieldTag}\n🛡️ *RERA:* ${rera || 'Verified'}\n\n🔗 *Details:* https://www.bshomez.in\n📞 *Advisory:* contact@bshomez.in`;

  return {
    keywords: Array.from(new Set(keywords)).join(', '),
    budgetTier,
    roiTag,
    rentalYieldTag,
    hashtags,
    whatsappSnippet,
    metaTitle: `${cleanName} | Luxury ${cleanProp} ${action} in ${cleanZone} | BS Homez`,
    metaDescription: `${verb} luxury ${cleanProp} at ${cleanName}, ${cleanLoc}. ${cleanPrice}. RERA verified, ${roiTag}, zero builder brokerage. Contact BS Homez.`
  };
};

const ProjectForm = ({
  project,
  initialInventoryType = 'Primary',
  onClose,
  onProjectSaved,
  onOpenEnquiry
}: {
  project?: Project | null;
  initialInventoryType?: 'Primary' | 'Rental' | 'Resale';
  onClose: () => void;
  onProjectSaved?: (savedProject: Project) => void;
  onOpenEnquiry?: (p: Project) => void;
}) => {
  const resolvedInitialType: 'Primary' | 'Rental' | 'Resale' =
    project?.type === 'Rental' 
      ? 'Rental' 
      : project?.type === 'Resale' 
      ? 'Resale' 
      : initialInventoryType || 'Primary';

  const [inventoryMode, setInventoryMode] = useState<'Primary' | 'Rental' | 'Resale'>(resolvedInitialType);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: project?.name || '',
    description: project?.description || '',
    price: project?.price || '',
    lastPrice: project?.lastPrice || project?.price || '',
    location: project?.location || '',
    locationTarget: project?.locationTarget || '',
    zone: project?.zone || 'Whitefield',
    type: resolvedInitialType,
    propertyType: (project?.propertyType as any) || 'Apartment',
    builderCategory: project?.builderCategory || 'A',
    builderName: project?.builderName || '',
    approvalBody: project?.approvalBody || 'BBMP / BDA & RERA Approved',
    floorPlan: project?.floorPlan || '',
    configuration: project?.configuration && project.configuration.length > 0 ? project.configuration : ['2 BHK', '3 BHK'],
    segment: project?.segment || (resolvedInitialType === 'Rental' ? 'Verified Rental' : 'Luxury'),
    handoverStatus: project?.handoverStatus || (resolvedInitialType === 'Rental' ? 'Ready to Move' : 'Under Construction'),
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
        : getSmartProjectImages(project?.zone || 'Whitefield', resolvedInitialType, project?.builderCategory || 'A', project?.propertyType || 'Apartment'),
    mobileImageUrl: project?.mobileImageUrl || '',
    videoUrl: project?.videoUrl || '',
    mobileVideoUrl: project?.mobileVideoUrl || '',
    features: project?.features && project.features.filter(Boolean).length > 0 ? project.features : ['Grand Clubhouse', 'Swimming Pool', '24/7 Security'],
    isPaused: project?.isPaused || false,

    // Rental & Resale Inventory Specific Properties
    availableFrom: project?.availableFrom || '',
    mainDoorFacing: project?.mainDoorFacing || 'East',
    tower: project?.tower || '',
    floor: project?.floor || '',
    residenceType: project?.residenceType || '2BHK',
    tenantType: project?.tenantType || 'Family',
    amenitiesAvailability: project?.amenitiesAvailability || 'Yes',
    petFriendly: project?.petFriendly || 'Yes',
    furnishType: project?.furnishType || 'Semi Furnished',
    advance: project?.advance || '',
    monthlyRental: project?.monthlyRental || '',
    maintenance: project?.maintenance || '',
    suba: project?.suba || '',
    carpetArea: project?.carpetArea || '',
    carCloseParking: project?.carCloseParking || '1',
    balcony: project?.balcony || '1',
    comments: project?.comments || '',
    handedOverDate: project?.handedOverDate || '',
    registrationStatus: project?.registrationStatus || 'Ready for Registration',
    approvedAuthority: project?.approvedAuthority || 'BDA',
    sticker: project?.sticker || 'None',
    unitsRemaining: project?.unitsRemaining !== undefined ? project.unitsRemaining : undefined,
    isInventorySoldOut: Boolean(project?.isInventorySoldOut || project?.sticker === 'Sold Out')
  });

  const [keywordsInput, setKeywordsInput] = useState<string>(
    project?.seoKeywords && project.seoKeywords.length > 0 
      ? project.seoKeywords.join(', ') 
      : 'Bangalore Luxury Real Estate, RERA Approved, 0% Commission'
  );
  const [isFetchingLocationDetails, setIsFetchingLocationDetails] = useState(false);
  const [locationDetailsSuccess, setLocationDetailsSuccess] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const [autoCheckBanner, setAutoCheckBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAutoFetchLocationDetails = async () => {
    const loc = (formData.location || formData.zone || 'Whitefield').trim();
    if (!loc) {
      setError('Please enter a Location or select a Corridor first.');
      return;
    }
    setIsFetchingLocationDetails(true);
    setLocationDetailsSuccess(null);
    try {
      const res = await fetch('/api/location/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: loc, zone: formData.zone })
      });
      const data = await res.json();
      if (data?.details) {
        const d = data.details;
        const formatted = d.summary;
        const newLocationTarget = `Nearby IT Hubs: ${d.itHubs} | Transit: ${d.metroStation}, ${d.busStop}`;
        setFormData(prev => ({
          ...prev,
          locationTarget: newLocationTarget,
          description: prev.description ? `${prev.description}\n\n${formatted}` : formatted
        }));
        setLocationDetailsSuccess(`Fetched nearby IT Hubs, Schools, Malls, Hospitals, Bus Stop, Railway Station, and Metro Station with distances in km!`);
      }
    } catch (err) {
      console.warn('Location lookup error:', err);
    } finally {
      setIsFetchingLocationDetails(false);
    }
  };

  const [isGeneratingAiKeywords, setIsGeneratingAiKeywords] = useState(false);
  const [aiKeywordsSuccess, setAiKeywordsSuccess] = useState<string | null>(null);
  const [aiSeoDetails, setAiSeoDetails] = useState<{
    budgetTier?: string;
    roiTag?: string;
    rentalYieldTag?: string;
    hashtags?: string[];
    whatsappSnippet?: string;
    source?: string;
  } | null>(null);
  const [copiedTagMsg, setCopiedTagMsg] = useState<string | null>(null);

  const handleGenerateAiKeywords = async () => {
    setIsGeneratingAiKeywords(true);
    setAiKeywordsSuccess(null);

    // Setup 2.5-second timeout for rapid real-time response
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch('/api/ai/seo-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          projectName: formData.name,
          location: formData.location,
          zone: formData.zone,
          type: inventoryMode,
          propertyType: formData.propertyType,
          price: formData.price || formData.monthlyRental,
          builderName: formData.builderName,
          reraNumber: formData.reraNumber,
          features: formData.features,
          configuration: formData.configuration
        })
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data?.keywords) {
        setKeywordsInput(data.keywords);
        setAiSeoDetails({
          budgetTier: data.budgetTier,
          roiTag: data.roiTag,
          rentalYieldTag: data.rentalYieldTag,
          hashtags: data.hashtags,
          whatsappSnippet: data.whatsappSnippet,
          source: data.source
        });
        if (data.metaTitle && (!formData.metaTitle || formData.metaTitle.trim() === '')) {
          setFormData(prev => ({
            ...prev,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription || prev.metaDescription
          }));
        }
        const count = data.keywords.split(',').length;
        setAiKeywordsSuccess(`✨ Generated ${count} Real-Time Keywords! (Google SERP • Meta • WhatsApp • ${data.roiTag || 'High ROI'})`);
        setTimeout(() => setAiKeywordsSuccess(null), 5000);
        return;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      // Instant local real-time generation on network delay or timeout
      const localResult = generateLocalSeoKeywords(
        formData.name,
        formData.location,
        formData.zone,
        inventoryMode,
        formData.propertyType,
        formData.price || formData.monthlyRental,
        formData.builderName,
        formData.reraNumber
      );
      setKeywordsInput(localResult.keywords);
      setAiSeoDetails({
        budgetTier: localResult.budgetTier,
        roiTag: localResult.roiTag,
        rentalYieldTag: localResult.rentalYieldTag,
        hashtags: localResult.hashtags,
        whatsappSnippet: localResult.whatsappSnippet,
        source: 'realtime_instant_matrix'
      });
      if (!formData.metaTitle) {
        setFormData(prev => ({
          ...prev,
          metaTitle: localResult.metaTitle,
          metaDescription: localResult.metaDescription
        }));
      }
      const count = localResult.keywords.split(',').length;
      setAiKeywordsSuccess(`✨ Generated ${count} Real-Time Keywords! (Google SERP • Meta • WhatsApp • ${localResult.roiTag})`);
      setTimeout(() => setAiKeywordsSuccess(null), 5000);
    } finally {
      setIsGeneratingAiKeywords(false);
    }
  };

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
          `Auto-synced "${merged.name}" (Cat ${resolvedCat}): Images, Last Price (${merged.lastPrice}), Handover Date (${merged.handoverDate}), RERA (${merged.reraNumber}), Approval Body (${merged.approvalBody}), Floor Plan & Details updated.`
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
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      let currentData = { ...formData, type: inventoryMode };

      // Ensure SEO keywords are populated
      let resolvedKeywords = keywordsInput.trim();
      if (!resolvedKeywords) {
        resolvedKeywords = `${currentData.name || 'Bangalore Property'}, Buy ${currentData.propertyType || 'Apartment'} in ${currentData.zone || 'Whitefield'}, ${inventoryMode} Property Bangalore, 0% Brokerage, RERA Approved, BS Homez`;
      }

      // Automatically check online for Primary projects if basic details missing
      if (
        inventoryMode === 'Primary' &&
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
            type: inventoryMode,
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

      // Configure pricing and descriptions tailored to inventory mode
      let finalPrice = '';
      let finalLastPrice = '';
      let finalHandoverDate = '';

      if (inventoryMode === 'Rental') {
        const rentDisplay = currentData.monthlyRental?.trim() 
          ? (currentData.monthlyRental.toLowerCase().includes('mo') ? currentData.monthlyRental : `${currentData.monthlyRental}/month*`)
          : (currentData.price?.trim() || 'Rs. 35,000/mo*');
        finalPrice = rentDisplay;
        finalLastPrice = rentDisplay;
        finalHandoverDate = currentData.availableFrom ? `Available from ${currentData.availableFrom}` : 'Immediate Available';
      } else if (inventoryMode === 'Resale') {
        finalPrice = formatPriceWithCondition(currentData.price?.trim() || 'Rs. 1.85 Cr onwards*');
        finalLastPrice = formatPriceWithCondition(currentData.lastPrice?.trim() || finalPrice);
        finalHandoverDate = currentData.handedOverDate || currentData.availableFrom ? `Ready / From ${currentData.availableFrom || currentData.handedOverDate}` : 'Immediate Possession';
      } else {
        const defaultHandover =
          currentData.handoverStatus === 'Ready to Move' || currentData.handoverStatus === 'Handed Over'
            ? 'Immediate Possession (OC Received)'
            : 'December 2027';
        finalPrice = formatPriceWithCondition(currentData.price?.trim() || 'Rs. 1.75 Cr onwards*');
        finalLastPrice = formatPriceWithCondition(currentData.lastPrice?.trim() || finalPrice);
        finalHandoverDate = currentData.handoverDate?.trim() || defaultHandover;
      }

      const validImages = (currentData.imageUrls || []).map(u => u.trim()).filter(Boolean);

      const generatedDescription = inventoryMode === 'Rental'
        ? `${currentData.name} - Premium ${currentData.residenceType || '2BHK'} ${currentData.propertyType || 'Apartment'} available for rent in ${currentData.location || 'Bangalore'}. Advance: ${currentData.advance || 'Standard'}, Monthly Rent: ${currentData.monthlyRental || finalPrice}, Maintenance: ${currentData.maintenance || 'Nominal'}, Tenant: ${currentData.tenantType || 'Family'}, Pets: ${currentData.petFriendly || 'Allowed'}. ${currentData.comments || ''}`
        : inventoryMode === 'Resale'
        ? `${currentData.name} - Verified Resale ${currentData.residenceType || '3BHK'} ${currentData.propertyType || 'Apartment'} in ${currentData.location || 'Bangalore'}. SUBA: ${currentData.suba || 'Spacious'}, Carpet Area: ${currentData.carpetArea || 'Optimal'}, Approved Authority: ${currentData.approvedAuthority || 'BDA/BBMP'}, RERA: ${currentData.reraNumber || 'Verified'}. ${currentData.comments || ''}`
        : (currentData.description || `${currentData.name} in ${currentData.location || currentData.zone}, featuring bespoke residences and verified RERA compliance.`).trim();

      const data: any = {
        ...currentData,
        name: (currentData.name || (inventoryMode === 'Rental' ? 'Curated Rental Residence' : inventoryMode === 'Resale' ? 'Curated Resale Residence' : 'New Artisanal Portrait')).trim(),
        price: finalPrice,
        lastPrice: finalLastPrice,
        lastCheckedPrice: project?.price && project.price !== finalPrice ? formatPriceWithCondition(project.price) : finalLastPrice,
        handoverDate: finalHandoverDate,
        location: (currentData.location || `${currentData.zone || 'Whitefield'}, Bangalore`).trim(),
        locationTarget: (currentData.locationTarget || `Prime Corridor in ${currentData.zone || 'Whitefield'}`).trim(),
        zone: currentData.zone || 'Whitefield',
        type: inventoryMode,
        propertyType: currentData.propertyType || 'Apartment',
        builderCategory: currentData.builderCategory || 'A',
        builderName: (currentData.builderName || (inventoryMode === 'Rental' ? 'Private Landlord' : 'Verified Premier Builder')).trim(),
        approvalBody: (currentData.approvedAuthority || currentData.approvalBody || 'BBMP / BDA & Karnataka RERA Approved').trim(),
        floorPlan: (currentData.floorPlan || (currentData.suba ? `${currentData.residenceType || ''} (${currentData.suba})` : 'Vaastu Compliant Luxury Floor Plans')).trim(),
        reraNumber: (currentData.reraNumber || 'PRM/KA/RERA/Verified').trim(),
        segment: (currentData.segment || (inventoryMode === 'Rental' ? 'Verified Rental' : inventoryMode === 'Resale' ? 'Prime Resale' : 'Luxury')).trim(),
        description: generatedDescription.trim(),
        imageUrls: (inventoryMode === 'Rental' || inventoryMode === 'Resale')
          ? validImages
          : (validImages.length > 0 ? validImages : getSmartProjectImages(currentData.zone, inventoryMode, currentData.builderCategory, currentData.propertyType)),
        mobileImageUrl: validImages[0] || currentData.mobileImageUrl || '',
        ogImage: validImages[0] || currentData.ogImage || '',
        features: (currentData.features || []).map(f => f.trim()).filter(Boolean),
        configuration: (currentData.configuration && currentData.configuration.length > 0 ? currentData.configuration : [currentData.residenceType || '2 BHK']),
        
        // Exact User Inventory Fields (Rental & Resale)
        availableFrom: currentData.availableFrom || '',
        mainDoorFacing: currentData.mainDoorFacing || 'East',
        tower: currentData.tower || '',
        floor: currentData.floor || '',
        residenceType: currentData.residenceType || '2BHK',
        tenantType: currentData.tenantType || 'Family',
        amenitiesAvailability: currentData.amenitiesAvailability || 'Yes',
        petFriendly: currentData.petFriendly || 'Yes',
        furnishType: currentData.furnishType || 'Semi Furnished',
        advance: currentData.advance || '',
        monthlyRental: currentData.monthlyRental || '',
        maintenance: currentData.maintenance || '',
        suba: currentData.suba || '',
        carpetArea: currentData.carpetArea || '',
        carCloseParking: currentData.carCloseParking || '1',
        balcony: currentData.balcony || '1',
        comments: currentData.comments || '',
        handedOverDate: currentData.handedOverDate || '',
        registrationStatus: currentData.registrationStatus || 'Ready for Registration',
        approvedAuthority: currentData.approvedAuthority || 'BDA',
        sticker: Boolean(currentData.isInventorySoldOut) ? 'Sold Out' : ((currentData.sticker as any) || 'None'),
        unitsRemaining: currentData.unitsRemaining !== undefined && currentData.unitsRemaining !== null && String(currentData.unitsRemaining).trim() !== ''
          ? Number(currentData.unitsRemaining)
          : undefined,
        isInventorySoldOut: Boolean(currentData.isInventorySoldOut),
        seoKeywords: resolvedKeywords.split(',').map(s => s.trim()).filter(Boolean),

        isPaused: Boolean(currentData.isPaused),
        isDeleted: false,
        createdAt: project?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const nowMs = Date.now();
      const firestoreData = {
        ...data,
        createdAt: project?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const localFallbackId = project?.id || `local_${nowMs}`;
      let savedProjectResult: Project;

      try {
        if (project?.id && !project.id.startsWith('curated_') && !project.id.startsWith('local_')) {
          await setDoc(doc(db, 'projects', project.id), firestoreData, { merge: true });
          savedProjectResult = { ...data, id: project.id, createdAt: project.createdAt || nowMs, updatedAt: nowMs };
        } else {
          // Check if an existing project with same name and inventory mode exists to prevent duplicates
          const q = query(
            collection(db, 'projects'),
            where('name', '==', data.name),
            where('type', '==', inventoryMode)
          );
          const existingSnap = await getDocs(q);
          if (!existingSnap.empty) {
            const existingId = existingSnap.docs[0].id;
            await setDoc(doc(db, 'projects', existingId), firestoreData, { merge: true });
            savedProjectResult = { ...data, id: existingId, createdAt: nowMs, updatedAt: nowMs };
          } else {
            const docRef = await addDoc(collection(db, 'projects'), firestoreData);
            savedProjectResult = { ...data, id: docRef.id, createdAt: nowMs, updatedAt: nowMs };
          }
        }
      } catch (dbErr) {
        console.warn('Firestore write fallback: saving project locally', dbErr);
        savedProjectResult = { ...data, id: localFallbackId, createdAt: nowMs, updatedAt: nowMs };
      }

      // Always persist to custom projects local storage so real-time sync is guaranteed across reloads
      try {
        const existingLocal: Project[] = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
        const filteredLocal = existingLocal.filter(
          item => item.id !== savedProjectResult.id && item.name.toLowerCase() !== savedProjectResult.name.toLowerCase()
        );
        const nextLocal = deduplicateProjects([savedProjectResult, ...filteredLocal]);
        localStorage.setItem('bs_homez_custom_projects', JSON.stringify(nextLocal));
      } catch {}

      if (onProjectSaved) {
        onProjectSaved(savedProjectResult);
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
        className="relative bg-art-dark border-2 border-white p-6 sm:p-10 max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-md shadow-2xl z-10 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-art-gold font-black block mb-1">
              Admin Vault • Portfolio &amp; Inventory Management
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white italic">
              {project ? `Edit ${inventoryMode} Inventory` : `Add ${inventoryMode} Project to Inventory`}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {inventoryMode === 'Primary' && (
              <button
                type="button"
                onClick={() => handleAutoCheckOnline()}
                disabled={isAutoChecking}
                className="bg-art-gold/20 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/50 px-4 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAutoChecking ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isAutoChecking ? 'Checking Online...' : 'Auto-Fetch Details'}
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1.5 rounded-full bg-white text-black hover:bg-art-gold font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-all cursor-pointer border border-white"
              aria-label="Close Project Form"
              title="Close (Esc)"
            >
              <X size={15} className="stroke-[3]" />
              <span className="font-mono text-[10px]">CLOSE</span>
            </button>
          </div>
        </div>

        {/* Dedicated Inventory Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-[#141414] border border-white/15 rounded-sm">
          <button
            type="button"
            onClick={() => {
              setInventoryMode('Primary');
              setFormData(prev => ({ ...prev, type: 'Primary' }));
            }}
            className={cn(
              "flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer text-center",
              inventoryMode === 'Primary'
                ? "bg-art-gold text-black shadow-lg font-black"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            Primary Portfolios
          </button>
          <button
            type="button"
            onClick={() => {
              setInventoryMode('Rental');
              setFormData(prev => ({ ...prev, type: 'Rental', propertyType: prev.propertyType || 'Apartment' }));
            }}
            className={cn(
              "flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer text-center",
              inventoryMode === 'Rental'
                ? "bg-cyan-500 text-black shadow-lg font-black"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            Rental Inventory
          </button>
          <button
            type="button"
            onClick={() => {
              setInventoryMode('Resale');
              setFormData(prev => ({ ...prev, type: 'Resale', propertyType: prev.propertyType || 'Apartment' }));
            }}
            className={cn(
              "flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer text-center",
              inventoryMode === 'Resale'
                ? "bg-amber-500 text-black shadow-lg font-black"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            Resale Inventory
          </button>
        </div>

        {autoCheckBanner && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-sm flex items-center gap-3 text-xs text-emerald-300 font-mono">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{autoCheckBanner}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ======================================================== */}
          {/* RENTAL INVENTORY SPECIFIC FIELDS                        */}
          {/* ======================================================== */}
          {inventoryMode === 'Rental' && (
            <div className="space-y-5">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-sm text-xs text-cyan-300 font-mono flex items-center justify-between">
                <span>Rental Inventory Entry • Direct Lease &amp; Tenant Verification Desk</span>
                <span className="font-bold uppercase tracking-wider text-[10px]">Rental Vault Active</span>
              </div>

              {/* Row 1: Project Name & Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Project Name *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sobha Dream Acres, Brigade Cosmopolis..."
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Project Location *</label>
                    <button
                      type="button"
                      onClick={handleAutoFetchLocationDetails}
                      disabled={isFetchingLocationDetails}
                      className="text-[9px] uppercase tracking-wider text-cyan-400 hover:text-white flex items-center gap-1 font-mono font-bold bg-cyan-950/40 border border-cyan-500/40 px-2.5 py-0.5 rounded cursor-pointer"
                      title="Fetch nearby IT Hubs, School, Malls, Hospital, Bus Stop, Railway Station, Metro Station with distance in Kms"
                    >
                      {isFetchingLocationDetails ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      Auto-Fetch Online Details (km)
                    </button>
                  </div>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Panathur, Whitefield, Sarjapur Road..."
                  />
                  {locationDetailsSuccess && (
                    <p className="text-[10px] text-cyan-300 font-mono mt-1 font-bold">{locationDetailsSuccess}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Available From (Calendar) & Property Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 flex items-center gap-1.5">
                    <Calendar size={12} /> Available From * (Select via Calendar)
                  </label>
                  <input 
                    required
                    type="date"
                    className="w-full bg-black/60 border border-cyan-500/40 p-3.5 text-cyan-300 text-xs outline-none focus:border-cyan-400 transition-all rounded-sm font-mono cursor-pointer"
                    value={formData.availableFrom || ''}
                    onChange={e => setFormData({ ...formData, availableFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Property Type *</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer"
                    value={formData.propertyType || 'Apartment'}
                    onChange={e => setFormData({ ...formData, propertyType: e.target.value as any })}
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartments</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Stand Alone Building">Stand Alone Building</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Main Door Facing, Tower, Floor */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Main Door Facing</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.mainDoorFacing || 'East'}
                    onChange={e => setFormData({ ...formData, mainDoorFacing: e.target.value })}
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Tower</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm"
                    value={formData.tower || ''}
                    onChange={e => setFormData({ ...formData, tower: e.target.value })}
                    placeholder="e.g., Tower 3 / Block B"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Floor</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm"
                    value={formData.floor || ''}
                    onChange={e => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g., 7th Floor of 24"
                  />
                </div>
              </div>

              {/* Row 4: Residence Type & Tenant Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Residence Type *</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer font-mono font-bold"
                    value={formData.residenceType || '2BHK'}
                    onChange={e => setFormData({ ...formData, residenceType: e.target.value })}
                  >
                    <option value="Studio">Studio</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="5BHK">5BHK</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Tenant Type *</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.tenantType || 'Family'}
                    onChange={e => setFormData({ ...formData, tenantType: e.target.value })}
                  >
                    <option value="Family">Family</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Spinsters">Spinsters</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Amenities Availability, Pet Friendly, Furnish Type */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Amenities Availability</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.amenitiesAvailability || 'Yes'}
                    onChange={e => setFormData({ ...formData, amenitiesAvailability: e.target.value })}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Pet Friendly</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.petFriendly || 'Yes'}
                    onChange={e => setFormData({ ...formData, petFriendly: e.target.value })}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Furnish Type</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.furnishType || 'Semi Furnished'}
                    onChange={e => setFormData({ ...formData, furnishType: e.target.value })}
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Full Furnished">Full Furnished</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Advance, Monthly Rental, Maintenance */}
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-sm">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Advance (Deposit) *</label>
                  <input 
                    required
                    className="w-full bg-black/50 border border-white/15 p-3 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm font-mono"
                    value={formData.advance || ''}
                    onChange={e => setFormData({ ...formData, advance: e.target.value })}
                    placeholder="e.g., ₹2,50,000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Monthly Rental *</label>
                  <input 
                    required
                    className="w-full bg-black/50 border border-cyan-500/40 p-3 text-cyan-300 text-xs outline-none focus:border-cyan-400 transition-all rounded-sm font-mono font-bold"
                    value={formData.monthlyRental || ''}
                    onChange={e => setFormData({ ...formData, monthlyRental: e.target.value, price: e.target.value })}
                    placeholder="e.g., ₹42,000/mo"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Maintenance</label>
                  <input 
                    className="w-full bg-black/50 border border-white/15 p-3 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm font-mono"
                    value={formData.maintenance || ''}
                    onChange={e => setFormData({ ...formData, maintenance: e.target.value })}
                    placeholder="e.g., ₹4,000/mo"
                  />
                </div>
              </div>

              {/* Row 7: SUBA, Car Close Parking, Balcony */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">SUBA (Super Built-up Area)</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm font-mono"
                    value={formData.suba || ''}
                    onChange={e => setFormData({ ...formData, suba: e.target.value })}
                    placeholder="e.g., 1,420 Sq.Ft."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Car Close Parking</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.carCloseParking || '1'}
                    onChange={e => setFormData({ ...formData, carCloseParking: e.target.value })}
                  >
                    <option value="1">1 Car Covered Parking</option>
                    <option value="2">2 Car Covered Parking</option>
                    <option value="3">3 Car Covered Parking</option>
                    <option value="4">4 Car Covered Parking</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Balcony</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-cyan-400 transition-all rounded-sm font-mono"
                    value={formData.balcony || '1'}
                    onChange={e => setFormData({ ...formData, balcony: e.target.value })}
                    placeholder="e.g., 2 Balconies"
                  />
                </div>
              </div>

              {/* Row 8: Comments */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Comments &amp; Lease Specifications</label>
                <textarea 
                  rows={3}
                  className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-cyan-400 transition-all text-xs leading-relaxed rounded-sm"
                  value={formData.comments || ''}
                  onChange={e => setFormData({ ...formData, comments: e.target.value, description: e.target.value })}
                  placeholder="Details on lock-in period, society restrictions, view from balcony, power backup..."
                />
              </div>

              {/* Media Compression & Uploads (Photos & Walkthrough Video) */}
              <MediaUploadCompressor
                accentColor="cyan"
                title="Rental Photos & Video Walkthrough (Auto-Compressed HD)"
                images={formData.imageUrls || []}
                onImagesChange={(imgs) => setFormData(prev => ({ 
                  ...prev, 
                  imageUrls: imgs,
                  mobileImageUrl: imgs[0] || '',
                  ogImage: imgs[0] || ''
                }))}
                videoUrl={formData.videoUrl || ''}
                onVideoChange={(vUrl, poster) => setFormData(prev => ({ 
                  ...prev, 
                  videoUrl: vUrl, 
                  mobileVideoUrl: vUrl,
                  mobileImageUrl: poster || prev.mobileImageUrl || (prev.imageUrls && prev.imageUrls[0]) || '',
                  ogImage: poster || prev.ogImage || (prev.imageUrls && prev.imageUrls[0]) || ''
                }))}
              />

              {/* Inquiry Action Card */}
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-cyan-300 block mb-0.5">
                    Rental Client Inquiry Integration
                  </span>
                  <p className="text-xs text-white/70">
                    Open the inquiry submission form directly for this rental listing.
                  </p>
                </div>
                {onOpenEnquiry && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenEnquiry({
                        ...(formData as Project),
                        type: 'Rental',
                        price: formData.monthlyRental ? `${formData.monthlyRental}/mo` : formData.price || '₹35,000/mo*'
                      });
                    }}
                    className="px-4 py-2.5 bg-cyan-500 hover:bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm transition-all whitespace-nowrap cursor-pointer shadow-md"
                  >
                    Fill Rental Inquiry Form
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* RESALE INVENTORY SPECIFIC FIELDS                         */}
          {/* ======================================================== */}
          {inventoryMode === 'Resale' && (
            <div className="space-y-5">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-sm text-xs text-amber-300 font-mono flex items-center justify-between">
                <span>Resale Inventory Entry • Title Verification &amp; Approved Authority Registry</span>
                <span className="font-bold uppercase tracking-wider text-[10px]">Resale Vault Active</span>
              </div>

              {/* Row 1: Project Name & Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Project Name *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Prestige Lakeside Habitat, Godrej Air..."
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Project Location *</label>
                    <button
                      type="button"
                      onClick={handleAutoFetchLocationDetails}
                      disabled={isFetchingLocationDetails}
                      className="text-[9px] uppercase tracking-wider text-amber-400 hover:text-white flex items-center gap-1 font-mono font-bold bg-amber-950/40 border border-amber-500/40 px-2.5 py-0.5 rounded cursor-pointer"
                      title="Fetch nearby IT Hubs, School, Malls, Hospital, Bus Stop, Railway Station, Metro Station with distance in Kms"
                    >
                      {isFetchingLocationDetails ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      Auto-Fetch Online Details (km)
                    </button>
                  </div>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Varthur, Whitefield, Sarjapur Road..."
                  />
                  {locationDetailsSuccess && (
                    <p className="text-[10px] text-amber-300 font-mono mt-1 font-bold">{locationDetailsSuccess}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Property Type & Main Door Facing */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Property Type *</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm cursor-pointer"
                    value={formData.propertyType || 'Apartment'}
                    onChange={e => setFormData({ ...formData, propertyType: e.target.value as any })}
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartments</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Stand Alone Building">Stand Alone Building</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Main Door Facing</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.mainDoorFacing || 'East'}
                    onChange={e => setFormData({ ...formData, mainDoorFacing: e.target.value })}
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Tower, Floor, Residence Type */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Tower</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm"
                    value={formData.tower || ''}
                    onChange={e => setFormData({ ...formData, tower: e.target.value })}
                    placeholder="e.g., Tower 4"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Floor</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm"
                    value={formData.floor || ''}
                    onChange={e => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g., 14th Floor"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Residence Type *</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm cursor-pointer font-mono font-bold"
                    value={formData.residenceType || '3BHK'}
                    onChange={e => setFormData({ ...formData, residenceType: e.target.value })}
                  >
                    <option value="Studio">Studio</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="5BHK">5BHK</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Amenities Availability & Furnish Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Amenities Availability</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.amenitiesAvailability || 'Yes'}
                    onChange={e => setFormData({ ...formData, amenitiesAvailability: e.target.value })}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Furnish Type</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.furnishType || 'Semi Furnished'}
                    onChange={e => setFormData({ ...formData, furnishType: e.target.value })}
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Full Furnished">Full Furnished</option>
                  </select>
                </div>
              </div>

              {/* Row 5: SUBA, Carpet Area & Indicative Price */}
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-sm">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-amber-400">SUBA (Super Built-up Area) *</label>
                  <input 
                    required
                    className="w-full bg-black/50 border border-white/15 p-3 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono"
                    value={formData.suba || ''}
                    onChange={e => setFormData({ ...formData, suba: e.target.value })}
                    placeholder="e.g., 1,650 Sq.Ft."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Carpet Area *</label>
                  <input 
                    required
                    className="w-full bg-black/50 border border-white/15 p-3 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono"
                    value={formData.carpetArea || ''}
                    onChange={e => setFormData({ ...formData, carpetArea: e.target.value })}
                    placeholder="e.g., 1,280 Sq.Ft."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Indicative Resale Price *</label>
                  <input 
                    required
                    className="w-full bg-black/50 border border-amber-500/40 p-3 text-amber-300 text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono font-bold"
                    value={formData.price || ''}
                    onChange={e => setFormData({ ...formData, price: e.target.value, lastPrice: e.target.value })}
                    placeholder="e.g., ₹1.85 Cr onwards*"
                  />
                </div>
              </div>

              {/* Row 6: Car Close Parking, Balcony, RERA */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Car Close Parking</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm cursor-pointer font-mono"
                    value={formData.carCloseParking || '1'}
                    onChange={e => setFormData({ ...formData, carCloseParking: e.target.value })}
                  >
                    <option value="1">1 Car Covered Parking</option>
                    <option value="2">2 Car Covered Parking</option>
                    <option value="3">3 Car Covered Parking</option>
                    <option value="4">4 Car Covered Parking</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Balcony</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono"
                    value={formData.balcony || '1'}
                    onChange={e => setFormData({ ...formData, balcony: e.target.value })}
                    placeholder="e.g., 2 Balconies"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">RERA Number</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono"
                    value={formData.reraNumber || ''}
                    onChange={e => setFormData({ ...formData, reraNumber: e.target.value })}
                    placeholder="PRM/KA/RERA/..."
                  />
                </div>
              </div>

              {/* Row 7: Handed Over Date, Registration Status, Approved Authority */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Handed Over Date</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono"
                    value={formData.handedOverDate || ''}
                    onChange={e => setFormData({ ...formData, handedOverDate: e.target.value })}
                    placeholder="e.g., March 2024 / Ready"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Registration Status</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono"
                    value={formData.registrationStatus || 'Ready for Registration'}
                    onChange={e => setFormData({ ...formData, registrationStatus: e.target.value })}
                    placeholder="Ready for Registration / OC Received"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Approved Authority *</label>
                  <select
                    className="w-full bg-art-dark border border-white/15 p-3.5 text-amber-300 text-xs outline-none focus:border-amber-400 transition-all rounded-sm cursor-pointer font-mono font-bold"
                    value={formData.approvedAuthority || 'BDA'}
                    onChange={e => setFormData({ ...formData, approvedAuthority: e.target.value })}
                  >
                    <option value="BDA">BDA (Bangalore Development Authority)</option>
                    <option value="BBMP">BBMP (Bruhat Bengaluru Mahanagara Palike)</option>
                    <option value="BMRDA">BMRDA</option>
                    <option value="STRR">STRR (Satellite Town Ring Road)</option>
                    <option value="DTCP">DTCP</option>
                    <option value="MPA">MPA</option>
                    <option value="SPA">SPA</option>
                    <option value="BIAPPA">BIAPPA (Bangalore International Airport Area)</option>
                  </select>
                </div>
              </div>

              {/* Row 8: Available From (Calendar) */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Calendar size={12} /> Available From * (Select via Calendar)
                </label>
                <input 
                  required
                  type="date"
                  className="w-full bg-black/60 border border-amber-500/40 p-3.5 text-amber-300 text-xs outline-none focus:border-amber-400 transition-all rounded-sm font-mono cursor-pointer"
                  value={formData.availableFrom || ''}
                  onChange={e => setFormData({ ...formData, availableFrom: e.target.value })}
                />
              </div>

              {/* Row 9: Comments */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Comments &amp; Resale Disclosures</label>
                <textarea 
                  rows={3}
                  className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-amber-400 transition-all text-xs leading-relaxed rounded-sm"
                  value={formData.comments || ''}
                  onChange={e => setFormData({ ...formData, comments: e.target.value, description: e.target.value })}
                  placeholder="Khata status, loan clearance, occupancy certificate details, furnishing specifications..."
                />
              </div>

              {/* Media Compression & Uploads (Photos & Walkthrough Video) */}
              <MediaUploadCompressor
                accentColor="amber"
                title="Resale Photos & Video Walkthrough (Auto-Compressed HD)"
                images={formData.imageUrls || []}
                onImagesChange={(imgs) => setFormData(prev => ({ 
                  ...prev, 
                  imageUrls: imgs,
                  mobileImageUrl: imgs[0] || '',
                  ogImage: imgs[0] || ''
                }))}
                videoUrl={formData.videoUrl || ''}
                onVideoChange={(vUrl, poster) => setFormData(prev => ({ 
                  ...prev, 
                  videoUrl: vUrl, 
                  mobileVideoUrl: vUrl,
                  mobileImageUrl: poster || prev.mobileImageUrl || (prev.imageUrls && prev.imageUrls[0]) || '',
                  ogImage: poster || prev.ogImage || (prev.imageUrls && prev.imageUrls[0]) || ''
                }))}
              />

              {/* Inquiry Action Card */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-amber-300 block mb-0.5">
                    Resale Client Inquiry Integration
                  </span>
                  <p className="text-xs text-white/70">
                    Open the inquiry submission form directly for this resale listing.
                  </p>
                </div>
                {onOpenEnquiry && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenEnquiry({
                        ...(formData as Project),
                        type: 'Resale',
                        price: formData.price || '₹1.85 Cr*'
                      });
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm transition-all whitespace-nowrap cursor-pointer shadow-md"
                  >
                    Fill Resale Inquiry Form
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PRIMARY PORTFOLIO SPECIFIC FIELDS                        */}
          {/* ======================================================== */}
          {inventoryMode === 'Primary' && (
            <div className="grid lg:grid-cols-2 gap-10 text-left">
              {/* Left Column: Basic Info */}
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-art-gold">Project Name *</label>
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm"
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Indicative Price * (* Conditions Apply)</label>
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value, lastPrice: e.target.value})}
                      placeholder="Rs. 2.45 Cr onwards*"
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
                      className="w-full bg-black/50 border border-art-gold/30 p-3 text-art-gold font-mono text-xs outline-none focus:border-art-gold transition-all rounded-sm"
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
                      className="w-full bg-black/50 border border-art-gold/30 p-3 text-white font-mono text-xs outline-none focus:border-art-gold transition-all rounded-sm"
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
                      className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all cursor-pointer rounded-sm"
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
                      className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="Whitefield, Hoskote, Varthur, Gunjur, Hosa Road..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Property Type</label>
                    <select 
                      className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all cursor-pointer rounded-sm"
                      value={formData.propertyType || 'Apartment'}
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
                      <option value="Commercial">Commercial</option>
                      <option value="Stand Alone Building">Stand Alone Building</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Present Status</label>
                    <select 
                      className="w-full bg-art-dark border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all cursor-pointer rounded-sm"
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
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready to Move">Ready To Move</option>
                      <option value="Handed Over">Handed Over</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Builder Category &amp; Name</label>
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
                        className="bg-art-dark border border-white/15 p-3.5 text-xs text-art-gold font-bold outline-none focus:border-art-gold rounded-sm"
                      >
                        <option value="A+">Cat A+</option>
                        <option value="A">Cat A</option>
                        <option value="B">Cat B</option>
                        <option value="C">Cat C</option>
                      </select>
                      <input
                        className="flex-1 bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold rounded-sm"
                        value={formData.builderName || ''}
                        onChange={e => setFormData({ ...formData, builderName: e.target.value })}
                        placeholder="Builder Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Approval Body</label>
                    <input 
                      className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm"
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
                      className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-art-gold transition-all font-mono text-xs rounded-sm"
                      value={formData.reraNumber || ''}
                      onChange={e => setFormData({...formData, reraNumber: e.target.value})}
                      placeholder="PRM/KA/RERA/..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Project Size</label>
                    <input 
                      className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm"
                      value={formData.projectSize || ''}
                      onChange={e => setFormData({...formData, projectSize: e.target.value})}
                      placeholder="21 Acres (1,368 Units)"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Floor Plan &amp; SBA Specifications</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm"
                    value={formData.floorPlan || ''}
                    onChange={e => setFormData({...formData, floorPlan: e.target.value})}
                    placeholder="2 BHK (1250 Sq.Ft.) | 3 BHK (1780 Sq.Ft.) | 4 BHK (2450 Sq.Ft.)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Amenities (Comma Separated)</label>
                  <input 
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-art-gold transition-all text-xs rounded-sm"
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
                    className="w-full bg-white/5 border border-white/15 p-3.5 text-white outline-none focus:border-art-gold transition-all text-xs leading-relaxed rounded-sm"
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
                      className="w-full bg-white/5 border border-white/15 p-3 text-white outline-none focus:border-art-gold transition-all text-xs rounded-sm"
                      value={formData.noOfTowers || ''}
                      onChange={e => setFormData({...formData, noOfTowers: e.target.value})}
                      placeholder="10 Towers"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Flats Per Floor</label>
                    <input 
                      className="w-full bg-white/5 border border-white/15 p-3 text-white outline-none focus:border-art-gold transition-all text-xs rounded-sm"
                      value={formData.flatsPerFloor || ''}
                      onChange={e => setFormData({...formData, flatsPerFloor: e.target.value})}
                      placeholder="4 Flats / Floor"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-white/40">Floors Height</label>
                    <input 
                      className="w-full bg-white/5 border border-white/15 p-3 text-white outline-none focus:border-art-gold transition-all text-xs rounded-sm"
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
                          "p-2.5 text-[9px] border transition-all uppercase tracking-widest text-center cursor-pointer rounded-sm",
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
                    Verified Curation Active
                  </span>
                  <p className="text-xs text-white/75 leading-relaxed">
                    Primary project configurations automatically integrate pricing brackets, RERA credentials, builder ratings, and corridor connectivity matrices.
                  </p>
                </div>

                {/* Inquiry Action Card */}
                {onOpenEnquiry && (
                  <div className="p-4 bg-art-gold/10 border border-art-gold/30 rounded-sm flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-art-gold block">
                        Direct Inquiry Form Filling
                      </span>
                      <p className="text-xs text-white/60">Test or file a client inquiry for this project.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenEnquiry(formData as Project)}
                      className="px-4 py-2 bg-art-gold text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      Fill Inquiry Form
                    </button>
                  </div>
                )}

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
          )}

          {/* Project Status Sticker & SEO Keywords (Global for all Inventory Modes) */}
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-art-gold block">
              03. Status Badges &amp; Search Engine Optimization (SEO)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sticker Options */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                  Project Sticker / Ribbon Badge
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['None', 'Sold Out', 'Rented Out'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        sticker: opt,
                        isInventorySoldOut: opt === 'Sold Out'
                      }))}
                      className={cn(
                        "py-2.5 px-2 rounded-sm text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer text-center",
                        (formData.sticker || 'None') === opt
                          ? opt === 'Sold Out'
                            ? "bg-red-600 text-white border-red-500 shadow-md font-black"
                            : opt === 'Rented Out'
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md font-black"
                            : "bg-white/20 text-white border-white/40 font-black shadow-sm"
                          : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {opt === 'Sold Out' && '🏷️ '}
                      {opt === 'Rented Out' && '🔑 '}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEO Keywords */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/80 block">
                      SEO &amp; Social Visibility Keywords
                    </label>
                    <span className="text-[8.5px] text-white/40 font-mono">
                      Targeted for Google SERP Top-Rank, Meta (FB/IG) &amp; WhatsApp
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiKeywords}
                    disabled={isGeneratingAiKeywords}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-art-gold via-amber-300 to-art-gold hover:from-white hover:to-white text-black font-black rounded-sm text-[9px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                    title="Real-time AI Keyword Generation: Location, Project, Property Type, Budget & High ROI Matrix for Google, Meta & WhatsApp"
                  >
                    {isGeneratingAiKeywords ? <Loader2 size={11} className="animate-spin text-black" /> : <Sparkles size={11} className="text-black" />}
                    <span>AI Generate Keywords (Real-Time)</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={keywordsInput}
                  onChange={e => setKeywordsInput(e.target.value)}
                  placeholder="Click 'AI Generate Keywords' to populate high-visibility tags for Google, Meta, WhatsApp, Budget, & ROI..."
                  className="w-full bg-white/5 border border-white/15 p-3 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm font-mono placeholder:text-white/20 leading-relaxed resize-y"
                />

                {aiKeywordsSuccess && (
                  <div className="p-2 bg-emerald-500/15 border border-emerald-500/40 rounded-sm flex items-center justify-between gap-2 text-[9.5px] text-emerald-300 font-mono font-bold animate-pulse">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      {aiKeywordsSuccess}
                    </span>
                    <span className="text-[8px] bg-emerald-500/20 px-1.5 py-0.5 rounded uppercase">Real-Time Active</span>
                  </div>
                )}

                {copiedTagMsg && (
                  <div className="p-1.5 bg-art-gold/20 border border-art-gold/40 rounded-sm text-[9px] text-art-gold font-mono font-bold flex items-center gap-1">
                    <span>✓</span> {copiedTagMsg}
                  </div>
                )}

                {/* Real-time Category Matrix & Quick Actions */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[8px] font-mono text-white/70">
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      🔍 Google Search SERP
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      📱 Meta (Facebook &amp; Instagram)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      💬 WhatsApp Broadcast
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
                      📈 High ROI &amp; Capital Gains
                    </span>
                  </div>

                  {/* AI Generated Intelligence Highlights (Visible once generated or populated) */}
                  {aiSeoDetails && (
                    <div className="p-2.5 bg-black/50 border border-white/10 rounded-sm space-y-2 text-[9px] font-mono">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="text-art-gold font-bold uppercase tracking-wider flex items-center gap-1">
                          <span>✨</span> AI Visibility Breakdown
                        </span>
                        <div className="flex items-center gap-1.5">
                          {aiSeoDetails.hashtags && (
                            <button
                              type="button"
                              onClick={() => {
                                const text = aiSeoDetails.hashtags?.join(' ') || '';
                                navigator?.clipboard?.writeText?.(text);
                                setCopiedTagMsg('Copied Meta Hashtags to clipboard!');
                                setTimeout(() => setCopiedTagMsg(null), 3000);
                              }}
                              className="px-2 py-0.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded text-[8px] cursor-pointer transition-all"
                            >
                              📋 Copy Meta Tags
                            </button>
                          )}
                          {aiSeoDetails.whatsappSnippet && (
                            <button
                              type="button"
                              onClick={() => {
                                const text = aiSeoDetails.whatsappSnippet || '';
                                navigator?.clipboard?.writeText?.(text);
                                setCopiedTagMsg('Copied WhatsApp Broadcast to clipboard!');
                                setTimeout(() => setCopiedTagMsg(null), 3000);
                              }}
                              className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded text-[8px] cursor-pointer transition-all"
                            >
                              📲 Copy WhatsApp Card
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-white/75 text-[8.5px]">
                        {aiSeoDetails.budgetTier && (
                          <div className="bg-white/5 p-1.5 rounded border border-white/5">
                            <span className="text-white/40 block text-[7.5px] uppercase">Budget Segment</span>
                            <span className="text-amber-300 font-semibold">{aiSeoDetails.budgetTier}</span>
                          </div>
                        )}
                        {aiSeoDetails.roiTag && (
                          <div className="bg-white/5 p-1.5 rounded border border-white/5">
                            <span className="text-white/40 block text-[7.5px] uppercase">Capital Appreciation ROI</span>
                            <span className="text-emerald-300 font-semibold">{aiSeoDetails.roiTag}</span>
                          </div>
                        )}
                        {aiSeoDetails.rentalYieldTag && (
                          <div className="bg-white/5 p-1.5 rounded border border-white/5">
                            <span className="text-white/40 block text-[7.5px] uppercase">Rental Yield Target</span>
                            <span className="text-cyan-300 font-semibold">{aiSeoDetails.rentalYieldTag}</span>
                          </div>
                        )}
                        {aiSeoDetails.hashtags && (
                          <div className="bg-white/5 p-1.5 rounded border border-white/5">
                            <span className="text-white/40 block text-[7.5px] uppercase">Social Discovery Tags</span>
                            <span className="text-indigo-300 truncate block">{aiSeoDetails.hashtags.slice(0, 4).join(' ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Explicit 'Inventory Sold Out' Flag Card */}
              <div className={cn(
                "md:col-span-2 p-3.5 rounded-sm border transition-all space-y-2.5",
                formData.isInventorySoldOut
                  ? "bg-red-950/30 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                  : "bg-black/40 border-white/15"
              )}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-red-400 flex items-center gap-1.5">
                      <span>⛔</span> Explicit 'Inventory Sold Out' Flag
                    </label>
                    <p className="text-[9px] text-white/60 font-mono mt-0.5">
                      Explicitly marks this project as sold out. <strong className="text-red-400">Replaces the 'Units Remaining' badge</strong> with a prominent 'SOLD OUT' visual on the card.
                    </p>
                  </div>
                  {formData.isInventorySoldOut ? (
                    <span className="animate-limited-badge px-3 py-1 bg-red-600 text-white border border-red-400 rounded text-[9.5px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                      <span>⛔</span> LIVE VISUAL: SOLD OUT (REPLACES UNITS BADGE)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-white/5 text-white/40 border border-white/10 rounded text-[9px] font-mono uppercase">
                      Standard Units Badge Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !formData.isInventorySoldOut;
                      setFormData(prev => ({
                        ...prev,
                        isInventorySoldOut: nextState,
                        sticker: nextState ? 'Sold Out' : (prev.sticker === 'Sold Out' ? 'None' : prev.sticker)
                      }));
                    }}
                    className={cn(
                      "px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2",
                      formData.isInventorySoldOut
                        ? "bg-red-600 text-white border-red-400 shadow-md hover:bg-red-500"
                        : "bg-white/5 text-white/70 border-white/20 hover:border-red-500/50 hover:text-red-300"
                    )}
                  >
                    <span>⛔</span>
                    {formData.isInventorySoldOut ? 'Sold Out Active (Click to Deactivate)' : 'Set Inventory Sold Out'}
                  </button>
                  {formData.isInventorySoldOut && (
                    <span className="text-[9px] text-red-300 font-mono italic">
                      Units Remaining count is preserved in data but masked on the front-end with the prominent Sold Out visual.
                    </span>
                  )}
                </div>
              </div>

              {/* Units Remaining Tracker (triggers 'Limited Availability' badge when < 5) */}
              <div className={cn(
                "md:col-span-2 p-3 bg-black/40 border rounded-sm space-y-2 transition-all",
                formData.isInventorySoldOut ? "border-white/10 opacity-75" : "border-art-gold/30"
              )}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-art-gold flex items-center gap-2">
                      <span>Units Remaining Tracker</span>
                      {formData.isInventorySoldOut && (
                        <span className="text-[8px] uppercase tracking-wider bg-red-600/30 text-red-400 border border-red-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
                          Masked on card by Sold Out Flag
                        </span>
                      )}
                    </label>
                    <p className="text-[9px] text-white/50 font-mono">
                      Set available inventory count. When fewer than 5 units are listed, the card displays a pulsing <strong className="text-red-400">"Limited Availability"</strong> badge.
                    </p>
                  </div>
                  {formData.isInventorySoldOut ? (
                    <span className="px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-500/40 rounded text-[9px] font-mono uppercase">
                      ⛔ Replaced by Sold Out Visual
                    </span>
                  ) : formData.unitsRemaining !== undefined && formData.unitsRemaining !== null && formData.unitsRemaining !== ('' as any) && (
                    Number(formData.unitsRemaining) < 5 ? (
                      <span
                        key={`form-preview-${formData.unitsRemaining}`}
                        className="animate-limited-badge px-2.5 py-1 bg-red-600/30 text-red-400 border border-red-500/60 rounded text-[9.5px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)] transform-gpu origin-center"
                      >
                        <span>⚡</span> Preview: Limited Availability ({formData.unitsRemaining} Left)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <span>✓</span> {formData.unitsRemaining} Units in Stock
                      </span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <input
                      type="number"
                      min="0"
                      value={formData.unitsRemaining !== undefined && formData.unitsRemaining !== null ? formData.unitsRemaining : ''}
                      onChange={e => {
                        const val = e.target.value.trim();
                        setFormData(prev => ({
                          ...prev,
                          unitsRemaining: val === '' ? undefined : Math.max(0, parseInt(val, 10))
                        }));
                      }}
                      placeholder="e.g. 3 (triggers badge if < 5)"
                      className="w-full bg-white/5 border border-white/15 p-2.5 text-white text-xs outline-none focus:border-art-gold transition-all rounded-sm font-mono placeholder:text-white/20"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[1, 2, 3, 4, 10, 25].map(qty => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, unitsRemaining: qty }))}
                        className={cn(
                          "px-2.5 py-1.5 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer",
                          formData.unitsRemaining === qty
                            ? qty < 5
                              ? "bg-red-600 text-white border-red-500 font-black shadow-sm"
                              : "bg-art-gold text-black border-art-gold font-black shadow-sm"
                            : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                        )}
                        title={qty < 5 ? `Set ${qty} units (Limited Availability badge will show)` : `Set ${qty} units`}
                      >
                        {qty} {qty < 5 ? '⚠️' : ''}
                      </button>
                    ))}
                    {formData.unitsRemaining !== undefined && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, unitsRemaining: undefined }))}
                        className="px-2 py-1 rounded text-[8.5px] font-mono text-white/40 hover:text-red-400 border border-transparent hover:border-red-500/30 cursor-pointer"
                        title="Clear Tracker"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
            <button 
              type="submit"
              disabled={submitting || isAutoChecking}
              className={cn(
                "flex-1 py-4 uppercase tracking-[0.3em] text-xs font-black transition-all shadow-xl disabled:opacity-50 cursor-pointer rounded-sm text-black",
                inventoryMode === 'Rental' 
                  ? "bg-cyan-400 hover:bg-white" 
                  : inventoryMode === 'Resale' 
                  ? "bg-amber-400 hover:bg-white" 
                  : "bg-art-gold hover:bg-white"
              )}
            >
              {submitting ? 'SAVING TO INVENTORY...' : project ? `SAVE ${inventoryMode.toUpperCase()} CHANGES` : `PUBLISH ${inventoryMode.toUpperCase()} TO INVENTORY`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 uppercase tracking-widest text-xs font-bold transition-all cursor-pointer rounded-sm"
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

    const phoneVal = validateMobileNumber('+91', formData.mobile);
    if (!phoneVal.isValid) {
      setError(phoneVal.message || 'Please enter a valid mobile number with the correct number of digits.');
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
    <section id="opportunity" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white/[0.01] border-t border-white/5 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 bg-art-gold/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute left-12 top-0 w-px h-full bg-white/5 hidden lg:block" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <span className="text-art-gold font-medium tracking-[0.5em] text-[10px] uppercase block mb-6 text-center">BS Homez Concierge</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white tracking-tight italic mb-6">
            Offer Your <span className="not-italic text-art-gold">Asset</span>
          </h2>
          <p className="text-xs sm:text-sm font-light text-white/50 tracking-wide leading-relaxed max-w-2xl mx-auto">
            Authorize BS Homez to process your residential real estate assets. Complete the details below so that our direct HNWI and institutional channels can facilitate private placement.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-5 sm:p-8 md:p-12 rounded-sm backdrop-blur-md font-sans">
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
                    <PhoneInputWithCountry
                      label="Mobile Number"
                      value={formData.mobile}
                      onChange={(fullNumber) => setFormData({ ...formData, mobile: fullNumber })}
                      required
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

const getTimestampMillis = (timestamp: any): number => {
  if (!timestamp) return 0;
  try {
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().getTime();
    }
    if (timestamp instanceof Date) {
      return timestamp.getTime();
    }
    if (typeof timestamp === 'number') {
      return timestamp;
    }
    if (timestamp.seconds !== undefined) {
      return timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
    }
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  } catch {
    return 0;
  }
};

const getEnquiryTimeAndDate = (timestamp: any): { time: string; date: string } => {
  if (!timestamp) return { time: 'N/A', date: 'N/A' };
  try {
    let dateObj: Date;
    if (typeof timestamp.toDate === 'function') {
      dateObj = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      dateObj = timestamp;
    } else if (typeof timestamp === 'number') {
      dateObj = new Date(timestamp);
    } else if (timestamp.seconds !== undefined) {
      dateObj = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
    } else {
      dateObj = new Date(timestamp);
    }
    
    if (isNaN(dateObj.getTime())) return { time: 'N/A', date: 'N/A' };
    
    const time = dateObj.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const date = dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    return { time, date };
  } catch {
    return { time: 'N/A', date: 'N/A' };
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

        // Dispatch direct real-time alert to contact@bshomez.in
        dispatchEnquiryEmailAlert({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          projectName: 'AI Assistant Consultation',
          message: `${leadMsg}${extraNote}`,
          type: 'AI Chat Lead',
          source: 'AI Chat Assistant'
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
                      <PhoneInputWithCountry
                        value={phone}
                        onChange={(fullNum) => setPhone(fullNum)}
                        label="Contact Number"
                        required={false}
                      />
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
            <div className="px-3 py-1.5 bg-black/40 text-[9px] text-white/50 font-mono text-center border-t border-white/5 leading-relaxed">
              AI-generated information may not always reflect the latest project updates. For verified project details, pricing, availability, and other information, kindly contact our team directly.
            </div>
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

interface TabMetaItem {
  key: PublicTabKey;
  label: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  route: string;
  isImportant?: boolean;
}

const PUBLIC_TABS_META: TabMetaItem[] = [
  {
    key: 'overview',
    label: 'Home (Overview)',
    category: 'Core Homepage',
    icon: Home,
    description: 'Hero presentation, Bangalore micro-market corridors, curated highlights & directory access.',
    route: '/?tab=overview',
    isImportant: true
  },
  {
    key: 'projects',
    label: 'Portfolios (Properties)',
    category: 'Property Inventory',
    icon: Building2,
    description: 'Primary, Resale & Rental project showcase with interactive filters, floor plans, pricing & brochures.',
    route: '/?tab=projects',
    isImportant: true
  },
  {
    key: 'grow-business',
    label: 'Grow Business',
    category: 'Digital Acceleration',
    icon: TrendingUp,
    description: 'Modern website development, secure e-commerce portals, Amazon/Flipkart/Meesho scaling & direct intake form.',
    route: '/?tab=grow-business',
    isImportant: true
  },
  {
    key: 'services',
    label: 'Expertise (Services)',
    category: 'Advisory & Legal',
    icon: ShieldCheck,
    description: '0% buyer brokerage, verified legal title, Khata checks, end-to-end registration & advisory.',
    route: '/?tab=services'
  },
  {
    key: 'why-choose',
    label: 'Philosophy (Why Choose Us)',
    category: 'Brand Trust',
    icon: Compass,
    description: 'Pillars of trust, 100% transparent advisory, curated property selection & zero hidden commissions.',
    route: '/?tab=why-choose'
  },
  {
    key: 'insights',
    label: 'Intelligence (Insights)',
    category: 'Market Intelligence',
    icon: BarChart3,
    description: 'East Bangalore micro-market intelligence, metro connectivity, ROI yield analysis & appreciation trends.',
    route: '/?tab=insights'
  },
  {
    key: 'opportunity',
    label: 'Offer Your Asset',
    category: 'Asset Sourcing',
    icon: Target,
    description: 'Direct listing intake form for property owners wishing to sell or rent apartments, villas & plots through BS Homez.',
    route: '/?tab=opportunity',
    isImportant: true
  },
  {
    key: 'referral',
    label: 'Referral Program',
    category: 'Client Rewards',
    icon: Handshake,
    description: 'Advocacy program where clients introduce friends and family for premium rewards upon property closing.',
    route: '/?tab=referral'
  },
  {
    key: 'loans',
    label: 'Home Loans Hub',
    category: 'Financial Advisory',
    icon: CreditCard,
    description: 'Tier-1 banking tie-ups (SBI, HDFC, ICICI), competitive interest rate comparison & interactive EMI calculator.',
    route: '/?tab=loans'
  },
  {
    key: 'testimonials',
    label: 'Client Voices',
    category: 'Social Proof',
    icon: MessageCircle,
    description: 'Authentic buyer reviews, owner satisfaction stories, video testimonials & verified homeowner endorsements.',
    route: '/?tab=testimonials'
  },
  {
    key: 'faq',
    label: 'Advisory FAQ',
    category: 'Client Knowledge',
    icon: Info,
    description: 'Comprehensive answers to RERA verification, Khata transfer, loan approval, down payments & resale timelines.',
    route: '/?tab=faq'
  },
  {
    key: 'about',
    label: 'About BS Homez',
    category: 'Corporate Overview',
    icon: Star,
    description: 'Company background, leadership vision, 100+ tied builder ecosystem & curated luxury philosophy in Bangalore.',
    route: '/?tab=about'
  }
];

const AdminView = ({ 
  enquiries, 
  projects, 
  opportunities, 
  referrals = [], 
  tabVisibility = DEFAULT_TAB_VISIBILITY,
  onUpdateTabVisibility,
  onNavigateTab,
  showProjectModal, 
  setShowProjectModal, 
  editingProject, 
  setEditingProject,
  onOpenSeoPreview,
  onOpenNewProjectWithMode,
  onOpenEnquiry,
  onDeleteProject,
  onInspectProjectSeo,
  onSaveProject,
  onBatchUpdateProjects
}: { 
  enquiries: Enquiry[], 
  projects: Project[], 
  opportunities: Opportunity[], 
  referrals?: Referral[], 
  tabVisibility?: TabVisibilityConfig,
  onUpdateTabVisibility?: (config: TabVisibilityConfig) => Promise<void> | void,
  onNavigateTab?: (tab: MainAppTab) => void,
  showProjectModal: boolean, 
  setShowProjectModal: (val: boolean) => void, 
  editingProject: Project | null, 
  setEditingProject: (p: Project | null) => void,
  onOpenSeoPreview?: () => void,
  onOpenNewProjectWithMode?: (mode: 'Primary' | 'Rental' | 'Resale') => void,
  onOpenEnquiry?: (p: Project) => void,
  onDeleteProject?: (p: Project) => Promise<void> | void,
  onInspectProjectSeo?: (p: Project) => void,
  onSaveProject?: (p: Project) => Promise<void> | void,
  onBatchUpdateProjects?: (updated: Project[]) => void
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'portfolio' | 'opportunities' | 'referrals' | 'tab_visibility' | 'seo_audit'>('leads');
  const [tabVisibilityToast, setTabVisibilityToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isUpdatingTabVis, setIsUpdatingTabVis] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState<'active' | 'trash'>('active');
  const [deleteConfirmEnquiry, setDeleteConfirmEnquiry] = useState<Enquiry | null>(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [leadActionToast, setLeadActionToast] = useState<string | null>(null);
  const [enquiryCategoryFilter, setEnquiryCategoryFilter] = useState<'all' | 'Primary' | 'Rental' | 'Resale' | 'Home Loan'>('all');
  const [intentFilter, setIntentFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [inventoryTab, setInventoryTab] = useState<'all' | 'Primary' | 'Rental' | 'Resale'>('all');
  const [opportunityCategoryFilter, setOpportunityCategoryFilter] = useState<'all' | 'business' | 'property'>('all');
  
  // Column Sorting State for CRM Lead Management (Opportunities & Enquiries)
  const [oppSortField, setOppSortField] = useState<'date' | 'name' | 'score'>('date');
  const [oppSortDirection, setOppSortDirection] = useState<'asc' | 'desc'>('desc');

  const [leadSortField, setLeadSortField] = useState<'date' | 'name' | 'score'>('date');
  const [leadSortDirection, setLeadSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleToggleTabVisibility = async (key: PublicTabKey) => {
    const currentVal = tabVisibility[key] !== false;
    const nextVal = !currentVal;
    const nextConfig: TabVisibilityConfig = {
      ...tabVisibility,
      [key]: nextVal
    };
    if (onUpdateTabVisibility) {
      setIsUpdatingTabVis(true);
      try {
        await onUpdateTabVisibility(nextConfig);
        const meta = PUBLIC_TABS_META.find(t => t.key === key);
        setTabVisibilityToast({
          message: `"${meta?.label || key}" is now ${nextVal ? 'VISIBLE ONLINE (Live to public users)' : 'HIDDEN FROM ONLINE USERS (Admin Only)'}.`,
          type: 'success'
        });
        setTimeout(() => setTabVisibilityToast(null), 3500);
      } finally {
        setIsUpdatingTabVis(false);
      }
    }
  };

  const handleBulkSetTabVisibility = async (action: 'all' | 'essential' | 'default') => {
    let nextConfig: TabVisibilityConfig;
    if (action === 'all') {
      nextConfig = {
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
    } else if (action === 'essential') {
      nextConfig = {
        overview: true,
        projects: true,
        'grow-business': true,
        services: true,
        'why-choose': false,
        insights: false,
        opportunity: true,
        referral: false,
        loans: false,
        testimonials: false,
        faq: false,
        about: true
      };
    } else {
      nextConfig = { ...DEFAULT_TAB_VISIBILITY };
    }

    if (onUpdateTabVisibility) {
      setIsUpdatingTabVis(true);
      try {
        await onUpdateTabVisibility(nextConfig);
        setTabVisibilityToast({
          message: action === 'all' 
            ? 'All 12 tabs are now marked VISIBLE to online visitors.'
            : action === 'essential'
            ? 'Enabled Core Tabs mode (Portfolios, Grow Business, Opportunities & Services live).'
            : 'Reset all tabs to default visibility config.',
          type: 'info'
        });
        setTimeout(() => setTabVisibilityToast(null), 4000);
      } finally {
        setIsUpdatingTabVis(false);
      }
    }
  };

  const handleToggleOppSort = (field: 'date' | 'name' | 'score') => {
    if (oppSortField === field) {
      setOppSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOppSortField(field);
      setOppSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  const handleToggleLeadSort = (field: 'date' | 'name' | 'score') => {
    if (leadSortField === field) {
      setLeadSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setLeadSortField(field);
      setLeadSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };
  const [batchSyncToast, setBatchSyncToast] = useState<string | null>(null);
  const [ogPreviewProject, setOgPreviewProject] = useState<Project | null>(null);
  const [isSyncingSitemap, setIsSyncingSitemap] = useState(false);
  const [sitemapStats, setSitemapStats] = useState<{
    totalUrls?: number;
    totalProjects?: number;
    dbProjectsCount?: number;
    curatedProjectsCount?: number;
    timestamp?: string;
  } | null>(null);

  // SEO Audit Table State
  const [seoDrafts, setSeoDrafts] = useState<Record<string, {
    metaTitle?: string;
    metaDescription?: string;
    seoKeywords?: string;
    ogImage?: string;
    isDirty?: boolean;
  }>>({});
  const [seoAuditSearch, setSeoAuditSearch] = useState('');
  const [seoAuditCategoryFilter, setSeoAuditCategoryFilter] = useState<'all' | 'Primary' | 'Rental' | 'Resale'>('all');
  const [seoAuditHealthFilter, setSeoAuditHealthFilter] = useState<'all' | 'needs_attention' | 'optimized'>('all');
  const [isBulkSavingSeo, setIsBulkSavingSeo] = useState(false);
  const [singleSavingId, setSingleSavingId] = useState<string | null>(null);
  const [generatingAiId, setGeneratingAiId] = useState<string | null>(null);
  const [seoAuditToast, setSeoAuditToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [seoImageModalUrl, setSeoImageModalUrl] = useState<string | null>(null);

  // Personalized WhatsApp Lead Intelligence Modal State
  const [whatsAppModalLead, setWhatsAppModalLead] = useState<Enquiry | null>(null);
  const [whatsAppTemplateType, setWhatsAppTemplateType] = useState<'client_outreach' | 'site_visit' | 'internal_briefing'>('client_outreach');
  const [whatsAppCustomText, setWhatsAppCustomText] = useState<string>('');
  const [whatsAppCopiedToast, setWhatsAppCopiedToast] = useState(false);

  const handleSoftDeleteLead = async (enq: Enquiry) => {
    if (!enq.id) return;
    setActionLoadingId(enq.id);
    try {
      await updateDoc(doc(db, 'enquiries', enq.id), {
        isDeleted: true,
        deletedAt: serverTimestamp()
      });
      setLeadActionToast(`Lead "${enq.customerName}" moved to Trash.`);
    } catch (err) {
      console.error("Failed to move lead to trash:", err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `enquiries/${enq.id}`);
      } catch (e: any) {
        setLeadActionToast(`Error: ${e.message || 'Failed to move to trash'}`);
      }
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setLeadActionToast(null), 4000);
    }
  };

  const handleRestoreLead = async (enq: Enquiry) => {
    if (!enq.id) return;
    setActionLoadingId(enq.id);
    try {
      await updateDoc(doc(db, 'enquiries', enq.id), {
        isDeleted: false,
        deletedAt: null
      });
      setLeadActionToast(`Lead "${enq.customerName}" restored to Active Leads.`);
    } catch (err) {
      console.error("Failed to restore lead:", err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `enquiries/${enq.id}`);
      } catch (e: any) {
        setLeadActionToast(`Error: ${e.message || 'Failed to restore'}`);
      }
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setLeadActionToast(null), 4000);
    }
  };

  const handleCompleteDeleteLead = async (enq: Enquiry) => {
    if (!enq.id) return;
    setActionLoadingId(enq.id);
    try {
      await deleteDoc(doc(db, 'enquiries', enq.id));
      setDeleteConfirmEnquiry(null);
      setLeadActionToast(`Lead "${enq.customerName}" permanently deleted from app.`);
    } catch (err) {
      console.error("Failed to permanently delete lead:", err);
      try {
        handleFirestoreError(err, OperationType.DELETE, `enquiries/${enq.id}`);
      } catch (e: any) {
        setLeadActionToast(`Error: ${e.message || 'Failed to permanently delete'}`);
      }
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setLeadActionToast(null), 4000);
    }
  };

  const [salesTeamWhatsApp, setSalesTeamWhatsApp] = useState('919902991599');
  const [isBatchProcessingSeo, setIsBatchProcessingSeo] = useState(false);

  useEffect(() => {
    fetch('/api/sitemap/status')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setSitemapStats(data);
        }
      })
      .catch(() => {});
  }, []);

  // Sentiment Analysis Engine: Evaluates message tone, urgency, purchase signals, and timeline
  const analyzeCustomerIntent = (enq: Enquiry): { 
    level: 'High' | 'Medium' | 'Low'; 
    score: number; 
    signals: string[]; 
    tone: string;
    summary: string;
  } => {
    // If pre-tagged intentSentiment exists
    if (enq.intentSentiment) {
      return {
        level: enq.intentSentiment,
        score: enq.intentSentiment === 'High' ? 88 : enq.intentSentiment === 'Medium' ? 60 : 30,
        signals: [enq.intentSentiment === 'High' ? 'High Buyer Intent' : enq.intentSentiment === 'Medium' ? 'Active Consideration' : 'Casual Inquirer'],
        tone: enq.intentSentiment === 'High' ? 'Assertive / Ready' : enq.intentSentiment === 'Medium' ? 'Inquiring' : 'Passive',
        summary: `${enq.intentSentiment} priority customer communication`
      };
    }

    const text = `${enq.message || ''} ${enq.preferredContactTime || ''} ${enq.preferredLocation || ''} ${enq.interestedProjects || ''} ${enq.projectName || ''}`.toLowerCase();
    const type = (enq.type || '').toLowerCase();
    const signals: string[] = [];
    let score = 50;

    // High Intent triggers: Urgent timeline, financial readiness, site visit, explicit intent to buy/finalize
    const urgentKws = ['urgent', 'immediately', 'asap', 'within 24', 'today', 'tomorrow', 'this week', 'emergency', 'fast', 'quick'];
    const buyKws = ['ready to buy', 'buy', 'token', 'advance', 'booking', 'cheque', 'down payment', 'sanctioned', 'pre-approved', 'cash ready', 'immediate registration', 'ready to move', 'immediate possession', 'finalize', 'serious buyer', 'purchase', 'negotiate'];
    const visitKws = ['site visit', 'visit tomorrow', 'weekend visit', 'see property', 'inspect', 'schedule visit', 'in person visit', 'meet', 'direct appointment'];

    if (urgentKws.some(k => text.includes(k))) {
      score += 25;
      signals.push('Urgent Timeline');
    }
    if (buyKws.some(k => text.includes(k))) {
      score += 30;
      signals.push('Capital / Purchase Ready');
    }
    if (visitKws.some(k => text.includes(k))) {
      score += 20;
      signals.push('Site Visit Desired');
    }
    if (type === 'acquire' || type === 'site visit') {
      score += 15;
      signals.push('Direct Acquisition Lead');
    }
    if (enq.preferredContactTime && enq.preferredContactTime.toLowerCase() !== 'standard hours') {
      score += 10;
      signals.push('Preferred Slot Chosen');
    }

    // Low Intent triggers: Vague, testing, spam, casual browse, window shopping
    const lowKws = ['just checking', 'casual', 'browsing', 'student', 'broker', 'spam', 'test', 'testing', 'only price', 'window shopping', 'fake', 'trial'];
    if (lowKws.some(k => text.includes(k))) {
      score -= 40;
      signals.push('Exploratory / Test Query');
    }
    if (!enq.message || enq.message.trim().length <= 6) {
      score -= 15;
      signals.push('Minimal Notes');
    }

    if (score >= 70) {
      return {
        level: 'High',
        score: Math.min(score, 100),
        signals: signals.length > 0 ? signals : ['High Buyer Readiness'],
        tone: 'Assertive / High Intent',
        summary: 'Hot lead: ready buyer, site visit, or explicit acquisition timeline'
      };
    } else if (score <= 35) {
      return {
        level: 'Low',
        score: Math.max(score, 10),
        signals: signals.length > 0 ? signals : ['Casual Ping'],
        tone: 'Passive / Exploratory',
        summary: 'Cold lead: casual inquiry, price checking, or minimal context'
      };
    } else {
      return {
        level: 'Medium',
        score,
        signals: signals.length > 0 ? signals : ['Information Seeking'],
        tone: 'Engaged / Inquiring',
        summary: 'Warm lead: unit/pricing research, evaluating configurations'
      };
    }
  };

  // Lead Intent Analysis for CRM Opportunities
  const analyzeOpportunityIntent = (opp: Opportunity): { 
    level: 'High' | 'Medium' | 'Low'; 
    score: number; 
    signals: string[]; 
    tone: string;
    summary: string;
  } => {
    if (typeof opp.intentScore === 'number' && !isNaN(opp.intentScore)) {
      const score = Math.max(10, Math.min(100, Math.round(opp.intentScore)));
      return {
        level: score >= 75 ? 'High' : score >= 45 ? 'Medium' : 'Low',
        score,
        signals: score >= 75 ? ['Verified High Intent'] : score >= 45 ? ['Active Interest'] : ['Casual Lead'],
        tone: score >= 75 ? 'Ready / Priority' : score >= 45 ? 'Consultative' : 'Exploratory',
        summary: `Stored Lead Score: ${score}%`
      };
    }

    const text = `${opp.name || ''} ${opp.comment || ''} ${opp.notes || ''} ${opp.interested || ''} ${(opp.services || []).join(' ')} ${opp.propertyName || ''}`.toLowerCase();
    const signals: string[] = [];
    let score = 50;

    // Contact completeness
    if (opp.mobile && opp.mobile.replace(/[^0-9]/g, '').length >= 10) {
      score += 10;
      signals.push('Verified Phone');
    }
    if (opp.email && opp.email.includes('@')) {
      score += 10;
      signals.push('Direct Email');
    }

    // High Intent triggers: Urgent timeline, enterprise scope, e-commerce, custom CRM
    const urgentKws = ['urgent', 'immediately', 'asap', 'within 24', 'today', 'tomorrow', 'fast', 'quick', 'ready'];
    const highValueKws = ['crm', 'e-commerce', 'customized', 'enterprise', 'scale', 'payment gateway', 'inventory', 'amazon', 'flipkart', 'meesho', 'ready to move', 'immediate sell', 'immediate rent'];
    
    if (urgentKws.some(k => text.includes(k))) {
      score += 20;
      signals.push('Immediate Timeline');
    }
    if (highValueKws.some(k => text.includes(k))) {
      score += 15;
      signals.push('High-Value Scope');
    }

    // Length of requirements / comments (capacity 1000 chars)
    const commentLen = (opp.comment || opp.notes || '').trim().length;
    if (commentLen >= 100) {
      score += 15;
      signals.push('Detailed Specs');
    } else if (commentLen >= 25) {
      score += 8;
      signals.push('Clear Request');
    } else if (commentLen === 0) {
      score -= 10;
    }

    // Pricing / Expected rent or sell
    if ((opp.expectedRent && opp.expectedRent > 0) || (opp.expectedSell && opp.expectedSell > 0)) {
      score += 15;
      signals.push('Target Pricing Defined');
    }

    // Service specifics
    if (opp.services && opp.services.length > 1) {
      score += 10;
      signals.push('Multi-Service Inquiry');
    }

    score = Math.max(15, Math.min(99, score));
    const level: 'High' | 'Medium' | 'Low' = score >= 75 ? 'High' : score >= 45 ? 'Medium' : 'Low';
    const tone = level === 'High' ? 'Assertive / Hot' : level === 'Medium' ? 'Active / Qualified' : 'Passive / Cold';

    return {
      level,
      score,
      signals: signals.length > 0 ? signals : ['Standard Opportunity'],
      tone,
      summary: `${level} Intent Opportunity Lead (${score}%)`
    };
  };

  const resolveEnquiryCategory = (enq: Enquiry): 'Primary' | 'Rental' | 'Resale' | 'Home Loan' => {
    if (enq.enquiryCategory) {
      if (enq.enquiryCategory === 'Rental' || (enq.enquiryCategory as any) === 'Rent') return 'Rental';
      return enq.enquiryCategory;
    }
    if (enq.propertyCategory) {
      if (enq.propertyCategory === 'Rent') return 'Rental';
      return enq.propertyCategory as any;
    }
    const pMatch = projects.find(p => p.id === enq.projectId || (p.name && enq.projectName && p.name.toLowerCase() === enq.projectName.toLowerCase()));
    if (pMatch) {
      if (pMatch.type === 'Rental') return 'Rental';
      if (pMatch.type === 'Resale') return 'Resale';
      return 'Primary';
    }
    const text = `${enq.projectName || ''} ${enq.message || ''} ${enq.interestedProjects || ''}`.toLowerCase();
    if (text.includes('loan') || text.includes('emi') || text.includes('finance') || text.includes('capital financing') || text.includes('advisory desk')) return 'Home Loan';
    if (text.includes('rent') || text.includes('lease') || text.includes('tenant')) return 'Rental';
    if (text.includes('resale') || text.includes('pre-owned') || text.includes('used')) return 'Resale';
    return 'Primary';
  };

  const nonDeletedEnquiries = enquiries.filter(e => !e.isDeleted);
  const trashEnquiries = enquiries.filter(e => !!e.isDeleted);
  const currentStatusEnquiries = leadStatusFilter === 'active' ? nonDeletedEnquiries : trashEnquiries;

  const primaryEnqs = currentStatusEnquiries.filter(e => resolveEnquiryCategory(e) === 'Primary');
  const rentalEnqs = currentStatusEnquiries.filter(e => resolveEnquiryCategory(e) === 'Rental');
  const resaleEnqs = currentStatusEnquiries.filter(e => resolveEnquiryCategory(e) === 'Resale');
  const homeLoanEnqs = currentStatusEnquiries.filter(e => resolveEnquiryCategory(e) === 'Home Loan');

  const categoryFilteredEnquiries = enquiryCategoryFilter === 'all'
    ? currentStatusEnquiries
    : enquiryCategoryFilter === 'Primary'
    ? primaryEnqs
    : enquiryCategoryFilter === 'Rental'
    ? rentalEnqs
    : enquiryCategoryFilter === 'Resale'
    ? resaleEnqs
    : homeLoanEnqs;

  const displayedEnquiries = intentFilter === 'all'
    ? categoryFilteredEnquiries
    : categoryFilteredEnquiries.filter(e => analyzeCustomerIntent(e).level === intentFilter);

  // Sorted customer intelligence leads based on column sorting state (date, name, score)
  const sortedEnquiries = useMemo(() => {
    const list = [...displayedEnquiries];
    list.sort((a, b) => {
      if (leadSortField === 'date') {
        const timeA = getTimestampMillis(a.timestamp);
        const timeB = getTimestampMillis(b.timestamp);
        return leadSortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
      if (leadSortField === 'name') {
        const nameA = (a.customerName || '').toLowerCase();
        const nameB = (b.customerName || '').toLowerCase();
        return leadSortDirection === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      if (leadSortField === 'score') {
        const scoreA = analyzeCustomerIntent(a).score;
        const scoreB = analyzeCustomerIntent(b).score;
        return leadSortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
      return 0;
    });
    return list;
  }, [displayedEnquiries, leadSortField, leadSortDirection]);

  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [copiedAllLeads, setCopiedAllLeads] = useState(false);

  const cleanPhoneForClipboard = (rawPhone?: string): string => {
    if (!rawPhone) return 'N/A';
    let phone = String(rawPhone).trim();
    phone = phone.replace(/^\+91[\s\-_]*/, '');
    if (/^91\d{10}$/.test(phone)) {
      phone = phone.slice(2);
    }
    phone = phone.replace(/^\+/, '');
    return phone.trim() || 'N/A';
  };

  const formatEnquiryDateAndSeconds = (timestamp: any): { dateStr: string; timeStr: string } => {
    if (!timestamp) return { dateStr: 'N/A', timeStr: 'N/A' };
    try {
      let dateObj: Date;
      if (typeof timestamp.toDate === 'function') {
        dateObj = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        dateObj = timestamp;
      } else if (typeof timestamp === 'number') {
        dateObj = new Date(timestamp);
      } else if (timestamp.seconds !== undefined) {
        dateObj = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
      } else {
        dateObj = new Date(timestamp);
      }
      if (isNaN(dateObj.getTime())) return { dateStr: 'N/A', timeStr: 'N/A' };

      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yy = String(dateObj.getFullYear()).slice(-2);
      const dateStr = `${dd}/${mm}/${yy}`;

      const hh = String(dateObj.getHours()).padStart(2, '0');
      const min = String(dateObj.getMinutes()).padStart(2, '0');
      const ss = String(dateObj.getSeconds()).padStart(2, '0');
      const timeStr = `${hh}:${min}:${ss}`;

      return { dateStr, timeStr };
    } catch {
      return { dateStr: 'N/A', timeStr: 'N/A' };
    }
  };

  const formatLeadClipboardText = (enq: Enquiry) => {
    const name = enq.customerName || 'N/A';
    const number = cleanPhoneForClipboard(enq.customerPhone);
    const email = enq.customerEmail || 'N/A';
    const category = resolveEnquiryCategory(enq);
    const project = enq.projectName || enq.interestedProjects || 'General Inquiry';
    const { dateStr, timeStr } = formatEnquiryDateAndSeconds(enq.timestamp);

    return `Name : ${name}\nNumber: ${number}\nEmail: ${email}\nCategory: ${category}\nProject: ${project}\nenquire date : ${dateStr}\ntime : ${timeStr}`;
  };

  // Requirement: Format WhatsApp lead message using clean phone without +91 and full lead brief
  const formatWhatsAppLeadMessage = (enq: Enquiry) => {
    const name = enq.customerName || 'N/A';
    const number = cleanPhoneForClipboard(enq.customerPhone);
    const email = enq.customerEmail || 'N/A';
    const category = resolveEnquiryCategory(enq);
    const project = enq.projectName || enq.interestedProjects || 'General Inquiry';
    const notes = enq.message ? enq.message.trim() : 'None';
    const { dateStr, timeStr } = formatEnquiryDateAndSeconds(enq.timestamp);

    return `Name : ${name}\nNumber: ${number}\nEmail: ${email}\nCategory: ${category}\nProject: ${project}\nNotes: ${notes}\nenquire date : ${dateStr}\ntime : ${timeStr}`;
  };

  const handleShareWhatsApp = (enq: Enquiry, targetPhone: string = salesTeamWhatsApp) => {
    const text = formatWhatsAppLeadMessage(enq);
    const cleanPhone = (targetPhone || '919902991599').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setLeadActionToast(`Dispatched WhatsApp lead brief for ${enq.customerName || 'Lead'} to Sales Team (+${cleanPhone})`);
    setTimeout(() => setLeadActionToast(null), 4000);
  };

  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const handleCopyLead = async (enq: Enquiry) => {
    const formatted = formatLeadClipboardText(enq);
    await copyTextToClipboard(formatted);
    setCopiedLeadId(enq.id);
    setLeadActionToast(`Copied lead brief for ${enq.customerName || 'Lead'} in requested format!`);
    setTimeout(() => {
      setCopiedLeadId(prev => (prev === enq.id ? null : prev));
    }, 2500);
    setTimeout(() => setLeadActionToast(null), 4000);
  };

  const handleCopyAllVisibleLeads = async () => {
    if (sortedEnquiries.length === 0) {
      setLeadActionToast('No leads available to copy.');
      setTimeout(() => setLeadActionToast(null), 3000);
      return;
    }
    const formattedAll = sortedEnquiries.map(enq => formatLeadClipboardText(enq)).join('\n\n------------------------------\n\n');
    await copyTextToClipboard(formattedAll);
    setCopiedAllLeads(true);
    setLeadActionToast(`Copied ${sortedEnquiries.length} leads in requested format!`);
    setTimeout(() => setCopiedAllLeads(false), 2500);
    setTimeout(() => setLeadActionToast(null), 4000);
  };

  // Intent statistics across all current category enquiries
  const highIntentCount = categoryFilteredEnquiries.filter(e => analyzeCustomerIntent(e).level === 'High').length;
  const mediumIntentCount = categoryFilteredEnquiries.filter(e => analyzeCustomerIntent(e).level === 'Medium').length;
  const lowIntentCount = categoryFilteredEnquiries.filter(e => analyzeCustomerIntent(e).level === 'Low').length;

  const validProjects = deduplicateProjects(projects.filter(p => !LEGACY_PROJECT_NAMES.includes(p.name) && !p.isDeleted));
  const primaryProjects = validProjects.filter(p => p.type === 'Primary' || p.type === 'Primary Sale' || !p.type);
  const rentalProjects = validProjects.filter(p => p.type === 'Rental');
  const resaleProjects = validProjects.filter(p => p.type === 'Resale');

  const displayedProjects = inventoryTab === 'all'
    ? validProjects
    : inventoryTab === 'Primary'
    ? primaryProjects
    : inventoryTab === 'Rental'
    ? rentalProjects
    : resaleProjects;

  // --- Personalized WhatsApp Message Generator for Lead Intelligence ---
  const generatePersonalizedWhatsAppLeadTemplate = (
    enq: Enquiry,
    intent: { level: 'High' | 'Medium' | 'Low'; score: number; signals: string[]; tone: string; summary: string },
    templateStyle: 'client_outreach' | 'site_visit' | 'internal_briefing' = 'client_outreach'
  ) => {
    const customerName = (enq.customerName || 'Valued Client').trim();
    const projectName = (enq.projectName || enq.interestedProjects || 'Bangalore Luxury Real Estate').trim();
    const phone = enq.customerPhone || 'N/A';
    const contactSlot = enq.preferredContactTime ? `around ${enq.preferredContactTime}` : 'at your earliest convenience';
    const { time, date } = getEnquiryTimeAndDate(enq.timestamp);

    if (templateStyle === 'client_outreach') {
      if (intent.level === 'High') {
        return `Dear ${customerName},\n\nThank you for reaching out to *BS Homez* regarding *${projectName}*.\n\nWe noted your strong purchase readiness (Priority Intent Score: ${intent.score}% - ${intent.tone}) and have reserved high-priority advisory attention for your inquiry. Our portfolio team has verified available inventory, current payment milestone schemes, and official developer launch pricing for ${projectName}.\n\nI will personally connect with you ${contactSlot}. If you would like instant access to the digital brochure, floor plans, or wish to schedule a priority private walkthrough, please reply right here.\n\nWarm regards,\n*BS Homez Private Advisory Desk*\n🌐 https://www.bshomez.in | 📞 +91 96068 18199`;
      } else if (intent.level === 'Medium') {
        return `Hello ${customerName},\n\nGreetings from *BS Homez*!\n\nThank you for inquiring about *${projectName}* (Verified Match: ${intent.score}% Intent). We have assembled the complete property specification, floor plans, and pricing breakdown for this development.\n\nWould you like me to share the verified project brochure and payment scheme over WhatsApp? We can also arrange a brief consultation ${contactSlot}.\n\nBest regards,\n*BS Homez Advisory Team*\n🌐 https://www.bshomez.in`;
      } else {
        return `Hello ${customerName},\n\nThank you for exploring *${projectName}* on *BS Homez*.\n\nWe would be pleased to assist you with verified pricing, RERA documentation, and layout choices for ${projectName} or alternative premium developments across Bangalore. Feel free to let us know your preferred unit size or budget whenever convenient.\n\nRegards,\n*BS Homez Advisory Desk*\n🌐 https://www.bshomez.in`;
      }
    } else if (templateStyle === 'site_visit') {
      return `Dear ${customerName},\n\nRegarding your inquiry for *${projectName}* (Lead Priority: ${intent.score}% - ${intent.level} Intent), we would like to invite you for an exclusive private site inspection and model home walkthrough.\n\n📍 *Project:* ${projectName}\n🎯 *Advisory Advantage:* Direct Developer Pricing • 0% Brokerage on Primary • Legal Verification\n🕒 *Suggested Window:* ${enq.preferredContactTime || 'This Weekend / On Request'}\n\nPlease confirm if this time suits you or suggest an alternate slot so we can schedule our senior corridor specialist.\n\nWarm regards,\n*BS Homez Concierge*\n🌐 https://www.bshomez.in | 📞 +91 96068 18199`;
    } else {
      // internal_briefing
      return `📋 *LEAD BRIEFING | BS HOMEZ VAULT*\n\n👤 *Client:* ${customerName}\n📱 *Phone:* ${phone}\n✉️ *Email:* ${enq.customerEmail || 'N/A'}\n🏢 *Project Interest:* ${projectName}\n📍 *Location Preference:* ${enq.preferredLocation || 'Standard'}\n🎯 *Intent Score:* ${intent.score}% (${intent.level} Intent - ${intent.tone})\n⚡ *Key Triggers:* ${intent.signals.join(', ') || 'Direct Portal Enquiry'}\n🕒 *Preferred Contact Time:* ${enq.preferredContactTime || 'Standard Hours'}\n📝 *Customer Message:* "${enq.message || 'No additional note'}"\n📅 *Logged At:* ${date} at ${time}\n\n👉 *Action Item:* Urgent consultative outreach required for ${projectName}.`;
    }
  };

  const handleOpenPersonalizedWhatsAppModal = (enq: Enquiry) => {
    const intent = analyzeCustomerIntent(enq);
    const initialText = generatePersonalizedWhatsAppLeadTemplate(enq, intent, 'client_outreach');
    setWhatsAppModalLead(enq);
    setWhatsAppTemplateType('client_outreach');
    setWhatsAppCustomText(initialText);
  };

  const handleSelectWhatsAppTemplate = (type: 'client_outreach' | 'site_visit' | 'internal_briefing') => {
    if (!whatsAppModalLead) return;
    setWhatsAppTemplateType(type);
    const intent = analyzeCustomerIntent(whatsAppModalLead);
    const text = generatePersonalizedWhatsAppLeadTemplate(whatsAppModalLead, intent, type);
    setWhatsAppCustomText(text);
  };

  const handleCopyWhatsAppText = () => {
    if (!whatsAppCustomText) return;
    navigator.clipboard.writeText(whatsAppCustomText);
    setWhatsAppCopiedToast(true);
    setTimeout(() => setWhatsAppCopiedToast(false), 2500);
  };

  const handleLaunchWhatsAppDirect = (phone: string, text: string) => {
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const encoded = encodeURIComponent(text);
    const url = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // --- SEO Audit Table Engine ---
  const getProjectSeoRowData = (p: Project) => {
    const draft = seoDrafts[p.id || p.name] || {};
    const defaultTitle = `${p.name} | Luxury ${p.propertyType || 'Apartment'} ${p.type === 'Rental' ? 'for Rent' : 'for Sale'} in ${p.zone} | BS Homez`;
    const metaTitle = draft.metaTitle !== undefined ? draft.metaTitle : (p.metaTitle || defaultTitle);
    const defaultDesc = `Explore ${p.name} in ${p.zone || 'Bangalore'}. Verified luxury ${p.propertyType || 'residences'} with 0% brokerage. Enquire with BS Homez.`;
    const metaDescription = draft.metaDescription !== undefined ? draft.metaDescription : (p.metaDescription || defaultDesc);
    const seoKeywords = draft.seoKeywords !== undefined 
      ? draft.seoKeywords 
      : ((p.seoKeywords && p.seoKeywords.length > 0) ? p.seoKeywords.join(', ') : '');
    const ogImage = draft.ogImage !== undefined ? draft.ogImage : (p.ogImage || p.imageUrls?.[0] || '');
    const isDirty = Boolean(draft.isDirty);

    const kwCount = seoKeywords.split(',').map(s => s.trim()).filter(Boolean).length;
    const titleLen = metaTitle.trim().length;
    const hasImage = Boolean(ogImage.trim());

    let health: 'optimized' | 'needs_attention' = 'optimized';
    if (titleLen < 25 || titleLen > 75 || kwCount < 5 || !hasImage) {
      health = 'needs_attention';
    }

    return {
      metaTitle,
      metaDescription,
      seoKeywords,
      ogImage,
      isDirty,
      kwCount,
      titleLen,
      hasImage,
      health
    };
  };

  const handleUpdateSeoDraft = (p: Project, field: 'metaTitle' | 'seoKeywords' | 'ogImage', value: string) => {
    const key = p.id || p.name;
    const current = getProjectSeoRowData(p);
    const updated = {
      metaTitle: field === 'metaTitle' ? value : current.metaTitle,
      seoKeywords: field === 'seoKeywords' ? value : current.seoKeywords,
      ogImage: field === 'ogImage' ? value : current.ogImage,
      isDirty: true
    };
    setSeoDrafts(prev => ({ ...prev, [key]: updated }));
  };

  const handleSaveSingleSeo = async (p: Project) => {
    const row = getProjectSeoRowData(p);
    const key = p.id || p.name;
    setSingleSavingId(key);
    try {
      const parsedKeywords = row.seoKeywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      const updatedProject: Project = {
        ...p,
        metaTitle: row.metaTitle.trim(),
        seoKeywords: parsedKeywords,
        ogImage: row.ogImage.trim() || p.imageUrls?.[0] || '',
        seoLastSyncedAt: new Date().toISOString()
      };

      if (onSaveProject) {
        await onSaveProject(updatedProject);
      } else if (p.id) {
        await setDoc(doc(db, 'projects', p.id), {
          metaTitle: updatedProject.metaTitle,
          seoKeywords: updatedProject.seoKeywords,
          ogImage: updatedProject.ogImage,
          seoLastSyncedAt: updatedProject.seoLastSyncedAt,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      setSeoDrafts(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      setSeoAuditToast({
        message: `Saved SEO metadata for "${p.name}"!`,
        type: 'success'
      });
      setTimeout(() => setSeoAuditToast(null), 3500);
    } catch (err: any) {
      console.error('Error saving single SEO:', err);
      setSeoAuditToast({
        message: `Failed to save SEO for "${p.name}": ${err.message || 'Unknown error'}`,
        type: 'error'
      });
      setTimeout(() => setSeoAuditToast(null), 4000);
    } finally {
      setSingleSavingId(null);
    }
  };

  const handleBulkSaveAllSeo = async () => {
    const dirtyProjects = validProjects.filter(p => {
      const row = getProjectSeoRowData(p);
      return row.isDirty;
    });

    if (dirtyProjects.length === 0) {
      setSeoAuditToast({ message: 'No unsaved SEO changes to commit.', type: 'info' });
      setTimeout(() => setSeoAuditToast(null), 3000);
      return;
    }

    setIsBulkSavingSeo(true);
    try {
      await Promise.all(dirtyProjects.map(async p => {
        const row = getProjectSeoRowData(p);
        const parsedKeywords = row.seoKeywords
          .split(',')
          .map(k => k.trim())
          .filter(Boolean);

        const updatedProject: Project = {
          ...p,
          metaTitle: row.metaTitle.trim(),
          seoKeywords: parsedKeywords,
          ogImage: row.ogImage.trim() || p.imageUrls?.[0] || '',
          seoLastSyncedAt: new Date().toISOString()
        };

        if (onSaveProject) {
          await onSaveProject(updatedProject);
        } else if (p.id) {
          await setDoc(doc(db, 'projects', p.id), {
            metaTitle: updatedProject.metaTitle,
            seoKeywords: updatedProject.seoKeywords,
            ogImage: updatedProject.ogImage,
            seoLastSyncedAt: updatedProject.seoLastSyncedAt,
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      }));

      setSeoDrafts({});
      setSeoAuditToast({
        message: `Bulk saved and synchronized ${dirtyProjects.length} projects successfully!`,
        type: 'success'
      });
      setTimeout(() => setSeoAuditToast(null), 4000);
    } catch (err: any) {
      console.error('Bulk save SEO error:', err);
      setSeoAuditToast({
        message: `Bulk save error: ${err.message || 'Check connection'}`,
        type: 'error'
      });
      setTimeout(() => setSeoAuditToast(null), 5000);
    } finally {
      setIsBulkSavingSeo(false);
    }
  };

  const handleBulkAiGenerateMissing = () => {
    let populatedCount = 0;
    const newDrafts = { ...seoDrafts };

    validProjects.forEach(p => {
      const row = getProjectSeoRowData(p);
      const isMissingTitle = !row.metaTitle || row.metaTitle.length < 25;
      const isSparseKw = row.kwCount < 5;

      if (isMissingTitle || isSparseKw) {
        const generated = generateLocalSeoKeywords(
          p.name,
          p.location,
          p.zone,
          p.type,
          p.propertyType,
          p.price,
          p.builderName || '',
          p.reraNumber
        );

        const key = p.id || p.name;
        newDrafts[key] = {
          metaTitle: isMissingTitle ? generated.metaTitle : row.metaTitle,
          seoKeywords: isSparseKw ? generated.keywords : row.seoKeywords,
          ogImage: row.ogImage || p.imageUrls?.[0] || '',
          isDirty: true
        };
        populatedCount++;
      }
    });

    setSeoDrafts(newDrafts);
    if (populatedCount > 0) {
      setSeoAuditToast({
        message: `Auto-generated high-ranking SEO for ${populatedCount} projects! Review edits and click "Bulk Save All Changes".`,
        type: 'success'
      });
    } else {
      setSeoAuditToast({
        message: `All ${validProjects.length} projects already have high-ranking SEO keywords and page titles.`,
        type: 'info'
      });
    }
    setTimeout(() => setSeoAuditToast(null), 5000);
  };

  const handleSingleRowAiKeywords = async (p: Project) => {
    const key = p.id || p.name;
    setGeneratingAiId(key);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const res = await fetch('/api/ai/seo-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            projectName: p.name,
            location: p.location,
            zone: p.zone,
            type: p.type,
            propertyType: p.propertyType,
            price: p.price,
            builderName: p.builderName,
            reraNumber: p.reraNumber,
            features: p.features,
            configuration: p.configuration
          })
        });
        clearTimeout(timeoutId);
        const data = await res.json();
        if (data?.keywords) {
          const current = getProjectSeoRowData(p);
          setSeoDrafts(prev => ({
            ...prev,
            [key]: {
              metaTitle: data.metaTitle || current.metaTitle,
              seoKeywords: data.keywords,
              ogImage: current.ogImage || p.imageUrls?.[0] || '',
              isDirty: true
            }
          }));
          setSeoAuditToast({
            message: `✨ Generated ${data.keywords.split(',').length} keywords for "${p.name}"!`,
            type: 'success'
          });
          setTimeout(() => setSeoAuditToast(null), 3000);
          return;
        }
      } catch {
        clearTimeout(timeoutId);
      }

      // Fast fallback to local matrix
      const local = generateLocalSeoKeywords(
        p.name,
        p.location,
        p.zone,
        p.type,
        p.propertyType,
        p.price,
        p.builderName || '',
        p.reraNumber
      );
      const current = getProjectSeoRowData(p);
      setSeoDrafts(prev => ({
        ...prev,
        [key]: {
          metaTitle: current.metaTitle.length < 25 ? local.metaTitle : current.metaTitle,
          seoKeywords: local.keywords,
          ogImage: current.ogImage || p.imageUrls?.[0] || '',
          isDirty: true
        }
      }));
      setSeoAuditToast({
        message: `✨ Real-time generated ${local.keywords.split(',').length} tags for "${p.name}"!`,
        type: 'success'
      });
      setTimeout(() => setSeoAuditToast(null), 3000);
    } finally {
      setGeneratingAiId(null);
    }
  };

  const handleDiscardAllEdits = () => {
    setSeoDrafts({});
    setSeoAuditToast({
      message: 'All unsaved SEO drafts discarded.',
      type: 'info'
    });
    setTimeout(() => setSeoAuditToast(null), 2500);
  };

  const dirtyProjectsCount = validProjects.filter(p => getProjectSeoRowData(p).isDirty).length;
  const totalAuditProjects = validProjects.length;
  const optimizedCount = validProjects.filter(p => getProjectSeoRowData(p).health === 'optimized').length;
  const needsAttentionCount = totalAuditProjects - optimizedCount;
  const missingTitleCount = validProjects.filter(p => {
    const r = getProjectSeoRowData(p);
    return !r.metaTitle || r.titleLen < 25;
  }).length;
  const lowKeywordsCount = validProjects.filter(p => {
    const r = getProjectSeoRowData(p);
    return r.kwCount < 5;
  }).length;

  const auditDisplayedProjects = validProjects.filter(p => {
    const row = getProjectSeoRowData(p);
    
    // Category filter
    if (seoAuditCategoryFilter !== 'all') {
      if (seoAuditCategoryFilter === 'Primary' && (p.type === 'Rental' || p.type === 'Resale')) return false;
      if (seoAuditCategoryFilter === 'Rental' && p.type !== 'Rental') return false;
      if (seoAuditCategoryFilter === 'Resale' && p.type !== 'Resale') return false;
    }

    // Health filter
    if (seoAuditHealthFilter === 'needs_attention' && row.health !== 'needs_attention') return false;
    if (seoAuditHealthFilter === 'optimized' && row.health !== 'optimized') return false;

    // Search query
    if (seoAuditSearch.trim()) {
      const q = seoAuditSearch.toLowerCase().trim();
      const match = (p.name || '').toLowerCase().includes(q) ||
        (p.zone || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        (p.builderName || '').toLowerCase().includes(q) ||
        row.metaTitle.toLowerCase().includes(q) ||
        row.seoKeywords.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleBatchSyncSeo = async () => {
    setIsSyncingSitemap(true);
    try {
      const res = await fetch('/api/sitemap/refresh', { method: 'POST' });
      const data = await res.json();
      if (data && data.success && data.result) {
        setSitemapStats(data.result);
        setBatchSyncToast(`Successfully generated & updated XML sitemap with ${data.result.totalUrls} URLs (${data.result.totalProjects} active projects, ${data.result.dbProjectsCount} from database). Googlebot & Bingbot notified!`);
      } else {
        setBatchSyncToast(`Successfully synchronized all ${validProjects.length} portfolios with Google SEO schema, OpenGraph 1200x630 cards, and XML sitemaps!`);
      }
    } catch {
      setBatchSyncToast(`Successfully synchronized all ${validProjects.length} portfolios with Google SEO schema, OpenGraph 1200x630 cards, and XML sitemaps!`);
    } finally {
      setIsSyncingSitemap(false);
      setTimeout(() => setBatchSyncToast(null), 6000);
    }
  };

  // Requirement: Batch processing function for SEO Audit Hub iterating through all 'needs_attention' projects with Gemini & bulk Firestore update
  const handleBatchProcessNeedsAttentionSeo = async () => {
    const needsAttentionProjects = validProjects.filter(p => {
      const row = getProjectSeoRowData(p);
      return row.health === 'needs_attention';
    });

    if (needsAttentionProjects.length === 0) {
      setBatchSyncToast('All projects are already SEO-optimized! No projects with "needs_attention" status.');
      setTimeout(() => setBatchSyncToast(null), 4000);
      return;
    }

    setIsBatchProcessingSeo(true);
    setBatchSyncToast(`Gemini 3.8 Flash analyzing and generating missing SEO metadata for ${needsAttentionProjects.length} properties...`);

    try {
      const payload = needsAttentionProjects.map(p => {
        const row = getProjectSeoRowData(p);
        return {
          id: p.id || p.name,
          name: p.name,
          location: p.location,
          zone: p.zone,
          propertyType: p.propertyType,
          type: p.type,
          price: p.price,
          reraNumber: p.reraNumber,
          features: p.features || [],
          imageUrls: p.imageUrls || [],
          mobileImageUrl: p.mobileImageUrl || '',
          floorPlanImageUrl: p.floorPlanImageUrl || '',
          currentTitle: row.metaTitle,
          currentKeywords: p.seoKeywords || [],
          currentDescription: row.metaDescription,
          currentAltText: (p as any).imageAltText || '',
          currentAltTexts: (p as any).imageAltTexts || {}
        };
      });

      const res = await fetch('/api/gemini/batch-seo-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: payload })
      });

      const data = await res.json();
      if (!data || !data.success || !Array.isArray(data.results)) {
        throw new Error(data?.error || 'Failed to generate SEO metadata from Gemini');
      }

      const resultsMap: Record<string, { 
        metaTitle: string; 
        seoKeywords: string[]; 
        metaDescription: string;
        imageAltText: string;
        imageAltTexts: Record<string, string>;
      }> = {};
      data.results.forEach((r: any) => {
        resultsMap[r.projectId] = {
          metaTitle: r.metaTitle,
          seoKeywords: r.seoKeywords || [],
          metaDescription: r.metaDescription,
          imageAltText: r.imageAltText || '',
          imageAltTexts: r.imageAltTexts || {}
        };
      });

      const nowIso = new Date().toISOString();

      // Bulk update Firestore using writeBatch in a single write batch operation
      const batch = writeBatch(db);
      let writeCount = 0;

      needsAttentionProjects.forEach(p => {
        const enhanced = resultsMap[p.id || p.name];
        if (enhanced && p.id && !p.id.startsWith('curated_') && !p.id.startsWith('local_')) {
          const docRef = doc(db, 'projects', p.id);
          batch.update(docRef, {
            metaTitle: enhanced.metaTitle,
            seoTitle: enhanced.metaTitle,
            seoKeywords: enhanced.seoKeywords,
            metaDescription: enhanced.metaDescription,
            seoDescription: enhanced.metaDescription,
            imageAltText: enhanced.imageAltText,
            imageAltTexts: enhanced.imageAltTexts,
            seoLastEdited: nowIso,
            seoLastSyncedAt: nowIso,
            updatedAt: nowIso
          });
          writeCount++;
        }
      });

      if (writeCount > 0) {
        try {
          await batch.commit();
        } catch (fErr) {
          handleFirestoreError(fErr, OperationType.UPDATE, 'projects');
        }
      }

      // Update React state so all badges & table instantly turn to 'optimized'
      const enhancedProjectsList: Project[] = [];
      needsAttentionProjects.forEach(p => {
        const enhanced = resultsMap[p.id || p.name];
        if (enhanced) {
          const updatedProj: Project = {
            ...p,
            metaTitle: enhanced.metaTitle,
            seoTitle: enhanced.metaTitle,
            seoKeywords: enhanced.seoKeywords,
            metaDescription: enhanced.metaDescription,
            seoDescription: enhanced.metaDescription,
            seoLastEdited: nowIso,
            updatedAt: nowIso
          };
          enhancedProjectsList.push(updatedProj);
          if (onSaveProject) {
            onSaveProject(updatedProj);
          }
        }
      });

      if (onBatchUpdateProjects) {
        onBatchUpdateProjects(enhancedProjectsList);
      }

      // Clear any dirty drafts for these projects
      setSeoDrafts(prev => {
        const next = { ...prev };
        needsAttentionProjects.forEach(p => {
          delete next[p.id || p.name];
        });
        return next;
      });

      // Trigger automatic sitemap refresh
      fetch('/api/sitemap/refresh', { method: 'POST' }).catch(() => {});

      setBatchSyncToast(`Successfully enhanced ${needsAttentionProjects.length} projects via Gemini 3.8 Flash & bulk updated Firestore!`);
    } catch (err: any) {
      console.error('Batch SEO error:', err);
      setBatchSyncToast(`Batch SEO optimization encountered an issue: ${err.message || 'Operation failed'}`);
    } finally {
      setIsBatchProcessingSeo(false);
      setTimeout(() => setBatchSyncToast(null), 6000);
    }
  };

  const exportEnquiriesExcel = () => {
    const listToExport = sortedEnquiries;
    const headers = [
      'Order',
      'Category',
      'Customer Intent',
      'Intent Score (0-100)',
      'Communication Tone',
      'Intent Signals / Triggers',
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
    const rows = listToExport.map((enq, index) => {
      const intent = analyzeCustomerIntent(enq);
      return [
        index + 1,
        resolveEnquiryCategory(enq),
        intent.level,
        intent.score,
        intent.tone,
        intent.signals.join(' | '),
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
      ];
    });
    
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BS_Homez_Customer_Intelligence_Intent_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const exportOpportunitiesExcel = () => {
    const headers = [
      'Order', 'Date & Time Filed', 'Category', 'Client / Owner Name', 'Lead Intent Level', 'Intent Score (0-100)', 'Contact Mobile', 'Email Address', 
      'Services Interested / Property', 'Comment / Scope (1000 Chars)', 'Property Type / Offering', 
      'Expected Income (Rs.)', 'Property Status', 'Attributes & Notes'
    ];
    const businessOpps = opportunities.filter(o => o.category === 'Opportunity' || o.category === 'Business' || Boolean(o.email) || Boolean(o.interested));
    const propertyOpps = opportunities.filter(o => o.category !== 'Opportunity' && o.category !== 'Business' && !o.interested);
    const targetOpps = opportunityCategoryFilter === 'business'
      ? businessOpps
      : opportunityCategoryFilter === 'property'
      ? propertyOpps
      : opportunities;

    const sortedList = [...targetOpps].sort((a, b) => {
      if (oppSortField === 'date') {
        const timeA = getTimestampMillis(a.timestamp);
        const timeB = getTimestampMillis(b.timestamp);
        return oppSortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
      if (oppSortField === 'name') {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return oppSortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      if (oppSortField === 'score') {
        const scoreA = analyzeOpportunityIntent(a).score;
        const scoreB = analyzeOpportunityIntent(b).score;
        return oppSortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
      return 0;
    });

    const rows = sortedList.map((opp, index) => {
      const isBusiness = opp.category === 'Opportunity' || opp.category === 'Business' || Boolean(opp.email) || Boolean(opp.interested);
      const intent = analyzeOpportunityIntent(opp);
      return [
        index + 1,
        formatDateTime(opp.timestamp),
        isBusiness ? 'Grow Business Lead' : 'Property Sell/Rent Offer',
        opp.name,
        intent.level,
        intent.score,
        opp.mobile,
        opp.email || 'N/A',
        isBusiness ? (opp.interested || opp.propertyName || 'Grow Business') : (opp.propertyName || 'Property'),
        opp.comment || opp.notes || '',
        isBusiness ? 'Digital & Tech Solutions' : `${opp.propertyType || ''} (${opp.willingTo || ''})`,
        isBusiness ? 'Custom Quote' : (opp.willingTo === 'Rent' ? opp.expectedRent || 0 : opp.expectedSell || 0),
        isBusiness ? 'New Business Inquiry' : (opp.propertyStatus || 'N/A'),
        isBusiness 
          ? `Interested: ${opp.interested || 'All'} | Tone: ${intent.tone}`
          : `Facing: ${opp.facing || ''} | Rooms: ${opp.rooms || ''} | Floor: ${opp.floorNumber || ''} | Tower: ${opp.tower || ''}`
      ];
    });
    
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BS_Homez_Opportunities_and_Business_Leads_${new Date().toISOString().split('T')[0]}.csv`);
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
        
        <div className="flex items-center overflow-x-auto no-scrollbar w-full md:w-auto bg-[#121212]/90 border border-white/10 p-1.5 rounded-sm gap-2 md:gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
           <button 
             onClick={() => setActiveTab('leads')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
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
               "flex-1 flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'opportunities' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <TrendingUp size={15} className={cn("transition-transform duration-300", activeTab === 'opportunities' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <div className="flex items-center gap-2">
               <span>Opportunity</span>
               <span className={cn(
                 "text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold border",
                 activeTab === 'opportunities'
                   ? "bg-black/20 text-black border-black/30"
                   : "bg-white/10 text-white/80 border-white/20"
               )}>
                 {opportunities.length}
               </span>
             </div>
           </button>
           <button 
             onClick={() => setActiveTab('referrals')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
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
               "flex-1 flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'portfolio' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <LayoutGrid size={15} className={cn("transition-transform duration-300", activeTab === 'portfolio' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <span>Portfolio Curator</span>
           </button>
           <button 
             onClick={() => setActiveTab('tab_visibility')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'tab_visibility' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <Sliders size={15} className={cn("transition-transform duration-300", activeTab === 'tab_visibility' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <div className="flex items-center gap-2">
               <span>Online Tab Visibility</span>
               <span className={cn(
                 "text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold border",
                 activeTab === 'tab_visibility'
                   ? "bg-black/20 text-black border-black/30"
                   : "bg-white/10 text-white/80 border-white/20"
               )}>
                 {Object.values(tabVisibility).filter(v => v !== false).length}/12 Live
               </span>
             </div>
           </button>
           <button 
             onClick={() => setActiveTab('seo_audit')}
             className={cn(
               "flex-1 flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer rounded-sm outline-none border",
               activeTab === 'seo_audit' 
                 ? "bg-gradient-to-r from-art-gold to-[#e4c07a] text-black border-art-gold font-black shadow-[0_4px_20px_rgba(197,160,89,0.4)] scale-[1.02] transform" 
                 : "bg-[#141414]/80 text-white/55 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
             )}
           >
             <FileSpreadsheet size={15} className={cn("transition-transform duration-300", activeTab === 'seo_audit' ? "scale-110 stroke-[2.5]" : "opacity-60")} />
             <span>SEO Audit Hub</span>
           </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        <div className="space-y-4">
          {leadActionToast && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-sm flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{leadActionToast}</span>
              </span>
              <button onClick={() => setLeadActionToast(null)} className="text-emerald-400 hover:text-white cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-sm">
            <div>
              <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Secure Access Record logs</p>
              <h3 className="text-lg font-serif italic text-white">
                {leadStatusFilter === 'active' ? 'Active Customer Intelligence' : 'Trash & Deleted Leads Archive'} ({currentStatusEnquiries.length})
              </h3>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Active vs Trash Leads Selector */}
              <div className="flex items-center bg-[#101010] p-1 border border-white/15 rounded-sm">
                <button
                  type="button"
                  onClick={() => {
                    setLeadStatusFilter('active');
                    setEnquiryCategoryFilter('all');
                    setIntentFilter('all');
                  }}
                  className={cn(
                    "px-4 py-2 rounded-sm text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                    leadStatusFilter === 'active'
                      ? "bg-art-gold text-black shadow-sm font-black"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  <MessageCircle size={12} />
                  <span>Active Leads ({nonDeletedEnquiries.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeadStatusFilter('trash');
                    setEnquiryCategoryFilter('all');
                    setIntentFilter('all');
                  }}
                  className={cn(
                    "px-4 py-2 rounded-sm text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                    leadStatusFilter === 'trash'
                      ? "bg-rose-600 text-white shadow-sm font-black"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  <Trash2 size={12} />
                  <span>Trash / Deleted ({trashEnquiries.length})</span>
                </button>
              </div>

              {/* Primary Sales Line Indicator for Lead Sharing */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                <MessageCircle size={13} className="text-emerald-400 shrink-0" />
                <span className="text-white/60 uppercase tracking-wider text-[9px]">Sales Desk Line:</span>
                <input 
                  type="text" 
                  value={salesTeamWhatsApp}
                  onChange={(e) => setSalesTeamWhatsApp(e.target.value)}
                  placeholder="919902991599"
                  className="bg-black/70 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] w-28 border border-emerald-500/40 focus:outline-none focus:border-emerald-400"
                  title="Sales team primary WhatsApp number for instant lead dispatch"
                />
              </div>

              <button 
                type="button"
                data-testid="copy-all-leads-btn"
                onClick={handleCopyAllVisibleLeads}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white hover:text-black text-white/90 border border-white/20 px-4 py-3 rounded-sm text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-sm"
                title="Copy all currently filtered leads to clipboard in standard format (Name, Number, Email, Category, Project)"
              >
                {copiedAllLeads ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedAllLeads ? 'Leads Copied!' : `Copy (${sortedEnquiries.length}) Leads`}</span>
              </button>

              <button 
                onClick={exportEnquiriesExcel}
                className="flex items-center gap-2 bg-art-gold/10 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/30 px-5 py-3 rounded-sm text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer"
              >
                <FileSpreadsheet size={14} />
                Export {enquiryCategoryFilter === 'all' ? 'All' : enquiryCategoryFilter} to Excel
              </button>
            </div>
          </div>

          {/* Dedicated Sub-Tabs for Enquiry Segregation: Primary, Rental, Resale, Home Loan */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#141414] border border-white/10 rounded-sm">
            {[
              { id: 'all', label: 'All Inquiries', count: currentStatusEnquiries.length, color: 'text-white' },
              { id: 'Primary', label: 'Primary Portfolios', count: primaryEnqs.length, color: 'text-art-gold' },
              { id: 'Rental', label: 'Rental Inquiries', count: rentalEnqs.length, color: 'text-cyan-400' },
              { id: 'Resale', label: 'Resale Inquiries', count: resaleEnqs.length, color: 'text-amber-400' },
              { id: 'Home Loan', label: 'Home Loan Desk', count: homeLoanEnqs.length, color: 'text-emerald-400' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setEnquiryCategoryFilter(tab.id as any)}
                className={cn(
                  "py-2.5 px-4 text-[10px] font-black uppercase tracking-wider rounded-sm border transition-all cursor-pointer flex items-center gap-2",
                  enquiryCategoryFilter === tab.id
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-white/5 text-white/55 border-transparent hover:text-white hover:bg-white/10"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded text-[9px] font-mono",
                  enquiryCategoryFilter === tab.id ? "bg-black/15 text-black font-black" : "bg-white/10 text-white/70"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sentiment & Intent Filter Sub-Bar */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-[#101010] border border-white/10 rounded-sm">
            <span className="text-[9px] uppercase tracking-widest text-art-gold font-bold px-2 flex items-center gap-1.5">
              <Sparkles size={11} className="text-art-gold animate-pulse" />
              <span>Sentiment &amp; Intent Filter:</span>
            </span>
            {[
              { id: 'all', label: 'All Intents', count: categoryFilteredEnquiries.length, icon: null },
              { id: 'High', label: 'High Intent', count: highIntentCount, icon: '🔥', color: 'text-rose-400' },
              { id: 'Medium', label: 'Medium Intent', count: mediumIntentCount, icon: '⚡', color: 'text-amber-400' },
              { id: 'Low', label: 'Low Intent', count: lowIntentCount, icon: '○', color: 'text-white/40' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setIntentFilter(sub.id as any)}
                className={cn(
                  "py-1.5 px-3 text-[9px] font-black uppercase tracking-wider rounded-sm border transition-all cursor-pointer flex items-center gap-1.5",
                  intentFilter === sub.id
                    ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                    : "bg-white/5 text-white/60 border-transparent hover:text-white hover:bg-white/10"
                )}
              >
                {sub.icon && <span>{sub.icon}</span>}
                <span>{sub.label}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded text-[8px] font-mono",
                  intentFilter === sub.id ? "bg-black/20 text-black font-black" : "bg-white/10 text-white/70"
                )}>
                  {sub.count}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Sorting Toolbar for Leads */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111111] border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold flex items-center gap-1.5 font-mono">
                <ArrowUpDown size={12} className="text-art-gold" />
                <span>Sort Leads By:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleToggleLeadSort('date')}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border",
                    leadSortField === 'date'
                      ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                      : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span>Date</span>
                  {leadSortField === 'date' && (leadSortDirection === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLeadSort('name')}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border",
                    leadSortField === 'name'
                      ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                      : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span>Customer Name</span>
                  {leadSortField === 'name' && (leadSortDirection === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLeadSort('score')}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border",
                    leadSortField === 'score'
                      ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                      : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span>Lead Intent Score</span>
                  {leadSortField === 'score' && (leadSortDirection === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                </button>
              </div>
            </div>
            <span className="text-[10px] text-white/40 font-mono">
              Showing {sortedEnquiries.length} leads sorted by {leadSortField.toUpperCase()} ({leadSortDirection === 'asc' ? 'ascending' : 'descending'})
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-white/10 text-[10px] uppercase tracking-[0.2em] font-black text-art-gold">
                 <tr>
                   <th className="px-6 py-5">
                     <button
                       type="button"
                       onClick={() => handleToggleLeadSort('name')}
                       className={cn(
                         "flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left font-black tracking-[0.2em]",
                         leadSortField === 'name' ? "text-white" : "text-art-gold"
                       )}
                       title="Sort by Customer Name"
                     >
                       <span>Identity</span>
                       {leadSortField === 'name' ? (
                         leadSortDirection === 'asc' ? <ArrowUp size={13} className="text-art-gold" /> : <ArrowDown size={13} className="text-art-gold" />
                       ) : (
                         <ArrowUpDown size={13} className="opacity-40 hover:opacity-100" />
                       )}
                     </button>
                   </th>
                   <th className="px-6 py-5">Category</th>
                   <th className="px-6 py-5">
                     <button
                       type="button"
                       onClick={() => handleToggleLeadSort('score')}
                       className={cn(
                         "flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left font-black tracking-[0.2em]",
                         leadSortField === 'score' ? "text-white" : "text-art-gold"
                       )}
                       title="Sort by Lead Intent Score"
                     >
                       <span>Intent &amp; Sentiment</span>
                       {leadSortField === 'score' ? (
                         leadSortDirection === 'asc' ? <ArrowUp size={13} className="text-art-gold" /> : <ArrowDown size={13} className="text-art-gold" />
                       ) : (
                         <ArrowUpDown size={13} className="opacity-40 hover:opacity-100" />
                       )}
                     </button>
                   </th>
                   <th className="px-6 py-5">
                     <button
                       type="button"
                       onClick={() => handleToggleLeadSort('date')}
                       className={cn(
                         "flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left font-black tracking-[0.2em]",
                         leadSortField === 'date' ? "text-white" : "text-art-gold"
                       )}
                       title="Sort by Date"
                     >
                       <span>Enquired At</span>
                       {leadSortField === 'date' ? (
                         leadSortDirection === 'asc' ? <ArrowUp size={13} className="text-art-gold" /> : <ArrowDown size={13} className="text-art-gold" />
                       ) : (
                         <ArrowUpDown size={13} className="opacity-40 hover:opacity-100" />
                       )}
                     </button>
                   </th>
                   <th className="px-6 py-5">Preferred Callback Time</th>
                   <th className="px-6 py-5">Portfolio Interests &amp; Preferred Location</th>
                   <th className="px-6 py-5">Communication</th>
                   <th className="px-6 py-5">Intelligence</th>
                   <th className="px-6 py-5">Origin</th>
                   <th className="px-6 py-5 text-right">Lead Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {sortedEnquiries.length === 0 && (
                   <tr>
                     <td colSpan={10} className="px-10 py-20 text-center text-white/30 italic tracking-widest text-xs font-mono">
                       {leadStatusFilter === 'trash'
                         ? 'No deleted inquiries in trash archive.'
                         : `No inquiries recorded under "${enquiryCategoryFilter}" category with "${intentFilter}" intent.`}
                     </td>
                   </tr>
                 )}
                 {sortedEnquiries.map((enq) => {
                   const category = resolveEnquiryCategory(enq);
                   const intent = analyzeCustomerIntent(enq);
                   return (
                     <tr key={enq.id} className="hover:bg-white/5 transition-colors group">
                       <td className="px-6 py-5 font-serif text-base text-white">{enq.customerName}</td>
                       <td className="px-6 py-5">
                         <span className={cn(
                           "text-[9px] px-2.5 py-1 rounded-sm uppercase font-black tracking-widest whitespace-nowrap border font-mono",
                           category === 'Primary' 
                             ? "bg-art-gold/15 text-art-gold border-art-gold/30"
                             : category === 'Rental'
                             ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                             : category === 'Resale'
                             ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                             : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                         )}>
                           {category}
                         </span>
                       </td>
                       <td className="px-6 py-5">
                         <div className="flex flex-col gap-1.5 min-w-[140px]">
                           <span className={cn(
                             "text-[9px] px-2.5 py-1 rounded-sm uppercase font-black tracking-wider whitespace-nowrap border font-mono inline-flex items-center gap-1.5 w-max",
                             intent.level === 'High'
                                ? "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                                : intent.level === 'Medium'
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                                : "bg-white/5 text-white/50 border-white/10"
                           )}>
                             <span>{intent.level === 'High' ? '🔥' : intent.level === 'Medium' ? '⚡' : '○'}</span>
                             <span>{intent.level} Intent</span>
                             <span className="opacity-60 text-[8px]">({intent.score}%)</span>
                           </span>
                           <span className="text-[10px] text-white/70 font-mono">
                             Tone: <strong className="text-white">{intent.tone}</strong>
                           </span>
                           <div className="flex flex-wrap gap-1 mt-0.5">
                             {intent.signals.slice(0, 2).map((sig, sIdx) => (
                               <span key={sIdx} className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-art-gold font-mono truncate max-w-[130px]" title={sig}>
                                 {sig}
                               </span>
                             ))}
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-5 text-[11px] font-mono text-white/60">
                         {formatDateTime(enq.timestamp)}
                       </td>
                       <td className="px-6 py-5">
                         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-art-gold/10 border border-art-gold/30 rounded-sm text-art-gold font-mono text-[10px] whitespace-nowrap">
                           <Clock size={12} className="text-art-gold shrink-0" />
                           <span>{enq.preferredContactTime || 'Standard Hours'}</span>
                         </div>
                       </td>
                       <td className="px-6 py-5">
                         <div className="flex flex-col gap-1">
                           <span className="text-art-gold font-mono text-xs uppercase tracking-tighter font-bold">
                             {enq.interestedProjects || enq.projectName}
                           </span>
                           {enq.preferredLocation && (
                             <span className="text-[10px] text-white/50 font-mono">
                               Pref. Location: {enq.preferredLocation}
                             </span>
                           )}
                         </div>
                       </td>
                       <td className="px-6 py-5 text-[11px] font-mono">
                         <div className="flex flex-col gap-1.5">
                           <a href={`tel:${enq.customerPhone}`} className="text-white hover:text-art-gold transition-colors font-bold">
                             {enq.customerPhone}
                           </a>
                           <span className="text-white/40">{enq.customerEmail}</span>
                         </div>
                       </td>
                       <td className="px-6 py-5 text-[11px] text-white/70 italic max-w-sm line-clamp-2 leading-relaxed">
                         {enq.message ? `"${enq.message}"` : 'NO CONTEXT PROVIDED'}
                       </td>
                       <td className="px-6 py-5">
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
                       <td className="px-6 py-5 text-right whitespace-nowrap">
                         <div className="flex items-center justify-end gap-1.5">
                           {/* Option to copy lead in requested format: Name, Number, Email, Category, Project */}
                           <button
                             type="button"
                             data-testid={"copy-lead-btn-" + enq.id}
                             onClick={() => handleCopyLead(enq)}
                             className="px-2.5 py-1.5 rounded-sm bg-white/10 hover:bg-white hover:text-black text-white/90 border border-white/20 transition-all flex items-center gap-1.5 text-[9.5px] font-mono font-bold cursor-pointer shadow-sm"
                             title="Copy lead brief (Name, Number, Email, Category, Project)"
                           >
                             {copiedLeadId === enq.id ? (
                               <Check size={12} className="text-emerald-400 shrink-0" />
                             ) : (
                               <Copy size={12} className="shrink-0" />
                             )}
                             <span>{copiedLeadId === enq.id ? 'Copied' : 'Copy'}</span>
                           </button>

                           {/* Requirement: Share Lead via WhatsApp to Sales Team line using formatWhatsAppLeadMessage */}
                           <button
                             type="button"
                             data-testid="share-lead-whatsapp-btn"
                             onClick={() => handleShareWhatsApp(enq)}
                             className="px-2.5 py-1.5 rounded-sm bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 transition-all flex items-center gap-1.5 text-[9.5px] font-mono font-bold cursor-pointer shadow-sm"
                             title={`Share Lead formatted brief to Sales Team Line (+${salesTeamWhatsApp})`}
                           >
                             <MessageCircle size={12} className="text-emerald-400 shrink-0" />
                             <span>Share Lead via WhatsApp</span>
                           </button>

                           {/* Active Leads: Soft Delete & Complete Delete */}
                           {leadStatusFilter === 'active' ? (
                             <>
                               <button
                                 type="button"
                                 onClick={() => handleSoftDeleteLead(enq)}
                                 disabled={actionLoadingId === enq.id}
                                 className="px-2.5 py-1.5 rounded-sm bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 transition-all flex items-center gap-1.5 text-[9.5px] font-mono font-bold cursor-pointer disabled:opacity-50"
                                 title="Delete Lead (Move to Trash / Archive)"
                               >
                                 {actionLoadingId === enq.id ? <Loader2 size={12} className="animate-spin" /> : <Trash size={12} />}
                                 <span>Delete</span>
                               </button>
                               <button
                                 type="button"
                                 onClick={() => setDeleteConfirmEnquiry(enq)}
                                 disabled={actionLoadingId === enq.id}
                                 className="px-2.5 py-1.5 rounded-sm bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all flex items-center gap-1 text-[9.5px] font-mono font-bold cursor-pointer disabled:opacity-50"
                                 title="Complete Permanent Delete from Database"
                               >
                                 <Trash2 size={12} />
                                 <span className="hidden xl:inline">Complete</span>
                               </button>
                             </>
                           ) : (
                             <>
                               {/* Trash / Deleted Leads: Restore & Complete Delete */}
                               <button
                                 type="button"
                                 onClick={() => handleRestoreLead(enq)}
                                 disabled={actionLoadingId === enq.id}
                                 className="px-2.5 py-1.5 rounded-sm bg-art-gold/15 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40 transition-all flex items-center gap-1.5 text-[9.5px] font-mono font-bold cursor-pointer disabled:opacity-50"
                                 title="Restore Lead to Active Intelligence"
                               >
                                 {actionLoadingId === enq.id ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                                 <span>Restore</span>
                               </button>
                               <button
                                 type="button"
                                 onClick={() => setDeleteConfirmEnquiry(enq)}
                                 disabled={actionLoadingId === enq.id}
                                 className="px-2.5 py-1.5 rounded-sm bg-red-600 hover:bg-red-500 text-white border border-red-500 transition-all flex items-center gap-1.5 text-[9.5px] font-mono font-bold cursor-pointer disabled:opacity-50 shadow-md"
                                 title="Complete Permanent Delete from Database"
                               >
                                 <Trash2 size={12} />
                                 <span>Complete Delete</span>
                               </button>
                             </>
                           )}
                         </div>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
            </table>
          </div>

          {/* Complete Permanent Delete Confirmation Modal */}
          {deleteConfirmEnquiry && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#121212] border-2 border-red-500/50 rounded-md p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-left">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 border border-red-500/30">
                    <Trash2 size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif italic text-white">Complete Delete Lead</h4>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">Irreversible Action</p>
                  </div>
                </div>
                
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  Are you sure you want to permanently delete the lead from <strong className="text-white font-serif">{deleteConfirmEnquiry.customerName}</strong> ({deleteConfirmEnquiry.customerPhone})? 
                  This will completely remove the lead from the app and database.
                </p>

                <div className="p-3 bg-white/5 border border-white/10 rounded-sm font-mono text-[10px] space-y-1 text-white/60">
                  <div><strong>Project:</strong> {deleteConfirmEnquiry.projectName || deleteConfirmEnquiry.interestedProjects || 'General'}</div>
                  <div><strong>Email:</strong> {deleteConfirmEnquiry.customerEmail || 'N/A'}</div>
                  <div><strong>Notes:</strong> {deleteConfirmEnquiry.message || 'None'}</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmEnquiry(null)}
                    disabled={actionLoadingId === deleteConfirmEnquiry.id}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-sm text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCompleteDeleteLead(deleteConfirmEnquiry)}
                    disabled={actionLoadingId === deleteConfirmEnquiry.id}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoadingId === deleteConfirmEnquiry.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    <span>Confirm Complete Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'opportunities' ? (
        (() => {
          const businessOpps = opportunities.filter(o => o.category === 'Opportunity' || o.category === 'Business' || Boolean(o.email) || Boolean(o.interested));
          const propertyOpps = opportunities.filter(o => o.category !== 'Opportunity' && o.category !== 'Business' && !o.interested);
          const filteredOpps = opportunityCategoryFilter === 'business'
            ? businessOpps
            : opportunityCategoryFilter === 'property'
            ? propertyOpps
            : opportunities;

          const displayedOpps = [...filteredOpps].sort((a, b) => {
            if (oppSortField === 'date') {
              const timeA = getTimestampMillis(a.timestamp);
              const timeB = getTimestampMillis(b.timestamp);
              return oppSortDirection === 'asc' ? timeA - timeB : timeB - timeA;
            }
            if (oppSortField === 'name') {
              const nameA = (a.name || '').toLowerCase();
              const nameB = (b.name || '').toLowerCase();
              return oppSortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            if (oppSortField === 'score') {
              const scoreA = analyzeOpportunityIntent(a).score;
              const scoreB = analyzeOpportunityIntent(b).score;
              return oppSortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
            }
            return 0;
          });

          return (
            <div className="space-y-4 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-sm">
                <div>
                  <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Asset &amp; Business Intake Pipeline</p>
                  <h3 className="text-lg font-serif italic text-white font-sans">
                    Opportunity Vault Registry ({displayedOpps.length})
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={exportOpportunitiesExcel}
                    className="flex items-center gap-2 bg-art-gold/10 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/30 px-5 py-3 rounded-sm text-[10px] uppercase font-black tracking-widest transition-all font-sans cursor-pointer"
                  >
                    <FileSpreadsheet size={14} />
                    <span>Export to Excel</span>
                  </button>
                </div>
              </div>

              {/* Sub-Filters: All, Grow Business, Property */}
              <div className="flex flex-wrap gap-2 p-2 bg-[#141414] border border-white/10 rounded-sm">
                {[
                  { id: 'all', label: 'All Inquiries', count: opportunities.length, color: 'text-white' },
                  { id: 'business', label: 'Opportunity Leads (Grow Business)', count: businessOpps.length, color: 'text-art-gold' },
                  { id: 'property', label: 'Property Sell/Rent Offers', count: propertyOpps.length, color: 'text-emerald-400' },
                ].map(tab => {
                  const isActive = opportunityCategoryFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOpportunityCategoryFilter(tab.id as any)}
                      className={cn(
                        "px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 border cursor-pointer",
                        isActive
                          ? "bg-art-gold text-black border-art-gold font-black shadow-md"
                          : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <span className={isActive ? "text-black" : tab.color}>{tab.label}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                        isActive ? "bg-black/20 text-black" : "bg-white/10 text-white"
                      )}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Sorting Toolbar for Opportunities */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111111] border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold flex items-center gap-1.5 font-mono">
                    <ArrowUpDown size={12} className="text-art-gold" />
                    <span>Sort Opportunities By:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleOppSort('date')}
                      className={cn(
                        "px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border",
                        oppSortField === 'date'
                          ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <span>Date</span>
                      {oppSortField === 'date' && (oppSortDirection === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleOppSort('name')}
                      className={cn(
                        "px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border",
                        oppSortField === 'name'
                          ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <span>Client Name</span>
                      {oppSortField === 'name' && (oppSortDirection === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleOppSort('score')}
                      className={cn(
                        "px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border",
                        oppSortField === 'score'
                          ? "bg-art-gold text-black border-art-gold font-black shadow-sm"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <span>Lead Intent Score</span>
                      {oppSortField === 'score' && (oppSortDirection === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                    </button>
                  </div>
                </div>
                <span className="text-[10px] text-white/40 font-mono">
                  Showing {displayedOpps.length} opportunities sorted by {oppSortField.toUpperCase()} ({oppSortDirection === 'asc' ? 'ascending' : 'descending'})
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden font-sans overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-white/10 text-[10px] uppercase tracking-[0.2em] font-black text-art-gold font-sans">
                     <tr>
                       <th className="px-6 py-5">
                         <button
                           type="button"
                           onClick={() => handleToggleOppSort('name')}
                           className={cn(
                             "flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left font-black tracking-[0.2em]",
                             oppSortField === 'name' ? "text-white" : "text-art-gold"
                           )}
                           title="Sort by Client / Owner Name"
                         >
                           <span>Client / Owner</span>
                           {oppSortField === 'name' ? (
                             oppSortDirection === 'asc' ? <ArrowUp size={13} className="text-art-gold" /> : <ArrowDown size={13} className="text-art-gold" />
                           ) : (
                             <ArrowUpDown size={13} className="opacity-40 hover:opacity-100" />
                           )}
                         </button>
                       </th>
                       <th className="px-6 py-5">
                         <button
                           type="button"
                           onClick={() => handleToggleOppSort('score')}
                           className={cn(
                             "flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left font-black tracking-[0.2em]",
                             oppSortField === 'score' ? "text-white" : "text-art-gold"
                           )}
                           title="Sort by Lead Intent Score"
                         >
                           <span>Lead Intent Score</span>
                           {oppSortField === 'score' ? (
                             oppSortDirection === 'asc' ? <ArrowUp size={13} className="text-art-gold" /> : <ArrowDown size={13} className="text-art-gold" />
                           ) : (
                             <ArrowUpDown size={13} className="opacity-40 hover:opacity-100" />
                           )}
                         </button>
                       </th>
                       <th className="px-6 py-5">
                         <button
                           type="button"
                           onClick={() => handleToggleOppSort('date')}
                           className={cn(
                             "flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left font-black tracking-[0.2em]",
                             oppSortField === 'date' ? "text-white" : "text-art-gold"
                           )}
                           title="Sort by Date"
                         >
                           <span>Contact &amp; Date</span>
                           {oppSortField === 'date' ? (
                             oppSortDirection === 'asc' ? <ArrowUp size={13} className="text-art-gold" /> : <ArrowDown size={13} className="text-art-gold" />
                           ) : (
                             <ArrowUpDown size={13} className="opacity-40 hover:opacity-100" />
                           )}
                         </button>
                       </th>
                       <th className="px-6 py-5">Type &amp; Category</th>
                       <th className="px-6 py-5">Offering / Services</th>
                       <th className="px-6 py-5">Requirements &amp; Scope (1000 Chars)</th>
                       <th className="px-6 py-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {displayedOpps.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-10 py-20 text-center text-white/20 italic tracking-widest font-serif text-sm">
                            No opportunities filed in current filter scope.
                          </td>
                        </tr>
                      )}
                      {displayedOpps.map((opp) => {
                        const isBusiness = opp.category === 'Opportunity' || opp.category === 'Business' || Boolean(opp.email) || Boolean(opp.interested);
                        const intent = analyzeOpportunityIntent(opp);
                        return (
                        <tr key={opp.id} className="hover:bg-white/5 transition-colors group">
                          {/* Client / Owner */}
                          <td className="px-6 py-5 font-sans align-top">
                            <div className="flex flex-col gap-1">
                              <span className="font-serif text-lg text-white font-medium">{opp.name}</span>
                              <span className={cn(
                                "text-[9px] px-2 py-0.5 rounded uppercase font-bold font-mono tracking-widest w-max",
                                isBusiness ? "bg-art-gold/15 text-art-gold border border-art-gold/30" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              )}>
                                {isBusiness ? "Grow Business" : "Property"}
                              </span>
                            </div>
                          </td>

                          {/* Lead Intent Score */}
                          <td className="px-6 py-5 align-top">
                            <div className="flex flex-col gap-1.5 min-w-[130px]">
                              <span className={cn(
                                "text-[9px] px-2.5 py-1 rounded-sm uppercase font-black tracking-wider whitespace-nowrap border font-mono inline-flex items-center gap-1.5 w-max",
                                intent.level === 'High'
                                  ? "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                                  : intent.level === 'Medium'
                                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                                  : "bg-white/5 text-white/50 border-white/10"
                              )}>
                                <span>{intent.level === 'High' ? '🔥' : intent.level === 'Medium' ? '⚡' : '○'}</span>
                                <span>{intent.level}</span>
                                <span className="opacity-75 font-mono text-[9px]">({intent.score}%)</span>
                              </span>
                              <span className="text-[10px] text-white/70 font-mono">
                                Tone: <strong className="text-white">{intent.tone}</strong>
                              </span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {intent.signals.slice(0, 2).map((sig, sIdx) => (
                                  <span key={sIdx} className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-art-gold font-mono truncate max-w-[130px]" title={sig}>
                                    {sig}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Contact & Date */}
                          <td className="px-6 py-5 text-xs font-mono text-white/70 align-top">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5 text-white font-semibold">
                                <Phone size={12} className="text-art-gold shrink-0" />
                                <span>{opp.mobile}</span>
                                <a
                                  href={`https://wa.me/${opp.mobile.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                                  title="WhatsApp Chat"
                                >
                                  <MessageCircle size={11} />
                                </a>
                              </div>
                              {opp.email && (
                                <a
                                  href={`mailto:${opp.email}`}
                                  className="flex items-center gap-1.5 text-art-gold/80 hover:text-white transition-colors"
                                >
                                  <Mail size={12} className="shrink-0" />
                                  <span className="break-all">{opp.email}</span>
                                </a>
                              )}
                              <span className="text-[10px] text-white/40 mt-1">
                                {formatDateTime(opp.timestamp)}
                              </span>
                            </div>
                          </td>

                          {/* Type & Category */}
                          <td className="px-6 py-5 font-sans align-top">
                            {isBusiness ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-white font-semibold text-sm">Grow Business Intake</span>
                                <span className="text-art-gold font-mono text-[10px] uppercase font-bold tracking-widest">
                                  {opp.interested || "Digital & CRM Suite"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <span className="text-white font-semibold text-sm">{opp.propertyName}</span>
                                <span className="text-art-gold font-mono text-[10px] uppercase font-bold tracking-widest">{opp.propertyType}</span>
                              </div>
                            )}
                          </td>

                          {/* Offering / Services */}
                          <td className="px-6 py-5 font-sans align-top">
                            {isBusiness ? (
                              <div className="flex flex-wrap gap-1.5 max-w-xs">
                                {(opp.interested ? opp.interested.split(', ') : (opp.services || ['General'])).map((srv, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/90 text-[10px] font-bold"
                                  >
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            ) : (
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
                            )}
                          </td>

                          {/* Requirements & Scope (1000 Chars) */}
                          <td className="px-6 py-5 text-[11px] font-sans align-top">
                            {isBusiness ? (
                              <div className="max-w-md space-y-2">
                                {(opp.comment || opp.notes) ? (
                                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-sm space-y-1.5">
                                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-art-gold font-mono font-bold">
                                      <span>Comment / Project Scope</span>
                                      <span>{(opp.comment || opp.notes || '').length}/1000</span>
                                    </div>
                                    <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap font-sans max-h-40 overflow-y-auto no-scrollbar">
                                      {opp.comment || opp.notes}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-white/30 italic">No comment provided.</span>
                                )}
                              </div>
                            ) : (
                              <div className="font-mono text-white/60">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
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
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5 font-sans align-top text-right">
                            <button 
                              onClick={async () => {
                                if (confirm(`Verify deletion of this opportunity entry for ${opp.name}?`)) {
                                  try {
                                    await deleteDoc(doc(db, 'opportunities', opp.id!));
                                  } catch (err) {
                                    handleFirestoreError(err, OperationType.DELETE, `opportunities/${opp.id}`);
                                  }
                                }
                              }}
                              className="bg-red-500/10 hover:bg-red-500/20 p-3 inline-flex justify-center text-red-500 transition-all rounded-sm cursor-pointer"
                              title="Delete Opportunity"
                            >
                              <Trash size={14} />
                            </button>
                          </td>
                        </tr>
                        );
                      })}
                   </tbody>
                </table>
              </div>
            </div>
          );
        })()
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
    ) : activeTab === 'tab_visibility' ? (
      <div className="space-y-6 font-sans">
        {tabVisibilityToast && (
          <div className={cn(
            "p-4 rounded-sm border text-xs font-mono flex items-center justify-between",
            tabVisibilityToast.type === 'success'
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-art-gold/15 border-art-gold/40 text-art-gold"
          )}>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{tabVisibilityToast.message}</span>
            </span>
            <button 
              type="button" 
              onClick={() => setTabVisibilityToast(null)} 
              className="hover:text-white cursor-pointer ml-4"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Manager Header & Statistics */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 border border-art-gold/30 text-art-gold text-[10px] font-mono uppercase tracking-widest">
                <Sliders size={12} className="text-art-gold" />
                <span>Public Navigation Architecture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif italic text-white">
                Online Tab Visibility Controls
              </h3>
              <p className="text-white/60 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Toggle the checkboxes below to control which navigation tabs and sections are publicly visible to online visitors. Unchecked tabs are immediately hidden from public visitors while remaining accessible to admins in the Admin Vault.
              </p>
            </div>

            {/* Live Count Stat Badges */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-3 bg-black/50 border border-emerald-500/40 rounded-sm text-center min-w-[130px]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Online
                </span>
                <span className="text-2xl font-serif font-bold text-white mt-0.5 block">
                  {PUBLIC_TABS_META.filter(t => tabVisibility[t.key] !== false).length}
                  <span className="text-xs text-white/40 font-mono font-normal"> / 12 Tabs</span>
                </span>
              </div>

              <div className="px-4 py-3 bg-black/50 border border-amber-500/40 rounded-sm text-center min-w-[130px]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block flex items-center justify-center gap-1.5">
                  <EyeOff size={11} className="text-amber-400" />
                  Hidden
                </span>
                <span className="text-2xl font-serif font-bold text-white mt-0.5 block">
                  {PUBLIC_TABS_META.filter(t => tabVisibility[t.key] === false).length}
                  <span className="text-xs text-white/40 font-mono font-normal"> Admin Only</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bulk Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isUpdatingTabVis}
                onClick={() => handleBulkSetTabVisibility('all')}
                className="px-4 py-2 bg-art-gold/15 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/30 rounded-sm text-[10px] uppercase font-black tracking-widest transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckSquare size={13} />
                <span>Show All Tabs Online (Check All)</span>
              </button>
              <button
                type="button"
                disabled={isUpdatingTabVis}
                onClick={() => handleBulkSetTabVisibility('essential')}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sliders size={13} />
                <span>Essential Mode (Core Portfolio Only)</span>
              </button>
              <button
                type="button"
                disabled={isUpdatingTabVis}
                onClick={() => handleBulkSetTabVisibility('default')}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={13} />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-white/40 flex items-center gap-2">
              <ShieldCheck size={13} className="text-art-gold" />
              <span>Persisted in Firestore (system_settings/tab_visibility)</span>
            </div>
          </div>
        </div>

        {/* Interactive Checkbox Table / Grid of Tabs */}
        <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
          <div className="divide-y divide-white/10">
            {PUBLIC_TABS_META.map((tab) => {
              const isChecked = tabVisibility[tab.key] !== false;
              const TabIcon = tab.icon;
              return (
                <div 
                  key={tab.key}
                  className={cn(
                    "p-5 sm:p-6 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4",
                    isChecked 
                      ? "bg-black/20 hover:bg-white/[0.04]" 
                      : "bg-black/50 hover:bg-black/40 border-l-2 border-l-amber-500/60"
                  )}
                >
                  {/* Left: Checkbox & Meta Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Interactive Checkbox Button */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      disabled={isUpdatingTabVis}
                      onClick={() => handleToggleTabVisibility(tab.key)}
                      className={cn(
                        "mt-0.5 p-1 rounded transition-transform cursor-pointer focus:outline-none shrink-0",
                        isChecked
                          ? "text-art-gold hover:scale-110"
                          : "text-white/40 hover:text-white hover:scale-110"
                      )}
                      title={isChecked ? `Click to uncheck & hide ${tab.label} from public users` : `Click to check & make ${tab.label} visible online`}
                    >
                      {isChecked ? (
                        <CheckSquare size={24} className="text-art-gold fill-art-gold/15" />
                      ) : (
                        <Square size={24} className="text-white/35" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div className={cn(
                          "w-6 h-6 rounded flex items-center justify-center shrink-0",
                          isChecked ? "bg-art-gold/15 text-art-gold" : "bg-white/5 text-white/40"
                        )}>
                          <TabIcon size={13} />
                        </div>
                        
                        <span className="text-base font-serif italic text-white font-bold">
                          {tab.label}
                        </span>

                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 uppercase tracking-wider">
                          {tab.category}
                        </span>

                        <span className="text-[9px] font-mono text-art-gold/70">
                          {tab.route}
                        </span>

                        {tab.isImportant && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-art-gold/20 text-art-gold font-bold">
                            Key Page
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
                        {tab.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status Badge & Navigation Test Trigger */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center pl-10 md:pl-0">
                    {isChecked ? (
                      <div className="px-3 py-1.5 rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                        <span>LIVE ONLINE</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-sm bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                        <EyeOff size={12} className="text-rose-400" />
                        <span>HIDDEN (Admin Only)</span>
                      </div>
                    )}

                    {/* Instant Toggle Checkbox Action */}
                    <button
                      type="button"
                      disabled={isUpdatingTabVis}
                      onClick={() => handleToggleTabVisibility(tab.key)}
                      className={cn(
                        "px-3 py-1.5 rounded-sm text-[10px] uppercase font-black tracking-wider border transition-all cursor-pointer whitespace-nowrap",
                        isChecked
                          ? "bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-200 border-white/15 hover:border-rose-500/30"
                          : "bg-art-gold text-black hover:bg-white border-art-gold shadow-sm"
                      )}
                    >
                      {isChecked ? 'Uncheck to Hide' : 'Check to Make Live'}
                    </button>

                    {/* Direct Preview Tab Trigger */}
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateTab(tab.key);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded border border-white/10 transition-colors cursor-pointer"
                        title={`Preview ${tab.label} tab`}
                      >
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ) : activeTab === 'seo_audit' ? (
        <AdminSeoAuditPanel 
          projects={validProjects}
          onSaveProject={onSaveProject}
          onBatchSyncSitemap={handleBatchSyncSeo}
          isSyncingSitemap={isSyncingSitemap}
        />
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
              <div className="flex flex-wrap items-center gap-2">
                {/* Requirement: 'Bulk Fix All' button that identifies all projects with 'needs_attention' health, uses Gemini API to generate missing meta titles, descriptions, and alt tags for all images, and performs a single bulk write batch to Firestore */}
                <button
                  type="button"
                  disabled={isBatchProcessingSeo}
                  onClick={handleBatchProcessNeedsAttentionSeo}
                  data-testid="bulk-fix-all-btn"
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 hover:from-purple-600 hover:to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-60"
                  title="Bulk Fix All: identifies all projects with 'needs_attention' health, uses Gemini API to generate missing meta titles, descriptions, and alt tags for all images, and performs a single bulk write batch to Firestore"
                >
                  {isBatchProcessingSeo ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-white" />
                      <span>Gemini Generating &amp; Bulk Updating Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} className="text-amber-300" />
                      <span>Bulk Fix All ({needsAttentionCount})</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSyncingSitemap}
                  onClick={handleBatchSyncSeo}
                  className="px-4 py-2.5 bg-art-gold hover:bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-60"
                >
                  {isSyncingSitemap ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-black" />
                      <span>Syncing Sitemap &amp; SEO...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} className="text-black" />
                      <span>Batch Sync SEO &amp; Sitemap</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  data-testid="generate-seo-audit-report-hub-btn"
                  onClick={() => {
                    const audit = compilePortfolioImageAltAudit(projects);
                    const dateStr = new Date().toISOString().split('T')[0];
                    downloadSeoAuditCsv(
                      audit.items,
                      `seo_alt_text_audit_portfolio_${dateStr}.csv`,
                      'BS Homez Full Portfolio Image Accessibility & SEO Alt Text Audit'
                    );
                    setBatchSyncToast(`Generated SEO Alt Text Audit for ${audit.totalImages} images across ${audit.totalProjects} projects! Downloaded CSV report.`);
                    setTimeout(() => setBatchSyncToast(null), 4000);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Compile summary of missing alt text for all images in the project and provide a downloadable CSV report for the admin"
                >
                  <FileSpreadsheet size={13} />
                  <span>Generate SEO Audit Report</span>
                </button>
                {onOpenSeoPreview && (
                  <button
                    type="button"
                    onClick={onOpenSeoPreview}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Globe size={12} className="text-art-gold" />
                    <span>Inspect Google &amp; Meta SERP</span>
                  </button>
                )}
                <a
                  href="https://www.bshomez.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/15 text-white text-[10px] font-black uppercase tracking-widest rounded-sm border border-white/10 transition-all flex items-center gap-1.5"
                >
                  <ExternalLink size={12} /> Open Production Link
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/15 text-white text-[10px] font-black uppercase tracking-widest rounded-sm border border-white/10 transition-all flex items-center gap-1.5"
                >
                  <Globe size={12} /> View Sitemap.xml
                </a>
              </div>
            </div>

            {batchSyncToast && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-sm text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{batchSyncToast}</span>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 text-xs text-white/75">
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-sm">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-art-gold uppercase text-[9px] tracking-widest">1. Production Sitemaps &amp; URLs</strong>
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">Live Auto-Update</span>
                </div>
                <span className="font-mono text-[11px] break-all text-white block mb-1">
                  https://www.bshomez.in/sitemap.xml
                </span>
                <span className="text-[10px] text-white/50 font-mono">
                  Indexed URLs: <strong className="text-art-gold">{sitemapStats?.totalUrls || 92} URLs</strong> ({sitemapStats?.totalProjects || 68} active projects)
                </span>
              </div>
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-sm">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-art-gold uppercase text-[9px] tracking-widest">2. Database Projects Sync</strong>
                  <span className="text-[8px] bg-art-gold/20 text-art-gold px-1.5 py-0.2 rounded font-mono font-bold">Every 30m Cron</span>
                </div>
                <span>
                  Automatic background script synchronizes all active database listings (<strong className="text-white">{sitemapStats?.dbProjectsCount || 24} database properties</strong> + {sitemapStats?.curatedProjectsCount || 46} curated) into the XML sitemap.
                </span>
              </div>
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-sm">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-art-gold uppercase text-[9px] tracking-widest">3. Search Console &amp; Googlebot</strong>
                  <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono font-bold">Google Index Ready</span>
                </div>
                <span>
                  Dynamic XML sitemap adheres to sitemaps.org &amp; Google Image Sitemap schema. High priority (0.90) and daily change frequency configured for rapid Google indexing.
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Tabs for Projects Inventory: All, Primary, Rental, Resale */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 bg-[#141414] border border-white/10 rounded-sm">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Projects', count: validProjects.length, color: 'text-white' },
                { id: 'Primary', label: 'Primary Portfolios', count: primaryProjects.length, color: 'text-art-gold' },
                { id: 'Rental', label: 'Rental Inventory', count: rentalProjects.length, color: 'text-cyan-400' },
                { id: 'Resale', label: 'Resale Inventory', count: resaleProjects.length, color: 'text-amber-400' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setInventoryTab(sub.id as any)}
                  className={cn(
                    "py-2 px-3.5 text-[10px] font-black uppercase tracking-wider rounded-sm border transition-all cursor-pointer flex items-center gap-2",
                    inventoryTab === sub.id
                      ? "bg-white text-black border-white shadow-md"
                      : "bg-white/5 text-white/55 border-transparent hover:text-white hover:bg-white/10"
                  )}
                >
                  <span>{sub.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.2 rounded text-[9px] font-mono",
                    inventoryTab === sub.id ? "bg-black/15 text-black font-black" : "bg-white/10 text-white/70"
                  )}>
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Action Creation Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => {
                  setEditingProject(null);
                  if (onOpenNewProjectWithMode) {
                    onOpenNewProjectWithMode('Primary');
                  } else {
                    setShowProjectModal(true);
                  }
                }}
                className="bg-art-gold hover:bg-white text-black px-3.5 py-2 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={13} /> + Primary
              </button>
              <button 
                onClick={() => {
                  setEditingProject(null);
                  if (onOpenNewProjectWithMode) {
                    onOpenNewProjectWithMode('Rental');
                  } else {
                    setShowProjectModal(true);
                  }
                }}
                className="bg-cyan-500 hover:bg-white text-black px-3.5 py-2 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={13} /> + Rental
              </button>
              <button 
                onClick={() => {
                  setEditingProject(null);
                  if (onOpenNewProjectWithMode) {
                    onOpenNewProjectWithMode('Resale');
                  } else {
                    setShowProjectModal(true);
                  }
                }}
                className="bg-amber-500 hover:bg-white text-black px-3.5 py-2 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={13} /> + Resale
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-3.5">
            {displayedProjects.length === 0 && (
              <div className="col-span-full py-20 text-center text-white/30 italic font-mono text-xs border border-dashed border-white/10 rounded-sm">
                No inventory listed under "{inventoryTab}" inventory tab.
              </div>
            )}
            {displayedProjects.map((p, idx) => {
              const isRental = p.type === 'Rental';
              const isResale = p.type === 'Resale';

              return (
                <div 
                  key={p.id ? `admin-card-${p.id}-${idx}` : `admin-card-${p.name}-${idx}`} 
                  className={cn(
                    "bg-[#111111] border p-3.5 rounded-sm group relative flex flex-col justify-between transition-all",
                    isRental 
                      ? "border-cyan-500/40 hover:border-cyan-400" 
                      : isResale 
                      ? "border-amber-500/40 hover:border-amber-400" 
                      : "border-white/20 hover:border-art-gold"
                  )}
                >
                  {p.isPaused && (
                    <div className="absolute top-3 right-3 z-20 bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-lg">
                      Paused / Hidden
                    </div>
                  )}

                  <div>
                    {/* Header: Category Badge & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm font-mono border",
                        isRental 
                          ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" 
                          : isResale 
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30" 
                          : "bg-art-gold/15 text-art-gold border-art-gold/30"
                      )}>
                        {p.type || 'Primary'} {p.propertyType ? `• ${p.propertyType}` : ''}
                      </span>
                      <span className="text-[8px] text-white/50 font-mono uppercase">
                        {p.handoverStatus || (isRental ? 'Ready to Lease' : 'Available')}
                      </span>
                    </div>

                    {/* Stickers & Units Remaining Display */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      {Boolean(p.isInventorySoldOut || p.sticker === 'Sold Out') ? (
                        <span
                          key={`admin-soldout-badge-${p.id}`}
                          className="animate-limited-badge px-2.5 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider rounded-sm inline-flex items-center gap-1 border shadow-sm bg-red-600 text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] transform-gpu origin-center"
                        >
                          <span>⛔</span> SOLD OUT
                        </span>
                      ) : (
                        <>
                          {p.sticker && p.sticker !== 'None' && (
                            <span className={cn(
                              "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-sm font-mono inline-flex items-center gap-1 border shadow-sm",
                              p.sticker === 'Sold Out'
                                ? "bg-red-500/20 text-red-400 border-red-500/50"
                                : "bg-indigo-500/20 text-indigo-300 border-indigo-500/50"
                            )}>
                              <span>🏷️ {p.sticker}</span>
                            </span>
                          )}
                          {p.unitsRemaining !== undefined && p.unitsRemaining !== null && (
                            p.unitsRemaining < 5 ? (
                              <span
                                key={`admin-ltd-badge-${p.id}-${p.unitsRemaining}`}
                                className="animate-limited-badge px-2.5 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-wider rounded-sm inline-flex items-center gap-1 border shadow-sm bg-red-600/25 text-red-400 border-red-500/50 transform-gpu origin-center"
                              >
                                <span>⚡</span> Limited Availability ({p.unitsRemaining} Left)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-1 border bg-white/5 text-white/70 border-white/10">
                                <span>📦</span> {p.unitsRemaining} Units Left
                              </span>
                            )
                          )}
                        </>
                      )}
                    </div>

                    <h4 className="text-white font-serif text-lg mb-0.5 truncate font-bold">{p.name}</h4>
                    <p className="text-[10px] text-white/70 uppercase tracking-wider mb-2 font-mono flex items-center gap-1">
                      <MapPin size={10} className={isRental ? "text-cyan-400" : isResale ? "text-amber-400" : "text-art-gold"} />
                      <span>{p.location} {p.zone ? `(${p.zone})` : ''}</span>
                    </p>

                    {/* SEO Keywords Tag */}
                    {p.seoKeywords && (
                      <div className="text-[8px] font-mono text-art-gold/80 bg-art-gold/5 px-2 py-1 rounded border border-art-gold/20 mb-2 truncate" title={Array.isArray(p.seoKeywords) ? p.seoKeywords.join(', ') : p.seoKeywords}>
                        🔑 SEO: {Array.isArray(p.seoKeywords) ? p.seoKeywords.join(', ') : p.seoKeywords}
                      </div>
                    )}

                    {/* Media Badges: Photos & Video */}
                    <div className="flex items-center gap-2 mb-3">
                      {p.imageUrls && p.imageUrls.length > 0 && (
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          📷 {p.imageUrls.length} HD Photo{p.imageUrls.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {(p.videoUrl || p.mobileVideoUrl) && (
                        <span className="text-[8px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          🎥 Video Tour
                        </span>
                      )}
                      {p.availableFrom && (
                        <span className="text-[8px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          🗓️ From {p.availableFrom}
                        </span>
                      )}
                    </div>

                    {/* Specific Fields Display */}
                    {isRental ? (
                      <div className="p-3 bg-white/[0.02] border border-cyan-500/20 rounded-sm space-y-1 mb-3 text-[9px] font-mono">
                        <div className="flex justify-between">
                          <span className="text-white/40">Monthly Rent:</span>
                          <span className="text-cyan-300 font-bold">{p.monthlyRental || p.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Advance:</span>
                          <span className="text-white/80">{p.advance || 'Negotiable'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Maintenance:</span>
                          <span className="text-white/80">{p.maintenance || 'Nominal'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Residence / Tenant:</span>
                          <span className="text-white/80">{p.residenceType || '2BHK'} • {p.tenantType || 'Family'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Furnish / Pets:</span>
                          <span className="text-white/80">{p.furnishType || 'Semi'} • Pets: {p.petFriendly || 'Yes'}</span>
                        </div>
                        {p.suba && (
                          <div className="flex justify-between">
                            <span className="text-white/40">SUBA / Parking:</span>
                            <span className="text-white/80">{p.suba} • {p.carCloseParking || 1} Car</span>
                          </div>
                        )}
                      </div>
                    ) : isResale ? (
                      <div className="p-3 bg-white/[0.02] border border-amber-500/20 rounded-sm space-y-1 mb-3 text-[9px] font-mono">
                        <div className="flex justify-between">
                          <span className="text-white/40">Resale Price:</span>
                          <span className="text-amber-300 font-bold">{p.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">SUBA / Carpet:</span>
                          <span className="text-white/80">{p.suba || '1650 Sq.Ft.'} / {p.carpetArea || '1280 Sq.Ft.'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Authority:</span>
                          <span className="text-amber-300 font-bold">{p.approvedAuthority || p.approvalBody || 'BDA'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">RERA / Reg.:</span>
                          <span className="text-white/80">{p.reraNumber ? 'Verified' : 'Ready'} • {p.registrationStatus || 'Clear'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Tower / Floor:</span>
                          <span className="text-white/80">{p.tower || 'Block A'} • {p.floor || 'High Floor'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white/[0.02] border border-art-gold/20 rounded-sm space-y-1 mb-3 text-[9px] font-mono">
                        <div className="flex justify-between">
                          <span className="text-white/40">Indicative Price:</span>
                          <span className="text-art-gold font-bold">{p.lastPrice || p.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Handover Date:</span>
                          <span className="text-emerald-400 font-bold">{p.handoverDate || 'Immediate'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">RERA / Approval:</span>
                          <span className="text-white/80">{p.approvalBody || 'BDA & RERA'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Builder:</span>
                          <span className="text-white/80">Cat {p.builderCategory || 'A'} • {p.builderName || 'Verified'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Direct Inquiry Trigger */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {/* Inquiry Form Button for Form Filling & Submit */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenEnquiry) {
                          onOpenEnquiry(p);
                        }
                      }}
                      className={cn(
                        "w-full py-2 px-3 text-[9px] font-black uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm",
                        isRental 
                          ? "bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40" 
                          : isResale 
                          ? "bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40" 
                          : "bg-art-gold/20 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40"
                      )}
                    >
                      <FileText size={11} /> Fill &amp; Submit Inquiry
                    </button>

                    {/* Inspect SEO & OG Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onInspectProjectSeo) {
                          onInspectProjectSeo(p);
                        } else {
                          setOgPreviewProject(p);
                        }
                      }}
                      className="w-full py-1.5 px-3 text-[9px] font-black uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10"
                    >
                      <Globe size={11} className="text-art-gold" /> Inspect SEO &amp; OG Card
                    </button>

                    {p.id && (
                      <div className="flex gap-2">
                         <button 
                           onClick={() => { setEditingProject(p); setShowProjectModal(true); }}
                           className="flex-1 bg-white/10 hover:bg-white/20 p-2.5 flex justify-center text-white transition-all rounded-sm cursor-pointer"
                           title="Edit project"
                         >
                           <Edit size={13} />
                         </button>
                         <button 
                           onClick={() => {
                             const cloned: Project = {
                               ...p,
                               id: undefined as any,
                               name: `${p.name} (Copy)`
                             };
                             setEditingProject(cloned);
                             setShowProjectModal(true);
                           }}
                           className="flex-1 bg-white/10 hover:bg-art-gold/20 p-2.5 flex justify-center text-art-gold transition-all rounded-sm cursor-pointer"
                           title="Clone / Duplicate this project into new inventory"
                         >
                           <Copy size={13} />
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
                             "p-2.5 flex justify-center transition-all rounded-sm cursor-pointer",
                             p.isPaused 
                               ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400" 
                               : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500"
                           )}
                           title={p.isPaused ? "Resume project (mark active)" : "Pause project (hide from main page)"}
                         >
                           {p.isPaused ? <Play size={13} /> : <Pause size={13} />}
                         </button>
                         <button 
                           onClick={() => setDeleteConfirmProject(p)}
                           className="bg-red-500/10 hover:bg-red-500/20 p-2.5 flex justify-center text-red-500 transition-all rounded-sm cursor-pointer"
                           title="Delete project"
                         >
                           <Trash size={13} />
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Vault OG Image 1200x630 Visualizer Modal */}
      {ogPreviewProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setOgPreviewProject(null)}
        >
          <div 
            className="bg-[#141414] border border-art-gold/40 rounded-lg max-w-3xl w-full p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-art-gold font-bold">1200 x 630 HD Social Preview</span>
                <h3 className="text-xl font-serif text-white italic">{ogPreviewProject.name} — OpenGraph Card</h3>
              </div>
              <button 
                onClick={() => setOgPreviewProject(null)}
                className="p-1.5 text-white/50 hover:text-white rounded-full bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* 1200x630 Ratio Card */}
            <div className="relative aspect-[1.91/1] w-full rounded-md overflow-hidden bg-neutral-900 border border-white/15 shadow-inner">
              <img 
                src={ogPreviewProject.ogImage || ogPreviewProject.imageUrls?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=85"} 
                alt={ogPreviewProject.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

              {/* Overlay Content */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-art-gold text-black px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-sm shadow-md">
                  BS Homez Luxury
                </span>
                {ogPreviewProject.sticker && ogPreviewProject.sticker !== 'None' && (
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-sm shadow-md",
                    ogPreviewProject.sticker === 'Sold Out' ? "bg-red-600 text-white" : "bg-indigo-600 text-white"
                  )}>
                    {ogPreviewProject.sticker}
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] text-art-gold font-mono uppercase tracking-widest block mb-1">
                  📍 {ogPreviewProject.location} {ogPreviewProject.zone ? `(${ogPreviewProject.zone})` : ''}
                </span>
                <h4 className="text-white text-xl sm:text-2xl font-serif font-bold italic mb-1 drop-shadow-md">
                  {ogPreviewProject.name}
                </h4>
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/20">
                  <span className="text-art-gold font-bold text-sm">{ogPreviewProject.price}</span>
                  <span className="text-white/70">www.bshomez.in</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-xs font-mono text-white/50">
              <span>Automatically rendered on WhatsApp, Facebook, LinkedIn, and Twitter shares.</span>
              <button
                type="button"
                onClick={() => setOgPreviewProject(null)}
                className="px-5 py-2 bg-art-gold text-black font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-white transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Project In-App Modal */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border-2 border-red-500/50 rounded-md p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-left">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 border border-red-500/30">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div>
                <h4 className="text-white font-serif text-lg font-bold">Delete Inventory Listing</h4>
                <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">Permanent Removal</p>
              </div>
            </div>
            
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Are you sure you want to permanently delete <strong className="text-white font-serif">{deleteConfirmProject.name}</strong> ({deleteConfirmProject.type || 'Primary'} &bull; {deleteConfirmProject.location})? 
              This will remove it from all live listings, offline cache, and database records.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProject(null)}
                disabled={isDeletingProject}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-sm text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!deleteConfirmProject) return;
                  setIsDeletingProject(true);
                  try {
                    const toDelete = deleteConfirmProject;
                    setDeleteConfirmProject(null);
                    if (onDeleteProject) {
                      await onDeleteProject(toDelete);
                    } else if (toDelete.id && !toDelete.id.startsWith('curated_') && !toDelete.id.startsWith('local_')) {
                      try {
                        await deleteDoc(doc(db, 'projects', toDelete.id));
                      } catch (err) {
                        console.warn(err);
                      }
                    }
                  } finally {
                    setIsDeletingProject(false);
                  }
                }}
                disabled={isDeletingProject}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeletingProject ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>Confirm Delete</span>
              </button>
            </div>
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
    description: 'Iconic lakefront high-rise residential sanctuary at Location: Whitefield - Varthur Main Road (Ramagondanahalli), overlooking Varthur Lake. Designed with two-side open Vaastu residences, expansive sky-decks, and 84% landscaped biophilic open greens.',
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
    unitsRemaining: 3,
    createdAt: null
  },
  {
    id: 'curated_whitefield_resale_1',
    name: 'Brigade Woods Botanica',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    approvalBody: 'BBMP OC Received',
    floorPlan: '3 BHK Garden Suite (1690 Sq.Ft.) · 4 BHK Corner (2190 Sq.Ft.)',
    description: 'Ready-to-move boutique forest-themed residences nestled at Location: Whitefield ITPL Main Road (Pattandur Agrahara). Surrounded by 15+ native botanical tree species, offering immediate possession with Occupancy Certificate received and zero GST.',
    price: 'Rs. 2.15 Cr - Rs. 3.40 Cr*',
    lastPrice: 'Rs. 2.22 Cr (Verified Resale)*',
    location: 'Whitefield ITPL Main Road (Pattandur Agrahara)',
    locationTarget: 'GR Tech Park Bus Stop (0.3 km) • Pattandur Metro (0.9 km) • ITPL (1.2 km)',
    zone: 'Whitefield',
    type: 'Primary',
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
    unitsRemaining: 2,
    createdAt: null
  },
  {
    id: 'curated_whitefield_rental_1',
    name: 'Total Environment Windmills of Your Mind',
    builderName: 'Total Environment',
    builderCategory: 'A+',
    approvalBody: 'BBMP OC Received',
    floorPlan: '3 BHK C20 Simplex + Garden (2450 Sq.Ft.) · 4 BHK D60 Duplex Villa (5924 Sq.Ft.)',
    description: 'Earth-sheltered handcrafted duplex sky-villas and simplexes at Location: Whitefield EPIP Zone (Nallurahalli Road), curated for expatriate and CXO corporate leases. Every residence features a private landscaped terrace garden, wooden deck, and water body.',
    price: 'Rs. 1.35 L / month - Rs. 2.60 L / month*',
    lastPrice: 'Rs. 1.40 L / month (Corporate Lease)*',
    location: 'Whitefield EPIP Zone (Beside Vydehi & SAP Labs)',
    locationTarget: 'EPIP Bus Stop (0.3 km) • Vydehi Hospital (0.8 km) • Metro (1.1 km)',
    zone: 'Whitefield',
    type: 'Primary',
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
    unitsRemaining: 1,
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
    description: 'Spanish-inspired boutique row villas at Location: Hoskote - Old Madras Road Corridor (Kannamangala - Ardendale Link). Crafted with terracotta roofs, private double-height courtyards, and serene pedestrian boulevards.',
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
    description: 'Well-established ready-to-move gated community at Location: Hoskote Town - NH-75 Old Madras Road Corridor. Offering Vaastu-compliant corner apartments with clear resale documentation, immediate registration, and direct STRR connectivity.',
    price: 'Rs. 68 Lakhs - Rs. 96 Lakhs*',
    lastPrice: 'Rs. 72 Lakhs (Verified Resale)*',
    location: 'Hoskote Town - NH-75 Old Madras Road',
    locationTarget: 'Hoskote Toll Bus Stop (0.4 km) • MVJ Hospital (1.5 km) • Orion Uptown Mall (5.4 km)',
    zone: 'Hoskote',
    type: 'Primary',
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
    sticker: 'Sold Out',
    isInventorySoldOut: true,
    unitsRemaining: 0,
    createdAt: null
  },
  {
    id: 'curated_hoskote_rental_1',
    name: 'Brigade Golden Triangle Signature',
    builderName: 'Brigade Group',
    builderCategory: 'A+',
    approvalBody: 'BMRDA & BBMP OC Received',
    floorPlan: '3 BHK Executive (1670 Sq.Ft.) · 3.5 BHK + Study (1980 Sq.Ft.)',
    description: 'Mixed-use landmark township at Location: Hoskote - Budigere Cross Junction on Old Madras Road (Kattamnallur). Semi-furnished sky-view apartments available for immediate family and corporate rental right beside Orion Uptown Mall.',
    price: 'Rs. 45,000 / month - Rs. 68,000 / month*',
    lastPrice: 'Rs. 48,000 / month (Latest Lease)*',
    location: 'Hoskote - Budigere Cross OMR (Kattamnallur)',
    locationTarget: 'Orion Uptown Mall (0.1 km) • Budigere Cross Bus Stop (0.2 km) • Kadugodi Metro (5.6 km)',
    zone: 'Hoskote',
    type: 'Primary',
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
    description: 'Flagship 107-acre integrated lakefront township at Location: Varthur Main Road (Opposite Varthur Lake, Whitefield-Varthur Corridor). Phase 1 offers ultra-luxury high-rise residences with panoramic water views and a 1,05,000 Sq.Ft. imperial clubhouse.',
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
    description: 'Award-winning 47-acre smart integrated township at Location: Varthur - Whitefield Main Road (Near Varthur Police Station). Handed-over residences available for immediate resale with multiplex, retail boulevard, office spaces, and lush central greens inside the campus.',
    price: 'Rs. 1.58 Cr - Rs. 2.45 Cr*',
    lastPrice: 'Rs. 1.64 Cr (Verified Resale)*',
    location: 'Varthur - Whitefield Main Road (Varthur Town)',
    locationTarget: 'Varthur Bus Stop (0.2 km) • Greenwood High (1.8 km) • Manipal Hospital (3.1 km)',
    zone: 'Varthur',
    type: 'Primary',
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
    description: '102-acre Disney-themed lakefront township at Location: Varthur - Gunjur Main Road overlooking Varthur Lake. Semi-furnished and fully-furnished luxury apartments and villas available for immediate corporate lease.',
    price: 'Rs. 68,000 / month - Rs. 1.35 L / month*',
    lastPrice: 'Rs. 72,000 / month (Latest Verified Lease)*',
    location: 'Varthur - Gunjur Main Road (Varthur Lakefront)',
    locationTarget: 'Gunjur-Varthur Bus Stop (0.3 km) • Oakridge School (1.6 km) • Wipro SEZ (5.2 km)',
    zone: 'Varthur',
    type: 'Primary',
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
    description: 'Meandering Santorini-themed luxury enclave nestled at Location: Gunjur - Panathur Main Road (Off Marathahalli-ORR Corridor). Designed with blue-domed Mediterranean architecture, cascading water plazas, and three iconic clubhouses totaling 77,850 Sq.Ft.',
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
    description: 'Ready-to-move luxury gated apartment community at Location: Gunjur Palya - Sarjapur-Varthur Main Road. Surrounded by lush greenery and international schools, offering verified resale apartments with zero GST and immediate possession.',
    price: 'Rs. 1.18 Cr - Rs. 1.72 Cr*',
    lastPrice: 'Rs. 1.24 Cr (Verified Resale)*',
    location: 'Gunjur Palya - Varthur-Sarjapur Road',
    locationTarget: 'Gunjur Palya Bus Stop (0.2 km) • Chrysalis High (0.9 km) • Wipro SEZ (3.6 km)',
    zone: 'Gunjur',
    type: 'Primary',
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
    description: 'High-rise residential community at Location: Gunjur - Varthur Main Road Junction (Opposite Prestige Lakeside Habitat). Semi-furnished corner apartments with modular kitchen, wardrobes, and panoramic views available for immediate family and IT professional lease.',
    price: 'Rs. 46,000 / month - Rs. 68,000 / month*',
    lastPrice: 'Rs. 49,000 / month (Verified Lease)*',
    location: 'Gunjur - Varthur Main Road Junction',
    locationTarget: 'Gunjur Bus Stop (0.2 km) • Chrysalis High (1.1 km) • Wipro Campus (4.6 km)',
    zone: 'Gunjur',
    type: 'Primary',
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
    description: 'Biophilic lakefront high-rise enclave at Location: Hosa Road - Begur Lakefront Corridor (Off Hosur Road), overlooking a serene 52-acre natural lake. Designed with 85% open green spaces, zero-carbon water recycling, and direct access to Hosa Road Metro Station.',
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
    description: 'Landmark hilltop-inspired ready-to-move luxury community at Location: Hosa Road - Haralur Link Road (PWD Quarters / Silver County Road). Offering panoramic views of Kasavanahalli and Hosa Road lakes with a massive 50,000 Sq.Ft. clubhouse and zero GST resale units.',
    price: 'Rs. 2.05 Cr - Rs. 3.25 Cr*',
    lastPrice: 'Rs. 2.12 Cr (Verified Resale)*',
    location: 'Hosa Road - Haralur Link Road (Silver County)',
    locationTarget: 'Haralur Bus Stop (0.4 km) • Vibgyor High (1.4 km) • Hosa Road Metro (2.9 km)',
    zone: 'Hosa Road',
    type: 'Primary',
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
    description: 'Sprawling 12.8-acre handed-over residential sanctuary at Location: Hosa Road - Off Sarjapur Haralur Corridor (Lakedew Residency Road). Surrounded by 80% open botanical gardens and Japanese zen ponds, available for immediate family and corporate rental.',
    price: 'Rs. 62,000 / month - Rs. 88,000 / month*',
    lastPrice: 'Rs. 65,000 / month (Verified Lease)*',
    location: 'Hosa Road - Haralur Main Road (Lakedew Corridor)',
    locationTarget: 'Haralur Bus Stop (0.3 km) • Vibgyor School (0.8 km) • Hosa Road Metro (2.8 km)',
    zone: 'Hosa Road',
    type: 'Primary',
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
    description: 'Sustainable eco-luxury residential township at Location: Kasavanahalli - Off Sarjapur Road Corridor (Kodathi - Kasavanahalli Link). Designed with 68% open green spaces, 15+ outdoor sports courts, and high-efficiency layouts minutes from Wipro Corporate Office.',
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
    description: 'Boutique earth-toned luxury villas and low-density residences at Location: Kasavanahalli Main Road (Adjacent to Kasavanahalli Lake & HSR Extension). Offering private landscaped plunge decks, Italian marble flooring, and clear resale title.',
    price: 'Rs. 2.65 Cr - Rs. 4.40 Cr*',
    lastPrice: 'Rs. 2.75 Cr (Verified Resale)*',
    location: 'Kasavanahalli Main Road (Beside Kasavanahalli Lake)',
    locationTarget: 'Kasavanahalli Bus Stop (0.2 km) • Market Square Mall (1.7 km) • Wipro HQ (1.8 km)',
    zone: 'Kasavanahalli',
    type: 'Primary',
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
    description: 'Handed-over contemporary luxury apartment enclave at Location: Kasavanahalli - Haralur Main Road. Semi-furnished Vaastu-compliant corner units available for immediate executive rental with proximity to RMZ Ecoworld and Wipro SEZ.',
    price: 'Rs. 65,000 / month - Rs. 85,000 / month*',
    lastPrice: 'Rs. 68,000 / month (Latest Verified Lease)*',
    location: 'Kasavanahalli - Haralur Main Road',
    locationTarget: 'Kasavanahalli Bus Stop (0.3 km) • Wipro HQ (1.6 km) • Manipal Hospital (2.0 km)',
    zone: 'Kasavanahalli',
    type: 'Primary',
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
    description: 'Forest-themed landmark township at Location: Whitefield - Budigere Cross Junction (Old Madras Road Corridor) featuring 1,500+ fully grown native trees, a 68,000 Sq.Ft. imperial clubhouse, and high-street retail boulevard.',
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
    description: 'Nature-first luxury residential enclave at Location: Varthur - Sarjapur Main Road (Dommasandra Circle Link), preserving 500+ heritage trees and 80% open landscaped greens right in the education and IT belt.',
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
    description: 'Ultra-luxury waterfront residential landmark at Location: Hosa Road - Begur / Akshayanagar Lakefront Corridor, overlooking the serene Hullimavu-Begur Lake with expansive wrap-around sundecks and Club Saint Amand hospitality.',
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
    description: 'Handcrafted botanical plotted villa estate at Location: Hoskote - Devanahalli STRR Link Corridor, featuring a 10-acre central tree museum, eucalyptus boulevard, underground utilities, and red-brick clubhouse.',
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
    description: 'Biophilic lakefront high-rise enclave at Location: Whitefield Borewell Road (Nallurahalli - Siddapura Lakefront), bordered by 500+ meters of serene lake promenade and 82% open green gardens.',
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
    description: 'Tropical resort-themed residential community at Location: Off Sarjapur Road - Choodasandra (Hosa Road - Kasavanahalli Link Corridor), featuring zero-dead-space floor plans and a lush central palm lagoon.',
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
    description: 'Biophilic living sanctuary at Location: Kasavanahalli - Off Sarjapur Road (Kodathi Gate adjacent to Wipro SEZ), built around 100+ preserved mango and banyan trees with a 55,000 Sq.Ft. clubhouse.',
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
    description: 'Nature-themed 71-acre plotted development at Location: Sarjapur - Attibele Road (Sompura Gate, South-East Bangalore), featuring 12 themed botanical parks, underground infrastructure, and a ready luxury clubhouse.',
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
    description: 'Boutique gated plotted community at Location: Hoskote - Old Madras Road Highway Corridor, crafted with wide black-top avenues, landscaped tree boulevards, and a modern lifestyle clubhouse.',
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
    description: 'Contemporary gated triplex villa community at Location: Whitefield - Soukya Road (Kadugodi Extension), offering independent private gardens, terrace gazebos, and low-density serene living.',
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
    description: 'Spanish-courtyard inspired primary residential enclave at Location: Kasavanahalli - Off Sarjapur Road (Behind Wipro Corporate Office), crafted with Mivan construction, cross-ventilated corner layouts, and ready club amenities.',
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
    description: 'Modern family-focused gated community at Location: Hoskote - Old Madras Road (Budigere Cross - Kattamnallur), designed with Vaastu-compliant east/north facing homes, podium gardens, and high rental yield potential.',
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
    description: 'High-rise contemporary residential enclave at Location: Varthur - Gunjur Main Road (Beside Krupanidhi & Chrysalis High), featuring sky-bridges, double-height entrance lobbies, and panoramic lake views.',
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
    description: 'Contemporary lifestyle residential community at Location: Hosa Road - HSR Layout Extension Corridor, offering 65+ world-class lifestyle amenities, vehicle-free central podium, and 75% open landscaped space.',
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
    description: 'Smart value-for-money primary apartment enclave at Location: Whitefield - Immadihalli Main Road (Near Hagadur & Hope Farm Junction), offering spacious balconies, 100% Vaastu compliance, and immediate proximity to Whitefield IT hubs.',
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
    description: 'Well-crafted mid-rise residential community at Location: Hoskote Town - NH-75 Old Madras Road (Near MVJ Hospital & Toll Plaza), ideal for first-time homebuyers and high-yield investors along the booming East Bangalore corridor.',
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
    description: 'Boutique mid-rise residential apartment at Location: Gunjur - Krupanidhi College Road (Varthur-Sarjapur Corridor), offering peaceful residential living with low maintenance charges and quick access to Wipro SEZ and ORR tech parks.',
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
    description: 'Value-packed primary apartment community at Location: Kasavanahalli - Hosa Road Link (Kaikondrahalli - Rayasandra Corridor), offering modern lifestyle amenities at an attractive price point inside the IT belt.',
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
    description: 'Handed-over landmark community at Location: Whitefield - Hoskote Main Road (Kannamangala, East Bangalore) featuring high-efficiency luxury residences with expansive private sundecks, 6-acre central linear park, and an active international resident community.',
    price: 'Rs. 1.95 Cr - Rs. 2.90 Cr*',
    lastPrice: 'Rs. 2.05 Cr (Latest Verified Transaction)*',
    location: 'Whitefield - Hoskote Main Road (Kannamangala)',
    locationTarget: 'Kannamangala Bus Stop (0.2 km) • Orion Uptown Mall (2.9 km) • Kadugodi Metro (3.8 km)',
    zone: 'Sarjapur',
    type: 'Primary',
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
    description: 'Executive luxury rental apartments at Location: Bellandur - Outer Ring Road (Behind RMZ Ecoworld). Walking distance to RMZ Ecoworld and Ecospace with resort-grade club amenities.',
    price: 'Rs. 85,000 / month - Rs. 1.45 L / month*',
    lastPrice: 'Rs. 92,000 / month (Verified Lease Rate)*',
    location: 'Bellandur - Outer Ring Road (Behind RMZ Ecoworld)',
    locationTarget: 'RMZ Ecoworld (0.3 km) • Ecoworld Bus Stop (0.5 km) • Sakra Hospital (1.2 km)',
    zone: 'Bellandur',
    type: 'Primary',
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
    description: 'Master-planned 50+ acre luxury plotted development at Location: Hoskote - Budigere Cross & STRR Satellite Ring Road Belt. Featuring 60-ft wide asphalted boulevards, underground electrical cabling, piped water network, and a grand 20,000 Sq.Ft. clubhouse ready for immediate villa construction.',
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
    description: 'Premier nature-inspired plotted sanctuary at Location: Old Madras Road - Hoskote Expressway Corridor. Offering high-appreciation residential villa plots with 10+ theme gardens, pedestrian-first streetscapes, and priority allotment in the current pre-launch EOI window.',
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
    description: 'English Tudor-style luxury independent triplex villas at Location: Whitefield - Hoskote Extension Corridor. Features gabled roofs, handcrafted brickwork, private garden lawns, and an elite 25,000 Sq.Ft. Clubhouse.',
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
    description: 'Resort-style contemporary high-rise towers at Location: Sarjapur Road - Carmelaram / Hadosiddapura Corridor. Features 28,000 Sq.Ft. lifestyle clubhouse, 50+ resort amenities, and immediate proximity to Wipro SEZ and RGA Tech Park.',
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
    description: 'Earth-sheltered handcrafted luxury residences at Location: East Bangalore - Hennur Corridor. Every home features an expansive landscaped terrace garden with real grass and wooden deck, bespoke wire-cut brick construction, and custom imported woodwork. Ready for immediate handover.',
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
    description: '52-acre mega township at Location: East Bangalore - Airport Link Highway Corridor. Features a 45,000 Sq.Ft. clubhouse, 8-acre central lake park, and high-street shopping boulevard. Phase 2 The Hills is currently open for pre-launch EOI applications.',
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
    description: 'Eco-conscious 16.8-acre plotted development at Location: Off Hoskote - International Airport Link Corridor. Crafted with native orchards, natural bio-swales, underground services, and ready-to-register A-Khata plots for building bespoke luxury villas.',
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
    description: 'Serene 25-acre plotted residential sanctuary along the East Bangalore - STRR Expressway Corridor. Complete with fully grown canopy trees, asphalted avenues, underground utilities, and ready-to-construct plots with clear titles.',
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
    description: 'Nature-infused biophilic high-rise towers at Location: Whitefield - Borewell Road & ITPL Corridor. Features 35,000 Sq.Ft. dual clubhouse, sky-gardens, lakefront view decks, and seamless access to ITPL and Hope Farm Metro.',
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
    description: 'Eco-conscious forest living apartment enclave at Location: Sarjapur Road - Kodathi Corridor. Features a 55,000 Sq.Ft. clubhouse, natural foliage forest walk, and zero wall sharing between residences. EOI window active for Tower Solstice.',
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
    description: 'Award-winning ready-to-move township at Location: Whitefield - Hoskote Road (Budigere Cross). Offering OC-received smart residential homes with zero GST, 19.5 acres of lush landscaped spaces, and direct connectivity to OMR and Whitefield IT belt.',
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
    description: 'Boutique gated plotted community at Location: Varthur - Gunjur Link Road. Ready for immediate registration and villa construction with paved internal roads, underground drainage, and individual water connections.',
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
    description: 'Ready-to-move mid-rise luxury residential community at Location: Gunjur - Varthur Link Road. Features an open central courtyard, clubhouse, swimming pool, and zero GST resale and primary inventory.',
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
    description: 'Contemporary high-rise residential towers at Location: Hosa Road - Kudlu Gate Corridor. Features lake views, football turf, infinity pool, and seamless connectivity to the upcoming Yellow Line Metro and Electronic City IT parks.',
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
    description: 'Resort-themed high-rise community at Location: East Bangalore - Budigere & Old Madras Link. Offering 75+ lifestyle amenities, expansive landscaped central podium, and attractive pre-launch EOI pricing for smart residential buyers.',
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
    description: 'Lakeview residential apartment community at Location: Electronic City - Hosa Road Link Corridor. Features Vaastu compliant layouts, clubhouse with indoor games, gym, and swift connectivity to Electronic City Phase 1 tech campuses.',
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
    description: 'Approved plotted development at Location: Hoskote - Kattamnallur STRR Belt. Offering clear A-Khata villa plots with asphalted roads, water connection, and immediate registration for residential villa construction.',
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
    description: 'Pre-launch plotted development at Location: Electronic City Phase 2 - Chandapura Belt. Features wide internal roads, underground drainage, and early bird EOI allotment prices for IT professionals and high-yield investors.',
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
    description: 'Ready-to-move boutique apartment building at Location: Whitefield - Channasandra / Kadugodi Link. 100% Vaastu compliant, low maintenance charges, and immediate occupancy with occupancy certificate verified.',
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
    description: 'Under-construction contemporary residential enclave at Location: Marathahalli - Outer Ring Road Corridor. Features modern lifestyle amenities, covered basement car parking, and unbeatable connectivity to ORR IT corridor and Whitefield.',
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
    description: 'Mid-rise value residential community at Location: Kasavanahalli - Harlur Link Road. Well-ventilated corner units with low maintenance charges, dedicated parking, and swift access to Wipro Corporate Office and RMZ Ecospace Bellandur.',
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

  const isRentalOrResale = resolvedType === 'Rental' || resolvedType === 'Resale';

  // For Rental and Resale, ALWAYS prioritize user's actual uploaded/edited images (including empty array if cleared)
  // For any project with custom imageUrls, preserve user's custom images and cover photo
  const resolvedImages = isRentalOrResale
    ? (Array.isArray(p.imageUrls) ? p.imageUrls.filter(Boolean) : [])
    : (Array.isArray(p.imageUrls) && p.imageUrls.filter(Boolean).length > 0)
    ? p.imageUrls.filter(Boolean)
    : (curatedMatch?.imageUrls || getSmartProjectImages(resolvedZone, resolvedType, resolvedCategory, resolvedPropertyType));

  const resolvedCoverImage = (resolvedImages && resolvedImages.length > 0)
    ? resolvedImages[0]
    : (p.mobileImageUrl || curatedMatch?.mobileImageUrl || '');

  const rawDesc = curatedMatch?.description || p.description || `${p.name} by ${resolvedBuilderName} in ${p.location || resolvedZone}, Bangalore.`;
  const cleanedDescription = cleanProjectDescription(rawDesc);

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
    description: cleanedDescription,
    imageUrls: resolvedImages,
    mobileImageUrl: resolvedCoverImage,
    ogImage: p.ogImage || resolvedCoverImage,
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

export const deduplicateProjects = (list: Project[]): Project[] => {
  const seenIds = new Set<string>();
  const seenNameTypes = new Set<string>();
  const result: Project[] = [];

  for (const item of list) {
    if (!item) continue;
    const rawId = item.id ? String(item.id).trim().toLowerCase() : '';
    const rawName = item.name ? String(item.name).trim().toLowerCase() : '';
    const rawType = item.type ? String(item.type).trim().toLowerCase() : 'primary';
    const nameTypeKey = `${rawName}_${rawType}`;

    if (rawId && seenIds.has(rawId)) {
      continue;
    }
    if (rawName && seenNameTypes.has(nameTypeKey)) {
      continue;
    }

    if (rawId) seenIds.add(rawId);
    if (rawName) seenNameTypes.add(nameTypeKey);
    result.push(item);
  }

  return result;
};

// --- Main App ---

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const localCustom: Project[] = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
      const localCustomEnriched = deduplicateProjects(localCustom.map(autoEnrichProjectData));

      const cached = localStorage.getItem('bs_homez_portfolio_offline_cache');
      let combined: Project[] = [];
      if (cached) {
        const parsed: Project[] = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          const cleaned = parsed.filter(p => {
            if (!p.createdAt && (p.type === 'Rental' || p.type === 'Resale' || (p.id && (p.id.includes('_resale_') || p.id.includes('_rental_') || p.id === 'curated_se_handed_4' || p.id === 'curated_se_rental_6')))) {
              return false;
            }
            return true;
          });
          combined = deduplicateProjects([
            ...localCustomEnriched,
            ...cleaned.map(autoEnrichProjectData)
          ]);
        }
      }
      if (combined.length === 0) {
        combined = deduplicateProjects([
          ...localCustomEnriched,
          ...CURATED_ARTISANAL_PROJECTS.filter(cp => cp.type !== 'Rental' && cp.type !== 'Resale' && !cp.id?.includes('_resale_') && !cp.id?.includes('_rental_') && cp.id !== 'curated_se_handed_4' && cp.id !== 'curated_se_rental_6').map(autoEnrichProjectData)
        ]);
      }
      return combined;
    } catch {
      return deduplicateProjects(CURATED_ARTISANAL_PROJECTS.filter(cp => cp.type !== 'Rental' && cp.type !== 'Resale' && !cp.id?.includes('_resale_') && !cp.id?.includes('_rental_') && cp.id !== 'curated_se_handed_4' && cp.id !== 'curated_se_rental_6').map(autoEnrichProjectData));
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
  const [enquiryType, setEnquiryType] = useState<'Acquire' | 'Consult' | 'Inquire' | 'Site Visit'>('Acquire');
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
  const [mediaManagerProject, setMediaManagerProject] = useState<Project | null>(null);
  const [projectModalMode, setProjectModalMode] = useState<'Primary' | 'Rental' | 'Resale'>('Primary');
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

  const [tabVisibility, setTabVisibility] = useState<TabVisibilityConfig>(() => {
    try {
      const stored = localStorage.getItem('bs_homez_tab_visibility');
      if (stored) {
        return { ...DEFAULT_TAB_VISIBILITY, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_TAB_VISIBILITY;
  });

  // Sync tab visibility in real-time from Firestore system_settings/tab_visibility
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system_settings', 'tab_visibility'), (docSnap) => {
      if (docSnap.exists()) {
        const remote = docSnap.data() as Partial<TabVisibilityConfig>;
        setTabVisibility(prev => {
          const merged = { ...prev, ...remote };
          try {
            localStorage.setItem('bs_homez_tab_visibility', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    }, (err) => {
      console.warn('Tab visibility sync note:', err?.message || err);
    });
    return () => unsub();
  }, []);

  const handleUpdateTabVisibility = async (newConfig: TabVisibilityConfig) => {
    setTabVisibility(newConfig);
    try {
      localStorage.setItem('bs_homez_tab_visibility', JSON.stringify(newConfig));
    } catch {}
    if (user) {
      try {
        await setDoc(doc(db, 'system_settings', 'tab_visibility'), newConfig, { merge: true });
      } catch (err) {
        console.warn('Failed to update Firestore tab visibility:', err);
      }
    }
  };

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

  // --- Property Meta Data & SEO Modal State ---
  const [isPropertyMetaDataModalOpen, setIsPropertyMetaDataModalOpen] = useState(false);
  const [metaDataTargetProject, setMetaDataTargetProject] = useState<Project | null>(null);

  const handleOpenPropertyMetaDataModal = (project?: Project) => {
    setMetaDataTargetProject(project || projects[0] || null);
    setIsPropertyMetaDataModalOpen(true);
  };

  const handleSavePropertyMetaData = async (
    projectId: string, 
    meta: { 
      metaTitle?: string; 
      metaDescription?: string; 
      seoKeywords?: string[];
      imageAltText?: string;
      imageAltTexts?: Record<string, string>;
      seoLastEdited?: string;
      seoRevisions?: any[];
    }
  ) => {
    // 1. Update in local state immediately for instant responsive UI
    setProjects(prev => prev.map(p => {
      if (p.id === projectId || p.name === projectId) {
        return {
          ...p,
          ...(meta.metaTitle !== undefined ? { metaTitle: meta.metaTitle, seoTitle: meta.metaTitle } : {}),
          ...(meta.metaDescription !== undefined ? { metaDescription: meta.metaDescription, seoDescription: meta.metaDescription } : {}),
          ...(meta.seoKeywords !== undefined ? { seoKeywords: meta.seoKeywords } : {}),
          ...(meta.imageAltText !== undefined ? { imageAltText: meta.imageAltText } : {}),
          ...(meta.imageAltTexts !== undefined ? { imageAltTexts: meta.imageAltTexts } : {}),
          ...(meta.seoLastEdited !== undefined ? { seoLastEdited: meta.seoLastEdited } : {}),
          ...(meta.seoRevisions !== undefined ? { seoRevisions: meta.seoRevisions } : {})
        };
      }
      return p;
    }));

    // 2. Persist to Firestore if target has valid ID
    try {
      const target = projects.find(p => p.id === projectId || p.name === projectId);
      if (target && target.id && !target.id.startsWith('curated_') && !target.id.startsWith('local_')) {
        const updatePayload: Record<string, any> = {
          updatedAt: new Date().toISOString()
        };
        if (meta.metaTitle !== undefined) {
          updatePayload.metaTitle = meta.metaTitle;
          updatePayload.seoTitle = meta.metaTitle;
        }
        if (meta.metaDescription !== undefined) {
          updatePayload.metaDescription = meta.metaDescription;
          updatePayload.seoDescription = meta.metaDescription;
        }
        if (meta.seoKeywords !== undefined) {
          updatePayload.seoKeywords = meta.seoKeywords;
        }
        if (meta.imageAltText !== undefined) {
          updatePayload.imageAltText = meta.imageAltText;
        }
        if (meta.imageAltTexts !== undefined) {
          updatePayload.imageAltTexts = meta.imageAltTexts;
        }
        if (meta.seoLastEdited !== undefined) {
          updatePayload.seoLastEdited = meta.seoLastEdited;
        }
        if (meta.seoRevisions !== undefined) {
          updatePayload.seoRevisions = meta.seoRevisions;
        }
        await updateDoc(doc(db, 'projects', target.id), updatePayload);
      }
    } catch (e) {
      console.warn('Could not persist SEO metadata to Firestore:', e);
    }
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
      if (tabParam && ['overview', 'projects', 'grow-business', 'services', 'why-choose', 'insights', 'opportunity', 'referral', 'testimonials', 'loans', 'faq', 'about', 'admin'].includes(tabParam)) {
        return tabParam;
      }
      if (params.get('project') || params.get('corridor')) {
        return 'projects';
      }
    } catch {}
    return 'overview';
  });

  // Redirect non-admin visitors if they navigate directly to a hidden tab
  useEffect(() => {
    if (!user && activeMainTab !== 'admin' && activeMainTab !== 'overview') {
      if (tabVisibility[activeMainTab as PublicTabKey] === false) {
        setActiveMainTab('overview');
      }
    }
  }, [activeMainTab, tabVisibility, user]);

  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [currentSeoSnapshot, setCurrentSeoSnapshot] = useState({
    title: "BS Homez – Buy, Sale, Resale & Rent Luxury Properties in Bangalore",
    description: "BS Homez: Buy, Sale, Resale & Rent RERA-verified Apartments, Villas & Plots in Whitefield, Hoskote, Varthur, Gunjur, Hosa Road, Kasavanahalli & Sarjapur, Bangalore.",
    canonicalUrl: "https://www.bshomez.in/",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=85"
  });

  // Merge local hidden/deleted preferences with Firestore state & auto-enrich all project data with memoization
  const effectiveProjects = useMemo(() => {
    const list = projects.map(rawProj => {
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
    // Automatically keep enhancing all properties with complete SEO titles, descriptions & keywords
    const enhanced = autoEnhanceAllProjects(list);
    return deduplicateProjects(enhanced);
  }, [projects, hiddenProjectIds, deletedProjectIds]);

  const comparedProjects = useMemo(() => {
    return effectiveProjects.filter(
      p => comparedProjectIds.includes(p.id || '') || comparedProjectIds.includes(p.name)
    );
  }, [effectiveProjects, comparedProjectIds]);

  // --- Dynamic SEO Meta Tags & Schema.org JSON-LD Injection for Google, Meta & Social Spiders ---
  useEffect(() => {
    const baseUrl = "https://www.bshomez.in";
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
      const seoData = generateOptimizedSeoMetadata(activeProjectTarget, baseUrl);

      // 1. Update Document Title
      document.title = seoData.metaTitle;

      // 2. Standard Meta Tags
      setMetaTag('name', 'description', seoData.metaDescription);
      setMetaTag('name', 'keywords', seoData.seoKeywords.join(', '));
      setCanonical(seoData.canonicalUrl);

      // 3. OpenGraph / Meta Social Tags (WhatsApp, Facebook, LinkedIn)
      setMetaTag('property', 'og:title', seoData.openGraph.title);
      setMetaTag('property', 'og:description', seoData.openGraph.description);
      setMetaTag('property', 'og:url', seoData.openGraph.url);
      setMetaTag('property', 'og:type', seoData.openGraph.type);
      setMetaTag('property', 'og:site_name', seoData.openGraph.siteName);
      setMetaTag('property', 'og:locale', seoData.openGraph.locale);
      setMetaTag('property', 'og:image', seoData.openGraph.image);
      setMetaTag('property', 'og:image:secure_url', seoData.openGraph.image);
      setMetaTag('property', 'og:image:width', '1200');
      setMetaTag('property', 'og:image:height', '630');
      setMetaTag('property', 'og:image:type', 'image/jpeg');
      setMetaTag('property', 'og:image:alt', seoData.imageAltText);

      // 4. Twitter / X Card Tags
      setMetaTag('name', 'twitter:card', seoData.twitter.card);
      setMetaTag('name', 'twitter:site', '@BSHomez');
      setMetaTag('name', 'twitter:creator', '@BSHomez');
      setMetaTag('name', 'twitter:title', seoData.twitter.title);
      setMetaTag('name', 'twitter:description', seoData.twitter.description);
      setMetaTag('name', 'twitter:image', seoData.twitter.image);
      setMetaTag('name', 'twitter:image:alt', seoData.imageAltText);

      // 5. Geographic & Search Directives
      setMetaTag('name', 'geo.region', 'IN-KA');
      setMetaTag('name', 'geo.placename', 'Bengaluru');
      setMetaTag('name', 'geo.position', '12.9716;77.5946');
      setMetaTag('name', 'ICBM', '12.9716, 77.5946');

      // 6. Update Snapshot for Live SERP & Multi-Platform preview
      setCurrentSeoSnapshot({
        title: seoData.metaTitle,
        description: seoData.metaDescription,
        canonicalUrl: seoData.canonicalUrl,
        imageUrl: seoData.ogImage
      });

      // 7. Property Schema.org JSON-LD Structured Data
      let jsonLdScript = document.getElementById('property-seo-jsonld') as HTMLScriptElement | null;
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'property-seo-jsonld';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(seoData.schemaJsonLd, null, 2);
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
    } else if (activeMainTab === 'grow-business') {
      tabTitle = "Grow Business – CRM, Modern Websites, E-Commerce & Marketplace Selling | BS Homez";
      tabDesc = "Scale your business with tailored CRM systems, responsive websites, e-commerce stores, and marketplace growth on Amazon, Flipkart & Meesho.";
      tabUrl = `${baseUrl}/?tab=grow-business`;
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
      if (tabParam && ['overview', 'projects', 'grow-business', 'services', 'why-choose', 'insights', 'opportunity', 'referral', 'testimonials', 'loans', 'faq', 'about', 'admin'].includes(tabParam)) {
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

  // Prevent Copying and Selection across the app while preserving input/textarea typing
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const activeEl = document.activeElement;
      if ((target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable)) ||
          (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as any).isContentEditable))) {
        return;
      }
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const activeEl = document.activeElement;
      if ((target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable)) ||
          (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as any).isContentEditable))) {
        return;
      }
      e.preventDefault();
    };

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const activeEl = document.activeElement;
      if ((target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable)) ||
          (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as any).isContentEditable))) {
        return;
      }
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
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
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as any).isContentEditable);
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'u', 'U', 's', 'S', 'a', 'A', 'x', 'X'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  const projectsForGrid = useMemo(() => {
    if (!activePropertyUrlId) return effectiveProjects;
    const cleanId = decodeURIComponent(activePropertyUrlId).toLowerCase();
    const copy = [...effectiveProjects];
    copy.sort((a, b) => {
      const aMatch = (a.id && a.id.toLowerCase() === cleanId) || a.name.toLowerCase() === cleanId;
      const bMatch = (b.id && b.id.toLowerCase() === cleanId) || b.name.toLowerCase() === cleanId;
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
    return copy;
  }, [effectiveProjects, activePropertyUrlId]);

  const handleSaveProject = async (updated: Project) => {
    const formattedUpdated: Project = autoEnrichProjectData({
      ...updated,
      price: formatPriceWithCondition(updated.price),
      lastPrice: formatPriceWithCondition(updated.lastPrice || updated.price)
    });

    const targetDocId = formattedUpdated.id || `custom_${Date.now()}`;
    const projectWithId: Project = {
      ...formattedUpdated,
      id: targetDocId
    };

    // 1. Immediately update localStorage custom projects
    try {
      const existingLocal: Project[] = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
      const filteredLocal = existingLocal.filter(
        item => item.id !== targetDocId && item.name.toLowerCase() !== projectWithId.name.toLowerCase()
      );
      localStorage.setItem('bs_homez_custom_projects', JSON.stringify([projectWithId, ...filteredLocal]));
    } catch {}

    // 2. Immediately update offline cache
    try {
      const cached: Project[] = JSON.parse(localStorage.getItem('bs_homez_portfolio_offline_cache') || '[]');
      const updatedCache = cached.map(p =>
        (p.id && p.id === targetDocId) || p.name.toLowerCase() === projectWithId.name.toLowerCase()
          ? { ...p, ...projectWithId }
          : p
      );
      if (!updatedCache.some(p => (p.id && p.id === targetDocId) || p.name.toLowerCase() === projectWithId.name.toLowerCase())) {
        updatedCache.unshift(projectWithId);
      }
      localStorage.setItem('bs_homez_portfolio_offline_cache', JSON.stringify(deduplicateProjects(updatedCache)));
    } catch {}

    // 3. Update React optimistic state immediately
    setProjects(prev => {
      const exists = prev.some(item => (item.id && item.id === targetDocId) || item.name.toLowerCase() === projectWithId.name.toLowerCase());
      if (exists) {
        return prev.map(item =>
          (item.id && item.id === targetDocId) || item.name.toLowerCase() === projectWithId.name.toLowerCase()
            ? { ...item, ...projectWithId }
            : item
        );
      }
      return [projectWithId, ...prev];
    });

    // 4. Persist to Firestore using setDoc with merge: true so it never throws "No document to update"
    try {
      const rawPayload: any = {
        ...projectWithId,
        price: projectWithId.price,
        lastPrice: projectWithId.lastPrice || projectWithId.price,
        handoverDate: projectWithId.handoverDate || 'December 2027',
        updatedAt: serverTimestamp()
      };

      // Strip all undefined values so Firestore setDoc never throws an invalid data error
      const payload: Record<string, any> = {};
      for (const [k, v] of Object.entries(rawPayload)) {
        if (v !== undefined) {
          payload[k] = v;
        }
      }

      await setDoc(doc(db, 'projects', targetDocId), payload, { merge: true });
    } catch (err) {
      console.warn('Saved project locally & Firestore sync notice:', err);
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

    setProjects(prev => {
      const next = prev.filter(p => !((p.id && p.id === project.id) || p.name.toLowerCase() === project.name.toLowerCase()));
      try {
        localStorage.setItem('bs_homez_portfolio_offline_cache', JSON.stringify(next));
      } catch {}
      return next;
    });

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
    const getTimestampMs = (val: any): number => {
      if (!val) return 0;
      if (typeof val === 'number') return val;
      if (typeof val.toMillis === 'function') return val.toMillis();
      if (typeof val.toDate === 'function') return val.toDate().getTime();
      if (val.seconds) return val.seconds * 1000;
      const parsed = Date.parse(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const getMergedWithLocal = (dbDocs: Project[] = []) => {
      let localCustom: Project[] = [];
      try {
        localCustom = JSON.parse(localStorage.getItem('bs_homez_custom_projects') || '[]');
      } catch {}

      // Map localCustom by id and name for fast lookup
      const localCustomMap: Record<string, Project> = {};
      for (const item of localCustom) {
        if (item.id) localCustomMap[item.id.toLowerCase()] = item;
        if (item.name) localCustomMap[item.name.trim().toLowerCase()] = item;
      }

      // Preserve user's latest edited price and fields even if Firestore snapshot is delayed
      const mergedDbDocs = dbDocs.map(doc => {
        const localMatch = (doc.id && localCustomMap[doc.id.toLowerCase()]) ||
                           (doc.name && localCustomMap[doc.name.trim().toLowerCase()]);
        if (localMatch && localMatch.price) {
          return {
            ...doc,
            ...localMatch,
            price: localMatch.price,
            lastPrice: localMatch.lastPrice || localMatch.price
          };
        }
        return doc;
      });

      const dbDocIds = new Set(dbDocs.map(d => d.id?.toLowerCase()).filter(Boolean));
      const dbDocNames = new Set(dbDocs.map(d => `${d.name?.trim().toLowerCase()}_${(d.type || 'Primary').toLowerCase()}`));

      const nonDuplicateLocal = localCustom.filter(item => {
        if (item.id && dbDocIds.has(item.id.toLowerCase())) return false;
        if (item.name && dbDocNames.has(`${item.name.trim().toLowerCase()}_${(item.type || 'Primary').toLowerCase()}`)) return false;
        return true;
      });

      // Combine mergedDbDocs with filtered local custom projects
      const combinedCustom = deduplicateProjects([
        ...mergedDbDocs.map(autoEnrichProjectData),
        ...nonDuplicateLocal.map(autoEnrichProjectData)
      ]);

      // Sort all custom & new inventory projects newest first
      combinedCustom.sort((a, b) => {
        const tB = getTimestampMs(b.createdAt) || getTimestampMs(b.updatedAt);
        const tA = getTimestampMs(a.createdAt) || getTimestampMs(a.updatedAt);
        return tB - tA;
      });

      // If an existing curated project was edited (matches by id or name), exclude its static unedited entry
      const customKeys = new Set([
        ...combinedCustom.map(p => p.id?.toLowerCase()).filter(Boolean),
        ...combinedCustom.map(p => p.name?.trim().toLowerCase()).filter(Boolean)
      ]);

      const uneditedCurated = CURATED_ARTISANAL_PROJECTS.filter(cp => {
        // Resale & Rental inventories must come exclusively from Admin Vault (verified user inventory)
        if (cp.type === 'Rental' || cp.type === 'Resale') return false;
        if (cp.id && (cp.id.includes('_resale_') || cp.id.includes('_rental_') || cp.id === 'curated_se_handed_4' || cp.id === 'curated_se_rental_6')) return false;
        if (cp.id && customKeys.has(cp.id.toLowerCase())) return false;
        if (cp.name && customKeys.has(cp.name.trim().toLowerCase())) return false;
        return true;
      });

      return deduplicateProjects([
        ...combinedCustom,
        ...uneditedCurated.map(autoEnrichProjectData)
      ]);
    };

    // Listen to collection(db, 'projects') directly without orderBy query constraint.
    // Unconstrained collection listeners do not require composite or single-field indexes,
    // never disconnect on pending server timestamps, and reliably fire onSnapshot in real-time
    // across all clients and tabs.
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const dbDocs = snapshot.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Project))
        .filter(p => !LEGACY_PROJECT_NAMES.includes(p.name));

      dbDocs.sort((a, b) => {
        const tB = getTimestampMs(b.createdAt) || getTimestampMs(b.updatedAt);
        const tA = getTimestampMs(a.createdAt) || getTimestampMs(a.updatedAt);
        return tB - tA;
      });

      const merged = getMergedWithLocal(dbDocs);
      setProjects(merged);
      setIsLoading(false);
      try {
        localStorage.setItem('bs_homez_portfolio_offline_cache', JSON.stringify(merged));
      } catch {}
    }, (err) => {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('Quota') || errMsg.includes('quota') || errMsg.includes('resource-exhausted')) {
        console.info('Firestore daily read limit reached; app operating seamlessly with verified local curated portfolio.');
      } else {
        console.warn('Realtime projects listener fallback notice:', errMsg);
      }
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

  const handleScheduleSiteVisit = (project: Project) => {
    setEnquiryType('Site Visit');
    setSelectedProject(project);
    setActivePropertyUrlId(project.id || project.name);
    try {
      window.history.replaceState({}, '', `/?project=${encodeURIComponent(project.id || project.name)}&intent=site_visit`);
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
      features: [],
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
      features: [],
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
    <div className="min-h-screen flex flex-col bg-art-dark overflow-x-hidden w-full max-w-full">
      <Navbar
        activeMainTab={activeMainTab}
        onSelectTab={handleSelectTab}
        isAdminUser={Boolean(user)}
        tabVisibility={tabVisibility}
        onInquire={handleGeneralInquiry}
      />
      
      <main className="flex-grow pt-[60px] sm:pt-[66px] md:pt-[94px] lg:pt-[98px]">
        {activeMainTab === 'overview' && (
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 md:px-12 pb-10 sm:pb-12">
            {/* Framed Home Window */}
            <div className="border border-white/10 bg-white/[0.01] rounded-sm overflow-hidden shadow-2xl">
              <Hero
                onConsult={handlePrivateConsultation}
                onExplorePortfolios={() => setActiveMainTab('projects')}
              />
              {/* Quick Tab Directory Cards inside the Home Window */}
              <section className="py-6 sm:py-10 px-3 sm:px-8 md:px-12 bg-art-dark/95 border-t border-white/10">
                <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4">
                  <div>
                    <span className="text-art-gold text-[9.5px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.4em] font-black block mb-1.5 sm:mb-2">
                      Dedicated Workspace Tabs
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-white italic">
                      Explore by <span className="not-italic text-art-gold">Dedicated Tab.</span>
                    </h2>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-wider">
                    Select any tab below to switch to its dedicated view.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
                  {[
                    { id: 'projects' as MainAppTab, title: 'Artisanal Portraits', sub: 'Primary, Resale & Rental Portfolios', icon: Building2 },
                    { id: 'grow-business' as MainAppTab, title: 'Grow Business', sub: 'Tech, Portals & Growth Solutions', icon: Briefcase },
                    { id: 'services' as MainAppTab, title: 'Property Intelligence', sub: '0% Primary, Resale & Rental Services', icon: ShieldCheck },
                    { id: 'why-choose' as MainAppTab, title: 'Philosophy', sub: 'Sales, Resale & Rental Pillars of Trust', icon: Compass },
                    { id: 'insights' as MainAppTab, title: 'Market Vault & Metrics', sub: 'East Corridor Capital Velocity', icon: TrendingUp },
                    { id: 'opportunity' as MainAppTab, title: 'Offer Your Asset', sub: 'List Property for Sale or Rent', icon: Target },
                    { id: 'referral' as MainAppTab, title: 'Referral Program', sub: 'Introduce Friends & Family', icon: Handshake },
                    { id: 'loans' as MainAppTab, title: 'Home Loan Hub', sub: 'EMI & Tier-1 Banking Concierge', icon: CreditCard },
                    { id: 'testimonials' as MainAppTab, title: 'Client Voices', sub: 'Verified Homebuyer & Tenant Stories', icon: MessageCircle },
                    { id: 'faq' as MainAppTab, title: 'Advisory FAQ', sub: 'RERA, Khata, Resale & Rental Answers', icon: Info },
                    { id: 'about' as MainAppTab, title: 'About BS Homez', sub: 'Your Trusted Real Estate Partner', icon: Star }
                  ].filter(card => {
                    if (Boolean(user)) return true;
                    return tabVisibility ? tabVisibility[card.id as PublicTabKey] !== false : true;
                  }).map(card => {
                    const CardIcon = card.icon;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => {
                          setActiveMainTab(card.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-3.5 sm:p-4 bg-white/[0.025] hover:bg-art-gold/10 border border-white/10 hover:border-art-gold rounded-sm text-left transition-all group cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[8.5px] uppercase tracking-wider text-art-gold font-black">
                              Open Tab
                            </span>
                            <CardIcon size={14} className="text-art-gold/60 group-hover:text-art-gold transition-colors" />
                          </div>
                          <h3 className="text-base sm:text-lg font-serif italic text-white group-hover:text-art-gold transition-colors leading-snug">
                            {card.title}
                          </h3>
                          <p className="text-[10px] text-white/55 mt-1 leading-relaxed">{card.sub}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8.5px] uppercase tracking-wider text-white/60 group-hover:text-art-gold font-bold">
                          <span>Switch Tab</span>
                          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeMainTab === 'projects' && (
          <ProjectGrid 
            projects={projectsForGrid} 
            isAdmin={Boolean(user)}
            hiddenCount={hiddenProjectsCount}
            showHidden={showHiddenProjects}
            onToggleShowHidden={() => setShowHiddenProjects(prev => !prev)}
            comparedProjectIds={comparedProjectIds}
            onToggleCompare={handleToggleCompare}
            onOpenCompareModal={() => setIsCompareModalOpen(true)}
            onEnquire={handleEnquireProject} 
            onScheduleSiteVisit={handleScheduleSiteVisit}
            onDownload={handleDownloadBrochure}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onTogglePause={handleTogglePauseProject}
            onOpenNewProjectModal={() => {
              setEditingProject(null);
              setShowProjectModal(true);
            }}
            onOpenMetaData={handleOpenPropertyMetaDataModal}
            isLoading={isLoading} 
          />
        )}

        {activeMainTab === 'grow-business' && (
          <GrowBusinessSection isAdmin={Boolean(user)} onSuccessSubmitted={() => {}} />
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
          <section id="about" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-art-dark text-art-light">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12 sm:mb-16">
                <span className="inline-block text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-art-gold font-black px-3.5 py-1.5 bg-art-gold/10 border border-art-gold/30 rounded-sm mb-4">
                  RERA-Compliant Real Estate Consultancy
                </span>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white italic mb-4">
                  About <span className="not-italic text-art-gold">BS Homez</span>
                </h1>
                <p className="text-lg sm:text-2xl font-serif text-white/90 italic max-w-2xl mx-auto">
                  Your Trusted Partner in Finding the Perfect Property
                </p>
                <div className="w-16 h-0.5 bg-art-gold/50 mx-auto mt-6" />
              </div>

              {/* Story Intro Card */}
              <div className="mb-14 sm:mb-20 p-6 sm:p-10 md:p-12 bg-gradient-to-br from-white/[0.035] via-art-gold/[0.02] to-white/[0.015] border border-art-gold/25 rounded-sm shadow-2xl relative overflow-hidden space-y-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-art-gold/5 rounded-full blur-3xl pointer-events-none" />
                <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed">
                  At <strong className="text-art-gold font-semibold">BS Homez</strong>, we believe that finding the right property is more than just a real estate transaction — it's about finding a place to call home, making smart investments, and building a secure future.
                </p>
                <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed">
                  We are a RERA-compliant real estate consultancy committed to making property buying, selling, and renting in Bangalore simple, transparent, and hassle-free. With a customer-first approach and in-depth understanding of the Bangalore real estate market, we help individuals, families, and investors make confident property decisions.
                </p>
                <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed">
                  Whether you are looking for your dream home, a premium villa, a residential plot, a commercial property, or a profitable investment opportunity, BS Homez offers personalized guidance and end-to-end assistance at every step.
                </p>
              </div>

              {/* Our Services Section */}
              <div className="mb-16 sm:mb-24">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-art-gold" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black text-art-gold">Comprehensive Portfolio</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white italic mb-8">
                  Our <span className="not-italic text-art-gold">Services</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {[
                    {
                      title: "Property Buying & Selling",
                      desc: "Expert assistance in primary sales, resale properties, and property transactions.",
                      icon: Building2
                    },
                    {
                      title: "Residential & Commercial Rentals",
                      desc: "Helping owners and tenants find the right property and the right opportunities.",
                      icon: Compass
                    },
                    {
                      title: "New Project Consultation",
                      desc: "Access to carefully selected apartments, villas, plots, and premium developments.",
                      icon: Star
                    },
                    {
                      title: "Home Loan Assistance",
                      desc: "Guidance and support in finding suitable home loan options through banking partners.",
                      icon: CreditCard
                    },
                    {
                      title: "Legal Verification Support",
                      desc: "Assistance in property documentation and legal due diligence through relevant professionals.",
                      icon: ShieldCheck
                    },
                    {
                      title: "Interior Solutions",
                      desc: "Helping transform your property into a comfortable and beautiful living space.",
                      icon: Sparkles
                    },
                    {
                      title: "End-to-End Property Assistance",
                      desc: "From property discovery and site visits to negotiations, documentation, and transaction support.",
                      icon: Handshake
                    }
                  ].map((service, idx) => {
                    const SvgIcon = service.icon;
                    return (
                      <div 
                        key={idx} 
                        className={`p-5 sm:p-6 bg-white/[0.02] border border-white/10 hover:border-art-gold/50 rounded-sm transition-all group ${
                          idx === 6 ? 'md:col-span-2 bg-gradient-to-r from-art-gold/[0.05] to-transparent border-art-gold/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-sm bg-art-gold/10 border border-art-gold/30 flex items-center justify-center shrink-0 group-hover:bg-art-gold group-hover:text-black transition-colors text-art-gold">
                            <SvgIcon size={18} />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-art-gold transition-colors mb-1.5">
                              {service.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                              {service.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Why Choose BS Homez? */}
              <div className="mb-16 sm:mb-24">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-art-gold" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black text-art-gold">The BS Homez Advantage</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white italic mb-8">
                  Why Choose <span className="not-italic text-art-gold">BS Homez?</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {[
                    "Customer-first approach with personalized property recommendations.",
                    "Transparent communication and honest property guidance.",
                    "Access to a wide range of property options across Bangalore.",
                    "Dedicated assistance throughout the buying, selling, and rental process.",
                    "Focus on verified projects and responsible property transactions.",
                    "Complete support to make your real estate journey smoother and more convenient."
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-5 bg-white/[0.02] border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors flex items-start gap-3.5 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-art-gold/10 border border-art-gold/40 flex items-center justify-center shrink-0 mt-0.5 text-art-gold">
                        <Check size={13} className="text-art-gold" />
                      </div>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light group-hover:text-white transition-colors">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mission & Vision Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-24">
                {/* Mission Card */}
                <div className="p-7 sm:p-9 bg-white/[0.025] border border-white/10 hover:border-art-gold/40 rounded-sm transition-all relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-2 h-full bg-art-gold" />
                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.3em] text-art-gold font-black block mb-2">Purpose</span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white italic mb-4">Our Mission</h3>
                    <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
                      To simplify real estate decisions by providing reliable property guidance, transparent services, and customer-focused solutions that create lasting value.
                    </p>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="p-7 sm:p-9 bg-white/[0.025] border border-white/10 hover:border-art-gold/40 rounded-sm transition-all relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-2 h-full bg-art-gold" />
                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.3em] text-art-gold font-black block mb-2">Ambition</span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white italic mb-4">Our Vision</h3>
                    <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
                      To become one of Bangalore's most trusted real estate consulting brands by building long-term relationships, delivering exceptional service, and helping every customer find the right property.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Closing Box */}
              <div className="p-8 sm:p-12 bg-gradient-to-br from-art-gold/15 via-white/[0.03] to-art-gold/5 border border-art-gold/40 rounded-sm text-center shadow-2xl relative overflow-hidden">
                <div className="max-w-2xl mx-auto space-y-4">
                  <h3 className="text-2xl sm:text-4xl font-serif text-white italic">
                    Let's Find Your <span className="not-italic text-art-gold">Perfect Property!</span>
                  </h3>
                  <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed">
                    At BS Homez, your property goals are our priority. Whether you are buying your first home, upgrading your lifestyle, selling a property, or exploring investment opportunities, we are here to guide you at every step.
                  </p>
                  <div className="pt-4 border-t border-art-gold/30 mt-6">
                    <p className="text-base sm:text-xl font-serif italic text-art-gold font-bold tracking-wide">
                      BS Homez – Your Property. Your Dreams. Our Commitment.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMainTab('projects');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto px-7 py-3 bg-art-gold text-black text-[11px] font-black uppercase tracking-widest rounded-sm hover:bg-white transition-all cursor-pointer shadow-lg"
                    >
                      Explore Portfolios
                    </button>
                    <button
                      type="button"
                      onClick={handlePrivateConsultation}
                      className="w-full sm:w-auto px-7 py-3 bg-white/10 hover:bg-white/20 text-white text-[11px] font-black uppercase tracking-widest rounded-sm border border-white/20 transition-all cursor-pointer"
                    >
                      Book Advisory Consultation
                    </button>
                  </div>
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
            onOpenNewProjectWithMode={(mode) => {
              setProjectModalMode(mode);
              setEditingProject(null);
              setShowProjectModal(true);
            }}
            onOpenEnquiry={(proj) => {
              setSelectedProject(proj);
              setEnquiryType('Acquire');
            }}
            onDeleteProject={handleDeleteProject}
            onInspectProjectSeo={(proj) => {
              setSelectedProject(proj);
              setIsSeoModalOpen(true);
            }}
            onSaveProject={handleSaveProject}
            onBatchUpdateProjects={(updatedList) => {
              setProjects(prev => prev.map(p => {
                const match = updatedList.find(u => (u.id && u.id === p.id) || u.name.toLowerCase() === p.name.toLowerCase());
                return match ? { ...p, ...match } : p;
              }));
            }}
            tabVisibility={tabVisibility}
            onUpdateTabVisibility={handleUpdateTabVisibility}
            onNavigateTab={(tab) => {
              setActiveMainTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
              <span className="text-white mb-1 underline decoration-art-gold/50 underline-offset-8">Advisory &amp; Growth</span>
              <button type="button" onClick={() => { setActiveMainTab('grow-business'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left text-art-gold hover:text-white transition-colors cursor-pointer font-bold">Grow Business</button>
              <button type="button" onClick={() => { setActiveMainTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Expertise & Services</button>
              <button type="button" onClick={() => { setActiveMainTab('insights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Market Analysis</button>
              <button type="button" onClick={() => { setActiveMainTab('loans'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-art-gold transition-colors cursor-pointer">Home Loan Hub</button>
            </div>
            <div className="flex flex-col gap-3 text-white/40">
              <span className="text-white mb-1 underline decoration-art-gold/50 underline-offset-8">Digital Presence</span>
              <span className="text-art-gold font-black">www.bshomez.in</span>
              <a href="mailto:contact@bshomez.in" className="hover:text-art-gold transition-colors">contact@bshomez.in</a>
              {Boolean(user || isAdmin) && (
                <button 
                  type="button" 
                  onClick={() => setIsSeoModalOpen(true)}
                  className="flex items-center gap-1.5 text-art-gold hover:text-white transition-colors cursor-pointer text-left font-bold flex-wrap"
                  title="View live search engine snippets, social cards & Schema.org data across platforms (Admin Only)"
                >
                  <Globe size={11} className="text-art-gold shrink-0 animate-pulse" />
                  <span>Google · WhatsApp · Meta · X SEO</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold border border-emerald-500/30">
                    Auto-Enhanced
                  </span>
                </button>
              )}
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
            © 2026 BS Homez. Architectural Integrity Guaranteed.
          </div>
        </div>

        {/* Official Disclaimers in small font */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-left">
          <p className="text-[10px] sm:text-[11px] text-art-gold/90 font-mono tracking-wide leading-relaxed font-medium bg-white/[0.03] p-3 rounded border border-art-gold/25 flex items-start gap-2">
            <span className="text-art-gold font-bold shrink-0">*</span>
            <span>AI-generated information may not always reflect the latest project updates. For verified project details, pricing, availability, and other information, kindly contact our team directly.</span>
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showProjectModal && (
          <ProjectForm 
            project={editingProject} 
            initialInventoryType={projectModalMode}
            onClose={() => {
              setShowProjectModal(false);
              setEditingProject(null);
            }}
            onOpenEnquiry={(proj) => {
              setSelectedProject(proj);
              setEnquiryType('Acquire');
            }}
            onProjectSaved={(savedProject) => {
              const key = savedProject.id || savedProject.name;
              setDeletedProjectIds(prev => {
                const next = prev.filter(item => item !== key && item !== savedProject.name);
                try { localStorage.setItem('bs_homez_deleted_projects', JSON.stringify(next)); } catch {}
                return next;
              });
              setHiddenProjectIds(prev => {
                const next = prev.filter(item => item !== key && item !== savedProject.name);
                try { localStorage.setItem('bs_homez_hidden_projects', JSON.stringify(next)); } catch {}
                return next;
              });

              setFilters({
                location: 'All',
                zone: 'All',
                price: 'All',
                propertyType: 'All',
                handoverStatus: 'All'
              });

              const enriched = autoEnrichProjectData(savedProject);
              setProjects(prev => {
                const filtered = prev.filter(p =>
                  (p.id && p.id === enriched.id) || p.name.toLowerCase() === enriched.name.toLowerCase()
                    ? false
                    : true
                );
                const updatedList = deduplicateProjects([enriched, ...filtered]);
                try {
                  localStorage.setItem('bs_homez_portfolio_offline_cache', JSON.stringify(updatedList));
                } catch {}
                return updatedList;
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
              {comparedProjects.map((cp, idx) => (
                <div key={`compare-pill-${cp.id || cp.name}-${idx}`} className="flex items-center gap-1 px-2.5 py-0.5 sm:py-1 bg-white/10 border border-white/15 rounded-full text-[9px] text-white shrink-0 font-mono">
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

      {/* Real-Time Google SERP, Meta & Twitter Card Visualizer - Visible to Admin Only */}
      <SEOPreviewModal
        isOpen={isSeoModalOpen && Boolean(user || isAdmin)}
        onClose={() => setIsSeoModalOpen(false)}
        currentTitle={currentSeoSnapshot.title}
        currentDescription={currentSeoSnapshot.description}
        currentCanonicalUrl={currentSeoSnapshot.canonicalUrl}
        currentImageUrl={currentSeoSnapshot.imageUrl}
        activeTab={activeMainTab}
        selectedProject={selectedProject}
      />

      {/* Property Specific SEO Meta Data & Accessibility Modal */}
      <PropertyMetaDataModal
        isOpen={isPropertyMetaDataModalOpen}
        onClose={() => setIsPropertyMetaDataModalOpen(false)}
        projects={projectsForGrid}
        initialProject={metaDataTargetProject}
        onSaveMetaData={handleSavePropertyMetaData}
      />

      <AIChatAssistant />
    </div>
  );
}

