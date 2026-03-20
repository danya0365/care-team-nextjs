'use client';

import { useEffect, useState } from 'react';
import { useEditRegistrationPresenter } from '@/src/presentation/presenters/register/useEditRegistrationPresenter';
import { EditRegistrationViewModel } from '@/src/presentation/presenters/register/EditRegistrationPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { PageHeader } from '@/src/presentation/components/layout/PageHeader';
import { SearchableSelect } from '@/src/presentation/components/common/SearchableSelect';
import { RegistrationData } from '@/src/application/repositories/IRegistrationRepository';
import { ArrowLeft, Save, X, CheckCircle2, User, Phone, Mail, MapPin, FileEdit, AlertCircle, Users, RefreshCw, Calendar, PlusCircle } from 'lucide-react';
import { ConfirmModal } from '@/src/presentation/components/common/ConfirmModal';

interface EditRegistrationViewProps {
  id: string;
  initialViewModel?: EditRegistrationViewModel;
}

export function EditRegistrationView({ id, initialViewModel }: EditRegistrationViewProps) {
  const { state, actions } = useEditRegistrationPresenter(id, initialViewModel);
  
  const [formData, setFormData] = useState<Partial<RegistrationData> & { status?: string }>({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    if (state.viewModel?.registration) {
      const { name, nickname, email, phone, address, dateOfBirth, requestNeedles, condomSize, requestHivTest, substanceAbuseHistory, note, status } = state.viewModel.registration;
      setFormData({ name, nickname, email, phone, address, dateOfBirth, requestNeedles, condomSize, requestHivTest, substanceAbuseHistory, note, status });
    }
  }, [state.viewModel]);

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
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    await actions.update(formData);
    setShowSaveConfirm(false);
  };

  if (state.loading && !state.viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm font-bold text-text-muted animate-pulse">กำลังเรียกข้อมูล...</p>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full px-5 py-4 rounded-xl bg-surface-elevated dark:bg-primary-dark/20 border border-border-light dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted text-text-primary dark:text-foreground font-medium";
  const labelClasses = "block text-sm font-bold text-text-secondary dark:text-text-muted mb-2 tracking-wide flex items-center gap-2";

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={<><span className="gradient-text">แก้ไข</span>ข้อมูลผู้ลงทะเบียน</>}
        description={`รหัสอ้างอิง: #${id.slice(0, 8).toUpperCase()}`}
        spacing="default"
      >
        <div className="mt-8">
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={actions.cancel}
            className="group backdrop-blur-md bg-white/50 dark:bg-white/10 rounded-2xl border-primary/20 dark:border-white/10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            กลับหน้าจัดการ
          </AnimatedButton>
        </div>
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <AnimatedSection delay={100}>
          <AnimatedCard className="overflow-hidden p-8 md:p-12">
            {state.success ? (
              <div className="py-12 text-center">
                <div className="w-24 h-24 bg-success/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform rotate-6 animate-pulse">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h2 className="text-3xl font-black text-text-primary dark:text-foreground mb-3">อัปเดตข้อมูลสำเร็จ</h2>
                <p className="text-text-muted font-medium italic">ระบบกำลังพาคุณกลับไปยังหน้าจัดการการลงทะเบียน...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-border-light dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-foreground">ข้อมูลส่วนบุคคล</h3>
                    <p className="text-xs text-text-muted">กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก</p>
                  </div>
                </div>

                {/* Event Info Display */}
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm">
                      <RefreshCw className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">กิจกรรม / แคมเปญ</div>
                      <div className="text-sm font-bold text-primary dark:text-primary-light">
                        {state.viewModel?.registration.eventTitle || 'ไม่ระบุกิจกรรม'}
                      </div>
                    </div>
                  </div>
                  {state.viewModel?.registration.eventId && (
                    <div className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-primary/10 text-[10px] font-bold text-text-muted shadow-sm">
                      EVENT ID: {state.viewModel.registration.eventId}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClasses}>
                      <User className="w-4 h-4 text-primary/60" /> ชื่อ-นามสกุล
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="สมชาย ใจดี"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>
                      <User className="w-4 h-4 text-primary/60" /> ชื่อเล่น
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname || ''}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="ตัวอย่าง: สมชาย"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>
                      <Calendar className="w-4 h-4 text-primary/60" /> วันเดือนปีเกิด
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ''}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>
                      <Phone className="w-4 h-4 text-primary/60" /> เบอร์โทรศัพท์
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="08X-XXX-XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>
                    <Mail className="w-4 h-4 text-primary/60" /> อีเมล
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="example@yourdomain.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClasses}>
                      <CheckCircle2 className="w-4 h-4 text-primary/60" /> สถานะการตรวจสอบ
                    </label>
                    <SearchableSelect
                      options={[
                        { label: '🟡 รอดำเนินการ (Pending)', value: 'pending' },
                        { label: '🟢 อนุมัติแล้ว (Approved)', value: 'approved' },
                        { label: '🔴 ปฏิเสธ (Rejected)', value: 'rejected' }
                      ]}
                      value={formData.status || 'pending'}
                      onChange={(val) => handleChange({ target: { name: 'status', value: val } } as any)}
                      className={`${inputClasses} font-bold`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClasses}>
                      <MapPin className="w-4 h-4 text-primary/60" /> ที่อยู่ / พื้นที่
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="ระบุอำเภอหรือระดับพื้นที่"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="requestNeedles"
                      name="requestNeedles"
                      checked={!!formData.requestNeedles}
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
                      checked={!!formData.requestHivTest}
                      onChange={handleChange}
                      className="w-6 h-6 rounded text-primary bg-surface border-border-light focus:ring-primary dark:bg-primary-dark/20 dark:border-white/10 transition-all cursor-pointer"
                    />
                    <label htmlFor="requestHivTest" className="text-sm font-bold text-text-primary dark:text-foreground cursor-pointer">
                      ขอชุดตรวจ HIV ด้วยตนเอง
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>
                    <PlusCircle className="w-4 h-4 text-primary/60" /> ไซส์ถุงยางอนามัยที่ต้องการ
                  </label>
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
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>
                    <AlertCircle className="w-4 h-4 text-primary/60" /> ประวัติการใช้สารเสพติด (ถ้ามี)
                  </label>
                  <textarea
                    name="substanceAbuseHistory"
                    rows={2}
                    value={formData.substanceAbuseHistory || ''}
                    onChange={handleChange}
                    className={`${inputClasses} resize-none h-20`}
                    placeholder="ระบุประวัติย่อๆ (ข้ามได้ถ้าไม่มี)"
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>
                    <AlertCircle className="w-4 h-4 text-primary/60" /> หมายเหตุเพิ่มเติม
                  </label>
                  <textarea
                    name="note"
                    rows={4}
                    value={formData.note || ''}
                    onChange={handleChange}
                    className={`${inputClasses} resize-none h-32`}
                    placeholder="ข้อมูลเพิ่มเติมที่ต้องการบันทึก..."
                  />
                </div>

                {state.error && (
                  <div className="p-5 bg-error/10 border border-error/20 text-error text-sm rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border-light dark:border-white/5">
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    onClick={actions.cancel}
                    className="flex-1 py-4 font-bold border-border-light dark:border-white/10"
                  >
                    <X className="w-5 h-5" />
                    ยกเลิก
                  </AnimatedButton>
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    className="flex-[2] py-4 shadow-xl shadow-primary/20 group"
                    disabled={state.submitting}
                  >
                    {state.submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังบันทึก...
                      </span>
                    ) : (
                      <>
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        บันทึกข้อมูล
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </form>
            )}
          </AnimatedCard>
        </AnimatedSection>
      </div>

      <ConfirmModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleConfirmSave}
        title="ยืนยันการบันทึกข้อมูล"
        message="คุณแน่ใจหรือไม่ว่าต้องการบันทึกการเปลี่ยนแปลงข้อมูลผู้ลงทะเบียนนี้?"
        type="info"
        confirmText="บันทึกข้อมูล"
        isLoading={state.submitting}
      />
    </div>
  );
}
