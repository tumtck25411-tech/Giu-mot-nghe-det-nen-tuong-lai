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
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { getCartTotal, getProducts, getArtisans, getMotifs, getCustomerSession } from '@/lib/data-store';
import { Product, Artisan, Motif, CustomerUser } from '@/types';

// SUB-CATEGORIES FOR "SẢN PHẨM" DROPDOWN - CLEAN & MINIMALIST
const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', filterKey: 'all', count: 57, desc: 'Trọn bộ 57 tác phẩm dệt cửi hông độc bản' },
  { id: 'scarf', name: 'Khăn quàng cổ', filterKey: 'scarf', count: 28, desc: 'Bông Kơpăh mềm mại, dải tua rua đặc trưng' },
  { id: 'crossbag', name: 'Túi đeo chéo', filterKey: 'crossbag', count: 9, desc: 'Dệt cửi hông, quai sợi đôi bền chắc' },
  { id: 'wallet', name: 'Ví cầm tay', filterKey: 'wallet', count: 7, desc: 'Đựng điện thoại, thẻ, hoa văn bảo hộ' },
  { id: 'apron', name: 'Tạp dề thổ cẩm', filterKey: 'apron', count: 5, desc: 'Chống bám bụi, túi ngực tiện dụng' },
  { id: 'tote', name: 'Túi tote thổ cẩm', filterKey: 'tote', count: 3, desc: 'Sức chứa rộng rãi đựng vừa laptop' },
  { id: 'dress', name: 'Váy nữ lễ hội', filterKey: 'dress', count: 2, desc: 'Váy quấn nguyên khổ may đo theo eo' },
  { id: 'shirt', name: 'Áo nam truyền thống', filterKey: 'shirt', count: 2, desc: 'Áo cổ tròn xẻ ngực hoa văn hộ thân' },
  { id: 'gourd', name: 'Bầu nước truyền thống', filterKey: 'gourd', count: 1, desc: 'Bầu rừng sáp ong quàng đai thổ cẩm' },
];

const NAV_ITEMS = [
  { label: 'Trang chủ', shortLabel: 'Trang chủ', href: '/' },
  { label: 'Sản phẩm', shortLabel: 'Sản phẩm', href: '/products', hasDropdown: true },
  { label: 'Đặt theo yêu cầu', shortLabel: 'Đặt may riêng', href: '/custom-order' },
  { label: 'Ngân hàng hoa văn', shortLabel: 'Hoa văn', href: '/motifs' },
  { label: 'Nghệ nhân', shortLabel: 'Nghệ nhân', href: '/artisans' },
  { label: 'Tra cứu QR', shortLabel: 'Tra cứu QR', href: '/traceability' },
  { label: 'Về chúng tôi', shortLabel: 'Về chúng tôi', href: '/about' },
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

  // Product Dropdown Menu state
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileProductExpanded, setMobileProductExpanded] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterProduct = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setProductDropdownOpen(true);
  };

  const handleMouseLeaveProduct = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setProductDropdownOpen(false);
    }, 220);
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setProductDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] text-[#1F1D1B] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all overflow-x-clip">
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-[74px] sm:h-[78px]">
            {/* LOGO THƯƠNG HIỆU CHÍNH THỨC JRAI ƠI (CHUẨN KÍCH CỠ TỨ QUÝ GARDEN: 54PX, RÕ NÉT, THOÁNG ĐÃNG) */}
            <Link
              href="/"
              className="flex items-center group shrink-0 py-1 focus:outline-none"
              title="JRAI ƠI — Đồ Thổ Cẩm Bản Địa Tây Nguyên"
            >
              <img
                src="/images/logo/logo-jrai-oi.png"
                alt="JRAI ƠI — Đồ Thổ Cẩm Jrai"
                className="h-[48px] sm:h-[52px] lg:h-[56px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                style={{ height: '54px', maxHeight: '56px', width: 'auto' }}
                loading="eager"
              />
            </Link>

            {/* Desktop Navigation - Tứ Quý Garden Style: Chữ to rõ (15-16px), Title Case, Giãn cách rộng rãi, Gạch chân active xanh */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 2xl:gap-8 shrink-0">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                // Menu "Sản phẩm" có menu sổ xuống (Dropdown Menu)
                if (item.href === '/products') {
                  return (
                    <div
                      key={item.href}
                      className="relative shrink-0"
                      onMouseEnter={handleMouseEnterProduct}
                      onMouseLeave={handleMouseLeaveProduct}
                    >
                      <Link
                        href="/products"
                        onClick={() => setProductDropdownOpen(false)}
                        className={`relative py-2 text-[15px] xl:text-[16px] font-semibold tracking-normal transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap group ${
                          isActive
                            ? 'text-[#1E4D38] font-bold'
                            : 'text-[#243329] hover:text-[#1E4D38]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                            productDropdownOpen ? 'rotate-180 text-[#1E4D38]' : 'text-[#6C7B70] group-hover:text-[#1E4D38]'
                          }`}
                        />
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1E4D38] rounded-full transition-all" />
                        )}
                      </Link>

                      {/* DROPDOWN MENU SỔ XUỐNG CÁC PHÂN LOẠI SẢN PHẨM */}
                      {productDropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 w-[440px] bg-white border border-[#E8E2D9] rounded-2xl shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                          onMouseEnter={handleMouseEnterProduct}
                          onMouseLeave={handleMouseLeaveProduct}
                        >
                          <div className="px-3 py-2 border-b border-[#E8E2D9] flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E4D38]">
                              DANH MỤC THỔ CẨM JRAI
                            </span>
                            <Link
                              href="/products"
                              onClick={() => setProductDropdownOpen(false)}
                              className="text-xs text-[#6E4C38] hover:text-[#1E4D38] flex items-center gap-1 font-bold"
                            >
                              Tất cả 57 mẫu <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 p-2">
                            {PRODUCT_CATEGORIES.map((cat) => (
                              <Link
                                key={cat.id}
                                href={cat.id === 'all' ? '/products' : `/products?category=${cat.filterKey}`}
                                onClick={() => setProductDropdownOpen(false)}
                                className="p-2.5 rounded-xl hover:bg-[#FAF8F5] group transition-all flex flex-col justify-between border border-transparent hover:border-[#E8E2D9]"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-[#1F1D1B] group-hover:text-[#1E4D38] transition-colors truncate">
                                    {cat.name}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold bg-[#F5F1E8] group-hover:bg-[#1E4D38] text-[#6E4C38] group-hover:text-white px-2 py-0.5 rounded-full shrink-0 transition-colors">
                                    {cat.count}
                                  </span>
                                </div>
                                <span className="text-[11px] text-[#7A726A] truncate mt-1">
                                  {cat.desc}
                                </span>
                              </Link>
                            ))}
                          </div>

                          <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] mt-1 flex items-center justify-between text-xs">
                            <span className="text-[#59524C]">Cần may đo theo cỡ & phối màu riêng?</span>
                            <Link
                              href="/custom-order"
                              onClick={() => setProductDropdownOpen(false)}
                              className="text-[#1E4D38] font-bold hover:underline flex items-center gap-1"
                            >
                              Đặt may riêng &rarr;
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-2 text-[15px] xl:text-[16px] font-semibold tracking-normal transition-colors whitespace-nowrap shrink-0 group ${
                      isActive
                        ? 'text-[#1E4D38] font-bold'
                        : 'text-[#243329] hover:text-[#1E4D38]'
                    }`}
                  >
                    <span>
                      <span className="hidden xl:inline">{item.label}</span>
                      <span className="xl:hidden">{item.shortLabel || item.label}</span>
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1E4D38] rounded-full transition-all" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions - Tứ Quý Garden Style: Thanh tìm kiếm bo tròn, Tài khoản, Giỏ hàng có nhãn */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Pill Input (Tứ Quý Garden Style) */}
              <div className="relative hidden xl:block w-44 2xl:w-52">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="w-full bg-[#F4EFEA]/80 hover:bg-[#F0EAE3] focus:bg-white border border-[#E0D7CC] rounded-full pl-3.5 pr-8 py-1.5 text-xs text-[#2D2A26] placeholder-[#8A8177] focus:outline-none focus:border-[#1E4D38] transition-all"
                />
                <button
                  onClick={() => setSearchOpen(true)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-[#1E4D38] transition-colors"
                  title="Tìm kiếm"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mobile / Tablet Search Trigger Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="xl:hidden p-2 rounded-xl bg-[#FAF8F5] text-[#3E3834] hover:text-[#1E4D38] hover:bg-[#F3EFEA] border border-[#E8E2D9] transition shadow-xs flex items-center justify-center cursor-pointer shrink-0"
                title="Tìm kiếm sản phẩm"
                aria-label="Tìm kiếm sản phẩm"
              >
                <Search className="w-4 h-4 text-[#1E4D38] shrink-0" />
              </button>

              {/* Account Button with User Name (Tứ Quý Garden Style) */}
              <Link
                href="/account"
                className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-full hover:bg-[#F3EFEA] text-[#243329] hover:text-[#1E4D38] transition font-semibold text-sm shrink-0"
                title={customer ? `Tài khoản: ${customer.name}` : 'Tài khoản khách hàng'}
              >
                {customer?.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#1E4D38] shrink-0"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#1E4D38] shrink-0" />
                )}
                <span className="hidden sm:inline text-xs font-bold text-[#243329]">
                  {customer ? customer.name.split(' ')[0] : 'Tài khoản'}
                </span>
              </Link>

              {/* Cart Button with Badge + "Cart" Label (Tứ Quý Garden Style) */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-[#F3EFEA] text-[#243329] hover:text-[#1E4D38] transition font-semibold text-sm shrink-0 group cursor-pointer"
                title="Xem giỏ hàng JRAI ƠI"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#1E4D38] group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-amber-400 text-stone-900 text-[10px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-[#243329]">
                  Giỏ hàng
                </span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#3E3834] hover:text-[#1E4D38] hover:bg-[#FAF8F5] lg:hidden transition border border-[#E8E2D9] cursor-pointer shrink-0"
                aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E8E2D9] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-150 shadow-md">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#1E4D38] font-bold">JRAI ƠI — Thổ cẩm Tây Nguyên</p>
                <p className="text-[11px] text-[#7A726A]">Ia Mơ Nông, Chư Păh, Gia Lai</p>
              </div>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs bg-[#1E4D38] hover:bg-[#143527] text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-amber-300" />
                <span>Giỏ: {cartCount}</span>
              </Link>
            </div>

            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                if (item.href === '/products') {
                  return (
                    <div key={item.href} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href="/products"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                            isActive
                              ? 'bg-[#1E4D38] text-white'
                              : 'text-[#1F1D1B] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          SẢN PHẨM
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileProductExpanded(!mobileProductExpanded)}
                          className="p-2.5 text-[#59524C] hover:text-[#1E4D38] cursor-pointer"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              mobileProductExpanded ? 'rotate-180 text-[#1E4D38]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {mobileProductExpanded && (
                        <div className="pl-4 pr-2 py-2 space-y-1 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9]">
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <Link
                              key={cat.id}
                              href={cat.id === 'all' ? '/products' : `/products?category=${cat.filterKey}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#3E3834] hover:text-[#1E4D38] rounded-lg hover:bg-white"
                            >
                              <span>{cat.name}</span>
                              <span className="font-mono text-[10px] text-[#7A726A] bg-white px-2 py-0.5 rounded-full border border-[#E8E2D9]">
                                {cat.count}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-[#1E4D38] text-white'
                        : 'text-[#1F1D1B] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E8E2D9] grid grid-cols-2 gap-2">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-[#FAF8F5] text-[#1F1D1B] text-xs font-bold py-2.5 px-3 rounded-xl border border-[#E8E2D9]"
              >
                <User className="w-3.5 h-3.5 text-[#1E4D38]" />
                <span>Tài Khoản</span>
              </Link>
              <Link
                href="/traceability"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-[#1E4D38] text-white text-xs font-bold py-2.5 px-3 rounded-xl"
              >
                <span>Tra Cứu QR</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Realtime Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white border border-[#E8E2D9] rounded-2xl shadow-2xl overflow-hidden text-[#1F1D1B]">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative border-b border-[#E8E2D9] p-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#1E4D38] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên sản phẩm (Khăn, Túi, Ví...), mã số (K001, B001), hoặc nghệ nhân..."
                className="w-full bg-transparent text-base sm:text-lg text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs bg-[#F5F1E8] hover:bg-[#E8E2D9] text-[#1F1D1B] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Đóng
              </button>
            </form>

            {/* Results Preview */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {searchQuery.trim() === '' ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-[#7A726A] uppercase tracking-wider font-semibold mb-3">
                    Gợi ý tìm kiếm phổ biến
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Khăn quàng cổ', 'Bầu nước B001', 'Ví cầm tay', 'Túi tote', 'Nghệ nhân Rơ Châm Cơm', 'Hoa văn con gà'].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSearchQuery(item)}
                          className="text-xs bg-[#FAF8F5] hover:bg-[#1E4D38] text-[#3E3834] hover:text-white px-3.5 py-1.5 rounded-full border border-[#E8E2D9] transition cursor-pointer"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Matching Products */}
                  {matchingProducts.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1E4D38] uppercase tracking-wider">
                          Sản phẩm ({matchingProducts.length})
                        </span>
                        <Link
                          href={`/products?q=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setSearchOpen(false)}
                          className="text-xs text-[#6E4C38] hover:underline font-bold"
                        >
                          Xem tất cả kết quả &rarr;
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={`/product/${p.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E8E2D9] flex items-center gap-3 transition"
                          >
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-[#E8E2D9]"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1F1D1B] truncate">{p.name}</p>
                              <p className="text-[11px] text-[#7A726A] truncate">
                                Mã: {p.product_code} • {p.price.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Artisans */}
                  {matchingArtisans.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#E8E2D9]">
                      <span className="text-xs font-bold text-[#6E4C38] uppercase tracking-wider">
                        Nghệ nhân ({matchingArtisans.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingArtisans.map((a) => (
                          <Link
                            key={a.id}
                            href={`/artisan/${a.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E8E2D9] flex items-center gap-3 transition"
                          >
                            <img
                              src={a.avatar || a.image_url}
                              alt={a.name}
                              className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#1E4D38]"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1F1D1B] truncate">{a.name}</p>
                              <p className="text-[11px] text-[#7A726A] truncate">{a.village}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Motifs */}
                  {matchingMotifs.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#E8E2D9]">
                      <span className="text-xs font-bold text-[#C43B3D] uppercase tracking-wider">
                        Hoa văn di sản ({matchingMotifs.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingMotifs.map((m) => (
                          <Link
                            key={m.id}
                            href={`/motif/${m.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E8E2D9] flex items-center gap-3 transition"
                          >
                            <img
                              src={m.image_url}
                              alt={m.name}
                              className="w-10 h-10 rounded-lg object-contain bg-white p-1 shrink-0 border border-[#E8E2D9]"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1F1D1B] truncate">{m.name}</p>
                              <p className="text-[11px] text-[#7A726A] truncate">{m.motif_code}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingProducts.length === 0 && matchingArtisans.length === 0 && matchingMotifs.length === 0 && (
                    <div className="py-8 text-center text-[#7A726A] text-sm">
                      Không tìm thấy kết quả phù hợp cho &ldquo;{searchQuery}&rdquo;.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
