import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface SocialShareButtonsProps {
  propertyTitle: string;
  propertyHighlights: string[];
  propertyLink: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ 
  propertyTitle, 
  propertyHighlights, 
  propertyLink 
}) => {
  const [copied, setCopied] = useState(false);

  const shareMessage = `Check out this property: ${propertyTitle}\n\nHighlights:\n${propertyHighlights.map(h => `- ${h}`).join('\n')}\n\nView here: ${propertyLink}`;

  const copyToClipboard = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareMessage)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
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
        });
    } else {
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
    }
  };


  return (
    <div className="flex items-center gap-3">
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-3 py-2 bg-white/[0.05] border border-white/[0.1] hover:border-art-gold/50 text-white/70 hover:text-art-gold transition-all duration-300 rounded-sm text-xs font-medium"
      >
        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};
