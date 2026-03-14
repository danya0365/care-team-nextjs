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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-text-primary dark:text-foreground">
                วิสัยทัศน์ของเรา
              </h2>
              <div className="p-6 bg-white dark:bg-card-bg rounded-2xl border-l-4 border-primary shadow-card">
                <p className="text-lg text-text-secondary dark:text-text-muted italic leading-relaxed">
                  "{viewModel.vision}"
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={200}>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-text-primary dark:text-foreground">
                พันธกิจ (Mission)
              </h2>
              <ul className="space-y-4">
                {viewModel.mission.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-text-secondary dark:text-text-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Team Section */}
      <section className="mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-foreground mb-4">
                ทีมงานของเรา
              </h2>
              <p className="text-text-secondary dark:text-text-muted">
                กลุ่มคนทำงานที่มุ่งมั่นช่วยเหลือและดูแลผู้คนในจังหวัดสงขลา
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {viewModel.teamMembers.map((member, index) => (
              <AnimatedSection key={member.id} delay={index * 100}>
                <AnimatedCard className="p-6 text-center h-full">
                  <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-dark/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary dark:text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">
                    {member.roleTh}
                  </p>
                  {member.teamName && (
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-bold">
                      Team: {member.teamName}
                    </span>
                  )}
                </AnimatedCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="mt-24 py-16 bg-surface-elevated dark:bg-primary-dark/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-center text-text-primary dark:text-foreground mb-12">
              หน่วยงานภาคีเครือข่าย
            </h2>
          </AnimatedSection>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {viewModel.partners.map((partner, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="px-6 py-4 bg-white dark:bg-card-bg rounded-xl shadow-sm border border-border-light dark:border-card-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                    <span className="text-xs">🤝</span>
                  </div>
                  <span className="font-semibold text-text-secondary dark:text-text-muted">
                    {partner}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
