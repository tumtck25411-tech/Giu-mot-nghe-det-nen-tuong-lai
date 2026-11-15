'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Heart,
  QrCode,
  Lock,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#120F0D] text-stone-300 border-t border-[#3D2C1F]">
      {/* Brand Values Highlight Bar */}
      <div className="bg-[#1A1412] border-b border-[#3D2C1F] py-6 px-4">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#8B2522]/30 border border-[#B9383A]/50 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">100% Thủ Công Bản Địa</p>
              <p className="text-xs text-stone-400">Dệt cửi hông bởi nghệ nhân làng Kép</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#8B2522]/30 border border-[#B9383A]/50 flex items-center justify-center text-amber-400 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Mã QR Định Danh Độc Bản</p>
              <p className="text-xs text-stone-400">Minh bạch người dệt, hoa văn, số giờ công</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#8B2522]/30 border border-[#B9383A]/50 flex items-center justify-center text-amber-400 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Thương Mại Công Bằng</p>
              <p className="text-xs text-stone-400">Gắn kết thu nhập trực tiếp cho nghệ nhân</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#8B2522]/30 border border-[#B9383A]/50 flex items-center justify-center text-amber-400 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Giao Hàng Toàn Quốc</p>
              <p className="text-xs text-stone-400">Kiểm tra hàng trước khi thanh toán (COD)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#B9383A] to-[#8B2522] text-white font-serif font-black flex items-center justify-center text-xl border border-amber-500/50 shadow">
                J
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-[#FFFDF9] tracking-wider">JRAI ƠI</h3>
                <p className="text-xs text-[#E58A1F] font-bold uppercase tracking-widest">
                  Thương Mại Điện Tử Thổ Cẩm Jrai
                </p>
              </div>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Kế thừa dự án nghiên cứu & bảo tồn di sản <em>Dệt Nên Tương Lai</em>. JRAI ƠI là thương hiệu kết nối những sản phẩm dệt thổ cẩm độc bản của người Jrai tại Gia Lai với thị trường hiện đại, tạo sinh kế bền vững cho các nghệ nhân buôn làng.
            </p>

            <div className="inline-flex items-center gap-2 bg-[#1C1714] border border-amber-900/50 rounded-xl px-4 py-2 text-xs text-amber-300 font-serif italic shadow-inner">
              <span>“Giữ một nghề, dệt nên tương lai.”</span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-400 pt-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Làng Kép & Làng Phung, Xã Ia Mơ Nông, Huyện Chư Păh, Tỉnh Gia Lai</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Hotline / Zalo: <strong>0383 451 929</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Email: contact@jraioi.vn</span>
              </p>
            </div>
          </div>

          {/* Sáu Mục Chính & Di Sản */}
          <div>
            <h4 className="font-bold text-xs text-amber-200 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Khám Phá JRAI ƠI
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/" className="hover:text-amber-300 transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-300 transition">
                  Sản phẩm thổ cẩm (57 mẫu)
                </Link>
              </li>
              <li>
                <Link href="/motifs" className="hover:text-amber-300 transition">
                  Ngân hàng hoa văn (20 biểu tượng)
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-amber-300 transition">
                  Nghệ nhân giữ nghề (9 nghệ nhân)
                </Link>
              </li>
              <li>
                <Link href="/traceability" className="hover:text-amber-300 transition">
                  Tra cứu nguồn gốc mã QR
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 transition">
                  Về chúng tôi & Dự án
                </Link>
              </li>
            </ul>
          </div>

          {/* Dịch vụ & Chính Sách Mua Hàng */}
          <div>
            <h4 className="font-bold text-xs text-amber-200 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/cart" className="hover:text-amber-300 transition">
                  Giỏ hàng của bạn
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-amber-300 transition">
                  Theo dõi tình trạng đơn hàng
                </Link>
              </li>
              <li>
                <Link href="/policy/shipping" className="hover:text-amber-300 transition">
                  Chính sách giao nhận & COD
                </Link>
              </li>
              <li>
                <Link href="/policy/returns" className="hover:text-amber-300 transition">
                  Chính sách đổi trả & bảo hành
                </Link>
              </li>
              <li>
                <Link href="/policy/privacy" className="hover:text-amber-300 transition">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link href="/policy/terms" className="hover:text-amber-300 transition">
                  Điều khoản giao dịch
                </Link>
              </li>
            </ul>
          </div>

          {/* Quản Trị Hệ Thống */}
          <div>
            <h4 className="font-bold text-xs text-amber-200 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Hệ Thống Quản Trị
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Cổng quản trị dành riêng cho ban quản lý JRAI ƠI để xử lý đơn hàng, kho sản phẩm và mã QR.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 bg-[#231C18] hover:bg-[#32261E] text-amber-300 hover:text-amber-200 font-bold text-xs py-2.5 px-4 rounded-xl border border-amber-800/60 transition shadow-sm w-full justify-center"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Cổng Quản Trị Hệ Thống</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Thương hiệu thương mại điện tử <strong>JRAI ƠI</strong>. Kế thừa nền tảng dự án Dệt Nên Tương Lai.</p>
          <p className="flex items-center gap-1">
            <span>Thiết kế & phát triển với</span>
            <Heart className="w-3.5 h-3.5 text-[#B9383A] fill-[#B9383A]" />
            <span>cho Di sản Thổ cẩm Jrai</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
