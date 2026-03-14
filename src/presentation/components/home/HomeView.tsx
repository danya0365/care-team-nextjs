'use client';

import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { useHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { StatsCounter } from '@/src/presentation/components/common/StatsCounter';
import { siteConfig } from '@/src/config/site';

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const [state, actions] = useHomePresenter(initialViewModel);
  const viewModel = state.viewModel;

  // Loading state
  if (state.loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-secondary dark:text-text-muted">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-text-secondary dark:text-text-muted mb-4">
            {state.error}
          </p>
          <AnimatedButton onClick={actions.loadData} variant="primary">
            ลองใหม่อีกครั้ง
          </AnimatedButton>
        </div>
      </div>
    );
  }

  if (!viewModel) return null;

  return (
    <div className="flex flex-col">
      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section
        className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-gradient-hero-from to-gradient-hero-to"
        id="hero"
      >
        {/* Decorative background circles */}
        <div className="absolute top-10 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-primary-50 dark:bg-primary-dark/20 text-primary dark:text-primary-light
                text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Harm Reduction • {siteConfig.location}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary dark:text-foreground leading-tight mb-6">
                <span className="gradient-text">{siteConfig.name}</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-base md:text-lg text-text-secondary dark:text-text-muted leading-relaxed mb-4">
                {siteConfig.nameThai}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <p className="text-sm md:text-base text-text-muted dark:text-text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
                {siteConfig.description}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <AnimatedButton variant="primary" size="lg" href="/services" id="hero-cta-services">
                  ดูบริการของเรา
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </AnimatedButton>
                <AnimatedButton variant="outline" size="lg" href="/contact" id="hero-cta-contact">
                  ติดต่อเรา
                </AnimatedButton>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================
          RRTTPR SERVICE PIPELINE
          ============================================================ */}
      <section className="py-16 md:py-24" id="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-foreground mb-4">
                กระบวนการ <span className="gradient-text">RRTTPR</span>
              </h2>
              <p className="text-text-secondary dark:text-text-muted max-w-2xl mx-auto">
                โมเดลสาธารณสุข 6 ขั้นตอนที่เราใช้ในการดูแลกลุ่มเป้าหมาย
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewModel.services.map((service, index) => (
              <AnimatedSection key={service.id} delay={index * 100}>
                <AnimatedCard className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    {/* Step number + icon */}
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: service.color }}
                        >
                          {service.step}
                        </span>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                          {service.titleEn}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-text-primary dark:text-foreground mb-2">
                        {service.titleTh}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-text-muted leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STATISTICS SECTION
          ============================================================ */}
      <section
        className="py-16 md:py-24 bg-gradient-to-b from-gradient-hero-from to-gradient-hero-to"
        id="stats-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-foreground mb-4">
                ผลงานของเรา
              </h2>
              <p className="text-text-secondary dark:text-text-muted max-w-xl mx-auto">
                ตัวเลขที่สะท้อนความมุ่งมั่นในการดูแลชุมชน
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedSection delay={0}>
              <StatsCounter
                end={viewModel.orgStats.yearsOfService}
                label="ปีที่ให้บริการ"
                suffix="+"
                icon="🏥"
              />
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <StatsCounter
                end={viewModel.orgStats.areasServed}
                label="พื้นที่ดูแล"
                icon="📍"
              />
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <StatsCounter
                end={viewModel.serviceStats.totalRRTTPRSteps}
                label="ขั้นตอน RRTTPR"
                icon="🔄"
              />
            </AnimatedSection>
            <AnimatedSection delay={450}>
              <StatsCounter
                end={viewModel.orgStats.targetGroupsReached}
                label="กลุ่มเป้าหมาย"
                icon="👥"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================
          TARGET GROUPS SECTION
          ============================================================ */}
      <section className="py-16 md:py-24" id="target-groups">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-foreground mb-4">
                กลุ่มเป้าหมาย
              </h2>
              <p className="text-text-secondary dark:text-text-muted max-w-2xl mx-auto">
                เราให้บริการแก่กลุ่มประชากรที่เปราะบางและต้องการการดูแลเป็นพิเศษ
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {viewModel.serviceStats.targetGroups.map((group, index) => {
              const icons = ['💉', '🏳️‍🌈', '🤝', '🫂'];
              const colors = ['#4FC3F7', '#E57373', '#81C784', '#FFB74D'];
              return (
                <AnimatedSection key={group} delay={index * 120}>
                  <AnimatedCard className="p-6 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                      style={{ backgroundColor: `${colors[index]}20` }}
                    >
                      {icons[index]}
                    </div>
                    <h3 className="font-semibold text-text-primary dark:text-foreground text-sm">
                      {group}
                    </h3>
                  </AnimatedCard>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT CTA SECTION
          ============================================================ */}
      <section
        className="py-16 md:py-24 bg-gradient-to-b from-gradient-hero-from to-gradient-hero-to"
        id="contact-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-foreground mb-4">
                ต้องการความช่วยเหลือ?
              </h2>
              <p className="text-text-secondary dark:text-text-muted mb-8 leading-relaxed">
                ติดต่อเราเพื่อปรึกษาปัญหา รับบริการ หรือสอบถามข้อมูลเพิ่มเติม
                ทีมงานของเราพร้อมช่วยเหลือคุณ
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-text-primary dark:text-foreground">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-semibold">{siteConfig.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-text-primary dark:text-foreground">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold">{siteConfig.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <AnimatedButton variant="primary" size="lg" href="/contact" id="contact-cta">
                  ติดต่อเรา
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  href={siteConfig.facebookUrl}
                  id="facebook-cta"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </AnimatedButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
