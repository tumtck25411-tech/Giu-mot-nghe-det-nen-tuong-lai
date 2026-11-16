'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface FooterContextCTAProps {
  title?: string;
  desc?: string;
  buttonText?: string;
  buttonLink?: string;
  hide?: boolean;
  className?: string;
}

export default function FooterContextCTA({
  title: propTitle,
  desc: propDesc,
  buttonText: propButtonText,
  buttonLink: propButtonLink,
  hide: propHide,
  className = '',
}: FooterContextCTAProps) {
  const pathname = usePathname() || '';

  // Explicit hide flag
  if (propHide) return null;

  // Do not show CTA on admin, checkout, order-success, or order-tracking pages unless explicitly forced
  if (
    !propTitle &&
    (pathname.startsWith('/admin') ||
      pathname.startsWith('/checkout') ||
      pathname.startsWith('/order-success') ||
      pathname.startsWith('/order-tracking') ||
      pathname.startsWith('/account'))
  ) {
    return null;
  }

  // Determine context-aware content based on current pathname
  let title = propTitle;
  let desc = propDesc;
  let buttonText = propButtonText;
  let buttonLink = propButtonLink;

  if (!title) {
    if (pathname.startsWith('/artisans') || pathname.startsWith('/artisan/')) {
      title = 'Những đôi bàn tay giữ hồn di sản';
      desc = 'Gặp gỡ những nghệ nhân đang gìn giữ nghề dệt truyền thống Jrai.';
      buttonText = 'Khám phá các nghệ nhân khác →';
      buttonLink = '/artisans';
    } else if (pathname.startsWith('/products') || pathname.startsWith('/product/')) {
      title = 'Tìm thấy món quà mang dấu ấn Tây Nguyên';
      desc = 'Khám phá thêm những sản phẩm thổ cẩm được dệt thủ công.';
      buttonText = 'Khám phá sản phẩm →';
      buttonLink = '/products';
    } else if (pathname.startsWith('/motifs') || pathname.startsWith('/motif/')) {
      title = 'Mỗi hoa văn là một câu chuyện';
      desc = 'Tìm hiểu những biểu tượng và ý nghĩa được lưu giữ qua từng đường dệt.';
      buttonText = 'Khám phá hoa văn →';
      buttonLink = '/motifs';
    } else if (pathname.startsWith('/custom-order') || pathname.startsWith('/bespoke')) {
      title = 'Dệt nên sản phẩm mang dấu ấn riêng';
      desc = 'Lựa chọn sản phẩm, màu sắc và hoa văn theo sở thích của bạn.';
      buttonText = 'Bắt đầu đặt dệt →';
      buttonLink = '/custom-order';
    } else if (pathname.startsWith('/traceability')) {
      title = 'Mỗi sản phẩm đều có một câu chuyện';
      desc = 'Khám phá nguồn gốc, nghệ nhân và hành trình tạo nên sản phẩm.';
      buttonText = 'Tra cứu sản phẩm →';
      buttonLink = '/traceability';
    } else if (
      pathname.startsWith('/about') ||
      pathname.startsWith('/about-') ||
      pathname.startsWith('/weaving-process')
    ) {
      title = 'Cùng JRAI ƠI gìn giữ di sản';
      desc = 'Kết nối giá trị văn hóa truyền thống với cuộc sống hiện đại.';
      buttonText = 'Khám phá sản phẩm →';
      buttonLink = '/products';
    } else if (pathname.startsWith('/cart')) {
      title = 'Chọn thêm một món quà từ đại ngàn';
      desc = 'Những sản phẩm thủ công đang chờ bạn khám phá.';
      buttonText = 'Tiếp tục mua sắm →';
      buttonLink = '/products';
    } else {
      // Default / Homepage footer CTA
      title = 'Cùng JRAI ƠI gìn giữ di sản';
      desc = 'Kết nối giá trị văn hóa truyền thống với cuộc sống hiện đại.';
      buttonText = 'Khám phá 57 tác phẩm thổ cẩm →';
      buttonLink = '/products';
    }
  }

  return (
    <section className={`w-full py-10 sm:py-12 relative z-20 ${className}`}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        {/* Tiêu đề & Mô tả */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#174C38] tracking-tight font-serif">
            {title}
          </h2>
          {desc && (
            <p className="text-sm sm:text-base text-[#4A453F] italic max-w-xl mx-auto font-normal">
              {desc}
            </p>
          )}
        </div>

        {/* Nút bấm CTA kẹp giữa 2 họa tiết quả trám thổ cẩm chuẩn Demo */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 pt-3">
          <span className="text-[#C97A3E] text-base select-none" aria-hidden="true">❖</span>
          <span className="h-px w-10 sm:w-20 bg-[#D4C4A8]" aria-hidden="true" />
          <Link
            href={buttonLink || '/products'}
            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3 rounded-full bg-[#174C38] hover:bg-[#0E3626] text-white font-semibold text-xs sm:text-sm shadow-md transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            <span>{buttonText}</span>
          </Link>
          <span className="h-px w-10 sm:w-20 bg-[#D4C4A8]" aria-hidden="true" />
          <span className="text-[#C97A3E] text-base select-none" aria-hidden="true">❖</span>
        </div>
      </div>
    </section>
  );
}
