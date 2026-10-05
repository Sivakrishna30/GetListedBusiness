import React from 'react';
import { useBrandTheme } from '../context/BrandThemeContext.tsx';

export interface LogoProps {
  variant?: 'full' | 'horizontal' | 'stacked' | 'symbol';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  themeMode?: 'auto' | 'theme-b' | 'theme-a' | 'monochrome' | 'white' | 'dark' | 'blue';
  monochromeColor?: string;
  tagline?: boolean | string;
  showText?: boolean;
  className?: string;
  id?: string;
}

export interface SymbolProps {
  size?: number;
  className?: string;
  businessColor?: string;
  customerColor?: string;
  monochrome?: boolean;
  monochromeColor?: string;
}

/**
 * TwoSidedGSymbol — Two Meeting Arrows forming the "G"
 * 
 * Concept:
 * - Arrow 1 (Business Flow -> Royal Blue #2563EB): 
 *   Sweeps along the top & down the left spine, pointing towards the meeting point.
 * - Arrow 2 (Customer Flow -> Coral #F97371): 
 *   Sweeps along the bottom & loops inward pointing straight into the center core of the G.
 * - Where 2 arrows meet: The dynamic connection between Business ↔ Customer forming "G".
 */
export const TwoSidedGSymbol: React.FC<SymbolProps> = ({
  size = 36,
  className = '',
  businessColor,
  customerColor,
  monochrome = false,
  monochromeColor = 'currentColor',
}) => {
  const { theme } = useBrandTheme();

  // Determine colors based on theme or props
  const defaultBusiness = '#2563EB';
  const defaultCustomer = '#F97371';

  const bColor = monochrome ? monochromeColor : (businessColor || defaultBusiness);
  const cColor = monochrome ? monochromeColor : (customerColor || defaultCustomer);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="GetListed Two-Arrow G Logo — Customer Meets Business"
    >
      {/* 
        Arrow 1: Business Arrow (Top & Left Arc)
        Sweeps clockwise down the spine and points towards the customer meeting curve.
      */}
      <path
        d="M 78 18 
           C 62 6 36 6 21 21 
           C 9 33 7 53 14 67 
           L 7 70 
           L 24 86 
           L 33 71 
           L 25 73 
           C 20 61 20 45 29 35 
           C 40 23 58 23 71 31 
           L 78 18 Z"
        fill={bColor}
      />

      {/* 
        Arrow 2: Customer Arrow (Bottom Arc & Inward Horizontal Crossbar)
        Sweeps from the bottom, up the right side, and shoots horizontally inward into the center as an arrowhead.
      */}
      <path
        d="M 36 88 
           C 54 95 73 91 84 78 
           C 92 67 92 53 88 42 
           L 58 42 
           L 58 32 
           L 40 48 
           L 58 64 
           L 58 54 
           L 77 54 
           C 76 62 73 70 67 75 
           C 59 83 46 84 35 79 
           C 33 78 30 81 31 84 
           C 32 86 34 87 36 88 Z"
        fill={cColor}
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  themeMode = 'auto',
  monochromeColor,
  tagline = false,
  showText = true,
  className = '',
  id = 'glb-brand-logo',
}) => {
  const { theme } = useBrandTheme();

  // Resolve size mapping
  let pixelSize = 36;
  let textScale = 'text-xl';
  let taglineScale = 'text-2xs';

  if (typeof size === 'number') {
    pixelSize = size;
    if (size <= 24) {
      textScale = 'text-sm';
      taglineScale = 'text-3xs';
    } else if (size <= 32) {
      textScale = 'text-base';
      taglineScale = 'text-2xs';
    } else if (size <= 48) {
      textScale = 'text-xl';
      taglineScale = 'text-xs';
    } else if (size <= 64) {
      textScale = 'text-2xl';
      taglineScale = 'text-sm';
    } else {
      textScale = 'text-3xl';
      taglineScale = 'text-base';
    }
  } else {
    switch (size) {
      case 'xs':
        pixelSize = 20;
        textScale = 'text-xs font-bold';
        taglineScale = 'text-3xs';
        break;
      case 'sm':
        pixelSize = 28;
        textScale = 'text-base font-extrabold';
        taglineScale = 'text-2xs';
        break;
      case 'md':
        pixelSize = 36;
        textScale = 'text-xl font-extrabold';
        taglineScale = 'text-xs';
        break;
      case 'lg':
        pixelSize = 48;
        textScale = 'text-2xl font-extrabold';
        taglineScale = 'text-sm';
        break;
      case 'xl':
        pixelSize = 64;
        textScale = 'text-3xl font-extrabold';
        taglineScale = 'text-base';
        break;
      case '2xl':
        pixelSize = 88;
        textScale = 'text-5xl font-black';
        taglineScale = 'text-lg';
        break;
    }
  }

  // Resolve active theme mode & colors
  const effectiveTheme = themeMode === 'auto' ? theme : (themeMode === 'theme-a' || themeMode === 'theme-b' ? themeMode : theme);
  const isMonochrome = themeMode === 'monochrome' || themeMode === 'white' || themeMode === 'dark' || themeMode === 'blue';

  let resolvedMonoColor = monochromeColor || 'currentColor';
  
  // Get = Royal Blue (#2563EB) & Listed = Coral (#F97371)
  let prefixColor = '#2563EB';
  let suffixColor = '#F97371';
  let taglineColor = '#52525B';

  if (themeMode === 'white') {
    resolvedMonoColor = '#FFFFFF';
    prefixColor = '#FFFFFF';
    suffixColor = '#F97371';
    taglineColor = 'rgba(255, 255, 255, 0.85)';
  } else if (themeMode === 'dark') {
    resolvedMonoColor = '#18181B';
    prefixColor = '#18181B';
    suffixColor = '#18181B';
    taglineColor = '#52525B';
  } else if (themeMode === 'blue') {
    resolvedMonoColor = '#FFFFFF';
    prefixColor = '#FFFFFF';
    suffixColor = '#F97371';
    taglineColor = 'rgba(255, 255, 255, 0.85)';
  } else if (themeMode === 'monochrome') {
    prefixColor = resolvedMonoColor;
    suffixColor = resolvedMonoColor;
  }

  // Determine tagline text
  const taglineText = typeof tagline === 'string' ? tagline : 'Bring Your Business to the World';
  const shouldRenderTagline = Boolean(tagline) || variant === 'full';

  // 1. Symbol Only Variant
  if (variant === 'symbol' || !showText) {
    return (
      <div id={id} className={`inline-flex items-center justify-center ${className}`}>
        <TwoSidedGSymbol
          size={pixelSize}
          monochrome={isMonochrome}
          monochromeColor={resolvedMonoColor}
          businessColor={isMonochrome ? undefined : '#2563EB'}
          customerColor={isMonochrome ? undefined : '#F97371'}
        />
      </div>
    );
  }

  // 2. Stacked Variant (Symbol above GetListed)
  if (variant === 'stacked') {
    return (
      <div id={id} className={`inline-flex flex-col items-center text-center gap-2 select-none ${className}`}>
        <TwoSidedGSymbol
          size={pixelSize}
          monochrome={isMonochrome}
          monochromeColor={resolvedMonoColor}
          businessColor={isMonochrome ? undefined : '#2563EB'}
          customerColor={isMonochrome ? undefined : '#F97371'}
        />
        <div className="flex flex-col items-center">
          <span className={`${textScale} tracking-tight leading-none`}>
            <span style={{ color: prefixColor }}>Get</span>
            <span style={{ color: suffixColor }} className="font-extrabold">Listed</span>
          </span>
          {shouldRenderTagline && (
            <span
              className={`${taglineScale} font-medium mt-1 tracking-normal`}
              style={{ color: taglineColor }}
            >
              {taglineText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. Full / Horizontal Variant (Symbol + GetListed + optional Tagline)
  return (
    <div id={id} className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <TwoSidedGSymbol
        size={pixelSize}
        monochrome={isMonochrome}
        monochromeColor={resolvedMonoColor}
        businessColor={isMonochrome ? undefined : '#2563EB'}
        customerColor={isMonochrome ? undefined : '#F97371'}
      />

      <div className="flex flex-col justify-center">
        <span className={`${textScale} tracking-tight leading-none`}>
          <span style={{ color: prefixColor }}>Get</span>
          <span style={{ color: suffixColor }} className="font-extrabold">Listed</span>
        </span>
        {shouldRenderTagline && (
          <span
            className={`${taglineScale} font-medium mt-0.5 tracking-normal leading-tight`}
            style={{ color: taglineColor }}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};
