'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { QrCode, Search, Download, Printer, Copy, Check, ExternalLink, Info } from 'lucide-react';
import { getProducts } from '@/lib/data-store';
import { Product } from '@/types';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function AdminQRManagerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const prods = getProducts();
    setProducts(prods);
    if (prods.length > 0) {
      setSelectedProductId(prods[0].id);
    }
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productUrl = selectedProduct
    ? typeof window !== 'undefined'
      ? `${window.location.origin}/product/${selectedProduct.id}`
      : `https://detnentuonglai.vn/product/${selectedProduct.id}`
    : '';

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Quản Lý & Tạo Mã QR Sản Phẩm"
        subtitle="Mã QR trỏ trực tiếp đến URL động sản phẩm trên website. Admin thay đổi thông tin không cần thay mã QR."
      />

      <div className="px-8 space-y-6">
        {/* Core principle banner */}
        <div className="bg-amber-950 text-white p-6 rounded-3xl border border-amber-800/40 flex items-start gap-4">
          <Info className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs leading-relaxed">
            <h4 className="font-bold text-sm text-amber-200">
              Quy Tắc Quản Lý Mã QR Động
            </h4>
            <p className="text-stone-300">
              Tất cả mã QR được tạo từ đây chứa URL chính thức của sản phẩm (ví dụ: <code>/product/tui-jrai-001</code>). Khi Admin thay đổi hình ảnh, thời gian dệt (5 ngày → 7 ngày), hay câu chuyện nghệ nhân, <strong>mã QR in trên sản phẩm thực tế giữ nguyên giá trị sử dụng.</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Selector */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              1. Chọn Sản Phẩm Cần Tạo Mã QR
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = p.id === selectedProductId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-800 ring-2 ring-amber-800/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-bold text-xs text-amber-900">{p.product_code}</div>
                      <div className="font-bold text-xs text-slate-900 truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: QR Generator & Output Actions */}
          <div className="lg:col-span-7 space-y-6">
            {selectedProduct ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-amber-800 text-white px-2 py-0.5 rounded">
                      {selectedProduct.product_code}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mt-1">
                      {selectedProduct.name}
                    </h3>
                  </div>
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <span>Mở trang sản phẩm</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* QR Component */}
                <QRCodeGenerator
                  productUrl={productUrl}
                  productName={selectedProduct.name}
                  productCode={selectedProduct.product_code}
                  category={selectedProduct.category}
                  location={selectedProduct.location}
                />
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center text-slate-500 border border-slate-200 text-xs">
                Vui lòng chọn một sản phẩm từ danh sách bên trái để tạo mã QR.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
