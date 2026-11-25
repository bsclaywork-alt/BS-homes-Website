import React, { useMemo, useState } from 'react';
import type { Project } from '../types';
import { OFFER_AMENITIES } from '../types';
import { MediaUploadCompressor } from './MediaUploadCompressor';

type InventoryMode = 'Primary' | 'Resale';
type FormValues = Partial<Project> & {
  saleType: string;
  societyType: 'Gated' | 'Individual';
  propertyStatus: 'Ready to Move' | 'EOI' | 'Under Construction' | 'Nearing Completion';
  possessionDate: string;
  doorFacing: string;
  floorNumber: string;
  totalUnits: string;
  totalAcres: string;
  furnishing: 'Unfurnished' | 'Semi Furnished' | 'Furnished';
  others: string;
};

const INITIAL: FormValues = {
  name: '', location: '', price: '', mapUrl: '',
  propertyType: 'Apartment', societyType: 'Gated', propertyStatus: 'Ready to Move',
  reraNumber: '', possessionDate: '', configuration: ['2 BHK'], doorFacing: 'East',
  vaastuCompliant: 'Yes', floorNumber: '', totalUnits: '',
  noOfTowers: '', totalAcres: '', features: [], furnishing: 'Unfurnished',
  others: '', imageUrls: [], showImagesOnline: false, saleType: 'Owner',
  type: 'Primary', description: '', locationTarget: '', zone: 'Whitefield',
  segment: 'Primary Sale', handoverStatus: 'Ready to Move', builderName: '',
  builderCategory: 'A', approvalBody: '', floorPlan: '', projectSize: '',
  projectWriteUps: '', mobileImageUrl: '', videoUrl: '', mobileVideoUrl: ''
};

const CONFIGURATIONS = ['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK'];
const FACINGS = ['East', 'West', 'North', 'South', 'North East', 'North West', 'South East', 'South West'];
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Commercial'] as const;
const PROPERTY_STATUSES = ['Ready to Move', 'EOI', 'Under Construction', 'Nearing Completion'] as const;

export interface AdminPrimaryResaleFormProps {
  mode: InventoryMode;
  project?: Project | null;
  onSave: (project: Project) => Promise<void>;
  onClose: () => void;
}

export const AdminPrimaryResaleForm: React.FC<AdminPrimaryResaleFormProps> = ({ mode, project, onSave, onClose }) => {
  const [form, setForm] = useState<FormValues>(() => ({
    ...INITIAL,
    ...(project as FormValues | null || {}),
    type: mode,
    saleType: (project as any)?.saleType || (mode === 'Primary' ? 'Builder' : 'Owner'),
    societyType: (project as any)?.societyType || 'Gated',
    propertyStatus: (project as any)?.propertyStatus || project?.handoverStatus || 'Ready to Move',
    possessionDate: (project as any)?.possessionDate || project?.handoverDate || '',
    doorFacing: (project as any)?.doorFacing || project?.mainDoorFacing || 'East',
    floorNumber: (project as any)?.floorNumber || project?.floor || '',
    totalUnits: (project as any)?.totalUnits || '',
    totalAcres: (project as any)?.totalAcres || project?.projectSize || '',
    furnishing: (project as any)?.furnishing || project?.furnishType || 'Unfurnished',
    others: (project as any)?.others || project?.comments || '',
    features: project?.features || [],
    imageUrls: project?.imageUrls || [],
    showImagesOnline: project?.showImagesOnline ?? false
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [resetConfirm, setResetConfirm] = useState(false);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleAmenity = (amenity: string) => {
    update('features', (form.features || []).includes(amenity)
      ? (form.features || []).filter(item => item !== amenity)
      : [...(form.features || []), amenity]);
  };

  const reset = () => {
    setForm({ ...INITIAL, type: mode, saleType: mode === 'Primary' ? 'Builder' : 'Owner' });
    setError('');
    setResetConfirm(false);
  };

  const isValid = useMemo(() => Boolean(form.name?.trim() && form.location?.trim() && form.price?.trim()), [form.name, form.location, form.price]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid || saving) return;
    setSaving(true);
    setError('');
    try {
      // The form has presentation-only fields. Never spread those directly into Firestore:
      // Firestore rules intentionally reject private address/door data and duplicate UI keys.
      const persistableForm = { ...form } as Record<string, any>;
      const projectFields: Record<string, any> = { ...(project || {}), ...persistableForm };
      [
        'fullAddress', 'doorNumber', 'ownerName', 'ownerMobile', 'ownerPhone',
        'ownerEmail', 'ownerContact', 'privateNotes', 'mobile', 'phone', 'email',
        'saleType', 'propertyStatus', 'doorFacing', 'floorNumber', 'furnishing', 'others'
      ].forEach(field => delete projectFields[field]);

      const saved = {
        ...projectFields,
        id: project?.id,
        sourceCollection: project?.sourceCollection,
        name: form.name!.trim(),
        location: form.location!.trim(),
        locationTarget: form.locationTarget || form.location!.trim(),
        price: form.price!.trim(),
        type: mode,
        saleFrom: form.saleType || project?.saleFrom || (mode === 'Primary' ? 'Builder' : 'Investor'),
        societyType: form.societyType,
        possessionDate: form.possessionDate || '',
        handoverStatus: form.propertyStatus,
        handoverDate: form.possessionDate || '',
        mainDoorFacing: form.doorFacing,
        floor: form.floorNumber,
        projectSize: form.totalAcres,
        totalAcres: form.totalAcres,
        furnishType: form.furnishing,
        comments: (form.others || '').slice(0, 2000),
        description: (form.others || form.description || '').slice(0, 5000),
        projectWriteUps: (form.others || form.projectWriteUps || '').slice(0, 5000),
        features: form.features || [],
        configuration: form.configuration?.length ? form.configuration : ['2 BHK'],
        imageUrls: (form.imageUrls || []).slice(0, 5),
        mobileImageUrl: form.imageUrls?.[0] || '',
        mobileVideoUrl: form.videoUrl || form.mobileVideoUrl || '',
        isPaused: Boolean(project?.isPaused),
        isDeleted: Boolean(project?.isDeleted)
      } as Project;
      await onSave(saved);
      onClose();
    } catch (err: any) {
      const detail = [err?.code, err?.message].filter(Boolean).join(': ');
      setError(detail || 'Unable to save this property. Your entered details are still here; please retry.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-sm border border-lux-border bg-lux-ivory/60 p-3 text-sm text-lux-charcoal outline-none focus:border-lux-forest';
  const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-wider text-lux-charcoal';
  const sectionClass = 'space-y-4 border-b border-lux-border pb-6 last:border-0';
  const titleClass = 'text-sm font-black uppercase tracking-widest text-lux-forest';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-3 py-4">
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-sm border border-lux-border bg-lux-ivory p-4 text-lux-charcoal shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-lux-border pb-4">
          <div>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-lux-gold">BS Homez • Admin Vault • Private Property Intake</span>
            <h2 className="font-serif text-2xl italic text-lux-forest sm:text-3xl">{project ? 'Edit' : 'Add'} {mode} Property</h2>
            <p className="mt-1 text-xs text-lux-muted">Same guided sections and clean form layout as Offer Your Asset. Owner details remain private.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-sm border border-lux-border px-3 py-2 text-xs font-bold">Close</button>
        </div>

        <form onSubmit={submit} className="space-y-7 rounded-sm border border-lux-border bg-lux-card p-4 shadow-lg sm:p-8">
          {error && <div role="alert" className="rounded-sm border border-red-300 bg-red-50 p-3 text-xs text-red-800">{error}</div>}

          <section className={sectionClass}>
            <h3 className={titleClass}>Section A — Property Identity & Location</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><label className={labelClass}>Type of Sale *</label><select className={inputClass} value={form.saleType} onChange={e => update('saleType', e.target.value)}><option>Builder</option><option>Owner</option><option>Investor</option><option>Channel Partner</option></select></div>
              <div><label className={labelClass}>Project / Property Name *</label><input required className={inputClass} value={form.name || ''} onChange={e => update('name', e.target.value)} placeholder="Enter property or project name" /></div>
              <div><label className={labelClass}>Project Location *</label><input required className={inputClass} value={form.location || ''} onChange={e => update('location', e.target.value)} placeholder="Area, locality, city" /></div>
              <div><label className={labelClass}>Price (INR) *</label><input required className={inputClass} value={form.price || ''} onChange={e => update('price', e.target.value)} placeholder="e.g. ₹1.25 Cr" /></div>
              <div className="md:col-span-2"><label className={labelClass}>Google Map Location URL</label><input type="url" className={inputClass} value={form.mapUrl || ''} onChange={e => update('mapUrl', e.target.value)} placeholder="https://maps.google.com/..." /></div>
            </div>
          </section>

          <section className={sectionClass}>
            <h3 className={titleClass}>Section B — Property Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div><label className={labelClass}>Property Type *</label><select className={inputClass} value={form.propertyType || 'Apartment'} onChange={e => update('propertyType', e.target.value as Project['propertyType'])}>{PROPERTY_TYPES.map(v => <option key={v}>{v}</option>)}</select></div>
              <div><label className={labelClass}>Society Type *</label><select className={inputClass} value={form.societyType} onChange={e => update('societyType', e.target.value as FormValues['societyType'])}><option>Gated</option><option>Individual</option></select></div>
              <div><label className={labelClass}>Property Status *</label><select className={inputClass} value={form.propertyStatus} onChange={e => { update('propertyStatus', e.target.value as FormValues['propertyStatus']); update('handoverStatus', e.target.value as Project['handoverStatus']); }} >{PROPERTY_STATUSES.map(v => <option key={v}>{v}</option>)}</select></div>
              <div><label className={labelClass}>RERA Number</label><input className={inputClass} value={form.reraNumber || ''} onChange={e => update('reraNumber', e.target.value)} /></div>
              <div><label className={labelClass}>Possession Date</label><input type="date" className={inputClass} value={form.possessionDate} onChange={e => { update('possessionDate', e.target.value); update('handoverDate', e.target.value); }} /></div>
              <div><label className={labelClass}>Configuration *</label><div className="flex flex-wrap gap-2">{CONFIGURATIONS.map(v => { const selected = (form.configuration || []).includes(v); return <button type="button" key={v} onClick={() => update('configuration', selected ? (form.configuration || []).filter(x => x !== v) : [...(form.configuration || []), v])} className={selected ? 'rounded-sm border border-lux-forest bg-lux-forest px-3 py-2 text-xs font-bold text-white' : 'rounded-sm border border-lux-border bg-lux-ivory px-3 py-2 text-xs'}>{v}</button>; })}</div></div>
              <div><label className={labelClass}>Door Facing</label><select className={inputClass} value={form.doorFacing} onChange={e => update('doorFacing', e.target.value)}>{FACINGS.map(v => <option key={v}>{v}</option>)}</select></div>
              <div><label className={labelClass}>Vaastu Compliant</label><select className={inputClass} value={String(form.vaastuCompliant || 'Yes')} onChange={e => update('vaastuCompliant', e.target.value)}><option>Yes</option><option>No</option></select></div>
              <div><label className={labelClass}>Floor Number</label><input className={inputClass} value={form.floorNumber} onChange={e => update('floorNumber', e.target.value)} /></div>
              <div><label className={labelClass}>Total Units</label><input className={inputClass} value={form.totalUnits} onChange={e => update('totalUnits', e.target.value)} /></div>
              <div><label className={labelClass}>Total Towers</label><input className={inputClass} value={form.noOfTowers || ''} onChange={e => update('noOfTowers', e.target.value)} /></div>
              <div><label className={labelClass}>Project Size (Acres)</label><input className={inputClass} value={form.totalAcres} onChange={e => { update('totalAcres', e.target.value); update('projectSize', e.target.value); }} /></div>
              <div><label className={labelClass}>Furnishing</label><select className={inputClass} value={form.furnishing} onChange={e => update('furnishing', e.target.value as FormValues['furnishing'])}><option>Unfurnished</option><option>Semi Furnished</option><option>Furnished</option></select></div>
            </div>
          </section>

          <section className={sectionClass}>
            <h3 className={titleClass}>Section C — Amenities</h3>
            <p className="text-xs text-lux-muted">Select all amenities available at the property.</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{OFFER_AMENITIES.map(item => <label key={item} className="flex items-center gap-2 rounded-sm border border-lux-border bg-lux-ivory/50 p-2 text-xs"><input type="checkbox" checked={(form.features || []).includes(item)} onChange={() => toggleAmenity(item)} className="accent-lux-forest" />{item}</label>)}</div>
          </section>

          <section className={sectionClass}>
            <h3 className={titleClass}>Section D — Additional Information</h3>
            <label className={labelClass}>Others (Maximum 10,000 characters)</label>
            <textarea maxLength={10000} rows={5} className={inputClass} value={form.others} onChange={e => update('others', e.target.value)} placeholder="Additional property details, restrictions, inclusions, disclosures..." />
            <p className="text-right text-[10px] text-lux-muted">{form.others.length.toLocaleString()} / 10,000</p>
          </section>

          <section className={sectionClass}>
            <h3 className={titleClass}>Section E — Photos & Online Visibility</h3>
            <label className="mb-4 flex items-start gap-2 rounded-sm border border-lux-border bg-lux-ivory/60 p-3 text-xs"><input type="checkbox" checked={Boolean(form.showImagesOnline)} onChange={e => update('showImagesOnline', e.target.checked)} className="mt-0.5 accent-lux-forest" /><span><strong>Show property photos online</strong><span className="mt-1 block text-lux-muted">Default is No. Photos remain saved in Admin Vault when this is unchecked.</span></span></label>
            <MediaUploadCompressor variant="ivory" accentColor="forest" title="Property Photos & Video (BS Homez watermark applied automatically)" images={form.imageUrls || []} onImagesChange={imgs => update('imageUrls', imgs.slice(0, 5))} videoUrl={form.videoUrl || ''} onVideoChange={(url, poster) => { update('videoUrl', url); update('mobileVideoUrl', url); if (poster) update('mobileImageUrl', poster); }} />
            <p className="mt-2 text-[10px] text-lux-muted">Maximum 5 photos. The BS Homez watermark is applied automatically and cannot be disabled.</p>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-lux-border pt-5 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => setResetConfirm(true)} className="rounded-sm border border-lux-border px-5 py-3 text-xs font-black uppercase tracking-wider">Reset Form</button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onClose} className="rounded-sm border border-lux-border px-5 py-3 text-xs font-bold">Cancel</button>
              <button type="submit" disabled={!isValid || saving} className="rounded-sm bg-lux-forest px-7 py-3 text-xs font-black uppercase tracking-wider text-white disabled:opacity-40">{saving ? 'Saving...' : project ? 'Save Changes' : 'Save Property'}</button>
            </div>
          </div>
        </form>
      </div>
      {resetConfirm && <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4"><div className="w-full max-w-sm rounded-sm bg-lux-card p-6 shadow-2xl"><h3 className="font-serif text-xl text-lux-forest">Reset this form?</h3><p className="my-3 text-xs text-lux-muted">Only the unsaved fields in this form will be cleared. Existing saved properties will not be deleted or changed.</p><div className="flex justify-end gap-2"><button type="button" onClick={() => setResetConfirm(false)} className="border border-lux-border px-4 py-2 text-xs">Keep Editing</button><button type="button" onClick={reset} className="bg-lux-forest px-4 py-2 text-xs font-bold text-white">Reset Form</button></div></div></div>}
    </div>
  );
};
