'use client';

import { useEffect, useState } from 'react';
import { useEditRegistrationPresenter } from '@/src/presentation/presenters/register/useEditRegistrationPresenter';
import { EditRegistrationViewModel } from '@/src/presentation/presenters/register/EditRegistrationPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { RegistrationData } from '@/src/application/repositories/IRegistrationRepository';

interface EditRegistrationViewProps {
  id: string;
  initialViewModel?: EditRegistrationViewModel;
}

export function EditRegistrationView({ id, initialViewModel }: EditRegistrationViewProps) {
  const { state, actions } = useEditRegistrationPresenter(id, initialViewModel);
  
  const [formData, setFormData] = useState<Partial<RegistrationData> & { status?: string }>({});

  useEffect(() => {
    if (state.viewModel?.registration) {
      const { name, email, phone, targetGroup, address, note, status } = state.viewModel.registration;
      setFormData({ name, email, phone, targetGroup, address, note, status });
    }
  }, [state.viewModel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.update(formData);
  };

  if (state.loading && !state.viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Background patterns */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <section className="relative pt-24 pb-12 mb-8" style={{ background: 'linear-gradient(to bottom, var(--gradient-hero-from), transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <button 
                  onClick={actions.cancel}
                  className="flex items-center gap-2 text-primary font-bold mb-4 hover:gap-3 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  กลับหน้าจัดการ
                </button>
                <h1 className="text-4xl md:text-5xl font-black text-text-primary dark:text-foreground leading-tight">
                  <span className="gradient-text">แก้ไข</span>ข้อมูลผู้ลงทะเบียน
                </h1>
                <p className="text-lg text-text-secondary dark:text-text-muted mt-3">
                  ปรับปรุงข้อมูลผู้ลงทะเบียน #{id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection delay={100}>
          <div className="bg-white/80 dark:bg-card-bg/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-elevated border border-border-light dark:border-card-border">
            {state.success ? (
              <div className="py-10 text-center">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  ✅
                </div>
                <h2 className="text-2xl font-bold text-text-primary dark:text-foreground mb-2">อัปเดตข้อมูลสำเร็จ</h2>
                <p className="text-text-muted italic">ระบบกำลังพาคุณกลับหน้าจัดการ...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1">ชื่อ-นามสกุล</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1">เบอร์โทรศัพท์</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1">อีเมล</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1">กลุ่มเป้าหมาย</label>
                  <select
                    required
                    name="targetGroup"
                    value={formData.targetGroup || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all appearance-none cursor-pointer font-medium"
                  >
                    {state.viewModel?.targetGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1">สถานะการตรวจสอบ</label>
                  <select
                    required
                    name="status"
                    value={formData.status || 'pending'}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all appearance-none cursor-pointer font-bold"
                  >
                    <option value="pending">🟡 รอดำเนินการ (Pending)</option>
                    <option value="approved">🟢 อนุมัติแล้ว (Approved)</option>
                    <option value="rejected">🔴 ปฏิเสธ (Rejected)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1">ที่อยู่ / พื้นที่</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary dark:text-text-muted ml-1">หมายเหตุเพิ่มเติม</label>
                  <textarea
                    name="note"
                    rows={4}
                    value={formData.note || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 border-none focus-ring focus:bg-white dark:focus:bg-card-bg transition-all resize-none font-medium"
                  />
                </div>

                {state.error && (
                  <div className="p-4 bg-error/10 border-l-4 border-error text-error text-sm rounded-lg">
                    ⚠️ {state.error}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={actions.cancel}
                    className="flex-1 h-14 rounded-2xl border border-border-light dark:border-card-border font-bold text-text-secondary dark:text-text-muted hover:bg-surface-elevated transition-all"
                  >
                    ยกเลิก
                  </button>
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-[2] h-14 shadow-lg text-lg"
                  >
                    {state.submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังอัปเดต...
                      </span>
                    ) : (
                      'บันทึกข้อมูล'
                    )}
                  </AnimatedButton>
                </div>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
