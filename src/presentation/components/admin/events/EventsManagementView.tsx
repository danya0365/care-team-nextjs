'use client';

import { PageHeader } from '../../layout/PageHeader';
import { AnimatedSection } from '../../common/AnimatedSection';
import { AnimatedCard } from '../../common/AnimatedCard';
import { AnimatedButton } from '../../common/AnimatedButton';
import { 
  Calendar, 
  Plus, 
  Search, 
  ExternalLink, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Eye,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useEventsPresenter } from '@/src/presentation/presenters/events/useEventsPresenter';
import { EventsViewModel } from '@/src/presentation/presenters/events/EventsPresenter';
import { Event } from '@/src/application/repositories/IEventRepository';
import { cn } from '@/src/presentation/utils/cn';

interface EventsManagementViewProps {
  initialViewModel: EventsViewModel;
}

export function EventsManagementView({ initialViewModel }: EventsManagementViewProps) {
  const [state, actions] = useEventsPresenter(initialViewModel);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredEvents = state.events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    let success = false;
    
    const submissionData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    };

    if (editingEvent) {
      success = await actions.updateEvent(editingEvent.id, submissionData);
    } else {
      success = await actions.createEvent(submissionData);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้? ข้อมูลการลงทะเบียนที่เกี่ยวข้องจะได้รับผลกระทบ')) {
      await actions.deleteEvent(id);
    }
  };

  return (
    <>
      <PageHeader
        title={<><span className="gradient-text">จัดการ</span>กิจกรรม</>}
        description="สร้างและบริหารจัดการโครงการ/กิจกรรมสำหรับลงทะเบียน"
        spacing="default"
      >
        <div className="mt-8 flex justify-center md:justify-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary dark:text-primary-light text-xs font-bold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Admin Panel • บริหารจัดการกิจกรรมโครงการ
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-8">
        <AnimatedSection>
          <div className="flex flex-wrap items-center gap-4">
            <AnimatedButton 
              variant="primary" 
              size="md" 
              className="rounded-2xl flex items-center gap-2 px-6 shadow-lg shadow-primary/20 group"
              onClick={() => handleOpenModal()}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              สร้างกิจกรรมใหม่
            </AnimatedButton>
            
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="ค้นหาชื่อกิจกรรม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md
                  border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 
                  outline-none transition-all placeholder:text-text-muted font-medium"
              />
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.loading ? (
          <div className="col-span-full py-20 text-center text-text-muted italic">
            กำลังโหลดข้อมูลกิจกรรม...
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <AnimatedSection key={event.id}>
              <AnimatedCard className="group h-full relative overflow-hidden flex flex-col p-0">
                {/* Header Decoration */}
                <div className={cn(
                  "h-2 w-full",
                  event.isActive ? "bg-success" : "bg-text-muted/30"
                )} />
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      event.isActive 
                        ? "bg-success/10 text-success" 
                        : "bg-text-muted/10 text-text-muted"
                    )}>
                      {event.isActive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {event.isActive ? 'เปิดลงทะเบียน' : 'ปิดโครงการ'}
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(event)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-text-primary dark:text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-2">
                    {event.description || 'ไม่มีคำอธิบายสำหรับกิจกรรมนี้'}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-text-secondary font-bold">
                      <Calendar className="w-3.5 h-3.5 opacity-60" />
                      <span>{event.startDate ? new Date(event.startDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                      <span className="opacity-40">-</span>
                      <span>{event.endDate ? new Date(event.endDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link 
                        href={`/event/${event.id}/register`}
                        target="_blank"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-primary/10 text-primary text-xs font-black 
                          hover:bg-primary hover:text-white transition-all text-center flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        ลิงก์ลงทะเบียน
                      </Link>
                      <Link 
                        href={`/admin/manage-register?eventId=${event.id}`}
                        className="w-11 h-11 rounded-xl bg-surface-elevated dark:bg-white/5 border border-border/50 
                          flex items-center justify-center hover:bg-surface transition-all text-text-secondary"
                        title="ดูผู้ลงทะเบียน"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </AnimatedSection>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-surface-elevated dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-40">
              <Calendar className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-text-secondary mb-2">ไม่พบกิจกรรม</h4>
            <p className="text-text-muted">ลองสร้างกิจกรรมใหม่เพื่อเริ่มรับการลงทะเบียน</p>
          </div>
        )}
      </div>
    </div>

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
    </>
  );
}
