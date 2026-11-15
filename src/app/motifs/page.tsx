'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Grid, Search, ShieldCheck, ChevronRight, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { getMotifs, getProducts, syncWithServer } from '@/lib/data-store';
import { Motif, Product } from '@/types';

export default function MotifsPage() {
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');

  useEffect(() => {
    const loadData = () => {
      setMotifs(getMotifs(true));
      setProducts(getProducts(true));
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, []);

  const filteredMotifs = useMemo(() => {
    return motifs.filter((m) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.motif_code.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        (m.name_jrai && m.name_jrai.toLowerCase().includes(q)) ||
        m.meaning.toLowerCase().includes(q) ||
        m.technique.toLowerCase().includes(q);

      const matchesTheme = selectedTheme === 'all' || m.theme === selectedTheme;

      return matchesSearch && matchesTheme;
    });
  }, [motifs, searchTerm, selectedTheme]);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-10 rounded-3xl border border-amber-900/40 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full border border-amber-500/40 uppercase tracking-wider">
            <Grid className="w-3.5 h-3.5" />
            <span>Kho Tri Thức Di Sản Bản Địa Jrai</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#FFFDF9]">
            Ngân Hàng Số Hoa Văn Thổ Cẩm Jrai (20 Hoa Văn)
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Hệ thống số hóa 20 hoa văn cổ truyền người Jrai tại Gia Lai. Mỗi hoa văn là một ký hiệu văn hóa ước lệ khắc họa thiên nhiên, vũ trụ quan và đời sống tâm linh đại ngàn, được giải mã và lưu trữ cẩn trọng.
          </p>
        </div>
      </div>

      {/* SEARCH BAR & THEME FILTER */}
      <div className="bg-[#1C1714] p-6 rounded-3xl border border-amber-900/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
            <input
              type="text"
              placeholder="Tra cứu theo mã hoa văn (JRAI-001), tên hoa văn (Con gà, Hình học cổ), ý nghĩa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#120F0D] border border-amber-900/40 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'nature', label: 'Thiên nhiên & Muông thú' },
              { id: 'life', label: 'Đời sống & Con người' },
              { id: 'spiritual', label: 'Tâm linh & Vũ trụ' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  selectedTheme === th.id
                    ? 'bg-[#B9383A] text-white border border-amber-400'
                    : 'bg-[#251E1A] text-stone-300 hover:text-white hover:bg-[#322722] border border-amber-900/40'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
          <span>
            Hiển thị <strong>{filteredMotifs.length}</strong> / {motifs.length} hoa văn số hóa.
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-amber-400 hover:underline font-bold"
            >
              Xóa tìm kiếm &times;
            </button>
          )}
        </div>
      </div>

      {/* MOTIFS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMotifs.map((motif) => {
          const usedProducts = products.filter(
            (p) =>
              p.motif_ids?.includes(motif.id) ||
              p.motif_id === motif.id ||
              motif.applied_product_ids?.includes(p.product_code) ||
              motif.applied_product_ids?.includes(p.id)
          );

          return (
            <div
              key={motif.id}
              className="bg-[#231C18] rounded-2xl overflow-hidden border border-amber-900/30 hover:border-amber-500/60 shadow-lg transition-all group flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-stone-950 p-4 flex items-center justify-center border-b border-stone-800">
                  <img
                    src={motif.image_url}
                    alt={motif.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#B9383A] text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                    {motif.motif_code}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-800/40">
                    {usedProducts.length} Sản phẩm ứng dụng
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                      {motif.theme_name} {motif.name_jrai && `• ${motif.name_jrai}`}
                    </span>
                    <h3 className="font-serif font-bold text-white text-base group-hover:text-amber-400 transition-colors mt-0.5 line-clamp-1">
                      {motif.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                    {motif.meaning || motif.philosophy}
                  </p>

                  <div className="space-y-1 text-[11px] text-stone-400 pt-2 border-t border-stone-800/80">
                    <p>
                      <strong className="text-stone-300">Kỹ thuật:</strong> {motif.technique}
                    </p>
                    {motif.artisan_verification && (
                      <p>
                        <strong className="text-stone-300">Xác thực:</strong> {motif.artisan_verification}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#1C1714] border-t border-stone-800 flex items-center justify-between">
                <Link
                  href={`/motif/${motif.id}`}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>Xem hồ sơ giải mã</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-stone-500 font-mono">Làng Kép</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
