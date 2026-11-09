import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Save, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  RefreshCw, 
  Undo2, 
  Copy, 
  Check, 
  Eye, 
  X,
  ExternalLink,
  MapPin,
  Building2,
  Wand2,
  Info,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';

import { Project } from '../types';
import { compilePortfolioImageAltAudit, downloadSeoAuditCsv } from '../lib/seoAuditReport';
import { SeoAuditReportModal } from './SeoAuditReportModal';
import { doc, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface AdminSeoAuditPanelProps {
  projects: Project[];
  onSaveProject?: (project: Project) => Promise<void> | void;
  onBatchSyncSitemap?: () => Promise<void>;
  isSyncingSitemap?: boolean;
}

export interface SeoDraftItem {
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  isDirty?: boolean;
}

export const AdminSeoAuditPanel: React.FC<AdminSeoAuditPanelProps> = ({
  projects,
  onSaveProject,
  onBatchSyncSitemap,
  isSyncingSitemap = false
}) => {
  // Local drafts state keying by project.id || project.name
  const [drafts, setDrafts] = useState<Record<string, SeoDraftItem>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Primary' | 'Rental' | 'Resale'>('all');
  const [healthFilter, setHealthFilter] = useState<'all' | 'needs_attention' | 'optimized' | 'dirty_only'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [chartMode, setChartMode] = useState<'overall' | 'by_category'>('overall');
  
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [previewSnippetProject, setPreviewSnippetProject] = useState<Project | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isAltAuditModalOpen, setIsAltAuditModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info', duration = 3500) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  // Filter out legacy dummy projects
  const validProjects = useMemo(() => {
    return projects.filter(p => !p.isDeleted && !['The Royal Orchard', 'East Gate Residences', 'Azure Lakes'].includes(p.name));
  }, [projects]);

  // Unique zones for filtering
  const uniqueZones = useMemo(() => {
    const zones = new Set<string>();
    validProjects.forEach(p => {
      if (p.zone) zones.add(p.zone);
    });
    return Array.from(zones).sort();
  }, [validProjects]);

  // Helper to generate default SEO title tag
  const getDefaultTitle = (p: Project): string => {
    const zoneStr = p.zone ? ` in ${p.zone}` : '';
    const propType = p.propertyType || 'Apartment';
    const action = p.type === 'Rental' ? 'for Rent' : 'for Sale';
    return `${p.name} | Luxury ${propType} ${action}${zoneStr} | BS Homez`;
  };

  // Helper to generate default SEO meta description (optimal 120-160 chars)
  const getDefaultDescription = (p: Project): string => {
    const loc = p.location ? ` at ${p.location}` : '';
    const priceStr = p.price ? ` starting from ${p.price}` : '';
    const rera = p.reraNumber ? ' RERA Verified.' : '';
    const feeNotice = p.type === 'Rental' ? ' Verified rentals with transparent closing.' : ' 0% buyer brokerage with direct developer allocation.';
    const base = `Explore ${p.name}${loc}${priceStr}.${rera}${feeNotice} Schedule your private consultation with BS Homez.`;
    return base.length > 160 ? base.slice(0, 157) + '...' : base;
  };

  // Resolve current effective values for a project
  const getRowSeoData = (p: Project) => {
    const key = p.id || p.name;
    const draft = drafts[key] || {};

    const metaTitle = draft.metaTitle !== undefined ? draft.metaTitle : (p.metaTitle || getDefaultTitle(p));
    const metaDescription = draft.metaDescription !== undefined ? draft.metaDescription : (p.metaDescription || getDefaultDescription(p));
    const seoKeywords = draft.seoKeywords !== undefined 
      ? draft.seoKeywords 
      : ((p.seoKeywords && p.seoKeywords.length > 0) ? p.seoKeywords.join(', ') : '');
    const ogImage = draft.ogImage !== undefined ? draft.ogImage : (p.ogImage || p.imageUrls?.[0] || '');
    const isDirty = Boolean(draft.isDirty);

    const titleLen = metaTitle.trim().length;
    const descLen = metaDescription.trim().length;
    const kwCount = seoKeywords.split(',').map(s => s.trim()).filter(Boolean).length;
    const hasImage = Boolean(ogImage.trim());

    // Google SERP guidelines: Title optimal 30-65 chars; Description optimal 120-160 chars
    const titleOk = titleLen >= 30 && titleLen <= 70;
    const descOk = descLen >= 110 && descLen <= 165;
    const health: 'optimized' | 'needs_attention' = (titleOk && descOk && hasImage) ? 'optimized' : 'needs_attention';

    const canonicalUrl = `https://bshomez.in/?project=${encodeURIComponent(p.id || p.name)}`;

    return {
      metaTitle,
      metaDescription,
      seoKeywords,
      ogImage,
      isDirty,
      titleLen,
      descLen,
      kwCount,
      hasImage,
      titleOk,
      descOk,
      health,
      canonicalUrl
    };
  };

  // Change single field in draft
  const handleFieldChange = (p: Project, field: 'metaTitle' | 'metaDescription' | 'seoKeywords', value: string) => {
    const key = p.id || p.name;
    const current = getRowSeoData(p);
    setDrafts(prev => ({
      ...prev,
      [key]: {
        metaTitle: field === 'metaTitle' ? value : current.metaTitle,
        metaDescription: field === 'metaDescription' ? value : current.metaDescription,
        seoKeywords: field === 'seoKeywords' ? value : current.seoKeywords,
        ogImage: current.ogImage,
        isDirty: true
      }
    }));
  };

  // Reset single row to original or auto-generated defaults
  const handleAutoGenerateSingle = (p: Project) => {
    const defaultTitle = getDefaultTitle(p);
    const defaultDesc = getDefaultDescription(p);
    const defaultKeywords = `${p.name}, ${p.name} Bangalore, Buy ${p.propertyType} in ${p.zone}, 0% Brokerage, RERA Approved, BS Homez`;
    const key = p.id || p.name;
    
    setDrafts(prev => ({
      ...prev,
      [key]: {
        metaTitle: defaultTitle,
        metaDescription: defaultDesc,
        seoKeywords: defaultKeywords,
        ogImage: p.ogImage || p.imageUrls?.[0] || '',
        isDirty: true
      }
    }));
    showToast(`Generated optimal meta tags for "${p.name}"!`, 'info', 2500);
  };

  // Save single row to persistent store
  const handleSaveSingle = async (p: Project) => {
    const row = getRowSeoData(p);
    const key = p.id || p.name;
    setSavingId(key);

    try {
      const parsedKeywords = row.seoKeywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      const updatedProject: Project = {
        ...p,
        metaTitle: row.metaTitle.trim(),
        metaDescription: row.metaDescription.trim(),
        seoKeywords: parsedKeywords,
        ogImage: row.ogImage.trim() || p.imageUrls?.[0] || '',
        seoLastSyncedAt: new Date().toISOString()
      };

      if (onSaveProject) {
        await onSaveProject(updatedProject);
      }

      // Clear dirty draft for this item
      setDrafts(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      showToast(`Saved SEO metadata for "${p.name}"!`, 'success');
    } catch (err: any) {
      console.error('Save single error:', err);
      showToast(`Failed to save "${p.name}": ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setSavingId(null);
    }
  };

  // Requirement: Bulk synchronization button that pushes all pending changes in the SEO draft state to Firestore in one operation, while notifying the sitemap refresh service
  const handleBulkSaveAll = async () => {
    const dirtyProjects = validProjects.filter(p => getRowSeoData(p).isDirty);

    if (dirtyProjects.length === 0) {
      showToast('No pending changes in the SEO draft state to synchronize.', 'info');
      return;
    }

    setIsBulkSaving(true);
    const nowIso = new Date().toISOString();

    try {
      // 1. Push all pending changes in the SEO draft state to Firestore in ONE operation
      const batch = writeBatch(db);
      let writeCount = 0;

      dirtyProjects.forEach(p => {
        const row = getRowSeoData(p);
        const parsedKeywords = row.seoKeywords
          .split(',')
          .map(k => k.trim())
          .filter(Boolean);

        const metaTitle = row.metaTitle.trim();
        const metaDescription = row.metaDescription.trim();
        const ogImage = row.ogImage.trim() || p.imageUrls?.[0] || '';

        if (p.id && !p.id.startsWith('curated_') && !p.id.startsWith('local_')) {
          const docRef = doc(db, 'projects', p.id);
          batch.update(docRef, {
            metaTitle,
            seoTitle: metaTitle,
            metaDescription,
            seoDescription: metaDescription,
            seoKeywords: parsedKeywords,
            ogImage,
            seoLastSyncedAt: nowIso,
            seoLastEdited: nowIso,
            updatedAt: nowIso
          });
          writeCount++;
        }

        // Also update local in-memory project state
        if (onSaveProject) {
          onSaveProject({
            ...p,
            metaTitle,
            seoTitle: metaTitle,
            metaDescription,
            seoDescription: metaDescription,
            seoKeywords: parsedKeywords,
            ogImage,
            seoLastSyncedAt: nowIso,
            seoLastEdited: nowIso,
            updatedAt: nowIso
          });
        }
      });

      if (writeCount > 0) {
        try {
          await batch.commit();
        } catch (fErr) {
          handleFirestoreError(fErr, OperationType.UPDATE, 'projects');
        }
      }

      // 2. Notify the sitemap refresh service
      try {
        await fetch('/api/sitemap/refresh', { method: 'POST' });
      } catch (sitemapErr) {
        console.warn('Sitemap refresh service warning:', sitemapErr);
      }
      if (onBatchSyncSitemap) {
        await onBatchSyncSitemap();
      }

      // 3. Clear draft state
      setDrafts({});
      showToast(`Bulk synchronization complete! Pushed all ${dirtyProjects.length} pending draft changes to Firestore in 1 atomic operation & notified sitemap refresh service.`, 'success', 5000);
    } catch (err: any) {
      console.error('Bulk synchronization error:', err);
      showToast(`Bulk synchronization error: ${err.message || 'Check network connection'}`, 'error');
    } finally {
      setIsBulkSaving(false);
    }
  };

  const [isGeminiBatchProcessing, setIsGeminiBatchProcessing] = useState(false);

  // Requirement: 'Bulk Fix All' function that identifies all projects with 'needs_attention' health, uses Gemini API to generate missing meta titles, descriptions, and alt tags for all images, and performs a single bulk write batch to Firestore
  const handleBulkFixAll = async () => {
    const targetProjects = validProjects.filter(p => {
      const row = getRowSeoData(p);
      return row.health === 'needs_attention';
    });

    if (targetProjects.length === 0) {
      showToast('All portfolio projects are already SEO-optimized! No projects with "needs_attention" status.', 'info');
      return;
    }

    setIsGeminiBatchProcessing(true);
    showToast(`Gemini 3.8 Flash analyzing and generating SEO metadata & accessible alt tags for all images across ${targetProjects.length} properties...`, 'info', 6000);

    try {
      const payload = targetProjects.map(p => {
        const row = getRowSeoData(p);
        return {
          id: p.id || p.name,
          name: p.name,
          location: p.location,
          zone: p.zone,
          propertyType: p.propertyType,
          type: p.type,
          price: p.price,
          reraNumber: p.reraNumber,
          features: p.features || [],
          imageUrls: p.imageUrls || [],
          mobileImageUrl: p.mobileImageUrl || '',
          floorPlanImageUrl: p.floorPlanImageUrl || '',
          currentTitle: row.metaTitle,
          currentKeywords: p.seoKeywords || [],
          currentDescription: row.metaDescription,
          currentAltText: (p as any).imageAltText || '',
          currentAltTexts: (p as any).imageAltTexts || {}
        };
      });

      const res = await fetch('/api/gemini/batch-seo-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: payload })
      });

      const data = await res.json();
      if (!data || !data.success || !Array.isArray(data.results)) {
        throw new Error(data?.error || 'Failed to generate metadata and alt tags via Gemini API');
      }

      const resultsMap: Record<string, { 
        metaTitle: string; 
        seoKeywords: string[]; 
        metaDescription: string;
        imageAltText: string;
        imageAltTexts: Record<string, string>;
      }> = {};

      data.results.forEach((r: any) => {
        resultsMap[r.projectId] = {
          metaTitle: r.metaTitle,
          seoKeywords: r.seoKeywords || [],
          metaDescription: r.metaDescription,
          imageAltText: r.imageAltText || '',
          imageAltTexts: r.imageAltTexts || {}
        };
      });

      const nowIso = new Date().toISOString();

      // Single bulk write batch to Firestore for all needs_attention projects
      const batch = writeBatch(db);
      let writeCount = 0;

      targetProjects.forEach(p => {
        const enhanced = resultsMap[p.id || p.name];
        if (enhanced && p.id && !p.id.startsWith('curated_') && !p.id.startsWith('local_')) {
          const docRef = doc(db, 'projects', p.id);
          batch.update(docRef, {
            metaTitle: enhanced.metaTitle,
            seoTitle: enhanced.metaTitle,
            seoKeywords: enhanced.seoKeywords,
            metaDescription: enhanced.metaDescription,
            seoDescription: enhanced.metaDescription,
            imageAltText: enhanced.imageAltText,
            imageAltTexts: enhanced.imageAltTexts,
            seoLastEdited: nowIso,
            seoLastSyncedAt: nowIso,
            updatedAt: nowIso
          });
          writeCount++;
        }
      });

      if (writeCount > 0) {
        try {
          await batch.commit();
        } catch (fErr) {
          handleFirestoreError(fErr, OperationType.UPDATE, 'projects');
        }
      }

      // Update local drafts and sync with parent state
      const nextDrafts = { ...drafts };
      targetProjects.forEach(p => {
        const enhanced = resultsMap[p.id || p.name];
        if (enhanced) {
          const key = p.id || p.name;
          nextDrafts[key] = {
            metaTitle: enhanced.metaTitle,
            metaDescription: enhanced.metaDescription,
            seoKeywords: enhanced.seoKeywords.join(', '),
            ogImage: p.ogImage || p.imageUrls?.[0] || '',
            isDirty: false
          };
          if (onSaveProject) {
            onSaveProject({
              ...p,
              metaTitle: enhanced.metaTitle,
              seoTitle: enhanced.metaTitle,
              seoKeywords: enhanced.seoKeywords,
              metaDescription: enhanced.metaDescription,
              seoDescription: enhanced.metaDescription,
              imageAltText: enhanced.imageAltText,
              imageAltTexts: enhanced.imageAltTexts,
              seoLastEdited: nowIso,
              seoLastSyncedAt: nowIso,
              updatedAt: nowIso
            });
          }
        }
      });
      setDrafts(nextDrafts);

      // Trigger background sitemap update
      fetch('/api/sitemap/refresh', { method: 'POST' }).catch(() => {});
      if (onBatchSyncSitemap) {
        onBatchSyncSitemap().catch(() => {});
      }

      showToast(`Bulk Fix All complete! Enhanced ${targetProjects.length} projects with meta titles, descriptions, keywords, and alt tags for all images via Gemini in 1 bulk Firestore write batch!`, 'success', 5000);
    } catch (err: any) {
      console.error('Bulk Fix All Gemini error:', err);
      showToast(`Bulk Fix All error: ${err.message || 'Operation failed'}`, 'error');
    } finally {
      setIsGeminiBatchProcessing(false);
    }
  };

  const handleBatchProcessNeedsAttentionGemini = handleBulkFixAll;

  // Bulk auto-generate optimal titles & descriptions for all projects that need attention
  const handleAutoGenerateAllMissing = () => {
    let count = 0;
    const nextDrafts = { ...drafts };

    validProjects.forEach(p => {
      const row = getRowSeoData(p);
      if (row.health === 'needs_attention' || !p.metaTitle || !p.metaDescription) {
        const key = p.id || p.name;
        nextDrafts[key] = {
          metaTitle: getDefaultTitle(p),
          metaDescription: getDefaultDescription(p),
          seoKeywords: row.seoKeywords || `${p.name}, Buy ${p.propertyType} in ${p.zone}, 0% Brokerage, RERA Approved, BS Homez`,
          ogImage: row.ogImage,
          isDirty: true
        };
        count++;
      }
    });

    setDrafts(nextDrafts);
    showToast(`Auto-generated optimal titles & descriptions for ${count} portfolio projects! Review and click "Save All Changes".`, 'success', 4500);
  };

  // Discard all unsaved drafts
  const handleDiscardAll = () => {
    setDrafts({});
    showToast('All unsaved SEO drafts have been reverted.', 'info');
  };

  // Export comprehensive CSV for SEO Team
  const handleExportSeoTeamCsv = () => {
    const headers = [
      "Project ID",
      "Project Name",
      "Developer",
      "Category",
      "Property Type",
      "Bangalore Zone",
      "Location Address",
      "Price / Rent",
      "RERA Registration",
      "Handover Status",
      "SEO Title Tag",
      "Title Length (Chars)",
      "Title Quality Status",
      "SEO Meta Description",
      "Description Length (Chars)",
      "Description Quality Status",
      "Focus SEO Keywords",
      "Target Canonical URL",
      "OG Social Image URL",
      "Overall SEO Health",
      "Last Synced Timestamp"
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = validProjects.map(p => {
      const row = getRowSeoData(p);
      return [
        escapeCsv(p.id || ''),
        escapeCsv(p.name),
        escapeCsv(p.builderName || 'BS Homez Verified Developer'),
        escapeCsv(p.type || 'Primary'),
        escapeCsv(p.propertyType || 'Apartment'),
        escapeCsv(p.zone || 'Whitefield'),
        escapeCsv(p.location || ''),
        escapeCsv(p.price || ''),
        escapeCsv(p.reraNumber || 'Verified'),
        escapeCsv(p.handoverStatus || 'Available'),
        escapeCsv(row.metaTitle),
        row.titleLen,
        escapeCsv(row.titleOk ? "Optimal (30-70 chars)" : row.titleLen < 30 ? "Too Short (<30)" : "Too Long (>70)"),
        escapeCsv(row.metaDescription),
        row.descLen,
        escapeCsv(row.descOk ? "Optimal (110-165 chars)" : row.descLen < 110 ? "Too Short (<110)" : "Too Long (>165)"),
        escapeCsv(row.seoKeywords),
        escapeCsv(row.canonicalUrl),
        escapeCsv(row.ogImage),
        escapeCsv(row.health === 'optimized' ? "OPTIMIZED" : "NEEDS_ATTENTION"),
        escapeCsv(p.seoLastSyncedAt || new Date().toISOString())
      ].join(',');
    });

    const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `bshomez_seo_portfolio_audit_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported complete SEO Audit file with ${validProjects.length} projects for the SEO team!`, 'success', 4000);
  };

  // Requirement: 'Generate SEO Audit Report' Handler
  // Compiles a summary of missing alt text for all images in the project and provides a downloadable CSV report for the admin
  const handleGenerateAltTextAuditReport = () => {
    const audit = compilePortfolioImageAltAudit(validProjects);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadSeoAuditCsv(
      audit.items,
      `seo_alt_text_audit_portfolio_${dateStr}.csv`,
      'BS Homez Full Portfolio Image Accessibility & SEO Alt Text Audit'
    );
    setIsAltAuditModalOpen(true);
    showToast(
      `Audited ${audit.totalImages} images across ${audit.totalProjects} projects (${audit.missingCount} missing alt text). Downloaded CSV report!`,
      'success',
      4500
    );
  };

  // Copy canonical URL helper
  const handleCopyCanonical = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Overall statistics
  const stats = useMemo(() => {
    let optimalTitles = 0;
    let optimalDescriptions = 0;
    let optimizedCount = 0;
    let dirtyCount = 0;

    validProjects.forEach(p => {
      const row = getRowSeoData(p);
      if (row.titleOk) optimalTitles++;
      if (row.descOk) optimalDescriptions++;
      if (row.health === 'optimized') optimizedCount++;
      if (row.isDirty) dirtyCount++;
    });

    return {
      total: validProjects.length,
      optimalTitles,
      optimalDescriptions,
      optimizedCount,
      needsAttentionCount: validProjects.length - optimizedCount,
      dirtyCount
    };
  }, [validProjects, drafts]);
  // Data for Recharts Bar Chart: Needs Attention vs Optimized
  const overallChartData = useMemo(() => {
    return [
      {
        name: 'Needs Attention',
        statusKey: 'needs_attention' as const,
        count: stats.needsAttentionCount,
        fill: '#f59e0b',
        percentage: stats.total > 0 ? Math.round((stats.needsAttentionCount / stats.total) * 100) : 0,
        tip: 'Missing optimal SERP title length, description, or images'
      },
      {
        name: 'Optimized',
        statusKey: 'optimized' as const,
        count: stats.optimizedCount,
        fill: '#10b981',
        percentage: stats.total > 0 ? Math.round((stats.optimizedCount / stats.total) * 100) : 0,
        tip: 'Optimal title (30-70 chars), description (110-165 chars), and visual assets'
      }
    ];
  }, [stats]);

  const categoryChartData = useMemo(() => {
    const counts = {
      Primary: { needs_attention: 0, optimized: 0, total: 0 },
      Rental: { needs_attention: 0, optimized: 0, total: 0 },
      Resale: { needs_attention: 0, optimized: 0, total: 0 }
    };

    validProjects.forEach(p => {
      const row = getRowSeoData(p);
      const catKey: 'Primary' | 'Rental' | 'Resale' = 
        p.type === 'Rental' ? 'Rental' : p.type === 'Resale' ? 'Resale' : 'Primary';
      
      counts[catKey].total++;
      if (row.health === 'optimized') {
        counts[catKey].optimized++;
      } else {
        counts[catKey].needs_attention++;
      }
    });

    return [
      {
        category: 'Primary (0% Fee)',
        categoryKey: 'Primary',
        needs_attention: counts.Primary.needs_attention,
        optimized: counts.Primary.optimized,
        total: counts.Primary.total
      },
      {
        category: 'Rental Portfolios',
        categoryKey: 'Rental',
        needs_attention: counts.Rental.needs_attention,
        optimized: counts.Rental.optimized,
        total: counts.Rental.total
      },
      {
        category: 'Verified Resale',
        categoryKey: 'Resale',
        needs_attention: counts.Resale.needs_attention,
        optimized: counts.Resale.optimized,
        total: counts.Resale.total
      }
    ];
  }, [validProjects, drafts]);

  // Filtered project list for displayed rows
  const displayedProjects = useMemo(() => {
    return validProjects.filter(p => {
      const row = getRowSeoData(p);

      // Category Filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'Primary' && (p.type === 'Rental' || p.type === 'Resale')) return false;
        if (categoryFilter === 'Rental' && p.type !== 'Rental') return false;
        if (categoryFilter === 'Resale' && p.type !== 'Resale') return false;
      }

      // Zone Filter
      if (zoneFilter !== 'all' && p.zone !== zoneFilter) {
        return false;
      }

      // Health Filter
      if (healthFilter === 'optimized' && row.health !== 'optimized') return false;
      if (healthFilter === 'needs_attention' && row.health !== 'needs_attention') return false;
      if (healthFilter === 'dirty_only' && !row.isDirty) return false;

      // Search Query: Filter by project name, corridor, or builder name
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match = 
          (p.name || '').toLowerCase().includes(q) ||
          (p.zone || '').toLowerCase().includes(q) ||
          ((p as any).corridor || '').toLowerCase().includes(q) ||
          (p.location || '').toLowerCase().includes(q) ||
          (p.locationTarget || '').toLowerCase().includes(q) ||
          (p.builderName || '').toLowerCase().includes(q) ||
          ((p as any).builder || '').toLowerCase().includes(q) ||
          (p.propertyType || '').toLowerCase().includes(q) ||
          row.metaTitle.toLowerCase().includes(q) ||
          row.metaDescription.toLowerCase().includes(q) ||
          row.seoKeywords.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [validProjects, categoryFilter, zoneFilter, healthFilter, searchQuery, drafts]);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-md shadow-2xl flex items-center gap-3 text-xs font-mono font-bold border ${
              toast.type === 'success' 
                ? 'bg-emerald-950 text-emerald-200 border-emerald-500/50' 
                : toast.type === 'error'
                ? 'bg-red-950 text-red-200 border-red-500/50'
                : 'bg-art-gold/20 text-art-gold border-art-gold/40'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : toast.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Mission Banner */}
      <div className="bg-gradient-to-r from-neutral-950 via-art-dark to-neutral-950 border border-art-gold/30 p-6 sm:p-7 rounded-sm shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-art-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-black text-art-gold">
                Admin Exclusive • Real-Time Search Engine Optimization
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-white font-bold">
              Bulk Meta &amp; Title Tag <span className="not-italic text-art-gold">Manager</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1.5 leading-relaxed font-sans">
              Audit, batch-edit, and synchronize Google SERP Title Tags and Meta Descriptions across your entire Bangalore portfolio. Export comprehensive technical data for your SEO and marketing teams.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Requirement: 'Generate SEO Audit Report' Button */}
            <button
              type="button"
              data-testid="generate-seo-audit-report-admin-btn"
              onClick={handleGenerateAltTextAuditReport}
              className="generate-seo-audit-report-btn px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              title="Compiles a summary of missing alt text for all images in the portfolio and provides a downloadable CSV report for the admin"
            >
              <FileSpreadsheet size={15} />
              <span>Generate SEO Audit Report</span>
            </button>

            <button
              type="button"
              onClick={handleExportSeoTeamCsv}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              title="Download clean CSV report with all project titles, descriptions, lengths, and canonical links"
            >
              <FileSpreadsheet size={15} />
              <span>Export for SEO Team (CSV)</span>
            </button>

            {onBatchSyncSitemap && (
              <button
                type="button"
                disabled={isSyncingSitemap}
                onClick={onBatchSyncSitemap}
                className="px-4 py-2.5 bg-art-gold/15 hover:bg-art-gold hover:text-black text-art-gold border border-art-gold/40 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                title="Regenerate public/sitemap.xml with live bshomez.in URLs and notify search bots"
              >
                <RefreshCw size={14} className={isSyncingSitemap ? "animate-spin" : ""} />
                <span>Sync XML Sitemap</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-Time SEO Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-sm">
            <span className="text-[9px] uppercase tracking-wider text-white/50 block font-mono">Total Portfolio</span>
            <span className="text-2xl font-serif font-bold text-white mt-1 block">{stats.total}</span>
            <span className="text-[9px] text-white/40 font-mono">Live listings audited</span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-sm">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-mono">Optimal Titles</span>
            <span className="text-2xl font-serif font-bold text-emerald-400 mt-1 block">
              {stats.optimalTitles} <span className="text-xs text-white/40 font-mono">/ {stats.total}</span>
            </span>
            <span className="text-[9px] text-white/40 font-mono">30 - 70 characters</span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-sm">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-mono">Optimal Descriptions</span>
            <span className="text-2xl font-serif font-bold text-emerald-400 mt-1 block">
              {stats.optimalDescriptions} <span className="text-xs text-white/40 font-mono">/ {stats.total}</span>
            </span>
            <span className="text-[9px] text-white/40 font-mono">110 - 165 characters</span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-sm">
            <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-mono">Needs Attention</span>
            <span className="text-2xl font-serif font-bold text-amber-400 mt-1 block">{stats.needsAttentionCount}</span>
            <span className="text-[9px] text-white/40 font-mono">Missing or length alert</span>
          </div>

          <div className="p-3.5 bg-art-gold/[0.06] border border-art-gold/30 rounded-sm">
            <span className="text-[9px] uppercase tracking-wider text-art-gold block font-mono">Unsaved Edits</span>
            <span className="text-2xl font-serif font-bold text-art-gold mt-1 block">{stats.dirtyCount}</span>
            <span className="text-[9px] text-white/40 font-mono">Pending batch commit</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics: Needs Attention vs Optimized Bar Chart (Recharts) */}
      <div 
        data-testid="seo-audit-barchart-container"
        className="bg-[#111111] border border-white/10 rounded-sm p-5 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-art-gold" />
              <h3 className="text-base font-serif italic text-white font-bold">
                SEO Audit Health Distribution: <span className="not-italic text-amber-400">Needs Attention</span> vs. <span className="not-italic text-emerald-400">Optimized</span>
              </h3>
            </div>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Live portfolio compliance analysis against Google SERP length &amp; visual metadata standards. Click any bar to filter the audit table below.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {healthFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setHealthFilter('all')}
                className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear health filter"
              >
                <X size={11} />
                <span>Filter: {healthFilter === 'needs_attention' ? 'Needs Attention' : healthFilter === 'optimized' ? 'Optimized' : healthFilter} (Clear)</span>
              </button>
            )}

            <div className="flex items-center bg-black/60 border border-white/15 p-0.5 rounded-sm">
              <button
                type="button"
                data-testid="chart-mode-overall-btn"
                onClick={() => setChartMode('overall')}
                className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                  chartMode === 'overall' 
                    ? 'bg-art-gold text-black shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Overall View
              </button>
              <button
                type="button"
                data-testid="chart-mode-category-btn"
                onClick={() => setChartMode('by_category')}
                className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                  chartMode === 'by_category' 
                    ? 'bg-art-gold text-black shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                By Category
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="w-full h-[240px]" data-testid="seo-health-chart">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'overall' ? (
              <BarChart data={overallChartData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#737373" 
                  tick={{ fill: '#d4d4d4', fontSize: 11, fontFamily: 'monospace' }} 
                />
                <YAxis 
                  allowDecimals={false} 
                  stroke="#737373" 
                  tick={{ fill: '#888888', fontSize: 10, fontFamily: 'monospace' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#141414] border border-white/20 p-3 rounded-sm shadow-2xl text-xs font-mono">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
                            <span className="font-bold text-white uppercase">{data.name}</span>
                          </div>
                          <p className="text-white text-sm font-bold">{data.count} Projects ({data.percentage}%)</p>
                          <p className="text-[10px] text-white/50 mt-1">{data.tip}</p>
                          <p className="text-[9px] text-art-gold/90 mt-1.5 italic">👉 Click bar to filter table below</p>
                        </div>
                      );
                    }
                    return null;
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]} 
                  cursor="pointer"
                  onClick={(entry: any) => {
                    const key = entry?.statusKey || entry?.payload?.statusKey;
                    if (key) {
                      setHealthFilter(key);
                    }
                  }}
                >
                  {overallChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={categoryChartData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  stroke="#737373" 
                  tick={{ fill: '#d4d4d4', fontSize: 11, fontFamily: 'monospace' }} 
                />
                <YAxis 
                  allowDecimals={false} 
                  stroke="#737373" 
                  tick={{ fill: '#888888', fontSize: 10, fontFamily: 'monospace' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#141414] border border-white/20 p-3 rounded-sm shadow-2xl text-xs font-mono">
                          <p className="font-bold text-white mb-2">{label}</p>
                          {payload.map((entry: any, index: number) => (
                            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px] mb-1">
                              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.name}:
                              </span>
                              <span className="font-bold text-white">{entry.value}</span>
                            </div>
                          ))}
                          <p className="text-[9px] text-white/40 border-t border-white/10 pt-1 mt-1">
                            Total: {payload[0]?.payload?.total} listings
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Bar 
                  dataKey="needs_attention" 
                  name="Needs Attention" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]} 
                  cursor="pointer"
                  onClick={() => setHealthFilter('needs_attention')}
                />
                <Bar 
                  dataKey="optimized" 
                  name="Optimized" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  cursor="pointer"
                  onClick={() => setHealthFilter('optimized')}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Bottom Quick-Action Filter Bar */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-3 text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Needs Attention: <strong className="text-amber-400">{stats.needsAttentionCount}</strong> ({stats.total > 0 ? Math.round((stats.needsAttentionCount / stats.total) * 100) : 0}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Optimized: <strong className="text-emerald-400">{stats.optimizedCount}</strong> ({stats.total > 0 ? Math.round((stats.optimizedCount / stats.total) * 100) : 0}%)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-white/40">Quick Filter:</span>
            <button
              type="button"
              onClick={() => setHealthFilter('needs_attention')}
              className={`px-2 py-0.5 rounded text-[9px] border transition-all cursor-pointer ${
                healthFilter === 'needs_attention' 
                  ? 'bg-amber-500 text-black border-amber-400 font-bold' 
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              Filter Needs Attention ({stats.needsAttentionCount})
            </button>
            <button
              type="button"
              onClick={() => setHealthFilter('optimized')}
              className={`px-2 py-0.5 rounded text-[9px] border transition-all cursor-pointer ${
                healthFilter === 'optimized' 
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold' 
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              Filter Optimized ({stats.optimizedCount})
            </button>
            {healthFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setHealthFilter('all')}
                className="px-2 py-0.5 rounded text-[9px] bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
              >
                Show All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Management Toolbar: Search, Filters & Batch Triggers */}
      <div className="p-4 sm:p-5 bg-[#141414] border border-white/10 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input Field */}
        <div className="relative flex-1 min-w-[280px]">
          <label htmlFor="seo-audit-search-input" className="sr-only">
            Filter project list by project name, corridor, or builder name
          </label>
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-art-gold/80 pointer-events-none" />
          <input
            id="seo-audit-search-input"
            name="seo-audit-search-input"
            type="text"
            data-testid="seo-audit-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name, corridor, or builder name..."
            aria-label="Search by project name, corridor, or builder name"
            className="w-full pl-9 pr-9 py-2 bg-black/60 border border-white/15 focus:border-art-gold rounded-sm text-xs text-white placeholder-white/40 focus:outline-none font-mono transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              data-testid="clear-seo-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 rounded transition-colors cursor-pointer"
              aria-label="Clear search query"
              title="Clear search query"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 bg-black/60 border border-white/15 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-art-gold cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Primary">Primary (0% Fee)</option>
            <option value="Rental">Rentals</option>
            <option value="Resale">Resale</option>
          </select>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-2 bg-black/60 border border-white/15 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-art-gold cursor-pointer"
          >
            <option value="all">All Corridors ({uniqueZones.length})</option>
            {uniqueZones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          {/* Health Filter */}
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value as any)}
            className="px-3 py-2 bg-black/60 border border-white/15 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-art-gold cursor-pointer"
          >
            <option value="all">All Health States</option>
            <option value="needs_attention">⚠️ Needs Attention ({stats.needsAttentionCount})</option>
            <option value="optimized">✅ Fully Optimized ({stats.optimizedCount})</option>
            <option value="dirty_only">✏️ Unsaved Edits Only ({stats.dirtyCount})</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 flex-wrap">
          {/* Requirement: 'Bulk Fix All' button that identifies all projects with 'needs_attention' health, uses Gemini API to generate missing meta titles, descriptions, and alt tags for all images, and performs a single bulk write batch to Firestore */}
          <button
            type="button"
            disabled={isGeminiBatchProcessing}
            onClick={handleBulkFixAll}
            data-testid="bulk-fix-all-btn"
            className="px-3.5 py-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-[10px] uppercase font-mono tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-60"
            title="Bulk Fix All: identifies all projects with 'needs_attention' health, uses Gemini API to generate missing meta titles, descriptions, and alt tags for all images, and performs a single bulk write batch to Firestore"
          >
            {isGeminiBatchProcessing ? (
              <RefreshCw size={13} className="animate-spin text-white" />
            ) : (
              <Sparkles size={13} className="text-amber-300" />
            )}
            <span>Bulk Fix All ({stats.needsAttentionCount})</span>
          </button>

          <button
            type="button"
            onClick={handleAutoGenerateAllMissing}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 text-[10px] uppercase font-mono font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Auto-fill recommended titles and descriptions for projects needing attention"
          >
            <Wand2 size={13} className="text-art-gold" />
            <span className="hidden sm:inline">Auto-Fill</span> Needs Attention
          </button>

          {/* Requirement: Bulk synchronization button pushing all pending SEO draft changes to Firestore in 1 operation while notifying sitemap service */}
          <button
            type="button"
            disabled={isBulkSaving || stats.dirtyCount === 0}
            onClick={handleBulkSaveAll}
            data-testid="bulk-sync-seo-drafts-btn"
            className={`px-4 py-2 font-black uppercase text-[10px] tracking-widest rounded-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              stats.dirtyCount > 0
                ? 'bg-art-gold hover:bg-white text-black shadow-[0_0_15px_rgba(197,160,89,0.35)]'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
            title="Bulk synchronize all pending changes in the SEO draft state to Firestore in one operation and refresh sitemap service"
          >
            {isBulkSaving ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Syncing to Firestore &amp; Sitemap...</span>
              </>
            ) : (
              <>
                <Save size={13} />
                <span>Bulk Synchronize SEO ({stats.dirtyCount})</span>
              </>
            )}
          </button>

          {stats.dirtyCount > 0 && (
            <button
              type="button"
              onClick={handleDiscardAll}
              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] uppercase font-mono font-bold tracking-wider rounded-sm transition-all flex items-center gap-1 cursor-pointer"
              title="Discard all pending changes"
            >
              <Undo2 size={13} />
              <span>Discard ({stats.dirtyCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Showing count indicator and active search status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-white/50 px-1 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span>Showing {displayedProjects.length} of {validProjects.length} portfolio properties</span>
          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-art-gold/15 text-art-gold border border-art-gold/30 text-[11px]">
              <span>Filter: "{searchQuery.trim()}"</span>
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="hover:text-white cursor-pointer ml-1"
                title="Clear search"
              >
                ✕
              </button>
            </span>
          )}
        </div>
        {stats.dirtyCount > 0 && (
          <span className="text-art-gold font-bold">● {stats.dirtyCount} unsaved projects in memory</span>
        )}
      </div>

      {/* Bulk Editable Table & Project Rows */}
      <div className="space-y-4">
        {displayedProjects.length === 0 ? (
          <div className="p-16 text-center bg-[#111111] border border-dashed border-white/15 rounded-sm space-y-2">
            <Search size={28} className="mx-auto text-white/30" />
            <p className="text-sm text-white/60 font-serif italic">
              {searchQuery.trim()
                ? `No portfolio projects found matching "${searchQuery.trim()}". Try searching by another project name, corridor, or builder name.`
                : 'No portfolio projects match your active search or filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setHealthFilter('all');
                setZoneFilter('all');
              }}
              className="text-xs font-mono text-art-gold underline cursor-pointer hover:text-white"
            >
              Reset all filters & search
            </button>
          </div>
        ) : (
          displayedProjects.map((p, idx) => {
            const key = p.id || p.name;
            const row = getRowSeoData(p);
            const isSavingThis = savingId === key;

            return (
              <div
                key={key}
                className={`p-5 bg-[#111111] border rounded-md transition-all space-y-4 relative ${
                  row.isDirty 
                    ? 'border-art-gold/80 shadow-[0_0_20px_rgba(197,160,89,0.15)] bg-gradient-to-r from-art-gold/[0.02] to-transparent' 
                    : row.health === 'optimized'
                    ? 'border-white/10 hover:border-white/25'
                    : 'border-amber-500/40 bg-amber-500/[0.015]'
                }`}
              >
                {/* Row Header: Project Details & Meta Status Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail Image */}
                    <div className="w-14 h-14 rounded bg-neutral-900 border border-white/15 overflow-hidden shrink-0 relative">
                      <img
                        src={row.ogImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=75"}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                          #{idx + 1}
                        </span>
                        <span className={`text-[9px] uppercase tracking-wider font-mono font-black px-2 py-0.5 rounded border ${
                          p.type === 'Rental' 
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : p.type === 'Resale'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-art-gold/15 text-art-gold border-art-gold/30'
                        }`}>
                          {p.type || 'Primary'} • {p.propertyType || 'Apartment'}
                        </span>
                        <span className="text-[10px] text-white/50 font-mono flex items-center gap-1">
                          <MapPin size={11} className="text-art-gold" />
                          {p.location} ({p.zone})
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-serif italic text-white font-bold flex items-center gap-2">
                        <span>{p.name}</span>
                        {p.builderName && (
                          <span className="text-xs font-mono not-italic text-white/40 font-normal">
                            by {p.builderName}
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  {/* Right Header Status & Action Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Health Status Pill */}
                    <span className={`text-[9.5px] uppercase font-mono font-bold px-2.5 py-1 rounded-sm border flex items-center gap-1.5 ${
                      row.health === 'optimized'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {row.health === 'optimized' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      <span>{row.health === 'optimized' ? 'Optimal' : 'Needs Optimization'}</span>
                    </span>

                    {/* Preview Google Snippet Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewSnippetProject(p)}
                      className="p-1.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white rounded border border-white/10 transition-colors cursor-pointer"
                      title="Preview live Google SERP snippet"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Auto-suggest button */}
                    <button
                      type="button"
                      onClick={() => handleAutoGenerateSingle(p)}
                      className="p-1.5 bg-art-gold/10 hover:bg-art-gold hover:text-black text-art-gold rounded border border-art-gold/30 transition-all cursor-pointer"
                      title="Auto-fill optimal title and meta description"
                    >
                      <Wand2 size={14} />
                    </button>

                    {/* Single Save Button */}
                    <button
                      type="button"
                      disabled={!row.isDirty || isSavingThis}
                      onClick={() => handleSaveSingle(p)}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                        row.isDirty 
                          ? 'bg-art-gold hover:bg-white text-black shadow-md' 
                          : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                      }`}
                      title={row.isDirty ? 'Save changes for this project' : 'No changes to save'}
                    >
                      {isSavingThis ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                      <span>{row.isDirty ? 'Save Row' : 'Saved'}</span>
                    </button>
                  </div>
                </div>

                {/* Inline Bulk Edit Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs font-sans">
                  {/* Left Column: Title Tag (5 Cols) */}
                  <div className="lg:col-span-5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-white/70 flex items-center gap-1">
                        <span>Title Tag (`&lt;title&gt;`)</span>
                        <span className="text-white/40 font-normal">(Optimal: 30-70 chars)</span>
                      </label>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        row.titleOk 
                          ? 'text-emerald-400 bg-emerald-500/10' 
                          : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {row.titleLen} chars
                      </span>
                    </div>

                    <input
                      type="text"
                      value={row.metaTitle}
                      onChange={(e) => handleFieldChange(p, 'metaTitle', e.target.value)}
                      placeholder="e.g. Project Name | Luxury Apartments for Sale in Whitefield | BS Homez"
                      className={`w-full px-3 py-2 bg-black/70 border rounded text-xs text-white placeholder-white/25 focus:outline-none focus:border-art-gold font-sans leading-relaxed ${
                        row.titleOk ? 'border-white/15' : 'border-amber-500/50'
                      }`}
                    />
                    <div className="flex items-center justify-between text-[9px] font-mono text-white/40">
                      <span>Renders as clickable blue title in Google SERP</span>
                      <button
                        type="button"
                        onClick={() => handleFieldChange(p, 'metaTitle', getDefaultTitle(p))}
                        className="hover:text-art-gold underline cursor-pointer"
                      >
                        Reset Title
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Meta Description (7 Cols) */}
                  <div className="lg:col-span-7 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-white/70 flex items-center gap-1">
                        <span>Meta Description (`&lt;meta name="description"&gt;`)</span>
                        <span className="text-white/40 font-normal">(Optimal: 110-165 chars)</span>
                      </label>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        row.descOk 
                          ? 'text-emerald-400 bg-emerald-500/10' 
                          : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {row.descLen} chars
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={row.metaDescription}
                      onChange={(e) => handleFieldChange(p, 'metaDescription', e.target.value)}
                      placeholder="e.g. Discover luxury 3 & 4 BHK residences at Prestige Somerville, Whitefield. 0% brokerage, RERA approved, lake view sky decks. Contact BS Homez."
                      className={`w-full px-3 py-1.5 bg-black/70 border rounded text-xs text-white placeholder-white/25 focus:outline-none focus:border-art-gold font-sans leading-relaxed resize-none ${
                        row.descOk ? 'border-white/15' : 'border-amber-500/50'
                      }`}
                    />
                    <div className="flex items-center justify-between text-[9px] font-mono text-white/40">
                      <span>Previewed in Google Search snippets and WhatsApp/Meta link cards</span>
                      <button
                        type="button"
                        onClick={() => handleFieldChange(p, 'metaDescription', getDefaultDescription(p))}
                        className="hover:text-art-gold underline cursor-pointer"
                      >
                        Reset Description
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Sub-Row: Target Canonical URL & SEO Keywords */}
                <div className="pt-2 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[10px] font-mono text-white/50">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-art-gold font-bold">Canonical:</span>
                    <span className="text-white/70 truncate">{row.canonicalUrl}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCanonical(row.canonicalUrl)}
                      className="p-1 text-white/40 hover:text-white rounded hover:bg-white/10"
                      title="Copy canonical URL"
                    >
                      {copiedLink === row.canonicalUrl ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {p.seoLastSyncedAt && (
                      <span>Last Synced: {p.seoLastSyncedAt.split('T')[0]}</span>
                    )}
                    <a
                      href={row.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-art-gold hover:underline flex items-center gap-1"
                    >
                      <span>View Live Page</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Google SERP Live Snippet Preview Modal */}
      <AnimatePresence>
        {previewSnippetProject && (() => {
          const row = getRowSeoData(previewSnippetProject);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewSnippetProject(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-[#161616] border border-white/20 rounded-lg max-w-xl w-full p-6 sm:p-7 shadow-2xl z-20 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-art-gold" />
                    <div>
                      <h3 className="text-lg font-serif italic text-white font-bold">
                        Google Search Preview
                      </h3>
                      <p className="text-[10px] font-mono text-white/50">
                        Simulated desktop SERP snippet for {previewSnippetProject.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewSnippetProject(null)}
                    className="p-1.5 text-white/40 hover:text-white rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Google Search Card Simulation */}
                <div className="p-5 bg-white rounded-lg shadow-inner text-left font-sans space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-neutral-800">
                    <div className="w-5 h-5 rounded-full bg-art-gold/20 flex items-center justify-center text-[10px]">
                      🏛️
                    </div>
                    <div>
                      <span className="font-medium block text-neutral-900 leading-none">BS Homez Luxury Advisory</span>
                      <span className="text-[11px] text-neutral-500 font-mono leading-none">
                        https://bshomez.in › project › {encodeURIComponent(previewSnippetProject.name.toLowerCase().replace(/\s+/g, '-'))}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug">
                    {row.metaTitle}
                  </h4>

                  <p className="text-xs text-[#4d5156] leading-relaxed">
                    {row.metaDescription}
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded text-[11px] font-mono text-white/60 space-y-1">
                  <div><strong>Title Length:</strong> {row.titleLen} chars ({row.titleOk ? "✅ Optimal" : "⚠️ Needs adjustment"})</div>
                  <div><strong>Description Length:</strong> {row.descLen} chars ({row.descOk ? "✅ Optimal" : "⚠️ Needs adjustment"})</div>
                  <div><strong>Target URL:</strong> {row.canonicalUrl}</div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setPreviewSnippetProject(null)}
                    className="px-5 py-2 bg-art-gold text-black font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-white transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* SEO Alt Text Audit & Downloadable CSV Report Modal */}
      <SeoAuditReportModal
        isOpen={isAltAuditModalOpen}
        onClose={() => setIsAltAuditModalOpen(false)}
        allProjects={validProjects}
      />
    </div>
  );
};
