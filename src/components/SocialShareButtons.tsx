import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Linkedin, Twitter, Facebook, Send, Share2 } from 'lucide-react';

interface SocialShareButtonsProps {
  propertyTitle: string;
  propertyHighlights?: string[];
  propertyLink: string;
  className?: string;
  compact?: boolean;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ 
  propertyTitle, 
  propertyHighlights = [], 
  propertyLink,
  className = "",
  compact = false
}) => {
  const [copied, setCopied] = useState(false);

  const highlightsText = propertyHighlights.length > 0 
    ? `\nHighlights:\n${propertyHighlights.slice(0, 4).map(h => `• ${h}`).join('\n')}\n`
    : '';

  const shareMessage = `🌟 *${propertyTitle}*\n${highlightsText}\n📍 Verified with BS Homez | 0% Brokerage\nView property & floor plans:\n${propertyLink}`;

  const copyToClipboard = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareMessage)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = shareMessage;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const openShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const encodedUrl = encodeURIComponent(propertyLink);
  const encodedText = encodeURIComponent(shareMessage);
  const encodedTitle = encodeURIComponent(propertyTitle);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=BangaloreRealEstate,BSHomez`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(propertyTitle)}`;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={() => openShare(whatsappUrl)}
          aria-label="Share on WhatsApp"
          className="p-1.5 rounded-sm bg-lux-ivory hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
          title="Share on WhatsApp"
        >
          <MessageSquare size={13} />
        </button>

        <button
          type="button"
          onClick={() => openShare(linkedinUrl)}
          aria-label="Share on LinkedIn"
          className="p-1.5 rounded-sm bg-lux-ivory hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
          title="Share on LinkedIn"
        >
          <Linkedin size={13} />
        </button>

        <button
          type="button"
          onClick={() => openShare(twitterUrl)}
          aria-label="Share on X / Twitter"
          className="p-1.5 rounded-sm bg-lux-ivory hover:bg-lux-forest text-lux-charcoal hover:text-lux-card border border-lux-border hover:border-lux-forest transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
          title="Share on X / Twitter"
        >
          <Twitter size={13} />
        </button>

        <button
          type="button"
          onClick={copyToClipboard}
          aria-label="Copy share link"
          className="p-1.5 rounded-sm bg-lux-ivory hover:bg-lux-gold/20 text-lux-charcoal hover:text-lux-forest border border-lux-border hover:border-lux-gold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
          title="Copy share link"
        >
          {copied ? <Check size={13} className="text-lux-forest" /> : <Copy size={13} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-lux-muted flex items-center gap-1 mr-1">
        <Share2 size={11} className="text-lux-gold" />
        <span>Share:</span>
      </span>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={() => openShare(whatsappUrl)}
        aria-label="Share on WhatsApp"
        className="flex items-center gap-1 px-2.5 py-1 bg-lux-ivory hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest rounded-sm text-xs font-semibold transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
        title="Share on WhatsApp"
      >
        <MessageSquare size={12} />
        <span className="text-[10px]">WhatsApp</span>
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={() => openShare(linkedinUrl)}
        aria-label="Share on LinkedIn"
        className="flex items-center gap-1 px-2.5 py-1 bg-lux-ivory hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest rounded-sm text-xs font-semibold transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
        title="Share on LinkedIn"
      >
        <Linkedin size={12} />
        <span className="text-[10px]">LinkedIn</span>
      </button>

      {/* Twitter / X */}
      <button
        type="button"
        onClick={() => openShare(twitterUrl)}
        aria-label="Share on X / Twitter"
        className="flex items-center gap-1 px-2 py-1 bg-lux-ivory hover:bg-lux-forest text-lux-charcoal hover:text-lux-card border border-lux-border hover:border-lux-forest rounded-sm text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
        title="Share on X / Twitter"
      >
        <Twitter size={12} />
        <span className="text-[10px]">X</span>
      </button>

      {/* Facebook */}
      <button
        type="button"
        onClick={() => openShare(facebookUrl)}
        aria-label="Share on Facebook"
        className="flex items-center gap-1 px-2 py-1 bg-lux-ivory hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest rounded-sm text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
        title="Share on Facebook"
      >
        <Facebook size={12} />
      </button>

      {/* Telegram */}
      <button
        type="button"
        onClick={() => openShare(telegramUrl)}
        aria-label="Share on Telegram"
        className="flex items-center gap-1 px-2 py-1 bg-lux-ivory hover:bg-lux-forest text-lux-forest hover:text-lux-card border border-lux-border hover:border-lux-forest rounded-sm text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
        title="Share on Telegram"
      >
        <Send size={12} />
      </button>

      {/* Copy Link */}
      <button
        type="button"
        onClick={copyToClipboard}
        aria-label="Copy complete property details and URL"
        className="flex items-center gap-1 px-2.5 py-1 bg-lux-card border border-lux-border hover:border-lux-gold text-lux-charcoal hover:text-lux-forest rounded-sm text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-forest/40"
        title="Copy complete property details and URL"
      >
        {copied ? <Check size={12} className="text-lux-forest" /> : <Copy size={12} />}
        <span className="text-[10px]">{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
};
