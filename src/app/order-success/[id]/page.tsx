'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  QrCode,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { getOrderById } from '@/lib/data-store';
import { Order } from '@/types';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const foundOrder = getOrderById(id);
      if (foundOrder) setOrder(foundOrder);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-[#1F1D1B]">Đang tải thông tin đơn hàng...</h1>
        <p className="text-xs text-[#5D554D]">Nếu trang không hiển thị, vui lòng kiểm tra lại mã đơn hàng.</p>
        <Link
          href="/order-tracking"
          className="inline-flex items-center gap-2 bg-[#C43B3D] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#A83232] transition"
        >
          <span>Đến trang tra cứu đơn hàng</span>
        </Link>
      </div>
    );
  }

  // VietQR Dynamic URL (MB Bank - 0383451929)
  const vietQrUrl = `https://api.vietqr.io/image/970422-0383451929-compact2.jpg?amount=${order.totalAmount}&addInfo=${encodeURIComponent(
    order.code
  )}&accountName=${encodeURIComponent('JRAI OI HANDICRAFT')}`;

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
      {/* 3-Step Breadcrumb Progress Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#E5DACB] -z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#F2ECE1] text-[#1F1D1B] font-bold text-xs flex items-center justify-center border-2 border-[#E5DACB] shadow-sm">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#5D554D]">GIỎ HÀNG</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#F2ECE1] text-[#1F1D1B] font-bold text-xs flex items-center justify-center border-2 border-[#E5DACB] shadow-sm">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#5D554D]">THANH TOÁN</span>
          </div>

          {/* Step 3: Active */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border-2 border-emerald-500 shadow-md">
              ✓
            </div>
            <span className="text-xs font-bold text-emerald-700">HOÀN TẤT</span>
          </div>
        </div>
      </div>

      {/* Success Hero Header */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-emerald-500/40 shadow-sm text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-600 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-block">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest inline-block">
            ĐẶT HÀNG THÀNH CÔNG
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black !text-[#1F1D1B] tracking-tight">
          Cảm Ơn Quý Khách Đã Đồng Hành Cùng JRAI ƠI!
        </h1>
        <p className="text-xs sm:text-sm text-[#5D554D] max-w-xl mx-auto leading-relaxed">
          Đơn hàng của bạn đã được tiếp nhận thành công. Nhân viên JRAI ƠI sẽ sớm liên hệ xác nhận và bàn giao đơn cho HTX Dệt Ia Mơ Nông để kiểm tra, đóng gói kèm tem mã QR số hóa.
        </p>

        <div className="pt-2 inline-flex items-center gap-2 bg-[#FBF8F3] border border-[#E5DACB] px-5 py-2.5 rounded-xl text-xs font-mono shadow-sm">
          <span className="text-[#8A7E72] font-semibold">MÃ ĐƠN HÀNG:</span>
          <strong className="text-[#C43B3D] text-base font-bold tracking-wider">{order.code}</strong>
        </div>
      </div>

      {/* Payment Instruction (if Banking) */}
      {order.paymentMethod === 'banking' && (
        <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border-2 border-[#EA8E23] shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E5DACB] pb-4">
            <QrCode className="w-6 h-6 text-[#EA8E23]" />
            <div>
              <h2 className="text-base font-serif font-bold !text-[#1F1D1B]">
                Thanh Toán Chuyển Khoản Qua Mã VietQR
              </h2>
              <p className="text-xs text-[#5D554D]">
                Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã thanh toán chính xác:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-[#E5DACB] max-w-[240px]">
                <img
                  src={vietQrUrl}
                  alt="VietQR MB Bank"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-xs text-[#5D554D] text-center font-mono mt-1.5 font-bold">
                  Quét bằng mọi ứng dụng ngân hàng
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#1F1D1B]">
              <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] space-y-1">
                <span className="text-[#8A7E72] block">Ngân hàng thụ hưởng:</span>
                <strong className="text-[#1F1D1B] font-bold">MB Bank (Ngân hàng Quân Đội)</strong>
              </div>
              <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] space-y-1">
                <span className="text-[#8A7E72] block">Số tài khoản:</span>
                <strong className="text-[#C43B3D] text-base font-mono font-bold">0383451929</strong>
              </div>
              <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] space-y-1">
                <span className="text-[#8A7E72] block">Chủ tài khoản:</span>
                <strong className="text-[#1F1D1B] font-bold">JRAI OI HANDICRAFT GIA LAI</strong>
              </div>
              <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] space-y-1">
                <span className="text-[#8A7E72] block">Số tiền thanh toán:</span>
                <strong className="text-emerald-700 text-base font-mono font-bold">
                  {order.totalAmount.toLocaleString('vi-VN')}₫
                </strong>
              </div>
              <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] space-y-1">
                <span className="text-[#8A7E72] block">Nội dung chuyển khoản (Syntax):</span>
                <strong className="text-[#C43B3D] font-mono font-bold">{order.code}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details & Customer Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DACB] space-y-3 text-xs shadow-sm">
          <h3 className="font-serif font-bold text-sm !text-[#1F1D1B] flex items-center gap-2 border-b border-[#E5DACB] pb-3">
            <MapPin className="w-4 h-4 text-[#EA8E23]" />
            <span>Địa Chỉ Nhận Hàng</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-baseline py-1 border-b border-[#F5EFEB]">
              <span className="text-[#8A7E72] font-medium">Người nhận:</span>
              <span className="font-bold text-[#1F1D1B] text-right">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-[#F5EFEB]">
              <span className="text-[#8A7E72] font-medium">Số điện thoại:</span>
              <span className="font-mono font-bold text-[#1F1D1B] text-right">{order.customerPhone}</span>
            </div>
            {order.customerEmail && (
              <div className="flex justify-between items-baseline py-1 border-b border-[#F5EFEB]">
                <span className="text-[#8A7E72] font-medium">Email:</span>
                <span className="text-[#5D554D] text-right">{order.customerEmail}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline py-1 border-b border-[#F5EFEB]">
              <span className="text-[#8A7E72] font-medium shrink-0">Địa chỉ:</span>
              <span className="text-[#5D554D] text-right max-w-[240px] leading-relaxed">
                {order.shippingAddress}, {order.ward}, {order.district}, {order.province}
              </span>
            </div>
            <div className="flex justify-between items-baseline py-1">
              <span className="text-[#8A7E72] font-medium">Phương thức:</span>
              <span className="text-[#C43B3D] font-bold text-right">
                {order.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}
              </span>
            </div>
            {order.orderNotes && (
              <div className="pt-2 text-xs italic text-[#8A7E72] bg-[#FBF8F3] p-2.5 rounded-lg border border-[#E5DACB]">
                <strong className="text-[#1F1D1B]">Ghi chú:</strong> {order.orderNotes}
              </div>
            )}
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DACB] space-y-3 text-xs shadow-sm">
          <h3 className="font-serif font-bold text-sm !text-[#1F1D1B] flex items-center gap-2 border-b border-[#E5DACB] pb-3">
            <Package className="w-4 h-4 text-[#EA8E23]" />
            <span>Sản Phẩm Đã Đặt ({order.items.length})</span>
          </h3>
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-[#F5EFEB]">
                <span className="font-semibold text-[#1F1D1B] leading-snug pr-2">
                  {item.quantity} x {item.productName}
                </span>
                <span className="font-mono font-bold text-[#C43B3D]">
                  {item.totalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E5DACB] space-y-1.5 text-xs text-[#5D554D]">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span className="font-mono font-semibold text-[#1F1D1B]">{order.subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng:</span>
              <span>
                {order.shippingFee === 0 ? (
                  <strong className="text-emerald-700 font-bold">MIỄN PHÍ</strong>
                ) : (
                  <span className="font-mono font-semibold text-[#1F1D1B]">{order.shippingFee.toLocaleString('vi-VN')}₫</span>
                )}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#EA8E23] font-bold">
                <span>Giảm giá ({order.discountCode}):</span>
                <span className="font-mono">-{order.discountAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#1F1D1B] text-sm pt-2 border-t border-[#E5DACB]">
              <span>Tổng thanh toán:</span>
              <span className="text-[#C43B3D] font-mono text-base font-extrabold">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation CTA Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5DACB]">
        <Link
          href={`/order-tracking?code=${order.code}&phone=${order.customerPhone}`}
          className="inline-flex items-center gap-2 bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] font-bold text-xs px-6 py-3 rounded-xl border border-[#D5C6B3] shadow-sm transition"
        >
          <Truck className="w-4 h-4 text-[#C43B3D]" />
          <span>Theo Dõi Tiến Trình Đơn Hàng</span>
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#C43B3D] hover:bg-[#A83232] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition"
        >
          <span>Tiếp Tục Mua Sắm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  </div>
  );
}
