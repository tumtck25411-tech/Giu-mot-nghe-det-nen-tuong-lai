'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MapPin, ArrowRight, Award } from 'lucide-react';
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
    <div className="w-full bg-[#FAF5EC] min-h-screen py-10 lg:py-14">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        
        {/* Header - Modern Ethnic Boutique Style */}
        <div className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] shadow-xs text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8] text-xs font-medium text-[#C99A45]">
            <span>◇</span>
            <span>Làng Kép – Ia Mơ Nông</span>
            <span>◇</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#174C38] tracking-tight">
            Nghệ nhân dệt thổ cẩm
          </h1>
          <p className="text-[#59524C] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Gìn giữ nghề truyền thống, lan tỏa giá trị thổ cẩm Jrai
          </p>
        </div>

        {/* ARTISANS GRID - 3 columns Desktop, 2 Tablet, 1 Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                className="bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#E8DFC8] hover:border-[#C99A45] shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full"
              >
                <div>
                  {/* Photo with experience badge on image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF5EC]">
                    <img
                      src={artisan.avatar || artisan.image_url}
                      alt={artisan.name}
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                    />
                    {/* Badge kinh nghiệm trên ảnh */}
                    <div className="absolute top-3.5 right-3.5 bg-[#174C38]/90 text-[#FFFDF9] backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#C99A45]" />
                      <span>{artisan.experience}</span>
                    </div>

                    {/* Số lượng tác phẩm */}
                    {artisanProducts.length > 0 && (
                      <div className="absolute bottom-3 left-3 bg-[#FAF5EC]/95 backdrop-blur-sm border border-[#E8DFC8] text-[#174C38] text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs">
                        {artisanProducts.length} tác phẩm dệt
                      </div>
                    )}
                  </div>

                  {/* Artisan Details */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl text-[#174C38] group-hover:text-[#C99A45] transition-colors">
                        {artisan.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#59524C] flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C99A45] shrink-0" />
                        <span>{artisan.village}</span>
                      </p>
                    </div>

                    {/* Lời chia sẻ của nghệ nhân trong khung nền kem riêng */}
                    {artisan.quote && (
                      <div className="p-3.5 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] text-xs sm:text-[13px] text-[#4A4540] italic leading-relaxed">
                        &ldquo;{artisan.quote}&rdquo;
                      </div>
                    )}

                    {/* Mô tả nghề nghiệp súc tích */}
                    <p className="text-xs sm:text-sm text-[#59524C] leading-relaxed line-clamp-2 font-normal">
                      {artisan.specialty || artisan.bio}
                    </p>
                  </div>
                </div>

                {/* Footer Button: Xem hồ sơ */}
                <div className="p-5 sm:p-6 pt-0">
                  <Link
                    href={`/artisan/${artisan.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] text-sm font-medium flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>Xem hồ sơ</span>
                    <ArrowRight className="w-4 h-4 text-[#C99A45]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
