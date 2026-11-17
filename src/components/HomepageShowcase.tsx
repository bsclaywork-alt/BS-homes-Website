import React from 'react';
import {
  Building2,
  Handshake,
  Home
} from 'lucide-react';
import { Project } from '../types';

export interface HomepageShowcaseProps {
  projects: Project[];
  onExploreProperties: () => void;
  onSelectProject: (project: Project) => void;
  onOfferAsset: () => void;
  onReferAndEarn: () => void;
}

export const HomepageShowcase: React.FC<HomepageShowcaseProps> = ({
  projects,
  onExploreProperties,
  onSelectProject,
  onOfferAsset,
  onReferAndEarn
}) => {
  return (
    <div className="bg-lux-ivory text-lux-charcoal">
      {/* PROMINENT OFFER YOUR ASSET & REFER & EARN CALLOUT SECTIONS */}
      <section className="py-10 sm:py-14 px-4 sm:px-8 md:px-12 border-t border-lux-border bg-lux-ivory">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Offer Your Asset Card */}
          <div className="p-7 sm:p-10 bg-lux-card border border-lux-border rounded-sm shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-lux-forest" />
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-lux-gold">
                <Home size={14} className="text-lux-forest" />
                <span>Offer Your Asset</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-lux-forest leading-snug">
                Have a Property to Sell or Rent? Let Us Find the Right Opportunity.
              </h2>
              <p className="text-xs sm:text-sm text-lux-muted leading-relaxed">
                Submit residential flats, villas, plots, or commercial assets directly for Primary, Resale, or Rental curation. Owner contact information stays private and verified within BS Homez Admin Vault.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={onOfferAsset}
                className="px-6 py-3.5 bg-lux-forest hover:bg-lux-forest-hover text-lux-card text-xs font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Building2 size={15} />
                <span>List Your Property</span>
              </button>
            </div>
          </div>

          {/* Refer & Earn Card */}
          <div className="p-7 sm:p-10 bg-lux-forest text-lux-ivory border border-lux-gold/40 rounded-sm shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-lux-gold" />
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-lux-gold">
                <Handshake size={14} />
                <span>Refer &amp; Earn</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-lux-card leading-snug">
                Good Connections Deserve Great Rewards.
              </h2>
              <p className="text-xs sm:text-sm text-lux-ivory/80 leading-relaxed">
                Introduce friends, colleagues, or property owners looking for curated apartments, villas, or plots across Bangalore, and stay updated with our advisory team on eligible referral milestones.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={onReferAndEarn}
                className="px-6 py-3.5 bg-lux-gold hover:bg-lux-card text-lux-charcoal text-xs font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Handshake size={15} />
                <span>Refer a Property / Customer</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
