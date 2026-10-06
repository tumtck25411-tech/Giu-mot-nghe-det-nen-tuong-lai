'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  User,
  Grid,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Award,
  Search,
  QrCode as QrIcon
} from 'lucide-react';
import { getProductById, getMotifs, getArtisanById, getProducts, syncWithServer } from '@/lib/data-store';
import { Product, Motif, Artisan } from '@/types';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [linkedMotifs, setLinkedMotifs] = useState<Motif[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const loadData = () => {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setActiveImage(foundProduct.image_url);

        if (foundProduct.artisan_id) {
          const foundArtisan = getArtisanById(foundProduct.artisan_id);
          if (foundArtisan) setArtisan(foundArtisan);
        }

        const allMotifs = getMotifs(true);
        const motifsForProd = allMotifs.filter((m) =>
          foundProduct.motif_ids?.includes(m.id)
        );
        setLinkedMotifs(motifsForProd);

        const allProds = getProducts(true);
        const related = allProds.filter((p) => p.id !== foundProduct.id).slice(0, 3);
        setRelatedProducts(related);
      }
    };

    loadData();
    syncWithServer().then(() => loadData());

    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      window.addEventListener('jrai_store_updated', loadData);
      return () => window.removeEventListener('jrai_store_updated', loadData);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const allProds = getProducts(true);
    const term = searchQuery.trim().toLowerCase();
    const match = allProds.find(
      (p) => p.product_code.toLowerCase() === term || p.name.toLowerCase().includes(term)
    );
    if (match) {
      router.push(`/product/${match.id}`);
    } else {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Không tìm thấy thông tin sản phẩm!
        </h1>
        <p className="text-slate-600 text-sm">
          Mã sản phẩm hoặc đường dẫn QR không tồn tại trong hệ thống.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-stone-900 text-white font-bold text-xs py-2.5 px-5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Danh Sách Sản Phẩm</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* QUICK PRODUCT LOOKUP BAR AT TOP */}
      <div className="bg-stone-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-amber-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-200 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">Tra Cứu Nhanh Tên & Ký Hiệu Sản Phẩm</div>
            <div className="text-[11px] text-stone-400">Gõ mã K001, T001, V001, A001, KH001... hoặc tên sản phẩm</div>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Nhập tên SP hoặc mã T001, K001..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 w-full md:w-64"
          />
          <button
            type="submit"
            className="bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
          >
            Tra Cứu
          </button>
        </form>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-amber-800 transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-amber-800 transition">
          Sản phẩm thổ cẩm
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold truncate">{product.name} ({product.product_code})</span>
      </div>

      {/* PRODUCT HEADER & GALLERY */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-amber-800 text-white font-mono text-sm font-bold px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-md">
              KÝ HIỆU: {product.product_code}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.additional_images && product.additional_images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveImage(product.image_url)}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                  activeImage === product.image_url
                    ? 'border-amber-800 ring-2 ring-amber-800/20'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={product.image_url}
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
              </button>

              {product.additional_images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    activeImage === img
                      ? 'border-amber-800 ring-2 ring-amber-800/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Overview */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Key Information Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-amber-900 uppercase">
                    Thời Gian Dệt Hoàn Thành
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {product.production_time}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-800 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-amber-900 uppercase">Địa điểm làng dệt</div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {product.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Artisan Card link */}
          {artisan && (
            <div className="bg-stone-900 text-white p-4 rounded-2xl border border-amber-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={artisan.image_url}
                  alt={artisan.name}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                />
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Nghệ Nhân Thực Hiện (Làm Thủ Công)
                  </div>
                  <div className="font-serif font-bold text-sm text-stone-100">
                    {artisan.name}
                  </div>
                  <div className="text-[11px] text-stone-400">{artisan.experience}</div>
                </div>
              </div>
              <Link
                href={`/artisan/${artisan.id}`}
                className="bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition"
              >
                Trang Nghệ Nhân
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* LINKED MOTIFS & MEANINGS SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-800 text-white font-bold flex items-center justify-center">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Hoa Văn & Ý Nghĩa Di Sản Trên Sản Phẩm
            </h2>
            <p className="text-xs text-slate-500">
              Chi tiết các mã hoa văn và tri thức truyền thống được dệt lồng vào sản phẩm.
            </p>
          </div>
        </div>

        {linkedMotifs.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            Chưa có thông tin hoa văn liên kết trực tiếp cho sản phẩm này.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {linkedMotifs.map((motif) => (
              <Link
                key={motif.id}
                href={`/motif/${motif.id}`}
                className="bg-amber-50/40 hover:bg-amber-50 p-5 rounded-2xl border border-amber-200/80 transition-all flex items-start gap-4 group"
              >
                <img
                  src={motif.image_url}
                  alt={motif.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-amber-800/20 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 space-y-1">
                  <div className="inline-block bg-amber-800 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    MÃ: {motif.motif_code}
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors">
                    {motif.name}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-2 rounded-lg border border-amber-200/50">
                    💡 Ý nghĩa: {motif.meaning}
                  </p>
                  <div className="text-[11px] font-bold text-amber-900 pt-1 flex items-center gap-1">
                    <span>Xem thêm nguồn gốc hoa văn</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* STORY & WEAVING DETAILS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-xl text-slate-900">Câu Chuyện Sản Phẩm</h3>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
          {product.story}
        </p>
      </div>

      {/* LIVE QR CODE GENERATOR CARD */}
      <QRCodeGenerator
        productUrl={currentUrl || `https://detnentuonglai.vercel.app/product/${product.id}`}
        productName={product.name}
        productCode={product.product_code}
        category={product.category}
        location={product.location}
      />
    </div>
  );
}
