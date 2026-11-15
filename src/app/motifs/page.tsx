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
      <div className="bg-[#F2ECE1] p-8 sm:p-12 rounded-xl border border-[#E5DACB] border-b-2 border-b-[#EA8E23] relative overflow-hidden shadow-sm text-center">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="section-tag gold">
            <Grid className="w-3.5 h-3.5 inline mr-1 text-[#EA8E23]" />
            <span>Kho Tri Thức Di Sản Bản Địa Jrai</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] leading-tight">
            Ngân Hàng Số Hoa Văn Thổ Cẩm Jrai (20 Hoa Văn)
          </h1>
          <p className="text-[#5D554D] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Hệ thống số hóa 20 hoa văn cổ truyền người Jrai tại Gia Lai. Mỗi hoa văn là một ký hiệu văn hóa ước lệ khắc họa thiên nhiên, vũ trụ quan và đời sống tâm linh đại ngàn, được giải mã và lưu trữ cẩn trọng.
          </p>
        </div>
      </div>

      {/* SEARCH BAR & THEME FILTER */}
      <div className="bg-white p-6 rounded-xl border border-[#E5DACB] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A7E72]" />
            <input
              type="text"
              placeholder="Tra cứu theo mã hoa văn (JRAI-001), tên hoa văn (Con gà, Hình học cổ), ý nghĩa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FBF8F3] border border-[#E5DACB] rounded-xl text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
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
                    ? 'bg-[#C43B3D] text-white shadow-sm'
                    : 'bg-[#FBF8F3] text-[#5D554D] hover:text-[#1F1D1B] border border-[#E5DACB]'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#5D554D] pt-1 border-t border-[#E5DACB]/60">
          <span>
            Hiển thị <strong>{filteredMotifs.length}</strong> / {motifs.length} hoa văn số hóa.
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#C43B3D] hover:underline font-bold"
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
              className="bg-white rounded-xl overflow-hidden border border-[#E5DACB] hover:border-[#C43B3D] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-[#FBF8F3] p-4 flex items-center justify-center border-b border-[#E5DACB]">
                  <img
                    src={motif.image_url}
                    alt={motif.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#C43B3D] text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {motif.motif_code}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#1F1D1B] text-xs font-bold px-2.5 py-1 rounded-md border border-[#E5DACB] shadow-sm">
                    {usedProducts.length} Sản phẩm ứng dụng
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-[#EA8E23] uppercase tracking-wider block">
                      {motif.theme_name} {motif.name_jrai && `• ${motif.name_jrai}`}
                    </span>
                    <h3 className="font-serif font-bold text-[#1F1D1B] text-base group-hover:text-[#C43B3D] transition-colors mt-0.5 line-clamp-1">
                      {motif.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#5D554D] leading-relaxed line-clamp-3">
                    {motif.meaning || motif.philosophy}
                  </p>

                  <div className="space-y-1 text-xs text-[#8A7E72] pt-2 border-t border-[#E5DACB]">
                    <p>
                      <strong className="text-[#1F1D1B]">Kỹ thuật:</strong> {motif.technique}
                    </p>
                    {motif.artisan_verification && (
                      <p>
                        <strong className="text-[#1F1D1B]">Xác thực:</strong> {motif.artisan_verification}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FBF8F3] border-t border-[#E5DACB] flex items-center justify-between">
                <Link
                  href={`/motif/${motif.id}`}
                  className="text-xs font-bold text-[#C43B3D] hover:text-[#8A2325] flex items-center gap-1"
                >
                  <span>Xem hồ sơ giải mã</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-xs text-[#8A7E72] font-mono">Làng Kép</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
