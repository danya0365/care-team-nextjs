'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedSection } from '@/src/presentation/components/common/AnimatedSection';
import { ArrowLeft, FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Global Premium Not Found page for Public routes
 * Following the project's high-end design language and glassmorphism.
 */
export default function PublicNotFound() {
  return (
    <main className="min-h-[100vh] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10">
        <AnimatedSection>
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/10 border border-primary/20">
            <FileQuestion className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary dark:text-foreground mb-6 leading-tight">
            ไม่พบหน้า<span className="gradient-text">ที่คุณค้นหา</span>
          </h1>

          <p className="text-lg text-text-secondary dark:text-text-muted mb-12 leading-relaxed">
            ขออภัยครับ หน้าที่คุณกำลังเข้าถึงอาจถูกย้าย เปลี่ยนชื่อ <br className="hidden md:block" />
            หรือไม่มีอยู่จริงในระบบของเรา กรุณาตรวจสอบลิงก์อีกครั้งครับ
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
                ดูบริการทั้งหมด
              </AnimatedButton>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
