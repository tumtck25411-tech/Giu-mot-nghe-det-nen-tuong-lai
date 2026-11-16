'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, User, MapPin, ArrowRight } from 'lucide-react';
import { getArtisans, syncWithServer } from '@/lib/data-store';
import { Artisan } from '@/types';

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);

  useEffect(() => {
    const loadData = () => {
      setArtisans(getArtisans());
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, []);

  const cleanQuote = (text?: string) => {
    if (!text) return '';
    return text.replace(/^[“"«\s]+|[”"»\s]+$/g, '').trim();
  };

  return (
    <div
      className="w-full min-h-screen py-10 lg:py-16 relative overflow-hidden"
      style={{
        backgroundColor: '#FAF7F2',
        backgroundImage: "url('/images/custom/texture_paper_cotton.jpg')",
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Decorative Brocade Diamond Watermarks on Top Corners */}
      <div
        className="absolute top-0 left-0 w-64 sm:w-80 h-32 pointer-events-none opacity-25 bg-contain bg-no-repeat bg-top-left"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_left.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-64 sm:w-80 h-32 pointer-events-none opacity-25 bg-contain bg-no-repeat bg-top-right"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_right.png')" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-12">
        {/* Header - Chuẩn Format Demo Hình 5 */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#174C38] tracking-tight font-serif">
            Nghệ nhân Dệt Thổ Cẩm
          </h1>

          <div className="flex justify-center">
            <div className="subtitle-pill-brocade shadow-2xs">
              <span className="text-[#C97A3E] text-xs">❖</span>
              <span>Làng Kép — Ia Mơ Nông</span>
              <span className="text-[#C97A3E] text-xs">❖</span>
            </div>
          </div>

          <p className="text-[#4A453F] text-sm sm:text-base italic max-w-xl mx-auto font-normal pt-1">
            Gìn giữ nghề truyền thống, lan tỏa giá trị thổ cẩm Jrai
          </p>
        </div>

        {/* ARTISANS GRID - Đầy đủ 9 nghệ nhân chuẩn format Demo Hình 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-[1600px] mx-auto">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="artisan-demo-card group cursor-pointer"
            >
              <div>
                {/* Photo with top-left badge and floating name pill */}
                <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-[#FAF5EC] rounded-t-[19px]">
                  <img
                    src={artisan.avatar || artisan.image_url}
                    alt={artisan.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />

                  {/* Top-left: Star badge "★ X năm tuổi nghề" */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <div className="artisan-badge-pill">
                      <Star className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                      <span>{artisan.experience_years ? `${artisan.experience_years} năm tuổi nghề` : artisan.experience}</span>
                    </div>
                  </div>

                  {/* Floating Name Pill overlapping bottom edge of image */}
                  <div className="absolute -bottom-4 left-4 z-10">
                    <div className="artisan-name-pill">
                      <User className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{artisan.name}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-7 px-5 pb-4 space-y-3">
                  {/* Location Row with Map Pin - Full text, clean wrapping */}
                  <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#4A453F] leading-snug">
                    <MapPin className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                    <span>{artisan.village || artisan.location}</span>
                  </div>

                  {/* Quote with Orange/Terracotta Left Border */}
                  {artisan.quote && (
                    <div className="artisan-quote-accent">
                      &ldquo;{cleanQuote(artisan.quote)}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Centered Outline Pill Button: Xem hồ sơ */}
              <div className="px-5 pb-5 pt-1 text-center">
                <Link
                  href={`/artisan/${artisan.id}`}
                  className="btn-artisan-outline w-full sm:w-auto"
                >
                  <span>Xem hồ sơ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
