'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MapPin, Award, ChevronRight } from 'lucide-react';
import { getArtisans, getProducts, syncWithServer } from '@/lib/data-store';
import { Artisan, Product } from '@/types';

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = () => {
      setArtisans(getArtisans());
      setProducts(getProducts(true));
    };

    loadData();
    syncWithServer().then(() => loadData());

    if (typeof window !== 'undefined') {
      window.addEventListener('jrai_store_updated', loadData);
      return () => window.removeEventListener('jrai_store_updated', loadData);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-8 sm:p-10 rounded-3xl border border-amber-900/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-950 text-amber-300 text-xs font-bold px-3 py-1 rounded-md border border-amber-800/40 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Chân Dung Nghệ Nhân Giữ Nghề</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            Nghệ Nhân Dệt Thổ Cẩm Jrai
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Tôn vinh những bàn tay tài hoa lưu giữ khung dệt chàm, truyền dạy tri thức hoa văn và tạo tác nên các sản phẩm thổ cẩm đậm bản sắc.
          </p>
        </div>
      </div>

      {/* ARTISANS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artisans.map((artisan) => {
          const artisanProducts = products.filter((p) => p.artisan_id === artisan.id);

          return (
            <div
              key={artisan.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={artisan.image_url}
                    alt={artisan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-800/40">
                    {artisanProducts.length} Sản phẩm dệt
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-slate-900 text-xl group-hover:text-amber-800 transition-colors">
                    {artisan.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold">
                    <Award className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{artisan.experience}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{artisan.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1">
                    {artisan.bio}
                  </p>
                </div>
              </div>

              <Link
                href={`/artisan/${artisan.id}`}
                className="flex items-center justify-center gap-1.5 w-full bg-stone-900 hover:bg-amber-900 text-white font-bold py-3 rounded-xl transition text-xs"
              >
                <span>Xem Trang Nghệ Nhân & Sản Phẩm</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
