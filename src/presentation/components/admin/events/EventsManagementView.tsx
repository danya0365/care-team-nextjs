'use client';

import { Event } from '@/src/application/repositories/IEventRepository';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { SearchableSelect } from '@/src/presentation/components/common/SearchableSelect';
import { ConfirmModal } from '@/src/presentation/components/common/ConfirmModal';
import { DataTableHeader } from '@/src/presentation/components/common/DataTableHeader';
import { Pagination } from '@/src/presentation/components/common/Pagination';
import { PageHeader } from '@/src/presentation/components/layout/PageHeader';
import { EventsViewModel } from '@/src/presentation/presenters/events/EventsPresenter';
import { useEventsPresenter } from '@/src/presentation/presenters/events/useEventsPresenter';
import { Calendar, CheckCircle2, Clock, Download, Edit, ExternalLink, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { Link } from 'lucide-react'; // not needed just preserving order
import { cn } from '@/src/presentation/utils/cn';
import NextLink from 'next/link';
import { Skeleton } from '@/src/presentation/components/common/Skeleton';
import { useState } from 'react';

interface EventsManagementViewProps {
  initialViewModel?: EventsViewModel;
}

export function EventsManagementView({ initialViewModel }: EventsManagementViewProps) {
  const { state, actions } = useEventsPresenter(initialViewModel);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const handleExportCSV = () => {
    if (!state.viewModel?.events.length) return;

    const headers = ['Title', 'Description', 'Status', 'Start Date', 'End Date', 'Created At'];
    
    const rows = state.viewModel.events.map(event => [
      `"${event.title}"`,
      `"${event.description || ''}"`,
      `"${event.isActive ? 'Active' : 'Inactive'}"`,
      `"${event.startDate ? new Date(event.startDate).toLocaleDateString('th-TH') : ''}"`,
      `"${event.endDate ? new Date(event.endDate).toLocaleDateString('th-TH') : ''}"`,
      `"${new Date(event.createdAt).toLocaleString('th-TH')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `events_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        isActive: event.isActive,
        startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        isActive: true,
        startDate: '',
        endDate: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      title: formData.title,
      description: formData.description,
      isActive: formData.isActive,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    };

    try {
      let success = false;
      if (editingEvent) {
        success = await actions.updateEvent(editingEvent.id, submissionData);
      } else {
        success = await actions.createEvent(submissionData);
      }
      
      if (success) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
        <CheckCircle2 className="w-3 h-3" />
        เปิดรับสมัคร
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-text-muted/10 text-text-muted border border-text-muted/20">
        <Clock className="w-3 h-3" />
        ปิดกิจกรรม
      </span>
    );
  };

  if (state.loading && !state.viewModel) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader
          title={<Skeleton className="w-56 h-10 lg:h-14 mt-2" />}
          description={<Skeleton className="w-full max-w-md h-5 mt-4" />}
          spacing="default"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 w-full animate-in fade-in duration-1000">
          <div className="flex flex-wrap gap-4 mb-6">
            <Skeleton className="h-[52px] w-full md:w-[300px]" />
            <Skeleton className="h-[52px] w-[180px]" />
            <Skeleton className="h-[52px] w-[140px]" />
            <div className="flex-1"></div>
            <Skeleton className="h-10 w-32 rounded-2xl" />
            <Skeleton className="h-10 w-32 rounded-2xl" />
          </div>

          <div className="rounded-[2.5rem] bg-white dark:bg-card-bg shadow-xl shadow-black/5 dark:shadow-black/20 border border-border-light dark:border-white/5 p-0 overflow-hidden">
            <div className="bg-primary/5 dark:bg-primary-dark/5 px-6 md:px-8 py-5 flex items-center justify-between">
               <Skeleton className="w-24 h-4 bg-primary/10" />
               <Skeleton className="w-32 h-4 bg-primary/10" />
               <Skeleton className="w-24 h-4 bg-primary/10" />
               <Skeleton className="w-16 h-4 bg-primary/10" />
            </div>
            <div className="divide-y divide-border-light dark:divide-white/5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 md:px-8 py-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="w-40 h-5" />
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                  <Skeleton className="w-24 h-6 rounded-xl" />
                  <div className="flex gap-2">
                     <Skeleton className="w-10 h-10 rounded-xl" />
                     <Skeleton className="w-10 h-10 rounded-xl" />
                     <Skeleton className="w-10 h-10 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { events, total, page, limit, totalPages } = state.viewModel || { 
    events: [], 
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0 
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={<><span className="gradient-text">จัดการ</span>กิจกรรม</>}
        description="บริหารจัดการโครงการและกิจกรรมเพื่อการลงทะเบียนอย่างเป็นระบบ"
        spacing="default"
      >
        <div className="mt-8 flex justify-center md:justify-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary dark:text-primary-light text-xs font-bold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Admin Panel • กิจกรรมทั้งหมด
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <AnimatedSection>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[300px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อกิจกรรม..."
                  defaultValue={state.search}
                  onChange={(e) => actions.applySearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md
                    border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                    outline-none transition-all placeholder:text-text-muted font-medium"
                />
              </div>

              <div className="w-[180px]">
                <SearchableSelect
                  options={[
                    { label: 'ทุกสถานะ', value: '' },
                    { label: 'เปิดรับสมัคร', value: 'true' },
                    { label: 'ปิดรับสมัคร', value: 'false' }
                  ]}
                  value={state.isActive === null ? '' : String(state.isActive)}
                  onChange={(val) => actions.applyFilters({ isActive: val === '' ? null : val === 'true' })}
                  className="px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold text-sm h-[52px]"
                />
              </div>

              <div className="w-[140px]">
                <SearchableSelect
                  options={[
                    { label: '10 รายการ', value: '10' },
                    { label: '20 รายการ', value: '20' },
                    { label: '50 รายการ', value: '50' },
                    { label: '100 รายการ', value: '100' }
                  ]}
                  value={String(state.limit)}
                  onChange={(val) => actions.changeLimit(Number(val))}
                  className="px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold text-sm h-[52px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AnimatedButton 
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={!events.length}
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
              
              <AnimatedButton 
                variant="primary"
                size="sm"
                onClick={() => handleOpenModal()}
                className="rounded-2xl shadow-lg shadow-primary/20 group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                สร้างกิจกรรม
              </AnimatedButton>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <AnimatedCard className="overflow-hidden p-0 relative">
            {state.loading && (
              <div className="absolute inset-0 z-20 bg-white/30 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {events.length === 0 ? (
              <div className="p-16 md:p-24 text-center">
                <div className="w-20 h-20 bg-primary/5 dark:bg-primary-dark/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3">
                  <Calendar className="w-10 h-10 text-primary/30" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-foreground">ไม่พบกิจกรรม</h3>
                <p className="text-text-muted mt-2 max-w-sm mx-auto text-sm">
                  {state.search || state.isActive !== null ? 'ลองเปลี่ยนเงื่อนไขการค้นหา' : 'เริ่มสร้างกิจกรรมแรกเพื่อรับการลงทะเบียน'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary/5 dark:bg-primary-dark/5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted-foreground/80">
                        <DataTableHeader 
                          label="หัวข้อกิจกรรม" 
                          sortBy="title" 
                          currentSortBy={state.sortBy} 
                          currentSortOrder={state.sortOrder} 
                          onSort={actions.applySorting} 
                        />
                        <DataTableHeader 
                          label="ระยะเวลา" 
                          sortBy="startDate" 
                          currentSortBy={state.sortBy} 
                          currentSortOrder={state.sortOrder} 
                          onSort={actions.applySorting} 
                        />
                        <DataTableHeader 
                          label="สถานะ" 
                          sortBy="isActive" 
                          currentSortBy={state.sortBy} 
                          currentSortOrder={state.sortOrder} 
                          onSort={actions.applySorting} 
                          className="text-center"
                        />
                        <th className="px-6 md:px-8 py-5 border-b border-border-light dark:border-white/5 text-right">ลิงก์ / การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-white/5">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors group">
                          <td className="px-6 md:px-8 py-6">
                            <div className="font-bold text-text-primary dark:text-foreground group-hover:text-primary transition-colors text-base">{event.title}</div>
                            <div className="text-sm text-text-secondary dark:text-text-muted line-clamp-1 mt-1 max-w-md">
                              {event.description || 'ไม่มีคำอธิบาย'}
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-[10px] text-text-muted font-bold tracking-tight">
                              <Calendar className="w-3 h-3 opacity-50" />
                              สร้างเมื่อ {new Date(event.createdAt).toLocaleDateString('th-TH')}
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <div className="flex flex-col gap-1 text-[11px] font-bold text-text-secondary">
                              <div className="flex items-center gap-2">
                                <span className="w-8 opacity-50">เริ่ม:</span>
                                <span>{event.startDate ? new Date(event.startDate).toLocaleDateString('th-TH') : '-'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-8 opacity-50">จบ:</span>
                                <span>{event.endDate ? new Date(event.endDate).toLocaleDateString('th-TH') : '-'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-6 text-center">
                            {getStatusBadge(event.isActive)}
                          </td>
                          <td className="px-6 md:px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <NextLink 
                                href={`/event/${event.id}/register`}
                                target="_blank"
                                className="w-10 h-10 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm border border-primary/10"
                                title="ดูหน้าลงทะเบียน"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </NextLink>
                              <button
                                onClick={() => handleOpenModal(event)}
                                className="w-10 h-10 rounded-xl bg-surface-elevated dark:bg-white/5 text-text-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm border border-border-light dark:border-white/5"
                                title="แก้ไข"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteId(event.id);
                                  actions.fetchRegistrationCount(event.id);
                                }}
                                disabled={state.actionLoading === event.id}
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
        onClose={() => {
          setDeleteId(null);
          actions.resetRegistrationCount();
          actions.clearError();
        }}
        onConfirm={async () => {
          if (deleteId) {
            try {
              await actions.deleteEvent(deleteId);
              setDeleteId(null);
              actions.resetRegistrationCount();
            } catch (err) {
              // Error is handled in the presenter and state
            }
          }
        }}
        title="ยืนยันการลบกิจกรรม"
        message={
          <div className="space-y-4">
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้?</p>
            
            <div className="p-4 rounded-2xl bg-surface-elevated dark:bg-white/5 border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-secondary">จำนวนผู้ลงทะเบียน:</span>
                <span className={cn(
                  "text-lg font-black",
                  state.registrationCount === null ? "animate-pulse text-text-muted" : 
                  state.registrationCount > 0 ? "text-error" : "text-success"
                )}>
                  {state.registrationCount === null ? "กำลังคำนวณ..." : `${state.registrationCount} คน`}
                </span>
              </div>
            </div>

            {state.registrationCount !== null && state.registrationCount > 0 && (
              <div className="p-4 rounded-2xl bg-error/10 border border-error/20 flex gap-3 items-start">
                <X className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-error leading-relaxed">
                  ไม่สามารถลบกิจกรรมได้เนื่องจากมีข้อมูลผู้ลงทะเบียนค้างอยู่ กรุณาย้ายหรือลบข้อมูลผู้ลงทะเบียนก่อนดำเนินการ
                </p>
              </div>
            )}
            
            {state.error && (
              <div className="p-4 rounded-2xl bg-error/10 border border-error/20 text-sm font-bold text-error">
                {state.error}
              </div>
            )}
          </div>
        }
        type="danger"
        confirmText={state.registrationCount !== null && state.registrationCount > 0 ? "ไม่สามารถลบได้" : "ยืนยันการลบ"}
        isLoading={state.actionLoading === deleteId || state.registrationCount === null}
        showConfirm={!(state.registrationCount !== null && state.registrationCount > 0)}
      />

      {/* Modal - Create/Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          
          <AnimatedCard className="w-full max-w-2xl relative z-10 p-8 shadow-2xl overflow-visible border-primary/20">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white dark:bg-ui-surface border border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-text-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black mb-6 text-text-primary dark:text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {editingEvent ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              {editingEvent ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรมใหม่'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-text-secondary opacity-70 uppercase tracking-widest pl-1">ชื่อกิจกรรม</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-5 py-4 rounded-2xl bg-surface-elevated dark:bg-white/5 border border-border/50 focus:border-primary outline-none transition-all font-bold"
                  placeholder="เช่น กิจกรรมลงทะเบียนรับความช่วยเหลือ มีนาคม 2569"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-text-secondary opacity-70 uppercase tracking-widest pl-1">คำอธิบาย</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-5 py-4 rounded-2xl bg-surface-elevated dark:bg-white/5 border border-border/50 focus:border-primary outline-none transition-all font-medium resize-none"
                  placeholder="ระบุรายละเอียดกิจกรรมสั้นๆ..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-text-secondary opacity-70 uppercase tracking-widest pl-1">วันที่เริ่ม</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-5 py-4 rounded-2xl bg-surface-elevated dark:bg-white/5 border border-border/50 focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-text-secondary opacity-70 uppercase tracking-widest pl-1">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-5 py-4 rounded-2xl bg-surface-elevated dark:bg-white/5 border border-border/50 focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded border-primary text-primary focus:ring-primary h-5 w-5 bg-white/10"
                />
                <label htmlFor="isActive" className="text-sm font-black text-primary cursor-pointer">เปิดรับการลงทะเบียนทันที</label>
              </div>

              <div className="pt-4 flex gap-4">
                <AnimatedButton 
                  type="button"
                  variant="secondary" 
                  className="flex-1 py-4 font-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </AnimatedButton>
                <AnimatedButton 
                  type="submit"
                  variant="primary" 
                  className="flex-[2] py-4 font-black"
                  disabled={state.submitting}
                >
                  {state.submitting ? 'กำลังบันทึก...' : editingEvent ? 'บันทึกการแก้ไข' : 'ยืนยันสร้างกิจกรรม'}
                </AnimatedButton>
              </div>
            </form>
          </AnimatedCard>
        </div>
      )}
    </div>
  );
}
