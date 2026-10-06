'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Grid,
  Users,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  QrCode,
  ArrowRight,
  Award,
  BookOpen
} from 'lucide-react';
import { getProducts, getMotifs, getArtisans, getPageContent, syncWithServer } from '@/lib/data-store';
import { Product, Motif, Artisan } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      setProducts(getProducts(true).slice(0, 4));
      setMotifs(getMotifs(true).slice(0, 4));
      setArtisans(getArtisans().slice(0, 3));
      setContent(getPageContent('home'));
    };

    loadData();
    syncWithServer().then(() => loadData());

    if (typeof window !== 'undefined') {
      window.addEventListener('jrai_store_updated', loadData);
      return () => window.removeEventListener('jrai_store_updated', loadData);
    }
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] bg-stone-950 text-white overflow-hidden flex items-center">
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1 brocade-pattern-border" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-950/80 border border-amber-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>DỆT NÊN TƯƠNG LAI — NGÂN HÀNG SỐ HOA VĂN JRAI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-amber-100 leading-none">
              “Giữ một nghề, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                dệt nên tương lai.”
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
              Thổ cẩm không chỉ là một sản phẩm thủ công. Đó là kỹ thuật, thời gian, câu chuyện và tri thức văn hóa được truyền qua nhiều thế hệ người Jrai Tây Nguyên.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-amber-900/30 transition-all hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4" />
                <span>TRA CỨU SẢN PHẨM</span>
              </Link>

              <Link
                href="/motifs"
                className="inline-flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 font-bold text-sm px-6 py-3.5 rounded-2xl border border-amber-800/60 transition-all hover:-translate-y-0.5"
              >
                <Grid className="w-4 h-4" />
                <span>KHÁM PHÁ HOA VĂN CENTRAL</span>
              </Link>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-stone-800/80">
              <div className="space-y-1">
                <div className="text-2xl font-serif font-bold text-amber-400">100%</div>
                <div className="text-xs text-stone-400">Số Hóa Mã QR SP</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-serif font-bold text-amber-400">Central</div>
                <div className="text-xs text-stone-400">Ngân Hàng Hoa Văn</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-serif font-bold text-amber-400">Gia Lai</div>
                <div className="text-xs text-stone-400">Xuất Xứ Địa Phương</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-serif font-bold text-amber-400">Minh Bạch</div>
                <div className="text-xs text-stone-400">Nguồn Xác Minh</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BROCADE INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200/80 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 tracking-widest uppercase bg-amber-100 px-3 py-1 rounded-lg">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Giá Trị Di Sản Văn Hóa</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                Mỗi Nếp Dệt Là Một Câu Chuyện Truyền Thế
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Website ra đời với sứ mệnh xây dựng Ngân hàng số hoa văn Jrai trung tâm, lưu giữ giá trị của từng hoa văn truyền thống, đồng thời giúp người dùng quét mã QR mở trực tiếp trang thông tin sản phẩm mà không cần đăng nhập.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
                  <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Xác Minh Văn Hóa</h4>
                    <p className="text-[11px] text-slate-600">Không tự bịa đặt ý nghĩa, xác minh từ nghệ nhân địa phương.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
                  <QrCode className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Mã QR Động</h4>
                    <p className="text-[11px] text-slate-600">Admin cập nhật thông tin, mã QR in trên sản phẩm giữ nguyên.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-900/20">
                <img
                  src="/images/khung-canh-det-cau-lac-bo.png"
                  alt="Khung cảnh dệt thổ cẩm ở câu lạc bộ Jrai"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-stone-900 text-amber-100 p-4 rounded-2xl shadow-xl max-w-xs border border-amber-800/40">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Award className="w-4 h-4" />
                  <span>Câu Lạc Bộ Dệt Thổ Cẩm Jrai</span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Khung cảnh dệt thổ cẩm truyền thống tại câu lạc bộ nghệ nhân.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
              Ứng Dụng Đời Sống
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Sản Phẩm Thổ Cẩm Tiêu Biểu
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-amber-900 hover:text-amber-700 font-bold text-xs uppercase tracking-wider group"
          >
            <span>Xem tất cả sản phẩm</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all group flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-stone-900/90 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-800/40">
                  {prod.product_code}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    {prod.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-amber-800 transition-colors mt-0.5">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Dệt: {prod.production_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">{prod.location}</span>
                  </div>

                  <Link
                    href={`/product/${prod.id}`}
                    className="flex items-center justify-center gap-1.5 w-full bg-stone-900 hover:bg-amber-900 text-white font-bold py-2.5 rounded-xl transition text-xs mt-2"
                  >
                    <span>Xem Chi Tiết & Hoa Văn</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CENTRAL MOTIF BANK HIGHLIGHT */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950 px-3 py-1 rounded-md border border-amber-800/40 mb-2">
                <Grid className="w-3.5 h-3.5" />
                <span>Kho Tri Thức Số</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                Ngân Hàng Số Hoa Văn Jrai Central
              </h2>
            </div>
            <Link
              href="/motifs"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider group"
            >
              <span>Tra cứu kho hoa văn ({motifs.length}+)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {motifs.map((motif) => (
              <Link
                key={motif.id}
                href={`/motif/${motif.id}`}
                className="bg-stone-950 rounded-2xl overflow-hidden border border-amber-900/40 hover:border-amber-500/60 p-5 space-y-4 group transition-all"
              >
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-900 relative">
                  <img
                    src={motif.image_url}
                    alt={motif.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-amber-800 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                    {motif.motif_code}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-amber-100 text-base group-hover:text-amber-400 transition-colors line-clamp-1">
                    {motif.name}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {motif.meaning}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-amber-300/80 pt-2 border-t border-stone-800">
                  <span>Nguồn: {motif.origin}</span>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ARTISANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
              Con Người & Bàn Tay Vàng
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Nghệ Nhân Giữ Nghề Thổ Cẩm
            </h2>
          </div>
          <Link
            href="/artisans"
            className="inline-flex items-center gap-1.5 text-amber-900 hover:text-amber-700 font-bold text-xs uppercase tracking-wider group"
          >
            <span>Danh sách nghệ nhân</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artisans.map((artisan) => (
            <Link
              key={artisan.id}
              href={`/artisan/${artisan.id}`}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
            >
              <img
                src={artisan.image_url}
                alt={artisan.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 border-2 border-amber-900/20 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors">
                  {artisan.name}
                </h3>
                <p className="text-xs text-amber-800 font-semibold">{artisan.experience}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{artisan.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
