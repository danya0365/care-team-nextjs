'use client';

import { useManageRegisterPresenter } from '@/src/presentation/presenters/register/useManageRegisterPresenter';
import { ManageRegisterViewModel } from '@/src/presentation/presenters/register/ManageRegisterPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';

interface ManageRegisterViewProps {
  initialViewModel?: ManageRegisterViewModel;
}

export function ManageRegisterView({ initialViewModel }: ManageRegisterViewProps) {
  const { state, actions } = useManageRegisterPresenter(initialViewModel);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-success-50 text-success dark:bg-success/20">อนุมัติแล้ว</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-error-50 text-error dark:bg-error/20">ปฏิเสธ</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-warning-50 text-warning dark:bg-warning/20">รอดำเนินการ</span>;
    }
  };

  if (state.loading && !state.viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { registrations, stats } = state.viewModel || { registrations: [], stats: { total: 0, pending: 0, approved: 0, rejected: 0 } };

  return (
    <div className="min-h-screen pb-20 overflow-hidden">
      {/* Background patterns like HomeView */}
      <div className="fixed inset-0 -z-10 bg-surface dark:bg-background pointer-events-none" />
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section with Gradient */}
      <section className="relative pt-24 pb-12 mb-8" style={{ background: 'linear-gradient(to bottom, var(--gradient-hero-from), transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-dark/20 text-primary dark:text-primary-light text-xs font-bold mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Admin Panel • สิทธิเฉพาะทีมงานเท่านั้น
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-text-primary dark:text-foreground leading-tight">
                  <span className="gradient-text">จัดการ</span>การลงทะเบียน
                </h1>
                <p className="text-lg text-text-secondary dark:text-text-muted mt-3 max-w-2xl">
                  ตรวจสอบและบริหารจัดการข้อมูลผู้ลงทะเบียน เพื่อการประสานงานที่มีประสิทธิภาพ
                </p>
              </div>
              
              <button 
                onClick={() => actions.refresh()}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-card-bg border border-border-light dark:border-card-border rounded-2xl text-sm font-bold shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all"
              >
                <svg className={`w-4 h-4 ${state.loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                รีเฟรชข้อมูล
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection delay={100}>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'ลงทะเบียนทั้งหมด', value: stats.total, color: 'primary', icon: '🫂' },
              { label: 'รอดำเนินการ', value: stats.pending, color: 'warning', icon: '⏳' },
              { label: 'อนุมัติแล้ว', value: stats.approved, color: 'success', icon: '✅' },
              { label: 'ปฏิเสธข้อมูล', value: stats.rejected, color: 'error', icon: '❌' },
            ].map((stat, i) => (
              <div key={i} className="group p-6 rounded-[2rem] bg-white dark:bg-card-bg border border-border-light dark:border-card-border shadow-soft hover:shadow-elevated transition-all flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${stat.color}-50 dark:bg-${stat.color}/10 text-${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{stat.label}</div>
                  <div className="text-3xl font-black text-text-primary dark:text-foreground">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Registration Table/Mobile List */}
        <AnimatedSection delay={200}>
          <div className="bg-white/80 dark:bg-card-bg/80 backdrop-blur-xl rounded-[2.5rem] border border-border-light dark:border-card-border shadow-soft overflow-hidden">
            {registrations.length === 0 ? (
              <div className="p-24 text-center">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-dark/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-foreground">ยังไม่มีข้อมูลการลงทะเบียน</h3>
                <p className="text-text-muted mt-2 max-w-sm mx-auto">
                  เมื่อมีกลุ่มเป้าหมายส่งข้อมูลผ่านหน้าลงทะเบียน ข้อมูลทั้งหมดจะปรากฏขึ้นที่ตารางจัดการนี้
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary-50/50 dark:bg-primary-dark/5 text-xs font-bold uppercase tracking-widest text-text-muted">
                      <th className="px-8 py-5 border-b border-border-light dark:border-card-border">ข้อมูลผู้ลงทะเบียน</th>
                      <th className="px-8 py-5 border-b border-border-light dark:border-card-border">กลุ่มเป้าหมาย</th>
                      <th className="px-8 py-5 border-b border-border-light dark:border-card-border text-center">สถานะ</th>
                      <th className="px-8 py-5 border-b border-border-light dark:border-card-border text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-card-border">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-primary-50/20 dark:hover:bg-primary-dark/5 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="font-bold text-text-primary dark:text-foreground group-hover:text-primary transition-colors">{reg.name}</div>
                          <div className="text-sm text-text-secondary dark:text-text-muted flex flex-col gap-0.5 mt-1">
                            <span className="flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                              {reg.phone}
                            </span>
                            {reg.address && (
                              <span className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {reg.address}
                              </span>
                            )}
                          </div>
                          {reg.note && (
                            <div className="mt-3 p-3 rounded-2xl bg-surface-elevated dark:bg-card-border/30 text-xs text-text-secondary italic border border-border-light dark:border-card-border/50">
                              "{reg.note}"
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex px-3 py-1 rounded-lg bg-surface-elevated dark:bg-card-border/40 text-xs font-bold text-text-primary dark:text-foreground">
                            {reg.targetGroup}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center lowercase">
                          {getStatusBadge(reg.status)}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 md:group-hover:translate-x-0">
                            {reg.status !== 'approved' && (
                              <button
                                onClick={() => actions.updateStatus(reg.id, 'approved')}
                                disabled={state.actionLoading === reg.id}
                                className="w-10 h-10 rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-sm"
                                title="อนุมัติ"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            {reg.status !== 'rejected' && (
                              <button
                                onClick={() => actions.updateStatus(reg.id, 'rejected')}
                                disabled={state.actionLoading === reg.id}
                                className="w-10 h-10 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-sm"
                                title="ปฏิเสธ"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                            <a
                              href={`/manage-register/edit/${reg.id}`}
                              className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                              title="แก้ไขข้อมูล"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => actions.deleteRegistration(reg.id)}
                              disabled={state.actionLoading === reg.id}
                              className="w-10 h-10 rounded-xl bg-surface-elevated dark:bg-card-border text-text-muted hover:bg-error hover:text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-sm"
                              title="ลบ"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
