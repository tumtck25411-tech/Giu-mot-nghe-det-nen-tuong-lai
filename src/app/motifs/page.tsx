'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Grid, Search, ArrowRight } from 'lucide-react';
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
    <div
      className="w-full min-h-screen py-10 lg:py-14 relative overflow-hidden"
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

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        
        {/* Header - Modern Ethnic Boutique Style */}
        <div className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] shadow-xs text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8] text-xs font-medium text-[#C99A45]">
            <span>◇</span>
            <span>Kho Di Sản 20 Hoa Văn Bản Địa</span>
            <span>◇</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#174C38] tracking-tight">
            Ngân hàng hoa văn thổ cẩm Jrai
          </h1>
          <p className="text-[#59524C] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Hệ thống số hóa 20 hoa văn cổ truyền người Jrai tại Gia Lai. Mỗi hoa văn là một ký hiệu văn hóa ước lệ khắc họa thiên nhiên, vũ trụ quan và đời sống tâm linh đại ngàn.
          </p>
        </div>

        {/* SEARCH BAR & THEME FILTER */}
        <div className="bg-[#FFFDF9] p-5 sm:p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A7E72]" />
              <input
                type="text"
                placeholder="Tra cứu theo mã hoa văn (JRAI-001), tên hoa văn (Con gà, Cây nêu...), ý nghĩa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Tất cả chủ đề', count: 20 },
                { id: 'nature', label: 'Thiên nhiên & Muông thú', count: 8 },
                { id: 'life', label: 'Đời sống & Con người', count: 7 },
                { id: 'spiritual', label: 'Tâm linh & Vũ trụ', count: 5 },
              ].map((th) => {
                const isActive = selectedTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th.id)}
                    type="button"
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#174C38] text-[#FFFDF9] shadow-xs'
                        : 'bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#59524C] hover:text-[#174C38] border border-[#E8DFC8]'
                    }`}
                  >
                    <span>{th.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-[#FFFDF9]'
                          : 'bg-[#E8DFC8] text-[#59524C]'
                      }`}
                    >
                      {th.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#59524C] pt-2 border-t border-[#E8DFC8]">
            <span>
              Hiển thị <strong className="text-[#174C38] font-medium">{filteredMotifs.length}</strong> / {motifs.length} hoa văn di sản đã số hóa.
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[#A94335] hover:underline font-medium cursor-pointer"
              >
                Xóa tìm kiếm &times;
              </button>
            )}
          </div>
        </div>

        {/* MOTIFS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                className="bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#E8DFC8] hover:border-[#C99A45] shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF5EC] p-4 flex items-center justify-center border-b border-[#E8DFC8]">
                    <img
                      src={motif.image_url}
                      alt={motif.name}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#174C38] text-[#FFFDF9] font-mono text-[11px] font-medium px-2 py-0.5 rounded-full shadow-xs">
                      {motif.motif_code}
                    </div>
                    {usedProducts.length > 0 && (
                      <div className="absolute bottom-2.5 right-2.5 bg-[#FFFDF9]/95 text-[#174C38] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#E8DFC8] shadow-xs">
                        {usedProducts.length} tác phẩm
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div>
                      <span className="text-[11px] font-medium text-[#C99A45] uppercase tracking-wider block">
                        {motif.theme_name} {motif.name_jrai && `• ${motif.name_jrai}`}
                      </span>
                      <h3 className="font-semibold text-base text-[#174C38] group-hover:text-[#C99A45] transition-colors mt-0.5 line-clamp-2">
                        {motif.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#59524C] leading-relaxed line-clamp-3 font-normal">
                      {motif.meaning || motif.philosophy}
                    </p>

                    <div className="space-y-1 text-[11px] text-[#59524C] pt-2.5 border-t border-[#E8DFC8]">
                      <p>
                        <strong className="text-[#174C38] font-medium">Kỹ thuật:</strong> {motif.technique}
                      </p>
                      {motif.artisan_verification && (
                        <p className="leading-snug">
                          <strong className="text-[#174C38] font-medium">Xác thực:</strong> {motif.artisan_verification}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 px-5 bg-[#FAF5EC]/50 border-t border-[#E8DFC8] flex items-center justify-between">
                  <Link
                    href={`/motif/${motif.id}`}
                    className="text-xs font-medium text-[#174C38] hover:text-[#C99A45] flex items-center gap-1 transition"
                  >
                    <span>Giải mã hoa văn</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C99A45]" />
                  </Link>
                  <span className="text-[11px] text-[#8A7E72] font-mono">Làng Kép</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
