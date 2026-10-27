import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Project } from '../types';

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
  const [previewChannel, setPreviewChannel] = useState<'google' | 'meta' | 'twitter' | 'technical'>('google');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const domain = "ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app";
  const displayUrl = selectedProject 
    ? `https://bshomez.co.in › project › ${selectedProject.name.toLowerCase().replace(/\s+/g, '-')}`
    : `https://bshomez.co.in › ${activeTab}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#121212] border border-art-gold/30 rounded-lg max-w-4xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto text-art-light relative"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-art-gold font-bold">SEO & Social Visibility</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live & Crawlable
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white italic">
                Google · Meta · X Live Visualizer
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setPreviewChannel('google')}
              className={`px-3.5 sm:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                previewChannel === 'google'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search size={14} />
              <span>Google SERP</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewChannel('meta')}
              className={`px-3.5 sm:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                previewChannel === 'meta'
                  ? 'bg-[#1877F2] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 size={14} />
              <span>Meta & WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewChannel('twitter')}
              className={`px-3.5 sm:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                previewChannel === 'twitter'
                  ? 'bg-black border border-white/30 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-mono font-black text-xs">𝕏</span>
              <span>Twitter / X Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewChannel('technical')}
              className={`px-3.5 sm:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                previewChannel === 'technical'
                  ? 'bg-art-gold text-black shadow-lg font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={14} />
              <span>SEO Audit & Schema</span>
            </button>
          </div>

          {previewChannel === 'google' && (
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-white/10">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded transition-colors ${
                  deviceView === 'desktop' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Desktop Google Preview"
              >
                <Laptop size={14} />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  deviceView === 'mobile' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Mobile Google Preview"
              >
                <Smartphone size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Active URL Bar */}
          <div className="bg-black/60 border border-white/10 rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] uppercase font-bold text-art-gold tracking-widest shrink-0">Indexed URL:</span>
              <span className="text-white/80 truncate">{currentCanonicalUrl}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(currentCanonicalUrl)}
              className="shrink-0 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              {copiedUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedUrl ? 'Copied' : 'Copy Share URL'}</span>
            </button>
          </div>

          {/* 1. GOOGLE SERP PREVIEW */}
          {previewChannel === 'google' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Google Search Result Snippet Simulation ({deviceView} mode)</span>
                <span className="text-emerald-400 font-mono">Position #1 Mockup</span>
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
                <div className="flex items-center gap-2 text-xs text-[#70757a] my-1">
                  <div className="flex text-amber-500 font-bold">
                    ★★★★★
                  </div>
                  <span>Rating: 4.9 · 128 verified reviews · Real Estate Advisory</span>
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
                      <span className="text-[11px] text-[#70757a] line-clamp-1">Direct builder allocation across Whitefield, Hoskote, Varthur & Sarjapur.</span>
                    </div>
                    <div>
                      <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block">Verified Resale Properties</span>
                      <span className="text-[11px] text-[#70757a] line-clamp-1">2% transparent closing fee, clear titles, and immediate possession homes.</span>
                    </div>
                    <div>
                      <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block">Home Loan Hub & LTV Calculator</span>
                      <span className="text-[11px] text-[#70757a] line-clamp-1">Up to 90% loan eligibility with SBI, HDFC & ICICI Bank tie-ups.</span>
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

          {/* 2. META (FACEBOOK / WHATSAPP) PREVIEW */}
          {previewChannel === 'meta' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Facebook & WhatsApp OpenGraph Card (og:image · og:title · og:description)</span>
                <span className="text-blue-400 font-mono">1200 x 630 HD Preview</span>
              </div>

              {/* Facebook Card Mockup */}
              <div className="bg-[#242526] border border-white/10 rounded-lg overflow-hidden max-w-lg mx-auto shadow-2xl">
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

                <div className="p-4 bg-[#18191a] border-t border-white/5 text-left">
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

              {/* WhatsApp Chat Preview */}
              <div className="max-w-md mx-auto bg-[#0b141a] p-4 rounded-lg border border-white/10 text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#25D366] font-bold block mb-2">WhatsApp Shared Link Bubble</span>
                <div className="bg-[#005c4b] text-white rounded-lg p-2.5 text-xs shadow-md">
                  <div className="rounded overflow-hidden bg-black/40 mb-2">
                    <img src={currentImageUrl} alt="Preview" className="w-full h-32 object-cover" />
                    <div className="p-2 bg-black/60">
                      <div className="font-bold text-xs truncate">{currentTitle}</div>
                      <div className="text-[10px] text-white/70 line-clamp-2 mt-0.5">{currentDescription}</div>
                      <div className="text-[9px] text-emerald-300 font-mono mt-1">{domain}</div>
                    </div>
                  </div>
                  <span className="text-[11px] underline text-emerald-200 break-all">{currentCanonicalUrl}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. TWITTER / X CARD PREVIEW */}
          {previewChannel === 'twitter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Twitter / X summary_large_image Card Preview</span>
                <span className="text-neutral-400 font-mono">@BSHomez</span>
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
                    bshomez.co.in
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

          {/* 4. TECHNICAL AUDIT & SCHEMA.ORG */}
          {previewChannel === 'technical' && (
            <div className="space-y-5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">Robots Directive</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={13} />
                    <span>index, follow, max-image-preview:large</span>
                  </div>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">XML Sitemap</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold truncate">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span className="truncate">/sitemap.xml (All Bangalore corridors)</span>
                  </div>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">Meta OpenGraph & Twitter</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={13} />
                    <span>1200x630 HD Card with og:image</span>
                  </div>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block mb-1">Geo Location</span>
                  <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={13} />
                    <span>Bengaluru, Karnataka (IN-KA 12.9698, 77.75)</span>
                  </div>
                </div>
              </div>

              {/* Schema JSON-LD Code Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-white/70 font-bold flex items-center gap-2">
                    <Layers size={14} className="text-art-gold" />
                    Schema.org JSON-LD Structured Graph
                  </span>
                  <span className="text-[10px] font-mono text-art-gold">Validated for Google Rich Results</span>
                </div>
                <pre className="bg-black/80 border border-white/15 rounded-md p-4 text-[11px] font-mono text-white/80 overflow-x-auto max-h-52 leading-relaxed">
{JSON.stringify(
  selectedProject
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": selectedProject.name,
        "description": selectedProject.description,
        "brand": { "@type": "Brand", "name": selectedProject.builderName },
        "offers": {
          "@type": "Offer",
          "price": selectedProject.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": "BS Homez" }
        }
      }
    : {
        "@context": "https://schema.org",
        "@type": ["RealEstateAgent", "LocalBusiness"],
        "name": "BS Homez",
        "url": currentCanonicalUrl,
        "areaServed": ["Whitefield", "Hoskote", "Varthur", "Gunjur", "Hosa Road", "Kasavanahalli", "Sarjapur"],
        "priceRange": "₹₹₹",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${currentCanonicalUrl}?project={search_term}`
        }
      },
  null,
  2
)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-white/50 text-[11px] text-center sm:text-left">
            Changes to tabs, corridors, and project modals immediately synchronize with social scrapers and search spiders.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-art-gold hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded transition-all cursor-pointer shadow-lg"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
};
