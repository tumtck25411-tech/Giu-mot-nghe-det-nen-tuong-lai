'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  MapPin,
  Award,
  ChevronRight,
  ArrowLeft,
  Phone,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { getArtisanById, getProducts, syncWithServer } from '@/lib/data-store';
import { Artisan, Product } from '@/types';

export default function ArtisanDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [artisanProducts, setArtisanProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadData = () => {
      const foundArtisan = getArtisanById(id);
      if (foundArtisan) {
        setArtisan(foundArtisan);

        const allProds = getProducts(true);
        const prods = allProds.filter(
          (p) =>
            p.artisan_id === foundArtisan.id ||
            p.artisan_name?.includes(foundArtisan.name) ||
            foundArtisan.product_ids?.includes(p.product_code) ||
            foundArtisan.product_ids?.includes(p.id)
        );
        setArtisanProducts(prods);
      }
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, [id]);

  if (!artisan) {
    return (
      <div className="w-full bg-[#FAF5EC] min-h-[60vh] flex items-center justify-center py-20">
        <div className="bg-[#FFFDF9] border border-[#E8DFC8] rounded-2xl p-8 max-w-md mx-auto text-center space-y-4 shadow-xs">
          <h1 className="text-xl font-semibold text-[#174C38]">
            Không tìm thấy thông tin nghệ nhân!
          </h1>
          <p className="text-xs text-[#59524C]">
            Vui lòng kiểm tra lại đường dẫn hoặc danh sách nghệ nhân.
          </p>
          <Link
            href="/artisans"
            className="inline-flex items-center gap-2 bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-xs py-2.5 px-5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về danh sách nghệ nhân</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen py-8 lg:py-12 relative"
      style={{
        backgroundColor: '#FAF7F2',
        backgroundImage: "url('/images/custom/texture_paper_cotton.jpg')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#59524C]">
          <Link href="/" className="hover:text-[#174C38] transition">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C99A45]" />
          <Link href="/artisans" className="hover:text-[#174C38] transition">
            Nghệ nhân
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C99A45]" />
          <span className="text-[#174C38] font-medium">{artisan.name}</span>
        </nav>

        {/* ARTISAN PROFILE HEADER - Modern Ethnic Boutique Demo Format */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-10 border border-[#EAE3D2] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-[#FAF5EC] border border-[#EAE3D2] shadow-xs relative">
              <img
                src={artisan.avatar || artisan.image_url}
                alt={artisan.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3.5 left-3.5 z-10">
                <div className="artisan-badge-pill">
                  <span>★</span>
                  <span>{artisan.experience_years ? `${artisan.experience_years} năm tuổi nghề` : artisan.experience}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#F4EDE1] border border-[#D4C4A8] text-[#174C38] text-xs font-semibold px-4 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 text-[#C97A3E]" />
              <span>{artisan.experience} {artisan.age ? `• ${artisan.age} tuổi` : ''}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#174C38] tracking-tight">
              {artisan.name}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#59524C]">
              <MapPin className="w-4 h-4 text-[#174C38] shrink-0" />
              <span>{artisan.village || artisan.location}</span>
            </div>

            {artisan.quote && (
              <div className="artisan-quote-accent bg-[#FAF7F2] p-4 rounded-xl">
                &ldquo;{artisan.quote}&rdquo;
              </div>
            )}
                &ldquo;{artisan.quote}&rdquo;
              </div>
            )}

            <div className="space-y-2 text-xs sm:text-sm text-[#59524C] leading-relaxed">
              <p>
                <strong className="text-[#174C38] font-medium">Kỹ thuật & chuyên môn:</strong> {artisan.specialty}
              </p>
              {artisan.bio && <p>{artisan.bio}</p>}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-[#59524C] border-t border-[#E8DFC8]">
              <span>
                Tác phẩm dệt: <strong className="text-[#174C38] font-medium">{artisanProducts.length}</strong>
              </span>
              {artisan.phone && (
                <span className="flex items-center gap-1.5 text-[#174C38]">
                  <Phone className="w-3.5 h-3.5 text-[#C99A45]" />
                  <span>Liên hệ qua HTX: {artisan.phone}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTS BY THIS ARTISAN */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38]">
                Tác phẩm dệt bởi {artisan.name} ({artisanProducts.length})
              </h2>
              <p className="text-xs sm:text-sm text-[#59524C] mt-1">
                Các sản phẩm thổ cẩm thủ công được dệt bởi đôi bàn tay nghệ nhân.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-medium text-[#174C38] hover:text-[#C99A45] flex items-center gap-1 transition"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {artisanProducts.length === 0 ? (
            <div className="p-8 bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] text-center text-xs text-[#59524C]">
              Nghệ nhân hiện đang chuẩn bị những mẻ dệt mới cho buôn làng.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisanProducts.map((p) => (
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
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-mono text-[#C99A45]">{p.product_code}</span>
                    <h4 className="font-semibold text-sm text-[#174C38] group-hover:text-[#C99A45] line-clamp-1 transition-colors">
                      {p.name}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-semibold text-[#A94335]">
                        {p.price.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-[11px] text-[#59524C] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C99A45]" />
                        {p.production_time}
                      </span>
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
