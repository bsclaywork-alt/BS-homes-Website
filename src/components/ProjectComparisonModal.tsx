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
          className="fixed inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative bg-art-dark border border-art-gold/30 rounded-sm shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col z-20 overflow-hidden font-sans"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-black/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-art-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.35em] text-art-gold font-black">
                  Side-by-Side Architectural Intelligence
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white mt-1">
                Project Comparison ({comparedProjects.length} of 3 Selected)
              </h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {comparedProjects.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-sm text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} /> Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-sm transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto overflow-y-auto flex-grow p-4 sm:p-6 space-y-6">
            {comparedProjects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-sm bg-white/[0.01] space-y-4">
                <ArrowLeftRight size={36} className="text-art-gold/60 mx-auto" />
                <h4 className="text-xl font-serif italic text-white">No Properties in Comparison Tray</h4>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                  Select up to three properties from the project gallery or use the quick picker below to compare price, handover timeline, specifications, and amenities side-by-side.
                </p>
                <div className="max-w-md mx-auto pt-4 flex gap-2">
                  <select
                    value={selectedAddId}
                    onChange={(e) => handleAddSelect(e.target.value)}
                    className="w-full bg-art-dark border border-white/20 p-2.5 text-xs text-white outline-none focus:border-art-gold rounded-sm"
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
              <div className="min-w-[700px] border border-white/10 rounded-sm bg-black/40 overflow-hidden">
                <table className="w-full border-collapse text-left">
                  {/* Table Header: Project Top Cards */}
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="p-4 w-48 text-[10px] uppercase tracking-widest text-white/40 font-bold border-r border-white/10 align-top">
                        Specification Matrix
                      </th>
                      {comparedProjects.map((p) => (
                        <th key={p.id || p.name} className="p-4 w-72 border-r border-white/10 last:border-r-0 align-top">
                          <div className="space-y-3 relative">
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => onRemoveProject(p.id || p.name)}
                              className="absolute top-0 right-0 p-1.5 bg-black/60 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded transition-all cursor-pointer border border-white/10"
                              title="Remove from comparison"
                            >
                              <X size={14} />
                            </button>

                            {/* Thumbnail */}
                            <div className="aspect-video w-full rounded-sm overflow-hidden bg-white/5 relative border border-white/10">
                              <img 
                                src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'} 
                                alt={p.name} 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute top-2 left-2 flex gap-1">
                                <span className="px-2 py-0.5 bg-art-gold text-black text-[8px] font-black uppercase tracking-wider rounded-sm">
                                  {p.handoverStatus || p.propertyType}
                                </span>
                                <span className="px-2 py-0.5 bg-black/80 text-white text-[8px] font-mono uppercase tracking-wider rounded-sm border border-white/15">
                                  {p.propertyType}
                                </span>
                              </div>
                              {/* BS Homez Image Watermark */}
                              <div className="pointer-events-none absolute bottom-1.5 right-1.5 z-20 flex items-center gap-1 px-1.5 py-0.5 bg-black/75 backdrop-blur-sm rounded-sm border border-art-gold/30 text-white text-[8px] font-black tracking-widest font-mono shadow-md select-none">
                                <span className="w-1 h-1 rounded-full bg-art-gold" />
                                <span>BS Homez</span>
                              </div>
                            </div>

                            {/* Name & Builder */}
                            <div>
                              <h4 className="text-base font-serif italic text-white leading-tight font-bold pr-6">
                                {p.name}
                              </h4>
                              <p className="text-[10px] text-art-gold font-mono uppercase tracking-wider mt-0.5">
                                {p.builderName || 'Verified Builder'}
                              </p>
                              <p className="text-[9px] text-white/50 flex items-center gap-1 mt-0.5">
                                <MapPin size={10} className="shrink-0 text-white/40" />
                                <span className="truncate">{p.location}</span>
                              </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => onEnquire(p)}
                                className="flex-1 py-2 bg-art-gold hover:bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-sm transition-all text-center cursor-pointer shadow-sm"
                              >
                                Enquire
                              </button>
                              <button
                                type="button"
                                onClick={() => onDownload(p)}
                                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer border border-white/10"
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
                        <th key={`empty-slot-${slotIndex}`} className="p-4 w-72 border-r border-white/10 last:border-r-0 align-middle text-center bg-white/[0.01]">
                          <div className="p-6 border border-dashed border-white/15 rounded-sm flex flex-col items-center justify-center space-y-3">
                            <Plus size={20} className="text-art-gold" />
                            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold block">
                              Add Property {comparedProjects.length + slotIndex + 1}
                            </span>
                            <select
                              value=""
                              onChange={(e) => handleAddSelect(e.target.value)}
                              className="w-full bg-art-dark border border-white/20 p-2 text-[10px] text-white outline-none focus:border-art-gold rounded-sm"
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
                    <tr className="bg-art-gold/10 border-b border-white/10">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-art-gold">
                        01. Financials & Pricing Structure
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Indicative Price (* Conditions Apply)
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className="text-sm font-bold text-white font-mono block">
                            {p.price}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Last Price (Auto-Updated *)
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className="text-xs font-mono text-art-gold font-bold">
                            {p.lastPrice || p.price}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Buyer Brokerage
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <Check size={14} className="shrink-0" />
                            {p.type === 'Primary' || p.type === 'Primary Sale' 
                              ? '0% Brokerage (Primary Direct)' 
                              : 'Standard Advisory Fee'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 2: TIMELINE & CONSTRUCTION */}
                    <tr className="bg-art-gold/10 border-b border-white/10">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-art-gold">
                        02. Lifecycle & Handover Timeline
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Present Status
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-sm ${
                            p.handoverStatus === 'Ready to Move' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                              : p.handoverStatus === 'EOI' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {p.handoverStatus || 'Under Construction'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Handover Date
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className="text-xs text-white font-mono font-bold flex items-center gap-1.5">
                            <Calendar size={13} className="text-art-gold shrink-0" />
                            {p.handoverDate || 'Immediate'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Payment & Scheme
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className="text-xs text-white/80 font-mono">
                            {p.paymentOffers || 'Standard Construction Linked Plan*'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 3: ASSET & CONFIGURATION */}
                    <tr className="bg-art-gold/10 border-b border-white/10">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-art-gold">
                        03. Configurations & Spatial Density
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Property Asset Type
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className="text-xs font-bold text-white uppercase">
                            {p.propertyType}
                          </span>
                          <span className="text-[10px] text-white/50 block font-mono">
                            {p.segment}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Configurations
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <div className="flex flex-wrap gap-1">
                            {p.configuration?.map((cfg, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white text-[9px] rounded-sm font-mono">
                                {cfg}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Floor Plan & SBA Breakdown
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <p className="text-xs text-white/90 font-mono leading-relaxed">
                            {p.floorPlan || 'Custom floor plans available on request'}
                          </p>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Project Scale & Density
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0 text-xs text-white/80 font-mono space-y-1">
                          <div><strong>Scale:</strong> {p.projectSize || 'Gated Community'}</div>
                          {p.noOfTowers && <div><strong>Towers:</strong> {p.noOfTowers}</div>}
                          {p.floorsHeight && <div><strong>Elevation:</strong> {p.floorsHeight}</div>}
                          {p.flatsPerFloor && <div><strong>Density:</strong> {p.flatsPerFloor}</div>}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 4: LEGAL & APPROVALS */}
                    <tr className="bg-art-gold/10 border-b border-white/10">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-art-gold">
                        04. Statutory & Regulatory Approvals
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        RERA Number
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0">
                          <span className="text-[10px] text-art-gold font-mono break-all font-bold block">
                            {p.reraNumber || 'Verified Registration'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10">
                        Approval Body
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0 text-xs text-white/80 font-mono">
                          {p.approvalBody || 'BBMP / BDA / BMRDA'}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 5: AMENITIES MATRIX */}
                    <tr className="bg-art-gold/10 border-b border-white/10">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-art-gold">
                        05. Lifestyle Features & Amenities
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10 align-top">
                        Key Amenities
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0 align-top">
                          <div className="space-y-1.5">
                            {p.features?.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-white/80">
                                <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>

                    {/* SECTION 6: CONNECTIVITY TARGETS */}
                    <tr className="bg-art-gold/10 border-b border-white/10">
                      <td colSpan={4} className="p-2.5 px-4 text-[9px] font-mono uppercase tracking-[0.3em] font-black text-art-gold">
                        06. Strategic Location Targets (in kms)
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.01]">
                      <td className="p-3.5 text-xs text-white/50 font-bold border-r border-white/10 align-top">
                        Key Transit & Hubs
                      </td>
                      {comparedProjects.map(p => (
                        <td key={p.id || p.name} className="p-3.5 border-r border-white/10 last:border-r-0 align-top text-xs text-white/70 font-sans leading-relaxed">
                          <p>{p.locationTarget || p.location}</p>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-r border-white/10 last:border-r-0 text-white/20 font-mono text-xs text-center">—</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/60 text-xs">
            <span className="text-[10px] text-white/50 font-mono">
              * Indicative prices subject to floor rise, PLC, statutory taxes & registration charges.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-art-gold hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-sm transition-all cursor-pointer"
            >
              Done / Close Comparison
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
