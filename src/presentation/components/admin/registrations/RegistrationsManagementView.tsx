'use client';

import { useRegistrationsPresenter } from '@/src/presentation/presenters/register/useRegistrationsPresenter';
import { RegistrationsViewModel } from '@/src/presentation/presenters/register/RegistrationsPresenter';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { PageHeader } from '@/src/presentation/components/layout/PageHeader';
import { RefreshCw, Check, X, Edit, Trash2, Users, Clock, CheckCircle, XCircle, FileText, AlertTriangle, Plus, Search, Filter, Calendar, Download } from 'lucide-react';
import { ConfirmModal } from '@/src/presentation/components/common/ConfirmModal';
import { DataTableHeader } from '@/src/presentation/components/common/DataTableHeader';
import { Pagination } from '@/src/presentation/components/common/Pagination';
import { useState } from 'react';
import { cn } from '@/src/presentation/utils/cn';

interface RegistrationsManagementViewProps {
  initialViewModel?: RegistrationsViewModel;
}

export function RegistrationsManagementView({ initialViewModel }: RegistrationsManagementViewProps) {
  const { state, actions } = useRegistrationsPresenter(initialViewModel);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleExportCSV = () => {
    if (!state.viewModel?.registrations.length) return;

    // Define CSV Headers
    const headers = ['Name', 'Phone', 'Email', 'Status', 'Event', 'Target Group', 'Created At'];
    
    // Convert data to CSV rows
    const rows = state.viewModel.registrations.map(reg => [
      `"${reg.name}"`,
      `"${reg.phone}"`,
      `"${reg.email || ''}"`,
      `"${reg.status}"`,
      `"${reg.eventTitle || ''}"`,
      `"${reg.targetGroup}"`,
      `"${new Date(reg.createdAt).toLocaleString('th-TH')}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registrations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  const { registrations, stats, events, total, page, limit, totalPages } = state.viewModel || { 
    registrations: [], 
    events: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    stats: { total: 0, pending: 0, approved: 0, rejected: 0 } 
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={<><span className="gradient-text">จัดการ</span>การลงทะเบียน</>}
        description="ตรวจสอบและบริหารจัดการข้อมูลผู้ลงทะเบียน เพื่อการประสานงานที่มีประสิทธิภาพและเป็นระบบ"
        spacing="default"
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, อีเมล หรือโทรศัพท์..."
                  defaultValue={state.search}
                  onChange={(e) => actions.applySearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md
                    border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                    outline-none transition-all placeholder:text-text-muted font-medium"
                />
              </div>

              <select
                value={state.status}
                onChange={(e) => actions.applyFilters({ status: e.target.value })}
                className="px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md
                  border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                  outline-none transition-all font-bold text-sm"
              >
                <option value="">ทุกสถานะ</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="approved">อนุมัติแล้ว</option>
                <option value="rejected">ปฏิเสธ</option>
              </select>

              <select
                value={state.eventId || ''}
                onChange={(e) => actions.applyFilters({ eventId: e.target.value || null })}
                className="px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md
                  border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                  outline-none transition-all font-bold text-sm max-w-[200px]"
              >
                <option value="">ทุกกิจกรรม</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>

              <select
                value={state.limit}
                onChange={(e) => actions.changeLimit(Number(e.target.value))}
                className="px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md
                  border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                  outline-none transition-all font-bold text-sm"
              >
                <option value="10">10 รายการ</option>
                <option value="20">20 รายการ</option>
                <option value="50">50 รายการ</option>
                <option value="100">100 รายการ</option>
                <option value="500">500 รายการ</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <AnimatedButton 
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={!registrations.length}
                className="bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl group border-primary/20 dark:border-white/10"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                Export CSV
              </AnimatedButton>

              <AnimatedButton 
                variant="outline"
                size="sm"
                onClick={() => actions.refresh()}
                className="bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl group border-primary/20 dark:border-white/10"
              >
                <RefreshCw className={`w-4 h-4 ${state.loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                รีเฟรช
              </AnimatedButton>
              
              <a href="/admin/registrations/create">
                <AnimatedButton 
                  variant="primary"
                  size="sm"
                  className="rounded-2xl shadow-lg shadow-primary/20 group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  เพิ่มการลงทะเบียน
                </AnimatedButton>
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { label: 'ลงทะเบียนทั้งหมด', value: stats.total, icon: <Users />, colorClass: 'text-primary', bgClass: 'bg-primary/10', circleBg: 'bg-primary' },
              { label: 'รอดำเนินการ', value: stats.pending, icon: <Clock />, colorClass: 'text-warning', bgClass: 'bg-warning/10', circleBg: 'bg-warning' },
              { label: 'อนุมัติแล้ว', value: stats.approved, icon: <CheckCircle />, colorClass: 'text-success', bgClass: 'bg-success/10', circleBg: 'bg-success' },
              { label: 'ปฏิเสธข้อมูล', value: stats.rejected, icon: <XCircle />, colorClass: 'text-error', bgClass: 'bg-error/10', circleBg: 'bg-error' },
            ].map((stat, i) => (
              <AnimatedCard key={i} className="relative group overflow-hidden p-6 md:p-8">
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 ${stat.circleBg} group-hover:scale-110 transition-transform duration-500`} />
                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${stat.bgClass} ${stat.colorClass}`}>
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
          <AnimatedCard className="overflow-hidden p-0 relative">
            {state.loading && (
              <div className="absolute inset-0 z-20 bg-white/30 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {registrations.length === 0 ? (
              <div className="p-16 md:p-24 text-center">
                <div className="w-20 h-20 bg-primary/5 dark:bg-primary-dark/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3">
                  <FileText className="w-10 h-10 text-primary/30" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-foreground">ไม่พบข้อมูลการลงทะเบียน</h3>
                <p className="text-text-muted mt-2 max-w-sm mx-auto text-sm">
                  {state.search || state.status || state.eventId 
                    ? 'ลองเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง' 
                    : 'เมื่อมีกลุ่มเป้าหมายส่งข้อมูลผ่านหน้าลงทะเบียน ข้อมูลทั้งหมดจะปรากฏขึ้นที่ตารางจัดการนี้'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary/5 dark:bg-primary-dark/5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted-foreground/80">
                        <DataTableHeader 
                          label="ข้อมูลผู้ลงทะเบียน" 
                          sortBy="name" 
                          currentSortBy={state.sortBy} 
                          currentSortOrder={state.sortOrder} 
                          onSort={actions.applySorting} 
                        />
                        <DataTableHeader 
                          label="กิจกรรม / แคมเปญ" 
                          sortBy="eventTitle" 
                          currentSortBy={state.sortBy} 
                          currentSortOrder={state.sortOrder} 
                          onSort={actions.applySorting} 
                        />
                        <DataTableHeader 
                          label="กลุ่มเป้าหมาย" 
                          sortBy="targetGroup" 
                          currentSortBy={state.sortBy} 
                          currentSortOrder={state.sortOrder} 
                          onSort={actions.applySorting} 
                        />
                        <DataTableHeader 
                          label="สถานะ" 
                          sortBy="status" 
                          currentSortBy={state.sortBy} 
                          currentSortOrder={state.sortOrder} 
                          onSort={actions.applySorting} 
                          className="text-center"
                        />
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
                                <div className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center font-black text-[10px] text-primary">TEL</div>
                                {reg.phone}
                              </div>
                              {reg.email && (
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-md bg-secondary/5 flex items-center justify-center font-black text-[10px] text-secondary">@</div>
                                  {reg.email}
                                </div>
                              )}
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-[10px] text-text-muted font-bold tracking-tight">
                              <Clock className="w-3 h-3 opacity-50" />
                              {new Date(reg.createdAt).toLocaleString('th-TH', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <div className="flex flex-col gap-1.5">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                                reg.eventTitle 
                                  ? "bg-primary/10 text-primary border-primary/20" 
                                  : "bg-text-muted/5 text-text-muted border-text-muted/20"
                              )}>
                                <Calendar className="w-3 h-3" />
                                {reg.eventTitle || 'ไม่ระบุกิจกรรม'}
                              </span>
                            </div>
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
                                href={`/admin/registrations/edit/${reg.id}`}
                                className="w-10 h-10 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm border border-primary/10"
                                title="แก้ไขข้อมูล"
                              >
                                <Edit className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => setDeleteId(reg.id)}
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

                <Pagination 
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={actions.changePage}
                  totalRecords={total}
                  limit={limit}
                />
              </>
            )}
          </AnimatedCard>
        </AnimatedSection>
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await actions.deleteRegistration(deleteId);
            setDeleteId(null);
          }
        }}
        title="ยืนยันการลบข้อมูล"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลการลงทะเบียนนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        type="danger"
        confirmText="ยืนยันการลบ"
        isLoading={state.actionLoading === deleteId}
      />
    </div>
  );
}
