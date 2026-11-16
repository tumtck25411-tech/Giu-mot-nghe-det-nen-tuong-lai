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
  Building,
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

const PROVINCES_LIST = [
  'Gia Lai',
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Đắk Lắk',
  'Kon Tum',
  'Lâm Đồng',
  'Đắk Nông',
  'Bình Định',
  'Khánh Hòa',
  'Cần Thơ',
  'Hải Phòng',
  'Bà Rịa - Vũng Tàu',
  'Bình Dương',
  'Đồng Nai',
  'Quảng Nam',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'An Giang',
  'Bến Tre',
  'Bình Thuận',
  'Cà Mau',
  'Kiên Giang',
  'Nghệ An',
  'Quảng Ninh',
  'Thanh Hóa',
  'Bắc Giang',
  'Bắc Ninh',
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Form Fields - Khởi tạo rỗng, không tự động điền thông tin cá nhân mẫu
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // Chỉ điền nếu tài khoản người dùng thực sự có tên riêng và không phải tên mẫu mặc định
      if (session.name && session.name !== 'Mai Thị Cẩm Tú') {
        setCustomerName(session.name);
      }
      if (session.phone && session.phone !== '0383451929') {
        setCustomerPhone(session.phone);
      }
      if (
        session.email &&
        !session.email.includes('social.jraioi.vn') &&
        session.email !== 'camtu.jrai@gmail.com'
      ) {
        setCustomerEmail(session.email);
      }
      if (session.address) {
        setShippingAddress(session.address);
      }
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

  const validateField = (field: string) => {
    const newErrors = { ...errors };

    if (field === 'customerName') {
      if (!customerName.trim()) {
        newErrors.customerName = 'Vui lòng nhập họ và tên người nhận.';
      } else {
        delete newErrors.customerName;
      }
    }

    if (field === 'customerPhone') {
      const phoneClean = customerPhone.replace(/\s+/g, '');
      if (!phoneClean) {
        newErrors.customerPhone = 'Vui lòng nhập số điện thoại liên hệ.';
      } else if (!/(0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneClean)) {
        newErrors.customerPhone = 'Số điện thoại không hợp lệ (cần 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09).';
      } else {
        delete newErrors.customerPhone;
      }
    }

    if (field === 'customerEmail') {
      if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
        newErrors.customerEmail = 'Định dạng email chưa hợp lệ.';
      } else {
        delete newErrors.customerEmail;
      }
    }

    if (field === 'shippingAddress') {
      if (!shippingAddress.trim()) {
        newErrors.shippingAddress = 'Vui lòng nhập số nhà, tên đường hoặc thôn/buôn.';
      } else {
        delete newErrors.shippingAddress;
      }
    }

    if (field === 'province') {
      if (!province.trim()) {
        newErrors.province = 'Vui lòng chọn hoặc nhập Tỉnh / Thành phố.';
      } else {
        delete newErrors.province;
      }
    }

    if (field === 'district') {
      if (!district.trim()) {
        newErrors.district = 'Vui lòng nhập Quận / Huyện.';
      } else {
        delete newErrors.district;
      }
    }

    if (field === 'ward') {
      if (!ward.trim()) {
        newErrors.ward = 'Vui lòng nhập Phường / Xã.';
      } else {
        delete newErrors.ward;
      }
    }

    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Vui lòng nhập họ và tên người nhận.';
    }

    const phoneClean = customerPhone.replace(/\s+/g, '');
    if (!phoneClean) {
      newErrors.customerPhone = 'Vui lòng nhập số điện thoại liên hệ.';
    } else if (!/(0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneClean)) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ (cần 10 chữ số).';
    }

    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      newErrors.customerEmail = 'Định dạng email chưa hợp lệ.';
    }

    if (!shippingAddress.trim()) {
      newErrors.shippingAddress = 'Vui lòng nhập số nhà, tên đường hoặc thôn/buôn.';
    }

    if (!province.trim()) {
      newErrors.province = 'Vui lòng chọn hoặc nhập Tỉnh / Thành phố.';
    }

    if (!district.trim()) {
      newErrors.district = 'Vui lòng nhập Quận / Huyện.';
    }

    if (!ward.trim()) {
      newErrors.ward = 'Vui lòng nhập Phường / Xã.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      const cardEl = document.getElementById('recipient-info-card');
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
      province: province.trim(),
      district: district.trim(),
      ward: ward.trim(),
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
    <div
      className="w-full min-h-screen py-10 relative overflow-hidden"
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
          {/* ============================================================== */}
          {/* PHIẾU 1: THÔNG TIN NGƯỜI NHẬN - PHONG CÁCH BOUTIQUE TÂY NGUYÊN */}
          {/* ============================================================== */}
          <div
            id="recipient-info-card"
            className="bg-[#FAF5EC] p-6 sm:p-8 rounded-2xl border border-[#E5DACB] shadow-[0_4px_24px_rgba(23,76,56,0.05)] space-y-5 relative overflow-hidden transition-all duration-300"
          >
            {/* Header: Biểu tượng JRAI ƠI + Tiêu đề + Họa tiết thổ cẩm */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DACB]/80">
              <div className="flex items-center gap-3">
                <div
                  className="px-2 py-1 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0 border border-[#E5DACB]"
                  style={{ height: '42px', minWidth: '42px', width: 'auto' }}
                >
                  <img
                    src="/images/logo/logo-jrai-oi-transparent.png"
                    alt="JRAI ƠI"
                    className="object-contain"
                    style={{ height: '28px', maxHeight: '28px', width: 'auto', maxWidth: '70px', display: 'block' }}
                  />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-black text-[#174C38] tracking-tight">
                    Thông tin người nhận
                  </h2>
                  <p className="text-xs text-[#96704B] font-medium mt-0.5">
                    Hãy để Jrai Ơi biết nơi gửi món quà thổ cẩm đến bạn nhé!
                  </p>
                </div>
              </div>

              {/* Họa tiết hình thoi thổ cẩm trang trí góc phải header */}
              <div className="hidden sm:flex items-center gap-1.5 text-[#C99A45] select-none" aria-hidden="true">
                <span className="text-xs">◇</span>
                <span className="text-sm font-bold text-[#174C38]">◈</span>
                <span className="text-xs">◇</span>
              </div>
            </div>

            {/* Các trường nhập liệu */}
            <div className="space-y-4">
              {/* Hàng 1: Họ tên (bắt buộc) & Số điện thoại (bắt buộc) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Họ và tên */}
                <div>
                  <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                    Họ và tên người nhận <span className="text-[#C99A45] font-black">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#96704B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Thị Mai"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                      }}
                      onBlur={() => validateField('customerName')}
                      style={{ paddingLeft: '44px', minHeight: '44px' }}
                      className={`w-full bg-white border rounded-xl pr-4 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] transition-all duration-200 focus:outline-none focus:bg-white ${
                        errors.customerName
                          ? 'border-[#B9383A] ring-1 ring-[#B9383A]/20'
                          : 'border-[#E2D8C7] focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10'
                      }`}
                    />
                  </div>
                  {errors.customerName && (
                    <p className="text-[11px] text-[#B9383A] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.customerName}</span>
                    </p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                    Số điện thoại <span className="text-[#C99A45] font-black">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#96704B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="Ví dụ: 0912 345 678"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }));
                      }}
                      onBlur={() => validateField('customerPhone')}
                      style={{ paddingLeft: '44px', minHeight: '44px' }}
                      className={`w-full bg-white border rounded-xl pr-4 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] font-mono transition-all duration-200 focus:outline-none focus:bg-white ${
                        errors.customerPhone
                          ? 'border-[#B9383A] ring-1 ring-[#B9383A]/20'
                          : 'border-[#E2D8C7] focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10'
                      }`}
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="text-[11px] text-[#B9383A] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.customerPhone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Hàng 2: Email nhận thông báo đơn hàng (không bắt buộc) */}
              <div>
                <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                  Email nhận thông báo đơn hàng{' '}
                  <span className="text-xs font-normal text-[#96704B]">(Không bắt buộc)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#96704B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Ví dụ: mai.nguyen@gmail.com"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (errors.customerEmail) setErrors((prev) => ({ ...prev, customerEmail: '' }));
                    }}
                    onBlur={() => validateField('customerEmail')}
                    style={{ paddingLeft: '44px', minHeight: '44px' }}
                    className={`w-full bg-white border rounded-xl pr-4 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] transition-all duration-200 focus:outline-none focus:bg-white ${
                      errors.customerEmail
                        ? 'border-[#B9383A] ring-1 ring-[#B9383A]/20'
                        : 'border-[#E2D8C7] focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10'
                    }`}
                  />
                </div>
                {errors.customerEmail ? (
                  <p className="text-[11px] text-[#B9383A] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.customerEmail}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#96704B] mt-1">
                    Nhận hóa đơn điện tử & mã tra cứu hành trình dệt cửi Ia Mơ Nông.
                  </p>
                )}
              </div>

              {/* Hàng 3: Địa chỉ nhận hàng (bắt buộc) */}
              <div>
                <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                  Địa chỉ nhận hàng (Số nhà, tên đường, thôn/buôn) <span className="text-[#C99A45] font-black">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#96704B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Ví dụ: 128 Nguyễn Thị Minh Khai (hoặc Làng Kép, Buôn Alơ)..."
                    value={shippingAddress}
                    onChange={(e) => {
                      setShippingAddress(e.target.value);
                      if (errors.shippingAddress) setErrors((prev) => ({ ...prev, shippingAddress: '' }));
                    }}
                    onBlur={() => validateField('shippingAddress')}
                    style={{ paddingLeft: '44px', minHeight: '44px' }}
                    className={`w-full bg-white border rounded-xl pr-4 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] transition-all duration-200 focus:outline-none focus:bg-white ${
                      errors.shippingAddress
                        ? 'border-[#B9383A] ring-1 ring-[#B9383A]/20'
                        : 'border-[#E2D8C7] focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10'
                    }`}
                  />
                </div>
                {errors.shippingAddress && (
                  <p className="text-[11px] text-[#B9383A] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.shippingAddress}</span>
                  </p>
                )}
              </div>

              {/* Hàng 4: Tỉnh / Thành phố, Quận / Huyện, Phường / Xã */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Tỉnh / Thành phố */}
                <div>
                  <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                    Tỉnh / Thành phố <span className="text-[#C99A45] font-black">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="provinces-list"
                      placeholder="Chọn hoặc nhập..."
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        if (errors.province) setErrors((prev) => ({ ...prev, province: '' }));
                      }}
                      onBlur={() => validateField('province')}
                      style={{ minHeight: '44px' }}
                      className={`w-full bg-white border rounded-xl px-3.5 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] transition-all duration-200 focus:outline-none focus:bg-white ${
                        errors.province
                          ? 'border-[#B9383A] ring-1 ring-[#B9383A]/20'
                          : 'border-[#E2D8C7] focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10'
                      }`}
                    />
                    <datalist id="provinces-list">
                      {PROVINCES_LIST.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </div>
                  {errors.province && (
                    <p className="text-[11px] text-[#B9383A] font-medium mt-1">
                      {errors.province}
                    </p>
                  )}
                </div>

                {/* Quận / Huyện */}
                <div>
                  <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                    Quận / Huyện <span className="text-[#C99A45] font-black">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Huyện Chư Păh..."
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      if (errors.district) setErrors((prev) => ({ ...prev, district: '' }));
                    }}
                    onBlur={() => validateField('district')}
                    style={{ minHeight: '44px' }}
                    className={`w-full bg-white border rounded-xl px-3.5 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] transition-all duration-200 focus:outline-none focus:bg-white ${
                      errors.district
                        ? 'border-[#B9383A] ring-1 ring-[#B9383A]/20'
                        : 'border-[#E2D8C7] focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10'
                    }`}
                  />
                  {errors.district && (
                    <p className="text-[11px] text-[#B9383A] font-medium mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* Phường / Xã */}
                <div>
                  <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                    Phường / Xã <span className="text-[#C99A45] font-black">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Xã Ia Mơ Nông..."
                    value={ward}
                    onChange={(e) => {
                      setWard(e.target.value);
                      if (errors.ward) setErrors((prev) => ({ ...prev, ward: '' }));
                    }}
                    onBlur={() => validateField('ward')}
                    style={{ minHeight: '44px' }}
                    className={`w-full bg-white border rounded-xl px-3.5 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] transition-all duration-200 focus:outline-none focus:bg-white ${
                      errors.ward
                        ? 'border-[#B9383A] ring-1 ring-[#B9383A]/20'
                        : 'border-[#E2D8C7] focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10'
                    }`}
                  />
                  {errors.ward && (
                    <p className="text-[11px] text-[#B9383A] font-medium mt-1">
                      {errors.ward}
                    </p>
                  )}
                </div>
              </div>

              {/* Hàng 5: Ghi chú đơn hàng (không bắt buộc) */}
              <div>
                <label className="text-xs text-[#3D2E24] font-bold block mb-1.5">
                  Ghi chú đơn hàng{' '}
                  <span className="text-xs font-normal text-[#96704B]">(Không bắt buộc)</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#96704B] absolute left-3.5 top-3.5 pointer-events-none" />
                  <textarea
                    rows={3}
                    placeholder="Ghi chú thêm về thời gian nhận, bọc gói quà thủ công, thông điệp kèm theo..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    style={{ paddingLeft: '44px', paddingTop: '12px' }}
                    className="w-full bg-white border border-[#E2D8C7] rounded-xl pr-4 text-xs sm:text-sm text-[#1F1D1B] placeholder-[#A39686] transition-all duration-200 focus:outline-none focus:border-[#174C38] focus:ring-2 focus:ring-[#174C38]/10 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Footer của phiếu: Lời tri ân + Họa tiết hình thoi thổ cẩm hai bên */}
            <div className="pt-4 border-t border-[#E5DACB]/80 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs text-[#96704B]">
              <div className="flex items-center gap-1 text-[#C99A45] select-none" aria-hidden="true">
                <span className="text-[11px]">◇</span>
                <span className="text-xs font-bold text-[#174C38]">◈</span>
                <span className="text-[11px]">◇</span>
              </div>
              <p className="font-serif italic font-medium text-[#7D5B3A]">
                Cảm ơn bạn đã lựa chọn và đồng hành cùng những nghệ nhân Jrai.
              </p>
              <div className="flex items-center gap-1 text-[#C99A45] select-none" aria-hidden="true">
                <span className="text-[11px]">◇</span>
                <span className="text-xs font-bold text-[#174C38]">◈</span>
                <span className="text-[11px]">◇</span>
              </div>
            </div>
          </div>

          {/* Payment Method Card - Giữ nguyên toàn bộ logic & giao diện */}
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

        {/* Right Summary Column (5 Cols) - Giữ nguyên toàn bộ logic & giao diện */}
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
                    <p className="text-xs font-bold text-[#1F1D1B] line-clamp-2 leading-snug">{item.product?.name}</p>
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
          if (user.name && user.name !== 'Mai Thị Cẩm Tú') setCustomerName(user.name);
          if (user.phone && user.phone !== '0383451929') setCustomerPhone(user.phone);
          if (
            user.email &&
            !user.email.includes('social.jraioi.vn') &&
            user.email !== 'camtu.jrai@gmail.com'
          ) {
            setCustomerEmail(user.email);
          }
          setAuthModalOpen(false);
        }}
        title="Đăng Nhập Để Tiếp Tục Đặt Hàng"
        subtitle="Vui lòng đăng nhập qua Google hoặc Facebook để hoàn tất thông tin nhận hàng và bảo lưu quyền lợi đơn hàng."
      />

      {/* Bottom Illustrated Mountain Landscape Strip */}
      <div
        className="w-full h-24 sm:h-32 bg-bottom bg-contain sm:bg-cover bg-no-repeat mt-12 opacity-95 max-w-6xl mx-auto"
        style={{
          backgroundImage: "url('/images/custom/illustrated_mountain_footer.png')",
        }}
        title="Toàn cảnh thiên nhiên Tây Nguyên — JRAI ƠI"
      />
    </div>
  );
}
