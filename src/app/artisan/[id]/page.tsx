'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  MapPin,
  Award,
  Package,
  Grid,
  ChevronRight,
  ArrowLeft,
  Video
} from 'lucide-react';
import { getArtisanById, getProducts, getMotifs } from '@/lib/data-store';
import { Artisan, Product, Motif } from '@/types';

export default function ArtisanDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [artisanProducts, setArtisanProducts] = useState<Product[]>([]);
  const [artisanMotifs, setArtisanMotifs] = useState<Motif[]>([]);

  useEffect(() => {
    if (!id) return;
    const foundArtisan = getArtisanById(id);
    if (foundArtisan) {
      setArtisan(foundArtisan);

      const allProds = getProducts(true);
      const prods = allProds.filter((p) => p.artisan_id === foundArtisan.id);
      setArtisanProducts(prods);

      const allMotifs = getMotifs(true);
      const motifs = allMotifs.filter((m) => m.artisan_id === foundArtisan.id);
      setArtisanMotifs(motifs);
    }
  }, [id]);

  if (!artisan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Không tìm thấy thông tin nghệ nhân!
        </h1>
        <Link
          href="/artisans"
          className="inline-flex items-center gap-2 bg-stone-900 text-white font-bold text-xs py-2.5 px-5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Danh Sách Nghệ Nhân</span>
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
        <Link href="/artisans" className="hover:text-amber-800 transition">
          Nghệ nhân
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{artisan.name}</span>
      </div>

      {/* ARTISAN PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border-2 border-amber-900/20 shadow-md">
            <img
              src={artisan.image_url}
              alt={artisan.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>{artisan.experience}</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-slate-900">
            {artisan.name}
          </h1>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
            <span>{artisan.location}</span>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
            {artisan.bio}
          </p>
        </div>
      </div>

      {/* ARTISAN'S PRODUCTS */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-white font-bold flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Sản Phẩm Được Dệt Bởi Nghệ Nhân
              </h2>
              <p className="text-xs text-slate-500">
                Các tác phẩm thổ cẩm thủ công trực tiếp tạo tác bởi {artisan.name}.
              </p>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full">
            {artisanProducts.length} Sản phẩm
          </span>
        </div>

        {artisanProducts.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-4">Chưa có sản phẩm liên kết trực tiếp.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisanProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                className="bg-amber-50/30 hover:bg-amber-50 p-5 rounded-2xl border border-amber-200/60 transition-all group space-y-3"
              >
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
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
