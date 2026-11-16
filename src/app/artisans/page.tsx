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
      {/* Header Banner - Centered Flex & Text */}
      <div className="bg-[#FAF8F5] p-8 sm:p-14 rounded-2xl border border-[#E8E2D9] relative overflow-hidden shadow-xs flex flex-col items-center justify-center text-center header-banner-box">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 flex flex-col items-center justify-center text-center w-full">
          <span className="section-tag inline-flex items-center justify-center mx-auto text-xs font-semibold text-[#1E4D38] bg-[#FAF8F5] border border-[#E8E2D9] px-4 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5 inline mr-1 text-[#1E4D38]" />
            <span>NHỮNG BÀN TAY VÀNG ĐẠI NGÀN</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] leading-tight text-center mx-auto">
            Nghệ Nhân Dệt Thổ Cẩm Làng Kép — Ia Mơ Nông
          </h1>
          <p className="text-[#5D554D] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-center">
            Mỗi sản phẩm thổ cẩm bạn cầm trên tay đều mang hơi thở và công sức của một nghệ nhân cụ thể. Chúng tôi tôn vinh những người phụ nữ Jrai kiên trì giữ lửa nghề qua hàng chục năm cầm cửi, biến từng nếp dệt thành sinh kế bền vững.
          </p>
        </div>
      </div>

      {/* ARTISANS GRID - 3 columns on Desktop */}
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
              className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:border-[#1E4D38] shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Avatar Banner */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={artisan.avatar || artisan.image_url}
                    alt={artisan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#1F1D1B] font-mono text-xs font-semibold px-3 py-1 rounded-md border border-[#E8E2D9] shadow-xs">
                    {artisan.experience}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#1E4D38] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                    {artisanProducts.length} Tác phẩm
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-black text-xl text-[#1F1D1B] group-hover:text-[#1E4D38] transition-colors">
                      {artisan.name}
                    </h3>
                    <p className="text-xs text-[#5D554D] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1E4D38] shrink-0" />
                      <span>{artisan.village}</span>
                    </p>
                  </div>

                  {artisan.quote && (
                    <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-xs text-[#5D554D] font-serif italic leading-relaxed">
                      &ldquo;{artisan.quote}&rdquo;
                    </div>
                  )}

                  <p className="text-xs text-[#5D554D] leading-relaxed line-clamp-3">
                    {artisan.specialty || artisan.bio}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/artisan/${artisan.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1E4D38] hover:bg-[#143527] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <span>Xem hồ sơ & tác phẩm</span>
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
