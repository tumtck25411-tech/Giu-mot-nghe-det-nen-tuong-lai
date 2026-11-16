'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getMotifById, getProducts, syncWithServer } from '@/lib/data-store';
import { Motif, Product } from '@/types';

export default function MotifDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [motif, setMotif] = useState<Motif | null>(null);
  const [usedProducts, setUsedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadData = () => {
      const foundMotif = getMotifById(id);
      if (foundMotif) {
        setMotif(foundMotif);

        const allProds = getProducts(true);
        const matchingProds = allProds.filter(
          (p) =>
            p.motif_ids?.includes(foundMotif.id) ||
            p.motif_id === foundMotif.id ||
            foundMotif.applied_product_ids?.includes(p.product_code) ||
            foundMotif.applied_product_ids?.includes(p.id)
        );
        setUsedProducts(matchingProds);
      }
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, [id]);

  if (!motif) {
    return (
      <div className="w-full bg-[#FAF5EC] min-h-[60vh] flex items-center justify-center py-20">
        <div className="bg-[#FFFDF9] border border-[#E8DFC8] rounded-2xl p-8 max-w-md mx-auto text-center space-y-4 shadow-xs">
          <h1 className="text-xl font-semibold text-[#174C38]">
            Không tìm thấy thông tin hoa văn!
          </h1>
          <p className="text-xs text-[#59524C]">Mã hoa văn không tồn tại trong hệ thống số hóa.</p>
          <Link
            href="/motifs"
            className="inline-flex items-center gap-2 bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-xs py-2.5 px-5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về ngân hàng hoa văn</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF5EC] min-h-screen py-8 lg:py-12">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#59524C]">
          <Link href="/" className="hover:text-[#174C38] transition">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C99A45]" />
          <Link href="/motifs" className="hover:text-[#174C38] transition">
            Ngân hàng hoa văn
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C99A45]" />
          <span className="text-[#174C38] font-medium">{motif.motif_code}</span>
        </nav>

        {/* MOTIF HEADER & OVERVIEW */}
        <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 border border-[#E8DFC8] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF5EC] border border-[#E8DFC8] p-6 flex items-center justify-center relative shadow-xs">
              <img
                src={motif.image_url}
                alt={motif.name}
                className="max-h-full object-contain"
              />
              <div className="absolute top-3.5 left-3.5 bg-[#174C38] text-[#FFFDF9] text-xs font-mono font-medium px-3 py-1 rounded-full shadow-xs">
                {motif.motif_code}
              </div>
            </div>

            {/* Color Palette */}
            {motif.colors && motif.colors.length > 0 && (
              <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-2">
                <span className="text-xs font-medium text-[#174C38] block uppercase tracking-wider">
                  Màu sắc chủ đạo trên vải thổ cẩm:
                </span>
                <div className="flex flex-wrap gap-2">
                  {motif.colors.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#FFFDF9] text-[#174C38] px-3 py-1 rounded-full border border-[#E8DFC8] font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#FAF5EC] border border-[#E8DFC8] text-[#C99A45] text-xs font-medium px-3.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{motif.theme_name} {motif.name_jrai && `• Tên Jrai: ${motif.name_jrai}`}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-[#174C38] tracking-tight">
                {motif.name}
              </h1>

              <div className="bg-[#FAF5EC] p-4 sm:p-5 rounded-xl border border-[#E8DFC8] space-y-1.5">
                <h3 className="font-medium text-xs text-[#C99A45] uppercase tracking-wider">
                  Ý nghĩa biểu tượng & triết lý
                </h3>
                <p className="text-[#4A4540] text-xs sm:text-sm leading-relaxed">
                  {motif.meaning || motif.philosophy}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1">
                  <span className="text-[#8A7E72] font-medium block">Kỹ thuật dệt</span>
                  <span className="text-[#174C38] font-medium">{motif.technique}</span>
                </div>
                <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1">
                  <span className="text-[#8A7E72] font-medium block">Nguồn gốc xác minh</span>
                  <span className="text-[#174C38] font-medium">{motif.location || 'Ia Mơ Nông, Chư Păh, Gia Lai'}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] flex items-center justify-between text-xs text-[#59524C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#174C38]" />
                <span>Xác thực bởi: <strong className="text-[#174C38] font-medium">{motif.artisan_verification || 'Nghệ nhân Làng Kép'}</strong></span>
              </div>
              <span className="font-mono text-[#8A7E72]">{motif.verification_date}</span>
            </div>
          </div>
        </div>

        {/* RESEARCH & CULTURAL DOSSIER */}
        {(motif.research_overview || (motif.research_bullets && motif.research_bullets.length > 0)) && (
          <section className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#174C38] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C99A45]" />
              <span>Tư liệu giải mã hoa văn</span>
            </h2>

            {motif.research_overview && (
              <p className="text-xs sm:text-sm text-[#59524C] leading-relaxed">
                {motif.research_overview}
              </p>
            )}

            {motif.research_bullets && motif.research_bullets.length > 0 && (
              <ul className="space-y-2.5 pt-1">
                {motif.research_bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#59524C] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C99A45] mt-2 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* PRODUCTS APPLYING THIS MOTIF */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38]">
                Sản phẩm ứng dụng hoa văn này ({usedProducts.length})
              </h2>
              <p className="text-xs sm:text-sm text-[#59524C] mt-0.5">
                Những tác phẩm thủ công lưu giữ đường nét hoa văn {motif.motif_code}.
              </p>
            </div>
          </div>

          {usedProducts.length === 0 ? (
            <div className="p-8 bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] text-center text-xs text-[#59524C]">
              Hiện tại chưa có sản phẩm mẫu nào trong kho ứng dụng hoa văn này.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {usedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] hover:border-[#C99A45] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] bg-[#FAF5EC] overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[11px] font-mono text-[#C99A45]">{p.product_code}</span>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#174C38] group-hover:text-[#C99A45] line-clamp-1 transition-colors">
                      {p.name}
                    </h4>
                    <div className="text-sm font-semibold text-[#A94335]">
                      {p.price.toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
