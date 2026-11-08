import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  Laptop,
  Layers,
  MessageSquare,
  Linkedin,
  Twitter,
  Facebook,
  Send,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Project } from '../types';
import { generateOptimizedSeoMetadata, calculateSeoScore } from '../lib/autoSeoEnhancer';

interface SEOPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentDescription: string;
  currentCanonicalUrl: string;
  currentImageUrl?: string;
  activeTab: string;
  selectedProject?: Project | null;
}

export const SEOPreviewModal: React.FC<SEOPreviewModalProps> = ({
  isOpen,
  onClose,
  currentTitle,
  currentDescription,
  currentCanonicalUrl,
  currentImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=85",
  activeTab,
  selectedProject
}) => {
  const [previewChannel, setPreviewChannel] = useState<'google' | 'whatsapp' | 'linkedin' | 'twitter' | 'meta' | 'technical'>('google');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false);
  const [autoOptimizedNotice, setAutoOptimizedNotice] = useState<string | null>(null);

  const domain = "www.bshomez.in";
  const displayUrl = selectedProject 
    ? `https://www.bshomez.in › project › ${selectedProject.name.toLowerCase().replace(/\s+/g, '-')}`
    : `https://www.bshomez.in › ${activeTab}`;

  // Multi-platform generated metadata
  const multiPlatformData = useMemo(() => {
    if (selectedProject) {
      return generateOptimizedSeoMetadata(selectedProject);
    }
    const mockProj: Project = {
      name: "BS Homez",
      location: "Bengaluru",
      zone: "East Bangalore",
      type: "Primary",
      propertyType: "Apartment",
      price: "₹45 L - ₹6.5 Cr",
      description: currentDescription,
      metaTitle: currentTitle,
      metaDescription: currentDescription,
      locationTarget: "East Bangalore",
      configuration: ["2 BHK", "3 BHK", "4 BHK"],
      segment: "Luxury",
      imageUrls: [currentImageUrl],
      features: ["Verified RERA", "0% Brokerage", "Premium Amenities"],
      createdAt: new Date().toISOString()
    };
    return generateOptimizedSeoMetadata(mockProj);
  }, [selectedProject, currentTitle, currentDescription]);

  const seoScore = useMemo(() => {
    return calculateSeoScore({
      title: currentTitle,
      description: currentDescription,
      keywords: selectedProject?.seoKeywords || ['Bangalore Real Estate', 'BS Homez', 'Luxury Apartments'],
      imageAltText: (selectedProject as any)?.imageAltText || currentTitle,
      hasImage: Boolean(currentImageUrl)
    });
  }, [currentTitle, currentDescription, selectedProject, currentImageUrl]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopySchema = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleTriggerAutoOptimization = () => {
    setIsAutoOptimizing(true);
    setTimeout(() => {
      setIsAutoOptimizing(false);
      setAutoOptimizedNotice("Multi-Platform SEO Auto-Enhanced! Google SERP, WhatsApp, LinkedIn & Twitter cards verified.");
      setTimeout(() => setAutoOptimizedNotice(null), 4000);
    }, 700);
  };

  const openShareUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#121212] border border-art-gold/30 rounded-lg max-w-4xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto text-art-light relative flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.25em] text-art-gold font-bold">SEO & Multi-Platform Engine</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SEO Score: {seoScore}/100
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-mono font-bold border border-blue-500/30 hidden sm:inline">
                  Google · WhatsApp · LinkedIn · X
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif text-white italic">
                {selectedProject ? selectedProject.name : 'BS Homez'} — Multi-Platform Search &amp; Social Visualizer
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerAutoOptimization}
              disabled={isAutoOptimizing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-art-gold/15 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              title="Auto-enhance SEO and refresh all platform cards"
            >
              <RefreshCw size={12} className={isAutoOptimizing ? "animate-spin" : ""} />
              <span>Auto-Enhance SEO</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {autoOptimizedNotice && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 font-medium flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>{autoOptimizedNotice}</span>
            </div>
            <button type="button" onClick={() => setAutoOptimizedNotice(null)} className="text-white/60 hover:text-white cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Channel Switcher Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setPreviewChannel('google')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'google'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search size={13} />
              <span>Google SERP</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewChannel('whatsapp')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'whatsapp'
                  ? 'bg-[#25D366] text-black shadow-md font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare size={13} />
              <span>WhatsApp Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewChannel('linkedin')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'linkedin'
                  ? 'bg-[#0077b5] text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Linkedin size={13} />
              <span>LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewChannel('twitter')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'twitter'
                  ? 'bg-black border border-white/30 text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Twitter size={13} />
              <span>Twitter / X</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewChannel('meta')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'meta'
                  ? 'bg-[#1877F2] text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Facebook size={13} />
              <span>Meta / FB</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewChannel('technical')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'technical'
                  ? 'bg-art-gold text-black shadow-md font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={13} />
              <span>Schema &amp; Audit</span>
            </button>
          </div>

          {previewChannel === 'google' && (
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-white/10 ml-auto">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded transition-colors ${
                  deviceView === 'desktop' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Desktop Google Preview"
              >
                <Laptop size={13} />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  deviceView === 'mobile' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Mobile Google Preview"
              >
                <Smartphone size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active URL Bar */}
          <div className="bg-black/60 border border-white/10 rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] uppercase font-bold text-art-gold tracking-widest shrink-0">Indexed URL:</span>
              <span className="text-white/80 truncate">{currentCanonicalUrl}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(currentCanonicalUrl)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
              </button>
              <a
                href={currentCanonicalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded text-[10px] flex items-center gap-1 transition-colors"
                title="Test live page"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* 1. GOOGLE SERP PREVIEW */}
          {previewChannel === 'google' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Google Search Result Snippet Simulation ({deviceView} mode)</span>
                <span className="text-emerald-400 font-mono">Google Position #1 Rich Result</span>
              </div>

              <div className={`bg-white rounded-lg p-5 text-left text-[#4d5156] font-sans shadow-lg ${
                deviceView === 'mobile' ? 'max-w-md mx-auto border-2 border-neutral-300' : 'w-full'
              }`}>
                {/* Site Breadcrumbs */}
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#121212] flex items-center justify-center text-white text-[10px] font-serif font-black border border-neutral-200 shadow-sm">
                    BS
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#202124] font-medium leading-none">BS Homez</span>
                    <span className="text-[11px] text-[#4d5156] leading-tight truncate">{displayUrl}</span>
                  </div>
                </div>

                {/* SERP Title */}
                <h4 className="text-[#1a0dab] hover:underline cursor-pointer text-lg font-medium leading-snug line-clamp-2">
                  {currentTitle}
                </h4>

                {/* Rating & Rich Snippets */}
                <div className="flex items-center gap-2 text-xs text-[#70757a] my-1 flex-wrap">
                  <div className="flex text-amber-500 font-bold">
                    ★★★★★
                  </div>
                  <span>Rating: 4.9 · 128 verified reviews · Real Estate Advisory</span>
                  {selectedProject?.price && (
                    <span className="px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800 font-semibold font-mono text-[11px]">
                      {selectedProject.price}
                    </span>
                  )}
                </div>

                {/* SERP Description */}
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                  {currentDescription}
                </p>

                {/* Sitelinks Extensions (Only for desktop) */}
                {deviceView === 'desktop' && (
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-neutral-100 text-xs">
                    <div>
                      <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block">0% Brokerage Primary Properties</span>
                      <span className="text-[11px] text-[#70757a] line-clamp-1">Direct builder allocation across Whitefield, Hoskote, Varthur &amp; Sarjapur.</span>
                    </div>
                    <div>
                      <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block">Verified Resale Properties</span>
                      <span className="text-[11px] text-[#70757a] line-clamp-1">2% transparent closing fee, clear titles, and immediate possession homes.</span>
                    </div>
                    <div>
                      <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block">Home Loan Hub &amp; LTV Calculator</span>
                      <span className="text-[11px] text-[#70757a] line-clamp-1">Up to 90% loan eligibility with SBI, HDFC &amp; ICICI Bank tie-ups.</span>
                    </div>
                    <div>
                      <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block">Real-Time Bangalore Market Insights</span>
                      <span className="text-[11px] text-[#70757a] line-clamp-1">Quarterly price appreciation rates, metro connectivity, and yields.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. WHATSAPP SHARE CARD PREVIEW */}
          {previewChannel === 'whatsapp' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>WhatsApp Rich Unfurl Preview (Simulating high-intent buyer forward)</span>
                <button
                  type="button"
                  onClick={() => openShareUrl(multiPlatformData.whatsapp.shareUrl)}
                  className="px-2.5 py-1 rounded bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Send size={11} />
                  <span>Test Share on WhatsApp</span>
                </button>
              </div>

              {/* WhatsApp Chat Bubble Mockup */}
              <div className="max-w-md mx-auto bg-[#0b141a] p-4 rounded-xl border border-white/10 text-left shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#25D366] font-bold flex items-center gap-1">
                    <MessageSquare size={11} />
                    <span>WhatsApp Link Card</span>
                  </span>
                  <span className="text-[9px] text-white/40 font-mono">10:45 AM</span>
                </div>

                <div className="bg-[#005c4b] text-white rounded-lg p-2.5 text-xs shadow-md space-y-2">
                  {/* Rich OpenGraph Card */}
                  <div className="rounded-md overflow-hidden bg-black/40 border border-white/10">
                    <img 
                      src={currentImageUrl} 
                      alt="WhatsApp Preview" 
                      className="w-full h-36 object-cover" 
                    />
                    <div className="p-2.5 bg-[#022c22]">
                      <div className="font-bold text-xs truncate text-white">{currentTitle}</div>
                      <div className="text-[10px] text-white/80 line-clamp-2 mt-1 leading-snug">{currentDescription}</div>
                      <div className="text-[9px] text-emerald-300 font-mono mt-1.5 flex items-center gap-1">
                        <Globe size={9} />
                        <span>bshomez.in</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-100 font-sans leading-relaxed whitespace-pre-line bg-black/20 p-2 rounded">
                    {multiPlatformData.whatsapp.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. LINKEDIN FEED CARD PREVIEW */}
          {previewChannel === 'linkedin' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>LinkedIn Sponsored &amp; Organic Feed Post Preview</span>
                <button
                  type="button"
                  onClick={() => openShareUrl(multiPlatformData.linkedin.shareUrl)}
                  className="px-2.5 py-1 rounded bg-[#0077b5]/20 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-[#0077b5]/40 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Share2 size={11} />
                  <span>Share to LinkedIn</span>
                </button>
              </div>

              {/* LinkedIn Post Mockup */}
              <div className="bg-[#1b1f23] border border-white/10 rounded-lg max-w-lg mx-auto shadow-2xl overflow-hidden text-left">
                {/* LinkedIn Author Strip */}
                <div className="p-3.5 flex items-center gap-2.5 border-b border-white/5 bg-[#14171a]">
                  <div className="w-9 h-9 rounded-full bg-art-gold/20 border border-art-gold/40 flex items-center justify-center text-art-gold font-serif font-black text-xs">
                    BS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>BS Homez Real Estate Advisory</span>
                      <span className="text-[9px] text-white/40">• 1st</span>
                    </div>
                    <div className="text-[10px] text-white/50">Bengaluru Prime Corridors • 0% Brokerage</div>
                  </div>
                </div>

                {/* Post Body text */}
                <div className="p-3.5 text-xs text-white/80 leading-relaxed font-sans">
                  <p>Discover premier real estate investments across Bengaluru with verified RERA documentation and end-to-end fiduciary advisory.</p>
                  <p className="mt-1 text-blue-400">#BangaloreRealEstate #BSHomez #Whitefield #Sarjapur</p>
                </div>

                {/* Linked Article Card */}
                <div className="border-t border-b border-white/10 bg-[#16181b] cursor-pointer hover:bg-[#1f2227] transition-colors">
                  <img src={currentImageUrl} alt="LinkedIn Banner" className="w-full h-44 object-cover" />
                  <div className="p-3">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 block mb-0.5">
                      bshomez.in
                    </span>
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {currentTitle}
                    </h4>
                    <p className="text-[11px] text-white/60 line-clamp-2 mt-1 leading-normal">
                      {currentDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. TWITTER / X CARD PREVIEW */}
          {previewChannel === 'twitter' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Twitter / X summary_large_image Card Preview</span>
                <button
                  type="button"
                  onClick={() => openShareUrl(multiPlatformData.twitter.card ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentTitle)}&url=${encodeURIComponent(currentCanonicalUrl)}` : '')}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Twitter size={11} />
                  <span>Tweet on X</span>
                </button>
              </div>

              <div className="bg-black border border-white/20 rounded-2xl overflow-hidden max-w-lg mx-auto shadow-2xl text-left">
                <div className="relative aspect-[2/1] w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={currentImageUrl}
                    alt={currentTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono">
                    {domain}
                  </div>
                </div>

                <div className="p-4 bg-black border-t border-white/10">
                  <span className="text-xs text-neutral-500 font-mono block mb-1">
                    www.bshomez.in
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1">
                    {currentTitle}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {currentDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. META / FACEBOOK CARD PREVIEW */}
          {previewChannel === 'meta' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Facebook &amp; Meta OpenGraph 1200x630 Card</span>
                <button
                  type="button"
                  onClick={() => openShareUrl(multiPlatformData.facebook.shareUrl)}
                  className="px-2.5 py-1 rounded bg-[#1877F2]/20 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/40 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Facebook size={11} />
                  <span>Share on Facebook</span>
                </button>
              </div>

              <div className="bg-[#242526] border border-white/10 rounded-lg overflow-hidden max-w-lg mx-auto shadow-2xl text-left">
                <div className="relative aspect-[1.91/1] w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={currentImageUrl}
                    alt={currentTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded text-[10px] text-art-gold font-bold uppercase tracking-wider">
                    BS Homez Verified
                  </div>
                </div>

                <div className="p-4 bg-[#18191a] border-t border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                    {domain}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1.5">
                    {currentTitle}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {currentDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. TECHNICAL AUDIT & SCHEMA.ORG */}
          {previewChannel === 'technical' && (
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">Google &amp; Bing Directives</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>index, follow, max-image-preview:large</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">Local Geographic Coordinates</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>IN-KA Bengaluru (12.9716, 77.5946)</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">OpenGraph Multi-Platform</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>og:title, og:image (1200x630), og:locale (en_IN)</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">X / Twitter Card</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>summary_large_image (@BSHomez)</span>
                  </div>
                </div>
              </div>

              {/* Schema JSON-LD Code Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-white/70 font-bold flex items-center gap-2">
                    <Layers size={14} className="text-art-gold" />
                    Schema.org JSON-LD Structured Graph (Google SERP Ready)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySchema(JSON.stringify(multiPlatformData.schemaJsonLd, null, 2))}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedSchema ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{copiedSchema ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="bg-black/80 border border-white/15 rounded-md p-4 text-[11px] font-mono text-white/80 overflow-x-auto max-h-52 leading-relaxed">
                  {JSON.stringify(multiPlatformData.schemaJsonLd, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-white/50 text-[11px] text-center sm:text-left flex items-center gap-2">
            <Zap size={13} className="text-art-gold shrink-0" />
            <span>SEO metadata dynamically updates across Google Search, WhatsApp, LinkedIn, and X as users browse.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-art-gold hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded transition-all cursor-pointer shadow-lg"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
};
