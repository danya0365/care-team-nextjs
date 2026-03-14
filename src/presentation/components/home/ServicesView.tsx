'use client';

import { useServicesPresenter } from '@/src/presentation/presenters/services/useServicesPresenter';
import { ServicesViewModel } from '@/src/presentation/presenters/services/ServicesPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';

import { PageHeader } from '@/src/presentation/components/layout/PageHeader';

interface ServicesViewProps {
  initialViewModel?: ServicesViewModel;
}

export function ServicesView({ initialViewModel }: ServicesViewProps) {
  const [state] = useServicesPresenter(initialViewModel);
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
        badgeText="Comprehensive Care Pipeline"
        title={<>บริการและ <span className="gradient-text">กระบวนการดูแล</span></>}
        description="เราให้ความสำคัญกับการดูแลสุขภาพและสังคมด้วยกระบวนการที่มีมาตรฐาน และสอดคล้องกับหลักการลดอันตรายจากการใช้สารเสพติด (Harm Reduction)"
        spacing="large"
      />

      {/* RRTTPR Pipeline Section */}
      <section className="mt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-text-primary dark:text-foreground mb-4">
                กระบวนการ RRTTPR 6 ขั้นตอน
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full" />
            </div>
          </AnimatedSection>

          <div className="space-y-8">
            {viewModel.rrttprSteps.map((step, index) => (
              <AnimatedSection key={step.id} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 50}>
                <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-card-bg p-8 rounded-2xl border border-border-light dark:border-card-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center text-4xl" style={{ backgroundColor: `${step.color}15` }}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-sm font-bold bg-primary text-white px-3 py-1 rounded-lg">
                        Step {step.step}
                      </span>
                      <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                        {step.titleEn}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary dark:text-foreground mb-3">
                      {step.titleTh}
                    </h3>
                    <p className="text-text-secondary dark:text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-8xl font-black text-primary/5 select-none">
                      0{step.step}
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Methadone Service Section */}
      <section className="mt-24 bg-surface-elevated dark:bg-primary-dark/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
               <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-3xl mb-6">
                {viewModel.methadoneService.icon}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-foreground mb-6">
                {viewModel.methadoneService.title}
              </h2>
              <p className="text-lg text-text-secondary dark:text-text-muted mb-8 leading-relaxed">
                {viewModel.methadoneService.description}
              </p>
              
              <div className="p-6 bg-white dark:bg-card-bg rounded-2xl shadow-card border border-accent/10">
                <h4 className="font-bold text-accent mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  กลุ่มเป้าหมายหลัก
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {viewModel.stats.targetGroups.map((group, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-muted">
                      <span className="text-accent">✓</span> {group}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={200}>
              <div className="bg-white dark:bg-card-bg p-8 md:p-10 rounded-3xl shadow-elevated border border-border-light dark:border-card-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-xl font-bold mb-8 text-text-primary dark:text-foreground">
                  ขั้นตอนการรับบริการ
                </h3>
                
                <div className="space-y-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-accent/10" />
                  
                  {viewModel.methadoneService.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold z-10 flex-shrink-0 mt-0.5 shadow-sm">
                        {idx + 1}
                      </div>
                      <p className="text-text-secondary dark:text-text-muted text-sm md:text-base leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* RRTTPR Badge Section */}
      <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-gradient-to-r from-primary to-accent p-12 rounded-[2.5rem] text-white text-center shadow-xl">
            <h2 className="text-3xl font-bold mb-6">มาตรฐานการดูแลระดับสากล</h2>
            <p className="max-w-2xl mx-auto text-primary-50/80 mb-8 leading-relaxed">
              เรานำขั้นตอน RRTTPR มาประยุกต์ใช้เพื่อให้การดูแลครอบคลุมทุกมิติ 
              ตั้งแต่การเข้าถึงไปจนถึงการติดตามผลอย่างยั่งยืน
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['REACH', 'RECRUIT', 'TEST', 'TREAT', 'PREVENT', 'RETAIN'].map(code => (
                <div key={code} className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-xl font-black tracking-tighter text-2xl">
                  {code}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
