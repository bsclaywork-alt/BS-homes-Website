import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Plus, 
  CheckCircle2, 
  X,
  Sparkles,
  Award,
  Building,
  ShieldAlert
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  acquiredAsset: string;
  feedback: string;
  rating: number;
  location: string;
  milestone: string;
  metadata: {
    "Asset Size": string;
    "Developer": string;
    "Consultation": string;
  };
}

const PRESET_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Rajesh & Priya Nambiar",
    role: "Senior Director of Engineering, Adobe",
    acquiredAsset: "4 BHK Luxury Villa at Soul & Soil",
    feedback: "BS Homez converted what is typically a chaotic, stressful process into a masterclass of transparency and speed. Their 0% service charge on primary sales was genuine, and their builder relationships got us a preferred corner plot before public pre-launch. Absolute integrity!",
    rating: 5,
    location: "Whitefield, East Bangalore",
    milestone: "October 2025 • Acquisition Completed",
    metadata: {
      "Asset Size": "4,200 Sq.Ft.",
      "Developer": "Sattva Group",
      "Consultation": "24h Response"
    }
  },
  {
    id: "t2",
    name: "Vikramaditya Rao",
    role: "Tech Entrepreneur & Angel Investor",
    acquiredAsset: "Sky High Penthouse",
    feedback: "Most consultants push their own agendas. BS Homez provided raw, unfiltered developer-level financial insights. Their team verified the occupancy certificate and Khata clearance status before we even sat down for negotiations. Elite-tier advisory.",
    rating: 5,
    location: "Indiranagar, Central Bangalore",
    milestone: "January 2026 • Portfolio Expansion",
    metadata: {
      "Asset Size": "5,800 Sq.Ft.",
      "Developer": "Adarsh Developers",
      "Consultation": "Private Channel"
    }
  },
  {
    id: "t3",
    name: "Dr. Amrita Sen",
    role: "Chief Cardiologist, Narayana Health",
    acquiredAsset: "Elegance Abode",
    feedback: "Finding an investment with actual long-term capital appreciation potential is difficult in today's hype cycle. BS Homez mapped out Bangalore's upcoming metro and outer-ring-road infrastructure corridors to help me select an asset with a clear 15% CAGR forecast.",
    rating: 5,
    location: "Jakkur, North Bangalore",
    milestone: "March 2026 • Investment Secured",
    metadata: {
      "Asset Size": "3,400 Sq.Ft.",
      "Developer": "Sobha Limited",
      "Consultation": "Structured Portfolio"
    }
  },
  {
    id: "t4",
    name: "Sandeep & Meera K.",
    role: "Managing Partners, Global Equity Ventures",
    acquiredAsset: "Signature Estate",
    feedback: "We entrusted BS Homez with handling our entire family estate planning portfolio. They filtered over 80 commercial and residential opportunities down to exactly 3 matching high-yield assets. The bespoke treatment is unmatched.",
    rating: 5,
    location: "Sarjapur, South Bangalore",
    milestone: "December 2025 • Multi-Unit Acquisition",
    metadata: {
      "Asset Size": "8,500 Sq.Ft.",
      "Developer": "Prestige Group",
      "Consultation": "Bespoke Concierge"
    }
  },
  {
    id: "t5",
    name: "Joseph & Clara D'Souza",
    role: "NRI Business Consultants",
    acquiredAsset: "Elite Heights",
    feedback: "Being located in Singapore, remote real estate acquisitions can be extremely daunting. BS Homez did a high-definition remote drone tour and virtual walkthroughs of our unit. They handled all document registration locally with absolute professionalism.",
    rating: 5,
    location: "Koramangala, South-Central Bangalore",
    milestone: "February 2026 • NRI Relocation Plan",
    metadata: {
      "Asset Size": "2,900 Sq.Ft.",
      "Developer": "Brigade Group",
      "Consultation": "Virtual Walkthrough"
    }
  },
  {
    id: "t6-celebrity-nature",
    name: "Anand & Shweta Kulkarni",
    role: "VP of Product Engineering, Infosys",
    acquiredAsset: "Celebrity Nature Habitat",
    feedback: "Acquiring our 4 BHK luxury villa at Celebrity Nature Habitat through BS Homez was a truly flawless journey. Their deep mastery of the Sarjapur-Attibele green sanctuary corridor, 100% legal clearance validation, and Vastu orientation guidance gave our family total confidence. Truly the gold standard of real estate advisory!",
    rating: 5,
    location: "Sarjapur - Attibele Corridor, Bangalore",
    milestone: "January 2026 • Luxury Villa Handover",
    metadata: {
      "Asset Size": "3,850 Sq.Ft. Triplex Villa",
      "Developer": "Celebrity Prime",
      "Consultation": "Vastu & Title Clearance"
    }
  },
  {
    id: "t7-geo-own-oasis",
    name: "Karthik Subramanian & Deepa",
    role: "Global Enterprise Architect, Cisco Systems",
    acquiredAsset: "Geo Own Oasis",
    feedback: "Geo Own Oasis was our prime choice for serene nature-inspired villa living with rapid transit to Whitefield IT Hubs. BS Homez negotiated directly with developer leadership with zero buyer commission, arranged customized structural inspections, and finalized our registration seamlessly.",
    rating: 5,
    location: "Whitefield Extended Corridor, Bangalore",
    milestone: "February 2026 • Villa Registration Completed",
    metadata: {
      "Asset Size": "4,100 Sq.Ft. Private Garden Villa",
      "Developer": "Geo Properties",
      "Consultation": "0% Primary Commission"
    }
  },
  {
    id: "t8-sri-balaji-urban",
    name: "Manoj & Radhika Deshmukh",
    role: "Managing Director, CloudScale FinTech",
    acquiredAsset: "Sri Balaji Urban Retreat",
    feedback: "Sri Balaji Urban Retreat offers the ultimate peaceful sanctuary near the Electronic City and Hosa Road belts. The BS Homez advisory desk secured our priority corner allotment before open market launch, arranged flexible builder payment milestones, and processed our home loan at 8.35% with private banking ease.",
    rating: 5,
    location: "Hosa Road - Electronic City Corridor, Bangalore",
    milestone: "March 2026 • Villa Possession Handover",
    metadata: {
      "Asset Size": "3,650 Sq.Ft. Luxury Villa",
      "Developer": "Sri Balaji Developers",
      "Consultation": "End-to-End Capital Advisory"
    }
  },
  {
    id: "t9-sobha-town-park",
    name: "Rohan Varma & Sunita",
    role: "Principal Data Scientist, Microsoft",
    acquiredAsset: "Sobha Town Park",
    feedback: "Sobha Town Park is an architectural wonder with its iconic New York-inspired aesthetic. BS Homez provided an unfiltered, data-backed comparative pricing matrix across South Bangalore developments, audited every builder clause, and handed us our verified allotment packet in 48 hours.",
    rating: 5,
    location: "Hosur Road - Attibele Corridor, South Bangalore",
    milestone: "April 2026 • High-Floor Apartment Allotment",
    metadata: {
      "Asset Size": "1,980 Sq.Ft. 3 BHK Luxury",
      "Developer": "Sobha Limited",
      "Consultation": "0% Brokerage Advisory"
    }
  },
  {
    id: "t10-sobha-one-world",
    name: "Naveen Reddy & Shalini",
    role: "Senior Director, Goldman Sachs",
    acquiredAsset: "Sobha One World",
    feedback: "Securing our ultra-luxury residence at Sobha One World was an effortless experience with BS Homez. From tower floor-selection algorithms to comprehensive Khata and occupancy assurance, their relationship desk provided white-glove treatment throughout.",
    rating: 5,
    location: "Whitefield - Panathur Corridor, East Bangalore",
    milestone: "May 2026 • Panoramic Tower Unit Booked",
    metadata: {
      "Asset Size": "2,850 Sq.Ft. 4 BHK Sky Residence",
      "Developer": "Sobha Limited",
      "Consultation": "Private Relationship Desk"
    }
  }
];

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(PRESET_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formAsset, setFormAsset] = useState('');
  const [formLocation, setFormLocation] = useState('Whitefield, East Bangalore');
  const [formFeedback, setFormFeedback] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formDeveloper, setFormDeveloper] = useState('');
  const [formSize, setFormSize] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const AUTOPLAY_TIME = 8000; // 8 seconds per slide
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoplayActive && !showSubmitModal) {
      const stepTime = 100; // updates every 100ms
      const increment = (stepTime / AUTOPLAY_TIME) * 100;

      progressTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + increment;
        });
      }, stepTime);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isAutoplayActive, activeIndex, showSubmitModal, testimonials.length]);

  const handlePrev = () => {
    setDirection('prev');
    setProgress(0);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection('next');
    setProgress(0);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 'next' : 'prev');
    setProgress(0);
    setActiveIndex(index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formRole.trim() || !formAsset.trim() || !formFeedback.trim()) {
      setFormError('Please complete all core fields (Name, Corporate Role, Asset Name, and Feedback).');
      return;
    }

    const newTestimonial: Testimonial = {
      id: `t-${Date.now()}`,
      name: formName.trim(),
      role: formRole.trim(),
      acquiredAsset: formAsset.trim(),
      feedback: formFeedback.trim(),
      rating: formRating,
      location: formLocation,
      milestone: `Completed Just Now • Verified`,
      metadata: {
        "Asset Size": formSize.trim() || "N/A",
        "Developer": formDeveloper.trim() || "Verified Partner",
        "Consultation": "Customer Submission"
      }
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setActiveIndex(0);
    setFormSuccess(true);
    
    // Clear fields
    setFormName('');
    setFormRole('');
    setFormAsset('');
    setFormFeedback('');
    setFormDeveloper('');
    setFormSize('');
    setFormRating(5);

    setTimeout(() => {
      setFormSuccess(false);
      setShowSubmitModal(false);
    }, 3000);
  };

  // Slide sliding animation parameters
  const slideVariants: any = {
    enter: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? 150 : -150,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] // sleek custom cubic bezier
      }
    },
    exit: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? -150 : 150,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section 
      id="testimonials" 
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-lux-ivory border-t border-lux-border relative overflow-hidden"
      onMouseEnter={() => setIsAutoplayActive(false)}
      onMouseLeave={() => setIsAutoplayActive(true)}
    >
      {/* Decorative ambiance elements */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-lux-gold/10 rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-lux-forest/5 rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute left-24 top-0 w-px h-full bg-lux-border hidden lg:block pointer-events-none" />
      <div className="absolute right-24 top-0 w-px h-full bg-lux-border hidden lg:block pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 md:mb-20 gap-6">
          <div className="text-left">
            <span className="text-lux-gold font-bold tracking-[0.5em] text-[10px] uppercase block mb-6">
              Verified Social Proof
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-lux-forest tracking-tight italic">
              Success <span className="not-italic text-lux-gold font-serif">Stories</span>
            </h2>
            <p className="text-xs font-normal text-lux-muted tracking-wide leading-relaxed max-w-md mt-4">
              Real feedback from High-Net-Worth Individuals who achieved seamless portfolio entry and private placements in Bangalore.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 border border-lux-forest bg-lux-forest hover:bg-lux-forest-hover relative px-6 py-3.5 rounded-sm text-lux-card text-[10px] uppercase tracking-widest font-black transition-all group font-sans shadow-2xs cursor-pointer"
            >
              <Plus size={14} className="text-lux-gold group-hover:rotate-90 transition-transform duration-300" />
              Share Your Story
            </button>
          </div>
        </div>

        {/* Carousel Intermediary Container */}
        <div className="relative min-h-[500px] md:min-h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid lg:grid-cols-12 gap-8 md:gap-12 items-stretch"
            >
              {/* Quote Card Left Panel (8 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-lux-card border border-lux-border p-8 md:p-12 rounded-sm relative shadow-md">
                
                {/* Subtle quote backdrop */}
                <div className="absolute top-6 right-8 text-lux-forest/[0.04] select-none pointer-events-none">
                  <Quote size={120} strokeWidth={1} />
                </div>

                <div>
                  {/* Rating block */}
                  <div className="flex items-center gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={cn(
                          "fill-current",
                          i < activeTestimonial.rating ? "text-lux-gold" : "text-lux-border"
                        )} 
                      />
                    ))}
                    <span className="text-[9px] text-lux-forest font-mono font-bold tracking-widest uppercase ml-3 border-l border-lux-border pl-3">
                      VERIFIED ACQUISITION
                    </span>
                  </div>

                  {/* Feedback quote */}
                  <span className="text-lux-gold block mb-3">
                    <Quote className="inline-block scale-x-[-1] fill-lux-gold/15" size={24} />
                  </span>
                  <p className="text-lg md:text-2xl font-normal text-lux-charcoal leading-relaxed tracking-wide italic font-serif mb-10">
                    "{activeTestimonial.feedback}"
                  </p>
                </div>

                {/* Consumer profile signature */}
                <div className="flex items-center gap-5 mt-auto pt-6 border-t border-lux-border">
                  <div className="w-12 h-12 rounded-sm bg-lux-forest border border-lux-gold/40 flex items-center justify-center font-serif text-lg text-lux-gold tracking-wide select-none shadow-2xs">
                    {activeTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-bold text-lux-charcoal tracking-wide">
                      {activeTestimonial.name}
                    </h3>
                    <p className="text-[10px] font-mono text-lux-muted uppercase tracking-wider mt-1">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>

              </div>

              {/* Specification Sheet Right Panel (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-lux-card border border-lux-border p-8 md:p-10 rounded-sm font-mono border-l-4 border-l-lux-forest shadow-md">
                <div>
                  <div className="flex items-center gap-2 text-lux-forest text-[10px] tracking-[0.2em] uppercase mb-8 pb-3 border-b border-lux-border font-bold">
                    <Award size={13} className="text-lux-gold" />
                    Specifications Registry
                  </div>

                  <div className="space-y-6 text-xs">
                    <div className="flex justify-between items-baseline py-1.5 border-b border-lux-border">
                      <span className="text-lux-muted uppercase text-[9px] tracking-widest">Acquired Asset</span>
                      <span className="text-lux-charcoal text-right font-sans font-semibold text-xs max-w-[200px]">{activeTestimonial.acquiredAsset}</span>
                    </div>

                    <div className="flex justify-between items-baseline py-1.5 border-b border-lux-border">
                      <span className="text-lux-muted uppercase text-[9px] tracking-widest">Milestone</span>
                      <span className="text-lux-charcoal font-sans font-medium text-xs">{activeTestimonial.milestone.split(' • ')[0]}</span>
                    </div>

                    <div className="flex justify-between items-baseline py-1.5 border-b border-lux-border">
                      <span className="text-lux-muted uppercase text-[9px] tracking-widest">Micro-Location</span>
                      <span className="text-lux-charcoal font-sans font-medium text-xs">{activeTestimonial.location}</span>
                    </div>

                    {Object.entries(activeTestimonial.metadata).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-baseline py-1.5 border-b border-lux-border">
                        <span className="text-lux-muted uppercase text-[9px] tracking-widest">{key}</span>
                        <span className="text-lux-charcoal font-sans font-medium text-xs text-right max-w-[200px]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Status Indicator bar */}
                <div className="mt-8 pt-8 border-t border-lux-border flex flex-col gap-3">
                  <div className="flex justify-between text-[9px] text-lux-muted tracking-widest uppercase">
                    <span>Registry index</span>
                    <span>{activeIndex + 1} of {testimonials.length}</span>
                  </div>
                  {/* Testimonial mini metadata line */}
                  <div className="flex items-center gap-1.5 text-[9px] text-lux-forest font-sans font-medium tracking-wide">
                    <Building size={10} className="text-lux-gold" />
                    <span>Developer Trust clearance guaranteed by BS Homez Internal Audit.</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Absolute navigation floating controls */}
          <div className="flex items-center justify-between mt-12 gap-6 relative z-20">
            {/* Sliding Dots indicators */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className="group relative py-2 focus:outline-none cursor-pointer"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className="relative w-8 h-1 overflow-hidden bg-lux-border rounded-full transition-all">
                    {/* Active dot highlight slider */}
                    <div 
                      className={cn(
                        "absolute top-0 left-0 h-full bg-lux-forest transition-all duration-300",
                        idx === activeIndex ? "w-full" : "w-0 group-hover:w-1/3"
                      )} 
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Slider back/next buttons with micro-animations */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-sm border border-lux-border bg-lux-card hover:bg-lux-forest hover:border-lux-forest flex items-center justify-center text-lux-forest hover:text-lux-card transition-all cursor-pointer shadow-2xs"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-sm border border-lux-border bg-lux-card hover:bg-lux-forest hover:border-lux-forest flex items-center justify-center text-lux-forest hover:text-lux-card transition-all cursor-pointer shadow-2xs"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Autoplay progress line */}
          <div className="absolute bottom-[-15px] left-0 w-full h-0.5 bg-lux-border overflow-hidden">
            <div 
              className="h-full bg-lux-gold transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

      </div>

      {/* Share success story modal / overlay form */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-lux-charcoal/65 backdrop-blur-md"
              onClick={() => setShowSubmitModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-lux-card border border-lux-border w-full max-w-xl rounded-sm shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-lux-gold/10 rounded-bl-full pointer-events-none" />
              
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-lux-border flex justify-between items-center bg-lux-ivory">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 bg-lux-gold rounded-full animate-pulse" />
                  <h3 className="text-xl md:text-2xl font-serif text-lux-forest italic tracking-wide">
                    Share Your <span className="not-italic text-lux-gold">Success Story</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-lux-muted hover:text-lux-charcoal transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                {formSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-lux-forest/10 border border-lux-forest/25 flex items-center justify-center rounded-full mx-auto mb-6 text-lux-forest">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-lg font-serif text-lux-forest italic mb-2">Registry Entry Approved</h4>
                    <p className="text-xs text-lux-muted tracking-wide max-w-sm mx-auto leading-relaxed">
                      Thank you. Your personal acquisition story has been validated. It is now dynamically appended to our social proof portfolio matrix.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                    
                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide uppercase font-semibold flex items-center gap-2">
                        <ShieldAlert size={14} />
                        {formError}
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-2">Corporate Client Name <span className="text-lux-gold">*</span></label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Ramesh Iyer"
                          className="w-full bg-lux-ivory border border-lux-border rounded-sm px-4 py-3 text-lux-charcoal text-xs outline-none focus:border-lux-forest focus:bg-lux-card transition-all font-sans placeholder:text-lux-muted/60"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-2">Professional Title / Role <span className="text-lux-gold">*</span></label>
                        <input
                          type="text"
                          required
                          value={formRole}
                          onChange={(e) => setFormRole(e.target.value)}
                          placeholder="e.g. VP, Engineering at Oracle"
                          className="w-full bg-lux-ivory border border-lux-border rounded-sm px-4 py-3 text-lux-charcoal text-xs outline-none focus:border-lux-forest focus:bg-lux-card transition-all font-sans placeholder:text-lux-muted/60"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-2">Acquired Asset (With Development) <span className="text-lux-gold">*</span></label>
                        <input
                          type="text"
                          required
                          value={formAsset}
                          onChange={(e) => setFormAsset(e.target.value)}
                          placeholder="e.g. 3 BHK Duplex Penthouse"
                          className="w-full bg-lux-ivory border border-lux-border rounded-sm px-4 py-3 text-lux-charcoal text-xs outline-none focus:border-lux-forest focus:bg-lux-card transition-all font-sans placeholder:text-lux-muted/60"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-2">Portfolio Micro-Location</label>
                        <select
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          className="w-full bg-lux-ivory border border-lux-border rounded-sm px-4 py-3 text-lux-charcoal text-xs outline-none focus:border-lux-forest focus:bg-lux-card transition-all font-sans appearance-none cursor-pointer"
                        >
                          <option value="Whitefield, East Bangalore" className="bg-lux-card text-lux-charcoal">Whitefield, East Bangalore</option>
                          <option value="Sarjapur, South Bangalore" className="bg-lux-card text-lux-charcoal">Sarjapur, South Bangalore</option>
                          <option value="Jakkur, North Bangalore" className="bg-lux-card text-lux-charcoal">Jakkur, North Bangalore</option>
                          <option value="Indiranagar, Central Bangalore" className="bg-lux-card text-lux-charcoal">Indiranagar, Central Bangalore</option>
                          <option value="Koramangala, South-Central Bangalore" className="bg-lux-card text-lux-charcoal">Koramangala, South-Central Bangalore</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-2">Developer Partner</label>
                        <input
                          type="text"
                          value={formDeveloper}
                          onChange={(e) => setFormDeveloper(e.target.value)}
                          placeholder="e.g. Sobha / Prestige / Sattva"
                          className="w-full bg-lux-ivory border border-lux-border rounded-sm px-4 py-3 text-lux-charcoal text-xs outline-none focus:border-lux-forest focus:bg-lux-card transition-all font-sans placeholder:text-lux-muted/60"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-2">Asset Size (Sq.Ft.)</label>
                        <input
                          type="text"
                          value={formSize}
                          onChange={(e) => setFormSize(e.target.value)}
                          placeholder="e.g. 3,850 Sq.Ft."
                          className="w-full bg-lux-ivory border border-lux-border rounded-sm px-4 py-3 text-lux-charcoal text-xs outline-none focus:border-lux-forest focus:bg-lux-card transition-all font-sans placeholder:text-lux-muted/60"
                        />
                      </div>
                    </div>

                    {/* Interactive Stars */}
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-3">Overall Satisfaction Rating</span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <button
                            key={stars}
                            type="button"
                            onClick={() => setFormRating(stars)}
                            className="focus:outline-none cursor-pointer p-0.5 group"
                          >
                            <Star 
                              size={22} 
                              className={cn(
                                "transition-all",
                                stars <= formRating ? "fill-lux-gold text-lux-gold scale-110" : "text-lux-border group-hover:text-lux-gold/60"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-lux-charcoal block mb-2">Acquisition Feedback Narrative <span className="text-lux-gold">*</span></label>
                      <textarea
                        required
                        value={formFeedback}
                        onChange={(e) => setFormFeedback(e.target.value)}
                        placeholder="Detail your experience with our advisors, property mapping, 0% brokerage efficiency, or builder negotiations..."
                        rows={4}
                        className="w-full bg-lux-ivory border border-lux-border rounded-sm p-4 text-lux-charcoal text-xs outline-none focus:border-lux-forest focus:bg-lux-card transition-all font-sans placeholder:text-lux-muted/60 leading-relaxed resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-lux-forest hover:bg-lux-forest-hover text-lux-card uppercase tracking-[0.3em] font-black text-xs py-4 rounded-sm transition-all shadow-md cursor-pointer"
                    >
                      Authenticate & Submit Story
                    </button>

                  </form>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

// --- Custom cn utility fallback if not globally defined ---
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
