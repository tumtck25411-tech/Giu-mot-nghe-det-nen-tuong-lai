'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Heart, QrCode, Lock, ExternalLink } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-900/40">
      {/* Cultural Principle Highlight */}
      <div className="bg-amber-950/60 border-b border-amber-900/30 py-4 px-4 text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-200/90 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Tôn trọng Văn hóa:</strong> Dữ liệu hoa văn & thông tin nghề dệt được xác minh minh bạch từ nghệ nhân và người am hiểu văn hóa địa phương.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-800 text-white font-serif font-black flex items-center justify-center text-lg border border-amber-600/50">
                J
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-100">DỆT NÊN TƯƠNG LAI</h3>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  NGÂN HÀNG SỐ HOA VĂN JRAI
                </p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              Nền tảng số hóa, lưu giữ và giới thiệu giá trị nghệ thuật thổ cẩm Jrai. Kết nối sản phẩm thổ cẩm vật thể với câu chuyện hoa văn, nghệ nhân và quá trình dệt thủ công độc đáo.
            </p>
            <div className="inline-block bg-stone-900 border border-amber-900/50 rounded-xl px-4 py-2 text-xs text-amber-300 font-serif italic">
              “Giữ một nghề, dệt nên tương lai.”
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-amber-200 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Khám Phá Di Sản
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/about-brocade" className="hover:text-amber-300 transition">
                  Nét Đẹp Thổ Cẩm Jrai
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-300 transition">
                  Tra Cứu Sản Phẩm
                </Link>
              </li>
              <li>
                <Link href="/motifs" className="hover:text-amber-300 transition">
                  Ngân Hàng Hoa Văn Central
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-amber-300 transition">
                  Nghệ Nhân Giữ Nghề
                </Link>
              </li>
              <li>
                <Link href="/weaving-process" className="hover:text-amber-300 transition">
                  Hành Trình Dệt 7 Bước
                </Link>
              </li>
            </ul>
          </div>

          {/* Administrative Portal */}
          <div>
            <h4 className="font-bold text-sm text-amber-200 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Khu Vực Quản Trị
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Khu vực dành riêng cho Admin CMS để cập nhật hoa văn, sản phẩm và nội dung website.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 font-bold text-xs py-2.5 px-4 rounded-xl border border-amber-800/60 transition shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Cổng Quản Trị /admin</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Dự án DỆT NÊN TƯƠNG LAI — Ngân Hàng Số Hoa Văn Jrai. Bảo lưu mọi quyền.</p>
          <p className="flex items-center gap-1">
            <span>Thiết kế với</span>
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>cho Di sản Văn hóa Tây Nguyên</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
