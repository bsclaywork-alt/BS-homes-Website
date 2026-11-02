import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Globe, 
  ShoppingCart, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Save, 
  Check, 
  Zap,
  CreditCard,
  Search,
  Smartphone,
  Layers,
  Package,
  Store,
  Tag,
  BarChart3,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CrmPlanComparison } from './CrmPlanComparison';

interface GrowBusinessSectionProps {
  onSuccessSubmitted?: () => void;
}

const AVAILABLE_SERVICES = [
  { id: 'CRM', label: 'CRM', icon: Building2, desc: 'Customized CRM for various fields, lead & payment tracking' },
  { id: 'Website', label: 'Website', icon: Globe, desc: 'Modern, responsive, SEO-ready, fast & secure site' },
  { id: 'E-commerce sites', label: 'E-commerce sites', icon: ShoppingCart, desc: 'Online store setup, secure payments & product management' },
  { id: 'Sell products online', label: 'Sell products online', icon: Store, desc: 'Sell on Meesho, Amazon & Flipkart with store setup & growth guidance' },
] as const;

// Dynamic High-Quality Image Header Component matching Portfolio Aesthetics
interface SubSectionImageHeaderProps {
  primarySrc: string;
  fallbackSrc: string;
  alt: string;
  sectionNumber: string;
  badgeLabel: string;
  categoryTag: string;
  title: string;
  metricLabel?: string;
  metricValue?: string;
}

const SubSectionImageHeader: React.FC<SubSectionImageHeaderProps> = ({
  primarySrc,
  fallbackSrc,
  alt,
  sectionNumber,
  badgeLabel,
  categoryTag,
  title,
  metricLabel,
  metricValue
}) => {
  const [imgSrc, setImgSrc] = useState(primarySrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-sm border border-white/10 aspect-[16/10] sm:aspect-[4/3] group-hover:border-art-gold/40 transition-all duration-500 bg-black/40">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-art-gold/30 border-t-art-gold animate-spin" />
        </div>
      )}

      {/* Main Image */}
      <img 
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
          } else {
            setIsLoading(false);
          }
        }}
        className={`w-full h-full object-cover transition-all duration-700 brightness-90 group-hover:scale-105 group-hover:brightness-100 ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      />

      {/* Luxury Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />

      {/* Top Gold Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="bg-gradient-to-r from-art-gold to-[#e4c07a] text-black text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-sm shadow-lg flex items-center gap-1.5">
          <Sparkles size={11} className="text-black" />
          <span>{badgeLabel}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono px-2.5 py-1 rounded-sm hidden sm:block">
          {sectionNumber}
        </div>
      </div>

      {/* Bottom Title & Metrics Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-art-gold font-mono font-bold block">
            {categoryTag}
          </span>
          {metricValue && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-art-gold/30 text-art-gold font-bold">
              {metricLabel}: <span className="text-white">{metricValue}</span>
            </span>
          )}
        </div>
        <h4 className="text-base sm:text-lg font-serif italic text-white font-medium drop-shadow-md">
          {title}
        </h4>
      </div>
    </div>
  );
};

export const GrowBusinessSection: React.FC<GrowBusinessSectionProps> = ({ onSuccessSubmitted }) => {
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    comment: ''
  });

  // Multi-select state: initialized to ['CRM'], but Reset explicitly sets to []
  const [selectedInterested, setSelectedInterested] = useState<string[]>(['CRM']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetFeedback, setResetFeedback] = useState(false);

  const commentLength = formData.comment.length;
  const maxCommentLength = 1000;
  const remainingChars = maxCommentLength - commentLength;

  // Visual character counter dynamic styling
  const getCharCounterColor = () => {
    if (commentLength >= 1000) return 'text-rose-400 font-black animate-pulse';
    if (commentLength >= 950) return 'text-orange-400 font-bold';
    if (commentLength >= 800) return 'text-amber-400 font-semibold';
    return 'text-white/60';
  };

  const getProgressBarColor = () => {
    if (commentLength >= 1000) return 'bg-rose-500';
    if (commentLength >= 950) return 'bg-orange-500';
    if (commentLength >= 800) return 'bg-amber-400';
    return 'bg-art-gold/60';
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedInterested(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(s => s !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleQuickInquire = (serviceId: string) => {
    if (!selectedInterested.includes(serviceId)) {
      setSelectedInterested(prev => [...prev, serviceId]);
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectPlan = (planName: string) => {
    if (!selectedInterested.includes('CRM')) {
      setSelectedInterested(prev => [...prev, 'CRM']);
    }
    setFormData(prev => ({
      ...prev,
      comment: prev.comment
        ? `${prev.comment.replace(/\n?\[Plan Preference:.*?\]/, '')}\n[Plan Preference: BS Homez ${planName}]`.trim()
        : `Interested in BS Homez ${planName} for our sales operations. Please share tier pricing and deployment timelines.`
    }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Explicit Reset Handler: Clears ALL form fields including multi-select and comment textarea
  const handleReset = () => {
    setFormData({
      name: '',
      number: '',
      email: '',
      comment: ''
    });
    setSelectedInterested([]); // Clearly clear multi-select dropdown / selection
    setErrorMessage(null);
    setSubmitSuccess(false);
    setResetFeedback(true);
    setTimeout(() => {
      setResetFeedback(false);
    }, 2500);
  };

  // Save handler: validates 1000-char limit and saves directly to 'opportunities' with category: 'Opportunity'
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Name Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    // Number Validation
    const cleanNumber = formData.number.trim().replace(/[\s\-\(\)]/g, '');
    if (!cleanNumber || cleanNumber.length < 8 || cleanNumber.length > 20) {
      setErrorMessage('Please enter a valid contact phone / mobile number (8 to 20 digits).');
      return;
    }

    // Email Validation
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Multi-Select Validation
    if (selectedInterested.length === 0) {
      setErrorMessage('Please select at least one service you are interested in (CRM, Website, E-commerce, or Sell products online).');
      return;
    }

    // Strict 1000 Character Limit Validation
    if (formData.comment.length > maxCommentLength) {
      setErrorMessage(`Comment cannot exceed the 1000-character maximum limit (currently ${formData.comment.length} characters). Please shorten your comment.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const interestedString = selectedInterested.join(', ');
      
      // Save directly to the 'opportunities' collection in Firestore
      // Stored with category='Opportunity' for the Admin Vault "Opportunity" tab
      await addDoc(collection(db, 'opportunities'), {
        name: formData.name.trim(),
        mobile: formData.number.trim(),
        email: formData.email.trim().toLowerCase(),
        interested: interestedString,
        services: selectedInterested,
        comment: formData.comment.trim(),
        category: 'Opportunity', // Explicitly stored with category 'Opportunity'
        
        // Backward-compatibility schema fields for older Admin views & queries
        propertyName: `Grow Business: ${interestedString}`,
        propertyStatus: 'Ready to Move',
        propertyType: 'Flat',
        rooms: '1BHK',
        facing: 'East',
        floorNumber: 'Ground',
        willingTo: 'Sell',
        notes: formData.comment.trim() 
          ? `[Opportunity - Grow Business: ${interestedString}] ${formData.comment.trim()}` 
          : `[Opportunity - Grow Business: ${interestedString}]`,
        timestamp: serverTimestamp()
      });

      setSubmitSuccess(true);
      if (onSuccessSubmitted) {
        onSuccessSubmitted();
      }
    } catch (err) {
      console.error('Failed to save business opportunity:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'opportunities');
      } catch (e: any) {
        setErrorMessage(e.message || 'Unable to store your enquiry in Opportunity Vault. Please check your internet connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-art-dark text-white pt-24 pb-20 selection:bg-art-gold selection:text-black">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-art-gold/10 border border-art-gold/30 text-art-gold text-[10px] font-mono uppercase tracking-[0.25em] mb-4">
          <Sparkles size={13} className="text-art-gold animate-pulse" />
          <span>BS Homez Business Acceleration &amp; Digital Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic text-white tracking-tight mb-6">
          Grow Your Business with Modern Digital Power
        </h1>
        <p className="max-w-3xl mx-auto text-white/70 text-sm sm:text-base leading-relaxed font-light mb-8">
          From enterprise-grade custom CRMs and high-converting modern websites, to secure e-commerce portals and multi-channel marketplace scaling on Amazon, Flipkart, and Meesho — we engineer end-to-end solutions to drive sales, automate workflows, and multiply revenue.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-gradient-to-r from-art-gold to-[#e4c07a] text-black text-xs uppercase tracking-[0.2em] font-black rounded-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_4px_25px_rgba(197,160,89,0.35)] cursor-pointer"
          >
            <span>Submit Business Enquiry</span>
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('crm-plans-table');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Compare CRM Plans</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars Section with High-Quality Relevant Image Headers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mb-24">
        
        {/* 1. CRM */}
        <div className="bg-white/[0.02] border border-white/10 rounded-sm p-6 sm:p-10 hover:border-art-gold/40 transition-all group space-y-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <SubSectionImageHeader
                primarySrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85"
                fallbackSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85"
                alt="Custom CRM Architecture and Analytics Pipeline Dashboard"
                sectionNumber="01 / CRM"
                badgeLabel="Enterprise Systems"
                categoryTag="Workflow Automation"
                title="Bespoke CRM Engineering"
                metricLabel="Efficiency"
                metricValue="+45% ROI"
              />
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 text-art-gold">
                <div className="w-8 h-8 rounded-sm bg-art-gold/10 border border-art-gold/30 flex items-center justify-center font-bold text-art-gold text-sm font-mono">
                  01
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                  1. CRM (Customer Relationship Management)
                </h2>
              </div>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                Tailor-made cloud architectures engineered around your exact industry workflow. Eliminate manual spreadsheets, centralize every customer interaction, and empower your sales managers with real-time conversion visibility.
              </p>

              {/* Exact Points Required */}
              <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-art-gold/15 text-art-gold shrink-0 mt-0.5">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">1. We build customized CRM For various field</h5>
                      <p className="text-white/50 text-xs leading-relaxed">
                        Custom architectures for real estate, retail, manufacturing, consulting, healthcare, and education tailored to your specific pipeline.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                      <TrendingUp size={15} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">2. Trackeads and follow leads</h5>
                      <p className="text-white/50 text-xs leading-relaxed">
                        Instant lead capture from Meta, Google, property portals, and digital inbound channels with automated agent assignment and activity timelines.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">
                      <CreditCard size={15} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">3. Follow-up payments</h5>
                      <p className="text-white/50 text-xs leading-relaxed">
                        Automated milestone alerts, payment schedules, overdue notifications, ledger syncing, and digital receipts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                      <Zap size={15} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">4. Increase sales and Productivity</h5>
                      <p className="text-white/50 text-xs leading-relaxed">
                        Intelligent follow-up triggers, conversion analytics, team leaderboards, and zero lead leakage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleQuickInquire('CRM')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-black text-art-gold hover:text-white transition-colors cursor-pointer"
                >
                  <span>Request Custom CRM Quote</span>
                  <ArrowRight size={13} />
                </button>
                <span className="text-[10px] font-mono text-white/40">Custom SLA · Cloud Hosted · Role-Based Access</span>
              </div>
            </div>
          </div>

          {/* CRM Visual Feature-Comparison Table */}
          <CrmPlanComparison onSelectPlan={handleSelectPlan} />
        </div>

        {/* 2. Build Website */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-sm p-6 sm:p-10 hover:border-art-gold/40 transition-all group">
          <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
            <div className="flex items-center gap-2 text-art-gold">
              <div className="w-8 h-8 rounded-sm bg-art-gold/10 border border-art-gold/30 flex items-center justify-center font-bold text-art-gold text-sm font-mono">
                02
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                2. Build Website
              </h2>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Your website is your company’s foremost flagship asset. We craft ultra-premium, high-speed digital architectures that establish prestige, build unquestionable credibility, and turn passive visitors into qualified enquiries.
            </p>

            {/* Exact Points Required */}
            <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-art-gold/15 text-art-gold shrink-0 mt-0.5">
                    <Layers size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">1. Modern &amp; Responsive design</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Fluid typography, artisanal aesthetics, and smooth animations optimized for 4K desktop, laptops, and tablets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                    <Smartphone size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">2. Mobile-Friendly</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Touch-first navigation, thumb-friendly CTAs, and instant tap-to-call direct enquiry interactions for on-the-go visitors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">
                    <Search size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">3. SEO Optimized</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Structured JSON-LD schema, dynamic XML sitemaps, OpenGraph tags, and search-engine friendly semantic markup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-purple-500/15 text-purple-400 shrink-0 mt-0.5">
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">4. Fast and Secure</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Sub-second loading speeds, modern caching, SSL encryption, DDoS mitigation, and 99.9% uptime cloud hosting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleQuickInquire('Website')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-black text-art-gold hover:text-white transition-colors cursor-pointer"
              >
                <span>Inquire for Website Development</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[10px] font-mono text-white/40">React · Next.js · Vite · High-Converting UX</span>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <SubSectionImageHeader
              primarySrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=85"
              fallbackSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85"
              alt="Modern and Responsive Website Design Architecture"
              sectionNumber="02 / WEB"
              badgeLabel="Digital Presence"
              categoryTag="UI/UX Engineering"
              title="Modern Responsive Websites"
              metricLabel="Lighthouse"
              metricValue="98/100 Perf"
            />
          </div>
        </div>

        {/* 3. Build E-commerce sites */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-sm p-6 sm:p-10 hover:border-art-gold/40 transition-all group">
          <div className="lg:col-span-5">
            <SubSectionImageHeader
              primarySrc="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1600&q=85"
              fallbackSrc="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=85"
              alt="Modern E-commerce Portal and Secure Checkout"
              sectionNumber="03 / STORE"
              badgeLabel="Direct-to-Consumer"
              categoryTag="Digital Commerce"
              title="Scalable E-Commerce Portals"
              metricLabel="Conversion"
              metricValue="3.8x Lift"
            />
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-art-gold">
              <div className="w-8 h-8 rounded-sm bg-art-gold/10 border border-art-gold/30 flex items-center justify-center font-bold text-art-gold text-sm font-mono">
                03
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                3. Build E-commerce sites
              </h2>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Scale your brand into a 24/7 revenue engine. We design and launch direct-to-consumer e-commerce portals equipped with high-conversion checkout flows, instant payment processing, and seamless order dispatch systems.
            </p>

            {/* Exact Points Required */}
            <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                    <TrendingUp size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">1. Trun your products into sales</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Persuasive product galleries, customer social proof, quick add-to-cart triggers, and cart abandonment recovery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-art-gold/15 text-art-gold shrink-0 mt-0.5">
                    <Store size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">2. Online store setup</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Complete domain configuration, custom branding, shipping zone setups, coupon codes, and automated tax calculations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">
                    <CreditCard size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">3. Secure payment integration</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Seamless gateway integration: UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, EMI, and COD handling.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-purple-500/15 text-purple-400 shrink-0 mt-0.5">
                    <Package size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">4. Easy product management</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Simple dashboard to add products, adjust pricing, upload images, manage variants (sizes/colors), and monitor inventory.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                    <Smartphone size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">5. Mobile responsive</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Optimized for the 80%+ of Indian shoppers buying on smartphones with ultra-fast 1-click checkout flows.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleQuickInquire('E-commerce sites')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-black text-art-gold hover:text-white transition-colors cursor-pointer"
              >
                <span>Launch Your Online Store</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[10px] font-mono text-white/40">Shopify · WooCommerce · Custom Next.js Commerce</span>
            </div>
          </div>
        </div>

        {/* 4. Helping How to sell your product on Meesho, Amazon and Flipkart */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-sm p-6 sm:p-10 hover:border-art-gold/40 transition-all group">
          <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
            <div className="flex items-center gap-2 text-art-gold">
              <div className="w-8 h-8 rounded-sm bg-art-gold/10 border border-art-gold/30 flex items-center justify-center font-bold text-art-gold text-sm font-mono">
                04
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                4. Helping How to sell your product on Meesho, Amazon and Flipkart
              </h2>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Tap directly into hundreds of millions of active buyers across India’s top e-commerce marketplaces. We guide manufacturers, wholesalers, creators, and brands through end-to-end seller onboarding, algorithm optimization, and profitable scaling.
            </p>

            {/* Exact Points Required */}
            <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-art-gold/15 text-art-gold shrink-0 mt-0.5">
                    <Store size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">1. Account Setup &amp; Store creation</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Complete seller registration, brand registry, GST validation, bank linking, and document approval on Amazon, Flipkart &amp; Meesho.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">
                    <Search size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">2. Product listing and optimization</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      High-converting search keyword indexing, compelling bullet points, high-definition white-background imagery, and A+ brand content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                    <Tag size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">3. Pricing and offers Guidance</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Market competitor pricing analysis, marketplace commission calculations, discount strategy, and Buy Box winning formulas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-purple-500/15 text-purple-400 shrink-0 mt-0.5">
                    <Package size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">4. Order and inventory management</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Dispatch SLA adherence, return minimization, packaging guidelines, FBA/Flipkart Plus fulfillment, and multi-channel stock sync.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:border-art-gold/40 transition-colors sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                    <BarChart3 size={15} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">5. Tips to increase sales</h5>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Sponsored ads PPC setup, festive deals (Great Indian Festival, Big Billion Days), organic rating strategies, and seller badge upgrades.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleQuickInquire('Sell products online')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-black text-art-gold hover:text-white transition-colors cursor-pointer"
              >
                <span>Start Selling on Marketplaces</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[10px] font-mono text-white/40">Amazon · Flipkart · Meesho Seller Central</span>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <SubSectionImageHeader
              primarySrc="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85"
              fallbackSrc="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=85"
              alt="E-commerce Marketplace Packaging and Shipping Fulfillment"
              sectionNumber="04 / SCALE"
              badgeLabel="National Reach"
              categoryTag="Multi-Channel Commerce"
              title="Amazon, Flipkart & Meesho"
              metricLabel="Audience"
              metricValue="300M+ Users"
            />
          </div>
        </div>

      </div>

      {/* Dedicated Enquiry Form (Exact Format Requested) */}
      <div ref={formRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141414] border border-art-gold/30 rounded-sm p-6 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-art-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 mb-8 border-b border-white/10 pb-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/15 text-art-gold text-[10px] font-mono uppercase tracking-widest mb-3">
              <Sparkles size={12} />
              <span>Dedicated Business Intake</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif italic text-white mb-2">
              Grow Business Enquiry Form
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-light">
              Submit your requirements below. Your enquiry will be securely stored in the Admin Vault as an <strong className="text-art-gold">Opportunity</strong> record, and our specialist team will contact you within 2 business hours.
            </p>
          </div>

          {/* Reset Confirmation Notice */}
          <AnimatePresence>
            {resetFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3 bg-art-gold/20 border border-art-gold/40 rounded-sm text-art-gold text-xs font-mono flex items-center gap-2"
              >
                <CheckCircle2 size={14} className="text-art-gold shrink-0" />
                <span>Form has been reset. All fields and selections have been completely cleared.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {submitSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-center space-y-4"
            >
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-2xl font-serif italic text-white">Enquiry Saved Successfully!</h4>
              <p className="text-white/70 text-sm max-w-lg mx-auto">
                Thank you, <strong className="text-white">{formData.name}</strong>. Your enquiry for <strong className="text-art-gold">{selectedInterested.join(', ') || 'Business Solutions'}</strong> has been saved directly to the Firestore <strong className="text-art-gold">opportunities</strong> collection and will appear in the Admin Vault under the <strong className="text-art-gold">Opportunity</strong> tab.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-art-gold text-black text-xs uppercase tracking-widest font-black rounded-sm hover:bg-white transition-all cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6 relative z-10">
              
              {errorMessage && (
                <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-sm text-red-300 text-xs font-mono flex items-center gap-3">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name : */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-art-gold font-bold mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name or business entity"
                  className="w-full bg-black/50 border border-white/15 focus:border-art-gold px-4 py-3.5 rounded-sm text-sm text-white placeholder-white/30 outline-none transition-colors"
                />
              </div>

              {/* Number : & Email : */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Number : */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-art-gold font-bold mb-2">
                    Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-black/50 border border-white/15 focus:border-art-gold pl-10 pr-4 py-3.5 rounded-sm text-sm text-white placeholder-white/30 outline-none transition-colors font-mono"
                    />
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono mt-1 block">Direct mobile &amp; phone contact</span>
                </div>

                {/* Email : */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-art-gold font-bold mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@yourbusiness.com"
                      className="w-full bg-black/50 border border-white/15 focus:border-art-gold pl-10 pr-4 py-3.5 rounded-sm text-sm text-white placeholder-white/30 outline-none transition-colors"
                    />
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono mt-1 block">For detailed proposal &amp; pricing</span>
                </div>
              </div>

              {/* Intrested: CRM, Website, E-commerce sites, Sell products online. */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] uppercase tracking-widest text-art-gold font-bold">
                    Intrested <span className="text-red-400">*</span>
                  </label>
                  <span className="text-white/40 text-[10px] font-mono">
                    {selectedInterested.length === 0 ? 'None selected' : `${selectedInterested.length} selected`}
                  </span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {AVAILABLE_SERVICES.map((srv) => {
                    const isSelected = selectedInterested.includes(srv.id);
                    const Icon = srv.icon;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleToggleService(srv.id)}
                        className={`p-3.5 rounded-sm border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-art-gold/15 border-art-gold text-white shadow-md'
                            : 'bg-black/30 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected ? 'bg-art-gold border-art-gold text-black' : 'border-white/30 bg-black/40'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon size={14} className={isSelected ? 'text-art-gold' : 'text-white/50'} />
                            <span className="text-xs font-bold uppercase tracking-wider">{srv.label}</span>
                          </div>
                          <p className="text-[10px] text-white/50 mt-1 line-clamp-1">{srv.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment: created a text box capacity of 1000 charters with validation & visual character counter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] uppercase tracking-widest text-art-gold font-bold">
                    Comment <span className="text-white/40 normal-case font-normal text-[10px]">(Capacity: 1000 characters)</span>
                  </label>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className={getCharCounterColor()}>
                      {commentLength} / {maxCommentLength} characters
                    </span>
                    <span className="text-white/30">|</span>
                    <span className={remainingChars === 0 ? 'text-rose-400 font-bold' : 'text-white/40'}>
                      {remainingChars} left
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={5}
                    maxLength={1000}
                    value={formData.comment}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Enforce 1000-character ceiling strictly even during typing or paste
                      if (val.length <= 1000) {
                        setFormData({ ...formData, comment: val });
                      }
                    }}
                    placeholder="Enter your detailed comment, business requirements, website URLs, products to sell, or timelines (capacity of 1000 characters)..."
                    className={`w-full bg-black/50 border p-4 rounded-sm text-sm text-white placeholder-white/30 outline-none transition-colors resize-y leading-relaxed font-sans ${
                      commentLength >= 1000 
                        ? 'border-rose-500/80 focus:border-rose-500' 
                        : commentLength >= 950 
                        ? 'border-orange-500/70 focus:border-orange-500' 
                        : 'border-white/15 focus:border-art-gold'
                    }`}
                  />
                  
                  {/* Subtle limit warning banner inside comment box when near limit */}
                  {commentLength >= 980 && (
                    <div className="absolute right-3 bottom-3 px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[9px] font-mono text-orange-400">
                      {commentLength === 1000 ? 'Limit reached' : `${remainingChars} chars remaining`}
                    </div>
                  )}
                </div>

                {/* Visual Progress Bar for 1000 characters */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full transition-all duration-150 ${getProgressBarColor()}`}
                    style={{ width: `${Math.min(100, (commentLength / maxCommentLength) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Create a button Save or Reset */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white text-xs uppercase tracking-[0.2em] font-extrabold rounded-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  title="Clear all fields, comments, and service selections"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-art-gold to-[#e4c07a] text-black text-xs uppercase tracking-[0.2em] font-black rounded-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(197,160,89,0.4)] cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Opportunity...</span>
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-white/40 font-mono flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Direct Firestore Sync: Automatically registered in Admin Vault under Opportunity tab</span>
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
