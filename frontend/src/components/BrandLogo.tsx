import React from 'react';

interface BrandLogoProps {
  className?: string;
  height?: number | string;
  color?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  height = 52,
  color = '#173f15',
  showTagline = true,
}) => {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <svg
        viewBox="0 0 230 195"
        style={{ height, width: 'auto', maxHeight: '100%' }}
        aria-label="NEW ONE E-Commerce Shop Logo"
      >
        <g fill={color}>
          {/* Top arrow above E in NEW */}
          <path d="M107 36 L115 20 L123 36 H118 V48 H112 V36 Z" fill={color} />
          
          {/* Word 1: NEW */}
          <text
            x="115"
            y="95"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="58"
            letterSpacing="3"
            fill={color}
          >
            NEW
          </text>
          
          {/* Word 2: ONE */}
          <text
            x="115"
            y="148"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="58"
            letterSpacing="3"
            fill={color}
          >
            ONE
          </text>
          
          {/* Subtitle / Tagline: E-COMMERCE SHOP (Maximised Size) */}
          {showTagline && (
            <text
              x="115"
              y="182"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="900"
              fontSize="21"
              letterSpacing="1.5"
              fill={color}
            >
              E-COMMERCE SHOP
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

export default BrandLogo;
