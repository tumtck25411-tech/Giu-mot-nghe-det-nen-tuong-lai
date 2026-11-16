'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Clock,
  QrCode,
  ShoppingBag,
  Heart,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  getProducts,
  getArtisans,
  getMotifs,
  addToCart,
  toggleWishlist,
  isInWishlist,
  syncWithServer,
} from '@/lib/data-store';
import { Product, Artisan, Motif } from '@/types';

// Danh mục sản phẩm thổ cẩm Jrai
const CATEGORIES = [
  { id: 'all', name: 'Tất cả', filterKey: 'all', count: 57 },
  { id: 'scarf', name: 'Khăn quàng cổ', filterKey: 'scarf', count: 28 },
  { id: 'crossbag', name: 'Túi đeo chéo', filterKey: 'crossbag', count: 9 },
  { id: 'wallet', name: 'Ví cầm tay', filterKey: 'wallet', count: 7 },
  { id: 'apron', name: 'Tạp dề', filterKey: 'apron', count: 5 },
  { id: 'tote', name: 'Túi tote', filterKey: 'tote', count: 3 },
  { id: 'dress', name: 'Váy nữ lễ hội', filterKey: 'dress', count: 2 },
  { id: 'shirt', name: 'Áo nam truyền thống', filterKey: 'shirt', count: 2 },
  { id: 'gourd', name: 'Bầu nước', filterKey: 'gourd', count: 1 },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [motifs, setMotifs] = useState<Motif[]>([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedArtisan, setSelectedArtisan] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      setProducts(getProducts(true));
      setArtisans(getArtisans());
      setMotifs(getMotifs(true));
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  const handleAddToCart = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p, 1);
    setAddedNotice(`Đã thêm "${p.name}" vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Category Filter
        if (selectedCategory !== 'all') {
          if (p.category !== selectedCategory) return false;
        }

        // 2. Artisan Filter
        if (selectedArtisan !== 'all') {
          if (p.artisan_id !== selectedArtisan && p.artisan_name !== selectedArtisan) {
            return false;
          }
        }

        // 3. Price Filter
        if (priceRange === 'under300' && p.price >= 300000) return false;
        if (priceRange === '300to500' && (p.price < 300000 || p.price > 500000)) return false;
        if (priceRange === '500to1m' && (p.price < 500000 || p.price > 1000000)) return false;
        if (priceRange === 'over1m' && p.price <= 1000000) return false;

        // 4. Keyword Search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCode = p.product_code.toLowerCase().includes(q);
          const matchCat = p.category_name?.toLowerCase().includes(q);
          const matchArt = p.artisan_name?.toLowerCase().includes(q);
          const matchStory = p.story?.toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchCat && !matchArt && !matchStory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0; // featured default
      });
  }, [products, selectedCategory, selectedArtisan, priceRange, searchTerm, sortBy]);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
      {/* Toast Notice Added to Cart */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E4D38] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#2D6A4F] animate-in slide-in-from-bottom duration-200">
          <Check className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-bold">{addedNotice}</span>
        </div>
      )}

      {/* 1. HEADER BANNER */}
      <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-2xl border border-[#E8E2D9] relative overflow-hidden shadow-xs flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 flex flex-col items-center justify-center text-center w-full">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E4D38] bg-[#F5F1E8] px-3.5 py-1.5 rounded-full border border-[#E8E2D9]">
            THỦ CÔNG BẢN ĐỊA ĐỘC BẢN • JRAI ƠI
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] leading-tight text-center mx-auto">
            Bộ Sưu Tập Thổ Cẩm Jrai (57 Mẫu)
          </h1>

          <p className="text-[#59524C] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-center">
            Mỗi sản phẩm đều được dệt thủ công bởi các nghệ nhân làng Kép và làng Phung (Ia Mơ Nông, Gia Lai). Khi mua sản phẩm, bạn nhận kèm một mã định danh số QR giúp tra cứu tên thợ dệt, thời gian hoàn thành và ý nghĩa hoa văn truyền thừa.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[#59524C]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E2D9] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#1E4D38]"></span>
              100% Sợi Bông Kơpăh Tự Nhiên
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E2D9] shadow-xs">
              <QrCode className="w-3.5 h-3.5 text-[#1E4D38]" /> Mã QR Định Danh Độc Bản
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E2D9] shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#6E4C38]" /> 40h – 200h Dệt Cửi Hông
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E2D9] text-[#1E4D38] shadow-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D38]" /> Miễn Phí Giao Hàng Từ 500k
            </span>
          </div>
        </div>
      </div>

      {/* 2. BỘ LỌC KHOA HỌC */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-5">
        {/* Category Filter Chips Bar */}
        <div className="text-center space-y-3">
          <div className="text-xs font-bold text-[#6E4C38] uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#1E4D38]" />
            <span>LỌC THEO PHÂN LOẠI SẢN PHẨM:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.filterKey;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.filterKey)}
                  type="button"
                  className={`px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#1E4D38] text-white shadow-xs scale-[1.02]'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#2C2623] hover:text-[#1E4D38] border border-[#E8E2D9] hover:border-[#1E4D38]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F5F1E8] text-[#6E4C38]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Row: Search, Artisan, Price Range, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-[#E8E2D9]">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A7E72]" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã (V001, K001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#1E4D38] focus:bg-white transition-colors"
            />
          </div>

          {/* Filter by Artisan */}
          <div>
            <select
              value={selectedArtisan}
              onChange={(e) => setSelectedArtisan(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm text-[#1F1D1B] focus:outline-none focus:border-[#1E4D38] focus:bg-white transition-colors cursor-pointer"
            >
              <option value="all">Tất cả nghệ nhân dệt</option>
              {artisans.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.village || 'Ia Mơ Nông'})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Price Range */}
          <div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm text-[#1F1D1B] focus:outline-none focus:border-[#1E4D38] focus:bg-white transition-colors cursor-pointer"
            >
              <option value="all">Mọi khoảng giá</option>
              <option value="under300">Dưới 300.000₫</option>
              <option value="300to500">Từ 300.000₫ - 500.000₫</option>
              <option value="500to1m">Từ 500.000₫ - 1.000.000₫</option>
              <option value="over1m">Trên 1.000.000₫</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm text-[#1F1D1B] focus:outline-none focus:border-[#1E4D38] focus:bg-white font-semibold transition-colors cursor-pointer"
            >
              <option value="featured">Sắp xếp: Nổi bật nhất</option>
              <option value="priceAsc">Giá: Thấp đến Cao</option>
              <option value="priceDesc">Giá: Cao đến Thấp</option>
              <option value="newest">Sản phẩm mới nhất</option>
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-[#59524C] pt-2 border-t border-[#E8E2D9] gap-2">
          <span>
            Đang hiển thị <strong className="text-[#1E4D38] font-bold">{filteredProducts.length}</strong> / {products.length} tác phẩm thổ cẩm
          </span>
          {(searchTerm || selectedCategory !== 'all' || selectedArtisan !== 'all' || priceRange !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedArtisan('all');
                setPriceRange('all');
              }}
              className="text-[#C43B3D] hover:underline font-bold text-xs cursor-pointer"
            >
              Xóa tất cả bộ lọc &times;
            </button>
          )}
        </div>
      </div>

      {/* 3. LƯỚI SẢN PHẨM: ĐÚNG 3 SẢN PHẨM/HÀNG TRÊN DESKTOP, 2 TRÊN TABLET, 1 TRÊN MOBILE */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-14 rounded-2xl border border-[#E8E2D9] text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto text-[#1E4D38] border border-[#E8E2D9]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F1D1B]">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-sm text-[#59524C] max-w-md mx-auto">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc bấm nút xóa bộ lọc để hiển thị toàn bộ 57 sản phẩm.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedArtisan('all');
              setPriceRange('all');
            }}
            className="bg-[#1E4D38] hover:bg-[#143527] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            Xem tất cả 57 sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
          {filteredProducts.map((p) => {
            const inWish = isInWishlist(p.id);
            return (
              <div
                key={p.id}
                className="group bg-white rounded-2xl border border-[#E8E2D9] hover:border-[#1E4D38] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(30,77,56,0.12)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* 1. Large Aspect Image & Overlays */}
                <Link
                  href={`/product/${p.id}`}
                  className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden block cursor-pointer group/thumb"
                  title={`Xem chi tiết sản phẩm ${p.name}`}
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-Left Category & Code */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                    <span className="bg-[#1E4D38] text-white text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md shadow-xs">
                      {p.category_name}
                    </span>
                    <span className="bg-white/95 text-[#6E4C38] text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#E8E2D9] shadow-xs">
                      {p.product_code}
                    </span>
                  </div>

                  {/* Top-Right Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#59524C] hover:text-[#C43B3D] shadow-xs transition border border-[#E8E2D9] z-10 cursor-pointer"
                    title={inWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-[#C43B3D] text-[#C43B3D]' : ''}`} />
                  </button>

                  {/* Bottom Image Badge Bar */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-[#3E3834] flex items-center justify-between border border-[#E8E2D9] shadow-xs">
                    <span className="flex items-center gap-1 text-[#6E4C38] font-semibold text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#1E4D38]" />
                      <span>{p.production_time || 'Dệt tay'}</span>
                    </span>
                    <span className="text-[11px] text-[#1F1D1B] truncate max-w-[140px] font-bold">
                      {p.artisan_name || 'Làng Kép'}
                    </span>
                  </div>
                </Link>

                {/* 2. Card Content & Title */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <Link href={`/product/${p.id}`} className="block group/link cursor-pointer">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F1D1B] group-hover/link:text-[#1E4D38] transition-colors line-clamp-1 leading-snug">
                        {p.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#59524C] mt-2 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </Link>
                  </div>

                  {/* 3. Card Footer: Price & Direct Actions */}
                  <div className="pt-3.5 border-t border-[#E8E2D9] space-y-3">
                    {/* Price Row */}
                    <div className="flex items-baseline justify-between">
                      <div className="text-xl sm:text-2xl font-black text-[#C43B3D] font-serif">
                        {p.price.toLocaleString('vi-VN')}₫
                      </div>
                      {p.original_price && p.original_price > p.price && (
                        <div className="text-xs sm:text-sm text-stone-400 line-through">
                          {p.original_price.toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/product/${p.id}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#1F1D1B] text-xs sm:text-sm font-bold border border-[#E8E2D9] flex items-center justify-center transition"
                        title="Xem chi tiết sản phẩm"
                      >
                        Chi tiết
                      </Link>

                      <button
                        onClick={(e) => handleAddToCart(p, e)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#1E4D38] hover:bg-[#143527] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Thêm giỏ</span>
                      </button>

                      <Link
                        href={`/traceability?code=${p.product_code}`}
                        className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#1E4D38] border border-[#E8E2D9] transition shrink-0"
                        title="Xem mã QR tem mác"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] py-20 text-center text-[#59524C]">Đang tải danh sách 57 sản phẩm thổ cẩm...</div>}>
      <ProductsContent />
    </React.Suspense>
  );
}
