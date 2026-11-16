import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle2,
  Sparkles,
  Trash2,
  Film,
  FileCheck,
  Star,
  Loader2,
  Camera,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  HardDrive
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UploadedMediaItem } from '../types';
import {
  checkGoogleDriveStatus,
  compressPhotoAsset,
  compressVideoViaServer,
  computeFileSignature,
  createUploadItemRecord,
  deleteUploadedMediaPath,
  fetchAuthorizedDriveProjects,
  MAX_VIDEO_DURATION_SEC,
  readVideoDurationAndPoster,
  ResumableUploadController,
  startResumableMediaUpload,
  validatePhotoFile,
  validateVideoFile
} from '../lib/mediaProcessor';

export interface CompressedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  fileName: string;
}

export const formatBytes = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'drive' | 'direct';
  embedUrl: string;
  isEmbeddable: boolean;
}

export const parseVideoUrl = (rawUrl: string): ParsedVideo => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'direct', embedUrl: '', isEmbeddable: false };
  }
  const trimmed = rawUrl.trim();

  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      isEmbeddable: true
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isEmbeddable: true
    };
  }

  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      isEmbeddable: true
    };
  }

  return {
    type: 'direct',
    embedUrl: trimmed,
    isEmbeddable: false
  };
};

export const compressImageFile = (
  file: File,
  maxDimension = 1080,
  quality = 0.68,
  applyWatermark = true
): Promise<CompressedImageResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          const fallbackData = (e.target?.result as string) || '';
          resolve({
            dataUrl: fallbackData,
            originalSize: file.size,
            compressedSize: file.size,
            fileName: file.name
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        if (applyWatermark) {
          const fontSize = Math.max(14, Math.round(width * 0.022));
          ctx.save();
          ctx.font = `bold ${fontSize}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          ctx.textBaseline = 'middle';

          const text = 'BS Homez';
          const textMetrics = ctx.measureText(text);
          const paddingX = Math.round(fontSize * 0.65);
          const paddingY = Math.round(fontSize * 0.4);
          const dotRadius = Math.max(2, Math.round(fontSize * 0.15));
          const dotMargin = Math.round(fontSize * 0.3);
          const badgeWidth = textMetrics.width + paddingX * 2 + dotRadius * 2 + dotMargin;
          const badgeHeight = fontSize + paddingY * 2;

          const posX = width - badgeWidth - Math.round(width * 0.03);
          const posY = height - badgeHeight - Math.round(height * 0.035);
          const radius = Math.round(badgeHeight * 0.25);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
          ctx.strokeStyle = 'rgba(197, 160, 89, 0.85)';
          ctx.lineWidth = Math.max(1.5, Math.round(fontSize * 0.08));

          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(posX, posY, badgeWidth, badgeHeight, radius);
          } else {
            ctx.rect(posX, posY, badgeWidth, badgeHeight);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#C5A059';
          ctx.beginPath();
          ctx.arc(posX + paddingX + dotRadius, posY + badgeHeight / 2, dotRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(text, posX + paddingX + dotRadius * 2 + dotMargin, posY + badgeHeight / 2);
          ctx.restore();
        }

        let compressedDataUrl = '';
        try {
          compressedDataUrl = canvas.toDataURL('image/webp', quality);
        } catch {}
        if (!compressedDataUrl || !compressedDataUrl.startsWith('data:image/webp')) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        const approxBytes = Math.round((compressedDataUrl.length - 23) * 0.75);

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          compressedSize: approxBytes,
          fileName: file.name
        });
      };
      img.src = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  });
};

export const extractVideoPoster = (file: File): Promise<string> => {
  return readVideoDurationAndPoster(file)
    .then((res) => res.posterDataUrl)
    .catch(() => '');
};

export interface MediaUploadCompressorProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  videoUrl?: string;
  onVideoChange: (videoUrl: string, posterUrl?: string) => void;
  photoItems?: UploadedMediaItem[];
  onPhotoItemsChange?: (items: UploadedMediaItem[]) => void;
  videoItem?: UploadedMediaItem | null;
  onVideoItemChange?: (item: UploadedMediaItem | null) => void;
  uploadSessionId?: string;
  variant?: 'dark' | 'ivory';
  accentColor?: 'cyan' | 'amber' | 'gold' | 'forest';
  title?: string;
  onBusyChange?: (isBusy: boolean) => void;
}

export const MediaUploadCompressor: React.FC<MediaUploadCompressorProps> = ({
  images = [],
  onImagesChange,
  videoUrl = '',
  onVideoChange,
  photoItems = [],
  onPhotoItemsChange,
  videoItem = null,
  onVideoItemChange,
  uploadSessionId,
  variant = 'dark',
  accentColor = 'gold',
  title = 'Photos & Video Walkthrough Upload',
  onBusyChange
}) => {
  const isIvory = variant === 'ivory';
  const [sessionId] = useState(
    () => uploadSessionId || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const [driveAuthorized, setDriveAuthorized] = useState(false);

  const MAX_PROJECT_PHOTOS = 5;
  const [compressionQualityPreset, setCompressionQualityPreset] = useState<'compact' | 'balanced' | 'high'>('balanced');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [applyWatermark, setApplyWatermark] = useState<boolean>(true);

  // Photo processing + upload progress state
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState<number>(0);
  const [imageStatusMsg, setImageStatusMsg] = useState<string>('');
  const [photoErrorMsg, setPhotoErrorMsg] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<string | null>(null);

  // Separate Video Compression & Video Upload progress bars
  const [videoPhase, setVideoPhase] = useState<'idle' | 'validating' | 'compressing' | 'uploading' | 'paused' | 'error' | 'done'>('idle');
  const [videoCompressionPct, setVideoCompressionPct] = useState<number>(0);
  const [videoCompressionMsg, setVideoCompressionMsg] = useState<string>('');
  const [videoUploadPct, setVideoUploadPct] = useState<number>(0);
  const [videoUploadMsg, setVideoUploadMsg] = useState<string>('');
  const [videoErrorMsg, setVideoErrorMsg] = useState<string | null>(null);
  const [videoStats, setVideoStats] = useState<{
    original: number;
    compressed: number;
    durationSec?: number;
    wasCompressed: boolean;
  } | null>(null);

  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>(videoUrl || videoItem?.url || '');
  const [manualVideoInput, setManualVideoInput] = useState<string>('');
  const [manualImageUrl, setManualImageUrl] = useState<string>('');
  const [coverNotice, setCoverNotice] = useState<string | null>(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [confirmDeleteVideo, setConfirmDeleteVideo] = useState(false);
  const [lastDeletedItem, setLastDeletedItem] = useState<{ url: string; item?: UploadedMediaItem; index: number } | null>(null);

  const knownPhotoSignatures = useRef<Set<string>>(new Set());
  const activeVideoUploadCtrl = useRef<ResumableUploadController | null>(null);
  const pendingCompressedVideoRef = useRef<{
    blob: Blob;
    fileName: string;
    originalSize: number;
    compressedSize: number;
    wasCompressed: boolean;
    durationSec: number;
    posterDataUrl: string;
    posterBlob: Blob | null;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputImagesRef = useRef<HTMLInputElement | null>(null);
  const fileInputCameraRef = useRef<HTMLInputElement | null>(null);
  const fileInputVideoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setVideoPreviewUrl(videoUrl || videoItem?.url || '');
  }, [videoUrl, videoItem?.url]);

  useEffect(() => {
    let mounted = true;
    checkGoogleDriveStatus().then((status) => {
      if (mounted) setDriveAuthorized(Boolean(status.authorized));
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const busy =
      isProcessingImages ||
      videoPhase === 'validating' ||
      videoPhase === 'compressing' ||
      videoPhase === 'uploading' ||
      videoPhase === 'paused';
    onBusyChange?.(busy);
  }, [isProcessingImages, videoPhase, onBusyChange]);

  const useStoragePipeline = Boolean(onPhotoItemsChange || onVideoItemChange);

  const handleImageFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    const files: File[] = rawFiles ? Array.from(rawFiles) : [];
    if (files.length === 0) return;

    setPhotoErrorMsg(null);
    setCompressionStats(null);

    const validFiles: File[] = [];
    const skippedReasons: string[] = [];
    const remainingSlots = Math.max(0, MAX_PROJECT_PHOTOS - images.length);
    if (remainingSlots === 0) {
      setPhotoErrorMsg(`A maximum of ${MAX_PROJECT_PHOTOS} photos is allowed for each project. Remove a photo before adding another.`);
      if (e.target) e.target.value = '';
      return;
    }

    for (const file of files) {
      const check = validatePhotoFile(file);
      if (!check.valid) {
        skippedReasons.push(check.error || `${file.name}: invalid`);
        continue;
      }
      const sig = await computeFileSignature(file);
      const alreadyExists =
        knownPhotoSignatures.current.has(sig) ||
        photoItems.some((p) => p.sha256 === sig || (p.fileName === file.name && p.originalSize === file.size));
      if (alreadyExists) {
        skippedReasons.push(`"${file.name}" was skipped because it is already uploaded (duplicate detected).`);
        continue;
      }
      if (validFiles.length >= remainingSlots) {
        skippedReasons.push(`Only ${MAX_PROJECT_PHOTOS} photos are allowed per project. Extra selected files were skipped.`);
        break;
      }
      (file as any).__sig = sig;
      validFiles.push(file);
    }

    if (skippedReasons.length > 0) {
      setPhotoErrorMsg(skippedReasons.join(' '));
    }
    if (validFiles.length === 0) {
      if (e.target) e.target.value = '';
      return;
    }

    setIsProcessingImages(true);
    setImageProgress(5);
    setImageStatusMsg(`Compressing & uploading ${validFiles.length} photo(s)...`);

    // Balanced default: sharp property photos with efficient WebP/JPEG output.
    const targetDim = compressionQualityPreset === 'compact' ? 1000 : compressionQualityPreset === 'high' ? 1400 : 1280;
    const targetQuality = compressionQualityPreset === 'compact' ? 0.68 : compressionQualityPreset === 'high' ? 0.80 : 0.76;

    let totalOriginal = 0;
    let totalCompressed = 0;
    const addedUrls: string[] = [];
    const addedItems: UploadedMediaItem[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const sig = (file as any).__sig as string;
        totalOriginal += file.size;

        const basePct = Math.round((i / validFiles.length) * 85) + 5;
        setImageProgress(basePct);
        setImageStatusMsg(`Optimizing photo ${i + 1} of ${validFiles.length}: "${file.name}"...`);

        const asset = await compressPhotoAsset(file, {
          maxDimension: targetDim,
          quality: targetQuality,
          applyWatermark
        });
        totalCompressed += asset.compressedSize;

        if (useStoragePipeline) {
          setImageStatusMsg(`Uploading photo ${i + 1} of ${validFiles.length} (${formatBytes(asset.compressedSize)})...`);
          const uploadCtrl = startResumableMediaUpload({
            blob: asset.blob,
            sessionId,
            subDir: 'photos',
            fileName: file.name.replace(/\.[^.]+$/, asset.mimeType.includes('webp') ? '.webp' : '.jpg'),
            onProgress: (pct) => {
              const overall = Math.round(((i + pct / 100) / validFiles.length) * 90) + 5;
              setImageProgress(overall);
            }
          });
          const uploaded = await uploadCtrl.promise;

          let thumbnailUrl = uploaded.url;
          if (asset.thumbnailBlob) {
            try {
              const thumbCtrl = startResumableMediaUpload({
                blob: asset.thumbnailBlob,
                sessionId,
                subDir: 'thumbnails',
                fileName: `thumb_${file.name.replace(/\.[^.]+$/, '.jpg')}`,
                onProgress: () => {}
              });
              const thumbRes = await thumbCtrl.promise;
              thumbnailUrl = thumbRes.url;
            } catch {
              thumbnailUrl = asset.thumbnailDataUrl || uploaded.url;
            }
          }

          addedUrls.push(uploaded.url);
          addedItems.push(
            createUploadItemRecord({
              id: `photo_${Date.now()}_${i}`,
              url: uploaded.url,
              thumbnailUrl,
              storagePath: uploaded.storagePath,
              kind: 'photo',
              fileName: file.name,
              mimeType: asset.mimeType,
              originalSize: asset.originalSize,
              compressedSize: asset.compressedSize,
              wasCompressed: asset.wasCompressed,
              sha256: sig
            })
          );
          knownPhotoSignatures.current.add(sig);
        } else {
          addedUrls.push(asset.previewDataUrl);
          knownPhotoSignatures.current.add(sig);
        }
      }

      if (addedUrls.length > 0) {
        onImagesChange([...images, ...addedUrls]);
        if (onPhotoItemsChange) {
          onPhotoItemsChange([...photoItems, ...addedItems]);
        }

        const savedPct =
          totalOriginal > 0 && totalCompressed < totalOriginal
            ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
            : 0;
        setImageProgress(100);
        setImageStatusMsg(`Uploaded ${addedUrls.length} photo(s) successfully.`);
        setCompressionStats(
          savedPct > 0
            ? `Compressed ${addedUrls.length} photo(s): ${formatBytes(totalOriginal)} -> ${formatBytes(totalCompressed)} (${savedPct}% saved)`
            : `Processed ${addedUrls.length} photo(s): ${formatBytes(totalCompressed)}`
        );
      }
    } catch (err: any) {
      setPhotoErrorMsg(err?.message || 'Failed uploading photos. Please retry.');
    } finally {
      setTimeout(() => {
        setIsProcessingImages(false);
        setImageProgress(0);
        setImageStatusMsg('');
      }, 900);
      if (e.target) e.target.value = '';
    }
  };

  const executeVideoUpload = async (prepared: NonNullable<typeof pendingCompressedVideoRef.current>) => {
    setVideoPhase('uploading');
    setVideoUploadPct(0);
    setVideoUploadMsg(`Uploading video (${formatBytes(prepared.compressedSize)})...`);
    setVideoErrorMsg(null);

    const ctrl = startResumableMediaUpload({
      blob: prepared.blob,
      sessionId,
      subDir: 'videos',
      fileName: /\.(mp4|mov|webm|m4v|3gp)$/i.test(prepared.fileName) ? prepared.fileName : `${prepared.fileName.replace(/\.[^.]+$/, '')}.mp4`,
      onProgress: (pct) => {
        setVideoUploadPct(pct);
        setVideoUploadMsg(`Uploading walkthrough video: ${pct}% (${formatBytes(prepared.compressedSize)})`);
      },
      onStateChange: (state) => {
        if (state === 'paused') setVideoPhase('paused');
        if (state === 'running') setVideoPhase('uploading');
      }
    });

    activeVideoUploadCtrl.current = ctrl;

    try {
      const uploaded = await ctrl.promise;

      let posterUrl = prepared.posterDataUrl;
      if (prepared.posterBlob) {
        try {
          const posterCtrl = startResumableMediaUpload({
            blob: prepared.posterBlob,
            sessionId,
            subDir: 'thumbnails',
            fileName: `video_poster_${Date.now()}.jpg`,
            onProgress: () => {}
          });
          const posterUp = await posterCtrl.promise;
          posterUrl = posterUp.url;
        } catch {
          posterUrl = prepared.posterDataUrl;
        }
      }

      setVideoPreviewUrl(uploaded.url);
      setVideoStats({
        original: prepared.originalSize,
        compressed: prepared.compressedSize,
        durationSec: prepared.durationSec,
        wasCompressed: prepared.wasCompressed
      });

      onVideoChange(uploaded.url, posterUrl);
      if (onVideoItemChange) {
        onVideoItemChange(
          createUploadItemRecord({
            id: `video_${Date.now()}`,
            url: uploaded.url,
            posterUrl,
            storagePath: uploaded.storagePath,
            kind: 'video',
            fileName: prepared.fileName,
            mimeType: prepared.blob.type || 'video/mp4',
            originalSize: prepared.originalSize,
            compressedSize: prepared.compressedSize,
            wasCompressed: prepared.wasCompressed,
            durationSec: prepared.durationSec
          })
        );
      }

      setVideoUploadPct(100);
      setVideoPhase('done');
      setVideoUploadMsg('Walkthrough video uploaded & ready for playback.');
      activeVideoUploadCtrl.current = null;
    } catch (err: any) {
      setVideoPhase('error');
      setVideoErrorMsg(err?.message || 'Video upload interrupted. Click Retry Upload to resume.');
    }
  };

  const handleVideoFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoErrorMsg(null);
    setVideoStats(null);

    const check = validateVideoFile(file);
    if (!check.valid) {
      setVideoErrorMsg(check.error || 'Invalid video file.');
      if (e.target) e.target.value = '';
      return;
    }

    setVideoPhase('validating');
    setVideoCompressionPct(0);
    setVideoUploadPct(0);
    setVideoCompressionMsg(`Checking duration for "${file.name}" (max 3 minutes)...`);

    try {
      const meta = await readVideoDurationAndPoster(file);
      if (meta.durationSec > MAX_VIDEO_DURATION_SEC) {
        setVideoPhase('error');
        setVideoErrorMsg(
          `Video duration is ${Math.floor(meta.durationSec)}s, which exceeds the 3-minute (180s) limit. Please trim and try again.`
        );
        if (e.target) e.target.value = '';
        return;
      }

      setVideoPhase('compressing');
      setVideoCompressionMsg(`Preparing validated video "${file.name}" (${formatBytes(file.size)}) for upload...`);

      let compressedResult;
      try {
        compressedResult = await compressVideoViaServer(file, (pct, text) => {
          setVideoCompressionPct(pct);
          setVideoCompressionMsg(text);
        });
      } catch (compErr: any) {
        // Honest fallback when offline/ffmpeg unavailable
        const msg = compErr?.message || '';
        if (msg.includes('exceeds the maximum 3 minutes')) {
          throw compErr;
        }
        setVideoCompressionPct(100);
        setVideoCompressionMsg('Optional compression unavailable — preserving validated original video for direct upload.');
        compressedResult = {
          blob: file,
          originalSize: file.size,
          compressedSize: file.size,
          wasCompressed: false,
          compressionEngine: 'original-kept' as const,
          mimeType: file.type || 'video/mp4'
        };
      }

      const prepared = {
        blob: compressedResult.blob,
        fileName: file.name,
        originalSize: compressedResult.originalSize,
        compressedSize: compressedResult.compressedSize,
        wasCompressed: compressedResult.wasCompressed,
        durationSec: meta.durationSec,
        posterDataUrl: meta.posterDataUrl,
        posterBlob: meta.posterBlob
      };
      pendingCompressedVideoRef.current = prepared;

      if (useStoragePipeline) {
        await executeVideoUpload(prepared);
      } else {
        const localUrl = compressedResult.compressedSize <= 450 * 1024
          ? await new Promise<string>((res) => {
              const r = new FileReader();
              r.onload = () => res((r.result as string) || '');
              r.readAsDataURL(compressedResult.blob);
            })
          : URL.createObjectURL(compressedResult.blob);

        setVideoPreviewUrl(localUrl);
        setVideoStats({
          original: compressedResult.originalSize,
          compressed: compressedResult.compressedSize,
          durationSec: meta.durationSec,
          wasCompressed: compressedResult.wasCompressed
        });
        onVideoChange(localUrl, meta.posterDataUrl);
        setVideoPhase('done');
        setVideoUploadPct(100);
        setVideoUploadMsg('Video ready');
      }
    } catch (err: any) {
      setVideoPhase('error');
      setVideoErrorMsg(err?.message || 'Failed processing video.');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handlePauseResumeVideo = () => {
    if (!activeVideoUploadCtrl.current) return;
    if (videoPhase === 'paused') {
      activeVideoUploadCtrl.current.resume();
    } else if (videoPhase === 'uploading') {
      activeVideoUploadCtrl.current.pause();
    }
  };

  const handleRetryVideoUpload = async () => {
    if (!pendingCompressedVideoRef.current) return;
    await executeVideoUpload(pendingCompressedVideoRef.current);
  };

  const handleAddManualImage = () => {
    if (images.length >= MAX_PROJECT_PHOTOS) {
      setPhotoErrorMsg(`A maximum of ${MAX_PROJECT_PHOTOS} photos is allowed for each project.`);
      return;
    }
    if (!manualImageUrl.trim()) return;
    const cleanUrl = manualImageUrl.trim();
    onImagesChange([...images, cleanUrl]);
    if (onPhotoItemsChange) {
      onPhotoItemsChange([
        ...photoItems,
        createUploadItemRecord({
          id: `url_photo_${Date.now()}`,
          url: cleanUrl,
          thumbnailUrl: cleanUrl,
          storagePath: '',
          kind: 'photo',
          fileName: 'external-image',
          mimeType: 'image/jpeg',
          originalSize: 0,
          compressedSize: 0,
          wasCompressed: false
        })
      ]);
    }
    setManualImageUrl('');
  };

  const handleAddManualVideo = () => {
    if (!manualVideoInput.trim()) return;
    const cleanUrl = manualVideoInput.trim();
    setVideoPreviewUrl(cleanUrl);
    onVideoChange(cleanUrl);
    if (onVideoItemChange) {
      onVideoItemChange(
        createUploadItemRecord({
          id: `url_video_${Date.now()}`,
          url: cleanUrl,
          storagePath: '',
          kind: 'video',
          fileName: 'external-video',
          mimeType: 'video/mp4',
          originalSize: 0,
          compressedSize: 0,
          wasCompressed: false
        })
      );
    }
    setManualVideoInput('');
  };

  const handleSetAsCover = (index: number) => {
    if (index < 0 || index >= images.length) return;
    if (index === 0) {
      setCoverNotice('Photo #1 is already the active main Cover Image.');
      setTimeout(() => setCoverNotice(null), 3000);
      return;
    }
    const target = images[index];
    const remaining = images.filter((_, idx) => idx !== index);
    onImagesChange([target, ...remaining]);
    if (onPhotoItemsChange && photoItems[index]) {
      const targetItem = photoItems[index];
      const remItems = photoItems.filter((_, idx) => idx !== index);
      onPhotoItemsChange([targetItem, ...remItems]);
    }
    setCoverNotice(`Photo #${index + 1} set as main Cover Image.`);
    setTimeout(() => setCoverNotice(null), 3500);
  };

  const handleRequestRemoveImage = (indexToRemove: number) => {
    if (pendingDeleteIndex === indexToRemove) {
      handleExecuteRemoveImage(indexToRemove);
    } else {
      setPendingDeleteIndex(indexToRemove);
      setTimeout(() => {
        setPendingDeleteIndex((prev) => (prev === indexToRemove ? null : prev));
      }, 4000);
    }
  };

  const handleExecuteRemoveImage = (indexToRemove: number) => {
    const deletedUrl = images[indexToRemove];
    const deletedItem = photoItems[indexToRemove];
    if (deletedItem?.sha256) {
      knownPhotoSignatures.current.delete(deletedItem.sha256);
    }
    onImagesChange(images.filter((_, idx) => idx !== indexToRemove));
    if (onPhotoItemsChange) {
      onPhotoItemsChange(photoItems.filter((_, idx) => idx !== indexToRemove));
    }
    setPendingDeleteIndex(null);
    setLastDeletedItem({ url: deletedUrl, item: deletedItem, index: indexToRemove });
    setCoverNotice(`Photo #${indexToRemove + 1} removed.`);
    setTimeout(() => setCoverNotice(null), 4500);
  };

  const handleUndoDelete = () => {
    if (!lastDeletedItem) return;
    const restored = [...images];
    restored.splice(lastDeletedItem.index, 0, lastDeletedItem.url);
    onImagesChange(restored);
    if (onPhotoItemsChange && lastDeletedItem.item) {
      const restoredItems = [...photoItems];
      restoredItems.splice(lastDeletedItem.index, 0, lastDeletedItem.item);
      onPhotoItemsChange(restoredItems);
      if (lastDeletedItem.item.sha256) {
        knownPhotoSignatures.current.add(lastDeletedItem.item.sha256);
      }
    }
    setLastDeletedItem(null);
    setCoverNotice('Photo restored.');
    setTimeout(() => setCoverNotice(null), 3000);
  };

  const handleDeleteAllImages = () => {
    if (images.length === 0) return;
    if (!confirmDeleteAll) {
      setConfirmDeleteAll(true);
      setTimeout(() => setConfirmDeleteAll(false), 4000);
      return;
    }
    for (const item of photoItems) {
      if (item.storagePath) {
        deleteUploadedMediaPath(item.storagePath).catch(() => {});
      }
    }
    knownPhotoSignatures.current.clear();
    onImagesChange([]);
    if (onPhotoItemsChange) onPhotoItemsChange([]);
    setCompressionStats(null);
    setConfirmDeleteAll(false);
    setCoverNotice('All uploaded photos removed.');
    setTimeout(() => setCoverNotice(null), 3000);
  };

  const handleRemoveVideo = () => {
    if (!confirmDeleteVideo) {
      setConfirmDeleteVideo(true);
      setTimeout(() => setConfirmDeleteVideo(false), 4000);
      return;
    }
    if (videoItem?.storagePath) {
      deleteUploadedMediaPath(videoItem.storagePath).catch(() => {});
    }
    pendingCompressedVideoRef.current = null;
    setVideoPreviewUrl('');
    setVideoStats(null);
    setVideoPhase('idle');
    setVideoCompressionPct(0);
    setVideoUploadPct(0);
    onVideoChange('', '');
    if (onVideoItemChange) onVideoItemChange(null);
    setConfirmDeleteVideo(false);
    if (fileInputVideoRef.current) fileInputVideoRef.current.value = '';
    setCoverNotice('Walkthrough video removed.');
    setTimeout(() => setCoverNotice(null), 3000);
  };

  const containerCls = isIvory
    ? 'space-y-6 p-5 bg-lux-ivory/70 border border-lux-border rounded-sm text-lux-charcoal'
    : 'space-y-6 p-5 bg-[#0e0e0e] border border-white/10 rounded-sm text-white';

  const labelCls = isIvory ? 'text-lux-forest' : 'text-white/80';
  const mutedCls = isIvory ? 'text-lux-muted' : 'text-white/50';
  const inputCls = isIvory
    ? 'flex-1 bg-lux-card border border-lux-border p-2.5 text-xs text-lux-charcoal rounded-sm outline-none focus:border-lux-forest font-mono'
    : 'flex-1 bg-white/5 border border-white/10 p-2.5 text-xs text-white rounded-sm outline-none focus:border-white/30 font-mono';

  return (
    <div className={containerCls} data-testid="media-upload-compressor">
      {/* Header */}
      <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3', isIvory ? 'border-lux-border' : 'border-white/10')}>
        <div className="flex items-center gap-2">
          <Sparkles className={isIvory ? 'text-lux-forest' : 'text-art-gold'} size={15} />
          <h4 className={cn('text-xs font-black uppercase tracking-widest', isIvory ? 'text-lux-forest' : 'text-white')}>
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={cn('flex items-center border rounded p-0.5 text-[9px] font-mono', isIvory ? 'bg-lux-card border-lux-border' : 'bg-black/70 border-white/15')}>
            <span className={cn('px-1.5 uppercase font-bold', mutedCls)}>Photo Quality:</span>
            {[
              { id: 'compact' as const, label: 'Light' },
              { id: 'balanced' as const, label: 'Balanced HD' },
              { id: 'high' as const, label: 'High HD' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setCompressionQualityPreset(preset.id)}
                className={cn(
                  'px-2 py-0.5 rounded transition-all cursor-pointer font-bold',
                  compressionQualityPreset === preset.id
                    ? isIvory
                      ? 'bg-lux-forest text-lux-card shadow-sm'
                      : 'bg-emerald-500 text-black shadow-sm'
                    : isIvory
                    ? 'text-lux-muted hover:text-lux-forest'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider flex items-center gap-1', isIvory ? 'text-lux-forest bg-lux-card border-lux-border' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20')}>
            <FileCheck size={11} /> Real Compression
          </span>
        </div>
      </div>

      {coverNotice && (
        <div className={cn('p-2.5 border rounded text-[11px] font-mono flex items-center justify-between', isIvory ? 'bg-lux-forest text-lux-card border-lux-forest' : 'bg-art-gold/15 border-art-gold/40 text-art-gold')}>
          <span className="flex items-center gap-1.5 font-bold">
            <Star size={12} /> {coverNotice}
          </span>
          <div className="flex items-center gap-2">
            {lastDeletedItem && (
              <button
                type="button"
                onClick={handleUndoDelete}
                className="px-2 py-0.5 bg-lux-gold text-lux-charcoal rounded text-[9px] font-black uppercase hover:opacity-90 cursor-pointer"
              >
                Undo
              </button>
            )}
            <button type="button" onClick={() => { setCoverNotice(null); setLastDeletedItem(null); }} className="cursor-pointer p-0.5">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* 1. PHOTOS UPLOAD */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className={cn('text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5', labelCls)}>
              <ImageIcon size={13} />
              Property Photos ({images.length}/{MAX_PROJECT_PHOTOS})
            </label>
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleDeleteAllImages}
                className={cn(
                  'text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded border',
                  confirmDeleteAll ? 'bg-red-600 text-white border-red-400 font-black' : 'text-red-500 border-red-500/30 hover:bg-red-500/10'
                )}
              >
                <Trash2 size={11} /> {confirmDeleteAll ? 'Confirm Delete All' : `Delete All (${images.length})`}
              </button>
            )}
          </div>

          <div className={cn('p-2.5 border rounded-sm flex items-center justify-between gap-3', isIvory ? 'bg-lux-card border-lux-border' : 'bg-black/60 border-art-gold/30')}>
            <span className={cn('text-[10px] font-mono font-bold uppercase tracking-wider', isIvory ? 'text-lux-charcoal' : 'text-white')}>
              BS Homez Watermark Stamp
            </span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={applyWatermark}
                onChange={(e) => setApplyWatermark(e.target.checked)}
                className="accent-lux-forest w-3.5 h-3.5 cursor-pointer"
              />
              <span className={cn('text-[10px] font-mono uppercase font-bold', isIvory ? 'text-lux-forest' : 'text-white/80')}>
                {applyWatermark ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

          {/* Device Upload + Camera Capture + Authorized Google Drive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => fileInputImagesRef.current?.click()}
              disabled={images.length >= MAX_PROJECT_PHOTOS || isProcessingImages}
              className={cn(
                'p-4 border-2 border-dashed rounded-sm flex flex-col items-center justify-center text-center cursor-pointer transition-all',
                isIvory ? 'bg-lux-card border-lux-forest/30 hover:border-lux-forest text-lux-charcoal' : 'bg-white/[0.02] border-art-gold/40 hover:border-art-gold text-white'
              )}
            >
              <Upload className={isIvory ? 'text-lux-forest mb-1.5' : 'text-art-gold mb-1.5'} size={18} />
              <span className="text-xs font-bold">Choose Device Photos</span>
              <span className={cn('text-[9px] font-mono mt-0.5', mutedCls)}>Up to {MAX_PROJECT_PHOTOS - images.length} more • JPG, PNG, WebP • Max 15MB each</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputCameraRef.current?.click()}
              disabled={images.length >= MAX_PROJECT_PHOTOS || isProcessingImages}
              className={cn(
                'p-4 border-2 border-dashed rounded-sm flex flex-col items-center justify-center text-center cursor-pointer transition-all',
                isIvory ? 'bg-lux-card border-lux-gold/50 hover:border-lux-forest text-lux-charcoal' : 'bg-white/[0.02] border-cyan-500/40 hover:border-cyan-400 text-white'
              )}
            >
              <Camera className={isIvory ? 'text-lux-gold mb-1.5' : 'text-cyan-400 mb-1.5'} size={18} />
              <span className="text-xs font-bold">Take Photo (Camera)</span>
              <span className={cn('text-[9px] font-mono mt-0.5', mutedCls)}>Mobile &amp; Tablet Camera Capture</span>
            </button>
          </div>

          <input
            ref={fileInputImagesRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/*"
            onChange={handleImageFilesSelected}
            className="hidden"
            data-testid="photo-device-input"
          />
          <input
            ref={fileInputCameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageFilesSelected}
            className="hidden"
            data-testid="photo-camera-input"
          />

          {/* External imports are intentionally disabled so every saved project photo follows the compression pipeline. */}
          {false && driveAuthorized && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const files = await fetchAuthorizedDriveProjects();
                  const driveLinks = files
                    .map((f: any) => f.thumbnailLink || f.webViewLink)
                    .filter(Boolean);
                  if (driveLinks.length > 0) {
                    onImagesChange([...images, ...driveLinks]);
                  }
                } catch (err: any) {
                  setPhotoErrorMsg(err?.message || 'Google Drive import unavailable.');
                }
              }}
              className={cn(
                'w-full py-2 px-3 border rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer',
                isIvory ? 'bg-lux-card border-lux-border text-lux-forest hover:bg-lux-ivory' : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
              )}
            >
              <HardDrive size={14} /> Import From Authorized Google Drive
            </button>
          )}

          {/* Photo Error / Duplicate Warning */}
          {photoErrorMsg && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/40 rounded text-[11px] font-mono text-amber-800 flex items-start gap-2" role="alert">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <span className={isIvory ? 'text-amber-900' : 'text-amber-300'}>{photoErrorMsg}</span>
            </div>
          )}

          {/* Photo Upload Progress Bar */}
          {isProcessingImages && (
            <div className={cn('p-3.5 border rounded-sm space-y-2', isIvory ? 'bg-lux-card border-lux-forest/30' : 'bg-black/80 border-art-gold/40')} data-testid="photo-progress-bar">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={cn('font-bold flex items-center gap-2', isIvory ? 'text-lux-forest' : 'text-art-gold')}>
                  <Loader2 size={13} className="animate-spin" />
                  <span>{imageStatusMsg || 'Uploading Photos...'}</span>
                </span>
                <span className={cn('font-black px-2 py-0.5 rounded border', isIvory ? 'bg-lux-forest text-lux-card border-lux-forest' : 'text-art-gold bg-art-gold/15 border-art-gold/30')}>
                  {imageProgress}%
                </span>
              </div>
              <div className={cn('w-full h-2.5 rounded-full overflow-hidden border', isIvory ? 'bg-lux-ivory border-lux-border' : 'bg-white/10 border-white/10')}>
                <div
                  className={cn('h-full rounded-full transition-all duration-300', isIvory ? 'bg-lux-forest' : 'bg-art-gold')}
                  style={{ width: `${imageProgress}%` }}
                />
              </div>
            </div>
          )}

          {compressionStats && !isProcessingImages && (
            <div className={cn('p-2.5 border rounded text-[10px] font-mono flex items-center gap-2', isIvory ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300')}>
              <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
              <span>{compressionStats}</span>
            </div>
          )}

          {/* External image URL input is intentionally hidden to enforce the five-photo, compressed-upload limit. */}
          {false && <div className="flex gap-2">
            <input
              type="url"
              value={manualImageUrl}
              onChange={(e) => setManualImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddManualImage();
                }
              }}
              placeholder="Or paste external image URL (https://...)"
              className={inputCls}
            />
            <button
              type="button"
              onClick={handleAddManualImage}
              className={cn('px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm cursor-pointer', isIvory ? 'bg-lux-forest text-lux-card hover:bg-lux-forest-hover' : 'bg-white/10 hover:bg-white/20 text-white')}
            >
              Add URL
            </button>
          </div>}

          {/* Photo Previews Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1.5 border rounded-sm bg-black/5">
              {images.map((imgUrl, idx) => {
                const isCover = idx === 0;
                const isPendingDelete = pendingDeleteIndex === idx;
                return (
                  <div
                    key={`${idx}-${imgUrl.slice(0, 24)}`}
                    className={cn(
                      'relative group rounded overflow-hidden border bg-black transition-all',
                      isCover ? 'border-lux-gold ring-1 ring-lux-gold' : 'border-white/20'
                    )}
                  >
                    <div
                      className="aspect-[16/11] w-full overflow-hidden bg-black flex items-center justify-center cursor-pointer"
                      onClick={() => setPreviewModalUrl(imgUrl)}
                    >
                      <img src={imgUrl} alt={`Property Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    {isCover ? (
                      <div className="absolute top-1 left-1 bg-lux-gold text-lux-charcoal text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                        Cover
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetAsCover(idx)}
                        className="absolute top-1 left-1 bg-black/80 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded cursor-pointer hover:bg-lux-gold hover:text-black"
                      >
                        Set Cover
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => (isPendingDelete ? handleExecuteRemoveImage(idx) : handleRequestRemoveImage(idx))}
                      className={cn(
                        'absolute top-1 right-1 p-1 rounded cursor-pointer text-white text-[8px] font-bold',
                        isPendingDelete ? 'bg-red-600 px-1.5' : 'bg-black/80 hover:bg-red-600'
                      )}
                    >
                      {isPendingDelete ? 'Confirm' : <Trash2 size={10} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Video upload controls are intentionally hidden for the current storage-saving release. */}
        {false && <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className={cn('text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5', labelCls)}>
              <Video size={13} />
              Walkthrough Video (Max 3 Mins • Max 150 MB)
            </label>
            {videoPreviewUrl && (
              <button
                type="button"
                onClick={handleRemoveVideo}
                className={cn(
                  'text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded border',
                  confirmDeleteVideo ? 'bg-red-600 text-white border-red-500 font-bold' : 'text-red-500 border-red-500/30 hover:bg-red-500/10'
                )}
              >
                <Trash2 size={10} /> {confirmDeleteVideo ? 'Confirm Delete Video' : 'Delete Video'}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputVideoRef.current?.click()}
            className={cn(
              'w-full p-5 border-2 border-dashed rounded-sm flex flex-col items-center justify-center text-center cursor-pointer transition-all',
              isIvory ? 'bg-lux-card border-lux-forest/30 hover:border-lux-forest text-lux-charcoal' : 'bg-white/[0.02] border-art-gold/40 hover:border-art-gold text-white'
            )}
          >
            <input
              ref={fileInputVideoRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoFileSelected}
              className="hidden"
              data-testid="video-device-input"
            />
            <Film className={isIvory ? 'text-lux-forest mb-1.5' : 'text-art-gold mb-1.5'} size={20} />
            <span className="text-xs font-bold">Upload Walkthrough Video</span>
            <span className={cn('text-[9px] font-mono mt-0.5', mutedCls)}>
              Maximum 3 minutes (180s) • Max 150 MB • MP4 / MOV / WEBM
            </span>
          </button>

          {videoErrorMsg && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/40 rounded text-[11px] font-mono text-red-700 flex items-start gap-2" role="alert">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-600" />
              <span className={isIvory ? 'text-red-800' : 'text-red-300'}>{videoErrorMsg}</span>
            </div>
          )}

          {/* SEPARATE PROGRESS BAR 1: VIDEO COMPRESSION */}
          {(videoPhase === 'validating' || videoPhase === 'compressing' || (videoCompressionPct > 0 && videoCompressionPct < 100)) && (
            <div className={cn('p-3 border rounded-sm space-y-2', isIvory ? 'bg-lux-card border-lux-gold/50' : 'bg-black/80 border-amber-500/40')} data-testid="video-compression-progress">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={cn('font-bold flex items-center gap-2', isIvory ? 'text-lux-forest' : 'text-amber-300')}>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Compression: {videoCompressionMsg}</span>
                </span>
                <span className="font-black px-2 py-0.5 rounded bg-lux-gold/20 text-lux-charcoal">
                  {videoCompressionPct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-black/10">
                <div className="h-full bg-lux-gold transition-all duration-300" style={{ width: `${videoCompressionPct}%` }} />
              </div>
            </div>
          )}

          {/* SEPARATE PROGRESS BAR 2: VIDEO UPLOAD + PAUSE / RESUME / RETRY */}
          {(videoPhase === 'uploading' || videoPhase === 'paused' || videoPhase === 'error') && pendingCompressedVideoRef.current && (
            <div className={cn('p-3 border rounded-sm space-y-2.5', isIvory ? 'bg-lux-card border-lux-forest/40' : 'bg-black/80 border-purple-500/40')} data-testid="video-upload-progress">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={cn('font-bold flex items-center gap-2', isIvory ? 'text-lux-forest' : 'text-purple-300')}>
                  {videoPhase === 'uploading' && <Loader2 size={13} className="animate-spin" />}
                  <span>Upload: {videoUploadMsg || 'Preparing upload...'}</span>
                </span>
                <span className="font-black px-2 py-0.5 rounded bg-lux-forest text-lux-card">
                  {videoUploadPct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-black/10">
                <div className="h-full bg-lux-forest transition-all duration-300" style={{ width: `${videoUploadPct}%` }} />
              </div>
              <div className="flex items-center gap-2">
                {(videoPhase === 'uploading' || videoPhase === 'paused') && (
                  <button
                    type="button"
                    onClick={handlePauseResumeVideo}
                    className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded border border-lux-border bg-lux-ivory text-lux-forest flex items-center gap-1 cursor-pointer"
                  >
                    {videoPhase === 'paused' ? <><Play size={11} /> Resume</> : <><Pause size={11} /> Pause</>}
                  </button>
                )}
                {videoPhase === 'error' && (
                  <button
                    type="button"
                    onClick={handleRetryVideoUpload}
                    className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded bg-lux-forest text-lux-card flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} /> Retry Upload
                  </button>
                )}
              </div>
            </div>
          )}

          {videoStats && videoPhase !== 'compressing' && videoPhase !== 'uploading' && (
            <div className={cn('p-2 border rounded text-[10px] font-mono flex items-center justify-between', isIvory ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300')}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-600" />
                {videoStats.wasCompressed
                  ? `Compressed ${formatBytes(videoStats.original)} -> ${formatBytes(videoStats.compressed)}`
                  : `Uploaded (${formatBytes(videoStats.compressed)} — already optimal)`}
              </span>
              {videoStats.durationSec ? <span>{Math.round(videoStats.durationSec)}s</span> : null}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="url"
              value={manualVideoInput}
              onChange={(e) => setManualVideoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddManualVideo();
                }
              }}
              placeholder="Or paste YouTube / Vimeo video link"
              className={inputCls}
            />
            <button
              type="button"
              onClick={handleAddManualVideo}
              className={cn('px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm cursor-pointer', isIvory ? 'bg-lux-forest text-lux-card hover:bg-lux-forest-hover' : 'bg-white/10 hover:bg-white/20 text-white')}
            >
              Set Link
            </button>
          </div>

          {videoPreviewUrl && (() => {
            const parsed = parseVideoUrl(videoPreviewUrl);
            return (
              <div className="relative border border-lux-border rounded-sm overflow-hidden bg-black aspect-video max-h-56 shadow-md">
                {parsed.isEmbeddable ? (
                  <iframe
                    src={parsed.embedUrl}
                    title="Walkthrough Video Preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={videoPreviewUrl}
                    poster={videoItem?.posterUrl}
                    className="w-full h-full object-contain bg-black"
                    controls
                    playsInline
                  />
                )}
              </div>
            );
          })()}
        </div>}
      </div>

      {previewModalUrl && (
        <div
          className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-black/90"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-[#111] border border-white/20 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 p-1.5 bg-black/70 text-white rounded cursor-pointer"
            >
              <X size={16} />
            </button>
            <img src={previewModalUrl} alt="Full property preview" className="max-h-[80vh] max-w-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
