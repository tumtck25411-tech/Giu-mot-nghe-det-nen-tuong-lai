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
  Clock
} from 'lucide-react';
import { getMotifById, getProducts } from '@/lib/data-store';
import { Motif, Product } from '@/types';

export default function MotifDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [motif, setMotif] = useState<Motif | null>(null);
  const [usedProducts, setUsedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;
    const foundMotif = getMotifById(id);
    if (foundMotif) {
      setMotif(foundMotif);

      const allProds = getProducts(true);
      const matchingProds = allProds.filter((p) => p.motif_ids?.includes(foundMotif.id));
      setUsedProducts(matchingProds);
    }
  }, [id]);

  if (!motif) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Không tìm thấy thông tin hoa văn!
        </h1>
        <p className="text-slate-600 text-sm">Mã hoa văn không tồn tại trong hệ thống.</p>
        <Link
          href="/motifs"
          className="inline-flex items-center gap-2 bg-stone-900 text-white font-bold text-xs py-2.5 px-5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Ngân Hàng Hoa Văn</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-amber-800 transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/motifs" className="hover:text-amber-800 transition">
          Ngân hàng hoa văn Jrai
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{motif.motif_code}</span>
      </div>

      {/* MOTIF HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative">
            <img
              src={motif.image_url}
              alt={motif.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-amber-800 text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg shadow">
              {motif.motif_code}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Biểu Tượng Tri Thức Dân Gian</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
              {motif.name}
            </h1>

            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70 space-y-2">
              <h3 className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                Ý Nghĩa Văn Hóa & Tri Thức Truyền Thống:
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {motif.meaning}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{motif.description}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-bold text-slate-700">Màu sắc chủ đạo:</span>
              {motif.colors?.map((col, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium border border-slate-200"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* VERIFICATION METADATA BOX (Cultural preservation compliance) */}
          <div className="bg-stone-900 text-white p-5 rounded-2xl border border-amber-800/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xác Minh Nguồn Gốc Văn Hóa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400">Nguồn xác minh:</span>
                <p className="font-semibold text-stone-100">{motif.verification_source}</p>
              </div>
              <div>
                <span className="text-stone-400">Người cung cấp thông tin:</span>
                <p className="font-semibold text-amber-200">
                  {motif.informant_name || 'Hội Nghệ nhân Địa phương'}
                </p>
              </div>
              <div>
                <span className="text-stone-400">Địa phương:</span>
                <p className="font-semibold text-stone-100">{motif.location}</p>
              </div>
              <div>
                <span className="text-stone-400">Ngày xác minh:</span>
                <p className="font-semibold text-stone-100">{motif.verification_date}</p>
              </div>
            </div>

            {motif.verification_notes && (
              <p className="text-[11px] text-amber-200/80 italic border-t border-stone-800 pt-2">
                Ghi chú: "{motif.verification_notes}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS USING THIS MOTIF (Core requirement!) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-white font-bold flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Các Sản Phẩm Đang Sử Dụng Hoa Văn Này
              </h2>
              <p className="text-xs text-slate-500">
                Hiển thị tất cả sản phẩm thổ cẩm vật thể dệt kết hợp mã hoa văn {motif.motif_code}.
              </p>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full">
            {usedProducts.length} Sản phẩm
          </span>
        </div>

        {usedProducts.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-4">
            Hiện chưa có sản phẩm nào đăng ký sử dụng mã hoa văn này.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {usedProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                className="bg-amber-50/30 hover:bg-amber-50 p-5 rounded-2xl border border-amber-200/60 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-stone-900 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {prod.product_code}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase">
                      {prod.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200/40 mt-3 flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Dệt: {prod.production_time}</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Xem sản phẩm</span>
                    <ChevronRight className="w-4 h-4" />
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
