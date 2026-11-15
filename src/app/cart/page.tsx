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
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#E5DACB] -z-0" />
          
          {/* Step 1: Active */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#C43B3D] text-white font-bold text-xs flex items-center justify-center border-2 border-[#EA8E23] shadow-md">
              1
            </div>
            <span className="text-xs font-bold text-[#C43B3D]">GIỎ HÀNG</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#F2ECE1] text-[#8A7E72] font-bold text-xs flex items-center justify-center border-2 border-[#E5DACB]">
              2
            </div>
            <span className="text-xs font-semibold text-[#8A7E72]">THANH TOÁN</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#F2ECE1] text-[#8A7E72] font-bold text-xs flex items-center justify-center border-2 border-[#E5DACB]">
              3
            </div>
            <span className="text-xs font-semibold text-[#8A7E72]">HOÀN TẤT</span>
          </div>
        </div>
      </div>

      <div className="border-b border-[#E5DACB] pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1F1D1B] flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-[#EA8E23]" />
          <span>Giỏ Hàng Của Bạn ({cart.reduce((a, c) => a + c.quantity, 0)} sản phẩm)</span>
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white p-16 rounded-xl border border-[#E5DACB] text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#FBF8F3] flex items-center justify-center mx-auto text-[#EA8E23] border border-[#E5DACB]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#1F1D1B]">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-[#5D554D] max-w-md mx-auto leading-relaxed">
            Chưa có sản phẩm thổ cẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập 57 sản phẩm dệt tay độc bản từ các nghệ nhân làng Kép.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs font-bold px-7 py-3.5 rounded-xl shadow transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KHÁM PHÁ CÁC SẢN PHẨM NGAY</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Table (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-[#E5DACB] p-6 shadow-sm space-y-4">
            <div className="space-y-4 divide-y divide-[#E5DACB]">
              {cart.map((item) => (
                <div key={item.productId} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-[#E5DACB] shrink-0 bg-[#FBF8F3]"
                    />
                    <div>
                      <span className="text-xs font-mono text-[#EA8E23] px-2 py-0.5 rounded bg-[#FBF8F3] border border-[#E5DACB]">
                        {item.product?.product_code}
                      </span>
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-serif font-bold text-sm text-[#1F1D1B] hover:text-[#C43B3D] transition-colors mt-1 line-clamp-1">
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#5D554D] mt-0.5">
                        Đơn giá: <strong className="text-[#C43B3D] font-mono">{item.product?.price.toLocaleString('vi-VN')}₫</strong>
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center bg-[#FBF8F3] border border-[#E5DACB] rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#F2ECE1] text-[#1F1D1B] font-black text-sm flex items-center justify-center transition border border-[#E5DACB]"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-[#1F1D1B] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#F2ECE1] text-[#1F1D1B] font-black text-sm flex items-center justify-center transition border border-[#E5DACB]"
                      >
                        +
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right min-w-[100px]">
                      <span className="text-sm font-black text-[#1F1D1B] font-mono">
                        {((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      className="p-2 text-[#8A7E72] hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions in Cart Table */}
            <div className="pt-4 border-t border-[#E5DACB] flex items-center justify-between text-xs">
              <Link
                href="/products"
                className="text-[#C43B3D] hover:underline flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tiếp tục mua sắm</span>
              </Link>

              <button
                type="button"
                onClick={() => clearCart()}
                className="text-[#8A7E72] hover:text-red-600 font-semibold"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>

          {/* Cart Summary & Coupon (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon Box */}
            <div className="bg-white p-6 rounded-xl border border-[#E5DACB] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#EA8E23] uppercase tracking-wider">
                <Tag className="w-4 h-4" />
                <span>Mã Giảm Giá Khuyến Mãi</span>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã: JRAIOI10, WELCOME50..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] font-mono tracking-wider"
                />
                <button
                  type="submit"
                  className="bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                  ÁP DỤNG
                </button>
              </form>

              {couponFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    couponFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
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

              <div className="text-xs text-[#8A7E72] space-y-0.5 pt-1">
                <p>Gợi ý mã khuyến mãi:</p>
                <p>• <code>JRAIOI10</code>: Giảm 10% đơn từ 300k</p>
                <p>• <code>WELCOME50</code>: Giảm 50.000₫ cho đơn từ 400k</p>
              </div>
            </div>

            {/* Order Calculation */}
            <div className="bg-white p-6 rounded-xl border border-[#E5DACB] shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-[#1F1D1B] border-b border-[#E5DACB] pb-3">
                Tổng Đơn Hàng
              </h3>

              <div className="space-y-2 text-xs text-[#5D554D]">
                <div className="flex justify-between">
                  <span>Tạm tính sản phẩm:</span>
                  <span className="font-bold text-[#1F1D1B] font-mono">
                    {subtotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#8A7E72]" />
                    <span>Phí vận chuyển:</span>
                  </span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-600">MIỄN PHÍ</strong>
                    ) : (
                      <span className="font-mono">{shippingFee.toLocaleString('vi-VN')}₫</span>
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C43B3D] font-bold">
                    <span>Mã giảm giá ({appliedPromo?.code}):</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E5DACB] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#1F1D1B]">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-[#C43B3D] font-mono">
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
                className="w-full py-4 px-6 rounded-2xl bg-[#C43B3D] hover:bg-[#8A2325] text-white font-serif font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>TIẾN HÀNH THANH TOÁN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] text-xs text-[#5D554D] space-y-1">
                <p className="flex items-center gap-1.5 text-[#1F1D1B]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#EA8E23] shrink-0" />
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

