'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Heart,
  Truck,
  LogOut,
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  getCustomerSession,
  loginCustomer,
  loginSocialCustomer,
  registerCustomer,
  logoutCustomer,
  getOrders,
  getProducts,
  addToCart,
  toggleWishlist,
} from '@/lib/data-store';
import { CustomerUser, Order, Product } from '@/types';

export default function AccountPage() {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginInput, setLoginInput] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  const loadData = () => {
    const session = getCustomerSession();
    setCustomer(session);

    if (session) {
      const allOrders = getOrders();
      // Filter orders by phone or email or customerName
      const customerOrders = allOrders.filter(
        (o) =>
          o.customerPhone === session.phone ||
          (o.customerEmail && o.customerEmail.toLowerCase() === session.email.toLowerCase()) ||
          o.customerName.toLowerCase().includes(session.name.toLowerCase())
      );
      setOrders(customerOrders.length > 0 ? customerOrders : allOrders.slice(0, 2));

      const allProds = getProducts(true);
      const wishProds = allProds.filter((p) => session.wishlist?.includes(p.id) || session.wishlist?.includes(p.product_code));
      setWishlistProducts(wishProds);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    const user = loginCustomer(loginInput);
    setCustomer(user);
    loadData();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;
    const user = registerCustomer(regName, regEmail || `${regPhone}@customer.jraioi.vn`, regPhone);
    setCustomer(user);
    loadData();
  };

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-10 rounded-3xl border border-amber-900/40 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>KHÁCH HÀNG THÂN THIẾT JRAI ƠI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#FFFDF9]">
            {customer ? `Xin chào, ${customer.name}` : 'Tài Khoản & Lịch Sử Mua Hàng'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            {customer
              ? 'Quản lý đơn hàng, theo dõi giao vận và danh sách sản phẩm yêu thích của bạn.'
              : 'Đăng nhập để theo dõi trạng thái đơn hàng và lưu trữ sản phẩm yêu thích.'}
          </p>
        </div>

        {customer && (
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-[#251E1A] hover:bg-[#322722] text-stone-300 hover:text-white px-4 py-2.5 rounded-xl border border-stone-700 text-xs font-bold transition self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Đăng xuất</span>
          </button>
        )}
      </div>

      {!customer ? (
        /* Login / Register Card */
        <div className="max-w-md mx-auto bg-[#1C1714] p-8 rounded-3xl border border-amber-900/40 shadow-2xl space-y-6">
          <div className="flex border-b border-stone-800 text-center">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
                authMode === 'login'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              ĐĂNG NHẬP
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
                authMode === 'register'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              TẠO TÀI KHOẢN MỚI
            </button>
          </div>

          {authMode === 'login' ? (
            <div className="space-y-4">
              {/* Social Login Options */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const user = loginSocialCustomer('google');
                    setCustomer(user);
                    loadData();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center gap-2.5 shadow transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.9H1.26v3.15C3.25 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.32 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.55H1.26C.46 8.14 0 9.97 0 12s.46 3.86 1.26 5.45l4.06-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.26 6.55l4.06 3.15c.94-2.81 3.58-4.9 6.68-4.9z"
                    />
                  </svg>
                  <span>Đăng nhập nhanh bằng Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const user = loginSocialCustomer('facebook');
                    setCustomer(user);
                    loadData();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Đăng nhập nhanh bằng Facebook</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-stone-800 w-full" />
                <span className="bg-[#1C1714] px-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
                  HOẶC DÙNG SỐ ĐIỆN THOẠI / EMAIL
                </span>
                <div className="border-t border-stone-800 w-full" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs text-stone-300 font-bold block mb-1">
                    Số điện thoại hoặc Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 0912345678 hoặc email@gmail.com"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold rounded-xl shadow transition"
                >
                  ĐĂNG NHẬP NGAY
                </button>

                <div className="text-[11px] text-stone-500 text-center pt-1">
                  Hệ thống hỗ trợ đăng nhập nhanh bằng số điện thoại đặt hàng.
                </div>
              </form>
            </div>
          ) : (

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Thị Mai"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0987654321"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold rounded-xl shadow transition"
              >
                ĐĂNG KÝ TÀI KHOẢN
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Customer Portal Tabs */
        <div className="space-y-6">
          <div className="flex border-b border-stone-800 gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                activeTab === 'orders'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Lịch sử đơn hàng ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                activeTab === 'wishlist'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Yêu thích ({wishlistProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                activeTab === 'profile'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Hồ sơ cá nhân</span>
            </button>
          </div>

          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-[#1C1714] p-12 rounded-3xl border border-stone-800 text-center space-y-3">
                  <p className="text-xs text-stone-400">Bạn chưa có đơn hàng nào.</p>
                  <Link
                    href="/products"
                    className="inline-block text-xs bg-[#B9383A] text-white font-bold px-5 py-2.5 rounded-xl shadow"
                  >
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-[#1C1714] p-6 rounded-3xl border border-amber-900/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {ord.code}
                          </span>
                          <span className="text-[10px] bg-stone-900 text-stone-300 px-2 py-0.5 rounded border border-stone-800">
                            {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-800/40">
                            {ord.status}
                          </span>
                        </div>

                        <div className="text-xs text-stone-300">
                          {ord.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')}
                        </div>

                        <div className="text-xs font-mono text-stone-400">
                          Tổng tiền: <strong className="text-white text-sm">{ord.totalAmount.toLocaleString('vi-VN')}₫</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/order-tracking?code=${ord.code}&phone=${ord.customerPhone}`}
                          className="bg-[#2A1E17] hover:bg-[#382B23] text-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-amber-800/50 transition flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Theo dõi đơn</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistProducts.length === 0 ? (
                <div className="bg-[#1C1714] p-12 rounded-3xl border border-stone-800 text-center space-y-3">
                  <p className="text-xs text-stone-400">Chưa có sản phẩm nào trong danh sách yêu thích.</p>
                  <Link
                    href="/products"
                    className="inline-block text-xs bg-[#B9383A] text-white font-bold px-5 py-2.5 rounded-xl shadow"
                  >
                    Khám phá sản phẩm
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#231C18] rounded-2xl border border-amber-900/30 overflow-hidden shadow-lg flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] bg-stone-900">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-serif font-bold text-xs text-white line-clamp-1">{p.name}</h4>
                        <div className="text-sm font-black text-amber-400">
                          {p.price.toLocaleString('vi-VN')}₫
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="flex-1 bg-[#B9383A] text-white text-[11px] font-bold py-2 rounded-xl shadow"
                          >
                            Thêm giỏ
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="p-2 bg-stone-900 text-red-400 rounded-xl border border-stone-800"
                            title="Xóa khỏi yêu thích"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-[#1C1714] p-8 rounded-3xl border border-amber-900/40 space-y-4 max-w-xl text-xs text-stone-300">
              <h3 className="font-serif font-bold text-base text-white border-b border-stone-800 pb-3">
                Thông Tin Cá Nhân
              </h3>
              <p>
                <strong>Họ và tên:</strong> {customer.name}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {customer.phone}
              </p>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Ngày tham gia:</strong> {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
