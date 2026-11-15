'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  ShieldCheck,
  MapPin,
  UserCheck,
  Package,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Clock,
  ShoppingBag,
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-white">
          Không tìm thấy thông tin hoa văn!
        </h1>
        <p className="text-stone-400 text-sm">Mã hoa văn không tồn tại trong hệ thống số hóa.</p>
        <Link
          href="/motifs"
          className="inline-flex items-center gap-2 bg-[#B9383A] text-white font-bold text-xs py-3 px-6 rounded-xl shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Ngân Hàng Hoa Văn</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-white transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <Link href="/motifs" className="hover:text-white transition">
          Ngân hàng hoa văn
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <span className="text-amber-400 font-bold">{motif.motif_code}</span>
      </nav>

      {/* MOTIF HEADER & OVERVIEW */}
      <div className="bg-[#1C1714] rounded-3xl p-6 sm:p-10 border border-amber-900/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 p-6 flex items-center justify-center relative shadow-inner">
            <img
              src={motif.image_url}
              alt={motif.name}
              className="max-h-full object-contain"
            />
            <div className="absolute top-4 left-4 bg-[#B9383A] text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg shadow">
              {motif.motif_code}
            </div>
          </div>

          {/* Color Palette */}
          {motif.colors && motif.colors.length > 0 && (
            <div className="p-4 bg-[#231C18] rounded-2xl border border-stone-800 space-y-2">
              <span className="text-xs font-bold text-stone-300 block uppercase tracking-wider">
                Màu sắc chủ đạo trên vải thổ cẩm:
              </span>
              <div className="flex flex-wrap gap-2">
                {motif.colors.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs bg-stone-900 text-amber-200 px-3 py-1 rounded-full border border-amber-900/40 font-medium"
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
            <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{motif.theme_name} {motif.name_jrai && `• Tên Jrai: ${motif.name_jrai}`}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#FFFDF9] leading-tight">
              {motif.name}
            </h1>

            <div className="bg-[#231C18] p-5 rounded-2xl border border-amber-900/40 space-y-2">
              <h3 className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                Ý Nghĩa Biểu Tượng & Triết Lý
              </h3>
              <p className="text-stone-200 text-sm leading-relaxed">
                {motif.meaning || motif.philosophy}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-500 font-bold block">Kỹ thuật dệt</span>
                <span className="text-stone-200 font-semibold">{motif.technique}</span>
              </div>
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-500 font-bold block">Nguồn gốc xác minh</span>
                <span className="text-stone-200 font-semibold">{motif.location || 'Ia Mơ Nông, Chư Păh, Gia Lai'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/30 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xác thực bởi: <strong>{motif.artisan_verification || 'Nghệ nhân Làng Kép'}</strong></span>
            </div>
            <span className="font-mono text-stone-500">{motif.verification_date}</span>
          </div>
        </div>
      </div>

      {/* RESEARCH & CULTURAL DOSSIER */}
      {(motif.research_overview || (motif.research_bullets && motif.research_bullets.length > 0)) && (
        <section className="bg-[#1C1714] p-8 sm:p-10 rounded-3xl border border-amber-900/40 shadow-xl space-y-6">
          <h2 className="text-xl font-serif font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Tư Liệu Giải Mã Hoa Văn (Series Thổ Cẩm)</span>
          </h2>

          {motif.research_overview && (
            <p className="text-sm text-stone-300 leading-relaxed">
              {motif.research_overview}
            </p>
          )}

          {motif.research_bullets && motif.research_bullets.length > 0 && (
            <ul className="space-y-3 pt-2">
              {motif.research_bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
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
            <h2 className="text-2xl font-serif font-black text-white">
              Sản Phẩm Thổ Cẩm Ứng Dụng Hoa Văn Này ({usedProducts.length})
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Những tác phẩm thủ công lưu giữ đường nét hoa văn {motif.motif_code}.
            </p>
          </div>
        </div>

        {usedProducts.length === 0 ? (
          <div className="p-8 bg-[#1C1714] rounded-2xl border border-stone-800 text-center text-xs text-stone-400">
            Hiện tại chưa có sản phẩm mẫu nào trong kho ứng dụng hoa văn này.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="group bg-[#231C18] rounded-2xl border border-amber-900/30 hover:border-amber-500/60 overflow-hidden shadow-lg transition flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-stone-900 overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-mono text-amber-500">{p.product_code}</span>
                  <h4 className="font-serif font-bold text-xs text-white group-hover:text-amber-400 line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="text-sm font-black text-amber-400">
                    {p.price.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
