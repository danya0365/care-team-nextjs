'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/src/presentation/utils/cn';
import { useAuthPresenter } from '@/src/presentation/presenters/auth/useAuthPresenter';
import { 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  Menu, 
  Home,
  ShieldCheck,
  FileText,
  LogOut,
  Calendar
} from 'lucide-react';
import { animated, useSpring } from '@react-spring/web';

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

function SidebarItem({ icon: Icon, label, href, isActive, isCollapsed }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
        isActive 
          ? "bg-primary text-white shadow-lg shadow-primary/25" 
          : "text-text-secondary dark:text-text-muted hover:bg-primary/10 hover:text-primary"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
      
      {!isCollapsed && (
        <span className="font-bold text-sm tracking-wide transition-opacity duration-300">
          {label}
        </span>
      )}
      
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-text-primary dark:bg-ui-surface rounded-xl text-white text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl border border-white/10">
          {label}
        </div>
      )}

      {isActive && !isCollapsed && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { state, actions } = useAuthPresenter();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'ภาพรวมระบบ', href: '/admin', icon: BarChart3 },
    { label: 'จัดการกิจกรรม', href: '/admin/events', icon: Calendar },
    { label: 'จัดการการลงทะเบียน', href: '/admin/registrations', icon: Users },
    { label: 'ตั้งค่าระบบ', href: '#', icon: Settings },
  ];

  const sidebarSpring = useSpring({
    width: isCollapsed ? '90px' : '280px',
    config: { tension: 300, friction: 30 },
  });

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[70]">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-14 h-14 rounded-2xl bg-primary text-white shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
        >
          {isMobileOpen ? <ChevronLeft className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <animated.aside
        style={sidebarSpring}
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen z-[60] transition-transform lg:translate-x-0",
          "bg-white/80 dark:bg-background/40 backdrop-blur-3xl border-r border-border dark:border-white/5",
          isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xs">
                  CT
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-text-primary dark:text-foreground">
                  Admin <span className="text-primary prose-invert">Panel</span>
                </span>
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-8 h-8 rounded-lg bg-surface-elevated dark:bg-white/5 items-center justify-center text-text-muted hover:text-primary transition-colors"
            >
              <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            <div className={cn("px-4 mb-4", isCollapsed ? "text-center" : "")}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/50">
                Menu
              </p>
            </div>
            {navItems.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          <div className="pt-6 mt-6 border-t border-border dark:border-white/5 space-y-2">
            <SidebarItem
              label="กลับหน้าหลัก"
              href="/"
              icon={Home}
              isActive={false}
              isCollapsed={isCollapsed}
            />
            <button
              onClick={actions.logout}
              disabled={state.loading}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-error hover:bg-error/10 transition-all duration-300 group disabled:opacity-50",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <LogOut className={cn("w-5 h-5 group-hover:-translate-x-1 transition-transform", state.loading && "animate-pulse")} />
              {!isCollapsed && (
                <span className="font-bold text-sm tracking-wide">
                  {state.loading ? 'กำลังออก...' : 'ออกจากระบบ'}
                </span>
              )}
            </button>
          </div>
        </div>
      </animated.aside>
    </>
  );
}
