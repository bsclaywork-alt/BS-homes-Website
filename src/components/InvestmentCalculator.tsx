import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  TrendingUp, 
  Info, 
  HelpCircle, 
  Percent, 
  Sparkles, 
  Plus, 
  ChevronRight,
  Calculator,
  ArrowUpRight
} from 'lucide-react';
import { Project } from '../types';

interface InvestmentCalculatorProps {
  project: Project;
  onClose: () => void;
}

// Map project zones to historical YoY growth rates from MarketInsights
const zoneGrowthRates: Record<string, number> = {
  'Bangalore East': 12,   // East Bangalore growth is 12%
  'Bangalore North': 18,  // North Corridor growth is 18%
  'Bangalore South': 8,   // South Hub growth is 8%
  'Bangalore Central': 5, // Central Core growth is 5%
  'Bangalore West': 10,   // Default/West fallback
  'All Zone': 14,         // General average
};

// Formatting helpers
const formatINRCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Helper to parse price string to dynamic numbers
const parsePriceToNumbers = (priceStr: string): { min: number; max: number; average: number } => {
  const str = priceStr.toLowerCase();
  
  // Clean up currency symbols and extra whitespace
  const cleanStr = str.replace(/rs\.?/gi, '').replace(/,/g, '').trim();
  
  // Extract all numbers (e.g. integer or decimal)
  const numbers = cleanStr.match(/(\d+(?:\.\d+)?)/g);
  
  if (!numbers || numbers.length === 0) {
    // Default fallback: 1.5 Cr (15,000,000)
    return { min: 15000000, max: 15000000, average: 15000000 };
  }
  
  const parseValWithUnit = (valStr: string): number => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return 15000000;
    if (str.includes('cr')) {
      return val * 10000000; // 1 Crore = 10,000,000
    } else if (str.includes('lakh')) {
      return val * 100000; // 1 Lakh = 100,000
    }
    // Assume Crores if value is very low (e.g. "1.5"), otherwise Lakhs/Rupees
    if (val < 100) return val * 10000000;
    return val;
  };

  if (numbers.length >= 2) {
    const min = parseValWithUnit(numbers[0]);
    const max = parseValWithUnit(numbers[1]);
    return { min, max, average: (min + max) / 2 };
  } else {
    const val = parseValWithUnit(numbers[0]);
    return { min: val, max: val, average: val };
  }
};

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ project, onClose }) => {
  // Extract primary pricing
  const pricingData = parsePriceToNumbers(project.price);
  
  // Baseline YoY trends based on location
  const baselineRate = zoneGrowthRates[project.zone] || 12; // fallback to 12% if unknown

  // Initialize interactive states
  const [initialInvestment, setInitialInvestment] = useState<number>(pricingData.average);
  const [yoyGrowth, setYoyGrowth] = useState<number>(baselineRate);
  const [horizonYears, setHorizonYears] = useState<number>(5);

  // Re-calculate average if project updates
  useEffect(() => {
    const results = parsePriceToNumbers(project.price);
    setInitialInvestment(results.average);
    setYoyGrowth(zoneGrowthRates[project.zone] || 12);
  }, [project]);

  // Calculations
  const finalValue = initialInvestment * Math.pow(1 + yoyGrowth / 100, horizonYears);
  const totalGain = finalValue - initialInvestment;
  const yieldMultiplier = finalValue / initialInvestment;

  // Yearly compounding projections data
  const yearlyProjections = Array.from({ length: horizonYears + 1 }).map((_, yearIndex) => {
    const value = initialInvestment * Math.pow(1 + yoyGrowth / 100, yearIndex);
    return {
      yearIndex,
      value,
    };
  });

  // Calculate recommendation profile
  const getAdvisoryProfile = () => {
    if (yoyGrowth >= 15) {
      return {
        label: "Aggressive Growth Corridor",
        description: `This corridor (${project.zone}) outperforms index averages, fueled by persistent corporate expansions and infra development.`,
        badgeColor: "bg-art-gold/10 text-art-gold border-art-gold/30"
      };
    } else if (yoyGrowth >= 10) {
      return {
        label: "Stable High-Yield Compounder",
        description: `Characterized by premium microgrid demand in ${project.location}, this asset boasts powerful defensive compounding.`,
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      };
    } else {
      return {
        label: "Preservation & Yield Compound",
        description: "Focus on capital preservation with defensive dividends and premium lifestyle valuation in the regional center.",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      };
    }
  };

  const profile = getAdvisoryProfile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute inset-0 bg-[#090909]/98 backdrop-blur-lg z-40 flex flex-col p-6 md:p-8 border border-art-gold/30 overflow-y-auto select-none"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-art-gold/10 flex items-center justify-center border border-art-gold/25">
            <Calculator className="text-art-gold" size={14} />
          </div>
          <div>
            <h4 className="text-sm font-serif italic text-white font-bold">Appreciation Modeler</h4>
            <span className="text-[8px] text-white/50 uppercase tracking-[0.2em] font-mono block">
              Direct Historical YoY Projection Index
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-3 py-1.5 rounded-full bg-white text-black hover:bg-art-gold font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all cursor-pointer z-50 border border-white"
          aria-label="Close Calculator"
          title="Close (Esc)"
        >
          <X size={14} className="stroke-[3]" />
          <span className="font-mono text-[10px]">CLOSE</span>
        </button>
      </div>

      <div className="flex-grow space-y-6">
        <div>
          <span className="text-art-gold text-[8px] uppercase tracking-[0.3em] font-black font-mono">Location Trends Link</span>
          <p className="text-[10px] text-white/70 leading-relaxed mt-1 font-mono uppercase">
            {project.zone} baseline growth is indexed at <span className="text-art-gold font-bold font-sans">{baselineRate}% YoY</span>
          </p>
        </div>

        {/* Inputs section */}
        <div className="space-y-4 bg-white/[0.02] border border-white/5 p-4 rounded-sm">
          {/* Initial Value Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-white/40">Initial Value Setup</span>
              <span className="text-art-gold">{formatINRCurrency(initialInvestment)}</span>
            </div>
            <input 
              type="range"
              min={Math.max(1000000, pricingData.min * 0.5)}
              max={pricingData.max * 2.5}
              step={pricingData.average < 10000000 ? 500000 : 2000000}
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full accent-art-gold h-1 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/20 font-mono">
              <span>{formatINRCurrency(Math.max(1000000, pricingData.min * 0.5))}</span>
              <span>{formatINRCurrency(pricingData.max * 2.5)}</span>
            </div>
          </div>

          {/* YoY Growth Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-white/40">Appreciation Rate (YoY)</span>
              <span className="text-art-gold flex items-center gap-1">
                {yoyGrowth}%
                <Percent size={10} />
              </span>
            </div>
            <input 
              type="range"
              min={2}
              max={30}
              step={0.5}
              value={yoyGrowth}
              onChange={(e) => setYoyGrowth(Number(e.target.value))}
              className="w-full accent-art-gold h-1 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/20 font-mono">
              <span>2% Conservative</span>
              <span>30% Venture-Cap</span>
            </div>
          </div>

          {/* Horizon Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-white/40">Projection Range</span>
              <span className="text-art-gold">{horizonYears} Years</span>
            </div>
            <input 
              type="range"
              min={1}
              max={15}
              step={1}
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full accent-art-gold h-1 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/20 font-mono">
              <span>1 Year</span>
              <span>15 Years Long Horizon</span>
            </div>
          </div>
        </div>

        {/* Results Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.03] border border-white/[0.08] p-3.5 rounded-sm relative overflow-hidden">
            <span className="text-[7px] text-white/40 uppercase tracking-[0.2em] block font-semibold mb-1">Projected Valuation</span>
            <div className="text-lg md:text-xl font-serif italic text-white font-bold leading-tight tracking-tight">
              {formatINRCurrency(finalValue)}
            </div>
            <span className="text-[7.5px] uppercase font-bold text-green-400 mt-1.5 flex items-center gap-0.5 font-mono">
              <ArrowUpRight size={10} />
              {yieldMultiplier.toFixed(2)}x yield
            </span>
          </div>
          
          <div className="bg-white/[0.03] border border-white/[0.08] p-3.5 rounded-sm relative overflow-hidden">
            <span className="text-[7px] text-white/40 uppercase tracking-[0.2em] block font-semibold mb-1">Estimated Gain</span>
            <div className="text-lg md:text-xl font-serif italic text-art-gold font-bold leading-tight tracking-tight">
              {formatINRCurrency(totalGain)}
            </div>
            <span className="text-[7.5px] text-white/30 uppercase mt-1.5 block font-mono">
              Total appreciation
            </span>
          </div>
        </div>

        {/* Dynamic Visual Compound Growth Bar Graph */}
        <div className="bg-black/40 border border-white/5 p-4 rounded-sm space-y-3">
          <div className="flex justify-between text-[8px] font-bold uppercase text-white/40 tracking-widest font-mono">
            <span>Dynamic Appreciation Index Chart</span>
            <span>Years 0 to {horizonYears}</span>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-16 pt-2 select-none">
            {yearlyProjections.map((proj) => {
              const heightPercent = Math.max(12, (proj.value / finalValue) * 100);
              const isLast = proj.yearIndex === horizonYears;
              const isFirst = proj.yearIndex === 0;
              return (
                <div key={proj.yearIndex} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group/bar">
                  {/* Tooltip on hovering item */}
                  <div className="w-full relative h-full flex items-end">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all duration-500 relative ${
                        isLast 
                          ? 'bg-gradient-to-t from-[#C5A059]/40 to-art-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                          : isFirst
                            ? 'bg-white/10 group-hover/bar:bg-white/20'
                            : 'bg-[#C5A059]/20 group-hover/bar:bg-[#C5A059]/35'
                      }`}
                    />
                  </div>
                  <span className={`text-[8px] font-mono ${isLast ? 'text-art-gold font-bold' : 'text-white/30'}`}>
                    Yr {proj.yearIndex}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Recommendation Message */}
        <div className={`p-4 border rounded-sm font-sans relative ${profile.badgeColor}`}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-art-gold animate-pulse shrink-0" size={13} />
            <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-white leading-none">
              {profile.label}
            </h5>
          </div>
          <p className="text-[10.5px] text-white/70 leading-relaxed">
            {profile.description}
          </p>
          <div className="mt-3 pt-2.5 border-t border-white/5 text-[9px] uppercase tracking-widest text-white/35 font-mono">
            Historical metric support provided by <span className="text-white">BS Homez Research Group</span>.
          </div>
        </div>
      </div>

      {/* Advisory Trigger / CTA */}
      <div className="pt-4 border-t border-white/5 mt-auto shrink-0 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[7.5px] text-white/25 uppercase tracking-widest font-mono">Estimated Future Value</span>
          <span className="text-xs text-art-gold font-bold">{formatINRCurrency(finalValue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-[9px] uppercase tracking-[0.18em] rounded-sm transition-all border border-white/20 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-3 bg-art-gold text-black hover:bg-white hover:text-black font-black text-[9px] uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer outline-none"
          >
            Acquire Portfolio
            <ArrowUpRight size={12} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
