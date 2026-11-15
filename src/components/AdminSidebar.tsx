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
  Globe,
  ShoppingBag,
  Percent,
} from 'lucide-react';
import { logoutAdmin } from '../lib/data-store';

const ADMIN_NAV = [
  { label: 'Tổng Quan', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Quản Lý Đơn Hàng', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Quản Lý Sản Phẩm', href: '/admin/products', icon: Package },
  { label: 'Ngân Hàng Hoa Văn', href: '/admin/motifs', icon: Grid },
  { label: 'Nghệ Nhân Jrai', href: '/admin/artisans', icon: Users },
  { label: 'Khuyến Mãi & Đánh Giá', href: '/admin/promotions', icon: Percent },
  { label: 'Quản Lý QR Code', href: '/admin/qr-manager', icon: QrCode },
  { label: 'Hành Trình Dệt', href: '/admin/weaving-process', icon: GitCommit },
  { label: 'Nội Dung Website', href: '/admin/content', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-[#120F0D] text-stone-200 border-r border-[#2E241E] flex flex-col min-h-screen shrink-0">
      {/* Brand & Admin Badge */}
      <div className="p-5 border-b border-[#2E241E]">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B2522] text-white font-serif font-black flex items-center justify-center text-xl shadow-md border border-amber-500/40">
            J
          </div>
          <div>
            <div className="font-bold text-sm text-[#FFFDF9] leading-tight flex items-center gap-1.5">
              <span>JRAI ƠI CMS</span>
            </div>
            <div className="text-xs text-amber-400 font-medium">Hệ Thống Quản Trị</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-xs font-bold text-stone-500 uppercase tracking-widest">
          QUẢN TRỊ THƯƠNG MẠI
        </div>

        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#B9383A] text-white shadow border border-amber-500/50'
                  : 'text-stone-400 hover:text-white hover:bg-[#1E1713]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-600'}`}
              />
            </Link>
          );
        })}
      </div>

      {/* Footer & Actions */}
      <div className="p-4 border-t border-[#2E241E] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full bg-[#1E1713] hover:bg-[#2A201A] text-stone-300 text-xs font-medium py-2.5 rounded-xl border border-stone-800 transition"
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Xem Website Cửa Hàng</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-bold py-2.5 rounded-xl border border-red-800/50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng Xuất Admin</span>
        </button>
      </div>
    </aside>
  );
}
