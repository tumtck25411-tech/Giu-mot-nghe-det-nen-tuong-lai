'use client';

import React from 'react';
import { UserCheck, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Phiên Đăng Nhập An Toàn</span>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-medium">
          <div className="w-7 h-7 rounded-lg bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
            A
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight">Quản trị viên</div>
            <div className="text-[10px] text-slate-500">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
