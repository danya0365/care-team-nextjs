'use client';

import { useAboutPresenter } from '@/src/presentation/presenters/about/useAboutPresenter';
import { AboutViewModel } from '@/src/presentation/presenters/about/AboutPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';

import { PageHeader } from '@/src/presentation/components/layout/PageHeader';

interface AboutViewProps {
  initialViewModel?: AboutViewModel;
}

export function AboutView({ initialViewModel }: AboutViewProps) {
  const [state] = useAboutPresenter(initialViewModel);
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
        badgeText="Our Story & Vision"
        title={<>เกี่ยวกับ <span className="gradient-text">{viewModel.siteName}</span></>}
        description={viewModel.siteThaiName}
        spacing="large"
      />

      {/* Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <AnimatedSection direction="left" className="flex flex-col">
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">👁️</div>
                <h2 className="text-3xl font-bold text-text-primary dark:text-foreground">
                  วิสัยทัศน์ของเรา
                </h2>
              </div>
              <AnimatedCard className="p-8 border-l-4 border-l-primary flex-1 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-xl md:text-2xl text-text-secondary dark:text-text-muted italic leading-relaxed text-center relative z-10 font-medium">
                  "{viewModel.vision}"
                </p>
              </AnimatedCard>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={200} className="flex flex-col">
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl">🚀</div>
                <h2 className="text-3xl font-bold text-text-primary dark:text-foreground">
                  พันธกิจ (Mission)
                </h2>
              </div>
              <AnimatedCard className="p-8 flex-1">
                <ul className="space-y-6">
                  {viewModel.mission.map((item, index) => (
                    <li key={index} className="flex items-start gap-5 group">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary transition-colors">
                        <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-white transition-colors" />
                      </div>
                      <span className="text-lg text-text-secondary dark:text-text-muted leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </AnimatedCard>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Team Section */}
      <section className="mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-foreground mb-4">
                ทีมงานของเรา
              </h2>
              <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
              <p className="text-lg text-text-secondary dark:text-text-muted max-w-2xl mx-auto">
                กลุ่มคนทำงานที่มุ่งมั่นช่วยเหลือและดูแลผู้คนในจังหวัดสงขลา 
                เพื่อสร้างความเปลี่ยนแปลงที่ยั่งยืน
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {viewModel.teamMembers.map((member, index) => (
              <AnimatedSection key={member.id} delay={index * 100}>
                <AnimatedCard className="p-8 text-center h-full group hover:border-primary/30 transition-all duration-300 shadow-elevated">
                  <div className="w-24 h-24 rounded-3xl bg-primary-50 dark:bg-primary-dark/20 flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary dark:text-foreground mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-bold mb-4 uppercase tracking-wider text-sm">
                    {member.roleTh}
                  </p>
                  {member.teamName && (
                    <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs rounded-full font-black tracking-tighter shadow-sm">
                      TEAM: {member.teamName.toUpperCase()}
                    </span>
                  )}
                </AnimatedCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="mt-32 py-24 bg-surface-elevated dark:bg-primary-dark/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-primary dark:text-foreground mb-4">
                หน่วยงานภาคีเครือข่าย
              </h2>
              <p className="text-text-secondary dark:text-text-muted">
                ความร่วมมือเพื่อขับเคลื่อนสังคมให้ดีขึ้นอย่างเป็นระบบ
              </p>
            </div>
          </AnimatedSection>
          
          <div className="flex flex-wrap justify-center gap-6">
            {viewModel.partners.map((partner, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <AnimatedCard className="px-8 py-5 flex items-center gap-4 hover:border-success/30 transition-all shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-xl shadow-inner">
                    🤝
                  </div>
                  <span className="font-bold text-text-secondary dark:text-text-muted text-lg">
                    {partner}
                  </span>
                </AnimatedCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
