import React, { useState } from 'react';
import { MessageCircle, Share2, Sparkles, Check, Copy, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PositiveVibesSocialBar: React.FC = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const websiteUrl = "https://bshomez.in";
  const shareText = "Step into your dream home with BS Homez (https://bshomez.in) – Curated luxury apartments, villas and plots across Bangalore with 0% buyer brokerage and 100% verified RERA approvals!";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: "💬",
      color: "bg-emerald-600 hover:bg-emerald-500",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    },
    {
      name: "Facebook",
      icon: "📘",
      color: "bg-blue-600 hover:bg-blue-500",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`
    },
    {
      name: "LinkedIn",
      icon: "💼",
      color: "bg-sky-700 hover:bg-sky-600",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`
    },
    {
      name: "X (Twitter)",
      icon: "🐦",
      color: "bg-neutral-800 hover:bg-neutral-700",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "bg-sky-500 hover:bg-sky-400",
      url: `https://t.me/share/url?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(shareText)}`
    }
  ];

  const handleAdvisorChat = () => {
    const advisorMessage = "Hello BS Homez! I am exploring luxury properties on bshomez.in and would love priority details for your curated Bangalore homes.";
    const url = `https://api.whatsapp.com/send?phone=919902991599&text=${encodeURIComponent(advisorMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Positive Vibes Quick Connect (Bottom-Left) */}
      <aside aria-label="Social and Advisor Actions" className="fixed bottom-5 left-4 sm:left-6 z-40 flex items-center gap-2 max-sm:gap-1.5 font-sans">
        <button
          type="button"
          onClick={handleAdvisorChat}
          className="group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 text-white rounded-full shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.5)] border border-emerald-400/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          title="Connect directly on WhatsApp with Senior Property Advisors"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <MessageCircle size={15} className="fill-white/20 stroke-white" />
          <span className="text-[11px] sm:text-xs font-black tracking-wide uppercase whitespace-nowrap">
            Chat on WhatsApp
          </span>
          <span className="hidden md:inline text-[10px] text-emerald-100 font-medium">
            (Instant Price &amp; Brochure)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 sm:py-3 bg-art-dark/95 hover:bg-neutral-900 text-art-gold border border-art-gold/40 hover:border-art-gold rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Share bshomez.in on WhatsApp, Meta, LinkedIn & X"
        >
          <Share2 size={14} />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
            Share
          </span>
        </button>
      </aside>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-neutral-950 border border-art-gold/30 rounded-xl max-w-md w-full p-6 sm:p-7 shadow-2xl z-20 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-art-gold/15 flex items-center justify-center border border-art-gold/30 text-art-gold">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic text-white font-bold">
                      Share <span className="not-italic text-art-gold">bshomez.in</span>
                    </h3>
                    <p className="text-[10px] text-white/60">
                      Recommend Bangalore's curated luxury property advisory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareOpen(false)}
                  className="p-1.5 text-white/40 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Positive Vibes Highlights Box */}
              <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 text-art-gold text-[10px] font-bold uppercase tracking-wider">
                  <Star size={12} className="fill-art-gold" />
                  <span>4.9 / 5 Rating • 140+ Happy Homeowners</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  "0% Brokerage on Primary Builder Homes • 100% RERA Verified Titles • Whitefield, Sarjapur &amp; East Bangalore."
                </p>
              </div>

              {/* Multi-Platform Social Share Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {shareLinks.map((plat) => (
                  <a
                    key={plat.name}
                    href={plat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-white font-bold text-xs shadow-md transition-all ${plat.color}`}
                  >
                    <span>{plat.icon}</span>
                    <span>{plat.name}</span>
                  </a>
                ))}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Quick direct link display */}
              <div className="p-2.5 bg-black/60 rounded border border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
                <span className="truncate">https://bshomez.in</span>
                <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold shrink-0 ml-2">
                  Official Live Portal
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
