import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Film, 
  Image as ImageIcon, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Lock,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Move
} from 'lucide-react';
import { Project } from '../types';
import { parseVideoUrl } from './MediaUploadCompressor';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  isAdmin?: boolean;
  onEnquire?: (project: Project) => void;
  initialImageIndex?: number;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  project,
  isAdmin = false,
  onEnquire,
  initialImageIndex = 0
}) => {
  type MediaTab = 'photos' | 'video';
  const [activeTab, setActiveTab] = useState<MediaTab>('photos');
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);

  // Zoom & Pan state for inspecting resale & rental property photos
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 });

  // Native touch gesture tracking for mobile swipe navigation
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchDeltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  // Derive media info safely
  const isPrimary = project
    ? project.type === 'Primary' || project.type === 'Primary Sale' || (!project.type && project.type !== 'Rental' && project.type !== 'Resale')
    : false;
  const isRentalOrResale = project?.type === 'Rental' || project?.type === 'Resale';
  const canViewImages = !isPrimary || isAdmin;
  const rawImages = (project?.imageUrls || []).filter(Boolean);
  const images = canViewImages ? rawImages : [];
  const videoUrl = project?.videoUrl || project?.mobileVideoUrl;

  // Sync active tab & reset image index when modal opens or project changes
  useEffect(() => {
    if (!isOpen || !project) return;
    const hasPhotos = canViewImages && rawImages.length > 0;
    const hasVideo = Boolean(videoUrl);
    setActiveTab(hasPhotos ? 'photos' : hasVideo ? 'video' : 'photos');
    setCurrentImageIndex(initialImageIndex || 0);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setSwipeOffset(0);
  }, [isOpen, project?.id, project?.name, isAdmin, initialImageIndex]);

  // Listen for Escape key to close popup, and arrow keys for keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && activeTab === 'photos' && images.length > 1) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && activeTab === 'photos' && images.length > 1) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activeTab, images.length, currentImageIndex]);

  if (!isOpen || !project) return null;

  // Reset zoom & pan when switching images
  const resetZoomAndPan = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length === 0) return;
    resetZoomAndPan();
    setSlideDirection('prev');
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (images.length === 0) return;
    resetZoomAndPan();
    setSlideDirection('next');
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Zoom controls
  const handleToggleZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (zoomLevel > 1) {
      resetZoomAndPan();
    } else {
      setZoomLevel(2);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(prev => Math.min(3, Math.round((prev + 0.5) * 10) / 10));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(prev => {
      const next = Math.max(1, Math.round((prev - 0.5) * 10) / 10);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // Double tap / double click to toggle zoom
  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleZoom();
  };

  // Native Mobile Touch Handlers for swipe navigation & pinch/pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      touchDeltaRef.current = { x: 0, y: 0 };

      if (zoomLevel > 1) {
        setIsPanning(true);
        panStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          panX: pan.x,
          panY: pan.y
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchDeltaRef.current = { x: deltaX, y: deltaY };

    if (zoomLevel > 1) {
      // Pan zoomed image
      const moveX = touch.clientX - panStartRef.current.x;
      const moveY = touch.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.panX + moveX,
        y: panStartRef.current.panY + moveY
      });
    } else if (images.length > 1) {
      // Horizontal swipe preview resistance
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setSwipeOffset(deltaX * 0.4);
      }
    }
  };

  const handleTouchEnd = () => {
    if (zoomLevel > 1) {
      setIsPanning(false);
    } else if (touchStartRef.current && images.length > 1) {
      const { x: deltaX, y: deltaY } = touchDeltaRef.current;
      const swipeThreshold = 45; // Minimum horizontal distance for native swipe
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontal && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) {
          // Swiped left -> Next photo
          handleNext();
        } else {
          // Swiped right -> Previous photo
          handlePrev();
        }
      }
    }
    touchStartRef.current = null;
    touchDeltaRef.current = { x: 0, y: 0 };
    setSwipeOffset(0);
  };

  // Mouse pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      const moveX = e.clientX - panStartRef.current.x;
      const moveY = e.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.panX + moveX,
        y: panStartRef.current.panY + moveY
      });
    }
  };

  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);
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
                  {project.type || 'Primary'} Portfolio Media Gallery
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
                {isRentalOrResale && (
                  <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 font-bold">
                    <span>✓</span> Verified Physical Property Photos
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

          {/* Main Media Stage with Native Swipe Gestures & Normal / Zoom View */}
          <div 
            className="relative flex-grow flex items-center justify-center bg-black min-h-[320px] sm:min-h-[480px] p-2 sm:p-6 overflow-hidden select-none touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            data-testid="swipeable-media-stage"
          >
            {canViewImages && activeTab === 'photos' && images.length > 0 ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                
                {/* Top Control Bar inside stage: Normal View Status & Zoom Controls */}
                <div className="absolute top-2 left-2 right-2 z-40 flex items-center justify-between gap-2 pointer-events-none">
                  {/* Left: View Mode Tag & Mobile swipe guidance */}
                  <div className="pointer-events-auto flex items-center gap-1.5 flex-wrap">
                    <span 
                      className={`text-[9px] font-mono px-2 py-1 rounded border shadow-md font-bold flex items-center gap-1 backdrop-blur-md ${
                        zoomLevel > 1 
                          ? 'bg-art-gold text-black border-art-gold' 
                          : 'bg-black/80 text-white/90 border-white/20'
                      }`}
                    >
                      {zoomLevel > 1 ? (
                        <>
                          <Move size={10} />
                          <span>Zoomed {Math.round(zoomLevel * 100)}% • Drag to Pan</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 size={10} className="text-art-gold" />
                          <span>Normal View (100%)</span>
                        </>
                      )}
                    </span>
                    {isRentalOrResale && zoomLevel === 1 && (
                      <span className="hidden sm:inline-flex text-[8.5px] font-mono text-art-gold/90 bg-black/75 px-2 py-1 rounded border border-art-gold/30">
                        Double-click or tap Zoom to inspect details
                      </span>
                    )}
                  </div>

                  {/* Right: Interactive Zoom Buttons */}
                  <div className="pointer-events-auto flex items-center bg-black/85 backdrop-blur-md border border-white/25 rounded-md p-0.5 shadow-2xl gap-1">
                    <button
                      type="button"
                      onClick={handleToggleZoom}
                      data-testid="zoom-toggle-btn"
                      className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded transition-all flex items-center gap-1 cursor-pointer ${
                        zoomLevel > 1 
                          ? 'bg-art-gold text-black shadow' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      title={zoomLevel > 1 ? "Reset to Normal Uncropped View" : "Zoom In (2x)"}
                    >
                      {zoomLevel > 1 ? <ZoomOut size={12} /> : <ZoomIn size={12} />}
                      <span>{zoomLevel > 1 ? "Normal View" : "Zoom"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 3}
                      data-testid="zoom-in-btn"
                      className="p-1 hover:bg-white/20 text-white rounded transition-colors disabled:opacity-30 cursor-pointer"
                      title="Zoom In (+)"
                    >
                      <ZoomIn size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                      data-testid="zoom-out-btn"
                      className="p-1 hover:bg-white/20 text-white rounded transition-colors disabled:opacity-30 cursor-pointer"
                      title="Zoom Out (-)"
                    >
                      <ZoomOut size={14} />
                    </button>

                    {zoomLevel > 1 && (
                      <button
                        type="button"
                        onClick={resetZoomAndPan}
                        data-testid="reset-zoom-btn"
                        className="p-1 hover:bg-white/20 text-art-gold rounded transition-colors cursor-pointer"
                        title="Reset to 100% Normal View"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Image Stage with Native Swipe & Zoom Transforms */}
                <div className="relative w-full max-h-[50vh] flex items-center justify-center my-auto overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`img-stage-${currentImageIndex}`}
                      initial={{ 
                        opacity: 0, 
                        x: slideDirection === 'next' ? 60 : slideDirection === 'prev' ? -60 : 0 
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: swipeOffset 
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: slideDirection === 'next' ? -60 : slideDirection === 'prev' ? 60 : 0 
                      }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="relative inline-block max-w-full max-h-[48vh]"
                    >
                      <div
                        className={`relative overflow-hidden flex items-center justify-center rounded border border-white/10 shadow-2xl ${
                          zoomLevel > 1 
                            ? isPanning ? 'cursor-grabbing' : 'cursor-grab' 
                            : 'cursor-zoom-in'
                        }`}
                        onDoubleClick={handleDoubleTap}
                        style={{
                          transform: `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px)`,
                          transformOrigin: 'center center',
                          transition: isPanning ? 'none' : 'transform 0.2s ease-out'
                        }}
                      >
                        <img
                          src={images[currentImageIndex]}
                          alt={`${project.name} - Photo ${currentImageIndex + 1}`}
                          className="max-h-[48vh] max-w-full object-contain rounded select-none pointer-events-none"
                          draggable={false}
                        />

                        {/* BS Homez Image Watermark */}
                        <div className="pointer-events-none absolute bottom-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-sm border border-art-gold/40 text-white text-[9.5px] font-black tracking-widest font-mono shadow-2xl select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-art-gold animate-pulse" />
                          <span>BS Homez</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Desktop Prev / Next Arrow Controls (Discreet on desktop, mobile uses swipe gestures) */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/80 hover:bg-white text-white hover:text-black rounded-full border border-white/30 transition-all cursor-pointer shadow-2xl hover:scale-110 z-40"
                        title="Previous Photo (← key or swipe right)"
                        aria-label="Previous Photo"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-black/80 hover:bg-white text-white hover:text-black rounded-full border border-white/30 transition-all cursor-pointer shadow-2xl hover:scale-110 z-40"
                        title="Next Photo (→ key or swipe left)"
                        aria-label="Next Photo"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile Native Touch Gesture Hint & Pagination Dots */}
                {images.length > 1 && (
                  <div className="flex flex-col items-center justify-center gap-1.5 mt-2 sm:hidden z-30">
                    <div className="flex items-center gap-1.5">
                      {images.map((_, idx) => (
                        <button
                          key={`dot-${idx}`}
                          type="button"
                          onClick={() => {
                            resetZoomAndPan();
                            setSlideDirection(idx > currentImageIndex ? 'next' : 'prev');
                            setCurrentImageIndex(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === currentImageIndex ? 'w-6 bg-art-gold' : 'w-1.5 bg-white/40'
                          }`}
                          aria-label={`Go to photo ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-art-gold/90 font-bold tracking-wider">
                      👈 Swipe left / right to browse photos ({currentImageIndex + 1}/{images.length}) 👉
                    </span>
                  </div>
                )}

                {/* Thumbnails Strip */}
                {images.length > 1 && (
                  <div className="mt-2.5 flex items-center gap-2 max-w-full overflow-x-auto py-1 px-2 z-30">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          resetZoomAndPan();
                          setSlideDirection(idx > currentImageIndex ? 'next' : 'prev');
                          setCurrentImageIndex(idx);
                        }}
                        className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          idx === currentImageIndex
                            ? 'border-art-gold scale-105 shadow-md ring-2 ring-art-gold/50'
                            : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                        title={`View photo ${idx + 1}`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-1 text-[7.5px] font-mono bg-black/80 px-1 rounded text-white/90">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'video' && videoUrl ? (
              <div className="w-full max-w-2xl flex flex-col items-center justify-center">
                {(() => {
                  const parsed = parseVideoUrl(videoUrl);
                  if (parsed.isEmbeddable) {
                    return (
                      <div className="w-full aspect-video max-h-[50vh] rounded-lg overflow-hidden border border-white/15 shadow-2xl bg-black">
                        <iframe
                          src={parsed.embedUrl}
                          title={`${project.name} Walkthrough Video`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    );
                  }
                  return (
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[50vh] max-w-2xl w-full rounded-lg border border-white/15 shadow-2xl bg-black object-contain"
                    >
                      Your browser does not support HTML5 video streaming.
                    </video>
                  );
                })()}
                <div className="mt-3 flex items-center gap-2 text-xs text-white/60 font-mono">
                  <Play size={12} className="text-purple-400" />
                  <span>Verified Compressed Walkthrough • Stream-Optimized Playback</span>
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
