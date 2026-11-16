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
  CheckCircle2,
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
    setTimeout(() => setAddedNotice(null), 3000);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all') {
          if (p.category !== selectedCategory) return false;
        }

        if (selectedArtisan !== 'all') {
          if (p.artisan_id !== selectedArtisan && p.artisan_name !== selectedArtisan) {
            return false;
          }
        }

        if (priceRange === 'under300' && p.price >= 300000) return false;
        if (priceRange === '300to500' && (p.price < 300000 || p.price > 500000)) return false;
        if (priceRange === '500to1m' && (p.price < 500000 || p.price > 1000000)) return false;
        if (priceRange === 'over1m' && p.price <= 1000000) return false;

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
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedArtisan, priceRange, searchTerm, sortBy]);

  return (
    <div
      className="w-full min-h-screen py-10 lg:py-14 relative overflow-hidden"
      style={{
        backgroundColor: '#FAF7F2',
        backgroundImage: "url('/images/custom/texture_paper_cotton.jpg')",
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Decorative Brocade Diamond Watermarks on Top Corners */}
      <div
        className="absolute top-0 left-0 w-64 sm:w-80 h-32 pointer-events-none opacity-20 bg-contain bg-no-repeat bg-top-left"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_left.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-64 sm:w-80 h-32 pointer-events-none opacity-20 bg-contain bg-no-repeat bg-top-right"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_right.png')" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        
        {/* Toast Notification */}
        {addedNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#174C38] text-[#FFFDF9] px-6 py-4 rounded-2xl shadow-xl border border-[#C99A45] flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
            <CheckCircle2 className="w-5 h-5 text-[#C99A45] shrink-0" />
            <div className="text-sm font-medium">{addedNotice}</div>
          </div>
        )}

        {/* 1. Header Banner - Modern Ethnic Boutique */}
        <div className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] shadow-xs text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8] text-xs font-medium text-[#C99A45]">
            <span>◇</span>
            <span>Bộ Sưu Tập 57 Tác Phẩm Dệt Cửi Hông</span>
            <span>◇</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#174C38] tracking-tight">
            Sản phẩm thổ cẩm Jrai
          </h1>

          <p className="text-[#59524C] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            100% tác phẩm dệt thủ công bởi các nghệ nhân làng Kép và làng Phung (Ia Mơ Nông, Gia Lai). Khi mua sản phẩm, bạn nhận kèm mã định danh số QR giúp tra cứu tên thợ dệt, thời gian hoàn thành và ý nghĩa hoa văn.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-[#59524C]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#174C38]"></span>
              100% bông Kơpăh tự nhiên
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8]">
              <QrCode className="w-3 h-3 text-[#174C38]" /> Mã QR định danh độc bản
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8]">
              <Clock className="w-3 h-3 text-[#C99A45]" /> 40h – 200h dệt cửi hông
            </span>
          </div>
        </div>

        {/* 2. BỘ LỌC KHOA HỌC */}
        <div className="bg-[#FFFDF9] p-5 sm:p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          {/* Category Filter Chips Bar */}
          <div className="text-center space-y-2.5">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.filterKey;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.filterKey)}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#174C38] text-[#FFFDF9] shadow-xs'
                        : 'bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#59524C] hover:text-[#174C38] border border-[#E8DFC8]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-[#FFFDF9]'
                          : 'bg-[#E8DFC8] text-[#59524C]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#E8DFC8]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8A7E72]" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9]"
              />
            </div>

            <div>
              <select
                value={selectedArtisan}
                onChange={(e) => setSelectedArtisan(e.target.value)}
                className="w-full py-2 px-3 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9] cursor-pointer"
              >
                <option value="all">Tất cả nghệ nhân dệt</option>
                {artisans.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.village || 'Ia Mơ Nông'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full py-2 px-3 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9] cursor-pointer"
              >
                <option value="all">Mọi khoảng giá</option>
                <option value="under300">Dưới 300.000₫</option>
                <option value="300to500">Từ 300.000₫ - 500.000₫</option>
                <option value="500to1m">Từ 500.000₫ - 1.000.000₫</option>
                <option value="over1m">Trên 1.000.000₫</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 px-3 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9] font-medium cursor-pointer"
              >
                <option value="featured">Sắp xếp: Nổi bật</option>
                <option value="priceAsc">Giá: Thấp đến Cao</option>
                <option value="priceDesc">Giá: Cao đến Thấp</option>
                <option value="newest">Sản phẩm mới nhất</option>
              </select>
            </div>
          </div>

          {/* Results summary bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#59524C] pt-2 border-t border-[#E8DFC8]">
            <span>
              Đang hiển thị <strong className="text-[#174C38] font-medium">{filteredProducts.length}</strong> / {products.length} tác phẩm
            </span>
            {(searchTerm || selectedCategory !== 'all' || selectedArtisan !== 'all' || priceRange !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedArtisan('all');
                  setPriceRange('all');
                }}
                className="text-[#A94335] hover:underline font-medium text-xs cursor-pointer"
              >
                Xóa tất cả bộ lọc &times;
              </button>
            )}
          </div>
        </div>

        {/* 3. LƯỚI SẢN PHẨM: 3 TRÊN DESKTOP, 2 TABLET, 1 MOBILE */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FFFDF9] p-12 rounded-2xl border border-[#E8DFC8] text-center space-y-3 shadow-xs">
            <h3 className="text-base font-semibold text-[#174C38]">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-xs text-[#59524C] max-w-md mx-auto">
              Vui lòng thử tìm kiếm với từ khóa khác hoặc bấm nút xóa bộ lọc để hiển thị toàn bộ 57 sản phẩm.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedArtisan('all');
                setPriceRange('all');
              }}
              className="bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] text-xs font-medium px-5 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              Xem tất cả 57 sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((p) => {
              const inWish = isInWishlist(p.id);
              return (
                <div
                  key={p.id}
                  className="group bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] hover:border-[#C99A45] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
                >
                  {/* Aspect Image & Overlays */}
                  <Link
                    href={`/product/${p.id}`}
                    className="relative aspect-[4/3] bg-[#FAF5EC] overflow-hidden block cursor-pointer group/thumb"
                    title={`Xem chi tiết sản phẩm ${p.name}`}
                  >
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Top-Left Category & Code */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                      <span className="bg-[#174C38] text-[#FFFDF9] text-[10px] font-medium uppercase px-2 py-0.5 rounded-full shadow-xs">
                        {p.category_name}
                      </span>
                      <span className="bg-[#FFFDF9]/95 text-[#C99A45] text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-[#E8DFC8] shadow-xs">
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
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] text-[#59524C] hover:text-[#A94335] shadow-xs transition border border-[#E8DFC8] z-10 cursor-pointer"
                      title={inWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-[#A94335] text-[#A94335]' : ''}`} />
                    </button>

                    {/* Bottom Image Badge Bar */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#FFFDF9]/95 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs text-[#59524C] flex items-center justify-between border border-[#E8DFC8] shadow-xs">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-[#C99A45]" />
                        <span>{p.production_time || 'Dệt cửi hông'}</span>
                      </span>
                      <span className="text-[11px] text-[#174C38] font-medium">
                        {p.artisan_name || 'Làng Kép'}
                      </span>
                    </div>
                  </Link>

                  {/* Card Content & Title */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <Link href={`/product/${p.id}`} className="block group/link cursor-pointer">
                        <h3 className="font-semibold text-base text-[#174C38] group-hover/link:text-[#C99A45] transition-colors line-clamp-2 min-h-[44px]">
                          {p.name}
                        </h3>
                        <p className="text-xs text-[#59524C] mt-1.5 line-clamp-2 leading-relaxed font-normal">
                          {p.description}
                        </p>
                      </Link>
                    </div>

                    {/* Card Footer: Price & Direct Actions */}
                    <div className="pt-3 border-t border-[#E8DFC8] space-y-2.5">
                      {/* Price Row */}
                      <div className="flex items-baseline justify-between">
                        <div className="text-base sm:text-lg font-semibold text-[#A94335]">
                          {p.price.toLocaleString('vi-VN')}₫
                        </div>
                        {p.original_price && p.original_price > p.price && (
                          <div className="text-xs text-[#8A7E72] line-through">
                            {p.original_price.toLocaleString('vi-VN')}₫
                          </div>
                        )}
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${p.id}`}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] text-xs font-medium border border-[#E8DFC8] flex items-center justify-center transition"
                          title="Xem chi tiết"
                        >
                          Chi tiết
                        </Link>

                        <button
                          onClick={(e) => handleAddToCart(p, e)}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] text-xs font-medium shadow-xs flex items-center justify-center gap-1 transition cursor-pointer"
                          title="Thêm vào giỏ hàng"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C99A45]" />
                          <span>Thêm giỏ</span>
                        </button>

                        <Link
                          href={`/traceability?code=${p.product_code}`}
                          className="p-2 rounded-xl bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] border border-[#E8DFC8] transition shrink-0"
                          title="Xem mã QR tem mác"
                        >
                          <QrCode className="w-3.5 h-3.5" />
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
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF5EC] py-20 text-center text-[#59524C]">Đang tải danh sách 57 sản phẩm thổ cẩm...</div>}>
      <ProductsContent />
    </React.Suspense>
  );
}
