'use client';

import { useContactPresenter } from '@/src/presentation/presenters/contact/useContactPresenter';
import { ContactViewModel } from '@/src/presentation/presenters/contact/ContactPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';

import { PageHeader } from '@/src/presentation/components/layout/PageHeader';

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

      <PageHeader
        badgeText="Contact Support 24/7"
        title={<>ติดต่อ <span className="gradient-text">สอบถามข้อมูล</span></>}
        description="ทีมงานของเราพร้อมให้คำปรึกษาและช่วยเหลือคุณตลอดเวลา ติดต่อเราได้ผ่านช่องทางต่างๆ ด้านล่างนี้"
        spacing="large"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-8">
            <AnimatedSection direction="left">
              <h2 className="text-3xl font-bold text-text-primary dark:text-foreground mb-4">
                ช่องทางการติดต่อ
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full mb-8" />
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6">
              <AnimatedSection direction="left" delay={100}>
                <AnimatedCard className="p-8 flex items-center gap-8 group hover:border-primary/30 transition-all shadow-elevated">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    📞
                  </div>
                  <div>
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">โทรศัพท์สายด่วน</p>
                    <p className="text-2xl font-bold text-text-primary dark:text-foreground group-hover:text-primary transition-colors">{viewModel.phone}</p>
                  </div>
                </AnimatedCard>
              </AnimatedSection>

              <AnimatedSection direction="left" delay={200}>
                <AnimatedCard className="p-8 flex items-center gap-8 group hover:border-accent/30 transition-all shadow-elevated">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                    👥
                  </div>
                  <div>
                    <p className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-2">Facebook Page</p>
                    <a href={viewModel.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-text-primary dark:text-foreground hover:text-accent transition-colors">
                      {viewModel.facebook}
                    </a>
                  </div>
                </AnimatedCard>
              </AnimatedSection>

              <AnimatedSection direction="left" delay={300}>
                <AnimatedCard className="p-8 flex items-start gap-8 group hover:border-warning/30 transition-all shadow-elevated">
                  <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center text-3xl group-hover:bg-warning group-hover:text-white transition-all shadow-sm flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <p className="text-xs font-black text-warning uppercase tracking-[0.2em] mb-2">ที่ตั้งหน่วยงาน</p>
                    <p className="text-xl font-bold text-text-primary dark:text-foreground mb-2">{viewModel.location}</p>
                    <div className="flex flex-wrap gap-2">
                       {viewModel.areas.map(area => (
                         <span key={area} className="px-3 py-1 bg-surface-elevated dark:bg-primary-dark/20 text-text-secondary dark:text-text-muted text-xs rounded-lg border border-border-light dark:border-card-border font-medium">
                           {area}
                         </span>
                       ))}
                    </div>
                  </div>
                </AnimatedCard>
              </AnimatedSection>
            </div>
          </div>

          {/* Contact Form */}
          <AnimatedSection direction="right" delay={200}>
            <AnimatedCard className="p-8 md:p-12 relative overflow-hidden shadow-elevated border-t-4 border-t-primary">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-2xl font-bold mb-8 text-text-primary dark:text-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">✉️</span>
                ส่งข้อความถึงเรา
              </h3>
                            <div className="space-y-6 relative z-10">
                 <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">ชื่อ-นามสกุล ของคุณ</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted" placeholder="ตัวอย่าง: สมชาย ใจดี" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">เบอร์โทรศัพท์ติดต่อกลับ</label>
                  <input type="tel" className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted" placeholder="ระบุเบอร์โทรศัพท์ 10 หลัก" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">ข้อความหรือหัวข้อที่ต้องการปรึกษา</label>
                  <textarea rows={4} className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-text-muted" placeholder="พิมพ์รายละเอียดที่คุณต้องการสอบถามหรือปรึกษา..." />
                </div>
                
                <AnimatedButton variant="primary" size="lg" className="w-full py-5 text-lg font-bold shadow-xl shadow-primary/20 group">
                  <span className="group-hover:translate-x-1 transition-transform">ส่งข้อความตอนนี้</span>
                </AnimatedButton>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border-light dark:border-card-border">
                <p className="text-center text-xs text-text-muted leading-relaxed italic">
                  * ข้อมูลของคุณจะถูกเก็บเป็นความลับสูงสุดตามนโยบายความเป็นส่วนตัว <br className="hidden md:block"/>
                  เพื่อให้คุณได้รับการดูแลที่ปลอดภัยและเป็นส่วนตัวที่สุด
                </p>
              </div>
            </AnimatedCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
