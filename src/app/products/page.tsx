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

const CATEGORIES = [
  { id: 'all', name: 'Tất cả (57)', filterKey: 'all' },
  { id: 'scarf', name: 'Khăn quàng cổ (28)', filterKey: 'scarf' },
  { id: 'crossbag', name: 'Túi đeo chéo (9)', filterKey: 'crossbag' },
  { id: 'wallet', name: 'Ví cầm tay (7)', filterKey: 'wallet' },
  { id: 'apron', name: 'Tạp dề (5)', filterKey: 'apron' },
  { id: 'tote', name: 'Túi tote (3)', filterKey: 'tote' },
  { id: 'dress', name: 'Váy nữ (2)', filterKey: 'dress' },
  { id: 'shirt', name: 'Áo nam (2)', filterKey: 'shirt' },
  { id: 'gourd', name: 'Bầu nước (1)', filterKey: 'gourd' },
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
    addToCart(p, 1);
    setAddedNotice(`Đã thêm "${p.name}" vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0; // default featured
    });
  }, [products, searchTerm, selectedCategory, selectedArtisan, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#B9383A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-bold">{addedNotice}</span>
          <Link href="/cart" className="text-xs underline font-bold ml-2 text-amber-200">
            Xem giỏ hàng &rarr;
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-10 rounded-3xl border border-amber-900/40 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full border border-amber-500/40 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Thổ Cẩm Bản Địa Độc Bản</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#FFFDF9]">
            Bộ Sưu Tập Thổ Cẩm Jrai Ứng Dụng (57 Mẫu)
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Mỗi sản phẩm đều được dệt thủ công bởi các nghệ nhân làng Kép và làng Phung (Ia Mơ Nông, Gia Lai). Khi mua sản phẩm, bạn nhận kèm một mã QR độc bản giúp tra cứu người dệt, số giờ công và ý nghĩa hoa văn truyền thừa.
          </p>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY PILLS */}
      <div className="bg-[#1C1714] p-6 rounded-3xl border border-amber-900/40 shadow-xl space-y-6">
        {/* Category Pills (8 Categories) */}
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>Lọc theo danh mục sản phẩm:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.filterKey;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.filterKey)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                    isActive
                      ? 'bg-[#B9383A] text-white border border-amber-400 shadow-red-900/40'
                      : 'bg-[#251E1A] text-stone-300 hover:text-white hover:bg-[#322722] border border-amber-900/40'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Row: Search, Artisan, Price Range, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-800">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã (K001, B001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#120F0D] border border-amber-900/40 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Filter by Artisan */}
          <div>
            <select
              value={selectedArtisan}
              onChange={(e) => setSelectedArtisan(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-[#120F0D] border border-amber-900/40 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Tất cả nghệ nhân</option>
              {artisans.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Price Range */}
          <div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-[#120F0D] border border-amber-900/40 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
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
              className="w-full py-2.5 px-3.5 bg-[#120F0D] border border-amber-900/40 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400 font-semibold"
            >
              <option value="featured">Sắp xếp: Nổi bật nhất</option>
              <option value="priceAsc">Giá: Thấp đến Cao</option>
              <option value="priceDesc">Giá: Cao đến Thấp</option>
              <option value="newest">Sản phẩm mới nhất</option>
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/80">
          <span>
            Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm thổ cẩm
          </span>
          {(searchTerm || selectedCategory !== 'all' || selectedArtisan !== 'all' || priceRange !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedArtisan('all');
                setPriceRange('all');
              }}
              className="text-amber-400 hover:underline font-bold"
            >
              Xóa bộ lọc &times;
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#1C1714] p-16 rounded-3xl border border-amber-900/40 text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mx-auto text-amber-500 border border-stone-800">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-white">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc bấm nút xóa bộ lọc để hiển thị toàn bộ 57 sản phẩm.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedArtisan('all');
              setPriceRange('all');
            }}
            className="bg-[#B9383A] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow hover:bg-[#A83232] transition"
          >
            Xem tất cả 57 sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const inWish = isInWishlist(p.id);
            return (
              <div
                key={p.id}
                className="group bg-[#231C18] rounded-2xl border border-amber-900/30 hover:border-amber-500/60 overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                {/* Image & Quick Info */}
                <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-[#B9383A] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      {p.category_name}
                    </span>
                    <span className="bg-stone-950/80 backdrop-blur-sm text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/30">
                      {p.product_code}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-stone-950/70 hover:bg-stone-950 text-stone-300 hover:text-red-400 backdrop-blur-sm transition border border-stone-800"
                    title={inWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 bg-stone-950/80 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[11px] text-stone-300 flex items-center justify-between border border-stone-800">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Clock className="w-3 h-3" />
                      <span>{p.production_time}</span>
                    </span>
                    <span className="text-[10px] text-stone-400 truncate max-w-[120px]">
                      {p.artisan_name || 'Làng Kép'}
                    </span>
                  </div>
                </div>

                {/* Info & Buy Action */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <Link href={`/product/${p.id}`}>
                      <h3 className="font-serif font-bold text-sm text-[#F4EFEB] group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-amber-400">
                        {p.price.toLocaleString('vi-VN')}₫
                      </div>
                      {p.original_price && p.original_price > p.price && (
                        <div className="text-[11px] text-stone-500 line-through">
                          {p.original_price.toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/traceability?code=${p.product_code}`}
                        className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-900/40 transition"
                        title="Xem mã QR truy xuất"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={(e) => handleAddToCart(p, e)}
                        className="p-2 rounded-xl bg-[#B9383A] hover:bg-[#A83232] text-white shadow transition flex items-center gap-1"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingBag className="w-4 h-4" />
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
