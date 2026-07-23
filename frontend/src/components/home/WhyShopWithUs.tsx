/**
 * WhyShopWithUs.tsx — Featured Services & Value Propositions Section
 *
 * Renders 6 animated cards detailing Fast Delivery, Secure Checkout,
 * Easy Payments, 24/7 Support, Easy Returns, and Trusted Products.
 */

import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headset, RefreshCw, Star, Sparkles } from 'lucide-react';

const SERVICES = [
  {
    icon: <Truck className="w-6 h-6 text-indigo-400" />,
    title: 'Fast Global Delivery',
    desc: 'Free express shipping on all orders over $50 with real-time tracking.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    title: 'Secure Checkout',
    desc: 'Bank-level 256-bit SSL encryption ensuring total privacy & payment safety.',
  },
  {
    icon: <CreditCard className="w-6 h-6 text-purple-400" />,
    title: 'Flexible Payments',
    desc: 'Support for Cards, UPI, Net Banking, Digital Wallets & Cash on Delivery.',
  },
  {
    icon: <Headset className="w-6 h-6 text-amber-400" />,
    title: '24/7 Dedicated Support',
    desc: 'Our customer care team is available round-the-clock to assist you.',
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-blue-400" />,
    title: 'Hassle-Free Returns',
    desc: '30-day money-back guarantee with easy doorstep pickup returns.',
  },
  {
    icon: <Star className="w-6 h-6 text-pink-400 fill-pink-400" />,
    title: '100% Authentic Brands',
    desc: 'Directly sourced from verified global manufacturers & brand partners.',
  },
];

export const WhyShopWithUs: React.FC = () => {
  return (
    <section className="why-shop-section" aria-labelledby="why-shop-heading">
      <div className="container">
        <div className="section__header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(168,85,247,0.12)', padding: '0.35rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(168,85,247,0.3)', marginBottom: '0.75rem' }}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e9d5ff' }}>CodeAlpha Guarantee</span>
            </div>
            <h2 id="why-shop-heading" className="section__title" style={{ fontSize: '2rem' }}>
              Why Shop With Us?
            </h2>
            <p className="section__subtitle" style={{ maxWidth: '600px', margin: '0.4rem auto 0' }}>
              We combine world-class logistics, authentic sourcing, and premium customer experience.
            </p>
          </div>
        </div>

        <div className="services-grid-6">
          {SERVICES.map((item, idx) => (
            <div key={idx} className="service-card-item">
              <div className="service-icon-box">{item.icon}</div>
              <div>
                <h3 className="service-info-title">{item.title}</h3>
                <p className="service-info-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyShopWithUs;
