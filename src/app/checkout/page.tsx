'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import {
  getCart,
  createOrder,
  getCustomerSession,
  validatePromotion,
} from '@/lib/data-store';
import { CartItem, Order, Promotion } from '@/types';
import CustomerAuthModal from '@/components/CustomerAuthModal';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [province, setProvince] = useState('Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    const currentCart = getCart();
    if (currentCart.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(currentCart);

    const session = getCustomerSession();
    if (session) {
      setCustomerName(session.name || '');
      setCustomerPhone(session.phone || '');
      setCustomerEmail(session.email || '');
      if (session.address) setShippingAddress(session.address);
    } else {
      setAuthModalOpen(true);
    }
  }, [router]);


  const subtotal = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = validatePromotion(couponCode, subtotal);
    if (res.valid && res.promo) {
      setAppliedPromo(res.promo);
      setDiscountAmount(res.discount);
      alert(res.message);
    } else {
      setAppliedPromo(null);
      setDiscountAmount(0);
      alert(res.message);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    setIsSubmitting(true);

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productCode: item.product?.product_code || item.productId,
      productName: item.product?.name || 'Sản phẩm thổ cẩm',
      productImage: item.product?.image_url || '/images/products/k001.jpg',
      unitPrice: item.product?.price || 0,
      quantity: item.quantity,
      totalPrice: (item.product?.price || 0) * item.quantity,
    }));

    const newOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      province,
      district,
      ward,
      orderNotes: orderNotes.trim(),
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      items: orderItems,
      subtotal,
      shippingFee,
      discountAmount,
      discountCode: appliedPromo?.code,
      totalAmount,
    });

    // Redirect to Order Success Page
    setTimeout(() => {
      router.push(`/order-success/${newOrder.id}`);
    }, 400);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* 3-Step Breadcrumb Progress Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-stone-800 -z-0" />

          {/* Step 1: Completed */}
          <Link href="/cart" className="relative z-10 flex flex-col items-center gap-1.5 group">
            <div className="w-9 h-9 rounded-full bg-[#231C18] text-amber-400 font-bold text-xs flex items-center justify-center border-2 border-amber-600 shadow">
              ✓
            </div>
            <span className="text-xs font-bold text-stone-300 group-hover:text-amber-400">GIỎ HÀNG</span>
          </Link>

          {/* Step 2: Active */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#B9383A] text-white font-bold text-xs flex items-center justify-center border-2 border-amber-400 shadow-lg">
              2
            </div>
            <span className="text-xs font-bold text-amber-400">THANH TOÁN</span>
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
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-white">
          Thông Tin Giao Hàng & Thanh Toán
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Vui lòng kiểm tra địa chỉ và chọn phương thức thanh toán phù hợp.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Shipping Details & Payment Selection (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-[#1C1714] p-6 sm:p-8 rounded-3xl border border-amber-900/40 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-3">
              <User className="w-4 h-4 text-amber-500" />
              <span>1. Thông Tin Người Nhận Hàng</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 font-bold block mb-1">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 font-bold block mb-1">
                  Số điện thoại <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-stone-400 font-bold block mb-1">
                Email nhận thông báo đơn hàng
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 font-bold block mb-1">
                Địa chỉ nhận hàng (Số nhà, tên đường) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 128 Nguyễn Thị Minh Khai"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-stone-400 font-bold block mb-1">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 font-bold block mb-1">Quận / Huyện</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 font-bold block mb-1">Phường / Xã</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-stone-400 font-bold block mb-1">
                Ghi chú đơn hàng (Thời gian nhận, đóng gói quà tặng...)
              </label>
              <textarea
                rows={2}
                placeholder="Ghi chú thêm cho người bán hoặc bưu tá..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl p-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-[#1C1714] p-6 sm:p-8 rounded-3xl border border-amber-900/40 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-3">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>2. Phương Thức Thanh Toán</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: COD */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'bg-[#2A1E17] border-amber-400'
                    : 'bg-[#120F0D] border-stone-800 hover:border-amber-900/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#B9383A] focus:ring-[#B9383A]"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    Quý khách được kiểm tra sản phẩm thổ cẩm trước khi thanh toán tiền mặt cho nhân viên giao hàng.
                  </span>
                </div>
              </label>

              {/* Option 2: Bank Transfer VietQR */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'banking'
                    ? 'bg-[#2A1E17] border-amber-400'
                    : 'bg-[#120F0D] border-stone-800 hover:border-amber-900/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={paymentMethod === 'banking'}
                  onChange={() => setPaymentMethod('banking')}
                  className="mt-1 text-[#B9383A] focus:ring-[#B9383A]"
                />
                <div className="w-full">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Chuyển khoản ngân hàng (Quét mã VietQR)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#8B2522] text-amber-200">
                      Khuyên Dùng
                    </span>
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    Quét mã QR qua app ngân hàng hoặc MoMo / VNPay. Mã VietQR động sẽ hiển thị ngay tại trang xác nhận đơn.
                  </span>

                  {paymentMethod === 'banking' && (
                    <div className="mt-3 p-3 bg-stone-950 rounded-xl border border-amber-800/40 text-[11px] text-stone-300 space-y-1">
                      <p>• Ngân hàng: <strong>MB Bank (Quân Đội)</strong></p>
                      <p>• Số tài khoản: <strong>0383451929</strong></p>
                      <p>• Chủ tài khoản: <strong>JRAI OI HANDICRAFT GIA LAI</strong></p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1C1714] p-6 sm:p-8 rounded-3xl border border-amber-900/40 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-base text-white border-b border-stone-800 pb-3 flex items-center justify-between">
              <span>Đơn Hàng Của Bạn</span>
              <Link href="/cart" className="text-xs font-sans text-amber-400 hover:underline font-normal">
                Sửa giỏ hàng
              </Link>
            </h3>

            {/* Items summary */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img
                    src={item.product?.image_url}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-xl border border-stone-800 bg-stone-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.product?.name}</p>
                    <p className="text-[11px] text-stone-400">
                      {item.quantity} x {item.product?.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-stone-800 space-y-2 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-white font-mono">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
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
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {totalAmount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B9383A] to-[#8B2522] hover:from-[#A83232] hover:to-[#7A1F1C] text-white font-serif font-bold text-base shadow-xl border border-amber-500/40 transition hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <span>ĐẶT HÀNG NGAY</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="p-3 bg-[#120F0D] rounded-xl border border-amber-900/30 text-[11px] text-stone-400 space-y-1">
              <p className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Bảo mật thông tin đơn hàng 100%.</span>
              </p>
              <p>• Mã đơn hàng và thông tin tra cứu sẽ hiển thị ngay sau khi bạn đặt hàng.</p>
            </div>
          </div>
        </div>
      </form>

      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCustomerName(user.name || '');
          setCustomerPhone(user.phone || '');
          setCustomerEmail(user.email || '');
          setAuthModalOpen(false);
        }}
        title="Đăng Nhập Để Tiếp Tục Đặt Hàng"
        subtitle="Vui lòng đăng nhập qua Google hoặc Facebook để hoàn tất thông tin nhận hàng và bảo lưu quyền lợi đơn hàng."
      />
    </div>
  );
}

