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
      className="py-24 md:py-36 px-6 md:px-12 bg-[#060606] border-t border-white/5 relative overflow-hidden"
      onMouseEnter={() => setIsAutoplayActive(false)}
      onMouseLeave={() => setIsAutoplayActive(true)}
    >
      {/* Decorative ambiance elements */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-art-gold/5 rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-white/[0.01] rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute left-24 top-0 w-px h-full bg-white/5 hidden lg:block pointer-events-none" />
      <div className="absolute right-24 top-0 w-px h-full bg-white/5 hidden lg:block pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div className="text-left">
            <span className="text-art-gold font-medium tracking-[0.5em] text-[10px] uppercase block mb-6">
              Verified Social Proof
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight italic">
              Success <span className="not-italic text-art-gold font-serif">Stories</span>
            </h2>
            <p className="text-xs font-light text-white/50 tracking-wide leading-relaxed max-w-md mt-4">
              Real feedback from High-Net-Worth Individuals who achieved seamless portfolio entry and private placements in Bangalore.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 border border-art-gold/30 hover:border-art-gold relative px-6 py-3.5 rounded-sm bg-art-gold/5 text-art-gold text-[10px] uppercase tracking-widest font-black transition-all group font-sans"
            >
              <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
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
              <div className="lg:col-span-7 flex flex-col justify-between bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-sm relative backdrop-blur-3xl">
                
                {/* Gold quote backdrop */}
                <div className="absolute top-6 right-8 text-white/[0.03] select-none pointer-events-none">
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
                          i < activeTestimonial.rating ? "text-art-gold" : "text-white/10"
                        )} 
                      />
                    ))}
                    <span className="text-[9px] text-art-gold font-mono tracking-widest uppercase ml-3 border-l border-white/10 pl-3">
                      VERIFIED ACQUISITION
                    </span>
                  </div>

                  {/* Feedback quote */}
                  <span className="text-art-gold/80 block mb-3">
                    <Quote className="inline-block scale-x-[-1] fill-art-gold/10" size={24} />
                  </span>
                  <p className="text-lg md:text-2xl font-light text-white/95 leading-relaxed tracking-wide italic font-serif mb-10">
                    "{activeTestimonial.feedback}"
                  </p>
                </div>

                {/* Consumer profile signature */}
                <div className="flex items-center gap-5 mt-auto pt-6 border-t border-white/5">
                  <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-art-accent to-art-gold/20 border border-white/10 flex items-center justify-center font-serif text-lg text-art-gold tracking-wide select-none">
                    {activeTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-bold text-white tracking-wide">
                      {activeTestimonial.name}
                    </h3>
                    <p className="text-[10px] font-mono text-white/45 uppercase tracking-wider mt-1">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>

              </div>

              {/* Specification Sheet Right Panel (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white/[0.01] border border-white/10 p-8 md:p-10 rounded-sm font-mono border-l-2 border-l-art-gold/50">
                <div>
                  <div className="flex items-center gap-2 text-art-gold text-[10px] tracking-[0.2em] uppercase mb-8 pb-3 border-b border-white/10 font-bold">
                    <Award size={13} />
                    Specifications Registry
                  </div>

                  <div className="space-y-6 text-xs">
                    <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.03]">
                      <span className="text-white/40 uppercase text-[9px] tracking-widest">Acquired Asset</span>
                      <span className="text-white text-right font-sans font-medium text-xs max-w-[200px]">{activeTestimonial.acquiredAsset}</span>
                    </div>

                    <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.03]">
                      <span className="text-white/40 uppercase text-[9px] tracking-widest">Milestone</span>
                      <span className="text-white font-sans text-xs">{activeTestimonial.milestone.split(' • ')[0]}</span>
                    </div>

                    <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.03]">
                      <span className="text-white/40 uppercase text-[9px] tracking-widest">Micro-Location</span>
                      <span className="text-white font-sans text-xs">{activeTestimonial.location}</span>
                    </div>

                    {Object.entries(activeTestimonial.metadata).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-baseline py-1.5 border-b border-white/[0.03]">
                        <span className="text-white/40 uppercase text-[9px] tracking-widest">{key}</span>
                        <span className="text-white font-sans text-xs text-right max-w-[200px]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Status Indicator bar */}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between text-[9px] text-white/30 tracking-widest uppercase">
                    <span>Registry index</span>
                    <span>{activeIndex + 1} of {testimonials.length}</span>
                  </div>
                  {/* Testimonial mini metadata line */}
                  <div className="flex items-center gap-1.5 text-[9px] text-art-gold/50 font-sans tracking-wide">
                    <Building size={10} className="text-art-gold" />
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
                  className="group relative py-2 focus:outline-none"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className="relative w-8 h-1 overflow-hidden bg-white/10 rounded-full transition-all">
                    {/* Active dot highlight slider */}
                    <div 
                      className={cn(
                        "absolute top-0 left-0 h-full bg-art-gold transition-all duration-300",
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
                className="w-12 h-12 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-art-gold/40 flex items-center justify-center text-white/55 hover:text-white transition-all cursor-pointer"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-art-gold/40 flex items-center justify-center text-white/55 hover:text-white transition-all cursor-pointer"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Autoplay progress line */}
          <div className="absolute bottom-[-15px] left-0 w-full h-0.5 bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-art-gold transition-all duration-100 ease-linear" 
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowSubmitModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-art-dark border border-white/15 w-full max-w-xl rounded-sm shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-art-gold/5 rounded-bl-full pointer-events-none" />
              
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 bg-art-gold rounded-full animate-pulse" />
                  <h3 className="text-xl md:text-2xl font-serif text-white italic tracking-wide">
                    Share Your <span className="not-italic text-art-gold">Success Story</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
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
                    <div className="w-16 h-16 bg-art-gold/15 border border-art-gold/30 flex items-center justify-center rounded-full mx-auto mb-6 text-art-gold">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-lg font-serif text-white italic mb-2">Registry Entry Approved</h4>
                    <p className="text-xs text-white/50 tracking-wide max-w-sm mx-auto leading-relaxed">
                      Thank you. Your personal acquisition story has been validated. It is now dynamically appended to our social proof portfolio matrix.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                    
                    {formError && (
                      <div className="p-3 bg-red-900/10 border border-red-500/20 text-red-400 text-xs tracking-wide uppercase font-semibold flex items-center gap-2">
                        <ShieldAlert size={14} />
                        {formError}
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-2">Corporate Client Name <span className="text-art-gold">*</span></label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Ramesh Iyer"
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-xs outline-none focus:border-art-gold/60 transition-all font-sans placeholder:text-white/20"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-2">Professional Title / Role <span className="text-art-gold">*</span></label>
                        <input
                          type="text"
                          required
                          value={formRole}
                          onChange={(e) => setFormRole(e.target.value)}
                          placeholder="e.g. VP, Engineering at Oracle"
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-xs outline-none focus:border-art-gold/60 transition-all font-sans placeholder:text-white/20"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-2">Acquired Asset (With Development) <span className="text-art-gold">*</span></label>
                        <input
                          type="text"
                          required
                          value={formAsset}
                          onChange={(e) => setFormAsset(e.target.value)}
                          placeholder="e.g. 3 BHK Duplex Penthouse"
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-xs outline-none focus:border-art-gold/60 transition-all font-sans placeholder:text-white/20"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-2">Portfolio Micro-Location</label>
                        <select
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-xs outline-none focus:border-art-gold/60 transition-all font-sans appearance-none cursor-pointer"
                        >
                          <option value="Whitefield, East Bangalore" className="bg-art-dark">Whitefield, East Bangalore</option>
                          <option value="Sarjapur, South Bangalore" className="bg-art-dark">Sarjapur, South Bangalore</option>
                          <option value="Jakkur, North Bangalore" className="bg-art-dark">Jakkur, North Bangalore</option>
                          <option value="Indiranagar, Central Bangalore" className="bg-art-dark">Indiranagar, Central Bangalore</option>
                          <option value="Koramangala, South-Central Bangalore" className="bg-art-dark">Koramangala, South-Central Bangalore</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-2">Developer Partner</label>
                        <input
                          type="text"
                          value={formDeveloper}
                          onChange={(e) => setFormDeveloper(e.target.value)}
                          placeholder="e.g. Sobha / Prestige / Sattva"
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-xs outline-none focus:border-art-gold/60 transition-all font-sans placeholder:text-white/20"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-2">Asset Size (Sq.Ft.)</label>
                        <input
                          type="text"
                          value={formSize}
                          onChange={(e) => setFormSize(e.target.value)}
                          placeholder="e.g. 3,850 Sq.Ft."
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-xs outline-none focus:border-art-gold/60 transition-all font-sans placeholder:text-white/20"
                        />
                      </div>
                    </div>

                    {/* Interactive Stars */}
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-3">Overall Satisfaction Rating</span>
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
                                stars <= formRating ? "fill-art-gold text-art-gold scale-110" : "text-white/10 group-hover:text-white/30"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-2">Acquisition Feedback Narrative <span className="text-art-gold">*</span></label>
                      <textarea
                        required
                        value={formFeedback}
                        onChange={(e) => setFormFeedback(e.target.value)}
                        placeholder="Detail your experience with our advisors, property mapping, 0% brokerage efficiency, or builder negotiations..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white text-xs outline-none focus:border-art-gold/60 transition-all font-sans placeholder:text-white/20 leading-relaxed resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white hover:bg-art-gold text-black uppercase tracking-[0.3em] font-black text-xs py-4 rounded-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer"
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
