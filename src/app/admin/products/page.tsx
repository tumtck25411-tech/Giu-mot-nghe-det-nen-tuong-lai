'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { Plus, Search, Edit3, Trash2, QrCode, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { getProducts, deleteProduct, updateProduct } from '@/lib/data-store';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      if (deleteProduct(id)) {
        setProducts(getProducts());
        setMessage(`Đã xóa sản phẩm "${name}" thành công.`);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleToggleStatus = (id: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    updateProduct(id, { status: newStatus });
    setProducts(getProducts());
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Quản Lý Sản Phẩm Thổ Cẩm"
        subtitle="Thêm mới, chỉnh sửa thông tin, chọn hoa văn liên kết và xuất bản mã QR"
      />

      <div className="px-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm trong Admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ THÊM SẢN PHẨM MỚI</span>
          </Link>
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold">
            {message}
          </div>
        )}

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-4 px-4">Ảnh</th>
                  <th className="py-4 px-4">Mã SP</th>
                  <th className="py-4 px-4">Tên Sản Phẩm</th>
                  <th className="py-4 px-4">Loại</th>
                  <th className="py-4 px-4">Thời Gian Dệt</th>
                  <th className="py-4 px-4">Địa Điểm</th>
                  <th className="py-4 px-4">Trạng Thái</th>
                  <th className="py-4 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">{p.product_code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3 px-4 text-slate-600">{p.production_time}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">{p.location}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {p.status === 'published' ? 'Đã Xuất Bản' : 'Lưu Nháp'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.id}`}
                          target="_blank"
                          title="Xem trang công khai"
                          className="p-2 text-slate-500 hover:text-amber-800 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          title="Chỉnh sửa sản phẩm"
                          className="p-2 text-amber-800 hover:bg-amber-50 rounded-lg transition font-bold"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Xóa sản phẩm"
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
