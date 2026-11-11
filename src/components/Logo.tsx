import React from 'react';

interface LogoProps {
  variant?: 'gold-on-dark' | 'black-on-light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  horizontal?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gold-on-dark',
  size = 'md',
  showTagline = false,
  className = '',
  horizontal = false
}) => {
  const isDark = variant === 'gold-on-dark';

  const goldPrimary = isDark ? '#C9A24B' : '#1A1A1A';
  const goldLight = isDark ? '#E6C97A' : '#333333';
  const textColor = isDark ? '#F5F0E6' : '#0B0B0B';
  const subtextColor = isDark ? '#C9A24B' : '#666666';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-xs tracking-[0.22em]',
    md: 'text-sm tracking-[0.26em]',
    lg: 'text-lg tracking-[0.3em]',
    xl: 'text-2xl tracking-[0.35em]'
  };

  return (
    <div className={`flex ${horizontal ? 'flex-row items-center gap-3' : 'flex-col items-center'} select-none ${className}`}>
      {/* Brand Icon: Serif 'K' with Vintage Key vertical stem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`goldGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={goldLight} />
              <stop offset="50%" stopColor={goldPrimary} />
              <stop offset="100%" stopColor={isDark ? '#A58235' : '#111111'} />
            </linearGradient>
            <filter id={`glow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={isDark ? "1.5" : "0"} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Key Bow / Head (Top ornamental loop with vintage clover/cross cut) */}
          <circle
            cx="36"
            cy="24"
            r="12"
            stroke={`url(#goldGrad-${variant})`}
            strokeWidth="3.5"
            fill="none"
          />
          <circle
            cx="36"
            cy="24"
            r="5"
            stroke={`url(#goldGrad-${variant})`}
            strokeWidth="2"
            fill="none"
          />
          <circle cx="36" cy="18" r="1.5" fill={goldPrimary} />
          <circle cx="36" cy="30" r="1.5" fill={goldPrimary} />
          <circle cx="30" cy="24" r="1.5" fill={goldPrimary} />
          <circle cx="42" cy="24" r="1.5" fill={goldPrimary} />

          {/* Key Collar / Ornamental Ring */}
          <rect
            x="31"
            y="36"
            width="10"
            height="3.5"
            rx="1.5"
            fill={`url(#goldGrad-${variant})`}
          />

          {/* Key Shaft (The vertical stem of the K) */}
          <path
            d="M36 39.5 L36 86"
            stroke={`url(#goldGrad-${variant})`}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Vintage Key Bits / Teeth at bottom */}
          <path
            d="M36 71 H46 V76 H41 V81 H47 V86 H36"
            fill={`url(#goldGrad-${variant})`}
          />

          {/* Upper Arm of Serif 'K' with classical flared serif */}
          <path
            d="M36 52 Q48 42 66 26"
            stroke={`url(#goldGrad-${variant})`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Upper serif finial */}
          <path
            d="M62 23 L70 24 L68 31"
            stroke={`url(#goldGrad-${variant})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lower Leg of Serif 'K' with sweeping tail and teardrop terminus */}
          <path
            d="M45 46 Q54 60 72 86"
            stroke={`url(#goldGrad-${variant})`}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Lower foot serif */}
          <path
            d="M67 86 H77"
            stroke={`url(#goldGrad-${variant})`}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className={`flex flex-col ${horizontal ? 'items-start' : 'items-center mt-1'} tracking-wide`}>
        <span
          className={`font-sans font-semibold uppercase leading-none whitespace-nowrap ${textSizes[size]}`}
          style={{ color: textColor }}
        >
          KEYORA STUDIO
        </span>
        {showTagline && (
          <span
            className="font-serif italic text-xs tracking-wider mt-1 text-center"
            style={{ color: subtextColor }}
          >
            Personalized · Stylish · Premium
          </span>
        )}
      </div>
    </div>
  );
};
