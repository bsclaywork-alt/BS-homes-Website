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
  ...props
}) => {
  const webpSrc = webpMap[src];

  if (webpSrc) {
    return (
      <picture className={containerClassName || 'block w-full h-full'}>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt={alt}
          className={className}
          loading={priority ? 'eager' : 'lazy'}
          {...(priority ? { fetchPriority: 'high' } : {})}
          width={width}
          height={height}
          {...props}
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' } : {})}
      width={width}
      height={height}
      {...props}
    />
  );
};
