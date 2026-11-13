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
    <div className="min-h-screen bg-[#0c0c0c] text-[#f0f0f0] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Back Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#d4af37] transition-colors font-medium text-sm tracking-wider uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Projects
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold hover:bg-[#25D366]/30 transition-colors"
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
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#262626] bg-[#141414]">
              <img
                src={heroImage}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold uppercase tracking-wider">
                  {project.propertyType || 'Residential'}
                </span>
                {project.type && (
                  <span className="px-3 py-1 rounded-full bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider">
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
                    className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx ? 'border-[#C5A059] scale-105' : 'border-[#262626] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Summary & Action Card */}
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="text-xs font-semibold tracking-widest text-[#C5A059] uppercase mb-2">
                {builderName ? `By ${builderName}` : 'Verified Luxury Portfolio'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight font-serif">
                {project.name}
              </h1>
              
              {locationStr && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{locationStr}</span>
                </div>
              )}

              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#262626] mb-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Starting Price</div>
                <div className="text-2xl font-bold text-[#C5A059]">{cleanPrice}</div>
              </div>

              <div className="space-y-3 mb-6 border-t border-b border-[#262626] py-4">
                {reraNum && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      RERA Number
                    </span>
                    <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                      {reraNum}
                    </span>
                  </div>
                )}
                {handover && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      Handover / Status
                    </span>
                    <span className="font-medium text-white">{handover}</span>
                  </div>
                )}
                {project.zone && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#C5A059]" />
                      Corridor Zone
                    </span>
                    <span className="font-medium text-white">{project.zone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => onEnquire(project)}
                className="w-full py-3 px-4 rounded-xl bg-[#C5A059] text-black font-bold text-sm tracking-wider uppercase hover:bg-[#d4af37] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Enquire Now
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onSiteVisit(project)}
                  className="py-2.5 px-3 rounded-xl bg-[#1f1f1f] text-white font-medium text-xs tracking-wider uppercase hover:bg-[#282828] border border-[#333] transition-all flex items-center justify-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  Site Visit
                </button>
                <button
                  onClick={() => onDownloadBrochure(project)}
                  className="py-2.5 px-3 rounded-xl bg-[#1f1f1f] text-white font-medium text-xs tracking-wider uppercase hover:bg-[#282828] border border-[#333] transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A059]" />
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
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-serif border-b border-[#262626] pb-3">
                Project Overview & Architecture
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {project.description || `${project.name} is a verified luxury residence in ${locationStr}, offering premium architectural design and lifestyle amenities.`}
              </p>
            </div>

            {/* Amenities & Features */}
            {features.length > 0 && (
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white mb-6 font-serif border-b border-[#262626] pb-3">
                  Key Amenities & Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-[#1a1a1a] p-3.5 rounded-xl border border-[#262626]">
                      <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-200 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Advisory Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1c1810] to-[#141414] border border-[#C5A059]/30 rounded-2xl p-6 shadow-xl">
              <div className="text-[#C5A059] font-serif text-lg font-bold mb-2">BS Homez Advisory</div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                Connect with our senior property consultants for priority viewing schedules, personalized floor plan comparisons, and direct developer pricing.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+919845012345"
                  className="w-full py-2.5 px-4 rounded-xl bg-black/60 text-[#C5A059] border border-[#C5A059]/30 font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  +91 98450 12345
                </a>
                <a
                  href="mailto:contact@bshomez.in"
                  className="w-full py-2.5 px-4 rounded-xl bg-black/60 text-gray-300 border border-[#262626] font-semibold text-xs tracking-wider uppercase hover:text-white transition-colors flex items-center justify-center gap-2"
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
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C5A059] transition-colors text-sm font-medium"
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
