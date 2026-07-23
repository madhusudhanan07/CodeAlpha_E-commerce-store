/**
 * FloatingShoppingComposition.tsx — Premium Shopping Cart & Boxes 3D Composition
 *
 * Renders the right panel hero composition matching the user's reference mockup image:
 *  - Circular glowing podium base
 *  - 3D Metal Shopping Cart filled with cardboard delivery boxes
 *  - Purple Shopping Bag with logo
 *  - Soft floating animations & depth glow
 */

import React from 'react';
import { ShoppingBag, Package, Sparkles } from 'lucide-react';

export const FloatingShoppingComposition: React.FC = () => {
  return (
    <div className="hero-composition-light">
      <div className="hero-stage-wrapper">
        {/* Soft Ambient Radial Platform Glow */}
        <div className="hero-podium-glow" />

        {/* Floating Shopping Composition Group */}
        <div className="hero-composition-group">
          
          {/* Purple Brand Shopping Bag (Left side of cart) */}
          <div className="comp-shopping-bag float-bag">
            <div className="bag-handle" />
            <div className="bag-body">
              <div className="bag-logo-icon">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="bag-brand-name">Fresh Party</span>
            </div>
          </div>

          {/* 3D Metal Shopping Cart with Delivery Packages */}
          <div className="comp-cart-wrapper float-cart">
            {/* Packages Stack Inside / Around Cart */}
            <div className="comp-package-stack">
              <div className="package-box box-main">
                <Package className="w-5 h-5 text-amber-800 opacity-75" />
                <span className="box-label">Fresh Party</span>
              </div>
              <div className="package-box box-secondary">
                <span className="box-tape" />
              </div>
            </div>

            {/* Shopping Cart SVG / HTML Structure */}
            <svg
              className="cart-svg-illustration"
              viewBox="0 0 240 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Basket Mesh Grid */}
              <path
                d="M40 30H195L170 120H60L40 30Z"
                fill="url(#cartGrid)"
                stroke="#2563EB"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path d="M40 30L20 10H5" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
              {/* Cart Basket Wires */}
              <line x1="60" y1="50" x2="188" y2="50" stroke="#3B82F6" strokeWidth="2.5" />
              <line x1="65" y1="75" x2="180" y2="75" stroke="#3B82F6" strokeWidth="2.5" />
              <line x1="70" y1="100" x2="173" y2="100" stroke="#3B82F6" strokeWidth="2.5" />
              <line x1="85" y1="30" x2="80" y2="120" stroke="#3B82F6" strokeWidth="2.5" />
              <line x1="115" y1="30" x2="110" y2="120" stroke="#3B82F6" strokeWidth="2.5" />
              <line x1="145" y1="30" x2="140" y2="120" stroke="#3B82F6" strokeWidth="2.5" />

              {/* Lower Metal Chassis */}
              <path d="M60 120L75 155H160L170 120" stroke="#1E40AF" strokeWidth="5" strokeLinecap="round" />

              {/* Wheels */}
              <circle cx="85" cy="168" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="4" />
              <circle cx="85" cy="168" r="4" fill="#FFFFFF" />

              <circle cx="150" cy="168" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="4" />
              <circle cx="150" cy="168" r="4" fill="#FFFFFF" />

              <defs>
                <linearGradient id="cartGrid" x1="40" y1="30" x2="195" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#DBEAFE" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#EFF6FF" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating Feature Floating Pill Badge 1 */}
          <div className="floating-badge badge-top-right">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Fast Express Delivery</span>
          </div>

          {/* Floating Feature Floating Pill Badge 2 */}
          <div className="floating-badge badge-bottom-left">
            <span className="badge-dot-green" />
            <span>100% Authentic Guarantee</span>
          </div>
        </div>

        {/* Glowing Platform Base Rings */}
        <div className="podium-ring ring-outer" />
        <div className="podium-ring ring-inner" />
      </div>
    </div>
  );
};

export default FloatingShoppingComposition;
