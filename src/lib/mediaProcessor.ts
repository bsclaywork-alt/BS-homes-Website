import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask
} from 'firebase/storage';
import { auth, storage } from './firebase';
import { UploadedMediaItem } from '../types';

let inMemoryMediaSessionId: string | null = null;

function randomHexBytes(byteCount: number): string {
  const bytes = new Uint8Array(byteCount);
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    throw new Error('Secure CSPRNG (crypto.getRandomValues) is unavailable.');
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSecureMediaToken(prefix: string, byteCount = 24): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '');
  return `${cleanPrefix}_${randomHexBytes(byteCount)}`;
}

export function getClientMediaSessionId(): string {
  if (!inMemoryMediaSessionId) {
    inMemoryMediaSessionId = generateSecureMediaToken('msess', 20);
  }
  return inMemoryMediaSessionId;
}

export async function getOptionalAuthHeaders(): Promise<Record<string, string>> {
  try {
    const token = await auth?.currentUser?.getIdToken?.();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {}
  return {};
}

export const MAX_PHOTO_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_VIDEO_SIZE_BYTES = 150 * 1024 * 1024; // 150 MB maximum upload limit (aligned with Firebase Storage rules)
export const MAX_VIDEO_DURATION_SEC = 180; // Strictly 3 minutes
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'video/3gpp'];

export interface DriveAuthStatus {
  configured: boolean;
  authorized: boolean;
  message?: string;
}

export async function checkGoogleDriveStatus(): Promise<DriveAuthStatus> {
  return {
    configured: false,
    authorized: false,
    message: 'Direct device and camera upload active on public website.'
  };
}

export async function fetchAuthorizedDriveProjects(): Promise<any[]> {
  return [];
}

export async function computeFileSignature(file: File): Promise<string> {
  const metaSig = `${file.name.toLowerCase()}:${file.size}:${file.lastModified}`;
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof file.arrayBuffer === 'function') {
      const sampleEnd = Math.min(file.size, 256 * 1024);
      const buffer = await file.slice(0, sampleEnd).arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buffer);
      const hex = Array.from(new Uint8Array(digest))
        .slice(0, 12)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return `${file.size}:${hex}`;
    }
  } catch {
    // Fallback to metadata signature
  }
  return metaSig;
}

export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  const type = (file.type || '').toLowerCase();
  const isImageExt = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
  if (!type.startsWith('image/') && !isImageExt) {
    return { valid: false, error: `Unsupported photo format for "${file.name}". Allowed: JPG, PNG, WebP.` };
  }
  if (type && !ALLOWED_IMAGE_MIME_TYPES.includes(type) && !isImageExt) {
    return { valid: false, error: `Unsupported photo MIME type "${type}" for "${file.name}".` };
  }
  if (file.size <= 0) {
    return { valid: false, error: `Photo "${file.name}" appears empty.` };
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return { valid: false, error: `Photo "${file.name}" exceeds the 15 MB maximum limit.` };
  }
  return { valid: true };
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const type = (file.type || '').toLowerCase();
  const isVideoExt = /\.(mp4|webm|mov|m4v|3gp)$/i.test(file.name);
  if (!type.startsWith('video/') && !isVideoExt) {
    return { valid: false, error: `Unsupported video format for "${file.name}". Allowed: MP4, WebM, MOV.` };
  }
  if (type && !ALLOWED_VIDEO_MIME_TYPES.includes(type) && !isVideoExt) {
    return { valid: false, error: `Unsupported video MIME type "${type}".` };
  }
  if (file.size <= 0) {
    return { valid: false, error: `Video "${file.name}" appears empty.` };
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return { valid: false, error: `Video "${file.name}" exceeds the 150 MB maximum upload limit.` };
  }
  return { valid: true };
}

export function readVideoDurationAndPoster(file: File): Promise<{
  durationSec: number;
  width: number;
  height: number;
  posterBlob: Blob | null;
  posterDataUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch {}
    };

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Timed out while reading video duration metadata.'));
    }, 15000);

    video.onloadedmetadata = () => {
      const durationSec = Number.isFinite(video.duration) ? video.duration : 0;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 360;
      if (durationSec > MAX_VIDEO_DURATION_SEC) {
        clearTimeout(timeout);
        cleanup();
        resolve({ durationSec, width, height, posterBlob: null, posterDataUrl: '' });
        return;
      }
      try {
        video.currentTime = Math.min(1.0, Math.max(0.1, durationSec / 4));
      } catch {
        clearTimeout(timeout);
        cleanup();
        resolve({ durationSec, width, height, posterBlob: null, posterDataUrl: '' });
      }
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const targetW = Math.min(854, video.videoWidth || 640);
        const ratio = (video.videoHeight || 360) / (video.videoWidth || 640);
        canvas.width = targetW;
        canvas.height = Math.max(180, Math.round(targetW * ratio));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve({
            durationSec: video.duration || 0,
            width: video.videoWidth || 640,
            height: video.videoHeight || 360,
            posterBlob: null,
            posterDataUrl: ''
          });
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const posterDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        canvas.toBlob(
          (blob) => {
            cleanup();
            resolve({
              durationSec: video.duration || 0,
              width: video.videoWidth || 640,
              height: video.videoHeight || 360,
              posterBlob: blob,
              posterDataUrl
            });
          },
          'image/jpeg',
          0.72
        );
      } catch {
        cleanup();
        resolve({
          durationSec: video.duration || 0,
          width: video.videoWidth || 640,
          height: video.videoHeight || 360,
          posterBlob: null,
          posterDataUrl: ''
        });
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      reject(new Error('Could not decode video metadata. Please ensure the file is a valid MP4, WebM, or MOV video.'));
    };

    video.src = objectUrl;
  });
}

export interface CompressedPhotoAsset {
  blob: Blob;
  previewDataUrl: string;
  thumbnailDataUrl: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
}

export async function compressPhotoAsset(
  file: File,
  options?: { maxDimension?: number; quality?: number; applyWatermark?: boolean }
): Promise<CompressedPhotoAsset> {
  const maxDimension = options?.maxDimension ?? 1280;
  const quality = options?.quality ?? 0.74;
  const applyWatermark = options?.applyWatermark ?? true;

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    let settled = false;
    const timeout = setTimeout(() => finish(new Error(`Timed out while decoding "${file.name}". Please retry with a JPG or smaller photo.`)), 30000);

    const finish = (error?: Error, result?: CompressedPhotoAsset) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
      URL.revokeObjectURL(objectUrl);
      if (error) reject(error);
      else if (result) resolve(result);
      else reject(new Error(`Could not process "${file.name}". Please retry.`));
    };

    img.onerror = () => finish(new Error(`Failed to decode image "${file.name}". Please use JPG, PNG, or WebP.`));
    img.onload = async () => {
      try {
        let width = img.naturalWidth || img.width || 1280;
        let height = img.naturalHeight || img.height || 720;
        if (!width || !height) throw new Error(`Photo "${file.name}" has invalid image dimensions.`);
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
        if (!ctx) throw new Error('This browser could not create an optimized photo. Please try another browser.');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, width, height);

        if (applyWatermark) {
          const fontSize = Math.max(14, Math.round(width * 0.022));
          ctx.save();
          ctx.font = `bold ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
          ctx.textBaseline = 'middle';
          const watermark = 'BS Homez';
          const metrics = ctx.measureText(watermark);
          const padX = Math.round(fontSize * 0.65);
          const padY = Math.round(fontSize * 0.38);
          const badgeW = metrics.width + padX * 2;
          const badgeH = fontSize + padY * 2;
          const posX = width - badgeW - Math.round(width * 0.03);
          const posY = height - badgeH - Math.round(height * 0.035);
          ctx.fillStyle = 'rgba(16, 46, 38, 0.78)';
          ctx.strokeStyle = 'rgba(197, 164, 109, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.fillRect(posX, posY, badgeW, badgeH);
          ctx.strokeRect(posX, posY, badgeW, badgeH);
          ctx.fillStyle = '#F7F5EF';
          ctx.fillText(watermark, posX + padX, posY + badgeH / 2);
          ctx.restore();
        }

        const canvasToBlob = (source: HTMLCanvasElement, mime: string, q: number): Promise<Blob | null> =>
          new Promise((res, rej) => {
            let settled = false;
            const timer = setTimeout(() => {
              if (settled) return;
              settled = true;
              rej(new Error(`Photo encoding timed out for "${file.name}". Please try a smaller JPG or PNG image.`));
            }, 12000);
            try {
              source.toBlob((blob) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                res(blob);
              }, mime, q);
            } catch (error: any) {
              if (settled) return;
              settled = true;
              clearTimeout(timer);
              rej(error instanceof Error ? error : new Error('Photo encoding failed.'));
            }
          });

        let outputBlob = await canvasToBlob(canvas, 'image/webp', quality);
        let outputMime = 'image/webp';
        if (!outputBlob || outputBlob.size === 0) {
          outputBlob = await canvasToBlob(canvas, 'image/jpeg', quality);
          outputMime = 'image/jpeg';
        }
        if (!outputBlob || outputBlob.size === 0) {
          throw new Error(`Could not encode "${file.name}". The original photo was not uploaded.`);
        }

        const thumbW = Math.min(320, width);
        const thumbH = Math.max(120, Math.round((height * thumbW) / width));
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = thumbW;
        thumbCanvas.height = thumbH;
        const thumbCtx = thumbCanvas.getContext('2d');
        let thumbnailDataUrl = '';
        if (thumbCtx) {
          thumbCtx.drawImage(canvas, 0, 0, thumbW, thumbH);
          try { thumbnailDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.65); } catch {}
        }

        let previewDataUrl = '';
        try { previewDataUrl = canvas.toDataURL(outputMime, quality); }
        catch { throw new Error(`Could not create a preview for "${file.name}". Please retry.`); }
        if (!previewDataUrl.startsWith('data:image/')) {
          throw new Error(`Could not create an optimized preview for "${file.name}".`);
        }

        finish(undefined, {
          blob: outputBlob,
          previewDataUrl,
          thumbnailDataUrl: thumbnailDataUrl || previewDataUrl,
          mimeType: outputBlob.type || outputMime,
          originalSize: file.size,
          compressedSize: outputBlob.size,
          wasCompressed: outputBlob.size < file.size
        });
      } catch (error: any) {
        finish(error instanceof Error ? error : new Error(error?.message || `Failed to process "${file.name}".`));
      }
    };
    img.src = objectUrl;
  });
}

export interface VideoCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  compressionEngine: 'ffmpeg-server' | 'canvas-mediarecorder' | 'original-kept';
  mimeType: string;
}

/**
 * On the static public website (GitHub Pages), server-side ffmpeg compression is unavailable.
 * Preserves the validated original video file directly for Firebase Storage resumable upload.
 */
export async function compressVideoViaServer(
  file: File,
  onProgress: (pct: number, statusText: string) => void,
  signal?: AbortSignal
): Promise<VideoCompressionResult> {
  if (signal?.aborted) {
    throw new DOMException('Video processing cancelled', 'AbortError');
  }
  onProgress(100, 'Video verified — preserving original quality for direct cloud upload.');
  return {
    blob: file,
    originalSize: file.size,
    compressedSize: file.size,
    wasCompressed: false,
    compressionEngine: 'original-kept',
    mimeType: file.type || 'video/mp4'
  };
}

/**
 * Uploads an already optimized and watermarked property photo to Cloudinary.
 * The unsigned preset is intentionally public; never place an API secret in client code.
 */
export async function uploadCloudinaryPhoto(params: {
  blob: Blob;
  sessionId: string;
  fileName: string;
  onProgress?: (pct: number) => void;
  signal?: AbortSignal;
}): Promise<{ url: string; publicId: string; bytes: number; format: string }> {
  const cloudName = 'bk9vq6rk';
  const uploadPreset = 'ml_default';
  if (params.signal?.aborted) throw new DOMException('Upload cancelled', 'AbortError');

  const form = new FormData();
  form.append('file', params.blob, params.fileName);
  form.append('upload_preset', uploadPreset);
  form.append('folder', `bshomez/property-submissions/${params.sessionId}`);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.timeout = 90000;

    const abortFromCaller = () => xhr.abort();
    params.signal?.addEventListener('abort', abortFromCaller, { once: true });

    const cleanup = () => params.signal?.removeEventListener('abort', abortFromCaller);
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && event.total > 0) {
        params.onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    });
    xhr.onload = () => {
      cleanup();
      let payload: any = {};
      try { payload = JSON.parse(xhr.responseText || '{}'); } catch {}
      if (xhr.status < 200 || xhr.status >= 300 || !payload?.secure_url) {
        const providerMessage = payload?.error?.message;
        reject(new Error(providerMessage
          ? `Cloudinary photo upload failed: ${providerMessage}`
          : `Cloudinary photo upload failed (HTTP ${xhr.status}). Check the unsigned upload preset and try again.`));
        return;
      }
      params.onProgress?.(100);
      resolve({
        url: String(payload.secure_url),
        publicId: String(payload.public_id || ''),
        bytes: Number(payload.bytes || params.blob.size),
        format: String(payload.format || '')
      });
    };
    xhr.onerror = () => {
      cleanup();
      reject(new Error('Cloudinary photo upload could not connect. Check your internet connection and retry.'));
    };
    xhr.ontimeout = () => {
      cleanup();
      reject(new Error('Cloud photo upload timed out after 90 seconds. Check your connection and retry.'));
    };
    xhr.onabort = () => {
      cleanup();
      reject(new Error('Cloud photo upload was cancelled. Please retry.'));
    };
    params.onProgress?.(0);
    xhr.send(form);
  });
}

export interface ResumableUploadController {
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  promise: Promise<{
    url: string;
    storagePath: string;
    provider: 'firebase-storage';
  }>;
}

function formatFirebaseStorageError(err: any, subDir: 'photos' | 'videos' | 'thumbnails'): string {
  const code = String(err?.code || '');
  const label = subDir === 'videos' ? 'video' : 'photo';
  if (code === 'storage/canceled') {
    return 'Upload cancelled by user.';
  }
  if (code === 'storage/unauthorized') {
    return `Unable to upload ${label} to cloud storage (permission denied). Please try again later or paste an external media link.`;
  }
  if (code === 'storage/quota-exceeded') {
    return `Cloud media storage quota reached while uploading ${label}. Please try again later or paste an external media link.`;
  }
  if (code === 'storage/retry-limit-exceeded') {
    return `Network connection timed out while uploading ${label}. Please check your internet connection and click Retry.`;
  }
  return `Unable to upload ${label} to cloud storage right now. Please check your internet connection and click Retry, or paste an external media link.`;
}

/**
 * Direct Firebase Storage resumable upload with pause/resume/cancel support.
 * Does not attempt any server chunk fallback on the static public website.
 */
export function startResumableMediaUpload(params: {
  blob: Blob;
  sessionId: string;
  subDir: 'photos' | 'videos' | 'thumbnails';
  fileName: string;
  onProgress: (pct: number) => void;
  onStateChange?: (state: 'running' | 'paused' | 'error' | 'completed') => void;
}): ResumableUploadController {
  const cleanedBaseName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-150);
  const safeName = `${Date.now()}_${cleanedBaseName}`;
  const objectPath = `property-submissions/${params.sessionId}/${params.subDir}/${safeName}`;

  let cancelled = false;
  let activeFirebaseTask: UploadTask | null = null;

  const promise = new Promise<{
    url: string;
    storagePath: string;
    provider: 'firebase-storage';
  }>((resolve, reject) => {
    try {
      const targetRef = storageRef(storage, objectPath);
      const task = uploadBytesResumable(targetRef, params.blob, {
        contentType: params.blob.type || (params.subDir === 'videos' ? 'video/mp4' : 'image/webp')
      });
      activeFirebaseTask = task;

      task.on(
        'state_changed',
        (snapshot) => {
          const pct = snapshot.totalBytes > 0
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            : 0;
          params.onProgress(pct);
          if (snapshot.state === 'paused') {
            params.onStateChange?.('paused');
          } else if (snapshot.state === 'running') {
            params.onStateChange?.('running');
          }
        },
        (firebaseErr) => {
          params.onStateChange?.('error');
          if (cancelled || firebaseErr?.code === 'storage/canceled') {
            reject(new Error('Upload cancelled by user.'));
            return;
          }
          reject(new Error(formatFirebaseStorageError(firebaseErr, params.subDir)));
        },
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            params.onProgress(100);
            params.onStateChange?.('completed');
            resolve({
              url,
              storagePath: objectPath,
              provider: 'firebase-storage'
            });
          } catch (err) {
            params.onStateChange?.('error');
            reject(new Error(formatFirebaseStorageError(err, params.subDir)));
          }
        }
      );
    } catch (err) {
      params.onStateChange?.('error');
      reject(new Error(formatFirebaseStorageError(err, params.subDir)));
    }
  });

  return {
    pause: () => {
      if (activeFirebaseTask) {
        activeFirebaseTask.pause();
      }
      params.onStateChange?.('paused');
    },
    resume: () => {
      if (activeFirebaseTask) {
        activeFirebaseTask.resume();
      }
      params.onStateChange?.('running');
    },
    cancel: () => {
      cancelled = true;
      if (activeFirebaseTask) {
        activeFirebaseTask.cancel();
      }
    },
    promise
  };
}

/**
 * Deletes an uploaded Firebase Storage object safely.
 */
export async function deleteUploadedMediaPath(pathOrUrl: string): Promise<void> {
  if (!pathOrUrl) return;
  const trimmed = pathOrUrl.trim();

  if (trimmed.startsWith('property-submissions/') || trimmed.startsWith('portfolio-media/')) {
    try {
      await deleteObject(storageRef(storage, trimmed));
    } catch (err: any) {
      if (err?.code === 'storage/unauthorized') throw err;
    }
    return;
  }

  if (trimmed.includes('firebasestorage.googleapis.com')) {
    try {
      await deleteObject(storageRef(storage, trimmed));
    } catch (err: any) {
      if (err?.code === 'storage/unauthorized') throw err;
    }
  }
}

export function createUploadItemRecord(params: {
  id: string;
  url: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  storagePath: string;
  kind: 'photo' | 'video';
  fileName: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  durationSec?: number;
  sha256?: string;
}): UploadedMediaItem {
  return {
    id: params.id,
    url: params.url,
    thumbnailUrl: params.thumbnailUrl,
    posterUrl: params.posterUrl,
    storagePath: params.storagePath,
    kind: params.kind,
    fileName: params.fileName,
    mimeType: params.mimeType,
    originalSize: params.originalSize,
    compressedSize: params.compressedSize,
    wasCompressed: params.wasCompressed,
    durationSec: params.durationSec,
    sha256: params.sha256
  };
}
