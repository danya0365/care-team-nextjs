'use client';

import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { PageHeader } from '@/src/presentation/components/layout/PageHeader';
import { 
  Users, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  ClipboardList,
  Activity,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const adminStats = [
    { label: 'ผู้ลงทะเบียนใหม่', value: '1', icon: <Users className="w-5 h-5" />, color: 'bg-primary/10 text-primary' },
    { label: 'กำลังดำเนินการ', value: '0', icon: <Activity className="w-5 h-5" />, color: 'bg-warning/10 text-warning' },
    { label: 'อนุมัติแล้ว', value: '1', icon: <UserCheck className="w-5 h-5" />, color: 'bg-success/10 text-success' },
  ];

  const quickActions = [
    { 
      title: 'จัดการการลงทะเบียน', 
      desc: 'เข้าสู่อาณาจักรการบริหารจัดการข้อมูลผู้ขอรับบริการ', 
      href: '/admin/registrations', 
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'primary' 
    },
    { 
      title: 'ตั้งค่าระบบ', 
      desc: 'ปรับแต่งการตั้งค่าหลักของระบบและสิทธิ์ผู้ใช้งาน', 
      href: '#', 
      icon: <Settings className="w-6 h-6" />,
      color: 'accent' 
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={<><span className="gradient-text">แผงควบคุม</span>ผู้ดูแลระบบ</>}
        description="ยินดีต้อนรับสู่ศูนย์กลางการจัดการระบบ Care Team Songkhla"
        spacing="default"
      >
        <div className="mt-8 flex justify-center lg:justify-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary dark:text-primary-light text-xs font-bold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Admin Dashboard • Overview
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {adminStats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <AnimatedCard className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-text-primary dark:text-foreground">{stat.value}</p>
                  </div>
                </div>
              </AnimatedCard>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {quickActions.map((action, i) => (
            <AnimatedSection key={i} delay={400 + (i * 100)}>
              <Link href={action.href} className="group block">
                <AnimatedCard className="p-8 h-full border-transparent hover:border-primary/20 transition-all duration-500">
                  <div className="flex flex-col gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-${action.color}/10 text-${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-text-primary dark:text-foreground flex items-center gap-2">
                        {action.title}
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" />
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
