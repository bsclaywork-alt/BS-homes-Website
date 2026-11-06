import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Filter,
  Eye,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { 
  ImageAltAuditItem, 
  SeoAuditSummary, 
  compileProjectImageAltAudit, 
  compilePortfolioImageAltAudit, 
  downloadSeoAuditCsv 
} from '../lib/seoAuditReport';

interface SeoAuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  allProjects?: Project[];
  currentAltTextOverride?: string;
  onApplyRecommendedAltText?: (recommendedAltText: string) => void;
  onApplyBatchAltTexts?: (updates: { projectId: string; mainAltText: string }[]) => Promise<void> | void;
}

export const SeoAuditReportModal: React.FC<SeoAuditReportModalProps> = ({
  isOpen,
  onClose,
  project,
  allProjects = [],
  currentAltTextOverride,
  onApplyRecommendedAltText,
  onApplyBatchAltTexts
}) => {
  const [scope, setScope] = useState<'project' | 'portfolio'>('project');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'optimized'>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Single project audit summary
  const projectSummary = useMemo(() => {
    if (!project) return null;
    return compileProjectImageAltAudit(project, currentAltTextOverride);
  }, [project, currentAltTextOverride]);

  // Full portfolio audit summary
  const portfolioSummary = useMemo(() => {
    if (!allProjects || allProjects.length === 0) return null;
    return compilePortfolioImageAltAudit(allProjects);
  }, [allProjects]);

  if (!isOpen) return null;

  // Active items and metrics
  const activeItems: ImageAltAuditItem[] = scope === 'project'
    ? (projectSummary?.items || [])
    : (portfolioSummary?.items || []);

  const totalImages = activeItems.length;
  const missingCount = activeItems.filter(i => i.status === 'MISSING').length;
  const genericCount = activeItems.filter(i => i.status === 'GENERIC').length;
  const optimizedCount = activeItems.filter(i => i.status === 'OPTIMIZED').length;
  const healthScore = totalImages > 0 ? Math.round((optimizedCount / totalImages) * 100) : 100;

  // Filter items for display
  const displayedItems = activeItems.filter(item => {
    if (statusFilter === 'missing') return item.status === 'MISSING' || item.status === 'GENERIC';
    if (statusFilter === 'optimized') return item.status === 'OPTIMIZED';
    return true;
  });

  // Handle Download CSV
  const handleDownloadCsv = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const targetName = scope === 'project' && project 
      ? project.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')
      : 'portfolio_all_projects';
    const filename = `seo_alt_text_audit_${targetName}_${dateStr}.csv`;
    const title = scope === 'project' && project
      ? `BS Homez SEO Alt Text Audit Report - ${project.name}`
      : 'BS Homez Full Portfolio Image Accessibility & SEO Audit';

    downloadSeoAuditCsv(activeItems, filename, title);
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 4000);
  };

  // Copy Summary text
  const handleCopySummary = () => {
    const projectNameStr = scope === 'project' && project ? project.name : 'All Projects Portfolio';
    const summaryText = `[BS Homez SEO & Image Accessibility Audit Report]
Scope: ${projectNameStr}
Generated: ${new Date().toLocaleString()}
Total Images Scanned: ${totalImages}
- Compliant (Optimized): ${optimizedCount} (${totalImages ? Math.round((optimizedCount/totalImages)*100) : 100}%)
- Missing Alt Text: ${missingCount}
- Generic/Needs Refinement: ${genericCount}
Overall Health Score: ${healthScore}%
WCAG 2.2 Guideline: 1.1.1 Non-text Content (Level A)

Summary of Action Items:
${activeItems.filter(i => i.status !== 'OPTIMIZED').slice(0, 5).map((item, idx) => 
  `${idx + 1}. [${item.projectName}] ${item.imageRole} - Missing Alt Text: Suggestion -> "${item.recommendedAltText}"`
).join('\n')}
... (Full details available in downloadable CSV report)`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#121212] border border-art-gold/50 rounded-lg max-w-4xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto text-white relative flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] uppercase tracking-[0.25em] text-art-gold font-bold">SEO &amp; Accessibility Diagnostic</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[8px] font-mono font-bold border border-blue-500/40">
                  WCAG 2.2 Compliant
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif text-white font-bold italic leading-tight">
                Image Alt Text SEO Audit Report
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-sm bg-gradient-to-r from-art-gold to-yellow-500 hover:opacity-90 text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              title="Download full CSV report for Excel or Google Sheets"
            >
              <Download size={13} />
              <span>Download CSV Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scope Tabs & Quick Filter */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-sm border border-white/10">
            {project && (
              <button
                type="button"
                onClick={() => setScope('project')}
                className={`px-3 py-1 rounded-sm text-[9.5px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  scope === 'project'
                    ? 'bg-art-gold text-black font-black shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Current Project ({project.name})
              </button>
            )}
            {allProjects.length > 0 && (
              <button
                type="button"
                onClick={() => setScope('portfolio')}
                className={`px-3 py-1 rounded-sm text-[9.5px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  scope === 'portfolio'
                    ? 'bg-art-gold text-black font-black shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                All Projects ({allProjects.length} Portfolios)
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono hidden sm:inline">Filter:</span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                statusFilter === 'all'
                  ? 'bg-white/20 text-white border-white/40 font-black'
                  : 'bg-white/5 text-white/50 border-transparent hover:text-white'
              }`}
            >
              All ({totalImages})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('missing')}
              className={`px-2.5 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                statusFilter === 'missing'
                  ? 'bg-red-500/25 text-red-300 border-red-500/50 font-black'
                  : 'bg-white/5 text-red-400/70 border-transparent hover:text-red-300'
              }`}
            >
              Missing / Needs Work ({missingCount + genericCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('optimized')}
              className={`px-2.5 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                statusFilter === 'optimized'
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 font-black'
                  : 'bg-white/5 text-emerald-400/70 border-transparent hover:text-emerald-300'
              }`}
            >
              Optimized ({optimizedCount})
            </button>
          </div>
        </div>

        {/* Notifications / Toast */}
        <AnimatePresence>
          {downloadSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mx-4 mt-3 p-2.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between shrink-0"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>CSV Audit Report generated &amp; downloaded successfully! Compatible with Excel, Google Sheets, and CRM tools.</span>
              </div>
              <button onClick={() => setDownloadSuccessToast(false)} className="text-emerald-400 hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          )}
          {appliedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mx-4 mt-3 p-2.5 rounded bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs flex items-center justify-between shrink-0"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-blue-400 shrink-0" />
                <span>{appliedNotice}</span>
              </div>
              <button onClick={() => setAppliedNotice(null)} className="text-blue-400 hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Total Images */}
            <div className="bg-white/[0.03] border border-white/10 p-3 rounded-sm">
              <span className="text-[9px] uppercase tracking-wider text-white/50 block font-mono">Total Images Audited</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">{totalImages}</div>
              <span className="text-[8.5px] text-white/40 block mt-1">Primary, gallery &amp; plans</span>
            </div>

            {/* Missing Alt Text */}
            <div className={`border p-3 rounded-sm ${
              missingCount > 0 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-white/[0.03] border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-red-300 block font-mono font-bold">Missing Alt Text</span>
                {missingCount > 0 && <AlertTriangle size={13} className="text-red-400" />}
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-red-400 mt-0.5">{missingCount}</div>
              <span className="text-[8.5px] text-red-300/70 block mt-1">Requires accessibility fix</span>
            </div>

            {/* Generic Alt Text */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-sm">
              <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-mono font-bold">Generic / Needs Work</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-0.5">{genericCount}</div>
              <span className="text-[8.5px] text-amber-300/70 block mt-1">Too short or placeholder</span>
            </div>

            {/* SEO Health Score */}
            <div className="bg-white/[0.03] border border-art-gold/30 p-3 rounded-sm">
              <span className="text-[9px] uppercase tracking-wider text-art-gold block font-mono font-bold">Alt Text Health</span>
              <div className={`text-xl sm:text-2xl font-bold font-mono mt-0.5 ${
                healthScore >= 80 ? 'text-emerald-400' : healthScore >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {healthScore}%
              </div>
              <span className="text-[8.5px] text-white/40 block mt-1">{optimizedCount} of {totalImages} fully compliant</span>
            </div>
          </div>

          {/* Table / List of Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-white/70 font-mono font-bold">
                Detailed Image Accessibility Breakdown ({displayedItems.length} items)
              </span>
              <button
                type="button"
                onClick={handleCopySummary}
                className="text-[9px] uppercase tracking-wider text-art-gold hover:text-white font-mono flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSummary ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copiedSummary ? 'Summary Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            {displayedItems.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/10 rounded-sm p-8 text-center text-white/40 text-xs">
                No images matched the active filter.
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayedItems.map((item, idx) => {
                  const isMissing = item.status === 'MISSING';
                  const isGeneric = item.status === 'GENERIC';
                  const isOptimized = item.status === 'OPTIMIZED';

                  return (
                    <div 
                      key={item.id || idx}
                      className={`p-3 rounded-sm border transition-all ${
                        isMissing
                          ? 'bg-red-500/[0.04] border-red-500/30'
                          : isGeneric
                          ? 'bg-amber-500/[0.04] border-amber-500/30'
                          : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        {/* Image Preview Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-black/60 border border-white/15 overflow-hidden shrink-0 relative group">
                          <img
                            src={item.imageUrl}
                            alt={item.currentAltText || item.recommendedAltText}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback on broken image
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            title="View Full Image Asset"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1.5 w-full">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-white text-xs font-bold">{item.projectName}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 font-mono">
                                {item.imageRole} (#{item.imageIndex + 1})
                              </span>
                              <span className="text-[8.5px] text-white/40 font-mono hidden md:inline">
                                {item.location}
                              </span>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {isMissing && (
                                <span className="px-2 py-0.5 rounded-sm bg-red-500/20 text-red-300 text-[8.5px] uppercase font-bold font-mono border border-red-500/40 flex items-center gap-1">
                                  <AlertTriangle size={10} />
                                  <span>Missing Alt Text</span>
                                </span>
                              )}
                              {isGeneric && (
                                <span className="px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 text-[8.5px] uppercase font-bold font-mono border border-amber-500/40 flex items-center gap-1">
                                  <AlertTriangle size={10} />
                                  <span>Generic / Too Short</span>
                                </span>
                              )}
                              {isOptimized && (
                                <span className="px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 text-[8.5px] uppercase font-bold font-mono border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 size={10} />
                                  <span>WCAG Optimized</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Current Alt Text */}
                          <div className="text-xs">
                            <span className="text-[8.5px] uppercase font-mono text-white/40 block">Current Alt Text:</span>
                            {item.currentAltText ? (
                              <p className="text-white/80 font-sans text-xs italic bg-black/30 p-1.5 rounded border border-white/10">
                                "{item.currentAltText}"
                              </p>
                            ) : (
                              <p className="text-red-400/80 font-mono text-[10px] italic">
                                &lt;No alt attribute / Empty string - Violates WCAG 2.2 Level A 1.1.1&gt;
                              </p>
                            )}
                          </div>

                          {/* Recommended Alt Text */}
                          <div className="bg-purple-950/20 border border-purple-500/30 p-2 rounded-sm text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[8.5px] uppercase font-mono font-bold text-purple-300 flex items-center gap-1">
                                <Sparkles size={10} />
                                <span>Recommended WCAG Alt Text:</span>
                              </span>
                              {onApplyRecommendedAltText && item.imageRole === 'Primary Elevation' && scope === 'project' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onApplyRecommendedAltText(item.recommendedAltText);
                                    setAppliedNotice(`Applied recommended alt text to primary project image!`);
                                    setTimeout(() => setAppliedNotice(null), 3000);
                                  }}
                                  className="text-[8.5px] uppercase tracking-wider text-purple-300 hover:text-white font-mono font-bold cursor-pointer transition-colors flex items-center gap-1 bg-purple-600/30 hover:bg-purple-600 px-2 py-0.5 rounded border border-purple-500/40"
                                >
                                  <CheckCheck size={10} />
                                  <span>Apply to Project</span>
                                </button>
                              )}
                            </div>
                            <p className="text-purple-100 text-xs leading-relaxed">
                              "{item.recommendedAltText}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
            <span>WCAG 2.2 Guideline 1.1.1 (Non-text Content)</span>
            <span>·</span>
            <span>Google Images SEO</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-[10px] uppercase tracking-wider font-bold rounded-sm border border-white/15 transition-all cursor-pointer flex items-center gap-1"
            >
              {copiedSummary ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-4 py-1.5 bg-gradient-to-r from-art-gold to-yellow-500 text-black text-[10px] uppercase tracking-wider font-black rounded-sm shadow-md transition-all hover:opacity-90 cursor-pointer flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Download CSV Report</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
