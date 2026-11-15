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
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#E5DACB] -z-0" />

          {/* Step 1: Completed */}
          <Link href="/cart" className="relative z-10 flex flex-col items-center gap-1.5 group">
            <div className="w-9 h-9 rounded-full bg-[#F2ECE1] text-[#1F1D1B] font-bold text-xs flex items-center justify-center border-2 border-[#E5DACB] shadow-sm">
              ✓
            </div>
            <span className="text-xs font-bold text-[#5D554D] group-hover:text-[#C43B3D]">GIỎ HÀNG</span>
          </Link>

          {/* Step 2: Active */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#C43B3D] text-white font-bold text-xs flex items-center justify-center border-2 border-[#EA8E23] shadow-md">
              2
            </div>
            <span className="text-xs font-bold text-[#C43B3D]">THANH TOÁN</span>
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

      <div className="border-b border-[#E5DACB] pb-4 text-center max-w-2xl mx-auto space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1F1D1B] text-center">
          Thông Tin Giao Hàng & Thanh Toán
        </h1>
        <p className="text-xs text-[#5D554D] text-center">
          Vui lòng kiểm tra địa chỉ và chọn phương thức thanh toán phù hợp.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Shipping Details & Payment Selection (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1F1D1B] flex items-center gap-2 border-b border-[#E5DACB] pb-3">
              <User className="w-4 h-4 text-[#EA8E23]" />
              <span>1. Thông Tin Người Nhận Hàng</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#5D554D] font-bold block mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-4 py-2.5 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#5D554D] font-bold block mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-4 py-2.5 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#5D554D] font-bold block mb-1">
                Email nhận thông báo đơn hàng
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-4 py-2.5 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs text-[#5D554D] font-bold block mb-1">
                Địa chỉ nhận hàng (Số nhà, tên đường) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 128 Nguyễn Thị Minh Khai"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-4 py-2.5 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#5D554D] font-bold block mb-1">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-3 py-2 text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#5D554D] font-bold block mb-1">Quận / Huyện</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-3 py-2 text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#5D554D] font-bold block mb-1">Phường / Xã</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-3 py-2 text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#5D554D] font-bold block mb-1">
                Ghi chú đơn hàng (Thời gian nhận, đóng gói quà tặng...)
              </label>
              <textarea
                rows={2}
                placeholder="Ghi chú thêm cho người bán hoặc bưu tá..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl p-3 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-4">
            <h2 className="text-base font-serif font-bold text-[#1F1D1B] flex items-center gap-2 border-b border-[#E5DACB] pb-3">
              <CreditCard className="w-4 h-4 text-[#EA8E23]" />
              <span>2. Phương Thức Thanh Toán</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: COD */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'bg-[#FDF6ED] border-[#EA8E23] ring-1 ring-[#EA8E23]'
                    : 'bg-[#FBF8F3] border-[#E5DACB] hover:border-[#EA8E23]/60'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#C43B3D] focus:ring-[#C43B3D]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1F1D1B] block">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="text-xs text-[#5D554D] block mt-0.5">
                    Quý khách được kiểm tra sản phẩm thổ cẩm trước khi thanh toán tiền mặt cho nhân viên giao hàng.
                  </span>
                </div>
              </label>

              {/* Option 2: Bank Transfer VietQR */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'banking'
                    ? 'bg-[#FDF6ED] border-[#EA8E23] ring-1 ring-[#EA8E23]'
                    : 'bg-[#FBF8F3] border-[#E5DACB] hover:border-[#EA8E23]/60'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={paymentMethod === 'banking'}
                  onChange={() => setPaymentMethod('banking')}
                  className="mt-1 text-[#C43B3D] focus:ring-[#C43B3D]"
                />
                <div className="w-full">
                  <span className="text-xs font-bold text-[#1F1D1B] flex items-center gap-2">
                    <span>Chuyển khoản ngân hàng (Quét mã VietQR)</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#C43B3D] text-white">
                      Khuyên Dùng
                    </span>
                  </span>
                  <span className="text-xs text-[#5D554D] block mt-0.5">
                    Quét mã QR qua app ngân hàng hoặc MoMo / VNPay. Mã VietQR động sẽ hiển thị ngay tại trang xác nhận đơn.
                  </span>

                  {paymentMethod === 'banking' && (
                    <div className="mt-3 p-3 bg-[#F2ECE1] rounded-xl border border-[#E5DACB] text-xs text-[#1F1D1B] space-y-1">
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
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1F1D1B] border-b border-[#E5DACB] pb-3 flex items-center justify-between">
              <span>Đơn Hàng Của Bạn</span>
              <Link href="/cart" className="text-xs font-sans text-[#C43B3D] hover:underline font-normal">
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
                    className="w-12 h-12 object-cover rounded-xl border border-[#E5DACB] bg-[#FBF8F3] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1F1D1B] truncate">{item.product?.name}</p>
                    <p className="text-xs text-[#5D554D]">
                      {item.quantity} x {item.product?.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#C43B3D] font-mono">
                    {((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-[#E5DACB] space-y-2 text-xs text-[#5D554D]">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-[#1F1D1B] font-mono">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
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
                <span className="text-2xl font-black text-[#C43B3D] font-mono">
                  {totalAmount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#C43B3D] hover:bg-[#8A2325] text-white font-serif font-bold text-base shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
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

            <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] text-xs text-[#5D554D] space-y-1">
              <p className="flex items-center gap-1.5 text-[#1F1D1B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#EA8E23] shrink-0" />
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

