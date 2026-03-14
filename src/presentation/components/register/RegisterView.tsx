'use client';

import { useRegisterPresenter } from '@/src/presentation/presenters/register/useRegisterPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { useState } from 'react';
import { RegistrationData } from '@/src/application/repositories/IRegistrationRepository';
import { siteConfig } from '@/src/config/site';

import { PageHeader } from '@/src/presentation/components/layout/PageHeader';

export function RegisterView() {
  const [state, actions] = useRegisterPresenter();
  
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: null,
    phone: '',
    targetGroup: '',
    address: null,
    note: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.submit(formData);
  };

  if (state.success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <AnimatedSection>
          <AnimatedCard className="p-8 md:p-12 max-w-lg text-center shadow-elevated">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✅
            </div>
            <h2 className="text-3xl font-bold text-text-primary dark:text-foreground mb-4">
              ลงทะเบียนสำเร็จ!
            </h2>
            <p className="text-text-secondary dark:text-text-muted mb-8 italic">
              ขอบคุณสำหรับการแจ้งความประสงค์เข้าร่วมโครงการ ทีมงาน {siteConfig.name} จะติดต่อกลับไปหาคุณโดยเร็วที่สุดผ่านเบอร์โทรศัพท์ที่ระบุไว้
            </p>
            <div className="bg-primary/5 p-4 rounded-xl mb-8 text-left text-sm space-y-2 border border-primary/10">
               <p><span className="font-bold text-primary">เลขรับลงทะเบียน:</span> <span className="font-mono">{state.registration?.id.slice(0, 8).toUpperCase()}</span></p>
               <p><span className="font-bold text-primary">ชื่อ:</span> {state.registration?.name}</p>
            </div>
            <AnimatedButton variant="primary" size="lg" onClick={actions.reset} className="w-full">
              ลงทะเบียนเพิ่ม
            </AnimatedButton>
          </AnimatedCard>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="pb-20 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <PageHeader
        badgeText="Join Our Care Network"
        title={<>ลงทะเบียน <span className="gradient-text">เข้าร่วมโครงการ</span></>}
        description={<>
          เราพร้อมให้การสนับสนุนและดูแลกลุ่มประชากรที่เปราะบางด้วยความเข้าใจ 
          {siteConfig.description.split('โครงการ')[1] || ''}
        </>}
        spacing="large"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <AnimatedSection>
          <div className="bg-white dark:bg-card-bg p-8 md:p-12 rounded-[2.5rem] shadow-elevated border border-border-light dark:border-card-border">
            <h3 className="text-2xl font-bold mb-8 text-text-primary dark:text-foreground flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full" />
              ข้อมูลผู้ลงทะเบียน
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1 flex items-center gap-1">
                    ชื่อ-นามสกุล <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all"
                    placeholder="ระบุชื่อจริงและนามสกุล"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1 flex items-center gap-1">
                    เบอร์โทรศัพท์ติดต่อ <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all"
                    placeholder="เช่น 0812345678"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1 flex items-center gap-1">
                  อีเมล (ถ้ามี)
                </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all"
                    placeholder="example@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1 flex items-center gap-1">
                    กลุ่มเป้าหมาย <span className="text-error">*</span>
                  </label>
                  <select
                    required
                    name="targetGroup"
                    value={formData.targetGroup || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>เลือกกลุ่มเป้าหมาย</option>
                    {state.targetGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1 flex items-center gap-1">
                    ที่อยู่ / พื้นที่ (สะเดา หรือ จะนะ หรือ อื่นๆ)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all"
                    placeholder="ระบุอำเภอหรือพื้นที่ใกล้เคียง"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1 flex items-center gap-1">
                    หมายเหตุเพิ่มเติม / ปัญหาที่ต้องการปรึกษา
                  </label>
                  <textarea
                    name="note"
                    rows={4}
                    value={formData.note || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all resize-none"
                    placeholder="ระบุข้อมูลเพิ่มเติมเพื่อให้ทีมงานเตรียมความพร้อม"
                  />
              </div>

              {state.error && (
                <div className="p-4 bg-error/10 border-l-4 border-error text-error text-sm rounded-lg flex items-center gap-2">
                  <span>⚠️</span> {state.error}
                </div>
              )}

              <div className="pt-4">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  className="w-full h-14 shadow-xl text-lg"
                  onClick={() => {}} // Form handles click via onSubmit
                  id="btn-submit-registration"
                >
                  {state.submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      กำลังส่งข้อมูล...
                    </span>
                  ) : (
                    'ส่งข้อมูลลงทะเบียน'
                  )}
                </AnimatedButton>
              </div>
              
              <p className="text-center text-xs text-text-muted italic">
                * ข้อมูลทั้งหมดจะถูกเก็บเป็นความลับสูงสุดตามนโยบายความเป็นส่วนตัวของโครงการ
              </p>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
