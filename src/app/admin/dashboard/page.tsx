'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import {
  Package,
  Grid,
  Users,
  Plus,
  QrCode,
  FileText,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Percent,
} from 'lucide-react';
import {
  getProducts,
  getMotifs,
  getArtisans,
  getOrders,
  getAdminSession,
  syncWithServer,
} from '@/lib/data-store';
import { Product, Motif, Artisan, Order } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const admin = getAdminSession();
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    const loadData = () => {
      setProducts(getProducts());
      setMotifs(getMotifs());
      setArtisans(getArtisans());
      setOrders(getOrders());
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, [router]);

  // E-Commerce Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const shippingOrders = orders.filter((o) => o.status === 'shipping');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const inStockCount = products.filter((p) => p.in_stock).length;
  const outOfStockCount = products.length - inStockCount;

  return (
    <div className="space-y-8 pb-12 bg-[#0D0B0A] text-stone-200 min-h-screen">
      <AdminHeader
        title="Tổng Quan Quản Trị JRAI ƠI"
        subtitle="Hệ thống quản lý thương mại điện tử & dữ liệu số hóa thổ cẩm Gia Lai"
      />

      <div className="px-6 lg:px-8 space-y-8">
        {/* OVERVIEW STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-[#181411] p-6 rounded-xl border border-amber-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Tổng Doanh Thu
              </span>
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {totalRevenue.toLocaleString('vi-VN')}₫
            </div>
            <p className="text-xs text-stone-500">Từ {orders.length} đơn hàng ghi nhận</p>
          </div>

          {/* Orders */}
          <div className="bg-[#181411] p-6 rounded-xl border border-amber-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Đơn Hàng Mới Cần Xử Lý
              </span>
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {pendingOrders.length} <span className="text-base font-normal text-stone-400">/ {orders.length}</span>
            </div>
            <p className="text-xs text-amber-400">
              {shippingOrders.length} đơn đang giao • {deliveredOrders.length} đã giao
            </p>
          </div>

          {/* Products & Inventory */}
          <div className="bg-[#181411] p-6 rounded-xl border border-amber-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Tổng Sản Phẩm Kho
              </span>
              <Package className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{products.length}</div>
            <p className="text-xs text-emerald-400">
              {inStockCount} còn hàng • {outOfStockCount} hết hàng
            </p>
          </div>

          {/* Motifs & Artisans */}
          <div className="bg-[#181411] p-6 rounded-xl border border-amber-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Di Sản Số Hóa
              </span>
              <Grid className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {motifs.length} <span className="text-sm font-normal text-stone-400">hoa văn</span>
            </div>
            <p className="text-xs text-stone-400">{artisans.length} nghệ nhân giữ nghề</p>
          </div>
        </div>

        {/* QUICK MANAGEMENT SHORTCUTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="p-4 bg-[#1E1713] hover:bg-[#2A201A] rounded-2xl border border-amber-900/40 transition flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-white">Quản Lý Đơn Hàng</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition" />
          </Link>

          <Link
            href="/admin/products/new"
            className="p-4 bg-[#1E1713] hover:bg-[#2A201A] rounded-2xl border border-amber-900/40 transition flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-white">Thêm Sản Phẩm Mới</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-emerald-400 transition" />
          </Link>

          <Link
            href="/admin/qr-manager"
            className="p-4 bg-[#1E1713] hover:bg-[#2A201A] rounded-2xl border border-amber-900/40 transition flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-white">In & Quản Lý QR</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-indigo-400 transition" />
          </Link>

          <Link
            href="/admin/promotions"
            className="p-4 bg-[#1E1713] hover:bg-[#2A201A] rounded-2xl border border-amber-900/40 transition flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-white">Khuyến Mãi & Đánh Giá</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition" />
          </Link>
        </div>

        {/* 2-Column: Recent Orders & Best Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders (7 Cols) */}
          <div className="lg:col-span-7 bg-[#181411] p-6 rounded-xl border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Đơn Hàng Gần Đây</span>
              </h3>
              <Link href="/admin/orders" className="text-xs font-bold text-amber-400 hover:underline">
                Xem tất cả ({orders.length}) &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 5).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 bg-[#120F0D] rounded-2xl border border-stone-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{ord.code}</span>
                      <span className="text-xs bg-stone-900 text-stone-400 px-1.5 py-0.5 rounded border border-stone-800">
                        {ord.items.length} món
                      </span>
                    </div>
                    <p className="text-stone-300 font-bold mt-0.5">{ord.customerName}</p>
                    <p className="text-xs text-stone-500 font-mono">{ord.customerPhone}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="font-mono font-black text-white">
                      {ord.totalAmount.toLocaleString('vi-VN')}₫
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800/40">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured/Best Seller Products (5 Cols) */}
          <div className="lg:col-span-5 bg-[#181411] p-6 rounded-xl border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Sản Phẩm Bán Chạy</span>
              </h3>
              <Link href="/admin/products" className="text-xs font-bold text-amber-400 hover:underline">
                Kho hàng &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {products.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 bg-[#120F0D] rounded-2xl border border-stone-800 flex items-center gap-3"
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-xl border border-stone-800 bg-stone-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-amber-500">{p.product_code}</span>
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-xs text-amber-400 font-mono font-bold">
                      {p.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/edit/${p.id}`}
                    className="p-1.5 text-stone-400 hover:text-white bg-stone-900 rounded-lg text-xs"
                  >
                    Sửa
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
