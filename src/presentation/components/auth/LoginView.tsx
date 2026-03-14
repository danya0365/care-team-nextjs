'use client';

import { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useAuthPresenter } from '@/src/presentation/presenters/auth/useAuthPresenter';
import { Mail, Lock, LogIn, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { AnimatedButton } from '../common/AnimatedButton';
import { cn } from '@/src/presentation/utils/cn';

export function LoginView() {
  const { state, actions } = useAuthPresenter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await actions.login(email, password);
    if (success) {
      window.location.href = '/admin';
    }
  };

  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle,
  });

  const cardSpring = useSpring({
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
    boxShadow: isHovered 
      ? '0 20px 40px -20px rgba(0, 102, 255, 0.2)' 
      : '0 10px 20px -10px rgba(0, 0, 0, 0.1)',
    config: config.wobbly,
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface dark:bg-background overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <animated.div style={containerSpring} className="w-full max-w-lg relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white dark:bg-white/5 border border-white/20 dark:border-white/5 shadow-2xl mb-6 transform hover:rotate-12 transition-transform duration-500">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-text-primary dark:text-foreground mb-3 tracking-tight">
            <span className="gradient-text">CARE</span> TEAM
          </h1>
          <p className="text-text-secondary dark:text-text-muted font-bold uppercase tracking-[0.2em] text-xs">
            Admin Management Panel
          </p>
        </div>

        <animated.div 
          style={cardSpring}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-white dark:bg-card-bg rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-white/20 dark:border-white/5 backdrop-blur-xl"
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-text-primary dark:text-foreground">เข้าสู่ระบบหลังบ้าน</h2>
            <p className="text-text-muted mt-2 font-medium">กรอกอีเมลและรหัสผ่านเพื่อเข้าถึงระบบจัดการ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {state.error && (
              <div className="p-4 rounded-2xl bg-error/5 border border-error/20 flex items-center gap-3 text-error text-sm font-bold animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-text-secondary items-center gap-2 flex mb-2 ml-1">
                อีเมลผู้ใช้งาน (EMAIL ADDRESS)
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-primary z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-surface-elevated dark:bg-white/5 
                    border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                    outline-none transition-all placeholder:text-text-muted font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-text-secondary items-center gap-2 flex mb-2 ml-1">
                รหัสผ่าน (PASSWORD)
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-primary z-10" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-surface-elevated dark:bg-white/5 
                    border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                    outline-none transition-all placeholder:text-text-muted font-bold text-lg"
                />
              </div>
            </div>

            <div className="pt-4">
              <AnimatedButton
                type="submit"
                variant="primary"
                className="w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group"
                disabled={state.loading}
              >
                {state.loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    ยืนยันการเข้าสู่ระบบ
                  </>
                )}
              </AnimatedButton>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <p className="text-text-muted text-xs font-bold leading-relaxed">
              &copy; 2026 Care Team Songkhla. <br />
              All rights reserved. Secure access only.
            </p>
          </div>
        </animated.div>
      </animated.div>
    </div>
  );
}
