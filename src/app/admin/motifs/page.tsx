'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Plus, Search, Edit3, Trash2, ShieldCheck, Save, X, Grid, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { getMotifs, addMotif, updateMotif, deleteMotif, getArtisans } from '@/lib/data-store';
import { Motif, Artisan } from '@/types';
import { uploadFileToServer } from '@/lib/upload-helper';

export default function AdminMotifsPage() {
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMotif, setEditingMotif] = useState<Motif | null>(null);
  const [message, setMessage] = useState('');

  // Form Fields
  const [motifCode, setMotifCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [meaning, setMeaning] = useState('');
  const [colorsInput, setColorsInput] = useState('Đỏ đất, Đen chì, Vàng nghệ');
  const [origin, setOrigin] = useState('Gia Lai');
  const [location, setLocation] = useState('Ia Mơ Nông, Chư Păh');
  const [artisanId, setArtisanId] = useState('');
  const [informantName, setInformantName] = useState('Nghệ nhân địa phương');
  const [verificationSource, setVerificationSource] = useState('Khảo sát thực tế & Nghệ nhân làng dệt');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80');
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setMotifs(getMotifs());
    setArtisans(getArtisans());
  };

  const handleOpenAdd = () => {
    setEditingMotif(null);
    setMotifCode(`JRAI-00${motifs.length + 1}`);
    setName('');
    setDescription('');
    setMeaning('');
    setColorsInput('Đỏ đất, Đen chì, Vàng nghệ');
    setOrigin('Chư Păh, Gia Lai');
    setLocation('Ia Mơ Nông');
    setArtisanId(artisans.length > 0 ? artisans[0].id : '');
    setInformantName('Nghệ nhân R\'mah H\'Bling');
    setVerificationSource('Khảo sát thực tế & Ban quản lý văn hóa');
    setVerificationNotes('Đã xác minh qua thực hành dệt');
    setImageUrl('https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80');
    setStatus('published');
    setShowModal(true);
  };

  const handleOpenEdit = (m: Motif) => {
    setEditingMotif(m);
    setMotifCode(m.motif_code);
    setName(m.name);
    setDescription(m.description || m.meaning || '');
    setMeaning(m.meaning);
    setColorsInput(m.colors ? m.colors.join(', ') : '');
    setOrigin(m.origin || '');
    setLocation(m.location || '');
    setArtisanId(m.artisan_id || '');
    setInformantName(m.informant_name || '');
    setVerificationSource(m.verification_source);
    setVerificationNotes(m.verification_notes || '');
    setImageUrl(m.image_url);
    setStatus(m.status);
    setShowModal(true);
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFileToServer(file);
      setImageUrl(url);
    }
  };

  const handleDelete = (id: string, motifName: string) => {
    if (confirm(`Bạn có chắc muốn xóa mã hoa văn "${motifName}"?`)) {
      deleteMotif(id);
      refreshData();
      setMessage(`Đã xóa hoa văn "${motifName}" thành công.`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motifCode || !name || !meaning) {
      alert('Vui lòng nhập đầy đủ Mã hoa văn, Tên hoa văn và Ý nghĩa văn hóa!');
      return;
    }

    const colorsArr = colorsInput.split(',').map((c) => c.trim()).filter(Boolean);

    if (editingMotif) {
      updateMotif(editingMotif.id, {
        motif_code: motifCode,
        name,
        description,
        meaning,
        colors: colorsArr,
        origin,
        location,
        artisan_id: artisanId,
        informant_name: informantName,
        verification_source: verificationSource,
        verification_notes: verificationNotes,
        image_url: imageUrl,
        status,
      });
      setMessage(`Đã cập nhật hoa văn ${motifCode} thành công.`);
    } else {
      addMotif({
        motif_code: motifCode,
        name,
        description,
        meaning,
        colors: colorsArr,
        origin,
        location,
        artisan_id: artisanId,
        informant_name: informantName,
        verification_source: verificationSource,
        verification_date: new Date().toISOString().split('T')[0],
        verification_notes: verificationNotes,
        image_url: imageUrl,
        status,
      });
      setMessage(`Đã thêm mới hoa văn ${motifCode} thành công.`);
    }

    setShowModal(false);
    refreshData();
    setTimeout(() => setMessage(''), 3000);
  };

  const filteredMotifs = motifs.filter(
    (m) =>
      m.motif_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.origin || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Quản Lý Ngân Hàng Hoa Văn Jrai Central"
        subtitle="Chọn ảnh từ máy tính để thêm hoa văn JRAI-XXX mới vào hệ thống"
      />

      <div className="px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã JRAI-XXX hoặc tên hoa văn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ THÊM HOA VĂN MỚI</span>
          </button>
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold">
            {message}
          </div>
        )}

        {/* MOTIFS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-4 px-4">Ảnh</th>
                  <th className="py-4 px-4">Mã Hoa Văn</th>
                  <th className="py-4 px-4">Tên Hoa Văn</th>
                  <th className="py-4 px-4">Ý Nghĩa Văn Hóa</th>
                  <th className="py-4 px-4">Nguồn Xác Minh</th>
                  <th className="py-4 px-4">Trạng Thái</th>
                  <th className="py-4 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMotifs.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <img
                        src={m.image_url}
                        alt={m.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">{m.motif_code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">{m.meaning}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">{m.verification_source}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status === 'published' ? 'Đã xuất bản' : 'Lưu nháp'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-2 text-amber-800 hover:bg-amber-50 rounded-lg font-bold"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.name)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Xóa"
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

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-serif font-bold text-xl text-slate-900">
                {editingMotif ? `Sửa Hoa Văn: ${editingMotif.motif_code}` : 'Thêm Mã Hoa Văn Jrai Mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mã Hoa Văn *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: JRAI-006"
                    value={motifCode}
                    onChange={(e) => setMotifCode(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-amber-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tên Hoa Văn *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Hoa văn Răng cưa An-ta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ý Nghĩa Văn Hóa *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nhập ý nghĩa văn hóa..."
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Direct Computer File Picker for Motif Image */}
              <div className="space-y-2 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <label className="font-bold text-amber-900 block">📸 Chọn Ảnh Hoa Văn Trực Tiếp Từ Máy Tính</label>
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-amber-700/50 hover:border-amber-700 rounded-xl cursor-pointer bg-white transition text-center shadow-xs">
                  <Upload className="w-5 h-5 text-amber-800" />
                  <span className="font-bold text-xs text-amber-900">Bấm Để Chọn File Ảnh Từ Thư Mục Máy Tính</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                </label>

                {imageUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-300 mt-2">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Màu sắc (Phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="Đỏ đất, Đen chì, Vàng nghệ"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nguồn gốc / Địa phương lưu giữ</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nguồn Xác Minh Minh Bạch *</label>
                <input
                  type="text"
                  required
                  value={verificationSource}
                  onChange={(e) => setVerificationSource(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-amber-900 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>[LƯU HOA VĂN]</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
