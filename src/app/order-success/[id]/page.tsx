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
        <h1 className="text-2xl font-serif font-bold text-white">Đang tải thông tin đơn hàng...</h1>
        <p className="text-xs text-stone-400">Nếu trang không hiển thị, vui lòng kiểm tra lại mã đơn hàng.</p>
        <Link
          href="/order-tracking"
          className="inline-flex items-center gap-2 bg-[#B9383A] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow"
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 3-Step Breadcrumb Progress Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-stone-800 -z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#231C18] text-amber-400 font-bold text-xs flex items-center justify-center border-2 border-stone-700">
              ✓
            </div>
            <span className="text-xs font-semibold text-stone-500">GIỎ HÀNG</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#231C18] text-amber-400 font-bold text-xs flex items-center justify-center border-2 border-stone-700">
              ✓
            </div>
            <span className="text-xs font-semibold text-stone-500">THANH TOÁN</span>
          </div>

          {/* Step 3: Active */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border-2 border-emerald-400 shadow-lg">
              3
            </div>
            <span className="text-xs font-bold text-emerald-400">HOÀN TẤT</span>
          </div>
        </div>
      </div>

      {/* Success Hero Header */}
      <div className="bg-[#1C1714] p-8 sm:p-12 rounded-3xl border border-emerald-500/50 shadow-2xl text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
          ĐẶT HÀNG THÀNH CÔNG
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-white">
          Cảm Ơn Quý Khách Đã Đồng Hành Cùng JRAI ƠI!
        </h1>
        <p className="text-xs text-stone-300 max-w-lg mx-auto leading-relaxed">
          Đơn hàng của bạn đã được tiếp nhận thành công. Nhân viên JRAI ƠI sẽ sớm liên hệ xác nhận và bàn giao đơn cho HTX Dệt Ia Mơ Nông để kiểm tra, đóng gói kèm tem mã QR số hóa.
        </p>

        <div className="pt-2 inline-flex items-center gap-2 bg-stone-900 border border-stone-700 px-4 py-2 rounded-xl text-xs font-mono text-amber-300">
          <span>MÃ ĐƠN HÀNG:</span>
          <strong className="text-white text-sm">{order.code}</strong>
        </div>
      </div>

      {/* Payment Instruction (if Banking) */}
      {order.paymentMethod === 'banking' && (
        <div className="bg-[#231C18] p-6 sm:p-8 rounded-3xl border border-amber-500/50 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
            <QrCode className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base font-serif font-bold text-white">
                Thanh Toán Chuyển Khoản Qua Mã VietQR
              </h2>
              <p className="text-xs text-stone-400">
                Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã thanh toán chính xác:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-2xl shadow-xl border border-stone-700 max-w-[240px]">
                <img
                  src={vietQrUrl}
                  alt="VietQR MB Bank"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-[10px] text-stone-600 text-center font-mono mt-1 font-bold">
                  Quét bằng mọi ứng dụng ngân hàng
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-500 block">Ngân hàng thụ hưởng:</span>
                <strong className="text-white">MB Bank (Ngân hàng Quân Đội)</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-500 block">Số tài khoản:</span>
                <strong className="text-amber-400 text-base font-mono">0383451929</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-500 block">Chủ tài khoản:</span>
                <strong className="text-white">JRAI OI HANDICRAFT GIA LAI</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-500 block">Số tiền thanh toán:</span>
                <strong className="text-emerald-400 text-base font-mono">
                  {order.totalAmount.toLocaleString('vi-VN')}₫
                </strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-500 block">Nội dung chuyển khoản (Syntax):</span>
                <strong className="text-amber-300 font-mono">{order.code}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details & Customer Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping */}
        <div className="bg-[#1C1714] p-6 rounded-3xl border border-amber-900/40 space-y-3 text-xs shadow-lg">
          <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800 pb-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Địa Chỉ Nhận Hàng</span>
          </h3>
          <p>
            <strong className="text-stone-300">Người nhận:</strong> {order.customerName}
          </p>
          <p>
            <strong className="text-stone-300">Số điện thoại:</strong> {order.customerPhone}
          </p>
          {order.customerEmail && (
            <p>
              <strong className="text-stone-300">Email:</strong> {order.customerEmail}
            </p>
          )}
          <p>
            <strong className="text-stone-300">Địa chỉ:</strong> {order.shippingAddress}, {order.ward}, {order.district}, {order.province}
          </p>
          <p>
            <strong className="text-stone-300">Phương thức:</strong>{' '}
            {order.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}
          </p>
          {order.orderNotes && (
            <p className="italic text-stone-400">
              <strong>Ghi chú:</strong> {order.orderNotes}
            </p>
          )}
        </div>

        {/* Items Summary */}
        <div className="bg-[#1C1714] p-6 rounded-3xl border border-amber-900/40 space-y-3 text-xs shadow-lg">
          <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800 pb-2">
            <Package className="w-4 h-4 text-amber-500" />
            <span>Sản Phẩm Đã Đặt ({order.items.length})</span>
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-stone-300">
                <span className="truncate max-w-[200px]">
                  {item.quantity} x {item.productName}
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {item.totalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-800 space-y-1">
            <div className="flex justify-between text-stone-400">
              <span>Tạm tính:</span>
              <span>{order.subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Phí giao hàng:</span>
              <span>{order.shippingFee === 0 ? 'Miễn phí' : `${order.shippingFee.toLocaleString('vi-VN')}₫`}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-amber-400 font-bold">
                <span>Giảm giá ({order.discountCode}):</span>
                <span>-{order.discountAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-stone-800">
              <span>Tổng thanh toán:</span>
              <span className="text-amber-400 font-mono">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation CTA Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800">
        <Link
          href={`/order-tracking?code=${order.code}&phone=${order.customerPhone}`}
          className="inline-flex items-center gap-2 bg-[#2A1E17] hover:bg-[#382B23] text-amber-300 font-bold text-xs px-6 py-3 rounded-xl border border-amber-800/50 shadow transition"
        >
          <Truck className="w-4 h-4" />
          <span>Theo Dõi Tiến Trình Đơn Hàng</span>
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#B9383A] hover:bg-[#A83232] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
        >
          <span>Tiếp Tục Mua Sắm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
