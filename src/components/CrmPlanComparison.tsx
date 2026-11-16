import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight, 
  Building2, 
  CheckCircle2,
  ChevronRight,
  Database,
  Lock,
  Headphones,
  Award
} from 'lucide-react';

interface CrmPlanComparisonProps {
  onSelectPlan: (planName: string) => void;
}

interface FeatureItem {
  name: string;
  tooltip?: string;
  basic: string | boolean;
  standard: string | boolean;
  enterprise: string | boolean;
}

interface FeatureCategory {
  category: string;
  icon: React.ElementType;
  features: FeatureItem[];
}

export const CrmPlanComparison: React.FC<CrmPlanComparisonProps> = ({ onSelectPlan }) => {
  const [activeMobileTier, setActiveMobileTier] = useState<'basic' | 'standard' | 'enterprise'>('standard');

  const comparisonData: FeatureCategory[] = [
    {
      category: '1. Architecture & Team Capacity',
      icon: Users,
      features: [
        {
          name: 'Included User Licenses',
          basic: '1 - 3 Seats',
          standard: 'Up to 15 Seats',
          enterprise: 'Unlimited Seats',
        },
        {
          name: 'Role-Based Access Control (RBAC)',
          basic: 'Single Role (Admin)',
          standard: 'Manager, Agent & Account Roles',
          enterprise: 'Custom Matrix & Multi-Branch Hierarchy',
        },
        {
          name: 'Infrastructure & Database Hosting',
          basic: 'Shared Secure Cloud',
          standard: 'Dedicated Cloud Database',
          enterprise: 'Private VPC / Enterprise Cloud',
        },
        {
          name: 'Mobile-Optimized Web App (PWA)',
          basic: true,
          standard: true,
          enterprise: true,
        },
        {
          name: 'Custom Domain & White-Labeling',
          basic: false,
          standard: 'Custom Subdomain',
          enterprise: 'Full White-Label & Custom Domain',
        },
      ],
    },
    {
      category: '2. Lead Tracking & Pipeline Flow',
      icon: Zap,
      features: [
        {
          name: 'Multi-Channel Lead Ingestion',
          basic: 'Manual Entry & Web Forms',
          standard: 'Meta Ads, Google Ads & Web Forms',
          enterprise: 'Omnichannel (Ads, Portals, Inbound & IVR)',
        },
        {
          name: 'Custom Deal Pipelines & Stages',
          basic: '4 Fixed Standard Stages',
          standard: 'Unlimited Custom Stages',
          enterprise: 'Multi-Department Nested Pipelines',
        },
        {
          name: 'Lead Assignment & Distribution',
          basic: 'Manual Assignment',
          standard: 'Automated Round-Robin',
          enterprise: 'AI-Ready Scoring & Geofenced Routing',
        },
        {
          name: 'Lead Status Timelines & History',
          basic: 'Basic Activity Log',
          standard: 'Full Timestamped Interaction Trail',
          enterprise: '360° Omnichannel Customer Ledger',
        },
        {
          name: 'Automated Follow-up Alerts',
          basic: 'In-App Alerts',
          standard: 'Automated Email & Push Notifications',
          enterprise: 'Multi-Tier Escalation & Client SMS Alerts',
        },
      ],
    },
    {
      category: '3. Payment Tracking & Milestone Automation',
      icon: Building2,
      features: [
        {
          name: 'Payment Milestone Schedules',
          basic: 'Manual Log Only',
          standard: 'Automated Schedules & Due Dates',
          enterprise: 'Dynamic Milestone Triggers & Escrow Flow',
        },
        {
          name: 'Overdue Reminders & Collections',
          basic: 'Basic In-App Notice',
          standard: 'Automated Overdue Email Alerts',
          enterprise: 'Multi-Level Overdue Rules & Manager Escalations',
        },
        {
          name: 'Invoicing & Tax Receipts',
          basic: 'Standard PDF Receipts',
          standard: 'Branded GST-Compliant Invoices',
          enterprise: 'Automated Invoicing & ERP / Tally Sync',
        },
        {
          name: 'Commission Splits & Brokerage Tracking',
          basic: false,
          standard: 'Standard Agent Percentage',
          enterprise: 'Automated Tiered Payouts & Audit Trails',
        },
      ],
    },
    {
      category: '4. Productivity, Analytics & Security',
      icon: ShieldCheck,
      features: [
        {
          name: 'Performance Dashboards',
          basic: 'Standard Lead Counter',
          standard: 'Real-time Agent & Conversion Dashboards',
          enterprise: 'Executive BI Suite & Forecast Analytics',
        },
        {
          name: 'Data Encryption & Backups',
          basic: 'Daily Cloud Backup',
          standard: 'Automated Hourly Snapshot Backups',
          enterprise: 'SOC-2 Standard & Point-in-Time Recovery',
        },
        {
          name: 'REST API & Webhook Integration',
          basic: false,
          standard: 'Webhook Ingestion',
          enterprise: 'Full Two-Way REST API & Webhooks',
        },
        {
          name: 'Dedicated Onboarding & Support SLA',
          basic: 'Standard Email (48-hr SLA)',
          standard: 'Priority Email & Phone (12-hr SLA)',
          enterprise: 'Dedicated Tech Manager & 24/7 Priority Hotline',
        },
      ],
    },
  ];

  const renderCellValue = (val: string | boolean, isHighlighted = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-lux-forest/15 text-lux-forest flex items-center justify-center">
            <Check size={14} className="stroke-[3]" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-lux-ivory border border-lux-border text-lux-muted/60 flex items-center justify-center">
            <X size={13} />
          </div>
        </div>
      );
    }
    return (
      <span className={`text-xs ${isHighlighted ? 'text-lux-forest font-semibold' : 'text-lux-charcoal'}`}>
        {val}
      </span>
    );
  };

  return (
    <div id="crm-plans-table" className="pt-10 border-t border-lux-border space-y-8">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lux-forest/10 border border-lux-forest/20 text-lux-forest text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-2.5">
            <Sparkles size={11} className="text-lux-gold animate-pulse" />
            <span>BS Homez CRM Plan Comparison</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif italic text-lux-forest tracking-tight">
            Compare Basic, Standard &amp; Enterprise CRM Plans
          </h3>
          <p className="text-lux-muted text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            Every BS Homez CRM is custom-deployed for your precise business domain. Review the feature breakdown below to identify the architecture tailored to your current workflow and scalability targets.
          </p>
        </div>

        {/* Quick Highlights Badge */}
        <div className="shrink-0 flex items-center gap-3 bg-lux-ivory border border-lux-border p-3 rounded-sm text-xs font-mono">
          <Award size={18} className="text-lux-gold shrink-0" />
          <div>
            <div className="text-lux-forest font-bold text-[11px] uppercase tracking-wider">Zero Lock-in Guarantee</div>
            <div className="text-lux-muted text-[10px]">Seamless upgrade paths between all plans</div>
          </div>
        </div>
      </div>

      {/* Mobile Plan Selector Tabs */}
      <div className="lg:hidden">
        <div className="text-[11px] font-mono text-lux-muted uppercase tracking-widest mb-2.5 flex items-center justify-between">
          <span>Select Tier to Inspect</span>
          <span className="text-lux-forest font-bold text-[10px]">Tap to compare</span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-1 bg-lux-ivory rounded-sm border border-lux-border">
          <button
            type="button"
            onClick={() => setActiveMobileTier('basic')}
            className={`py-2 px-2 text-xs font-bold rounded-sm transition-all cursor-pointer ${
              activeMobileTier === 'basic'
                ? 'bg-lux-card text-lux-charcoal border border-lux-border shadow-sm'
                : 'text-lux-muted hover:text-lux-charcoal'
            }`}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTier('standard')}
            className={`py-2 px-2 text-xs font-bold rounded-sm transition-all cursor-pointer relative ${
              activeMobileTier === 'standard'
                ? 'bg-lux-forest text-lux-card shadow-md font-black'
                : 'text-lux-forest hover:bg-lux-forest/10'
            }`}
          >
            Standard ★
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTier('enterprise')}
            className={`py-2 px-2 text-xs font-bold rounded-sm transition-all cursor-pointer ${
              activeMobileTier === 'enterprise'
                ? 'bg-lux-charcoal text-lux-card shadow-md'
                : 'text-lux-muted hover:text-lux-charcoal'
            }`}
          >
            Enterprise
          </button>
        </div>

        {/* Mobile Single Card View */}
        <div className="mt-4 p-5 bg-lux-card border border-lux-border rounded-sm shadow-sm">
          {activeMobileTier === 'basic' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-lux-border pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-lux-muted block">Starter Tier</span>
                  <h4 className="text-xl font-bold text-lux-charcoal">Basic CRM</h4>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPlan('Basic CRM')}
                  className="px-4 py-2 bg-lux-ivory hover:bg-lux-forest hover:text-lux-card text-lux-forest border border-lux-border text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                >
                  Select Plan
                </button>
              </div>
              <p className="text-lux-muted text-xs">
                Essential lead recording, simple contact pipeline, and manual payment tracking for solo agents and small brokerages.
              </p>
              <div className="space-y-4 pt-2">
                {comparisonData.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-[11px] font-mono text-lux-forest uppercase tracking-wider font-bold">
                      {cat.category}
                    </div>
                    <div className="space-y-2">
                      {cat.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-center justify-between text-xs py-1.5 border-b border-lux-border/60">
                          <span className="text-lux-charcoal">{feat.name}</span>
                          <span className="font-medium text-right ml-2">{renderCellValue(feat.basic)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onSelectPlan('Basic CRM')}
                className="w-full mt-4 py-3 bg-lux-ivory hover:bg-lux-forest hover:text-lux-card text-lux-forest border border-lux-border text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Basic CRM Plan</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {activeMobileTier === 'standard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-lux-gold/40 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-lux-gold font-bold block">
                    Most Popular Tier
                  </span>
                  <h4 className="text-xl font-bold text-lux-forest">Standard CRM</h4>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPlan('Standard CRM')}
                  className="px-4 py-2 bg-lux-forest hover:bg-lux-forest-hover text-lux-card text-xs font-black uppercase tracking-wider rounded-sm transition-all shadow-sm cursor-pointer"
                >
                  Select Plan
                </button>
              </div>
              <p className="text-lux-muted text-xs">
                Automated multi-channel lead capture, agent assignment, automated payment schedules &amp; alerts, and live team conversion dashboards.
              </p>
              <div className="space-y-4 pt-2">
                {comparisonData.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-[11px] font-mono text-lux-forest uppercase tracking-wider font-bold">
                      {cat.category}
                    </div>
                    <div className="space-y-2">
                      {cat.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-center justify-between text-xs py-1.5 border-b border-lux-border/60">
                          <span className="text-lux-charcoal font-medium">{feat.name}</span>
                          <span className="font-medium text-right ml-2">{renderCellValue(feat.standard, true)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onSelectPlan('Standard CRM')}
                className="w-full mt-4 py-3 bg-lux-forest hover:bg-lux-forest-hover text-lux-card text-xs font-black uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Select Standard CRM Plan</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {activeMobileTier === 'enterprise' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-lux-border pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-lux-gold font-bold block">
                    Bespoke Tier
                  </span>
                  <h4 className="text-xl font-bold text-lux-charcoal">Enterprise CRM</h4>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPlan('Enterprise CRM')}
                  className="px-4 py-2 bg-lux-charcoal hover:bg-lux-forest text-lux-card text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                >
                  Select Plan
                </button>
              </div>
              <p className="text-lux-muted text-xs">
                Full-custom ERP integration, unlimited pipelines, branch hierarchies, multi-tier commission automation, dedicated private VPC &amp; 24/7 SLA.
              </p>
              <div className="space-y-4 pt-2">
                {comparisonData.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-[11px] font-mono text-lux-forest uppercase tracking-wider font-bold">
                      {cat.category}
                    </div>
                    <div className="space-y-2">
                      {cat.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-center justify-between text-xs py-1.5 border-b border-lux-border/60">
                          <span className="text-lux-charcoal">{feat.name}</span>
                          <span className="font-medium text-right ml-2">{renderCellValue(feat.enterprise)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onSelectPlan('Enterprise CRM')}
                className="w-full mt-4 py-3 bg-lux-charcoal hover:bg-lux-forest text-lux-card text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Enterprise CRM Plan</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Comparison Table - Desktop & Tablet */}
      <div className="hidden lg:block overflow-hidden rounded-sm border border-lux-border bg-lux-card shadow-lg">
        <table className="w-full text-left border-collapse">
          {/* Table Header: Plan Cards */}
          <thead>
            <tr className="border-b border-lux-border bg-lux-ivory/50">
              <th className="p-6 w-[28%] align-bottom">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-lux-muted block mb-1">
                  Feature Comparison
                </span>
                <span className="text-sm font-serif italic text-lux-forest font-semibold">
                  Select your ideal operational tier
                </span>
              </th>

              {/* Basic CRM Column Header */}
              <th className="p-6 w-[24%] bg-lux-card border-l border-lux-border align-top">
                <div className="space-y-3">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-lux-ivory border border-lux-border text-[9px] font-mono uppercase tracking-widest text-lux-muted">
                    Starter Tier
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-lux-charcoal tracking-wide">Basic CRM</h4>
                    <p className="text-[11px] text-lux-muted mt-1 leading-relaxed">
                      For solo agents &amp; boutique agencies seeking simple pipeline and contact order.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectPlan('Basic CRM')}
                    className="w-full py-2.5 px-3 rounded-sm bg-lux-ivory hover:bg-lux-forest hover:text-lux-card text-lux-forest border border-lux-border text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Select Basic</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </th>

              {/* Standard CRM Column Header (Featured) */}
              <th className="p-6 w-[24%] bg-lux-ivory/80 border-l border-r border-lux-gold/50 align-top relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-lux-gold text-lux-charcoal text-[9px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1 whitespace-nowrap">
                  <Sparkles size={10} />
                  <span>Most Popular / Recommended</span>
                </div>
                <div className="space-y-3 pt-1">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-lux-forest/10 border border-lux-forest/25 text-[9px] font-mono uppercase tracking-widest text-lux-forest font-bold">
                    Growth Tier
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-lux-forest tracking-wide">Standard CRM</h4>
                    <p className="text-[11px] text-lux-muted mt-1 leading-relaxed">
                      For fast-growing sales teams requiring automated lead capture &amp; payment follow-up.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectPlan('Standard CRM')}
                    className="w-full py-2.5 px-3 rounded-sm bg-lux-forest hover:bg-lux-forest-hover text-lux-card text-xs font-black tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Select Standard</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </th>

              {/* Enterprise CRM Column Header */}
              <th className="p-6 w-[24%] bg-lux-card border-r border-lux-border align-top">
                <div className="space-y-3">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-lux-gold/15 border border-lux-gold/40 text-[9px] font-mono uppercase tracking-widest text-lux-charcoal font-bold">
                    Enterprise Tier
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-lux-charcoal tracking-wide">Enterprise CRM</h4>
                    <p className="text-[11px] text-lux-muted mt-1 leading-relaxed">
                      For large builders &amp; multi-branch firms with custom workflows and ERP integration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectPlan('Enterprise CRM')}
                    className="w-full py-2.5 px-3 rounded-sm bg-lux-charcoal hover:bg-lux-forest text-lux-card text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Select Enterprise</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body with Categorized Sections */}
          <tbody className="divide-y divide-lux-border/60 text-xs">
            {comparisonData.map((section, catIndex) => (
              <React.Fragment key={catIndex}>
                {/* Category Header Row */}
                <tr className="bg-lux-ivory">
                  <td colSpan={4} className="py-3 px-6 text-[11px] font-mono uppercase tracking-[0.2em] text-lux-forest font-bold">
                    <div className="flex items-center gap-2">
                      <section.icon size={13} className="text-lux-gold" />
                      <span>{section.category}</span>
                    </div>
                  </td>
                </tr>

                {/* Feature Rows */}
                {section.features.map((feat, featIdx) => (
                  <tr key={featIdx} className="hover:bg-lux-ivory/40 transition-colors">
                    <td className="py-4 px-6 text-lux-charcoal font-medium">
                      {feat.name}
                    </td>
                    <td className="py-4 px-6 bg-lux-card border-l border-lux-border text-center">
                      {renderCellValue(feat.basic)}
                    </td>
                    <td className="py-4 px-6 bg-lux-ivory/50 border-l border-r border-lux-gold/40 text-center">
                      {renderCellValue(feat.standard, true)}
                    </td>
                    <td className="py-4 px-6 bg-lux-card border-r border-lux-border text-center">
                      {renderCellValue(feat.enterprise)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>

          {/* Table Footer: Repeat CTAs */}
          <tfoot>
            <tr className="border-t border-lux-border bg-lux-ivory">
              <td className="p-6">
                <div className="text-[11px] font-mono uppercase tracking-widest text-lux-forest font-bold">
                  Ready to deploy?
                </div>
                <p className="text-xs text-lux-muted mt-0.5">
                  Pre-fills inquiry form directly with your selected CRM tier
                </p>
              </td>
              <td className="p-6 bg-lux-card border-l border-lux-border">
                <button
                  type="button"
                  onClick={() => onSelectPlan('Basic CRM')}
                  className="w-full py-2.5 px-3 rounded-sm bg-lux-ivory hover:bg-lux-forest hover:text-lux-card text-lux-forest border border-lux-border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Choose Basic</span>
                  <ArrowRight size={12} />
                </button>
              </td>
              <td className="p-6 bg-lux-ivory/80 border-l border-r border-lux-gold/50">
                <button
                  type="button"
                  onClick={() => onSelectPlan('Standard CRM')}
                  className="w-full py-2.5 px-3 rounded-sm bg-lux-forest hover:bg-lux-forest-hover text-lux-card text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Choose Standard</span>
                  <ArrowRight size={12} />
                </button>
              </td>
              <td className="p-6 bg-lux-card border-r border-lux-border">
                <button
                  type="button"
                  onClick={() => onSelectPlan('Enterprise CRM')}
                  className="w-full py-2.5 px-3 rounded-sm bg-lux-charcoal hover:bg-lux-forest text-lux-card text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Choose Enterprise</span>
                  <ArrowRight size={12} />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Deployment & Integration Guarantees */}
      <div className="grid sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-sm bg-lux-ivory border border-lux-border flex items-start gap-3">
          <Database size={16} className="text-lux-gold shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-lux-forest uppercase tracking-wider">Free Data Migration</h5>
            <p className="text-[11px] text-lux-muted mt-1 leading-relaxed">
              We seamlessly migrate your existing Excel sheets, Google Contacts, or legacy CRM records at no extra charge.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-lux-ivory border border-lux-border flex items-start gap-3">
          <Headphones size={16} className="text-lux-forest shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-lux-forest uppercase tracking-wider">Interactive Team Training</h5>
            <p className="text-[11px] text-lux-muted mt-1 leading-relaxed">
              Live hands-on training sessions for your sales agents and team managers to ensure 100% adoption within 48 hours.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-lux-ivory border border-lux-border flex items-start gap-3">
          <Lock size={16} className="text-lux-gold shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-lux-forest uppercase tracking-wider">Enterprise Security</h5>
            <p className="text-[11px] text-lux-muted mt-1 leading-relaxed">
              TLS encryption in transit and AES-256 at rest with role-restricted permissions so your client database remains private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
