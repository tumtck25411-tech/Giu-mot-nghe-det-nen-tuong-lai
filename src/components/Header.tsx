'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, QrCode, Search, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'TRANG CHỦ', href: '/' },
  { label: 'VỀ THỔ CẨM', href: '/about-brocade' },
  { label: 'TRA CỨU SẢN PHẨM', href: '/products' },
  { label: 'NGÂN HÀNG HOA VĂN', href: '/motifs' },
  { label: 'NGHỆ NHÂN', href: '/artisans' },
  { label: 'HÀNH TRÌNH DỆT', href: '/weaving-process' },
  { label: 'VỀ DỰ ÁN', href: '/about-project' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If on admin pages, hide public header
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/40 text-stone-100 shadow-md">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 py-1 px-4 text-center text-xs font-medium text-amber-200/90 border-b border-amber-800/30">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>DỆT NÊN TƯƠNG LAI — NGÂN HÀNG SỐ HOA VĂN JRAI • “Giữ một nghề, dệt nên tương lai.”</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-800 to-stone-900 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center border border-amber-500/40">
                <span className="font-serif font-black text-amber-400 text-xl tracking-tighter">J</span>
              </div>
            </div>
            <div>
              <div className="font-serif font-black text-lg tracking-wide text-amber-100 group-hover:text-amber-400 transition-colors leading-tight">
                DỆT NÊN TƯƠNG LAI
              </div>
              <div className="text-[11px] tracking-widest text-amber-400/80 uppercase font-medium">
                Ngân Hàng Số Hoa Văn Jrai
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                    isActive
                      ? 'bg-amber-700/80 text-white shadow-sm border border-amber-500/50'
                      : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Action Button */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 text-xs font-bold py-2.5 px-4 rounded-xl border border-amber-500/40 shadow-md transition-all hover:scale-[1.02]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tra Cứu Nhanh</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-stone-800 text-amber-200 hover:text-white border border-stone-700 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-amber-900/50 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/40 mb-3">
            <p className="text-xs text-amber-200 font-medium leading-relaxed">
              Khám phá di sản hoa văn, sản phẩm & câu chuyện nghệ nhân Jrai qua từng nếp dệt.
            </p>
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                  isActive
                    ? 'bg-amber-800 text-white border border-amber-500/50'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-amber-300'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-amber-800 hover:bg-amber-700 text-white font-bold text-sm py-3 rounded-xl shadow transition"
            >
              <Search className="w-4 h-4" />
              <span>Tra Cứu Sản Phẩm Thổ Cẩm</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
