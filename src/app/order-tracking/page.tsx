'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { getOrderByCodeAndPhone, getOrderById, getOrders, syncWithServer } from '@/lib/data-store';
import { Order, OrderStatus } from '@/types';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; step: number; color: string; badgeBg: string }
> = {
  pending: { label: 'Chờ xác nhận', step: 1, color: 'text-amber-400', badgeBg: 'bg-amber-950/80 border-amber-700/60' },
  confirmed: { label: 'Đã xác nhận', step: 2, color: 'text-blue-400', badgeBg: 'bg-blue-950/80 border-blue-700/60' },
  processing: { label: 'Đang chuẩn bị hàng', step: 3, color: 'text-purple-400', badgeBg: 'bg-purple-950/80 border-purple-700/60' },
  shipping: { label: 'Đang giao hàng', step: 4, color: 'text-indigo-400', badgeBg: 'bg-indigo-950/80 border-indigo-700/60' },
  delivered: { label: 'Đã giao hàng thành công', step: 5, color: 'text-emerald-400', badgeBg: 'bg-emerald-950/80 border-emerald-700/60' },
  cancelled: { label: 'Đã hủy đơn hàng', step: 0, color: 'text-red-400', badgeBg: 'bg-red-950/80 border-red-700/60' },
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
    syncWithServer();
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-12 rounded-xl border border-amber-900/40 relative overflow-hidden shadow-sm text-center">
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
      <div className="bg-[#1C1714] p-6 sm:p-8 rounded-xl border border-amber-900/40 shadow-xl space-y-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              required
              placeholder="Mã đơn hàng (VD: JRAI-ORD-72811)..."
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <input
              type="tel"
              placeholder="Số điện thoại nhận hàng (tùy chọn)..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full h-full min-h-[44px] bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold rounded-xl shadow border border-amber-400/40 transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>TRA CỨU TIẾN TRÌNH</span>
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-t border-stone-800">
          <span>Gợi ý thử nghiệm nhanh:</span>
          <button
            type="button"
            onClick={sampleOrder}
            className="text-amber-400 hover:underline font-bold"
          >
            Điền mã đơn mẫu thử nghiệm &rarr;
          </button>
        </div>
      </div>

      {/* NOT FOUND NOTIFICATION */}
      {notFound && (
        <div className="bg-[#1C1714] p-10 rounded-xl border border-red-900/40 text-center space-y-3 shadow-lg">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="text-base font-serif font-bold text-white">
            Không tìm thấy thông tin đơn hàng &quot;{orderCode}&quot;
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Vui lòng kiểm tra lại mã số đơn hàng trên email/tin nhắn xác nhận, hoặc liên hệ Hotline 0383 451 929 để được hỗ trợ kiểm tra trực tiếp.
          </p>
        </div>
      )}

      {/* ORDER TIMELINE & DETAILS */}
      {order && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Order Header Summary */}
          <div className="bg-[#1C1714] p-6 sm:p-8 rounded-xl border border-amber-900/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-mono text-stone-400 block">MÃ ĐƠN HÀNG:</span>
                <h2 className="text-xl font-serif font-black text-amber-400 font-mono">
                  {order.code}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-400 block">TRẠNG THÁI HIỆN TẠI:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border mt-1 ${
                    STATUS_CONFIG[order.status]?.badgeBg || 'bg-stone-900'
                  } ${STATUS_CONFIG[order.status]?.color || 'text-white'}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{STATUS_CONFIG[order.status]?.label || order.status}</span>
                </span>
              </div>
            </div>

            {/* VISUAL 5-STEP TIMELINE */}
            {order.status !== 'cancelled' ? (
              <div className="py-4">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-6">
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
                            ? 'bg-[#2A1E17] border-amber-400 ring-2 ring-amber-400/20'
                            : isPassed
                            ? 'bg-[#231C18] border-emerald-700/60'
                            : 'bg-[#14100E] border-stone-800 opacity-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full mx-auto mb-2 text-xs font-bold flex items-center justify-center ${
                            isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <h5
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-amber-400'
                              : isPassed
                              ? 'text-white'
                              : 'text-stone-500'
                          }`}
                        >
                          {step.title}
                        </h5>
                        <p className="text-xs text-stone-400 mt-0.5">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-950/60 rounded-2xl border border-red-800 text-xs text-red-300">
                Đơn hàng này đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hotline JRAI ƠI để được hỗ trợ.
              </div>
            )}

            {/* TIMELINE ACTIVITY LOG */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="pt-4 border-t border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Nhật ký cập nhật chi tiết:
                </h4>
                <div className="space-y-2.5">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-stone-200">{h.description}</p>
                        <span className="text-xs text-stone-500 font-mono">
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
            <div className="bg-[#1C1714] p-6 rounded-xl border border-amber-900/40 space-y-3 text-xs shadow-lg">
              <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Thông Tin Nhận Hàng</span>
              </h3>
              <p>
                <strong className="text-stone-400">Người nhận:</strong> {order.customerName}
              </p>
              <p>
                <strong className="text-stone-400">Số điện thoại:</strong> {order.customerPhone}
              </p>
              <p>
                <strong className="text-stone-400">Địa chỉ giao:</strong> {order.shippingAddress}, {order.ward}, {order.district}, {order.province}
              </p>
              <p>
                <strong className="text-stone-400">Thanh toán:</strong>{' '}
                {order.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}
              </p>
            </div>

            {/* Product list */}
            <div className="bg-[#1C1714] p-6 rounded-xl border border-amber-900/40 space-y-3 text-xs shadow-lg">
              <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                <Package className="w-4 h-4 text-amber-500" />
                <span>Chi Tiết Sản Phẩm</span>
              </h3>
              <div className="space-y-2">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-300">
                    <span className="truncate max-w-[200px]">
                      {it.quantity} x {it.productName}
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {it.totalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-white text-sm">
                <span>Tổng giá trị đơn:</span>
                <span className="text-amber-400 font-mono">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#14110F] py-20 text-center text-stone-400">Đang tải trang tra cứu đơn hàng...</div>}>
      <OrderTrackingContent />
    </React.Suspense>
  );
}
