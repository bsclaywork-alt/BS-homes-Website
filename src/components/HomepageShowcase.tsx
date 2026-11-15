import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Handshake,
  ArrowRight,
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
  const activeSlides = React.useMemo(
    () =>
      projects
        .filter((p) => !p.isDeleted && !p.isPaused && p.imageUrls && p.imageUrls.length > 0)
        .slice(0, 12),
    [projects]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = activeSlides.length;

  const handlePrev = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const visibleDesktopCards = React.useMemo(() => {
    if (totalSlides === 0) return [];
    const count = Math.min(3, totalSlides);
    const items: Project[] = [];
    for (let i = 0; i < count; i++) {
      items.push(activeSlides[(currentIndex + i) % totalSlides]);
    }
    return items;
  }, [activeSlides, currentIndex, totalSlides]);

  return (
    <div className="bg-lux-ivory text-lux-charcoal">
      {/* RESPONSIVE PROPERTY / PROJECT IMAGE CAROUSEL */}
      {totalSlides > 0 && (
        <section
          aria-label="Featured Property Showcase Carousel"
          className="py-10 sm:py-14 px-4 sm:px-8 md:px-12 border-t border-lux-border bg-lux-card/60"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <span className="text-lux-gold text-[10px] uppercase tracking-[0.35em] font-black block mb-1.5">
                Featured Portfolio Gallery
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif text-lux-forest italic">
                Curated Bangalore <span className="not-italic text-lux-gold">Residences.</span>
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous property slide"
                className="p-2.5 bg-lux-card hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next property slide"
                className="p-2.5 bg-lux-card hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={onExploreProperties}
                className="ml-2 px-4 py-2.5 bg-lux-forest hover:bg-lux-forest-hover text-lux-card text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleDesktopCards.map((project, idx) => (
              <article
                key={`${project.id || project.name}-${idx}`}
                className={`bg-lux-card border border-lux-border rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all group flex flex-col justify-between ${
                  idx === 1 ? 'hidden md:flex' : idx === 2 ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-lux-ivory">
                    <img
                      src={project.imageUrls[0]}
                      alt={`${project.name} in ${project.location}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-lux-forest/90 text-lux-card text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">
                      {project.type || 'Primary'}
                    </span>
                    {project.handoverStatus && (
                      <span className="absolute top-3 right-3 bg-lux-card/95 text-lux-forest text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-lux-border">
                        {project.handoverStatus}
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-lux-forest truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-lux-muted flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="text-lux-gold shrink-0" />
                      <span>{project.location}</span>
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-lux-border text-xs">
                      <span className="font-mono font-black text-lux-forest">
                        {project.price}
                      </span>
                      <span className="text-[11px] text-lux-muted font-medium">
                        {project.propertyType || 'Apartment'}
                        {project.configuration?.length ? ` • ${project.configuration[0]}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="w-full py-2.5 bg-lux-ivory hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
                  >
                    Inspect Property
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6" role="tablist" aria-label="Carousel slide indicators">
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id || slide.name}
                type="button"
                aria-label={`Show slide ${idx + 1}`}
                aria-selected={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
                className={
                  idx === currentIndex
                    ? 'w-6 h-2 rounded-full bg-lux-forest transition-all cursor-pointer'
                    : 'w-2 h-2 rounded-full bg-lux-border hover:bg-lux-gold transition-all cursor-pointer'
                }
              />
            ))}
          </div>
        </section>
      )}

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
