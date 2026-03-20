'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { PageHeader } from '@/src/presentation/components/layout/PageHeader';
import { ConfirmModal } from '@/src/presentation/components/common/ConfirmModal';
import Link from 'next/link';
import { 
  Users, 
  ShieldCheck, 
  Settings, 
  ArrowRight,
  Database
} from 'lucide-react';

export default function SettingsDashboardPage() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const settingModules = [
    { 
      title: 'ผู้ใช้งานระบบ (Admins)', 
      desc: 'จัดการบัญชีผู้ดูแลระบบ เพิ่ม ลบ หรือแก้ไขข้อมูลส่วนตัวของผู้ใช้งาน', 
      href: '#', // Set to /admin/settings/users when ready
      icon: <Users className="w-6 h-6" />,
      color: 'primary' 
    },
    { 
      title: 'บทบาทและสิทธิ์ (Roles)', 
      desc: 'กำหนดสิทธิ์การเข้าถึงเมนูต่างๆ และการดำเนินการภายในระบบ', 
      href: '#', // Set to /admin/settings/roles when ready
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'accent' 
    },
    { 
      title: 'ตั้งค่าทั่วไป (General)', 
      desc: 'ปรับแต่งระบบ เปิด/ปิดการทำงาน ตั้งค่าอีเมลและข้อมูลพื้นฐานเว็บ', 
      href: '#', // Set to /admin/settings/general when ready
      icon: <Settings className="w-6 h-6" />,
      color: 'success' 
    },
    { 
      title: 'ฐานข้อมูล (Database)', 
      desc: 'สำรองข้อมูล (Backup) และดูประวัติการดำเนินการ (Audit Logs)', 
      href: '#',
      icon: <Database className="w-6 h-6" />,
      color: 'warning' 
    },
  ];

  const renderCardContent = (module: typeof settingModules[0]) => {
    const isComingSoon = !module.href || module.href === '#';
    
    return (
      <AnimatedCard className="p-8 h-full border-transparent hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
        <div className="flex flex-col gap-6 relative z-10">
          <div className={`w-14 h-14 rounded-2xl bg-${module.color}/10 text-${module.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {module.icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-text-primary dark:text-foreground flex items-center gap-2">
              {module.title}
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold text-text-muted" />
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              {module.desc}
            </p>
            
            {isComingSoon && (
              <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full bg-surface-elevated dark:bg-card-border text-[10px] font-black tracking-[0.1em] uppercase shadow-sm border border-border-light dark:border-white/5 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse mr-2" />
                Coming Soon
              </div>
            )}
          </div>
        </div>
        
        {/* Hover visual effect */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-br from-transparent to-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </AnimatedCard>
    );
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={<><span className="gradient-text">ตั้งค่าระบบ</span> (Settings)</>}
        description="ศูนย์รวมการจัดการโครงสร้าง สิทธิ์การใช้งาน และการตั้งค่าพื้นฐานของแพลตฟอร์ม"
        spacing="default"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {settingModules.map((module, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              {!module.href || module.href === '#' ? (
                <button onClick={() => setIsAlertOpen(true)} className="group block w-full text-left">
                  {renderCardContent(module)}
                </button>
              ) : (
                <Link href={module.href} className="group block w-full text-left">
                  {renderCardContent(module)}
                </Link>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => setIsAlertOpen(false)}
        title="Coming Soon ✨"
        message={
          <div className="space-y-2">
            <p>ฟีเจอร์นี้กำลังอยู่ในระหว่างการพัฒนาครับ!</p>
            <p className="text-sm opacity-80">ทีมงานกำลังเร่งเตรียมความพร้อมเพื่อเปิดให้บริการในเร็วๆ นี้</p>
          </div>
        }
        cancelText="เข้าใจแล้ว"
        showConfirm={false}
        type="info"
      />
    </div>
  );
}
