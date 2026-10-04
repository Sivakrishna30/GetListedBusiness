import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'light',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-md',
    md: 'w-9 h-9 text-sm rounded-lg',
    lg: 'w-11 h-11 text-base rounded-xl',
  }[size];

  const textSizeClasses = {
    sm: 'text-base font-semibold tracking-tight',
    md: 'text-lg font-bold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
  }[size];

  const textColor = variant === 'dark' ? 'text-white' : 'text-stone-900';

  return (
    <div id="glb-brand-logo" className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Square-based visual form GLB monogram */}
      <div
        className={`${iconSizeClasses} bg-teal-700 text-white flex items-center justify-center font-extrabold tracking-wider shadow-sm border border-teal-800/20 shrink-0`}
      >
        GLB
      </div>

      {showText && (
        <span className={`${textSizeClasses} ${textColor}`}>
          Get<span className="text-teal-700 font-extrabold">Listed</span>
        </span>
      )}
    </div>
  );
};
