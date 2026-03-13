'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSpring, animated, config } from '@react-spring/web';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { siteConfig } from '@/src/config/site';

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function NavLink({ href, label, isActive }: NavLinkProps) {
  const [hovered, setHovered] = useState(false);

  const spring = useSpring({
    y: hovered ? -2 : 0,
    opacity: hovered || isActive ? 1 : 0.8,
    config: config.gentle,
  });

  return (
    <animated.div
      style={{
        transform: spring.y.to((y) => `translateY(${y}px)`),
        opacity: spring.opacity,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href}
        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors
          ${
            isActive
              ? 'text-primary dark:text-primary-light bg-primary-50 dark:bg-primary-dark/20'
              : 'text-text-secondary dark:text-text-muted hover:text-primary dark:hover:text-primary-light hover:bg-primary-50/50 dark:hover:bg-primary-dark/10'
          }`}
      >
        {label}
      </Link>
    </animated.div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/about', label: 'เกี่ยวกับเรา' },
    { href: '/services', label: 'บริการ' },
    { href: '/contact', label: 'ติดต่อเรา' },
    { href: '/register', label: 'ลงทะเบียน' },
  ];

  // Mobile menu animation
  const mobileMenuSpring = useSpring({
    height: mobileMenuOpen ? 'auto' : '0px',
    opacity: mobileMenuOpen ? 1 : 0,
    config: config.gentle,
  });

  // Logo hover animation
  const [logoHovered, setLogoHovered] = useState(false);
  const logoSpring = useSpring({
    scale: logoHovered ? 1.05 : 1,
    config: config.wobbly,
  });

  return (
    <header className="sticky top-0 z-50 glass border-b border-border-light dark:border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <animated.div
            style={{ transform: logoSpring.scale.to((s) => `scale(${s})`) }}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <Link href="/" className="flex items-center gap-3 group" id="header-logo">
              {/* Logo icon */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-primary to-accent text-white font-bold text-sm
                shadow-md group-hover:shadow-lg transition-shadow">
                CT
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-text-primary dark:text-foreground leading-tight">
                  {siteConfig.name}
                </h1>
                <p className="text-[10px] text-text-muted leading-tight">
                  Harm Reduction • สงขลา
                </p>
              </div>
            </Link>
          </animated.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" id="main-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center
                hover:bg-primary-50 dark:hover:bg-primary-dark/20 transition-colors focus-ring cursor-pointer"
              aria-label="เปิดเมนู"
              id="mobile-menu-button"
            >
              <svg
                className="w-5 h-5 text-text-primary dark:text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <animated.div
        style={{
          overflow: 'hidden',
          opacity: mobileMenuSpring.opacity,
        }}
        className={`md:hidden border-t border-border-light dark:border-card-border ${
          mobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav className="px-4 py-3 space-y-1" id="mobile-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname === item.href
                    ? 'text-primary dark:text-primary-light bg-primary-50 dark:bg-primary-dark/20'
                    : 'text-text-secondary dark:text-text-muted hover:text-primary dark:hover:text-primary-light hover:bg-primary-50/50 dark:hover:bg-primary-dark/10'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </animated.div>
    </header>
  );
}
