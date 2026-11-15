'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  validatePromotion,
  getCustomerSession,
} from '@/lib/data-store';
import { CartItem, Promotion } from '@/types';
import CustomerAuthModal from '@/components/CustomerAuthModal';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);


  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('jrai_cart_updated', loadCart);
    return () => window.removeEventListener('jrai_cart_updated', loadCart);
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  // Free shipping for orders >= 500,000₫
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleQuantityChange = (productId: string, newQty: number) => {
    updateCartQuantity(productId, newQty);
    loadCart();
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    loadCart();
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = validatePromotion(couponCode, subtotal);
    if (res.valid && res.promo) {
      setAppliedPromo(res.promo);
      setDiscountAmount(res.discount);
      setCouponFeedback({ type: 'success', message: res.message });
    } else {
      setAppliedPromo(null);
      setDiscountAmount(0);
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* 3-Step Breadcrumb Progress Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-stone-800 -z-0" />
          
          {/* Step 1: Active */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#B9383A] text-white font-bold text-xs flex items-center justify-center border-2 border-amber-400 shadow-lg">
              1
            </div>
            <span className="text-xs font-bold text-amber-400">GIỎ HÀNG</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#231C18] text-stone-500 font-bold text-xs flex items-center justify-center border-2 border-stone-700">
              2
            </div>
            <span className="text-xs font-semibold text-stone-500">THANH TOÁN</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#231C18] text-stone-500 font-bold text-xs flex items-center justify-center border-2 border-stone-700">
              3
            </div>
            <span className="text-xs font-semibold text-stone-500">HOÀN TẤT</span>
          </div>
        </div>
      </div>

      <div className="border-b border-stone-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-white flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-amber-400" />
          <span>Giỏ Hàng Của Bạn ({cart.reduce((a, c) => a + c.quantity, 0)} sản phẩm)</span>
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-[#1C1714] p-16 rounded-3xl border border-amber-900/40 text-center space-y-4 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-stone-900 flex items-center justify-center mx-auto text-amber-500 border border-stone-800">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-serif font-bold text-white">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
            Chưa có sản phẩm thổ cẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập 57 sản phẩm dệt tay độc bản từ các nghệ nhân làng Kép.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold px-7 py-3.5 rounded-xl shadow transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KHÁM PHÁ CÁC SẢN PHẨM NGAY</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Table (8 Cols) */}
          <div className="lg:col-span-8 bg-[#1C1714] rounded-3xl border border-amber-900/40 p-6 shadow-xl space-y-4">
            <div className="space-y-4 divide-y divide-stone-800">
              {cart.map((item) => (
                <div key={item.productId} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-stone-800 shrink-0 bg-stone-900"
                    />
                    <div>
                      <span className="text-[10px] font-mono text-amber-500 px-2 py-0.5 rounded bg-stone-900 border border-amber-900/40">
                        {item.product?.product_code}
                      </span>
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-serif font-bold text-sm text-white hover:text-amber-400 transition-colors mt-1 line-clamp-1">
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Đơn giá: <strong className="text-amber-400 font-mono">{item.product?.price.toLocaleString('vi-VN')}₫</strong>
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center bg-[#231C18] border border-amber-900/50 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-black text-sm flex items-center justify-center transition"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-black text-sm flex items-center justify-center transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right min-w-[100px]">
                      <span className="text-sm font-black text-white font-mono">
                        {((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions in Cart Table */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
              <Link
                href="/products"
                className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tiếp tục mua sắm</span>
              </Link>

              <button
                type="button"
                onClick={() => clearCart()}
                className="text-stone-400 hover:text-red-400 font-semibold"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>

          {/* Cart Summary & Coupon (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon Box */}
            <div className="bg-[#1C1714] p-6 rounded-3xl border border-amber-900/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Tag className="w-4 h-4" />
                <span>Mã Giảm Giá Khuyến Mãi</span>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã: JRAIOI10, WELCOME50..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#120F0D] border border-amber-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                />
                <button
                  type="submit"
                  className="bg-[#2A201A] hover:bg-[#B9383A] text-amber-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-amber-700/50 transition"
                >
                  ÁP DỤNG
                </button>
              </form>

              {couponFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    couponFeedback.type === 'success'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}
                >
                  {couponFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{couponFeedback.message}</span>
                </div>
              )}

              <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
                <p>Gợi ý mã khuyến mãi:</p>
                <p>• <code>JRAIOI10</code>: Giảm 10% đơn từ 300k</p>
                <p>• <code>WELCOME50</code>: Giảm 50.000₫ cho đơn từ 400k</p>
              </div>
            </div>

            {/* Order Calculation */}
            <div className="bg-[#1C1714] p-6 rounded-3xl border border-amber-900/40 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-base text-white border-b border-stone-800 pb-3">
                Tổng Đơn Hàng
              </h3>

              <div className="space-y-2 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Tạm tính sản phẩm:</span>
                  <span className="font-bold text-white font-mono">
                    {subtotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-stone-400" />
                    <span>Phí vận chuyển:</span>
                  </span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-400">MIỄN PHÍ</strong>
                    ) : (
                      <span className="font-mono">{shippingFee.toLocaleString('vi-VN')}₫</span>
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Mã giảm giá ({appliedPromo?.code}):</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Checkout Button with Auth Guard */}
              <button
                type="button"
                onClick={() => {
                  const session = getCustomerSession();
                  if (!session) {
                    setAuthModalOpen(true);
                  } else {
                    router.push('/checkout');
                  }
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B9383A] to-[#8B2522] hover:from-[#A83232] hover:to-[#7A1F1C] text-white font-serif font-bold text-sm shadow-xl border border-amber-500/40 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <span>TIẾN HÀNH THANH TOÁN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-[#120F0D] rounded-xl border border-amber-900/30 text-[11px] text-stone-400 space-y-1">
                <p className="flex items-center gap-1.5 text-stone-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Kiểm tra hàng trước khi thanh toán tiền mặt (COD).</span>
                </p>
                <p>• Miễn phí giao hàng toàn quốc cho đơn từ 500.000₫.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Auth Modal for Checkout */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          router.push('/checkout');
        }}
        title="Đăng Nhập Để Thanh Toán Đơn Hàng"
        subtitle="Vui lòng đăng nhập qua Google hoặc Facebook để tiếp tục xác nhận địa chỉ và hoàn tất đơn hàng thổ cẩm Jrai."
      />
    </div>
  );
}

