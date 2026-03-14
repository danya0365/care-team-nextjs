'use client';

import Link from 'next/link';
import { useSpring, animated, config } from '@react-spring/web';
import { useState } from 'react';
import { siteConfig } from '@/src/config/site';

interface FooterLinkProps {
  href: string;
  label: string;
  isExternal?: boolean;
}

function FooterLink({ href, label, isExternal }: FooterLinkProps) {
  const [hovered, setHovered] = useState(false);

  const spring = useSpring({
    x: hovered ? 4 : 0,
    opacity: hovered ? 1 : 0.7,
    config: config.gentle,
  });

  const linkProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <animated.div
      style={{
        transform: spring.x.to((x) => `translateX(${x}px)`),
        opacity: spring.opacity,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href}
        className="text-sm text-gray-400 hover:text-primary-light transition-colors"
        {...linkProps}
      >
        {label}
      </Link>
    </animated.div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/about', label: 'เกี่ยวกับเรา' },
    { href: '/services', label: 'บริการของเรา' },
    { href: '/contact', label: 'ติดต่อเรา' },
  ];

  return (
    <footer className="bg-footer-bg text-footer-text" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-primary to-accent text-white font-bold text-sm">
                CT
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{siteConfig.name}</h3>
                <p className="text-xs text-text-muted">{siteConfig.location}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              ลิงก์ด่วน
            </h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <FooterLink key={link.href} href={link.href} label={link.label} />
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              ติดต่อเรา
            </h4>
            <div className="space-y-3 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{siteConfig.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{siteConfig.location}</span>
              </div>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-light transition-colors"
              >
                <svg className="w-4 h-4 text-primary-light flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>{siteConfig.facebook}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {siteConfig.partners.slice(0, 2).map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
