import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles, MessageSquare } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 'benefit_primary',
      question: 'What is the benefit of primary sales?',
      answer: 'Primary sales represent acquisitions made directly from developer portfolios. By acquiring directly from the builder partner pool, visitor-members pay a 0% consulting fee to BS Homez. Furthermore, you secure primary early-phase launch pricing, bespoke interest-payment structures, and full assurance of developer-direct authenticity.'
    },
    {
      id: 'schedule_visit',
      question: 'How do I schedule a visit?',
      answer: 'You can trigger any of the "Enquire Now" or advisor-consultation buttons across our matching portfolios. Our synchronized client desk will immediately reach out to coordinate a bespoke discovery route, equipped with private transport arrangements, architectural comparisons, and senior advisory support accompanying you throughout.'
    },
    {
      id: 'compensation_model',
      question: 'How is BS Homez compensated if there are no consulting fees?',
      answer: 'We operate via institutional developer alignments. Our partner builders compensate us directly out of their marketing and outreach budgets. This design enables us to maintain a full 0% brokerage policy for buyer clients, delivering unbiased, institutional-grade guidance at zero cost to you.'
    },
    {
      id: 'transactional_support',
      question: 'Does your team support banking approvals and registry services?',
      answer: 'Yes, our relationship desk offers end-to-end administrative management. This includes pre-approving direct premier home loans with major financial entities, structural documentation indexing, and physical assistance at the sub-registrar office to ensure absolute compliance.'
    }
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-lux-ivory relative overflow-hidden border-t border-lux-border">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-lux-forest/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-lux-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lux-card border border-lux-border rounded-full mb-4 shadow-2xs">
            <Sparkles className="text-lux-gold" size={12} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black font-mono text-lux-forest">
              Knowledge Repository
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-lux-forest tracking-wide italic leading-normal">
            Frequently Asked <span className="not-italic text-lux-gold">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm font-normal text-lux-muted tracking-wide max-w-xl mx-auto mt-4 font-sans leading-relaxed">
            Unveiling absolute structural clarity on acquisition mechanics, verification processes, and tailored advisory routines.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className={`border transition-all duration-300 rounded-sm overflow-hidden ${
                  isOpen 
                    ? 'border-lux-forest/35 bg-lux-card shadow-md'
                    : 'border-lux-border bg-lux-card/90 hover:bg-lux-card hover:border-lux-forest/25 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-left cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono font-bold tracking-widest transition-colors duration-300 ${isOpen ? 'text-lux-gold' : 'text-lux-muted'}`}>
                      {faq.id.toUpperCase().replace('_', ' ')}
                    </span>
                    <h3 className={`text-sm md:text-base font-serif tracking-wide transition-colors duration-300 ${isOpen ? 'text-lux-forest font-semibold' : 'text-lux-charcoal group-hover:text-lux-forest'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`p-1.5 rounded-full border transition-all duration-300 ${isOpen ? 'bg-lux-forest border-lux-forest text-lux-card rotate-180' : 'border-lux-border bg-lux-ivory text-lux-forest group-hover:bg-lux-forest group-hover:text-lux-card'}`}>
                    <ChevronDown size={16} className="stroke-[2.5]" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                          height: { type: "spring", stiffness: 200, damping: 25 },
                          opacity: { duration: 0.2, delay: 0.05 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { type: "spring", stiffness: 200, damping: 25 },
                          opacity: { duration: 0.15 }
                        }
                      }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-3 text-xs md:text-sm text-lux-charcoal/90 leading-relaxed font-sans border-t border-lux-border bg-lux-ivory/40">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Advisory banner helper */}
        <div className="mt-12 p-6 md:p-8 bg-lux-card border border-lux-border shadow-sm rounded-sm flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-10 h-10 rounded-full bg-lux-ivory flex items-center justify-center border border-lux-border shrink-0">
              <MessageSquare className="text-lux-forest" size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-lux-charcoal">Have specialized allocation questions or bespoke inquiries?</p>
              <p className="text-[10px] text-lux-muted uppercase tracking-widest mt-1 font-mono">Unbiased private representation is available around the clock.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-lux-forest hover:bg-lux-forest-hover border border-lux-forest text-[10px] text-lux-card uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-sm cursor-pointer shadow-2xs"
          >
            Connect with Advisors
          </button>
        </div>
      </div>
    </section>
  );
};
