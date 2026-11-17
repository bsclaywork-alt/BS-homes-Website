import React from 'react';

import imgEastReady from '../assets/images/east_bangalore_ready_move_1791731742991.jpg';
import imgEastReadyWebp from '../assets/images/east_bangalore_ready_move_1791731742991.webp';
import imgSouthEastHanded from '../assets/images/southeast_bangalore_handed_over_1791731753795.jpg';
import imgSouthEastHandedWebp from '../assets/images/southeast_bangalore_handed_over_1791731753795.webp';
import imgGunjurSanctuary from '../assets/images/gunjur_eden_sanctuary_1791784080314.jpg';
import imgGunjurSanctuaryWebp from '../assets/images/gunjur_eden_sanctuary_1791784080314.webp';
import imgCatABiophilic from '../assets/images/cat_a_biophilic_enclave_1791789057278.jpg';
import imgCatABiophilicWebp from '../assets/images/cat_a_biophilic_enclave_1791789057278.webp';
import imgLuxuryPlotEstate from '../assets/images/luxury_villa_plot_estate_1791789096814.jpg';
import imgLuxuryPlotEstateWebp from '../assets/images/luxury_villa_plot_estate_1791789096814.webp';

const webpMap: Record<string, string> = {
  [imgEastReady]: imgEastReadyWebp,
  [imgSouthEastHanded]: imgSouthEastHandedWebp,
  [imgGunjurSanctuary]: imgGunjurSanctuaryWebp,
  [imgCatABiophilic]: imgCatABiophilicWebp,
  [imgLuxuryPlotEstate]: imgLuxuryPlotEstateWebp,
};

// Neutral branded placeholder is used only if both the optimized and original image fail.
const IMAGE_UNAVAILABLE_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22500%22 viewBox=%220 0 800 500%22%3E%3Crect width=%22800%22 height=%22500%22 fill=%22%23102e26%22/%3E%3Cpath d=%22M0 390L210 210l125 110 130-160 335 230v110H0z%22 fill=%22%231b463b%22/%3E%3Ctext x=%22400%22 y=%22255%22 fill=%22%23d5b779%22 font-family=%22Arial,sans-serif%22 font-size=%2230%22 text-anchor=%22middle%22%3EBS Homez%3C/text%3E%3Ctext x=%22400%22 y=%22295%22 fill=%22%23ffffff%22 fill-opacity=%22.75%22 font-family=%22Arial,sans-serif%22 font-size=%2217%22 text-anchor=%22middle%22%3EImage temporarily unavailable%3C/text%3E%3C/svg%3E';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  width?: number | string;
  height?: number | string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  width = 1200,
  height = 750,
  onError,
  ...props
}) => {
  const webpSrc = webpMap[src];

  const handleImageError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const image = event.currentTarget;
    const stage = image.dataset.imageFallbackStage || 'optimized';

    // Retry the original JPEG/PNG before showing the placeholder.
    if (webpSrc && stage === 'optimized') {
      image.dataset.imageFallbackStage = 'original';
      image.src = src;
      return;
    }

    if (stage !== 'placeholder') {
      image.dataset.imageFallbackStage = 'placeholder';
      image.src = IMAGE_UNAVAILABLE_PLACEHOLDER;
      return;
    }

    onError?.(event);
  };

  return (
    <img
      src={webpSrc || src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      width={width}
      height={height}
      onError={handleImageError}
      {...props}
    />
  );
};
