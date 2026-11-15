import React, { useState } from 'react';
import { Project } from '../types';
import { 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  Share2, 
  Download, 
  CalendarCheck,
  ExternalLink
} from 'lucide-react';
import { generateOptimizedSeoMetadata } from '../lib/autoSeoEnhancer';

import { OptimizedImage } from './OptimizedImage';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onEnquire: (project: Project) => void;
  onSiteVisit: (project: Project) => void;
  onDownloadBrochure: (project: Project) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onEnquire,
  onSiteVisit,
  onDownloadBrochure
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = [
    ...(project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls : []),
    ...(project.mobileImageUrl ? [project.mobileImageUrl] : []),
    ...(project.floorPlanImageUrl ? [project.floorPlanImageUrl] : [])
  ].filter(Boolean);

  const heroImage = images.length > 0 
    ? images[activeImageIdx] 
    : ((project as any).imageUrl || (project.imageUrls && project.imageUrls[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');

  const seoData = generateOptimizedSeoMetadata(project);
  const cleanPrice = project.price || project.lastPrice || 'Price on Request';
  const builderName = project.builderName;
  const locationStr = project.location || project.zone;
  const reraNum = project.reraNumber;
  const handover = project.handoverDate || project.handoverStatus;
  const features = Array.isArray(project.features) ? project.features : [];

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Hello BS Homez, I am interested in ${project.name} located at ${locationStr}. Please share brochures and pricing details.`);
    window.open(`https://wa.me/919845012345?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-lux-ivory text-lux-charcoal pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Back Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-lux-forest hover:text-lux-forest-hover transition-colors font-semibold text-sm tracking-wider uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Projects
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-lux-card text-lux-forest border border-lux-border text-xs font-semibold hover:bg-lux-forest hover:text-lux-card hover:border-lux-forest transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Share
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Main Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-lux-border bg-lux-card shadow-md">
              <OptimizedImage
                src={heroImage}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                priority={true}
                width={1200}
                height={750}
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-lux-card/95 backdrop-blur-md text-lux-forest border border-lux-border text-xs font-semibold uppercase tracking-wider shadow-2xs">
                  {project.propertyType || 'Residential'}
                </span>
                {project.type && (
                  <span className="px-3 py-1 rounded-full bg-lux-forest text-lux-card border border-lux-gold/40 text-xs font-bold uppercase tracking-wider shadow-2xs">
                    {project.type}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-lux-forest ring-2 ring-lux-gold/40 scale-105' : 'border-lux-border opacity-70 hover:opacity-100 hover:border-lux-gold'
                    }`}
                  >
                    <OptimizedImage
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      width={96}
                      height={64}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Summary & Action Card */}
          <div className="bg-lux-card border border-lux-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-xs font-semibold tracking-widest text-lux-gold uppercase mb-2">
                {builderName ? `By ${builderName}` : 'Verified Luxury Portfolio'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-lux-charcoal mb-3 tracking-tight font-serif">
                {project.name}
              </h1>
              
              {locationStr && (
                <div className="flex items-center gap-2 text-lux-muted text-sm mb-6">
                  <MapPin className="w-4 h-4 text-lux-gold shrink-0" />
                  <span>{locationStr}</span>
                </div>
              )}

              <div className="bg-lux-ivory rounded-xl p-4 border border-lux-border mb-6">
                <div className="text-xs text-lux-muted uppercase tracking-wider mb-1">Starting Price</div>
                <div className="text-2xl font-bold text-lux-forest">{cleanPrice}</div>
              </div>

              <div className="space-y-3 mb-6 border-t border-b border-lux-border py-4">
                {reraNum && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-lux-muted flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-lux-forest" />
                      RERA Number
                    </span>
                    <span className="font-mono text-xs text-lux-forest bg-lux-forest/10 px-2.5 py-0.5 rounded border border-lux-forest/20 font-semibold">
                      {reraNum}
                    </span>
                  </div>
                )}
                {handover && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-lux-muted flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-lux-gold" />
                      Handover / Status
                    </span>
                    <span className="font-semibold text-lux-charcoal">{handover}</span>
                  </div>
                )}
                {project.zone && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-lux-muted flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-lux-gold" />
                      Corridor Zone
                    </span>
                    <span className="font-semibold text-lux-charcoal">{project.zone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => onEnquire(project)}
                className="w-full py-3 px-4 rounded-xl bg-lux-forest text-lux-card font-bold text-sm tracking-wider uppercase hover:bg-lux-forest-hover transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-lux-gold" />
                Enquire Now
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onSiteVisit(project)}
                  className="py-2.5 px-3 rounded-xl bg-lux-ivory text-lux-forest font-semibold text-xs tracking-wider uppercase hover:bg-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-lux-gold" />
                  Site Visit
                </button>
                <button
                  onClick={() => onDownloadBrochure(project)}
                  className="py-2.5 px-3 rounded-xl bg-lux-ivory text-lux-forest font-semibold text-xs tracking-wider uppercase hover:bg-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-lux-gold" />
                  Brochure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs / Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-lux-card border border-lux-border rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-lux-charcoal mb-4 font-serif border-b border-lux-border pb-3">
                Project Overview & Architecture
              </h2>
              <p className="text-lux-charcoal/90 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {project.description || `${project.name} is a verified luxury residence in ${locationStr}, offering premium architectural design and lifestyle amenities.`}
              </p>
            </div>

            {/* Amenities & Features */}
            {features.length > 0 && (
              <div className="bg-lux-card border border-lux-border rounded-2xl p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-bold text-lux-charcoal mb-6 font-serif border-b border-lux-border pb-3">
                  Key Amenities & Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-lux-ivory p-3.5 rounded-xl border border-lux-border">
                      <CheckCircle2 className="w-5 h-5 text-lux-forest shrink-0 mt-0.5" />
                      <span className="text-sm text-lux-charcoal font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Advisory Card */}
          <div className="space-y-6">
            <div className="bg-lux-forest text-lux-card border border-lux-gold/40 rounded-2xl p-6 shadow-lg">
              <div className="text-lux-gold font-serif text-lg font-bold mb-2">BS Homez Advisory</div>
              <p className="text-lux-ivory/90 text-xs sm:text-sm leading-relaxed mb-6">
                Connect with our senior property consultants for priority viewing schedules, personalized floor plan comparisons, and direct developer pricing.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+919845012345"
                  className="w-full py-2.5 px-4 rounded-xl bg-lux-card text-lux-forest border border-lux-gold/30 font-semibold text-xs tracking-wider uppercase hover:bg-lux-ivory transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-lux-gold" />
                  +91 98450 12345
                </a>
                <a
                  href="mailto:contact@bshomez.in"
                  className="w-full py-2.5 px-4 rounded-xl bg-lux-forest-hover text-lux-ivory border border-lux-gold/30 font-semibold text-xs tracking-wider uppercase hover:bg-lux-gold hover:text-lux-charcoal transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  contact@bshomez.in
                </a>
              </div>
            </div>

            {/* Back link */}
            <div className="text-center pt-2">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-lux-muted hover:text-lux-forest transition-colors text-sm font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Portfolio Listing
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
