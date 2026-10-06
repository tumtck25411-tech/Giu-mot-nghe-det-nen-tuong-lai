'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid, Search, ShieldCheck, ChevronRight, Award } from 'lucide-react';
import { getMotifs, getProducts, syncWithServer } from '@/lib/data-store';
import { Motif, Product } from '@/types';

export default function MotifsPage() {
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = () => {
      setMotifs(getMotifs(true));
      setProducts(getProducts(true));
    };

    loadData();
    syncWithServer().then(() => loadData());

    if (typeof window !== 'undefined') {
      window.addEventListener('jrai_store_updated', loadData);
      return () => window.removeEventListener('jrai_store_updated', loadData);
    }
  }, []);

  const filteredMotifs = motifs.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.motif_code.toLowerCase().includes(term) ||
      m.name.toLowerCase().includes(term) ||
      m.meaning.toLowerCase().includes(term) ||
      m.origin.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-8 sm:p-10 rounded-3xl border border-amber-900/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-950 text-amber-300 text-xs font-bold px-3 py-1 rounded-md border border-amber-800/40 uppercase tracking-wider">
            <Grid className="w-3.5 h-3.5" />
            <span>Kho Tri Thức Di Sản Trung Tâm</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            Ngân Hàng Số Hoa Văn Jrai Central
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Mỗi hoa văn Jrai cổ truyền đại diện cho một biểu tượng tri thức dân gian. Được xác minh minh bạch nguồn gốc và liên kết với các sản phẩm thổ cẩm vật thể.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tra cứu theo mã hoa văn (VD: JRAI-001), tên hoa văn, ý nghĩa hoặc nguồn gốc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 text-slate-900"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Hiển thị {filteredMotifs.length} mã hoa văn trung tâm.</span>
        </div>
      </div>

      {/* MOTIFS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMotifs.map((motif) => {
          const usedProducts = products.filter((p) => p.motif_ids?.includes(motif.id));

          return (
            <div
              key={motif.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={motif.image_url}
                    alt={motif.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-amber-800 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                    {motif.motif_code}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-800/40">
                    {usedProducts.length} Sản phẩm sử dụng
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-serif font-bold text-slate-900 text-lg group-hover:text-amber-800 transition-colors">
                    {motif.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {motif.meaning}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {motif.colors?.map((col, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {col}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Xác minh: {motif.verification_source}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/motif/${motif.id}`}
                  className="flex items-center justify-center gap-1.5 w-full bg-stone-900 hover:bg-amber-900 text-white font-bold py-2.5 rounded-xl transition text-xs"
                >
                  <span>Xem Chi Tiết & Sản Phẩm Dùng</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
