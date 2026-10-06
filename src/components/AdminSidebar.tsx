'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Grid,
  Users,
  GitCommit,
  FileText,
  QrCode,
  LogOut,
  Sparkles,
  ChevronRight,
  Globe
} from 'lucide-react';
import { logoutAdmin } from '../lib/data-store';

const ADMIN_NAV = [
  { label: 'Tổng Quan', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Quản Lý Sản Phẩm', href: '/admin/products', icon: Package },
  { label: 'Ngân Hàng Hoa Văn', href: '/admin/motifs', icon: Grid },
  { label: 'Nghệ Nhân Jrai', href: '/admin/artisans', icon: Users },
  { label: 'Hành Trình Dệt', href: '/admin/weaving-process', icon: GitCommit },
  { label: 'Nội Dung Website', href: '/admin/content', icon: FileText },
  { label: 'Quản Lý QR Code', href: '/admin/qr-manager', icon: QrCode },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col min-h-screen shrink-0">
      {/* Brand & Admin Badge */}
      <div className="p-5 border-b border-slate-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 text-white font-serif font-black flex items-center justify-center text-xl shadow-md border border-amber-500/40">
            J
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100 leading-tight">ADMIN CMS</div>
            <div className="text-[11px] text-amber-400 font-medium">Ngân Hàng Hoa Văn Jrai</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          DANH MỤC QUẢN TRỊ
        </div>

        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-800 text-white shadow border border-amber-600/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-600'}`} />
            </Link>
          );
        })}
      </div>

      {/* Footer & Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 rounded-xl border border-slate-700 transition"
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Xem Website Công Khai</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-bold py-2.5 rounded-xl border border-rose-800/50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng Xuất Admin</span>
        </button>
      </div>
    </aside>
  );
}
