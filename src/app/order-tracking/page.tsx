'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  QrCode,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { getOrderByCodeAndPhone, getOrderById, getOrders } from '@/lib/data-store';
import { Order } from '@/types';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeBg: string; step: number }
> = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'text-amber-700',
    badgeBg: 'bg-amber-50 border-amber-300',
    step: 1,
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'text-blue-700',
    badgeBg: 'bg-blue-50 border-blue-300',
    step: 2,
  },
  processing: {
    label: 'Đang đóng gói & Cấp QR',
    color: 'text-purple-700',
    badgeBg: 'bg-purple-50 border-purple-300',
    step: 3,
  },
  shipping: {
    label: 'Đang vận chuyển',
    color: 'text-indigo-700',
    badgeBg: 'bg-indigo-50 border-indigo-300',
    step: 4,
  },
  delivered: {
    label: 'Giao hàng thành công',
    color: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 border-emerald-300',
    step: 5,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'text-red-700',
    badgeBg: 'bg-red-50 border-red-300',
    step: 0,
  },
};

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderCode, setOrderCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode, initialPhone);
    }
  }, [initialCode, initialPhone]);

  const handleSearch = (codeToSearch: string, phoneToSearch: string) => {
    const cleanCode = codeToSearch.trim();
    const cleanPhone = phoneToSearch.trim();
    if (!cleanCode) return;

    let foundOrder = getOrderByCodeAndPhone(cleanCode, cleanPhone);
    if (!foundOrder && !cleanPhone) {
      foundOrder = getOrderById(cleanCode);
    }

    if (foundOrder) {
      setOrder(foundOrder);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(orderCode, phoneNumber);
  };

  const sampleOrder = () => {
    const all = getOrders();
    if (all.length > 0) {
      const sample = all[0];
      setOrderCode(sample.code);
      setPhoneNumber(sample.customerPhone);
      handleSearch(sample.code, sample.customerPhone);
    }
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-12 rounded-2xl border border-amber-900/40 relative overflow-hidden shadow-sm text-center">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>THEO DÕI ĐƠN HÀNG TRỰC TUYẾN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#FFFDF9]">
            Tra Cứu Tình Trạng Đơn Hàng JRAI ƠI
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Nhập mã đơn hàng (Định dạng: <strong>JRAI-ORD-XXXXX</strong>) và số điện thoại đặt hàng để cập nhật lộ trình đóng gói và vận chuyển từ Ia Mơ Nông, Gia Lai.
          </p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5DACB] shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              required
              placeholder="Mã đơn hàng (VD: JRAI-ORD-72811)..."
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-4 py-3 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white font-mono tracking-wider"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <input
              type="tel"
              placeholder="Số điện thoại nhận hàng (tùy chọn)..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-[#FBF8F3] border border-[#E5DACB] rounded-xl px-4 py-3 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full h-full min-h-[44px] bg-[#C43B3D] hover:bg-[#A83232] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>TRA CỨU TIẾN TRÌNH</span>
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-xs text-[#5D554D] pt-2 border-t border-[#E5DACB]">
          <span>Gợi ý thử nghiệm nhanh:</span>
          <button
            type="button"
            onClick={sampleOrder}
            className="text-[#C43B3D] hover:underline font-bold"
          >
            Điền mã đơn mẫu thử nghiệm &rarr;
          </button>
        </div>
      </div>

      {/* NOT FOUND NOTIFICATION */}
      {notFound && (
        <div className="bg-white p-10 rounded-2xl border border-red-200 text-center space-y-3 shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-base font-serif font-bold text-red-700">
            Không tìm thấy thông tin đơn hàng &quot;{orderCode}&quot;
          </h3>
          <p className="text-xs text-[#5D554D] max-w-md mx-auto">
            Vui lòng kiểm tra lại mã số đơn hàng trên email/tin nhắn xác nhận, hoặc liên hệ Hotline 0383 451 929 để được hỗ trợ kiểm tra trực tiếp.
          </p>
        </div>
      )}

      {/* ORDER TIMELINE & DETAILS */}
      {order && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Order Header Summary */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5DACB] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DACB] pb-4">
              <div>
                <span className="text-xs font-mono text-[#8A7E72] block">MÃ ĐƠN HÀNG:</span>
                <h2 className="text-xl font-serif font-black text-[#C43B3D] font-mono">
                  {order.code}
                </h2>
                <p className="text-xs text-[#5D554D] mt-0.5">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#8A7E72] block">TRẠNG THÁI HIỆN TẠI:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border mt-1 ${
                    STATUS_CONFIG[order.status]?.badgeBg || 'bg-[#F2ECE1] border-[#E5DACB]'
                  } ${STATUS_CONFIG[order.status]?.color || 'text-[#1F1D1B]'}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{STATUS_CONFIG[order.status]?.label || order.status}</span>
                </span>
              </div>
            </div>

            {/* VISUAL 5-STEP TIMELINE */}
            {order.status !== 'cancelled' ? (
              <div className="py-4">
                <h4 className="text-xs font-bold text-[#8A7E72] uppercase tracking-wider mb-6">
                  Tiến trình xử lý đơn hàng:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center relative">
                  {[
                    { key: 'pending', title: '1. Chờ xác nhận', desc: 'Đã nhận đơn' },
                    { key: 'confirmed', title: '2. Đã xác nhận', desc: 'Đã duyệt đơn' },
                    { key: 'processing', title: '3. Đóng gói', desc: 'HTX chuẩn bị & tem QR' },
                    { key: 'shipping', title: '4. Đang giao', desc: 'Đang vận chuyển' },
                    { key: 'delivered', title: '5. Đã giao', desc: 'Giao thành công' },
                  ].map((step, idx) => {
                    const currentStepNum = STATUS_CONFIG[order.status]?.step || 1;
                    const isPassed = currentStepNum >= idx + 1;
                    const isCurrent = currentStepNum === idx + 1;

                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-2xl border transition ${
                          isCurrent
                            ? 'bg-[#FFF9F2] border-[#EA8E23] ring-2 ring-[#EA8E23]/30 shadow-sm'
                            : isPassed
                            ? 'bg-[#F0FDF4] border-emerald-300'
                            : 'bg-[#FBF8F3] border-[#E5DACB] opacity-60'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full mx-auto mb-2 text-xs font-bold flex items-center justify-center ${
                            isCurrent
                              ? 'bg-[#EA8E23] text-white shadow-sm'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#E5DACB] text-[#8A7E72]'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <h5
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#C43B3D]'
                              : isPassed
                              ? 'text-emerald-800'
                              : 'text-[#8A7E72]'
                          }`}
                        >
                          {step.title}
                        </h5>
                        <p className="text-xs text-[#5D554D] mt-0.5">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700">
                Đơn hàng này đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hotline JRAI ƠI để được hỗ trợ.
              </div>
            )}

            {/* TIMELINE ACTIVITY LOG */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="pt-4 border-t border-[#E5DACB] space-y-3">
                <h4 className="text-xs font-bold text-[#8A7E72] uppercase tracking-wider">
                  Nhật ký cập nhật chi tiết:
                </h4>
                <div className="space-y-2.5">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#EA8E23] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[#1F1D1B] font-medium">{h.description}</p>
                        <span className="text-xs text-[#8A7E72] font-mono">
                          {new Date(h.time).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ORDER ITEMS & RECIPIENT CARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recipient info */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5DACB] space-y-3 text-xs shadow-sm text-[#1F1D1B]">
              <h3 className="font-serif font-bold text-sm !text-[#1F1D1B] flex items-center gap-2 border-b border-[#E5DACB] pb-3">
                <MapPin className="w-4 h-4 text-[#EA8E23]" />
                <span>Thông Tin Nhận Hàng</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#8A7E72]">Người nhận:</span>
                  <span className="font-bold text-[#1F1D1B] text-right">{order.customerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#8A7E72]">Số điện thoại:</span>
                  <span className="font-mono font-bold text-[#1F1D1B] text-right">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EFEB]">
                  <span className="text-[#8A7E72] shrink-0">Địa chỉ giao:</span>
                  <span className="text-[#5D554D] text-right max-w-[240px] leading-relaxed">
                    {order.shippingAddress}, {order.ward}, {order.district}, {order.province}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8A7E72]">Thanh toán:</span>
                  <span className="text-[#C43B3D] font-bold text-right">
                    {order.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}
                  </span>
                </div>
              </div>
            </div>

            {/* Product list */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5DACB] space-y-3 text-xs shadow-sm text-[#1F1D1B]">
              <h3 className="font-serif font-bold text-sm !text-[#1F1D1B] flex items-center gap-2 border-b border-[#E5DACB] pb-3">
                <Package className="w-4 h-4 text-[#EA8E23]" />
                <span>Chi Tiết Sản Phẩm</span>
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-[#F5EFEB] text-[#1F1D1B]">
                    <span className="font-medium leading-snug pr-2">
                      {it.quantity} x {it.productName}
                    </span>
                    <span className="font-mono font-bold text-[#C43B3D]">
                      {it.totalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E5DACB] flex justify-between font-bold text-[#1F1D1B] text-sm">
                <span>Tổng giá trị đơn:</span>
                <span className="text-[#C43B3D] font-mono text-base font-extrabold">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF8F3] py-20 text-center text-[#5D554D]">Đang tải trang tra cứu đơn hàng...</div>}>
      <OrderTrackingContent />
    </React.Suspense>
  );
}
