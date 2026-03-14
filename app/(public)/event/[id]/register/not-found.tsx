'use client';

import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { CalendarX, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Premium Not Found page for Event Registration
 * Following the project's high-end design language and glassmorphism.
 */
export default function EventNotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="max-w-xl w-full text-center relative z-10">
        <AnimatedSection>
          <div className="w-24 h-24 rounded-3xl bg-error/10 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-error/20 border border-error/20">
            <CalendarX className="w-12 h-12 text-error" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text-primary dark:text-foreground mb-6 leading-tight">
            ไม่พบ<span className="gradient-text">กิจกรรม</span>
          </h1>

          <p className="text-lg text-text-secondary dark:text-text-muted mb-12 leading-relaxed">
            ขออภัยครับ กิจกรรมที่คุณกำลังค้นหาอาจจะถูกย้าย ลบออกไปแล้ว <br className="hidden md:block" />
            หรือลิงก์ลงทะเบียนอาจจะไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งครับ
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <AnimatedButton variant="outline" size="md" className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                กลับหน้าหลัก
              </AnimatedButton>
            </Link>
            
            <Link href="/services">
              <AnimatedButton variant="primary" size="md" className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4" />
                ดูบริการอื่นๆ
              </AnimatedButton>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
