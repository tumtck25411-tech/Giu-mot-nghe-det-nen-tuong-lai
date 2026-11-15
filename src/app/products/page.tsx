'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Clock,
  MapPin,
  ChevronRight,
  QrCode,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  ArrowUpDown,
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

// Danh mục sản phẩm kế thừa định chuẩn Dệt Nên Tương Lai & Tứ Quý Garden
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
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

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
        // Search
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.product_code.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          (p.artisan_name && p.artisan_name.toLowerCase().includes(q)) ||
          (p.motif_name && p.motif_name.toLowerCase().includes(q));

        // Category
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category === selectedCategory ||
          (selectedCategory === 'dress' && p.category.includes('dress')) ||
          (selectedCategory === 'scarf' && p.category.includes('scarf'));

        // Artisan
        const matchesArtisan =
          selectedArtisan === 'all' ||
          p.artisan_id === selectedArtisan ||
          p.artisan_name?.includes(selectedArtisan);

        // Price Range
        let matchesPrice = true;
        if (priceRange === 'under300') {
          matchesPrice = p.price < 300000;
        } else if (priceRange === '300to500') {
          matchesPrice = p.price >= 300000 && p.price <= 500000;
        } else if (priceRange === '500to1m') {
          matchesPrice = p.price > 500000 && p.price <= 1000000;
        } else if (priceRange === 'over1m') {
          matchesPrice = p.price > 1000000;
        }

        return matchesSearch && matchesCategory && matchesArtisan && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0; // default featured
      });
  }, [products, searchTerm, selectedCategory, selectedArtisan, priceRange, sortBy]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C43B3D] text-white px-5 py-3.5 rounded-lg shadow-lg border border-amber-300/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-amber-200 shrink-0" />
          <span className="text-sm font-bold">{addedNotice}</span>
          <Link href="/cart" className="text-xs underline font-bold ml-2 text-amber-100 hover:text-white">
            Xem giỏ hàng &rarr;
          </Link>
        </div>
      )}

      {/* 1. HERO HEADER: TONE SÁNG BE SOLID ĐẶC TRƯNG GIỮ MỘT NGHỀ - Centered Flex & Text */}
      <div className="bg-[#F2ECE1] border-b-2 border-[#EA8E23] p-8 sm:p-14 rounded-xl shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center header-banner-box">
        <div className="max-w-4xl mx-auto space-y-3.5 relative z-10 flex flex-col items-center justify-center text-center w-full">
          <div className="inline-flex items-center justify-center gap-2 bg-[#C43B3D]/10 text-[#C43B3D] text-xs font-black px-4 py-1.5 rounded-full border border-[#C43B3D]/30 uppercase tracking-wider mx-auto">
            <Sparkles className="w-4 h-4 text-[#C43B3D]" />
            <span>THỦ CÔNG BẢN ĐỊA ĐỘC BẢN • JRAI ƠI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] tracking-tight leading-tight text-center mx-auto">
            Bộ Sưu Tập Thổ Cẩm Jrai Ứng Dụng (57 Mẫu)
          </h1>

          <p className="text-[#5D554D] text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-center">
            Mỗi sản phẩm đều được dệt thủ công bởi các nghệ nhân làng Kép và làng Phung (Ia Mơ Nông, Gia Lai). Khi mua sản phẩm, bạn nhận kèm một mã định danh số QR giúp tra cứu tên thợ dệt, thời gian hoàn thành và ý nghĩa hoa văn truyền thừa.
          </p>

          {/* Quick Commitments Badges */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-2 text-xs font-semibold text-[#5D554D]">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E5DACB] text-[#1F1D1B] shadow-xs">
              <Check className="w-3.5 h-3.5 text-[#C43B3D]" /> 100% Sợi Bông Kơpăh Tự Nhiên
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E5DACB] text-[#1F1D1B] shadow-xs">
              <QrCode className="w-3.5 h-3.5 text-[#EA8E23]" /> Mã QR Định Danh Độc Bản
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E5DACB] text-[#1F1D1B] shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#EA8E23]" /> 40h – 200h Dệt Cửi Hông
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E5DACB] text-[#3D7535] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D7535]" /> Miễn Phí Giao Hàng Từ 500k
            </span>
          </div>
        </div>
      </div>

      {/* 2. BỘ LỌC KHOA HỌC THEO FORM GIỮ MỘT NGHỀ */}
      <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E5DACB] shadow-sm space-y-5">
        {/* Category Filter Pills Bar */}
        <div className="text-center space-y-3.5">
          <div className="text-xs font-bold text-[#8A7E72] uppercase tracking-wider flex items-center justify-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#C43B3D]" />
            <span>LỌC THEO DANH MỤC SẢN PHẨM:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.filterKey;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.filterKey)}
                  type="button"
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C43B3D] to-[#A3292B] text-white border-2 border-[#8A2325] shadow-md shadow-red-950/20 scale-[1.02]'
                      : 'bg-white hover:bg-[#FFF6F5] text-[#2B221D] hover:text-[#C43B3D] border-2 border-[#D9CBB8] hover:border-[#C43B3D] hover:-translate-y-0.5 shadow-xs'
                  }`}
                >
                  <span className="tracking-wide">{cat.name}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-extrabold transition-colors ${
                      isActive
                        ? 'bg-white/25 text-white shadow-inner'
                        : 'bg-[#F2ECE1] text-[#7A4B29] border border-[#E5DACB]'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-[#E5DACB]">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A7E72]" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã (V001, K001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FBF8F3] border border-[#E5DACB] rounded-lg text-sm text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
            />
          </div>

          {/* Filter by Artisan */}
          <div>
            <select
              value={selectedArtisan}
              onChange={(e) => setSelectedArtisan(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FBF8F3] border border-[#E5DACB] rounded-lg text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
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
              className="w-full py-2.5 px-3 bg-[#FBF8F3] border border-[#E5DACB] rounded-lg text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
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
              className="w-full py-2.5 px-3 bg-[#FBF8F3] border border-[#E5DACB] rounded-lg text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white font-semibold"
            >
              <option value="featured">Sắp xếp: Nổi bật nhất</option>
              <option value="priceAsc">Giá: Thấp đến Cao</option>
              <option value="priceDesc">Giá: Cao đến Thấp</option>
              <option value="newest">Sản phẩm mới nhất</option>
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex flex-wrap items-center justify-between text-sm text-[#5D554D] pt-2 border-t border-[#E5DACB]/80 gap-2">
          <span>
            Đang hiển thị <strong className="text-[#C43B3D] font-bold">{filteredProducts.length}</strong> / {products.length} tác phẩm thổ cẩm
          </span>
          {(searchTerm || selectedCategory !== 'all' || selectedArtisan !== 'all' || priceRange !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedArtisan('all');
                setPriceRange('all');
              }}
              className="text-[#C43B3D] hover:underline font-bold text-xs"
            >
              Xóa tất cả bộ lọc &times;
            </button>
          )}
        </div>
      </div>

      {/* 3. LƯỚI SẢN PHẨM RỘNG RÃI, THẺ TRẮNG THANH LỊCH CHUẨN GIỮ MỘT NGHỀ */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-14 rounded-xl border border-[#E5DACB] text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#F2ECE1] flex items-center justify-center mx-auto text-[#C43B3D] border border-[#E5DACB]">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F1D1B]">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-sm text-[#5D554D] max-w-md mx-auto">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc bấm nút xóa bộ lọc để hiển thị toàn bộ 57 sản phẩm.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedArtisan('all');
              setPriceRange('all');
            }}
            className="bg-[#C43B3D] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#8A2325] transition"
          >
            Xem tất cả 57 sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((p) => {
            const inWish = isInWishlist(p.id);
            return (
              <div
                key={p.id}
                className="group bg-white hover:bg-white rounded-xl border border-[#E5DACB] hover:border-[#C43B3D] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* 1. Large Aspect Image & Overlays */}
                <Link
                  href={`/product/${p.id}`}
                  className="relative aspect-[4/3] bg-[#F2ECE1] overflow-hidden block cursor-pointer group/thumb"
                  title={`Xem chi tiết sản phẩm ${p.name}`}
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-Left Category & Product Code Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                    <span className="bg-[#C43B3D] text-white text-xs font-bold uppercase px-2.5 py-0.5 rounded shadow-sm">
                      {p.category_name}
                    </span>
                    <span className="bg-black/75 backdrop-blur-sm text-amber-300 text-xs font-mono px-2 py-0.5 rounded border border-amber-500/30">
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
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/85 hover:bg-white text-stone-600 hover:text-red-500 shadow-sm transition border border-stone-200 z-10"
                    title={inWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Bottom Image Overlay Bar */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2.5 py-1.5 text-xs text-stone-200 flex items-center justify-between border border-white/10">
                    <span className="flex items-center gap-1 text-amber-300 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{p.production_time || 'Dệt tay'}</span>
                    </span>
                    <span className="text-xs text-stone-200 truncate max-w-[130px] font-medium">
                      {p.artisan_name || 'Làng Kép'}
                    </span>
                  </div>
                </Link>

                {/* 2. Card Content & Title */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <Link href={`/product/${p.id}`} className="block group/link cursor-pointer">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F1D1B] group-hover/link:text-[#C43B3D] transition-colors line-clamp-2 leading-snug">
                        {p.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5D554D] mt-2 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </Link>
                  </div>

                  {/* 3. Card Footer: Price & Direct Actions */}
                  <div className="pt-3 border-t border-[#E5DACB] space-y-3">
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
                        className="flex-1 py-2.5 px-3 rounded-lg bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-1.5 transition"
                        title="Xem chi tiết & Mua ngay"
                      >
                        <ShoppingBag className="w-4 h-4 text-amber-200 shrink-0" />
                        <span>Xem chi tiết & Mua</span>
                      </Link>

                      <Link
                        href={`/traceability?code=${p.product_code}`}
                        className="p-2.5 rounded-lg bg-[#FBF8F3] hover:bg-[#F2ECE1] text-[#C43B3D] border border-[#E5DACB] transition shrink-0"
                        title="Xem mã QR độc bản"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={(e) => handleAddToCart(p, e)}
                        className="p-2.5 rounded-lg bg-[#FBF8F3] hover:bg-[#C43B3D] text-[#1F1D1B] hover:text-white border border-[#E5DACB] transition shrink-0 font-black text-sm"
                        title="Thêm nhanh vào giỏ hàng"
                      >
                        +
                      </button>
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
    <React.Suspense fallback={<div className="min-h-screen bg-[#14110F] py-20 text-center text-stone-400">Đang tải danh sách 57 sản phẩm thổ cẩm...</div>}>
      <ProductsContent />
    </React.Suspense>
  );
}
