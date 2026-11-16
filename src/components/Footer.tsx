'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0B1E15] text-[#D1CCC4] border-t border-[#193A2A]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Slogan & Intro (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-serif font-black text-xl sm:text-2xl text-[#E58A1F] leading-snug">
              &ldquo;Thổ cẩm bản địa, dệt nên tương lai&rdquo;
            </h3>
            <p className="text-sm text-[#A8B2A9] leading-relaxed max-w-sm">
              JRAI ƠI cam kết bảo tồn nguyên vẹn kỹ thuật dệt cửi hông cổ truyền, kết hợp công nghệ số hóa QR để tạo sinh kế bền vững cho đồng bào buôn làng Tây Nguyên.
            </p>
          </div>

          {/* Column 2: Danh mục (3 Cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div>
              <h4 className="font-bold text-base text-white tracking-wide">
                Danh mục
              </h4>
              <div className="w-8 h-0.5 bg-[#22C55E] mt-1.5 rounded-full" />
            </div>
            <ul className="space-y-2.5 text-sm text-[#C4CCC5]">
              <li>
                <Link href="/products?category=scarf" className="hover:text-white transition-colors">
                  Khăn quàng cổ
                </Link>
              </li>
              <li>
                <Link href="/products?category=crossbody_bag" className="hover:text-white transition-colors">
                  Túi đeo chéo
                </Link>
              </li>
              <li>
                <Link href="/products?category=wallet" className="hover:text-white transition-colors">
                  Ví cầm tay
                </Link>
              </li>
              <li>
                <Link href="/products?category=male_shirt" className="hover:text-white transition-colors">
                  Áo nam truyền thống
                </Link>
              </li>
              <li>
                <Link href="/products?category=skirt" className="hover:text-white transition-colors">
                  Váy nữ lễ hội
                </Link>
              </li>
              <li>
                <Link href="/motifs" className="hover:text-white transition-colors">
                  Ngân hàng hoa văn
                </Link>
              </li>
              <li>
                <Link href="/traceability" className="hover:text-white transition-colors">
                  Tra cứu nguồn gốc
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hỗ trợ khách hàng (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div>
              <h4 className="font-bold text-base text-white tracking-wide">
                Hỗ trợ khách hàng
              </h4>
              <div className="w-8 h-0.5 bg-[#22C55E] mt-1.5 rounded-full" />
            </div>
            <ul className="space-y-2.5 text-sm text-[#C4CCC5]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Giới thiệu cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/policy/returns" className="hover:text-white transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/policy/shipping" className="hover:text-white transition-colors">
                  Chính sách giao hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kết nối với chúng tôi (2.5 Cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div>
              <h4 className="font-bold text-base text-white tracking-wide">
                Kết nối với chúng tôi
              </h4>
              <div className="w-8 h-0.5 bg-[#22C55E] mt-1.5 rounded-full" />
            </div>
            <div className="space-y-3 text-sm text-[#C4CCC5]">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>
                  Hotline: <strong className="text-white font-mono">0383 451 929</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>
                  Email: <span className="text-white">contact@jraioi.vn</span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>
                  Address: Xã Ia Mơ Nông, Huyện Chư Păh, Gia Lai
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="mt-12 pt-6 border-t border-[#193A2A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A968B] gap-4">
          <p>© 2026 JRAI ƠI. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/policy/terms" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <span className="text-[#3E5549]">|</span>
            <Link href="/policy/privacy" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <span className="text-[#3E5549]">|</span>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Cổng quản trị
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
