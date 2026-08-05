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
        viewBox="0 0 220 185"
        style={{ height, width: 'auto', maxHeight: '100%' }}
        aria-label="NEW ONE E-Commerce Shop Logo"
      >
        <g fill={color}>
          {/* Top arrow above E in NEW */}
          <path d="M102 36 L110 20 L118 36 H113 V48 H107 V36 Z" fill={color} />
          
          {/* Word 1: NEW */}
          <text
            x="110"
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
            x="110"
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
          
          {/* Tagline: E-COMMERCE SHOP */}
          {showTagline && (
            <text
              x="110"
              y="174"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="700"
              fontSize="11"
              letterSpacing="3.5"
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
