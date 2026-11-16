'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GitCommit, Clock, CheckCircle2, ChevronRight, Video, ArrowRight } from 'lucide-react';
import { getWeavingSteps, syncWithServer } from '@/lib/data-store';
import { WeavingStep } from '@/types';

export default function WeavingProcessPage() {
  const [steps, setSteps] = useState<WeavingStep[]>([]);

  useEffect(() => {
    const loadData = () => {
      setSteps(getWeavingSteps());
    };

    loadData();
    syncWithServer().then(() => loadData());

    if (typeof window !== 'undefined') {
      window.addEventListener('jrai_store_updated', loadData);
      return () => window.removeEventListener('jrai_store_updated', loadData);
    }
  }, []);

  return (
    <div
      className="w-full min-h-screen py-10 relative overflow-hidden"
      style={{
        backgroundColor: '#FAF7F2',
        backgroundImage: "url('/images/custom/texture_paper_cotton.jpg')",
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Decorative Brocade Diamond Watermarks on Top Corners */}
      <div
        className="absolute top-0 left-0 w-64 sm:w-80 h-32 pointer-events-none opacity-20 bg-contain bg-no-repeat bg-top-left"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_left.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-64 sm:w-80 h-32 pointer-events-none opacity-20 bg-contain bg-no-repeat bg-top-right"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_right.png')" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-8 sm:p-12 rounded-xl border border-amber-900/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-950 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-md border border-amber-800/40 uppercase tracking-wider">
            <GitCommit className="w-3.5 h-3.5" />
            <span>Kỹ Thuật Thủ Công 7 Bước</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100 leading-tight">
            Hành Trình Dệt Thổ Cẩm Jrai
          </h1>
          <p className="text-stone-300 text-base leading-relaxed">
            Từ việc hái bông trên rẫy, nhuộm lá chàm rừng đến từng nhịp luồn thoi dệt hoa văn nổi. Khám phá 7 giai đoạn kiên trì để tạo tác nên một tấm thổ cẩm hoàn chỉnh.
          </p>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-amber-800/30 md:before:left-1/2">
        {steps.map((step, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={step.id}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Badge */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-800 text-white font-bold text-sm flex items-center justify-center border-4 border-stone-900 shadow-md z-10">
                {step.step_number}
              </div>

              {/* Step Card Content */}
              <div className="w-full md:w-[calc(50%-2.5rem)] ml-16 md:ml-0 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-md font-mono">
                  GIAI ĐOẠN 0{step.step_number}
                </div>

                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {step.description}
                </p>

                {step.details && (
                  <p className="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200/60 font-medium italic">
                    💡 {step.details}
                  </p>
                )}

                {step.image_url && (
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                    <img
                      src={step.image_url}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-amber-900 text-white p-8 rounded-xl text-center space-y-4 shadow-lg">
        <h3 className="text-2xl font-serif font-bold text-amber-100">
          Khám Phá Các Sản Phẩm Ứng Dụng Từ Quy Trình Dệt
        </h3>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs py-3 px-6 rounded-xl transition"
        >
          <span>Xem Danh Sách Sản Phẩm Thổ Cẩm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Bottom Illustrated Mountain Landscape Strip */}
      <div
        className="w-full h-24 sm:h-32 bg-bottom bg-contain sm:bg-cover bg-no-repeat mt-12 opacity-95 max-w-6xl mx-auto"
        style={{
          backgroundImage: "url('/images/custom/illustrated_mountain_footer.png')",
        }}
        title="Toàn cảnh thiên nhiên Tây Nguyên — JRAI ƠI"
      />
    </div>
  );
}
