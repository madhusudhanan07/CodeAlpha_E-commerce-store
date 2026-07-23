/**
 * TrustBadges.tsx — Clean Light Theme Trust Badges Component
 *
 * Renders 4 horizontal cards below the hero CTA buttons matching the design mockup image:
 *  1. Free Delivery
 *  2. Secure Payment
 *  3. Easy Returns
 *  4. 24/7 Support
 */

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headset } from 'lucide-react';

const TRUST_BADGES = [
  {
    icon: <Truck className="w-5 h-5 text-blue-600" />,
    title: 'Free Delivery',
    desc: 'On orders over $50',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
    title: 'Secure Payment',
    desc: '100% secure transactions',
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-indigo-600" />,
    title: 'Easy Returns',
    desc: 'Within 7 days returns',
  },
  {
    icon: <Headset className="w-5 h-5 text-sky-600" />,
    title: '24/7 Support',
    desc: "We're here to help",
  },
];

export const TrustBadges: React.FC = () => {
  return (
    <div className="hero-trust-cards-light">
      {TRUST_BADGES.map((badge, idx) => (
        <div key={idx} className="trust-card-light">
          <div className="trust-icon-box">{badge.icon}</div>
          <div className="trust-text-box">
            <p className="trust-title">{badge.title}</p>
            <p className="trust-desc">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
