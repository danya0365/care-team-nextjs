'use client';

import { RegistrationData } from '@/src/application/repositories/IRegistrationRepository';
import { siteConfig } from '@/src/config/site';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { SearchableSelect } from '@/src/presentation/components/common/SearchableSelect';
import { useRegisterPresenter } from '@/src/presentation/presenters/register/useRegisterPresenter';
import { useState } from 'react';

import { PageHeader } from '@/src/presentation/components/layout/PageHeader';

interface RegisterViewProps {
  eventId?: string;
}

export function RegisterView({ eventId }: RegisterViewProps) {
  const [state, actions] = useRegisterPresenter(eventId);
  
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    nickname: null,
    email: null,
    phone: '',
    address: null,
    dateOfBirth: null,
    requestNeedles: false,
    condomSize: null,
    requestHivTest: false,
    substanceAbuseHistory: null,
    note: null,
    eventId: eventId || null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value || null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.submit(formData);
  };

  if (state.success) {
    return (
      <div className="pb-20 relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
        {/* Decorative patterns */}
        <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-success/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <PageHeader
          badgeText={state.eventTitle ? "Registration Successful" : "Welcome to our community"}
          title={
            <>
              {state.eventTitle || 'ลงทะเบียน'} <span className="gradient-text">เสร็จสมบูรณ์</span>
            </>
          }
          description="ข้อมูลของคุณได้ถูกบันทึกเข้าระบบเรียบร้อยแล้ว ทีมงานจะทำการตรวจสอบและดำเนินการในขั้นตอนต่อไป"
          spacing="large"
        />

        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-12 md:mt-4">
          <AnimatedSection>
            <AnimatedCard className="p-8 md:p-14 text-center shadow-2xl relative overflow-hidden border border-success/20 rounded-[2rem] bg-surface/80 dark:bg-bg-dark/80 backdrop-blur-xl">
              {/* Card Inner Graphics */}
              <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-success/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-24 h-24 bg-gradient-to-br from-success/20 to-success/5 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner border border-success/20 relative z-10 transform hover:scale-110 transition-transform duration-500">
                ✨
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-success to-primary mb-4 relative z-10">
                ลงทะเบียนสำเร็จ!
              </h2>
              
              <p className="text-lg text-text-secondary dark:text-text-muted mb-10 leading-relaxed font-medium">
                ขอบคุณสำหรับการแจ้งความประสงค์เข้าร่วมกิจกรรมกับทีมงาน <br className="hidden md:block"/>
                <span className="text-primary font-black mx-1">{siteConfig.name}</span> 
                {state.eventTitle ? `ผ่านกิจกรรม ` : ''} 
                {state.eventTitle && <span className="text-primary font-black mx-1">{state.eventTitle}</span>} 
                <br className="hidden md:block"/>
                ทางเราจะติดต่อกลับไปหาคุณโดยเร็วที่สุด
              </p>
              
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md p-6 md:p-8 rounded-[2rem] mb-10 text-left border border-success/10 relative group overflow-hidden shadow-inner">
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-success group-hover:w-2 transition-all duration-300" />
                 
                 <h4 className="flex items-center gap-2 text-xs font-black text-success uppercase tracking-[0.2em] mb-6">
                   <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                   ข้อมูลสรุปการลงทะเบียน
                 </h4>
                 
                 <div className="space-y-5">
                   {state.eventTitle && (
                     <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                       <span className="text-text-muted font-bold text-sm">กิจกรรมที่เข้าร่วม</span> 
                       <span className="text-text-primary dark:text-foreground font-black bg-surface dark:bg-white/5 px-4 py-2 rounded-xl border border-border/50 text-sm">{state.eventTitle}</span>
                     </div>
                   )}
                   <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                     <span className="text-text-muted font-bold text-sm">รหัสการอ้างอิง</span> 
                     <span className="font-mono bg-success/10 px-4 py-2 rounded-xl text-success font-black tracking-widest border border-success/20 text-sm text-center">
                       {state.registration?.id.slice(0, 8).toUpperCase()}
                     </span>
                   </div>
                   <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 pt-5 border-t border-border-light/50 dark:border-white/5">
                     <span className="text-text-muted font-bold text-sm">ชื่อผู้ลงทะเบียน</span> 
                     <span className="text-text-primary dark:text-foreground font-black text-base">{state.registration?.name}</span>
                   </div>
                 </div>
              </div>
              
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                onClick={actions.reset} 
                className="w-full py-5 text-lg font-bold shadow-xl shadow-success/20 hover:shadow-success/30 bg-gradient-to-r from-success to-emerald-500 border-none group"
              >
                ลงทะเบียนเพิ่ม หรือ กลับสู่หน้าหลัก
              </AnimatedButton>
            </AnimatedCard>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <PageHeader
        badgeText={state.eventTitle ? "Registration Open" : "Step into our community"}
        title={
          <>
            {state.eventTitle || 'ลงทะเบียน'} <span className="gradient-text">เข้าร่วมโครงการ</span>
          </>
        }
        description={
          state.eventTitle 
            ? `แบบฟอร์มลงทะเบียนแจ้งความประสงค์เข้าร่วมกิจกรรม "${state.eventTitle}" ทีมงานพร้อมดูแลและให้คำปรึกษาด้วยความเข้าใจ`
            : "เราพร้อมให้การสนับสนุนและดูแลกลุ่มประชากรที่เปราะบางด้วยความเข้าใจ เพื่อสร้างคุณภาพชีวิตที่ดีขึ้นอย่างเท่าเทียมและยั่งยืน"
        }
        spacing="large"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <AnimatedSection>
          <AnimatedCard className="p-8 md:p-12 relative overflow-hidden shadow-elevated border-t-4 border-t-primary">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8 text-text-primary dark:text-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">📝</span>
                ข้อมูลผู้ลงทะเบียน
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">
                      ชื่อ-นามสกุล ของคุณ <span className="text-error font-bold">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted"
                      placeholder="ตัวอย่าง: สมชาย ใจดี"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">
                      ชื่อเล่น
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname || ''}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted"
                      placeholder="ตัวอย่าง: สมชาย"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">
                      วันเดือนปีเกิด
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ''}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">
                      เบอร์โทรศัพท์ติดต่อ <span className="text-error font-bold">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted"
                      placeholder="ระบุเบอร์โทรศัพท์ 10 หลัก"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">อีเมล (ถ้ามี)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted"
                    placeholder="example@yourdomain.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">ที่อยู่</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted"
                    placeholder="ระบุอำเภอหรือระดับพื้นที่ เช่น สะเดา, จะนะ"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="requestNeedles"
                      name="requestNeedles"
                      checked={formData.requestNeedles}
                      onChange={handleChange}
                      className="w-6 h-6 rounded text-primary bg-surface border-border-light focus:ring-primary dark:bg-primary-dark/20 dark:border-white/10 transition-all cursor-pointer"
                    />
                    <label htmlFor="requestNeedles" className="text-sm font-bold text-text-primary dark:text-foreground cursor-pointer">
                      ขอรับบริการ เข็ม สะอาด
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="requestHivTest"
                      name="requestHivTest"
                      checked={formData.requestHivTest}
                      onChange={handleChange}
                      className="w-6 h-6 rounded text-primary bg-surface border-border-light focus:ring-primary dark:bg-primary-dark/20 dark:border-white/10 transition-all cursor-pointer"
                    />
                    <label htmlFor="requestHivTest" className="text-sm font-bold text-text-primary dark:text-foreground cursor-pointer">
                      ขอชุดตรวจ HIV ด้วยตนเอง
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">
                    ไซส์ถุงยางอนามัยที่ต้องการ
                  </label>
                  <div className="relative">
                    <SearchableSelect
                      options={[
                        { label: 'ไม่ระบุ', value: 'none' },
                        { label: '49', value: '49' },
                        { label: '52', value: '52' },
                        { label: '54', value: '54' },
                        { label: '56', value: '56' }
                      ]}
                      value={formData.condomSize || ''}
                      onChange={(val) => handleChange({ target: { name: 'condomSize', value: val === 'none' ? null : val } } as any)}
                      placeholder="คลิกเพื่อเลือกไซส์ (เว้นว่างได้)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">ประวัติการใช้สารเสพติด (ถ้ามี)</label>
                  <textarea
                    name="substanceAbuseHistory"
                    rows={2}
                    value={formData.substanceAbuseHistory || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-text-muted"
                    placeholder="ระบุประวัติย่อๆ (ข้ามได้ถ้าไม่มี)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide">หมายเหตุเพิ่มเติม / ปัญหาที่ต้องการปรึกษา</label>
                  <textarea
                    name="note"
                    rows={4}
                    value={formData.note || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-text-muted"
                    placeholder="พิมพ์ข้อมูลหรือข้อความที่คุณต้องการให้ทีมงานทราบ..."
                  />
                </div>

                {state.error && (
                  <div className="p-4 bg-error/10 border-l-4 border-error text-error text-sm rounded-lg flex items-center gap-2">
                    <span>⚠️</span> <span className="font-bold">{state.error}</span>
                  </div>
                )}

                <div className="pt-4">
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full py-5 text-lg font-bold shadow-xl shadow-primary/20 group"
                    id="btn-submit-registration"
                  >
                    {state.submitting ? (
                      <span className="flex items-center gap-3 justify-center">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        กำลังประมวลผล...
                      </span>
                    ) : (
                      <span className="group-hover:translate-x-1 transition-transform">ยืนยันการลงทะเบียน</span>
                    )}
                  </AnimatedButton>
                </div>
                
                <div className="mt-8 pt-6 border-t border-border-light dark:border-card-border">
                  <p className="text-center text-xs text-text-muted leading-relaxed italic">
                    * ข้อมูลของคุณจะถูกเก็บเป็นความลับสูงสุดตามนโยบายความเป็นส่วนตัว <br className="hidden md:block"/>
                    และจะใช้เพื่อประกอบการพิจารณาให้ความช่วยเหลือในโครงการเท่านั้น
                  </p>
                </div>
              </form>
            </div>
          </AnimatedCard>
        </AnimatedSection>
      </div>
    </div>
  );
}