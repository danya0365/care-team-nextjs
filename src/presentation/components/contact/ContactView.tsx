'use client';

import { useContactPresenter } from '@/src/presentation/presenters/contact/useContactPresenter';
import { ContactViewModel } from '@/src/presentation/presenters/contact/ContactPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';

interface ContactViewProps {
  initialViewModel?: ContactViewModel;
}

export function ContactView({ initialViewModel }: ContactViewProps) {
  const [state] = useContactPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!viewModel) return null;

  return (
    <div className="flex flex-col pb-20 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section with Gradient */}
      <section 
        className="relative py-20 md:py-32"
        style={{
          background: 'linear-gradient(to bottom, var(--gradient-hero-from), var(--gradient-hero-to))',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-dark/20 text-primary dark:text-primary-light text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Contact Support 24/7
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary dark:text-foreground mb-6 leading-tight">
              ติดต่อ <span className="gradient-text">สอบถามข้อมูล</span>
            </h1>
            <p className="text-lg text-text-secondary dark:text-text-muted max-w-3xl mx-auto leading-relaxed">
              ทีมงานของเราพร้อมให้คำปรึกษาและช่วยเหลือคุณตลอดเวลา 
              ติดต่อเราได้ผ่านช่องทางต่างๆ ด้านล่างนี้
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <AnimatedSection direction="left">
              <h2 className="text-2xl font-bold text-text-primary dark:text-foreground mb-8">
                ช่องทางการติดต่อ
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <AnimatedSection direction="left" delay={100}>
                <AnimatedCard className="p-6 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                    📞
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">โทรศัพท์</p>
                    <p className="text-lg font-bold text-text-primary dark:text-foreground">{viewModel.phone}</p>
                  </div>
                </AnimatedCard>
              </AnimatedSection>

              <AnimatedSection direction="left" delay={200}>
                <AnimatedCard className="p-6 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl">
                    👥
                  </div>
                  <div>
                    <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Facebook</p>
                    <a href={viewModel.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-text-primary dark:text-foreground hover:text-primary transition-colors">
                      {viewModel.facebook}
                    </a>
                  </div>
                </AnimatedCard>
              </AnimatedSection>

              <AnimatedSection direction="left" delay={300}>
                <AnimatedCard className="p-6 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div>
                    <p className="text-xs font-bold text-warning uppercase tracking-widest mb-1">ที่อยู่</p>
                    <p className="text-base font-semibold text-text-primary dark:text-foreground">{viewModel.location}</p>
                    <p className="text-sm text-text-secondary dark:text-text-muted">ครอบคลุมพื้นที่ {viewModel.areas.join(', ')}</p>
                  </div>
                </AnimatedCard>
              </AnimatedSection>
            </div>
          </div>

          {/* Contact Form / Placeholder */}
          <AnimatedSection direction="right" delay={200}>
            <div className="bg-white dark:bg-card-bg p-8 md:p-10 rounded-[2rem] shadow-elevated border border-border-light dark:border-card-border">
              <h3 className="text-xl font-bold mb-8 text-text-primary dark:text-foreground">
                ส่งข้อความถึงเรา
              </h3>
              
              <div className="space-y-6">
                 <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-text-muted mb-2">ชื่อของคุณ</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring" placeholder="ระบุชื่อ-นามสกุล" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-text-muted mb-2">เบอร์โทรศัพท์ติดต่อกลับ</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring" placeholder="ระบุเบอร์โทรศัพท์" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-text-muted mb-2">ข้อความหรือหัวข้อที่ต้องการปรึกษา</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring resize-none" placeholder="พิมพ์ข้อความของคุณที่นี่..." />
                </div>
                
                <AnimatedButton variant="primary" size="lg" className="w-full shadow-lg">
                  ส่งข้อความ
                </AnimatedButton>
              </div>
              
              <p className="text-center text-xs text-text-muted mt-6 italic">
                * ข้อมูลทั้งหมดจะถูกเก็บเป็นความลับตามนโยบายความเป็นส่วนตัว
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
