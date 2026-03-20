'use client';

import { Registration } from '@/src/application/repositories/IRegistrationRepository';
import { X, Printer, Calendar, MapPin, Phone, Mail, FileText, CheckCircle2, ShieldAlert, HeartPulse, Activity, Users } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { AnimatedButton } from '../../common/AnimatedButton';
import { useSpring, animated, config } from '@react-spring/web';
import { cn } from '@/src/presentation/utils/cn';

interface RegistrationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration | null;
}

export function RegistrationDetailModal({ isOpen, onClose, registration }: RegistrationDetailModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: registration ? `Registration_${registration.name}` : 'Registration',
    pageStyle: `
      @page { size: auto; margin: 20mm; }
      @media print {
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
        }
      }
    `,
  } as any);

  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : ('none' as any),
    config: config.gentle,
  });

  const contentSpring = useSpring({
    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
    opacity: isOpen ? 1 : 0,
    config: config.wobbly,
  });

  if (!isOpen && backdropSpring.opacity.get() === 0) return null;
  if (!registration) return null;

  const DetailRow = ({ icon: Icon, label, value, isAlert = false }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/5 border border-border-light dark:border-white/5 mb-3 print:border-gray-300 print:bg-transparent print:rounded-none print:shadow-none">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1", 
        isAlert ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1 print:text-gray-500">{label}</p>
        <p className={cn("text-lg font-bold", isAlert ? "text-error" : "text-text-primary dark:text-foreground print:text-black")}>
          {value || '-'}
        </p>
      </div>
    </div>
  );

  return (
    <animated.div
      style={backdropSpring}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 print:bg-transparent print:p-0"
      onClick={onClose}
    >
      <animated.div
        style={contentSpring}
        className="w-full max-w-3xl bg-white dark:bg-card-bg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 max-h-[90vh] flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions (Hidden in Print) */}
        <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-white/5 bg-surface dark:bg-card-bg print:hidden">
          <h2 className="text-xl font-black text-text-primary dark:text-foreground flex items-center gap-2">
             <FileText className="w-6 h-6 text-primary" />
             รายละเอียดการลงทะเบียน
          </h2>
          <div className="flex items-center gap-3">
            <AnimatedButton onClick={() => handlePrint()} variant="primary" className="py-2.5 px-6 font-bold flex items-center gap-2">
              <Printer className="w-4 h-4" />
              พิมพ์เอกสาร
            </AnimatedButton>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-text-muted hover:bg-surface-elevated dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Container */}
        <div className="overflow-y-auto p-4 md:p-8 custom-scrollbar bg-white dark:bg-card-bg print:overflow-visible print:p-8 print:h-auto" ref={contentRef}>
          {/* Printable Layout */}
          <div className="max-w-2xl mx-auto print:max-w-none print:w-full print:text-black">
            
            <div className="text-center mb-8 border-b border-border-light pb-8 print:border-gray-300">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 print:border print:border-gray-800">
                 <FileText className="w-8 h-8 text-primary print:text-black" />
              </div>
              <h1 className="text-3xl font-black text-text-primary dark:text-foreground print:text-black mb-2">
                ใบลงทะเบียน
              </h1>
              <p className="text-text-muted font-bold text-sm">
                วันที่ทำรายการ: {new Date(registration.createdAt).toLocaleString('th-TH')}
              </p>
              
              <div className="mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary font-bold print:border-gray-400 print:text-black">
                <Calendar className="w-4 h-4" />
                กิจกรรม: {registration.eventTitle || 'ไม่ระบุ'}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                 <DetailRow icon={Users} label="ชื่อ - นามสกุล" value={registration.name} />
                 <DetailRow icon={Users} label="ชื่อเล่น" value={registration.nickname} />
                 <DetailRow icon={Phone} label="เบอร์โทรศัพท์" value={registration.phone} />
                 <DetailRow icon={Calendar} label="วัน/เดือน/ปีเกิด" value={registration.dateOfBirth ? new Date(registration.dateOfBirth).toLocaleDateString('th-TH') : null} />
              </div>
              
              <DetailRow icon={MapPin} label="ที่อยู่ / สถานที่ลงผลงาน" value={registration.address} />

              <h3 className="text-lg font-black text-text-primary dark:text-foreground print:text-black mt-8 mb-4 border-b border-border-light pb-2">
                บริการที่ต้องการรับสนับสนุน
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                <DetailRow 
                  icon={Activity} 
                  label="ขอรับเข็มสะอาด" 
                  value={registration.requestNeedles ? 'ต้องการ' : 'ไม่ต้องการ'} 
                  isAlert={registration.requestNeedles}
                />
                <DetailRow 
                  icon={ShieldAlert} 
                  label="ขอรับถุงยางอนามัย (ไซส์)" 
                  value={registration.condomSize || 'ไม่ต้องการ'} 
                />
                <DetailRow 
                  icon={HeartPulse} 
                  label="ขอชุดตรวจ HIV ด้วยตนเอง" 
                  value={registration.requestHivTest ? 'ต้องการ' : 'ไม่ต้องการ'} 
                  isAlert={registration.requestHivTest}
                />
              </div>

              <h3 className="text-lg font-black text-text-primary dark:text-foreground print:text-black mt-8 mb-4 border-b border-border-light pb-2">
                ข้อมูลเพิ่มเติม
              </h3>

              <DetailRow 
                icon={ShieldAlert} 
                label="ประวัติการใช้สารเสพติด" 
                value={registration.substanceAbuseHistory} 
                isAlert={!!registration.substanceAbuseHistory}
              />

              <div className="p-6 rounded-2xl bg-surface-elevated/50 dark:bg-white/5 border border-border-light dark:border-white/5 print:border-gray-300 print:bg-transparent print:rounded-none">
                 <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">ข้อเสนอแนะเพิ่มเติม</p>
                 <p className="text-base text-text-primary dark:text-foreground whitespace-pre-wrap leading-relaxed print:text-black">
                   {registration.note || 'ไม่มีข้อเสนอแนะ'}
                 </p>
              </div>

            </div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}
