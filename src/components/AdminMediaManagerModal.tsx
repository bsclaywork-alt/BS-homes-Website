import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Star, 
  Video, 
  Image as ImageIcon, 
  Camera, 
  Save, 
  Loader2,
  MapPin,
  Tag
} from 'lucide-react';
import { Project } from '../types';
import { MediaUploadCompressor } from './MediaUploadCompressor';
import { cn } from '../lib/utils';

interface AdminMediaManagerModalProps {
  project: Project;
  onClose: () => void;
  onSave: (updatedProject: Project) => Promise<void>;
}

export const AdminMediaManagerModal: React.FC<AdminMediaManagerModalProps> = ({
  project,
  onClose,
  onSave
}) => {
  const [images, setImages] = useState<string[]>(project.imageUrls || []);
  const [videoUrl, setVideoUrl] = useState<string>(project.videoUrl || '');
  const [mobileVideoUrl, setMobileVideoUrl] = useState<string>(project.mobileVideoUrl || '');
  const [mobileImageUrl, setMobileImageUrl] = useState<string>(project.mobileImageUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isRental = project.type === 'Rental';
  const isResale = project.type === 'Resale';
  const isPrimary = !isRental && !isResale;

  const accentColor: 'cyan' | 'amber' | 'gold' = isRental ? 'cyan' : isResale ? 'amber' : 'gold';

  const themeBadges = {
    cyan: {
      border: 'border-cyan-500/40',
      badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      btn: 'bg-cyan-500 hover:bg-white text-black',
      star: 'text-cyan-400'
    },
    amber: {
      border: 'border-amber-500/40',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      btn: 'bg-amber-500 hover:bg-white text-black',
      star: 'text-amber-400'
    },
    gold: {
      border: 'border-art-gold/40',
      badge: 'bg-art-gold/15 text-art-gold border-art-gold/30',
      btn: 'bg-art-gold hover:bg-white text-black',
      star: 'text-art-gold'
    }
  }[accentColor];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updatedProject: Project = {
        ...project,
        imageUrls: images,
        videoUrl: videoUrl,
        mobileVideoUrl: videoUrl || mobileVideoUrl,
        mobileImageUrl: images[0] || mobileImageUrl || ''
      };

      await onSave(updatedProject);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed saving project media:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#0e0e0e] border-2 border-white rounded-md shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col overflow-hidden text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar with High-Contrast CLOSE Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414] shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm border font-mono", themeBadges.badge)}>
                {project.type || 'Primary'} Portfolio
              </span>
              <span className="text-[10px] font-mono text-white/50 flex items-center gap-1">
                <MapPin size={11} className={themeBadges.star} /> {project.location}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white font-bold flex items-center gap-2">
              <Camera size={20} className={themeBadges.star} />
              <span>Media &amp; Cover Manager: {project.name}</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-white text-black hover:bg-art-gold font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-all cursor-pointer border border-white shrink-0"
            aria-label="Close Media Manager"
            title="Close Window (Esc)"
          >
            <X size={15} className="stroke-[3]" />
            <span className="font-mono text-[10px]">CLOSE</span>
          </button>
        </div>

        {/* Scrollable Workspace */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Cover Image Spotlight Banner */}
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded overflow-hidden border border-art-gold shrink-0 bg-black shadow-md relative">
              {images.length > 0 ? (
                <img 
                  src={images[0]} 
                  alt="Active Cover" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-[9px] font-mono p-2 text-center">
                  <ImageIcon size={20} className="mb-1" />
                  No cover photo set
                </div>
              )}
              {images.length > 0 && (
                <div className="absolute bottom-0 inset-x-0 bg-art-gold text-black text-[7px] font-black uppercase tracking-wider text-center py-0.5 font-mono">
                  Active Cover
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-art-gold text-xs font-black uppercase tracking-wider">
                <Star size={13} className="fill-art-gold" />
                <span>Primary Cover Image Spotlight</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                The first image in the gallery serves as the cover image displayed across search portals, property listings, and social cards.
                Use the <span className="text-art-gold font-bold">"Set as Cover"</span> button on any photo below to instantly change the cover.
              </p>
              <div className="text-[10px] font-mono text-white/50 pt-1 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <span>Total Photos: <strong className="text-white">{images.length}</strong></span>
                <span>•</span>
                <span>Video Walkthrough: <strong className={videoUrl ? "text-emerald-400" : "text-white/40"}>{videoUrl ? "Attached" : "None"}</strong></span>
              </div>
            </div>
          </div>

          {/* Core Upload Compressor & Manager with Real-Time Progress Bar */}
          <MediaUploadCompressor
            accentColor={accentColor}
            title={`${project.name} • Media & Video Walkthrough Manager`}
            images={images}
            onImagesChange={(imgs) => setImages(imgs)}
            videoUrl={videoUrl}
            onVideoChange={(vUrl, poster) => {
              setVideoUrl(vUrl);
              if (vUrl) setMobileVideoUrl(vUrl);
              if (poster) setMobileImageUrl(poster);
            }}
          />

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Project media &amp; cover image saved successfully! Updating application...</span>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#141414] border-t border-white/10 shrink-0">
          <div className="text-[10px] font-mono text-white/40 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 text-white rounded">Esc</kbd> to exit without saving
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 uppercase tracking-widest text-[10px] font-bold rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X size={13} />
              <span>Close Window</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "flex-1 sm:flex-none px-8 py-3 uppercase tracking-[0.2em] text-[10px] font-black rounded-sm transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50",
                themeBadges.btn
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save Media to App</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
