import React, { useState, useMemo } from 'react';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  User
} from 'lucide-react';
import { db } from '../lib/firebase';
import {
  OFFER_AMENITIES,
  OfferConfiguration,
  OfferDoorFacing,
  OfferFurnishing,
  OfferPropertyStatus,
  OfferPropertyType,
  OfferSellerType,
  OfferSocietyType,
  OfferWillingTo,
  UploadedMediaItem
} from '../types';
import {
  buildSanitizedPublicPortfolioRecord,
  buildSubmissionDedupKey,
  createPropertySubmissionRecord,
  INITIAL_OFFER_ASSET_FORM,
  OfferAssetFormInput,
  resolveTargetPortfolioCategory,
  validateOfferAssetInput
} from '../lib/propertyWorkflow';
import { deleteUploadedMediaPath } from '../lib/mediaProcessor';
import { PhoneInputWithCountry } from './PhoneInputWithCountry';
import { MediaUploadCompressor } from './MediaUploadCompressor';

export interface OfferYourAssetFormProps {
  onSubmissionComplete?: (result: { submissionId: string; publicPortfolioId: string; category: string }) => void;
}

const PROPERTY_TYPES: OfferPropertyType[] = ['Apartment', 'Villa', 'Plot', 'Commercial'];
const SOCIETY_TYPES: OfferSocietyType[] = ['Gated', 'Individual'];
const PROPERTY_STATUSES: OfferPropertyStatus[] = ['Ready to Move', 'Under Construction', 'EOI', 'Nearing Completion'];
const CONFIGURATIONS: OfferConfiguration[] = ['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'];
const DOOR_FACINGS: OfferDoorFacing[] = ['East', 'North', 'West', 'South', 'South East', 'North East'];
const FURNISHINGS: OfferFurnishing[] = ['Semi Furnished', 'Furnished', 'Unfurnished'];
const SELLER_TYPES: OfferSellerType[] = ['Resale', 'Builder', 'Landlord'];

export const OfferYourAssetForm: React.FC<OfferYourAssetFormProps> = ({ onSubmissionComplete }) => {
  const [form, setForm] = useState<OfferAssetFormInput>(INITIAL_OFFER_ASSET_FORM);
  const [uploadSessionId, setUploadSessionId] = useState<string>(
    () => `offer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaBusy, setIsMediaBusy] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [submittedKeys, setSubmittedKeys] = useState<Set<string>>(() => new Set());

  const isDirty = useMemo(() => {
    return (
      Boolean(form.ownerName.trim()) ||
      Boolean(form.ownerMobile.trim()) ||
      Boolean(form.propertyName.trim()) ||
      Boolean(form.location.trim()) ||
      Boolean(form.fullAddress.trim()) ||
      Boolean(form.googleMapUrl.trim()) ||
      Boolean(form.expectedPrice.trim()) ||
      Boolean(form.rentPerMonth.trim()) ||
      Boolean(form.others.trim()) ||
      form.amenities.length > 0 ||
      form.photos.length > 0 ||
      Boolean(form.video)
    );
  }, [form]);

  const targetCategory = useMemo(
    () => resolveTargetPortfolioCategory(form.willingTo, form.sellerType),
    [form.willingTo, form.sellerType]
  );

  const updateField = <K extends keyof OfferAssetFormInput>(key: K, value: OfferAssetFormInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  const resetFormImmediately = () => {
    setForm(INITIAL_OFFER_ASSET_FORM);
    setFieldErrors({});
    setStatusError(null);
    setShowResetConfirm(false);
    setUploadSessionId(`offer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  };

  const handleResetClick = () => {
    if (!isDirty) {
      resetFormImmediately();
      return;
    }
    setShowResetConfirm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError(null);
    setStatusSuccess(null);

    if (isMediaBusy) {
      setStatusError('Please wait for photo or video compression/upload to finish before saving.');
      return;
    }

    const validation = validateOfferAssetInput(form);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setStatusError(validation.firstError || 'Please complete all required fields.');
      return;
    }

    const dedupKey = buildSubmissionDedupKey(form);
    if (submittedKeys.has(dedupKey)) {
      setStatusError('This property submission has already been saved in this session. Reset the form to submit another listing.');
      return;
    }

    setIsSubmitting(true);

    const timestamp = Date.now();
    const submissionId = `sub_${timestamp}_${Math.random().toString(36).slice(2, 6)}`;
    const publicPortfolioId = `pub_${timestamp}_${Math.random().toString(36).slice(2, 6)}`;

    const submissionRecord = createPropertySubmissionRecord(
      form,
      { submissionId, publicPortfolioId },
      { status: 'Pending Review', createdAt: serverTimestamp() }
    );
    const publicPortfolioRecord = buildSanitizedPublicPortfolioRecord(submissionRecord, {
      publicationStatus: 'Pending Review'
    });
    publicPortfolioRecord.createdAt = serverTimestamp();
    publicPortfolioRecord.updatedAt = serverTimestamp();

    const stripUndefined = (obj: Record<string, any>): Record<string, any> => {
      const cleaned: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined) cleaned[k] = v;
      }
      return cleaned;
    };

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'property_submissions', submissionId), stripUndefined(submissionRecord));
      batch.set(doc(db, 'public_portfolio', publicPortfolioId), stripUndefined(publicPortfolioRecord));
      await batch.commit();

      setSubmittedKeys((prev) => new Set(prev).add(dedupKey));
      setStatusSuccess(
        `Thank you! Your property "${form.propertyName}" has been submitted for BS Homez Admin verification under the ${targetCategory} portfolio. Owner contact details remain strictly private.`
      );
      onSubmissionComplete?.({
        submissionId,
        publicPortfolioId,
        category: targetCategory
      });

      // Firestore onCreate Cloud Function sends the private Admin email alert.

      resetFormImmediately();
    } catch (err: any) {
      // Preserve uploaded media references in form state on Firestore commit failure so the user
      // can retry submission immediately without re-uploading or triggering unauthorized public Storage deletes.
      setStatusError(
        err?.message
          ? `Submission failed: ${err.message}. Your uploaded media is preserved in this form so you can retry without re-uploading.`
          : 'Unable to save property submission right now. Your uploaded media is preserved so you can retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="opportunity" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-10 bg-lux-ivory text-lux-charcoal border-t border-lux-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-lux-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-3">
            Direct Property Intake • Private &amp; Verified
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-lux-forest italic mb-3">
            Offer Your <span className="not-italic text-lux-gold">Asset</span>
          </h2>
          <p className="text-sm text-lux-muted max-w-2xl mx-auto leading-relaxed">
            List your apartment, villa, plot, or commercial property for sale or rental. Your owner contact details stay strictly private in Admin Vault while verified property details are curated for buyers and tenants.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-lux-card border border-lux-border rounded-sm p-6 sm:p-10 shadow-lg space-y-8">
          {/* Status Banners */}
          {statusError && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-sm text-red-800 text-xs flex items-start gap-2.5" role="alert">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{statusError}</span>
            </div>
          )}

          {statusSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-sm text-emerald-900 text-xs flex items-start gap-2.5" role="status">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{statusSuccess}</span>
            </div>
          )}

          {/* SECTION A: OWNER & LOCATION */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-lux-border pb-2.5">
              <h3 className="text-sm uppercase tracking-widest font-black text-lux-forest flex items-center gap-2">
                <User size={15} className="text-lux-gold" /> Section A — Owner &amp; Property Identity
              </h3>
              <span className="text-[10px] font-mono text-lux-muted flex items-center gap-1">
                <ShieldCheck size={12} className="text-lux-forest" /> Owner PII never shown publicly
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="offer-owner-name" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Owner Name *
                </label>
                <input
                  id="offer-owner-name"
                  type="text"
                  required
                  value={form.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  placeholder="Enter property owner full name"
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
                {fieldErrors.ownerName && <p className="text-xs text-red-600 mt-1">{fieldErrors.ownerName}</p>}
              </div>

              <div>
                <PhoneInputWithCountry
                  label="Owner Mobile Number"
                  value={form.ownerMobile}
                  countryCode={form.countryCode}
                  onChange={(fullVal, code) => {
                    setForm((prev) => ({ ...prev, ownerMobile: fullVal, countryCode: code }));
                    setFieldErrors((prev) => {
                      if (!prev.ownerMobile) return prev;
                      const next = { ...prev };
                      delete next.ownerMobile;
                      return next;
                    });
                  }}
                />
                {fieldErrors.ownerMobile && <p className="text-xs text-red-600 mt-1">{fieldErrors.ownerMobile}</p>}
              </div>

              <div>
                <label htmlFor="offer-property-name" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Property / Project Name *
                </label>
                <input
                  id="offer-property-name"
                  type="text"
                  required
                  value={form.propertyName}
                  onChange={(e) => updateField('propertyName', e.target.value)}
                  placeholder="e.g. Prestige Lakeside Habitat"
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
                {fieldErrors.propertyName && <p className="text-xs text-red-600 mt-1">{fieldErrors.propertyName}</p>}
              </div>

              <div>
                <label htmlFor="offer-location" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Location *
                </label>
                <input
                  id="offer-location"
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g. Varthur Main Road, East Bangalore"
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
                {fieldErrors.location && <p className="text-xs text-red-600 mt-1">{fieldErrors.location}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="offer-full-address" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Full Address (Private — Visible to Admin Only)
                </label>
                <input
                  id="offer-full-address"
                  type="text"
                  value={form.fullAddress}
                  onChange={(e) => updateField('fullAddress', e.target.value)}
                  placeholder="Unit number, wing, street address & landmark"
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="offer-map-url" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} className="text-lux-forest" /> Google Map Location (URL)
                </label>
                <input
                  id="offer-map-url"
                  type="url"
                  value={form.googleMapUrl}
                  onChange={(e) => updateField('googleMapUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest font-mono"
                />
                {fieldErrors.googleMapUrl && <p className="text-xs text-red-600 mt-1">{fieldErrors.googleMapUrl}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="offer-rera-number" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  RERA Number <span className="text-lux-muted normal-case tracking-normal font-semibold">(Prominently displayed in Admin email)</span>
                </label>
                <input
                  id="offer-rera-number"
                  type="text"
                  value={form.reraNumber}
                  onChange={(e) => updateField('reraNumber', e.target.value)}
                  placeholder="Enter Karnataka RERA registration number, if applicable"
                  className="w-full bg-lux-ivory/60 border-2 border-lux-gold p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: WILLING TO (SELL vs RENTAL CONDITIONAL FLOW) */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lux-border pb-2.5">
              <h3 className="text-sm uppercase tracking-widest font-black text-lux-forest">
                Section B — Willing To
              </h3>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-lux-ivory border border-lux-border text-lux-forest font-bold">
                Target Portfolio: {targetCategory}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {(['Sell', 'Rental'] as OfferWillingTo[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateField('willingTo', mode)}
                  data-testid={`willing-to-${mode.toLowerCase()}`}
                  className={
                    form.willingTo === mode
                      ? 'px-6 py-3 bg-lux-forest text-lux-card border border-lux-forest rounded-sm text-xs font-black uppercase tracking-widest cursor-pointer shadow-sm'
                      : 'px-6 py-3 bg-lux-ivory text-lux-charcoal border border-lux-border rounded-sm text-xs font-bold uppercase tracking-widest cursor-pointer hover:border-lux-forest'
                  }
                >
                  {mode === 'Sell' ? 'Sell Property' : 'Rental'}
                </button>
              ))}
            </div>

            {form.willingTo === 'Sell' ? (
              <div className="p-4 bg-lux-ivory/70 border border-lux-border rounded-sm space-y-4" data-testid="sell-conditional-fields">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-2">
                    Listing Source (Select One) *
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SELLER_TYPES.map((st) => (
                      <label
                        key={st}
                        className={
                          form.sellerType === st
                            ? 'flex items-center gap-2.5 p-3 bg-lux-forest text-lux-card border border-lux-forest rounded-sm cursor-pointer font-bold text-xs'
                            : 'flex items-center gap-2.5 p-3 bg-lux-card text-lux-charcoal border border-lux-border rounded-sm cursor-pointer text-xs hover:border-lux-forest'
                        }
                      >
                        <input
                          type="radio"
                          name="sellerType"
                          value={st}
                          checked={form.sellerType === st}
                          onChange={() => updateField('sellerType', st)}
                          className="accent-lux-gold"
                        />
                        <span>{st}</span>
                        <span className="ml-auto text-[10px] opacity-75 font-mono">
                          &rarr; {st === 'Builder' ? 'Primary' : 'Resale'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-lux-ivory/70 border border-lux-border rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="rental-conditional-fields">
                <div>
                  <label htmlFor="offer-rent-month" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                    Rent per Month (INR) *
                  </label>
                  <input
                    id="offer-rent-month"
                    type="number"
                    min={0}
                    value={form.rentPerMonth}
                    onChange={(e) => updateField('rentPerMonth', e.target.value)}
                    placeholder="e.g. 55000"
                    className="w-full bg-lux-card border border-lux-border p-2.5 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                  />
                  {fieldErrors.rentPerMonth && <p className="text-xs text-red-600 mt-1">{fieldErrors.rentPerMonth}</p>}
                </div>

                <div>
                  <label htmlFor="offer-maintenance" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                    Maintenance
                  </label>
                  <input
                    id="offer-maintenance"
                    type="text"
                    value={form.maintenance}
                    onChange={(e) => updateField('maintenance', e.target.value)}
                    placeholder="e.g. Rs. 4,500 / mo"
                    className="w-full bg-lux-card border border-lux-border p-2.5 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                  />
                </div>

                <div>
                  <label htmlFor="offer-advance" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                    Advance / Deposit
                  </label>
                  <input
                    id="offer-advance"
                    type="text"
                    value={form.advance}
                    onChange={(e) => updateField('advance', e.target.value)}
                    placeholder="e.g. Rs. 2,50,000"
                    className="w-full bg-lux-card border border-lux-border p-2.5 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                  />
                </div>

                <div>
                  <label htmlFor="offer-available-from" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5 flex items-center gap-1">
                    <Calendar size={11} /> Available From
                  </label>
                  <input
                    id="offer-available-from"
                    type="date"
                    value={form.availableFrom}
                    onChange={(e) => updateField('availableFrom', e.target.value)}
                    className="w-full bg-lux-card border border-lux-border p-2.5 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION C: PROPERTY SPECIFICATIONS */}
          <div className="space-y-5">
            <h3 className="text-sm uppercase tracking-widest font-black text-lux-forest border-b border-lux-border pb-2.5 flex items-center gap-2">
              <Building2 size={15} className="text-lux-gold" /> Section C — Property Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label htmlFor="offer-property-type" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Property Type
                </label>
                <select
                  id="offer-property-type"
                  value={form.propertyType}
                  onChange={(e) => updateField('propertyType', e.target.value as OfferPropertyType)}
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="offer-society-type" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Society Type
                </label>
                <select
                  id="offer-society-type"
                  value={form.societyType}
                  onChange={(e) => updateField('societyType', e.target.value as OfferSocietyType)}
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                >
                  {SOCIETY_TYPES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {form.willingTo === 'Sell' && (
                <div>
                  <label htmlFor="offer-expected-price" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                    Expected Price (INR) *
                  </label>
                  <input
                    id="offer-expected-price"
                    type="number"
                    min={0}
                    value={form.expectedPrice}
                    onChange={(e) => updateField('expectedPrice', e.target.value)}
                    placeholder="e.g. 16500000"
                    className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                  />
                  {fieldErrors.expectedPrice && <p className="text-xs text-red-600 mt-1">{fieldErrors.expectedPrice}</p>}
                </div>
              )}

              <div>
                <label htmlFor="offer-property-status" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Property Status
                </label>
                <select
                  id="offer-property-status"
                  value={form.propertyStatus}
                  onChange={(e) => updateField('propertyStatus', e.target.value as OfferPropertyStatus)}
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                >
                  {PROPERTY_STATUSES.map((ps) => (
                    <option key={ps} value={ps}>{ps}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="offer-possession-date" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5 flex items-center gap-1">
                  <Calendar size={11} /> Possession Date
                </label>
                <input
                  id="offer-possession-date"
                  type="date"
                  value={form.possessionDate}
                  onChange={(e) => updateField('possessionDate', e.target.value)}
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
              </div>

              <div>
                <label htmlFor="offer-configuration" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Configuration
                </label>
                <select
                  id="offer-configuration"
                  value={form.configuration}
                  onChange={(e) => updateField('configuration', e.target.value as OfferConfiguration)}
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                >
                  {CONFIGURATIONS.map((cfg) => (
                    <option key={cfg} value={cfg}>{cfg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="offer-door-facing" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Door Facing
                </label>
                <select
                  id="offer-door-facing"
                  value={form.doorFacing}
                  onChange={(e) => updateField('doorFacing', e.target.value as OfferDoorFacing)}
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                >
                  {DOOR_FACINGS.map((df) => (
                    <option key={df} value={df}>{df}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="offer-floor-number" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Floor Number
                </label>
                <input
                  id="offer-floor-number"
                  type="text"
                  value={form.floorNumber}
                  onChange={(e) => updateField('floorNumber', e.target.value)}
                  placeholder="e.g. 9th Floor"
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
              </div>

              <div>
                <label htmlFor="offer-tower-number" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Tower Number
                </label>
                <input
                  id="offer-tower-number"
                  type="text"
                  value={form.towerNumber}
                  onChange={(e) => updateField('towerNumber', e.target.value)}
                  placeholder="e.g. Tower B"
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
              </div>

              <div>
                <label htmlFor="offer-total-acres" className="text-[10px] uppercase tracking-wider font-black text-lux-charcoal block mb-1.5">
                  Total Acres
                </label>
                <input
                  id="offer-total-acres"
                  type="text"
                  value={form.totalAcres}
                  onChange={(e) => updateField('totalAcres', e.target.value)}
                  placeholder="e.g. 14.5 Acres"
                  className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
                />
              </div>
            </div>
          </div>

          {/* SECTION D: AMENITIES (ALL 23 MULTI-SELECT CHECKBOXES) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-lux-border pb-2.5">
              <h3 className="text-sm uppercase tracking-widest font-black text-lux-forest">
                Section D — Amenities ({form.amenities.length} / {OFFER_AMENITIES.length} selected)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {OFFER_AMENITIES.map((amenity) => {
                const checked = form.amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={
                      checked
                        ? 'flex items-center gap-2.5 p-2.5 bg-lux-forest text-lux-card border border-lux-forest rounded-sm cursor-pointer text-xs font-bold transition-colors'
                        : 'flex items-center gap-2.5 p-2.5 bg-lux-ivory/60 text-lux-charcoal border border-lux-border rounded-sm cursor-pointer text-xs hover:border-lux-forest transition-colors'
                    }
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="accent-lux-gold w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SECTION E: FURNISHING */}
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-widest font-black text-lux-forest border-b border-lux-border pb-2">
              Section E — Furnishing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FURNISHINGS.map((item) => (
                <label
                  key={item}
                  className={
                    form.furnishing === item
                      ? 'flex items-center gap-2.5 p-3 bg-lux-forest text-lux-card border border-lux-forest rounded-sm cursor-pointer text-xs font-bold'
                      : 'flex items-center gap-2.5 p-3 bg-lux-ivory/60 text-lux-charcoal border border-lux-border rounded-sm cursor-pointer text-xs hover:border-lux-forest'
                  }
                >
                  <input
                    type="radio"
                    name="furnishing"
                    value={item}
                    checked={form.furnishing === item}
                    onChange={() => updateField('furnishing', item)}
                    className="accent-lux-gold"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SECTION F: OTHERS (10,000 CHAR LIMIT) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="offer-others" className="text-sm uppercase tracking-widest font-black text-lux-forest">
                Section F — Others
              </label>
              <span className="text-xs font-mono text-lux-muted" data-testid="others-char-counter">
                {form.others.length.toLocaleString()} / 10,000
              </span>
            </div>
            <textarea
              id="offer-others"
              maxLength={10000}
              rows={3}
              value={form.others}
              onChange={(e) => updateField('others', e.target.value.slice(0, 10000))}
              placeholder="Any additional highlights, corner unit advantage, tenant preferences, or key notes (max 10,000 characters)..."
              className="w-full bg-lux-ivory/60 border border-lux-border p-3 text-sm text-lux-charcoal rounded-sm outline-none focus:border-lux-forest"
            />
            {fieldErrors.others && <p className="text-xs text-red-600">{fieldErrors.others}</p>}
          </div>

          {/* PROPERTY MEDIA UPLOAD (PHOTOS & WALKTHROUGH VIDEO) */}
          <MediaUploadCompressor
            variant="ivory"
            title="Property Photos & Walkthrough Video"
            uploadSessionId={uploadSessionId}
            images={form.photos.map((p) => p.url)}
            onImagesChange={() => {}}
            photoItems={form.photos}
            onPhotoItemsChange={(items: UploadedMediaItem[]) => updateField('photos', items)}
            videoUrl={form.video?.url || ''}
            onVideoChange={() => {}}
            videoItem={form.video}
            onVideoItemChange={(item) => updateField('video', item)}
            onBusyChange={setIsMediaBusy}
          />
          {fieldErrors.video && <p className="text-xs text-red-600">{fieldErrors.video}</p>}

          {/* SECTION G: ACTIONS */}
          <div className="pt-4 border-t border-lux-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleResetClick}
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-lux-ivory hover:bg-lux-border text-lux-charcoal border border-lux-border rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw size={14} /> Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isMediaBusy}
              className="px-10 py-3.5 bg-lux-forest hover:bg-lux-forest-hover text-lux-card rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving Listing...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Dirty Form Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-lux-card border border-lux-border rounded-sm p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-lg font-serif font-bold text-lux-forest">Confirm Reset Form?</h4>
            <p className="text-xs text-lux-muted leading-relaxed">
              You have entered property details in this form. Resetting will clear all unsaved inputs.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-lux-ivory border border-lux-border text-lux-charcoal text-xs font-bold uppercase rounded-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={resetFormImmediately}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase rounded-sm cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
