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
    <div className="w-full bg-[#FAF5EC] min-h-screen py-10 lg:py-14">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        
        {/* 3-Step Breadcrumb Progress Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#E8DFC8] -z-0" />
            
            {/* Step 1: Active */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#174C38] text-[#FFFDF9] font-medium text-xs flex items-center justify-center shadow-xs">
                1
              </div>
              <span className="text-xs font-semibold text-[#174C38]">Giỏ hàng</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF5EC] text-[#8A7E72] font-medium text-xs flex items-center justify-center border border-[#E8DFC8]">
                2
              </div>
              <span className="text-xs font-medium text-[#8A7E72]">Thanh toán</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF5EC] text-[#8A7E72] font-medium text-xs flex items-center justify-center border border-[#E8DFC8]">
                3
              </div>
              <span className="text-xs font-medium text-[#8A7E72]">Hoàn tất</span>
            </div>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#174C38]">
            Giỏ hàng của bạn ({cart.reduce((a, c) => a + c.quantity, 0)} tác phẩm)
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#FFFDF9] p-12 sm:p-16 rounded-2xl border border-[#E8DFC8] text-center space-y-3 shadow-xs max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF5EC] flex items-center justify-center mx-auto text-[#174C38] border border-[#E8DFC8]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold text-[#174C38]">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-[#59524C] max-w-md mx-auto leading-relaxed">
              Chưa có tác phẩm thổ cẩm nào trong giỏ. Hãy khám phá bộ sưu tập 57 sản phẩm dệt cửi hông từ các nghệ nhân buôn làng.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] text-xs font-medium px-6 py-2.5 rounded-xl shadow-xs transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#C99A45]" />
                <span>Khám phá sản phẩm ngay</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Table (8 Cols) */}
            <div className="lg:col-span-8 bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] p-6 shadow-xs space-y-4">
              <div className="space-y-4 divide-y divide-[#E8DFC8]">
                {cart.map((item) => (
                  <div key={item.productId} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.product?.image_url}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-xl border border-[#E8DFC8] shrink-0 bg-[#FAF5EC]"
                      />
                      <div>
                        <span className="text-[11px] font-mono text-[#C99A45] px-2 py-0.5 rounded-full bg-[#FAF5EC] border border-[#E8DFC8]">
                          {item.product?.product_code}
                        </span>
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-semibold text-sm text-[#174C38] hover:text-[#C99A45] transition-colors mt-1 line-clamp-1">
                            {item.product?.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#59524C] mt-0.5">
                          Đơn giá: <strong className="text-[#A94335] font-mono">{item.product?.price.toLocaleString('vi-VN')}₫</strong>
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                      {/* Stepper */}
                      <div className="flex items-center bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-[#E8DFC8] text-[#174C38] font-semibold text-xs flex items-center justify-center transition border border-[#E8DFC8]"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#174C38] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-[#E8DFC8] text-[#174C38] font-semibold text-xs flex items-center justify-center transition border border-[#E8DFC8]"
                        >
                          +
                        </button>
                      </div>

                      {/* Total item price */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-sm font-semibold text-[#2D2926] font-mono">
                          {((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="p-1.5 text-[#8A7E72] hover:text-[#A94335] hover:bg-[#FAF5EC] rounded-lg transition"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions in Cart Table */}
              <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-between text-xs">
                <Link
                  href="/products"
                  className="text-[#174C38] hover:text-[#C99A45] flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tiếp tục mua sắm</span>
                </Link>

                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="text-[#8A7E72] hover:text-[#A94335] font-medium cursor-pointer"
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </div>

            {/* Cart Summary & Coupon (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Coupon Box */}
              <div className="bg-[#FFFDF9] p-5 sm:p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#C99A45] uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Mã giảm giá</span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập: JRAIOI10, WELCOME50..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl px-3 py-2 text-xs text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38] font-mono tracking-wider"
                  />
                  <button
                    type="submit"
                    className="bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] text-xs font-medium px-4 py-2 rounded-xl shadow-xs transition"
                  >
                    Áp dụng
                  </button>
                </form>

                {couponFeedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      couponFeedback.type === 'success'
                        ? 'bg-[#FAF5EC] text-[#174C38] border border-[#174C38]/40'
                        : 'bg-red-50 text-[#A94335] border border-red-200'
                    }`}
                  >
                    {couponFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#174C38]" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{couponFeedback.message}</span>
                  </div>
                )}

                <div className="text-[11px] text-[#8A7E72] space-y-0.5 pt-1">
                  <p>• <code>JRAIOI10</code>: Giảm 10% đơn từ 300k</p>
                  <p>• <code>WELCOME50</code>: Giảm 50.000₫ đơn từ 400k</p>
                </div>
              </div>

              {/* Order Calculation */}
              <div className="bg-[#FFFDF9] p-5 sm:p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3.5">
                <h3 className="font-semibold text-sm sm:text-base text-[#174C38] border-b border-[#E8DFC8] pb-2.5">
                  Tổng đơn hàng
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-[#59524C]">
                  <div className="flex justify-between">
                    <span>Tạm tính sản phẩm:</span>
                    <span className="font-semibold text-[#2D2926] font-mono">
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
                        <strong className="text-[#174C38]">MIỄN PHÍ</strong>
                      ) : (
                        <span className="font-mono">{shippingFee.toLocaleString('vi-VN')}₫</span>
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#A94335] font-medium">
                      <span>Mã giảm giá ({appliedPromo?.code}):</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#E8DFC8] flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[#174C38]">Tổng thanh toán:</span>
                    <span className="text-xl font-semibold text-[#A94335] font-mono">
                      {total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
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
                  className="w-full py-3.5 px-6 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Tiến hành thanh toán</span>
                  <ArrowRight className="w-4 h-4 text-[#C99A45]" />
                </button>

                <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] text-xs text-[#59524C] space-y-1">
                  <p className="flex items-center gap-1.5 text-[#174C38]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C99A45] shrink-0" />
                    <span>Kiểm tra hàng trước khi thanh toán (COD).</span>
                  </p>
                  <p>• Miễn phí giao hàng cho đơn từ 500.000₫.</p>
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
          title="Đăng nhập để thanh toán đơn hàng"
          subtitle="Vui lòng đăng nhập qua Google hoặc Facebook để tiếp tục xác nhận địa chỉ và hoàn tất đơn hàng thổ cẩm Jrai."
        />
      </div>
    </div>
  );
}
