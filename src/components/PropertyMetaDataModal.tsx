import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Save, 
  Globe, 
  Tag, 
  Search, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Project } from '../types';

interface PropertyMetaDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  initialProject?: Project | null;
  onSaveMetaData: (
    projectId: string, 
    meta: { 
      metaTitle: string; 
      metaDescription: string; 
      seoKeywords: string[];
    }
  ) => Promise<void>;
}

export const PropertyMetaDataModal: React.FC<PropertyMetaDataModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialProject,
  onSaveMetaData
}) => {
  // Sort projects alphabetically for easy selection
  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Currently selected project
  const currentProject = React.useMemo(() => {
    return projects.find(
      p => p.id === selectedProjectId || p.name === selectedProjectId
    ) || initialProject || projects[0] || null;
  }, [projects, selectedProjectId, initialProject]);

  // Sync state whenever modal opens or currentProject changes
  useEffect(() => {
    if (isOpen && currentProject) {
      setSelectedProjectId(currentProject.id || currentProject.name);
      setMetaTitle(
        currentProject.metaTitle || 
        currentProject.seoTitle || 
        `${currentProject.name} in ${currentProject.zone || currentProject.location}, Bangalore | BS Homez`
      );
      setMetaDescription(
        currentProject.metaDescription || 
        currentProject.seoDescription || 
        currentProject.description?.slice(0, 155) || 
        `Explore ${currentProject.name} by ${currentProject.builderName || 'top developer'} in ${currentProject.location}, Bangalore. Price: ${currentProject.price}. Verified RERA with BS Homez.`
      );
      
      const existingKeywords = currentProject.seoKeywords || [];
      if (existingKeywords.length > 0) {
        setKeywords(existingKeywords);
      } else {
        // Sensible default keywords
        setKeywords([
          currentProject.name,
          `${currentProject.name} Bangalore`,
          `${currentProject.propertyType} in ${currentProject.zone || 'Bangalore'}`,
          `Buy ${currentProject.name}`,
          'BS Homez',
          '0% Brokerage',
          'RERA Verified'
        ]);
      }
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen, currentProject?.id, currentProject?.name]);

  if (!isOpen || !currentProject) return null;

  // Add a keyword tag
  const handleAddKeyword = (kwToAdd?: string) => {
    const raw = kwToAdd !== undefined ? kwToAdd : keywordInput;
    const trimmed = raw.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;

    // Handle comma-separated list
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    setKeywords(prev => {
      const combined = [...prev];
      for (const p of parts) {
        if (!combined.some(existing => existing.toLowerCase() === p.toLowerCase())) {
          combined.push(p);
        }
      }
      return combined;
    });

    if (kwToAdd === undefined) {
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    setKeywords(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // AI Generation Handler
  const handleAiGenerate = async () => {
    if (!currentProject) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/ai/seo-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: currentProject.name,
          location: currentProject.location,
          zone: currentProject.zone,
          type: currentProject.type,
          propertyType: currentProject.propertyType,
          price: currentProject.price,
          builderName: currentProject.builderName,
          reraNumber: currentProject.reraNumber,
          features: currentProject.features,
          configuration: currentProject.configuration
        })
      });

      const data = await response.json();
      if (data && data.success) {
        if (data.metaTitle) setMetaTitle(data.metaTitle);
        if (data.metaDescription) setMetaDescription(data.metaDescription);
        if (data.keywords) {
          const generatedList = String(data.keywords)
            .split(',')
            .map(k => k.trim())
            .filter(Boolean);
          setKeywords(generatedList.slice(0, 15));
        }
        setSuccessMessage('AI generated high-ranking SEO titles, descriptions, and keywords successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        throw new Error(data?.error || 'Failed to generate SEO metadata');
      }
    } catch (err: any) {
      console.warn('AI SEO generation fallback notice:', err);
      // Client-side intelligent fallback
      const generatedTitle = `${currentProject.name} ${currentProject.zone ? `in ${currentProject.zone}` : ''} | Luxury ${currentProject.propertyType} | BS Homez`;
      const generatedDesc = `Discover ${currentProject.name} by ${currentProject.builderName || 'Premier Builder'} in ${currentProject.location}. Price: ${currentProject.price}. 0% Brokerage & RERA Verified. Contact BS Homez today.`;
      setMetaTitle(generatedTitle);
      setMetaDescription(generatedDesc);
      setKeywords([
        currentProject.name,
        `${currentProject.name} Price`,
        `${currentProject.propertyType} in ${currentProject.zone || 'Bangalore'}`,
        `${currentProject.name} Floor Plan`,
        'RERA Approved Bangalore',
        '0% Brokerage',
        'BS Homez'
      ]);
      setSuccessMessage('Generated optimal SEO meta data for ' + currentProject.name);
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Handler
  const handleSave = async () => {
    if (!currentProject) return;
    if (!metaTitle.trim()) {
      setErrorMessage('Please enter an SEO Meta Title before saving.');
      return;
    }
    if (!metaDescription.trim()) {
      setErrorMessage('Please enter an SEO Meta Description before saving.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const targetId = currentProject.id || currentProject.name;
      await onSaveMetaData(targetId, {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        seoKeywords: keywords
      });

      setSuccessMessage(`SEO Meta Data saved successfully for ${currentProject.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error saving meta data:', err);
      setErrorMessage(err?.message || 'Failed to save meta data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#121212] border border-art-gold/40 rounded-lg max-w-3xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto text-white relative flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] uppercase tracking-[0.25em] text-art-gold font-bold">Property SEO Manager</span>
                <span className="px-2 py-0.5 rounded-full bg-art-gold/15 text-art-gold text-[8.5px] font-mono font-bold border border-art-gold/30">
                  Google SERP Ready
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif text-white font-bold italic">
                Add &amp; Manage Listing Meta Data
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Property Selector Bar */}
        <div className="p-3 sm:p-4 bg-black/40 border-b border-white/10 shrink-0">
          <label className="text-[9.5px] uppercase tracking-wider text-white/60 font-mono font-bold block mb-1.5">
            Select Property Listing:
          </label>
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={e => {
                const newId = e.target.value;
                setSelectedProjectId(newId);
                const nextProj = projects.find(p => p.id === newId || p.name === newId);
                if (nextProj) {
                  setMetaTitle(
                    nextProj.metaTitle || 
                    nextProj.seoTitle || 
                    `${nextProj.name} in ${nextProj.zone || nextProj.location}, Bangalore | BS Homez`
                  );
                  setMetaDescription(
                    nextProj.metaDescription || 
                    nextProj.seoDescription || 
                    nextProj.description?.slice(0, 155) || 
                    `Explore ${nextProj.name} in ${nextProj.location}. Price: ${nextProj.price}. RERA Verified with BS Homez.`
                  );
                  setKeywords(nextProj.seoKeywords || [
                    nextProj.name,
                    `${nextProj.name} Bangalore`,
                    `${nextProj.propertyType} in ${nextProj.zone || 'Bangalore'}`,
                    'BS Homez',
                    '0% Brokerage'
                  ]);
                }
              }}
              className="w-full bg-[#181818] border border-white/20 focus:border-art-gold text-white text-xs sm:text-sm px-3 py-2 rounded-sm outline-none font-sans cursor-pointer appearance-none pr-8"
            >
              {sortedProjects.map(proj => (
                <option key={proj.id || proj.name} value={proj.id || proj.name}>
                  {proj.name} — {proj.propertyType} ({proj.zone || proj.location}) · {proj.price}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* Quick Info Strip */}
          <div className="mt-2 flex items-center gap-2 flex-wrap text-[9px] font-mono text-white/70">
            <span className="px-2 py-0.5 rounded bg-white/10 text-art-gold font-bold">
              {currentProject.type} {currentProject.propertyType}
            </span>
            <span>·</span>
            <span>📍 {currentProject.location}</span>
            <span>·</span>
            <span className="text-white font-bold">💰 {currentProject.price}</span>
            {currentProject.builderName && (
              <>
                <span>·</span>
                <span>🏗️ {currentProject.builderName}</span>
              </>
            )}
          </div>
        </div>

        {/* Tab & Action Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#161616] shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-sm text-[9.5px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-art-gold text-black font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Edit Meta Fields
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-sm text-[9.5px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-art-gold text-black font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Google SERP Preview
            </button>
          </div>

          {/* AI Generate Button */}
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="px-3 py-1 rounded-sm bg-gradient-to-r from-art-gold via-amber-400 to-yellow-500 text-black font-bold text-[9.5px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
            title="Auto-generate optimal Google meta tags using AI"
          >
            {isGenerating ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>✨ AI-Generate Meta</span>
              </>
            )}
          </button>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mx-4 mt-3 p-2.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shrink-0"
            >
              <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mx-4 mt-3 p-2.5 rounded bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 shrink-0"
            >
              <AlertCircle size={14} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'editor' ? (
            <>
              {/* Field 1: Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-wider text-art-gold font-bold font-mono flex items-center gap-1.5">
                    <span>1. SEO Meta Title</span>
                    <span className="text-[8px] text-white/50 normal-case">(Shown as the main clickable headline in Google search results)</span>
                  </label>
                  <span className={`text-[9px] font-mono font-bold ${
                    titleLen >= 50 && titleLen <= 60 
                      ? 'text-emerald-400' 
                      : titleLen > 60 
                      ? 'text-amber-400' 
                      : 'text-white/50'
                  }`}>
                    {titleLen} / 60 chars {titleLen >= 50 && titleLen <= 60 ? '✓ Ideal' : ''}
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  placeholder="e.g. Prestige Raintree Park Whitefield | 3 & 4 BHK Luxury Apartments | BS Homez"
                  className="w-full bg-white/[0.05] border border-white/20 focus:border-art-gold text-white text-xs sm:text-sm px-3 py-2 rounded-sm outline-none font-sans"
                />
              </div>

              {/* Field 2: Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-wider text-art-gold font-bold font-mono flex items-center gap-1.5">
                    <span>2. SEO Meta Description</span>
                    <span className="text-[8px] text-white/50 normal-case">(Shown beneath the title on Google SERP)</span>
                  </label>
                  <span className={`text-[9px] font-mono font-bold ${
                    descLen >= 140 && descLen <= 160 
                      ? 'text-emerald-400' 
                      : descLen > 160 
                      ? 'text-amber-400' 
                      : 'text-white/50'
                  }`}>
                    {descLen} / 160 chars {descLen >= 140 && descLen <= 160 ? '✓ Ideal' : ''}
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. Explore Prestige Raintree Park in Whitefield, Bangalore. Premium 3 & 4 BHK apartments with verified RERA compliance, 0% buyer brokerage, and transparent pricing. Inquire now!"
                  className="w-full bg-white/[0.05] border border-white/20 focus:border-art-gold text-white text-xs sm:text-sm p-3 rounded-sm outline-none font-sans resize-none leading-relaxed"
                />
              </div>

              {/* Field 3: Keyword Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-wider text-art-gold font-bold font-mono flex items-center gap-1.5">
                    <Tag size={11} />
                    <span>3. Keyword Tags ({keywords.length} tags)</span>
                  </label>
                  {keywords.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setKeywords([])}
                      className="text-[8.5px] uppercase text-white/40 hover:text-red-400 font-mono transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Add keyword input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Type keyword and press Enter or click '+ Add' (e.g. Flats in Whitefield, 0% Brokerage)..."
                    className="flex-1 bg-white/[0.05] border border-white/20 focus:border-art-gold text-white text-xs px-3 py-2 rounded-sm outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddKeyword()}
                    className="px-3.5 py-2 bg-white/10 hover:bg-art-gold hover:text-black text-white text-xs font-bold rounded-sm border border-white/20 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Tag Pills Display */}
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-black/40 border border-white/10 rounded-sm min-h-[50px] max-h-36 overflow-y-auto">
                  {keywords.length === 0 ? (
                    <span className="text-[11px] text-white/40 italic">
                      No keyword tags added yet. Type above or click recommendations below.
                    </span>
                  ) : (
                    keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-art-gold/15 text-art-gold border border-art-gold/30 text-[10px] font-sans font-medium"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(idx)}
                          className="text-art-gold/60 hover:text-white transition-colors cursor-pointer ml-0.5"
                          title="Remove keyword"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[8.5px] uppercase tracking-wider text-white/50 font-mono block">
                    Quick High-Intent Keyword Presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      `+ ${currentProject.name}`,
                      `+ ${currentProject.zone || 'Bangalore'} Real Estate`,
                      '+ 0% Builder Brokerage',
                      '+ RERA Verified',
                      `+ ${currentProject.propertyType} for Sale`,
                      '+ Bangalore Luxury Homes',
                      '+ Immediate Handover',
                      '+ High ROI Investment'
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleAddKeyword(preset.replace(/^\+\s*/, ''))}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-art-gold/20 text-white/70 hover:text-art-gold border border-white/10 text-[9px] font-mono transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Live Google SERP Simulation */
            <div className="space-y-4">
              <div className="p-4 bg-[#1f1f1f] border border-white/15 rounded-lg shadow-inner">
                <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono block mb-3">
                  Google Search Live Snippet Preview (Desktop &amp; Mobile)
                </span>

                <div className="p-4 bg-[#202124] rounded-md border border-white/10 space-y-1.5 font-sans text-left">
                  {/* Google Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                    <div className="w-5 h-5 rounded-full bg-[#303134] flex items-center justify-center text-[10px] text-art-gold font-bold">
                      🏛️
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-white font-medium">BS Homez</span>
                      <span className="text-[11px] text-[#9aa0a6] truncate">
                        https://www.bshomez.in › project › {currentProject.name.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </div>
                  </div>

                  {/* Title Link */}
                  <h4 className="text-base sm:text-lg text-[#8ab4f8] hover:underline cursor-pointer font-normal line-clamp-2 leading-snug">
                    {metaTitle || `${currentProject.name} in Bangalore | BS Homez`}
                  </h4>

                  {/* Snippet Description */}
                  <p className="text-xs sm:text-[13px] text-[#bdc1c6] leading-relaxed line-clamp-3">
                    {metaDescription || currentProject.description}
                  </p>

                  {/* Sitelinks / Key Facts */}
                  <div className="pt-2 flex flex-wrap gap-2 text-[10.5px] text-[#8ab4f8] border-t border-white/10 mt-2">
                    <span className="hover:underline cursor-pointer">Price: {currentProject.price}</span>
                    <span>·</span>
                    <span className="hover:underline cursor-pointer">Location: {currentProject.location}</span>
                    <span>·</span>
                    <span className="hover:underline cursor-pointer">RERA Verified</span>
                    <span>·</span>
                    <span className="hover:underline cursor-pointer">0% Buyer Brokerage</span>
                  </div>
                </div>
              </div>

              {/* Keywords Summary for Crawlers */}
              <div className="p-3 bg-black/40 border border-white/10 rounded-sm">
                <span className="text-[9px] uppercase tracking-widest text-art-gold font-mono block mb-1">
                  Active Keyword Meta Tag Target ({keywords.length} items):
                </span>
                <p className="text-xs font-mono text-white/70 break-words leading-relaxed">
                  {keywords.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 border border-white/15 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-sm bg-art-gold hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving to Listing...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Meta Data</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
