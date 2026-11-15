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
        badgeColor: "bg-lux-card text-lux-forest border-lux-gold/50 shadow-2xs"
      };
    } else if (yoyGrowth >= 10) {
      return {
        label: "Stable High-Yield Compounder",
        description: `Characterized by premium microgrid demand in ${project.location}, this asset boasts powerful defensive compounding.`,
        badgeColor: "bg-lux-card text-lux-forest border-lux-border shadow-2xs"
      };
    } else {
      return {
        label: "Preservation & Yield Compound",
        description: "Focus on capital preservation with defensive dividends and premium lifestyle valuation in the regional center.",
        badgeColor: "bg-lux-card text-lux-charcoal border-lux-border shadow-2xs"
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
      className="absolute inset-0 bg-lux-ivory/98 backdrop-blur-lg z-40 flex flex-col p-6 md:p-8 border border-lux-border overflow-y-auto select-none shadow-xl"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-lux-border mb-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-lux-card flex items-center justify-center border border-lux-border shadow-2xs">
            <Calculator className="text-lux-forest" size={14} />
          </div>
          <div>
            <h4 className="text-sm font-serif italic text-lux-forest font-bold">Appreciation Modeler</h4>
            <span className="text-[8px] text-lux-muted uppercase tracking-[0.2em] font-mono block">
              Direct Historical YoY Projection Index
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-3 py-1.5 rounded-full bg-lux-card text-lux-charcoal hover:bg-lux-forest hover:text-lux-card font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer z-50 border border-lux-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
          aria-label="Close Calculator"
          title="Close (Esc)"
        >
          <X size={14} className="stroke-[3]" />
          <span className="font-mono text-[10px]">CLOSE</span>
        </button>
      </div>

      <div className="flex-grow space-y-6">
        <div>
          <span className="text-lux-gold text-[8px] uppercase tracking-[0.3em] font-black font-mono">Location Trends Link</span>
          <p className="text-[10px] text-lux-charcoal leading-relaxed mt-1 font-mono uppercase">
            {project.zone} baseline growth is indexed at <span className="text-lux-forest font-bold font-sans">{baselineRate}% YoY</span>
          </p>
        </div>

        {/* Inputs section */}
        <div className="space-y-4 bg-lux-card border border-lux-border p-4 rounded-sm shadow-2xs">
          {/* Initial Value Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-lux-muted">Initial Value Setup</span>
              <span className="text-lux-forest">{formatINRCurrency(initialInvestment)}</span>
            </div>
            <input 
              type="range"
              min={Math.max(1000000, pricingData.min * 0.5)}
              max={pricingData.max * 2.5}
              step={pricingData.average < 10000000 ? 500000 : 2000000}
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full accent-lux-forest h-1.5 bg-lux-border rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/30"
            />
            <div className="flex justify-between text-[8px] text-lux-muted font-mono">
              <span>{formatINRCurrency(Math.max(1000000, pricingData.min * 0.5))}</span>
              <span>{formatINRCurrency(pricingData.max * 2.5)}</span>
            </div>
          </div>

          {/* YoY Growth Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-lux-muted">Appreciation Rate (YoY)</span>
              <span className="text-lux-forest flex items-center gap-1">
                {yoyGrowth}%
                <Percent size={10} className="text-lux-gold" />
              </span>
            </div>
            <input 
              type="range"
              min={2}
              max={30}
              step={0.5}
              value={yoyGrowth}
              onChange={(e) => setYoyGrowth(Number(e.target.value))}
              className="w-full accent-lux-forest h-1.5 bg-lux-border rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/30"
            />
            <div className="flex justify-between text-[8px] text-lux-muted font-mono">
              <span>2% Conservative</span>
              <span>30% Venture-Cap</span>
            </div>
          </div>

          {/* Horizon Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-lux-muted">Projection Range</span>
              <span className="text-lux-forest">{horizonYears} Years</span>
            </div>
            <input 
              type="range"
              min={1}
              max={15}
              step={1}
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full accent-lux-forest h-1.5 bg-lux-border rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/30"
            />
            <div className="flex justify-between text-[8px] text-lux-muted font-mono">
              <span>1 Year</span>
              <span>15 Years Long Horizon</span>
            </div>
          </div>
        </div>

        {/* Results Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-lux-card border border-lux-border p-3.5 rounded-sm relative overflow-hidden shadow-2xs">
            <span className="text-[7px] text-lux-muted uppercase tracking-[0.2em] block font-semibold mb-1">Projected Valuation</span>
            <div className="text-lg md:text-xl font-serif italic text-lux-forest font-bold leading-tight tracking-tight">
              {formatINRCurrency(finalValue)}
            </div>
            <span className="text-[7.5px] uppercase font-bold text-lux-forest mt-1.5 flex items-center gap-0.5 font-mono">
              <ArrowUpRight size={10} className="text-lux-gold" />
              {yieldMultiplier.toFixed(2)}x yield
            </span>
          </div>
          
          <div className="bg-lux-card border border-lux-border p-3.5 rounded-sm relative overflow-hidden shadow-2xs">
            <span className="text-[7px] text-lux-muted uppercase tracking-[0.2em] block font-semibold mb-1">Estimated Gain</span>
            <div className="text-lg md:text-xl font-serif italic text-lux-gold font-bold leading-tight tracking-tight">
              {formatINRCurrency(totalGain)}
            </div>
            <span className="text-[7.5px] text-lux-muted uppercase mt-1.5 block font-mono">
              Total appreciation
            </span>
          </div>
        </div>

        {/* Dynamic Visual Compound Growth Bar Graph */}
        <div className="bg-lux-card border border-lux-border p-4 rounded-sm space-y-3 shadow-2xs">
          <div className="flex justify-between text-[8px] font-bold uppercase text-lux-muted tracking-widest font-mono">
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
                          ? 'bg-gradient-to-t from-lux-forest/80 to-lux-forest shadow-xs'
                          : isFirst
                            ? 'bg-lux-border group-hover/bar:bg-lux-muted/40'
                            : 'bg-lux-gold/55 group-hover/bar:bg-lux-gold'
                      }`}
                    />
                  </div>
                  <span className={`text-[8px] font-mono ${isLast ? 'text-lux-forest font-bold' : 'text-lux-muted'}`}>
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
            <Sparkles className="text-lux-gold animate-pulse shrink-0" size={13} />
            <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-lux-forest leading-none">
              {profile.label}
            </h5>
          </div>
          <p className="text-[10.5px] text-lux-charcoal leading-relaxed">
            {profile.description}
          </p>
          <div className="mt-3 pt-2.5 border-t border-lux-border text-[9px] uppercase tracking-widest text-lux-muted font-mono">
            Historical metric support provided by <span className="text-lux-forest font-semibold">BS Homez Research Group</span>.
          </div>
        </div>
      </div>

      {/* Advisory Trigger / CTA */}
      <div className="pt-4 border-t border-lux-border mt-auto shrink-0 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[7.5px] text-lux-muted uppercase tracking-widest font-mono">Estimated Future Value</span>
          <span className="text-xs text-lux-forest font-bold">{formatINRCurrency(finalValue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-lux-card hover:bg-lux-ivory text-lux-charcoal font-bold text-[9px] uppercase tracking-[0.18em] rounded-sm transition-all border border-lux-border cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-3 bg-lux-forest text-lux-card hover:bg-lux-forest-hover font-black text-[9px] uppercase tracking-[0.2em] rounded-sm transition-all shadow-sm cursor-pointer outline-none"
          >
            Acquire Portfolio
            <ArrowUpRight size={12} className="stroke-[2.5] text-lux-gold" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
