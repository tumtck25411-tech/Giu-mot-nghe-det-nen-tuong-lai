'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MapPin, ChevronRight, Award, Sparkles, ArrowRight, Heart } from 'lucide-react';
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

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, []);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-10 rounded-xl border border-amber-900/40 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full border border-amber-500/40 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Nghệ Nhân Giữ Hồn Thổ Cẩm Bản Địa</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#FFFDF9]">
            Nghệ Nhân Dệt Làng Kép & Làng Phung (09 Nghệ Nhân)
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Những người phụ nữ Jrai gìn giữ nếp dệt cửi hông, bí quyết nhuộm màu tự nhiên từ lá chàm, vỏ cây rừng và tri thức hoa văn qua hàng chục năm tháng. Họ là linh hồn tạo nên mỗi tác phẩm thổ cẩm JRAI ƠI.
          </p>
        </div>
      </div>

      {/* ARTISANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artisans.map((artisan) => {
          const artisanProducts = products.filter(
            (p) =>
              p.artisan_id === artisan.id ||
              p.artisan_name?.includes(artisan.name) ||
              artisan.product_ids?.includes(p.product_code) ||
              artisan.product_ids?.includes(p.id)
          );

          return (
            <div
              key={artisan.id}
              className="bg-[#231C18] rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-500/60 shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Avatar Banner */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                  <img
                    src={artisan.avatar || artisan.image_url}
                    alt={artisan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-sm text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-lg border border-amber-500/40">
                    {artisan.experience}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#B9383A] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {artisanProducts.length} Tác phẩm
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-black text-xl text-[#FFFDF9] group-hover:text-amber-400 transition-colors">
                      {artisan.name}
                    </h3>
                    <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{artisan.village}</span>
                    </p>
                  </div>

                  {artisan.quote && (
                    <div className="p-3.5 bg-[#1C1714] rounded-2xl border border-stone-800 text-xs text-amber-200/90 font-serif italic leading-relaxed">
                      {artisan.quote}
                    </div>
                  )}

                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                    {artisan.specialty || artisan.bio}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/artisan/${artisan.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#2A1E17] hover:bg-[#B9383A] text-amber-300 hover:text-white font-bold text-xs py-3 rounded-xl border border-amber-900/40 transition shadow-sm"
                >
                  <span>Xem hồ sơ & các tác phẩm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
