import React, { useState, useEffect } from 'react';
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
  deleteDoc
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
  ChevronRight, 
  Info, 
  X,
  Play,
  User,
  ShieldCheck,
  TrendingUp,
  Plus,
  Trash,
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
  Building2
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
import { Project, Enquiry } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={cn("flex flex-col group", className)}>
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-10 overflow-hidden">
        <svg viewBox="0 0 100 80" className="w-full h-full fill-art-gold transition-transform duration-700 group-hover:scale-110">
          <path d="M0 80 L50 10 L100 80 H80 L50 35 L20 80 Z" className="opacity-40" />
          <path d="M15 80 L50 25 L85 80 H70 L50 45 L30 80 Z" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex text-3xl font-serif tracking-[-0.05em] items-baseline">
          <span className="text-white font-medium">BS</span>
          <span className="text-art-gold italic ml-1">HOMEZ</span>
        </div>
      </div>
    </div>
    <div className="text-[6px] uppercase tracking-[0.6em] text-white/30 font-black mt-2">
      Curating Key Moments
    </div>
  </div>
);

const MarketInsights = () => {
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
    <section id="insights" className="py-48 px-12 bg-art-dark border-t border-white/5 relative">
      <div className="absolute right-12 top-24 z-10 hidden lg:block">
        <span className="vertical-text text-[9px] text-white/10 font-bold tracking-[0.5em] uppercase">Intelligence / Analytics</span>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-start mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-art-gold text-[10px] uppercase tracking-[0.6em] font-black block mb-6">Market Vault</span>
            <h2 className="text-6xl md:text-8xl font-serif text-white leading-tight italic">
              Strategic <br /> <span className="not-italic text-art-gold">Metrics.</span>
            </h2>
          </motion.div>
          <div className="space-y-8">
            <p className="text-white/40 text-[13px] leading-[2] uppercase tracking-widest font-medium max-w-md">
              Our proprietary intelligence engine tracks capital appreciation across Bangalore's primary growth sectors.
            </p>
            <div className="flex gap-12">
               <div className="flex flex-col gap-2">
                 <span className="text-white text-3xl font-serif italic">+24%</span>
                 <span className="text-[8px] uppercase tracking-widest text-art-gold font-bold">Avg. YoY Appreciation</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-white text-3xl font-serif italic">₹480Cr+</span>
                 <span className="text-[8px] uppercase tracking-widest text-art-gold font-bold">Asset Volume Advisory</span>
               </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Chart */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-12 rounded-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
               <TrendingUp className="text-art-gold/20" size={64} />
             </div>
             <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 mb-12">Capital Velocity / East Corridor</h3>
             <div className="h-[400px]">
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

          <div className="lg:col-span-4 flex flex-col gap-12">
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8">Asset Breakdown</h3>
               <div className="h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={distributionData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                       {distributionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: 'none', fontSize: '10px' }} />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div className="bg-art-gold p-10 rounded-sm">
              <span className="text-black text-[9px] font-black uppercase tracking-widest block mb-4">Investment Alpha</span>
              <p className="text-black text-xl font-serif italic mb-6">"Strategic location selection precedes architectural preference."</p>
              <div className="w-12 h-px bg-black" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 px-12 py-8 flex justify-between items-center transition-all bg-gradient-to-b from-art-dark via-art-dark/40 to-transparent">
    <a href="#" className="relative z-10 hover:opacity-80 transition-opacity">
      <Logo />
    </a>
    <div className="relative z-10 hidden md:flex items-center gap-12 text-[10px] uppercase font-semibold tracking-[0.4em] text-white/50">
      <a href="#projects" className="hover:text-art-gold transition-colors">Portfolios</a>
      <a href="#why-choose" className="hover:text-art-gold transition-colors">Philosophy</a>
      <a href="#insights" className="hover:text-art-gold transition-colors">Market Intelligence</a>
      <a href="#services" className="hover:text-art-gold transition-colors">Expertise</a>
      <a href="#enquiry" className="hover:text-art-gold transition-colors">Vault</a>
    </div>
    <div className="relative z-10 flex items-center gap-8">
      <a href="#enquiry" className="hidden lg:block text-art-gold text-[10px] uppercase tracking-[0.5em] font-black hover:text-white transition-colors">
        Inquire
      </a>
      <div className="w-[1px] h-6 bg-white/20 hidden lg:block" />
      <button className="flex items-center gap-3 group">
        <div className="w-8 h-[1px] bg-art-gold transition-all group-hover:w-16" />
        <span className="text-white text-[9px] uppercase tracking-[0.3em] font-bold">Index</span>
      </button>
    </div>
  </nav>
);

const Hero = () => (
  <section className="h-screen w-full relative flex items-center overflow-hidden bg-art-dark">
    {/* Cinematic Backdrop */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-art-dark/70 z-10" />
      <img 
        src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000" 
        alt="Luxury Estuary" 
        className="w-full h-full object-cover grayscale opacity-40 scale-105"
        referrerPolicy="no-referrer"
      />
    </div>

    {/* Vertical Graphic Elements */}
    <div className="absolute left-10 bottom-24 z-20 hidden lg:block">
      <div className="flex flex-col items-center gap-12">
        <div className="w-[1px] h-32 bg-art-gold/30" />
        <span className="vertical-text text-[9px] text-white/20 font-bold select-none tracking-widest uppercase">Pinnacle Living / Bangalore</span>
      </div>
    </div>

    <div className="relative z-20 w-full max-w-7xl mx-auto px-12">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="text-art-gold font-medium tracking-[0.6em] text-[10px] uppercase block mb-10 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-art-gold/40" />
              Bespoke Real Estate Advisory
            </span>
            <h1 className="text-8xl md:text-[140px] font-serif text-white leading-[0.85] tracking-tighter mb-12 italic">
              Legacy <br />
              <span className="not-italic text-art-gold/80">Refined.</span>
            </h1>

            {/* Highly Prominent Brokerage Message */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8, duration: 1.2 }}
               className="mb-16 inline-flex flex-col md:flex-row md:items-center gap-6 p-10 border border-art-gold/10 bg-white/[0.01] backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-art-gold/40 to-transparent" />
              <span className="text-6xl md:text-8xl font-serif text-art-gold italic leading-none">0%</span>
              <div className="flex flex-col">
                <span className="text-white text-3xl md:text-4xl font-serif tracking-widest italic font-light">Brokerage Fee</span>
                <span className="text-art-gold/60 text-[8px] uppercase tracking-[0.5em] font-black mt-2">On All Primary Market Portfolio Acquisitions</span>
              </div>
            </motion.div>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-12">
              <p className="text-white/40 max-w-sm text-[11px] leading-[1.8] font-medium uppercase tracking-[0.2em] mb-2">
                Strategically Curating high-performance residential portfolios for the discerning global citizen across Bangalore's exclusive corridors.
              </p>
              <div className="flex items-center gap-6">
                 <motion.a 
                  href="#projects"
                  whileHover={{ scale: 1.02 }}
                  className="bg-art-gold text-black px-12 py-5 text-[10px] uppercase font-black tracking-[0.3em]"
                >
                  Explore Portfolios
                </motion.a>
                <a href="#enquiry" className="text-white text-[10px] uppercase font-black tracking-[0.3em] border-b border-white/20 pb-1 hover:border-art-gold transition-all">
                  Private Consultation
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Modern Navigation Hub */}
    <div className="absolute right-12 bottom-12 z-20 hidden lg:flex flex-col items-end gap-12">
      <div className="flex flex-col items-end gap-2 text-right">
        <span className="text-white text-3xl font-serif">100%</span>
        <span className="text-[8px] uppercase tracking-widest text-art-gold font-bold">Verified Direct Inventory</span>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] text-white font-bold tracking-widest">EAST BANGALORE</span>
          <span className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Primary Jurisdiction</span>
        </div>
        <div className="w-[1px] h-10 bg-white/10" />
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] text-white font-bold tracking-widest">RESALE + PRIMARY</span>
          <span className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Lifecycle Stages</span>
        </div>
      </div>
    </div>
  </section>
);

const Services = () => (
  <section id="services" className="py-48 px-12 bg-art-dark relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-art-gold/30 to-transparent" />
    
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-24 items-end mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-art-gold text-[10px] uppercase tracking-[0.6em] font-black block mb-6">Expertise & Nexus</span>
          <h2 className="text-6xl md:text-8xl font-serif text-white leading-tight italic">
            Property <br /> <span className="not-italic text-art-gold">Intelligence.</span>
          </h2>
        </motion.div>
        <div className="max-w-md">
          <p className="text-white/40 text-[13px] leading-[2] uppercase tracking-widest font-medium pb-6 border-b border-art-gold/20">
            We operate at the intersection of architectural passion and strategic asset management, providing a gateway to the most coveted residential sanctuaries.
          </p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-12">
        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all">
          <div className="w-16 h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-12 group-hover:bg-art-gold transition-all duration-500">
            <ShieldCheck className="text-art-gold group-hover:text-black" size={32} />
          </div>
          <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-4 block">01 / Acquisition</span>
          <h3 className="text-3xl font-serif text-white mb-8">Primary Portfolios</h3>
          <p className="text-xs text-white/30 leading-[2] uppercase tracking-[0.1em] font-medium mb-12 flex-grow">
            Direct access to major builders across all lifecycle stages—from EOI and Pre-launch to Ready-to-Move.
          </p>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-8 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> 0% CLIENT BROKERAGE
          </div>
        </div>

        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all">
          <div className="w-16 h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-12 group-hover:bg-art-gold transition-all duration-500">
            <TrendingUp className="text-art-gold group-hover:text-black" size={32} />
          </div>
          <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-4 block">02 / Growth</span>
          <h3 className="text-3xl font-serif text-white mb-8">Resale & Investment</h3>
          <p className="text-xs text-white/30 leading-[2] uppercase tracking-[0.1em] font-medium mb-12 flex-grow">
            Maximize your equity through strategic secondary market positioning. We engineer high-yield exit strategies and portfolio rebalancing for long-term capital appreciation.
          </p>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-8 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> PORTFOLIO OPTIMIZATION
          </div>
        </div>

        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all">
          <div className="w-16 h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-12 group-hover:bg-art-gold transition-all duration-500">
            <CreditCard className="text-art-gold group-hover:text-black" size={32} />
          </div>
          <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-4 block">03 / Nexus</span>
          <h3 className="text-3xl font-serif text-white mb-8">Capital Concierge</h3>
          <p className="text-xs text-white/30 leading-[2] uppercase tracking-[0.1em] font-medium mb-12 flex-grow">
            Strategic alliances with Tier-1 banking institutions. We orchestrate comprehensive doorstep concierge services, ensuring your financial structuring is as seamless as your sanctuary selection.
          </p>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-8 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> SYNCHRONIZED APPROVALS
          </div>
        </div>

        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-art-gold transition-all">
          <div className="w-16 h-16 bg-art-gold/10 flex items-center justify-center rounded-full mb-12 group-hover:bg-art-gold transition-all duration-500">
            <Home className="text-art-gold group-hover:text-black" size={32} />
          </div>
          <span className="text-[10px] text-art-gold font-bold uppercase tracking-widest mb-4 block">04 / Lifestyle</span>
          <h3 className="text-3xl font-serif text-white mb-8">Bespoke Design</h3>
          <p className="text-xs text-white/30 leading-[2] uppercase tracking-[0.1em] font-medium mb-12 flex-grow">
            Curated interior design collaborations and 3D architectural visualization to personalize your new sanctuary.
          </p>
          <div className="flex items-center gap-4 text-[9px] uppercase font-black text-art-gold tracking-widest pt-8 border-t border-white/5">
             <span className="w-8 h-[1px] bg-art-gold" /> 3D VISUALIZATION SUPPORT
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyChoose = () => {
  const points = [
    {
      title: "Hands-on Sales Expertise",
      description: "Proven experience in the real estate market with a strong track record of successful deal closures.",
      icon: <Briefcase size={24} />,
      id: "01"
    },
    {
      title: "Trusted by Leading Builders",
      description: "Established relationships with all major builders, ensuring credibility and access to prime projects.",
      icon: <Handshake size={24} />,
      id: "02"
    },
    {
      title: "Tailored Solutions",
      description: "Bespoke property recommendations designed around each customer’s unique requirements.",
      icon: <Target size={24} />,
      id: "03"
    },
    {
      title: "Zero Brokerage",
      description: "Transparent transactions with no hidden charges—your savings are our priority in primary sales.",
      icon: <Percent size={24} />,
      id: "04"
    },
    {
      title: "Priority Assistance",
      description: "Dedicated support at every stage, ensuring a smooth and hassle-free experience.",
      icon: <Star size={24} />,
      id: "05"
    },
    {
      title: "End-to-End Guidance",
      description: "From property search to final closure, we stand by you throughout the journey.",
      icon: <Compass size={24} />,
      id: "06"
    },
    {
      title: "Customer First",
      description: "Your happiness is our success—we go the extra mile to deliver absolute satisfaction.",
      icon: <Heart size={24} />,
      id: "07"
    }
  ];

  return (
    <section id="why-choose" className="py-48 px-12 bg-white/[0.01] relative overflow-hidden">
      <div className="absolute right-0 top-0 w-px h-full bg-white/5 hidden lg:block" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32">
          <div className="max-w-2xl">
            <span className="text-art-gold text-[10px] uppercase tracking-[0.6em] font-black block mb-6">The Distinction</span>
            <h2 className="text-6xl md:text-8xl font-serif text-white tracking-tight italic">
              Why Choose <br /> <span className="not-italic text-art-gold">BS Homez.</span>
            </h2>
          </div>
          <div className="lg:pb-8">
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-white/30">
              <div className="w-12 h-px bg-art-gold/30" /> Seven Pillars of Trust
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24">
          {points.map((point) => (
            <motion.div 
              key={point.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group h-full flex flex-col"
            >
              <div className="text-[10px] font-mono text-art-gold/20 font-black mb-6 group-hover:text-art-gold transition-colors duration-500">
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
          ))}
          
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
            <a href="#enquiry" className="flex items-center justify-between text-black text-[10px] uppercase font-black tracking-widest border-t border-black/20 pt-8 group/btn">
              Consult Now
              <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: Project; onEnquire: (p: Project) => void }> = ({ project, onEnquire }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-white/[0.01] border border-white/[0.05] hover:border-art-gold/40 transition-all duration-700"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {project.videoUrl ? (
          <div className="w-full h-full relative">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
            >
              <source src={project.mobileVideoUrl && window.innerWidth < 768 ? project.mobileVideoUrl : project.videoUrl} type="video/mp4" />
            </video>
          </div>
        ) : (
          <img 
            src={project.mobileImageUrl && window.innerWidth < 768 ? project.mobileImageUrl : project.imageUrls[0]} 
            alt={project.name}
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-art-dark via-transparent to-transparent opacity-90 z-10" />
        
        <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
          <div className="flex flex-wrap gap-2">
            <span className="bg-art-gold text-black text-[9px] font-black px-4 py-1.5 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              {project.type}
            </span>
            {project.handoverStatus && (
              <span className={cn(
                "backdrop-blur-md text-white text-[8px] px-4 py-1.5 font-bold uppercase tracking-widest border border-white/20 transition-all duration-500",
                "shadow-[0_0_10px_rgba(255,255,255,0.1)]",
                project.handoverStatus === 'Ready to Move' && "bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse",
                ['EOI', 'Prelaunch'].includes(project.handoverStatus) && "bg-art-gold/20 border-art-gold/40 text-art-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-pulse",
                project.handoverStatus === 'Under Construction' && "bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                project.handoverStatus === 'Nearing Completion' && "bg-orange-500/20 border-orange-500/40 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]",
                project.handoverStatus === 'Official Launch' && "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse"
              )}>
                {project.handoverStatus}
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-20">
           <div className="flex items-center gap-3 mb-2">
             <span className="text-art-gold text-[8px] uppercase tracking-[0.6em] font-black">{project.segment}</span>
             <span className="w-1 h-1 bg-white/20 rounded-full" />
             <span className="text-white/60 text-[8px] uppercase tracking-[0.4em] font-medium">{project.propertyType}</span>
           </div>
           <h3 className="text-4xl font-serif text-white italic group-hover:text-art-gold transition-colors duration-500">{project.name}</h3>
           
           <div className="flex flex-wrap gap-4 mt-6">
             <div className="flex items-center gap-2 text-white/40 text-[9px] uppercase tracking-widest font-bold">
               <MapPin size={10} className="text-art-gold" />
               {project.location}
             </div>
             {project.configuration && project.configuration.length > 0 && (
               <div className="flex items-center gap-2 text-white/40 text-[9px] uppercase tracking-widest font-bold">
                 <LayoutGrid size={10} className="text-art-gold" />
                 {project.configuration.join(' • ')}
               </div>
             )}
           </div>
        </div>
      </div>
      
      <div className="px-10 py-12 flex flex-col flex-grow relative z-20">
        <div className={cn(
          "text-[11px] text-white/40 leading-[2] uppercase tracking-widest transition-all italic",
          isExpanded ? "" : "line-clamp-3"
        )}>
          "{project.description}"
        </div>
        
        {project.description.length > 200 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[9px] uppercase tracking-[0.4em] text-art-gold font-black mt-6 hover:text-white transition-colors text-left"
          >
            {isExpanded ? 'Collapse Narrative' : 'The Full Portrait'}
          </button>
        )}

        {project.paymentOffers && (
          <div className="mt-10 p-6 bg-art-gold/[0.08] border border-art-gold/40 rounded-sm relative group/offer shadow-[0_0_40px_rgba(212,175,55,0.08)] overflow-hidden">
            <div className="absolute inset-0 bg-art-gold/20 blur-3xl opacity-0 group-hover/offer:opacity-100 transition-opacity duration-1000" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-art-gold to-transparent" />
            <span className="text-[8px] uppercase tracking-[0.5em] font-black text-art-gold block mb-3 relative drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">Financial Architecture</span>
            <p className="text-[12px] text-white font-serif italic leading-relaxed relative group-hover/offer:text-art-gold transition-colors duration-500 font-bold tracking-wide">{project.paymentOffers}</p>
          </div>
        )}
        
        <div className="mt-12 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Capital Value</span>
            <p className="text-art-gold text-2xl font-serif tracking-tighter italic">{project.price}</p>
          </div>
          <button 
            onClick={() => onEnquire(project)}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-white hover:text-art-gold transition-colors group/btn"
          >
            Acquire
            <div className="w-8 h-[1px] bg-art-gold group-hover/btn:w-12 transition-all" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectGrid = ({ projects, onEnquire }: { projects: Project[], onEnquire: (p: Project) => void }) => (
  <section id="projects" className="py-48 px-12 bg-art-dark relative">
    <div className="absolute left-12 top-0 w-px h-full bg-white/5 hidden lg:block" />
    
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-24 items-end mb-32">
        <div>
          <span className="text-art-gold text-[10px] uppercase tracking-[0.6em] font-black block mb-6">Archive / Portfolios</span>
          <h2 className="text-6xl md:text-8xl font-serif text-white tracking-widest italic group">
            Artisanal <br /> <span className="not-italic text-art-gold group-hover:tracking-normal transition-all duration-1000">Portraits.</span>
          </h2>
        </div>
        <div className="pb-6 border-b border-art-gold/20">
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">Bangalore East Corridors • Exclusive Inventory</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-16">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onEnquire={onEnquire} />
        ))}
      </div>
    </div>
  </section>
);

const EnquiryModal = ({ project, onClose }: { project: Project | null, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
        message: formData.message,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-art-dark w-full max-w-xl border border-white/10 rounded-sm shadow-2xl p-12 overflow-hidden"
      >
        {success ? (
          <div className="py-12 text-center">
            <div className="w-24 h-24 bg-art-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-art-gold" size={48} />
            </div>
            <h3 className="text-4xl font-serif mb-4 italic text-white">Message Delivered</h3>
            <p className="text-white/50 tracking-widest uppercase text-[10px]">Our advisor will reach out for {project.name}</p>
          </div>
        ) : (
          <>
            <button onClick={onClose} className="absolute top-10 right-10 p-2 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
              <X size={24} />
            </button>
            <div className="mb-12 border-b border-white/10 pb-8">
              <span className="text-art-gold uppercase tracking-[0.4em] text-[10px] mb-4 block font-bold">Priority Access Request</span>
              <h3 className="text-4xl font-serif text-white italic">Enquire for <span className="text-art-gold not-italic">{project.name}</span></h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Individual Identity</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-sm p-5 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Contact Channel</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-sm p-5 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20"
                    placeholder="+91 Mobile"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] mb-2 block text-white/40 font-bold">Email Communication</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-sm p-5 text-white focus:border-art-gold outline-none transition-all placeholder:text-white/20"
                  placeholder="name@domain.com"
                />
              </div>
              <button 
                disabled={submitting}
                className="w-full bg-art-gold text-black py-5 rounded-sm uppercase tracking-[0.3em] text-[11px] font-black hover:bg-white transition-all disabled:opacity-50 mt-4 shadow-xl"
              >
                {submitting ? 'VALIDATING...' : 'SUBMIT PRIORITY ACCESS'}
              </button>
            </form>
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

const ProjectForm = ({ project, onClose }: { project?: Project | null, onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: project?.name || '',
    description: project?.description || '',
    price: project?.price || '',
    location: project?.location || '',
    type: project?.type || 'Primary Sale',
    propertyType: project?.propertyType || 'Flat',
    configuration: project?.configuration || [],
    segment: project?.segment || 'Luxury',
    handoverStatus: project?.handoverStatus || 'Under Construction',
    paymentOffers: project?.paymentOffers || '',
    imageUrls: project?.imageUrls || [''],
    mobileImageUrl: project?.mobileImageUrl || '',
    videoUrl: project?.videoUrl || '',
    mobileVideoUrl: project?.mobileVideoUrl || '',
    features: project?.features || ['']
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = {
        ...formData,
        createdAt: project?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      if (project?.id) {
        await setDoc(doc(db, 'projects', project.id), data);
      } else {
        await addDoc(collection(db, 'projects'), data);
      }
      onClose();
    } catch (err: any) {
      if (err.message?.includes('resource-exhausted') || err.message?.includes('maximum allowed queued writes')) {
         setError("Database limit reached. This usually happens when uploaded images/videos are too large. Please use smaller files (under 700KB) or external URLs.");
      } else {
         handleFirestoreError(err, OperationType.WRITE, 'projects');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-art-dark border border-white/10 p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <h3 className="text-3xl font-serif text-white">{project ? 'Edit Portfolio Archive' : 'Curate New Portfolio'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid lg:grid-cols-2 gap-12 text-left">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Project Identifier</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="The Royal Orchard"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Capital Valuation</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="₹4.5Cr onwards"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Geographic Focus</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="Whitefield, East Bangalore"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Project Classification</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="Primary Sale">Primary Sale</option>
                    <option value="Resale">Resale</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Portfolio Segment</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                    value={formData.propertyType}
                    onChange={e => setFormData({...formData, propertyType: e.target.value as any})}
                  >
                    <option value="Flat">Flat</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Market Positioning</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                    value={formData.segment}
                    onChange={e => setFormData({...formData, segment: e.target.value})}
                    placeholder="Ultra-Luxury | Premium | Bespoke"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Units Configuration (Select Multiple)</label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
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
                        "p-3 text-[9px] border transition-all uppercase tracking-widest text-center",
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

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Handover Phase</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                  value={formData.handoverStatus}
                  onChange={e => setFormData({...formData, handoverStatus: e.target.value as any})}
                >
                  <option value="EOI">EOI</option>
                  <option value="Prelaunch">Prelaunch</option>
                  <option value="Official Launch">Official Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Nearing Completion">Nearing Completion</option>
                  <option value="Ready to Move">Ready to Move</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Financial / Payment Offers</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all"
                  value={formData.paymentOffers}
                  onChange={e => setFormData({...formData, paymentOffers: e.target.value})}
                  placeholder="20:80 Payment Plan | Zero Registration Fee..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Project Portfolio Narrative (Max 2000 chars)</label>
                <textarea 
                  required
                  rows={8}
                  maxLength={2000}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-art-gold transition-all text-sm leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="The architecture embodies a timeless dialogue between nature and modernism..."
                />
                <div className="text-[9px] text-right text-white/20 font-mono">
                  {formData.description?.length}/2000
                </div>
              </div>
            </div>

            {/* Right Column: Uploads */}
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FileDropzone 
                    label="Desktop Wide Image (16:9)" 
                    previewUrl={formData.imageUrls?.[0]}
                    onUpload={(url) => setFormData({...formData, imageUrls: [url]})}
                  />
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-2 text-[10px] text-white/40 outline-none focus:border-art-gold"
                    value={formData.imageUrls?.[0]}
                    onChange={e => setFormData({...formData, imageUrls: [e.target.value]})}
                    placeholder="...or External Image Link"
                  />
                </div>
                <div className="space-y-4">
                  <FileDropzone 
                    label="Mobile Portrait Image (9:16)" 
                    previewUrl={formData.mobileImageUrl}
                    onUpload={(url) => setFormData({...formData, mobileImageUrl: url})}
                  />
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-2 text-[10px] text-white/40 outline-none focus:border-art-gold"
                    value={formData.mobileImageUrl}
                    onChange={e => setFormData({...formData, mobileImageUrl: e.target.value})}
                    placeholder="...or Mobile Image Link"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FileDropzone 
                    label="Desktop Cinematics" 
                    type="video"
                    accept="video/mp4"
                    previewUrl={formData.videoUrl}
                    onUpload={(url) => setFormData({...formData, videoUrl: url})}
                  />
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-2 text-[10px] text-white/40 outline-none focus:border-art-gold"
                    value={formData.videoUrl}
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="...or Video Link (.mp4)"
                  />
                </div>
                <div className="space-y-4">
                  <FileDropzone 
                    label="Mobile Cinematics" 
                    type="video"
                    accept="video/mp4"
                    previewUrl={formData.mobileVideoUrl}
                    onUpload={(url) => setFormData({...formData, mobileVideoUrl: url})}
                  />
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-2 text-[10px] text-white/40 outline-none focus:border-art-gold"
                    value={formData.mobileVideoUrl}
                    onChange={e => setFormData({...formData, mobileVideoUrl: e.target.value})}
                    placeholder="...or Portrait Video Link"
                  />
                </div>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                <h4 className="text-[10px] uppercase font-black text-art-gold tracking-widest mb-4">Upload Guidelines</h4>
                <ul className="text-[9px] text-white/40 space-y-2 uppercase leading-relaxed font-bold">
                  <li className="flex gap-3"><CheckCircle2 size={12} className="text-art-gold shrink-0" /> Images are auto-compressed to ~200kb</li>
                  <li className="flex gap-3"><CheckCircle2 size={12} className="text-art-gold shrink-0" /> Videos must be under 800kb for direct upload</li>
                  <li className="flex gap-3"><CheckCircle2 size={12} className="text-art-gold shrink-0" /> High-res assets? Use external link fields</li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            disabled={submitting}
            className="w-full bg-art-gold text-black py-6 uppercase tracking-[0.4em] font-black hover:bg-white transition-all shadow-xl disabled:opacity-50"
          >
            {submitting ? 'VALIDATING ASSETS...' : project ? 'SYNCHRONIZE ARCHIVE' : 'PUBLISH TO PORTFOLIO'}
          </button>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-center"
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

const AdminView = ({ enquiries, projects }: { enquiries: Enquiry[], projects: Project[] }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'portfolio'>('leads');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <div className="py-24 px-8 max-w-7xl mx-auto">
      <div className="mb-12 border-b border-white/10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-serif italic text-white flex items-center gap-6">
            <User className="text-art-gold" size={40} /> Admin <span className="not-italic text-art-gold">Vault</span>
          </h2>
          <p className="text-white/30 uppercase tracking-[0.4em] text-[10px] mt-4 font-bold">Synchronized Multi-Asset Management</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-sm">
           <button 
             onClick={() => setActiveTab('leads')}
             className={cn(
               "px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all",
               activeTab === 'leads' ? "bg-art-gold text-black" : "text-white/40 hover:text-white"
             )}
           >
             Customer Intelligence
           </button>
           <button 
             onClick={() => setActiveTab('portfolio')}
             className={cn(
               "px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all",
               activeTab === 'portfolio' ? "bg-art-gold text-black" : "text-white/40 hover:text-white"
             )}
           >
             Portfolio Curator
           </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-white/10 text-[10px] uppercase tracking-[0.2em] font-black text-art-gold">
               <tr>
                 <th className="px-10 py-8">Identity</th>
                 <th className="px-10 py-8">Portfolio Interests</th>
                 <th className="px-10 py-8">Communication</th>
                 <th className="px-10 py-8">Intelligence</th>
                 <th className="px-10 py-8">Origin</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {enquiries.length === 0 && (
                 <tr>
                   <td colSpan={5} className="px-10 py-20 text-center text-white/20 italic tracking-widest">No intelligence recorded in current session.</td>
                 </tr>
               )}
               {enquiries.map((enq) => (
                 <tr key={enq.id} className="hover:bg-white/5 transition-colors group">
                   <td className="px-10 py-8 font-serif text-lg text-white">{enq.customerName}</td>
                   <td className="px-10 py-8">
                     <span className="text-art-gold font-mono text-sm uppercase tracking-tighter">{enq.projectName}</span>
                   </td>
                   <td className="px-10 py-8 text-[11px] font-mono">
                     <div className="flex flex-col gap-2">
                       <span className="text-white">{enq.customerPhone}</span>
                       <span className="text-white/40">{enq.customerEmail}</span>
                     </div>
                   </td>
                   <td className="px-10 py-8 text-[11px] text-white/50 italic max-w-sm line-clamp-2 leading-relaxed">
                     {enq.message ? `"${enq.message}"` : 'NO CONTEXT PROVIDED'}
                   </td>
                   <td className="px-10 py-8">
                     <span className={cn(
                       "text-[9px] px-3 py-1 rounded-sm uppercase font-black tracking-widest",
                       enq.type === 'WhatsApp' ? "bg-green-500/20 text-green-500 border border-green-500/20" : "bg-blue-500/20 text-blue-500 border border-blue-500/20"
                     )}>
                       {enq.type}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
              className="bg-art-gold text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Curate New Project
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="bg-white/5 border border-white/10 p-6 rounded-sm group relative">
                <div className="aspect-[4/5] mb-6 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all">
                  <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white font-serif mb-1 truncate">{p.name}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">{p.location}</p>
                <div className="flex gap-2">
                   <button 
                     onClick={() => { setEditingProject(p); setShowProjectModal(true); }}
                     className="flex-1 bg-white/10 hover:bg-white/20 p-3 flex justify-center text-white transition-all rounded-sm"
                   >
                     <Edit size={14} />
                   </button>
                   <button 
                     onClick={async () => {
                       if (confirm('Verify deletion of this portfolio entry?')) {
                         await deleteDoc(doc(db, 'projects', p.id!));
                       }
                     }}
                     className="bg-red-500/10 hover:bg-red-500/20 p-3 flex justify-center text-red-500 transition-all rounded-sm"
                   >
                     <Trash size={14} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showProjectModal && (
        <ProjectForm 
          project={editingProject} 
          onClose={() => setShowProjectModal(false)} 
        />
      )}
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    location: 'All',
    price: 'All',
    propertyType: 'All',
    handoverStatus: 'All'
  });

  const filteredProjects = projects.filter(p => {
    if (filters.location !== 'All' && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.propertyType !== 'All' && p.propertyType !== filters.propertyType) return false;
    if (filters.handoverStatus !== 'All' && p.handoverStatus !== filters.handoverStatus) return false;
    
    // Price filtering logic (rough approximation based on string containing values)
    if (filters.price !== 'All') {
      const priceStr = p.price.toLowerCase();
      if (filters.price === 'Under Rs. 1 Cr') {
         // Check for "L" (Lakhs) or "Rs. 0" or values < 1 Cr
         const isLakhs = priceStr.includes('l');
         const isLowCr = priceStr.includes('0.') && priceStr.includes('cr');
         if (!isLakhs && !isLowCr) return false;
      } else if (filters.price === 'Rs. 1 Cr - 3 Cr') {
         // Check for 1, 2 or 3 Cr
         const hasMidCr = /([1-2](\.\d+)?|3(\.0+)?)\s*cr/.test(priceStr);
         if (!hasMidCr) return false;
      } else if (filters.price === 'Rs. 3 Cr+') {
         // Check for values > 3 Cr
         const match = priceStr.match(/(\d+(\.\d+)?)\s*cr/);
         if (match) {
           const val = parseFloat(match[1]);
           if (val < 3) return false;
         } else {
           return false;
         }
      }
    }
    return true;
  });

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Using popup as it works better in iframes/sandbox usually
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Automatically show admin if user is logged in
      if (u) setIsAdmin(true);
      else setIsAdmin(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    // Initial fetch for projects (Mocking some initial data if firestore is empty)
    const seedProjects = async () => {
      try {
        const snap = await getDocs(collection(db, 'projects'));
        if (snap.empty) {
          const initialProjects: Project[] = [
            {
              name: "The Royal Orchard",
              description: "Ultra-luxury villas in Whitefield with private pools.",
              price: "Rs. 4.5 Cr - Rs. 8.2 Cr",
              location: "Whitefield, East Bangalore",
              type: "Primary Sale",
              propertyType: "Villa",
              configuration: ["3 BHK", "4 BHK", "5 BHK"],
              segment: "Luxury",
              imageUrls: ["https://picsum.photos/seed/luxury-villa/800/1000"],
              features: ["Private Gym", "24/7 Security", "Infinity Pool"],
              handoverStatus: "Under Construction",
              paymentOffers: "Pay 25% now, 75% on possession",
              createdAt: serverTimestamp()
            },
            {
              name: "East Gate Residences",
              description: "Modern apartments close to IT hubs.",
              price: "Rs. 85 L - Rs. 1.2 Cr",
              location: "Sarjapur Road, Bangalore",
              type: "Resale",
              propertyType: "Flat",
              configuration: ["2 BHK", "3 BHK"],
              segment: "Premium",
              imageUrls: ["https://picsum.photos/seed/apartments/800/1000"],
              features: ["Clubhouse", "Park Facing", "Smart Home Ready"],
              handoverStatus: "Ready to Move",
              paymentOffers: "Ready Possession - Move In Now",
              createdAt: serverTimestamp()
            },
            {
               name: "Azure Lakes",
               description: "Premium plots overlooking the scenic Jakkur Lake.",
               price: "Rs. 1.2 Cr - Rs. 2.3 Cr",
               location: "East Bangalore",
               type: "Primary Sale",
               propertyType: "Plot",
               configuration: ["Plots"],
               segment: "Bespoke",
               imageUrls: ["https://picsum.photos/seed/plots/800/1000"],
               features: ["Lake Facing", "Underground Cabling", "Organic Garden"],
               handoverStatus: "EOI",
               paymentOffers: "Early Bird Pricing - EOI Open",
               createdAt: serverTimestamp()
            }
          ];
          for (const p of initialProjects) {
            await addDoc(collection(db, 'projects'), p);
          }
        }
      } catch (error) {
        console.warn("Project seeding skipped or failed:", error);
      }
    };
    seedProjects();

    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));

    return () => unsubProjects();
  }, []);

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

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <WhyChoose />
      
      <main>
        <ProjectGrid projects={filteredProjects} onEnquire={setSelectedProject} />
        <MarketInsights />
        
        <section id="about" className="py-32 px-8 bg-art-dark text-art-light border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-6xl font-serif mb-10 italic">Guided <span className="not-italic text-art-gold">Excellence</span></h2>
            <p className="text-lg font-light text-white/50 tracking-wide leading-relaxed mb-16 max-w-2xl mx-auto">
              BS Homez tied up with all major builders. We are currently serving East Bangalore and expanding rapidly across the garden city. 
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

        {/* Feature: Requirement Search / Recommendation placeholder */}
        <section className="py-32 px-8 bg-art-dark">
           <div className="max-w-5xl mx-auto border border-white/10 p-16 rounded-sm bg-white/5 backdrop-blur-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-art-gold/5 rounded-bl-full" />
             <div className="relative z-10">
               <h3 className="text-5xl font-serif mb-10 text-center italic text-white">Find Your <span className="not-italic text-art-gold">Sanctuary</span></h3>
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                 <div>
                   <label className="text-[10px] uppercase tracking-[0.3em] mb-3 block font-bold text-white/40">Location Target</label>
                   <select 
                    className="w-full bg-white/5 border border-white/10 rounded-sm p-5 outline-none focus:border-art-gold text-white text-sm"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                   >
                     <option value="All">All Locations</option>
                     <option value="East Bangalore">East Bangalore</option>
                     <option value="North Bangalore">North Bangalore</option>
                     <option value="Sarjapur">Sarjapur Road</option>
                     <option value="Whitefield">Whitefield</option>
                   </select>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] mb-3 block font-bold text-white/40">Capital Allocation</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-5 outline-none focus:border-art-gold text-white text-sm"
                      value={filters.price}
                      onChange={(e) => setFilters({...filters, price: e.target.value})}
                    >
                      <option value="All">Any Capital</option>
                      <option value="Under Rs. 1 Cr">Under Rs. 1 Cr</option>
                      <option value="Rs. 1 Cr - 3 Cr">Rs. 1 Cr - 3 Cr</option>
                      <option value="Rs. 3 Cr+">Rs. 3 Cr+</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] mb-3 block font-bold text-white/40">Portfolio Type</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-5 outline-none focus:border-art-gold text-white text-sm"
                      value={filters.propertyType}
                      onChange={(e) => setFilters({...filters, propertyType: e.target.value as any})}
                    >
                      <option value="All">All Types</option>
                      <option value="Flat">Flat</option>
                      <option value="Villa">Villa</option>
                      <option value="Plot">Plot</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] mb-3 block font-bold text-white/40">Handover Status</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-sm p-5 outline-none focus:border-art-gold text-white text-sm"
                      value={filters.handoverStatus}
                      onChange={(e) => setFilters({...filters, handoverStatus: e.target.value as any})}
                    >
                      <option value="All">Any Status</option>
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="EOI">EOI</option>
                      <option value="Prelaunch">Prelaunch</option>
                      <option value="Nearing Completion">Nearing Completion</option>
                    </select>
                 </div>
               </div>
               <div className="flex gap-4 mt-12">
                 <button 
                  onClick={() => {
                    const el = document.getElementById('projects');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 bg-white text-black py-5 rounded-sm uppercase tracking-[0.3em] text-[11px] font-black hover:bg-art-gold transition-all"
                 >
                   View Matching Portfolios ({filteredProjects.length})
                 </button>
                 <button 
                  onClick={() => setFilters({ location: 'All', price: 'All', propertyType: 'All', handoverStatus: 'All' })}
                  className="px-10 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-[9px] font-bold transition-all"
                 >
                   Reset
                 </button>
               </div>
             </div>
           </div>
        </section>

        {/* Admin/Customer Info section - Toggleable for demo */}
        <div className="flex justify-center py-10 opacity-40 hover:opacity-100 transition-opacity flex-col items-center gap-4">
           {!user ? (
             <button 
               onClick={handleLogin}
               className="text-[10px] bg-white/10 px-6 py-2 rounded-sm uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-all"
             >
               <ShieldCheck size={14} /> Admin Relationship Login
             </button>
           ) : (
             <div className="flex flex-col items-center gap-2">
               <span className="text-[10px] uppercase tracking-widest text-white/50">Logged in as {user.email}</span>
               <div className="flex gap-4">
                 <button 
                   onClick={() => setIsAdmin(!isAdmin)}
                   className="text-[10px] bg-art-gold/20 text-art-gold px-6 py-2 rounded-sm uppercase tracking-widest font-bold flex items-center gap-2"
                 >
                   {isAdmin ? 'Hide Vault' : 'Reveal Vault'}
                 </button>
                 <button 
                   onClick={handleLogout}
                   className="text-[10px] bg-red-500/10 text-red-500 px-6 py-2 rounded-sm uppercase tracking-widest font-bold flex items-center gap-2"
                 >
                   Logout
                 </button>
               </div>
             </div>
           )}
        </div>

        {isAdmin && <AdminView enquiries={enquiries} projects={projects} />}
      </main>

      <footer className="bg-art-dark text-art-light py-20 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <Logo className="scale-125 origin-left" />
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.2em] font-bold">
            <div className="flex flex-col gap-4 text-white/40">
              <a href="#" className="hover:text-art-gold transition-colors">Featured Portfolios</a>
              <a href="#" className="hover:text-art-gold transition-colors">Resale Intelligence</a>
              <a href="#" className="hover:text-art-gold transition-colors">Developer Insights</a>
            </div>
            <div className="flex flex-col gap-4 text-white/40">
              <a href="#" className="hover:text-art-gold transition-colors">Transparency Policy</a>
              <a href="#" className="hover:text-art-gold transition-colors">Customer Vault</a>
              <a href="#" className="hover:text-art-gold transition-colors">Market Analysis</a>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
            © 2026 BS Homez. Architectural Integrity Guaranteed.
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProject && (
          <EnquiryModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
