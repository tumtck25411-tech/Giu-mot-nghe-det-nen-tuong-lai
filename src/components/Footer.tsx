'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  QrCode,
  Lock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#17211B] text-[#D1CCC4] border-t border-[#25362C]">
      {/* Brand Values Highlight Bar */}
      <div className="bg-[#131B16] border-b border-[#25362C] py-5 px-4">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-lg bg-[#1E4D38] text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">100% Thủ Công Bản Địa</p>
              <p className="text-xs text-[#9E988F]">Dệt cửi hông bởi nghệ nhân buôn làng</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-lg bg-[#1E4D38] text-amber-300 flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Mã QR Định Danh Độc Bản</p>
              <p className="text-xs text-[#9E988F]">Minh bạch người dệt, hoa văn, số giờ công</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-lg bg-[#1E4D38] text-amber-300 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Thương Mại Công Bằng</p>
              <p className="text-xs text-[#9E988F]">Gắn kết thu nhập trực tiếp cho nghệ nhân</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-9 h-9 rounded-lg bg-[#1E4D38] text-amber-300 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Giao Hàng Toàn Quốc</p>
              <p className="text-xs text-[#9E988F]">Kiểm tra hàng trước khi thanh toán (COD)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#1E4D38] p-1 shadow-sm flex items-center justify-center shrink-0">
                <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6 text-[#FCD34D]">
                  <polygon points="20,4 36,20 20,36 4,20" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <polygon points="20,10 30,20 20,30 10,20" fill="#C43B3D" stroke="#EA8E23" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="2.5" fill="#FFFFFF" />
                  <line x1="20" y1="4" x2="20" y2="10" stroke="currentColor" strokeWidth="2" />
                  <line x1="20" y1="30" x2="20" y2="36" stroke="currentColor" strokeWidth="2" />
                  <line x1="4" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="2" />
                  <line x1="30" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-white tracking-wider">JRAI ƠI</h3>
                <p className="text-[10px] text-[#D9A74A] font-bold uppercase tracking-[0.2em]">
                  Thổ Cẩm Bản Địa Tây Nguyên
                </p>
              </div>
            </Link>

            <p className="text-xs text-[#9E988F] leading-relaxed max-w-sm">
              Thương hiệu bảo tồn và thương mại hóa di sản thổ cẩm dệt cửi hông của người Jrai tại Gia Lai. Mỗi tác phẩm là kết tinh của hàng chục giờ dệt tỉ mỉ, gìn giữ tri thức cổ truyền và kiến tạo sinh kế bền vững cho buôn làng.
            </p>

            <div className="space-y-1.5 text-xs text-[#9E988F] pt-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D9A74A] shrink-0 mt-0.5" />
                <span>Làng Kép & Làng Phung, Xã Ia Mơ Nông, Huyện Chư Păh, Tỉnh Gia Lai</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D9A74A] shrink-0" />
                <span>Hotline / Zalo: <strong className="text-white">0383 451 929</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D9A74A] shrink-0" />
                <span>Email: contact@jraioi.vn</span>
              </p>
            </div>
          </div>

          {/* Khám Phá JRAI ƠI */}
          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4 border-b border-[#25362C] pb-2">
              Khám Phá Di Sản
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9E988F] font-medium">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Sản phẩm thổ cẩm (57 mẫu)
                </Link>
              </li>
              <li>
                <Link href="/motifs" className="hover:text-white transition">
                  Ngân hàng hoa văn (20 biểu tượng)
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-white transition">
                  Nghệ nhân giữ nghề (9 nghệ nhân)
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-white transition">
                  Đặt may đo theo yêu cầu
                </Link>
              </li>
              <li>
                <Link href="/traceability" className="hover:text-white transition">
                  Tra cứu nguồn gốc mã QR
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Dịch vụ & Chính Sách Mua Hàng */}
          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4 border-b border-[#25362C] pb-2">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9E988F] font-medium">
              <li>
                <Link href="/cart" className="hover:text-white transition">
                  Giỏ hàng của bạn
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-white transition">
                  Theo dõi đơn hàng
                </Link>
              </li>
              <li>
                <Link href="/policy/shipping" className="hover:text-white transition">
                  Chính sách giao nhận & COD
                </Link>
              </li>
              <li>
                <Link href="/policy/returns" className="hover:text-white transition">
                  Chính sách đổi trả & bảo hành
                </Link>
              </li>
              <li>
                <Link href="/policy/privacy" className="hover:text-white transition">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link href="/policy/terms" className="hover:text-white transition">
                  Điều khoản giao dịch
                </Link>
              </li>
            </ul>
          </div>

          {/* Quản Trị Hệ Thống */}
          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4 border-b border-[#25362C] pb-2">
              Hệ Thống Quản Trị
            </h4>
            <p className="text-xs text-[#9E988F] mb-3 leading-relaxed">
              Cổng quản trị dành riêng cho ban điều hành JRAI ƠI để xử lý đơn hàng, kho sản phẩm và mã QR.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 bg-[#131B16] hover:bg-[#1E4D38] text-stone-200 hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-[#25362C] transition shadow-xs w-full justify-center"
            >
              <Lock className="w-3.5 h-3.5 text-[#D9A74A]" />
              <span>Cổng Quản Trị Hệ Thống</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#25362C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A726A] gap-4">
          <p>© 2026 Thương hiệu <strong>JRAI ƠI</strong> — Thổ cẩm bản địa Tây Nguyên.</p>
          <p className="flex items-center gap-1">
            <span>Bảo tồn & phát triển Di sản Thổ cẩm Jrai</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
