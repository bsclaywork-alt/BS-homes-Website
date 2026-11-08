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
          className="p-1.5 rounded-sm bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/30 transition-all cursor-pointer"
          title="Share on WhatsApp"
        >
          <MessageSquare size={13} />
        </button>

        <button
          type="button"
          onClick={() => openShare(linkedinUrl)}
          className="p-1.5 rounded-sm bg-[#0077b5]/15 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-[#0077b5]/30 transition-all cursor-pointer"
          title="Share on LinkedIn"
        >
          <Linkedin size={13} />
        </button>

        <button
          type="button"
          onClick={() => openShare(twitterUrl)}
          className="p-1.5 rounded-sm bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer"
          title="Share on X / Twitter"
        >
          <Twitter size={13} />
        </button>

        <button
          type="button"
          onClick={copyToClipboard}
          className="p-1.5 rounded-sm bg-white/5 hover:bg-art-gold text-white/70 hover:text-black border border-white/10 transition-all cursor-pointer"
          title="Copy share link"
        >
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-white/50 flex items-center gap-1 mr-1">
        <Share2 size={11} className="text-art-gold" />
        <span>Share:</span>
      </span>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={() => openShare(whatsappUrl)}
        className="flex items-center gap-1 px-2.5 py-1 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/35 rounded-sm text-xs font-semibold transition-all cursor-pointer shadow-sm"
        title="Share on WhatsApp"
      >
        <MessageSquare size={12} />
        <span className="text-[10px]">WhatsApp</span>
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={() => openShare(linkedinUrl)}
        className="flex items-center gap-1 px-2.5 py-1 bg-[#0077b5]/15 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-[#0077b5]/35 rounded-sm text-xs font-semibold transition-all cursor-pointer shadow-sm"
        title="Share on LinkedIn"
      >
        <Linkedin size={12} />
        <span className="text-[10px]">LinkedIn</span>
      </button>

      {/* Twitter / X */}
      <button
        type="button"
        onClick={() => openShare(twitterUrl)}
        className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white text-white/80 hover:text-black border border-white/15 rounded-sm text-xs font-semibold transition-all cursor-pointer"
        title="Share on X / Twitter"
      >
        <Twitter size={12} />
        <span className="text-[10px]">X</span>
      </button>

      {/* Facebook */}
      <button
        type="button"
        onClick={() => openShare(facebookUrl)}
        className="flex items-center gap-1 px-2 py-1 bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 rounded-sm text-xs font-semibold transition-all cursor-pointer"
        title="Share on Facebook"
      >
        <Facebook size={12} />
      </button>

      {/* Telegram */}
      <button
        type="button"
        onClick={() => openShare(telegramUrl)}
        className="flex items-center gap-1 px-2 py-1 bg-[#0088cc]/15 hover:bg-[#0088cc] text-[#0088cc] hover:text-white border border-[#0088cc]/30 rounded-sm text-xs font-semibold transition-all cursor-pointer"
        title="Share on Telegram"
      >
        <Send size={12} />
      </button>

      {/* Copy Link */}
      <button
        type="button"
        onClick={copyToClipboard}
        className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.05] border border-white/[0.1] hover:border-art-gold/50 text-white/80 hover:text-art-gold rounded-sm text-xs font-medium transition-all cursor-pointer"
        title="Copy complete property details and URL"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        <span className="text-[10px]">{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
};
