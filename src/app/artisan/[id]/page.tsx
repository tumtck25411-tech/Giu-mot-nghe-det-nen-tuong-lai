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
  Sparkles,
  Phone,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { getArtisanById, getProducts, getMotifs, syncWithServer } from '@/lib/data-store';
import { Artisan, Product, Motif } from '@/types';

export default function ArtisanDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [artisanProducts, setArtisanProducts] = useState<Product[]>([]);
  const [artisanMotifs, setArtisanMotifs] = useState<Motif[]>([]);

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

        const allMotifs = getMotifs(true);
        const motifs = allMotifs.filter(
          (m) =>
            m.artisan_id === foundArtisan.id ||
            m.artisan_verification?.includes(foundArtisan.name)
        );
        setArtisanMotifs(motifs);
      }
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, [id]);

  if (!artisan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-white">
          Không tìm thấy thông tin nghệ nhân!
        </h1>
        <Link
          href="/artisans"
          className="inline-flex items-center gap-2 bg-[#B9383A] text-white font-bold text-xs py-3 px-6 rounded-xl shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Danh Sách Nghệ Nhân</span>
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
        <Link href="/artisans" className="hover:text-white transition">
          Nghệ nhân
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <span className="text-amber-400 font-bold">{artisan.name}</span>
      </nav>

      {/* ARTISAN PROFILE HEADER */}
      <div className="bg-[#1C1714] rounded-xl p-6 sm:p-10 border border-amber-900/40 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-stone-900 border-2 border-amber-700/40 shadow-xl relative">
            <img
              src={artisan.avatar || artisan.image_url}
              alt={artisan.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{artisan.experience} • {artisan.age || 65} tuổi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#FFFDF9]">
            {artisan.name}
          </h1>

          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{artisan.village || artisan.location}</span>
          </div>

          {artisan.quote && (
            <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/50 text-xs text-amber-200/95 font-serif italic leading-relaxed shadow-inner">
              {artisan.quote}
            </div>
          )}

          <div className="space-y-2 text-xs text-stone-300 leading-relaxed">
            <p>
              <strong className="text-amber-400">Kỹ thuật & chuyên môn:</strong> {artisan.specialty}
            </p>
            {artisan.bio && <p>{artisan.bio}</p>}
          </div>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-400 border-t border-stone-800">
            <span>
              Số tác phẩm thực hiện: <strong className="text-white">{artisanProducts.length}</strong>
            </span>
            {artisan.phone && (
              <span className="flex items-center gap-1 text-amber-400">
                <Phone className="w-3 h-3" />
                <span>Zalo liên hệ HTX: {artisan.phone}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS BY THIS ARTISAN */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-black text-white">
              Tác Phẩm Dệt Bởi {artisan.name} ({artisanProducts.length})
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Các sản phẩm thổ cẩm được dệt trực tiếp từ bàn tay nghệ nhân.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Xem tất cả sản phẩm &rarr;
          </Link>
        </div>

        {artisanProducts.length === 0 ? (
          <div className="p-8 bg-[#1C1714] rounded-2xl border border-stone-800 text-center text-xs text-stone-400">
            Nghệ nhân hiện đang chuẩn bị những mẻ dệt mới cho buôn làng.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisanProducts.map((p) => (
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
                  <span className="text-xs font-mono text-amber-500">{p.product_code}</span>
                  <h4 className="font-serif font-bold text-xs text-white group-hover:text-amber-400 line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-black text-amber-400">
                      {p.price.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="text-xs text-stone-400">{p.production_time}</span>
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
