'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  QrCode,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getCartTotal, getProducts, getArtisans, getMotifs, getCustomerSession } from '@/lib/data-store';
import { Product, Artisan, Motif, CustomerUser } from '@/types';

// NAV ITEMS INCLUDING NEW BESPOKE AI STUDIO FEATURE
const NAV_ITEMS = [
  { label: 'TRANG CHỦ', href: '/' },
  { label: 'SẢN PHẨM', href: '/products' },
  { label: 'ĐẶT THEO YÊU CẦU', href: '/custom-order', badge: 'AI Studio' },
  { label: 'NGÂN HÀNG HOA VĂN', href: '/motifs', badge: 'Central' },
  { label: 'NGHỆ NHÂN', href: '/artisans' },
  { label: 'TRA CỨU QR', href: '/traceability' },
  { label: 'VỀ CHÚNG TÔI', href: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [matchingArtisans, setMatchingArtisans] = useState<Artisan[]>([]);
  const [matchingMotifs, setMatchingMotifs] = useState<Motif[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Update cart badge and customer session
  const updateHeaderState = () => {
    try {
      const { count } = getCartTotal();
      setCartCount(count);
      setCustomer(getCustomerSession());
    } catch (_) {}
  };

  useEffect(() => {
    updateHeaderState();
    window.addEventListener('jrai_store_updated', updateHeaderState);
    window.addEventListener('jrai_cart_updated', updateHeaderState);
    return () => {
      window.removeEventListener('jrai_store_updated', updateHeaderState);
      window.removeEventListener('jrai_cart_updated', updateHeaderState);
    };
  }, []);

  // Handle Search Input & Filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchingProducts([]);
      setMatchingArtisans([]);
      setMatchingMotifs([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const allProds = getProducts(true);
    const allArts = getArtisans();
    const allMots = getMotifs(true);

    const prods = allProds
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.product_code.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          (p.artisan_name && p.artisan_name.toLowerCase().includes(q))
      )
      .slice(0, 4);

    const arts = allArts
      .filter((a) => a.name.toLowerCase().includes(q) || a.village.toLowerCase().includes(q))
      .slice(0, 2);

    const mots = allMots
      .filter((m) => m.name.toLowerCase().includes(q) || m.motif_code.toLowerCase().includes(q))
      .slice(0, 2);

    setMatchingProducts(prods);
    setMatchingArtisans(arts);
    setMatchingMotifs(mots);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // If on admin pages, hide customer header
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#1A1412]/95 backdrop-blur-md border-b border-[#3D2C1F] text-[#F4EFEB] shadow-lg transition-all">
        {/* Top Heritage Notice Bar - Preserving exact detnentuonglai wording */}
        <div className="bg-gradient-to-r from-[#8B2522] via-[#231C18] to-[#8B2522] py-2 px-4 text-center text-xs font-semibold text-[#FDE68A] border-b border-[#B9383A]/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>✨ Đây là dự án được thực hiện bởi nhóm sinh viên Trường Đại học Kinh tế - Luật, ĐHQG-HCM • SVTHM 2026</span>
            </span>
            <span className="mx-auto sm:mx-0 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>JRAI ƠI — “Giữ một nghề, dệt nên tương lai.”</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-2 text-stone-300">
              <span className="bg-[#B9383A]/60 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">100% QR Độc Bản</span>
            </span>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo DỆT NÊN TƯƠNG LAI & JRAI ƠI */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B9383A] via-[#8B2522] to-[#231C18] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-[#181411] rounded-[10px] flex items-center justify-center border border-[#E58A1F]/50">
                  <span className="font-serif font-black text-[#F59E0B] text-2xl tracking-tighter">J</span>
                </div>
              </div>
              <div>
                <div className="font-serif font-black text-xl sm:text-2xl tracking-wider text-[#FFFDF9] group-hover:text-[#F59E0B] transition-colors leading-none flex items-center gap-2">
                  <span>DỆT NÊN TƯƠNG LAI</span>
                  <span className="text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded bg-[#8B2522] text-[#FDE68A] tracking-normal border border-amber-400/40">
                    JRAI ƠI
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] tracking-widest text-[#E58A1F] uppercase font-bold mt-1">
                  DI SẢN THỔ CẨM JRAI • UEL - ĐHQG-HCM
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - STRICTLY 6 ITEMS WITH Central BADGE */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-[13px] font-bold tracking-wide transition-all inline-flex items-center ${
                      isActive
                        ? 'bg-[#B9383A] text-white shadow-md border border-[#E58A1F]/60'
                        : 'text-stone-300 hover:text-[#F59E0B] hover:bg-[#2A201A]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-sm leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions: Search, Account, Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl bg-[#231C18] text-stone-300 hover:text-white hover:bg-[#3D2C1F] border border-amber-900/40 transition shadow-sm flex items-center gap-1.5"
                title="Tìm kiếm sản phẩm"
                aria-label="Tìm kiếm sản phẩm"
              >
                <Search className="w-4 h-4 text-[#E58A1F]" />
                <span className="hidden md:inline text-xs font-medium text-stone-300">Tìm kiếm...</span>
              </button>

              {/* Account Button */}
              <Link
                href="/account"
                className="p-2 sm:p-2.5 rounded-xl bg-[#231C18] text-stone-300 hover:text-white hover:bg-[#3D2C1F] border border-amber-900/40 transition shadow-sm flex items-center gap-2"
                title={customer ? `Tài khoản: ${customer.name}` : 'Tài khoản khách hàng'}
              >
                {customer?.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-500 shrink-0"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#E58A1F]" />
                )}
                <span className="hidden xl:inline text-xs font-semibold text-stone-200">
                  {customer ? customer.name.split(' ').slice(-1)[0] : 'Tài khoản'}
                </span>
              </Link>


              {/* Cart Button with Live Badge */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-[#B9383A] to-[#8B2522] hover:from-[#A83232] hover:to-[#7A1F1C] text-white border border-[#E58A1F]/40 transition shadow-md flex items-center gap-2 group"
                title="Giỏ hàng JRAI ƠI"
              >
                <ShoppingBag className="w-4 h-4 text-[#FDE68A] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-bold text-amber-50">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-[#E58A1F] text-stone-950 shadow">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-[#231C18] text-amber-200 hover:text-white border border-amber-900/50 transition"
                aria-label="Mở menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#181411] border-b border-amber-900/50 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
            <div className="p-3 bg-[#2A1E17] rounded-xl border border-amber-800/40 mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-200 font-bold">JRAI ƠI — Thổ cẩm Gia Lai</p>
                <p className="text-[11px] text-stone-400">“Giữ một nghề, dệt nên tương lai.”</p>
              </div>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs bg-[#B9383A] text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Giỏ: {cartCount}</span>
              </Link>
            </div>

            {/* Quick Search on Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm khăn, túi, ví, nghệ nhân..."
                className="w-full bg-[#231C18] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E58A1F]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-amber-400"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* STRICTLY 6 NAV ITEMS */}
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-[#B9383A] text-white border border-[#E58A1F]/50'
                        : 'text-stone-300 hover:bg-[#231C18] hover:text-amber-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-800 grid grid-cols-2 gap-2">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-[#231C18] hover:bg-[#2A201A] text-amber-200 text-xs font-bold py-2.5 px-3 rounded-xl border border-amber-900/40"
              >
                <User className="w-3.5 h-3.5" />
                <span>Tài Khoản</span>
              </Link>
              <Link
                href="/traceability"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-[#8B2522] hover:bg-[#A83232] text-white text-xs font-bold py-2.5 px-3 rounded-xl border border-amber-500/40"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Tra Cứu QR</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Realtime Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#1C1714] border border-amber-900/50 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative border-b border-stone-800 p-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-amber-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên sản phẩm (Khăn, Túi, Ví...), mã số (K001, B001), hoặc nghệ nhân..."
                className="w-full bg-transparent text-base sm:text-lg text-white placeholder-stone-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 rounded-lg"
              >
                Đóng
              </button>
            </form>

            {/* Results Preview */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {searchQuery.trim() === '' ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-3">
                    Gợi ý tìm kiếm phổ biến
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Khăn quàng cổ', 'Bầu nước B001', 'Ví cầm tay', 'Túi tote', 'Nghệ nhân Rơ châm Nghị', 'Hoa văn con gà'].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSearchQuery(item)}
                          className="text-xs bg-[#2A201A] hover:bg-[#B9383A] text-amber-200 hover:text-white px-3 py-1.5 rounded-full border border-amber-900/40 transition"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : matchingProducts.length === 0 && matchingArtisans.length === 0 && matchingMotifs.length === 0 ? (
                <div className="py-8 text-center text-stone-400">
                  <p className="text-sm">Không tìm thấy kết quả phù hợp cho &quot;{searchQuery}&quot;.</p>
                  <p className="text-xs text-stone-500 mt-1">Vui lòng thử từ khóa khác như &quot;Khăn&quot;, &quot;Ví&quot;, &quot;Túi&quot; hoặc mã sản phẩm.</p>
                </div>
              ) : (
                <>
                  {matchingProducts.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                        <span>Sản phẩm ({matchingProducts.length})</span>
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="hover:underline flex items-center gap-1 text-[11px]"
                        >
                          Xem tất cả <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={`/product/${p.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#231C18] hover:bg-[#2E241E] border border-amber-900/30 transition group"
                          >
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-lg border border-stone-800"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-amber-400 truncate">
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-amber-500">
                                  {p.price.toLocaleString('vi-VN')}₫
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">
                                  {p.product_code}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingArtisans.length > 0 && (
                    <div className="pt-2 border-t border-stone-800">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                        Nghệ nhân
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingArtisans.map((a) => (
                          <Link
                            key={a.id}
                            href={`/artisan/${a.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl bg-[#231C18] hover:bg-[#2E241E] border border-amber-900/30 transition"
                          >
                            <img
                              src={a.avatar || a.image_url}
                              alt={a.name}
                              className="w-10 h-10 object-cover rounded-full border border-amber-700/50"
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{a.name}</p>
                              <p className="text-[11px] text-stone-400">{a.village}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingMotifs.length > 0 && (
                    <div className="pt-2 border-t border-stone-800">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                        Hoa văn di sản
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingMotifs.map((m) => (
                          <Link
                            key={m.id}
                            href={`/motif/${m.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl bg-[#231C18] hover:bg-[#2E241E] border border-amber-900/30 transition"
                          >
                            <img
                              src={m.image_url}
                              alt={m.name}
                              className="w-10 h-10 object-contain rounded-lg bg-stone-900 p-1 border border-stone-800"
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{m.name}</p>
                              <p className="text-[11px] text-amber-500/80">{m.motif_code}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer action in search */}
            <div className="p-3 bg-[#15110E] border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Bấm Enter để xem toàn bộ kết quả sản phẩm</span>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-amber-400 font-bold hover:underline"
              >
                Xem tất cả kết quả &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
