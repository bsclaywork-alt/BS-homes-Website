import React from 'react';
import { ShieldCheck, Star, Sparkles, Building2, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const PositiveVibesTrustRibbon: React.FC = () => {
  const highlights = [
    {
      icon: Star,
      label: "4.9 / 5 Rating",
      sub: "148+ Delighted Homeowners",
      badge: "Top Rated"
    },
    {
      icon: ShieldCheck,
      label: "100% RERA Verified",
      sub: "Clean Titles & Zero Legal Encumbrance",
      badge: "Verified"
    },
    {
      icon: Sparkles,
      label: "0% Buyer Brokerage",
      sub: "Direct Developer Pricing on Primary Homes",
      badge: "Transparent"
    },
    {
      icon: Building2,
      label: "Tier-1 Curated Portfolios",
      sub: "Whitefield • Sarjapur • Varthur • Hoskote",
      badge: "Bangalore"
    },
    {
      icon: HeartHandshake,
      label: "Dedicated Fiduciary Desk",
      sub: "24-Hour Personalized Advisory & Floor Plans",
      badge: "White Glove"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-neutral-950 via-art-dark to-neutral-950 border-y border-art-gold/30 py-3.5 px-3 sm:px-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-art-gold/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9.5px] uppercase tracking-[0.25em] font-black text-art-gold whitespace-nowrap">
            Live Trust Signals
          </span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-7 h-7 rounded-full bg-art-gold/10 border border-art-gold/30 flex items-center justify-center text-art-gold group-hover:scale-110 transition-transform">
                  <Icon size={13} className="shrink-0" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-art-gold bg-art-gold/10 px-1.5 py-0.2 rounded border border-art-gold/20">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/55 font-mono">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[9.5px] uppercase font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30 shrink-0">
          <CheckCircle2 size={12} />
          <span>bshomez.in Live &amp; Verified</span>
        </div>
      </div>
    </div>
  );
};
