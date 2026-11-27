import React, { useEffect, useMemo, useState } from 'react';
import { deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CheckCircle2, Eye, EyeOff, ImagePlus, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { db } from '../lib/firebase';
import { compressPhotoAsset, uploadCloudinaryPhoto } from '../lib/mediaProcessor';
import { Project } from '../types';

export type HomeScrollerTransaction =
  | 'Primary Sale'
  | 'Resale'
  | 'Rental'
  | 'Plots'
  | 'Commercial'
  | 'New Launch'
  | 'Featured Project';

export interface HomeScrollerSlide {
  id: string;
  title: string;
  subtitle: string;
  transactionType: HomeScrollerTransaction;
  location: string;
  priceLabel: string;
  imageUrl: string;
  ctaLabel: string;
  projectId: string;
  enabled: boolean;
}

const SETTINGS_REF = doc(db, 'site_settings', 'home_scroller');
const TRANSACTION_TYPES: HomeScrollerTransaction[] = [
  'Primary Sale', 'Resale', 'Rental', 'Plots', 'Commercial', 'New Launch', 'Featured Project'
];

const makeSlide = (index: number): HomeScrollerSlide => ({
  id: `home-slide-${Date.now()}-${index}`,
  title: '',
  subtitle: '',
  transactionType: 'Primary Sale',
  location: 'Bengaluru',
  priceLabel: '',
  imageUrl: '',
  ctaLabel: 'Explore Project',
  projectId: '',
  enabled: true
});

const normalizeSlides = (value: unknown): HomeScrollerSlide[] => {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 6).map((item: any, index) => ({
    id: String(item?.id || `home-slide-${index}`),
    title: String(item?.title || ''),
    subtitle: String(item?.subtitle || ''),
    transactionType: TRANSACTION_TYPES.includes(item?.transactionType) ? item.transactionType : 'Primary Sale',
    location: String(item?.location || ''),
    priceLabel: String(item?.priceLabel || ''),
    imageUrl: String(item?.imageUrl || ''),
    ctaLabel: String(item?.ctaLabel || 'Explore Project'),
    projectId: String(item?.projectId || ''),
    enabled: item?.enabled !== false
  }));
};

interface SharedProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onExploreProperties: () => void;
}

export const HomeScrollerCarousel: React.FC<SharedProps> = ({ projects, onSelectProject, onExploreProperties }) => {
  const [slides, setSlides] = useState<HomeScrollerSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentPlacement, setContentPlacement] = useState<'below' | 'overlay'>('below');

  useEffect(() => onSnapshot(SETTINGS_REF, snapshot => {
    const data = snapshot.exists() ? snapshot.data() : {};
    setContentPlacement(data.contentPlacement === 'overlay' ? 'overlay' : 'below');
    setSlides(data.isEnabled === false ? [] : normalizeSlides(data.slides).filter(slide => slide.enabled && slide.imageUrl));
  }, error => console.error('Home Scroller could not be loaded:', error)), []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex(current => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  if (!slides.length) return null;
  const slide = slides[activeIndex];
  const openSlide = () => {
    const linkedProject = projects.find(project =>
      (slide.projectId && project.id === slide.projectId) ||
      project.name.trim().toLowerCase() === slide.title.trim().toLowerCase()
    );
    if (linkedProject) onSelectProject(linkedProject);
    else onExploreProperties();
  };

  return (
    <section className="relative w-full overflow-hidden rounded-sm bg-[#101914] text-white" aria-label="Featured property projects">
      <div className={contentPlacement === 'below' ? 'flex flex-col' : 'relative'}>
        <div className={contentPlacement === 'below' ? 'relative aspect-[16/9] max-h-[340px] min-h-[190px] w-full overflow-hidden' : 'relative min-h-[280px] overflow-hidden'}>
          <img src={slide.imageUrl} alt={slide.title || 'Featured BS Homez property'} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
          {contentPlacement === 'overlay' && <><div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/15" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" /><div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6"><span className="rounded-sm border border-[#d8b56d]/70 bg-black/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#f1d18c]">{slide.transactionType}</span><h2 className="mt-2 max-w-xl break-words font-serif text-xl font-bold leading-tight sm:text-2xl">{slide.title}</h2></div></>}
          {slides.length > 1 && <><button type="button" aria-label="Previous slide" onClick={() => setActiveIndex(i => (i - 1 + slides.length) % slides.length)} className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/50 bg-black/55 p-2 text-white"><ArrowLeft size={16}/></button><button type="button" aria-label="Next slide" onClick={() => setActiveIndex(i => (i + 1) % slides.length)} className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/50 bg-black/55 p-2 text-white"><ArrowRight size={16}/></button><div className="absolute bottom-3 right-3 z-20 flex gap-1.5">{slides.map((item,index) => <button key={item.id} type="button" aria-label={'Show slide ' + (index + 1)} onClick={() => setActiveIndex(index)} className={index === activeIndex ? 'h-1.5 w-7 rounded-full bg-[#e4c47e]' : 'h-1.5 w-2.5 rounded-full bg-white/75'} />)}</div></>}
        </div>
        {contentPlacement === 'below' && <div className="space-y-2 border-t border-[#d8b56d]/25 bg-[#101914] px-4 py-4 sm:px-5 sm:py-5"><div className="flex flex-wrap items-center gap-2"><span className="rounded-sm border border-[#d8b56d]/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#f1d18c]">{slide.transactionType}</span><span className="text-[9px] font-mono text-white/55">{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span></div><h2 className="break-words font-serif text-xl font-bold leading-tight text-white sm:text-2xl">{slide.title}</h2>{slide.subtitle && <p className="max-w-2xl text-xs leading-relaxed text-white/75 sm:text-sm">{slide.subtitle}</p>}{(slide.location || slide.priceLabel) && <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-semibold uppercase tracking-wider">{slide.location && <span className="rounded-sm border border-white/20 px-2.5 py-1.5 text-white/80">{slide.location}</span>}{slide.priceLabel && <span className="rounded-sm border border-[#d8b56d]/45 px-2.5 py-1.5 text-[#f1d18c]">{slide.priceLabel}</span>}</div>}<button type="button" onClick={openSlide} className="mt-1 inline-flex min-h-10 items-center gap-2 rounded-sm bg-[#d8b56d] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#17130b]">{slide.ctaLabel || 'Explore Project'} <ArrowRight size={14}/></button></div>}
        {contentPlacement === 'overlay' && <div className="bg-[#101914] px-4 py-3"><button type="button" onClick={openSlide} className="inline-flex min-h-10 items-center gap-2 rounded-sm bg-[#d8b56d] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#17130b]">{slide.ctaLabel || 'Explore Project'} <ArrowRight size={14}/></button></div>}
      </div>
    </section>
  );
};

interface ManagerProps {
  projects: Project[];
}

export const HomeScrollerManager: React.FC<ManagerProps> = ({ projects }) => {
  const [slides, setSlides] = useState<HomeScrollerSlide[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [contentPlacement, setContentPlacement] = useState<'below' | 'overlay'>('below');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => onSnapshot(SETTINGS_REF, snapshot => {
    const data = snapshot.exists() ? snapshot.data() : {};
    const loaded = normalizeSlides(data.slides);
    setSlides(loaded);
    setIsEnabled(data.isEnabled !== false);
    setContentPlacement(data.contentPlacement === 'overlay' ? 'overlay' : 'below');
    setSelectedId(current => loaded.some(slide => slide.id === current) ? current : (loaded[0]?.id || ''));
    setLoading(false);
  }, error => {
    console.error('Home Scroller settings could not be read:', error);
    setNotice({ type: 'error', message: 'Could not load Home Scroller settings. Check Firestore access and refresh.' });
    setLoading(false);
  }), []);

  const selected = useMemo(() => slides.find(slide => slide.id === selectedId) || null, [slides, selectedId]);
  const updateSelected = (patch: Partial<HomeScrollerSlide>) => {
    if (!selectedId) return;
    setSlides(current => current.map(slide => slide.id === selectedId ? { ...slide, ...patch } : slide));
  };

  const addSlide = () => {
    if (slides.length >= 6) return;
    const next = makeSlide(slides.length + 1);
    setSlides(current => [...current, next]);
    setSelectedId(next.id);
    setNotice(null);
  };

  const removeSlide = (id: string) => {
    if (!window.confirm('Delete this slide from the Home Scroller?')) return;
    const next = slides.filter(slide => slide.id !== id);
    setSlides(next);
    setSelectedId(next[0]?.id || '');
  };

  const moveSlide = (id: string, direction: -1 | 1) => {
    const index = slides.findIndex(slide => slide.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next);
  };

  const uploadImage = async (file?: File) => {
    if (!file || !selected) return;
    if (!file.type.startsWith('image/')) {
      setNotice({ type: 'error', message: 'Please choose a JPG, PNG, or WebP image.' });
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setNotice({ type: 'error', message: 'Image size must be 15 MB or less.' });
      return;
    }
    setUploading(true);
    setUploadProgress(5);
    setNotice(null);
    try {
      const optimized = await compressPhotoAsset(file, { maxDimension: 1920, quality: 0.78, applyWatermark: true });
      setUploadProgress(35);
      const uploaded = await uploadCloudinaryPhoto({
        blob: optimized.blob,
        sessionId: 'home-scroller',
        fileName: file.name.replace(/\.[^.]+$/, optimized.mimeType.includes('webp') ? '.webp' : '.jpg'),
        onProgress: setUploadProgress
      });
      updateSelected({ imageUrl: uploaded.url });
      setNotice({ type: 'success', message: 'Image uploaded and attached to this slide. Save changes to publish it.' });
    } catch (error) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Image upload failed. Please retry.' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await setDoc(SETTINGS_REF, {
        isEnabled,
        contentPlacement,
        slides: slides.slice(0, 6).map((slide, index) => ({ ...slide, order: index + 1 })),
        updatedAt: serverTimestamp()
      });
      setNotice({ type: 'success', message: 'Home Scroller saved. The homepage will show the updated slides.' });
    } catch (error) {
      console.error('Home Scroller save failed:', error);
      setNotice({ type: 'error', message: 'Save failed. Check admin permissions and the Firestore rules deployment, then retry.' });
    } finally {
      setSaving(false);
    }
  };

  const deleteScroller = async () => {
    if (!window.confirm('Delete the entire Home Scroller? This removes all slides from the homepage.')) return;
    setSaving(true);
    try {
      await deleteDoc(SETTINGS_REF);
      setSlides([]);
      setSelectedId('');
      setIsEnabled(false);
      setNotice({ type: 'success', message: 'Home Scroller deleted from the homepage.' });
    } catch (error) {
      console.error('Home Scroller delete failed:', error);
      setNotice({ type: 'error', message: 'Could not delete the Home Scroller. Check admin permissions and Firestore rules deployment.' });
    } finally {
      setSaving(false);
    }
  };

  const selectProject = (projectId: string) => {
    const project = projects.find(item => item.id === projectId);
    if (!project) {
      updateSelected({ projectId: '' });
      return;
    }
    const transactionType: HomeScrollerTransaction = project.type === 'Rental' ? 'Rental' : project.type === 'Resale' ? 'Resale' : project.propertyType === 'Plot' ? 'Plots' : project.propertyType === 'Commercial' ? 'Commercial' : 'Primary Sale';
    updateSelected({
      projectId,
      title: project.name,
      subtitle: project.description || '',
      transactionType,
      location: project.location || '',
      priceLabel: project.price || '',
      imageUrl: project.imageUrls?.[0] || project.mobileImageUrl || ''
    });
  };

  return (
    <section className="space-y-5 text-white">
      <div className="flex flex-col gap-4 rounded-sm border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#d8b56d]">Homepage Presentation</p>
          <h3 className="mt-1 text-2xl font-serif italic sm:text-3xl">Home Scroller</h3>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/55">Manage up to six large homepage project slides. Upload a banner image, choose the transaction type, link an existing portfolio project, and publish when ready.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-sm border border-white/15 bg-black/20 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white/65">Text placement<select value={contentPlacement} onChange={event => setContentPlacement(event.target.value as "below" | "overlay")} className="rounded-sm border border-white/15 bg-[#1c1c1c] px-2 py-2 text-[10px] normal-case tracking-normal text-white"><option value="below">Below image (recommended)</option><option value="overlay">On image</option></select></label>
          <button type="button" onClick={() => setIsEnabled(value => !value)} className={`inline-flex items-center gap-2 rounded-sm border px-4 py-3 text-[10px] font-black uppercase tracking-wider ${isEnabled ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-white/15 bg-white/5 text-white/60'}`}>
            {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />} {isEnabled ? 'Visible on homepage' : 'Hidden on homepage'}
          </button>
          <button type="button" onClick={addSlide} disabled={slides.length >= 6 || loading} className="inline-flex items-center gap-2 rounded-sm bg-[#d8b56d] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black disabled:opacity-40"><Plus size={14} /> Add Slide ({slides.length}/6)</button>
        </div>
      </div>

      {notice && <div role="status" className={`rounded-sm border p-3 text-xs ${notice.type === 'success' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-red-400/30 bg-red-400/10 text-red-200'}`}>{notice.message}</div>}
      {loading ? <div className="p-8 text-center text-sm text-white/50">Loading Home Scroller…</div> : (
        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-widest text-white/55">Slides</span><span className="text-[10px] font-mono text-white/35">{slides.length} of 6</span></div>
            {slides.length === 0 && <div className="rounded-sm border border-dashed border-white/20 p-6 text-center text-xs text-white/45">No slides yet. Select Add Slide to create your first homepage banner.</div>}
            {slides.map((slide, index) => (
              <div key={slide.id} className={`flex items-center gap-2 rounded-sm border p-2 ${selectedId === slide.id ? 'border-[#d8b56d]/70 bg-[#d8b56d]/10' : 'border-white/10 bg-black/20'}`}>
                <button type="button" onClick={() => setSelectedId(slide.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-white/5">{slide.imageUrl ? <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-white/25"><ImagePlus size={18} /></div>}</div>
                  <span className="min-w-0"><span className="block text-[9px] font-mono text-white/40">SLIDE {index + 1}</span><span className="block truncate text-xs font-bold text-white">{slide.title || 'Untitled slide'}</span><span className="block truncate text-[9px] text-white/45">{slide.transactionType}</span></span>
                </button>
                <div className="flex flex-col gap-1">
                  <button type="button" aria-label="Move slide up" disabled={index === 0} onClick={() => moveSlide(slide.id, -1)} className="rounded p-1 text-white/50 hover:bg-white/10 disabled:opacity-20"><ArrowUp size={13} /></button>
                  <button type="button" aria-label="Move slide down" disabled={index === slides.length - 1} onClick={() => moveSlide(slide.id, 1)} className="rounded p-1 text-white/50 hover:bg-white/10 disabled:opacity-20"><ArrowDown size={13} /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={deleteScroller} disabled={saving || slides.length === 0} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-red-400/30 bg-red-500/10 px-4 py-3 text-[9px] font-black uppercase tracking-widest text-red-300 hover:bg-red-500/20 disabled:opacity-30"><Trash2 size={13} /> Delete entire scroller</button>
          </aside>

          <div className="min-w-0 rounded-sm border border-white/10 bg-[#111] p-4 sm:p-6">
            {!selected ? <div className="py-14 text-center text-sm text-white/45">Add or select a slide to edit its content.</div> : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div><p className="text-[9px] font-black uppercase tracking-widest text-[#d8b56d]">Slide editor</p><h4 className="mt-1 text-lg font-serif">{selected.title || 'New homepage slide'}</h4></div>
                  <button type="button" onClick={() => removeSlide(selected.id)} className="inline-flex items-center gap-2 rounded-sm border border-red-400/30 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-red-300 hover:bg-red-500/10"><Trash2 size={13} /> Delete slide</button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Slide / Transaction Type
                    <select value={selected.transactionType} onChange={event => updateSelected({ transactionType: event.target.value as HomeScrollerTransaction })} className="w-full rounded-sm border border-white/15 bg-[#1c1c1c] p-3 text-xs normal-case tracking-normal text-white">{TRANSACTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select>
                  </label>
                  <label className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Link Existing Project (optional)
                    <select value={selected.projectId} onChange={event => selectProject(event.target.value)} className="w-full rounded-sm border border-white/15 bg-[#1c1c1c] p-3 text-xs normal-case tracking-normal text-white"><option value="">No linked project</option>{projects.filter(project => !project.isDeleted).map(project => <option key={project.id || project.name} value={project.id || ''}>{project.name} · {project.type}</option>)}</select>
                  </label>
                  <label className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider text-white/55 md:col-span-2">Headline
                    <input value={selected.title} onChange={event => updateSelected({ title: event.target.value })} maxLength={120} placeholder="e.g. Discover Premium Homes in Whitefield" className="w-full rounded-sm border border-white/15 bg-[#1c1c1c] p-3 text-sm normal-case tracking-normal text-white" />
                  </label>
                  <label className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider text-white/55 md:col-span-2">Supporting Text
                    <textarea value={selected.subtitle} onChange={event => updateSelected({ subtitle: event.target.value })} maxLength={300} rows={3} placeholder="A short description for this featured project or transaction." className="w-full rounded-sm border border-white/15 bg-[#1c1c1c] p-3 text-sm normal-case tracking-normal text-white" />
                  </label>
                  <label className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Location
                    <input value={selected.location} onChange={event => updateSelected({ location: event.target.value })} maxLength={100} placeholder="Whitefield, Bengaluru" className="w-full rounded-sm border border-white/15 bg-[#1c1c1c] p-3 text-xs normal-case tracking-normal text-white" />
                  </label>
                  <label className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Price / Transaction Label
                    <input value={selected.priceLabel} onChange={event => updateSelected({ priceLabel: event.target.value })} maxLength={80} placeholder="Starting from ₹1.25 Cr" className="w-full rounded-sm border border-white/15 bg-[#1c1c1c] p-3 text-xs normal-case tracking-normal text-white" />
                  </label>
                  <label className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Button Text
                    <input value={selected.ctaLabel} onChange={event => updateSelected({ ctaLabel: event.target.value })} maxLength={40} placeholder="Explore Project" className="w-full rounded-sm border border-white/15 bg-[#1c1c1c] p-3 text-xs normal-case tracking-normal text-white" />
                  </label>
                  <label className="flex items-center gap-2 self-end pb-3 text-xs text-white/70"><input type="checkbox" checked={selected.enabled} onChange={event => updateSelected({ enabled: event.target.checked })} className="accent-[#d8b56d]" /> Show this slide on homepage</label>
                </div>

                <div className="space-y-3 rounded-sm border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-widest text-[#d8b56d]">Slide Image</p><p className="mt-1 text-[10px] text-white/45">Wide landscape images work best. Upload JPG, PNG or WebP up to 15 MB.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#d8b56d] px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-black"><Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Image'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => { void uploadImage(event.target.files?.[0]); event.currentTarget.value = ''; }} className="hidden" /></label></div>
                  {uploading && <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#d8b56d] transition-all" style={{ width: `${uploadProgress}%` }} /></div>}
                  {selected.imageUrl ? <div className="relative overflow-hidden rounded-sm border border-white/10"><img src={selected.imageUrl} alt="Slide preview" className="max-h-[300px] w-full object-cover" /><button type="button" onClick={() => updateSelected({ imageUrl: '' })} className="absolute right-2 top-2 rounded-sm bg-black/80 px-3 py-2 text-[9px] font-black uppercase text-white"><Trash2 size={12} className="inline mr-1" /> Remove image</button></div> : <div className="flex min-h-36 items-center justify-center rounded-sm border border-dashed border-white/20 text-xs text-white/35"><ImagePlus size={18} className="mr-2" /> No image uploaded yet</div>}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="text-[9px] text-white/35">Changes are drafts until you select Save Changes.</span>
                  <button type="button" onClick={() => void save()} disabled={saving || uploading || slides.length === 0} className="inline-flex items-center gap-2 rounded-sm bg-[#d8b56d] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-40">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
