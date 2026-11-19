import React, { useMemo } from 'react';
import { ExternalLink, Image as ImageIcon, HardDrive, Gauge, ShieldCheck, RefreshCw } from 'lucide-react';
import { Project } from '../types';

interface CloudinaryUsageMonitorProps {
  projects: Project[];
}

const CLOUDINARY_HOST = 'res.cloudinary.com';

export const CloudinaryUsageMonitor: React.FC<CloudinaryUsageMonitorProps> = ({ projects }) => {
  const inventory = useMemo(() => {
    const urls = new Set<string>();
    const listingIds = new Set<string>();
    projects.forEach((project, index) => {
      const candidates = [
        ...(Array.isArray(project.imageUrls) ? project.imageUrls : []),
        project.mobileImageUrl,
        project.ogImage
      ];
      let listingHasCloudinaryPhoto = false;
      candidates.forEach((value) => {
        if (typeof value !== 'string' || !value.trim()) return;
        try {
          const parsed = new URL(value);
          if (parsed.hostname === CLOUDINARY_HOST && parsed.pathname.includes('/image/upload/')) {
            urls.add(value);
            listingHasCloudinaryPhoto = true;
          }
        } catch {
          // Ignore malformed and non-URL media values.
        }
      });
      if (listingHasCloudinaryPhoto) listingIds.add(project.id || project.name || String(index));
    });
    return { photoCount: urls.size, listingCount: listingIds.size };
  }, [projects]);

  return (
    <section className="space-y-6">
      <div className="rounded-sm border border-art-gold/30 bg-gradient-to-br from-[#171714] to-[#101010] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-art-gold font-black mb-2">Cloudinary • Photo Storage</p>
            <h3 className="text-2xl sm:text-3xl font-serif italic text-white">Media Usage Monitor</h3>
            <p className="text-xs text-white/55 mt-2 max-w-2xl leading-relaxed">
              Track the Cloudinary photos currently referenced by loaded BS Homez portfolio listings and open Cloudinary for authoritative account usage.
            </p>
          </div>
          <a
            href="https://console.cloudinary.com/console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-art-gold text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white transition-colors shrink-0"
          >
            Open Cloudinary Dashboard <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-white/10 bg-white/[0.035] rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] text-white/45 uppercase tracking-[0.22em] font-bold">Cloudinary photo URLs</span>
            <ImageIcon className="text-art-gold" size={18} />
          </div>
          <p className="text-3xl sm:text-4xl font-serif text-white tabular-nums">{inventory.photoCount.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-white/40 mt-2">Unique image URLs found in the currently loaded portfolio records</p>
        </div>
        <div className="border border-white/10 bg-white/[0.035] rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] text-white/45 uppercase tracking-[0.22em] font-bold">Listings with Cloudinary photos</span>
            <HardDrive className="text-art-gold" size={18} />
          </div>
          <p className="text-3xl sm:text-4xl font-serif text-white tabular-nums">{inventory.listingCount.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-white/40 mt-2">Listings containing at least one Cloudinary image URL</p>
        </div>
      </div>

      <div className="border border-amber-400/25 bg-amber-400/[0.06] rounded-sm p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-200 text-xs font-bold">
          <ShieldCheck size={15} /> Account usage and credits
        </div>
        <p className="text-xs text-white/65 leading-relaxed">
          Exact storage (GB), bandwidth, transformations and remaining free-plan credits are account-level Cloudinary metrics. This static website cannot safely request them because Cloudinary's Admin API requires a private API secret. That secret must never be placed in browser code.
        </p>
        <a
          href="https://console.cloudinary.com/console"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-art-gold hover:text-white"
        >
          View live storage and credits <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex items-start gap-3 text-[10px] text-white/40 leading-relaxed">
        <Gauge size={15} className="text-art-gold shrink-0 mt-0.5" />
        <span>The photo count above is an inventory estimate from the portfolio data loaded in this Admin Vault. It is not the total Cloudinary account file count and does not measure storage size. Photos in pending submissions or other folders may not be included.</span>
      </div>
    </section>
  );
};
