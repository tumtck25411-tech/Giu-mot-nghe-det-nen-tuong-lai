'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Clock, MapPin, ChevronRight, QrCode } from 'lucide-react';
import { getProducts, getMotifs, getArtisans, syncWithServer } from '@/lib/data-store';
import { Product, Motif, Artisan } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMotif, setSelectedMotif] = useState('all');

  useEffect(() => {
    const loadData = () => {
      setProducts(getProducts(true));
      setMotifs(getMotifs(true));
      setArtisans(getArtisans());
    };

    loadData();
    syncWithServer().then(() => loadData());

    if (typeof window !== 'undefined') {
      window.addEventListener('jrai_store_updated', loadData);
      return () => window.removeEventListener('jrai_store_updated', loadData);
    }
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    const matchesMotif =
      selectedMotif === 'all' || (p.motif_ids && p.motif_ids.includes(selectedMotif));

    return matchesSearch && matchesCategory && matchesMotif;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-8 sm:p-10 rounded-3xl border border-amber-900/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-950 text-amber-300 text-xs font-bold px-3 py-1 rounded-md border border-amber-800/40 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Tra Cứu Dữ Liệu Số</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            Tra Cứu Sản Phẩm Thổ Cẩm Jrai
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Tra cứu thông tin minh bạch về mã sản phẩm, thời gian dệt, hoa văn sử dụng và câu chuyện văn hóa nghệ nhân địa phương.
          </p>
        </div>
      </div>

      {/* SEARCH BAR & FILTERS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Keyword Search Input */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Nhập tên sản phẩm, mã sản phẩm (VD: JRAI-P001), hoa văn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 text-slate-900"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-800 text-slate-900"
            >
              <option value="all">Tất cả loại sản phẩm</option>
              {categories.filter((c) => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Motif Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedMotif}
              onChange={(e) => setSelectedMotif(e.target.value)}
              className="w-full py-3 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-800 text-slate-900"
            >
              <option value="all">Tất cả hoa văn liên kết</option>
              {motifs.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.motif_code} - {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm thổ cẩm.</span>
          {(searchTerm || selectedCategory !== 'all' || selectedMotif !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedMotif('all');
              }}
              className="text-amber-800 hover:underline font-bold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-slate-500 text-sm">Không tìm thấy sản phẩm phù hợp với từ khóa tra cứu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const artisan = artisans.find((a) => a.id === product.artisan_id);
            const linkedMotifs = motifs.filter((m) => product.motif_ids?.includes(m.id));

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all group flex flex-col"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/90 text-amber-300 font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-amber-800/40">
                    {product.product_code}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-800 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Linked Motifs Badges */}
                  {linkedMotifs.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Hoa văn dệt:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {linkedMotifs.map((m) => (
                          <Link
                            key={m.id}
                            href={`/motif/${m.id}`}
                            className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded hover:bg-amber-200 transition"
                          >
                            {m.motif_code}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Thực hiện: {product.production_time}</span>
                    </div>
                    {artisan && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="font-bold text-slate-700">Nghệ nhân:</span>
                        <span>{artisan.name}</span>
                      </div>
                    )}

                    <Link
                      href={`/product/${product.id}`}
                      className="flex items-center justify-center gap-1.5 w-full bg-stone-900 hover:bg-amber-900 text-white font-bold py-3 rounded-xl transition text-xs mt-2"
                    >
                      <span>Xem Thông Tin & Quét QR</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
