'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import {
  Package,
  Grid,
  Users,
  Video,
  Image as ImageIcon,
  Plus,
  QrCode,
  FileText,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { getProducts, getMotifs, getArtisans } from '@/lib/data-store';
import { Product, Motif, Artisan } from '@/types';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);

  useEffect(() => {
    setProducts(getProducts());
    setMotifs(getMotifs());
    setArtisans(getArtisans());
  }, []);

  const totalVideos =
    products.filter((p) => p.video_url).length +
    motifs.filter((m) => m.video_url).length +
    artisans.filter((a) => a.video_url).length;

  const totalImages =
    products.length +
    products.reduce((acc, p) => acc + (p.additional_images?.length || 0), 0) +
    motifs.length +
    artisans.length;

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Tổng Quan Quản Trị"
        subtitle="Hệ thống quản lý dữ liệu Ngân hàng số Hoa văn & Thổ cẩm Jrai"
      />

      <div className="px-8 space-y-8">
        {/* OVERVIEW STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng Sản Phẩm
              </span>
              <Package className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{products.length}</div>
            <p className="text-[11px] text-slate-500">Đã đăng ký hệ thống</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng Hoa Văn
              </span>
              <Grid className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{motifs.length}</div>
            <p className="text-[11px] text-slate-500">Mã hoa văn trung tâm</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng Nghệ Nhân
              </span>
              <Users className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{artisans.length}</div>
            <p className="text-[11px] text-slate-500">Nghệ nhân dệt giữ nghề</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng Video
              </span>
              <Video className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{totalVideos}</div>
            <p className="text-[11px] text-slate-500">Tư liệu video quá trình dệt</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng Hình Ảnh
              </span>
              <ImageIcon className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{totalImages}</div>
            <p className="text-[11px] text-slate-500">Đã lưu Storage</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Thao Tác Quản Trị Nhanh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100/80 rounded-2xl border border-amber-200 text-amber-900 font-bold text-xs transition"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div>+ Thêm Sản Phẩm Mới</div>
                <div className="text-[10px] font-normal text-amber-800/80">Chọn hoa văn & nghệ nhân</div>
              </div>
            </Link>

            <Link
              href="/admin/motifs"
              className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100/80 rounded-2xl border border-amber-200 text-amber-900 font-bold text-xs transition"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center shrink-0">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <div>+ Thêm Hoa Văn Mới</div>
                <div className="text-[10px] font-normal text-amber-800/80">Mã JRAI-XXX & xác minh</div>
              </div>
            </Link>

            <Link
              href="/admin/qr-manager"
              className="flex items-center gap-3 p-4 bg-slate-900 hover:bg-slate-800 rounded-2xl text-white font-bold text-xs transition"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div>Quản Lý & In Mã QR</div>
                <div className="text-[10px] font-normal text-amber-300">Tải PNG/SVG & In thẻ QR</div>
              </div>
            </Link>

            <Link
              href="/admin/content"
              className="flex items-center gap-3 p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 font-bold text-xs transition"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div>Sửa Nội Dung Trang</div>
                <div className="text-[10px] font-normal text-slate-500">Trang chủ, Thổ cẩm...</div>
              </div>
            </Link>
          </div>
        </div>

        {/* RECENT PRODUCTS TABLE PREVIEW */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Danh Sách Sản Phẩm Mới Cập Nhật</h2>
            <Link href="/admin/products" className="text-xs font-bold text-amber-800 hover:underline">
              Quản lý toàn bộ sản phẩm →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mã SP</th>
                  <th className="py-3 px-4">Tên Sản Phẩm</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4">Thời Gian Dệt</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">{p.product_code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3 px-4 text-slate-600">{p.production_time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'published' ? 'Đã xuất bản' : 'Lưu nháp'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/products/edit/${p.id}`}
                        className="text-amber-800 hover:underline font-bold"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
