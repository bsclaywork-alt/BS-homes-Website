import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  MessageCircle, 
  Check, 
  Building2, 
  MapPin, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  ArrowLeftRight
} from 'lucide-react';
import { Project } from '../types';

interface ProjectComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProjects: Project[];
  allProjects: Project[];
  onRemoveProject: (projectId: string) => void;
  onAddProject: (project: Project) => void;
  onClearAll: () => void;
  onEnquire: (project: Project) => void;
  onDownload: (project: Project) => void;
}

export const ProjectComparisonModal: React.FC<ProjectComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedProjects,
  allProjects,
  onRemoveProject,
  onAddProject,
  onClearAll,
  onEnquire,
  onDownload
}) => {
  const [selectedAddId, setSelectedAddId] = useState<string>('');

  if (!isOpen) return null;

  const availableToAdd = allProjects.filter(
    p => !comparedProjects.some(cp => (cp.id && cp.id === p.id) || cp.name === p.name)
  );

  const handleAddSelect = (id: string) => {
    if (!id) return;
    const project = allProjects.find(p => p.id === id || p.name === id);
    if (project) {
      onAddProject(project);
      setSelectedAddId('');
    }
  };

  // Extract all distinct features across all compared projects
  const allFeaturesSet = new Set<string>();
  comparedProjects.forEach(p => {
    if (p.features) {
      p.features.forEach(f => allFeaturesSet.add(f));
    }
  });
  const allFeatures = Array.from(allFeaturesSet);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-lux-charcoal/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative bg-lux-ivory border border-lux-border rounded-sm shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col z-20 overflow-hidden font-sans text-lux-charcoal"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 border-b border-lux-border flex flex-wrap items-center justify-between gap-4 bg-lux-card">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lux-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.35em] text-lux-forest font-black">
                  Side-by-Side Architectural Intelligence
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-lux-forest mt-1">
                Project Comparison ({comparedProjects.length} of 3 Selected)
              </h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {comparedProjects.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="px-3 py-2 bg-lux-ivory hover:bg-red-50 text-lux-muted hover:text-red-700 border border-lux-border rounded-sm text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} /> Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-lux-muted hover:text-lux-charcoal hover:bg-lux-ivory rounded-sm transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto overflow-y-auto flex-grow p-4 sm:p-6 space-y-6">
            {comparedProjects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-lux-border rounded-sm bg-lux-card space-y-4">
                <ArrowLeftRight size={36} className="text-lux-gold mx-auto" />
                <h4 className="text-xl font-serif italic text-lux-forest">No Properties in Comparison Tray</h4>
                <p className="text-xs text-lux-muted max-w-md mx-auto">
                  Select up to three properties from the project gallery or use the quick picker below to compare price, handover timeline, specifications, and amenities side-by-side.
                </p>
                <div className="max-w-md mx-auto pt-4 flex gap-2">
                  <select
                    value={selectedAddId}
                    onChange={(e) => handleAddSelect(e.target.value)}
                    className="w-full bg-lux-ivory border border-lux-border p-2.5 text-xs text-lux-charcoal outline-none focus:border-lux-forest rounded-sm"
                  >
                    <option value="">-- Choose a property to compare --</option>
                    {availableToAdd.map(p => (
                      <option key={p.id || p.name} value={p.id || p.name}>
                        {p.name} ({p.zone} • {p.propertyType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="min-w-[700px] border border-lux-border rounded-sm bg-lux-card shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left">
                  {/* Table Header: Project Top Cards */}
                  <thead>
                    <tr className="border-b border-lux-border bg-lux-ivory/60">
                      <th className="p-4 w-48 text-[10px] uppercase tracking-widest text-lux-forest font-bold border-r border-lux-border align-top">
                        Specification Matrix
                      </th>
                      {comparedProjects.map((p) => (
                        <th key={p.id || p.name} className="p-4 w-72 border-r border-lux-border last:border-r-0 align-top bg-lux-card">
                          <div className="space-y-3 relative">
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => onRemoveProject(p.id || p.name)}
                              className="absolute top-0 right-0 p-1.5 bg-lux-ivory hover:bg-red-50 text-lux-muted hover:text-red-600 rounded transition-all cursor-pointer border border-lux-border"
                              title="Remove from comparison"
                            >
                              <X size={14} />
                            </button>

                            {/* Thumbnail */}
                            <div className="aspect-video w-full rounded-sm overflow-hidden bg-lux-ivory relative border border-lux-border">
                              <img 
                                src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'} 
                                alt={p.name} 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute top-2 left-2 flex gap-1">
                                <span className="px-2 py-0.5 bg-lux-gold text-lux-charcoal text-[8px] font-black uppercase tracking-wider rounded-sm shadow-sm">
                                  {p.handoverStatus || p.propertyType}
                                </span>
                                <span className="px-2 py-0.5 bg-lux-forest/90 text-lux-card text-[8px] font-mono uppercase tracking-wider rounded-sm border border-lux-gold/30">
                                  {p.propertyType}
                                </span>
                              </div>
                              {/* BS Homez Image Watermark */}
                              <div className="pointer-events-none absolute bottom-1.5 right-1.5 z-20 flex items-center gap-1 px-1.5 py-0.5 bg-lux-forest/90 backdrop-blur-sm rounded-sm border border-lux-gold/40 text-lux-card text-[8px] font-black tracking-widest font-mono shadow-md select-none">
                                <span className="w-1 h-1 rounded-full bg-lux-gold" />
                                <span>BS Homez</span>
                              </div>
                            </div>

                            {/* Name & Builder */}
                            <div>
                              <h4 className="text-base font-serif italic text-lux-forest leading-tight font-bold pr-6">
                                {p.name}
                              </h4>
                              <p className="text-[10px] text-lux-gold font-mono uppercase tracking-wider font-bold mt-0.5">
                                {p.builderName || 'Verified Builder'}
                              </p>
                              <p className="text-[9px] text-lux-muted flex items-center gap-1 mt-0.5">
                                <MapPin size={10} className="shrink-0 text-lux-gold" />
                                <span className="truncate">{p.location}</span>
                              </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => onEnquire(p)}
                                className="flex-1 py-2 bg-lux-forest hover:bg-lux-forest-hover text-lux-card text-[9px] font-black uppercase tracking-widest rounded-sm transition-all text-center cursor-pointer shadow-sm"
                              >
                                Enquire
                              </button>
                              <button
                                type="button"
                                onClick={() => onDownload(p)}
                                className="px-3 py-2 bg-lux-ivory hover:bg-lux-forest hover:text-lux-card text-lux-forest text-[9px] font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer border border-lux-border"
                                title="Download Brochure"
                              >
                                <Download size={12} />
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}

                      {/* Empty Slot if less than 3 */}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, slotIndex) => (
                        <th key={`empty-slot-${slotIndex}`} className="p-4 w-72 border-r border-lux-border last:border-r-0 align-middle text-center bg-lux-ivory/40">
                          <div className="p-6 border border-dashed border-lux-border rounded-sm bg-lux-card flex flex-col items-center justify-center space-y-3">
                            <Plus size={20} className="text-lux-gold" />
                            <span className="text-[10px] uppercase tracking-widest text-lux-forest font-bold block">
                              Add Property {comparedProjects.length + slotIndex + 1}
                            </span>
                            <select
                              value=""
                              onChange={(e) => handleAddSelect(e.target.value)}
                              className="w-full bg-lux-ivory border border-lux-border p-2 text-[10px] text-lux-charcoal outline-none focus:border-lux-forest rounded-sm"
                            >
                              <option value="">-- Select from archive --</option>
                              {availableToAdd.map(p => (
                                <option key={p.id || p.name} value={p.id || p.name}>
                                  {p.name} ({p.zone})
                                </option>
                              ))}
                            </select>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* SECTION 1: FINANCIALS */}
                    <tr className="bg-lux-ivory border-b border-lux-border">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-lux-forest">
                        01. Financials &amp; Pricing Structure
                      </td>
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Indicative Price (* Conditions Apply)
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className="text-sm font-bold text-lux-forest font-mono block">
                            {p.price}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Last Price (Auto-Updated *)
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className="text-xs font-mono text-lux-charcoal font-bold">
                            {p.lastPrice || p.price}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Buyer Brokerage
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className="text-xs font-semibold text-lux-forest flex items-center gap-1.5">
                            <Check size={14} className="shrink-0 text-lux-forest" />
                            {p.type === 'Primary' || p.type === 'Primary Sale' 
                              ? '0% Brokerage (Primary Direct)' 
                              : 'Standard Advisory Fee'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 2: TIMELINE & CONSTRUCTION */}
                    <tr className="bg-lux-ivory border-b border-lux-border">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-lux-forest">
                        02. Lifecycle &amp; Handover Timeline
                      </td>
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Present Status
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-sm ${
                            p.handoverStatus === 'Ready to Move' 
                              ? 'bg-lux-forest/15 text-lux-forest border border-lux-forest/30'
                              : p.handoverStatus === 'EOI' 
                              ? 'bg-lux-gold/25 text-lux-charcoal border border-lux-gold/50'
                              : 'bg-lux-ivory text-lux-charcoal border border-lux-border'
                          }`}>
                            {p.handoverStatus || 'Under Construction'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Handover Date
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className="text-xs text-lux-charcoal font-mono font-bold flex items-center gap-1.5">
                            <Calendar size={13} className="text-lux-gold shrink-0" />
                            {p.handoverDate || 'Immediate'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Payment &amp; Scheme
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className="text-xs text-lux-charcoal font-mono">
                            {p.paymentOffers || 'Standard Construction Linked Plan*'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 3: ASSET & CONFIGURATION */}
                    <tr className="bg-lux-ivory border-b border-lux-border">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-lux-forest">
                        03. Configurations &amp; Spatial Density
                      </td>
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Property Asset Type
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className="text-xs font-bold text-lux-forest uppercase">
                            {p.propertyType}
                          </span>
                          <span className="text-[10px] text-lux-muted block font-mono">
                            {p.segment}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Configurations
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <div className="flex flex-wrap gap-1">
                            {p.configuration?.map((cfg, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-lux-ivory border border-lux-border text-lux-charcoal text-[9px] rounded-sm font-mono font-bold">
                                {cfg}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Floor Plan &amp; SBA Breakdown
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <p className="text-xs text-lux-charcoal font-mono leading-relaxed">
                            {p.floorPlan || 'Custom floor plans available on request'}
                          </p>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Project Scale &amp; Density
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0 text-xs text-lux-charcoal font-mono space-y-1">
                          <div><strong className="text-lux-forest">Scale:</strong> {p.projectSize || 'Gated Community'}</div>
                          {p.noOfTowers && <div><strong className="text-lux-forest">Towers:</strong> {p.noOfTowers}</div>}
                          {p.floorsHeight && <div><strong className="text-lux-forest">Elevation:</strong> {p.floorsHeight}</div>}
                          {p.flatsPerFloor && <div><strong className="text-lux-forest">Density:</strong> {p.flatsPerFloor}</div>}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 4: LEGAL & APPROVALS */}
                    <tr className="bg-lux-ivory border-b border-lux-border">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-lux-forest">
                        04. Statutory &amp; Regulatory Approvals
                      </td>
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        RERA Number
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0">
                          <span className="text-[10px] text-lux-forest font-mono break-all font-bold block">
                            {p.reraNumber || 'Verified Registration'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border">
                        Approval Body
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0 text-xs text-lux-charcoal font-mono">
                          {p.approvalBody || 'BBMP / BDA / BMRDA'}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 5: AMENITIES MATRIX */}
                    <tr className="bg-lux-ivory border-b border-lux-border">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-lux-forest">
                        05. Lifestyle Features &amp; Amenities
                      </td>
                    </tr>
                    <tr className="border-b border-lux-border/60 hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border align-top">
                        Key Amenities
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0 align-top">
                          <div className="space-y-1.5">
                            {p.features?.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-lux-charcoal">
                                <Check size={12} className="text-lux-forest shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 6: CONNECTIVITY TARGETS */}
                    <tr className="bg-lux-ivory border-b border-lux-border">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-lux-forest">
                        06. Strategic Location Targets (in kms)
                      </td>
                    </tr>
                    <tr className="hover:bg-lux-ivory/30">
                      <td className="p-3.5 text-xs text-lux-muted font-bold border-r border-lux-border align-top">
                        Key Transit &amp; Hubs
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-lux-border last:border-r-0 align-top text-xs text-lux-charcoal font-sans leading-relaxed">
                          <p>{p.locationTarget || p.location}</p>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-lux-border last:border-r-0 text-lux-muted/40 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-lux-border flex flex-wrap items-center justify-between gap-3 bg-lux-card text-xs">
            <span className="text-[10px] text-lux-muted font-mono">
              * Indicative prices subject to floor rise, PLC, statutory taxes &amp; registration charges.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-lux-forest hover:bg-lux-forest-hover text-lux-card font-black uppercase tracking-widest text-[10px] rounded-sm transition-all cursor-pointer shadow-sm"
            >
              Done / Close Comparison
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
