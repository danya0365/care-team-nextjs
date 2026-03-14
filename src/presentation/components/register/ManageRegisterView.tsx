'use client';

import { useManageRegisterPresenter } from '@/src/presentation/presenters/register/useManageRegisterPresenter';
import { ManageRegisterViewModel } from '@/src/presentation/presenters/register/ManageRegisterPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { PageHeader } from '@/src/presentation/components/layout/PageHeader';
import { RefreshCw, Check, X, Edit, Trash2, Users, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

interface ManageRegisterViewProps {
  initialViewModel?: ManageRegisterViewModel;
}

export function ManageRegisterView({ initialViewModel }: ManageRegisterViewProps) {
  const { state, actions } = useManageRegisterPresenter(initialViewModel);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
            <CheckCircle className="w-3 h-3" />
            อนุมัติแล้ว
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-error/10 text-error border border-error/20">
            <XCircle className="w-3 h-3" />
            ปฏิเสธ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/20">
            <Clock className="w-3 h-3" />
            รอดำเนินการ
          </span>
        );
    }
  };

  if (state.loading && !state.viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm font-bold text-text-muted animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const { registrations, stats } = state.viewModel || { registrations: [], stats: { total: 0, pending: 0, approved: 0, rejected: 0 } };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={<><span className="gradient-text">จัดการ</span>การลงทะเบียน</>}
        description="ตรวจสอบและบริหารจัดการข้อมูลผู้ลงทะเบียน เพื่อการประสานงานที่มีประสิทธิภาพและเป็นระบบ"
        spacing="large"
      >
        <div className="mt-8 flex justify-center md:justify-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary dark:text-primary-light text-xs font-bold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Admin Panel • สิทธิเฉพาะทีมงานเท่านั้น
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <AnimatedSection>
          <div className="flex justify-end mb-6">
            <AnimatedButton 
              variant="outline"
              size="sm"
              onClick={() => actions.refresh()}
              className="bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl group border-primary/20 dark:border-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${state.loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              รีเฟรชข้อมูล
            </AnimatedButton>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { label: 'ลงทะเบียนทั้งหมด', value: stats.total, color: 'primary', icon: <Users /> },
              { label: 'รอดำเนินการ', value: stats.pending, color: 'warning', icon: <Clock /> },
              { label: 'อนุมัติแล้ว', value: stats.approved, color: 'success', icon: <CheckCircle /> },
              { label: 'ปฏิเสธข้อมูล', value: stats.rejected, color: 'error', icon: <XCircle /> },
            ].map((stat, i) => (
              <AnimatedCard key={i} className="relative group overflow-hidden p-6 md:p-8">
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 bg-${stat.color} group-hover:scale-110 transition-transform duration-500`} />
                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${stat.color}/10 text-${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl md:text-3xl font-black text-text-primary dark:text-foreground">{stat.value}</div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Registration Table/Content */}
        <AnimatedSection delay={200}>
          <AnimatedCard className="overflow-hidden p-0">
            {registrations.length === 0 ? (
              <div className="p-16 md:p-24 text-center">
                <div className="w-20 h-20 bg-primary/5 dark:bg-primary-dark/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <FileText className="w-10 h-10 text-primary/30" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-foreground">ยังไม่มีข้อมูลการลงทะเบียน</h3>
                <p className="text-text-muted mt-2 max-w-sm mx-auto text-sm">
                  เมื่อมีกลุ่มเป้าหมายส่งข้อมูลผ่านหน้าลงทะเบียน ข้อมูลทั้งหมดจะปรากฏขึ้นที่ตารางจัดการนี้
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary/5 dark:bg-primary-dark/5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted/80">
                      <th className="px-6 md:px-8 py-5 border-b border-border-light dark:border-white/5">ข้อมูลผู้ลงทะเบียน</th>
                      <th className="px-6 md:px-8 py-5 border-b border-border-light dark:border-white/5">กลุ่มเป้าหมาย</th>
                      <th className="px-6 md:px-8 py-5 border-b border-border-light dark:border-white/5 text-center">สถานะ</th>
                      <th className="px-6 md:px-8 py-5 border-b border-border-light dark:border-white/5 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-white/5">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors group">
                        <td className="px-6 md:px-8 py-6">
                          <div className="font-bold text-text-primary dark:text-foreground group-hover:text-primary transition-colors text-base">{reg.name}</div>
                          <div className="text-sm text-text-secondary dark:text-text-muted flex flex-col gap-1.5 mt-2">
                             <div className="flex items-center gap-2">
                               <div className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center"><RefreshCw className="w-3 h-3 opacity-70" /></div>
                               {reg.phone}
                             </div>
                             {reg.address && (
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 rounded-md bg-accent/5 flex items-center justify-center"><RefreshCw className="w-3 h-3 opacity-70" /></div>
                                 {reg.address}
                               </div>
                             )}
                          </div>
                          {reg.note && (
                            <div className="mt-4 p-4 rounded-2xl bg-surface-elevated dark:bg-primary-dark/10 text-xs text-text-secondary dark:text-text-muted leading-relaxed italic border border-border-light dark:border-white/5 shadow-inner">
                              <span className="text-primary not-italic font-bold mr-1">“</span>
                              {reg.note}
                              <span className="text-primary not-italic font-bold ml-1">”</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 md:px-8 py-6">
                          <span className="inline-flex px-3 py-1.5 rounded-lg bg-surface-elevated dark:bg-primary-dark/20 text-[10px] font-bold text-text-primary dark:text-foreground border border-border-light dark:border-white/5">
                            {reg.targetGroup}
                          </span>
                        </td>
                        <td className="px-6 md:px-8 py-6 text-center">
                          {getStatusBadge(reg.status)}
                        </td>
                        <td className="px-6 md:px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 md:group-hover:translate-x-0">
                            {reg.status !== 'approved' && (
                              <button
                                onClick={() => actions.updateStatus(reg.id, 'approved')}
                                disabled={state.actionLoading === reg.id}
                                className="w-10 h-10 rounded-xl bg-success/5 text-success hover:bg-success hover:text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-sm border border-success/10"
                                title="อนุมัติ"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            )}
                            {reg.status !== 'rejected' && (
                              <button
                                onClick={() => actions.updateStatus(reg.id, 'rejected')}
                                disabled={state.actionLoading === reg.id}
                                className="w-10 h-10 rounded-xl bg-error/5 text-error hover:bg-error hover:text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-sm border border-error/10"
                                title="ปฏิเสธ"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                            <a
                              href={`/manage-register/edit/${reg.id}`}
                              className="w-10 h-10 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm border border-primary/10"
                              title="แก้ไขข้อมูล"
                            >
                              <Edit className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => actions.deleteRegistration(reg.id)}
                              disabled={state.actionLoading === reg.id}
                              className="w-10 h-10 rounded-xl bg-surface-elevated dark:bg-white/5 text-text-muted hover:bg-error hover:text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-sm border border-border-light dark:border-white/5"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AnimatedCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
