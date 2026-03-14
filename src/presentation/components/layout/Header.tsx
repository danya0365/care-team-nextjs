'use client';

/**
 * Header
 * Redesigned navigation header with glassmorphism and smooth animations
 * Preserving care-team-nextjs color mood
 */

import { siteConfig } from '@/src/config/site';
import { animated, useSpring, config } from '@react-spring/web';
import { Menu, X, Heart, Info, Briefcase, Mail, UserPlus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/src/presentation/utils/cn';

const navLinks = [
  { name: 'หน้าแรก', href: '/', icon: Heart },
  { name: 'เกี่ยวกับเรา', href: '/about', icon: Info },
  { name: 'บริการ', href: '/services', icon: Briefcase },
  { name: 'ติดต่อเรา', href: '/contact', icon: Mail },
  { name: 'จัดการ', href: '/admin', icon: ShieldCheck },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoSpring = useSpring({
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0 },
    config: { tension: 200, friction: 20 },
  });

  const menuSpring = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 300, friction: 25 },
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Glassmorphism background layer */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-300",
          isScrolled 
            ? "bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-border shadow-header" 
            : "bg-transparent border-b border-transparent"
        )} 
      />
      
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Logo */}
          <animated.div style={logoSpring}>
            <Link href="/" className="flex items-center gap-3 group" id="header-logo">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center
                  bg-gradient-to-br from-primary to-accent text-white font-bold text-base
                  shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  CT
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-text-primary dark:text-foreground leading-tight tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {siteConfig.name}
                </h1>
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
                  Harm Reduction • สงขลา
                </p>
              </div>
            </Link>
          </animated.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1" id="main-nav">
            {navLinks.map((link, index) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                index={index}
                isActive={pathname === link.href}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center
                hover:bg-primary-50 dark:hover:bg-primary-dark/20 transition-all duration-200 
                focus-ring cursor-pointer text-text-primary dark:text-foreground"
              aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
              id="mobile-menu-button"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <animated.div
          style={menuSpring}
          className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 overflow-hidden
            bg-white/95 dark:bg-ui-surface/95 backdrop-blur-2xl rounded-3xl
            border border-border/50 shadow-2xl z-40"
        >
          <nav className="p-4 space-y-1" id="mobile-nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "text-primary dark:text-primary-light bg-primary-50 dark:bg-primary-dark/20"
                      : "text-text-secondary dark:text-text-muted hover:text-primary dark:hover:text-primary-light hover:bg-primary-50/50 dark:hover:bg-primary-dark/10"
                  )}
                >
                  <Icon className={cn("w-4.5 h-4.5", isActive ? "text-primary" : "opacity-70")} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </animated.div>
      )}
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  index: number;
}

function NavLink({ href, children, isActive, index }: NavLinkProps) {
  const spring = useSpring({
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0 },
    delay: index * 40,
    config: { tension: 200, friction: 20 },
  });

  const [hoverSpring, hoverApi] = useSpring(() => ({
    scale: 1,
    y: 0,
    config: config.gentle,
  }));

  return (
    <animated.div
      style={{ 
        ...spring, 
        transform: hoverSpring.y.to(y => `translateY(${y}px) scale(${hoverSpring.scale.get()})`) 
      }}
      onMouseEnter={() => hoverApi.start({ scale: 1.02, y: -2 })}
      onMouseLeave={() => hoverApi.start({ scale: 1, y: 0 })}
    >
      <Link
        href={href}
        className={cn(
          "relative px-5 py-2.5 text-[14px] font-semibold rounded-2xl transition-all duration-300",
          isActive
            ? "text-primary dark:text-primary-light bg-primary-50/80 dark:bg-primary-dark/20 shadow-sm"
            : "text-text-secondary dark:text-text-muted hover:text-primary dark:hover:text-primary-light"
        )}
      >
        {children}
        {isActive && (
          <animated.div 
            className="absolute bottom-1 left-5 right-5 h-0.5 rounded-full bg-primary/40"
          />
        )}
      </Link>
    </animated.div>
  );
}
