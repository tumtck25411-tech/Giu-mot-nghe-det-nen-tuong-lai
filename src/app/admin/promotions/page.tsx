'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Percent,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Tag,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import {
  getAdminSession,
  getPromotions,
  getReviews,
  syncWithServer,
  pushStoreToServer,
} from '@/lib/data-store';
import { Promotion, Review } from '@/types';

export default function AdminPromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // New Promo form state
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState<number | ''>(10);
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newMinOrder, setNewMinOrder] = useState<number>(300000);
  const [newExpiry, setNewExpiry] = useState('2026-12-31');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const admin = getAdminSession();
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    const loadData = () => {
      setPromotions(getPromotions());
      setReviews(getReviews());
    };

    loadData();
    syncWithServer().then(() => loadData());
  }, [router]);

  const handleTogglePromo = (code: string) => {
    const updated = promotions.map((p) => (p.code === code ? { ...p, isActive: !p.isActive } : p));
    setPromotions(updated);
    pushStoreToServer();
  };

  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newPromo: Promotion = {
      code: newCode.trim().toUpperCase(),
      discountPercent: newPercent ? Number(newPercent) : undefined,
      discountAmount: newAmount ? Number(newAmount) : undefined,
      minOrderValue: Number(newMinOrder) || 0,
      expiryDate: newExpiry,
      description: newDesc.trim() || `Ưu đãi ${newCode.trim().toUpperCase()}`,
      isActive: true,
    };

    const updated = [newPromo, ...promotions];
    setPromotions(updated);
    setShowAddPromo(false);
    setNewCode('');
    setNewDesc('');
    pushStoreToServer();
  };

  const handleToggleReviewApproval = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r));
    setReviews(updated);
    pushStoreToServer();
  };

  return (
    <div className="flex min-h-screen bg-[#0D0B0A] text-stone-200">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Quản Lý Khuyến Mãi & Đánh Giá" />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* SECTION 1: PROMOTIONS */}
          <div className="bg-[#181411] p-6 rounded-xl border border-stone-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-500" />
                  <span>Mã Giảm Giá Khuyến Mãi ({promotions.length})</span>
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Tạo và kích hoạt các mã giảm giá cho khách mua hàng trên website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPromo(!showAddPromo)}
                className="bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddPromo ? 'Đóng form' : 'Tạo mã mới'}</span>
              </button>
            </div>

            {/* Add Promo Form Drawer */}
            {showAddPromo && (
              <form onSubmit={handleAddPromotion} className="p-5 bg-[#231C18] rounded-2xl border border-amber-900/50 space-y-4">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Khởi tạo mã giảm giá mới
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">Mã code</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: TET2027"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full bg-[#120F0D] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-400 block mb-1">Giảm theo % (hoặc để trống)</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={newPercent}
                      onChange={(e) => setNewPercent(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-[#120F0D] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-400 block mb-1">Giảm tiền mặt (₫, nếu không theo %)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-[#120F0D] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">Đơn hàng tối thiểu (₫)</label>
                    <input
                      type="number"
                      value={newMinOrder}
                      onChange={(e) => setNewMinOrder(Number(e.target.value))}
                      className="w-full bg-[#120F0D] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-400 block mb-1">Ngày hết hạn</label>
                    <input
                      type="date"
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      className="w-full bg-[#120F0D] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1">Mô tả chương trình</label>
                  <input
                    type="text"
                    placeholder="Mô tả ưu đãi hiển thị cho khách..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-[#120F0D] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow"
                >
                  Lưu mã giảm giá
                </button>
              </form>
            )}

            {/* Promotions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#120F0D] border-b border-stone-800 text-stone-400 uppercase text-xs tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Mã Code</th>
                    <th className="p-3">Mức Giảm</th>
                    <th className="p-3">Đơn Tối Thiểu</th>
                    <th className="p-3">Hạn Dùng</th>
                    <th className="p-3">Mô Tả</th>
                    <th className="p-3">Trạng Thái</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {promotions.map((p) => (
                    <tr key={p.code} className="hover:bg-[#201A16] transition">
                      <td className="p-3 font-mono font-bold text-amber-400">{p.code}</td>
                      <td className="p-3 font-bold text-white">
                        {p.discountPercent ? `${p.discountPercent}%` : `${(p.discountAmount || 0).toLocaleString('vi-VN')}₫`}
                      </td>
                      <td className="p-3">{p.minOrderValue.toLocaleString('vi-VN')}₫</td>
                      <td className="p-3 font-mono">{p.expiryDate}</td>
                      <td className="p-3 text-stone-400">{p.description}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            p.isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : 'bg-stone-900 text-stone-500 border border-stone-800'
                          }`}
                        >
                          {p.isActive ? 'Đang hoạt động' : 'Tạm tắt'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleTogglePromo(p.code)}
                          className="text-xs text-amber-400 hover:underline"
                        >
                          {p.isActive ? 'Tắt mã' : 'Bật mã'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: REVIEWS */}
          <div className="bg-[#181411] p-6 rounded-xl border border-stone-800 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-3">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Kiểm Duyệt Đánh Giá Khách Hàng ({reviews.length})</span>
            </h2>

            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-[#231C18] rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{r.customerName}</span>
                      <span className="text-xs font-mono text-amber-400">Mã SP: {r.productCode}</span>
                      <div className="flex gap-0.5">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-300 italic">&ldquo;{r.comment}&rdquo;</p>
                    <span className="text-xs text-stone-500">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleReviewApproval(r.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        r.isApproved
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-stone-900 text-stone-400 border-stone-700'
                      }`}
                    >
                      {r.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
