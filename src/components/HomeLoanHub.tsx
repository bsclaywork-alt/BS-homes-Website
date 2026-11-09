import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Percent, 
  Sparkles, 
  Building, 
  TrendingUp, 
  Mail, 
  MessageSquare, 
  HelpCircle,
  TrendingDown, 
  FileText, 
  BadgePercent, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Coins,
  Calculator,
  Newspaper,
  RefreshCw,
  Clock,
  Compass,
  MapPin,
  CheckCircle2,
  X,
  Send
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Enquiry } from '../types';
import { PhoneInputWithCountry, validateMobileNumber } from './PhoneInputWithCountry';
import { dispatchEnquiryEmailAlert } from '../lib/enquiryAlert';

interface BankRate {
  bankName: string;
  interestRate: { min: number; max: number };
  maxTenure: number;
  processingFee: string;
  qualification: string;
}

export interface BangaloreNewsArticle {
  id: string;
  category: 'properties' | 'developments' | 'launches' | 'loans';
  categoryLabel: string;
  badgeColor: string;
  title: string;
  summary: string;
  keyPoints: string[];
  corridor: string;
  impactTag: string;
  date: string;
  readTime: string;
}

export const HomeLoanHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'eligibility' | 'bank_wise' | 'interest_rate' | 'news'>('calculator');

  // Calculator States
  const [loanAmount, setLoanAmount] = useState<number>(10000000); // 1 Crore default
  const [interestRate, setInterestRate] = useState<number>(8.50); // 8.5% default
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years default

  // Eligibility States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(150000); // 1.5 Lakhs default
  const [existingEMIs, setExistingEMIs] = useState<number>(20000); // 20K default
  const [applicantAge, setApplicantAge] = useState<number>(32); // Default age 32

  // News State with 24-Hour Daily Auto-Refresh Logic
  const [newsFilter, setNewsFilter] = useState<'all' | 'properties' | 'developments' | 'launches' | 'loans'>('all');
  const [lastNewsRefreshDate, setLastNewsRefreshDate] = useState<string>('');
  const [isRefreshingNews, setIsRefreshingNews] = useState<boolean>(false);

  // Handlers for premium preset sliders
  const presets = [
    { label: '50 Lakhs', value: 5000000 },
    { label: '1.2 Crore', value: 12000000 },
    { label: '2.5 Crore', value: 25000000 },
    { label: '5.0 Crore', value: 50000000 },
  ];

  const agePresets = [
    { label: '25 Yrs', value: 25 },
    { label: '32 Yrs', value: 32 },
    { label: '40 Yrs', value: 40 },
    { label: '48 Yrs', value: 48 },
    { label: '55 Yrs', value: 55 },
  ];

  // Dynamic retirement & age-governed tenure limits (Indian Banking standard: max age 60)
  const retirementAge = 60;
  const retirementHorizon = Math.max(1, retirementAge - applicantAge);
  const maxEligibleTenure = Math.max(1, Math.min(30, retirementHorizon));
  const effectiveEligibilityTenure = Math.min(tenureYears, maxEligibleTenure);

  // EMI core calculation logic
  const calculateEMIValues = () => {
    const P = loanAmount;
    const r = interestRate / (12 * 100);
    const n = tenureYears * 12;

    const monthlyEMI = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalAmount = monthlyEMI * n;
    const totalInterest = totalAmount - P;

    return {
      monthlyEMI: isNaN(monthlyEMI) || !isFinite(monthlyEMI) ? 0 : monthlyEMI,
      totalAmount: isNaN(totalAmount) || !isFinite(totalAmount) ? 0 : totalAmount,
      totalInterest: isNaN(totalInterest) || !isFinite(totalInterest) ? 0 : totalInterest,
    };
  };

  const { monthlyEMI, totalAmount, totalInterest } = calculateEMIValues();

  // Tiered FOIR (Fixed Obligation to Income Ratio) standard in Indian retail home finance
  const getTieredFOIR = (income: number): number => {
    if (income < 50000) return 0.45;
    if (income < 150000) return 0.50;
    if (income < 300000) return 0.55;
    return 0.60;
  };

  // Eligibility calculation logic incorporating applicantAge, monthlyIncome & existingEMIs
  const calculateEligibility = () => {
    const FOIR = getTieredFOIR(monthlyIncome);
    const allowedTotalLiability = monthlyIncome * FOIR;
    const disposableIncomeForEMI = Math.max(0, allowedTotalLiability - existingEMIs);

    const r = interestRate / (12 * 100);
    const n = effectiveEligibilityTenure * 12;

    if (disposableIncomeForEMI <= 0 || r <= 0) {
      return {
        eligibilityAmount: 0,
        monthlyAllowedEMI: 0,
        foirLimit: allowedTotalLiability,
        foirRate: FOIR,
        propertyBudget: 0,
        effectiveTenure: effectiveEligibilityTenure,
        maxTenure: maxEligibleTenure
      };
    }

    const eligibilityAmount = disposableIncomeForEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    const propertyBudget = eligibilityAmount > 0 ? eligibilityAmount / 0.80 : 0; // 80% LTV

    return {
      eligibilityAmount: isNaN(eligibilityAmount) || !isFinite(eligibilityAmount) ? 0 : eligibilityAmount,
      monthlyAllowedEMI: disposableIncomeForEMI,
      foirLimit: allowedTotalLiability,
      foirRate: FOIR,
      propertyBudget: isNaN(propertyBudget) || !isFinite(propertyBudget) ? 0 : propertyBudget,
      effectiveTenure: effectiveEligibilityTenure,
      maxTenure: maxEligibleTenure
    };
  };

  const { 
    eligibilityAmount, 
    monthlyAllowedEMI, 
    foirLimit, 
    foirRate, 
    propertyBudget, 
    effectiveTenure 
  } = calculateEligibility();

  // Selected premier banking partners info
  const bankPartners: BankRate[] = [
    {
      bankName: "State Bank of India (SBI)",
      interestRate: { min: 8.40, max: 8.95 },
      maxTenure: 30,
      processingFee: "0.35% of Loan (Min ₹2,000, Max ₹10,000 + GST)",
      qualification: "Best-in-class rates with zero prepayment penalties."
    },
    {
      bankName: "HDFC Bank Private Limited",
      interestRate: { min: 8.50, max: 9.15 },
      maxTenure: 30,
      processingFee: "0.50% of Loan (Max ₹20,000 + GST)",
      qualification: "Instant digital processing with specialized NRI matching."
    },
    {
      bankName: "ICICI Bank Limited",
      interestRate: { min: 8.45, max: 9.10 },
      maxTenure: 30,
      processingFee: "0.50% setup fee",
      qualification: "Special lower pricing for verified premium properties."
    },
    {
      bankName: "Axis Bank Limited",
      interestRate: { min: 8.60, max: 9.25 },
      maxTenure: 30,
      processingFee: "0.40% of Loan (Under bespoke schemes)",
      qualification: "Includes dedicated support for portfolio aggregation."
    },
    {
      bankName: "LIC Housing Finance (LICHFL)",
      interestRate: { min: 8.50, max: 8.95 },
      maxTenure: 30,
      processingFee: "Fixed ₹15,000 for standard applications",
      qualification: "Low rate structure with simplified government backing."
    }
  ];

  // Latest Interest Market Factors for mid-2026
  const rateUpdates = [
    {
      metric: "RBI Repo rate Benchmark",
      value: "6.50%",
      trend: "Stable",
      textColor: "text-[#C5A059]",
      desc: "Kept stable by MCC since Q4 2025 setup, signaling rate defense parameters."
    },
    {
      metric: "Special Women Concession",
      value: "-0.05%",
      trend: "Available",
      textColor: "text-emerald-400",
      desc: "Prominent state lenders offer 5 bps reduction off normal spread profiles."
    },
    {
      metric: "Green Home Loan Rebate",
      value: "-0.10%",
      trend: "Eco-Active",
      textColor: "text-green-400",
      desc: "Eligible for platinum and gold IGBC status certified real estate arrays."
    }
  ];

  // Helper formatting INR
  const formatINR = (val: number): string => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  // 24-Hour Daily Auto-Refresh Logic for Bangalore Real Estate & Financing News
  useEffect(() => {
    const STORAGE_KEY = 'bs_homez_bangalore_news_refresh_meta';
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (now - (parsed.timestamp || 0) < ONE_DAY_MS && parsed.dateStr) {
          setLastNewsRefreshDate(parsed.dateStr);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed reading stored news refresh timestamp:', e);
    }

    // Daily auto-refresh triggered
    const freshDate = new Date();
    const formattedDate = freshDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const dateStamp = `${formattedDate} • 24h Auto-Refreshed`;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp: now,
        dateStr: dateStamp
      }));
    } catch (e) {
      console.warn('Failed storing news refresh timestamp:', e);
    }
    setLastNewsRefreshDate(dateStamp);
  }, []);

  const handleManualNewsRefresh = () => {
    setIsRefreshingNews(true);
    setTimeout(() => {
      const now = Date.now();
      const freshDate = new Date();
      const formattedDate = freshDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const dateStamp = `${formattedDate} • Refreshed at ${freshDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
      try {
        localStorage.setItem('bs_homez_bangalore_news_refresh_meta', JSON.stringify({
          timestamp: now,
          dateStr: dateStamp
        }));
      } catch (e) {}
      setLastNewsRefreshDate(dateStamp);
      setIsRefreshingNews(false);
    }, 450);
  };

  // Structured Bangalore Real Estate & Capital News Data
  const bangaloreNewsArticles: BangaloreNewsArticle[] = [
    {
      id: 'news-prop-1',
      category: 'properties',
      categoryLabel: 'Properties Across Bangalore',
      badgeColor: 'text-art-gold border-art-gold/30 bg-art-gold/10',
      title: 'Bangalore East & North Corridors Drive 14.8% YoY Luxury Capital Appreciation',
      summary: 'Grade-A gated enclaves across Whitefield, Sarjapur Road, and Hebbal outpace metro averages, backed by sustained GCC hiring and tech wealth creation.',
      keyPoints: [
        'Average capital values in Whitefield reached ₹9,800 - ₹14,500/sq.ft for premium high-rises.',
        'Rental yields in ORR corridors held resilient at 4.2% - 5.1%, highest among Tier-1 metros.',
        'Plotted developments in Hoskote & Devanahalli observed 22% annualized land value uptick.'
      ],
      corridor: 'Whitefield · Sarjapur · Hebbal · Hoskote',
      impactTag: 'High Capital Growth',
      date: 'Today · Daily Index',
      readTime: '3 min read'
    },
    {
      id: 'news-dev-1',
      category: 'developments',
      categoryLabel: 'Developments Across Bangalore',
      badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      title: 'Namma Metro Phase 2A (Silk Board to KR Puram) & Phase 2B (Airport Line) on Fast-Track',
      summary: 'Critical viaduct spans across Outer Ring Road tech parks and Hebbal airport corridors reach 85% structural readiness, driving commercial and residential demand.',
      keyPoints: [
        'Phase 2A connects Central Silk Board, Bellandur, Marathahalli, and KR Puram interchange.',
        'Phase 2B ensures seamless 38km transit from KR Puram to Kempegowda International Airport.',
        'Micro-markets within 1.5km of upcoming stations witness 18-25% price appreciation premiums.'
      ],
      corridor: 'ORR · Bellandur · Marathahalli · Airport Corridor',
      impactTag: 'Transit Infrastructure',
      date: 'Today · Daily Index',
      readTime: '4 min read'
    },
    {
      id: 'news-dev-2',
      category: 'developments',
      categoryLabel: 'Developments Across Bangalore',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      title: 'Bangalore Business Corridor (PRR) & Satellite Town Ring Road (STRR) Expansion',
      summary: '73km 8-lane expressway connecting Tumkur Road and Hosur Road via Whitefield progresses alongside the 280km STRR (NH-948A) connecting Hoskote, Doddaballapur & Anekal.',
      keyPoints: [
        'PRR directly decongests Outer Ring Road, linking East Bangalore tech corridors to North & West.',
        'STRR Phase 1 operational segments cut freight travel times by 40% between industrial hubs.',
        'Emerging plotted clusters along Hoskote-Budigere and Sarjapur-Attibele see surging builder acquisitions.'
      ],
      corridor: 'Hoskote · Varthur · Budigere Cross · Sarjapur',
      impactTag: 'Macro Connectivity',
      date: 'Today · Daily Index',
      readTime: '3 min read'
    },
    {
      id: 'news-launch-1',
      category: 'launches',
      categoryLabel: 'New Launches in Bangalore',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      title: 'Marquee High-Rise & Biophilic Township Pre-Launches Across East Bangalore',
      summary: 'Premier developers release new 20+ acre phases in Whitefield and Off Sarjapur Road featuring 80% open landscape, IGBC Platinum credentials, and luxury clubhouse suites.',
      keyPoints: [
        'Sumadhura, Godrej, Assetz, and Prestige introduce limited pre-launch allotments at 0% buyer fee.',
        'Spacious 3 BHK & 4 BHK sky residences with deck balconies dominate new inventory pipelines.',
        'Early Expression of Interest (EOI) phases offer inaugural price advantages of ₹400-600/sq.ft.'
      ],
      corridor: 'Whitefield · Varthur · Off Sarjapur Road · Gunjur',
      impactTag: 'Pre-Launch Allotments',
      date: 'Today · Daily Index',
      readTime: '2 min read'
    },
    {
      id: 'news-launch-2',
      category: 'launches',
      categoryLabel: 'New Launches in Bangalore',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      title: 'Plotted Enclaves & Luxury Villa Sanctions Surge in North Bangalore Aerotropolis',
      summary: 'RERA and BIAPA-approved gated villa plots in Bagalur, Devanahalli, and Doddaballapur achieve rapid sell-outs backed by the IT-Hardware Park and Aero SEZ.',
      keyPoints: [
        'Plot configurations from 1,200 to 4,000 sq.ft with underground cabling and water treatment.',
        'Average land ticket sizes range from ₹55 Lakhs to ₹2.2 Crores with ready bank pre-approvals.',
        'Immediate registration with A-Khata certification and clear title legal deeds.'
      ],
      corridor: 'Devanahalli · Bagalur · Yelahanka · Doddaballapur',
      impactTag: 'Plotted Townships',
      date: 'Today · Daily Index',
      readTime: '3 min read'
    },
    {
      id: 'news-loan-1',
      category: 'loans',
      categoryLabel: 'Home Loans & Financing',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      title: 'RBI Repo Rate Steady at 6.50%: Top Banks Offer Home Loans from 8.40% with Zero Processing Fee',
      summary: 'State Bank of India, HDFC Bank, ICICI Bank, and Bank of Baroda maintain competitive festive and strategic home loan interest spreads for salaried and self-employed buyers.',
      keyPoints: [
        'CIBIL scores of 750+ unlock lowest bracket lending rates starting from 8.40% to 8.55% p.a.',
        'Waivers on processing fees and zero prepayment penalties on floating home loan balances.',
        'Instant digital sanction agreements tied directly to verified Bangalore project RERA codes.'
      ],
      corridor: 'Pan-Bangalore Retail Banking',
      impactTag: 'Lowest Lending Rates',
      date: 'Today · Daily Index',
      readTime: '3 min read'
    },
    {
      id: 'news-loan-2',
      category: 'loans',
      categoryLabel: 'Home Loans & Financing',
      badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
      title: 'Green Home Loan Concessions & Real Estate Tax Deductions for FY 2026-27',
      summary: 'Borrowers investing in eco-certified projects unlock 5 to 10 bps interest rate discounts alongside tax deductions up to ₹3.5 Lakhs under Section 24(b) and 80EEA.',
      keyPoints: [
        '5-10 bps discount on prevailing card rates for IGBC/GRIHA certified residential townships.',
        'Co-borrowing between spouses enables combined annual interest tax deduction up to ₹4 Lakhs.',
        'Principal repayment benefits under Section 80C capped at ₹1.5 Lakhs per financial year.'
      ],
      corridor: 'Tax & Compliance Desk',
      impactTag: 'Fiscal Savings',
      date: 'Today · Daily Index',
      readTime: '4 min read'
    }
  ];

  const filteredNews = newsFilter === 'all' 
    ? bangaloreNewsArticles 
    : bangaloreNewsArticles.filter(art => art.category === newsFilter);

  // Inquiry Modal State (Primary, Resale, Rent, Home Loan)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<'Primary' | 'Resale' | 'Rent' | 'Home Loan'>('Home Loan');
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError(null);

    const validation = validateMobileNumber('+91', inquiryForm.phone);
    if (!validation.isValid) {
      setInquiryError(validation.message || 'Please enter a valid mobile number with the correct number of digits.');
      return;
    }

    setIsSubmittingInquiry(true);

    const mappedCategory = inquiryCategory === 'Rent' ? 'Rental' : inquiryCategory;
    const computedMetricsSummary = activeTab === 'eligibility'
      ? `Eligible Loan: ${formatINR(eligibilityAmount)}, Monthly Income: ${formatINR(monthlyIncome)}, Existing EMIs: ${formatINR(existingEMIs)}, Age: ${applicantAge} Yrs`
      : `Loan Amount: ${formatINR(loanAmount)}, Tenure: ${tenureYears} Yrs, Interest: ${interestRate}%, EMI: INR ${Math.round(monthlyEMI).toLocaleString('en-IN')}/mo`;

    const enquiryPayload: Enquiry = {
      projectId: 'home_loan_advisory',
      projectName: inquiryCategory === 'Home Loan' ? 'Home Loan & Capital Advisory' : `${inquiryCategory} Property Advisory`,
      customerName: inquiryForm.name.trim(),
      customerPhone: inquiryForm.phone.trim(),
      customerEmail: inquiryForm.email.trim() || 'advisory-lead@bshomez.com',
      enquiryCategory: mappedCategory as any,
      propertyCategory: inquiryCategory,
      message: `${inquiryForm.message ? inquiryForm.message + '\n\n' : ''}[Advisory Parameters: ${computedMetricsSummary}]`,
      type: 'Form',
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'enquiries'), enquiryPayload);

      // Dispatch real-time email alert to contact@bshomez.in
      dispatchEnquiryEmailAlert({
        customerName: enquiryPayload.customerName,
        customerPhone: enquiryPayload.customerPhone,
        customerEmail: enquiryPayload.customerEmail,
        projectName: enquiryPayload.projectName,
        enquiryCategory: enquiryPayload.enquiryCategory,
        message: enquiryPayload.message,
        type: 'Home Loan Advisory',
        source: 'Home Loan Hub'
      });

      setInquirySuccess(true);
      setTimeout(() => {
        setIsInquiryModalOpen(false);
        setInquirySuccess(false);
        setInquiryForm({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
      }, 2200);
    } catch (err: any) {
      console.warn('Enquiry fallback save:', err);
      // Fallback locally
      try {
        const localEnquiries = JSON.parse(localStorage.getItem('bs_homez_local_enquiries') || '[]');
        localEnquiries.unshift({ ...enquiryPayload, id: `local_enq_${Date.now()}`, timestamp: new Date().toISOString() });
        localStorage.setItem('bs_homez_local_enquiries', JSON.stringify(localEnquiries));
        setInquirySuccess(true);
        setTimeout(() => {
          setIsInquiryModalOpen(false);
          setInquirySuccess(false);
        }, 2200);
      } catch (localErr) {
        handleFirestoreError(err, OperationType.WRITE, 'enquiries');
        setInquiryError('Submission encountered a network delay. Please try again.');
      }
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <section id="loan-advisor" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#090909] border-t border-white/5 relative overflow-hidden">
      {/* Visual background atmospheric elements */}
      <div className="absolute top-1/3 right-1/10 w-[500px] h-[500px] bg-art-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/10 left-1/12 w-[350px] h-[350px] bg-art-gold/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-art-gold/15 border border-art-gold/25 rounded-full mb-4">
            <Coins className="text-art-gold" size={12} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black font-mono text-art-gold">
              Capital Advisory Portal
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white tracking-wide italic leading-normal">
            Bespoke <span className="not-italic text-art-gold">Capital Financing</span>
          </h2>
          <p className="text-xs sm:text-sm font-light text-white/50 tracking-wide max-w-xl mx-auto mt-4 leading-relaxed">
            Configure capital structures, calculate loan eligibility based on age and income, evaluate premier bank-wise alignments, and leverage real-time discount parameters securely.
          </p>

          {/* Core Tab Selector */}
          <div className="mt-8 sm:mt-12 flex items-center overflow-x-auto no-scrollbar w-full sm:max-w-2xl sm:flex-wrap p-1 bg-white/[0.02] border border-white/10 rounded-sm mr-auto gap-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-3 text-[9px] uppercase tracking-[0.15em] font-bold transition-all rounded-sm cursor-pointer ${
                activeTab === 'calculator' 
                  ? 'bg-art-gold text-black shadow-[0_4px_12px_rgba(197,160,89,0.25)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              Loan EMI Calculator
            </button>
            <button
              onClick={() => setActiveTab('eligibility')}
              className={`px-4 py-3 text-[9px] uppercase tracking-[0.15em] font-bold transition-all rounded-sm cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'eligibility' 
                  ? 'bg-art-gold text-black shadow-[0_4px_12px_rgba(197,160,89,0.25)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Sparkles size={11} className={activeTab === 'eligibility' ? 'text-black' : 'text-art-gold'} />
              Loan Eligibility Calculator
            </button>
            <button
              onClick={() => setActiveTab('bank_wise')}
              className={`px-4 py-3 text-[9px] uppercase tracking-[0.15em] font-bold transition-all rounded-sm cursor-pointer ${
                activeTab === 'bank_wise' 
                  ? 'bg-art-gold text-black shadow-[0_4px_12px_rgba(197,160,89,0.25)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              Bank-Wise Setup
            </button>
            <button
              onClick={() => setActiveTab('interest_rate')}
              className={`px-4 py-3 text-[9px] uppercase tracking-[0.15em] font-bold transition-all rounded-sm cursor-pointer ${
                activeTab === 'interest_rate' 
                  ? 'bg-art-gold text-black shadow-[0_4px_12px_rgba(197,160,89,0.25)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              Latest Rates
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-3 text-[9px] uppercase tracking-[0.15em] font-bold transition-all rounded-sm cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'news' 
                  ? 'bg-art-gold text-black shadow-[0_4px_12px_rgba(197,160,89,0.25)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Newspaper size={11} className={activeTab === 'news' ? 'text-black' : 'text-art-gold'} />
              News
              <span className="ml-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[7px] font-mono rounded">
                24h Auto
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Workspace Frame */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-sm self-stretch min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-art-gold/30 via-transparent to-transparent" />
            
            <AnimatePresence mode="wait">
              {activeTab === 'calculator' && (
                <motion.div
                  key="calculator-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Calculator className="text-art-gold" size={16} />
                      <h3 className="text-lg font-serif italic text-white">Dynamic Asset Structuring</h3>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Compounding Formula Driven</span>
                  </div>

                  {/* Sliders Zone */}
                  <div className="space-y-5">
                    
                    {/* Amount Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Principal Loan Amount</span>
                        <span className="text-sm font-bold text-art-gold">{formatINR(loanAmount)}</span>
                      </div>
                      <input 
                        type="range"
                        min={1000000} // 10L
                        max={100000000} // 10 Cr
                        step={500000} // 5L
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-sm accent-art-gold cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-white/20 font-mono">
                        <span>{formatINR(1000000)}</span>
                        <span>{formatINR(100000000)}</span>
                      </div>

                      {/* Preset Buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {presets.map((preset) => (
                          <button
                            key={preset.value}
                            onClick={() => setLoanAmount(preset.value)}
                            className={`px-3 py-1 text-[8.5px] uppercase tracking-wider font-mono border rounded-sm transition-all cursor-pointer ${
                              loanAmount === preset.value
                                ? 'bg-art-gold/15 border-art-gold text-art-gold'
                                : 'border-white/5 bg-white/[0.01] text-white/40 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Expected Annual Interest</span>
                        <span className="text-sm font-bold text-white tracking-wide">{interestRate}% YoY</span>
                      </div>
                      <input 
                        type="range"
                        min={7.00}
                        max={15.00}
                        step={0.05}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-sm accent-art-gold cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-white/20 font-mono">
                        <span>7.00% Premium Core</span>
                        <span>15.00% High Risk</span>
                      </div>
                    </div>

                    {/* Tenure */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Amortization Tenure</span>
                        <span className="text-sm font-bold text-white tracking-wide">{tenureYears} Years</span>
                      </div>
                      <input 
                        type="range"
                        min={5}
                        max={30}
                        step={1}
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-sm accent-art-gold cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-white/20 font-mono">
                        <span>5 Years</span>
                        <span>30 Years Limit</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeTab === 'eligibility' && (
                <motion.div
                  key="eligibility-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-art-gold" size={16} />
                      <h3 className="text-lg font-serif italic text-white flex gap-1.5 items-center">
                        Loan Eligibility Calculator
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-art-gold/15 text-art-gold border border-art-gold/30 rounded text-[8px] font-mono uppercase tracking-widest font-black">
                        Tiered FOIR ({Math.round(foirRate * 100)}%)
                      </span>
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Age-Indexed</span>
                    </div>
                  </div>

                  {/* Inputs Zone */}
                  <div className="space-y-5">
                    
                    {/* Monthly Income Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold block">1. Monthly Net In-Hand Income</span>
                          <span className="text-[8px] text-white/30 font-mono">Salary or Business Net Profit after Tax</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={20000}
                            max={5000000}
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                            className="bg-white/[0.04] border border-white/15 text-art-gold font-mono text-xs rounded-sm p-1.5 w-28 text-right outline-none focus:border-art-gold"
                          />
                          <span className="text-xs text-white/60 font-mono">INR</span>
                        </div>
                      </div>
                      <input 
                        type="range"
                        min={20000}
                        max={1000000}
                        step={10000}
                        value={monthlyIncome > 1000000 ? 1000000 : monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-sm accent-art-gold cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-white/20 font-mono">
                        <span>₹20,000 / mo</span>
                        <span>₹10,00,000 / mo</span>
                      </div>
                      {/* Income quick preset pills */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {[
                          { label: '₹75K/mo', val: 75000 },
                          { label: '₹1.5 Lakh/mo', val: 150000 },
                          { label: '₹2.5 Lakh/mo', val: 250000 },
                          { label: '₹5.0 Lakh/mo', val: 500000 }
                        ].map(pill => (
                          <button
                            key={pill.val}
                            type="button"
                            onClick={() => setMonthlyIncome(pill.val)}
                            className={`px-2.5 py-1 text-[8px] font-mono uppercase tracking-wider border rounded-sm transition-all cursor-pointer ${
                              monthlyIncome === pill.val 
                                ? 'bg-art-gold/20 border-art-gold text-art-gold' 
                                : 'border-white/10 bg-white/[0.01] text-white/40 hover:text-white'
                            }`}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Existing Monthly EMIs Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold block">2. Existing Monthly EMIs / Liabilities</span>
                          <span className="text-[8px] text-white/30 font-mono">Personal loans, car EMIs, active cards</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            max={2000000}
                            value={existingEMIs}
                            onChange={(e) => setExistingEMIs(Math.max(0, Number(e.target.value)))}
                            className="bg-white/[0.04] border border-white/15 text-white font-mono text-xs rounded-sm p-1.5 w-28 text-right outline-none focus:border-art-gold"
                          />
                          <span className="text-xs text-white/60 font-mono">INR</span>
                        </div>
                      </div>
                      <input 
                        type="range"
                        min={0}
                        max={500000}
                        step={5000}
                        value={existingEMIs > 500000 ? 500000 : existingEMIs}
                        onChange={(e) => setExistingEMIs(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-sm accent-art-gold cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-white/20 font-mono">
                        <span>₹0 (Nil Liabilities)</span>
                        <span>₹5,00,000 / mo</span>
                      </div>
                      {/* EMI presets */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {[
                          { label: 'Nil (₹0)', val: 0 },
                          { label: '₹15,000', val: 15000 },
                          { label: '₹30,000', val: 30000 },
                          { label: '₹60,000', val: 60000 }
                        ].map(pill => (
                          <button
                            key={pill.val}
                            type="button"
                            onClick={() => setExistingEMIs(pill.val)}
                            className={`px-2.5 py-1 text-[8px] font-mono uppercase tracking-wider border rounded-sm transition-all cursor-pointer ${
                              existingEMIs === pill.val 
                                ? 'bg-art-gold/20 border-art-gold text-art-gold' 
                                : 'border-white/10 bg-white/[0.01] text-white/40 hover:text-white'
                            }`}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>

                      {/* Real-Time Compact Visual Progress Bar for Loan-to-Value (LTV) Eligibility */}
                      {(() => {
                        const foirBurdenPct = monthlyIncome > 0 ? Math.min(100, Math.round((existingEMIs / monthlyIncome) * 100)) : 0;
                        const maxAllowableLtv = propertyBudget > 7500000 ? 75 : propertyBudget > 3000000 ? 80 : 85;
                        const realTimeLtvEligibility = Math.max(15, Math.min(maxAllowableLtv, Math.round(maxAllowableLtv * (1 - (foirBurdenPct / 100) * 0.75))));
                        const isPrime = realTimeLtvEligibility >= 70;
                        const isModerate = realTimeLtvEligibility >= 45 && realTimeLtvEligibility < 70;

                        return (
                          <div className="p-3.5 bg-black/60 border border-art-gold/30 rounded-sm space-y-2 mt-3 shadow-inner">
                            <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                              <span className="text-white/80 font-bold flex items-center gap-1.5">
                                <Sparkles size={11} className="text-art-gold" />
                                Real-Time LTV (Loan-to-Value) Eligibility
                              </span>
                              <span className={`font-mono font-black px-2 py-0.5 rounded text-[10px] ${
                                isPrime 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : isModerate 
                                  ? 'bg-art-gold/20 text-art-gold border border-art-gold/30' 
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {realTimeLtvEligibility}% LTV Eligible
                              </span>
                            </div>

                            {/* Visual Progress Bar */}
                            <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 rounded-full ${
                                  isPrime 
                                    ? 'bg-gradient-to-r from-art-gold via-emerald-400 to-emerald-500' 
                                    : isModerate 
                                    ? 'bg-gradient-to-r from-amber-500 to-art-gold' 
                                    : 'bg-gradient-to-r from-red-500 to-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, (realTimeLtvEligibility / 85) * 100)}%` }}
                              />
                            </div>

                            {/* Dynamic Indicator Meta */}
                            <div className="flex justify-between items-center text-[8px] font-mono text-white/50 pt-0.5">
                              <span>Existing EMI Burden: <strong className={foirBurdenPct > 50 ? 'text-amber-400' : 'text-white'}>{foirBurdenPct}%</strong></span>
                              <span className="text-right text-art-gold font-bold">
                                {isPrime 
                                  ? '✓ Tier-1 Bank Clearance (Max Property Funding)' 
                                  : isModerate 
                                  ? '⚡ Standard Sanction (Moderate Margin Money)' 
                                  : '⚠ Restricted LTV (Co-borrower Recommended)'}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Applicant Age Input & Real-Time Tenure Cap */}
                    <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-sm">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-art-gold font-bold block flex items-center gap-1.5">
                            <Coins size={12} /> 3. Applicant Age (Years)
                          </span>
                          <span className="text-[8px] text-white/40 font-mono">
                            Determines maximum loan tenure until retirement (Age 60)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={21}
                            max={58}
                            value={applicantAge}
                            onChange={(e) => {
                              const age = Math.min(58, Math.max(21, Number(e.target.value)));
                              setApplicantAge(age);
                              const maxT = Math.max(1, Math.min(30, 60 - age));
                              if (tenureYears > maxT) {
                                setTenureYears(maxT);
                              }
                            }}
                            className="bg-black/60 border border-art-gold/40 text-art-gold font-mono text-sm rounded-sm p-1.5 w-20 text-right outline-none focus:border-art-gold font-bold"
                          />
                          <span className="text-xs text-white/70 font-mono">Yrs</span>
                        </div>
                      </div>
                      <input 
                        type="range"
                        min={21}
                        max={58}
                        step={1}
                        value={applicantAge}
                        onChange={(e) => {
                          const age = Number(e.target.value);
                          setApplicantAge(age);
                          const maxT = Math.max(1, Math.min(30, 60 - age));
                          if (tenureYears > maxT) {
                            setTenureYears(maxT);
                          }
                        }}
                        className="w-full h-1 bg-white/10 rounded-sm accent-art-gold cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-white/30 font-mono">
                        <span>21 Yrs (Entry Level)</span>
                        <span>58 Yrs (Pre-Retirement Limit)</span>
                      </div>

                      {/* Age Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {agePresets.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => {
                              setApplicantAge(preset.value);
                              const maxT = Math.max(1, Math.min(30, 60 - preset.value));
                              if (tenureYears > maxT) {
                                setTenureYears(maxT);
                              }
                            }}
                            className={`px-2.5 py-1 text-[8.5px] font-mono uppercase tracking-wider border rounded-sm transition-all cursor-pointer ${
                              applicantAge === preset.value
                                ? 'bg-art-gold/25 border-art-gold text-art-gold font-bold'
                                : 'border-white/10 bg-white/[0.01] text-white/40 hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Dynamic Age-Based Horizon Insight Banner */}
                      <div className="mt-2 p-2.5 bg-black/40 border border-art-gold/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[9px] font-mono">
                        <div className="flex items-center gap-2 text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Retirement Horizon: <strong className="text-white">{retirementHorizon} Years</strong></span>
                        </div>
                        <div className="text-art-gold font-bold">
                          Max Eligible Bank Tenure: <span>{maxEligibleTenure} Years ({maxEligibleTenure * 12} EMIs)</span>
                        </div>
                      </div>
                    </div>

                    {/* Interest Rate & Adjusted Tenure */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      {/* Interest Rate */}
                      <div className="space-y-1.5">
                        <span className="text-[8.5px] uppercase tracking-wider text-white/40 font-bold">Interest Rate (% YoY)</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            step="0.05"
                            min="6.5"
                            max="15.0"
                            value={interestRate} 
                            onChange={(e) => setInterestRate(Number(e.target.value))} 
                            className="bg-white/[0.04] border border-white/15 text-white font-mono text-xs rounded-sm p-2 w-24 outline-none focus:border-art-gold"
                          />
                          <span className="text-xs text-white/60 font-mono">% p.a.</span>
                        </div>
                        <span className="text-[7.5px] text-white/30 font-mono block">SBI / HDFC benchmark: 8.50%</span>
                      </div>

                      {/* Tenure Clamped to maxEligibleTenure */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] uppercase tracking-wider text-white/40 font-bold">Applied Tenure</span>
                          <span className="text-[8px] text-art-gold font-mono">Max {maxEligibleTenure} Yrs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            min="1"
                            max={maxEligibleTenure}
                            value={effectiveEligibilityTenure} 
                            onChange={(e) => {
                              const val = Math.max(1, Math.min(maxEligibleTenure, Number(e.target.value)));
                              setTenureYears(val);
                            }} 
                            className="bg-white/[0.04] border border-white/15 text-white font-mono text-xs rounded-sm p-2 w-24 outline-none focus:border-art-gold"
                          />
                          <span className="text-xs text-white/60 font-mono">Years</span>
                        </div>
                        <span className="text-[7.5px] text-white/30 font-mono block">Auto-adjusted for age {applicantAge}</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeTab === 'bank_wise' && (
                <motion.div
                  key="bank_wise-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Building className="text-art-gold" size={16} />
                      <h3 className="text-lg font-serif italic text-white flex gap-1.5 items-center">
                        Institution Offer Alignment (Indicative)
                      </h3>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Q2 2026 Indexed</span>
                  </div>

                  <p className="text-[11px] text-white/50 leading-relaxed font-sans mt-2">
                    Below is your customized monthly outlay across major regional and national lending partners, based on your current principal setup of <span className="text-art-gold font-bold">{formatINR(loanAmount)}</span> for <span className="text-white font-semibold">{tenureYears} years</span>:
                  </p>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {bankPartners.map((bank) => {
                      // Custom calculation for each bank's min rate
                      const minR = bank.interestRate.min / (12 * 100);
                      const n = tenureYears * 12;
                      const customEMI = loanAmount * minR * Math.pow(1 + minR, n) / (Math.pow(1 + minR, n) - 1);
                      const displayEMI = isNaN(customEMI) || !isFinite(customEMI) ? 0 : customEMI;
                      
                      return (
                        <div 
                          key={bank.bankName}
                          className="p-4 bg-white/[0.01] border border-white/5 hover:border-art-gold/35 rounded-sm transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                        >
                          <div>
                            <h4 className="text-xs font-serif font-bold text-white tracking-wide group-hover:text-art-gold transition-colors">
                              {bank.bankName}
                            </h4>
                            <p className="text-[9.5px] text-white/40 mt-1 font-mono uppercase tracking-wider">
                              Range: {bank.interestRate.min}% - {bank.interestRate.max}% | Setup: {bank.processingFee}
                            </p>
                          </div>
                          
                          <div className="text-left md:text-right shrink-0">
                            <span className="text-[8px] uppercase tracking-widest text-white/30 block mb-0.5">Est. Monthly Base</span>
                            <span className="text-xs font-black text-white group-hover:text-art-gold transition-colors">
                              ₹{Math.round(displayEMI).toLocaleString('en-IN')}/mo
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'interest_rate' && (
                <motion.div
                  key="interest_rate-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-art-gold" size={16} />
                      <h3 className="text-lg font-serif italic text-white">Latest Strategic Interest Index</h3>
                    </div>
                    <span className="text-[8px] font-mono text-[#C5A059] uppercase tracking-widest">Live Updates Verified</span>
                  </div>

                  <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                    National real estate indexing indicates defensive consolidation in luxury microgrids. Explore prevailing sub-discount matrices active this month:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rateUpdates.map((item) => (
                      <div 
                        key={item.metric}
                        className="p-4 bg-white/[0.01] border border-white/5 rounded-sm flex flex-col justify-between h-36"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[8.5px] font-mono uppercase text-white/30 tracking-wider">
                              {item.trend}
                            </span>
                            <Sparkles size={10} className="text-art-gold/50" />
                          </div>
                          <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-white">
                            {item.metric}
                          </h4>
                        </div>
                        
                        <div>
                          <p className={`text-xl font-serif italic font-bold my-1 ${item.textColor}`}>
                            {item.value}
                          </p>
                          <p className="text-[9.5px] text-white/40 leading-snug font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Real estate advice note */}
                  <div className="p-4 bg-art-gold/5 border border-art-gold/15 rounded-sm flex items-center gap-3">
                    <ShieldCheck className="text-art-gold shrink-0" size={16} />
                    <p className="text-[10px] text-white/70 leading-relaxed">
                      <strong>Institution Clause:</strong> External approvals are contingent upon verified CIBIL rating profiles (preferrably 750+) and institutional underwriting checks of individual landmark builders.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'news' && (
                <motion.div
                  key="news-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow"
                >
                  {/* News Header & Auto-Refresh Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Newspaper className="text-art-gold shrink-0" size={18} />
                      <div>
                        <h3 className="text-lg font-serif italic text-white">Bangalore Real Estate &amp; Capital News</h3>
                        <p className="text-[10.5px] text-white/50 font-sans">
                          Market trends, infrastructure progress, luxury pre-launches &amp; retail home loan policies.
                        </p>
                      </div>
                    </div>
                    
                    {/* 24-Hour Auto-Refresh Badge & Manual Refresh Button */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm">
                        <Clock size={11} className="text-emerald-400 shrink-0" />
                        <span className="text-[9px] font-mono text-emerald-300 font-bold tracking-wider">
                          {lastNewsRefreshDate || 'Daily 24h Auto-Refreshed'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleManualNewsRefresh}
                        disabled={isRefreshingNews}
                        title="Trigger instantaneous real-time sync across Bangalore desks"
                        className="p-1.5 bg-white/5 hover:bg-art-gold hover:text-black text-art-gold border border-art-gold/30 rounded-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={12} className={isRefreshingNews ? "animate-spin" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Category Sub-Filters */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'All Intelligence' },
                      { id: 'properties', label: 'Properties Across Bangalore' },
                      { id: 'developments', label: 'Developments Across Bangalore' },
                      { id: 'launches', label: 'New Launches' },
                      { id: 'loans', label: 'Home Loans & Financing' },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setNewsFilter(sub.id as any)}
                        className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-mono font-bold rounded-sm border transition-all cursor-pointer ${
                          newsFilter === sub.id
                            ? 'bg-art-gold text-black border-art-gold shadow-[0_0_12px_rgba(197,160,89,0.3)]'
                            : 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {/* Articles Scrollable Feed */}
                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {filteredNews.map((article) => (
                      <div
                        key={article.id}
                        className="p-4 sm:p-5 bg-white/[0.015] border border-white/5 hover:border-art-gold/35 rounded-sm transition-all duration-300 flex flex-col justify-between group space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 text-[8.5px] uppercase tracking-wider font-mono font-bold border rounded-sm ${article.badgeColor}`}>
                              {article.categoryLabel}
                            </span>
                            <span className="text-[9px] font-mono text-art-gold/90 font-bold px-2 py-0.5 bg-art-gold/10 border border-art-gold/20 rounded-sm">
                              {article.impactTag}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-mono text-white/40">
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm sm:text-base font-serif italic font-bold text-white group-hover:text-art-gold transition-colors leading-snug">
                            {article.title}
                          </h4>
                          <p className="text-xs text-white/70 leading-relaxed font-sans mt-1.5">
                            {article.summary}
                          </p>
                        </div>

                        {/* Key Insights bullets */}
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm space-y-1.5">
                          <span className="text-[8px] uppercase tracking-widest font-mono text-art-gold/80 font-black block">
                            Market Intelligence Takeaways
                          </span>
                          <ul className="space-y-1">
                            {article.keyPoints.map((pt, idx) => (
                              <li key={idx} className="text-[10.5px] text-white/75 flex items-start gap-1.5">
                                <span className="text-art-gold shrink-0 mt-0.5">▸</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[9px]">
                          <span className="text-white/45 font-mono flex items-center gap-1">
                            <MapPin size={10} className="text-art-gold" />
                            {article.corridor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Summary Sidebar Dashboard */}
          <div className="lg:col-span-4 bg-gradient-to-b from-white/[0.03] to-[#0A0A0A] border border-white/5 rounded-sm p-6 relative overflow-hidden flex flex-col justify-between self-stretch min-h-[460px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-art-gold/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Upper Metric Hub */}
            <div className="space-y-6">
              {activeTab === 'news' ? (
                <>
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.3em] font-mono text-art-gold">Bangalore Market Pulse</span>
                    <h4 className="text-xl font-serif text-white italic mt-1 font-bold">Intelligence Digest</h4>
                    <p className="text-[10px] text-white/50 font-sans mt-1">
                      Consolidated 24-hour market feed across high-growth corridors.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] uppercase tracking-wider text-white/40">Feed Refresh Cycle</span>
                        <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          24h Daily Auto-Sync
                        </span>
                      </div>
                      <p className="text-xs font-mono text-white/90">
                        {lastNewsRefreshDate || 'Daily 24h Auto-Refreshed'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Luxury Price Growth</span>
                        <span className="text-sm font-bold text-art-gold font-serif italic mt-0.5 block">+14.8% YoY</span>
                        <span className="text-[7px] text-white/30 font-mono">East &amp; North Corridor</span>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Lowest Home Loan Rate</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">8.40% p.a.</span>
                        <span className="text-[7px] text-white/30 font-mono">Zero Processing Fee</span>
                      </div>
                    </div>

                    <div className="p-3 bg-art-gold/[0.05] border border-art-gold/20 rounded-sm">
                      <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-art-gold block mb-1">
                        Key Infrastructure Catalyst
                      </span>
                      <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                        Namma Metro Phase 2A/2B and PRR expressway are catalyzing commercial absorption and 18-25% residential capital gains.
                      </p>
                    </div>
                  </div>
                </>
              ) : activeTab === 'eligibility' ? (
                <>
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.3em] font-mono text-art-gold">Credit Evaluation Suite</span>
                    <h4 className="text-xl font-serif text-white italic mt-1 font-bold">Eligibility Profile</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="pb-3 border-b border-white/5">
                      <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold block">Maximum Loan Eligibility</span>
                      <div className="text-2xl font-serif italic text-art-gold font-bold tracking-tight mt-1">
                        {formatINR(eligibilityAmount)}
                        <span className="text-[11px] font-sans not-italic text-white/40 font-light ml-1"> estimated sanction*</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Property Buying Budget</span>
                        <span className="text-sm font-bold text-white font-serif italic mt-0.5 block">{formatINR(propertyBudget)}*</span>
                        <span className="text-[7px] text-white/30 font-mono">80% Loan + 20% Down</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Max Allowed EMI</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                          ₹{Math.round(monthlyAllowedEMI).toLocaleString('en-IN')}/mo
                        </span>
                        <span className="text-[7px] text-white/30 font-mono">{Math.round(foirRate * 100)}% FOIR Tier</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Applicant Age & Tenure</span>
                        <span className="text-xs font-semibold text-white/90 font-mono mt-0.5 block">
                          {applicantAge} Yrs • {effectiveTenure} Yrs Tenure
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Existing Liabilities</span>
                        <span className="text-xs font-semibold text-white/60 font-mono mt-0.5 block">{formatINR(existingEMIs)}</span>
                      </div>
                    </div>

                    {/* Progress Visual Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase">
                        <span>Liabilities: {Math.min(100, Math.round((existingEMIs / foirLimit) * 100 || 0))}%</span>
                        <span>Loan Capacity: {Math.max(0, 100 - Math.round((existingEMIs / foirLimit) * 100 || 0))}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden flex">
                        <div 
                          style={{ width: `${Math.min(100, (existingEMIs / foirLimit) * 100 || 0)}%` }} 
                          className="h-full bg-white/20 transition-all duration-500" 
                        />
                        <div 
                          style={{ width: `${Math.max(0, 100 - (existingEMIs / foirLimit) * 100 || 0)}%` }} 
                          className="h-full bg-art-gold transition-all duration-500" 
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.3em] font-mono text-art-gold">Amortization Estimates</span>
                    <h4 className="text-xl font-serif text-white italic mt-1 font-bold">Repayment Layout</h4>
                  </div>

                  {/* Layout numbers */}
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-white/5">
                      <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold block">Monthly EMI Outlay</span>
                      <div className="text-2xl font-serif italic text-white font-bold tracking-tight mt-1">
                        ₹{Math.round(monthlyEMI).toLocaleString('en-IN')}
                        <span className="text-[11px] font-sans not-italic text-white/40 font-light ml-1">/ month</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Principal Amount</span>
                        <span className="text-xs font-semibold text-white/90 font-sans mt-0.5 block">{formatINR(loanAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block">Interest Payable</span>
                        <span className="text-xs font-semibold text-art-gold font-sans mt-0.5 block">{formatINR(totalInterest)}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-white/40 uppercase tracking-wider block">Total Estimated Outlay</span>
                      <span className="text-sm font-bold text-white font-serif italic mt-0.5 block">{formatINR(totalAmount)}</span>
                    </div>

                    {/* Progress Visual Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase">
                        <span>Principal: {Math.round((loanAmount / totalAmount) * 100 || 0)}%</span>
                        <span>Interest: {Math.round((totalInterest / totalAmount) * 100 || 0)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden flex">
                        <div 
                          style={{ width: `${(loanAmount / totalAmount) * 100 || 0}%` }} 
                          className="h-full bg-white/40 transition-all duration-500" 
                        />
                        <div 
                          style={{ width: `${(totalInterest / totalAmount) * 100 || 0}%` }} 
                          className="h-full bg-art-gold transition-all duration-500" 
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Contact buttons group at bottom */}
            <div className="space-y-4 mt-8 pt-6 border-t border-white/5 text-center flex flex-col items-center justify-center">
              <div className="max-w-xs mx-auto text-center">
                <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-art-gold block mb-2">More Information</span>
                <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                  Connect instantaneously with our premier relationship advisors for bespoke loan profiling and zero-fee bank alignment templates.
                </p>
              </div>

              {/* High Affinity Touch Actions */}
              <div className="flex flex-col gap-2.5 w-full max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="flex items-center justify-center gap-2.5 w-full h-11 bg-art-gold hover:bg-white text-black text-[10px] uppercase tracking-[0.2em] font-extrabold rounded-sm transition-all shadow-[0_4px_15px_rgba(197,160,89,0.2)] outline-none cursor-pointer"
                >
                  <FileText size={13} className="shrink-0" />
                  Submit Inquiry Form
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Interactive Integrated Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInquiryModalOpen(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#101010] w-full max-w-xl border-2 border-white rounded-md shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] my-auto z-20"
            >
              <button 
                type="button"
                onClick={() => setIsInquiryModalOpen(false)} 
                className="absolute top-5 right-5 p-2 hover:bg-white/10 transition-colors text-white/50 hover:text-white rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>

              {inquirySuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-art-gold/15 border border-art-gold/30 rounded-full flex items-center justify-center mx-auto text-art-gold">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-serif text-white italic">Inquiry Successfully Transmitted</h3>
                  <p className="text-xs text-white/60 tracking-wider">
                    Our verified Relationship Manager for <strong className="text-art-gold">{inquiryCategory}</strong> will connect with you directly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-5 text-left">
                  <div className="border-b border-white/10 pb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-art-gold/15 border border-art-gold/30 rounded-full mb-2">
                      <Sparkles size={10} className="text-art-gold" />
                      <span className="text-[8px] font-mono uppercase tracking-widest text-art-gold font-bold">Priority Advisory Desk</span>
                    </div>
                    <h3 className="text-2xl font-serif italic text-white">Direct Intelligence &amp; Advisory</h3>
                    <p className="text-[11px] text-white/50 mt-1">Select your property or loan inquiry category below to connect with a senior advisor.</p>
                  </div>

                  {/* Category Option Selector: Primary, Resale, Rent, Home Loan */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-art-gold block">
                      Select Inquiry Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['Primary', 'Resale', 'Rent', 'Home Loan'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setInquiryCategory(cat)}
                          className={`py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider rounded-sm border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            inquiryCategory === cat
                              ? 'bg-art-gold text-black border-art-gold shadow-md font-black'
                              : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <span>{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-white/50 block">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="w-full bg-white/5 border border-white/15 rounded-sm p-3 text-white text-xs outline-none focus:border-art-gold transition-all"
                      />
                    </div>
                    <PhoneInputWithCountry
                      label="Phone / Mobile Number"
                      value={inquiryForm.phone}
                      onChange={(fullNumber) => setInquiryForm({ ...inquiryForm, phone: fullNumber })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-white/50 block">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/15 rounded-sm p-3 text-white text-xs outline-none focus:border-art-gold transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-white/50 block">
                      Specific Inquiries &amp; Capital Requirement
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder={`Provide any specific property preferences or financing details for ${inquiryCategory}...`}
                      className="w-full bg-white/5 border border-white/15 rounded-sm p-3 text-white text-xs outline-none focus:border-art-gold transition-all resize-none"
                    />
                  </div>

                  {inquiryError && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded text-[10px] text-red-400 font-mono">
                      {inquiryError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingInquiry}
                      className="flex-1 bg-art-gold hover:bg-white text-black py-3.5 px-4 text-xs font-black uppercase tracking-widest rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send size={13} />
                      {isSubmittingInquiry ? 'Transmitting...' : `Submit ${inquiryCategory} Inquiry`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(false)}
                      className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white/60 border border-white/15 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
