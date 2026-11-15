import React, { useState } from 'react';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  Gift, 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  Layers, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Copy
} from 'lucide-react';
import { motion } from 'motion/react';
import { PhoneInputWithCountry, validateMobileNumber } from './PhoneInputWithCountry';

export const ReferralSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    budgetMin: '',
    budgetMax: '',
    location: '',
    propertyType: 'Flat' as 'Villa' | 'Flat' | 'Plot' | 'Stand Alone Building',
    unitType: '3BHK' as '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK',
    contactDateTime: '',
    whatsappNumber: '',
    lookingFor: 'New Building' as 'New Building' | 'Resale',
    resaleAge: '' as '0-1 Y' | '1-3 Y' | '3-5 Y' | '5-10Y' | '10+y' | '',
    referrerName: '',
    referrerContact: '',
    clientOpinion: ''
  });

  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto fill whatsapp if linked
      if (name === 'mobileNumber' && sameAsMobile) {
        updated.whatsappNumber = value;
      }
      return updated;
    });
  };

  const handleSameAsMobileToggle = () => {
    setSameAsMobile(!sameAsMobile);
    if (!sameAsMobile) {
      setFormData(prev => ({
        ...prev,
        whatsappNumber: prev.mobileNumber
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (formData.name.trim().length < 2) {
      setError("Please submit a valid friend's name (minimum 2 characters).");
      return;
    }
    const phoneVal = validateMobileNumber('+91', formData.mobileNumber);
    if (!phoneVal.isValid) {
      setError(phoneVal.message || "Please enter a valid mobile number with the correct number of digits.");
      return;
    }
    if (!formData.contactDateTime) {
      setError("Please specify a preferred date and time to connect.");
      return;
    }

    let resolvedWhatsappNumber = formData.mobileNumber.trim();
    if (!sameAsMobile) {
      const manualWhatsapp = formData.whatsappNumber.trim();
      const digitsCount = manualWhatsapp.replace(/\D/g, '').length;
      if (
        manualWhatsapp.length < 8 ||
        manualWhatsapp.length > 20 ||
        digitsCount < 8 ||
        digitsCount > 15 ||
        !/^\+?[0-9][0-9\s\-()]{6,19}$/.test(manualWhatsapp)
      ) {
        setError("Please enter a valid WhatsApp contact number between 8 and 20 characters (or enable Synchronize WhatsApp).");
        return;
      }
      resolvedWhatsappNumber = manualWhatsapp;
    }

    const compiledBudget = `Rs. ${formData.budgetMin || 'Any'} to Rs. ${formData.budgetMax || 'Any'}`;
    
    const docData = {
      name: formData.name.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      budget: compiledBudget,
      location: formData.location.trim() || 'Any Location',
      propertyType: formData.propertyType,
      unitType: formData.unitType,
      contactDateTime: formData.contactDateTime,
      whatsappNumber: resolvedWhatsappNumber,
      lookingFor: formData.lookingFor,
      resaleAge: formData.lookingFor === 'Resale' ? formData.resaleAge : '',
      referrerName: formData.referrerName.trim() || 'Anonymous Referrer',
      referrerContact: formData.referrerContact.trim() || 'Not Provided',
      clientOpinion: formData.clientOpinion.trim(),
      createdAt: serverTimestamp()
    };

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'referrals'), docData);
      setSuccess(true);
      setFormData({
        name: '',
        mobileNumber: '',
        budgetMin: '',
        budgetMax: '',
        location: '',
        propertyType: 'Flat',
        unitType: '3BHK',
        contactDateTime: '',
        whatsappNumber: '',
        lookingFor: 'New Building',
        resaleAge: '',
        referrerName: '',
        referrerContact: '',
        clientOpinion: ''
      });
      setSameAsMobile(false);
    } catch (err: any) {
      console.error("Referral submission failed:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'referrals');
      } catch (jsonErr: any) {
        setError("Unable to log referral registry. Please check inputs and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="referral" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-lux-ivory relative overflow-hidden border-t border-lux-border">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lux-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lux-forest/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Vertical background accent line */}
      <div className="absolute left-12 top-0 w-px h-full bg-lux-border hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
          
          {/* Left Column - Elite Campaign info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-lux-gold text-[10px] uppercase tracking-[0.6em] font-black block mb-6">
                Client Network Advocacy
              </span>
              <h2 className="text-4xl md:text-[5.5rem] font-serif text-lux-forest tracking-widest leading-none mb-10 italic">
                Exclusive <br />
                <span className="not-italic text-lux-gold">Referral.</span>
              </h2>
            </div>

            {/* Campaign Voucher highlight Box */}
            <div className="bg-lux-forest border border-lux-gold/40 p-8 md:p-10 rounded-sm relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lux-gold to-transparent" />
              <div className="flex items-start gap-5">
                <div className="p-3 bg-lux-card/10 border border-lux-gold/30 rounded-sm mt-1 text-lux-gold">
                  <Gift size={24} className="animate-pulse" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-lux-gold text-xs uppercase tracking-[0.25em] font-black mb-1">
                    Advocate Honorarium
                  </h4>
                  <p className="text-[14px] text-lux-ivory font-serif leading-relaxed italic">
                    We value your trust and support. Now, when you refer a friend or family member who successfully purchases a property with us, you’ll receive a ₹25,000 Amazon Gift Voucher as a token of our appreciation.
                  </p>
                  <p className="text-xs text-lux-gold font-sans tracking-widest uppercase font-bold leading-relaxed">
                    Start referring today and enjoy exclusive rewards while helping your loved ones find their dream home!
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Sentence requested by user */}
            <div className="pl-6 border-l-2 border-lux-gold/60 space-y-3">
              <p className="text-[13px] text-lux-charcoal/85 font-serif italic leading-relaxed">
                "Enable your closest circle of friends and family to experience architectural perfection. Match them with Bangalore's most exclusive premium villa, residential flat, and gated plot developments, curated under rigorous criteria by the principal consultants at BS Homez."
              </p>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-4 text-lux-muted text-[9px] uppercase tracking-widest font-mono">
                <span>BS HOMEZ INVENTORY GROUP</span>
                <span className="w-1 h-1 bg-lux-gold rounded-full" />
                <span>SECURED PLATFORM</span>
              </div>
            </div>
          </div>

          {/* Right Column - Referral Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-lux-card border border-lux-border p-8 md:p-12 rounded-sm relative shadow-lg">
              
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Referrer Information */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.3em] text-lux-forest font-bold mb-6 flex items-center gap-3 border-b border-lux-border pb-3">
                      <span className="text-lux-gold">01.</span> YOUR PARTICULARS (ADVOCATE)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Your Name
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            name="referrerName"
                            placeholder="Enter your name"
                            value={formData.referrerName}
                            onChange={handleInputChange}
                            className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 pl-10 pr-4 py-3.5 rounded-sm outline-none transition-all"
                          />
                          <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Your Email / Contact Details
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            name="referrerContact"
                            placeholder="To credit ₹25,000 Amazon Voucher"
                            value={formData.referrerContact}
                            onChange={handleInputChange}
                            className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 pl-10 pr-4 py-3.5 rounded-sm outline-none transition-all"
                          />
                          <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Friend / Family particulars */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.3em] text-lux-forest font-bold mb-6 flex items-center gap-3 border-b border-lux-border pb-3">
                      <span className="text-lux-gold">02.</span> PORTFOLIO PROSPECT PARTICULARS
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Friend / Family Name <span className="text-lux-gold">*</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            name="name"
                            required
                            placeholder="Enter friend's full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 pl-10 pr-4 py-3.5 rounded-sm outline-none transition-all"
                          />
                          <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                        </div>
                      </div>

                      <div>
                        <PhoneInputWithCountry
                          label="Mobile Number"
                          value={formData.mobileNumber}
                          onChange={(fullNumber, _code, rawDigits) => {
                            setFormData(prev => ({
                              ...prev,
                              mobileNumber: fullNumber,
                              whatsappNumber: sameAsMobile ? fullNumber : prev.whatsappNumber
                            }));
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* WhatsApp sync logic */}
                    <div className="flex items-center justify-between gap-6 mb-6 bg-lux-ivory border border-lux-border p-4 rounded-sm">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-lux-charcoal uppercase tracking-wider font-bold">Synchronize WhatsApp?</span>
                        <span className="text-[8px] text-lux-muted uppercase tracking-widest mt-1">Use matching mobile registry for live alerts</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSameAsMobileToggle}
                        aria-pressed={sameAsMobile}
                        className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${sameAsMobile ? 'bg-lux-forest' : 'bg-lux-border'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-lux-card shadow-2xs transition-transform duration-300 ${sameAsMobile ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {!sameAsMobile && (
                      <div className="mb-6">
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          WhatsApp Contact Number
                        </label>
                        <div className="relative">
                          <input 
                            type="tel"
                            name="whatsappNumber"
                            placeholder="Enter active WhatsApp number (8–20 chars, e.g. +91 9876543210)" minLength={8} maxLength={20}
                            value={formData.whatsappNumber}
                            onChange={handleInputChange}
                            className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 pl-10 pr-4 py-3.5 rounded-sm outline-none transition-all font-mono"
                          />
                          <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-sans">
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Budget Range: Minimum (Rs.)
                        </label>
                        <input 
                          type="text"
                          name="budgetMin"
                          placeholder="e.g. 1.2 Crore"
                          value={formData.budgetMin}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 px-4 py-3.5 rounded-sm outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Budget Range: Maximum (Rs.)
                        </label>
                        <input 
                          type="text"
                          name="budgetMax"
                          placeholder="e.g. 3.0 Crore"
                          value={formData.budgetMax}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 px-4 py-3.5 rounded-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                        Desired Property Location(s)
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          name="location"
                          placeholder="e.g. Whitefield, Sarjapur, Manyata tech park corridors"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 pl-10 pr-4 py-3.5 rounded-sm outline-none transition-all"
                        />
                        <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Property Type
                        </label>
                        <div className="relative">
                          <select 
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleInputChange}
                            className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal px-10 py-3.5 rounded-sm outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="Villa" className="bg-lux-card text-lux-charcoal">Villa</option>
                            <option value="Flat" className="bg-lux-card text-lux-charcoal">Residential Flat</option>
                            <option value="Plot" className="bg-lux-card text-lux-charcoal">Gated Plot</option>
                            <option value="Stand Alone Building" className="bg-lux-card text-lux-charcoal">Stand Alone Building</option>
                          </select>
                          <Building2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Unit Requirement
                        </label>
                        <div className="relative">
                          <select 
                            name="unitType"
                            value={formData.unitType}
                            onChange={handleInputChange}
                            className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal px-10 py-3.5 rounded-sm outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="1BHK" className="bg-lux-card text-lux-charcoal">1 BHK</option>
                            <option value="2BHK" className="bg-lux-card text-lux-charcoal">2 BHK</option>
                            <option value="3BHK" className="bg-lux-card text-lux-charcoal">3 BHK</option>
                            <option value="4BHK" className="bg-lux-card text-lux-charcoal">4 BHK</option>
                            <option value="5BHK" className="bg-lux-card text-lux-charcoal">5 BHK or Independent Suite</option>
                          </select>
                          <Layers size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                          Looking For
                        </label>
                        <select 
                          name="lookingFor"
                          value={formData.lookingFor}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal px-4 py-3.5 rounded-sm outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="New Building" className="bg-lux-card text-lux-charcoal">New Building (Brand New)</option>
                          <option value="Resale" className="bg-lux-card text-lux-charcoal">Resale Portfolio Asset</option>
                        </select>
                      </div>

                      {/* Display conditional Resale dropdown if selected */}
                      {formData.lookingFor === 'Resale' && (
                        <div>
                          <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                            Resale Age Requirement <span className="text-lux-gold">*</span>
                          </label>
                          <select 
                            name="resaleAge"
                            required
                            value={formData.resaleAge}
                            onChange={handleInputChange}
                            className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal px-4 py-3.5 rounded-sm outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-lux-card text-lux-muted">Select Asset Age Limit</option>
                            <option value="0-1 Y" className="bg-lux-card text-lux-charcoal">0 to 1 Year Old</option>
                            <option value="1-3 Y" className="bg-lux-card text-lux-charcoal">1 to 3 Years Old</option>
                            <option value="3-5 Y" className="bg-lux-card text-lux-charcoal">3 to 5 Years Old</option>
                            <option value="5-10Y" className="bg-lux-card text-lux-charcoal">5 to 10 Years Old</option>
                            <option value="10+y" className="bg-lux-card text-lux-charcoal">10+ Years Old</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* DateTime Contact Schedule */}
                    <div className="mb-6">
                      <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                        Preferred Contact Date & Time <span className="text-lux-gold">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="datetime-local"
                          name="contactDateTime"
                          required
                          value={formData.contactDateTime}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal pl-10 pr-4 py-3.5 rounded-sm outline-none transition-all font-mono"
                        />
                        <Calendar size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-forest/70" />
                      </div>
                    </div>

                    {/* Describe Client Opinion/Specific Criteria */}
                    <div className="mb-6">
                      <label className="text-[8px] uppercase tracking-[0.3em] text-lux-charcoal mb-2 block font-black">
                        Advocate Advice / Critical Requirements
                      </label>
                      <div className="relative">
                        <textarea 
                          name="clientOpinion"
                          placeholder="Provide specific notes regarding their preference, community values, or specific villa orientation targets..."
                          value={formData.clientOpinion}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full text-xs bg-lux-ivory border border-lux-border focus:border-lux-forest focus:bg-lux-card text-lux-charcoal placeholder-lux-muted/60 pl-10 pr-4 py-3.5 rounded-sm outline-none transition-all resize-none"
                        />
                        <MessageSquare size={13} className="absolute left-3.5 top-5 text-lux-forest/70" />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-sm text-red-700 text-[10px] uppercase tracking-widest font-bold">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-lux-forest text-lux-card hover:bg-lux-forest-hover font-black text-xs uppercase tracking-[0.3em] py-5 rounded-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-lux-gold" />
                        Logging Registry...
                      </>
                    ) : (
                      "Establish Secured Referral"
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 py-16 px-4"
                >
                  <div className="w-20 h-20 rounded-full bg-lux-forest/10 flex items-center justify-center mx-auto border border-lux-forest/25">
                    <CheckCircle2 className="text-lux-forest" size={36} />
                  </div>
                  <div>
                    <span className="text-lux-gold text-[9px] uppercase tracking-[0.4em] block mb-2 font-mono font-bold">
                      Database Entry Authenticated
                    </span>
                    <h3 className="text-3xl font-serif italic text-lux-forest leading-tight">
                      Referral Secured Successfully
                    </h3>
                    <p className="text-xs text-lux-muted leading-relaxed uppercase tracking-[0.15em] max-w-sm mx-auto mt-4">
                      The premier advisory team has locked {formData.name || 'your referral'} in our relationship database. Your advocate referral tie has been indexed to collect the ₹25,000 Amazon Gift Voucher upon successful close.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="border border-lux-border bg-lux-ivory hover:bg-lux-forest hover:border-lux-forest hover:text-lux-card text-lux-forest text-[9px] uppercase tracking-widest font-black px-8 py-3.5 rounded-sm transition-all cursor-pointer"
                  >
                    Register Another Advocacy
                  </button>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
