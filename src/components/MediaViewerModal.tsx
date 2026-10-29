import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Film, Image as ImageIcon, CheckCircle2, ShieldCheck, Calendar, MapPin, EyeOff, Lock } from 'lucide-react';
import { Project } from '../types';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  isAdmin?: boolean;
  onEnquire?: (project: Project) => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  project,
  isAdmin = false,
  onEnquire
}) => {
  // Listen for Escape key to easily close popup
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPrimary = project.type === 'Primary' || project.type === 'Primary Sale' || (!project.type && project.type !== 'Rental' && project.type !== 'Resale');
  // For primary projects: hide images for online browsers/users; only admin can view them
  const canViewImages = !isPrimary || isAdmin;

  const rawImages = (project.imageUrls || []).filter(Boolean);
  const images = canViewImages ? rawImages : [];
  const videoUrl = project.videoUrl || project.mobileVideoUrl;

  type MediaTab = 'photos' | 'video';
  const [activeTab, setActiveTab] = useState<MediaTab>(
    images.length > 0 ? 'photos' : videoUrl ? 'video' : 'photos'
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-5xl bg-[#0D0D0D] border-2 border-white rounded-md shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[96vh] my-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Prominent Floating Close Button in Top-Right Corner */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 px-3 py-1.5 rounded-full bg-white text-black hover:bg-art-gold font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer border-2 border-white"
            aria-label="Close Window"
            title="Close (Esc)"
          >
            <X size={16} className="stroke-[3]" />
            <span className="font-mono text-[11px]">CLOSE</span>
          </button>

          {/* Top Bar Header */}
          <div className="p-4 sm:p-5 bg-white/[0.03] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-24 sm:pr-28">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-black">
                  {project.type} Portfolio Media Gallery
                </span>
                {project.availableFrom && (
                  <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1">
                    <Calendar size={10} /> Available: {project.availableFrom}
                  </span>
                )}
                {isPrimary && !isAdmin && (
                  <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                    <Lock size={10} /> Direct Builder Verified Mandate
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white font-bold italic truncate max-w-lg">
                {project.name}
              </h3>
              <p className="text-xs text-white/60 font-sans flex items-center gap-1.5 mt-0.5">
                <MapPin size={11} className="text-art-gold shrink-0" />
                <span>{project.location} {project.zone ? `(${project.zone})` : ''}</span>
              </p>
            </div>

            {/* Media Mode Switcher (If both photos and video available) */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-white/5 border border-white/15 p-1 rounded-sm gap-1">
                {canViewImages && images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('photos')}
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'photos'
                        ? 'bg-art-gold text-black font-black shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <ImageIcon size={12} />
                    <span>Photos ({images.length})</span>
                  </button>
                )}
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'video'
                        ? 'bg-purple-500 text-black font-black shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Film size={12} />
                    <span>Video Tour</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Media Stage */}
          <div className="relative flex-grow flex items-center justify-center bg-black min-h-[300px] sm:min-h-[460px] p-2 sm:p-6 overflow-hidden">
            {canViewImages && activeTab === 'photos' && images.length > 0 ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="relative w-full max-h-[58vh] flex items-center justify-center">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${project.name} - Photo ${currentImageIndex + 1}`}
                    className="max-h-[56vh] max-w-full object-contain rounded border border-white/10 shadow-2xl select-none"
                  />
                  {/* Prev / Next Controls */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/80 hover:bg-white text-white hover:text-black rounded-full border border-white/30 transition-all cursor-pointer shadow-2xl hover:scale-110"
                        title="Previous Photo"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/80 hover:bg-white text-white hover:text-black rounded-full border border-white/30 transition-all cursor-pointer shadow-2xl hover:scale-110"
                        title="Next Photo"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Strip */}
                {images.length > 1 && (
                  <div className="mt-3 flex items-center gap-2 max-w-full overflow-x-auto py-1 px-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          idx === currentImageIndex
                            ? 'border-art-gold scale-105 shadow-md'
                            : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'video' && videoUrl ? (
              <div className="w-full max-w-3xl flex flex-col items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[58vh] w-full rounded border border-white/15 shadow-2xl bg-black"
                >
                  Your browser does not support HTML5 video streaming.
                </video>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/60 font-mono">
                  <Play size={12} className="text-purple-400" />
                  <span>Verified Compressed Walkthrough • High Definition 1080p Quality</span>
                </div>
              </div>
            ) : isPrimary && !isAdmin ? (
              <div className="text-center py-16 px-6 max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-art-gold/10 border border-art-gold/30 flex items-center justify-center mx-auto text-art-gold">
                  <Lock size={28} />
                </div>
                <h4 className="text-xl font-serif italic text-white">Private Verified Acquisition</h4>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  Portraits and architectural blueprints for primary developer projects are available via private verified advisory session with BS Homez.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onEnquire) onEnquire(project);
                  }}
                  className="px-6 py-2.5 bg-art-gold hover:bg-white text-black text-xs font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  Request Verified Consultation
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-white/40 font-mono text-sm">
                No high-definition media uploaded yet for this property.
              </div>
            )}
          </div>

          {/* Bottom Bar: Action buttons & Clear Close Window Option */}
          <div className="p-4 sm:p-5 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-black text-white font-sans">
                  {project.type === 'Rental' ? project.monthlyRental || project.price : project.price}
                </span>
                <span className="text-[10px] font-mono text-white/50 uppercase">
                  {project.type === 'Rental' ? 'Monthly Lease' : 'Resale / Acquisition'}
                </span>
              </div>
              <p className="text-xs text-white/70 font-sans line-clamp-1 max-w-xl">
                {project.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {/* Bottom Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all border border-white/20 cursor-pointer flex items-center gap-1.5"
                title="Close this popup window"
              >
                <X size={14} />
                <span>Close Window</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onEnquire) onEnquire(project);
                }}
                className="px-6 py-2.5 bg-art-gold hover:bg-white text-black text-xs font-black uppercase tracking-wider rounded-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 size={14} />
                <span>Inquire on this Listing</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
