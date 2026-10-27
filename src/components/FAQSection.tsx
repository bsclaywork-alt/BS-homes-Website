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
    <section id="faq" className="py-24 md:py-32 px-6 md:px-12 bg-art-dark relative overflow-hidden border-t border-white/5">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-art-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-art-gold/3 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-art-gold/10 border border-art-gold/25 rounded-full mb-4">
            <Sparkles className="text-art-gold" size={12} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black font-mono text-art-gold">
              Knowledge Repository
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif text-white tracking-wide italic leading-normal">
            Frequently Asked <span className="not-italic text-art-gold">Questions</span>
          </h2>
          <p className="text-sm font-light text-white/50 tracking-wide max-w-xl mx-auto mt-4 font-sans leading-relaxed">
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
                    ? 'border-art-gold/40 bg-gradient-to-r from-white/[0.03] to-white/[0.01]' 
                    : 'border-white/[0.08] bg-gradient-to-r from-white/[0.01] to-transparent hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex justify-between items-center px-6 md:px-8 py-5 md:py-6 text-left cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono font-bold tracking-widest transition-colors duration-300 ${isOpen ? 'text-art-gold' : 'text-white/30'}`}>
                      {faq.id.toUpperCase().replace('_', ' ')}
                    </span>
                    <h3 className={`text-sm md:text-base font-serif tracking-wide transition-colors duration-300 ${isOpen ? 'text-art-gold' : 'text-white/90 group-hover:text-white'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`p-1.5 rounded-full border transition-all duration-300 ${isOpen ? 'bg-art-gold border-art-gold text-black rotate-180' : 'border-white/10 text-white/50 group-hover:text-white'}`}>
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
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-1 text-xs md:text-sm text-white/70 leading-relaxed font-sans border-t border-white/[0.04]">
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
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-art-gold/[0.03] to-white/[0.01] border border-art-gold/15 rounded-sm flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-10 h-10 rounded-full bg-art-gold/10 flex items-center justify-center border border-art-gold/20 shrink-0">
              <MessageSquare className="text-art-gold" size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Have specialized allocation questions or bespoke inquiries?</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-mono">Unbiased private representation is available around the clock.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 border border-art-gold/45 text-[10px] text-art-gold uppercase tracking-[0.2em] font-bold hover:bg-art-gold hover:text-black transition-all duration-300 rounded-sm cursor-pointer"
          >
            Connect with Advisors
          </button>
        </div>
      </div>
    </section>
  );
};
