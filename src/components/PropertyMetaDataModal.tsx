import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Save, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Image as ImageIcon,
  ChevronDown,
  Wand2,
  FileText,
  Eye,
  FileSpreadsheet,
  Clock,
  History,
  RotateCcw,
  User,
  Calendar
} from 'lucide-react';
import { Project, SeoRevisionRecord } from '../types';
import { compileProjectImageAltAudit, downloadSeoAuditCsv, generateRecommendedAltText } from '../lib/seoAuditReport';
import { SeoAuditReportModal } from './SeoAuditReportModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface PropertyMetaDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  initialProject?: Project | null;
  onSaveMetaData: (
    projectId: string, 
    meta: { 
      metaTitle?: string; 
      metaDescription?: string; 
      seoKeywords?: string[];
      imageAltText?: string;
      imageAltTexts?: Record<string, string>;
      seoLastEdited?: string;
      seoRevisions?: SeoRevisionRecord[];
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
  // Sort projects alphabetically
  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [imageAltText, setImageAltText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoGeneratingAll, setIsAutoGeneratingAll] = useState(false);
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'accessibility' | 'preview'>('editor');
  const [imageAltTags, setImageAltTags] = useState<Record<string, string>>({});
  const [isSavingAltTags, setIsSavingAltTags] = useState(false);

  // Revision History & Last Edited States
  const [revisions, setRevisions] = useState<SeoRevisionRecord[]>([]);
  const [isRevisionHistoryOpen, setIsRevisionHistoryOpen] = useState(false);
  const [lastEdited, setLastEdited] = useState<string>('2026-11-07T09:20:00.000Z');

  // Currently selected project
  const currentProject = React.useMemo(() => {
    return projects.find(
      p => p.id === selectedProjectId || p.name === selectedProjectId
    ) || initialProject || projects[0] || null;
  }, [projects, selectedProjectId, initialProject]);

  // List of all images for the selected project
  interface ProjectImageItem {
    id: string;
    url: string;
    role: 'Primary Elevation' | 'Gallery Asset' | 'Mobile Banner' | 'Floor Plan';
    index: number;
  }

  const allProjectImages = React.useMemo<ProjectImageItem[]>(() => {
    if (!currentProject) return [];
    const list: ProjectImageItem[] = [];
    const seenUrls = new Set<string>();

    if (Array.isArray(currentProject.imageUrls)) {
      currentProject.imageUrls.forEach((url, idx) => {
        if (url && typeof url === 'string' && url.trim() && !seenUrls.has(url.trim())) {
          seenUrls.add(url.trim());
          list.push({
            id: `img-${idx}`,
            url: url.trim(),
            role: idx === 0 ? 'Primary Elevation' : 'Gallery Asset',
            index: idx
          });
        }
      });
    }

    if (currentProject.mobileImageUrl && typeof currentProject.mobileImageUrl === 'string' && currentProject.mobileImageUrl.trim() && !seenUrls.has(currentProject.mobileImageUrl.trim())) {
      seenUrls.add(currentProject.mobileImageUrl.trim());
      list.push({
        id: `img-mob`,
        url: currentProject.mobileImageUrl.trim(),
        role: 'Mobile Banner',
        index: list.length
      });
    }

    if (currentProject.floorPlanImageUrl && typeof currentProject.floorPlanImageUrl === 'string' && currentProject.floorPlanImageUrl.trim() && !seenUrls.has(currentProject.floorPlanImageUrl.trim())) {
      seenUrls.add(currentProject.floorPlanImageUrl.trim());
      list.push({
        id: `img-fp`,
        url: currentProject.floorPlanImageUrl.trim(),
        role: 'Floor Plan',
        index: list.length
      });
    }

    return list;
  }, [currentProject]);

  // Sync state whenever modal opens or currentProject changes
  useEffect(() => {
    if (isOpen && currentProject) {
      const targetId = currentProject.id || currentProject.name;
      setSelectedProjectId(targetId);
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

      const defaultAlt = (currentProject as any).imageAltText || 
        `${currentProject.name} architectural exterior view - luxury ${currentProject.propertyType.toLowerCase()} in ${currentProject.location}, Bangalore`;
      setImageAltText(defaultAlt);

      // Populate imageAltTags map for Image Accessibility tab
      const initialTagsMap: Record<string, string> = {};
      const existingAltTexts = (currentProject as any).imageAltTexts || {};
      allProjectImages.forEach((img, idx) => {
        if (existingAltTexts[img.url]) {
          initialTagsMap[img.url] = existingAltTexts[img.url];
        } else if (idx === 0) {
          initialTagsMap[img.url] = (currentProject as any).imageAltText || defaultAlt;
        } else {
          initialTagsMap[img.url] = '';
        }
      });
      setImageAltTags(initialTagsMap);

      // Load Revision History & Last Edited Timestamp
      let loadedRevisions: SeoRevisionRecord[] = [];
      if (currentProject.seoRevisions && currentProject.seoRevisions.length > 0) {
        loadedRevisions = [...currentProject.seoRevisions];
      } else {
        try {
          const cached = localStorage.getItem(`bs_homez_seo_revisions_${targetId}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedRevisions = parsed;
            }
          }
        } catch (e) {
          console.warn('Could not read cached revisions:', e);
        }
      }

      const rawLastEdited = (currentProject as any).seoLastEdited || 
        localStorage.getItem(`bs_homez_seo_last_edited_${targetId}`) || 
        (currentProject as any).updatedAt || 
        (currentProject as any).createdAt || 
        '2026-11-07T09:20:00.000Z';

      // If no revisions exist yet, seed with initial baseline snapshot
      if (loadedRevisions.length === 0) {
        const baseline: SeoRevisionRecord = {
          id: `rev_init_${targetId}`,
          version: 1,
          timestamp: typeof rawLastEdited === 'string' ? rawLastEdited : new Date(rawLastEdited).toISOString(),
          author: 'System Baseline',
          changeSummary: 'Initial SEO metadata configuration',
          metaTitle: currentProject.metaTitle || currentProject.seoTitle || `${currentProject.name} in ${currentProject.zone || currentProject.location}, Bangalore | BS Homez`,
          metaDescription: currentProject.metaDescription || currentProject.seoDescription || currentProject.description?.slice(0, 155) || `Explore ${currentProject.name} in ${currentProject.location}. Price: ${currentProject.price}. Verified RERA with BS Homez.`,
          seoKeywords: existingKeywords.length > 0 ? existingKeywords : [
            currentProject.name,
            `${currentProject.name} Bangalore`,
            `${currentProject.propertyType} in ${currentProject.zone || 'Bangalore'}`,
            'BS Homez',
            '0% Brokerage'
          ],
          imageAltText: (currentProject as any).imageAltText || `${currentProject.name} exterior visual - ${currentProject.propertyType} in ${currentProject.location}`
        };
        loadedRevisions = [baseline];
      }

      // Sort newest revisions first
      loadedRevisions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRevisions(loadedRevisions);
      setLastEdited(loadedRevisions[0]?.timestamp || (typeof rawLastEdited === 'string' ? rawLastEdited : new Date().toISOString()));

      setSuccessMessage(null);
      setErrorMessage(null);
      setIsRevisionHistoryOpen(false);
    }
  }, [isOpen, currentProject?.id, currentProject?.name]);

  const formatLastEditedDate = (dateVal?: string | number | null) => {
    if (!dateVal) return 'Nov 7, 2026, 09:20 AM';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Nov 7, 2026, 09:20 AM';
    }
  };

  const handleRestoreRevision = (rev: SeoRevisionRecord) => {
    setMetaTitle(rev.metaTitle);
    setMetaDescription(rev.metaDescription);
    setKeywords([...rev.seoKeywords]);
    if (rev.imageAltText) {
      setImageAltText(rev.imageAltText);
    }
    setSuccessMessage(`Restored Version v${rev.version} (${formatLastEditedDate(rev.timestamp)}) into editor fields! Click 'Save Meta Data' to persist changes.`);
    setIsRevisionHistoryOpen(false);
    setActiveTab('editor');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (!isOpen || !currentProject) return null;

  // Add keyword
  const handleAddKeyword = (kwToAdd?: string) => {
    const raw = kwToAdd !== undefined ? kwToAdd : keywordInput;
    const trimmed = raw.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;

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

  // Helper to construct AI generated meta fields
  const generateMetaFromProject = (proj: Project) => {
    const amenitiesSnippet = (proj.features && proj.features.length > 0)
      ? proj.features.slice(0, 5).join(', ')
      : 'Clubhouse, Swimming Pool, Landscaped Gardens, 24/7 Security';
    
    const descSnippet = proj.description 
      ? proj.description.replace(/\s+/g, ' ').slice(0, 120)
      : `${proj.name} is a premier ${proj.propertyType.toLowerCase()} development in ${proj.location}`;

    // Meta Title (around 55 chars)
    const newTitle = `${proj.name} ${proj.zone ? `in ${proj.zone}` : ''} | ${proj.propertyType} | BS Homez`.slice(0, 60);

    // Meta Description (145-160 chars)
    const newDesc = `${descSnippet}... Features ${amenitiesSnippet}. Price: ${proj.price}. RERA Verified. 0% Brokerage with BS Homez. Inquire today.`.slice(0, 160);

    // Keyword Tags
    const newKeywords = Array.from(new Set([
      proj.name,
      `${proj.name} Bangalore`,
      `${proj.name} Price`,
      `${proj.propertyType} in ${proj.zone || 'Bangalore'}`,
      `${proj.name} Amenities`,
      ...(proj.features || []).slice(0, 3).map(f => `${proj.name} ${f}`),
      '0% Builder Brokerage',
      'RERA Verified Bangalore',
      'BS Homez'
    ])).slice(0, 14);

    return { newTitle, newDesc, newKeywords };
  };

  // Standard AI Generation Handler
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
        setSuccessMessage('AI generated high-ranking SEO titles, descriptions, and keywords!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        throw new Error(data?.error || 'Failed to generate');
      }
    } catch {
      const { newTitle, newDesc, newKeywords } = generateMetaFromProject(currentProject);
      setMetaTitle(newTitle);
      setMetaDescription(newDesc);
      setKeywords(newKeywords);
      setSuccessMessage('Generated optimal SEO meta data from project description and amenities!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } finally {
      setIsGenerating(false);
    }
  };

  // Requirement: 'Auto-Generate All' Button
  // Uses the project's description and amenities to automatically fill the meta title,
  // description, and keyword fields, then triggers the save action immediately!
  const handleAutoGenerateAll = async () => {
    if (!currentProject) return;
    setIsAutoGeneratingAll(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Generate based on description and amenities
      let targetTitle = '';
      let targetDesc = '';
      let targetKeywords: string[] = [];

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
          targetTitle = data.metaTitle || '';
          targetDesc = data.metaDescription || '';
          if (data.keywords) {
            targetKeywords = String(data.keywords).split(',').map(k => k.trim()).filter(Boolean);
          }
        }
      } catch {}

      if (!targetTitle || !targetDesc || targetKeywords.length === 0) {
        const fallback = generateMetaFromProject(currentProject);
        targetTitle = fallback.newTitle;
        targetDesc = fallback.newDesc;
        targetKeywords = fallback.newKeywords;
      }

      setMetaTitle(targetTitle);
      setMetaDescription(targetDesc);
      setKeywords(targetKeywords);

      // Auto-generate Alt Text as well if not already set
      const generatedAlt = `${currentProject.name} luxury ${currentProject.propertyType.toLowerCase()} in ${currentProject.location} featuring ${currentProject.features?.slice(0, 3).join(', ') || 'modern architecture'}`;
      setImageAltText(generatedAlt);

      // 2. Trigger Save Action immediately!
      const targetId = currentProject.id || currentProject.name;
      const nowIso = new Date().toISOString();
      const nextVersion = revisions.length > 0 
        ? Math.max(...revisions.map(r => r.version)) + 1 
        : 1;

      const newRevisionRecord: SeoRevisionRecord = {
        id: `rev_${Date.now()}`,
        version: nextVersion,
        timestamp: nowIso,
        author: 'AI SEO Engine',
        changeSummary: 'Auto-Generated SEO Metadata & Alt Text',
        metaTitle: targetTitle,
        metaDescription: targetDesc,
        seoKeywords: targetKeywords,
        imageAltText: generatedAlt
      };

      const updatedRevisions = [newRevisionRecord, ...revisions];
      setRevisions(updatedRevisions);
      setLastEdited(nowIso);

      try {
        localStorage.setItem(`bs_homez_seo_revisions_${targetId}`, JSON.stringify(updatedRevisions));
        localStorage.setItem(`bs_homez_seo_last_edited_${targetId}`, nowIso);
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      await onSaveMetaData(targetId, {
        metaTitle: targetTitle,
        metaDescription: targetDesc,
        seoKeywords: targetKeywords,
        imageAltText: generatedAlt,
        seoLastEdited: nowIso,
        seoRevisions: updatedRevisions
      });

      setSuccessMessage(`Auto-Generated & Saved all SEO metadata for ${currentProject.name}! Version v${nextVersion} recorded.`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1600);
    } catch (err: any) {
      console.error('Error in Auto-Generate All:', err);
      setErrorMessage(err?.message || 'Failed to auto-generate and save. Please try again.');
    } finally {
      setIsAutoGeneratingAll(false);
    }
  };

  // Requirement: 'Generate Alt Text' Button
  // Uses Gemini to analyze the project's images and description to automatically generate descriptive alt text for accessibility
  const handleGenerateAltText = async () => {
    if (!currentProject) return;
    setIsGeneratingAltText(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/alt-text-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: currentProject.name,
          description: currentProject.description,
          location: currentProject.location,
          propertyType: currentProject.propertyType,
          features: currentProject.features,
          imageUrls: currentProject.imageUrls,
          coverImage: (currentProject.imageUrls && currentProject.imageUrls[0]) || currentProject.mobileImageUrl || ''
        })
      });

      const data = await response.json();
      if (data && data.success && data.altText) {
        setImageAltText(data.altText);
        setSuccessMessage('Gemini analyzed project images & description and generated descriptive accessibility alt text!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        throw new Error(data?.error || 'Gemini alt text generation failed');
      }
    } catch (err: any) {
      // Intelligent accessible fallback
      const amenitiesList = (currentProject.features || []).slice(0, 4).join(', ');
      const promptDescription = currentProject.description?.slice(0, 100) || `${currentProject.name} in ${currentProject.location}`;
      const newAlt = `${currentProject.name} - Architectural view of ${currentProject.type.toLowerCase()} ${currentProject.propertyType.toLowerCase()} in ${currentProject.location}, Bangalore. Showcasing ${amenitiesList || 'landscaped gardens and modern facade'}. ${promptDescription}.`.slice(0, 140);
      
      setImageAltText(newAlt);
      setSuccessMessage('Generated descriptive alt text for accessibility!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setIsGeneratingAltText(false);
    }
  };

  // Requirement: 'Generate SEO Audit Report' Handler
  // Compiles a summary of missing alt text for all images in the project and provides a downloadable CSV report for the admin
  const handleGenerateSeoAuditReport = () => {
    if (!currentProject) return;

    try {
      // 1. Compile the audit summary for all images in this project
      const summary = compileProjectImageAltAudit(currentProject, imageAltText);

      // 2. Trigger instant CSV download
      const dateStr = new Date().toISOString().split('T')[0];
      const targetSlug = currentProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const filename = `seo_alt_text_audit_${targetSlug}_${dateStr}.csv`;
      
      downloadSeoAuditCsv(
        summary.items, 
        filename, 
        `BS Homez SEO Alt Text Audit Report - ${currentProject.name}`
      );

      // 3. Open the on-screen detailed audit modal
      setIsAuditModalOpen(true);
      setSuccessMessage(
        `Audited ${summary.totalImages} images for ${currentProject.name} (${summary.missingCount} missing alt text). Downloaded CSV report!`
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error compiling SEO audit report:', err);
      setErrorMessage('Failed to compile SEO audit report. Please try again.');
    }
  };

  // Requirement: Save Alt Tags button that updates Firestore
  const handleSaveAltTags = async () => {
    if (!currentProject) return;
    setIsSavingAltTags(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const targetId = currentProject.id || currentProject.name;
      const nowIso = new Date().toISOString();

      // Primary image alt text
      const primaryImg = allProjectImages[0];
      const primaryAlt = (primaryImg && imageAltTags[primaryImg.url]) || imageAltText;

      // 1. Direct update to Firestore
      if (targetId && !targetId.startsWith('curated_') && !targetId.startsWith('local_')) {
        try {
          await updateDoc(doc(db, 'projects', targetId), {
            imageAltText: primaryAlt,
            imageAltTexts: imageAltTags,
            updatedAt: nowIso
          });
        } catch (fErr) {
          handleFirestoreError(fErr, OperationType.UPDATE, `projects/${targetId}`);
        }
      }

      // 2. Update parent state
      await onSaveMetaData(targetId, {
        ...currentProject,
        imageAltText: primaryAlt,
        imageAltTexts: imageAltTags,
        seoLastEdited: nowIso
      });

      setImageAltText(primaryAlt);
      setSuccessMessage(`Successfully updated and saved alt tags for ${allProjectImages.length} images to Firestore!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error saving alt tags:', err);
      setErrorMessage(err?.message || 'Failed to save alt tags to Firestore. Please try again.');
    } finally {
      setIsSavingAltTags(false);
    }
  };

  const handleAutoFillAllAltTags = () => {
    if (!currentProject) return;
    const nextTags = { ...imageAltTags };
    let count = 0;
    allProjectImages.forEach(img => {
      if (!nextTags[img.url] || nextTags[img.url].trim().length < 5) {
        nextTags[img.url] = generateRecommendedAltText(currentProject, img.role, img.index);
        count++;
      }
    });
    setImageAltTags(nextTags);
    if (allProjectImages[0] && nextTags[allProjectImages[0].url]) {
      setImageAltText(nextTags[allProjectImages[0].url]);
    }
    setSuccessMessage(`Auto-filled recommended WCAG alt tags for ${count} images! Click 'Save Alt Tags' to commit to Firestore.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Manual Save Handler
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
      const nowIso = new Date().toISOString();
      const nextVersion = revisions.length > 0 
        ? Math.max(...revisions.map(r => r.version)) + 1 
        : 1;

      const newRevisionRecord: SeoRevisionRecord = {
        id: `rev_${Date.now()}`,
        version: nextVersion,
        timestamp: nowIso,
        author: 'Admin',
        changeSummary: `Manual update (${keywords.length} keywords)`,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        seoKeywords: keywords,
        imageAltText: imageAltText.trim()
      };

      const updatedRevisions = [newRevisionRecord, ...revisions];
      setRevisions(updatedRevisions);
      setLastEdited(nowIso);

      try {
        localStorage.setItem(`bs_homez_seo_revisions_${targetId}`, JSON.stringify(updatedRevisions));
        localStorage.setItem(`bs_homez_seo_last_edited_${targetId}`, nowIso);
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      await onSaveMetaData(targetId, {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        seoKeywords: keywords,
        imageAltText: imageAltText.trim(),
        seoLastEdited: nowIso,
        seoRevisions: updatedRevisions
      });

      setSuccessMessage(`SEO Meta Data saved successfully for ${currentProject.name}! Version v${nextVersion} recorded.`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1400);
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
        data-testid="project-grid-item-seo-modal"
        className="project-grid-item-seo-modal bg-[#121212] border border-art-gold/40 rounded-lg max-w-3xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto text-white relative flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-bold">SEO &amp; Metadata Engine</span>
                <span className="px-1.5 py-0.2 rounded bg-art-gold/15 text-art-gold text-[8px] font-mono font-bold border border-art-gold/30">
                  Google SERP Ready
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-serif text-white font-bold italic leading-tight">
                Listing Meta Data &amp; Accessibility Manager
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
        <div className="p-3 bg-black/40 border-b border-white/10 shrink-0">
          <label className="text-[9px] uppercase tracking-wider text-white/60 font-mono font-bold block mb-1">
            Active Property Listing:
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
                  setImageAltText(
                    (nextProj as any).imageAltText || 
                    `${nextProj.name} exterior visual - ${nextProj.propertyType} in ${nextProj.location}`
                  );
                }
              }}
              className="w-full bg-[#181818] border border-white/20 focus:border-art-gold text-white text-xs sm:text-sm px-3 py-1.5 rounded-sm outline-none font-sans cursor-pointer appearance-none pr-8"
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
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-[8.5px] font-mono text-white/70">
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-art-gold font-bold">
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

        {/* SEO Revision & Last Edited Tracker Bar */}
        <div className="seo-last-edited-bar px-3 sm:px-4 py-2 bg-[#0c0c0c] border-b border-white/10 flex items-center justify-between gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <Clock size={13} className="text-art-gold shrink-0" />
            <span className="text-white/60 text-[11px] font-medium">Last Edited:</span>
            <span 
              className="last-edited-timestamp font-mono text-[11px] text-art-gold font-bold tracking-wide" 
              data-testid="last-edited-timestamp"
            >
              {formatLastEditedDate(lastEdited)}
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-[10px] text-white/50 hidden sm:inline font-mono">
              Version v{revisions[0]?.version || 1}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsRevisionHistoryOpen(true)}
            data-testid="view-revision-history-link"
            className="view-revision-history-link flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-sans text-xs font-semibold hover:underline cursor-pointer transition-colors px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25"
            title="Track SEO meta data updates and view prior revisions for this property"
          >
            <History size={13} className="text-blue-400" />
            <span>View Revision History</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-mono font-bold border border-blue-400/30">
              {revisions.length}
            </span>
          </button>
        </div>

        {/* CSS Selector: .seo-modal-controls (Requested) */}
        <div className="seo-modal-controls flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#161616] shrink-0 gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-art-gold text-black font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Meta Fields
            </button>
            <button
              type="button"
              data-testid="image-accessibility-tab-btn"
              onClick={() => setActiveTab('accessibility')}
              className={`px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'accessibility'
                  ? 'bg-art-gold text-black font-black shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon size={11} />
              <span>Image Accessibility ({allProjectImages.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-art-gold text-black font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Google SERP Preview
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Generate Alt Text Button */}
            <button
              type="button"
              data-testid="generate-alt-text-btn"
              onClick={handleGenerateAltText}
              disabled={isGeneratingAltText}
              className="generate-alt-text-btn px-2.5 py-1 rounded-sm bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/50 font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
              title="Generate accessible descriptive alt text for project images using Gemini AI"
            >
              {isGeneratingAltText ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <ImageIcon size={11} />
              )}
              <span>Generate Alt Text</span>
            </button>

            {/* AI Generate Button */}
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGenerating || isAutoGeneratingAll}
              className="px-2.5 py-1 rounded-sm bg-white/10 hover:bg-white/20 text-white font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50 border border-white/15"
              title="Auto-fill meta fields using AI"
            >
              {isGenerating ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Sparkles size={11} className="text-art-gold" />
              )}
              <span>AI Fill</span>
            </button>

            {/* Requirement: 'Auto-Generate All' Button */}
            <button
              type="button"
              onClick={handleAutoGenerateAll}
              disabled={isAutoGeneratingAll || isGenerating || isSaving}
              className="px-3 py-1 rounded-sm bg-gradient-to-r from-art-gold via-amber-400 to-yellow-500 text-black font-black text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
              title="Uses the project's description and amenities to automatically fill the meta title, description, and keywords, then saves immediately"
            >
              {isAutoGeneratingAll ? (
                <>
                  <Loader2 size={11} className="animate-spin" />
                  <span>Auto-Generating &amp; Saving...</span>
                </>
              ) : (
                <>
                  <Wand2 size={11} />
                  <span>Auto-Generate All</span>
                </>
              )}
            </button>

            {/* Requirement: 'Generate SEO Audit Report' Button */}
            <button
              type="button"
              data-testid="generate-seo-audit-report-btn"
              onClick={handleGenerateSeoAuditReport}
              className="generate-seo-audit-report-btn px-2.5 py-1 rounded-sm bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/50 font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-sm"
              title="Compiles a summary of missing alt text for all images in the project and provides a downloadable CSV report for the admin"
            >
              <FileSpreadsheet size={11} />
              <span>Generate SEO Audit Report</span>
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mx-3 mt-2 p-2 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shrink-0"
            >
              <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mx-3 mt-2 p-2 rounded bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 shrink-0"
            >
              <AlertCircle size={13} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Body */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1">
          {activeTab === 'accessibility' ? (
            /* Requirement: Image Accessibility Tab with list of images, inline input fields, and Save Alt Tags button */
            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-purple-950/40 via-black to-black border border-purple-500/30 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                      WCAG 2.2 Level A Compliance
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 text-[8px] font-mono font-bold">
                      Rule 1.1.1 Non-Text Content
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-serif italic text-white">
                    Image Accessibility &amp; Screen Reader Manager ({allProjectImages.length} Images)
                  </h4>
                  <p className="text-[10px] text-white/60">
                    Edit the descriptive alt text for each property image below. Accessible alt tags improve Google Image SEO rankings and screen reader clarity.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={handleAutoFillAllAltTags}
                    className="px-2.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all border border-white/15"
                    title="Auto-fill recommended descriptive alt text for all images missing tags"
                  >
                    <Wand2 size={11} className="text-art-gold" />
                    <span>Auto-Fill Missing</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingAltTags}
                    onClick={handleSaveAltTags}
                    data-testid="save-alt-tags-btn"
                    className="px-3.5 py-1.5 rounded-sm bg-gradient-to-r from-art-gold to-yellow-500 hover:from-white hover:to-white text-black font-black text-[9.5px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                    title="Save all image alt tags to Firestore"
                  >
                    {isSavingAltTags ? (
                      <>
                        <Loader2 size={12} className="animate-spin text-black" />
                        <span>Saving to Firestore...</span>
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        <span>Save Alt Tags</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {allProjectImages.length === 0 ? (
                <div className="p-8 text-center bg-black/40 border border-dashed border-white/15 rounded-md">
                  <ImageIcon size={24} className="mx-auto text-white/30 mb-2" />
                  <p className="text-xs text-white/60 font-serif italic">No images currently linked to {currentProject.name}.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allProjectImages.map((img, idx) => {
                    const currentVal = imageAltTags[img.url] ?? '';
                    const isFilled = currentVal.trim().length > 0;
                    return (
                      <div
                        key={img.id}
                        data-testid={`image-accessibility-item-${idx}`}
                        className={`p-3 rounded-md border transition-all flex flex-col md:flex-row items-start md:items-center gap-3.5 ${
                          isFilled 
                            ? 'bg-[#151515] border-white/15 hover:border-white/25' 
                            : 'bg-amber-500/[0.04] border-amber-500/30'
                        }`}
                      >
                        {/* Image Thumbnail Preview */}
                        <div className="relative w-24 h-20 sm:w-28 sm:h-20 bg-black rounded overflow-hidden shrink-0 border border-white/10 group">
                          <img
                            src={img.url}
                            alt={currentVal || `Image ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="absolute bottom-1 left-1 text-[8px] font-mono px-1.5 py-0.2 rounded bg-black/85 text-art-gold font-bold">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Inline Input Field & Metadata */}
                        <div className="flex-1 w-full space-y-1.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-art-gold">
                                {img.role}
                              </span>
                              {isFilled ? (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold">
                                  ✓ Configured
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-mono font-bold">
                                  ⚠️ Missing Alt Tag
                                </span>
                              )}
                            </div>
                            <span className="text-[8.5px] font-mono text-white/50">
                              {currentVal.length} chars (Optimal 40-125)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={currentVal}
                              data-testid={`image-alt-input-${idx}`}
                              onChange={(e) => {
                                const val = e.target.value;
                                setImageAltTags(prev => ({ ...prev, [img.url]: val }));
                                if (idx === 0) {
                                  setImageAltText(val);
                                }
                              }}
                              placeholder={`Enter descriptive alt text for this ${img.role.toLowerCase()}...`}
                              className="flex-1 bg-black/60 border border-white/20 focus:border-art-gold text-white text-xs px-3 py-1.5 rounded-sm outline-none font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const recommended = generateRecommendedAltText(currentProject, img.role, img.index);
                                setImageAltTags(prev => ({ ...prev, [img.url]: recommended }));
                                if (idx === 0) {
                                  setImageAltText(recommended);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-white/10 hover:bg-art-gold hover:text-black text-white text-[9px] font-mono font-bold rounded-sm border border-white/20 transition-all shrink-0 cursor-pointer"
                              title="Auto-fill recommended WCAG alt text"
                            >
                              Recommend
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'editor' ? (
            <>
              {/* Field 1: Meta Title */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9.5px] uppercase tracking-wider text-art-gold font-bold font-mono flex items-center gap-1">
                    <span>1. SEO Meta Title</span>
                  </label>
                  <span className={`text-[8.5px] font-mono font-bold ${
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
                  className="w-full bg-white/[0.05] border border-white/20 focus:border-art-gold text-white text-xs px-2.5 py-1.5 rounded-sm outline-none font-sans"
                />
              </div>

              {/* Field 2: Meta Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9.5px] uppercase tracking-wider text-art-gold font-bold font-mono flex items-center gap-1">
                    <span>2. SEO Meta Description</span>
                  </label>
                  <span className={`text-[8.5px] font-mono font-bold ${
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
                  rows={2}
                  placeholder="e.g. Explore Prestige Raintree Park in Whitefield. Premium 3 & 4 BHK apartments with verified RERA compliance, 0% buyer brokerage, and transparent pricing. Inquire now!"
                  className="w-full bg-white/[0.05] border border-white/20 focus:border-art-gold text-white text-xs p-2.5 rounded-sm outline-none font-sans resize-none leading-relaxed"
                />
              </div>

              {/* Field 3: Image Alt Text for Accessibility */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9.5px] uppercase tracking-wider text-purple-300 font-bold font-mono flex items-center gap-1">
                    <ImageIcon size={10} />
                    <span>3. Image Alt Text (Accessibility &amp; Image SEO)</span>
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      data-testid="generate-alt-text-field-btn"
                      onClick={handleGenerateAltText}
                      disabled={isGeneratingAltText}
                      className="generate-alt-text-btn text-[8.5px] uppercase tracking-wider text-purple-300 hover:text-white font-mono font-bold cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50"
                      title="Generate descriptive accessibility alt text using Gemini AI"
                    >
                      {isGeneratingAltText ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Sparkles size={10} className="text-purple-400" />
                      )}
                      <span>Generate Alt Text</span>
                    </button>
                    <span className="text-white/20 text-[9px]">|</span>
                    <button
                      type="button"
                      onClick={handleGenerateSeoAuditReport}
                      className="text-[8.5px] uppercase tracking-wider text-blue-300 hover:text-white font-mono font-bold cursor-pointer transition-colors flex items-center gap-1"
                      title="Audit all images in this project for missing alt text and download CSV report"
                    >
                      <FileSpreadsheet size={10} />
                      <span>Audit Report (CSV)</span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={imageAltText}
                  onChange={e => setImageAltText(e.target.value)}
                  placeholder="Descriptive alt text for screen readers and Google Image search..."
                  className="w-full bg-white/[0.05] border border-purple-500/30 focus:border-purple-400 text-white text-xs px-2.5 py-1.5 rounded-sm outline-none font-sans"
                />
              </div>

              {/* Field 4: Keyword Tags */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9.5px] uppercase tracking-wider text-art-gold font-bold font-mono flex items-center gap-1">
                    <Tag size={10} />
                    <span>4. Keyword Tags ({keywords.length} tags)</span>
                  </label>
                  {keywords.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setKeywords([])}
                      className="text-[8px] uppercase text-white/40 hover:text-red-400 font-mono transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Add keyword input */}
                <div className="flex gap-1.5">
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
                    placeholder="Type keyword and press Enter or click '+ Add'..."
                    className="flex-1 bg-white/[0.05] border border-white/20 focus:border-art-gold text-white text-xs px-2.5 py-1.5 rounded-sm outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddKeyword()}
                    className="px-3 py-1.5 bg-white/10 hover:bg-art-gold hover:text-black text-white text-xs font-bold rounded-sm border border-white/20 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Tag Pills Display */}
                <div className="flex flex-wrap gap-1 p-2 bg-black/40 border border-white/10 rounded-sm min-h-[40px] max-h-28 overflow-y-auto">
                  {keywords.length === 0 ? (
                    <span className="text-[10px] text-white/40 italic">
                      No keyword tags added yet. Type above or click recommendations below.
                    </span>
                  ) : (
                    keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-art-gold/15 text-art-gold border border-art-gold/30 text-[9.5px] font-sans font-medium"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(idx)}
                          className="text-art-gold/60 hover:text-white transition-colors cursor-pointer ml-0.5"
                          title="Remove keyword"
                        >
                          <X size={9} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {[
                    `+ ${currentProject.name}`,
                    `+ ${currentProject.zone || 'Bangalore'} Real Estate`,
                    '+ 0% Builder Brokerage',
                    '+ RERA Verified',
                    `+ ${currentProject.propertyType} for Sale`,
                    '+ High ROI Investment'
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleAddKeyword(preset.replace(/^\+\s*/, ''))}
                      className="px-1.5 py-0.2 rounded bg-white/5 hover:bg-art-gold/20 text-white/70 hover:text-art-gold border border-white/10 text-[8px] font-mono transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Live Google SERP Simulation */
            <div className="space-y-3">
              <div className="p-3 bg-[#1f1f1f] border border-white/15 rounded-md">
                <span className="text-[8.5px] uppercase tracking-widest text-white/40 font-mono block mb-2">
                  Google Search Live Snippet Preview
                </span>

                <div className="p-3 bg-[#202124] rounded border border-white/10 space-y-1 font-sans text-left">
                  {/* Google Breadcrumb */}
                  <div className="flex items-center gap-1.5 text-xs text-[#bdc1c6]">
                    <div className="w-4 h-4 rounded-full bg-[#303134] flex items-center justify-center text-[9px] text-art-gold font-bold">
                      🏛️
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-white font-medium">BS Homez</span>
                      <span className="text-[10px] text-[#9aa0a6] truncate">
                        https://www.bshomez.in › project › {currentProject.name.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </div>
                  </div>

                  {/* Title Link */}
                  <h4 className="text-sm sm:text-base text-[#8ab4f8] hover:underline cursor-pointer font-normal line-clamp-2 leading-tight">
                    {metaTitle || `${currentProject.name} in Bangalore | BS Homez`}
                  </h4>

                  {/* Snippet Description */}
                  <p className="text-[11px] sm:text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
                    {metaDescription || currentProject.description}
                  </p>

                  {/* Sitelinks */}
                  <div className="pt-1.5 flex flex-wrap gap-2 text-[9.5px] text-[#8ab4f8] border-t border-white/10 mt-1">
                    <span>Price: {currentProject.price}</span>
                    <span>·</span>
                    <span>Location: {currentProject.location}</span>
                    <span>·</span>
                    <span>RERA Verified</span>
                    <span>·</span>
                    <span>0% Buyer Brokerage</span>
                  </div>
                </div>
              </div>

              {/* Alt Text Preview */}
              {imageAltText && (
                <div className="p-2.5 bg-black/40 border border-purple-500/30 rounded-sm">
                  <span className="text-[8px] uppercase tracking-widest text-purple-300 font-mono block mb-0.5">
                    Accessibility Image Alt Text:
                  </span>
                  <p className="text-[11px] font-sans text-white/80">
                    &quot;{imageAltText}&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            data-testid="generate-seo-audit-report-footer-btn"
            onClick={handleGenerateSeoAuditReport}
            className="generate-seo-audit-report-btn px-3 py-1.5 rounded-sm bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[9.5px] uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Compile summary of missing alt text for all images in the project and provide a downloadable CSV report for the admin"
          >
            <FileSpreadsheet size={12} />
            <span>Generate SEO Audit Report</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 border border-white/15 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {activeTab === 'accessibility' ? (
              <button
                type="button"
                data-testid="save-alt-tags-footer-btn"
                onClick={handleSaveAltTags}
                disabled={isSavingAltTags}
                className="px-5 py-2 rounded-sm bg-gradient-to-r from-art-gold to-yellow-500 hover:from-white hover:to-white text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSavingAltTags ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-black" />
                    <span>Saving Alt Tags to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save Alt Tags</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isAutoGeneratingAll}
                className="px-5 py-2 rounded-sm bg-art-gold hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving to Listing...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save Meta Data</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Revision History Slide-Over / Modal */}
        <AnimatePresence>
          {isRevisionHistoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 z-40 bg-[#101010]/98 backdrop-blur-md flex flex-col overflow-hidden text-white border-t border-art-gold/30"
              data-testid="seo-revision-history-panel"
            >
              {/* Revision History Header */}
              <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-black/80 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                    <History size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-art-gold font-bold">SEO Audit &amp; Version Log</span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-300 text-[8px] font-mono font-bold border border-blue-500/30">
                        {revisions.length} {revisions.length === 1 ? 'Snapshot' : 'Snapshots'}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-serif text-white font-bold italic leading-tight">
                      SEO Revision History — {currentProject.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRevisionHistoryOpen(false)}
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Close Revision History"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Instructions Banner */}
              <div className="px-4 py-2 bg-black/50 border-b border-white/10 flex items-center justify-between text-xs text-white/70 shrink-0">
                <p className="text-[11px] text-white/60">
                  Track prior SEO meta title, description, and keyword snapshots. Click <strong className="text-art-gold">Restore Version</strong> to revert any snapshot back into the editor.
                </p>
                <button
                  type="button"
                  onClick={() => setIsRevisionHistoryOpen(false)}
                  className="text-xs text-art-gold hover:underline font-semibold cursor-pointer shrink-0 ml-2"
                >
                  ← Back to Editor
                </button>
              </div>

              {/* Revision List */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3">
                {revisions.map((rev, index) => {
                  const isLatest = index === 0;
                  return (
                    <div
                      key={rev.id || `${rev.version}_${rev.timestamp}`}
                      className={`p-3.5 rounded-lg border transition-all ${
                        isLatest 
                          ? 'bg-[#181818] border-art-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.08)]' 
                          : 'bg-[#131313] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Revision Top Header */}
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                            isLatest 
                              ? 'bg-art-gold text-black' 
                              : 'bg-white/10 text-white/80'
                          }`}>
                            Version v{rev.version}
                          </span>
                          {isLatest && (
                            <span className="px-1.5 py-0.2 rounded bg-green-500/20 text-green-300 text-[9px] font-bold border border-green-500/30">
                              Active / Current
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-white/60 font-mono">
                            <Clock size={11} className="text-white/40" />
                            {formatLastEditedDate(rev.timestamp)}
                          </span>
                          {rev.author && (
                            <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                              <User size={10} />
                              {rev.author}
                            </span>
                          )}
                        </div>

                        {/* Restore Button */}
                        <button
                          type="button"
                          onClick={() => handleRestoreRevision(rev)}
                          className="px-2.5 py-1 rounded bg-art-gold/20 hover:bg-art-gold text-art-gold hover:text-black border border-art-gold/40 text-[10px] uppercase tracking-wider font-black flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          title={`Restore Version v${rev.version} into editor fields`}
                        >
                          <RotateCcw size={11} />
                          <span>Restore Version</span>
                        </button>
                      </div>

                      {/* Change summary */}
                      {rev.changeSummary && (
                        <div className="mb-2 text-[11px] text-art-gold/90 font-medium italic">
                          📝 {rev.changeSummary}
                        </div>
                      )}

                      {/* Snapshot details preview */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono">
                              Meta Title:
                            </span>
                            <span className="text-[9px] text-white/40 font-mono">
                              {rev.metaTitle ? `${rev.metaTitle.length} chars` : '0 chars'}
                            </span>
                          </div>
                          <p className="text-white font-medium text-xs bg-black/40 px-2.5 py-1.5 rounded border border-white/5 break-words">
                            {rev.metaTitle || <span className="text-white/30 italic">Not specified</span>}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono">
                              Meta Description:
                            </span>
                            <span className="text-[9px] text-white/40 font-mono">
                              {rev.metaDescription ? `${rev.metaDescription.length} chars` : '0 chars'}
                            </span>
                          </div>
                          <p className="text-white/80 text-[11px] bg-black/40 px-2.5 py-1.5 rounded border border-white/5 leading-relaxed break-words">
                            {rev.metaDescription || <span className="text-white/30 italic">Not specified</span>}
                          </p>
                        </div>

                        {rev.seoKeywords && rev.seoKeywords.length > 0 && (
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono mb-1">
                              Keywords ({rev.seoKeywords.length}):
                            </span>
                            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                              {rev.seoKeywords.map((kw, kwIdx) => (
                                <span
                                  key={kwIdx}
                                  className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 text-[9.5px] font-mono"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {rev.imageAltText && (
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono">
                              Image Alt Text:
                            </span>
                            <p className="text-white/70 text-[10.5px] italic bg-black/30 px-2 py-1 rounded border border-white/5 break-words">
                              {rev.imageAltText}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Revision History Footer */}
              <div className="p-3 bg-black/90 border-t border-white/10 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-white/50 font-mono">
                  Showing {revisions.length} recorded version snapshot{revisions.length === 1 ? '' : 's'} for {currentProject.name}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRevisionHistoryOpen(false)}
                  className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* SEO Alt Text Audit & Downloadable CSV Report Modal */}
      <SeoAuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        project={currentProject}
        allProjects={projects}
        currentAltTextOverride={imageAltText}
        onApplyRecommendedAltText={(recommended) => {
          setImageAltText(recommended);
        }}
      />
    </div>
  );
};
